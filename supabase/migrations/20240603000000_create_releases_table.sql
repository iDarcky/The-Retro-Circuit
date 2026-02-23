-- Create the releases table
CREATE TABLE IF NOT EXISTS public.releases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version TEXT NOT NULL UNIQUE,
    title TEXT,
    description TEXT,
    release_date DATE DEFAULT CURRENT_DATE,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.releases ENABLE ROW LEVEL SECURITY;

-- Create policies for releases
CREATE POLICY "Public can view published releases"
ON public.releases
FOR SELECT
USING (is_published = true OR auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'admin'
));

CREATE POLICY "Admins can manage releases"
ON public.releases
FOR ALL
USING (
    auth.uid() IN (
        SELECT id FROM public.profiles WHERE role = 'admin'
    )
);

-- Add release_id to roadmap_features
ALTER TABLE public.roadmap_features
ADD COLUMN IF NOT EXISTS release_id UUID REFERENCES public.releases(id) ON DELETE SET NULL;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_roadmap_features_release_id ON public.roadmap_features(release_id);

-- Trigger to update updated_at for releases
CREATE TRIGGER set_releases_updated_at
BEFORE UPDATE ON public.releases
FOR EACH ROW
EXECUTE FUNCTION update_roadmap_updated_at();
