import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";
import { 
  CollaborationChart, 
  SkillDemandChart, 
  SectorDistributionChart 
} from "@/components/dashboard/Charts";
import { RoleBasedKPIs } from "@/components/dashboard/RoleBasedKPIs";
import { useUserRole } from "@/hooks/useUserRole";

const roleGreetings = {
  admin: "Administrator",
  faculty: "Professor",
  student: "Student",
  alumni: "Alumni Member",
  industry_partner: "Industry Partner",
};

export default function Dashboard() {
  const { profile, role, loading } = useUserRole();
  
  const firstName = profile?.full_name?.split(" ")[0] || "User";
  const greeting = role ? roleGreetings[role] : "User";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="space-y-1">
          <h1 className="text-2xl lg:text-3xl font-bold font-display">
            Welcome back, <span className="gradient-text">{loading ? "..." : firstName}</span>
          </h1>
          <p className="text-muted-foreground">
            {role === "admin" && "Here's what's happening with your institution's collaborations today."}
            {role === "faculty" && "Track your research projects, students, and collaboration activities."}
            {role === "student" && "Explore internships, events, and mentorship opportunities."}
            {role === "alumni" && "Connect with students and contribute to your alma mater."}
            {role === "industry_partner" && "Manage your collaborations and track campus engagement."}
            {!role && "Here's your personalized dashboard."}
          </p>
        </div>

        {/* Role-Based KPI Cards */}
        <RoleBasedKPIs />

        {/* Charts Row - Show different charts based on role */}
        <div className="grid gap-4 lg:grid-cols-2">
          <CollaborationChart />
          <div className="grid gap-4">
            <SkillDemandChart />
            <SectorDistributionChart />
          </div>
        </div>

        {/* Activity & Events Row */}
        <div className="grid gap-4 lg:grid-cols-2">
          <RecentActivity />
          <UpcomingEvents />
        </div>
      </div>
    </DashboardLayout>
  );
}
