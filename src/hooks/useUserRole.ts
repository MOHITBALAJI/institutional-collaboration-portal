import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type AppRole = "admin" | "industry_partner" | "faculty" | "student" | "alumni";

export interface UserProfile {
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
  const { user, loading: authLoading } = useAuth();
  const [role, setRole] = useState<AppRole | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (userId: string) => {
    try {
      setLoading(true);
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
      } else {
        // Auto-assign "student" role for new users
        try {
          const { error: insertRoleError } = await supabase
            .from("user_roles")
            .insert({ user_id: userId, role: "student" });
          if (!insertRoleError) {
            setRole("student");
          } else {
            // Table might not exist yet — fall back to student in memory
            console.warn("Could not auto-assign role:", insertRoleError.message);
            setRole("student");
          }
        } catch {
          setRole("student");
        }
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
      } else {
        // Auto-create a basic profile for new users
        try {
          const { data: userData } = await supabase.auth.getUser();
          const email = userData?.user?.email || null;
          const fullName = userData?.user?.user_metadata?.full_name || email?.split("@")[0] || null;
          const { data: newProfile } = await supabase
            .from("profiles")
            .insert({ user_id: userId, email, full_name: fullName })
            .select()
            .single();
          if (newProfile) {
            setProfile(newProfile);
          }
        } catch {
          console.warn("Could not auto-create profile");
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        fetchUserData(user.id);
      } else {
        setRole(null);
        setProfile(null);
        setLoading(false);
      }
    }
  }, [user, authLoading]);

  const isAdmin = role === "admin";
  const isFaculty = role === "faculty";
  const isStudent = role === "student";
  const isAlumni = role === "alumni";
  const isIndustryPartner = role === "industry_partner";

  return {
    user,
    role,
    profile,
    loading: authLoading || loading,
    isAdmin,
    isFaculty,
    isStudent,
    isAlumni,
    isIndustryPartner,
    refetch: () => user && fetchUserData(user.id),
  };
}
