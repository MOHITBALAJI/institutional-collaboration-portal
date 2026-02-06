import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Users, 
  Briefcase, 
  GraduationCap,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  type: "mou" | "internship" | "research" | "event" | "mentorship";
  title: string;
  description: string;
  time: string;
  status: "pending" | "approved" | "completed" | "active";
}

const activities: Activity[] = [
  {
    id: "1",
    type: "mou",
    title: "New MoU with TechCorp India",
    description: "Partnership for AI research collaboration",
    time: "2 hours ago",
    status: "pending",
  },
  {
    id: "2",
    type: "internship",
    title: "15 Students Placed at Infosys",
    description: "Summer internship program 2024",
    time: "5 hours ago",
    status: "completed",
  },
  {
    id: "3",
    type: "research",
    title: "IoT Research Grant Approved",
    description: "₹25 Lakhs funding from DST",
    time: "1 day ago",
    status: "approved",
  },
  {
    id: "4",
    type: "event",
    title: "Industry Workshop Scheduled",
    description: "Cloud Computing with AWS experts",
    time: "2 days ago",
    status: "active",
  },
  {
    id: "5",
    type: "mentorship",
    title: "New Mentor Registration",
    description: "Alumni from Google joined as mentor",
    time: "3 days ago",
    status: "active",
  },
];

const iconMap = {
  mou: FileText,
  internship: Briefcase,
  research: GraduationCap,
  event: Users,
  mentorship: GraduationCap,
};

const statusStyles = {
  pending: "warning",
  approved: "success",
  completed: "default",
  active: "glow",
} as const;

export function RecentActivity() {
  return (
    <Card variant="glass" className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = iconMap[activity.type];
          return (
            <div
              key={activity.id}
              className={cn(
                "flex items-start gap-4 p-3 rounded-lg transition-colors hover:bg-secondary/50",
                "animate-fade-in"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium leading-tight">
                    {activity.title}
                  </p>
                  <Badge variant={statusStyles[activity.status]} className="shrink-0">
                    {activity.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {activity.description}
                </p>
                <p className="text-xs text-muted-foreground/70">
                  {activity.time}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
