-- Create the roadmap_features table
CREATE TABLE IF NOT EXISTS public.roadmap_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL CHECK (status IN ('planned', 'in-progress', 'completed')),
    category TEXT NOT NULL,
    priority TEXT CHECK (priority IN ('critical', 'must-have', 'nice-to-have')),
    target_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.roadmap_features ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Public can view all roadmap items
CREATE POLICY "Public can view roadmap items"
ON public.roadmap_features
FOR SELECT
USING (true);

-- Admins can do everything
CREATE POLICY "Admins can manage roadmap items"
ON public.roadmap_features
FOR ALL
USING (
    auth.uid() IN (
        SELECT id FROM public.profiles WHERE role = 'admin'
    )
);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_roadmap_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_roadmap_updated_at
BEFORE UPDATE ON public.roadmap_features
FOR EACH ROW
EXECUTE FUNCTION update_roadmap_updated_at();
