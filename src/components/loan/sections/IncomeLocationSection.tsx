import { useState, useEffect } from 'react';
import { useQuestionnaire } from '../QuestionnaireContext';
import { MapPin, IndianRupee, CreditCard, Banknote, Smartphone } from 'lucide-react';

export const IncomeLocationSection = () => {
  const { state, updateFormData } = useQuestionnaire();
  const { currentStep, formData, errors } = state;

  // Pincode validation and city/state fetch
  const fetchLocationFromPincode = async (pincode: string, isOffice: boolean = false) => {
    if (pincode.length === 6) {
      try {
        const response = await fetch(
          `https://bk-prod-external.bankkaro.com/sp/api/pincode/${pincode}?type=PL`
        );
        if (response.ok) {
          const data = await response.json();
          if (data.city && data.state) {
            if (!isOffice) {
              updateFormData({ 
                city: data.city, 
                state: data.state 
              });
            }
          }
        }
      } catch (error) {
        console.error('Pincode API error:', error);
      }
    }
  };

  const formatCurrency = (value: string) => {
    const num = value.replace(/[^\d]/g, '');
    return num ? parseInt(num).toLocaleString('en-IN') : '';
  };

  const renderQuestion = () => {
    switch (currentStep) {
      case 10:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-poppins font-semibold text-foreground mb-3">
                What's your monthly take-home income?
              </h2>
              <p className="text-muted-foreground text-lg">
                Enter the amount you receive in your bank account
              </p>
            </div>
            
            <div className="max-w-md mx-auto">
              <div className="relative">
                <IndianRupee className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  value={formatCurrency(formData.inhandIncome)}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    updateFormData({ inhandIncome: value });
                  }}
                  placeholder="50,000"
                  className="form-input pl-12 text-xl text-center font-medium"
                />
              </div>
              
              {errors.inhandIncome && (
                <p className="text-destructive text-sm text-center mt-2">
                  {errors.inhandIncome}
                </p>
              )}
              
              <div className="grid grid-cols-3 gap-3 mt-6">
                {['25000', '50000', '100000'].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => updateFormData({ inhandIncome: amount })}
                    className="px-4 py-2 text-sm border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    ₹{parseInt(amount).toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
              
              <p className="text-sm text-muted-foreground text-center mt-4">
                Include salary, bonuses, and other regular income
              </p>
            </div>
          </div>
        );

      case 11:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-poppins font-semibold text-foreground mb-3">
                How do you receive your salary?
              </h2>
              <p className="text-muted-foreground text-lg">
                This affects loan processing time
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
              {[
                { 
                  value: 'bank', 
                  label: 'Bank Transfer', 
                  subtitle: 'Fastest processing',
                  icon: CreditCard
                },
                { 
                  value: 'cash', 
                  label: 'Cash', 
                  subtitle: 'Additional documentation needed',
                  icon: Banknote
                },
                { 
                  value: 'cheque', 
                  label: 'Cheque', 
                  subtitle: 'Standard processing',
                  icon: Banknote
                },
                { 
                  value: 'upi', 
                  label: 'UPI/Digital', 
                  subtitle: 'Quick verification',
                  icon: Smartphone
                }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateFormData({ salary_recieved_in: option.value as any })}
                  className={`
                    radio-option text-center
                    ${formData.salary_recieved_in === option.value ? 'selected' : ''}
                  `}
                >
                  <option.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-muted-foreground mt-1">{option.subtitle}</div>
                </button>
              ))}
            </div>
            
            {errors.salary_recieved_in && (
              <p className="text-destructive text-sm text-center">{errors.salary_recieved_in}</p>
            )}
          </div>
        );

      case 12:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-poppins font-semibold text-foreground mb-3">
                Where do you live?
              </h2>
              <p className="text-muted-foreground text-lg">
                Your residential pincode
              </p>
            </div>
            
            <div className="max-w-md mx-auto space-y-4">
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '').slice(0, 6);
                    updateFormData({ pincode: value });
                    if (value.length === 6) {
                      fetchLocationFromPincode(value);
                    }
                  }}
                  placeholder="Enter 6-digit pincode"
                  className="form-input pl-12 text-center text-lg font-mono"
                  maxLength={6}
                />
              </div>
              
              {errors.pincode && (
                <p className="text-destructive text-sm text-center">{errors.pincode}</p>
              )}
              
              {/* Auto-populated city and state */}
              {formData.city && formData.state && (
                <div className="flex items-center justify-center gap-4 p-4 bg-success/10 border border-success/20 rounded-lg">
                  <MapPin className="h-5 w-5 text-success" />
                  <span className="font-medium text-success">
                    {formData.city}, {formData.state}
                  </span>
                </div>
              )}
              
              <p className="text-sm text-muted-foreground text-center">
                We'll automatically detect your city and state
              </p>
            </div>
          </div>
        );

      case 13:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-poppins font-semibold text-foreground mb-3">
                Where is your office located?
              </h2>
              <p className="text-muted-foreground text-lg">
                Your workplace pincode
              </p>
            </div>
            
            <div className="max-w-md mx-auto space-y-4">
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  value={formData.office_pincode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '').slice(0, 6);
                    updateFormData({ office_pincode: value });
                    if (value.length === 6) {
                      fetchLocationFromPincode(value, true);
                    }
                  }}
                  placeholder="Enter 6-digit pincode"
                  className="form-input pl-12 text-center text-lg font-mono"
                  maxLength={6}
                />
              </div>
              
              {errors.office_pincode && (
                <p className="text-destructive text-sm text-center">{errors.office_pincode}</p>
              )}
              
              {/* Quick option to use same as residential */}
              <button
                onClick={() => updateFormData({ office_pincode: formData.pincode })}
                className="w-full py-3 text-sm text-primary border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors"
              >
                Same as residential address
              </button>
              
              <p className="text-sm text-muted-foreground text-center">
                If you work from home, use your residential pincode
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return renderQuestion();
};