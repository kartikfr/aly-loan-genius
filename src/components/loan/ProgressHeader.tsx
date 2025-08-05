import { useQuestionnaire } from './QuestionnaireContext';
import { CheckCircle, Shield, Clock } from 'lucide-react';

export const ProgressHeader = () => {
  const { state, getProgressPercentage } = useQuestionnaire();
  
  const steps = [
    { id: 1, name: 'Basic Details', range: [1, 4] },
    { id: 2, name: 'Loan Requirements', range: [5, 7] },
    { id: 3, name: 'Employment Info', range: [8, 9] },
    { id: 4, name: 'Income & Location', range: [10, 13] },
  ];

  const getCurrentStepSection = () => {
    const currentStep = state.currentStep;
    return steps.find(step => 
      currentStep >= step.range[0] && currentStep <= step.range[1]
    )?.id || 1;
  };

  const progressPercentage = getProgressPercentage();

  return (
    <div className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Trust indicators */}
        <div className="flex items-center justify-center gap-6 mb-6">
          <div className="flex items-center gap-2 text-sm text-success">
            <Shield className="h-4 w-4" />
            <span>256-bit SSL Encrypted</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-success">
            <CheckCircle className="h-4 w-4" />
            <span>No Credit Score Impact</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-success">
            <Clock className="h-4 w-4" />
            <span>2-3 Minutes Only</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Question {state.currentStep} of 13</span>
            <span>{progressPercentage}% Complete</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isActive = getCurrentStepSection() === step.id;
            const isCompleted = getCurrentStepSection() > step.id;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                  ${isCompleted 
                    ? 'bg-success text-success-foreground' 
                    : isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }
                `}>
                  {isCompleted ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    step.id
                  )}
                </div>
                <span className={`ml-3 text-sm font-medium ${
                  isActive ? 'text-primary' : isCompleted ? 'text-success' : 'text-muted-foreground'
                }`}>
                  {step.name}
                </span>
                {index < steps.length - 1 && (
                  <div className={`
                    hidden sm:block w-12 h-0.5 mx-4
                    ${isCompleted ? 'bg-success' : 'bg-muted'}
                  `} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};