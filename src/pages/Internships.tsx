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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useInternships, Internship } from "@/hooks/useInternships";
import {
  Briefcase,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Clock,
  DollarSign,
  Users,
  TrendingUp,
  Building2,
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

const internshipTrendData = [
  { month: "Jan", applications: 45, placements: 12 },
  { month: "Feb", applications: 62, placements: 18 },
  { month: "Mar", applications: 78, placements: 25 },
  { month: "Apr", applications: 95, placements: 32 },
  { month: "May", applications: 120, placements: 45 },
  { month: "Jun", applications: 150, placements: 58 },
];

const statusColors = {
  open: { bg: "bg-success/20", text: "text-success", label: "Open" },
  closed: { bg: "bg-muted", text: "text-muted-foreground", label: "Closed" },
  in_progress: { bg: "bg-warning/20", text: "text-warning", label: "In Progress" },
  completed: { bg: "bg-primary/20", text: "text-primary", label: "Completed" },
};

const modeData = [
  { name: "Hybrid", value: 45, color: "hsl(187, 85%, 53%)" },
  { name: "Remote", value: 35, color: "hsl(262, 83%, 58%)" },
  { name: "On-site", value: 20, color: "hsl(142, 76%, 36%)" },
];

export default function Internships() {
  const { internships, loading, createInternship, updateInternship, deleteInternship } = useInternships();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    company_name: "",
    description: "",
    location: "",
    mode: "hybrid",
    duration: "",
    stipend: "",
    positions: "1",
    application_deadline: "",
    start_date: "",
    skills_required: "",
    requirements: "",
  });

  const filteredInternships = internships.filter((internship) => {
    const matchesSearch =
      internship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      internship.company_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || internship.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreate = async () => {
    await createInternship({
      title: formData.title,
      company_name: formData.company_name,
      description: formData.description,
      location: formData.location,
      mode: formData.mode,
      duration: formData.duration,
      stipend: formData.stipend ? parseFloat(formData.stipend) : null,
      positions: formData.positions ? parseInt(formData.positions) : 1,
      application_deadline: formData.application_deadline || null,
      start_date: formData.start_date || null,
      skills_required: formData.skills_required ? formData.skills_required.split(",").map((s) => s.trim()) : null,
      requirements: formData.requirements ? formData.requirements.split(",").map((r) => r.trim()) : null,
    });
    setIsCreateOpen(false);
    resetForm();
  };

  const handleEdit = async () => {
    if (!selectedInternship) return;
    await updateInternship(selectedInternship.id, {
      title: formData.title,
      company_name: formData.company_name,
      description: formData.description,
      location: formData.location,
      mode: formData.mode,
      duration: formData.duration,
      stipend: formData.stipend ? parseFloat(formData.stipend) : null,
      positions: formData.positions ? parseInt(formData.positions) : 1,
      application_deadline: formData.application_deadline || null,
      start_date: formData.start_date || null,
      skills_required: formData.skills_required ? formData.skills_required.split(",").map((s) => s.trim()) : null,
      requirements: formData.requirements ? formData.requirements.split(",").map((r) => r.trim()) : null,
    });
    setIsEditOpen(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this internship?")) {
      await deleteInternship(id);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      company_name: "",
      description: "",
      location: "",
      mode: "hybrid",
      duration: "",
      stipend: "",
      positions: "1",
      application_deadline: "",
      start_date: "",
      skills_required: "",
      requirements: "",
    });
    setSelectedInternship(null);
  };

  const openEdit = (internship: Internship) => {
    setSelectedInternship(internship);
    setFormData({
      title: internship.title,
      company_name: internship.company_name || "",
      description: internship.description || "",
      location: internship.location || "",
      mode: internship.mode || "hybrid",
      duration: internship.duration || "",
      stipend: internship.stipend?.toString() || "",
      positions: internship.positions?.toString() || "1",
      application_deadline: internship.application_deadline || "",
      start_date: internship.start_date || "",
      skills_required: internship.skills_required?.join(", ") || "",
      requirements: internship.requirements?.join(", ") || "",
    });
    setIsEditOpen(true);
  };

  const openView = (internship: Internship) => {
    setSelectedInternship(internship);
    setIsViewOpen(true);
  };

  const stats = [
    { label: "Total Internships", value: internships.length, icon: Briefcase, color: "text-primary" },
    { label: "Open Positions", value: internships.filter((i) => i.status === "open").reduce((acc, i) => acc + (i.positions || 0), 0), icon: Users, color: "text-success" },
    { label: "In Progress", value: internships.filter((i) => i.status === "in_progress").length, icon: Clock, color: "text-warning" },
    { label: "Companies", value: new Set(internships.map((i) => i.company_name).filter(Boolean)).size, icon: Building2, color: "text-accent" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold font-display">
              Internship <span className="gradient-text">Exchange</span>
            </h1>
            <p className="text-muted-foreground">
              Manage internship opportunities and student placements
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button variant="gradient">
                <Plus className="mr-2 h-4 w-4" />
                Post Internship
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Post New Internship</DialogTitle>
                <DialogDescription>
                  Create a new internship opportunity for students
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Software Developer Intern"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={formData.company_name}
                      onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                      placeholder="Company Name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the internship role and responsibilities"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="City, Country"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mode">Mode</Label>
                    <Select value={formData.mode} onValueChange={(v) => setFormData({ ...formData, mode: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="remote">Remote</SelectItem>
                        <SelectItem value="onsite">On-site</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="3 months"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stipend">Stipend (₹/month)</Label>
                    <Input
                      id="stipend"
                      type="number"
                      value={formData.stipend}
                      onChange={(e) => setFormData({ ...formData, stipend: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="positions">Positions</Label>
                    <Input
                      id="positions"
                      type="number"
                      value={formData.positions}
                      onChange={(e) => setFormData({ ...formData, positions: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deadline">Application Deadline</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={formData.application_deadline}
                      onChange={(e) => setFormData({ ...formData, application_deadline: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills Required (comma-separated)</Label>
                  <Input
                    id="skills"
                    value={formData.skills_required}
                    onChange={(e) => setFormData({ ...formData, skills_required: e.target.value })}
                    placeholder="Python, React, Machine Learning"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="requirements">Requirements (comma-separated)</Label>
                  <Input
                    id="requirements"
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    placeholder="3rd year student, CGPA > 7.0"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button variant="gradient" onClick={handleCreate} disabled={!formData.title}>Post Internship</Button>
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
        <div className="grid gap-4 lg:grid-cols-3">
          <Card variant="glass" className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Applications & Placements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={internshipTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" />
                  <XAxis dataKey="month" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                  <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(222, 47%, 8%)",
                      border: "1px solid hsl(217, 33%, 17%)",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="applications" fill="hsl(187, 85%, 53%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="placements" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardHeader>
              <CardTitle>Work Mode Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={modeData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value">
                    {modeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-3 mt-4">
                {modeData.map((item) => (
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
              <CardTitle>All Internships</CardTitle>
              <div className="flex gap-2">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search internships..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading internships...</div>
            ) : filteredInternships.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No internships found. Post your first internship to get started.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Stipend</TableHead>
                    <TableHead>Positions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInternships.map((internship) => (
                    <TableRow key={internship.id}>
                      <TableCell className="font-medium">{internship.title}</TableCell>
                      <TableCell>{internship.company_name || "-"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {internship.location || "-"}
                        </div>
                      </TableCell>
                      <TableCell>{internship.stipend ? `₹${internship.stipend.toLocaleString()}/mo` : "-"}</TableCell>
                      <TableCell>{internship.positions || 1}</TableCell>
                      <TableCell>
                        <Badge className={`${statusColors[internship.status].bg} ${statusColors[internship.status].text}`}>
                          {statusColors[internship.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openView(internship)}><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => openEdit(internship)}><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(internship.id)}><Trash2 className="h-4 w-4" /></Button>
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
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Internship</DialogTitle>
              <DialogDescription>Update the internship details</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input value={formData.company_name} onChange={(e) => setFormData({ ...formData, company_name: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Mode</Label>
                  <Select value={formData.mode} onValueChange={(v) => setFormData({ ...formData, mode: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="onsite">On-site</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Stipend (₹/month)</Label>
                  <Input type="number" value={formData.stipend} onChange={(e) => setFormData({ ...formData, stipend: e.target.value })} />
                </div>
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
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedInternship?.title}</DialogTitle>
              <DialogDescription>{selectedInternship?.company_name}</DialogDescription>
            </DialogHeader>
            {selectedInternship && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedInternship.location || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedInternship.duration || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedInternship.stipend ? `₹${selectedInternship.stipend}/month` : "Unpaid"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedInternship.positions || 1} positions</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Description</p>
                  <p>{selectedInternship.description || "No description provided"}</p>
                </div>
                {selectedInternship.skills_required && selectedInternship.skills_required.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Skills Required</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedInternship.skills_required.map((skill, i) => (
                        <Badge key={i} variant="secondary">{skill}</Badge>
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
