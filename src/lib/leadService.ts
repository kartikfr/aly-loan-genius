import { apiService } from './api';
import { FormData } from '@/components/loan/QuestionnaireContext';

export interface LeadSubmissionResult {
  success: boolean;
  leadId?: string;
  exitId?: string;
  vendor?: string;
  loanOffers?: any;
  error?: string;
}

class LeadService {
  async submitLead(formData: FormData, authToken: string): Promise<LeadSubmissionResult> {
    try {
      console.log('🚀 Starting lead submission process...');
      
      // Step 1: Create initial lead to get lead_id, exit_id, vendor
      console.log('📝 Step 1: Creating initial lead...');
      const initialLead = await apiService.createLead(authToken);
      
      if (!initialLead.data) {
        throw new Error('Failed to create initial lead');
      }
      
      const { lead_id, exit_id, vendor } = initialLead.data;
      console.log('✅ Initial lead created:', { lead_id, exit_id, vendor });
      
      // Step 2: Submit complete lead details with user data
      console.log('📋 Step 2: Submitting complete lead details...');
      const leadData = {
        lead_id,
        exit_id,
        vendor,
        breFlag: true,
        generateExit: true
      };
      
      // Transform form data to match API expectations
      const userData = this.transformFormData(formData);
      
      const completeSubmission = await apiService.submitLeadDetails(
        authToken,
        leadData,
        userData
      );
      
      console.log('✅ Lead submission completed successfully');
      
      return {
        success: true,
        leadId: lead_id,
        exitId: exit_id,
        vendor: vendor,
        loanOffers: completeSubmission.data
      };
      
    } catch (error) {
      console.error('❌ Lead submission failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
  
  private transformFormData(formData: FormData) {
    return {
      firstName: formData.first_name,
      lastName: formData.last_name,
      gender: formData.gender,
      dateOfBirth: formData.dob, // Should be in YYYY-MM-DD format
      loanAmount: parseInt(formData.loan_amount_required) || 0,
      hasExistingCredit: formData.already_existing_credit ? 'yes' : 'no',
      employmentStatus: this.mapEmploymentStatus(formData.employmentStatus),
      monthlyIncome: parseInt(formData.inhandIncome) || 0,
      salaryMethod: this.mapSalaryMethod(formData.salary_recieved_in),
      companyName: formData.company_name,
      pincode: formData.pincode,
      officePincode: formData.office_pincode,
      city: formData.city,
      state: formData.state,
      panNumber: formData.pan,
      email: formData.email,
      knowCreditScore: formData.know_your_credit_score,
      creditRange: formData.credit_range,
      totalEmis: formData.total_emis
    };
  }
  
  private mapEmploymentStatus(status: string): string {
    const mapping: { [key: string]: string } = {
      'salaried': 'salaried_employee',
      'self_employed': 'self_employed',
      'student': 'student'
    };
    return mapping[status] || 'salaried_employee';
  }
  
  private mapSalaryMethod(method: string): string {
    const mapping: { [key: string]: string } = {
      'bank': 'bank_transfer',
      'cash': 'cash',
      'cheque': 'cheque',
      'upi': 'upi_digital'
    };
    return mapping[method] || 'bank_transfer';
  }
}

export const leadService = new LeadService();