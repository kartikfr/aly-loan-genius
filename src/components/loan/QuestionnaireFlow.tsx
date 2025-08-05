import { useQuestionnaire } from './QuestionnaireContext';
import { PersonalInfoSection } from './sections/PersonalInfoSection';
import { LoanRequirementsSection } from './sections/LoanRequirementsSection';
import { EmploymentSection } from './sections/EmploymentSection';
import { IncomeLocationSection } from './sections/IncomeLocationSection';
import { NavigationButtons } from './NavigationButtons';

export const QuestionnaireFlow = () => {
  const { state } = useQuestionnaire();

  const renderCurrentQuestion = () => {
    const { currentStep } = state;

    // Personal Information (Steps 1-4)
    if (currentStep >= 1 && currentStep <= 4) {
      return <PersonalInfoSection />;
    }
    
    // Loan Requirements (Steps 5-7)
    if (currentStep >= 5 && currentStep <= 7) {
      return <LoanRequirementsSection />;
    }
    
    // Employment Details (Steps 8-9)
    if (currentStep >= 8 && currentStep <= 9) {
      return <EmploymentSection />;
    }
    
    // Income & Location (Steps 10-13)
    if (currentStep >= 10 && currentStep <= 13) {
      return <IncomeLocationSection />;
    }

    return null;
  };

  return (
    <div className="space-y-8">
      <div className="form-card">
        {renderCurrentQuestion()}
      </div>
      
      <NavigationButtons />
    </div>
  );
};