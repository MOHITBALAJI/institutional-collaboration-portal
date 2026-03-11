import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Star,
  Award,
  Heart,
  Calendar,
  ArrowRight,
  Clock,
  Target,
  TrendingUp,
  MessageSquare,
  FileText,
  Handshake,
  Zap,
  Briefcase,
} from "lucide-react";
import { motion } from "framer-motion";
import { useMoUs } from "@/hooks/useMoUs";
import { useEvents } from "@/hooks/useEvents";
import { useDashboardStats } from "@/hooks/useDashboardStats";

// Impact ring
function ImpactRing({ value, size = 80, color = "text-primary" }: { value: number; size?: number; color?: string }) {
  const radius = (size - 6) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(var(--border))" strokeWidth={5} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={5}
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          className={`${color} transition-all duration-1000 ease-out`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-extrabold font-display">{value}</span>
      </div>
    </div>
  );
}

export function AlumniDashboard() {
  const { mous } = useMoUs();
  const { events } = useEvents();
  const { mentorships } = useDashboardStats();

  const activeMous = mous.filter(m => m.status === 'active');
  const upcomingEvents = events.filter(e => e.status === 'upcoming').slice(0, 3);

  return (
    <div className="space-y-6">
      {/* 1. Impact Summary Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Heart, value: "42", label: "Impact Score", color: "bg-rose-500/10", iconColor: "text-rose-400" },
          { icon: Users, value: "8", label: "Mentored", color: "bg-primary/10", iconColor: "text-primary" },
          { icon: Star, value: "4.8", label: "Rating", color: "bg-warning/10", iconColor: "text-warning" },
          { icon: Handshake, value: String(activeMous.length), label: "Active MoUs", color: "bg-accent/10", iconColor: "text-accent" },
        ].map((stat) => (
          <Card key={stat.label} variant="glass" className="p-4 group border-white/5 hover:border-white/10 transition-all">
            <div className="flex items-center gap-4">
              <div className={`h-12 w-12 rounded-2xl ${stat.color} flex items-center justify-center transition-transform duration-300 group-hover:rotate-6`}>
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
              <div>
                <div className="text-3xl font-black font-display tracking-tight leading-none">{stat.value}</div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 2. Main Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Stats & Quick Actions (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <Card variant="glass" className="border-accent/10 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5" />
            <CardHeader className="pb-3 text-left">
              <CardTitle className="text-sm font-black font-display uppercase tracking-widest flex items-center gap-2">
                <Zap className="h-4 w-4 text-accent animate-pulse" />
                Alumni Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              {[
                { label: "Post Opportunity", icon: Briefcase, color: "text-primary", bg: "bg-primary/10" },
                { label: "Review Resumes", icon: FileText, color: "text-success", bg: "bg-success/10" },
                { label: "Network Search", icon: Users, color: "text-warning", bg: "bg-warning/10" },
                { label: "Give Feedback", icon: MessageSquare, color: "text-accent", bg: "bg-accent/10" },
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

          <Card variant="glass" className="border-accent/10">
            <CardHeader className="pb-2 text-left">
              <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-accent" /> Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { text: "Mentored Rahul", time: "1d ago", icon: Users, color: "text-primary" },
                  { text: "Resume Review", time: "2d ago", icon: FileText, color: "text-success" },
                  { text: "Guest Lecture", time: "1w ago", icon: Award, color: "text-warning" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                    <div className={`h-8 w-8 rounded-lg bg-background border border-white/10 flex items-center justify-center shrink-0 ${item.color}`}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold leading-tight text-left line-clamp-1 truncate">{item.text}</p>
                      <p className="text-[9px] text-muted-foreground uppercase text-left mt-0.5">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card variant="glass" className="relative overflow-hidden group border-primary/20">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
            <CardHeader className="pb-2 text-left">
              <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" /> Career Pulse
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-[11px] text-muted-foreground font-medium italic text-left">
                "Your expertise in <span className="text-primary font-bold">Cloud Architectures</span> has influenced 4 successful student placements this month."
              </p>
              <Button size="sm" variant="outline" className="w-full text-[10px] font-black tracking-widest uppercase h-8 border-primary/20 hover:bg-primary/10">
                Global Trajectory
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Main Content Area (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <AlumniImpactNexus />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Collaborations (7 cols) */}
            <div className="md:col-span-7 space-y-6">
              <Card variant="glass" className="border-accent/10 h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="text-left">
                    <CardTitle className="text-xl font-display font-bold">Industry Collaborations</CardTitle>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1">Active MoU Engagements</p>
                  </div>
                  <Badge variant="outline" className="border-accent/20 text-accent uppercase tracking-widest text-[9px]">Live Connect</Badge>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    {activeMous.length > 0 ? activeMous.slice(0, 3).map((mou) => (
                      <div key={mou.id} className="p-4 rounded-3xl bg-white/5 border border-white/5 hover:border-accent/20 hover:bg-accent/5 transition-all group relative overflow-hidden text-left">
                        <div className="absolute -right-2 -top-2 opacity-5 group-hover:scale-110 transition-transform">
                          <Handshake className="h-16 w-16 text-accent" />
                        </div>
                        <h4 className="font-bold text-sm truncate group-hover:text-accent transition-colors">{mou.title}</h4>
                        <p className="text-[10px] text-muted-foreground font-medium mt-1 truncate">{mou.partner_name}</p>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-[9px] font-bold text-accent uppercase tracking-tighter">Engagement active</span>
                          <div className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                        </div>
                      </div>
                    )) : (
                      <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-white/5 rounded-3xl">
                        <Handshake className="h-10 w-10 text-accent/40 mb-2" />
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">No active MoUs</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Side column in right section (5 cols) */}
            <div className="md:col-span-5 space-y-6">
              <Card variant="glass" className="border-primary/10">
                <CardHeader className="pb-2 text-left">
                  <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" /> Networking
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 hover:bg-primary/5 transition-all">
                      <div className="h-10 w-10 rounded-xl bg-background border border-white/10 flex flex-col items-center justify-center shrink-0">
                        <span className="text-[7px] font-black uppercase text-muted-foreground">{event.start_datetime ? new Date(event.start_datetime).toLocaleDateString('en-US', { month: 'short' }) : '---'}</span>
                        <span className="text-base font-black font-display text-primary">{event.start_datetime ? new Date(event.start_datetime).getDate() : '--'}</span>
                      </div>
                      <div className="min-w-0 text-left">
                        <h5 className="text-[10px] font-bold leading-tight truncate uppercase tracking-tighter">{event.title}</h5>
                        <p className="text-[9px] text-muted-foreground mt-0.5 truncate uppercase">{event.venue || 'Online'}</p>
                      </div>
                    </div>
                  ))}
                  <Button size="sm" variant="outline" className="w-full text-[10px] font-black tracking-widest uppercase h-8 mt-2 border-primary/20 hover:bg-primary/10">
                    Nexus Schedule
                  </Button>
                </CardContent>
              </Card>

              <Card variant="glass" className="border-warning/20">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-16 w-16 rounded-full bg-warning/10 flex items-center justify-center mb-4 relative text-left">
                      <div className="absolute inset-0 bg-warning/20 blur-xl rounded-full" />
                      <Users className="h-8 w-8 text-warning relative z-10" />
                    </div>
                    <h3 className="text-lg font-bold font-display leading-tight">Elite Alumni Network</h3>
                    <p className="text-[10px] text-muted-foreground mt-2 px-2 uppercase tracking-wide font-bold">Connect with {mentorships > 100 ? mentorships : "2.4k"} industry veterans.</p>
                    <Button variant="ghost" className="mt-4 text-[10px] font-black uppercase tracking-widest w-full border border-warning/10 hover:bg-warning/10 hover:text-warning hover:border-warning/30">
                      Join Network
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

function AlumniImpactNexus() {
  return (
    <Card variant="glass" className="overflow-hidden relative bg-black/40 border-white/5 group rounded-[2.5rem]">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5" />
      <div className="absolute -left-12 -top-12 h-64 w-64 bg-accent/20 rounded-full blur-[100px] group-hover:bg-accent/30 transition-colors duration-1000" />

      <CardContent className="p-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6 text-left">
            <div className="space-y-2">
              <Badge variant="outline" className="text-[10px] font-black tracking-[0.2em] bg-accent/10 text-accent border-accent/20 uppercase px-3 rounded-full">
                Alumni Impact Nexus
              </Badge>
              <h2 className="text-3xl font-black font-display tracking-tight leading-none uppercase text-white">
                Neural <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">Contribution</span>
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                <span>Network Influence</span>
                <span className="text-accent">TOP 5% GLOBALLY</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "85%" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-accent via-primary to-accent bg-[length:200%_auto] animate-gradient"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-60 tracking-widest">Satisfaction</p>
                <p className="text-xl font-black font-display text-accent mt-1">98%</p>
              </div>
              <div className="p-4 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60 tracking-widest">Growth</p>
                <p className="text-xl font-black font-display text-primary mt-1">+12.4%</p>
              </div>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="h-56 w-56 relative flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-[2px] border-dashed border-accent/20 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute inset-6 border-[2px] border-dotted border-primary/20 rounded-full"
              />
              <div className="relative z-10 text-center space-y-1">
                <p className="text-5xl font-black font-display tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">124</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">Hours Given</p>
              </div>

              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.1, 0.4, 0.1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ duration: 5 + i, repeat: Infinity, delay: i * 0.4 }}
                  className="absolute h-2 w-2 rounded-full bg-accent/40 blur-[2px]"
                  style={{
                    top: `${50 + 42 * Math.sin((i * 60 * Math.PI) / 180)}%`,
                    left: `${50 + 42 * Math.cos((i * 60 * Math.PI) / 180)}%`,
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
