import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Briefcase, 
  Users, 
  Calendar, 
  Building2, 
  GraduationCap,
  Clock,
  CheckCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  type: "mou" | "internship" | "alumni" | "event" | "partner" | "research";
  title: string;
  description: string;
  time: string;
  status?: string;
}

const typeIcons = {
  mou: FileText,
  internship: Briefcase,
  alumni: Users,
  event: Calendar,
  partner: Building2,
  research: GraduationCap,
};

const typeColors = {
  mou: "bg-blue-500/10 text-blue-500",
  internship: "bg-green-500/10 text-green-500",
  alumni: "bg-purple-500/10 text-purple-500",
  event: "bg-orange-500/10 text-orange-500",
  partner: "bg-cyan-500/10 text-cyan-500",
  research: "bg-pink-500/10 text-pink-500",
};

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecentActivity() {
      try {
        // Fetch recent MoUs
        const { data: mous } = await supabase
          .from("mous")
          .select("id, title, status, updated_at")
          .order("updated_at", { ascending: false })
          .limit(2);

        // Fetch recent Internships
        const { data: internships } = await supabase
          .from("internships")
          .select("id, title, company_name, updated_at")
          .order("updated_at", { ascending: false })
          .limit(2);

        // Fetch recent Events
        const { data: events } = await supabase
          .from("events")
          .select("id, title, status, updated_at")
          .order("updated_at", { ascending: false })
          .limit(2);

        // Fetch recent Partners
        const { data: partners } = await supabase
          .from("industry_partners")
          .select("id, name, industry_type, updated_at")
          .order("updated_at", { ascending: false })
          .limit(2);

        const allActivities: Activity[] = [];

        if (mous) {
          mous.forEach((m) => {
            allActivities.push({
              id: m.id,
              type: "mou",
              title: m.title,
              description: `Status: ${m.status?.replace("_", " ")}`,
              time: m.updated_at,
              status: m.status,
            });
          });
        }

        if (internships) {
          internships.forEach((i) => {
            allActivities.push({
              id: i.id,
              type: "internship",
              title: i.title,
              description: `at ${i.company_name}`,
              time: i.updated_at,
            });
          });
        }

        if (events) {
          events.forEach((e) => {
            allActivities.push({
              id: e.id,
              type: "event",
              title: e.title,
              description: `Status: ${e.status}`,
              time: e.updated_at,
              status: e.status,
            });
          });
        }

        if (partners) {
          partners.forEach((p) => {
            allActivities.push({
              id: p.id,
              type: "partner",
              title: p.name,
              description: p.industry_type || "Industry Partner",
              time: p.updated_at,
            });
          });
        }

        // Sort by time and take top 6
        allActivities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
        setActivities(allActivities.slice(0, 6));
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecentActivity();

    // Set up realtime subscriptions
    const channel = supabase
      .channel("recent-activity")
      .on("postgres_changes", { event: "*", schema: "public", table: "mous" }, fetchRecentActivity)
      .on("postgres_changes", { event: "*", schema: "public", table: "internships" }, fetchRecentActivity)
      .on("postgres_changes", { event: "*", schema: "public", table: "events" }, fetchRecentActivity)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <Card variant="glass" className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3 animate-pulse">
                <div className="h-10 w-10 rounded-lg bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-muted rounded" />
                  <div className="h-3 w-1/2 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="glass" className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No recent activity to show
            </p>
          ) : (
            activities.map((activity, index) => {
              const Icon = typeIcons[activity.type];
              return (
                <div 
                  key={`${activity.type}-${activity.id}`} 
                  className={cn(
                    "flex items-start gap-4 p-3 rounded-lg transition-colors hover:bg-secondary/50",
                    "animate-fade-in"
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${typeColors[activity.type]}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium leading-tight">{activity.title}</p>
                      {activity.status === "active" && (
                        <Badge variant="glow" className="shrink-0">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Active
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground/70">
                      {formatDistanceToNow(new Date(activity.time), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
