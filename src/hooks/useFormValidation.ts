import { useCallback } from 'react';

interface ValidationError {
  [key: string]: string;
}

export const useFormValidation = () => {
  const focusFirstError = useCallback((errors: ValidationError) => {
    if (!errors || Object.keys(errors).length === 0) return;

    // Get the first error field
    const firstErrorField = Object.keys(errors)[0];
    
    // Special handling for DOB field
    if (firstErrorField === 'dob') {
      const dobDayElement = document.querySelector('[name="dob_day"]') as HTMLElement;
      if (dobDayElement) {
        dobDayElement.focus();
        dobDayElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        return;
      }
    }
    
    // Try to find the input element
    const inputElement = document.querySelector(`[name="${firstErrorField}"]`) as HTMLInputElement;
    
    if (inputElement) {
      inputElement.focus();
      inputElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    } else {
      // Fallback: try to find by common patterns
      const fallbackSelectors = [
        `input[placeholder*="${firstErrorField.replace('_', ' ')}"]`,
        `input[placeholder*="${firstErrorField}"]`,
        `textarea[name="${firstErrorField}"]`,
        `select[name="${firstErrorField}"]`
      ];
      
      for (const selector of fallbackSelectors) {
        const element = document.querySelector(selector) as HTMLElement;
        if (element) {
          element.focus();
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
          break;
        }
      }
    }
  }, []);

  const validateAndFocus = useCallback((errors: ValidationError, onValidationFail?: () => void) => {
    if (errors && Object.keys(errors).length > 0) {
      focusFirstError(errors);
      onValidationFail?.();
      return false;
    }
    return true;
  }, [focusFirstError]);

  return {
    focusFirstError,
    validateAndFocus
  };
}; 