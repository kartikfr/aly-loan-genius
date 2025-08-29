import { useQuestionnaire } from './QuestionnaireContext';
import { PersonalInfoSection } from './sections/PersonalInfoSection';
import { LoanRequirementsSection } from './sections/LoanRequirementsSection';
import { EmploymentSection } from './sections/EmploymentSection';
import { IncomeLocationSection } from './sections/IncomeLocationSection';
import { NavigationButtons } from './NavigationButtons';

export const QuestionnaireFlow = () => {
  const context = useQuestionnaire();
  const { state } = context;

  const sections = [
    { id: 1, component: <PersonalInfoSection />, title: 'Personal Info' },
    { id: 2, component: <LoanRequirementsSection />, title: 'Loan Requirements' },
    { id: 3, component: <EmploymentSection />, title: 'Employment' },
    { id: 4, component: <IncomeLocationSection />, title: 'Income & Location' }
  ];

  return (
    <div className="w-full">
      {/* Smooth section transitions */}
      <div className="relative overflow-hidden">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className={`
              w-full min-h-[600px] transition-all duration-500 ease-in-out
              ${state.currentStep === section.id 
                ? 'opacity-100 translate-x-0' 
                : state.currentStep > section.id 
                  ? 'opacity-0 -translate-x-full absolute top-0 left-0'
                  : 'opacity-0 translate-x-full absolute top-0 left-0'
              }
            `}
          >
            <div className="form-card h-full">
              {section.component}
            </div>
          </div>
        ))}
      </div>

      {/* Mobile horizontal dots indicator */}
      <div className="flex justify-center items-center gap-2 mt-6 md:hidden">
        {sections.map((section) => (
          <div
            key={section.id}
            className={`
              w-2 h-2 rounded-full transition-all duration-300
              ${state.currentStep === section.id 
                ? 'bg-primary w-6' 
                : 'bg-muted-foreground/30'
              }
            `}
          />
        ))}
      </div>

      {/* Navigation buttons for better UX and conversion */}
      <NavigationButtons />
    </div>
  );
};