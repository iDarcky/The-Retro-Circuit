-- Create signals table
CREATE TABLE IF NOT EXISTS signals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'status' CHECK (type IN ('status', 'alert', 'update', 'thought')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE signals ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active signals
CREATE POLICY "Public can view active signals" ON signals
    FOR SELECT
    USING (is_active = true);

-- Allow authenticated users (admins) full access
CREATE POLICY "Admins can manage signals" ON signals
    FOR ALL
    USING (auth.role() = 'authenticated');
