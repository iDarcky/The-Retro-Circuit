-- Create the status enum
CREATE TYPE public.content_status AS ENUM ('draft', 'published', 'archived');

-- Add the status column to consoles table
ALTER TABLE public.consoles
ADD COLUMN status public.content_status NOT NULL DEFAULT 'draft';

-- Add an index for performance
CREATE INDEX idx_consoles_status ON public.consoles(status);
