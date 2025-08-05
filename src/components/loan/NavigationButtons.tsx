import { useQuestionnaire } from './QuestionnaireContext';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

export const NavigationButtons = () => {
  const { state, nextStep, prevStep, validateCurrentStep, getTotalSteps } = useQuestionnaire();
  
  const isFirstStep = state.currentStep === 1;
  const isLastStep = state.currentStep === getTotalSteps();
  
  const handleNext = () => {
    if (validateCurrentStep()) {
      if (isLastStep) {
        // Handle form submission
        console.log('Submitting form:', state.formData);
      } else {
        nextStep();
      }
    }
  };

  return (
    <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border py-4 mt-8">
      <div className="flex items-center justify-between px-4 md:px-0 max-w-5xl mx-auto">
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