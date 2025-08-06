/**
 * Email validation utility functions
 */

/**
 * Validates email format using a comprehensive regex pattern
 * @param email - The email address to validate
 * @returns true if email is valid, false otherwise
 */
export const isValidEmail = (email: string): boolean => {
  // More strict email regex pattern that requires proper domain structure
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  
  // Additional checks for common invalid patterns
  const trimmedEmail = email.trim();
  
  // Check if email has proper structure
  if (!emailRegex.test(trimmedEmail)) {
    return false;
  }
  
  // Check if domain part exists and has at least one dot
  const parts = trimmedEmail.split('@');
  if (parts.length !== 2) {
    return false;
  }
  
  const localPart = parts[0];
  const domain = parts[1];
  
  // Local part cannot start or end with dot
  if (localPart.startsWith('.') || localPart.endsWith('.')) {
    return false;
  }
  
  // Local part cannot have consecutive dots
  if (localPart.includes('..')) {
    return false;
  }
  
  if (!domain || domain.length < 3) {
    return false;
  }
  
  // Domain must have at least one dot and proper TLD
  if (!domain.includes('.') || domain.split('.').some(part => part.length === 0)) {
    return false;
  }
  
  // TLD must be at least 2 characters
  const tld = domain.split('.').pop();
  if (!tld || tld.length < 2) {
    return false;
  }
  
  return true;
};

/**
 * Validates email format and provides detailed error messages
 * @param email - The email address to validate
 * @returns Object with isValid boolean and error message string
 */
export const validateEmailWithMessage = (email: string): { isValid: boolean; message: string } => {
  const trimmedEmail = email.trim();
  
  if (!trimmedEmail) {
    return { isValid: false, message: 'Email address is required' };
  }
  
  // Check for common email issues first
  if (trimmedEmail.length > 254) {
    return { isValid: false, message: 'Email address is too long' };
  }
  
  if (trimmedEmail.includes('..')) {
    return { isValid: false, message: 'Email address cannot contain consecutive dots' };
  }
  
  if (trimmedEmail.startsWith('.') || trimmedEmail.endsWith('.')) {
    return { isValid: false, message: 'Email address cannot start or end with a dot' };
  }
  
  // Check for missing @ symbol
  if (!trimmedEmail.includes('@')) {
    return { isValid: false, message: 'Email address must contain @ symbol' };
  }
  
  // Check for proper domain structure
  const parts = trimmedEmail.split('@');
  if (parts.length !== 2) {
    return { isValid: false, message: 'Email address can only contain one @ symbol' };
  }
  
  const domain = parts[1];
  if (!domain || domain.length < 3) {
    return { isValid: false, message: 'Email domain is too short' };
  }
  
  // Check if domain has proper structure
  if (!domain.includes('.')) {
    return { isValid: false, message: 'Email domain must contain a dot (e.g., .com, .org)' };
  }
  
  // Check for empty domain parts
  if (domain.split('.').some(part => part.length === 0)) {
    return { isValid: false, message: 'Email domain cannot have empty parts' };
  }
  
  // Check TLD length
  const tld = domain.split('.').pop();
  if (!tld || tld.length < 2) {
    return { isValid: false, message: 'Email domain must have a valid extension (e.g., .com, .org)' };
  }
  
  // Final comprehensive check
  if (!isValidEmail(trimmedEmail)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Real-time email validation for input fields
 * @param email - The email address to validate
 * @returns Error message string or empty string if valid
 */
export const getEmailValidationError = (email: string): string => {
  const validation = validateEmailWithMessage(email);
  return validation.isValid ? '' : validation.message;
}; 