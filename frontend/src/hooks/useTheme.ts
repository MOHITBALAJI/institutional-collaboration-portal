import { useState, useEffect, useCallback } from "react";

type Theme = "dark" | "light";

function getTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  return document.documentElement.classList.contains("light") ? "light" : "dark";
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getTheme);

  // Sync if another tab changes localStorage
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "theme") {
        const next: Theme = e.newValue === "light" ? "light" : "dark";
        document.documentElement.classList.toggle("light", next === "light");
        setTheme(next);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggleTheme = useCallback(() => {
    const html = document.documentElement;
    html.classList.toggle("light");
    const next: Theme = html.classList.contains("light") ? "light" : "dark";
    localStorage.setItem("theme", next);
    setTheme(next);
  }, []);

  return { theme, toggleTheme } as const;
}
