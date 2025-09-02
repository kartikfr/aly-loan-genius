import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jtbstnmpbbpddxwvrwzs.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0YnN0bm1wYmJwZGR4d3Zyd3pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MDQ1NzIsImV4cCI6MjA3MjI4MDU3Mn0.pwPNmh8NtOVoSA5_pYvpLmj5ONm9yvbmKuAIu0xKh6w';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at?: string;
}

export const submitContactForm = async (formData: ContactFormData) => {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          created_at: formData.created_at || new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw error;
  }
};
