import { Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileMenuButton } from "./Sidebar";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { useUserRole } from "@/hooks/useUserRole";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  onMobileMenuClick: () => void;
}

const roleLabels = {
  admin: "Administrator",
  faculty: "Faculty",
  student: "Student",
  alumni: "Alumni",
  industry_partner: "Industry Partner",
};

export function Header({ onMobileMenuClick }: HeaderProps) {
  const { user, profile, role, loading } = useUserRole();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
      navigate("/login");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out",
      });
    }
  };

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "User";
  const roleLabel = role ? roleLabels[role] : "User";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/80 backdrop-blur-xl px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <MobileMenuButton onClick={onMobileMenuClick} />
        <GlobalSearch />
      </div>

      <div className="flex items-center gap-2">
        <NotificationDropdown />

        <div className="flex items-center gap-3 ml-2 pl-4 border-l border-border">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium">{loading ? "Loading..." : displayName}</p>
            <p className="text-xs text-muted-foreground">{roleLabel}</p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative overflow-hidden">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
                  <User className="h-5 w-5 text-primary-foreground" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{displayName}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/settings")}>
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
