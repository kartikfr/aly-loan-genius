// Use proxy URLs to avoid CORS issues
const UAT_BASE_URL = '/api/uat';
const EXTERNAL_BASE_URL = '/api/external';

export interface PartnerTokenResponse {
  status: string;
  message: string;
  data: {
    jwttoken: string;
    expiresAt: string;
  };
}

export interface AuthResponse {
  status: string;
  message: string;
  data: {
    token: string;
    newUser: boolean;
  };
}

export interface OTPVerificationResponse {
  status: string;
  message: string;
  data: {
    token: string;
    partner: string;
    message: string;
    user_data: {
      status: string;
      message: string;
      data: {
        user_data: any;
        spendingHabits: any[];
        tag_genius_data: any[];
      };
    };
  };
}

export interface LeadDetailsInitialResponse {
  status: string;
  message: string;
  data: {
    success: number;
    message: string;
    lead_id: string;
    exit_id: string;
    vendor: string;
  };
}

export interface LoanTag {
  id: number;
  name: string;
}

export interface LoanOffer {
  lender_id: number;
  offer_id: number;
  lender_name: string;
  lender_image: string;
  lender_category: string;
  loan_offered_upto?: string;
  minimum_interest_rate?: string;
  maximum_interest_rate?: string;
  maximum_loan_tenure?: string;
  max_loan_allowed?: string;
  processing_fee?: string;
  processingFees?: string; // API field for processing fees
  documentation?: string[];
  features?: string[];
  apply_url?: string;
  loan_tag?: LoanTag[]; // Array of loan tags with id and name (backward compatibility)
  loan_tags?: LoanTag[]; // Array of loan tags with id and name (new API structure)
  monthly_installment?: string | number; // Monthly installment amount
  total_payable_amount?: string | number; // Total amount to be paid
  // Interest rate calculation fields
  minimum_total_interest_paid?: string | number;
  maximum_total_interest_paid?: string | number;
  minimum_total_payable_amount_range?: string | number;
  maximum_total_payable_amount_range?: string | number;
  rejectedReason?: string; // Rejection reason for ineligible offers
  // Specific rejection boolean flags
  ageRejected?: boolean;
  salaryRejected?: boolean;
  loanAmountRejected?: boolean;
  employmentTypeRejected?: boolean;
  salaryModeRejected?: boolean;
  pincodeReject?: boolean;
  dedupeReject?: boolean;
  creditScoreReject?: boolean;
  bre2CompanyCatReject?: boolean;
  // Add any additional fields that might be in the API response
  [key: string]: any;
}

export interface LeadDetailsCompleteResponse {
  status: string;
  message: string;
  data: {
    success: number;
    message: string;
    isEligible: LoanOffer[];
    inEligibleOffers: LoanOffer[];
    lead_info?: any;
    user_info?: any;
  };
}

export interface CompanySearchResponse {
  status: string;
  message: string;
  data: Array<{
    id: number;
    companyName: string;
    createdAt: string;
    updatedAt: string;
    status: number;
  }>;
}

export interface PincodeSearchResponse {
  status: string;
  message: string;
  data: Array<{
    id: number;
    lender_id: number;
    pincode: string;
    city: string;
    state: string;
    category: string;
    status: number;
    createdAt: string;
    updatedAt: string;
  }>;
}

export interface LeadDetailsPayload {
  leadType: string;
  payload: {
    lead_id?: string;
    exit_id?: string;
    vendor?: string;
    breFlag?: boolean;
    first_name?: string;
    last_name?: string;
    gender?: string;
    dob?: string;
    loan_amount_required?: string;
    already_existing_credit?: boolean;
    employmentStatus?: string;
    inhandIncome?: string;
    salary_recieved_in?: string;
    company_name?: string;
    pincode?: string;
    office_pincode?: string;
    city?: string;
    state?: string;
    pan?: string;
    email?: string;
    fetch_credit_consent?: boolean;
    know_your_credit_score?: boolean;
    credit_range?: string;
    total_emis?: number;
    generateExit?: boolean;
  };
}

class ApiService {
  private partnerToken: string | null = null;
  private partnerTokenExpiry: Date | null = null;

  private async getPartnerToken(): Promise<string> {
    // Check if we have a valid token
    if (this.partnerToken && this.partnerTokenExpiry && new Date() < this.partnerTokenExpiry) {
      return this.partnerToken;
    }

    try {
      console.log('🔑 Fetching partner token...');
      const response = await fetch(`${UAT_BASE_URL}/partner/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          'x-api-key': 'test'
        })
      });

      console.log('Partner token response status:', response.status);

      if (!response.ok) {
        throw new Error(`Failed to get partner token: ${response.status} ${response.statusText}`);
      }

      const data: PartnerTokenResponse = await response.json();
      console.log('Partner token response:', data);
      
      if (data.status === 'success') {
        this.partnerToken = data.data.jwttoken;
        this.partnerTokenExpiry = new Date(data.data.expiresAt);
        console.log('✅ Partner token cached successfully');
        return this.partnerToken;
      } else {
        throw new Error(data.message || 'Failed to get partner token');
      }
    } catch (error) {
      console.error('❌ Error getting partner token:', error);
      throw error;
    }
  }

  async sendOTP(mobile: string): Promise<AuthResponse> {
    try {
      const partnerToken = await this.getPartnerToken();
      console.log('📱 Sending OTP to:', mobile);
      
      const response = await fetch(`${UAT_BASE_URL}/partner/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'partner-token': partnerToken,
        },
        body: JSON.stringify({
          mobile: mobile
        })
      });

      console.log('Send OTP response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to send OTP: ${response.status} ${response.statusText}`);
      }

      const data: AuthResponse = await response.json();
      console.log('Send OTP response:', data);
      
      if (data.status === 'success') {
        console.log('✅ OTP sent successfully');
        return data;
      } else {
        throw new Error(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('❌ Error sending OTP:', error);
      throw error;
    }
  }

  async verifyOTP(mobile: string, otp: string, token: string): Promise<OTPVerificationResponse> {
    try {
      const partnerToken = await this.getPartnerToken();
      console.log('🔐 Verifying OTP for:', mobile);
      
      const response = await fetch(`${UAT_BASE_URL}/partner/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'partner-token': partnerToken,
          'x-epoch': token,
        },
        body: JSON.stringify({
          mobile: mobile,
          otp: otp
        })
      });

      console.log('Verify OTP response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to verify OTP: ${response.status} ${response.statusText}`);
      }

      const data: OTPVerificationResponse = await response.json();
      console.log('Verify OTP response:', data);
      
      if (data.status === 'success') {
        console.log('✅ OTP verified successfully');
        return data;
      } else {
        throw new Error(data.message || 'Failed to verify OTP');
      }
    } catch (error) {
      console.error('❌ Error verifying OTP:', error);
      throw error;
    }
  }

  // Lead Details API - Initial call to get lead_id, exit_id, vendor
  async createLead(authToken: string): Promise<LeadDetailsInitialResponse> {
    try {
      const partnerToken = await this.getPartnerToken();
      console.log('🏢 Creating lead...');
      
      const payload: LeadDetailsPayload = {
        leadType: 'PL',
        payload: {
          generateExit: true
        }
      };
      
      const response = await fetch(`${UAT_BASE_URL}/partner/loangenius/lead-details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'partner-token': partnerToken,
          'Authorization': authToken,
        },
        body: JSON.stringify(payload)
      });

      console.log('Create lead response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to create lead: ${response.status} ${response.statusText}`);
      }

      const data: LeadDetailsInitialResponse = await response.json();
      console.log('Create lead response:', data);
      
      if (data.status === 'success') {
        console.log('✅ Lead created successfully');
        return data;
      } else {
        throw new Error(data.message || 'Failed to create lead');
      }
    } catch (error) {
      console.error('❌ Error creating lead:', error);
      throw error;
    }
  }

  // Lead Details API - Complete call with user data
  async submitLeadDetails(authToken: string, leadData: LeadDetailsPayload['payload'], userData: any): Promise<LeadDetailsCompleteResponse> {
    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const partnerToken = await this.getPartnerToken();
        console.log(`📝 Submitting lead details (attempt ${attempt}/${maxRetries})...`);
        
        const payload: LeadDetailsPayload = {
          leadType: 'PL',
          payload: {
            ...leadData,
            // Map user data to API format
            first_name: userData.firstName,
            last_name: userData.lastName,
            gender: userData.gender,
            dob: userData.dateOfBirth, // Expected format: YYYY-MM-DD
            loan_amount_required: userData.loanAmount?.toString(),
            already_existing_credit: userData.hasExistingCredit === 'yes',
            employmentStatus: this.mapEmploymentStatus(userData.employmentStatus),
            inhandIncome: userData.monthlyIncome?.toString(),
            salary_recieved_in: this.mapSalaryReceived(userData.salaryMethod),
            company_name: userData.companyName,
            pincode: userData.pincode,
            office_pincode: userData.officePincode,
            city: userData.city,
            state: userData.state,
            pan: userData.panNumber,
            email: userData.email || 'kartikrawat@gmail.com', // Default for now
            fetch_credit_consent: true, // Default for now
            know_your_credit_score: userData.knowCreditScore !== undefined ? userData.knowCreditScore : true,
            credit_range: userData.creditRange?.toString() || '850',
            total_emis: userData.totalEmis || 0,
            breFlag: true
          }
        };
        
        // Create AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
        
        try {
          const response = await fetch(`${UAT_BASE_URL}/partner/loangenius/lead-details`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'partner-token': partnerToken,
              'Authorization': authToken,
            },
            body: JSON.stringify(payload),
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);

          console.log(`Submit lead details response status (attempt ${attempt}):`, response.status);

          if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error response (attempt ${attempt}):`, errorText);
            
            // Handle specific error codes
            if (response.status === 502) {
              throw new Error(`Server temporarily unavailable (502). Please try again in a few moments.`);
            } else if (response.status === 503) {
              throw new Error(`Service temporarily unavailable (503). Please try again later.`);
            } else if (response.status === 504) {
              throw new Error(`Request timeout (504). Please try again.`);
            } else {
              throw new Error(`Failed to submit lead details: ${response.status} ${response.statusText}`);
            }
          }

          const data: LeadDetailsCompleteResponse = await response.json();
          console.log('Submit lead details response:', data);
          
          if (data.status === 'success') {
            console.log('✅ Lead details submitted successfully');
            return data;
          } else {
            throw new Error(data.message || 'Failed to submit lead details');
          }
        } catch (error) {
          clearTimeout(timeoutId);
          
          // Handle timeout specifically
          if (error instanceof Error && error.name === 'AbortError') {
            lastError = new Error('Request timeout. Please try again.');
          } else {
            lastError = error instanceof Error ? error : new Error('Unknown error occurred');
          }
          
          console.error(`❌ Error submitting lead details (attempt ${attempt}):`, lastError);
          
          // If this is the last attempt, throw the error
          if (attempt === maxRetries) {
            break;
          }
          
          // Wait before retrying (exponential backoff)
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
          console.log(`⏳ Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error occurred');
        console.error(`❌ Error submitting lead details (attempt ${attempt}):`, lastError);
        
        // If this is the last attempt, break out of the loop
        if (attempt === maxRetries) {
          break;
        }
        
        // Wait before retrying (exponential backoff)
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        console.log(`⏳ Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    // If we get here, all retries failed
    throw lastError ?? new Error('Failed to submit lead details after multiple attempts');
  }

  // Company search API using real BankKaro API
  async searchCompanies(query: string): Promise<CompanySearchResponse> {
    try {
      console.log('🔍 Searching companies for:', query);
      
      const response = await fetch(`${EXTERNAL_BASE_URL}/sp/api/companies/${encodeURIComponent(query)}?type=PL`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });

      console.log('Company search response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to search companies: ${response.status} ${response.statusText}`);
      }

      const data: CompanySearchResponse = await response.json();
      console.log('Company search response:', data);
      
      if (data.status === 'success') {
        console.log(`✅ Company search successful - found ${data.data.length} companies`);
        return data;
      } else {
        throw new Error(data.message || 'Failed to search companies');
      }
    } catch (error) {
      console.error('❌ Error searching companies:', error);
      throw error;
    }
  }



  // Pincode search API using real BankKaro API
  async searchPincode(pincode: string): Promise<PincodeSearchResponse> {
    try {
      console.log('📍 Searching pincode:', pincode);
      
      const response = await fetch(`${EXTERNAL_BASE_URL}/sp/api/pincode/${pincode}?type=PL`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });

      console.log('Pincode search response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to search pincode: ${response.status} ${response.statusText}`);
      }

      const data: PincodeSearchResponse = await response.json();
      console.log('Pincode search response:', data);
      
      if (data.status === 'success') {
        console.log(`✅ Pincode search successful - found ${data.data.length} locations`);
        return data;
      } else {
        throw new Error(data.message || 'Failed to search pincode');
      }
    } catch (error) {
      console.error('❌ Error searching pincode:', error);
      throw error;
    }
  }



  // Helper methods for mapping user input to API format
  private mapEmploymentStatus(status: string): string {
    const mapping: { [key: string]: string } = {
      'salaried_employee': 'salaried',
      'self_employed': 'self_employed',
      'student': 'student'
    };
    return mapping[status] || 'salaried';
  }

  private mapSalaryReceived(method: string): string {
    const mapping: { [key: string]: string } = {
      'bank_transfer': 'bank',
      'cash': 'cash',
      'cheque': 'cheque',
      'upi_digital': 'upi'
    };
    return mapping[method] || 'bank';
  }
}

export const apiService = new ApiService(); 