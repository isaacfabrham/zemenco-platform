-- Add slug column to sites table
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='sites' AND column_name='slug') THEN
    ALTER TABLE public.sites ADD COLUMN slug text UNIQUE;
  END IF;
END $$;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS sites_slug_idx ON public.sites (slug);
