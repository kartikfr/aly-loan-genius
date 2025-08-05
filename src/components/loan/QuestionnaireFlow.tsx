import { useQuestionnaire } from './QuestionnaireContext';
import { PersonalInfoSection } from './sections/PersonalInfoSection';
import { LoanRequirementsSection } from './sections/LoanRequirementsSection';
import { EmploymentSection } from './sections/EmploymentSection';
import { IncomeLocationSection } from './sections/IncomeLocationSection';
import { NavigationButtons } from './NavigationButtons';

export const QuestionnaireFlow = () => {
  const { state } = useQuestionnaire();

  const sections = [
    { id: 1, component: <PersonalInfoSection />, title: 'Personal Info' },
    { id: 2, component: <LoanRequirementsSection />, title: 'Loan Requirements' },
    { id: 3, component: <EmploymentSection />, title: 'Employment' },
    { id: 4, component: <IncomeLocationSection />, title: 'Income & Location' }
  ];

  return (
    <div className="w-full">
      {/* Horizontal section layout */}
      <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className={`
              flex-none w-full min-h-[600px] snap-center
              ${index !== sections.length - 1 ? 'mr-8' : ''}
              ${state.currentStep === section.id ? 'block' : 'hidden'}
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