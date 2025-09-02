# Contact Form Setup Guide

## Overview
The contact form has been successfully integrated into your Loan Genius application with full validation and Supabase integration.

## Features Implemented

### ✅ Form Fields
- **Name** (required, minimum 2 characters)
- **Email** (required, valid email format)
- **Phone Number** (required, valid 10-digit Indian mobile number)
- **Message** (required, minimum 10 characters)

### ✅ Validation
- Real-time validation with error messages
- Email format validation
- Phone number format validation (Indian mobile numbers: 6-9XXXXXXXXX)
- Character length validation
- Required field validation

### ✅ UI/UX Features
- Responsive design (mobile-friendly)
- Loading states with spinner
- Success/error message display
- Form reset after successful submission
- Icon integration for better UX
- Proper focus states and accessibility

### ✅ Supabase Integration
- Direct integration with Supabase database
- Secure data storage
- Error handling
- TypeScript support

## Setup Instructions

### 1. Supabase Configuration

1. **Create Supabase Project** (if not already done):
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note down your project URL and anon key

2. **Environment Variables**:
   Add these to your `.env` file:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Database Setup**:
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Run the SQL script from `supabase_contact_table.sql`
   - This will create the `contact_messages` table with proper structure

### 2. Table Structure
The `contact_messages` table includes:
- `id`: UUID primary key
- `name`: User's name
- `email`: User's email
- `phone`: User's phone number
- `message`: User's message
- `created_at`: Timestamp of submission
- `updated_at`: Timestamp of last update

### 3. Security
- Row Level Security (RLS) is enabled
- Insert policy allows all users to submit forms
- Read policy can be customized based on your needs

## Usage

The contact form is now available on your homepage below the FAQ section. Users can:

1. Fill out the form with their details
2. Get real-time validation feedback
3. Submit their message securely
4. Receive confirmation of successful submission

## Customization

### Styling
The form uses your existing design system with:
- Primary colors for buttons and focus states
- Consistent border radius and spacing
- Responsive grid layout
- Hover effects and transitions

### Validation Rules
You can modify validation rules in `src/pages/Index.tsx`:
- Name minimum length (currently 2 characters)
- Message minimum length (currently 10 characters)
- Phone number format (currently Indian mobile format)

### Database Schema
You can extend the table structure by adding more fields in the SQL script and updating the TypeScript interfaces accordingly.

## Testing

1. **Form Validation**:
   - Try submitting empty form
   - Test invalid email formats
   - Test invalid phone numbers
   - Test short messages

2. **Successful Submission**:
   - Fill all fields correctly
   - Submit form
   - Check Supabase dashboard for new record
   - Verify success message appears

3. **Error Handling**:
   - Disconnect internet and try submitting
   - Check console for error logs

## Troubleshooting

### Common Issues

1. **"Failed to submit form" error**:
   - Check Supabase credentials in environment variables
   - Verify table exists in Supabase
   - Check browser console for detailed error

2. **Validation not working**:
   - Ensure all form fields have proper `onChange` handlers
   - Check that error state is being set correctly

3. **Styling issues**:
   - Verify Tailwind CSS is properly configured
   - Check that all CSS classes are available

### Support
If you encounter any issues, check:
1. Supabase dashboard for table structure
2. Browser console for JavaScript errors
3. Network tab for API call failures
4. Environment variables are properly set
