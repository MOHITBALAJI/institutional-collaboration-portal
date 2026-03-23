import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  Zap,
  Target,
  Users,
  TrendingUp,
  ShieldCheck,
  Star,
  Activity,
  ArrowUpRight,
  Radar
} from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { cn } from "@/lib/utils";

const talentClusters = [
  { id: 1, x: 20, y: 30, size: 40, label: "AI/ML Experts", count: 124, color: "hsl(262, 83%, 58%)" },
  { id: 2, x: 65, y: 25, size: 35, label: "Fullstack Devs", count: 289, color: "hsl(187, 85%, 53%)" },
  { id: 3, x: 45, y: 65, size: 30, label: "Cloud Arch", count: 87, color: "hsl(142, 76%, 36%)" },
  { id: 4, x: 80, y: 70, size: 25, label: "Cybersecurity", count: 65, color: "hsl(0, 84%, 60%)" },
  { id: 5, x: 15, y: 75, size: 20, label: "UI/UX", count: 42, color: "hsl(38, 92%, 50%)" },
];

const samplePartners: IndustryPartner[] = [
  { id: "p1", name: "Tata Consultancy Services", industry_type: "IT Services", contact_person: "Rajesh Gopinath", contact_email: "partnerships@tcs.com", contact_phone: "+91 22 6778 9000", address: "TCS House, Mumbai", website: "https://www.tcs.com", logo_url: null, description: "Active MoU for joint research and recruitment.", partnership_since: "2018-06-15", status: "active", created_by: null, created_at: "2024-01-01T10:00:00Z", updated_at: "2024-01-01T10:00:00Z" },
  { id: "p2", name: "Infosys", industry_type: "IT Services", contact_person: "Kiran Mazumdar", contact_email: "campus@infosys.com", contact_phone: "+91 80 2852 0261", address: "Electronics City, Bangalore", website: "https://www.infosys.com", logo_url: null, description: "Global leader in consulting and digital services.", partnership_since: "2019-01-10", status: "active", created_by: null, created_at: "2024-01-15T10:00:00Z", updated_at: "2024-01-15T10:00:00Z" },
  { id: "p3", name: "Robert Bosch", industry_type: "Manufacturing", contact_person: "Soumitra Bhattacharya", contact_email: "relations@bosch.in", contact_phone: "+91 80 6757 2000", address: "Hosur Road, Bangalore", website: "https://www.bosch.in", logo_url: null, description: "Collaboration in IoT and Industry 4.0.", partnership_since: "2020-03-20", status: "active", created_by: null, created_at: "2024-02-01T10:00:00Z", updated_at: "2024-02-01T10:00:00Z" },
];

const industryTypeData = [
  { name: "IT Services", value: 35, color: "hsl(187, 85%, 53%)" },
  { name: "Manufacturing", value: 25, color: "hsl(262, 83%, 58%)" },
  { name: "Healthcare", value: 18, color: "hsl(142, 76%, 36%)" },
  { name: "Finance", value: 15, color: "hsl(38, 92%, 50%)" },
];

export default function IndustryPartners() {
  const { partners: dbPartners, loading, createPartner, updatePartner, deletePartner } = useIndustryPartners();
  const partners = dbPartners.length > 0 ? dbPartners : samplePartners;
  const [searchQuery, setSearchQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState<string>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<IndustryPartner | null>(null);
  const [formData, setFormData] = useState({
    name: "", industry_type: "", contact_person: "", contact_email: "",
    contact_phone: "", address: "", website: "", description: "", partnership_since: "",
  });

  const filteredPartners = useMemo(() => {
    return partners.filter((partner) => {
      const matchesSearch = partner.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesIndustry = industryFilter === "all" || partner.industry_type === industryFilter;
      return matchesSearch && matchesIndustry;
    });
  }, [partners, searchQuery, industryFilter]);

  const stats = [
    { label: "Active Nodes", value: partners.length, icon: Building2, color: "text-primary" },
    { label: "Talent Pooled", value: "2.4k", icon: Users, color: "text-accent" },
    { label: "Match Index", value: "94%", icon: Target, color: "text-success" },
    { label: "Hiring Velocity", value: "+12.4%", icon: TrendingUp, color: "text-warning" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in max-w-[1600px] mx-auto pb-12">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 p-8 rounded-3xl bg-black/40 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -z-10" />
          <div className="space-y-2">
            <h1 className="text-4xl lg:text-5xl font-display font-black tracking-tight leading-none italic uppercase">
              Partner <span className="gradient-text">Nexus</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              Advanced strategic dashboard for industry scouting and institutional synchronization.
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              variant="gradient"
              size="lg"
              className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20"
              onClick={() => setIsCreateOpen(true)}
            >
              <Plus className="mr-2 h-5 w-5" />
              Establish Alliance
            </Button>
          </div>
        </div>

        {/* Top Tier Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Card key={stat.label} variant="glass" className="group border-white/5 hover:border-primary/30 transition-all duration-500 overflow-hidden relative">
              <div className="absolute top-0 right-0 h-16 w-16 bg-primary/5 rounded-bl-[40px] transition-all group-hover:bg-primary/10" />
              <CardContent className="p-6">
                <div className="flex items-center justify-between relative z-10">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-display font-black tracking-tighter">{stat.value}</p>
                  </div>
                  <div className={cn("p-3 rounded-2xl bg-white/5 border border-white/5 shadow-inner", stat.color)}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
                {i === 3 && (
                  <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "70%" }}
                      className="h-full bg-warning"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* 3D Talent Constellation Visualization */}
          <Card variant="glass" className="lg:col-span-2 min-h-[500px] border-white/5 flex flex-col relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsla(var(--primary),0.05),transparent_70%)]" />
            <CardHeader className="relative z-10 px-8 pt-8">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-display font-black uppercase tracking-tight italic">
                    Talent Constellation
                  </CardTitle>
                  <CardDescription className="text-sm">Real-time skill-proximity clustering across campus.</CardDescription>
                </div>
                <Badge variant="outline" className="h-8 px-4 bg-primary/5 border-primary/20 text-primary font-black animate-pulse">
                  <Radar className="h-4 w-4 mr-2" />
                  SCANNING ACTIVE
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 relative p-0 overflow-hidden">
              <svg className="w-full h-full min-h-[400px]" viewBox="0 0 100 100">
                {/* Background Grid Lines */}
                {[...Array(5)].map((_, i) => (
                  <line
                    key={`v-${i}`}
                    x1={i * 25} y1="0" x2={i * 25} y2="100"
                    stroke="rgba(255,255,255,0.03)" strokeWidth="0.2"
                  />
                ))}
                {[...Array(5)].map((_, i) => (
                  <line
                    key={`h-${i}`}
                    x1="0" y1={i * 25} x2="100" y2={i * 25}
                    stroke="rgba(255,255,255,0.03)" strokeWidth="0.2"
                  />
                ))}

                {/* Connection Lines (Simulated Neural Links) */}
                <motion.path
                  d="M 20 30 L 65 25 L 45 65 L 80 70 L 15 75 Z"
                  fill="none"
                  stroke="rgba(var(--primary-rgb),0.1)"
                  strokeWidth="0.5"
                  strokeDasharray="2,2"
                  animate={{ strokeDashoffset: [0, -10] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />

                {/* Talent Nodes */}
                {talentClusters.map((cluster) => (
                  <motion.g
                    key={cluster.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: cluster.id * 0.1, type: "spring", damping: 12 }}
                    className="cursor-pointer group/node"
                  >
                    {/* Glow Ring */}
                    <circle
                      cx={cluster.x} cy={cluster.y} r={cluster.size / 6}
                      fill={cluster.color} opacity="0.1"
                      className="animate-pulse"
                    />
                    {/* Inner Content Circle */}
                    <circle
                      cx={cluster.x} cy={cluster.y} r={cluster.size / 10}
                      fill={cluster.color} opacity="0.4"
                      className="group-hover/node:opacity-80 transition-opacity"
                    />
                    <text
                      x={cluster.x} y={cluster.y + (cluster.size / 5)}
                      textAnchor="middle"
                      fill="white"
                      fontSize="2.5"
                      className="font-black uppercase tracking-tighter pointer-events-none drop-shadow-md"
                    >
                      {cluster.label}
                    </text>
                    <text
                      x={cluster.x} y={cluster.y - (cluster.size / 10)}
                      textAnchor="middle"
                      fill="white"
                      fontSize="1.8"
                      opacity="0.6"
                      className="font-mono pointer-events-none"
                    >
                      {cluster.count}+
                    </text>
                  </motion.g>
                ))}
              </svg>

              {/* Ticker at the bottom of the map */}
              <div className="absolute bottom-0 left-0 right-0 h-10 bg-black/60 backdrop-blur-md border-t border-white/5 flex items-center overflow-hidden whitespace-nowrap">
                <motion.div
                  animate={{ x: [0, -1000] }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="flex gap-12 font-black text-[10px] uppercase tracking-[0.2em] text-primary/60"
                >
                  {[...Array(5)].map(() => (
                    <div key={Math.random()} className="flex gap-12">
                      <span>Live Pulse: NextJS Expert Surge @ CSE Dept</span>
                      <span>•</span>
                      <span>High Demand: FinTech Analysts needed for Q3</span>
                      <span>•</span>
                      <span>Top Proximity: 42 candidates matched Goldman Sachs Profile</span>
                      <span>•</span>
                    </div>
                  ))}
                </motion.div>
              </div>
            </CardContent>
          </Card>

          {/* Scouting Insights Sidebar */}
          <div className="space-y-6">
            <Card variant="glass" className="border-white/5 p-8 space-y-6 relative overflow-hidden group">
              <div className="absolute -top-12 -right-12 h-32 w-32 bg-accent/10 rounded-full blur-3xl opacity-40 group-hover:scale-150 transition-transform duration-1000" />
              <div className="relative z-10 space-y-6">
                <h3 className="text-xl font-display font-black uppercase tracking-tight italic flex items-center gap-2">
                  <Star className="h-5 w-5 text-warning fill-warning" />
                  Scouting Picks
                </h3>
                <div className="space-y-4">
                  {[
                    { name: "Ananya G.", role: "AI Research", fit: 98, tech: "PyTorch, CUDA" },
                    { name: "Vikram M.", role: "Cloud Infra", fit: 95, tech: "Terraform, K8s" },
                    { name: "Meera P.", role: "Bio-Informatics", fit: 92, tech: "Python, R, Genomics" },
                  ].map((candidate, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group/cand cursor-pointer">
                      <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center font-bold text-xs border border-white/10">
                        {candidate.name.split('')[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <p className="text-sm font-bold truncate group-hover/cand:text-primary transition-colors">{candidate.name}</p>
                          <span className="text-[10px] font-black font-mono text-emerald-500">{candidate.fit}%</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{candidate.tech}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card variant="glass" className="border-white/5 p-8 flex flex-col justify-between overflow-hidden relative">
              <div className="relative z-10 space-y-4">
                <h3 className="text-xl font-display font-black uppercase tracking-tight italic flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Hiring Pulse
                </h3>
                <div className="space-y-3">
                  {industryTypeData.map((item, i) => (
                    <div key={item.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        <span>{item.name}</span>
                        <span>{item.value}% CAP</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.value}%` }}
                          transition={{ delay: i * 0.1, duration: 1 }}
                          className="h-full"
                          style={{ backgroundColor: item.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-white/5">
                <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 hover:border-primary/50 group rounded-xl py-6">
                  Export Strategic Report
                  <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Button>
              </div>
            </Card>
          </div>
        </div>



        {/* Directory System */}
        <Card variant="glass" className="border-white/5 overflow-hidden">
          <CardHeader className="p-8 border-b border-white/5 bg-white/[0.02]">
            <div className="flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
              <div>
                <CardTitle className="text-3xl font-display font-black uppercase tracking-tighter">
                  Alliance Directory
                </CardTitle>
                <CardDescription>Systematic repository of institutional synchronization nodes.</CardDescription>
              </div>
              <div className="flex gap-3">
                <div className="relative group w-full md:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    placeholder="Query nodes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 bg-white/5 border-white/10 rounded-2xl focus:border-primary/50 transition-all"
                  />
                </div>
                <Select value={industryFilter} onValueChange={setIndustryFilter}>
                  <SelectTrigger className="w-44 h-12 bg-white/5 border-white/10 rounded-2xl font-black uppercase text-[10px] tracking-widest">
                    <SelectValue placeholder="DOMAIN" />
                  </SelectTrigger>
                  <SelectContent className="glass-card-strong border-white/10">
                    <SelectItem value="all">ALL DOMAINS</SelectItem>
                    {industryTypeData.map((type) => (
                      <SelectItem key={type.name} value={type.name} className="font-bold">{type.name.toUpperCase()}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground animate-pulse">
                <Activity className="h-10 w-10 mb-4 text-primary" />
                <p className="font-mono text-sm tracking-widest uppercase">Synchronizing with central database...</p>
              </div>
            ) : filteredPartners.length === 0 ? (
              <div className="text-center py-20 bg-black/20 italic text-muted-foreground">
                No active alliance nodes found matching your query parameters.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-white/5">
                    <TableRow className="hover:bg-transparent border-white/10">
                      <TableHead className="py-6 pl-8 font-black uppercase tracking-widest text-[10px] text-muted-foreground">Strategic Entity</TableHead>
                      <TableHead className="font-black uppercase tracking-widest text-[10px] text-muted-foreground">Nexus Domain</TableHead>
                      <TableHead className="font-black uppercase tracking-widest text-[10px] text-muted-foreground">Node Contact</TableHead>
                      <TableHead className="font-black uppercase tracking-widest text-[10px] text-muted-foreground text-center">Protocol Since</TableHead>
                      <TableHead className="font-black uppercase tracking-widest text-[10px] text-muted-foreground">Nexus Status</TableHead>
                      <TableHead className="text-right pr-8 font-black uppercase tracking-widest text-[10px] text-muted-foreground">Control</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPartners.map((partner) => (
                      <TableRow key={partner.id} className="group hover:bg-white/[0.02] border-white/5 transition-colors">
                        <TableCell className="py-6 pl-8">
                          <div className="font-bold text-lg tracking-tight group-hover:text-primary transition-colors">{partner.name}</div>
                          <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono mt-1 flex items-center gap-2">
                            <MapPin className="h-3 w-3" />
                            {partner.address?.split(',')[0]}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-white/5 border-white/5 text-[9px] font-black tracking-widest py-1 px-3">
                            {partner.industry_type?.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-bold">{partner.contact_person}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{partner.contact_email}</div>
                        </TableCell>
                        <TableCell className="text-center font-mono text-sm">
                          {partner.partnership_since ? new Date(partner.partnership_since).getFullYear() : "—"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={cn("h-1.5 w-1.5 rounded-full", partner.status === "active" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-muted")} />
                            <span className={cn("text-[10px] font-black uppercase tracking-tighter", partner.status === "active" ? "text-emerald-500" : "text-muted-foreground")}>
                              {partner.status || "active"} SYNC
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-8">
                          <div className="flex justify-end gap-1 scale-90 origin-right">
                            {partner.website && (
                              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/20 hover:text-primary transition-all" asChild>
                                <a href={partner.website} target="_blank" rel="noopener noreferrer"><Globe className="h-5 w-5" /></a>
                              </Button>
                            )}
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-white/5"><Eye className="h-5 w-5" /></Button>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-white/5" onClick={() => { setSelectedPartner(partner); setIsEditOpen(true); }}><Edit className="h-5 w-5" /></Button>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-rose-500/10 hover:text-rose-500 transition-all text-muted-foreground" onClick={() => { if (confirm("Confirm deletion of nexus node?")) deletePartner(partner.id) }}><Trash2 className="h-5 w-5" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Established Alliance Creation Dialog - Redesigned */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="max-w-3xl glass-card-strong border-white/10 p-0 overflow-hidden shadow-[0_0_50px_rgba(var(--primary-rgb),0.1)]">
            <div className="flex h-full min-h-[500px]">
              <div className="w-1/3 bg-gradient-to-b from-primary/20 to-accent/20 p-8 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-grid-white opacity-10" />
                <div className="relative z-10">
                  <ShieldCheck className="h-12 w-12 text-primary mb-6" />
                  <h2 className="text-2xl font-display font-black uppercase tracking-tighter leading-tight italic">Alliance Establishment</h2>
                  <p className="text-xs text-muted-foreground/80 mt-4 leading-relaxed font-mono">Establish a new synchronization node in the Partner Nexus ecosystem.</p>
                </div>
                <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">Node Integrity</p>
                  <p className="text-[10px] text-muted-foreground italic mt-1 leading-relaxed">All strategic relationships are verified via institutional protocols.</p>
                </div>
              </div>
              <div className="flex-1 p-10 space-y-8 bg-black/40">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Entity Name</Label>
                    <Input variant="glass" placeholder="TechCorp Global" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Nexus Domain</Label>
                    <Input variant="glass" placeholder="IT Services" value={formData.industry_type} onChange={(e) => setFormData({ ...formData, industry_type: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Contact Node</Label>
                    <Input variant="glass" placeholder="Strategic Lead Name" value={formData.contact_person} onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email Frequency</Label>
                    <Input variant="glass" type="email" placeholder="scouting@entity.com" value={formData.contact_email} onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Mission Statement</Label>
                  <Textarea variant="glass" placeholder="Scope of collaboration..." className="min-h-[100px]" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="ghost" onClick={() => setIsCreateOpen(false)} className="rounded-xl px-6 font-bold">Abort</Button>
                  <Button variant="gradient" className="rounded-xl px-12 h-12 font-black uppercase tracking-widest shadow-lg shadow-primary/20" onClick={() => { createPartner(formData); setIsCreateOpen(false) }}>Establish Node</Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
