import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useEvents, Event } from "@/hooks/useEvents";
import {
  Calendar,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Users,
  Clock,
  Video,
  Building,
  TrendingUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const eventTrendData = [
  { month: "Jan", workshops: 4, hackathons: 1, seminars: 3 },
  { month: "Feb", workshops: 6, hackathons: 2, seminars: 4 },
  { month: "Mar", workshops: 8, hackathons: 1, seminars: 5 },
  { month: "Apr", workshops: 5, hackathons: 3, seminars: 6 },
  { month: "May", workshops: 9, hackathons: 2, seminars: 4 },
  { month: "Jun", workshops: 7, hackathons: 4, seminars: 5 },
];

const statusColors = {
  upcoming: { bg: "bg-primary/20", text: "text-primary", label: "Upcoming" },
  ongoing: { bg: "bg-warning/20", text: "text-warning", label: "Ongoing" },
  completed: { bg: "bg-success/20", text: "text-success", label: "Completed" },
  cancelled: { bg: "bg-destructive/20", text: "text-destructive", label: "Cancelled" },
};

const eventTypeData = [
  { name: "Workshops", value: 35, color: "hsl(187, 85%, 53%)" },
  { name: "Hackathons", value: 15, color: "hsl(262, 83%, 58%)" },
  { name: "Seminars", value: 25, color: "hsl(142, 76%, 36%)" },
  { name: "Guest Lectures", value: 20, color: "hsl(38, 92%, 50%)" },
  { name: "Others", value: 5, color: "hsl(0, 84%, 60%)" },
];

export default function Events() {
  const { events, loading, createEvent, updateEvent, deleteEvent } = useEvents();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    event_type: "workshop",
    description: "",
    venue: "",
    mode: "offline",
    start_datetime: "",
    end_datetime: "",
    registration_deadline: "",
    max_participants: "",
    speakers: "",
    organizer: "",
  });

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreate = async () => {
    await createEvent({
      title: formData.title,
      event_type: formData.event_type,
      description: formData.description,
      venue: formData.venue,
      mode: formData.mode,
      start_datetime: formData.start_datetime || null,
      end_datetime: formData.end_datetime || null,
      registration_deadline: formData.registration_deadline || null,
      max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
      speakers: formData.speakers ? formData.speakers.split(",").map((s) => s.trim()) : null,
      organizer: formData.organizer,
    });
    setIsCreateOpen(false);
    resetForm();
  };

  const handleEdit = async () => {
    if (!selectedEvent) return;
    await updateEvent(selectedEvent.id, {
      title: formData.title,
      event_type: formData.event_type,
      description: formData.description,
      venue: formData.venue,
      mode: formData.mode,
      start_datetime: formData.start_datetime || null,
      end_datetime: formData.end_datetime || null,
      registration_deadline: formData.registration_deadline || null,
      max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
      speakers: formData.speakers ? formData.speakers.split(",").map((s) => s.trim()) : null,
      organizer: formData.organizer,
    });
    setIsEditOpen(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      await deleteEvent(id);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      event_type: "workshop",
      description: "",
      venue: "",
      mode: "offline",
      start_datetime: "",
      end_datetime: "",
      registration_deadline: "",
      max_participants: "",
      speakers: "",
      organizer: "",
    });
    setSelectedEvent(null);
  };

  const openEdit = (event: Event) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      event_type: event.event_type || "workshop",
      description: event.description || "",
      venue: event.venue || "",
      mode: event.mode || "offline",
      start_datetime: event.start_datetime ? event.start_datetime.slice(0, 16) : "",
      end_datetime: event.end_datetime ? event.end_datetime.slice(0, 16) : "",
      registration_deadline: event.registration_deadline ? event.registration_deadline.slice(0, 16) : "",
      max_participants: event.max_participants?.toString() || "",
      speakers: event.speakers?.join(", ") || "",
      organizer: event.organizer || "",
    });
    setIsEditOpen(true);
  };

  const openView = (event: Event) => {
    setSelectedEvent(event);
    setIsViewOpen(true);
  };

  const totalRegistrations = events.reduce((acc, e) => acc + (e.current_registrations || 0), 0);
  const stats = [
    { label: "Total Events", value: events.length, icon: Calendar, color: "text-primary" },
    { label: "Upcoming", value: events.filter((e) => e.status === "upcoming").length, icon: Clock, color: "text-warning" },
    { label: "Completed", value: events.filter((e) => e.status === "completed").length, icon: Building, color: "text-success" },
    { label: "Registrations", value: totalRegistrations, icon: Users, color: "text-accent" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold font-display">
              Events <span className="gradient-text">Management</span>
            </h1>
            <p className="text-muted-foreground">Organize workshops, hackathons, and seminars</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button variant="gradient">
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogDescription>Set up a new event for students and faculty</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Event Title *</Label>
                    <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="AI/ML Workshop" />
                  </div>
                  <div className="space-y-2">
                    <Label>Event Type</Label>
                    <Select value={formData.event_type} onValueChange={(v) => setFormData({ ...formData, event_type: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="workshop">Workshop</SelectItem>
                        <SelectItem value="hackathon">Hackathon</SelectItem>
                        <SelectItem value="seminar">Seminar</SelectItem>
                        <SelectItem value="guest_lecture">Guest Lecture</SelectItem>
                        <SelectItem value="placement">Placement Drive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Event details and agenda" rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Venue</Label>
                    <Input value={formData.venue} onChange={(e) => setFormData({ ...formData, venue: e.target.value })} placeholder="Seminar Hall A" />
                  </div>
                  <div className="space-y-2">
                    <Label>Mode</Label>
                    <Select value={formData.mode} onValueChange={(v) => setFormData({ ...formData, mode: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="offline">Offline</SelectItem>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date & Time</Label>
                    <Input type="datetime-local" value={formData.start_datetime} onChange={(e) => setFormData({ ...formData, start_datetime: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date & Time</Label>
                    <Input type="datetime-local" value={formData.end_datetime} onChange={(e) => setFormData({ ...formData, end_datetime: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Registration Deadline</Label>
                    <Input type="datetime-local" value={formData.registration_deadline} onChange={(e) => setFormData({ ...formData, registration_deadline: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Participants</Label>
                    <Input type="number" value={formData.max_participants} onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })} placeholder="100" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Speakers (comma-separated)</Label>
                  <Input value={formData.speakers} onChange={(e) => setFormData({ ...formData, speakers: e.target.value })} placeholder="Dr. John, Prof. Smith" />
                </div>
                <div className="space-y-2">
                  <Label>Organizer</Label>
                  <Input value={formData.organizer} onChange={(e) => setFormData({ ...formData, organizer: e.target.value })} placeholder="CSE Department" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button variant="gradient" onClick={handleCreate} disabled={!formData.title}>Create Event</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} variant="glow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold font-display">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Events by Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={eventTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" />
                  <XAxis dataKey="month" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                  <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(222, 47%, 8%)", border: "1px solid hsl(217, 33%, 17%)", borderRadius: "8px" }} />
                  <Bar dataKey="workshops" fill="hsl(187, 85%, 53%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="hackathons" fill="hsl(262, 83%, 58%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="seminars" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardHeader>
              <CardTitle>Event Type Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={eventTypeData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value">
                    {eventTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-3 mt-4">
                {eventTypeData.map((item) => (
                  <div key={item.name} className="flex items-center gap-1 text-xs">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Table */}
        <Card variant="glass">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
              <CardTitle>All Events</CardTitle>
              <div className="flex gap-2">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search events..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading events...</div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No events found.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Venue</TableHead>
                    <TableHead>Registrations</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.title}</TableCell>
                      <TableCell className="capitalize">{event.event_type?.replace("_", " ") || "-"}</TableCell>
                      <TableCell>
                        {event.start_datetime ? new Date(event.start_datetime).toLocaleString() : "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {event.mode === "online" ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                          {event.venue || event.mode}
                        </div>
                      </TableCell>
                      <TableCell>{event.current_registrations || 0}/{event.max_participants || "∞"}</TableCell>
                      <TableCell>
                        <Badge className={`${statusColors[event.status].bg} ${statusColors[event.status].text}`}>
                          {statusColors[event.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openView(event)}><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => openEdit(event)}><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(event.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Event</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Event Title *</Label>
                  <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Venue</Label>
                  <Input value={formData.venue} onChange={(e) => setFormData({ ...formData, venue: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              <Button variant="gradient" onClick={handleEdit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Dialog */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedEvent?.title}</DialogTitle>
              <DialogDescription className="capitalize">{selectedEvent?.event_type?.replace("_", " ")}</DialogDescription>
            </DialogHeader>
            {selectedEvent && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedEvent.start_datetime ? new Date(selectedEvent.start_datetime).toLocaleDateString() : "TBD"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedEvent.start_datetime ? new Date(selectedEvent.start_datetime).toLocaleTimeString() : "TBD"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedEvent.venue || "TBD"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedEvent.current_registrations || 0} / {selectedEvent.max_participants || "∞"}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="mt-1">{selectedEvent.description || "No description"}</p>
                </div>
                {selectedEvent.speakers && selectedEvent.speakers.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Speakers</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.speakers.map((speaker, i) => (
                        <Badge key={i} variant="secondary">{speaker}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
