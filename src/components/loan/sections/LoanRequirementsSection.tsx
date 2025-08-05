import { useQuestionnaire } from '../QuestionnaireContext';

export const LoanRequirementsSection = () => {
  const { state, updateFormData } = useQuestionnaire();
  const { currentStep, formData, errors } = state;

  const formatCurrency = (value: string) => {
    const num = value.replace(/[^\d]/g, '');
    return num ? `₹${parseInt(num).toLocaleString('en-IN')}` : '';
  };

  const renderQuestion = () => {
    switch (currentStep) {
      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-poppins font-semibold text-foreground mb-3">
                How much would you like to borrow?
              </h2>
              <p className="text-muted-foreground text-lg">
                Choose an amount that fits your monthly budget
              </p>
            </div>
            
            <div className="max-w-md mx-auto">
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl font-medium text-muted-foreground">
                  ₹
                </span>
                <input
                  type="text"
                  value={formData.loan_amount_required}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    updateFormData({ loan_amount_required: value });
                  }}
                  placeholder="2,50,000"
                  className="form-input pl-10 text-center text-xl font-medium"
                />
              </div>
              
              {errors.loan_amount_required && (
                <p className="text-destructive text-sm text-center mt-2">
                  {errors.loan_amount_required}
                </p>
              )}
              
              <div className="mt-6 space-y-2 text-sm text-muted-foreground text-center">
                <p>Loans available from ₹10,000 to ₹40,00,000</p>
                <p className="text-primary font-medium">Most customers borrow ₹2,50,000</p>
              </div>
              
              <div className="grid grid-cols-3 gap-3 mt-6">
                {['100000', '250000', '500000'].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => updateFormData({ loan_amount_required: amount })}
                    className="px-4 py-2 text-sm border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    ₹{parseInt(amount).toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-poppins font-semibold text-foreground mb-3">
                When do you need the money?
              </h2>
              <p className="text-muted-foreground text-lg">
                This helps us show you the fastest options first
              </p>
            </div>
            
            <div className="space-y-4 max-w-lg mx-auto">
              {[
                { 
                  value: 'instant', 
                  label: 'Today (Instant approval)', 
                  subtitle: 'Get funds within hours' 
                },
                { 
                  value: 'week', 
                  label: 'This week (Quick processing)', 
                  subtitle: 'Best balance of speed and rates' 
                },
                { 
                  value: 'flexible', 
                  label: "I'm flexible (Best rates)", 
                  subtitle: 'Access to lowest interest rates' 
                }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateFormData({ timeline: option.value as any })}
                  className={`
                    radio-option text-left w-full
                    ${formData.timeline === option.value ? 'selected' : ''}
                  `}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-muted-foreground mt-1">{option.subtitle}</div>
                </button>
              ))}
            </div>
            
            {errors.timeline && (
              <p className="text-destructive text-sm text-center">{errors.timeline}</p>
            )}
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-poppins font-semibold text-foreground mb-3">
                Have you used credit before?
              </h2>
              <p className="text-muted-foreground text-lg">
                Credit cards, loans, or EMIs count as credit experience
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
              {[
                { 
                  value: true, 
                  label: 'Yes, I have credit experience',
                  subtitle: 'Credit cards, loans, or EMIs'
                },
                { 
                  value: false, 
                  label: 'No, this is my first loan',
                  subtitle: 'First-time borrower'
                }
              ].map((option) => (
                <button
                  key={option.value.toString()}
                  onClick={() => updateFormData({ already_existing_credit: option.value })}
                  className={`
                    radio-option text-center
                    ${formData.already_existing_credit === option.value ? 'selected' : ''}
                  `}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-muted-foreground mt-1">{option.subtitle}</div>
                </button>
              ))}
            </div>
            
            {errors.already_existing_credit && (
              <p className="text-destructive text-sm text-center">{errors.already_existing_credit}</p>
            )}
            
            <p className="text-sm text-success text-center">
              Don't worry - we have great options for first-time borrowers too!
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return renderQuestion();
};