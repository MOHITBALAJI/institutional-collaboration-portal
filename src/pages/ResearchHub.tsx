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
import { useResearchProjects, ResearchProject } from "@/hooks/useResearchProjects";
import {
  GraduationCap,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  FileText,
  Award,
  DollarSign,
  TrendingUp,
  BookOpen,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const researchTrendData = [
  { year: "2019", projects: 8, publications: 12, funding: 25 },
  { year: "2020", projects: 12, publications: 18, funding: 45 },
  { year: "2021", projects: 15, publications: 25, funding: 62 },
  { year: "2022", projects: 22, publications: 35, funding: 85 },
  { year: "2023", projects: 28, publications: 48, funding: 120 },
  { year: "2024", projects: 35, publications: 65, funding: 180 },
];

const statusColors = {
  proposal: { bg: "bg-muted", text: "text-muted-foreground", label: "Proposal" },
  approved: { bg: "bg-primary/20", text: "text-primary", label: "Approved" },
  in_progress: { bg: "bg-warning/20", text: "text-warning", label: "In Progress" },
  completed: { bg: "bg-success/20", text: "text-success", label: "Completed" },
  published: { bg: "bg-accent/20", text: "text-accent", label: "Published" },
};

export default function ResearchHub() {
  const { projects, loading, createProject, updateProject, deleteProject } = useResearchProjects();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ResearchProject | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    methodology: "",
    funding_amount: "",
    funding_source: "",
    start_date: "",
    end_date: "",
    objectives: "",
  });

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreate = async () => {
    await createProject({
      title: formData.title,
      abstract: formData.abstract,
      methodology: formData.methodology,
      funding_amount: formData.funding_amount ? parseFloat(formData.funding_amount) : null,
      funding_source: formData.funding_source,
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
      objectives: formData.objectives ? formData.objectives.split(",").map((o) => o.trim()) : null,
    });
    setIsCreateOpen(false);
    resetForm();
  };

  const handleEdit = async () => {
    if (!selectedProject) return;
    await updateProject(selectedProject.id, {
      title: formData.title,
      abstract: formData.abstract,
      methodology: formData.methodology,
      funding_amount: formData.funding_amount ? parseFloat(formData.funding_amount) : null,
      funding_source: formData.funding_source,
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
      objectives: formData.objectives ? formData.objectives.split(",").map((o) => o.trim()) : null,
    });
    setIsEditOpen(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this research project?")) {
      await deleteProject(id);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      abstract: "",
      methodology: "",
      funding_amount: "",
      funding_source: "",
      start_date: "",
      end_date: "",
      objectives: "",
    });
    setSelectedProject(null);
  };

  const openEdit = (project: ResearchProject) => {
    setSelectedProject(project);
    setFormData({
      title: project.title,
      abstract: project.abstract || "",
      methodology: project.methodology || "",
      funding_amount: project.funding_amount?.toString() || "",
      funding_source: project.funding_source || "",
      start_date: project.start_date || "",
      end_date: project.end_date || "",
      objectives: project.objectives?.join(", ") || "",
    });
    setIsEditOpen(true);
  };

  const openView = (project: ResearchProject) => {
    setSelectedProject(project);
    setIsViewOpen(true);
  };

  const totalFunding = projects.reduce((acc, p) => acc + (p.funding_amount || 0), 0);
  const stats = [
    { label: "Research Projects", value: projects.length, icon: GraduationCap, color: "text-primary" },
    { label: "In Progress", value: projects.filter((p) => p.status === "in_progress").length, icon: BookOpen, color: "text-warning" },
    { label: "Publications", value: projects.reduce((acc, p) => acc + (p.publications?.length || 0), 0), icon: FileText, color: "text-success" },
    { label: "Total Funding", value: `₹${(totalFunding / 100000).toFixed(1)}L`, icon: DollarSign, color: "text-accent" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold font-display">
              Research <span className="gradient-text">Hub</span>
            </h1>
            <p className="text-muted-foreground">Manage research projects, publications, and funding</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button variant="gradient">
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Research Project</DialogTitle>
                <DialogDescription>Submit a new research project proposal</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Project Title *</Label>
                  <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Research project title" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="abstract">Abstract</Label>
                  <Textarea id="abstract" value={formData.abstract} onChange={(e) => setFormData({ ...formData, abstract: e.target.value })} placeholder="Brief summary of the research" rows={3} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="methodology">Methodology</Label>
                  <Textarea id="methodology" value={formData.methodology} onChange={(e) => setFormData({ ...formData, methodology: e.target.value })} placeholder="Research methodology" rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="funding">Funding Amount (₹)</Label>
                    <Input id="funding" type="number" value={formData.funding_amount} onChange={(e) => setFormData({ ...formData, funding_amount: e.target.value })} placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="source">Funding Source</Label>
                    <Input id="source" value={formData.funding_source} onChange={(e) => setFormData({ ...formData, funding_source: e.target.value })} placeholder="DST, AICTE, Industry, etc." />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start">Start Date</Label>
                    <Input id="start" type="date" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end">End Date</Label>
                    <Input id="end" type="date" value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="objectives">Objectives (comma-separated)</Label>
                  <Input id="objectives" value={formData.objectives} onChange={(e) => setFormData({ ...formData, objectives: e.target.value })} placeholder="Develop new algorithm, Publish papers, ..." />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button variant="gradient" onClick={handleCreate} disabled={!formData.title}>Create Project</Button>
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
                Research Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={researchTrendData}>
                  <defs>
                    <linearGradient id="colorProjects" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(187, 85%, 53%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(187, 85%, 53%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" />
                  <XAxis dataKey="year" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                  <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(222, 47%, 8%)", border: "1px solid hsl(217, 33%, 17%)", borderRadius: "8px" }} />
                  <Area type="monotone" dataKey="projects" stroke="hsl(187, 85%, 53%)" fillOpacity={1} fill="url(#colorProjects)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Funding by Year (₹ Lakhs)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={researchTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" />
                  <XAxis dataKey="year" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                  <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(222, 47%, 8%)", border: "1px solid hsl(217, 33%, 17%)", borderRadius: "8px" }} />
                  <Bar dataKey="funding" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Table */}
        <Card variant="glass">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
              <CardTitle>All Research Projects</CardTitle>
              <div className="flex gap-2">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search projects..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="proposal">Proposal</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading projects...</div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No research projects found.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Funding Source</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.title}</TableCell>
                      <TableCell>{project.funding_source || "-"}</TableCell>
                      <TableCell>{project.funding_amount ? `₹${project.funding_amount.toLocaleString()}` : "-"}</TableCell>
                      <TableCell>
                        {project.start_date && project.end_date
                          ? `${new Date(project.start_date).toLocaleDateString()} - ${new Date(project.end_date).toLocaleDateString()}`
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${statusColors[project.status].bg} ${statusColors[project.status].text}`}>
                          {statusColors[project.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openView(project)}><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => openEdit(project)}><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(project.id)}><Trash2 className="h-4 w-4" /></Button>
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
              <DialogTitle>Edit Research Project</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Project Title *</Label>
                <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Abstract</Label>
                <Textarea value={formData.abstract} onChange={(e) => setFormData({ ...formData, abstract: e.target.value })} rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Funding Amount (₹)</Label>
                  <Input type="number" value={formData.funding_amount} onChange={(e) => setFormData({ ...formData, funding_amount: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Funding Source</Label>
                  <Input value={formData.funding_source} onChange={(e) => setFormData({ ...formData, funding_source: e.target.value })} />
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
              <DialogTitle>{selectedProject?.title}</DialogTitle>
            </DialogHeader>
            {selectedProject && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Funding Source</p>
                    <p className="font-medium">{selectedProject.funding_source || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Funding Amount</p>
                    <p className="font-medium">{selectedProject.funding_amount ? `₹${selectedProject.funding_amount.toLocaleString()}` : "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge className={`${statusColors[selectedProject.status].bg} ${statusColors[selectedProject.status].text}`}>
                      {statusColors[selectedProject.status].label}
                    </Badge>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Abstract</p>
                  <p className="mt-1">{selectedProject.abstract || "No abstract provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Methodology</p>
                  <p className="mt-1">{selectedProject.methodology || "No methodology provided"}</p>
                </div>
                {selectedProject.objectives && selectedProject.objectives.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Objectives</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.objectives.map((obj, i) => (
                        <Badge key={i} variant="secondary">{obj}</Badge>
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
