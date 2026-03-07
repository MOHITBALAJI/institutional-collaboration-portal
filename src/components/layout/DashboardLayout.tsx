import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { cn } from "@/lib/utils";
import { MobileHUD } from "./MobileHUD";
import { HUDOverlay } from "./HUDOverlay";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <HUDOverlay />
      <Sidebar
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
      />
      <div className={cn("lg:pl-64 transition-all duration-300")}>
        <Header onMobileMenuClick={() => setIsMobileOpen(true)} />
        <main className="p-4 lg:p-6">{children}</main>
        <MobileHUD />
      </div>
    </div>
  );
}
