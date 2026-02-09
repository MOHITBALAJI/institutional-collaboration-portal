import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Briefcase, 
  Calendar, 
  BookOpen, 
  Users, 
  ArrowRight,
  Clock,
  MapPin,
  Star,
  Trophy,
  Target
} from "lucide-react";
import { useInternships } from "@/hooks/useInternships";
import { useEvents } from "@/hooks/useEvents";
import { useAlumni } from "@/hooks/useAlumni";

export function StudentDashboard() {
  const { internships } = useInternships();
  const { events } = useEvents();
  const { alumni } = useAlumni();

  const openInternships = internships.filter(i => i.status === 'open').slice(0, 4);
  const upcomingEvents = events.filter(e => e.status === 'upcoming').slice(0, 3);
  const mentors = alumni.filter(a => a.is_mentor).slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Welcome & Progress */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card variant="glass" className="md:col-span-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-1">Your Career Progress</h3>
                <p className="text-sm text-muted-foreground">Complete your profile to unlock more opportunities</p>
              </div>
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Trophy className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Profile Completion</span>
                  <span className="text-primary font-medium">78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Skill Assessment</span>
                  <span className="text-primary font-medium">65%</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="h-20 w-20 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
                <Target className="h-10 w-10 text-primary" />
              </div>
              <div className="text-3xl font-bold gradient-text mb-1">7.8</div>
              <p className="text-sm text-muted-foreground">Skill Score</p>
              <Badge variant="secondary" className="mt-3">+0.5 this month</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{openInternships.length}</div>
              <div className="text-xs text-muted-foreground">Open Internships</div>
            </div>
          </div>
        </Card>
        <Card variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-success" />
            </div>
            <div>
              <div className="text-2xl font-bold">5</div>
              <div className="text-xs text-muted-foreground">Applications</div>
            </div>
          </div>
        </Card>
        <Card variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-accent" />
            </div>
            <div>
              <div className="text-2xl font-bold">{upcomingEvents.length}</div>
              <div className="text-xs text-muted-foreground">Upcoming Events</div>
            </div>
          </div>
        </Card>
        <Card variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-warning" />
            </div>
            <div>
              <div className="text-2xl font-bold">{mentors.length}</div>
              <div className="text-xs text-muted-foreground">Available Mentors</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Internship Opportunities */}
      <Card variant="glass">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recommended Internships</CardTitle>
          <Button variant="ghost" size="sm" className="text-primary">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {openInternships.map((internship) => (
              <div 
                key={internship.id} 
                className="p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{internship.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{internship.company_name}</p>
                    <div className="flex flex-wrap gap-2">
                      {internship.skills_required?.slice(0, 3).map((skill, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground mb-1">
                      <MapPin className="h-3 w-3" />
                      {internship.location || 'Remote'}
                    </div>
                    <div className="text-primary font-medium">
                      ₹{internship.stipend?.toLocaleString()}/mo
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {openInternships.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No internships available at the moment
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Events & Mentors Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Upcoming Events */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex flex-col items-center justify-center text-primary">
                    <span className="text-xs font-medium">
                      {event.start_datetime ? new Date(event.start_datetime).toLocaleDateString('en-US', { month: 'short' }) : 'TBD'}
                    </span>
                    <span className="text-lg font-bold">
                      {event.start_datetime ? new Date(event.start_datetime).getDate() : '--'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{event.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {event.start_datetime ? new Date(event.start_datetime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'TBD'}
                    </div>
                  </div>
                  <Badge variant="secondary">{event.mode || 'Online'}</Badge>
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

        {/* Connect with Mentors */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-accent" />
              Connect with Mentors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mentors.map((mentor) => (
                <div key={mentor.id} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30">
                  <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <span className="text-lg font-semibold text-accent">
                      {mentor.full_name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{mentor.full_name}</h4>
                    <p className="text-sm text-muted-foreground truncate">
                      {mentor.current_position} at {mentor.current_company}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-warning">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-medium">4.8</span>
                  </div>
                </div>
              ))}
              {mentors.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  No mentors available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
