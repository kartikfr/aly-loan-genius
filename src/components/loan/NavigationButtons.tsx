import { useQuestionnaire } from './QuestionnaireContext';
import { leadService } from '@/lib/leadService';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronLeft, ChevronRight, Loader2, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NavigationButtons = () => {
  const context = useQuestionnaire();
  const { state, nextStep, prevStep, validateCurrentStep, getTotalSteps, setLoading } = context;
  const { authToken } = useAuth();
  const navigate = useNavigate();
  
  const isFirstStep = state.currentStep === 1;
  const isLastStep = state.currentStep === getTotalSteps();
  
  const handleNext = async () => {
    if (validateCurrentStep()) {
      if (isLastStep) {
        // Handle form submission
        await handleFormSubmission();
      } else {
        nextStep();
      }
    }
  };

  const handleFormSubmission = async () => {
    if (!authToken) {
      console.error('No auth token available');
      alert('Authentication error. Please try logging in again.');
      return;
    }

    setLoading(true);
    
    try {
      console.log('🚀 Submitting lead with form data:', state.formData);
      
      const result = await leadService.submitLead(state.formData, authToken);
      
      if (result.success) {
        console.log('✅ Lead submitted successfully:', result);
        
        // Store the loan offers in localStorage for the results page
        localStorage.setItem('loanOffers', JSON.stringify(result.loanOffers));
        localStorage.setItem('leadInfo', JSON.stringify({
          leadId: result.leadId,
          exitId: result.exitId,
          vendor: result.vendor
        }));
        
        // Navigate to results page
        navigate('/loan-offers');
      } else {
        console.error('❌ Lead submission failed:', result.error);
        
        // Provide user-friendly error messages
        let userMessage = 'Submission failed. Please try again.';
        
        if (result.error?.includes('502')) {
          userMessage = 'Our servers are temporarily busy. Please try again in a few moments.';
        } else if (result.error?.includes('503')) {
          userMessage = 'Service temporarily unavailable. Please try again later.';
        } else if (result.error?.includes('504')) {
          userMessage = 'Request timeout. Please check your internet connection and try again.';
        } else if (result.error?.includes('network')) {
          userMessage = 'Network error. Please check your internet connection and try again.';
        } else if (result.error) {
          userMessage = `Submission failed: ${result.error}`;
        }
        
        alert(userMessage);
      }
    } catch (error) {
      console.error('❌ Unexpected error during submission:', error);
      
      let userMessage = 'An unexpected error occurred. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('502')) {
          userMessage = 'Our servers are temporarily busy. Please try again in a few moments.';
        } else if (error.message.includes('503')) {
          userMessage = 'Service temporarily unavailable. Please try again later.';
        } else if (error.message.includes('504')) {
          userMessage = 'Request timeout. Please check your internet connection and try again.';
        } else if (error.message.includes('network')) {
          userMessage = 'Network error. Please check your internet connection and try again.';
        } else {
          userMessage = `Error: ${error.message}`;
        }
      }
      
      alert(userMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border py-4 mt-8">
      <div className="flex items-center justify-between px-4 md:px-0 max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="btn-ghost flex items-center gap-2 hover-scale"
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Home</span>
          </button>
          
          <button
            onClick={prevStep}
            disabled={isFirstStep}
            className={`
              btn-ghost flex items-center gap-2 min-w-[120px] hover-scale
              ${isFirstStep ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Go Back</span>
            <span className="sm:hidden">Back</span>
          </button>
        </div>

        {/* Progress indicator for desktop */}
        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground animate-fade-in">
          <span>Section {state.currentStep} of {getTotalSteps()}</span>
          <div className="w-16 h-1 bg-muted rounded-full overflow-hidden ml-2">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${(state.currentStep / getTotalSteps()) * 100}%` }}
            />
          </div>
        </div>

        <button
          onClick={handleNext}
          disabled={state.isLoading}
          className="btn-trust-no-color-anim flex items-center gap-2 min-w-[140px] justify-center hover-scale"
        >
          {state.isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isLastStep ? (
            <>
              <span className="hidden sm:inline">Get My Loan Offers</span>
              <span className="sm:hidden">Get Offers</span>
            </>
          ) : (
            <>
              <span className="hidden sm:inline">Continue</span>
              <span className="sm:hidden">Next</span>
              <ChevronRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};