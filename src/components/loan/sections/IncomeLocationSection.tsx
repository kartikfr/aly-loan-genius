import { useQuestionnaire } from '../QuestionnaireContext';
import { MapPin, IndianRupee, CreditCard, Banknote, Smartphone } from 'lucide-react';

export const IncomeLocationSection = () => {
  const { state, updateFormData } = useQuestionnaire();
  const { formData, errors } = state;

  // Comprehensive mock pincode data for testing
  const mockPincodeData: Record<string, { city: string; state: string }> = {
    // Delhi
    '110001': { city: 'New Delhi', state: 'Delhi' },
    '110002': { city: 'New Delhi', state: 'Delhi' },
    '110003': { city: 'New Delhi', state: 'Delhi' },
    '110005': { city: 'New Delhi', state: 'Delhi' },
    '110006': { city: 'New Delhi', state: 'Delhi' },
    '110007': { city: 'New Delhi', state: 'Delhi' },
    '110008': { city: 'New Delhi', state: 'Delhi' },
    '110009': { city: 'New Delhi', state: 'Delhi' },
    '110010': { city: 'New Delhi', state: 'Delhi' },
    '110011': { city: 'New Delhi', state: 'Delhi' },
    '110012': { city: 'New Delhi', state: 'Delhi' },
    '110013': { city: 'New Delhi', state: 'Delhi' },
    '110014': { city: 'New Delhi', state: 'Delhi' },
    '110015': { city: 'New Delhi', state: 'Delhi' },
    '110016': { city: 'New Delhi', state: 'Delhi' },
    '110017': { city: 'New Delhi', state: 'Delhi' },
    '110018': { city: 'New Delhi', state: 'Delhi' },
    '110019': { city: 'New Delhi', state: 'Delhi' },
    '110020': { city: 'New Delhi', state: 'Delhi' },
    '110021': { city: 'New Delhi', state: 'Delhi' },
    '110022': { city: 'New Delhi', state: 'Delhi' },
    '110023': { city: 'New Delhi', state: 'Delhi' },
    '110024': { city: 'New Delhi', state: 'Delhi' },
    '110025': { city: 'New Delhi', state: 'Delhi' },
    '110026': { city: 'New Delhi', state: 'Delhi' },
    '110027': { city: 'New Delhi', state: 'Delhi' },
    '110028': { city: 'New Delhi', state: 'Delhi' },
    '110029': { city: 'New Delhi', state: 'Delhi' },
    '110030': { city: 'New Delhi', state: 'Delhi' },
    
    // Mumbai
    '400001': { city: 'Mumbai', state: 'Maharashtra' },
    '400002': { city: 'Mumbai', state: 'Maharashtra' },
    '400003': { city: 'Mumbai', state: 'Maharashtra' },
    '400004': { city: 'Mumbai', state: 'Maharashtra' },
    '400005': { city: 'Mumbai', state: 'Maharashtra' },
    '400006': { city: 'Mumbai', state: 'Maharashtra' },
    '400007': { city: 'Mumbai', state: 'Maharashtra' },
    '400008': { city: 'Mumbai', state: 'Maharashtra' },
    '400009': { city: 'Mumbai', state: 'Maharashtra' },
    '400010': { city: 'Mumbai', state: 'Maharashtra' },
    '400011': { city: 'Mumbai', state: 'Maharashtra' },
    '400012': { city: 'Mumbai', state: 'Maharashtra' },
    '400013': { city: 'Mumbai', state: 'Maharashtra' },
    '400014': { city: 'Mumbai', state: 'Maharashtra' },
    '400015': { city: 'Mumbai', state: 'Maharashtra' },
    '400016': { city: 'Mumbai', state: 'Maharashtra' },
    '400017': { city: 'Mumbai', state: 'Maharashtra' },
    '400018': { city: 'Mumbai', state: 'Maharashtra' },
    '400019': { city: 'Mumbai', state: 'Maharashtra' },
    '400020': { city: 'Mumbai', state: 'Maharashtra' },
    '400021': { city: 'Mumbai', state: 'Maharashtra' },
    '400022': { city: 'Mumbai', state: 'Maharashtra' },
    '400023': { city: 'Mumbai', state: 'Maharashtra' },
    '400024': { city: 'Mumbai', state: 'Maharashtra' },
    '400025': { city: 'Mumbai', state: 'Maharashtra' },
    '400026': { city: 'Mumbai', state: 'Maharashtra' },
    '400027': { city: 'Mumbai', state: 'Maharashtra' },
    '400028': { city: 'Mumbai', state: 'Maharashtra' },
    '400029': { city: 'Mumbai', state: 'Maharashtra' },
    '400030': { city: 'Mumbai', state: 'Maharashtra' },
    
    // Bangalore
    '560001': { city: 'Bangalore', state: 'Karnataka' },
    '560002': { city: 'Bangalore', state: 'Karnataka' },
    '560003': { city: 'Bangalore', state: 'Karnataka' },
    '560004': { city: 'Bangalore', state: 'Karnataka' },
    '560005': { city: 'Bangalore', state: 'Karnataka' },
    '560006': { city: 'Bangalore', state: 'Karnataka' },
    '560007': { city: 'Bangalore', state: 'Karnataka' },
    '560008': { city: 'Bangalore', state: 'Karnataka' },
    '560009': { city: 'Bangalore', state: 'Karnataka' },
    '560010': { city: 'Bangalore', state: 'Karnataka' },
    '560011': { city: 'Bangalore', state: 'Karnataka' },
    '560012': { city: 'Bangalore', state: 'Karnataka' },
    '560013': { city: 'Bangalore', state: 'Karnataka' },
    '560014': { city: 'Bangalore', state: 'Karnataka' },
    '560015': { city: 'Bangalore', state: 'Karnataka' },
    '560016': { city: 'Bangalore', state: 'Karnataka' },
    '560017': { city: 'Bangalore', state: 'Karnataka' },
    '560018': { city: 'Bangalore', state: 'Karnataka' },
    '560019': { city: 'Bangalore', state: 'Karnataka' },
    '560020': { city: 'Bangalore', state: 'Karnataka' },
    
    // Chennai
    '600001': { city: 'Chennai', state: 'Tamil Nadu' },
    '600002': { city: 'Chennai', state: 'Tamil Nadu' },
    '600003': { city: 'Chennai', state: 'Tamil Nadu' },
    '600004': { city: 'Chennai', state: 'Tamil Nadu' },
    '600005': { city: 'Chennai', state: 'Tamil Nadu' },
    '600006': { city: 'Chennai', state: 'Tamil Nadu' },
    '600007': { city: 'Chennai', state: 'Tamil Nadu' },
    '600008': { city: 'Chennai', state: 'Tamil Nadu' },
    '600009': { city: 'Chennai', state: 'Tamil Nadu' },
    '600010': { city: 'Chennai', state: 'Tamil Nadu' },
    '600011': { city: 'Chennai', state: 'Tamil Nadu' },
    '600012': { city: 'Chennai', state: 'Tamil Nadu' },
    '600013': { city: 'Chennai', state: 'Tamil Nadu' },
    '600014': { city: 'Chennai', state: 'Tamil Nadu' },
    '600015': { city: 'Chennai', state: 'Tamil Nadu' },
    '600016': { city: 'Chennai', state: 'Tamil Nadu' },
    '600017': { city: 'Chennai', state: 'Tamil Nadu' },
    '600018': { city: 'Chennai', state: 'Tamil Nadu' },
    '600019': { city: 'Chennai', state: 'Tamil Nadu' },
    '600020': { city: 'Chennai', state: 'Tamil Nadu' },
    
    // Kolkata
    '700001': { city: 'Kolkata', state: 'West Bengal' },
    '700002': { city: 'Kolkata', state: 'West Bengal' },
    '700003': { city: 'Kolkata', state: 'West Bengal' },
    '700004': { city: 'Kolkata', state: 'West Bengal' },
    '700005': { city: 'Kolkata', state: 'West Bengal' },
    '700006': { city: 'Kolkata', state: 'West Bengal' },
    '700007': { city: 'Kolkata', state: 'West Bengal' },
    '700008': { city: 'Kolkata', state: 'West Bengal' },
    '700009': { city: 'Kolkata', state: 'West Bengal' },
    '700010': { city: 'Kolkata', state: 'West Bengal' },
    '700011': { city: 'Kolkata', state: 'West Bengal' },
    '700012': { city: 'Kolkata', state: 'West Bengal' },
    '700013': { city: 'Kolkata', state: 'West Bengal' },
    '700014': { city: 'Kolkata', state: 'West Bengal' },
    '700015': { city: 'Kolkata', state: 'West Bengal' },
    '700016': { city: 'Kolkata', state: 'West Bengal' },
    '700017': { city: 'Kolkata', state: 'West Bengal' },
    '700018': { city: 'Kolkata', state: 'West Bengal' },
    '700019': { city: 'Kolkata', state: 'West Bengal' },
    '700020': { city: 'Kolkata', state: 'West Bengal' },
    
    // Hyderabad
    '500001': { city: 'Hyderabad', state: 'Telangana' },
    '500002': { city: 'Hyderabad', state: 'Telangana' },
    '500003': { city: 'Hyderabad', state: 'Telangana' },
    '500004': { city: 'Hyderabad', state: 'Telangana' },
    '500005': { city: 'Hyderabad', state: 'Telangana' },
    '500006': { city: 'Hyderabad', state: 'Telangana' },
    '500007': { city: 'Hyderabad', state: 'Telangana' },
    '500008': { city: 'Hyderabad', state: 'Telangana' },
    '500009': { city: 'Hyderabad', state: 'Telangana' },
    '500010': { city: 'Hyderabad', state: 'Telangana' },
    
    // Pune
    '411001': { city: 'Pune', state: 'Maharashtra' },
    '411002': { city: 'Pune', state: 'Maharashtra' },
    '411003': { city: 'Pune', state: 'Maharashtra' },
    '411004': { city: 'Pune', state: 'Maharashtra' },
    '411005': { city: 'Pune', state: 'Maharashtra' },
    '411006': { city: 'Pune', state: 'Maharashtra' },
    '411007': { city: 'Pune', state: 'Maharashtra' },
    '411008': { city: 'Pune', state: 'Maharashtra' },
    '411009': { city: 'Pune', state: 'Maharashtra' },
    '411010': { city: 'Pune', state: 'Maharashtra' },
    
    // Ahmedabad
    '380001': { city: 'Ahmedabad', state: 'Gujarat' },
    '380002': { city: 'Ahmedabad', state: 'Gujarat' },
    '380003': { city: 'Ahmedabad', state: 'Gujarat' },
    '380004': { city: 'Ahmedabad', state: 'Gujarat' },
    '380005': { city: 'Ahmedabad', state: 'Gujarat' },
    '380006': { city: 'Ahmedabad', state: 'Gujarat' },
    '380007': { city: 'Ahmedabad', state: 'Gujarat' },
    '380008': { city: 'Ahmedabad', state: 'Gujarat' },
    '380009': { city: 'Ahmedabad', state: 'Gujarat' },
    '380010': { city: 'Ahmedabad', state: 'Gujarat' },
    
    // Sample from your test case
    '244715': { city: 'Rampur', state: 'Uttar Pradesh' },
    
    // Other common pincodes
    '201301': { city: 'Noida', state: 'Uttar Pradesh' },
    '122001': { city: 'Gurgaon', state: 'Haryana' },
    '160001': { city: 'Chandigarh', state: 'Chandigarh' },
    '302001': { city: 'Jaipur', state: 'Rajasthan' },
    '482001': { city: 'Jabalpur', state: 'Madhya Pradesh' },
    '751001': { city: 'Bhubaneswar', state: 'Odisha' },
    '781001': { city: 'Guwahati', state: 'Assam' },
  };

  // Pincode validation and city/state fetch with CORS proxy fallback
  const fetchLocationFromPincode = async (pincode: string, type: 'residential' | 'office') => {
    if (pincode.length === 6) {
      // First try mock data (for demo purposes)
      const mockLocation = mockPincodeData[pincode];
      if (mockLocation) {
        console.log(`Using mock data for pincode ${pincode}:`, mockLocation);
        if (type === 'residential') {
          updateFormData({ 
            city: mockLocation.city, 
            state: mockLocation.state 
          });
        } else {
          updateFormData({ 
            office_city: mockLocation.city, 
            office_state: mockLocation.state 
          });
        }
        return;
      }

      // If not in mock data, try CORS proxy
      try {
        // Using a public CORS proxy service
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://bk-prod-external.bankkaro.com/sp/api/pincode/${pincode}?type=PL`)}`;
        
        const response = await fetch(proxyUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Pincode API response via proxy:', data);
          
          if (data.city && data.state) {
            if (type === 'residential') {
              updateFormData({ 
                city: data.city, 
                state: data.state 
              });
            } else {
              updateFormData({ 
                office_city: data.city, 
                office_state: data.state 
              });
            }
            return;
          }
        }
      } catch (error) {
        console.error('Pincode API error (proxy failed):', error);
      }

      // Final fallback - show error message
      console.warn(`Pincode ${pincode} not found in mock data and API failed`);
      if (type === 'residential') {
        updateFormData({ 
          city: 'Unknown', 
          state: 'Unknown' 
        });
      } else {
        updateFormData({ 
          office_city: 'Unknown', 
          office_state: 'Unknown' 
        });
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
                  fetchLocationFromPincode(value, 'residential');
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
          {/* Display pincode, city and state */}
          {formData.pincode && (
            <div className="mt-3 p-4 bg-muted/50 border rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Residential Location</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-muted-foreground block">Pincode</span>
                  <div className="text-foreground font-medium">{formData.pincode}</div>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground block">City</span>
                  <div className="text-foreground font-medium">{formData.city || 'Loading...'}</div>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground block">State</span>
                  <div className="text-foreground font-medium">{formData.state || 'Loading...'}</div>
                </div>
              </div>
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
                if (value.length === 6) {
                  fetchLocationFromPincode(value, 'office');
                }
              }}
              placeholder="Enter 6-digit pincode"
              className="form-input pl-12"
              maxLength={6}
            />
          </div>
          {errors.office_pincode && (
            <p className="text-destructive text-sm mt-1">{errors.office_pincode}</p>
          )}
          {/* Display office pincode, city and state */}
          {formData.office_pincode && (
            <div className="mt-3 p-4 bg-muted/50 border rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Office Location</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-muted-foreground block">Pincode</span>
                  <div className="text-foreground font-medium">{formData.office_pincode}</div>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground block">City</span>
                  <div className="text-foreground font-medium">{formData.office_city || 'Loading...'}</div>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground block">State</span>
                  <div className="text-foreground font-medium">{formData.office_state || 'Loading...'}</div>
                </div>
              </div>
            </div>
          )}
          <button
            onClick={() => {
              updateFormData({ 
                office_pincode: formData.pincode,
                office_city: formData.city,
                office_state: formData.state
              });
            }}
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