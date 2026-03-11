import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Event {
  id: string;
  title: string;
  event_type: string | null;
  description: string | null;
  venue: string | null;
  mode: string | null;
  start_datetime: string | null;
  end_datetime: string | null;
  registration_deadline: string | null;
  max_participants: number | null;
  current_registrations: number | null;
  speakers: string[] | null;
  organizer: string | null;
  partner_id: string | null;
  banner_url: string | null;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  certificate_template: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("start_datetime", { ascending: false });

      if (error) {
        // Silently handle missing table (new Supabase DB)
        if (error.message?.includes("does not exist") || error.code === "42P01") {
          console.warn("Events table not found — using empty list");
          setEvents([]);
          return;
        }
        throw error;
      }
      setEvents(data || []);
    } catch (error: any) {
      console.error("Error fetching events:", error.message);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (event: Omit<Partial<Event>, 'title'> & { title: string }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("events")
        .insert([{ ...event, created_by: user?.id }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Event created",
        description: "The event has been created successfully.",
      });

      fetchEvents();
      return { data, error: null };
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error creating event",
        description: error.message,
      });
      return { data: null, error };
    }
  };

  const updateEvent = async (id: string, updates: Partial<Event>) => {
    try {
      const { data, error } = await supabase
        .from("events")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Event updated",
        description: "The event has been updated successfully.",
      });

      fetchEvents();
      return { data, error: null };
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating event",
        description: error.message,
      });
      return { data: null, error };
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const { error } = await supabase.from("events").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Event deleted",
        description: "The event has been deleted successfully.",
      });

      fetchEvents();
      return { error: null };
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error deleting event",
        description: error.message,
      });
      return { error };
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    loading,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  };
}
