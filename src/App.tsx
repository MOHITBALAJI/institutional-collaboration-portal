import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mou" element={<MoUManagement />} />
          <Route path="/internships" element={<Internships />} />
          <Route path="/research" element={<ResearchHub />} />
          <Route path="/alumni" element={<AlumniNetwork />} />
          <Route path="/events" element={<Events />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/partners" element={<IndustryPartners />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
