-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'industry_partner', 'faculty', 'student', 'alumni');

-- Create MoU status enum
CREATE TYPE public.mou_status AS ENUM ('draft', 'pending_approval', 'active', 'expired', 'terminated');

-- Create internship status enum
CREATE TYPE public.internship_status AS ENUM ('open', 'closed', 'in_progress', 'completed');

-- Create research status enum
CREATE TYPE public.research_status AS ENUM ('proposal', 'approved', 'in_progress', 'completed', 'published');

-- Create event status enum
CREATE TYPE public.event_status AS ENUM ('upcoming', 'ongoing', 'completed', 'cancelled');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  department TEXT,
  designation TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE (user_id, role)
);

-- Create industry_partners table
CREATE TABLE public.industry_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  industry_type TEXT,
  contact_person TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  website TEXT,
  logo_url TEXT,
  description TEXT,
  partnership_since DATE,
  status TEXT DEFAULT 'active',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create MoUs table
CREATE TABLE public.mous (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  partner_id UUID REFERENCES public.industry_partners(id) ON DELETE SET NULL,
  partner_name TEXT,
  description TEXT,
  objectives TEXT[],
  start_date DATE,
  end_date DATE,
  status mou_status DEFAULT 'draft' NOT NULL,
  document_url TEXT,
  key_deliverables TEXT[],
  budget DECIMAL(12,2),
  assigned_faculty UUID REFERENCES auth.users(id),
  created_by UUID REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create MoU status history for audit trail
CREATE TABLE public.mou_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mou_id UUID REFERENCES public.mous(id) ON DELETE CASCADE NOT NULL,
  old_status mou_status,
  new_status mou_status NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  change_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create internships table
CREATE TABLE public.internships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  partner_id UUID REFERENCES public.industry_partners(id) ON DELETE SET NULL,
  company_name TEXT,
  description TEXT,
  requirements TEXT[],
  skills_required TEXT[],
  duration TEXT,
  stipend DECIMAL(10,2),
  location TEXT,
  mode TEXT DEFAULT 'hybrid',
  positions INTEGER DEFAULT 1,
  application_deadline DATE,
  start_date DATE,
  status internship_status DEFAULT 'open' NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create internship applications
CREATE TABLE public.internship_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  internship_id UUID REFERENCES public.internships(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES auth.users(id) NOT NULL,
  resume_url TEXT,
  cover_letter TEXT,
  status TEXT DEFAULT 'pending',
  applied_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  feedback TEXT
);

-- Create research projects table
CREATE TABLE public.research_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  principal_investigator UUID REFERENCES auth.users(id),
  co_investigators UUID[],
  partner_id UUID REFERENCES public.industry_partners(id) ON DELETE SET NULL,
  abstract TEXT,
  objectives TEXT[],
  methodology TEXT,
  funding_amount DECIMAL(12,2),
  funding_source TEXT,
  start_date DATE,
  end_date DATE,
  status research_status DEFAULT 'proposal' NOT NULL,
  publications TEXT[],
  patents TEXT[],
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create alumni table
CREATE TABLE public.alumni (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  graduation_year INTEGER,
  department TEXT,
  degree TEXT,
  current_company TEXT,
  current_position TEXT,
  linkedin_url TEXT,
  is_mentor BOOLEAN DEFAULT false,
  mentorship_areas TEXT[],
  availability TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create mentorship sessions
CREATE TABLE public.mentorship_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID REFERENCES public.alumni(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES auth.users(id) NOT NULL,
  topic TEXT,
  scheduled_at TIMESTAMPTZ,
  duration_minutes INTEGER DEFAULT 60,
  status TEXT DEFAULT 'scheduled',
  meeting_link TEXT,
  notes TEXT,
  feedback TEXT,
  rating INTEGER,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  event_type TEXT,
  description TEXT,
  venue TEXT,
  mode TEXT DEFAULT 'offline',
  start_datetime TIMESTAMPTZ,
  end_datetime TIMESTAMPTZ,
  registration_deadline TIMESTAMPTZ,
  max_participants INTEGER,
  current_registrations INTEGER DEFAULT 0,
  speakers TEXT[],
  organizer TEXT,
  partner_id UUID REFERENCES public.industry_partners(id) ON DELETE SET NULL,
  banner_url TEXT,
  status event_status DEFAULT 'upcoming' NOT NULL,
  certificate_template TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create event registrations
CREATE TABLE public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  attended BOOLEAN DEFAULT false,
  check_in_time TIMESTAMPTZ,
  certificate_issued BOOLEAN DEFAULT false,
  registered_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(event_id, user_id)
);

-- Create analytics/stats table
CREATE TABLE public.collaboration_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stat_date DATE NOT NULL,
  total_mous INTEGER DEFAULT 0,
  active_mous INTEGER DEFAULT 0,
  total_internships INTEGER DEFAULT 0,
  active_internships INTEGER DEFAULT 0,
  students_placed INTEGER DEFAULT 0,
  research_projects INTEGER DEFAULT 0,
  publications INTEGER DEFAULT 0,
  events_conducted INTEGER DEFAULT 0,
  industry_partners INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(stat_date)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industry_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mous ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mou_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internship_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumni ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_stats ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  
  -- Default role assignment (can be changed by admin)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student');
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_industry_partners_updated_at BEFORE UPDATE ON public.industry_partners FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_mous_updated_at BEFORE UPDATE ON public.mous FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_internships_updated_at BEFORE UPDATE ON public.internships FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_research_projects_updated_at BEFORE UPDATE ON public.research_projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_alumni_updated_at BEFORE UPDATE ON public.alumni FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- MoU status change logging
CREATE OR REPLACE FUNCTION public.log_mou_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.mou_status_history (mou_id, old_status, new_status, changed_by)
    VALUES (NEW.id, OLD.status, NEW.status, auth.uid());
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_mou_status_change
  AFTER UPDATE ON public.mous
  FOR EACH ROW EXECUTE FUNCTION public.log_mou_status_change();

-- RLS Policies

-- Profiles: Users can read all profiles, update own
CREATE POLICY "Profiles are viewable by authenticated users" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- User roles: Only admins can manage, users can view own
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Industry Partners: Viewable by all authenticated, managed by admin/faculty
CREATE POLICY "Industry partners viewable by authenticated" ON public.industry_partners FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin/faculty can manage partners" ON public.industry_partners FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'faculty'));

-- MoUs: Complex access based on role
CREATE POLICY "MoUs viewable by authenticated" ON public.mous FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin/faculty can manage MoUs" ON public.mous FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'faculty'));

-- MoU History: Viewable by authenticated
CREATE POLICY "MoU history viewable" ON public.mou_status_history FOR SELECT TO authenticated USING (true);

-- Internships: Open ones viewable by all, managed by admin/faculty/industry
CREATE POLICY "Internships viewable by authenticated" ON public.internships FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin/faculty/industry can manage internships" ON public.internships FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'faculty') OR public.has_role(auth.uid(), 'industry_partner'));

-- Internship Applications
CREATE POLICY "Students can view own applications" ON public.internship_applications FOR SELECT TO authenticated USING (auth.uid() = student_id OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'faculty'));
CREATE POLICY "Students can apply" ON public.internship_applications FOR INSERT TO authenticated WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Admin/faculty can manage applications" ON public.internship_applications FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'faculty'));

-- Research Projects
CREATE POLICY "Research viewable by authenticated" ON public.research_projects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Faculty/admin can manage research" ON public.research_projects FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'faculty'));

-- Alumni
CREATE POLICY "Alumni viewable by authenticated" ON public.alumni FOR SELECT TO authenticated USING (true);
CREATE POLICY "Alumni can update own profile" ON public.alumni FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admin can manage alumni" ON public.alumni FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create alumni profile" ON public.alumni FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Mentorship Sessions
CREATE POLICY "Users can view own sessions" ON public.mentorship_sessions FOR SELECT TO authenticated USING (auth.uid() = student_id OR EXISTS (SELECT 1 FROM public.alumni WHERE id = mentor_id AND user_id = auth.uid()));
CREATE POLICY "Students can request sessions" ON public.mentorship_sessions FOR INSERT TO authenticated WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Participants can update sessions" ON public.mentorship_sessions FOR UPDATE TO authenticated USING (auth.uid() = student_id OR EXISTS (SELECT 1 FROM public.alumni WHERE id = mentor_id AND user_id = auth.uid()));

-- Events
CREATE POLICY "Events viewable by all authenticated" ON public.events FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin/faculty can manage events" ON public.events FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'faculty'));

-- Event Registrations
CREATE POLICY "Users can view own registrations" ON public.event_registrations FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can register for events" ON public.event_registrations FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin can manage registrations" ON public.event_registrations FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Collaboration Stats
CREATE POLICY "Stats viewable by authenticated" ON public.collaboration_stats FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can manage stats" ON public.collaboration_stats FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));