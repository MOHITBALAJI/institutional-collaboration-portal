import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MobileMenuButton } from "./Sidebar";

interface HeaderProps {
  onMobileMenuClick: () => void;
}

export function Header({ onMobileMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/80 backdrop-blur-xl px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <MobileMenuButton onClick={onMobileMenuClick} />
        <div className="hidden md:flex relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            variant="glass"
            placeholder="Search collaborations, partners, students..."
            className="w-80 pl-9"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
            4
          </span>
        </Button>

        <div className="flex items-center gap-3 ml-2 pl-4 border-l border-border">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium">Dr. Priya Sharma</p>
            <p className="text-xs text-muted-foreground">College Admin</p>
          </div>
          <Button variant="ghost" size="icon" className="relative overflow-hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
              <User className="h-5 w-5 text-primary-foreground" />
            </div>
          </Button>
        </div>
      </div>
    </header>
  );
}
