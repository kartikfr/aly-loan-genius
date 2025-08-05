import { useQuestionnaire } from '../QuestionnaireContext';
import { Clock, Zap, Calendar, CreditCard, X } from 'lucide-react';

export const LoanRequirementsSection = () => {
  const { state, updateFormData } = useQuestionnaire();
  const { formData, errors } = state;

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-poppins font-semibold text-foreground mb-3">
          What are your loan requirements?
        </h2>
        <p className="text-muted-foreground text-lg">
          Help us find the perfect loan options for you
        </p>
      </div>

      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Loan Amount */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            How much would you like to borrow? *
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">
              ₹
            </span>
            <input
              type="number"
              value={formData.loan_amount_required}
              onChange={(e) => updateFormData({ loan_amount_required: e.target.value })}
              placeholder="Enter loan amount"
              min="10000"
              className="form-input pl-8"
            />
          </div>
          {errors.loan_amount_required && (
            <p className="text-destructive text-sm mt-1">{errors.loan_amount_required}</p>
          )}
          <div className="grid grid-cols-3 gap-3 mt-3">
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
          <p className="text-sm text-muted-foreground mt-1">
            Loans available from ₹10,000 to ₹40,00,000
          </p>
        </div>

        {/* Timeline */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            When do you need the money? *
          </label>
          <div className="space-y-3">
            {[
              { 
                value: 'instant', 
                label: 'Today (Instant approval)', 
                subtitle: 'Get money in your account within hours',
                icon: Zap
              },
              { 
                value: 'week', 
                label: 'This week (Quick processing)', 
                subtitle: 'Processing within 2-3 business days',
                icon: Clock
              },
              { 
                value: 'flexible', 
                label: "I'm flexible (Best rates)", 
                subtitle: 'Take time to find the lowest interest rates',
                icon: Calendar
              }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => updateFormData({ timeline: option.value as any })}
                className={`
                  radio-option text-left w-full flex items-center gap-4
                  ${formData.timeline === option.value ? 'selected' : ''}
                `}
              >
                <option.icon className="h-6 w-6 text-primary" />
                <div>
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-muted-foreground mt-1">{option.subtitle}</div>
                </div>
              </button>
            ))}
          </div>
          {errors.timeline && (
            <p className="text-destructive text-sm mt-1">{errors.timeline}</p>
          )}
        </div>

        {/* Credit History */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Have you used credit before? *
          </label>
          <p className="text-sm text-muted-foreground mb-3">
            Credit cards, loans, or EMIs count as credit experience
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { 
                value: true, 
                label: 'Yes, I have credit experience', 
                subtitle: 'Credit cards, loans, or EMIs',
                icon: CreditCard
              },
              { 
                value: false, 
                label: 'No, this is my first loan', 
                subtitle: 'First-time borrower',
                icon: X
              }
            ].map((option) => (
              <button
                key={option.value.toString()}
                onClick={() => updateFormData({ already_existing_credit: option.value })}
                className={`
                  radio-option text-left flex items-start gap-3
                  ${formData.already_existing_credit === option.value ? 'selected' : ''}
                `}
              >
                <option.icon className="h-5 w-5 text-primary mt-1" />
                <div>
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-muted-foreground mt-1">{option.subtitle}</div>
                </div>
              </button>
            ))}
          </div>
          {errors.already_existing_credit && (
            <p className="text-destructive text-sm mt-1">{errors.already_existing_credit}</p>
          )}
          {formData.already_existing_credit === false && (
            <div className="mt-3 p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-sm text-primary">
                Don't worry - we have great options for first-time borrowers too!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};