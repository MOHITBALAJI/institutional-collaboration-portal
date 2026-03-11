import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface MoU {
  id: string;
  title: string;
  partner_id: string | null;
  partner_name: string | null;
  description: string | null;
  objectives: string[] | null;
  start_date: string | null;
  end_date: string | null;
  status: "draft" | "pending_approval" | "active" | "expired" | "terminated";
  document_url: string | null;
  key_deliverables: string[] | null;
  budget: number | null;
  assigned_faculty: string | null;
  created_by: string | null;
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
}

export function useMoUs() {
  const [mous, setMous] = useState<MoU[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchMoUs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("mous")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMous(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error fetching MoUs",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const createMoU = async (mou: Omit<Partial<MoU>, 'title'> & { title: string }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("mous")
        .insert([{ ...mou, created_by: user?.id }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "MoU created",
        description: "The MoU has been created successfully.",
      });

      fetchMoUs();
      return { data, error: null };
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error creating MoU",
        description: error.message,
      });
      return { data: null, error };
    }
  };

  const updateMoU = async (id: string, updates: Partial<MoU>) => {
    try {
      const { data, error } = await supabase
        .from("mous")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "MoU updated",
        description: "The MoU has been updated successfully.",
      });

      fetchMoUs();
      return { data, error: null };
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating MoU",
        description: error.message,
      });
      return { data: null, error };
    }
  };

  const deleteMoU = async (id: string) => {
    try {
      const { error } = await supabase.from("mous").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "MoU deleted",
        description: "The MoU has been deleted successfully.",
      });

      fetchMoUs();
      return { error: null };
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error deleting MoU",
        description: error.message,
      });
      return { error };
    }
  };

  useEffect(() => {
    fetchMoUs();
  }, []);

  return {
    mous,
    loading,
    fetchMoUs,
    createMoU,
    updateMoU,
    deleteMoU,
  };
}
