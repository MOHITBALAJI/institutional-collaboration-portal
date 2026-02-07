import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface IndustryPartner {
  id: string;
  name: string;
  industry_type: string | null;
  contact_person: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  address: string | null;
  website: string | null;
  logo_url: string | null;
  description: string | null;
  partnership_since: string | null;
  status: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export function useIndustryPartners() {
  const [partners, setPartners] = useState<IndustryPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("industry_partners")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      setPartners(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error fetching partners",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const createPartner = async (partner: Omit<Partial<IndustryPartner>, 'name'> & { name: string }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("industry_partners")
        .insert([{ ...partner, created_by: user?.id }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Partner added",
        description: "The industry partner has been added successfully.",
      });

      fetchPartners();
      return { data, error: null };
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error adding partner",
        description: error.message,
      });
      return { data: null, error };
    }
  };

  const updatePartner = async (id: string, updates: Partial<IndustryPartner>) => {
    try {
      const { data, error } = await supabase
        .from("industry_partners")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Partner updated",
        description: "The industry partner has been updated successfully.",
      });

      fetchPartners();
      return { data, error: null };
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating partner",
        description: error.message,
      });
      return { data: null, error };
    }
  };

  const deletePartner = async (id: string) => {
    try {
      const { error } = await supabase.from("industry_partners").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Partner deleted",
        description: "The industry partner has been deleted successfully.",
      });

      fetchPartners();
      return { error: null };
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error deleting partner",
        description: error.message,
      });
      return { error };
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  return {
    partners,
    loading,
    fetchPartners,
    createPartner,
    updatePartner,
    deletePartner,
  };
}
