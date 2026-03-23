-- Sample Data for Academia Connect Pro

-- 1. Industry Partners
INSERT INTO public.industry_partners (name, description, industry_type, website, contact_person, contact_email, status, partnership_since)
VALUES 
('TechCorp Solutions', 'Leading provider of enterprise software.', 'Software', 'https://techcorp.example.com', 'John Doe', 'john.doe@techcorp.example.com', 'active', '2023'),
('InnoHealth Systems', 'Healthcare technology innovators.', 'Healthcare', 'https://innohealth.example.com', 'Sarah Smith', 'sarah.s@innohealth.example.com', 'active', '2024'),
('AutoDrive Dynamics', 'Autonomous vehicle research and development.', 'Automotive', 'https://autodrive.com', 'Mike Ross', 'm.ross@autodrive.com', 'active', '2022');

-- 2. Events
INSERT INTO public.events (title, event_type, description, venue, mode, start_datetime, end_datetime, max_participants, current_registrations, status)
VALUES 
('Future of AI Seminar', 'Seminar', 'A deep dive into AI trends.', 'Main Hall A', 'offline', NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days 4 hours', 100, 45, 'upcoming'),
('Networking Mixer 2026', 'Networking', 'Meet industry leaders.', 'Grand Ballroom', 'offline', NOW() + INTERVAL '5 days', NOW() + INTERVAL '5 days 3 hours', 200, 80, 'upcoming'),
('React Workshop', 'Workshop', 'Advanced React patterns.', 'Virtual Room 4', 'online', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day 2 hours', 50, 50, 'completed');

-- 3. Internships
INSERT INTO public.internships (title, company_name, description, location, mode, duration, stipend, positions, status, application_deadline)
VALUES 
('Frontend Developer Intern', 'TechCorp Solutions', 'Work on React applications.', 'Remote', 'online', '3 months', 15000, 5, 'open', NOW() + INTERVAL '10 days'),
('Data Analyst Intern', 'InnoHealth Systems', 'Analyze health data trends.', 'Chicago, IL', 'offline', '6 months', 20000, 2, 'open', NOW() + INTERVAL '15 days'),
('Machine Learning Intern', 'AutoDrive Dynamics', 'Build training models.', 'Austin, TX', 'hybrid', '4 months', 25000, 3, 'open', NOW() + INTERVAL '7 days');

-- 4. MOUs
INSERT INTO public.mous (title, partner_name, description, start_date, end_date, budget, status)
VALUES 
('Strategic Partnership MOU', 'TechCorp Solutions', 'Collaboration on student placements.', NOW(), NOW() + INTERVAL '1 year', 500000, 'active'),
('Research Collaboration MOU', 'InnoHealth Systems', 'Joint research on medical AI.', NOW(), NOW() + INTERVAL '2 years', 1200000, 'active');

-- 5. Alumni
INSERT INTO public.alumni (full_name, email, graduation_year, department, current_company, current_position, is_mentor)
VALUES 
('Alice Johnson', 'alice.j@example.com', 2020, 'Computer Science', 'Google', 'Senior Developer', true),
('Bob Wilson', 'bob.w@example.com', 2018, 'Information Technology', 'Microsoft', 'Product Manager', true),
('Charlie Davis', 'charlie.d@example.com', 2022, 'Electronics', 'Intel', 'Hardware Engineer', false);
