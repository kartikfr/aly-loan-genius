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
    <div className="flex items-center justify-between pt-8 px-4 md:px-0">
      <button
        onClick={prevStep}
        disabled={isFirstStep}
        className={`
          btn-ghost flex items-center gap-2 min-w-[120px]
          ${isFirstStep ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Go Back</span>
        <span className="sm:hidden">Back</span>
      </button>

      {/* Progress indicator for desktop */}
      <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
        <span>Section {state.currentStep} of {getTotalSteps()}</span>
      </div>

      <button
        onClick={handleNext}
        disabled={state.isLoading}
        className="btn-trust flex items-center gap-2 min-w-[140px] justify-center"
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
  );
};