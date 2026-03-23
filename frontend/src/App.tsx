import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import MoUManagement from "@/pages/MoUManagement";
import Internships from "@/pages/Internships";

import AlumniNetwork from "@/pages/AlumniNetwork";
import Events from "@/pages/Events";
import Analytics from "@/pages/Analytics";
import IndustryPartners from "@/pages/IndustryPartners";
import Settings from "@/pages/Settings";
import Mentorship from "@/pages/Mentorship";


import AuditLog from "@/pages/AuditLog";
import ProjectBoard from "@/pages/ProjectBoard";
import PlacementTracker from "@/pages/PlacementTracker";
import InternshipMatching from "@/pages/InternshipMatching";

import ExportReports from "@/pages/ExportReports";
import DiscussionForum from "@/pages/DiscussionForum";
import BulkImport from "@/pages/BulkImport";
import ApprovalWorkflows from "@/pages/ApprovalWorkflows";
import SkillAssessment from "@/pages/SkillAssessment";
import ResearchHub from "@/pages/ResearchHub";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mou"
            element={
              <ProtectedRoute allowedRoles={["admin", "faculty"]}>
                <MoUManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/internships"
            element={
              <ProtectedRoute allowedRoles={["student", "admin", "industry_partner"]}>
                <Internships />
              </ProtectedRoute>
            }
          />

          <Route
            path="/alumni"
            element={
              <ProtectedRoute allowedRoles={["student", "faculty", "alumni", "admin"]}>
                <AlumniNetwork />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events"
            element={
              <ProtectedRoute allowedRoles={["student", "faculty", "alumni", "admin", "industry_partner"]}>
                <Events />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute allowedRoles={["admin", "faculty"]}>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/partners"
            element={
              <ProtectedRoute allowedRoles={["admin", "faculty"]}>
                <IndustryPartners />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRoles={["admin", "faculty", "student", "alumni", "industry_partner"]}>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentorship"
            element={
              <ProtectedRoute allowedRoles={["student", "faculty", "alumni", "admin"]}>
                <Mentorship />
              </ProtectedRoute>
            }
          />


          <Route
            path="/audit"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AuditLog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute allowedRoles={["student", "faculty", "admin"]}>
                <ProjectBoard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/placements"
            element={
              <ProtectedRoute allowedRoles={["student", "admin"]}>
                <PlacementTracker />
              </ProtectedRoute>
            }
          />
          <Route
            path="/internship-matching"
            element={
              <ProtectedRoute allowedRoles={["student", "admin"]}>
                <InternshipMatching />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <ProtectedRoute allowedRoles={["admin", "faculty"]}>
                <ExportReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/forum"
            element={
              <ProtectedRoute allowedRoles={["student", "faculty", "alumni", "admin", "industry_partner"]}>
                <DiscussionForum />
              </ProtectedRoute>
            }
          />
          <Route
            path="/import"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <BulkImport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/approvals"
            element={
              <ProtectedRoute allowedRoles={["admin", "faculty"]}>
                <ApprovalWorkflows />
              </ProtectedRoute>
            }
          />
          <Route
            path="/skill-assessment"
            element={
              <ProtectedRoute allowedRoles={["student", "faculty", "admin"]}>
                <SkillAssessment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/research"
            element={
              <ProtectedRoute allowedRoles={["student", "faculty", "admin", "industry_partner"]}>
                <ResearchHub />
              </ProtectedRoute>
            }
          />


          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
