-- ============================================================
-- Dig Track Pro — Lead Forms Schema
-- Copy and paste this entire script into the Supabase SQL Editor
-- (Dashboard → SQL Editor → New query) and click "Run".
-- ============================================================

-- -------------------------------------------------------
-- 1. ENUM for the industry dropdown options
-- -------------------------------------------------------
CREATE TYPE public.industry_type AS ENUM (
  'excavation',
  'utility',
  'sitework',
  'boring',
  'other'
);

-- -------------------------------------------------------
-- 2. ENUM for which button/form triggered the submission
-- -------------------------------------------------------
CREATE TYPE public.request_type AS ENUM (
  'Talk to an Expert',
  'Start Your Free Trial'
);

-- -------------------------------------------------------
-- 3. Main leads table
--    Stores every submission from the "Talk to an Expert"
--    and "Book a Demo / Start Your Free Trial" modals.
-- -------------------------------------------------------
CREATE TABLE public.leads (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    timestamptz NOT NULL DEFAULT now(),
  full_name     text NOT NULL,
  business_name text NOT NULL,
  email         text NOT NULL,
  phone         text NOT NULL,
  industry      public.industry_type NOT NULL,
  request_type  public.request_type NOT NULL
);

-- Index to support quick look-ups by request type and date
CREATE INDEX idx_leads_request_type ON public.leads (request_type);
CREATE INDEX idx_leads_created_at   ON public.leads (created_at DESC);

-- -------------------------------------------------------
-- 4. Enable Row Level Security
-- -------------------------------------------------------
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous (unauthenticated) visitors to INSERT rows.
-- This is necessary so that landing-page visitors can submit
-- the form without needing an account.
CREATE POLICY "Allow public inserts" ON public.leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Only authenticated users (i.e. your team) can read leads.
CREATE POLICY "Allow authenticated reads" ON public.leads
  FOR SELECT
  TO authenticated
  USING (true);

-- -------------------------------------------------------
-- 5. (Optional) Realtime — enable if you want live updates
--    in a dashboard that subscribes to new leads.
-- -------------------------------------------------------
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;

-- -------------------------------------------------------
-- Done! Your leads table is ready.
-- Each row represents one form submission and captures:
--   • Full Name
--   • Business Name
--   • Work Email
--   • Phone Number
--   • Industry (excavation | utility | sitework | boring | other)
--   • Request Type (Talk to an Expert | Start Your Free Trial)
--   • Timestamp
-- -------------------------------------------------------
