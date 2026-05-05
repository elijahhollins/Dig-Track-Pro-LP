-- ============================================================
-- Dig Track Pro — Site Content & Storage
-- Copy and paste this entire script into the Supabase SQL Editor
-- (Dashboard → SQL Editor → New query) and click "Run".
-- ============================================================

-- -------------------------------------------------------
-- 1. Site content table
--    Stores the editable landing-page content (text, image
--    URLs, etc.) managed through the Admin site editor.
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_content (
  id         text PRIMARY KEY,
  content    jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Seed the default row so the editor always has something to load.
INSERT INTO public.site_content (id, content)
VALUES ('main', '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- -------------------------------------------------------
-- 2. Row Level Security for site_content
-- -------------------------------------------------------
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Authenticated admins can read site content.
CREATE POLICY "Authenticated users can read site_content"
  ON public.site_content
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated admins can insert / update site content.
CREATE POLICY "Authenticated users can upsert site_content"
  ON public.site_content
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update site_content"
  ON public.site_content
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- -------------------------------------------------------
-- 3. Storage bucket for site assets
--    Creates a public bucket called "site-assets" so that
--    uploaded hero and showcase images are publicly readable.
-- -------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO NOTHING;

-- -------------------------------------------------------
-- 4. Storage RLS policies
--    Authenticated users (i.e. admins) can upload files.
--    Anyone (including anonymous visitors) can read files
--    because the bucket is public.
-- -------------------------------------------------------

-- Allow authenticated users to upload files.
CREATE POLICY "Authenticated users can upload site assets"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'site-assets');

-- Allow authenticated users to update / replace files.
CREATE POLICY "Authenticated users can update site assets"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'site-assets')
  WITH CHECK (bucket_id = 'site-assets');

-- Allow authenticated users to delete files.
CREATE POLICY "Authenticated users can delete site assets"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'site-assets');

-- Allow anyone to read files from this public bucket.
CREATE POLICY "Public can read site assets"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'site-assets');

-- -------------------------------------------------------
-- Done!
-- • site_content table is ready for the Admin site editor.
-- • site-assets storage bucket is ready for image uploads.
-- -------------------------------------------------------
