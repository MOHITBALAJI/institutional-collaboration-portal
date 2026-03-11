import { useUserRole } from "@/hooks/useUserRole";
import { 
  FileText, 
  Briefcase, 
  Users, 
  GraduationCap, 
  TrendingUp,
  Building2,
  Award,
  Target,
  Calendar,
  BookOpen,
  ClipboardList,
  MessageSquare
} from "lucide-react";
import { KPICard } from "./KPICard";

export function RoleBasedKPIs() {
  const { role, isAdmin, isFaculty, isStudent, isAlumni, isIndustryPartner } = useUserRole();

  // Admin sees all KPIs
  if (isAdmin) {
    return (
      <>
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
      </>
    );
  }

  // Faculty sees research and student-related KPIs
  if (isFaculty) {
    return (
      <>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="My Research Projects"
            value={5}
            change="2 in progress"
            changeType="neutral"
            icon={GraduationCap}
          />
          <KPICard
            title="Students Mentored"
            value={24}
            change="+8 this semester"
            changeType="positive"
            icon={Users}
          />
          <KPICard
            title="Publications"
            value={12}
            change="3 pending review"
            changeType="neutral"
            icon={BookOpen}
          />
          <KPICard
            title="MoUs Assigned"
            value={3}
            change="All active"
            changeType="positive"
            icon={FileText}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Funding Secured"
            value="₹45L"
            change="Current FY"
            changeType="positive"
            icon={TrendingUp}
          />
          <KPICard
            title="Industry Collabs"
            value={4}
            change="2 new proposals"
            changeType="positive"
            icon={Building2}
          />
          <KPICard
            title="Upcoming Events"
            value={3}
            change="Next: AI Workshop"
            changeType="neutral"
            icon={Calendar}
          />
          <KPICard
            title="Student Placements"
            value="85%"
            change="Your department"
            changeType="positive"
            icon={Target}
          />
        </div>
      </>
    );
  }

  // Student sees internship and learning-focused KPIs
  if (isStudent) {
    return (
      <>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Open Internships"
            value={42}
            change="15 match your profile"
            changeType="positive"
            icon={Briefcase}
          />
          <KPICard
            title="My Applications"
            value={5}
            change="2 shortlisted"
            changeType="positive"
            icon={ClipboardList}
          />
          <KPICard
            title="Upcoming Events"
            value={8}
            change="3 registered"
            changeType="neutral"
            icon={Calendar}
          />
          <KPICard
            title="Skill Score"
            value="7.8"
            change="+0.5 this month"
            changeType="positive"
            icon={TrendingUp}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Mentorship Sessions"
            value={3}
            change="Next: Tomorrow 4PM"
            changeType="neutral"
            icon={MessageSquare}
          />
          <KPICard
            title="Certifications"
            value={2}
            change="1 in progress"
            changeType="positive"
            icon={Award}
          />
          <KPICard
            title="Industry Partners"
            value={156}
            change="Explore opportunities"
            changeType="neutral"
            icon={Building2}
          />
          <KPICard
            title="Alumni Mentors"
            value={89}
            change="Connect now"
            changeType="neutral"
            icon={Users}
          />
        </div>
      </>
    );
  }

  // Alumni sees mentorship and network KPIs
  if (isAlumni) {
    return (
      <>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Mentorship Sessions"
            value={12}
            change="4.8★ avg rating"
            changeType="positive"
            icon={MessageSquare}
          />
          <KPICard
            title="Students Mentored"
            value={8}
            change="+3 this month"
            changeType="positive"
            icon={Users}
          />
          <KPICard
            title="Referrals Made"
            value={5}
            change="2 hired successfully"
            changeType="positive"
            icon={Target}
          />
          <KPICard
            title="Events Attended"
            value={6}
            change="2 upcoming"
            changeType="neutral"
            icon={Calendar}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Network Size"
            value={245}
            change="+18 connections"
            changeType="positive"
            icon={Users}
          />
          <KPICard
            title="Job Postings"
            value={3}
            change="From your company"
            changeType="neutral"
            icon={Briefcase}
          />
          <KPICard
            title="Guest Lectures"
            value={2}
            change="1 scheduled"
            changeType="neutral"
            icon={GraduationCap}
          />
          <KPICard
            title="Impact Score"
            value="92"
            change="Top 10% mentor"
            changeType="positive"
            icon={Award}
          />
        </div>
      </>
    );
  }

  // Industry Partner sees collaboration KPIs
  if (isIndustryPartner) {
    return (
      <>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Active MoUs"
            value={3}
            change="1 renewal pending"
            changeType="neutral"
            icon={FileText}
          />
          <KPICard
            title="Interns Hired"
            value={15}
            change="8 currently active"
            changeType="positive"
            icon={Briefcase}
          />
          <KPICard
            title="Campus Hires"
            value={42}
            change="+12 this year"
            changeType="positive"
            icon={Target}
          />
          <KPICard
            title="Research Collabs"
            value={2}
            change="₹50L funding"
            changeType="positive"
            icon={GraduationCap}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Events Sponsored"
            value={4}
            change="1 upcoming hackathon"
            changeType="neutral"
            icon={Calendar}
          />
          <KPICard
            title="Guest Sessions"
            value={6}
            change="2 scheduled"
            changeType="neutral"
            icon={MessageSquare}
          />
          <KPICard
            title="Student Applications"
            value={89}
            change="23 new this week"
            changeType="positive"
            icon={ClipboardList}
          />
          <KPICard
            title="Partnership Score"
            value="94"
            change="Platinum partner"
            changeType="positive"
            icon={Award}
          />
        </div>
      </>
    );
  }

  // Default fallback
  return (
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
  );
}
