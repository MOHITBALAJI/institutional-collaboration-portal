import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface Event {
  id: string;
  title: string;
  event_type: string | null;
  mode: string | null;
  venue: string | null;
  start_datetime: string | null;
  max_participants: number | null;
  current_registrations: number | null;
  status: string;
}

const modeColors = {
  online: "bg-blue-500/10 text-blue-500",
  offline: "bg-green-500/10 text-green-500",
  hybrid: "bg-purple-500/10 text-purple-500",
};

const typeStyles = {
  workshop: "glow",
  hackathon: "success",
  seminar: "secondary",
  conference: "warning",
  webinar: "default",
  competition: "success",
} as const;

export function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUpcomingEvents() {
      try {
        const { data, error } = await supabase
          .from("events")
          .select("id, title, event_type, mode, venue, start_datetime, max_participants, current_registrations, status")
          .eq("status", "upcoming")
          .order("start_datetime", { ascending: true })
          .limit(4);

        if (error) {
          // Silently handle missing table (new Supabase DB)
          if (error.message?.includes("does not exist") || error.code === "42P01") {
            console.warn("Events table not found — using empty list");
            setEvents([]);
            setLoading(false);
            return;
          }
          throw error;
        }
        setEvents(data || []);
      } catch (error) {
        console.warn("Error fetching events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }

    fetchUpcomingEvents();

    // Set up realtime subscription
    const channel = supabase
      .channel("upcoming-events")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "events" },
        fetchUpcomingEvents
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <Card variant="glass" className="h-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 rounded-lg border border-border/50 animate-pulse">
                <div className="h-5 w-3/4 bg-muted rounded mb-2" />
                <div className="h-4 w-1/2 bg-muted rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="glass" className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Upcoming Events
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={() => navigate("/events")}>
          View All
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No upcoming events scheduled
          </p>
        ) : (
          events.map((event, index) => (
            <div
              key={event.id}
              className="p-4 rounded-lg border border-border/50 bg-secondary/20 hover:bg-secondary/40 transition-colors cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => navigate("/events")}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="font-medium text-sm">{event.title}</h4>
                <Badge variant={typeStyles[event.event_type as keyof typeof typeStyles] || "secondary"}>
                  {event.event_type}
                </Badge>
              </div>
              <div className="space-y-1">
                {event.start_datetime && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{format(new Date(event.start_datetime), "MMM d, yyyy 'at' h:mm a")}</span>
                  </div>
                )}
                {event.venue && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{event.venue.length > 30 ? event.venue.slice(0, 30) + "..." : event.venue}</span>
                  </div>
                )}
                {event.max_participants && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Users className="h-3 w-3" />
                    <span>{event.current_registrations || 0}/{event.max_participants} registered</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
