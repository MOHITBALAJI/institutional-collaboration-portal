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
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface CollaborationData {
  month: string;
  mous: number;
  internships: number;
  partners: number;
}

interface SkillDemandData {
  skill: string;
  demand: number;
}

interface SectorData {
  name: string;
  value: number;
  color: string;
}

const sectorColors = [
  "hsl(187, 85%, 53%)",
  "hsl(262, 83%, 58%)",
  "hsl(142, 76%, 36%)",
  "hsl(38, 92%, 50%)",
  "hsl(215, 20%, 55%)",
  "hsl(340, 82%, 52%)",
];

export function CollaborationChart() {
  const [data, setData] = useState<CollaborationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: stats, error } = await supabase
          .from("collaboration_stats")
          .select("stat_date, active_mous, active_internships, industry_partners")
          .order("stat_date", { ascending: true })
          .limit(7);

        if (error) throw error;

        if (stats && stats.length > 0) {
          const chartData = stats.map((s) => ({
            month: new Date(s.stat_date).toLocaleDateString("en-US", { month: "short" }),
            mous: s.active_mous || 0,
            internships: s.active_internships || 0,
            partners: s.industry_partners || 0,
          }));
          setData(chartData);
        } else {
          // Fallback sample data
          setData([
            { month: "Jan", mous: 35, internships: 45, partners: 140 },
            { month: "Feb", mous: 36, internships: 48, partners: 142 },
            { month: "Mar", mous: 37, internships: 52, partners: 145 },
            { month: "Apr", mous: 38, internships: 55, partners: 148 },
            { month: "May", mous: 39, internships: 58, partners: 150 },
            { month: "Jun", mous: 40, internships: 62, partners: 152 },
            { month: "Jul", mous: 40, internships: 65, partners: 154 },
          ]);
        }
      } catch (error) {
        console.error("Error fetching collaboration data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

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
          <AreaChart data={data}>
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
              name="Internships"
            />
            <Area
              type="monotone"
              dataKey="mous"
              stroke="hsl(187, 85%, 53%)"
              fillOpacity={1}
              fill="url(#colorMous)"
              strokeWidth={2}
              name="Active MoUs"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function SkillDemandChart() {
  const [data, setData] = useState<SkillDemandData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Get skills from internships
        const { data: internships, error } = await supabase
          .from("internships")
          .select("skills_required")
          .not("skills_required", "is", null);

        if (error) throw error;

        const skillCounts: Record<string, number> = {};
        
        internships?.forEach((i) => {
          if (i.skills_required) {
            i.skills_required.forEach((skill: string) => {
              const normalizedSkill = skill.toLowerCase().trim();
              // Group similar skills
              let category = "Other";
              if (normalizedSkill.includes("python") || normalizedSkill.includes("machine learning") || normalizedSkill.includes("tensorflow") || normalizedSkill.includes("ai")) {
                category = "AI/ML";
              } else if (normalizedSkill.includes("aws") || normalizedSkill.includes("docker") || normalizedSkill.includes("kubernetes") || normalizedSkill.includes("cloud")) {
                category = "Cloud";
              } else if (normalizedSkill.includes("cyber") || normalizedSkill.includes("security")) {
                category = "Security";
              } else if (normalizedSkill.includes("sql") || normalizedSkill.includes("data") || normalizedSkill.includes("analytics")) {
                category = "Data";
              } else if (normalizedSkill.includes("react") || normalizedSkill.includes("javascript") || normalizedSkill.includes("html") || normalizedSkill.includes("css") || normalizedSkill.includes("web")) {
                category = "Web Dev";
              } else if (normalizedSkill.includes("java") || normalizedSkill.includes("spring")) {
                category = "Java";
              }
              
              skillCounts[category] = (skillCounts[category] || 0) + 1;
            });
          }
        });

        const chartData = Object.entries(skillCounts)
          .map(([skill, count]) => ({ skill, demand: count * 10 }))
          .sort((a, b) => b.demand - a.demand)
          .slice(0, 5);

        if (chartData.length > 0) {
          setData(chartData);
        } else {
          // Fallback
          setData([
            { skill: "AI/ML", demand: 85 },
            { skill: "Cloud", demand: 78 },
            { skill: "Security", demand: 72 },
            { skill: "Data", demand: 68 },
            { skill: "Web Dev", demand: 65 },
          ]);
        }
      } catch (error) {
        console.error("Error fetching skill data:", error);
        setData([
          { skill: "AI/ML", demand: 85 },
          { skill: "Cloud", demand: 78 },
          { skill: "Security", demand: 72 },
          { skill: "Data", demand: 68 },
          { skill: "Web Dev", demand: 65 },
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle>Industry Skill Demand</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} layout="vertical">
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
              width={60}
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
              name="Demand Index"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function SectorDistributionChart() {
  const [data, setData] = useState<SectorData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: partners, error } = await supabase
          .from("industry_partners")
          .select("industry_type")
          .not("industry_type", "is", null);

        if (error) throw error;

        const sectorCounts: Record<string, number> = {};
        
        partners?.forEach((p) => {
          if (p.industry_type) {
            const sector = p.industry_type;
            sectorCounts[sector] = (sectorCounts[sector] || 0) + 1;
          }
        });

        const total = Object.values(sectorCounts).reduce((a, b) => a + b, 0);
        
        const chartData = Object.entries(sectorCounts)
          .map(([name, count], index) => ({
            name,
            value: Math.round((count / total) * 100),
            color: sectorColors[index % sectorColors.length],
          }))
          .sort((a, b) => b.value - a.value);

        if (chartData.length > 0) {
          setData(chartData);
        } else {
          // Fallback
          setData([
            { name: "IT Services", value: 35, color: sectorColors[0] },
            { name: "Manufacturing", value: 25, color: sectorColors[1] },
            { name: "Healthcare", value: 20, color: sectorColors[2] },
            { name: "Finance", value: 15, color: sectorColors[3] },
            { name: "Others", value: 5, color: sectorColors[4] },
          ]);
        }
      } catch (error) {
        console.error("Error fetching sector data:", error);
        setData([
          { name: "IT Services", value: 35, color: sectorColors[0] },
          { name: "Manufacturing", value: 25, color: sectorColors[1] },
          { name: "Healthcare", value: 20, color: sectorColors[2] },
          { name: "Finance", value: 15, color: sectorColors[3] },
          { name: "Others", value: 5, color: sectorColors[4] },
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle>Partner Sectors</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
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
          {data.map((sector) => (
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
