import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { useEvents, Event } from "@/hooks/useEvents";
import {
  Calendar, Plus, Search, Edit, Trash2, Eye, MapPin, Users, Clock, Video, Building, TrendingUp,
  CheckCircle2, ArrowRight, ArrowLeft, Ticket, Mail, Phone, GraduationCap, Send, QrCode, Award, Copy,
  MessageSquare, Sparkles, Zap, Layers, Activity
} from "lucide-react";
import { CertificatePreview } from "@/components/CertificatePreview";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Treemap, Legend,
} from "recharts";
import { cn } from "@/lib/utils";
import React from "react";

const eventTrendData = [
  { month: "Jan", workshops: 4, hackathons: 1, seminars: 3 },
  { month: "Feb", workshops: 6, hackathons: 2, seminars: 4 },
  { month: "Mar", workshops: 8, hackathons: 1, seminars: 5 },
  { month: "Apr", workshops: 5, hackathons: 3, seminars: 6 },
  { month: "May", workshops: 9, hackathons: 2, seminars: 4 },
  { month: "Jun", workshops: 7, hackathons: 4, seminars: 5 },
];

const statusColors: Record<string, { bg: string; text: string; label: string; glow: string }> = {
  upcoming: { bg: "bg-primary/20", text: "text-primary", label: "Upcoming", glow: "shadow-primary/20" },
  ongoing: { bg: "bg-success/20", text: "text-success", label: "Ongoing", glow: "shadow-success/20" },
  completed: { bg: "bg-muted/20", text: "text-muted-foreground", label: "Completed", glow: "shadow-transparent" },
  cancelled: { bg: "bg-destructive/20", text: "text-destructive", label: "Cancelled", glow: "shadow-destructive/20" },
};

const typeIcons: Record<string, any> = {
  workshop: Layers,
  hackathon: Zap,
  seminar: GraduationCap,
  guest_lecture: Users,
  placement: Building,
};

/* ─── Realistic sample events ─── */
const sampleEvents: Event[] = [
  {
    id: "e1", title: "AI/ML Workshop — Hands-on with TensorFlow", event_type: "workshop",
    description: "A 2-day intensive workshop covering deep learning fundamentals, CNN architectures, and model deployment. Hands-on Jupyter notebook sessions with real datasets. Certificates provided.",
    venue: "Seminar Hall A, CS Block", mode: "offline",
    start_datetime: "2026-03-10T09:00:00", end_datetime: "2026-03-11T17:00:00", registration_deadline: "2026-03-05T23:59:00",
    max_participants: 120, current_registrations: 87, speakers: ["Dr. Priya Sharma", "Prof. Rajesh Kumar"],
    organizer: "CSE Department", partner_id: null, banner_url: null, status: "upcoming", certificate_template: null,
    created_by: null, created_at: "2026-01-15T10:00:00Z", updated_at: "2026-01-15T10:00:00Z",
  },
  {
    id: "e2", title: "HackVerse 2026 — 36-Hour Hackathon", event_type: "hackathon",
    description: "Build innovative solutions for real-world problems in 36 hours. Teams of 2-4 members. Prizes worth ₹2,00,000. Themes: HealthTech, EdTech, FinTech, Sustainability.",
    venue: "Innovation Lab & Auditorium", mode: "offline",
    start_datetime: "2026-03-22T18:00:00", end_datetime: "2026-03-24T06:00:00", registration_deadline: "2026-03-18T23:59:00",
    max_participants: 200, current_registrations: 156, speakers: ["Mr. Vikram Patel (CTO, TechStack)", "Ms. Anita Desai (VP Eng, Razorpay)"],
    organizer: "Innovation Cell", partner_id: null, banner_url: null, status: "upcoming", certificate_template: null,
    created_by: null, created_at: "2026-01-20T10:00:00Z", updated_at: "2026-01-20T10:00:00Z",
  },
  {
    id: "e9", title: "DSA Masterclass with Striver", event_type: "workshop",
    description: "Intensive 2-day workshop focused on interview-ready DSA concepts. Covers arrays, trees, graphs, DP, and competitive programming strategies.",
    venue: "Online — Google Meet", mode: "online",
    start_datetime: "2026-02-18T10:00:00", end_datetime: "2026-02-19T16:00:00", registration_deadline: "2026-02-17T23:59:00",
    max_participants: 200, current_registrations: 178, speakers: ["Mr. Striver (Raj Vikramaditya)", "Ms. Alisha Mehta (Google SDE)"],
    organizer: "Coding Club", partner_id: null, banner_url: null, status: "ongoing", certificate_template: null,
    created_by: null, created_at: "2026-01-25T10:00:00Z", updated_at: "2026-03-01T10:00:00Z",
  },
  {
    id: "e4", title: "IBM Quantum Computing Guest Lecture", event_type: "guest_lecture",
    description: "Dr. Suresh Narayanan, Chief Scientist at IBM Research India, discusses the current state and future prospects of quantum computing.",
    venue: "Main Auditorium", mode: "offline",
    start_datetime: "2026-03-15T10:00:00", end_datetime: "2026-03-15T12:30:00", registration_deadline: "2026-03-13T23:59:00",
    max_participants: 300, current_registrations: 215, speakers: ["Dr. Suresh Narayanan (IBM Research)"],
    organizer: "Physics Department & CSE Department", partner_id: null, banner_url: null, status: "upcoming", certificate_template: null,
    created_by: null, created_at: "2026-02-01T10:00:00Z", updated_at: "2026-02-01T10:00:00Z",
  }
];

export default function Events() {
  const { events: dbEvents, loading, createEvent, updateEvent, deleteEvent } = useEvents();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"timeline" | "grid" | "analytics">("timeline");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "", event_type: "workshop", description: "", venue: "", mode: "offline",
    start_datetime: "", end_datetime: "", registration_deadline: "", max_participants: "", speakers: "", organizer: "",
  });

  const events = useMemo(() => {
    const combined = dbEvents.length > 0 ? dbEvents : sampleEvents;
    return combined.sort((a, b) => new Date(a.start_datetime || 0).getTime() - new Date(b.start_datetime || 0).getTime());
  }, [dbEvents]);

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreate = async () => {
    await createEvent({
      ...formData,
      max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
      speakers: formData.speakers ? formData.speakers.split(",").map(s => s.trim()) : null,
    });
    setIsCreateOpen(false); resetForm();
  };

  const resetForm = () => {
    setFormData({ title: "", event_type: "workshop", description: "", venue: "", mode: "offline", start_datetime: "", end_datetime: "", registration_deadline: "", max_participants: "", speakers: "", organizer: "" });
    setSelectedEvent(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in relative z-10">
        {/* Holographic Header */}
        <div className="relative overflow-hidden rounded-3xl p-8 bg-black/40 border border-white/5 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 p-8">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
              <Activity className="h-32 w-32 text-primary/10" />
            </motion.div>
          </div>

          <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">
                <Sparkles className="h-3 w-3" />
                Live Temporal Stream
              </div>
              <h1 className="text-4xl lg:text-6xl font-black font-display tracking-tight leading-none">
                Immersive <span className="gradient-text">Events</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-xl">
                Experience the next generation of academic collaboration through our holographic time-stream.
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                variant="gradient"
                size="xl"
                className="rounded-2xl shadow-xl shadow-primary/20"
                onClick={() => setIsCreateOpen(true)}
              >
                <Plus className="mr-2 h-5 w-5" />
                Host Initiative
              </Button>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="relative flex-1 max-w-md group">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Scan temporal data..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 bg-white/5 border-white/10 rounded-xl h-12 focus-visible:ring-primary/40"
              />
            </div>
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
              <Button
                variant={viewMode === "timeline" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("timeline")}
                className="rounded-lg h-9 px-4"
              >
                Timeline
              </Button>
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-lg h-9 px-4"
              >
                Grid
              </Button>
              <Button
                variant={viewMode === "analytics" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("analytics")}
                className="rounded-lg h-9 px-4"
              >
                Analytics
              </Button>
            </div>
          </div>
        </div>

        {/* View Content */}
        {viewMode === "timeline" && (
          <div className="relative pl-8 md:pl-24 space-y-12 py-8">
            {/* Timeline Bar */}
            <div className="absolute left-[39px] md:left-[103px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary via-accent to-muted/20" />

            {filteredEvents.map((event, idx) => {
              const Icon = typeIcons[event.event_type || 'workshop'] || Layers;
              const isPast = new Date(event.start_datetime || 0) < new Date();

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative group"
                >
                  {/* Timeline Bead */}
                  <div className={cn(
                    "absolute -left-[56px] md:-left-[120px] top-4 h-12 w-12 rounded-full border-4 border-background flex items-center justify-center transition-all duration-500 z-10",
                    event.status === "ongoing" ? "bg-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)] scale-125" : "bg-muted md:group-hover:bg-primary/50"
                  )}>
                    <Icon className={cn("h-5 w-5", event.status === "ongoing" ? "text-white" : "text-muted-foreground")} />
                    {event.status === "ongoing" && (
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-primary"
                        animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </div>

                  {/* Card with Laser Entrance Decoration */}
                  <div className="absolute left-0 top-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors duration-500" />

                  <Card variant="glass" className="overflow-hidden border-white/5 hover:border-primary/20 transition-all duration-500 group-hover:translate-x-2">
                    <CardContent className="p-0 flex flex-col md:flex-row min-h-[220px]">
                      {/* Event Banner / Visual */}
                      <div className="w-full md:w-64 bg-muted/20 relative overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 bg-grid-white/[0.05]" />
                        <AnimatePresence>
                          <motion.div
                            className="absolute inset-x-0 h-1 bg-primary/50 blur-[2px] z-10 shadow-[0_0_15px_rgba(var(--primary-rgb),0.8)]"
                            initial={{ top: "-10%" }}
                            animate={{ top: "110%" }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          />
                        </AnimatePresence>
                        <div className="relative z-20 flex flex-col items-center gap-2">
                          <Icon className="h-12 w-12 text-primary/40" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">{event.event_type}</span>
                        </div>
                      </div>

                      <div className="flex-1 p-6 md:p-8 space-y-4 relative">
                        {/* Status Pulse */}
                        <div className="absolute top-6 right-6 flex items-center gap-2">
                          <span className={cn("h-2 w-2 rounded-full", event.status === "ongoing" ? "bg-success animate-pulse" : "bg-primary/40")} />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            {event.status}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-2xl md:text-3xl font-display font-black leading-tight group-hover:gradient-text transition-all duration-500">
                            {event.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-primary" /> {new Date(event.start_datetime || '').toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}</div>
                            <div className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {new Date(event.start_datetime || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                            <div className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {event.venue}</div>
                          </div>
                        </div>

                        <p className="text-muted-foreground line-clamp-2 leading-relaxed">
                          {event.description}
                        </p>

                        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-white/5">
                          <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                              <div key={i} className="h-8 w-8 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-[10px] font-bold">
                                {String.fromCharCode(64 + i)}
                              </div>
                            ))}
                            <div className="h-8 w-8 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-[10px] font-bold text-primary">
                              +{event.current_registrations}
                            </div>
                            <span className="ml-5 self-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Enrolled Students</span>
                          </div>

                          <div className="flex gap-3">
                            <Button variant="outline" className="rounded-xl border-white/10 hover:bg-white/5" onClick={() => { setSelectedEvent(event); setIsViewOpen(true); }}>
                              Details
                            </Button>
                            <Button variant="gradient" className="rounded-xl px-8 shadow-lg shadow-primary/10" onClick={() => { setSelectedEvent(event); setIsRegisterOpen(true); }}>
                              <Ticket className="mr-2 h-4 w-4" /> Register
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {viewMode === "grid" && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event, idx) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card variant="glass" className="h-full flex flex-col group hover:border-primary/30 transition-all duration-300">
                  <div className="h-40 bg-muted/30 relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-white/[0.02]" />
                    <div className="absolute top-4 right-4 translate-z-10">
                      <Badge className={cn(statusColors[event.status || 'upcoming'].bg, statusColors[event.status || 'upcoming'].text, "border-transparent backdrop-blur-md")}>
                        {event.status}
                      </Badge>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      {typeIcons[event.event_type || 'workshop'] && React.createElement(typeIcons[event.event_type || 'workshop'], { className: "h-16 w-16 text-primary/10 group-hover:scale-125 transition-transform duration-700" })}
                    </div>
                  </div>
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <div className="flex-1 space-y-4">
                      <div className="space-y-2">
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{event.event_type}</div>
                        <h3 className="text-xl font-bold font-display group-hover:text-primary transition-colors">{event.title}</h3>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" /> {new Date(event.start_datetime || '').toLocaleDateString()}
                        <MapPin className="h-3.5 w-3.5" /> {event.venue}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                    <div className="pt-6 mt-auto border-t border-white/5 flex gap-2">
                      <Button variant="ghost" size="sm" className="flex-1 rounded-lg" onClick={() => { setSelectedEvent(event); setIsViewOpen(true); }}>View</Button>
                      <Button variant="secondary" size="sm" className="flex-1 rounded-lg bg-primary/10 text-primary border-primary/20 hover:bg-primary/20" onClick={() => { setSelectedEvent(event); setIsRegisterOpen(true); }}>Register</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {viewMode === "analytics" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <Card variant="glass">
              <CardHeader><CardTitle className="flex items-center gap-2 font-display"><TrendingUp className="h-5 w-5 text-primary" /> Temporal Momentum</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={eventTrendData}>
                    <defs>
                      <linearGradient id="glowWorkshops" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} /><stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} /></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" />
                    <XAxis dataKey="month" stroke="#ffffff40" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="#ffffff40" fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#000', border: '1px solid #ffffff10', borderRadius: '12px' }} />
                    <Area type="monotone" dataKey="workshops" stroke="hsl(var(--primary))" fill="url(#glowWorkshops)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card variant="glass">
              <CardHeader><CardTitle className="font-display">Strategic Allocation</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <Treemap
                    data={[{ name: "Workshops", value: 35, color: "hsl(var(--primary))" }, { name: "Hackathons", value: 45, color: "hsl(var(--accent))" }, { name: "Seminars", value: 20, color: "hsl(var(--success))" }].map(e => ({ name: e.name, size: e.value, fill: e.color }))}
                    dataKey="size"
                    stroke="#ffffff10"
                  />
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Create Dialog Facelift */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="max-w-2xl glass-card-strong border-white/10 p-0 overflow-hidden">
            <div className="p-8">
              <DialogHeader className="mb-6">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <DialogTitle className="text-3xl font-display font-black uppercase">Initiate Event</DialogTitle>
                <DialogDescription className="text-lg">Broadcast a new temporal hotspot to the community.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Identification</Label>
                    <Input variant="glass" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Temporal Node Title" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Category</Label>
                    <Select value={formData.event_type} onValueChange={(v) => setFormData({ ...formData, event_type: v })}>
                      <SelectTrigger className="bg-white/5 border-white/10 h-10 px-4 rounded-xl shadow-inner"><SelectValue /></SelectTrigger>
                      <SelectContent className="glass-card-strong border-white/10">
                        <SelectItem value="workshop">Workshop</SelectItem>
                        <SelectItem value="hackathon">Hackathon Initiative</SelectItem>
                        <SelectItem value="seminar">Strategic Seminar</SelectItem>
                        <SelectItem value="guest_lecture">Guest Lecture</SelectItem>
                        <SelectItem value="placement">Placement Drive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Mission Brief</Label>
                  <Textarea variant="glass" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="What will be achieved?" rows={3} />
                </div>
              </div>
            </div>
            <DialogFooter className="p-6 bg-secondary/10 border-t border-white/5 flex gap-3">
              <Button variant="ghost" onClick={() => setIsCreateOpen(false)}>Abort</Button>
              <Button variant="gradient" className="px-8 shadow-xl shadow-primary/20" onClick={handleCreate}>Deploy Initiative</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Dialog - Immersive Styles */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="max-w-2xl glass-card-strong border-white/10 p-0 overflow-hidden shadow-2xl">
            {selectedEvent && (
              <div className="flex flex-col">
                <div className="h-40 relative group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/20" />
                  <div className="absolute inset-0 bg-grid-white/[0.05]" />
                  <div className="absolute bottom-6 left-8 flex items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center">
                      {React.createElement(typeIcons[selectedEvent.event_type || 'workshop'] || Layers, { className: "h-8 w-8 text-white shadow-glow" })}
                    </div>
                    <div className="space-y-1">
                      <Badge className="bg-primary hover:bg-primary/80 border-none px-3 font-bold uppercase tracking-wider text-[10px]">{selectedEvent.event_type}</Badge>
                      <h2 className="text-2xl font-display font-black leading-none">{selectedEvent.title}</h2>
                    </div>
                  </div>
                </div>
                <Tabs defaultValue="overview" className="flex-1">
                  <TabsList className="w-full justify-start rounded-none border-b border-white/5 bg-transparent p-0 h-14">
                    <TabsTrigger value="overview" className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-primary/5 px-8 text-xs font-bold uppercase tracking-widest">Core Data</TabsTrigger>
                    <TabsTrigger value="qa" className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-primary/5 px-8 text-xs font-bold uppercase tracking-widest">Neural Link (Q&A)</TabsTrigger>
                  </TabsList>
                  <div className="p-8">
                    <TabsContent value="overview" className="mt-0 space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2"><Clock className="h-3 w-3" /> Temporal Coordinates</span>
                          <p className="font-bold">{new Date(selectedEvent.start_datetime || '').toLocaleString()}</p>
                        </div>
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2"><MapPin className="h-3 w-3" /> Physical Location</span>
                          <p className="font-bold">{selectedEvent.venue}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2"><Activity className="h-3 w-3" /> Analysis</span>
                        <p className="text-sm leading-relaxed text-muted-foreground">{selectedEvent.description}</p>
                      </div>
                      <div className="pt-4 border-t border-white/5 flex gap-4">
                        {selectedEvent.speakers?.map((s, i) => (
                          <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/5">
                            <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">{s[0]}</div>
                            <span className="text-xs font-bold">{s}</span>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="qa" className="mt-0 h-64 flex items-center justify-center text-center">
                      <div className="space-y-4">
                        <div className="h-12 w-12 rounded-full border-2 border-dashed border-primary/40 mx-auto animate-spin" />
                        <p className="text-xs font-bold uppercase tracking-tight text-muted-foreground">Awaiting neural sync with attendees...</p>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Floating Background Effects */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden opacity-30">
          <motion.div
            animate={{
              y: [0, -20, 0],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{
              y: [0, 20, 0],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 12, repeat: Infinity, delay: 1 }}
            className="absolute bottom-1/4 -right-20 w-80 h-80 bg-accent/20 rounded-full blur-[120px]"
          />
        </div>
      </div>

      {/* Sync Success Modal */}
      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
        <DialogContent className="max-w-md glass-card-strong border-white/10 p-8 text-center text-white">
          <div className="h-20 w-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
            <CheckCircle2 className="h-10 w-10 text-success" />
          </div>
          <h2 className="text-3xl font-display font-black uppercase mb-2">Sync Successful</h2>
          <p className="text-muted-foreground mb-8 text-sm">You are officially synchronized with the temporal node: <br /><strong className="text-white">{selectedEvent?.title}</strong></p>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-left mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Deployment Node</span>
              <span className="text-[10px] font-bold font-mono text-muted-foreground">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
            </div>
            <div className="space-y-1">
              <p className="font-bold text-lg leading-tight">{selectedEvent?.title}</p>
              <p className="text-xs text-muted-foreground">{selectedEvent?.venue}</p>
            </div>
          </div>

          <Button variant="gradient" className="w-full h-12 rounded-xl shadow-xl shadow-primary/20" onClick={() => setIsRegisterOpen(false)}>
            Acknowledge & Close
          </Button>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
