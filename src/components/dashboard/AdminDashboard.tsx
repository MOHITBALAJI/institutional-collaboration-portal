import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Briefcase, 
  Users, 
  Building2,
  TrendingUp,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  GraduationCap
} from "lucide-react";
import { useMoUs } from "@/hooks/useMoUs";
import { useInternships } from "@/hooks/useInternships";
import { useIndustryPartners } from "@/hooks/useIndustryPartners";
import { useEvents } from "@/hooks/useEvents";

export function AdminDashboard() {
  const { mous } = useMoUs();
  const { internships } = useInternships();
  const { partners } = useIndustryPartners();
  const { events } = useEvents();

  const activeMous = mous.filter(m => m.status === 'active').length;
  const pendingMous = mous.filter(m => m.status === 'pending_approval').length;
  const activeInternships = internships.filter(i => i.status === 'open' || i.status === 'in_progress').length;
  const activePartners = partners.filter(p => p.status === 'active').length;
  const upcomingEvents = events.filter(e => e.status === 'upcoming').length;

  const recentActivity = [
    { id: 1, action: "New MoU submitted", entity: "TechCorp India", type: "mou", time: "10 min ago", status: "pending" },
    { id: 2, action: "Internship posting approved", entity: "AI Engineer Intern", type: "internship", time: "1 hour ago", status: "approved" },
    { id: 3, action: "Partner registration", entity: "GlobalTech Solutions", type: "partner", time: "2 hours ago", status: "pending" },
    { id: 4, action: "Event created", entity: "Industry Connect 2024", type: "event", time: "3 hours ago", status: "approved" },
  ];

  const expiringMous = mous.filter(m => {
    if (!m.end_date) return false;
    const daysLeft = Math.ceil((new Date(m.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return daysLeft > 0 && daysLeft <= 30;
  }).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card variant="glass" className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            {pendingMous > 0 && (
              <Badge variant="destructive" className="text-xs">{pendingMous} pending</Badge>
            )}
          </div>
          <div className="text-3xl font-bold mb-1">{activeMous}</div>
          <div className="text-sm text-muted-foreground">Active MoUs</div>
        </Card>

        <Card variant="glass" className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-success" />
            </div>
            <TrendingUp className="h-4 w-4 text-success" />
          </div>
          <div className="text-3xl font-bold mb-1">{activePartners}</div>
          <div className="text-sm text-muted-foreground">Industry Partners</div>
        </Card>

        <Card variant="glass" className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-accent" />
            </div>
          </div>
          <div className="text-3xl font-bold mb-1">{activeInternships}</div>
          <div className="text-sm text-muted-foreground">Active Internships</div>
        </Card>

        <Card variant="glass" className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-warning" />
            </div>
          </div>
          <div className="text-3xl font-bold mb-1">{upcomingEvents}</div>
          <div className="text-sm text-muted-foreground">Upcoming Events</div>
        </Card>
      </div>

      {/* Performance Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card variant="glass" className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">This Quarter's Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    Placement Rate
                  </span>
                  <span className="text-primary font-medium">92%</span>
                </div>
                <Progress value={92} className="h-3" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-success" />
                    MoU Conversion
                  </span>
                  <span className="text-success font-medium">78%</span>
                </div>
                <Progress value={78} className="h-3 [&>div]:bg-success" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-accent" />
                    Partner Engagement
                  </span>
                  <span className="text-accent font-medium">85%</span>
                </div>
                <Progress value={85} className="h-3 [&>div]:bg-accent" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-warning" />
                    Student Satisfaction
                  </span>
                  <span className="text-warning font-medium">4.5/5</span>
                </div>
                <Progress value={90} className="h-3 [&>div]:bg-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              Attention Needed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingMous > 0 && (
                <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                  <div className="flex items-center gap-2 text-warning text-sm font-medium mb-1">
                    <Clock className="h-4 w-4" />
                    {pendingMous} MoUs pending approval
                  </div>
                </div>
              )}
              {expiringMous.length > 0 && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <div className="flex items-center gap-2 text-destructive text-sm font-medium mb-1">
                    <AlertCircle className="h-4 w-4" />
                    {expiringMous.length} MoUs expiring soon
                  </div>
                </div>
              )}
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <div className="flex items-center gap-2 text-primary text-sm font-medium mb-1">
                  <CheckCircle2 className="h-4 w-4" />
                  All systems operational
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card variant="glass">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Activity</CardTitle>
          <Button variant="ghost" size="sm" className="text-primary">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                  activity.type === 'mou' ? 'bg-primary/10' :
                  activity.type === 'internship' ? 'bg-accent/10' :
                  activity.type === 'partner' ? 'bg-success/10' : 'bg-warning/10'
                }`}>
                  {activity.type === 'mou' && <FileText className="h-5 w-5 text-primary" />}
                  {activity.type === 'internship' && <Briefcase className="h-5 w-5 text-accent" />}
                  {activity.type === 'partner' && <Building2 className="h-5 w-5 text-success" />}
                  {activity.type === 'event' && <Calendar className="h-5 w-5 text-warning" />}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{activity.action}</div>
                  <div className="text-sm text-muted-foreground">{activity.entity}</div>
                </div>
                <div className="text-right">
                  <Badge variant={activity.status === 'approved' ? 'default' : 'secondary'}>
                    {activity.status}
                  </Badge>
                  <div className="text-xs text-muted-foreground mt-1">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
