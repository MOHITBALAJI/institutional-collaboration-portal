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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAlumni, Alumni } from "@/hooks/useAlumni";
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Linkedin,
  Building2,
  GraduationCap,
  UserCheck,
  Calendar,
  History,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Treemap,
} from "recharts";

const graduationData = [
  { year: "2019", count: 120 },
  { year: "2020", count: 145 },
  { year: "2021", count: 168 },
  { year: "2022", count: 195 },
  { year: "2023", count: 220 },
  { year: "2024", count: 180 },
];

const industryData = [
  { name: "IT/Software", value: 45, color: "hsl(187, 85%, 53%)" },
  { name: "Finance", value: 20, color: "hsl(262, 83%, 58%)" },
  { name: "Consulting", value: 15, color: "hsl(142, 76%, 36%)" },
  { name: "Manufacturing", value: 12, color: "hsl(38, 92%, 50%)" },
  { name: "Others", value: 8, color: "hsl(0, 84%, 60%)" },
];
const sampleAlumni: Alumni[] = [
  { id: "a1", user_id: null, full_name: "Arun Prakash", email: "arun.prakash@google.com", phone: "+91 98765 43210", graduation_year: 2018, department: "Computer Science", degree: "B.Tech", current_company: "Google", current_position: "Senior Software Engineer", linkedin_url: "https://linkedin.com/in/arunprakash", is_mentor: true, mentorship_areas: ["System Design", "DSA", "Interview Prep"], availability: "weekends", verified: true, created_at: "2024-01-01T10:00:00Z", updated_at: "2024-01-01T10:00:00Z" },
  { id: "a2", user_id: null, full_name: "Sneha Reddy", email: "sneha.reddy@microsoft.com", phone: "+91 87654 32109", graduation_year: 2019, department: "Computer Science", degree: "M.Tech", current_company: "Microsoft", current_position: "Product Manager", linkedin_url: "https://linkedin.com/in/snehareddy", is_mentor: true, mentorship_areas: ["Product Management", "Career Transition", "Leadership"], availability: "evenings", verified: true, created_at: "2024-02-01T10:00:00Z", updated_at: "2024-02-01T10:00:00Z" },
  { id: "a3", user_id: null, full_name: "Vikram Mehta", email: "vikram@razorpay.com", phone: "+91 76543 21098", graduation_year: 2017, department: "Electronics", degree: "B.Tech", current_company: "Razorpay", current_position: "Engineering Manager", linkedin_url: "https://linkedin.com/in/vikrammehta", is_mentor: true, mentorship_areas: ["FinTech", "Engineering Management", "Startups"], availability: "flexible", verified: true, created_at: "2024-01-15T10:00:00Z", updated_at: "2024-01-15T10:00:00Z" },
  { id: "a4", user_id: null, full_name: "Divya Krishnan", email: "divya.k@amazon.com", phone: "+91 65432 10987", graduation_year: 2020, department: "Computer Science", degree: "B.Tech", current_company: "Amazon", current_position: "SDE-II", linkedin_url: "https://linkedin.com/in/divyakrishnan", is_mentor: false, mentorship_areas: null, availability: null, verified: true, created_at: "2024-03-01T10:00:00Z", updated_at: "2024-03-01T10:00:00Z" },
  { id: "a5", user_id: null, full_name: "Rahul Jain", email: "rahul.jain@goldmansachs.com", phone: "+91 54321 09876", graduation_year: 2016, department: "Mathematics", degree: "M.Sc", current_company: "Goldman Sachs", current_position: "VP — Quantitative Finance", linkedin_url: "https://linkedin.com/in/rahuljain", is_mentor: true, mentorship_areas: ["Quantitative Finance", "Data Science", "Mathematics"], availability: "weekends", verified: true, created_at: "2024-04-01T10:00:00Z", updated_at: "2024-04-01T10:00:00Z" },
  { id: "a6", user_id: null, full_name: "Priyanka Desai", email: "priyanka@flipkart.com", phone: "+91 43210 98765", graduation_year: 2021, department: "Information Technology", degree: "B.Tech", current_company: "Flipkart", current_position: "Software Engineer", linkedin_url: "https://linkedin.com/in/priyankadesai", is_mentor: false, mentorship_areas: null, availability: null, verified: false, created_at: "2024-05-01T10:00:00Z", updated_at: "2024-05-01T10:00:00Z" },
  { id: "a7", user_id: null, full_name: "Karthik Iyer", email: "karthik@deloitte.com", phone: "+91 32109 87654", graduation_year: 2015, department: "Mechanical Engineering", degree: "B.Tech", current_company: "Deloitte", current_position: "Senior Consultant", linkedin_url: "https://linkedin.com/in/karthikiyer", is_mentor: true, mentorship_areas: ["Consulting", "MBA Prep", "Career Switch"], availability: "evenings", verified: true, created_at: "2024-06-01T10:00:00Z", updated_at: "2024-06-01T10:00:00Z" },
  { id: "a8", user_id: null, full_name: "Neha Gupta", email: "neha.gupta@stripe.com", phone: "+91 21098 76543", graduation_year: 2019, department: "Computer Science", degree: "B.Tech", current_company: "Stripe", current_position: "Staff Engineer", linkedin_url: "https://linkedin.com/in/nehagupta", is_mentor: true, mentorship_areas: ["Backend Systems", "Payments", "Distributed Systems"], availability: "flexible", verified: true, created_at: "2024-07-01T10:00:00Z", updated_at: "2024-07-01T10:00:00Z" },
  { id: "a9", user_id: null, full_name: "Siddharth Nair", email: "sid@zoho.com", phone: "+91 10987 65432", graduation_year: 2022, department: "Computer Science", degree: "B.Tech", current_company: "Zoho", current_position: "Member Technical Staff", linkedin_url: null, is_mentor: false, mentorship_areas: null, availability: null, verified: false, created_at: "2024-08-01T10:00:00Z", updated_at: "2024-08-01T10:00:00Z" },
  { id: "a10", user_id: null, full_name: "Ananya Chatterjee", email: "ananya@tesla.com", phone: "+91 09876 54321", graduation_year: 2018, department: "Electrical Engineering", degree: "M.Tech", current_company: "Tesla", current_position: "Lead Firmware Engineer", linkedin_url: "https://linkedin.com/in/ananyachatterjee", is_mentor: true, mentorship_areas: ["Embedded Systems", "EV Technology", "Hardware-Software Integration"], availability: "weekends", verified: true, created_at: "2024-09-01T10:00:00Z", updated_at: "2024-09-01T10:00:00Z" },
];

export default function AlumniNetwork() {
  const { alumni: dbAlumni, loading, createAlumni, updateAlumni, deleteAlumni } = useAlumni();
  const alumni = dbAlumni.length > 0 ? dbAlumni : sampleAlumni;
  const [searchQuery, setSearchQuery] = useState("");
  const [mentorFilter, setMentorFilter] = useState<string>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedAlumni, setSelectedAlumni] = useState<Alumni | null>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    graduation_year: "",
    department: "",
    degree: "",
    current_company: "",
    current_position: "",
    linkedin_url: "",
    is_mentor: false,
    mentorship_areas: "",
  });

  const filteredAlumni = alumni.filter((a) => {
    const matchesSearch =
      a.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.current_company?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMentor = mentorFilter === "all" || (mentorFilter === "mentors" ? a.is_mentor : !a.is_mentor);
    return matchesSearch && matchesMentor;
  });

  const handleCreate = async () => {
    await createAlumni({
      full_name: formData.full_name,
      email: formData.email,
      phone: formData.phone,
      graduation_year: formData.graduation_year ? parseInt(formData.graduation_year) : null,
      department: formData.department,
      degree: formData.degree,
      current_company: formData.current_company,
      current_position: formData.current_position,
      linkedin_url: formData.linkedin_url,
      is_mentor: formData.is_mentor,
      mentorship_areas: formData.mentorship_areas ? formData.mentorship_areas.split(",").map((a) => a.trim()) : null,
    });
    setIsCreateOpen(false);
    resetForm();
  };

  const handleEdit = async () => {
    if (!selectedAlumni) return;
    await updateAlumni(selectedAlumni.id, {
      full_name: formData.full_name,
      email: formData.email,
      phone: formData.phone,
      graduation_year: formData.graduation_year ? parseInt(formData.graduation_year) : null,
      department: formData.department,
      degree: formData.degree,
      current_company: formData.current_company,
      current_position: formData.current_position,
      linkedin_url: formData.linkedin_url,
      is_mentor: formData.is_mentor,
      mentorship_areas: formData.mentorship_areas ? formData.mentorship_areas.split(",").map((a) => a.trim()) : null,
    });
    setIsEditOpen(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this alumni profile?")) {
      await deleteAlumni(id);
    }
  };

  const resetForm = () => {
    setFormData({
      full_name: "",
      email: "",
      phone: "",
      graduation_year: "",
      department: "",
      degree: "",
      current_company: "",
      current_position: "",
      linkedin_url: "",
      is_mentor: false,
      mentorship_areas: "",
    });
    setSelectedAlumni(null);
  };

  const openEdit = (a: Alumni) => {
    setSelectedAlumni(a);
    setFormData({
      full_name: a.full_name,
      email: a.email || "",
      phone: a.phone || "",
      graduation_year: a.graduation_year?.toString() || "",
      department: a.department || "",
      degree: a.degree || "",
      current_company: a.current_company || "",
      current_position: a.current_position || "",
      linkedin_url: a.linkedin_url || "",
      is_mentor: a.is_mentor || false,
      mentorship_areas: a.mentorship_areas?.join(", ") || "",
    });
    setIsEditOpen(true);
  };

  const openView = (a: Alumni) => {
    setSelectedAlumni(a);
    setIsViewOpen(true);
  };

  const stats = [
    { label: "Total Alumni", value: alumni.length, icon: Users, color: "text-primary" },
    { label: "Active Mentors", value: alumni.filter((a) => a.is_mentor).length, icon: UserCheck, color: "text-success" },
    { label: "Companies", value: new Set(alumni.map((a) => a.current_company).filter(Boolean)).size, icon: Building2, color: "text-accent" },
    { label: "Verified", value: alumni.filter((a) => a.verified).length, icon: GraduationCap, color: "text-warning" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold font-display">
              Alumni <span className="gradient-text">Network</span>
            </h1>
            <p className="text-muted-foreground">Connect with alumni and manage mentorship programs</p>
          </div>
          <div className="flex gap-2">


            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button variant="gradient">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Alumni
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add Alumni Entity</DialogTitle>
                  <DialogDescription>Initialize a new neural node in the Alumni Galaxy</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Full Name *</Label>
                      <Input value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="john@example.com" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Graduation Year</Label>
                      <Input type="number" value={formData.graduation_year} onChange={(e) => setFormData({ ...formData, graduation_year: e.target.value })} placeholder="2020" />
                    </div>
                    <div className="space-y-2">
                      <Label>Department</Label>
                      <Input value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} placeholder="Computer Science" />
                    </div>
                    <div className="space-y-2">
                      <Label>Degree</Label>
                      <Input value={formData.degree} onChange={(e) => setFormData({ ...formData, degree: e.target.value })} placeholder="B.Tech" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Current Company</Label>
                      <Input value={formData.current_company} onChange={(e) => setFormData({ ...formData, current_company: e.target.value })} placeholder="Google" />
                    </div>
                    <div className="space-y-2">
                      <Label>Current Position</Label>
                      <Input value={formData.current_position} onChange={(e) => setFormData({ ...formData, current_position: e.target.value })} placeholder="Software Engineer" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>LinkedIn URL</Label>
                    <Input value={formData.linkedin_url} onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })} placeholder="https://linkedin.com/in/johndoe" />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label>Available as Mentor</Label>
                      <p className="text-sm text-muted-foreground">Can students request mentorship sessions?</p>
                    </div>
                    <Switch checked={formData.is_mentor} onCheckedChange={(checked) => setFormData({ ...formData, is_mentor: checked })} />
                  </div>
                  {formData.is_mentor && (
                    <div className="space-y-2">
                      <Label>Mentorship Areas (comma-separated)</Label>
                      <Input value={formData.mentorship_areas} onChange={(e) => setFormData({ ...formData, mentorship_areas: e.target.value })} placeholder="Career guidance, Interview prep, ..." />
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                  <Button variant="gradient" onClick={handleCreate} disabled={!formData.full_name}>Add Alumni</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
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
                <Calendar className="h-5 w-5 text-primary" />
                Alumni by Graduation Year
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={graduationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" />
                  <XAxis dataKey="year" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                  <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(222, 47%, 8%)", border: "1px solid hsl(217, 33%, 17%)", borderRadius: "8px" }} />
                  <Line type="monotone" dataKey="count" stroke="hsl(187, 85%, 53%)" strokeWidth={3} dot={{ r: 6, fill: "hsl(187, 85%, 53%)", strokeWidth: 3, stroke: "hsl(222, 47%, 8%)" }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardHeader>
              <CardTitle>Industry Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <Treemap data={industryData.map(e => ({ name: e.name, size: e.value, fill: e.color }))} dataKey="size" aspectRatio={4 / 3} stroke="hsl(222, 18%, 12%)" />
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-3 mt-4">
                {industryData.map((item) => (
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
              <CardTitle>Alumni Directory</CardTitle>
              <div className="flex gap-2">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search alumni..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
                </div>
                <Select value={mentorFilter} onValueChange={setMentorFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Alumni</SelectItem>
                    <SelectItem value="mentors">Mentors Only</SelectItem>
                    <SelectItem value="non-mentors">Non-Mentors</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading alumni...</div>
            ) : filteredAlumni.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No alumni found.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Graduation</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Mentor</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAlumni.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium">{a.full_name}</TableCell>
                      <TableCell>{a.graduation_year || "-"}</TableCell>
                      <TableCell>{a.current_company || "-"}</TableCell>
                      <TableCell>{a.current_position || "-"}</TableCell>
                      <TableCell>
                        {a.is_mentor ? (
                          <Badge className="bg-success/20 text-success">Mentor</Badge>
                        ) : (
                          <Badge variant="secondary">No</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {a.linkedin_url && (
                            <Button variant="ghost" size="icon" asChild>
                              <a href={a.linkedin_url} target="_blank" rel="noopener noreferrer">
                                <Linkedin className="h-4 w-4 text-[#0077b5]" />
                              </a>
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" onClick={() => openView(a)}><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => openEdit(a)}><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(a.id)}><Trash2 className="h-4 w-4" /></Button>
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
              <DialogTitle>Edit Alumni Profile</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Current Company</Label>
                  <Input value={formData.current_company} onChange={(e) => setFormData({ ...formData, current_company: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Current Position</Label>
                  <Input value={formData.current_position} onChange={(e) => setFormData({ ...formData, current_position: e.target.value })} />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label>Available as Mentor</Label>
                </div>
                <Switch checked={formData.is_mentor} onCheckedChange={(checked) => setFormData({ ...formData, is_mentor: checked })} />
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
              <DialogTitle>{selectedAlumni?.full_name}</DialogTitle>
              <DialogDescription>{selectedAlumni?.current_position} at {selectedAlumni?.current_company}</DialogDescription>
            </DialogHeader>
            {selectedAlumni && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Graduation Year</p>
                    <p className="font-medium">{selectedAlumni.graduation_year || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Department</p>
                    <p className="font-medium">{selectedAlumni.department || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Degree</p>
                    <p className="font-medium">{selectedAlumni.degree || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Mentor Status</p>
                    {selectedAlumni.is_mentor ? (
                      <Badge className="bg-success/20 text-success">Active Mentor</Badge>
                    ) : (
                      <Badge variant="secondary">Not a Mentor</Badge>
                    )}
                  </div>
                </div>
                {selectedAlumni.mentorship_areas && selectedAlumni.mentorship_areas.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Mentorship Areas</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedAlumni.mentorship_areas.map((area, i) => (
                        <Badge key={i} variant="secondary">{area}</Badge>
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
