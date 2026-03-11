import { Bell, Check, CheckCheck, Info, AlertTriangle, XCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const typeIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
};

const typeColors = {
  info: "text-blue-500",
  success: "text-green-500",
  warning: "text-yellow-500",
  error: "text-red-500",
};

export function NotificationDropdown() {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  const handleNotificationClick = (notification: any) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover:bg-primary/10 transition-colors">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[320px] sm:w-[380px] p-0 overflow-hidden border-border/50 bg-background/95 backdrop-blur-xl">
        <DropdownMenuLabel className="px-4 py-3 border-b border-border/50 flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-2">
            <span className="font-bold">Notifications</span>
            {unreadCount > 0 && <Badge variant="glow" className="h-5 px-1.5 text-[10px]">{unreadCount} New</Badge>}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-[11px] font-medium text-primary hover:text-primary hover:bg-primary/10"
              onClick={markAllAsRead}
            >
              <CheckCheck className="mr-1.5 h-3.5 w-3.5" />
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>

        <ScrollArea className="h-[400px]">
          <div className="flex flex-col">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-sm text-muted-foreground">Loading your updates...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <Bell className="h-6 w-6 text-muted-foreground/50" />
                </div>
                <div>
                  <p className="font-semibold text-sm">All caught up!</p>
                  <p className="text-xs text-muted-foreground">No new notifications at the moment.</p>
                </div>
              </div>
            ) : (
              notifications.map((notification, idx) => {
                const Icon = typeIcons[notification.type as keyof typeof typeIcons] || Info;
                const iconColor = typeColors[notification.type as keyof typeof typeColors] || "text-muted-foreground";

                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "group relative flex cursor-pointer gap-4 p-4 transition-colors hover:bg-muted/50",
                      !notification.is_read && "bg-primary/5 hover:bg-primary/10",
                      idx !== notifications.length - 1 && "border-b border-border/40"
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110",
                      !notification.is_read ? "bg-primary/20" : "bg-muted"
                    )}>
                      <Icon className={cn("h-5 w-5", !notification.is_read ? iconColor : "text-muted-foreground")} />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className={cn("text-sm leading-none", !notification.is_read ? "font-bold" : "font-medium text-muted-foreground")}>
                          {notification.title}
                        </p>
                        <span className="text-[10px] whitespace-nowrap text-muted-foreground font-medium">
                          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {notification.message}
                      </p>
                      {!notification.is_read && (
                        <div className="flex items-center gap-1 mt-1 text-[10px] text-primary font-bold">
                          <Check className="h-3 w-3" /> Mark as read
                        </div>
                      )}
                    </div>
                    {!notification.is_read && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary shadow-sm shadow-primary/40" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>

        <div className="p-2 border-t border-border/50 bg-muted/10">
          <Button variant="ghost" className="w-full text-xs h-9 font-medium text-muted-foreground hover:text-foreground" onClick={() => {/* Handle clear all or view settings */ }}>
            Dismiss All Notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
