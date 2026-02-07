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
import { useIndustryPartners, IndustryPartner } from "@/hooks/useIndustryPartners";
import {
  Building2,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Globe,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const industryTypeData = [
  { name: "IT Services", value: 35, color: "hsl(187, 85%, 53%)" },
  { name: "Manufacturing", value: 25, color: "hsl(262, 83%, 58%)" },
  { name: "Healthcare", value: 18, color: "hsl(142, 76%, 36%)" },
  { name: "Finance", value: 15, color: "hsl(38, 92%, 50%)" },
  { name: "Others", value: 7, color: "hsl(0, 84%, 60%)" },
];

const partnerGrowth = [
  { year: "2019", partners: 45 },
  { year: "2020", partners: 68 },
  { year: "2021", partners: 92 },
  { year: "2022", partners: 118 },
  { year: "2023", partners: 145 },
  { year: "2024", partners: 156 },
];

export default function IndustryPartners() {
  const { partners, loading, createPartner, updatePartner, deletePartner } = useIndustryPartners();
  const [searchQuery, setSearchQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState<string>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<IndustryPartner | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    industry_type: "",
    contact_person: "",
    contact_email: "",
    contact_phone: "",
    address: "",
    website: "",
    description: "",
    partnership_since: "",
  });

  const filteredPartners = partners.filter((partner) => {
    const matchesSearch = partner.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = industryFilter === "all" || partner.industry_type === industryFilter;
    return matchesSearch && matchesIndustry;
  });

  const handleCreate = async () => {
    await createPartner({
      name: formData.name,
      industry_type: formData.industry_type,
      contact_person: formData.contact_person,
      contact_email: formData.contact_email,
      contact_phone: formData.contact_phone,
      address: formData.address,
      website: formData.website,
      description: formData.description,
      partnership_since: formData.partnership_since || null,
    });
    setIsCreateOpen(false);
    resetForm();
  };

  const handleEdit = async () => {
    if (!selectedPartner) return;
    await updatePartner(selectedPartner.id, {
      name: formData.name,
      industry_type: formData.industry_type,
      contact_person: formData.contact_person,
      contact_email: formData.contact_email,
      contact_phone: formData.contact_phone,
      address: formData.address,
      website: formData.website,
      description: formData.description,
      partnership_since: formData.partnership_since || null,
    });
    setIsEditOpen(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this partner?")) {
      await deletePartner(id);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      industry_type: "",
      contact_person: "",
      contact_email: "",
      contact_phone: "",
      address: "",
      website: "",
      description: "",
      partnership_since: "",
    });
    setSelectedPartner(null);
  };

  const openEdit = (partner: IndustryPartner) => {
    setSelectedPartner(partner);
    setFormData({
      name: partner.name,
      industry_type: partner.industry_type || "",
      contact_person: partner.contact_person || "",
      contact_email: partner.contact_email || "",
      contact_phone: partner.contact_phone || "",
      address: partner.address || "",
      website: partner.website || "",
      description: partner.description || "",
      partnership_since: partner.partnership_since || "",
    });
    setIsEditOpen(true);
  };

  const openView = (partner: IndustryPartner) => {
    setSelectedPartner(partner);
    setIsViewOpen(true);
  };

  const industryTypes = [...new Set(partners.map((p) => p.industry_type).filter(Boolean))];

  const stats = [
    { label: "Total Partners", value: partners.length, icon: Building2, color: "text-primary" },
    { label: "Active", value: partners.filter((p) => p.status === "active").length, icon: Building2, color: "text-success" },
    { label: "IT Sector", value: partners.filter((p) => p.industry_type?.toLowerCase().includes("it")).length, icon: Building2, color: "text-accent" },
    { label: "This Year", value: partners.filter((p) => p.partnership_since && new Date(p.partnership_since).getFullYear() === new Date().getFullYear()).length, icon: Calendar, color: "text-warning" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold font-display">
              Industry <span className="gradient-text">Partners</span>
            </h1>
            <p className="text-muted-foreground">Manage industry partnerships and collaborations</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button variant="gradient">
                <Plus className="mr-2 h-4 w-4" />
                Add Partner
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Industry Partner</DialogTitle>
                <DialogDescription>Register a new industry partner</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Company Name *</Label>
                    <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="TechCorp India" />
                  </div>
                  <div className="space-y-2">
                    <Label>Industry Type</Label>
                    <Select value={formData.industry_type} onValueChange={(v) => setFormData({ ...formData, industry_type: v })}>
                      <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IT Services">IT Services</SelectItem>
                        <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Consulting">Consulting</SelectItem>
                        <SelectItem value="Others">Others</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Contact Person</Label>
                    <Input value={formData.contact_person} onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })} placeholder="John Smith" />
                  </div>
                  <div className="space-y-2">
                    <Label>Contact Email</Label>
                    <Input type="email" value={formData.contact_email} onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })} placeholder="john@techcorp.com" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Contact Phone</Label>
                    <Input value={formData.contact_phone} onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })} placeholder="+91 9876543210" />
                  </div>
                  <div className="space-y-2">
                    <Label>Website</Label>
                    <Input value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} placeholder="https://techcorp.com" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Bangalore, India" />
                  </div>
                  <div className="space-y-2">
                    <Label>Partnership Since</Label>
                    <Input type="date" value={formData.partnership_since} onChange={(e) => setFormData({ ...formData, partnership_since: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Brief description of the partnership" rows={3} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button variant="gradient" onClick={handleCreate} disabled={!formData.name}>Add Partner</Button>
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
              <CardTitle>Partner Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={partnerGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" />
                  <XAxis dataKey="year" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                  <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(222, 47%, 8%)", border: "1px solid hsl(217, 33%, 17%)", borderRadius: "8px" }} />
                  <Bar dataKey="partners" fill="hsl(187, 85%, 53%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardHeader>
              <CardTitle>Industry Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={industryTypeData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value">
                    {industryTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-3 mt-4">
                {industryTypeData.map((item) => (
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
              <CardTitle>Partner Directory</CardTitle>
              <div className="flex gap-2">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search partners..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
                </div>
                <Select value={industryFilter} onValueChange={setIndustryFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    {industryTypes.map((type) => (
                      <SelectItem key={type} value={type!}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading partners...</div>
            ) : filteredPartners.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No partners found.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Since</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPartners.map((partner) => (
                    <TableRow key={partner.id}>
                      <TableCell className="font-medium">{partner.name}</TableCell>
                      <TableCell>{partner.industry_type || "-"}</TableCell>
                      <TableCell>{partner.contact_person || "-"}</TableCell>
                      <TableCell>{partner.partnership_since ? new Date(partner.partnership_since).getFullYear() : "-"}</TableCell>
                      <TableCell>
                        <Badge className={partner.status === "active" ? "bg-success/20 text-success" : "bg-muted text-muted-foreground"}>
                          {partner.status || "active"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {partner.website && (
                            <Button variant="ghost" size="icon" asChild>
                              <a href={partner.website} target="_blank" rel="noopener noreferrer"><Globe className="h-4 w-4" /></a>
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" onClick={() => openView(partner)}><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => openEdit(partner)}><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(partner.id)}><Trash2 className="h-4 w-4" /></Button>
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
              <DialogTitle>Edit Partner</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company Name *</Label>
                  <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Industry Type</Label>
                  <Select value={formData.industry_type} onValueChange={(v) => setFormData({ ...formData, industry_type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IT Services">IT Services</SelectItem>
                      <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Others">Others</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Contact Person</Label>
                  <Input value={formData.contact_person} onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Contact Email</Label>
                  <Input type="email" value={formData.contact_email} onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })} />
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
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedPartner?.name}</DialogTitle>
              <DialogDescription>{selectedPartner?.industry_type}</DialogDescription>
            </DialogHeader>
            {selectedPartner && (
              <div className="space-y-4">
                <div className="space-y-2">
                  {selectedPartner.contact_person && (
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedPartner.contact_person}</span>
                    </div>
                  )}
                  {selectedPartner.contact_email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedPartner.contact_email}</span>
                    </div>
                  )}
                  {selectedPartner.contact_phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedPartner.contact_phone}</span>
                    </div>
                  )}
                  {selectedPartner.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedPartner.address}</span>
                    </div>
                  )}
                  {selectedPartner.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a href={selectedPartner.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{selectedPartner.website}</a>
                    </div>
                  )}
                </div>
                {selectedPartner.description && (
                  <div>
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="mt-1">{selectedPartner.description}</p>
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
