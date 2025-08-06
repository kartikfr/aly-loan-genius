import { useQuestionnaire } from '../QuestionnaireContext';
import { CompanySearch } from '@/components/common/CompanySearch';
import { Check, Building } from 'lucide-react';

export const EmploymentSection = () => {
  const context = useQuestionnaire();
const { state, updateFormData } = context;
  const { formData, errors } = state;

  return (
    <div className="space-y-8">
      <div className="text-center mb-8 animate-fade-in">
        <h2 className="text-3xl font-poppins font-semibold text-foreground mb-3">
          Your Employment Details
        </h2>
        <p className="text-muted-foreground text-lg">
          Help us understand your work situation to find the best rates
        </p>
        <div className="flex items-center justify-center gap-2 mt-3 text-sm text-success animate-pulse">
          <Check className="h-4 w-4" />
          <span>Stable employment = Lower interest rates</span>
        </div>
      </div>

      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Employment Status */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            What's your employment status? *
          </label>
          <div className="space-y-3">
            {[
              { 
                value: 'salaried', 
                label: 'Salaried Employee', 
                subtitle: 'Most loan options available',
                icon: Building
              },
              { 
                value: 'self_employed', 
                label: 'Self-Employed/Business Owner', 
                subtitle: 'Flexible documentation required'
              },
              { 
                value: 'student', 
                label: 'Student', 
                subtitle: 'Education loan options available'
              }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => updateFormData({ employmentStatus: option.value as any })}
                className={`
                  radio-option text-left w-full flex items-center gap-4
                  ${formData.employmentStatus === option.value ? 'selected' : ''}
                `}
              >
                {option.icon && <option.icon className="h-6 w-6 text-primary" />}
                <div>
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-muted-foreground mt-1">{option.subtitle}</div>
                </div>
              </button>
            ))}
          </div>
          {errors.employmentStatus && (
            <p className="text-destructive text-sm mt-1">{errors.employmentStatus}</p>
          )}
        </div>

        {/* Company Name */}
        <CompanySearch
          value={formData.company_name}
          onChange={(companyName) => updateFormData({ company_name: companyName })}
          error={errors.company_name}
        />
      </div>
    </div>
  );
};