import { 
  FileText, 
  Briefcase, 
  Users, 
  GraduationCap, 
  TrendingUp,
  Building2,
  Award,
  Target
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";
import { 
  CollaborationChart, 
  SkillDemandChart, 
  SectorDistributionChart 
} from "@/components/dashboard/Charts";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="space-y-1">
          <h1 className="text-2xl lg:text-3xl font-bold font-display">
            Welcome back, <span className="gradient-text">Dr. Priya</span>
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your institution's collaborations today.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Active MoUs"
            value={47}
            change="+12% from last month"
            changeType="positive"
            icon={FileText}
          />
          <KPICard
            title="Industry Partners"
            value={156}
            change="+8 new this quarter"
            changeType="positive"
            icon={Building2}
          />
          <KPICard
            title="Active Internships"
            value={234}
            change="89% completion rate"
            changeType="neutral"
            icon={Briefcase}
          />
          <KPICard
            title="Placements 2024"
            value="92%"
            change="+5% vs last year"
            changeType="positive"
            icon={Target}
          />
        </div>

        {/* Charts Row */}
        <div className="grid gap-4 lg:grid-cols-2">
          <CollaborationChart />
          <div className="grid gap-4">
            <SkillDemandChart />
            <SectorDistributionChart />
          </div>
        </div>

        {/* Secondary KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Research Projects"
            value={28}
            change="₹2.5 Cr funding secured"
            changeType="positive"
            icon={GraduationCap}
          />
          <KPICard
            title="Alumni Mentors"
            value={89}
            change="342 sessions conducted"
            changeType="neutral"
            icon={Users}
          />
          <KPICard
            title="Publications"
            value={156}
            change="+23% citations this year"
            changeType="positive"
            icon={Award}
          />
          <KPICard
            title="Skill Index"
            value="8.4"
            change="Above industry average"
            changeType="positive"
            icon={TrendingUp}
          />
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
