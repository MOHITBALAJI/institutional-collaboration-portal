import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useUserRole } from "@/hooks/useUserRole";
import { StudentDashboard } from "@/components/dashboard/StudentDashboard";
import { AlumniDashboard } from "@/components/dashboard/AlumniDashboard";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { FacultyDashboard } from "@/components/dashboard/FacultyDashboard";
import { IndustryPartnerDashboard } from "@/components/dashboard/IndustryPartnerDashboard";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, LucideIcon } from "lucide-react";
import { useEvents } from "@/hooks/useEvents";
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

function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function Dashboard() {
  const { profile, role, loading, isAdmin, isFaculty, isStudent, isAlumni, isIndustryPartner } = useUserRole();
  const { events } = useEvents();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second for better sync

    return () => clearInterval(timer);
  }, []);

  const firstName = profile?.full_name?.split(" ")[0] || "User";
  const description = role ? roleDescriptions[role] : "Here's your personalized dashboard.";
  const timeGreeting = getTimeGreeting();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="h-12 w-12 mx-auto rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
            </div>
            <p className="text-sm text-muted-foreground animate-pulse">Loading your dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in pb-10">
        {/* Premium Hero Section */}
        <div className="relative overflow-hidden rounded-3xl p-8 md:p-12 shadow-2xl">
          {/* Dynamic Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/10" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay" />
          <div className="absolute -top-24 -right-24 h-96 w-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-24 -left-24 h-96 w-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-700" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-muted-foreground backdrop-blur-md">
                  {timeGreeting}
                </span>
                <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold uppercase tracking-widest text-primary backdrop-blur-md">
                  {roleGreetings[role || "student"]} Mode
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-display tracking-tight text-foreground leading-[0.9]">
                Hello MOHIT,
              </h1>

              <p className="text-lg text-muted-foreground/80 font-medium leading-relaxed max-w-lg">
                {description}
              </p>
            </div>

            {/* Weather/Date Widget / Calendar */}
            <div className="flex flex-col items-end gap-4">
              <div className="text-right">
                <p className="text-3xl font-black font-display text-primary drop-shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]">
                  {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </p>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                  {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="glass"
                    className="group h-12 px-6 rounded-2xl border-primary/20 hover:border-primary/40 bg-primary/10 dark:bg-primary/5 hover:bg-primary/20 transition-all duration-500 shadow-xl"
                  >
                    <CalendarIcon className="mr-2 h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-black uppercase tracking-widest">Calendar</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0 bg-background/95 dark:bg-black/80 backdrop-blur-2xl border-border dark:border-white/10 rounded-[2rem] overflow-hidden shadow-2xl" align="end">
                  <div className="p-4 border-b border-white/5 bg-gradient-to-r from-primary/10 to-transparent">
                    <h4 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                      Upcoming Nodes ({events.filter(e => e.status === 'upcoming').length})
                    </h4>
                  </div>
                  <CalendarComponent
                    mode="single"
                    className="p-3"
                    modifiers={{
                      event: (date) => events.some(e => e.start_datetime && new Date(e.start_datetime).toDateString() === date.toDateString())
                    }}
                    modifiersClassNames={{
                      event: "bg-primary/10 text-primary border border-primary/20 font-bold"
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* Dashboard Content Area - Bento Grid Container */}
        <div className="relative z-10">
          {isStudent && <StudentDashboard />}
          {isAlumni && <AlumniDashboard />}
          {isAdmin && <AdminDashboard />}
          {isFaculty && <FacultyDashboard />}
          {isIndustryPartner && <IndustryPartnerDashboard />}
          {!role && <StudentDashboard />}
        </div>
      </div>
    </DashboardLayout>
  );
}
