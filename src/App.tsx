import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import MoUManagement from "@/pages/MoUManagement";
import Internships from "@/pages/Internships";
import ResearchHub from "@/pages/ResearchHub";
import AlumniNetwork from "@/pages/AlumniNetwork";
import Events from "@/pages/Events";
import Analytics from "@/pages/Analytics";
import IndustryPartners from "@/pages/IndustryPartners";
import Settings from "@/pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
              <ProtectedRoute>
                <Internships />
              </ProtectedRoute>
            }
          />
          <Route
            path="/research"
            element={
              <ProtectedRoute allowedRoles={["admin", "faculty"]}>
                <ResearchHub />
              </ProtectedRoute>
            }
          />
          <Route
            path="/alumni"
            element={
              <ProtectedRoute>
                <AlumniNetwork />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events"
            element={
              <ProtectedRoute>
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
              <ProtectedRoute>
                <IndustryPartners />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
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
