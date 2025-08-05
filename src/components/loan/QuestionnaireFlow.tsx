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

    switch (currentStep) {
      case 1:
        return <PersonalInfoSection />;
      case 2:
        return <LoanRequirementsSection />;
      case 3:
        return <EmploymentSection />;
      case 4:
        return <IncomeLocationSection />;
      default:
        return null;
    }
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