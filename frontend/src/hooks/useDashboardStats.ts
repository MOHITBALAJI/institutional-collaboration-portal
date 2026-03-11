import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Milestone {
    id: string;
    category: string;
    level: number;
    progress_percent: number;
    is_completed: boolean;
}

export function useDashboardStats() {
    const [stats, setStats] = useState({
        applications: 0,
        registrations: 0,
        milestones: [] as Milestone[],
        mentorships: 0,
        loading: true
    });
    const { toast } = useToast();

    const fetchStats = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const user = session?.user;
            if (!user) return;

            const [appResult, regResult, milestoneResult, mentorResult] = await Promise.all([
                supabase
                    .from("internship_applications" as any)
                    .select("*", { count: 'exact', head: true })
                    .eq("student_id", user.id),
                supabase
                    .from("event_registrations" as any)
                    .select("*", { count: 'exact', head: true })
                    .eq("user_id", user.id),
                supabase
                    .from("learning_milestones" as any)
                    .select("*")
                    .eq("user_id", user.id),
                supabase
                    .from("mentorship_requests" as any)
                    .select("*", { count: 'exact', head: true })
                    .eq("student_id", user.id)
            ]);

            if (appResult.error || regResult.error || milestoneResult.error || mentorResult.error) {
                const errors = [appResult.error, regResult.error, milestoneResult.error, mentorResult.error].filter(Boolean);
                const isSchemaError = errors.some(e => e?.message?.includes("schema cache") || e?.code === "42P01");

                if (!isSchemaError) {
                    console.error("Stats fetching error:", {
                        appError: appResult.error,
                        regError: regResult.error,
                        milestoneError: milestoneResult.error,
                        mentorError: mentorResult.error
                    });
                } else {
                    console.warn("Some dashboard stats tables are missing. Please run 'supabase/schema_updates.sql' to enable full functionality.");
                }
            }

            setStats({
                applications: (appResult.count as number) || 0,
                registrations: (regResult.count as number) || 0,
                milestones: (milestoneResult.data as unknown as Milestone[]) || [],
                mentorships: (mentorResult.count as number) || 0,
                loading: false
            });

        } catch (error: any) {
            if (error.message?.includes("schema cache") || error.code === "42P01") {
                console.warn("Dashboard stats tables missing. Please run 'supabase/schema_updates.sql'");
                setStats(prev => ({ ...prev, loading: false }));
                return;
            }
            toast({
                variant: "destructive",
                title: "Error fetching dashboard stats",
                description: error.message,
            });
            setStats(prev => ({ ...prev, loading: false }));
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return { ...stats, refreshStats: fetchStats };
}
