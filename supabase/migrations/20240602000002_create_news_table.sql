-- Create news table
CREATE TABLE IF NOT EXISTS news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT NOT NULL,
    content TEXT, -- Markdown or HTML content
    published_at TIMESTAMPTZ DEFAULT now(),
    image_url TEXT,
    category TEXT NOT NULL DEFAULT 'announcement' CHECK (category IN ('announcement', 'rumor', 'release', 'guide')),
    author TEXT NOT NULL DEFAULT 'Editorial',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public can view news" ON news
    FOR SELECT
    USING (true);

-- Allow authenticated users (admins) full access
CREATE POLICY "Admins can manage news" ON news
    FOR ALL
    USING (auth.role() = 'authenticated');
