-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    console_id UUID NOT NULL REFERENCES consoles(id) ON DELETE CASCADE,
    console_slug TEXT NOT NULL,
    console_name TEXT NOT NULL,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    score NUMERIC(3, 1) NOT NULL CHECK (score >= 0 AND score <= 10),
    published_at TIMESTAMPTZ DEFAULT now(),
    author TEXT NOT NULL DEFAULT 'Jules',
    image_url TEXT,
    pros TEXT[] DEFAULT '{}',
    cons TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public can view reviews" ON reviews
    FOR SELECT
    USING (true);

-- Allow authenticated users (admins) full access
CREATE POLICY "Admins can manage reviews" ON reviews
    FOR ALL
    USING (auth.role() = 'authenticated');
