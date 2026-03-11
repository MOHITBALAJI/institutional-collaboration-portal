import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
                    className="relative overflow-hidden"
                >
                    {/* Sun icon – visible in dark mode */}
                    <Sun
                        className={`h-5 w-5 transition-all duration-300 ${isDark
                                ? "rotate-0 scale-100 opacity-100"
                                : "rotate-90 scale-0 opacity-0"
                            }`}
                    />
                    {/* Moon icon – visible in light mode */}
                    <Moon
                        className={`absolute h-5 w-5 transition-all duration-300 ${isDark
                                ? "-rotate-90 scale-0 opacity-0"
                                : "rotate-0 scale-100 opacity-100"
                            }`}
                    />
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                {isDark ? "Switch to light mode" : "Switch to dark mode"}
            </TooltipContent>
        </Tooltip>
    );
}
