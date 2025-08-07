import { useQuestionnaire } from '../QuestionnaireContext';
import { PincodeSearch } from '@/components/common/PincodeSearch';
import { IndianRupee, CreditCard, Banknote, Smartphone, Check } from 'lucide-react';

export const IncomeLocationSection = () => {
  const context = useQuestionnaire();
const { state, updateFormData } = context;
  const { formData, errors } = state;

  const handleResidentialPincodeChange = (pincode: string, city: string, state: string) => {
    updateFormData({ 
      pincode, 
      city, 
      state 
    });
  };

  const handleOfficePincodeChange = (pincode: string, city: string, state: string) => {
          updateFormData({ 
      office_pincode: pincode, 
                    office_city: city, 
                    office_state: state 
                  });
  };

  const handleSameAsResidential = () => {
    updateFormData({
      office_pincode: formData.pincode,
      office_city: formData.city,
      office_state: formData.state
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8 animate-fade-in">
        <h2 className="text-3xl font-poppins font-semibold text-foreground mb-3">
          Income & Location Details
        </h2>
        <p className="text-muted-foreground text-lg">
          Help us understand your financial situation
        </p>
        <div className="flex items-center justify-center gap-2 mt-3 text-sm text-success animate-pulse">
          <Check className="h-4 w-4" />
          <span>Higher income = Better loan offers</span>
        </div>
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
              name="inhandIncome"
              value={formData.inhandIncome}
              onChange={(e) => {
                const value = e.target.value.replace(/[^\d]/g, '');
                updateFormData({ inhandIncome: value });
              }}
              placeholder="Enter amount (e.g., 50000)"
              className="form-input pl-12"
            />
          </div>
          {errors.inhandIncome && (
            <p className="text-destructive text-sm mt-1">{errors.inhandIncome}</p>
          )}
          <p className="text-sm text-muted-foreground mt-1">
            Your net salary after deductions
          </p>
        </div>

        {/* Salary Payment Method */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            How do you receive your salary? *
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'bank', label: 'Bank Transfer', icon: CreditCard, subtitle: 'Most preferred' },
              { value: 'cash', label: 'Cash', icon: Banknote, subtitle: 'Limited options' },
              { value: 'cheque', label: 'Cheque', icon: CreditCard, subtitle: 'Traditional method' },
              { value: 'upi', label: 'UPI/Digital', icon: Smartphone, subtitle: 'Modern method' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => updateFormData({ salary_recieved_in: option.value as any })}
                className={`
                  radio-option text-center p-4
                  ${formData.salary_recieved_in === option.value ? 'selected' : ''}
                `}
              >
                <option.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="font-medium">{option.label}</div>
                <div className="text-xs text-muted-foreground mt-1">{option.subtitle}</div>
              </button>
            ))}
          </div>
          {errors.salary_recieved_in && (
            <p className="text-destructive text-sm mt-1">{errors.salary_recieved_in}</p>
          )}
        </div>

        {/* Residential Pincode */}
        <PincodeSearch
              value={formData.pincode}
          onChange={handleResidentialPincodeChange}
          label="Residential Pincode *"
          placeholder="Enter your residential pincode"
          error={errors.pincode}
        />

        {/* Office Pincode */}
        <PincodeSearch
          value={formData.office_pincode}
          onChange={handleOfficePincodeChange}
          label="Office Pincode *"
          placeholder="Enter your office pincode"
          error={errors.office_pincode}
        />

        {/* Same as Residential Option */}
        {formData.pincode && formData.office_pincode !== formData.pincode && (
          <div className="flex items-center justify-center">
            <button
              onClick={handleSameAsResidential}
              className="text-primary hover:text-primary/80 text-sm underline"
            >
              Use same as residential address
            </button>
          </div>
        )}

        {/* Credit Information Section */}
        <div className="space-y-6 pt-6 border-t border-border">
          <h3 className="text-xl font-semibold text-foreground">Credit Information</h3>
          
          {/* Know Credit Score */}
                <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Do you know your credit score? *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: true, label: 'Yes', subtitle: 'I know my score' },
                { value: false, label: 'No', subtitle: "I don't know" }
              ].map((option) => (
                <button
                  key={String(option.value)}
                  onClick={() => updateFormData({ know_your_credit_score: option.value })}
                  className={`
                    radio-option text-center p-4
                    ${formData.know_your_credit_score === option.value ? 'selected' : ''}
                  `}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">{option.subtitle}</div>
                </button>
              ))}
                </div>
              </div>

          {/* Credit Range - only show if they know their score */}
          {formData.know_your_credit_score && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                What's your credit score? *
              </label>
              <input
                type="text"
                value={formData.credit_range}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^\d]/g, '').slice(0, 3);
                  updateFormData({ credit_range: value });
                }}
                placeholder="Enter your credit score (e.g., 750)"
                className="form-input"
                maxLength={3}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Score ranges from 300 to 850
              </p>
            </div>
          )}

          {/* Total EMIs */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
              Total EMI amount you're currently paying *
          </label>
          <div className="relative">
              <IndianRupee className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
                value={formData.total_emis}
              onChange={(e) => {
                  const value = parseInt(e.target.value.replace(/[^\d]/g, '')) || 0;
                  updateFormData({ total_emis: value });
                }}
                placeholder="Enter total EMI amount (e.g., 15000)"
              className="form-input pl-12"
              />
            </div>
          <p className="text-sm text-muted-foreground mt-1">
              Enter 0 if you don't have any existing EMIs
          </p>
          </div>
        </div>
      </div>
    </div>
  );
};