import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  GraduationCap,
  Users,
  BookOpen,
  FileText,
  TrendingUp,
  Calendar,
  ArrowRight,
  Clock,
  IndianRupee,
  Lightbulb,
  Award,
  Beaker,
  Zap,
  Briefcase,
  MessageSquare,
} from "lucide-react";
import { motion } from "framer-motion";

import { useMoUs } from "@/hooks/useMoUs";
import { useEvents } from "@/hooks/useEvents";
import { useStudents } from "@/hooks/useStudents";
import { useSchedule } from "@/hooks/useSchedule";
import { useExternalResearch } from "@/hooks/useExternalResearch";
import { useHR } from "@/hooks/useHR";
import { AlertCircle, Clock as ClockIcon, CalendarClock, Plane, Users as UsersIcon } from "lucide-react";

// Animated progress ring for research
function ResearchRing({ value, label }: { value: number; label: string }) {
  const radius = 32;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: 72, height: 72 }}>
        <svg width={72} height={72} className="-rotate-90">
          <circle cx={36} cy={36} r={radius} fill="none" stroke="hsl(var(--border))" strokeWidth={5} />
          <circle
            cx={36} cy={36} r={radius} fill="none" stroke="currentColor" strokeWidth={5}
            strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
            className="text-primary transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-extrabold font-display">{value}%</span>
        </div>
      </div>
      <span className="text-xs text-muted-foreground text-center">{label}</span>
    </div>
  );
}

export function FacultyDashboard() {
  const projects: any[] = [];
  const { mous } = useMoUs();
  const { events } = useEvents();
  const { mentees } = useStudents();
  const { schedule } = useSchedule();
  const { hrData } = useHR();
  const { data: researchData } = useExternalResearch();

  const activeProjects = projects.filter((p: any) => p.status === 'in_progress' || p.status === 'approved');
  const upcomingEvents = events.filter(e => e.status === 'upcoming').slice(0, 3);
  const totalFunding = projects.reduce((sum: number, p: any) => sum + (p.funding_amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* 1. Key Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: GraduationCap, value: activeProjects.length, label: "Active Projects", color: "bg-primary/10", iconColor: "text-primary" },
          { icon: IndianRupee, value: `₹${(totalFunding / 100000).toFixed(1)}L`, label: "Funding", color: "bg-success/10", iconColor: "text-success" },
          { icon: BookOpen, value: 12, label: "Publications", color: "bg-warning/10", iconColor: "text-warning" },
          { icon: Award, value: 3, label: "Patents", color: "bg-accent/10", iconColor: "text-accent" },
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

        {/* Left Column: Stats & Quick Actions (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <Card variant="glass" className="border-accent/10 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5" />
            <CardHeader className="pb-3 text-left">
              <CardTitle className="text-sm font-black font-display uppercase tracking-widest flex items-center gap-2">
                <Zap className="h-4 w-4 text-accent animate-pulse" />
                Faculty Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              {[
                { label: "New Project", icon: Beaker, color: "text-primary", bg: "bg-primary/10" },
                { label: "Post Event", icon: Calendar, color: "text-warning", bg: "bg-warning/10" },
                { label: "Share Insight", icon: Lightbulb, color: "text-accent", bg: "bg-accent/10" },
                { label: "Add MoU", icon: FileText, color: "text-success", bg: "bg-success/10" },
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
                <TrendingUp className="h-4 w-4 text-primary" /> Dept Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-left">
              {[
                { label: "Placement", value: 85, color: "[\u0026>div]:bg-success" },
                { label: "Research", value: 78, color: "[\u0026>div]:bg-primary" },
                { label: "Industry", value: 92, color: "[\u0026>div]:bg-accent" },
              ].map((stat) => (
                <div key={stat.label} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span>{stat.label}</span>
                    <span className="text-primary">{stat.value}%</span>
                  </div>
                  <Progress value={stat.value} className={`h-1.5 ${stat.color}`} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card variant="glass" className="relative overflow-hidden group border-accent/20">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-primary/10" />
            <CardHeader className="pb-2 text-left">
              <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-accent" /> Innovation Pulse
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-[11px] text-muted-foreground font-medium italic text-left">
                "Your current research in <span className="text-accent font-bold">Neural Networks</span> is trending toward a patent-ready milestone in Q3."
              </p>
              <Button size="sm" variant="outline" className="w-full text-[10px] font-black tracking-widest uppercase h-8 border-accent/20 hover:bg-accent/10">
                Forecast Strategy
              </Button>
            </CardContent>
          </Card>

          <Card variant="glass" className="border-white/5">
            <CardHeader className="pb-2 text-left">
              <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Plane className="h-4 w-4 text-primary" /> Leave Balance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-left">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Casual", val: hrData?.leaveBalance?.casual || 0, color: "text-primary", bg: "bg-primary/10" },
                  { label: "Earned", val: hrData?.leaveBalance?.earned || 0, color: "text-success", bg: "bg-success/10" },
                  { label: "Medical", val: hrData?.leaveBalance?.medical || 0, color: "text-warning", bg: "bg-warning/10" },
                ].map((leave) => (
                  <div key={leave.label} className={`p-2 rounded-xl border border-white/5 flex flex-col items-center ${leave.bg}`}>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">{leave.label}</span>
                    <span className={`text-xl font-black font-display ${leave.color}`}>{leave.val}</span>
                  </div>
                ))}
              </div>
              {hrData?.pendingApprovals ? (
                <div className="flex items-center gap-2 text-[11px] p-2 bg-warning/10 text-warning rounded-lg font-bold">
                  <AlertCircle className="h-3 w-3" />
                  {hrData.pendingApprovals} Leave requests pending approval
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Main Content Area (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <ResearchIntelligenceHub data={researchData} />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Portfolio (7 cols) */}
            <div className="md:col-span-7 space-y-6">
              <Card variant="glass" className="border-primary/10 overflow-hidden relative h-full">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="text-left">
                    <CardTitle className="text-xl font-display font-bold">Research Portfolio</CardTitle>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1">Active Projects & Grants</p>
                  </div>
                  <Button variant="outline" size="sm" className="hidden sm:flex group h-8 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-[10px] uppercase font-bold px-4">
                    Manage <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 text-left">
                    {activeProjects.length > 0 ? activeProjects.slice(0, 3).map((project) => (
                      <div key={project.id} className="p-4 rounded-3xl bg-white/5 border border-white/5 hover:border-primary/20 hover:bg-primary/5 transition-all group">
                        <h4 className="font-bold text-sm truncate group-hover:text-primary transition-colors">{project.title}</h4>
                        <p className="text-[10px] text-muted-foreground font-medium mt-1 truncate uppercase tracking-tight">{project.funding_source || 'Self-funded'}</p>
                        <div className="mt-4 flex flex-col gap-2">
                          <div className="flex justify-between text-[9px] font-bold uppercase">
                            <span className="text-muted-foreground">Verification state</span>
                            <span className="text-primary font-black">65% OPTIMIZED</span>
                          </div>
                          <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: '65%' }} />
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-white/5 rounded-3xl">
                        <Beaker className="h-10 w-10 text-primary/40 mb-2" />
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">No active projects</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card variant="glass" className="border-warning/10 overflow-hidden relative">
                <CardHeader className="flex flex-row items-center justify-between pb-2 text-left">
                  <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                    <UsersIcon className="h-4 w-4 text-warning" /> Mentorship Pulse
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mentees?.map((mentee) => (
                      <div key={mentee.id} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-warning/20 hover:bg-warning/5 transition-all text-left">
                        <div>
                          <h5 className="text-[12px] font-bold">{mentee.name}</h5>
                          <p className="text-[10px] text-muted-foreground uppercase">{mentee.program}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[12px] font-black font-display">{mentee.cgpa} CGPA</p>
                          <p className={`text-[9px] uppercase font-bold tracking-wider ${mentee.status === 'at-risk' || mentee.status === 'failing' ? 'text-destructive' : 'text-success'}`}>
                            {mentee.status.replace('-', ' ')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Side Column in Right section (5 cols) */}
            <div className="md:col-span-5 space-y-6">
              <Card variant="glass" className="border-success/10">
                <CardHeader className="pb-2 text-left">
                  <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                    <FileText className="h-4 w-4 text-success" /> Assigned MoUs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mous.length > 0 ? mous.slice(0, 2).map((mou) => (
                    <div key={mou.id} className="p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-success/20 hover:bg-success/5 transition-all text-left">
                      <h5 className="text-[11px] font-bold leading-tight truncate">{mou.title}</h5>
                      <p className="text-[9px] text-muted-foreground mt-1 truncate">{mou.partner_name}</p>
                      <div className="mt-2 flex items-center gap-1.5">
                        <div className="h-1 w-1 rounded-full bg-success animate-pulse" />
                        <span className="text-[8px] font-bold uppercase text-success">Compliant</span>
                      </div>
                    </div>
                  )) : (
                    <p className="text-[10px] text-muted-foreground uppercase font-bold text-center py-4">No MoUs assigned</p>
                  )}
                </CardContent>
              </Card>

              <Card variant="glass" className="border-accent/10">
                <CardHeader className="pb-2 text-left">
                  <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-accent" /> Dept Events
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
                        <p className="text-[9px] text-muted-foreground mt-1 truncate">{event.venue || 'Online'}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card variant="glass" className="border-primary/10">
                <CardHeader className="pb-2 text-left">
                  <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                    <CalendarClock className="h-4 w-4 text-primary" /> Today's Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {schedule?.map((item) => (
                    <div key={item.id} className="relative pl-4 border-l-2 border-primary/20 pb-4 last:pb-0 text-left group">
                      <div className="absolute w-2 h-2 bg-primary rounded-full -left-[5px] top-1 group-hover:scale-150 transition-transform" />
                      <p className="text-[11px] font-black tracking-tight leading-none mb-1 text-primary">{item.time}</p>
                      <h5 className="text-[12px] font-bold leading-tight">{item.title}</h5>
                      <p className="text-[10px] text-muted-foreground uppercase mt-1">{item.location} • {item.duration}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function ResearchIntelligenceHub({ data }: { data: any }) {
  const citations = data?.citations || "1.4k";
  const hIndex = data?.hIndex || 24;
  const trendingText = data?.trendingMetric || "+15.2% ACCELERATING";

  return (
    <Card variant="glass" className="overflow-hidden relative bg-black/40 border-white/5 group rounded-[2.5rem]">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-success/5" />
      <div className="absolute -right-12 -top-12 h-64 w-64 bg-primary/20 rounded-full blur-[100px] group-hover:bg-primary/30 transition-colors duration-1000" />

      <CardContent className="p-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6 text-left">
            <div className="space-y-2">
              <Badge variant="outline" className="text-[10px] font-black tracking-[0.2em] bg-primary/10 text-primary border-primary/20 uppercase px-3 rounded-full">
                Research Intel Hub
              </Badge>
              <h2 className="text-3xl font-black font-display tracking-tight leading-none uppercase text-white">
                Academic <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-success">Trajectory</span>
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                <span>Funding Velocity</span>
                <span className="text-primary">{trendingText}</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "72%" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-primary via-success to-primary bg-[length:200%_auto] animate-gradient"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-60 tracking-widest">Global Citations</p>
                <p className="text-xl font-black font-display text-primary mt-1">{citations}</p>
              </div>
              <div className="p-4 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60 tracking-widest">H-Index</p>
                <p className="text-xl font-black font-display text-success mt-1">{hIndex}</p>
              </div>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="h-56 w-56 relative flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-[2px] border-dashed border-primary/20 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-6 border-[2px] border-dotted border-success/20 rounded-full"
              />
              <div className="relative z-10 text-center space-y-1">
                <p className="text-5xl font-black font-display tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">82</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">Intel Score</p>
              </div>

              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.2, 0.5, 0.2],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }}
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
