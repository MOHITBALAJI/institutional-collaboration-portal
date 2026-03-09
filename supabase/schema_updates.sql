-- ============================================================
-- ACADEMIA CONNECT PRO — Complete Database Schema
-- ============================================================
-- INSTRUCTIONS:
-- 1. Go to your Supabase Dashboard -> SQL Editor.
-- 2. Click "New Query" and paste this ENTIRE file.
-- 3. Click "Run".
-- This creates ALL tables, enums, policies, storage buckets,
-- and triggers required by the application.
-- ============================================================

-- ========================
--  1. ENUM TYPES
-- ========================
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'industry_partner', 'faculty', 'student', 'alumni');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.event_status AS ENUM ('upcoming', 'ongoing', 'completed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.internship_status AS ENUM ('open', 'closed', 'in_progress', 'completed');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.mou_status AS ENUM ('draft', 'pending_approval', 'active', 'expired', 'terminated');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.research_status AS ENUM ('proposal', 'approved', 'in_progress', 'completed', 'published');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;


-- ========================
--  2. TABLES
-- ========================

-- Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) UNIQUE,
  full_name text,
  email text,
  department text,
  designation text,
  avatar_url text,
  phone text,
  bio text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Safely add columns in case the table already existed with a different schema
DO $$ 
BEGIN
  BEGIN
    ALTER TABLE public.profiles ADD COLUMN user_id uuid REFERENCES auth.users(id) UNIQUE;
  EXCEPTION WHEN duplicate_column THEN END;
  
  BEGIN
    ALTER TABLE public.profiles ADD COLUMN full_name text;
  EXCEPTION WHEN duplicate_column THEN END;
  
  BEGIN
    ALTER TABLE public.profiles ADD COLUMN email text;
  EXCEPTION WHEN duplicate_column THEN END;

  BEGIN
    ALTER TABLE public.profiles ADD COLUMN department text;
  EXCEPTION WHEN duplicate_column THEN END;

  BEGIN
    ALTER TABLE public.profiles ADD COLUMN designation text;
  EXCEPTION WHEN duplicate_column THEN END;

  BEGIN
    ALTER TABLE public.profiles ADD COLUMN preferences jsonb DEFAULT '{}'::jsonb;
  EXCEPTION WHEN duplicate_column THEN END;
END $$;



-- User Roles
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) NOT NULL UNIQUE,
  role public.app_role NOT NULL DEFAULT 'student',
  created_at timestamptz DEFAULT now()
);

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  title text NOT NULL,
  message text NOT NULL,
  type text,
  link text,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Industry Partners
CREATE TABLE IF NOT EXISTS public.industry_partners (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  industry_type text,
  website text,
  logo_url text,
  contact_person text,
  contact_email text,
  contact_phone text,
  address text,
  partnership_since text,
  status text DEFAULT 'active',
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Events
CREATE TABLE IF NOT EXISTS public.events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  event_type text,
  description text,
  venue text,
  mode text,
  start_datetime timestamptz,
  end_datetime timestamptz,
  registration_deadline timestamptz,
  max_participants integer,
  current_registrations integer DEFAULT 0,
  speakers text[],
  organizer text,
  partner_id uuid REFERENCES public.industry_partners(id),
  banner_url text,
  certificate_template text,
  status public.event_status DEFAULT 'upcoming',
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Event Registrations
CREATE TABLE IF NOT EXISTS public.event_registrations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id uuid REFERENCES public.events(id) NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  attended boolean DEFAULT false,
  certificate_issued boolean DEFAULT false,
  check_in_time timestamptz,
  registered_at timestamptz DEFAULT now()
);

-- Internships
CREATE TABLE IF NOT EXISTS public.internships (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  company_name text,
  description text,
  location text,
  mode text,
  duration text,
  stipend integer,
  positions integer,
  skills_required text[],
  requirements text[],
  application_deadline timestamptz,
  start_date timestamptz,
  status public.internship_status DEFAULT 'open',
  partner_id uuid REFERENCES public.industry_partners(id),
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Internship Applications
CREATE TABLE IF NOT EXISTS public.internship_applications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  internship_id uuid REFERENCES public.internships(id) NOT NULL,
  student_id uuid REFERENCES auth.users(id) NOT NULL,
  resume_url text,
  cover_letter text,
  status text DEFAULT 'pending',
  feedback text,
  reviewed_by uuid REFERENCES auth.users(id),
  reviewed_at timestamptz,
  applied_at timestamptz DEFAULT now()
);

-- MOUs (Memorandum of Understanding)
CREATE TABLE IF NOT EXISTS public.mous (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  partner_id uuid REFERENCES public.industry_partners(id),
  partner_name text,
  description text,
  objectives text[],
  key_deliverables text[],
  start_date timestamptz,
  end_date timestamptz,
  budget numeric,
  status public.mou_status DEFAULT 'draft',
  document_url text,
  assigned_faculty uuid,
  approved_by uuid,
  approved_at timestamptz,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- MoU Status History
CREATE TABLE IF NOT EXISTS public.mou_status_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  mou_id uuid REFERENCES public.mous(id) NOT NULL,
  old_status public.mou_status,
  new_status public.mou_status NOT NULL,
  changed_by uuid,
  change_reason text,
  created_at timestamptz DEFAULT now()
);

-- Alumni
CREATE TABLE IF NOT EXISTS public.alumni (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  full_name text NOT NULL,
  email text,
  phone text,
  department text,
  degree text,
  graduation_year integer,
  current_company text,
  current_position text,
  linkedin_url text,
  is_mentor boolean DEFAULT false,
  mentorship_areas text[],
  availability text,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Mentorship Sessions
CREATE TABLE IF NOT EXISTS public.mentorship_sessions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid REFERENCES auth.users(id) NOT NULL,
  mentor_id uuid REFERENCES public.alumni(id) NOT NULL,
  topic text,
  scheduled_at timestamptz,
  duration_minutes integer,
  meeting_link text,
  status text DEFAULT 'scheduled',
  notes text,
  feedback text,
  rating integer,
  created_at timestamptz DEFAULT now()
);

-- Research Projects
CREATE TABLE IF NOT EXISTS public.research_projects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  abstract text,
  principal_investigator text,
  co_investigators text[],
  methodology text,
  objectives text[],
  funding_source text,
  funding_amount numeric,
  start_date timestamptz,
  end_date timestamptz,
  publications text[],
  patents text[],
  status public.research_status DEFAULT 'proposal',
  partner_id uuid REFERENCES public.industry_partners(id),
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Collaboration Stats
CREATE TABLE IF NOT EXISTS public.collaboration_stats (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  stat_date date NOT NULL,
  total_mous integer DEFAULT 0,
  active_mous integer DEFAULT 0,
  industry_partners integer DEFAULT 0,
  total_internships integer DEFAULT 0,
  active_internships integer DEFAULT 0,
  students_placed integer DEFAULT 0,
  events_conducted integer DEFAULT 0,
  research_projects integer DEFAULT 0,
  publications integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Resume Profiles
CREATE TABLE IF NOT EXISTS public.resume_profiles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) NOT NULL UNIQUE,
  full_name text,
  title text,
  email text,
  phone text,
  location text,
  summary text,
  theme varchar(50) DEFAULT 'modern',
  github_url text,
  linkedin_url text,
  portfolio_url text,
  skills text[],
  experience jsonb,
  education jsonb,
  projects jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Mentorship Requests
CREATE TABLE IF NOT EXISTS public.mentorship_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid REFERENCES auth.users(id) NOT NULL,
  mentor_id uuid REFERENCES auth.users(id) NOT NULL,
  status varchar(20) CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')) DEFAULT 'pending',
  message text,
  meeting_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Career Coach Chat History
CREATE TABLE IF NOT EXISTS public.career_chats (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  session_title text,
  messages jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Learning Milestones
CREATE TABLE IF NOT EXISTS public.learning_milestones (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  category varchar(50) NOT NULL,
  level integer DEFAULT 1,
  progress_percent integer DEFAULT 0,
  is_completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Safely add created_by to other tables in case they already existed
DO $$ 
BEGIN
  BEGIN
    ALTER TABLE public.industry_partners ADD COLUMN created_by uuid REFERENCES auth.users(id);
  EXCEPTION WHEN duplicate_column THEN END;

  BEGIN
    ALTER TABLE public.events ADD COLUMN created_by uuid REFERENCES auth.users(id);
  EXCEPTION WHEN duplicate_column THEN END;

  BEGIN
    ALTER TABLE public.internships ADD COLUMN created_by uuid REFERENCES auth.users(id);
  EXCEPTION WHEN duplicate_column THEN END;

  BEGIN
    ALTER TABLE public.mous ADD COLUMN created_by uuid REFERENCES auth.users(id);
  EXCEPTION WHEN duplicate_column THEN END;

  BEGIN
    ALTER TABLE public.research_projects ADD COLUMN created_by uuid REFERENCES auth.users(id);
  EXCEPTION WHEN duplicate_column THEN END;
END $$;


-- ========================
--  3. ROW LEVEL SECURITY
-- ========================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internship_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industry_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mous ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mou_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumni ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_milestones ENABLE ROW LEVEL SECURITY;


-- ========================
--  4. RLS POLICIES
-- ========================

-- Profiles: users can read all, manage own
CREATE POLICY "Profiles are viewable by all authenticated users" ON public.profiles FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- User Roles: users can read own, insert own
CREATE POLICY "Users can view their own role" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own role" ON public.user_roles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Notifications: users see own
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Events: all authenticated users can read
CREATE POLICY "Events are viewable by all authenticated users" ON public.events FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can create events" ON public.events FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Event creators can update their events" ON public.events FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Event creators can delete their events" ON public.events FOR DELETE USING (auth.uid() = created_by);

-- Event Registrations
CREATE POLICY "Users can view their own registrations" ON public.event_registrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can register for events" ON public.event_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Internships: all authenticated users can read
CREATE POLICY "Internships viewable by all authenticated users" ON public.internships FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can create internships" ON public.internships FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Internship creators can update" ON public.internships FOR UPDATE USING (auth.uid() = created_by);

-- Internship Applications
CREATE POLICY "Students can view their own applications" ON public.internship_applications FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can apply to internships" ON public.internship_applications FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Industry Partners: all authenticated can read
CREATE POLICY "Partners viewable by all authenticated users" ON public.industry_partners FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can add partners" ON public.industry_partners FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Partner creators can update" ON public.industry_partners FOR UPDATE USING (auth.uid() = created_by);

-- MOUs: all authenticated can read
CREATE POLICY "MOUs viewable by all authenticated users" ON public.mous FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can create MOUs" ON public.mous FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "MOU creators can update" ON public.mous FOR UPDATE USING (auth.uid() = created_by);

-- MoU Status History
CREATE POLICY "MOU history viewable by all authenticated" ON public.mou_status_history FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can log MOU changes" ON public.mou_status_history FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Alumni: all authenticated can read
CREATE POLICY "Alumni viewable by all authenticated users" ON public.alumni FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can manage their own alumni record" ON public.alumni FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Alumni can update own record" ON public.alumni FOR UPDATE USING (auth.uid() = user_id);

-- Mentorship Sessions
CREATE POLICY "Mentorship sessions viewable by participant" ON public.mentorship_sessions FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can create mentorship sessions" ON public.mentorship_sessions FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Research Projects: all authenticated
CREATE POLICY "Research viewable by all authenticated" ON public.research_projects FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can create research" ON public.research_projects FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Research creators can update" ON public.research_projects FOR UPDATE USING (auth.uid() = created_by);

-- Collaboration Stats: all authenticated
CREATE POLICY "Stats viewable by all authenticated" ON public.collaboration_stats FOR SELECT USING (auth.uid() IS NOT NULL);

-- Resume Profiles
CREATE POLICY "Users can view their own resume" ON public.resume_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own resume" ON public.resume_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own resume" ON public.resume_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Mentorship Requests
CREATE POLICY "Users can view own mentorship requests" ON public.mentorship_requests FOR SELECT USING (auth.uid() = student_id OR auth.uid() = mentor_id);
CREATE POLICY "Students can create mentorship requests" ON public.mentorship_requests FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Mentors can update request status" ON public.mentorship_requests FOR UPDATE USING (auth.uid() = mentor_id);

-- Career Chats
CREATE POLICY "Users can manage own career chats" ON public.career_chats FOR ALL USING (auth.uid() = user_id);

-- Learning Milestones
CREATE POLICY "Users can view own milestones" ON public.learning_milestones FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own milestones" ON public.learning_milestones FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own milestones" ON public.learning_milestones FOR UPDATE USING (auth.uid() = user_id);


-- ========================
--  5. FUNCTIONS & TRIGGERS
-- ========================

-- has_role function
CREATE OR REPLACE FUNCTION public.has_role(_role public.app_role, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- Auto-assign student role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)))
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student')
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Drop existing trigger if any, then create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ========================
--  6. STORAGE BUCKET
-- ========================
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies (using auth.uid() only, compatible with all Supabase versions)
DO $$ BEGIN
  CREATE POLICY "Resume Public Read" ON storage.objects FOR SELECT USING (bucket_id = 'resumes');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users upload own resume" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'resumes' AND (select auth.uid()) IS NOT NULL);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users update own resume" ON storage.objects FOR UPDATE USING (bucket_id = 'resumes' AND (select auth.uid()) IS NOT NULL);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
