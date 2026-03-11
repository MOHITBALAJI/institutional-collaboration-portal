import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Users,
  GraduationCap,
  Calendar,
  BarChart3,
  Building2,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LogOut,
  Menu,
  X,
  History,
  FolderKanban,
  Sparkles,
  Trophy,
  Shield,
  ClipboardCheck,
  FileUp,
  MessageSquare,
  Brain,
} from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
  roles?: string[];
}

interface NavGroup {
  title: string;
  icon: React.ElementType;
  roles?: string[];
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  // ── Student/Career groups ──
  {
    title: "Career",
    icon: Briefcase,
    roles: ["student", "admin", "industry_partner"],
    items: [
      { title: "Internships", href: "/internships", icon: Briefcase },
      { title: "AI Matching", href: "/internship-matching", icon: Sparkles, roles: ["student", "admin"] },
      { title: "Placements", href: "/placements", icon: Trophy, roles: ["student", "admin"] },
    ],
  },

  // ── Institutional Management (Admin/Faculty/Partner) ──
  {
    title: "Institutional",
    icon: Building2,
    roles: ["admin", "faculty", "industry_partner"],
    items: [
      { title: "MoU Management", href: "/mou", icon: FileText, roles: ["admin", "faculty", "industry_partner"] },
      { title: "Industry Partners", href: "/partners", icon: Building2, roles: ["admin", "faculty"] },
      { title: "Approvals", href: "/approvals", icon: ClipboardCheck, roles: ["admin", "faculty"] },
      { title: "Bulk Import", href: "/import", icon: FileUp, roles: ["admin"] },
    ],
  },

  // ── Community ──
  {
    title: "Community",
    icon: Users,
    roles: ["student", "faculty", "alumni", "admin", "industry_partner"],
    items: [
      { title: "Events", href: "/events", icon: Calendar },
      { title: "Alumni Network", href: "/alumni", icon: Users },
      { title: "Mentorship", href: "/mentorship", icon: Users, roles: ["student", "faculty", "alumni", "admin"] },
      { title: "Discussion Forum", href: "/forum", icon: MessageSquare },

    ],
  },

  // ── Academic Hub ──
  {
    title: "Academic Hub",
    icon: GraduationCap,
    roles: ["student", "faculty", "admin"],
    items: [
      { title: "Project Board", href: "/projects", icon: FolderKanban },
      { title: "Skill Assessment", href: "/skill-assessment", icon: Brain },
    ],
  },


  // ── Governance & Intelligence ──
  {
    title: "Governance",
    icon: Shield,
    roles: ["admin", "faculty"],
    items: [
      { title: "Analytics", href: "/analytics", icon: BarChart3 },
      { title: "Audit Log", href: "/audit", icon: History, roles: ["admin"] },
      { title: "Export Reports", href: "/reports", icon: FileText },
    ],
  },
];

interface SidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ isMobileOpen, onMobileClose }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const location = useLocation();
  const navigate = useNavigate();
  const { role, loading } = useUserRole();
  const { toast } = useToast();

  // Default to "student" if no role assigned yet (e.g. new Supabase DB)
  const effectiveRole = role || "student";

  // Filter groups and items based on user role and deduplicate
  const seenPaths = new Set<string>();
  const filteredGroups = navGroups
    .filter((group) => {
      if (!group.roles) return true;
      return group.roles.includes(effectiveRole);
    })
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        if (!item.roles) {
          if (seenPaths.has(item.href)) return false;
          seenPaths.add(item.href);
          return true;
        }
        const hasRole = item.roles.includes(effectiveRole);
        if (hasRole && seenPaths.has(item.href)) return false;
        if (hasRole) seenPaths.add(item.href);
        return hasRole;
      }),
    }))
    .filter((group) => group.items.length > 0);

  const toggleGroup = (title: string) => {
    setExpandedGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  // Auto-expand group that contains the active page
  const isGroupActive = (group: NavGroup) =>
    group.items.some((item) => location.pathname === item.href);

  const isExpanded = (title: string) => {
    if (expandedGroups[title] !== undefined) return expandedGroups[title];
    // Auto-expand if this group contains the active route
    const group = filteredGroups.find((g) => g.title === title);
    return group ? isGroupActive(group) : false;
  };

  const handleLogout = async () => {
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

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
          isCollapsed ? "w-16" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary overflow-hidden">
                <img src="/logo.png" alt="ICP Logo" className="h-full w-full object-cover" />
              </div>
              <span className="font-display font-bold text-lg text-sidebar-primary">ICP</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMobileClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-2 scrollbar-thin">
          {/* Dashboard link — always visible */}
          <Link
            to="/dashboard"
            onClick={onMobileClose}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              location.pathname === "/dashboard"
                ? "bg-sidebar-primary/10 text-sidebar-primary"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            )}
          >
            <div className="flex items-center gap-3 w-full min-w-0">
              <LayoutDashboard className={cn("h-5 w-5 shrink-0", location.pathname === "/dashboard" && "text-sidebar-primary")} />
              {!isCollapsed && <span className="flex-1 truncate">Dashboard</span>}
            </div>
          </Link>

          {/* Grouped navigation */}
          {filteredGroups.map((group) => {
            const open = isExpanded(group.title);
            const groupActive = isGroupActive(group);

            return (
              <div key={group.title} className="mt-1">
                {/* Group header */}
                <button
                  onClick={() => !isCollapsed && toggleGroup(group.title)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200 min-w-0",
                    groupActive
                      ? "text-sidebar-primary"
                      : "text-sidebar-foreground/50 hover:text-sidebar-foreground/80"
                  )}
                >
                  <group.icon className="h-4 w-4 shrink-0" />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-left truncate">{group.title}</span>
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 shrink-0 transition-transform duration-200",
                          open && "rotate-180"
                        )}
                      />
                    </>
                  )}
                </button>

                {/* Group items */}
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-200",
                    open && !isCollapsed ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
                    isCollapsed && "max-h-96 opacity-100"
                  )}
                >
                  {group.items.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.href + item.title}
                        to={item.href}
                        onClick={onMobileClose}
                        className={cn(
                          "flex items-center gap-3 rounded-lg py-2 text-sm font-medium transition-all duration-200 min-w-0",
                          isCollapsed ? "px-3" : "pl-10 pr-3",
                          isActive
                            ? "bg-sidebar-primary/10 text-sidebar-primary"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                        )}
                      >
                        <item.icon className={cn("h-4 w-4 shrink-0", isActive && "text-sidebar-primary")} />
                        {!isCollapsed && (
                          <>
                            <span className="flex-1 truncate">{item.title}</span>
                            {item.badge && (
                              <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground">
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Settings — always visible */}
          <Link
            to="/settings"
            onClick={onMobileClose}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 mt-2",
              location.pathname === "/settings"
                ? "bg-sidebar-primary/10 text-sidebar-primary"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            )}
          >
            <div className="flex items-center gap-3 w-full min-w-0">
              <Settings className={cn("h-5 w-5 shrink-0", location.pathname === "/settings" && "text-sidebar-primary")} />
              {!isCollapsed && <span className="flex-1 truncate">Settings</span>}
            </div>
          </Link>
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-2">
          <button
            onClick={handleLogout}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-destructive/10 hover:text-destructive"
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="lg:hidden"
      onClick={onClick}
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
}
