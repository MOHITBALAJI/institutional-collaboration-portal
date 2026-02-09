import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  Award,
  ArrowRight,
  Clock,
  Star,
  Heart,
  TrendingUp
} from "lucide-react";
import { useEvents } from "@/hooks/useEvents";

export function AlumniDashboard() {
  const { events } = useEvents();
  const upcomingEvents = events.filter(e => e.status === 'upcoming').slice(0, 3);

  const menteeRequests = [
    { id: 1, name: "Rahul Sharma", topic: "Career Guidance in AI/ML", time: "2 hours ago" },
    { id: 2, name: "Priya Patel", topic: "Resume Review", time: "5 hours ago" },
    { id: 3, name: "Amit Kumar", topic: "Interview Preparation", time: "1 day ago" },
  ];

  return (
    <div className="space-y-6">
      {/* Impact Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card variant="glass" className="p-5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm text-muted-foreground">Sessions Done</div>
            </div>
          </div>
        </Card>
        <Card variant="glass" className="p-5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-success" />
            </div>
            <div>
              <div className="text-2xl font-bold">8</div>
              <div className="text-sm text-muted-foreground">Students Mentored</div>
            </div>
          </div>
        </Card>
        <Card variant="glass" className="p-5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center">
              <Star className="h-6 w-6 text-warning" />
            </div>
            <div>
              <div className="text-2xl font-bold">4.8</div>
              <div className="text-sm text-muted-foreground">Avg Rating</div>
            </div>
          </div>
        </Card>
        <Card variant="glass" className="p-5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <Award className="h-6 w-6 text-accent" />
            </div>
            <div>
              <div className="text-2xl font-bold">Top 10%</div>
              <div className="text-sm text-muted-foreground">Mentor Rank</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Mentee Requests */}
        <Card variant="glass">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Mentee Requests
            </CardTitle>
            <Badge variant="secondary">3 pending</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {menteeRequests.map((request) => (
                <div key={request.id} className="p-4 rounded-xl bg-secondary/30">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {request.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">{request.name}</h4>
                        <span className="text-xs text-muted-foreground">{request.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{request.topic}</p>
                      <div className="flex gap-2">
                        <Button size="sm" className="h-8">Accept</Button>
                        <Button size="sm" variant="outline" className="h-8">Schedule</Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Your Impact */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              Your Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Monthly Mentoring Goal</span>
                  <span className="text-primary font-medium">12/15 sessions</span>
                </div>
                <Progress value={80} className="h-3" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-secondary/30 text-center">
                  <div className="text-2xl font-bold text-success mb-1">5</div>
                  <div className="text-xs text-muted-foreground">Referrals Made</div>
                </div>
                <div className="p-4 rounded-xl bg-secondary/30 text-center">
                  <div className="text-2xl font-bold text-primary mb-1">2</div>
                  <div className="text-xs text-muted-foreground">Hired Successfully</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                <div className="flex items-center gap-3 mb-2">
                  <Award className="h-5 w-5 text-primary" />
                  <span className="font-medium">Impact Score</span>
                </div>
                <div className="text-3xl font-bold gradient-text">92</div>
                <p className="text-xs text-muted-foreground mt-1">Based on sessions, ratings, and placements</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events & Network */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Upcoming Events */}
        <Card variant="glass">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-accent" />
              Campus Events
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-primary">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
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
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {event.start_datetime ? new Date(event.start_datetime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'TBD'}
                    </div>
                  </div>
                  <Button size="sm" variant="outline">RSVP</Button>
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

        {/* Quick Actions */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <Users className="h-5 w-5" />
                <span className="text-xs">Post Job</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <MessageSquare className="h-5 w-5" />
                <span className="text-xs">Give Guest Lecture</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <Award className="h-5 w-5" />
                <span className="text-xs">Refer Student</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <Calendar className="h-5 w-5" />
                <span className="text-xs">Schedule Session</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
