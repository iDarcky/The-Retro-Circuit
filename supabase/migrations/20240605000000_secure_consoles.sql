-- Enable RLS on consoles table
ALTER TABLE public.consoles ENABLE ROW LEVEL SECURITY;

-- Allow public read access (SELECT) for everyone
-- This includes both authenticated and anonymous users
CREATE POLICY "Enable read access for all users"
ON public.consoles
FOR SELECT
USING (true);

-- Allow full access (INSERT, UPDATE, DELETE) for admins only
-- Checks the 'profiles' table to verify if the current user has the 'admin' role
CREATE POLICY "Enable write access for admins"
ON public.consoles
FOR ALL
USING (
  auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'admin'
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'admin'
  )
);
