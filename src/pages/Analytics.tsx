import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
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
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold font-display">
            Analytics <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-muted-foreground">Comprehensive insights into collaboration performance</p>
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
                <BarChart data={placementData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" />
                  <XAxis dataKey="year" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                  <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(222, 47%, 8%)", border: "1px solid hsl(217, 33%, 17%)", borderRadius: "8px" }} />
                  <Bar dataKey="placed" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} name="Placement %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Charts */}
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
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={departmentPerformance} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value">
                    {departmentPerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
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
