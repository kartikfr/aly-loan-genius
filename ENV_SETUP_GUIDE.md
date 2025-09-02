# Environment Setup Guide

## Quick Fix for Supabase Error

The error "supabaseUrl is required" occurs because the Supabase environment variables are not configured.

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Supabase Configuration (Required for Contact Form)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Server Configuration
VITE_HOST=::
VITE_PORT=8080

# API Configuration
VITE_UAT_API_URL=https://uat-platform.bankkaro.com
VITE_EXTERNAL_API_URL=https://bk-api.bankkaro.com
VITE_PARTNER_API_KEY=test
VITE_LEAD_TYPE=PL
```

## How to Get Supabase Credentials

1. **Create a Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Sign up/Login and create a new project
   - Wait for the project to be set up

2. **Get Your Credentials**:
   - In your Supabase dashboard, go to Settings → API
   - Copy the "Project URL" (this is your `VITE_SUPABASE_URL`)
   - Copy the "anon public" key (this is your `VITE_SUPABASE_ANON_KEY`)

3. **Set Up Database Table**:
   - Go to SQL Editor in your Supabase dashboard
   - Run the SQL script from `supabase_contact_table.sql` to create the contact_messages table

## Temporary Workaround

If you don't want to set up Supabase right now, the contact form will show a helpful error message instead of crashing the app.

## After Setup

1. Create the `.env.local` file with your Supabase credentials
2. Restart your development server: `npm run dev`
3. The contact form should now work properly

## File Location

The `.env.local` file should be in the same directory as your `package.json` file.
