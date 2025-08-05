import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface FormData {
  // Personal Information
  first_name: string;
  last_name: string;
  gender: 'male' | 'female' | 'other' | '';
  dob: string;
  pan: string;
  
  // Loan Requirements
  loan_amount_required: string;
  timeline: 'instant' | 'week' | 'flexible' | '';
  already_existing_credit: boolean | null;
  
  // Employment Details
  employmentStatus: 'salaried' | 'self_employed' | 'student' | '';
  company_name: string;
  
  // Income & Location
  inhandIncome: string;
  salary_recieved_in: 'bank' | 'cash' | 'cheque' | 'upi' | '';
  pincode: string;
  office_pincode: string;
  city: string;
  state: string;
  office_city: string;
  office_state: string;
}

interface QuestionnaireState {
  currentStep: number;
  formData: FormData;
  errors: Record<string, string>;
  isLoading: boolean;
}

type QuestionnaireAction =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'UPDATE_FORM_DATA'; payload: Partial<FormData> }
  | { type: 'SET_ERRORS'; payload: Record<string, string> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'RESET_FORM' };

const initialState: QuestionnaireState = {
  currentStep: 1,
  formData: {
    first_name: '',
    last_name: '',
    gender: '',
    dob: '',
    pan: '',
    loan_amount_required: '',
    timeline: '',
    already_existing_credit: null,
    employmentStatus: '',
    company_name: '',
    inhandIncome: '',
    salary_recieved_in: '',
    pincode: '',
    office_pincode: '',
    city: '',
    state: '',
    office_city: '',
    office_state: '',
  },
  errors: {},
  isLoading: false,
};

function questionnaireReducer(state: QuestionnaireState, action: QuestionnaireAction): QuestionnaireState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'UPDATE_FORM_DATA':
      return { ...state, formData: { ...state.formData, ...action.payload } };
    case 'SET_ERRORS':
      return { ...state, errors: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'RESET_FORM':
      return initialState;
    default:
      return state;
  }
}

interface QuestionnaireContextType {
  state: QuestionnaireState;
  dispatch: React.Dispatch<QuestionnaireAction>;
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (data: Partial<FormData>) => void;
  validateCurrentStep: () => boolean;
  getTotalSteps: () => number;
  getProgressPercentage: () => number;
}

const QuestionnaireContext = createContext<QuestionnaireContextType | undefined>(undefined);

export const QuestionnaireProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(questionnaireReducer, initialState);

  const nextStep = () => {
    if (validateCurrentStep() && state.currentStep < getTotalSteps()) {
      dispatch({ type: 'SET_STEP', payload: state.currentStep + 1 });
    }
  };

  const prevStep = () => {
    if (state.currentStep > 1) {
      dispatch({ type: 'SET_STEP', payload: state.currentStep - 1 });
    }
  };

  const updateFormData = (data: Partial<FormData>) => {
    dispatch({ type: 'UPDATE_FORM_DATA', payload: data });
    // Clear errors for updated fields
    const clearedErrors = { ...state.errors };
    Object.keys(data).forEach(key => {
      delete clearedErrors[key as keyof FormData];
    });
    dispatch({ type: 'SET_ERRORS', payload: clearedErrors });
  };

  const getTotalSteps = () => 4; // Total number of pages

  const getProgressPercentage = () => {
    return Math.round((state.currentStep / getTotalSteps()) * 100);
  };

  const validateCurrentStep = (): boolean => {
    const { formData } = state;
    const errors: Record<string, string> = {};

    switch (state.currentStep) {
      case 1: // Personal Details (Name + DOB + Gender + PAN)
        if (!formData.first_name.trim()) errors.first_name = 'First name is required';
        if (!formData.last_name.trim()) errors.last_name = 'Last name is required';
        if (!formData.dob) errors.dob = 'Date of birth is required';
        if (!formData.gender) errors.gender = 'Gender selection is required';
        if (!formData.pan.trim()) {
          errors.pan = 'PAN card number is required';
        } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan)) {
          errors.pan = 'Invalid PAN format (e.g., ABCDE1234F)';
        }
        break;
        
      case 2: // Loan Requirements (Amount + Timeline + Credit History)
        if (!formData.loan_amount_required) {
          errors.loan_amount_required = 'Loan amount is required';
        } else if (parseInt(formData.loan_amount_required) < 10000) {
          errors.loan_amount_required = 'Minimum loan amount is ₹10,000';
        }
        if (!formData.timeline) errors.timeline = 'Please select when you need the loan';
        if (formData.already_existing_credit === null) errors.already_existing_credit = 'Please select your credit experience';
        break;
        
      case 3: // Employment Info (Status + Company)
        if (!formData.employmentStatus) errors.employmentStatus = 'Employment status is required';
        if (!formData.company_name.trim()) errors.company_name = 'Company name is required';
        break;
        
      case 4: // Income & Location (Income + Payment Method + Pincodes)
        if (!formData.inhandIncome) errors.inhandIncome = 'Monthly income is required';
        if (!formData.salary_recieved_in) errors.salary_recieved_in = 'Payment method is required';
        if (!formData.pincode) {
          errors.pincode = 'Residential pincode is required';
        } else if (!/^\d{6}$/.test(formData.pincode)) {
          errors.pincode = 'Pincode must be 6 digits';
        }
        if (!formData.office_pincode) {
          errors.office_pincode = 'Office pincode is required';
        } else if (!/^\d{6}$/.test(formData.office_pincode)) {
          errors.office_pincode = 'Pincode must be 6 digits';
        }
        break;
    }

    dispatch({ type: 'SET_ERRORS', payload: errors });
    return Object.keys(errors).length === 0;
  };

  const value: QuestionnaireContextType = {
    state,
    dispatch,
    nextStep,
    prevStep,
    updateFormData,
    validateCurrentStep,
    getTotalSteps,
    getProgressPercentage,
  };

  return (
    <QuestionnaireContext.Provider value={value}>
      {children}
    </QuestionnaireContext.Provider>
  );
};

export const useQuestionnaire = (): QuestionnaireContextType => {
  const context = useContext(QuestionnaireContext);
  if (!context) {
    throw new Error('useQuestionnaire must be used within a QuestionnaireProvider');
  }
  return context;
};