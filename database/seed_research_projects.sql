-- ============================================================
-- ACADEMIA CONNECT PRO — Seed Research Projects
-- ============================================================
-- Copy and paste this script into your Supabase SQL Editor to
-- populate the Research Hub with mock data.
-- ============================================================

INSERT INTO public.research_projects 
(title, abstract, principal_investigator, co_investigators, funding_amount, status, objectives, methodology) 
VALUES 
(
  'Sustainable Biodegradable Polymers for Packaging', 
  'Creating cost-effective, rapidly biodegradable polymers from agricultural waste to replace single-use plastics. The project has already secured initial funding and is looking for waitlist members.', 
  'Prof. Neha Gupta', 
  ARRAY['Dr. Alan Smith', 'Dr. Bob Vance'], 
  800000, 
  'approved', 
  ARRAY['Sustainability', 'Materials Science', 'Green Tech'], 
  'We synthesize the material from sugarcane bagasse and test degradation in varying environments.'
),
(
  'AI-Driven Crop Yield Prediction Models', 
  'Utilizing satellite imagery and terrestrial sensor data to train deep learning models that predict crop yields months in advance. Seeking partners to provide initial datasets.', 
  'Dr. Vikram Singh', 
  ARRAY['Alice Wang'], 
  1250000, 
  'proposal', 
  ARRAY['Artificial Intelligence', 'Agriculture', 'Predictive Modeling'], 
  'CNN models applied on multispectral satellite data over a 5-year period.'
),
(
  'Next-Gen Solid State Batteries for EVs', 
  'Researching solid electrolytes that offer higher energy density and superior safety compared to traditional Li-ion batteries.', 
  'Prof. Rakesh Kumar', 
  ARRAY['Dr. X', 'Researcher Y', 'Postdoc Z'], 
  2500000, 
  'proposal', 
  ARRAY['EV', 'Energy Storage', 'Hardware'], 
  'Using ceramic-based electrolytes and testing under high pressure/temperature conditions.'
);
