-- Drop existing table and policies if they exist (for clean setup)
DROP POLICY IF EXISTS "Allow insert for all users" ON contact_messages;
DROP POLICY IF EXISTS "Allow read for all users" ON contact_messages;
DROP TRIGGER IF EXISTS update_contact_messages_updated_at ON contact_messages;
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP TABLE IF EXISTS contact_messages;

-- Create contact_messages table for storing contact form submissions
CREATE TABLE contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster queries
CREATE INDEX idx_contact_messages_email ON contact_messages(email);

-- Create index on created_at for sorting
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from ANY user (including anonymous)
CREATE POLICY "Allow insert for all users" ON contact_messages
  FOR INSERT WITH CHECK (true);

-- Create policy to allow reads for all users (for admin purposes)
CREATE POLICY "Allow read for all users" ON contact_messages
  FOR SELECT USING (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_contact_messages_updated_at 
    BEFORE UPDATE ON contact_messages 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert a test record to verify everything works
INSERT INTO contact_messages (name, email, phone, message) 
VALUES ('Test User', 'test@example.com', '9876543210', 'This is a test message');

-- Verify the insert worked
SELECT * FROM contact_messages;
