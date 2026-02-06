import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: "workshop" | "hackathon" | "seminar" | "placement";
  attendees: number;
}

const events: Event[] = [
  {
    id: "1",
    title: "AI/ML Workshop by Google",
    date: "Feb 15, 2024",
    time: "10:00 AM",
    location: "Seminar Hall A",
    type: "workshop",
    attendees: 150,
  },
  {
    id: "2",
    title: "TechFest Hackathon 2024",
    date: "Feb 20, 2024",
    time: "9:00 AM",
    location: "Main Auditorium",
    type: "hackathon",
    attendees: 500,
  },
  {
    id: "3",
    title: "Campus Placement Drive",
    date: "Feb 25, 2024",
    time: "9:30 AM",
    location: "Placement Cell",
    type: "placement",
    attendees: 200,
  },
];

const typeStyles = {
  workshop: "glow",
  hackathon: "success",
  seminar: "secondary",
  placement: "warning",
} as const;

export function UpcomingEvents() {
  return (
    <Card variant="glass" className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.map((event, index) => (
          <div
            key={event.id}
            className="p-4 rounded-lg border border-border/50 bg-secondary/20 hover:bg-secondary/40 transition-colors animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="font-medium text-sm">{event.title}</h4>
              <Badge variant={typeStyles[event.type]}>{event.type}</Badge>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{event.date} at {event.time}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Users className="h-3 w-3" />
                <span>{event.attendees} registered</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
