import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp } from "lucide-react";

const collaborationData = [
  { month: "Jan", mous: 4, internships: 25, projects: 12 },
  { month: "Feb", mous: 6, internships: 32, projects: 18 },
  { month: "Mar", mous: 5, internships: 45, projects: 22 },
  { month: "Apr", mous: 8, internships: 38, projects: 28 },
  { month: "May", mous: 10, internships: 52, projects: 35 },
  { month: "Jun", mous: 12, internships: 68, projects: 42 },
];

const skillDemandData = [
  { skill: "AI/ML", demand: 85 },
  { skill: "Cloud", demand: 78 },
  { skill: "Cyber", demand: 72 },
  { skill: "Data", demand: 68 },
  { skill: "Web", demand: 65 },
];

const sectorData = [
  { name: "IT Services", value: 35, color: "hsl(187, 85%, 53%)" },
  { name: "Manufacturing", value: 25, color: "hsl(262, 83%, 58%)" },
  { name: "Healthcare", value: 20, color: "hsl(142, 76%, 36%)" },
  { name: "Finance", value: 15, color: "hsl(38, 92%, 50%)" },
  { name: "Others", value: 5, color: "hsl(215, 20%, 55%)" },
];

export function CollaborationChart() {
  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Collaboration Growth
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={collaborationData}>
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
            <XAxis 
              dataKey="month" 
              stroke="hsl(215, 20%, 55%)" 
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="hsl(215, 20%, 55%)" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(222, 47%, 8%)",
                border: "1px solid hsl(217, 33%, 17%)",
                borderRadius: "8px",
                color: "hsl(210, 40%, 98%)",
              }}
            />
            <Area
              type="monotone"
              dataKey="internships"
              stroke="hsl(262, 83%, 58%)"
              fillOpacity={1}
              fill="url(#colorInternships)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="mous"
              stroke="hsl(187, 85%, 53%)"
              fillOpacity={1}
              fill="url(#colorMous)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function SkillDemandChart() {
  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle>Industry Skill Demand</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={skillDemandData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" horizontal={false} />
            <XAxis 
              type="number" 
              stroke="hsl(215, 20%, 55%)" 
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              type="category" 
              dataKey="skill" 
              stroke="hsl(215, 20%, 55%)" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              width={50}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(222, 47%, 8%)",
                border: "1px solid hsl(217, 33%, 17%)",
                borderRadius: "8px",
                color: "hsl(210, 40%, 98%)",
              }}
            />
            <Bar 
              dataKey="demand" 
              fill="hsl(187, 85%, 53%)" 
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function SectorDistributionChart() {
  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle>Partner Sectors</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={sectorData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {sectorData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(222, 47%, 8%)",
                border: "1px solid hsl(217, 33%, 17%)",
                borderRadius: "8px",
                color: "hsl(210, 40%, 98%)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="space-y-2">
          {sectorData.map((sector) => (
            <div key={sector.name} className="flex items-center gap-2 text-xs">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: sector.color }}
              />
              <span className="text-muted-foreground">{sector.name}</span>
              <span className="font-medium">{sector.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
