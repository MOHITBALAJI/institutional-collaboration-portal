
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Calendar,
  BookOpen,
  Users,
  ArrowRight,
  Clock,
  MapPin,
  Flame,
  Trophy,
  Medal,
  Zap,
  MessageSquare,
  FileText,
  Radio,
  Activity,
  Code2,
  Terminal,
  Coffee,
} from "lucide-react";
import { useInternships } from "@/hooks/useInternships";
import { useEvents } from "@/hooks/useEvents";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useIndustryPartners } from "@/hooks/useIndustryPartners";
import { useMoUs } from "@/hooks/useMoUs";
import { useAlumni } from "@/hooks/useAlumni";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

// Types for ad-hoc queries
interface ResearchProject {
  id: string;
  title: string;
  principal_investigator: string;
  created_at: string;
}

const badges = [
  { icon: Trophy, label: "First Intern", color: "text-warning", bg: "bg-warning/10", earned: true },
  { icon: Flame, label: "7-Day Streak", color: "text-orange-400", bg: "bg-orange-400/10", earned: true },
  { icon: Medal, label: "Top Applicant", color: "text-primary", bg: "bg-primary/10", earned: false },
  { icon: Zap, label: "Quick Learner", color: "text-accent", bg: "bg-accent/10", earned: true },
];

export function StudentDashboard() {
  const { internships } = useInternships();
  const { events } = useEvents();
  const { applications, registrations, milestones, mentorships } = useDashboardStats();
  const { alumni } = useAlumni();

  const [researchProjects, setResearchProjects] = useState<ResearchProject[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase
        .from("research_projects")
        .select("id, title, principal_investigator, created_at")
        .order("created_at", { ascending: false })
        .limit(3);

      if (data) setResearchProjects(data);
    };
    fetchProjects();
  }, []);

  const openInternships = internships.filter(i => i.status === 'open').slice(0, 3);
  const upcomingEvents = events.filter(e => e.status === 'upcoming').slice(0, 2);
  const skillScore = milestones.length > 0
    ? Math.round(milestones.reduce((acc, m) => acc + m.progress_percent, 0) / milestones.length)
    : 78;

  return (
    <div className="space-y-8 py-2 text-left">
      {/* 1. Header Section: Quick Actions */}
      <Card variant="glass" className="border-primary/10 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <CardHeader className="pb-3">
          <h3 className="text-xs font-black font-display uppercase tracking-widest flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            Quick Actions
          </h3>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Build Resume", icon: FileText, color: "text-primary", bg: "bg-primary/10", path: "/internship-matching" },
            { label: "Book Mentor", icon: Users, color: "text-warning", bg: "bg-warning/10", path: "/mentorship" },
            { label: "Mock Interview", icon: MessageSquare, color: "text-accent", bg: "bg-accent/10", path: "/forum" },
            { label: "Search Jobs", icon: Briefcase, color: "text-success", bg: "bg-success/10", path: "/internships" },
          ].map((action) => (
            <Button
              key={action.label}
              variant="ghost"
              onClick={() => window.location.href = action.path}
              className={`w-full h-14 justify-center gap-3 px-4 rounded-xl border border-white/5 ${action.bg} hover:scale-[1.02] transition-all group shrink-0`}
            >
              <action.icon className={`h-5 w-5 ${action.color} transition-transform group-hover:scale-110`} />
              <span className="text-[10px] font-bold uppercase tracking-widest">{action.label}</span>
            </Button>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 2. Left Column: Core Activities (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Recommended Internships Section */}
          <Card variant="glass" className="border-primary/10 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-xl font-display font-bold">Recommended Internships</CardTitle>
                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold mt-1.5">Curated for your profile</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = '/internships'}
                className="group h-9 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest px-5"
              >
                View All <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {openInternships.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {openInternships.map((internship) => (
                    <div key={internship.id} className="group relative p-5 rounded-3xl bg-white/5 border border-white/5 hover:border-primary/30 hover:bg-primary/5 transition-all duration-500">
                      <div className="flex items-start gap-5">
                        <div className="h-12 w-12 rounded-2xl bg-background border border-white/10 flex items-center justify-center shrink-0 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                          <Briefcase className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1.5">
                            <h4 className="font-bold text-base truncate group-hover:text-primary transition-colors">{internship.title}</h4>
                            <Badge variant="outline" className="text-[9px] h-5 bg-primary/5 border-primary/20 uppercase font-black tracking-widest">
                              {internship.location || "Remote"}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground/80 font-bold truncate mb-3">{internship.company_name}</p>
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="text-[10px] text-muted-foreground font-black uppercase tracking-wider">2 Months</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Zap className="h-3.5 w-3.5 text-primary" />
                              <span className="text-[10px] font-black text-primary uppercase tracking-wider">
                                {internship.stipend ? `₹${(internship.stipend / 1000).toFixed(1)}k` : "Unpaid"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-white/5 rounded-[2.5rem] bg-white/[0.02]">
                  <Briefcase className="h-12 w-12 text-primary opacity-20 mb-4" />
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">No internships available at the moment.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 3. Right Column: Community & Support (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Upcoming Events */}
          <Card variant="glass" className="border-accent/10">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 font-display font-black text-sm uppercase tracking-widest">
                <Calendar className="h-4.5 w-4.5 text-accent" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingEvents.length > 0 ? upcomingEvents.map((event) => (
                <div key={event.id} className="relative p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:border-accent/40 hover:bg-accent/5 transition-all duration-500 group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center justify-center h-11 w-11 rounded-xl bg-background border border-white/10 shrink-0 group-hover:scale-105 transition-transform duration-500">
                      <span className="text-[9px] font-black uppercase text-muted-foreground">{event.start_datetime ? new Date(event.start_datetime).toLocaleDateString('en-US', { month: 'short' }) : '-'}</span>
                      <span className="text-lg font-black font-display text-accent">{event.start_datetime ? new Date(event.start_datetime).getDate() : '-'}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-[11px] truncate uppercase tracking-tighter leading-tight">{event.title}</p>
                      <p className="text-[9px] text-muted-foreground/70 truncate uppercase font-bold tracking-widest mt-1">{event.venue || "Online"}</p>
                    </div>
                  </div>
                </div>
              )) : (
                <p className="text-center py-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">No upcoming events.</p>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.location.href = '/events'}
                className="w-full text-[10px] font-black uppercase tracking-[0.2em] h-11 border-accent/20 bg-accent/5 hover:bg-accent/10 hover:border-accent/40 rounded-2xl transition-all"
              >
                View Schedule
              </Button>
            </CardContent>
          </Card>

          {/* Mentorship Widget */}
          <Card variant="glass" className="border-warning/20 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 opacity-5 pointer-events-none"><Users className="h-24 w-24 text-warning" /></div>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 font-display font-black text-sm uppercase tracking-widest">
                <Users className="h-4.5 w-4.5 text-warning" />
                Mentorship
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="p-5 rounded-[2rem] bg-warning/5 border border-warning/10 text-center">
                <p className="text-3xl font-black text-warning leading-none">{mentorships}</p>
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-2">Active Connections</p>
              </div>

              <div className="pt-2">
                <div className="flex justify-center -space-x-4">
                  {alumni.filter(a => a.is_mentor).slice(0, 5).map((mentor) => (
                    <div key={mentor.id} className="h-11 w-11 rounded-full border-2 border-background ring-2 ring-white/5 bg-secondary flex items-center justify-center relative group cursor-pointer hover:z-20 hover:scale-110 transition-all duration-300 overflow-hidden shadow-xl">
                      <span className="text-[10px] font-black uppercase">{mentor.full_name[0]}</span>
                    </div>
                  ))}
                  <button
                    onClick={() => window.location.href = '/mentorship'}
                    className="h-11 w-11 rounded-full border-2 border-dashed border-white/20 bg-white/5 flex items-center justify-center hover:bg-warning/10 hover:border-warning/40 transition-all group shadow-xl"
                  >
                    <span className="text-xl text-muted-foreground group-hover:text-warning transition-colors font-black">+</span>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
