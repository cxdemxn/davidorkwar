CREATE TABLE IF NOT EXISTS public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  source text,
  created_at timestamptz NOT NULL DEFAULT now()
);

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'leads_email_key'
  ) THEN
    ALTER TABLE public.leads ADD CONSTRAINT leads_email_key UNIQUE (email);
  END IF;
END $$;

GRANT INSERT ON public.leads TO anon;
GRANT INSERT ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can subscribe" ON public.leads;
CREATE POLICY "Anyone can subscribe"
  ON public.leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);