import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
    FolderKanban,
    Plus,
    Search,
    Users,
    Calendar,
    Code,
    GitBranch,
    CheckCircle2,
    User,
    Github,
    ArrowRight,
    LayoutGrid,
    Trello,
    Zap,
    Sparkles,
    Globe,
    Cpu,
    Database,
    Phone,
    Monitor,
    ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Project {
    id: string; title: string; description: string; owner: string;
    techStack: string[]; category: string; status: "recruiting" | "in-progress" | "completed";
    teamSize: number; maxTeam: number; members: string[];
    progress: number; deadline: string; github: string;
}

const sampleProjects: Project[] = [
    { id: "prj1", title: "EcoTrack — Carbon Footprint Calculator", description: "Mobile app for tracking individual carbon footprint with gamified challenges. Looking for a UI/UX designer and one more ML developer.", owner: "Aditya V.", techStack: ["React Native", "Firebase", "TensorFlow Lite"], category: "mobile", status: "recruiting", teamSize: 3, maxTeam: 5, members: ["Aditya V.", "Priya K.", "Arjun D."], progress: 35, deadline: "2026-05-15", github: "github.com/aditya/ecotrack" },
    { id: "prj2", title: "CampusConnect — Event Discovery", description: "Web platform aggregating all college events with personalized recommendations. Built with Next.js and Supabase.", owner: "Meera P.", techStack: ["Next.js", "Supabase", "Tailwind CSS", "PWA"], category: "web", status: "in-progress", teamSize: 4, maxTeam: 4, members: ["Meera P.", "Rohan S.", "Tanvi M.", "Harsh G."], progress: 72, deadline: "2026-04-01", github: "github.com/meera/campusconnect" },
    { id: "prj3", title: "MediScan — AI Diagnostic Tool", description: "Deep learning model for diabetic retinopathy detection from retinal images. Targeting 95%+ accuracy with EfficientNet-B4.", owner: "Rahul S.", techStack: ["Python", "TensorFlow", "Flask", "OpenCV"], category: "ai-ml", status: "in-progress", teamSize: 2, maxTeam: 3, members: ["Rahul S.", "Sneha K."], progress: 60, deadline: "2026-06-30", github: "github.com/rahul/mediscan" },
    { id: "prj4", title: "SmartIrrigate — IoT Crop Monitoring", description: "IoT-based soil moisture monitoring system for precision agriculture using ESP32, MQTT, and a React dashboard.", owner: "Kavitha S.", techStack: ["ESP32", "Arduino", "MQTT", "React"], category: "iot", status: "recruiting", teamSize: 2, maxTeam: 4, members: ["Kavitha S.", "Deepak R."], progress: 20, deadline: "2026-07-01", github: "github.com/kavitha/smartirrigate" },
    { id: "prj5", title: "BlockCred — Blockchain Credential Verifier", description: "Decentralized credential verification using Ethereum smart contracts. Universities issue tamper-proof certificates as NFTs.", owner: "Nikhil R.", techStack: ["Solidity", "React", "ethers.js", "IPFS"], category: "blockchain", status: "recruiting", teamSize: 1, maxTeam: 3, members: ["Nikhil R."], progress: 10, deadline: "2026-08-01", github: "github.com/nikhil/blockcred" },
    { id: "prj6", title: "UniBot — Campus AI Chatbot", description: "GPT-powered chatbot answering student queries about admissions, fees, exam schedules. Deployable on website and WhatsApp.", owner: "Priya K.", techStack: ["Python", "LangChain", "FastAPI", "React"], category: "ai-ml", status: "completed", teamSize: 3, maxTeam: 3, members: ["Priya K.", "Ravi M.", "Ankita T."], progress: 100, deadline: "2026-01-31", github: "github.com/priya/unibot" },
];

const SC: Record<string, { bg: string; text: string; label: string; border: string; glow: string }> = {
    recruiting: { bg: "bg-blue-500/15", text: "text-blue-400", label: "Recruiting", border: "border-blue-500/30", glow: "shadow-blue-500/10" },
    "in-progress": { bg: "bg-warning/15", text: "text-warning", label: "In Progress", border: "border-warning/30", glow: "shadow-warning/10" },
    completed: { bg: "bg-success/15", text: "text-success", label: "Completed", border: "border-success/30", glow: "shadow-success/10" },
};

const CL: Record<string, { label: string; icon: any; color: string }> = {
    all: { label: "All Categories", icon: Globe, color: "text-primary" },
    web: { label: "Web Apps", icon: Monitor, color: "text-cyan-400" },
    mobile: { label: "Mobile Dev", icon: Phone, color: "text-rose-400" },
    "ai-ml": { label: "AI & ML", icon: Cpu, color: "text-primary" },
    iot: { label: "IoT & Hardware", icon: Zap, color: "text-warning" },
    blockchain: { label: "Blockchain", icon: Database, color: "text-emerald-400" }
};

// Tooltip/Glow mapping based on tech stack strings
const techGlows: Record<string, string> = {
    "React": "text-cyan-400",
    "React Native": "text-cyan-500",
    "Next.js": "text-white",
    "Python": "text-blue-400",
    "TensorFlow": "text-orange-500",
    "Tailwind CSS": "text-sky-400",
    "Solidity": "text-slate-400",
    "Firebase": "text-warning",
    "Supabase": "text-emerald-500",
    "IoT": "text-warning",
    "Blockchain": "text-emerald-400"
};

import { ProjectPresence } from "@/components/projects/ProjectPresence";

export default function ProjectBoard() {
    const [projects, setProjects] = useState(sampleProjects);
    const [search, setSearch] = useState("");
    const [statusF, setStatusF] = useState("all");
    const [catF, setCatF] = useState("all");
    const [viewMode, setViewMode] = useState<"grid" | "kanban">("grid");
    const [sel, setSel] = useState<Project | null>(null);
    const [createOpen, setCreateOpen] = useState(false);
    const [np, setNp] = useState({ title: "", desc: "", tech: "", cat: "web", max: "4", dead: "", gh: "" });

    const filtered = projects.filter(p => {
        const ms = p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.techStack.some(t => t.toLowerCase().includes(search.toLowerCase()));
        return ms && (statusF === "all" || p.status === statusF) && (catF === "all" || p.category === catF);
    });

    const create = () => {
        const p: Project = {
            id: `prj-${Date.now()}`,
            title: np.title,
            description: np.desc,
            owner: "You",
            techStack: np.tech.split(",").map(t => t.trim()).filter(Boolean),
            category: np.cat,
            status: "recruiting",
            teamSize: 1,
            maxTeam: parseInt(np.max) || 4,
            members: ["You"],
            progress: 0,
            deadline: np.dead,
            github: np.gh
        };
        setProjects([p, ...projects]);
        setCreateOpen(false);
        setNp({ title: "", desc: "", tech: "", cat: "web", max: "4", dead: "", gh: "" });
    };

    const join = (id: string) => {
        setProjects(projects.map(p => p.id === id ? { ...p, teamSize: p.teamSize + 1, members: [...p.members, "You"] } : p));
        if (sel?.id === id) setSel({ ...sel, teamSize: sel.teamSize + 1, members: [...sel.members, "You"] });
    };

    return (
        <DashboardLayout>
            <ProjectPresence />

            <div className="space-y-8 animate-fade-in relative z-10">
                {/* Header & New Project */}
                <div className="relative overflow-hidden rounded-2xl p-6 md:p-8">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent" />
                    <div className="absolute -top-24 -right-24 h-64 w-64 bg-primary/5 blur-[100px] rounded-full" />

                    <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 mb-1">
                                <Sparkles className="h-4 w-4 text-primary" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-primary/80">Collaborative Ecosystem</span>
                            </div>
                            <h1 className="text-3xl lg:text-5xl font-extrabold font-display tracking-tight">
                                Project <span className="gradient-text">Collaboration</span>
                            </h1>
                            <p className="text-muted-foreground text-lg max-w-xl">
                                Join cutting-edge teams or launch your own vision. Build, scale, and innovate.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <Button variant="gradient" size="xl" className="shadow-xl shadow-primary/20 group" onClick={() => setCreateOpen(true)}>
                                <Plus className="mr-2 h-5 w-5 transition-transform group-hover:rotate-90" />
                                Launch Project
                            </Button>
                        </div>
                    </div>
                </div>

                {/* KPI Overview */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { label: "Total Projects", v: projects.length, i: FolderKanban, c: "text-primary", bg: "bg-primary/10" },
                        { label: "Active Hiring", v: projects.filter(p => p.status === "recruiting").length, i: Users, c: "text-blue-400", bg: "bg-blue-400/10" },
                        { label: "In Development", v: projects.filter(p => p.status === "in-progress").length, i: Code, c: "text-warning", bg: "bg-warning/10" },
                        { label: "Completed", v: projects.filter(p => p.status === "completed").length, i: CheckCircle2, c: "text-success", bg: "bg-success/10" }
                    ].map(s => {
                        const Icon = s.i;
                        return (
                            <Card key={s.label} variant="glow" className="group">
                                <CardContent className="p-5 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{s.label}</p>
                                        <p className="text-3xl font-extrabold font-display group-hover:gradient-text transition-all duration-300">{s.v}</p>
                                    </div>
                                    <div className={`h-11 w-11 rounded-xl ${s.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                                        <Icon className={`h-5 w-5 ${s.c}`} />
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Filters & Dynamic View Toggle */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between pb-2 border-b border-white/5">
                    <div className="flex gap-4 items-center w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        <div className="relative w-full md:w-80 group">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                            <Input
                                placeholder="Filter by name or tech..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="pl-9 bg-card/50 border-white/5 focus-visible:ring-primary/50"
                            />
                        </div>
                        <Select value={statusF} onValueChange={setStatusF}>
                            <SelectTrigger className="w-36 bg-card/50 border-white/5 h-10"><SelectValue /></SelectTrigger>
                            <SelectContent className="glass-card-strong border-white/10">
                                <SelectItem value="all">Any Status</SelectItem>
                                <SelectItem value="recruiting">Recruiting</SelectItem>
                                <SelectItem value="in-progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={catF} onValueChange={setCatF}>
                            <SelectTrigger className="w-40 bg-card/50 border-white/5 h-10"><SelectValue /></SelectTrigger>
                            <SelectContent className="glass-card-strong border-white/10">
                                {Object.entries(CL).map(([v, { label, icon: Icon }]) => (
                                    <SelectItem key={v} value={v}>
                                        <div className="flex items-center gap-2">
                                            <Icon className="h-3.5 w-3.5" />
                                            {label}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex bg-secondary/30 p-1 rounded-lg border border-white/5">
                        <Button
                            variant={viewMode === "grid" ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("grid")}
                            className="h-8 gap-2 rounded-md transition-all"
                        >
                            <LayoutGrid className="h-4 w-4" /> Grid
                        </Button>
                        <Button
                            variant={viewMode === "kanban" ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("kanban")}
                            className="h-8 gap-2 rounded-md transition-all"
                        >
                            <Trello className="h-4 w-4" /> Kanban
                        </Button>
                    </div>
                </div>

                {/* Primary Content View */}
                {viewMode === "grid" ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filtered.map((p, idx) => {
                            const CategoryIcon = CL[p.category]?.icon || FolderKanban;
                            return (
                                <Card
                                    key={p.id}
                                    variant="glass"
                                    className="group cursor-pointer border-white/5 card-hover-shadow hover:ring-1 hover:ring-primary/30 transition-all duration-300 animate-fade-in-up"
                                    onClick={() => setSel(p)}
                                    style={{ animationDelay: `${idx * 80}ms`, animationFillMode: 'forwards' }}
                                >
                                    <CardContent className="p-6 space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div className="h-10 w-10 rounded-lg bg-card border border-white/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                <CategoryIcon className="h-5 w-5" />
                                            </div>
                                            <Badge className={`${SC[p.status].bg} ${SC[p.status].text} border ${SC[p.status].border} text-[10px] uppercase font-bold tracking-widest`}>
                                                {SC[p.status].label}
                                            </Badge>
                                        </div>

                                        <div className="space-y-1">
                                            <h3 className="text-xl font-display font-bold group-hover:gradient-text transition-all duration-500">{p.title}</h3>
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <User className="h-3 w-3" />
                                                <span>{p.owner}</span>
                                            </div>
                                        </div>

                                        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed min-h-[4.5em]">
                                            {p.description}
                                        </p>

                                        <div className="flex flex-wrap gap-1.5 pt-1">
                                            {p.techStack.map(t => (
                                                <Badge key={t} variant="outline" className={cn("text-[10px] border-white/5 bg-secondary/20", techGlows[t] || "text-muted-foreground")}>
                                                    {t}
                                                </Badge>
                                            ))}
                                        </div>

                                        <div className="pt-2 space-y-2">
                                            <div className="flex justify-between items-end">
                                                <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                                    <Users className="h-3 w-3" />
                                                    <span>{p.teamSize} / {p.maxTeam} Members</span>
                                                </div>
                                                <span className="text-xs font-bold text-primary">{p.progress}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary animate-progress-bar rounded-full"
                                                    style={{ "--bar-width": `${p.progress}%` } as React.CSSProperties}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                        {["recruiting", "in-progress", "completed"].map(status => (
                            <div key={status} className="flex-1 min-w-[320px] max-w-[400px] space-y-4">
                                <div className="flex items-center justify-between px-2">
                                    <div className="flex items-center gap-2">
                                        <div className={cn("h-2 w-2 rounded-full", SC[status].text.replace('text', 'bg'))} />
                                        <h3 className="font-bold font-display uppercase tracking-widest text-sm">{SC[status].label}</h3>
                                        <Badge variant="secondary" className="text-[10px] h-5 rounded-full px-2">{filtered.filter(p => p.status === status).length}</Badge>
                                    </div>
                                </div>
                                <div className="space-y-4 min-h-[200px] p-1">
                                    {filtered.filter(p => p.status === status).map(p => (
                                        <Card
                                            key={p.id}
                                            variant="glass"
                                            className="group cursor-pointer border-white/5 hover:ring-1 hover:ring-primary/20 transition-all animate-fade-in"
                                            onClick={() => setSel(p)}
                                        >
                                            <CardContent className="p-4 space-y-3">
                                                <h4 className="font-bold text-sm leading-tight group-hover:text-primary transition-colors">{p.title}</h4>
                                                <p className="text-[12px] text-muted-foreground line-clamp-2">{p.description}</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {p.techStack.slice(0, 3).map(t => <span key={t} className={cn("text-[9px] font-bold uppercase", techGlows[t] || "text-muted-foreground/60")}>{t}</span>)}
                                                </div>
                                                <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-white/5 mt-2">
                                                    <div className="flex items-center gap-1"><Users className="h-3 w-3" /> {p.teamSize}/{p.maxTeam}</div>
                                                    <div className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {p.deadline}</div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                    {filtered.filter(p => p.status === status).length === 0 && (
                                        <div className="h-32 rounded-xl border border-dashed border-white/5 flex items-center justify-center text-muted-foreground text-xs italic">
                                            No projects here
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Detail View */}
                <Dialog open={!!sel} onOpenChange={o => { if (!o) setSel(null) }}>
                    <DialogContent className="max-w-2xl glass-card-strong border-white/10 p-0 overflow-hidden">
                        {sel && (
                            <div className="flex flex-col">
                                <div className={cn("h-20 w-full relative", SC[sel.status].bg)}>
                                    <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                                    <div className="absolute bottom-0 left-0 p-4 translate-y-1/2">
                                        <Badge className={`${SC[sel.status].bg} ${SC[sel.status].text} border ${SC[sel.status].border} px-4 py-1 text-xs`}>
                                            {SC[sel.status].label}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="p-8 pt-10 space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-3xl font-display font-extrabold">{sel.title}</h2>
                                            <div className="flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-secondary/50 text-xs font-bold border border-white/5">
                                                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                                {CL[sel.category]?.label || sel.category}
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1.5"><User className="h-4 w-4 text-primary" /> <span className="text-foreground font-bold">{sel.owner}</span></div>
                                            <div className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Finalize by {sel.deadline}</div>
                                            {sel.github && <div className="flex items-center gap-1.5 text-primary hover:underline"><Github className="h-4 w-4" /> {sel.github}</div>}
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-xl bg-secondary/20 border border-white/5">
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Internal Brief</h4>
                                        <p className="text-sm leading-relaxed">{sel.description}</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <h4 className="text-sm font-bold flex items-center gap-2"><Code className="h-4 w-4 text-primary" /> Intelligence Stack</h4>
                                            <div className="flex flex-wrap gap-1.5">
                                                {sel.techStack.map(t => <Badge key={t} variant="glow" className="text-xs">{t}</Badge>)}
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <h4 className="text-sm font-bold flex items-center gap-2"><Users className="h-4 w-4 text-accent" /> Active Team ({sel.teamSize}/{sel.maxTeam})</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {sel.members.map(m => (
                                                    <div key={m} className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-secondary/40 border border-white/5">
                                                        <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold border border-primary/20">{m[0]}</div>
                                                        <span className="text-[11px] font-bold">{m}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-end">
                                            <h4 className="text-sm font-bold">Execution Milestone</h4>
                                            <span className="text-xl font-extrabold font-display text-primary">{sel.progress}%</span>
                                        </div>
                                        <Progress value={sel.progress} className="h-3" />
                                    </div>
                                </div>
                                <div className="p-6 bg-secondary/10 border-t border-white/5 flex gap-3 justify-end">
                                    <Button variant="outline" className="px-8" onClick={() => setSel(null)}>Dismiss</Button>
                                    {sel.status === "recruiting" && sel.teamSize < sel.maxTeam && !sel.members.includes("You") && (
                                        <Button variant="gradient" className="px-8 shadow-lg shadow-primary/20" onClick={() => join(sel.id)}>
                                            <Zap className="mr-2 h-4 w-4 fill-current" /> Join Initiative
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Create Project Modal */}
                <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                    <DialogContent className="max-w-xl glass-card-strong border-white/10 p-0 overflow-hidden">
                        <div className="p-8">
                            <DialogHeader className="mb-6">
                                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                    <FolderKanban className="h-6 w-6 text-primary" />
                                </div>
                                <DialogTitle className="text-3xl font-display font-extrabold">Initiate Project</DialogTitle>
                                <DialogDescription className="text-lg">Launch a new collaboration and gather the best talent.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-6 py-2">
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold">Project Concept *</Label>
                                    <Input variant="glass" placeholder="e.g., QuantumSentry Firewall" value={np.title} onChange={e => setNp({ ...np, title: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold">Mission Statement *</Label>
                                    <Textarea variant="glass" placeholder="What are you building and why?" value={np.desc} onChange={e => setNp({ ...np, desc: e.target.value })} rows={3} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold">Domain</Label>
                                        <Select value={np.cat} onValueChange={v => setNp({ ...np, cat: v })}>
                                            <SelectTrigger className="bg-card/50 border-white/5 h-10"><SelectValue /></SelectTrigger>
                                            <SelectContent className="glass-card-strong border-white/10">
                                                {Object.entries(CL).filter(([k]) => k !== "all").map(([v, { label }]) => (
                                                    <SelectItem key={v} value={v}>{label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold">Team Capacity</Label>
                                        <Input type="number" variant="glass" value={np.max} onChange={e => setNp({ ...np, max: e.target.value })} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold">Intelligence Stack (tags)</Label>
                                    <Input variant="glass" placeholder="React, Python, OpenCV..." value={np.tech} onChange={e => setNp({ ...np, tech: e.target.value })} />
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest opacity-50">Separate technologies with commas</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold">Milestone Deadline</Label>
                                        <Input type="date" variant="glass" value={np.dead} onChange={e => setNp({ ...np, dead: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold">GitHub Repository</Label>
                                        <Input variant="glass" placeholder="github.com/yourname/repo" value={np.gh} onChange={e => setNp({ ...np, gh: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-secondary/10 border-t border-white/5 flex gap-3 justify-end">
                            <Button variant="outline" className="px-8" onClick={() => setCreateOpen(false)}>Cancel</Button>
                            <Button variant="gradient" className="px-8 shadow-lg shadow-primary/20" onClick={create} disabled={!np.title || !np.desc}>Deploy Initiative</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
}
