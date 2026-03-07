
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
} from "lucide-react";
import { useInternships } from "@/hooks/useInternships";
import { useEvents } from "@/hooks/useEvents";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { ProfileProgress } from "./ProfileProgress";


function ProgressRing({ value, size = 80, strokeWidth = 6, color = "text-primary" }: { value: number; size?: number; strokeWidth?: number; color?: string }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(var(--border))" strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className={`${color} transition-all duration-1000 ease-out`} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-extrabold font-display">{value}%</span>
      </div>
    </div>
  );
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
  const { applications, registrations, milestones, mentorships, loading: statsLoading } = useDashboardStats();

  const openInternships = internships.filter(i => i.status === 'open').slice(0, 4);
  const upcomingEvents = events.filter(e => e.status === 'upcoming').slice(0, 3);

  // Calculate average skill score from milestones or default to 78
  const skillScore = milestones.length > 0
    ? Math.round(milestones.reduce((acc, m) => acc + m.progress_percent, 0) / milestones.length)
    : 78;


  return (
    <div className="space-y-6">
      {/* 1. Quick Stats Row (Bento Top) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Briefcase, value: openInternships.length, label: "Open Internships", color: "bg-primary/10", iconColor: "text-primary" },
          { icon: BookOpen, value: applications, label: "Applications", color: "bg-success/10", iconColor: "text-success" },
          { icon: Calendar, value: registrations, label: "Upcoming Events", color: "bg-accent/10", iconColor: "text-accent" },
          { icon: Users, value: mentorships > 0 ? mentorships : "150+", label: mentorships > 0 ? "Active Mentors" : "Alumni Network", color: "bg-warning/10", iconColor: "text-warning" },
        ].map((stat, i) => (

          <Card key={stat.label} variant="glass" className="p-4 group card-hover-lift border-white/5 hover:border-white/10 transition-all">
            <div className="flex items-center gap-4">
              <div className={`h-12 w-12 rounded-2xl ${stat.color} flex items-center justify-center transition-transform duration-300 group-hover:rotate-6`}>
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
              <div>
                <div className="text-3xl font-black font-display tracking-tight">{stat.value}</div>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide">{stat.label}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 2. Main Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Profile & Quick Actions (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <ProfileProgress />

          {/* Quick Actions Widget */}
          <Card variant="glass" className="border-primary/10 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
            <CardHeader className="pb-3 text-left">
              <CardTitle className="text-sm font-black font-display uppercase tracking-widest flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary animate-pulse" />
                Neural Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              {[
                { label: "Build Resume", icon: FileText, color: "text-primary", bg: "bg-primary/10" },
                { label: "Book Mentor", icon: Users, color: "text-warning", bg: "bg-warning/10" },
                { label: "Mock Interview", icon: MessageSquare, color: "text-accent", bg: "bg-accent/10" },
                { label: "Search Jobs", icon: Briefcase, color: "text-success", bg: "bg-success/10" },
              ].map((action) => (
                <Button
                  key={action.label}
                  variant="ghost"
                  className={`h-auto py-4 flex flex-col items-center gap-2 rounded-2xl border border-white/5 ${action.bg} hover:scale-[1.02] transition-all`}
                >
                  <action.icon className={`h-5 w-5 ${action.color}`} />
                  <span className="text-[10px] font-bold uppercase tracking-tighter">{action.label}</span>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Nexus Vision AI Widget (Moved here for better flow) */}
          <Card variant="glass" className="relative overflow-hidden group border-accent/20">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-primary/10" />
            <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <Zap className="h-24 w-24 text-accent" />
            </div>
            <CardHeader className="pb-2 text-left">
              <CardTitle className="text-sm font-display font-black flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                NEXUS VISION
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-[11px] leading-relaxed text-muted-foreground font-medium italic text-left">
                "Based on your skill score of {skillScore}, you're on a trajectory for <span className="text-accent font-bold">Principal Software Architect</span> roles in roughly 3.2 years."
              </p>
              <Button size="sm" variant="ghost" className="w-full h-8 text-[10px] font-bold uppercase tracking-widest bg-white/5 border border-white/10 hover:bg-accent/10 hover:text-accent hover:border-accent/30">
                Unlock Projection
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Main Content Area (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <NeuralGrowthHub skillScore={skillScore} />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Recommendations (7 cols) */}
            <div className="md:col-span-7 space-y-6">
              <Card variant="glass" className="border-primary/10 overflow-hidden relative h-full">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="text-left">
                    <CardTitle className="text-xl font-display font-bold">Recommended Internships</CardTitle>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mt-1">Curated for your profile</p>
                  </div>
                  <Button variant="outline" size="sm" className="hidden sm:flex group h-8 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold px-4">
                    View All <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {openInternships.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 text-left">
                      {openInternships.map((internship) => (
                        <div key={internship.id} className="group relative p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 hover:bg-primary/5 transition-all duration-300">
                          <div className="flex items-start gap-4">
                            <div className="h-10 w-10 rounded-xl bg-background border border-white/10 flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                              <Briefcase className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-bold text-sm truncate group-hover:text-primary transition-colors">{internship.title}</h4>
                                <Badge variant="outline" className="text-[8px] h-4 bg-primary/5 border-primary/20">{internship.location || "Remote"}</Badge>
                              </div>
                              <p className="text-[10px] text-muted-foreground font-medium truncate mb-2">{internship.company_name}</p>
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-[9px] text-muted-foreground font-bold">2 Months</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Zap className="h-3 w-3 text-primary" />
                                  <span className="text-[9px] font-bold text-primary">{internship.stipend ? `₹${(internship.stipend / 1000).toFixed(1)}k` : "Unpaid"}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-white/5 rounded-3xl">
                      <div className="relative mb-4">
                        <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
                        <Briefcase className="h-10 w-10 text-primary relative z-10" />
                      </div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Neural Scan Complete</p>
                      <p className="text-[10px] text-muted-foreground/60 mt-1">No matches found in current sector.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Side Column in Right section (5 cols) */}
            <div className="md:col-span-5 space-y-6">
              {/* Skill Score Compact Card (Re-added for complete look) */}
              <Card variant="glass" className="group overflow-hidden relative border-primary/10">
                <div className="absolute top-0 right-0 p-3 opacity-20"><Zap className="h-12 w-12 text-primary" /></div>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-6">
                    <div className="relative shrink-0">
                      <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                      <ProgressRing value={skillScore} size={70} strokeWidth={6} />
                    </div>
                    <div className="text-left">
                      <div className="text-lg font-bold font-display">Skill Score</div>
                      <p className="text-[10px] text-muted-foreground mt-1 max-w-[120px]">Top 5% of your cohort this week.</p>
                      <div className="flex gap-1 mt-2">
                        {badges.slice(0, 3).map((badge, idx) => (
                          <badge.icon key={idx} className={`h-3 w-3 ${badge.earned ? badge.color : 'text-muted-foreground opacity-30'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card variant="glass" className="border-accent/10">
                <CardHeader className="pb-2 text-left">
                  <CardTitle className="flex items-center gap-2 font-display font-bold text-lg">
                    <Calendar className="h-5 w-5 text-accent" />
                    Upcoming
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-left">
                  {upcomingEvents.length > 0 ? upcomingEvents.slice(0, 2).map((event) => (
                    <div key={event.id} className="relative p-3 rounded-xl bg-white/5 border border-white/5 hover:border-accent/20 hover:bg-accent/5 transition-all group">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-center justify-center h-10 w-10 rounded-lg bg-background border border-white/10 shrink-0">
                          <span className="text-[8px] font-black uppercase text-muted-foreground">{event.start_datetime ? new Date(event.start_datetime).toLocaleDateString('en-US', { month: 'short' }) : '-'}</span>
                          <span className="text-base font-black font-display text-accent">{event.start_datetime ? new Date(event.start_datetime).getDate() : '-'}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-[10px] truncate uppercase tracking-tighter">{event.title}</p>
                          <p className="text-[8px] text-muted-foreground truncate uppercase">{event.venue || "Online"}</p>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <p className="text-center py-4 text-xs text-muted-foreground">No upcoming events.</p>
                  )}
                  <Button size="sm" variant="outline" className="w-full text-[10px] font-black uppercase tracking-widest h-10 border-accent/20 hover:bg-accent/10">View Schedule</Button>
                </CardContent>
              </Card>

              <Card variant="glass" className="border-warning/20">
                <CardHeader className="pb-2 text-left">
                  <CardTitle className="flex items-center gap-2 font-display font-bold text-lg">
                    <Users className="h-5 w-5 text-warning" />
                    Mentorship
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-left">
                    <div className="p-4 rounded-2xl bg-warning/5 border border-warning/10 relative overflow-hidden group">
                      <div className="absolute -right-2 -top-2 opacity-10 group-hover:scale-125 transition-transform duration-500">
                        <Users className="h-16 w-16 text-warning" />
                      </div>
                      <div className="relative z-10">
                        <p className="text-2xl font-black text-warning leading-none">{mentorships}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Active Connections</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full h-10 text-[10px] font-black uppercase tracking-widest border-warning/20 hover:bg-warning/10">
                      Pulse Search
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function NeuralGrowthHub({ skillScore }: { skillScore: number }) {
  const readiness = Math.min(100, (skillScore / 90) * 100);

  return (
    <Card variant="glass" className="overflow-hidden relative bg-black/40 border-white/5 group rounded-[2.5rem]">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5" />
      <div className="absolute -right-12 -bottom-12 h-64 w-64 bg-primary/20 rounded-full blur-[100px] group-hover:bg-primary/30 transition-colors duration-1000" />

      <CardContent className="p-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6 text-left">
            <div className="space-y-2">
              <Badge variant="outline" className="text-[10px] font-black tracking-[0.2em] bg-primary/10 text-primary border-primary/20 uppercase px-3 rounded-full">
                Neural Growth Hub
              </Badge>
              <h2 className="text-3xl font-black font-display tracking-tight leading-none uppercase text-white">
                Placement <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Readiness</span>
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                <span>Current Trajectory</span>
                <span className="text-primary">{readiness.toFixed(0)}% OPTIMAL</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${readiness}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-gradient"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-60 tracking-widest">Avg Stability</p>
                <p className="text-xl font-black font-display text-primary mt-1">94.2%</p>
              </div>
              <div className="p-4 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60 tracking-widest">Sector Sync</p>
                <p className="text-xl font-black font-display text-accent mt-1">Active</p>
              </div>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="h-56 w-56 relative flex items-center justify-center">
              {/* Spinning Neural Circles */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-[2px] border-dashed border-primary/20 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-6 border-[2px] border-dotted border-accent/20 rounded-full"
              />
              <div className="relative z-10 text-center space-y-1">
                <p className="text-5xl font-black font-display tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">{skillScore}</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">Global Rank</p>
              </div>

              {/* Neural Particles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.2, 0.5, 0.2],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 4 + i,
                    repeat: Infinity,
                    delay: i * 0.5
                  }}
                  className="absolute h-2 w-2 rounded-full bg-primary/40 blur-[2px]"
                  style={{
                    top: `${50 + 40 * Math.sin((i * 60 * Math.PI) / 180)}%`,
                    left: `${50 + 40 * Math.cos((i * 60 * Math.PI) / 180)}%`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
