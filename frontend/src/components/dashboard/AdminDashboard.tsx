import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  Briefcase,
  Users,
  Building2,
  Calendar,
  ArrowRight,
  TrendingUp,
  Activity,
  Clock,
  BarChart3,
  Shield,
  Bell,
  GraduationCap,
  Zap,
  AlertCircle,
  IndianRupee,
  Landmark,
  Compass,
  Server,
  Award
} from "lucide-react";
import { motion } from "framer-motion";
import { useMoUs } from "@/hooks/useMoUs";
import { useInternships } from "@/hooks/useInternships";
import { useIndustryPartners } from "@/hooks/useIndustryPartners";
import { useEvents } from "@/hooks/useEvents";
import { useFinances } from "@/hooks/useFinances";
import { useCompliance } from "@/hooks/useCompliance";
import { useFacilities } from "@/hooks/useFacilities";
import { useAlumni } from "@/hooks/useAlumni";
import { CampusPulse } from "./CampusPulse";
import { ProgressRing } from "./ProgressRing";

// Animated system health pulse
function HealthPulse({ status = "healthy" }: { status?: "healthy" | "warning" | "critical" }) {
  const colors = {
    healthy: "bg-success",
    warning: "bg-warning",
    critical: "bg-destructive",
  };
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className={`h-3 w-3 rounded-full ${colors[status]}`} />
        <div className={`absolute inset-0 h-3 w-3 rounded-full ${colors[status]} animate-ping opacity-75`} />
      </div>
      <span className="text-xs font-medium capitalize">{status}</span>
    </div>
  );
}

const activityFeed = [
  { text: "New MoU signed with TCS", time: "2m ago", icon: FileText, color: "text-primary" },
  { text: "Student bulk import completed", time: "15m ago", icon: Users, color: "text-success" },
  { text: "Event registration opened", time: "1h ago", icon: Calendar, color: "text-accent" },
  { text: "3 new partner applications", time: "3h ago", icon: Building2, color: "text-warning" },
];

export function AdminDashboard() {
  const { mous } = useMoUs();
  const { internships } = useInternships();
  const { partners } = useIndustryPartners();
  const { events } = useEvents();
  const { finances } = useFinances();
  const { compliance } = useCompliance();
  const { facilities } = useFacilities();
  const { alumni } = useAlumni();

  const activeMous = mous.filter(m => m.status === 'active');
  const activeInternships = internships.filter(i => i.status === 'open');
  const upcomingEvents = events.filter(e => e.status === 'upcoming');

  return (
    <div className="space-y-6">
      {/* 1. KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: FileText, value: activeMous.length, label: "Active Agreements", color: "bg-primary/10", iconColor: "text-primary" },
          { icon: Building2, value: partners.length, label: "Industry Partners", color: "bg-accent/10", iconColor: "text-accent" },
          { icon: Briefcase, value: activeInternships.length, label: "Open Roles", color: "bg-success/10", iconColor: "text-success" },
          { icon: Users, value: "1.2k", label: "Active Students", color: "bg-warning/10", iconColor: "text-warning" },
        ].map((kpi) => (
          <Card key={kpi.label} variant="glass" className="p-4 group border-white/5 hover:border-white/10 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-black font-display tracking-tight">{kpi.value}</div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{kpi.label}</div>
              </div>
              <div className={`h-10 w-10 rounded-xl ${kpi.color} flex items-center justify-center`}>
                <kpi.icon className={`h-5 w-5 ${kpi.iconColor}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 2. Main Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Intelligence & Actions (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <Card variant="glass" className="bg-black/40 border-primary/20 bg-[radial-gradient(ellipse_at_top_right,rgba(var(--accent-rgb),0.1),transparent)] relative overflow-hidden group">
            <CardHeader className="pb-2 text-left">
              <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Shield className="h-4 w-4 text-accent" /> Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-2xl border border-destructive/20 bg-destructive/10">
                <div className="flex items-center gap-2 text-destructive mb-1">
                  <AlertCircle className="h-3 w-3" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Efficiency Drop</span>
                </div>
                <p className="text-[10px] font-bold text-muted-foreground text-left leading-relaxed">Placement rates in <span className="text-white">CSE-B</span> trending down by 14%.</p>
              </div>

              <div className="p-3 rounded-2xl border border-success/20 bg-success/10">
                <div className="flex items-center gap-2 text-success mb-1">
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Growth Forecast</span>
                </div>
                <p className="text-[10px] font-bold text-muted-foreground text-left leading-relaxed">Neural sync predicts 24% increase in <span className="text-white">Google</span> hires next quarter.</p>
              </div>

              <Button variant="outline" className="w-full text-[10px] font-black uppercase tracking-widest border-white/10 bg-white/5 h-10 hover:bg-accent hover:text-white transition-all">
                System Audit
              </Button>
            </CardContent>
          </Card>

          <Card variant="glass" className="border-white/5">
            <CardHeader className="pb-2 text-left">
              <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" /> Admin Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              {[
                { icon: FileText, label: "Add MoU", bg: "bg-primary/5", border: "border-primary/20" },
                { icon: Users, label: "Bulk Import", bg: "bg-success/5", border: "border-success/20" },
                { icon: BarChart3, label: "Analytics", bg: "bg-accent/5", border: "border-accent/20" },
                { icon: Bell, label: "Push Alert", bg: "bg-warning/5", border: "border-warning/20" },
              ].map((action) => (
                <Button key={action.label} variant="ghost" className={`h-20 flex-col gap-1 rounded-2xl ${action.bg} border ${action.border} hover:scale-[1.02] transition-all`}>
                  <action.icon className="h-5 w-5 text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-tight">{action.label}</span>
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card variant="glass" className="border-warning/10">
            <CardHeader className="pb-2 text-left">
              <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Landmark className="h-4 w-4 text-warning" /> Accreditation Readiness
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-left">
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">Faculty/Student</p>
                  <p className="text-lg font-black text-white">{compliance?.facultyStudentRatio}</p>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">PhD Faculty</p>
                  <p className="text-lg font-black text-warning">{compliance?.phdPercentage}%</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span>NBA Readiness</span>
                  <span className="text-success">{compliance?.nbaReadinessScore}%</span>
                </div>
                <Progress value={compliance?.nbaReadinessScore || 0} className="h-1.5 [&>div]:bg-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Performance & Lifecycle (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <SystemPerformanceNexus />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-7 space-y-6">
              <Card variant="glass" className="border-success/10 bg-success/5 overflow-hidden relative">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(var(--success-rgb),0.1),transparent)]" />
                <CardHeader className="pb-2 text-left">
                  <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                    <IndianRupee className="h-4 w-4 text-success" /> Financial Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-left">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Fee Collection</p>
                      <p className="text-2xl font-black text-success mt-1">{finances?.feeCollection.percentage}%</p>
                      <Progress value={finances?.feeCollection.percentage || 0} className="h-1 mt-2 [&>div]:bg-success" />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Pending Dues</p>
                      <p className="text-xl font-black text-destructive mt-1">₹{(finances?.pendingDues || 0) / 100000}L</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase">Total Grants Received</span>
                    <span className="text-lg font-black text-primary">₹{(finances?.grantsReceived || 0) / 10000000} Cr</span>
                  </div>
                </CardContent>
              </Card>

              <CampusPulse />

              <Card variant="glass" className="border-accent/10">
                <CardHeader className="pb-2 text-left">
                  <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                    <Award className="h-4 w-4 text-accent" /> Alumni Engagement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-4 p-3 bg-white/5 rounded-2xl border border-white/5 text-left">
                    <div className="h-10 w-10 bg-accent/20 rounded-xl flex items-center justify-center text-accent shrink-0">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider">{alumni?.length || 0} Registered Alumni</h4>
                      <p className="text-[10px] text-muted-foreground">Growing community network</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="md:col-span-5 space-y-6">
              <Card variant="glass" className="border-primary/10">
                <CardHeader className="flex flex-row items-center justify-between pb-2 text-left">
                  <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" /> Live Feed
                  </CardTitle>
                  <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activityFeed.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 hover:bg-primary/5 transition-all text-left">
                        <div className={`h-8 w-8 rounded-lg bg-background border border-white/10 flex items-center justify-center shrink-0 ${item.color}`}>
                          <item.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold leading-tight truncate">{item.text}</p>
                          <p className="text-[8px] text-muted-foreground uppercase mt-0.5">{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card variant="glass" className="border-white/5 overflow-hidden">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-4">
                      <div className="absolute inset-0 bg-success/20 blur-xl rounded-full" />
                      <HealthPulse status="healthy" />
                    </div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-success">All Nodes Active</h4>
                    <p className="text-[9px] text-muted-foreground mt-2 px-4 leading-relaxed uppercase font-bold tracking-tight">Sync rate 99.8% across nodes.</p>
                    <div className="w-full h-1 bg-white/5 rounded-full mt-4 overflow-hidden">
                      <div className="h-full bg-success w-[99.8%]" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card variant="glass" className="border-primary/10">
                <CardHeader className="pb-2 text-left">
                  <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                    <Server className="h-4 w-4 text-primary" /> Campus Infrastructure
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-left">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                      <span>Hostel Occupancy</span>
                      <span className="text-primary">{facilities?.hostelOccupancy.percentage}%</span>
                    </div>
                    <Progress value={facilities?.hostelOccupancy.percentage || 0} className="h-1.5 [&>div]:bg-primary" />
                  </div>
                  <div className="space-y-2 text-left">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                      <span>Wi-Fi Load ({facilities?.wifiLoad.currentTbps} Tbps)</span>
                      <span className={facilities?.wifiLoad.percentage! > 80 ? 'text-destructive' : 'text-success'}>
                        {facilities?.wifiLoad.percentage}%
                      </span>
                    </div>
                    <Progress value={facilities?.wifiLoad.percentage || 0} className={`h-1.5 ${facilities?.wifiLoad.percentage! > 80 ? '[&>div]:bg-destructive' : '[&>div]:bg-success'}`} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

      </div>
    </div >
  );
}

function SystemPerformanceNexus() {
  return (
    <Card variant="glass" className="overflow-hidden relative bg-black/40 border-white/5 group rounded-[2.5rem]">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5" />
      <div className="absolute -left-12 -bottom-12 h-64 w-64 bg-accent/20 rounded-full blur-[100px] group-hover:bg-accent/30 transition-colors duration-1000" />

      <CardContent className="p-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6 text-left">
            <div className="space-y-2">
              <Badge variant="outline" className="text-[10px] font-black tracking-[0.2em] bg-accent/10 text-accent border-accent/20 uppercase px-3 rounded-full">
                System Performance Nexus
              </Badge>
              <h2 className="text-3xl font-black font-display tracking-tight leading-none uppercase text-white">
                Campus <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">Efficiency</span>
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                <span>Placement Conversion</span>
                <span className="text-accent">OPTIMIZED</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "94%" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-accent via-primary to-accent bg-[length:200%_auto] animate-gradient"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Stability", val: "99.9%" },
                { label: "Response", val: "42ms" },
                { label: "Uptime", val: "320d" },
              ].map((m) => (
                <div key={m.label} className="p-3 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center">
                  <span className="text-[8px] font-bold text-muted-foreground uppercase opacity-60 tracking-tighter">{m.label}</span>
                  <span className="text-sm font-black text-white mt-1">{m.val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
              <ProgressRing value={94} size={180} strokeWidth={12} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Shield className="h-8 w-8 text-primary mb-1" />
                <span className="text-xs font-black uppercase tracking-widest">Trust</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
