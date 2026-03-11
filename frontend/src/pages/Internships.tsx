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
  Send,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  FileText,
  GraduationCap,
  Phone,
  Mail,
} from "lucide-react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend,
} from "recharts";

const internshipTrendData = [
  { month: "Jan", applications: 45, placements: 12 },
  { month: "Feb", applications: 62, placements: 18 },
  { month: "Mar", applications: 78, placements: 25 },
  { month: "Apr", applications: 95, placements: 32 },
  { month: "May", applications: 120, placements: 45 },
  { month: "Jun", applications: 150, placements: 58 },
];

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
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

/* ─── Realistic sample internships ─── */
const sampleInternships: Internship[] = [
  {
    id: "s1", title: "Software Developer Intern", partner_id: null, company_name: "Tata Consultancy Services",
    description: "Work on enterprise-grade Java and Spring Boot microservices powering banking platforms. You will collaborate with senior engineers, write unit tests, and participate in code reviews.",
    requirements: ["3rd/4th year B.Tech", "CGPA ≥ 7.0"], skills_required: ["Java", "Spring Boot", "REST APIs", "SQL"],
    duration: "6 months", stipend: 25000, location: "Mumbai, India", mode: "hybrid", positions: 8,
    application_deadline: "2026-03-15", start_date: "2026-04-01", status: "open", created_by: null, created_at: "2026-01-10T10:00:00Z", updated_at: "2026-01-10T10:00:00Z",
  },
  {
    id: "s2", title: "Data Science Intern", partner_id: null, company_name: "Infosys",
    description: "Build machine learning models for predictive analytics. Work with large datasets, perform EDA, and deploy models using Flask. Strong mentoring from data science leads.",
    requirements: ["B.Tech/M.Tech CS/IT", "Statistics knowledge"], skills_required: ["Python", "Pandas", "Scikit-learn", "SQL", "Tableau"],
    duration: "3 months", stipend: 20000, location: "Bengaluru, India", mode: "hybrid", positions: 5,
    application_deadline: "2026-03-01", start_date: "2026-03-20", status: "open", created_by: null, created_at: "2026-01-08T10:00:00Z", updated_at: "2026-01-08T10:00:00Z",
  },
  {
    id: "s3", title: "Frontend Developer Intern", partner_id: null, company_name: "Flipkart",
    description: "Build responsive UI components for Flipkart's e-commerce platform using React and TypeScript. Exposure to large-scale frontend architecture and A/B testing.",
    requirements: ["Pre-final/Final year", "Portfolio preferred"], skills_required: ["React", "TypeScript", "CSS", "Git"],
    duration: "4 months", stipend: 35000, location: "Bengaluru, India", mode: "onsite", positions: 3,
    application_deadline: "2026-02-28", start_date: "2026-03-15", status: "open", created_by: null, created_at: "2026-01-05T10:00:00Z", updated_at: "2026-01-05T10:00:00Z",
  },
  {
    id: "s4", title: "Cloud Engineering Intern", partner_id: null, company_name: "Google",
    description: "Contribute to Google Cloud Platform tooling. Work on infrastructure-as-code, Kubernetes deployments, and monitoring dashboards.",
    requirements: ["B.Tech CS/IT 3rd year+", "Cloud fundamentals"], skills_required: ["GCP", "Kubernetes", "Terraform", "Python", "Linux"],
    duration: "6 months", stipend: 80000, location: "Hyderabad, India", mode: "hybrid", positions: 2,
    application_deadline: "2026-03-10", start_date: "2026-04-15", status: "open", created_by: null, created_at: "2026-01-12T10:00:00Z", updated_at: "2026-01-12T10:00:00Z",
  },
  {
    id: "s5", title: "AI/ML Research Intern", partner_id: null, company_name: "Microsoft",
    description: "Research and prototype NLP models for Azure Cognitive Services. Publish findings and contribute to open-source toolkits.",
    requirements: ["M.Tech/PhD preferred", "Research publications a plus"], skills_required: ["PyTorch", "NLP", "Transformers", "Python", "Azure"],
    duration: "6 months", stipend: 75000, location: "Noida, India", mode: "hybrid", positions: 2,
    application_deadline: "2026-04-01", start_date: "2026-05-01", status: "open", created_by: null, created_at: "2026-01-15T10:00:00Z", updated_at: "2026-01-15T10:00:00Z",
  },
  {
    id: "s6", title: "Backend Developer Intern", partner_id: null, company_name: "Zoho",
    description: "Develop scalable backend services for Zoho's suite of enterprise applications. Work with Java, Go, and PostgreSQL.",
    requirements: ["Pre-final year B.Tech", "DSA proficiency"], skills_required: ["Java", "Go", "PostgreSQL", "Redis", "Docker"],
    duration: "4 months", stipend: 22000, location: "Chennai, India", mode: "onsite", positions: 6,
    application_deadline: "2026-03-20", start_date: "2026-04-10", status: "open", created_by: null, created_at: "2026-01-09T10:00:00Z", updated_at: "2026-01-09T10:00:00Z",
  },
  {
    id: "s7", title: "DevOps Intern", partner_id: null, company_name: "Wipro",
    description: "Set up CI/CD pipelines, automate deployments, and manage containerized environments for enterprise clients.",
    requirements: ["B.Tech IT/CS", "Linux fundamentals"], skills_required: ["Jenkins", "Docker", "AWS", "Bash", "Ansible"],
    duration: "3 months", stipend: 18000, location: "Pune, India", mode: "remote", positions: 4,
    application_deadline: "2026-02-25", start_date: "2026-03-10", status: "in_progress", created_by: null, created_at: "2025-12-20T10:00:00Z", updated_at: "2026-01-05T10:00:00Z",
  },
  {
    id: "s8", title: "Cybersecurity Analyst Intern", partner_id: null, company_name: "HCL Technologies",
    description: "Assist the SOC team with threat analysis, vulnerability assessments, and SIEM monitoring. Great exposure to enterprise security operations.",
    requirements: ["B.Tech CS/IT", "CEH/CompTIA a plus"], skills_required: ["SIEM", "Network Security", "Linux", "Python"],
    duration: "6 months", stipend: 28000, location: "Noida, India", mode: "onsite", positions: 3,
    application_deadline: "2026-03-30", start_date: "2026-04-20", status: "open", created_by: null, created_at: "2026-01-14T10:00:00Z", updated_at: "2026-01-14T10:00:00Z",
  },
  {
    id: "s9", title: "Mobile App Developer Intern", partner_id: null, company_name: "PhonePe",
    description: "Build features for PhonePe's Android app using Kotlin and Jetpack Compose. Work on payments, UPI, and merchant solutions.",
    requirements: ["Pre-final/Final year", "Published app preferred"], skills_required: ["Kotlin", "Jetpack Compose", "Android", "REST APIs"],
    duration: "4 months", stipend: 40000, location: "Bengaluru, India", mode: "onsite", positions: 3,
    application_deadline: "2026-03-05", start_date: "2026-03-25", status: "open", created_by: null, created_at: "2026-01-11T10:00:00Z", updated_at: "2026-01-11T10:00:00Z",
  },
  {
    id: "s10", title: "UI/UX Design Intern", partner_id: null, company_name: "Swiggy",
    description: "Design intuitive user experiences for food delivery and quick commerce. Create wireframes, prototypes, and design systems in Figma.",
    requirements: ["Design portfolio required", "Any year"], skills_required: ["Figma", "Adobe XD", "User Research", "Prototyping"],
    duration: "3 months", stipend: 25000, location: "Bengaluru, India", mode: "hybrid", positions: 2,
    application_deadline: "2026-02-20", start_date: "2026-03-01", status: "closed", created_by: null, created_at: "2025-12-15T10:00:00Z", updated_at: "2026-02-01T10:00:00Z",
  },
  {
    id: "s11", title: "Embedded Systems Intern", partner_id: null, company_name: "Bosch India",
    description: "Work on IoT sensor firmware and embedded C programming for automotive systems. Exposure to AUTOSAR and CAN protocols.",
    requirements: ["B.Tech ECE/EEE", "Embedded C knowledge"], skills_required: ["Embedded C", "RTOS", "IoT", "Arduino", "CAN Protocol"],
    duration: "6 months", stipend: 22000, location: "Coimbatore, India", mode: "onsite", positions: 4,
    application_deadline: "2026-03-25", start_date: "2026-04-15", status: "open", created_by: null, created_at: "2026-01-13T10:00:00Z", updated_at: "2026-01-13T10:00:00Z",
  },
  {
    id: "s12", title: "Full-Stack Developer Intern", partner_id: null, company_name: "Amazon",
    description: "Build internal tools and dashboards for Amazon's logistics platform using React, Node.js, and DynamoDB. Fast-paced and high-impact work.",
    requirements: ["Final year B.Tech/M.Tech", "CGPA ≥ 8.0"], skills_required: ["React", "Node.js", "TypeScript", "AWS", "DynamoDB"],
    duration: "6 months", stipend: 60000, location: "Hyderabad, India", mode: "hybrid", positions: 4,
    application_deadline: "2026-04-10", start_date: "2026-05-01", status: "open", created_by: null, created_at: "2026-01-16T10:00:00Z", updated_at: "2026-01-16T10:00:00Z",
  },
];

export default function Internships() {
  const { internships: dbInternships, loading, createInternship, updateInternship, deleteInternship } = useInternships();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);

  /* ─── Apply Modal State ─── */
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [applyStep, setApplyStep] = useState(1);
  const [applyForm, setApplyForm] = useState({
    fullName: "", email: "", phone: "", college: "", yearOfStudy: "", cgpa: "", coverLetter: "", resumeFile: null as File | null,
  });

  const [formData, setFormData] = useState({
    title: "", company_name: "", description: "", location: "", mode: "hybrid", duration: "", stipend: "", positions: "1", application_deadline: "", start_date: "", skills_required: "", requirements: "",
  });

  // Merge DB data with sample fallback
  const internships = dbInternships.length > 0 ? dbInternships : sampleInternships;

  const filteredInternships = internships.filter((internship) => {
    const matchesSearch =
      internship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      internship.company_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || internship.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreate = async () => {
    await createInternship({
      title: formData.title, company_name: formData.company_name, description: formData.description, location: formData.location, mode: formData.mode, duration: formData.duration,
      stipend: formData.stipend ? parseFloat(formData.stipend) : null, positions: formData.positions ? parseInt(formData.positions) : 1,
      application_deadline: formData.application_deadline || null, start_date: formData.start_date || null,
      skills_required: formData.skills_required ? formData.skills_required.split(",").map((s) => s.trim()) : null,
      requirements: formData.requirements ? formData.requirements.split(",").map((r) => r.trim()) : null,
    });
    setIsCreateOpen(false);
    resetForm();
  };

  const handleEdit = async () => {
    if (!selectedInternship) return;
    await updateInternship(selectedInternship.id, {
      title: formData.title, company_name: formData.company_name, description: formData.description, location: formData.location, mode: formData.mode, duration: formData.duration,
      stipend: formData.stipend ? parseFloat(formData.stipend) : null, positions: formData.positions ? parseInt(formData.positions) : 1,
      application_deadline: formData.application_deadline || null, start_date: formData.start_date || null,
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
    setFormData({ title: "", company_name: "", description: "", location: "", mode: "hybrid", duration: "", stipend: "", positions: "1", application_deadline: "", start_date: "", skills_required: "", requirements: "" });
    setSelectedInternship(null);
  };

  const openEdit = (internship: Internship) => {
    setSelectedInternship(internship);
    setFormData({
      title: internship.title, company_name: internship.company_name || "", description: internship.description || "", location: internship.location || "", mode: internship.mode || "hybrid",
      duration: internship.duration || "", stipend: internship.stipend?.toString() || "", positions: internship.positions?.toString() || "1",
      application_deadline: internship.application_deadline || "", start_date: internship.start_date || "",
      skills_required: internship.skills_required?.join(", ") || "", requirements: internship.requirements?.join(", ") || "",
    });
    setIsEditOpen(true);
  };

  const openView = (internship: Internship) => { setSelectedInternship(internship); setIsViewOpen(true); };

  const openApply = (internship: Internship) => {
    setSelectedInternship(internship);
    setApplyStep(1);
    setApplyForm({ fullName: "", email: "", phone: "", college: "", yearOfStudy: "", cgpa: "", coverLetter: "", resumeFile: null });
    setIsApplyOpen(true);
  };

  const handleApplySubmit = () => { setApplyStep(3); };

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
            <p className="text-muted-foreground">Manage internship opportunities and student placements</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button variant="gradient"><Plus className="mr-2 h-4 w-4" />Post Internship</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Post New Internship</DialogTitle>
                <DialogDescription>Create a new internship opportunity for students</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label htmlFor="title">Title *</Label><Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Software Developer Intern" /></div>
                  <div className="space-y-2"><Label htmlFor="company">Company</Label><Input id="company" value={formData.company_name} onChange={(e) => setFormData({ ...formData, company_name: e.target.value })} placeholder="Company Name" /></div>
                </div>
                <div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe the internship role and responsibilities" rows={3} /></div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2"><Label htmlFor="location">Location</Label><Input id="location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="City, Country" /></div>
                  <div className="space-y-2"><Label htmlFor="mode">Mode</Label>
                    <Select value={formData.mode} onValueChange={(v) => setFormData({ ...formData, mode: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="remote">Remote</SelectItem><SelectItem value="onsite">On-site</SelectItem><SelectItem value="hybrid">Hybrid</SelectItem></SelectContent></Select>
                  </div>
                  <div className="space-y-2"><Label htmlFor="duration">Duration</Label><Input id="duration" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} placeholder="3 months" /></div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2"><Label htmlFor="stipend">Stipend (₹/month)</Label><Input id="stipend" type="number" value={formData.stipend} onChange={(e) => setFormData({ ...formData, stipend: e.target.value })} placeholder="0" /></div>
                  <div className="space-y-2"><Label htmlFor="positions">Positions</Label><Input id="positions" type="number" value={formData.positions} onChange={(e) => setFormData({ ...formData, positions: e.target.value })} /></div>
                  <div className="space-y-2"><Label htmlFor="deadline">Application Deadline</Label><Input id="deadline" type="date" value={formData.application_deadline} onChange={(e) => setFormData({ ...formData, application_deadline: e.target.value })} /></div>
                </div>
                <div className="space-y-2"><Label htmlFor="skills">Skills Required (comma-separated)</Label><Input id="skills" value={formData.skills_required} onChange={(e) => setFormData({ ...formData, skills_required: e.target.value })} placeholder="Python, React, Machine Learning" /></div>
                <div className="space-y-2"><Label htmlFor="requirements">Requirements (comma-separated)</Label><Input id="requirements" value={formData.requirements} onChange={(e) => setFormData({ ...formData, requirements: e.target.value })} placeholder="3rd year student, CGPA > 7.0" /></div>
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
            <Card key={stat.label} variant="glow"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">{stat.label}</p><p className="text-3xl font-bold font-display">{stat.value}</p></div><stat.icon className={`h-8 w-8 ${stat.color}`} /></div></CardContent></Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Card variant="glass" className="lg:col-span-2">
            <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" />Applications & Placements</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <ComposedChart data={internshipTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" />
                  <XAxis dataKey="month" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                  <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(222, 47%, 8%)", border: "1px solid hsl(217, 33%, 17%)", borderRadius: "8px" }} />
                  <Bar dataKey="applications" fill="hsl(187, 85%, 53%)" radius={[4, 4, 0, 0]} opacity={0.7} />
                  <Line type="monotone" dataKey="placements" stroke="hsl(38, 92%, 50%)" strokeWidth={3} dot={{ fill: "hsl(38, 92%, 50%)", r: 5, strokeWidth: 2, stroke: "hsl(222, 47%, 8%)" }} />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card variant="glass">
            <CardHeader><CardTitle>Work Mode Distribution</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={modeData.map((d, i) => ({ ...d, fill: d.color }))} startAngle={180} endAngle={0}>
                  <RadialBar background dataKey="value" cornerRadius={6} />
                  <Tooltip />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-3 mt-4">{modeData.map((item) => (<div key={item.name} className="flex items-center gap-1 text-xs"><div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} /><span>{item.name}</span></div>))}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Table */}
        <Card variant="glass">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
              <CardTitle>All Internships</CardTitle>
              <div className="flex gap-2">
                <div className="relative flex-1 sm:w-64"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search internships..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" /></div>
                <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="open">Open</SelectItem><SelectItem value="closed">Closed</SelectItem><SelectItem value="in_progress">In Progress</SelectItem><SelectItem value="completed">Completed</SelectItem></SelectContent></Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading internships...</div>
            ) : filteredInternships.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No internships found.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead><TableHead>Company</TableHead><TableHead>Location</TableHead><TableHead>Stipend</TableHead><TableHead>Positions</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInternships.map((internship) => (
                    <TableRow key={internship.id}>
                      <TableCell className="font-medium">{internship.title}</TableCell>
                      <TableCell>{internship.company_name || "-"}</TableCell>
                      <TableCell><div className="flex items-center gap-1"><MapPin className="h-3 w-3" />{internship.location || "-"}</div></TableCell>
                      <TableCell>{internship.stipend ? `₹${internship.stipend.toLocaleString()}/mo` : "-"}</TableCell>
                      <TableCell>{internship.positions || 1}</TableCell>
                      <TableCell><Badge className={`${statusColors[internship.status]?.bg} ${statusColors[internship.status]?.text}`}>{statusColors[internship.status]?.label}</Badge></TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openView(internship)}><Eye className="h-4 w-4" /></Button>
                          {internship.status === "open" && <Button variant="ghost" size="sm" className="text-primary" onClick={() => openApply(internship)}><Send className="h-3.5 w-3.5 mr-1" />Apply</Button>}
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
            <DialogHeader><DialogTitle>Edit Internship</DialogTitle><DialogDescription>Update the internship details</DialogDescription></DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Title *</Label><Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} /></div>
                <div className="space-y-2"><Label>Company</Label><Input value={formData.company_name} onChange={(e) => setFormData({ ...formData, company_name: e.target.value })} /></div>
              </div>
              <div className="space-y-2"><Label>Description</Label><Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} /></div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2"><Label>Location</Label><Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} /></div>
                <div className="space-y-2"><Label>Mode</Label><Select value={formData.mode} onValueChange={(v) => setFormData({ ...formData, mode: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="remote">Remote</SelectItem><SelectItem value="onsite">On-site</SelectItem><SelectItem value="hybrid">Hybrid</SelectItem></SelectContent></Select></div>
                <div className="space-y-2"><Label>Stipend (₹/month)</Label><Input type="number" value={formData.stipend} onChange={(e) => setFormData({ ...formData, stipend: e.target.value })} /></div>
              </div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button><Button variant="gradient" onClick={handleEdit}>Save Changes</Button></DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Dialog */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>{selectedInternship?.title}</DialogTitle><DialogDescription>{selectedInternship?.company_name}</DialogDescription></DialogHeader>
            {selectedInternship && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /><span>{selectedInternship.location || "N/A"}</span></div>
                  <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" /><span>{selectedInternship.duration || "N/A"}</span></div>
                  <div className="flex items-center gap-2"><DollarSign className="h-4 w-4 text-muted-foreground" /><span>{selectedInternship.stipend ? `₹${selectedInternship.stipend}/month` : "Unpaid"}</span></div>
                  <div className="flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground" /><span>{selectedInternship.positions || 1} positions</span></div>
                </div>
                <div><p className="text-sm text-muted-foreground mb-1">Description</p><p>{selectedInternship.description || "No description provided"}</p></div>
                {selectedInternship.skills_required && selectedInternship.skills_required.length > 0 && (
                  <div><p className="text-sm text-muted-foreground mb-2">Skills Required</p><div className="flex flex-wrap gap-2">{selectedInternship.skills_required.map((skill, i) => (<Badge key={i} variant="secondary">{skill}</Badge>))}</div></div>
                )}
              </div>
            )}
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button>
              {selectedInternship?.status === "open" && <Button variant="gradient" onClick={() => { setIsViewOpen(false); openApply(selectedInternship); }}><Send className="mr-2 h-4 w-4" />Apply Now</Button>}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ─── Apply Modal (Multi-Step) ─── */}
        <Dialog open={isApplyOpen} onOpenChange={(open) => { setIsApplyOpen(open); if (!open) setApplyStep(1); }}>
          <DialogContent className="max-w-lg">
            {/* Step indicators */}
            <div className="flex items-center justify-center gap-2 mb-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors ${applyStep >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{applyStep > s ? <CheckCircle2 className="h-4 w-4" /> : s}</div>
                  {s < 3 && <div className={`h-0.5 w-8 rounded ${applyStep > s ? "bg-primary" : "bg-muted"}`} />}
                </div>
              ))}
            </div>

            {/* Step 1: Review internship details */}
            {applyStep === 1 && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5 text-primary" />{selectedInternship?.title}</DialogTitle>
                  <DialogDescription>{selectedInternship?.company_name}</DialogDescription>
                </DialogHeader>
                <div className="space-y-3 py-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-muted-foreground" />{selectedInternship?.location}</div>
                    <div className="flex items-center gap-2 text-sm"><Clock className="h-4 w-4 text-muted-foreground" />{selectedInternship?.duration}</div>
                    <div className="flex items-center gap-2 text-sm"><DollarSign className="h-4 w-4 text-muted-foreground" />₹{selectedInternship?.stipend?.toLocaleString()}/month</div>
                    <div className="flex items-center gap-2 text-sm"><Users className="h-4 w-4 text-muted-foreground" />{selectedInternship?.positions} positions</div>
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedInternship?.description}</p>
                  {selectedInternship?.skills_required && (
                    <div><p className="text-xs text-muted-foreground mb-1">Required Skills</p><div className="flex flex-wrap gap-1">{selectedInternship.skills_required.map((s, i) => <Badge key={i} variant="secondary" className="text-xs">{s}</Badge>)}</div></div>
                  )}
                  {selectedInternship?.application_deadline && (
                    <p className="text-xs text-warning flex items-center gap-1"><Clock className="h-3 w-3" />Deadline: {new Date(selectedInternship.application_deadline).toLocaleDateString()}</p>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsApplyOpen(false)}>Cancel</Button>
                  <Button variant="gradient" onClick={() => setApplyStep(2)}>Continue <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </DialogFooter>
              </>
            )}

            {/* Step 2: Application Form */}
            {applyStep === 2 && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary" />Application Form</DialogTitle>
                  <DialogDescription>Fill in your details to apply for {selectedInternship?.title}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-3 py-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1"><Label className="text-xs">Full Name *</Label><Input placeholder="John Doe" value={applyForm.fullName} onChange={(e) => setApplyForm({ ...applyForm, fullName: e.target.value })} /></div>
                    <div className="space-y-1"><Label className="text-xs">Email *</Label><Input type="email" placeholder="john@college.edu" value={applyForm.email} onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1"><Label className="text-xs">Phone</Label><Input placeholder="+91 98765 43210" value={applyForm.phone} onChange={(e) => setApplyForm({ ...applyForm, phone: e.target.value })} /></div>
                    <div className="space-y-1"><Label className="text-xs">College / University</Label><Input placeholder="VIT University" value={applyForm.college} onChange={(e) => setApplyForm({ ...applyForm, college: e.target.value })} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1"><Label className="text-xs">Year of Study</Label>
                      <Select value={applyForm.yearOfStudy} onValueChange={(v) => setApplyForm({ ...applyForm, yearOfStudy: v })}><SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger><SelectContent><SelectItem value="1st">1st Year</SelectItem><SelectItem value="2nd">2nd Year</SelectItem><SelectItem value="3rd">3rd Year</SelectItem><SelectItem value="4th">4th Year</SelectItem><SelectItem value="pg">Postgraduate</SelectItem></SelectContent></Select>
                    </div>
                    <div className="space-y-1"><Label className="text-xs">CGPA</Label><Input type="number" step="0.1" placeholder="8.5" value={applyForm.cgpa} onChange={(e) => setApplyForm({ ...applyForm, cgpa: e.target.value })} /></div>
                  </div>
                  <div className="space-y-1"><Label className="text-xs">Cover Letter</Label><Textarea placeholder="Why are you interested in this internship? Mention relevant skills and experience..." rows={3} value={applyForm.coverLetter} onChange={(e) => setApplyForm({ ...applyForm, coverLetter: e.target.value })} /></div>
                  <div className="space-y-1"><Label className="text-xs">Resume (PDF)</Label><Input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setApplyForm({ ...applyForm, resumeFile: e.target.files?.[0] || null })} className="cursor-pointer" /></div>
                </div>
                <DialogFooter className="gap-2">
                  <Button variant="outline" onClick={() => setApplyStep(1)}><ArrowLeft className="mr-2 h-4 w-4" />Back</Button>
                  <Button variant="gradient" onClick={handleApplySubmit} disabled={!applyForm.fullName || !applyForm.email}><Send className="mr-2 h-4 w-4" />Submit Application</Button>
                </DialogFooter>
              </>
            )}

            {/* Step 3: Confirmation */}
            {applyStep === 3 && (
              <div className="text-center py-6 space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/20 animate-fade-in">
                  <CheckCircle2 className="h-8 w-8 text-success" />
                </div>
                <div className="animate-slide-up">
                  <h3 className="text-xl font-bold font-display">Application Submitted!</h3>
                  <p className="text-sm text-muted-foreground mt-1">Your application for <strong>{selectedInternship?.title}</strong> at <strong>{selectedInternship?.company_name}</strong> has been submitted successfully.</p>
                </div>
                <Card variant="glass" className="text-left animate-slide-up" style={{ animationDelay: "100ms" }}>
                  <CardContent className="p-4 space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Applicant</span><span className="font-medium">{applyForm.fullName}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="font-medium">{applyForm.email}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Position</span><span className="font-medium">{selectedInternship?.title}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Company</span><span className="font-medium">{selectedInternship?.company_name}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Reference ID</span><span className="font-medium font-mono text-primary">ICP-{Date.now().toString(36).toUpperCase()}</span></div>
                  </CardContent>
                </Card>
                <p className="text-xs text-muted-foreground">A confirmation email will be sent to {applyForm.email}</p>
                <Button variant="gradient" onClick={() => setIsApplyOpen(false)} className="mt-2">Done</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
