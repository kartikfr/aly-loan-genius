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
    <div className="flex items-center justify-between pt-6">
      <button
        onClick={prevStep}
        disabled={isFirstStep}
        className={`
          btn-ghost flex items-center gap-2
          ${isFirstStep ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <ChevronLeft className="h-4 w-4" />
        Go Back
      </button>

      <button
        onClick={handleNext}
        disabled={state.isLoading}
        className="btn-trust flex items-center gap-2"
      >
        {state.isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isLastStep ? (
          'Get My Loan Offers'
        ) : (
          <>
            Continue
            <ChevronRight className="h-4 w-4" />
          </>
        )}
      </button>
    </div>
  );
};