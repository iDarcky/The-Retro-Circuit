-- Add updated_at to consoles
ALTER TABLE public.consoles
ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();

-- Create or replace the trigger function
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to consoles
CREATE TRIGGER update_consoles_modtime
BEFORE UPDATE ON public.consoles
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
