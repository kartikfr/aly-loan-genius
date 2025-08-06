import { useQuestionnaire } from '../QuestionnaireContext';
import { Shield } from 'lucide-react';
import { getEmailValidationError } from '@/lib/validation';

export const PersonalInfoSection = () => {
  const context = useQuestionnaire();
  const { state, updateFormData, dispatch } = context;
  const { formData, errors } = state;

  const validateEmail = (email: string) => {
    const errorMessage = getEmailValidationError(email);
    if (errorMessage) {
      dispatch({ 
        type: 'SET_ERRORS', 
        payload: { ...errors, email: errorMessage } 
      });
    } else {
      // Clear email error if validation passes
      const clearedErrors = { ...errors };
      delete clearedErrors.email;
      dispatch({ 
        type: 'SET_ERRORS', 
        payload: clearedErrors 
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8 animate-fade-in">
        <h2 className="text-3xl font-poppins font-semibold text-foreground mb-3">
          Let's Get You Pre-Approved 
        </h2>
        <p className="text-muted-foreground text-lg">
          Secure & confidential - Start with your basic details
        </p>
        <div className="flex items-center justify-center gap-2 mt-3 text-sm text-success animate-pulse">
          <Shield className="h-4 w-4" />
          <span>Bank-grade security • No impact on credit score</span>
        </div>
      </div>

      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Date of Birth *
          </label>
          <div className="grid grid-cols-3 gap-3">
            <select
              value={formData.dob ? formData.dob.split('-')[2] : ''}
              onChange={(e) => {
                const day = e.target.value;
                const [year, month] = formData.dob ? formData.dob.split('-') : ['', ''];
                if (day && month && year) {
                  updateFormData({ dob: `${year}-${month}-${day}` });
                } else if (day) {
                  updateFormData({ dob: `--${day}` });
                }
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
            
            <select
              value={formData.dob ? formData.dob.split('-')[1] : ''}
              onChange={(e) => {
                const month = e.target.value;
                const [year, , day] = formData.dob ? formData.dob.split('-') : ['', '', ''];
                if (day && month && year) {
                  updateFormData({ dob: `${year}-${month}-${day}` });
                } else if (month) {
                  const currentDay = day || '';
                  updateFormData({ dob: `-${month}-${currentDay}` });
                }
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
            
            <select
              value={formData.dob ? formData.dob.split('-')[0] : ''}
              onChange={(e) => {
                const year = e.target.value;
                const [, month, day] = formData.dob ? formData.dob.split('-') : ['', '', ''];
                if (day && month && year) {
                  updateFormData({ dob: `${year}-${month}-${day}` });
                } else if (year) {
                  const currentMonth = month || '';
                  const currentDay = day || '';
                  updateFormData({ dob: `${year}-${currentMonth}-${currentDay}` });
                }
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
          {errors.dob && (
            <p className="text-destructive text-sm mt-1">{errors.dob}</p>
          )}
          <p className="text-sm text-muted-foreground mt-1">
            Must be 18+ years old to apply
          </p>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Gender *
          </label>
          <div className="grid grid-cols-3 gap-3">
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
            <p className="text-destructive text-sm mt-1">{errors.gender}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Email Address *
          </label>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => {
                updateFormData({ email: e.target.value });
                // Real-time validation for better UX
                if (e.target.value.length > 0) {
                  validateEmail(e.target.value);
                }
              }}
              onBlur={(e) => validateEmail(e.target.value)}
              placeholder="your.email@example.com"
              className={`form-input pr-10 ${
                formData.email && !errors.email && getEmailValidationError(formData.email) === '' 
                  ? 'border-green-500 focus:border-green-500 focus:ring-green-500' 
                  : errors.email 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : ''
              }`}
            />
            {formData.email && !errors.email && getEmailValidationError(formData.email) === '' && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          {errors.email && (
            <p className="text-destructive text-sm mt-1">{errors.email}</p>
          )}
          <p className="text-sm text-muted-foreground mt-1">
            We'll use this to send you loan updates and offers
          </p>
        </div>

        {/* PAN Card */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            PAN Card Number *
          </label>
          <input
            type="text"
            value={formData.pan}
            onChange={(e) => updateFormData({ pan: e.target.value.toUpperCase() })}
            placeholder="ABCDE1234F"
            maxLength={10}
            className="form-input"
          />
          {errors.pan && (
            <p className="text-destructive text-sm mt-1">{errors.pan}</p>
          )}
          <p className="text-sm text-muted-foreground mt-1">
            Enter your PAN card number exactly as it appears on your card
          </p>
        </div>
      </div>
    </div>
  );
};