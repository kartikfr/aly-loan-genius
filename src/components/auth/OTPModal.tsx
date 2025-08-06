import React, { useState, useRef, useEffect } from 'react';
import { X, Phone, Shield, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { apiService } from '@/lib/api';
import confetti from 'canvas-confetti';

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userData: any) => void;
}

export const OTPModal: React.FC<OTPModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState<'phone' | 'otp' | 'success' | 'error'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [maxOtpAttempts] = useState(3);
  
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isResendDisabled && resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (resendCountdown === 0) {
      setIsResendDisabled(false);
    }
  }, [resendCountdown, isResendDisabled]);

  const handlePhoneSubmit = async () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await apiService.sendOTP(phoneNumber);
      setAuthToken(response.data.token);
      setStep('otp');
      setIsResendDisabled(true);
      setResendCountdown(30);
      setOtpAttempts(0); // Reset attempts when sending new OTP
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send OTP');
      setStep('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async () => {
    if (!otp || otp.length !== 6) {
      setErrorMessage('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await apiService.verifyOTP(phoneNumber, otp, authToken);
      
      // Trigger confetti animation
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setStep('success');
      
      // Auto close after 2 seconds and call onSuccess
      setTimeout(() => {
        onSuccess({
          ...response.data.user_data.data.user_data,
          token: response.data.token
        });
        onClose();
        resetModal();
      }, 2000);
    } catch (error) {
      const newAttempts = otpAttempts + 1;
      setOtpAttempts(newAttempts);
      
      if (newAttempts >= maxOtpAttempts) {
        // Max attempts reached, go back to phone number step
        setErrorMessage(`Maximum attempts (${maxOtpAttempts}) reached. Please try with a different phone number.`);
        setStep('phone');
        setPhoneNumber(''); // Clear phone number to force re-entry
        setOtpAttempts(0);
      } else {
        // Still have attempts left
        const remainingAttempts = maxOtpAttempts - newAttempts;
        setErrorMessage(`Invalid OTP. ${remainingAttempts} attempt${remainingAttempts > 1 ? 's' : ''} remaining.`);
        setOtp(''); // Clear OTP for retry
        // Stay on OTP step for retry
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await apiService.sendOTP(phoneNumber);
      setAuthToken(response.data.token);
      setOtp('');
      setOtpAttempts(0); // Reset attempts when resending
      setIsResendDisabled(true);
      setResendCountdown(30);
      setStep('otp');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to resend OTP');
      setStep('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToPhone = () => {
    setStep('phone');
    setOtp('');
    setOtpAttempts(0);
    setErrorMessage('');
    setIsLoading(false);
    setIsResendDisabled(false);
    setResendCountdown(0);
  };

  const resetModal = () => {
    setStep('phone');
    setPhoneNumber('');
    setOtp('');
    setAuthToken('');
    setErrorMessage('');
    setIsLoading(false);
    setIsResendDisabled(false);
    setResendCountdown(0);
    setOtpAttempts(0);
  };

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newOtp = otp.split('');
    newOtp[index] = value;
    const newOtpString = newOtp.join('');
    setOtp(newOtpString);

    // Auto-focus next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
    
    // Handle Enter key for OTP submission
    if (e.key === 'Enter' && otp.length === 6) {
      handleOTPSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Phone Number Step */}
        {step === 'phone' && (
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mx-auto">
              <Phone className="h-8 w-8 text-blue-600" />
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Enter Your Phone Number
              </h2>
              <p className="text-gray-600 mb-4">
                We'll make it quick! Enter your mobile number to get started.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && phoneNumber.length === 10) {
                      handlePhoneSubmit();
                    }
                  }}
                  placeholder="Enter 10-digit mobile number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={10}
                />
              </div>

              {errorMessage && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  {errorMessage}
                </div>
              )}

              <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                <Shield className="h-4 w-4" />
                <span>Bank-grade security • No impact on credit score</span>
              </div>

              <button
                onClick={handlePhoneSubmit}
                disabled={isLoading || phoneNumber.length !== 10}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </div>
          </div>
        )}

        {/* OTP Step */}
        {step === 'otp' && (
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center w-16 h-16 bg-green-50 rounded-full mx-auto">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Enter OTP
              </h2>
              <p className="text-gray-600 mb-4">
                We've sent a 6-digit code to <span className="font-medium">{phoneNumber}</span>
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 text-left">
                  Enter 6-digit OTP
                </label>
                <div className="flex gap-2 justify-center">
                  {Array.from({ length: 6 }, (_, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpInputRefs.current[index] = el)}
                      type="text"
                      value={otp[index] || ''}
                      onChange={(e) => handleOTPChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-medium"
                      maxLength={1}
                    />
                  ))}
                </div>
              </div>

              {errorMessage && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  {errorMessage}
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={handleOTPSubmit}
                  disabled={isLoading || otp.length !== 6}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={handleBackToPhone}
                    className="flex-1 flex items-center justify-center gap-2 text-gray-600 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Edit Number
                  </button>

                  <button
                    onClick={handleResendOTP}
                    disabled={isResendDisabled || isLoading}
                    className="flex-1 text-blue-600 py-2 px-4 rounded-lg font-medium hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isResendDisabled 
                      ? `${resendCountdown}s` 
                      : 'Resend'
                    }
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Step */}
        {step === 'success' && (
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center w-16 h-16 bg-green-50 rounded-full mx-auto">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Congratulations!
              </h2>
              <p className="text-gray-600">
                You are now verified and ready to proceed.
              </p>
            </div>
          </div>
        )}

        {/* Error Step */}
        {step === 'error' && (
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mx-auto">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Oops! Something went wrong
              </h2>
              <p className="text-red-600 mb-4">
                {errorMessage}
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setStep('phone')}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              
              <button
                onClick={onClose}
                className="w-full text-gray-600 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 