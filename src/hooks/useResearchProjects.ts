import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ResearchProject {
  id: string;
  title: string;
  principal_investigator: string | null;
  co_investigators: string[] | null;
  partner_id: string | null;
  abstract: string | null;
  objectives: string[] | null;
  methodology: string | null;
  funding_amount: number | null;
  funding_source: string | null;
  start_date: string | null;
  end_date: string | null;
  status: "proposal" | "approved" | "in_progress" | "completed" | "published";
  publications: string[] | null;
  patents: string[] | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export function useResearchProjects() {
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("research_projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error fetching research projects",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (project: Omit<Partial<ResearchProject>, 'title'> & { title: string }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("research_projects")
        .insert([{ ...project, created_by: user?.id }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Research project created",
        description: "The research project has been created successfully.",
      });

      fetchProjects();
      return { data, error: null };
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error creating research project",
        description: error.message,
      });
      return { data: null, error };
    }
  };

  const updateProject = async (id: string, updates: Partial<ResearchProject>) => {
    try {
      const { data, error } = await supabase
        .from("research_projects")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Research project updated",
        description: "The research project has been updated successfully.",
      });

      fetchProjects();
      return { data, error: null };
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating research project",
        description: error.message,
      });
      return { data: null, error };
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase.from("research_projects").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Research project deleted",
        description: "The research project has been deleted successfully.",
      });

      fetchProjects();
      return { error: null };
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error deleting research project",
        description: error.message,
      });
      return { error };
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    loading,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  };
}
