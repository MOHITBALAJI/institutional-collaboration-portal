import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Building2,
  Users,
  Briefcase,
  FileText,
  Calendar,
  ArrowRight,
  Clock,
  TrendingUp,
  Award,
  UserCheck,
  Target,
  BarChart3,
  GraduationCap,
  Zap,
  IndianRupee,
  MessageSquare,
} from "lucide-react";
import { motion } from "framer-motion";
import { useMoUs } from "@/hooks/useMoUs";
import { useInternships } from "@/hooks/useInternships";
import { useEvents } from "@/hooks/useEvents";
import { ProgressRing } from "./ProgressRing";

// Animated funnel bar
function FunnelBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-bold">{value}</span>
      </div>
      <div className="h-3 rounded-full bg-secondary/50 overflow-hidden">
        <div
          className={`h-full rounded-full ${color} animate-progress-bar`}
          style={{ "--bar-width": `${percentage}%` } as React.CSSProperties}
        />
      </div>
    </div>
  );
}

export function IndustryPartnerDashboard() {
  const { mous } = useMoUs();
  const { internships } = useInternships();
  const { events } = useEvents();

  const activeMous = mous.filter(m => m.status === 'active');
  const openPositions = internships.filter(i => i.status === 'open');
  const upcomingEvents = events.filter(e => e.status === 'upcoming').slice(0, 3);

  return (
    <div className="space-y-6">
      {/* 1. Impact Summary Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: FileText, value: activeMous.length, label: "Active MoUs", color: "bg-primary/10", iconColor: "text-primary" },
          { icon: Briefcase, value: openPositions.length, label: "Positions", color: "bg-accent/10", iconColor: "text-accent" },
          { icon: GraduationCap, value: 24, label: "Campus Hires", color: "bg-success/10", iconColor: "text-success" },
          { icon: Award, value: "4.7", label: "Partner Rating", color: "bg-warning/10", iconColor: "text-warning" },
        ].map((stat) => (
          <Card key={stat.label} variant="glass" className="p-4 group border-white/5 hover:border-white/10 transition-all">
            <div className="flex items-center gap-4">
              <div className={`h-12 w-12 rounded-2xl ${stat.color} flex items-center justify-center transition-transform duration-300 group-hover:rotate-6`}>
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
              <div>
                <div className="text-2xl font-black font-display tracking-tight">{stat.value}</div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 2. Main Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Funnel & Quick Actions (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <Card variant="glass" className="border-accent/10 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5" />
            <CardHeader className="pb-3 text-left">
              <CardTitle className="text-sm font-black font-display uppercase tracking-widest flex items-center gap-2">
                <Zap className="h-4 w-4 text-accent animate-pulse" />
                Partner Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              {[
                { label: "New Listing", icon: Briefcase, color: "text-primary", bg: "bg-primary/10" },
                { label: "Bulk Shortlist", icon: UserCheck, color: "text-success", bg: "bg-success/10" },
                { label: "Book Slot", icon: Calendar, color: "text-warning", bg: "bg-warning/10" },
                { label: "Sync Talent", icon: Users, color: "text-accent", bg: "bg-accent/10" },
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

          <Card variant="glass" className="border-primary/10">
            <CardHeader className="pb-4 text-left">
              <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" /> Hiring Funnel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {[
                { label: "Applications", value: 120, max: 120, color: "bg-primary" },
                { label: "Shortlisted", value: 45, max: 120, color: "bg-accent" },
                { label: "Interviews", value: 20, max: 120, color: "bg-warning" },
                { label: "Hired", value: 5, max: 120, color: "bg-success" },
              ].map((step) => (
                <div key={step.label} className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-muted-foreground">{step.label}</span>
                    <span className="text-primary">{step.value}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div className={`h-full ${step.color}`} style={{ width: `${(step.value / step.max) * 100}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card variant="glass" className="relative overflow-hidden group border-accent/20">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-primary/10" />
            <CardHeader className="pb-2 text-left">
              <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-accent" /> Talent Yield
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-left">
              <p className="text-[11px] text-muted-foreground font-medium italic">
                "Your conversion rate for <span className="text-accent font-bold">Frontend Roles</span> is 12% higher than industry average this quarter."
              </p>
              <Button size="sm" variant="outline" className="w-full text-[10px] font-black tracking-widest uppercase h-8 border-accent/20 hover:bg-accent/10">
                Analytics Hub
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Main Content Area (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <TalentPipelineSync />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Listings (7 cols) */}
            <div className="md:col-span-7 space-y-6">
              <Card variant="glass" className="border-primary/10 overflow-hidden relative h-full">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="text-left">
                    <CardTitle className="text-xl font-display font-bold">Active Listings</CardTitle>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1">Recruitment Management</p>
                  </div>
                  <Button variant="outline" size="sm" className="hidden sm:flex group h-8 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-[10px] uppercase font-bold px-4">
                    All Posts <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 text-left">
                    {openPositions.length > 0 ? openPositions.slice(0, 3).map((pos) => (
                      <div key={pos.id} className="p-4 rounded-3xl bg-white/5 border border-white/5 hover:border-primary/20 hover:bg-primary/5 transition-all group relative overflow-hidden">
                        <div className="absolute -right-2 -top-2 opacity-5 group-hover:scale-110 transition-transform">
                          <Briefcase className="h-16 w-16 text-primary" />
                        </div>
                        <h4 className="font-bold text-sm truncate group-hover:text-primary transition-colors">{pos.title}</h4>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex gap-1">
                            {pos.skills_required?.slice(0, 2).map((s, i) => (
                              <Badge key={i} variant="outline" className="text-[8px] uppercase tracking-tighter bg-white/5 border-white/10">{s}</Badge>
                            ))}
                          </div>
                          <span className="text-[11px] font-black text-primary font-display">₹{(pos.stipend / 1000).toFixed(0)}k/mo</span>
                        </div>
                      </div>
                    )) : (
                      <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-white/5 rounded-3xl">
                        <Briefcase className="h-10 w-10 text-primary/40 mb-2" />
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">No active listings</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Side Column in Right section (5 cols) */}
            <div className="md:col-span-5 space-y-6">
              <Card variant="glass" className="border-accent/10">
                <CardHeader className="pb-2 text-left">
                  <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-accent" /> Campus Presence
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-accent/20 hover:bg-accent/5 transition-all text-left">
                      <div className="h-10 w-10 rounded-xl bg-background border border-white/10 flex flex-col items-center justify-center shrink-0">
                        <span className="text-[7px] font-black uppercase text-muted-foreground">{event.start_datetime ? new Date(event.start_datetime).toLocaleDateString('en-US', { month: 'short' }) : '---'}</span>
                        <span className="text-base font-black font-display text-accent">{event.start_datetime ? new Date(event.start_datetime).getDate() : '--'}</span>
                      </div>
                      <div className="min-w-0">
                        <h5 className="text-[10px] font-bold truncate uppercase tracking-tighter leading-none">{event.title}</h5>
                        <p className="text-[9px] text-muted-foreground mt-1 truncate uppercase">{event.mode || 'Online'}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card variant="glass" className="border-warning/20">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-16 w-16 rounded-full bg-warning/10 flex items-center justify-center mb-4 relative">
                      <div className="absolute inset-0 bg-warning/20 blur-xl rounded-full" />
                      <UserCheck className="h-8 w-8 text-warning relative z-10" />
                    </div>
                    <h3 className="text-lg font-bold font-display leading-tight">Partner Nexus</h3>
                    <p className="text-[10px] text-muted-foreground mt-2 px-2 uppercase tracking-wide font-bold">Access premium recruitment tools and insights.</p>
                    <Button variant="ghost" className="mt-4 text-[10px] font-black uppercase tracking-widest w-full border border-warning/10 hover:bg-warning/10 hover:text-warning hover:border-warning/30">
                      Nexus Portal
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

function TalentPipelineSync() {
  return (
    <Card variant="glass" className="overflow-hidden relative bg-black/40 border-white/5 group rounded-[2.5rem]">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5" />
      <div className="absolute -right-12 -top-12 h-64 w-64 bg-accent/20 rounded-full blur-[100px] group-hover:bg-accent/30 transition-colors duration-1000" />

      <CardContent className="p-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6 text-left">
            <div className="space-y-2">
              <Badge variant="outline" className="text-[10px] font-black tracking-[0.2em] bg-accent/10 text-accent border-accent/20 uppercase px-3 rounded-full">
                Talent Pipeline Sync
              </Badge>
              <h2 className="text-3xl font-black font-display tracking-tight leading-none uppercase text-white">
                Hiring <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">Intelligence</span>
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                <span>Network Reach</span>
                <span className="text-accent">GLOBAL ACCESS</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "88%" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-accent via-primary to-accent bg-[length:200%_auto] animate-gradient"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-60 tracking-widest">Matched Talent</p>
                <p className="text-xl font-black font-display text-accent mt-1">420</p>
              </div>
              <div className="p-4 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60 tracking-widest">Sync Health</p>
                <p className="text-xl font-black font-display text-primary mt-1">99.4%</p>
              </div>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full animate-pulse" />
              <ProgressRing value={88} size={180} strokeWidth={12} color="text-accent" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Target className="h-8 w-8 text-accent mb-1" />
                <span className="text-xs font-black uppercase tracking-widest">Sync</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
