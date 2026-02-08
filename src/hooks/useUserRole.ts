import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

type AppRole = "admin" | "industry_partner" | "faculty" | "student" | "alumni";

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  department: string | null;
  designation: string | null;
  avatar_url: string | null;
  phone: string | null;
  bio: string | null;
}

export function useUserRole() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch user role
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .single();

      if (roleError && roleError.code !== "PGRST116") {
        console.error("Error fetching role:", roleError);
      }
      
      if (roleData) {
        setRole(roleData.role as AppRole);
      }

      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        console.error("Error fetching profile:", profileError);
      }
      
      if (profileData) {
        setProfile(profileData);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserData(session.user.id);
        } else {
          setRole(null);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchUserData(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isAdmin = role === "admin";
  const isFaculty = role === "faculty";
  const isStudent = role === "student";
  const isAlumni = role === "alumni";
  const isIndustryPartner = role === "industry_partner";

  return {
    user,
    role,
    profile,
    loading,
    isAdmin,
    isFaculty,
    isStudent,
    isAlumni,
    isIndustryPartner,
    refetch: () => user && fetchUserData(user.id),
  };
}
