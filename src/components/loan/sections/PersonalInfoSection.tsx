import { useQuestionnaire } from '../QuestionnaireContext';

export const PersonalInfoSection = () => {
  const { state, updateFormData } = useQuestionnaire();
  const { currentStep, formData, errors } = state;

  const renderQuestion = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-poppins font-semibold text-foreground mb-3">
                What should we call you?
              </h2>
              <p className="text-muted-foreground text-lg">
                We'll use this for your loan documents
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => updateFormData({ first_name: e.target.value })}
                  placeholder="Enter your first name"
                  className="form-input"
                />
                {errors.first_name && (
                  <p className="text-destructive text-sm mt-1">{errors.first_name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => updateFormData({ last_name: e.target.value })}
                  placeholder="Enter your last name"
                  className="form-input"
                />
                {errors.last_name && (
                  <p className="text-destructive text-sm mt-1">{errors.last_name}</p>
                )}
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground text-center">
              Enter your name exactly as it appears on your PAN card
            </p>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-poppins font-semibold text-foreground mb-3">
                What's your date of birth?
              </h2>
              <p className="text-muted-foreground text-lg">
                This helps us verify your identity securely
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Day</label>
                <select
                  value={formData.dob.split('-')[2] || ''}
                  onChange={(e) => {
                    const day = e.target.value;
                    const [year, month] = formData.dob.split('-');
                    updateFormData({ dob: `${year || ''}-${month || ''}-${day}` });
                  }}
                  className="form-input"
                >
                  <option value="">Day</option>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                    <option key={day} value={day.toString().padStart(2, '0')}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Month</label>
                <select
                  value={formData.dob.split('-')[1] || ''}
                  onChange={(e) => {
                    const month = e.target.value;
                    const [year, , day] = formData.dob.split('-');
                    updateFormData({ dob: `${year || ''}-${month}-${day || ''}` });
                  }}
                  className="form-input"
                >
                  <option value="">Month</option>
                  {[
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                  ].map((month, index) => (
                    <option key={month} value={(index + 1).toString().padStart(2, '0')}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Year</label>
                <select
                  value={formData.dob.split('-')[0] || ''}
                  onChange={(e) => {
                    const year = e.target.value;
                    const [, month, day] = formData.dob.split('-');
                    updateFormData({ dob: `${year}-${month || ''}-${day || ''}` });
                  }}
                  className="form-input"
                >
                  <option value="">Year</option>
                  {Array.from({ length: 67 }, (_, i) => 2006 - i).map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {errors.dob && (
              <p className="text-destructive text-sm text-center">{errors.dob}</p>
            )}
            
            <p className="text-sm text-muted-foreground text-center">
              Must be 18+ years to apply
            </p>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-poppins font-semibold text-foreground mb-3">
                Select your gender
              </h2>
              <p className="text-muted-foreground text-lg">
                Required for KYC compliance
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-lg mx-auto">
              {[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'other', label: 'Other' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateFormData({ gender: option.value as any })}
                  className={`
                    radio-option text-center
                    ${formData.gender === option.value ? 'selected' : ''}
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
            
            {errors.gender && (
              <p className="text-destructive text-sm text-center">{errors.gender}</p>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-poppins font-semibold text-foreground mb-3">
                Enter your PAN card number
              </h2>
              <p className="text-muted-foreground text-lg">
                We use this to check your credit eligibility
              </p>
            </div>
            
            <div className="max-w-md mx-auto">
              <input
                type="text"
                value={formData.pan}
                onChange={(e) => updateFormData({ pan: e.target.value.toUpperCase() })}
                placeholder="ABCDE1234F"
                className="form-input text-center text-lg font-mono"
                maxLength={10}
              />
              {errors.pan && (
                <p className="text-destructive text-sm text-center mt-2">{errors.pan}</p>
              )}
              
              <p className="text-sm text-muted-foreground text-center mt-4">
                Don't have PAN? Apply online in 10 minutes
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return renderQuestion();
};