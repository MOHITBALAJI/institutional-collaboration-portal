import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Briefcase, 
  Users, 
  GraduationCap,
  Calendar,
  ArrowRight,
  Target,
  Award,
  TrendingUp,
  Clock
} from "lucide-react";
import { useMoUs } from "@/hooks/useMoUs";
import { useInternships } from "@/hooks/useInternships";
import { useEvents } from "@/hooks/useEvents";

export function IndustryPartnerDashboard() {
  const { mous } = useMoUs();
  const { internships } = useInternships();
  const { events } = useEvents();

  const activeMous = mous.filter(m => m.status === 'active');
  const activeInternships = internships.filter(i => i.status === 'open' || i.status === 'in_progress');
  const upcomingEvents = events.filter(e => e.status === 'upcoming').slice(0, 3);

  const recentApplications = [
    { id: 1, name: "Rahul Sharma", position: "AI/ML Intern", score: 92, time: "2h ago" },
    { id: 2, name: "Priya Patel", position: "Data Science Intern", score: 88, time: "5h ago" },
    { id: 3, name: "Amit Kumar", position: "Software Developer Intern", score: 85, time: "1d ago" },
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card variant="glass" className="p-5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{activeMous.length}</div>
              <div className="text-sm text-muted-foreground">Active MoUs</div>
            </div>
          </div>
        </Card>
        <Card variant="glass" className="p-5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-success" />
            </div>
            <div>
              <div className="text-2xl font-bold">{activeInternships.length}</div>
              <div className="text-sm text-muted-foreground">Open Positions</div>
            </div>
          </div>
        </Card>
        <Card variant="glass" className="p-5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <Target className="h-6 w-6 text-accent" />
            </div>
            <div>
              <div className="text-2xl font-bold">42</div>
              <div className="text-sm text-muted-foreground">Campus Hires</div>
            </div>
          </div>
        </Card>
        <Card variant="glass" className="p-5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center">
              <Award className="h-6 w-6 text-warning" />
            </div>
            <div>
              <div className="text-2xl font-bold">Platinum</div>
              <div className="text-sm text-muted-foreground">Partner Status</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Applications & Hiring */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Applications */}
        <Card variant="glass">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Recent Applications
            </CardTitle>
            <Badge variant="secondary">89 total</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentApplications.map((app) => (
                <div key={app.id} className="p-4 rounded-xl bg-secondary/30">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold">{app.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{app.name}</h4>
                      <p className="text-sm text-muted-foreground">{app.position}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-success">{app.score}%</div>
                      <div className="text-xs text-muted-foreground">{app.time}</div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" className="flex-1">View Profile</Button>
                    <Button size="sm" variant="outline" className="flex-1">Schedule</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Hiring Pipeline */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              Hiring Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Applications Received</span>
                  <span className="font-medium">89</span>
                </div>
                <Progress value={100} className="h-3" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Shortlisted</span>
                  <span className="font-medium">34</span>
                </div>
                <Progress value={38} className="h-3 [&>div]:bg-accent" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Interviewed</span>
                  <span className="font-medium">18</span>
                </div>
                <Progress value={20} className="h-3 [&>div]:bg-warning" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Offered</span>
                  <span className="font-medium">8</span>
                </div>
                <Progress value={9} className="h-3 [&>div]:bg-success" />
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Conversion Rate</div>
                  <div className="text-2xl font-bold gradient-text">9%</div>
                </div>
                <TrendingUp className="h-8 w-8 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* MoUs & Events */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Active MoUs */}
        <Card variant="glass">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Your MoUs
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-primary">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeMous.slice(0, 3).map((mou) => (
                <div key={mou.id} className="p-4 rounded-xl bg-secondary/30">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium mb-1">{mou.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <GraduationCap className="h-3 w-3" />
                        Research Collaboration
                      </div>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                  {mou.end_date && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                      <Clock className="h-3 w-3" />
                      Expires: {new Date(mou.end_date).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
              {activeMous.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  No active MoUs
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Campus Events */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-accent" />
              Campus Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex flex-col items-center justify-center text-accent">
                    <span className="text-xs font-medium">
                      {event.start_datetime ? new Date(event.start_datetime).toLocaleDateString('en-US', { month: 'short' }) : 'TBD'}
                    </span>
                    <span className="text-lg font-bold">
                      {event.start_datetime ? new Date(event.start_datetime).getDate() : '--'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{event.title}</h4>
                    <div className="text-xs text-muted-foreground">{event.event_type}</div>
                  </div>
                  <Button size="sm" variant="outline">Sponsor</Button>
                </div>
              ))}
              {upcomingEvents.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  No upcoming events
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
