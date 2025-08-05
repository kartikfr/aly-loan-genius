import { useQuestionnaire } from '../QuestionnaireContext';
import { MapPin, IndianRupee, CreditCard, Banknote, Smartphone } from 'lucide-react';

export const IncomeLocationSection = () => {
  const { state, updateFormData } = useQuestionnaire();
  const { formData, errors } = state;

  // Pincode validation and city/state fetch
  const fetchLocationFromPincode = async (pincode: string) => {
    if (pincode.length === 6) {
      try {
        const response = await fetch(
          `https://bk-prod-external.bankkaro.com/sp/api/pincode/${pincode}?type=PL`
        );
        if (response.ok) {
          const data = await response.json();
          if (data.city && data.state) {
            updateFormData({ 
              city: data.city, 
              state: data.state 
            });
          }
        }
      } catch (error) {
        console.error('Pincode API error:', error);
      }
    }
  };

  const formatCurrency = (value: string) => {
    const num = value.replace(/[^\d]/g, '');
    return num ? parseInt(num).toLocaleString('en-IN') : '';
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-poppins font-semibold text-foreground mb-3">
          Income & Location Details
        </h2>
        <p className="text-muted-foreground text-lg">
          Just a few more details to complete your profile
        </p>
      </div>

      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Monthly Income */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            What's your monthly take-home income? *
          </label>
          <div className="relative">
            <IndianRupee className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              value={formatCurrency(formData.inhandIncome)}
              onChange={(e) => {
                const value = e.target.value.replace(/[^\d]/g, '');
                updateFormData({ inhandIncome: value });
              }}
              placeholder="50,000"
              className="form-input pl-12"
            />
          </div>
          {errors.inhandIncome && (
            <p className="text-destructive text-sm mt-1">{errors.inhandIncome}</p>
          )}
          <div className="grid grid-cols-3 gap-3 mt-3">
            {['25000', '50000', '100000'].map((amount) => (
              <button
                key={amount}
                onClick={() => updateFormData({ inhandIncome: amount })}
                className="px-4 py-2 text-sm border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
              >
                ₹{parseInt(amount).toLocaleString('en-IN')}
              </button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Include salary, bonuses, and other regular income
          </p>
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            How do you receive your salary? *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { 
                value: 'bank', 
                label: 'Bank Transfer', 
                subtitle: 'Fastest processing',
                icon: CreditCard
              },
              { 
                value: 'cash', 
                label: 'Cash', 
                subtitle: 'Additional docs needed',
                icon: Banknote
              },
              { 
                value: 'cheque', 
                label: 'Cheque', 
                subtitle: 'Standard processing',
                icon: Banknote
              },
              { 
                value: 'upi', 
                label: 'UPI/Digital', 
                subtitle: 'Quick verification',
                icon: Smartphone
              }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => updateFormData({ salary_recieved_in: option.value as any })}
                className={`
                  radio-option text-center p-3
                  ${formData.salary_recieved_in === option.value ? 'selected' : ''}
                `}
              >
                <option.icon className="h-5 w-5 text-primary mx-auto mb-2" />
                <div className="font-medium text-sm">{option.label}</div>
                <div className="text-xs text-muted-foreground mt-1">{option.subtitle}</div>
              </button>
            ))}
          </div>
          {errors.salary_recieved_in && (
            <p className="text-destructive text-sm mt-1">{errors.salary_recieved_in}</p>
          )}
        </div>

        {/* Residential Pincode */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Residential Pincode *
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              value={formData.pincode}
              onChange={(e) => {
                const value = e.target.value.replace(/[^\d]/g, '').slice(0, 6);
                updateFormData({ pincode: value });
                if (value.length === 6) {
                  fetchLocationFromPincode(value);
                }
              }}
              placeholder="Enter 6-digit pincode"
              className="form-input pl-12"
              maxLength={6}
            />
          </div>
          {errors.pincode && (
            <p className="text-destructive text-sm mt-1">{errors.pincode}</p>
          )}
          {/* Auto-populated city and state */}
          {formData.city && formData.state && (
            <div className="flex items-center gap-3 mt-2 p-3 bg-success/10 border border-success/20 rounded-lg">
              <MapPin className="h-4 w-4 text-success" />
              <span className="text-sm font-medium text-success">
                {formData.city}, {formData.state}
              </span>
            </div>
          )}
        </div>

        {/* Office Pincode */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Office Pincode *
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              value={formData.office_pincode}
              onChange={(e) => {
                const value = e.target.value.replace(/[^\d]/g, '').slice(0, 6);
                updateFormData({ office_pincode: value });
              }}
              placeholder="Enter 6-digit pincode"
              className="form-input pl-12"
              maxLength={6}
            />
          </div>
          {errors.office_pincode && (
            <p className="text-destructive text-sm mt-1">{errors.office_pincode}</p>
          )}
          <button
            onClick={() => updateFormData({ office_pincode: formData.pincode })}
            className="w-full mt-2 py-2 text-sm text-primary border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors"
            disabled={!formData.pincode}
          >
            Same as residential address
          </button>
          <p className="text-sm text-muted-foreground mt-1">
            If you work from home, use your residential pincode
          </p>
        </div>
      </div>
    </div>
  );
};