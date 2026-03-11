import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Alumni {
  id: string;
  user_id: string | null;
  full_name: string;
  email: string | null;
  phone: string | null;
  graduation_year: number | null;
  department: string | null;
  degree: string | null;
  current_company: string | null;
  current_position: string | null;
  linkedin_url: string | null;
  is_mentor: boolean | null;
  mentorship_areas: string[] | null;
  availability: string | null;
  verified: boolean | null;
  created_at: string;
  updated_at: string;
}

export function useAlumni() {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAlumni = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("alumni")
        .select("*")
        .order("graduation_year", { ascending: false });

      if (error) throw error;
      setAlumni(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error fetching alumni",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const createAlumni = async (alumniData: Omit<Partial<Alumni>, 'full_name'> & { full_name: string }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("alumni")
        .insert([{ ...alumniData, user_id: user?.id }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Alumni profile created",
        description: "The alumni profile has been created successfully.",
      });

      fetchAlumni();
      return { data, error: null };
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error creating alumni profile",
        description: error.message,
      });
      return { data: null, error };
    }
  };

  const updateAlumni = async (id: string, updates: Partial<Alumni>) => {
    try {
      const { data, error } = await supabase
        .from("alumni")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Alumni profile updated",
        description: "The alumni profile has been updated successfully.",
      });

      fetchAlumni();
      return { data, error: null };
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating alumni profile",
        description: error.message,
      });
      return { data: null, error };
    }
  };

  const deleteAlumni = async (id: string) => {
    try {
      const { error } = await supabase.from("alumni").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Alumni profile deleted",
        description: "The alumni profile has been deleted successfully.",
      });

      fetchAlumni();
      return { error: null };
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error deleting alumni profile",
        description: error.message,
      });
      return { error };
    }
  };

  useEffect(() => {
    fetchAlumni();
  }, []);

  return {
    alumni,
    loading,
    fetchAlumni,
    createAlumni,
    updateAlumni,
    deleteAlumni,
  };
}
