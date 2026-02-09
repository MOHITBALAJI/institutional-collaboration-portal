import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useUserRole } from "@/hooks/useUserRole";
import { StudentDashboard } from "@/components/dashboard/StudentDashboard";
import { AlumniDashboard } from "@/components/dashboard/AlumniDashboard";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { FacultyDashboard } from "@/components/dashboard/FacultyDashboard";
import { IndustryPartnerDashboard } from "@/components/dashboard/IndustryPartnerDashboard";
import { Loader2 } from "lucide-react";

const roleGreetings = {
  admin: "Administrator",
  faculty: "Professor",
  student: "Student",
  alumni: "Alumni Member",
  industry_partner: "Industry Partner",
};

const roleDescriptions = {
  admin: "Manage collaborations, partners, and track institutional performance.",
  faculty: "Monitor research projects, mentorship, and departmental activities.",
  student: "Discover internships, events, and connect with mentors.",
  alumni: "Guide students, share opportunities, and stay connected.",
  industry_partner: "Manage hiring, MoUs, and campus engagement.",
};

export default function Dashboard() {
  const { profile, role, loading, isAdmin, isFaculty, isStudent, isAlumni, isIndustryPartner } = useUserRole();
  
  const firstName = profile?.full_name?.split(" ")[0] || "User";
  const greeting = role ? roleGreetings[role] : "User";
  const description = role ? roleDescriptions[role] : "Here's your personalized dashboard.";

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="space-y-1">
          <h1 className="text-2xl lg:text-3xl font-bold font-display">
            Welcome back, <span className="gradient-text">{firstName}</span>
          </h1>
          <p className="text-muted-foreground">{description}</p>
        </div>

        {/* Role-Specific Dashboard */}
        {isStudent && <StudentDashboard />}
        {isAlumni && <AlumniDashboard />}
        {isAdmin && <AdminDashboard />}
        {isFaculty && <FacultyDashboard />}
        {isIndustryPartner && <IndustryPartnerDashboard />}
        
        {/* Fallback for no role */}
        {!role && <StudentDashboard />}
      </div>
    </DashboardLayout>
  );
}
