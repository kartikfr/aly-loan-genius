# Authentication System Implementation

## Overview
This document describes the implementation of the mobile OTP verification system for the Loan Genius Hub application.

## Features

### ✅ **Core Authentication Flow**
- **Partner Token Generation**: Automatic JWT token generation from UAT environment
- **Mobile OTP Sending**: Send 6-digit OTP to user's mobile number
- **OTP Verification**: Verify OTP and authenticate user
- **User Data Retrieval**: Fetch existing user data or create new user profile

### ✅ **Enhanced User Experience**
- **Retry Mechanism**: Users can try wrong OTP up to 3 times
- **Phone Number Editing**: Users can go back and edit phone number from OTP screen
- **Attempt Tracking**: Visual indicator showing attempts used (e.g., "Attempts used: 1/3")
- **Smart Error Handling**: Different messages for different error scenarios
- **Auto-reset**: After 3 failed attempts, user is taken back to phone number entry
- **Visual Feedback**: Confetti animation on successful verification

### ✅ **Security Features**
- **Token Caching**: Partner tokens are cached and reused until expiry
- **Session Management**: User authentication state persists across browser sessions
- **Protected Routes**: Questionnaire access requires authentication
- **Input Validation**: Phone number and OTP format validation

## API Integration

### **UAT Environment Endpoints**
All API calls are made to the UAT environment through a Vite proxy to avoid CORS issues:

- **Base URL**: `/api/uat` (proxied to `https://uat-platform.bankkaro.com`)
- **Partner Token**: `POST /partner/token`
- **Authentication**: `POST /partner/auth`

### **API Flow**
1. **Generate Partner Token**: `POST /partner/token` with `x-api-key: "test"`
2. **Send OTP**: `POST /partner/auth` with `partner-token` header and mobile number
3. **Verify OTP**: `POST /partner/auth` with `partner-token`, `x-epoch`, mobile, and OTP

## Component Structure

### **OTPModal Component** (`src/components/auth/OTPModal.tsx`)
- **Multi-step Interface**: Phone entry → OTP entry → Success/Error
- **Retry Logic**: Tracks OTP attempts and handles max retries
- **Phone Editing**: "Edit Number" button to go back to phone entry
- **Visual States**: Different icons and colors for each step
- **Error Display**: Contextual error messages with attempt tracking

### **AuthContext** (`src/contexts/AuthContext.tsx`)
- **Global State**: Manages user authentication across the app
- **Persistence**: Stores user data and tokens in localStorage
- **Session Management**: Handles login, logout, and user updates

### **ProtectedRoute** (`src/components/auth/ProtectedRoute.tsx`)
- **Route Protection**: Redirects unauthenticated users to home
- **Authentication Check**: Uses AuthContext to verify user status

## User Flow

### **1. Initial Access**
- User visits home page
- Clicks "Get My Best Rates Now" or "Start My Application"
- OTP modal opens with phone number entry

### **2. Phone Number Entry**
- User enters 10-digit mobile number
- Validation ensures proper format
- "Send OTP" button triggers API call

### **3. OTP Entry & Verification**
- User receives 6-digit OTP
- Can enter OTP in individual input boxes
- **Retry Logic**: Up to 3 attempts for wrong OTP
- **Phone Editing**: "Edit Number" button to change phone number
- **Resend**: "Resend" button with 30-second cooldown

### **4. Success Flow**
- Confetti animation on successful verification
- User data stored in AuthContext
- Auto-navigation to questionnaire
- Modal closes automatically

### **5. Error Handling**
- **Network Errors**: Clear error messages for API failures
- **Invalid OTP**: Attempt tracking with remaining attempts display
- **Max Attempts**: Automatic return to phone entry after 3 failed attempts
- **Phone Validation**: Real-time validation for phone number format

## Error Scenarios

### **OTP Verification Errors**
- **Attempt 1-2**: Shows remaining attempts, stays on OTP screen
- **Attempt 3**: Shows max attempts reached, returns to phone entry
- **Network Error**: Shows error message with retry option

### **Phone Number Errors**
- **Invalid Format**: Real-time validation feedback
- **API Error**: Error message with option to try again

## Technical Implementation

### **State Management**
```typescript
// OTP Modal State
const [otpAttempts, setOtpAttempts] = useState(0);
const [maxOtpAttempts] = useState(3);
const [step, setStep] = useState<'phone' | 'otp' | 'success' | 'error'>('phone');
```

### **Retry Logic**
```typescript
// OTP verification with attempt tracking
const newAttempts = otpAttempts + 1;
if (newAttempts >= maxOtpAttempts) {
  // Return to phone entry
  setStep('phone');
  setPhoneNumber('');
} else {
  // Show remaining attempts
  setErrorMessage(`Invalid OTP. ${remainingAttempts} attempts remaining.`);
}
```

### **Phone Number Editing**
```typescript
// Back to phone number step
const handleBackToPhone = () => {
  setStep('phone');
  setOtp('');
  setOtpAttempts(0);
  // Reset all related state
};
```

## Testing Guidelines

### **Functional Testing**
1. **Valid Flow**: Test complete authentication with correct OTP
2. **Retry Logic**: Test wrong OTP entries (1-3 attempts)
3. **Phone Editing**: Test "Edit Number" functionality
4. **Resend OTP**: Test resend functionality with cooldown
5. **Max Attempts**: Verify return to phone entry after 3 failed attempts

### **Error Testing**
1. **Network Issues**: Test with poor connectivity
2. **Invalid Input**: Test with malformed phone numbers
3. **API Errors**: Test with invalid API responses

### **User Experience Testing**
1. **Visual Feedback**: Verify confetti animation
2. **Loading States**: Check loading indicators
3. **Error Messages**: Verify clear, helpful error messages
4. **Accessibility**: Test keyboard navigation and screen readers

## Security Considerations

### **Token Management**
- Partner tokens are cached and reused
- Automatic token refresh on expiry
- Secure token storage in memory

### **Input Validation**
- Phone number format validation
- OTP length and format validation
- XSS prevention in error messages

### **Session Security**
- User data encrypted in localStorage
- Automatic session cleanup on logout
- Protected route enforcement

## Future Enhancements

### **Planned Features**
- **Biometric Authentication**: Fingerprint/Face ID support
- **Multi-factor Authentication**: Additional security layers
- **Offline Support**: Cached authentication for offline use
- **Analytics**: User behavior tracking and analytics

### **Performance Optimizations**
- **Lazy Loading**: Load authentication components on demand
- **Caching**: Implement more sophisticated caching strategies
- **Bundle Optimization**: Reduce authentication bundle size

## Troubleshooting

### **Common Issues**
1. **CORS Errors**: Ensure Vite proxy is configured correctly
2. **Token Expiry**: Check partner token cache and refresh logic
3. **Network Timeouts**: Verify API endpoint availability
4. **State Persistence**: Check localStorage for user data

### **Debug Information**
- Console logs show API call status and responses
- Network tab shows proxy requests and responses
- Application tab shows localStorage contents

## Dependencies

### **Required Packages**
- `canvas-confetti`: Confetti animation on success
- `lucide-react`: Icons for UI components
- `react-router-dom`: Navigation and route protection

### **Development Dependencies**
- `@types/canvas-confetti`: TypeScript definitions for confetti

## Configuration

### **Environment Variables**
- `UAT_BASE_URL`: UAT API base URL (configured in proxy)
- `API_KEY`: Partner API key for token generation

### **Vite Configuration**
```typescript
// vite.config.ts
proxy: {
  '/api/uat': {
    target: 'https://uat-platform.bankkaro.com',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api\/uat/, ''),
  }
}
```

---

**Last Updated**: August 5, 2025  
**Version**: 2.0.0  
**Status**: ✅ Production Ready 