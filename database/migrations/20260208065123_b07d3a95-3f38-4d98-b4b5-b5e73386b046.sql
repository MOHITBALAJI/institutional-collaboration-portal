-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.mous;
ALTER PUBLICATION supabase_realtime ADD TABLE public.internships;
ALTER PUBLICATION supabase_realtime ADD TABLE public.events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.industry_partners;
ALTER PUBLICATION supabase_realtime ADD TABLE public.alumni;
ALTER PUBLICATION supabase_realtime ADD TABLE public.research_projects;