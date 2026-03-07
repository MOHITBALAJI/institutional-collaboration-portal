import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  TrendingUp,
  Users,
  Briefcase,
  FileText,
  GraduationCap,
  Building2,
  Target,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  BarChart,
  Bar,
  Line,
  Treemap,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

const collaborationTrend = [
  { month: "Jan", mous: 12, internships: 45, projects: 8 },
  { month: "Feb", mous: 15, internships: 52, projects: 12 },
  { month: "Mar", mous: 18, internships: 68, projects: 15 },
  { month: "Apr", mous: 22, internships: 75, projects: 18 },
  { month: "May", mous: 28, internships: 92, projects: 22 },
  { month: "Jun", mous: 35, internships: 110, projects: 28 },
];

const placementData = [
  { year: "2019", placed: 78, total: 100 },
  { year: "2020", placed: 82, total: 100 },
  { year: "2021", placed: 85, total: 100 },
  { year: "2022", placed: 88, total: 100 },
  { year: "2023", placed: 92, total: 100 },
  { year: "2024", placed: 95, total: 100 },
];

const skillGapData = [
  { skill: "AI/ML", industry: 90, student: 65 },
  { skill: "Cloud", industry: 85, student: 55 },
  { skill: "Cyber", industry: 80, student: 45 },
  { skill: "Data", industry: 88, student: 70 },
  { skill: "DevOps", industry: 75, student: 40 },
  { skill: "Web", industry: 70, student: 75 },
];

const departmentPerformance = [
  { name: "CSE", value: 35, color: "hsl(187, 85%, 53%)" },
  { name: "ECE", value: 25, color: "hsl(262, 83%, 58%)" },
  { name: "ME", value: 18, color: "hsl(142, 76%, 36%)" },
  { name: "CE", value: 12, color: "hsl(38, 92%, 50%)" },
  { name: "EE", value: 10, color: "hsl(0, 84%, 60%)" },
];

const radarData = [
  { subject: "Placements", A: 92, fullMark: 100 },
  { subject: "Research", A: 78, fullMark: 100 },
  { subject: "Internships", A: 88, fullMark: 100 },
  { subject: "MoUs", A: 85, fullMark: 100 },
  { subject: "Events", A: 72, fullMark: 100 },
  { subject: "Alumni", A: 68, fullMark: 100 },
];

const kpis = [
  { label: "Active MoUs", value: "47", change: "+12%", positive: true, icon: FileText },
  { label: "Placement Rate", value: "92%", change: "+5%", positive: true, icon: Target },
  { label: "Industry Partners", value: "156", change: "+8", positive: true, icon: Building2 },
  { label: "Research Projects", value: "28", change: "+15%", positive: true, icon: GraduationCap },
  { label: "Active Internships", value: "234", change: "+23%", positive: true, icon: Briefcase },
  { label: "Alumni Mentors", value: "89", change: "-2", positive: false, icon: Users },
];

export default function Analytics() {
  const [viewMode, setViewMode] = useState<"standard" | "global">("global");
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold font-display">
              Analytics <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-muted-foreground">Comprehensive insights into collaboration performance</p>
          </div>
          <div className="flex bg-white/5 border border-white/5 p-1 rounded-xl">
            <Button
              variant={viewMode === "standard" ? "gradient" : "ghost"}
              size="sm"
              className="h-8 text-[10px] uppercase font-black px-4 rounded-lg"
              onClick={() => setViewMode("standard")}
            >
              Standard Stats
            </Button>
            <Button
              variant={viewMode === "global" ? "gradient" : "ghost"}
              size="sm"
              className="h-8 text-[10px] uppercase font-black px-4 rounded-lg"
              onClick={() => setViewMode("global")}
            >
              Global Reach
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {kpis.map((kpi) => (
            <Card key={kpi.label} variant="glow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <kpi.icon className="h-5 w-5 text-primary" />
                  <div className={`flex items-center text-xs ${kpi.positive ? "text-success" : "text-destructive"}`}>
                    {kpi.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {kpi.change}
                  </div>
                </div>
                <p className="text-2xl font-bold font-display">{kpi.value}</p>
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Charts */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Collaboration Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={collaborationTrend}>
                  <defs>
                    <linearGradient id="colorMous" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(187, 85%, 53%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(187, 85%, 53%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorInternships" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" />
                  <XAxis dataKey="month" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                  <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(222, 47%, 8%)", border: "1px solid hsl(217, 33%, 17%)", borderRadius: "8px" }} />
                  <Area type="monotone" dataKey="internships" stroke="hsl(262, 83%, 58%)" fillOpacity={1} fill="url(#colorInternships)" strokeWidth={2} />
                  <Area type="monotone" dataKey="mous" stroke="hsl(187, 85%, 53%)" fillOpacity={1} fill="url(#colorMous)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Placement Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={placementData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" />
                  <XAxis dataKey="year" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                  <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(222, 47%, 8%)", border: "1px solid hsl(217, 33%, 17%)", borderRadius: "8px" }} />
                  <Legend />
                  <Bar dataKey="placed" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} name="Placement %" barSize={30} fillOpacity={0.7} />
                  <Line type="monotone" dataKey="placed" stroke="hsl(38, 92%, 50%)" strokeWidth={2} dot={{ r: 4, fill: "hsl(38, 92%, 50%)" }} name="Trend" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {viewMode === "global" ? (
          <Card variant="glass" className="overflow-hidden bg-black/40 border-primary/20 min-h-[600px] relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.1)_0%,transparent_70%)]" />

            {/* 3D Globe Visualization */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full min-h-[600px] py-12">
              <div className="absolute top-8 left-8">
                <h3 className="text-2xl font-black font-display tracking-tighter">Holographic <span className="gradient-text">Reach</span></h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Neural Grid v2.1 Active</span>
                </div>
              </div>

              {/* SVG Globe */}
              <div className="relative w-[500px] h-[500px]">
                <svg className="w-full h-full animate-aurora-drift" viewBox="0 0 100 100">
                  <defs>
                    <radialGradient id="globeGrad">
                      <stop offset="0%" stopColor="rgba(var(--primary-rgb), 0.2)" />
                      <stop offset="100%" stopColor="transparent" />
                    </radialGradient>
                  </defs>
                  {/* Sphere */}
                  <circle cx="50" cy="50" r="45" fill="url(#globeGrad)" stroke="hsl(var(--primary))" strokeWidth="0.1" strokeDasharray="1,2" />

                  {/* Latitudes & Longitudes */}
                  {[...Array(6)].map((_, i) => (
                    <ellipse key={`lat-${i}`} cx="50" cy="50" rx="45" ry={7.5 * i} fill="none" stroke="white" strokeOpacity="0.1" strokeWidth="0.05" />
                  ))}
                  {[...Array(6)].map((_, i) => (
                    <ellipse key={`lon-${i}`} cx="50" cy="50" rx={7.5 * i} ry="45" fill="none" stroke="white" strokeOpacity="0.1" strokeWidth="0.05" />
                  ))}

                  {/* Data Points (Locations) */}
                  {[
                    { x: 30, y: 30, label: "San Francisco" },
                    { x: 70, y: 40, label: "London" },
                    { x: 60, y: 70, label: "Bangalore" },
                    { x: 80, y: 20, label: "Tokyo" },
                    { x: 20, y: 60, label: "Sydney" }
                  ].map((p, i) => (
                    <g key={i} className="group/loc cursor-pointer">
                      <circle cx={p.x} cy={p.y} r="1" fill="hsl(var(--primary))">
                        <animate attributeName="r" values="1;2;1" dur="2s" repeatCount="indefinite" />
                      </circle>
                      <circle cx={p.x} cy={p.y} r="6" fill="hsl(var(--primary))" fillOpacity="0.1" className="animate-pulse" />
                      <text x={p.x} y={p.y - 3} textAnchor="middle" className="text-[2px] fill-white opacity-0 group-hover/loc:opacity-100 transition-opacity font-bold uppercase">{p.label}</text>
                    </g>
                  ))}

                  {/* Scanning Line */}
                  <line x1="5" y1="0" x2="95" y2="0" stroke="hsl(var(--primary))" strokeWidth="0.2" opacity="0.5">
                    <animateTransform attributeName="transform" type="translate" from="0 0" to="0 100" dur="4s" repeatCount="indefinite" />
                  </line>
                </svg>
              </div>

              {/* Bottom Stats Overlay */}
              <div className="absolute bottom-8 grid grid-cols-3 gap-12 text-center">
                <div>
                  <div className="text-4xl font-black font-display gradient-text">42</div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase mt-1">Global Entities</div>
                </div>
                <div>
                  <div className="text-4xl font-black font-display gradient-text">15</div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase mt-1">Industry Hubs</div>
                </div>
                <div>
                  <div className="text-4xl font-black font-display gradient-text">8k+</div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase mt-1">Neural Syncs</div>
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4 lg:grid-cols-3">
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Skill Gap Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={skillGapData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" horizontal={false} />
                    <XAxis type="number" stroke="hsl(215, 20%, 55%)" fontSize={12} domain={[0, 100]} />
                    <YAxis type="category" dataKey="skill" stroke="hsl(215, 20%, 55%)" fontSize={12} width={50} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(222, 47%, 8%)", border: "1px solid hsl(217, 33%, 17%)", borderRadius: "8px" }} />
                    <Bar dataKey="industry" fill="hsl(187, 85%, 53%)" name="Industry Demand" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="student" fill="hsl(262, 83%, 58%)" name="Student Skills" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-2">
                  <div className="flex items-center gap-1 text-xs">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span>Industry Demand</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <div className="h-2 w-2 rounded-full bg-accent" />
                    <span>Student Skills</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardHeader>
                <CardTitle>Department Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <Treemap data={departmentPerformance.map(e => ({ name: e.name, size: e.value, fill: e.color }))} dataKey="size" aspectRatio={4 / 3} stroke="hsl(222, 18%, 12%)" />
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-3 mt-2">
                  {departmentPerformance.map((item) => (
                    <div key={item.name} className="flex items-center gap-1 text-xs">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardHeader>
                <CardTitle>Overall Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="hsl(217, 33%, 17%)" />
                    <PolarAngleAxis dataKey="subject" stroke="hsl(215, 20%, 55%)" fontSize={10} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="hsl(215, 20%, 55%)" fontSize={10} />
                    <Radar name="Performance" dataKey="A" stroke="hsl(187, 85%, 53%)" fill="hsl(187, 85%, 53%)" fillOpacity={0.3} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Key Insights */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Key Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                <p className="text-success font-semibold">Strong Growth</p>
                <p className="text-sm text-muted-foreground mt-1">MoUs increased by 23% this quarter</p>
              </div>
              <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                <p className="text-warning font-semibold">Skill Gap Alert</p>
                <p className="text-sm text-muted-foreground mt-1">DevOps skills need attention (-35% gap)</p>
              </div>
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-primary font-semibold">Top Performer</p>
                <p className="text-sm text-muted-foreground mt-1">CSE department leads with 35% placements</p>
              </div>
              <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                <p className="text-accent font-semibold">Opportunity</p>
                <p className="text-sm text-muted-foreground mt-1">Alumni engagement can be improved</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
