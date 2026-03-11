import { useState, useEffect, useCallback } from "react";
import { Search, FileText, Briefcase, Users, Calendar, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface SearchResult {
  id: string;
  title: string;
  type: "mou" | "internship" | "alumni" | "event" | "partner";
  subtitle?: string;
}

const typeIcons = {
  mou: FileText,
  internship: Briefcase,
  alumni: Users,
  event: Calendar,
  partner: Building2,
};

const typeRoutes = {
  mou: "/mou",
  internship: "/internships",
  alumni: "/alumni",
  event: "/events",
  partner: "/partners",
};

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const searchResults: SearchResult[] = [];

      // Search MoUs
      const { data: mous } = await supabase
        .from("mous")
        .select("id, title, partner_name")
        .ilike("title", `%${searchQuery}%`)
        .limit(3);

      if (mous) {
        searchResults.push(
          ...mous.map((m) => ({
            id: m.id,
            title: m.title,
            type: "mou" as const,
            subtitle: m.partner_name || undefined,
          }))
        );
      }

      // Search Internships
      const { data: internships } = await supabase
        .from("internships")
        .select("id, title, company_name")
        .ilike("title", `%${searchQuery}%`)
        .limit(3);

      if (internships) {
        searchResults.push(
          ...internships.map((i) => ({
            id: i.id,
            title: i.title,
            type: "internship" as const,
            subtitle: i.company_name || undefined,
          }))
        );
      }


      // Search Alumni
      const { data: alumni } = await supabase
        .from("alumni")
        .select("id, full_name, current_company")
        .ilike("full_name", `%${searchQuery}%`)
        .limit(3);

      if (alumni) {
        searchResults.push(
          ...alumni.map((a) => ({
            id: a.id,
            title: a.full_name,
            type: "alumni" as const,
            subtitle: a.current_company || undefined,
          }))
        );
      }

      // Search Events
      const { data: events } = await supabase
        .from("events")
        .select("id, title, event_type")
        .ilike("title", `%${searchQuery}%`)
        .limit(3);

      if (events) {
        searchResults.push(
          ...events.map((e) => ({
            id: e.id,
            title: e.title,
            type: "event" as const,
            subtitle: e.event_type || undefined,
          }))
        );
      }

      // Search Industry Partners
      const { data: partners } = await supabase
        .from("industry_partners")
        .select("id, name, industry_type")
        .ilike("name", `%${searchQuery}%`)
        .limit(3);

      if (partners) {
        searchResults.push(
          ...partners.map((p) => ({
            id: p.id,
            title: p.name,
            type: "partner" as const,
            subtitle: p.industry_type || undefined,
          }))
        );
      }

      setResults(searchResults);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      search(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, search]);

  const handleSelect = (result: SearchResult) => {
    setOpen(false);
    setQuery("");
    navigate(typeRoutes[result.type]);
  };

  return (
    <>
      <div className="hidden md:flex relative">
        <Button
          variant="outline"
          className="w-80 justify-start text-muted-foreground"
          onClick={() => setOpen(true)}
        >
          <Search className="mr-2 h-4 w-4" />
          <span>Search collaborations, partners...</span>
          <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search MoUs, internships, alumni, events..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {loading && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              Searching...
            </div>
          )}
          {!loading && query && results.length === 0 && (
            <CommandEmpty>No results found.</CommandEmpty>
          )}
          {!loading && results.length > 0 && (
            <>
              {["mou", "internship", "alumni", "event", "partner"].map((type) => {
                const typeResults = results.filter((r) => r.type === type);
                if (typeResults.length === 0) return null;

                const Icon = typeIcons[type as keyof typeof typeIcons];
                const labels = {
                  mou: "MoUs",
                  internship: "Internships",
                  alumni: "Alumni",
                  event: "Events",
                  partner: "Industry Partners",
                };

                return (
                  <CommandGroup key={type} heading={labels[type as keyof typeof labels]}>
                    {typeResults.map((result) => (
                      <CommandItem
                        key={`${result.type}-${result.id}`}
                        onSelect={() => handleSelect(result)}
                        className="cursor-pointer"
                      >
                        <Icon className="mr-2 h-4 w-4 text-muted-foreground" />
                        <div className="flex flex-col">
                          <span>{result.title}</span>
                          {result.subtitle && (
                            <span className="text-xs text-muted-foreground">
                              {result.subtitle}
                            </span>
                          )}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                );
              })}
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
