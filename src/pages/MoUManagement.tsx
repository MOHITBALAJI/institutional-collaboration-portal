import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useMoUs, MoU } from "@/hooks/useMoUs";
import {
  FileText,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  TrendingUp,
  Calendar,
  Building2,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

const mouTrendData = [
  { month: "Jan", active: 12, pending: 3, new: 2 },
  { month: "Feb", active: 15, pending: 4, new: 3 },
  { month: "Mar", active: 18, pending: 2, new: 4 },
  { month: "Apr", active: 22, pending: 5, new: 6 },
  { month: "May", active: 28, pending: 3, new: 5 },
  { month: "Jun", active: 35, pending: 4, new: 8 },
];

const statusColors = {
  draft: { bg: "bg-muted", text: "text-muted-foreground", label: "Draft" },
  pending_approval: { bg: "bg-warning/20", text: "text-warning", label: "Pending" },
  active: { bg: "bg-success/20", text: "text-success", label: "Active" },
  expired: { bg: "bg-destructive/20", text: "text-destructive", label: "Expired" },
  terminated: { bg: "bg-destructive/20", text: "text-destructive", label: "Terminated" },
};

const pieData = [
  { name: "Active", value: 35, color: "hsl(142, 76%, 36%)" },
  { name: "Pending", value: 8, color: "hsl(38, 92%, 50%)" },
  { name: "Draft", value: 5, color: "hsl(215, 20%, 55%)" },
  { name: "Expired", value: 3, color: "hsl(0, 84%, 60%)" },
];

const sampleMoUs: MoU[] = [
  { id: "m1", title: "Industry-Academia Research Collaboration", partner_id: null, partner_name: "Tata Consultancy Services", description: "Joint research in AI/ML, cloud computing, and cybersecurity. Includes student internships, faculty exchange, and co-authored publications.", objectives: ["Joint Research", "Student Internships", "Faculty Development"], start_date: "2024-01-01", end_date: "2027-01-01", status: "active", document_url: null, key_deliverables: ["5 joint publications", "20 internships/year", "2 patents"], budget: 5000000, assigned_faculty: "Dr. Rajesh Kumar", created_by: null, approved_by: null, approved_at: null, created_at: "2024-01-01T10:00:00Z", updated_at: "2024-01-01T10:00:00Z" },
  { id: "m2", title: "Centre of Excellence in Data Sciences", partner_id: null, partner_name: "Infosys", description: "Establish a CoE for data science research and training. Industry-relevant curriculum development and certification programs.", objectives: ["CoE Setup", "Curriculum Development", "Certification Programs"], start_date: "2024-06-01", end_date: "2027-06-01", status: "active", document_url: null, key_deliverables: ["Lab infrastructure", "10 courses updated", "500 certifications"], budget: 8000000, assigned_faculty: "Prof. Meena Iyer", created_by: null, approved_by: null, approved_at: null, created_at: "2024-06-01T10:00:00Z", updated_at: "2024-06-01T10:00:00Z" },
  { id: "m3", title: "Defence Research Partnership", partner_id: null, partner_name: "DRDO", description: "Collaborative research on embedded systems, signal processing, and autonomous systems for defence applications.", objectives: ["Defence R&D", "Prototype Development", "Security Research"], start_date: "2023-04-01", end_date: "2026-04-01", status: "active", document_url: null, key_deliverables: ["3 prototypes", "8 publications", "1 patent filed"], budget: 12000000, assigned_faculty: "Dr. Venkat Rao", created_by: null, approved_by: null, approved_at: null, created_at: "2023-04-01T10:00:00Z", updated_at: "2023-04-01T10:00:00Z" },
  { id: "m4", title: "Student Exchange & Joint Degree Program", partner_id: null, partner_name: "IIT Madras", description: "Academic collaboration for student exchange, joint supervision of M.Tech/PhD theses, and collaborative workshops.", objectives: ["Student Exchange", "Joint Supervision", "Knowledge Sharing"], start_date: "2025-01-01", end_date: "2028-01-01", status: "active", document_url: null, key_deliverables: ["10 exchanges/year", "5 joint theses", "Annual workshop"], budget: 2000000, assigned_faculty: "Dr. Priya Sharma", created_by: null, approved_by: null, approved_at: null, created_at: "2025-01-01T10:00:00Z", updated_at: "2025-01-01T10:00:00Z" },
  { id: "m5", title: "Healthcare Innovation Lab", partner_id: null, partner_name: "Apollo Hospitals", description: "Establish a joint innovation lab for healthcare technology — telemedicine, AI diagnostics, and patient data analytics.", objectives: ["Health-Tech R&D", "Clinical Trials", "IP Development"], start_date: "2025-03-01", end_date: "2028-03-01", status: "pending_approval", document_url: null, key_deliverables: ["Lab setup", "2 clinical pilots", "3 publications"], budget: 15000000, assigned_faculty: null, created_by: null, approved_by: null, approved_at: null, created_at: "2025-03-01T10:00:00Z", updated_at: "2025-03-01T10:00:00Z" },
  { id: "m6", title: "EV Battery Testing Partnership", partner_id: null, partner_name: "Tata Motors", description: "Testing and validation of EV battery technologies. Includes lab equipment sponsorship and placement opportunities.", objectives: ["Battery R&D", "Lab Equipment", "Placements"], start_date: "2025-07-01", end_date: "2027-07-01", status: "draft", document_url: null, key_deliverables: ["Testing reports", "5 placements", "Lab upgrade"], budget: 6000000, assigned_faculty: null, created_by: null, approved_by: null, approved_at: null, created_at: "2025-07-01T10:00:00Z", updated_at: "2025-07-01T10:00:00Z" },
  { id: "m7", title: "Semiconductor Design Training", partner_id: null, partner_name: "Texas Instruments", description: "Training program for VLSI and semiconductor design. Sponsored lab, industry mentors, and recruitment pipeline.", objectives: ["VLSI Training", "Sponsored Lab", "Recruitment"], start_date: "2022-01-01", end_date: "2025-01-01", status: "expired", document_url: null, key_deliverables: ["200 students trained", "Lab setup", "30 recruited"], budget: 4000000, assigned_faculty: "Dr. Arun Patel", created_by: null, approved_by: null, approved_at: null, created_at: "2022-01-01T10:00:00Z", updated_at: "2025-01-02T10:00:00Z" },
  { id: "m8", title: "Renewable Energy Research Consortium", partner_id: null, partner_name: "Adani Green Energy", description: "Multi-year research partnership on solar and wind energy optimization, smart grid technology, and energy storage.", objectives: ["Renewable Energy R&D", "Smart Grid", "Energy Storage"], start_date: "2025-06-01", end_date: "2028-06-01", status: "pending_approval", document_url: null, key_deliverables: ["Pilot smart grid", "4 publications", "2 patents"], budget: 20000000, assigned_faculty: null, created_by: null, approved_by: null, approved_at: null, created_at: "2025-06-01T10:00:00Z", updated_at: "2025-06-01T10:00:00Z" },
];

export default function MoUManagement() {
  const { mous: dbMous, loading, createMoU, updateMoU, deleteMoU } = useMoUs();
  const mous = dbMous.length > 0 ? dbMous : sampleMoUs;
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedMoU, setSelectedMoU] = useState<MoU | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    partner_name: "",
    description: "",
    start_date: "",
    end_date: "",
    budget: "",
    objectives: "",
    key_deliverables: "",
  });

  const filteredMoUs = mous.filter((mou) => {
    const matchesSearch =
      mou.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mou.partner_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || mou.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreate = async () => {
    await createMoU({
      title: formData.title,
      partner_name: formData.partner_name,
      description: formData.description,
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
      budget: formData.budget ? parseFloat(formData.budget) : null,
      objectives: formData.objectives ? formData.objectives.split(",").map((o) => o.trim()) : null,
      key_deliverables: formData.key_deliverables
        ? formData.key_deliverables.split(",").map((d) => d.trim())
        : null,
    });
    setIsCreateOpen(false);
    resetForm();
  };

  const handleEdit = async () => {
    if (!selectedMoU) return;
    await updateMoU(selectedMoU.id, {
      title: formData.title,
      partner_name: formData.partner_name,
      description: formData.description,
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
      budget: formData.budget ? parseFloat(formData.budget) : null,
      objectives: formData.objectives ? formData.objectives.split(",").map((o) => o.trim()) : null,
      key_deliverables: formData.key_deliverables
        ? formData.key_deliverables.split(",").map((d) => d.trim())
        : null,
    });
    setIsEditOpen(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this MoU?")) {
      await deleteMoU(id);
    }
  };

  const handleStatusChange = async (id: string, status: MoU["status"]) => {
    await updateMoU(id, { status });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      partner_name: "",
      description: "",
      start_date: "",
      end_date: "",
      budget: "",
      objectives: "",
      key_deliverables: "",
    });
    setSelectedMoU(null);
  };

  const openEdit = (mou: MoU) => {
    setSelectedMoU(mou);
    setFormData({
      title: mou.title,
      partner_name: mou.partner_name || "",
      description: mou.description || "",
      start_date: mou.start_date || "",
      end_date: mou.end_date || "",
      budget: mou.budget?.toString() || "",
      objectives: mou.objectives?.join(", ") || "",
      key_deliverables: mou.key_deliverables?.join(", ") || "",
    });
    setIsEditOpen(true);
  };

  const openView = (mou: MoU) => {
    setSelectedMoU(mou);
    setIsViewOpen(true);
  };

  const stats = [
    { label: "Total MoUs", value: mous.length, icon: FileText, color: "text-primary" },
    { label: "Active", value: mous.filter((m) => m.status === "active").length, icon: CheckCircle, color: "text-success" },
    { label: "Pending Approval", value: mous.filter((m) => m.status === "pending_approval").length, icon: Clock, color: "text-warning" },
    {
      label: "Expiring Soon", value: mous.filter((m) => {
        if (!m.end_date) return false;
        const days = Math.ceil((new Date(m.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        return days > 0 && days <= 30;
      }).length, icon: AlertCircle, color: "text-destructive"
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold font-display">
              MoU <span className="gradient-text">Management</span>
            </h1>
            <p className="text-muted-foreground">
              Manage Memoranda of Understanding with industry partners
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button variant="gradient">
                <Plus className="mr-2 h-4 w-4" />
                New MoU
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New MoU</DialogTitle>
                <DialogDescription>
                  Enter the details for the new Memorandum of Understanding
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
                      placeholder="MoU Title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="partner">Partner Name</Label>
                    <Input
                      id="partner"
                      value={formData.partner_name}
                      onChange={(e) => setFormData({ ...formData, partner_name: e.target.value })}
                      placeholder="Industry Partner"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the MoU"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_date">End Date</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget (₹)</Label>
                    <Input
                      id="budget"
                      type="number"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="objectives">Objectives (comma-separated)</Label>
                  <Input
                    id="objectives"
                    value={formData.objectives}
                    onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                    placeholder="Research collaboration, Student internships, ..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deliverables">Key Deliverables (comma-separated)</Label>
                  <Input
                    id="deliverables"
                    value={formData.key_deliverables}
                    onChange={(e) => setFormData({ ...formData, key_deliverables: e.target.value })}
                    placeholder="Joint publications, Training programs, ..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button variant="gradient" onClick={handleCreate} disabled={!formData.title}>
                  Create MoU
                </Button>
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
                MoU Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={mouTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" />
                  <XAxis dataKey="month" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                  <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(222, 47%, 8%)", border: "1px solid hsl(217, 33%, 17%)", borderRadius: "8px" }} />
                  <Legend />
                  <Line type="stepAfter" dataKey="active" stroke="hsl(142, 76%, 36%)" strokeWidth={3} dot={{ r: 4, fill: "hsl(142, 76%, 36%)" }} name="Active" />
                  <Line type="stepAfter" dataKey="pending" stroke="hsl(38, 92%, 50%)" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3, fill: "hsl(38, 92%, 50%)" }} name="Pending" />
                  <Line type="stepAfter" dataKey="new" stroke="hsl(187, 85%, 53%)" strokeWidth={2} dot={{ r: 3, fill: "hsl(187, 85%, 53%)" }} name="New" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardHeader>
              <CardTitle>Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={pieData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" horizontal={false} />
                  <XAxis type="number" stroke="hsl(215, 20%, 55%)" fontSize={11} />
                  <YAxis type="category" dataKey="name" width={60} stroke="hsl(215, 20%, 55%)" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(222, 47%, 8%)", border: "1px solid hsl(217, 33%, 17%)", borderRadius: "8px" }} />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]}>{pieData.map((entry, index) => (<Bar key={index} dataKey="value" fill={entry.color} />))}</Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-3 mt-4">
                {pieData.map((item) => (
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
              <CardTitle>All MoUs</CardTitle>
              <div className="flex gap-2">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search MoUs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending_approval">Pending</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="terminated">Terminated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading MoUs...</div>
            ) : filteredMoUs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No MoUs found. Create your first MoU to get started.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Partner</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMoUs.map((mou) => (
                    <TableRow key={mou.id}>
                      <TableCell className="font-medium">{mou.title}</TableCell>
                      <TableCell>{mou.partner_name || "-"}</TableCell>
                      <TableCell>
                        {mou.start_date && mou.end_date
                          ? `${new Date(mou.start_date).toLocaleDateString()} - ${new Date(mou.end_date).toLocaleDateString()}`
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {mou.budget ? `₹${mou.budget.toLocaleString()}` : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${statusColors[mou.status].bg} ${statusColors[mou.status].text}`}>
                          {statusColors[mou.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openView(mou)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openEdit(mou)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => handleDelete(mou.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
              <DialogTitle>Edit MoU</DialogTitle>
              <DialogDescription>Update the MoU details</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Title *</Label>
                  <Input
                    id="edit-title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-partner">Partner Name</Label>
                  <Input
                    id="edit-partner"
                    value={formData.partner_name}
                    onChange={(e) => setFormData({ ...formData, partner_name: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-start">Start Date</Label>
                  <Input
                    id="edit-start"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-end">End Date</Label>
                  <Input
                    id="edit-end"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-budget">Budget (₹)</Label>
                  <Input
                    id="edit-budget"
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  />
                </div>
              </div>
              {selectedMoU && (
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={selectedMoU.status}
                    onValueChange={(value) =>
                      handleStatusChange(selectedMoU.id, value as MoU["status"])
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="pending_approval">Pending Approval</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="terminated">Terminated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button variant="gradient" onClick={handleEdit}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Dialog */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedMoU?.title}</DialogTitle>
              <DialogDescription>MoU Details</DialogDescription>
            </DialogHeader>
            {selectedMoU && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Partner</p>
                    <p className="font-medium">{selectedMoU.partner_name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge className={`${statusColors[selectedMoU.status].bg} ${statusColors[selectedMoU.status].text}`}>
                      {statusColors[selectedMoU.status].label}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="font-medium">
                      {selectedMoU.start_date
                        ? new Date(selectedMoU.start_date).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">End Date</p>
                    <p className="font-medium">
                      {selectedMoU.end_date
                        ? new Date(selectedMoU.end_date).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Budget</p>
                    <p className="font-medium">
                      {selectedMoU.budget ? `₹${selectedMoU.budget.toLocaleString()}` : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="font-medium">
                      {new Date(selectedMoU.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="mt-1">{selectedMoU.description || "No description provided"}</p>
                </div>
                {selectedMoU.objectives && selectedMoU.objectives.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Objectives</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedMoU.objectives.map((obj, i) => (
                        <Badge key={i} variant="secondary">
                          {obj}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {selectedMoU.key_deliverables && selectedMoU.key_deliverables.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Key Deliverables</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedMoU.key_deliverables.map((del, i) => (
                        <Badge key={i} variant="outline">
                          {del}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
