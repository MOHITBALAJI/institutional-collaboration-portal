import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Internship {
  id: string;
  title: string;
  partner_id: string | null;
  company_name: string | null;
  description: string | null;
  requirements: string[] | null;
  skills_required: string[] | null;
  duration: string | null;
  stipend: number | null;
  location: string | null;
  mode: string | null;
  positions: number | null;
  application_deadline: string | null;
  start_date: string | null;
  status: "open" | "closed" | "in_progress" | "completed";
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export function useInternships() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchInternships = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("internships")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setInternships(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error fetching internships",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const createInternship = async (internship: Omit<Partial<Internship>, 'title'> & { title: string }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("internships")
        .insert([{ ...internship, created_by: user?.id }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Internship created",
        description: "The internship has been posted successfully.",
      });

      fetchInternships();
      return { data, error: null };
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error creating internship",
        description: error.message,
      });
      return { data: null, error };
    }
  };

  const updateInternship = async (id: string, updates: Partial<Internship>) => {
    try {
      const { data, error } = await supabase
        .from("internships")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Internship updated",
        description: "The internship has been updated successfully.",
      });

      fetchInternships();
      return { data, error: null };
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating internship",
        description: error.message,
      });
      return { data: null, error };
    }
  };

  const deleteInternship = async (id: string) => {
    try {
      const { error } = await supabase.from("internships").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Internship deleted",
        description: "The internship has been deleted successfully.",
      });

      fetchInternships();
      return { error: null };
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error deleting internship",
        description: error.message,
      });
      return { error };
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  return {
    internships,
    loading,
    fetchInternships,
    createInternship,
    updateInternship,
    deleteInternship,
  };
}
