-- ============================================================
-- Dig Track Pro — Fix site_content public visibility
-- Copy and paste this entire script into the Supabase SQL Editor
-- (Dashboard → SQL Editor → New query) and click "Run".
-- ============================================================

-- -------------------------------------------------------
-- 1. Allow anonymous (public) visitors to read site_content
--    so that admin-edited landing-page copy is visible to
--    all visitors without requiring authentication.
-- -------------------------------------------------------
CREATE POLICY IF NOT EXISTS "Public can read site_content"
  ON public.site_content
  FOR SELECT
  TO anon
  USING (true);

-- -------------------------------------------------------
-- 2. Replace the empty seed row with proper default content
--    so the frontend never receives an empty {} object,
--    which previously caused a white screen crash.
-- -------------------------------------------------------
INSERT INTO public.site_content (id, content)
VALUES (
  'main',
  '{
    "hero": {
      "title": "Stop Chasing 811 Tickets. Start Running Your Jobs.",
      "subtitle": "Dig Track Pro is the only centralized dashboard built specifically for excavation contractors to organize and track 811 tickets across every job site. Stay organized. Stay compliant. Stay in control.",
      "image": "https://picsum.photos/seed/excavator/1200/800"
    },
    "showcase": [
      { "img": "https://picsum.photos/seed/heavy-machinery/800/600", "title": "Central Dashboard", "desc": "A bird'\''s eye view of every active ticket across all your projects." },
      { "img": "https://picsum.photos/seed/construction-worker/800/600", "title": "Mobile Field Access", "desc": "Foremen can check ticket status and upload mark-out photos on site." },
      { "img": "https://picsum.photos/seed/blueprint/800/600", "title": "Smart Notifications", "desc": "Never miss a renewal deadline with our proactive alert system." }
    ],
    "cta": {
      "title": "Stop Managing Tickets. Start Managing Your Business.",
      "subtitle": "The \"Ticket Chaos\" ends today. Join the hundreds of contractors who have traded their sticky notes for Dig Track Pro."
    },
    "footer": {
      "text": "© 2025 Dig Track Pro. Built for contractors who move the earth."
    }
  }'::jsonb
)
ON CONFLICT (id) DO UPDATE
  SET content = EXCLUDED.content,
      updated_at = now()
  WHERE public.site_content.content = '{}'::jsonb;

-- -------------------------------------------------------
-- Done!
-- • site_content is now readable by anonymous visitors.
-- • The default seed row contains proper content instead
--   of an empty {} that previously crashed the frontend.
-- -------------------------------------------------------
