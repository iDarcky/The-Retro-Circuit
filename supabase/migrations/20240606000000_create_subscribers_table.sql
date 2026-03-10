-- Drop the old newsletter_subscribers table if it exists
DROP TABLE IF EXISTS newsletter_subscribers CASCADE;

-- Create the new subscribers table
CREATE TABLE subscribers (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  subscribed_at timestamptz NOT NULL DEFAULT now(),
  unsubscribed_at timestamptz,
  source text
);

-- Enable Row Level Security
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Add RLS policy allowing anonymous inserts only
CREATE POLICY "Allow anonymous inserts"
  ON subscribers
  FOR INSERT
  TO anon
  WITH CHECK (true);
