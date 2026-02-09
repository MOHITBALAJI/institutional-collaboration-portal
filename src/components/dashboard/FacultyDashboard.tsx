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
  Lightbulb
} from "lucide-react";
import { useResearchProjects } from "@/hooks/useResearchProjects";
import { useMoUs } from "@/hooks/useMoUs";
import { useEvents } from "@/hooks/useEvents";

export function FacultyDashboard() {
  const { projects } = useResearchProjects();
  const { mous } = useMoUs();
  const { events } = useEvents();

  const activeProjects = projects.filter(p => p.status === 'in_progress' || p.status === 'approved');
  const upcomingEvents = events.filter(e => e.status === 'upcoming').slice(0, 3);

  const totalFunding = projects.reduce((sum, p) => sum + (p.funding_amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card variant="glass" className="p-5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{activeProjects.length}</div>
              <div className="text-sm text-muted-foreground">Active Projects</div>
            </div>
          </div>
        </Card>
        <Card variant="glass" className="p-5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
              <IndianRupee className="h-6 w-6 text-success" />
            </div>
            <div>
              <div className="text-2xl font-bold">₹{(totalFunding / 100000).toFixed(1)}L</div>
              <div className="text-sm text-muted-foreground">Total Funding</div>
            </div>
          </div>
        </Card>
        <Card variant="glass" className="p-5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-accent" />
            </div>
            <div>
              <div className="text-2xl font-bold">24</div>
              <div className="text-sm text-muted-foreground">Students Mentored</div>
            </div>
          </div>
        </Card>
        <Card variant="glass" className="p-5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-warning" />
            </div>
            <div>
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm text-muted-foreground">Publications</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Projects & MoUs */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Active Research Projects */}
        <Card variant="glass">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              My Research Projects
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-primary">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeProjects.slice(0, 3).map((project) => (
                <div key={project.id} className="p-4 rounded-xl bg-secondary/30">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium mb-1 line-clamp-1">{project.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {project.funding_source || 'Self-funded'}
                      </p>
                    </div>
                    <Badge variant={project.status === 'in_progress' ? 'default' : 'secondary'}>
                      {project.status?.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progress</span>
                      <span>65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                </div>
              ))}
              {activeProjects.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  No active projects
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Assigned MoUs */}
        <Card variant="glass">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-success" />
              Assigned MoUs
            </CardTitle>
            <Badge variant="outline">{mous.length} total</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mous.slice(0, 3).map((mou) => (
                <div key={mou.id} className="p-4 rounded-xl bg-secondary/30">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium mb-1">{mou.title}</h4>
                      <p className="text-sm text-muted-foreground">{mou.partner_name}</p>
                    </div>
                    <Badge 
                      variant={
                        mou.status === 'active' ? 'default' : 
                        mou.status === 'pending_approval' ? 'secondary' : 'outline'
                      }
                    >
                      {mou.status?.replace('_', ' ')}
                    </Badge>
                  </div>
                  {mou.end_date && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                      <Clock className="h-3 w-3" />
                      Expires: {new Date(mou.end_date).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
              {mous.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  No MoUs assigned
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events & Performance */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Upcoming Events */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-accent" />
              Upcoming Events
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

        {/* Department Performance */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-warning" />
              Department Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Student Placement Rate</span>
                  <span className="text-success font-medium">85%</span>
                </div>
                <Progress value={85} className="h-3 [&>div]:bg-success" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Research Output</span>
                  <span className="text-primary font-medium">78%</span>
                </div>
                <Progress value={78} className="h-3" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Industry Collaboration</span>
                  <span className="text-accent font-medium">92%</span>
                </div>
                <Progress value={92} className="h-3 [&>div]:bg-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
