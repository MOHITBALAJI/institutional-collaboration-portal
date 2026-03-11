import { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Sparkles, Search, Briefcase, MapPin, Clock, Building, TrendingUp, Star,
    ChevronRight, Zap, Target, ThumbsUp, ThumbsDown, BookmarkPlus, ExternalLink,
    FileUp, Loader2, CheckCircle2, Scan, Brain, Info, ArrowUpRight, Send, FileText
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useSound } from "@/hooks/useSound";
import { cn } from "@/lib/utils";

interface MatchedInternship {
    id: string; title: string; company: string; location: string; type: string;
    stipend: string; duration: string; matchScore: number; matchReasons: string[];
    skills: string[]; deadline: string; saved: boolean;
}

const matchedInternships: MatchedInternship[] = [
    { id: "m1", title: "ML Engineer Intern", company: "Google DeepMind", location: "Bangalore", type: "On-site", stipend: "₹80,000/mo", duration: "6 months", matchScore: 96, matchReasons: ["Your TensorFlow projects match perfectly", "Strong Python skills (top 10%)", "Research background in ML aligns with team"], skills: ["Python", "TensorFlow", "PyTorch", "Research"], deadline: "2026-03-15", saved: false },
    { id: "m2", title: "Full-Stack Developer Intern", company: "Razorpay", location: "Bangalore", type: "Hybrid", stipend: "₹60,000/mo", duration: "3 months", matchScore: 91, matchReasons: ["React + Node.js skills match stack", "Previous payment project experience", "Strong DSA scores"], skills: ["React", "Node.js", "PostgreSQL", "TypeScript"], deadline: "2026-03-20", saved: false },
    { id: "m3", title: "Data Science Intern", company: "Flipkart", location: "Bangalore", type: "On-site", stipend: "₹50,000/mo", duration: "4 months", matchScore: 87, matchReasons: ["pandas/numpy proficiency", "SQL expertise from database coursework", "Statistics background matches"], skills: ["Python", "SQL", "Pandas", "Tableau"], deadline: "2026-04-01", saved: false },
    { id: "m4", title: "Cloud Engineering Intern", company: "Microsoft Azure", location: "Hyderabad", type: "On-site", stipend: "₹70,000/mo", duration: "6 months", matchScore: 82, matchReasons: ["Docker/K8s coursework", "Linux administration skills", "CI/CD pipeline experience"], skills: ["AWS", "Docker", "Kubernetes", "Terraform"], deadline: "2026-03-25", saved: false },
];

const INITIAL_SKILLS = ["Python", "JavaScript", "Git", "Linux"];
const EXTRACTED_SKILLS = ["Python", "React", "TensorFlow", "Node.js", "SQL", "Docker", "JavaScript", "TypeScript", "Git", "Linux"];

export default function InternshipMatching() {
    const [internships, setInternships] = useState(matchedInternships);
    const [search, setSearch] = useState("");
    const [minScore, setMinScore] = useState("all");
    const [expanded, setExpanded] = useState<string | null>(null);
    const [userSkills, setUserSkills] = useState(INITIAL_SKILLS);

    // Resume Process State
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [hasScanned, setHasScanned] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const { playScan, playSync, playSuccess } = useSound();

    // Application Modal State
    const [selectedJob, setSelectedJob] = useState<MatchedInternship | null>(null);
    const [isApplyOpen, setIsApplyOpen] = useState(false);
    const [appStep, setAppStep] = useState<"review" | "sending" | "success">("review");
    const [coverLetter, setCoverLetter] = useState("");

    const openApply = (job: MatchedInternship) => {
        setSelectedJob(job);
        setAppStep("review");
        setCoverLetter(`I am writing to express my strong interest in the ${job.title} position at ${job.company}. Based on my skills in ${job.skills.slice(0, 2).join(" and ")}, I believe I would be a great fit.`);
        setIsApplyOpen(true);
    };

    const submitApplication = () => {
        setAppStep("sending");
        setTimeout(() => {
            setAppStep("success");
            playSuccess();
        }, 1500);
    };

    const filtered = internships.filter(i => {
        const ms = i.title.toLowerCase().includes(search.toLowerCase()) || i.company.toLowerCase().includes(search.toLowerCase());
        const scoreOk = minScore === "all" || i.matchScore >= parseInt(minScore);
        return ms && scoreOk;
    });

    const startScan = (file?: File) => {
        if (file) setFileName(file.name);
        setIsScanning(true);
        setScanProgress(0);

        let interval = setInterval(() => {
            setScanProgress(p => {
                if (p % 10 === 0) playScan();
                if (p >= 100) {
                    clearInterval(interval);
                    finishScan();
                    return 100;
                }
                return p + 2;
            });
        }, 50);
    };

    const finishScan = () => {
        setTimeout(() => {
            playSync();
            setIsScanning(false);
            setHasScanned(true);
            setUserSkills(EXTRACTED_SKILLS);
            // Staggered appearance of results
            setTimeout(() => {
                playSuccess();
                setShowResults(true);
            }, 500);
        }, 800);
    };

    const toggleSave = (id: string) => setInternships(prev => prev.map(i => i.id === id ? { ...i, saved: !i.saved } : i));

    return (
        <DashboardLayout>
            <div className="space-y-10 animate-fade-in pb-20">
                {/* Header Section */}
                <div className="relative overflow-hidden rounded-3xl p-8 bg-card/40 border border-white/5 shadow-2xl">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 via-accent/5 to-transparent pointer-events-none" />
                    <div className="absolute -top-24 -right-24 h-64 w-64 bg-primary/10 blur-[120px] rounded-full" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="space-y-4 text-center md:text-left">
                            <Badge variant="glow" className="px-4 py-1.5 uppercase font-bold tracking-widest text-[10px]">
                                AI Intelligence v2.4
                            </Badge>
                            <h1 className="text-4xl lg:text-5xl font-extrabold font-display tracking-tight leading-tight">
                                Smart <span className="gradient-text">Matching</span> Engine
                            </h1>
                            <p className="text-muted-foreground text-lg max-w-xl">
                                Our neural engine analyzes your resume and finds the top 1% of opportunities that fit your unique skill set.
                            </p>
                        </div>

                        {!hasScanned && !isScanning ? (
                            <div
                                className={cn(
                                    "flex-1 max-w-md w-full aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-8 transition-all duration-500 cursor-pointer group relative overflow-hidden",
                                    isDragging ? "border-primary bg-primary/5 scale-105 shadow-2xl" : "border-white/10 bg-white/5 hover:border-primary/50 hover:bg-white/10 shadow-xl"
                                )}
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={(e) => { e.preventDefault(); setIsDragging(false); startScan(e.dataTransfer.files[0]); }}
                                onClick={() => document.getElementById('resume-upload')?.click()}
                            >
                                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent group-hover:via-primary transition-all duration-700" />
                                <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-4 transition-transform group-hover:scale-110 group-hover:rotate-6">
                                    <FileUp className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold font-display group-hover:text-primary transition-colors">Neural Resume Sync</h3>
                                <p className="text-muted-foreground text-sm mt-1">Drag your PDF or click to parse</p>
                                <input id="resume-upload" type="file" className="hidden" onChange={(e) => e.target.files?.[0] && startScan(e.target.files[0])} />
                            </div>
                        ) : isScanning ? (
                            <div className="flex-1 max-w-md w-full aspect-video rounded-2xl bg-card border border-white/10 p-8 flex flex-col items-center justify-center space-y-6 relative overflow-hidden group shadow-2xl">
                                {/* Radar Scanning Effect */}
                                <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300%] h-[300%] bg-gradient-to-b from-primary/50 to-transparent animate-spin [animation-duration:3000ms] pointer-events-none" />
                                    <div className="h-full w-full bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.1)_0%,transparent_70%)]" />
                                </div>

                                <div className="relative z-10 flex flex-col items-center gap-4 w-full">
                                    <div className="h-20 w-20 rounded-full border-2 border-primary border-t-transparent animate-spin flex items-center justify-center">
                                        <Scan className="h-8 w-8 text-primary animate-pulse" />
                                    </div>
                                    <div className="text-center space-y-1">
                                        <h3 className="text-lg font-bold font-display uppercase tracking-widest text-primary animate-pulse">Extracting Intelligence</h3>
                                        <p className="text-[10px] text-muted-foreground font-mono flex items-center justify-center gap-2">
                                            <span className="h-1 w-1 rounded-full bg-primary animate-ping" />
                                            Analyzing: {fileName || "resume_payload.pdf"}
                                        </p>
                                    </div>
                                    <div className="w-full max-w-xs space-y-2">
                                        <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                                            <span>Vectorizing Data</span>
                                            <span>{scanProgress}%</span>
                                        </div>
                                        <Progress value={scanProgress} className="h-1 bg-white/5" />
                                    </div>

                                    {/* Mock Extraction Stream */}
                                    <div className="h-10 overflow-hidden flex flex-wrap gap-1 justify-center opacity-50">
                                        {EXTRACTED_SKILLS.slice(0, Math.floor(scanProgress / 10)).map(s => (
                                            <span key={s} className="text-[8px] font-mono text-primary/80 animate-fade-in">{s}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 max-w-md w-full p-6 space-y-6 rounded-2xl bg-primary/10 border border-primary/20 shadow-2xl animate-fade-in relative group overflow-hidden">
                                <div className="absolute -top-10 -left-10 h-32 w-32 bg-primary/10 blur-[40px] rounded-full" />
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="h-12 w-12 rounded-xl bg-success/20 flex items-center justify-center text-success">
                                            <CheckCircle2 className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold font-display leading-none">Sync Complete</h3>
                                            <p className="text-xs text-muted-foreground mt-1">Profile successfully vectorized</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Primary Core Competencies</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {userSkills.map(s => (
                                                    <Badge key={s} variant="glow" className="text-[10px] px-2 h-6 border-white/5 bg-white/5 text-primary">
                                                        {s}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5 backdrop-blur-md">
                                            <div className="flex items-center gap-2">
                                                <Target className="h-4 w-4 text-accent" />
                                                <span className="text-sm font-bold">Matching Accuracy</span>
                                            </div>
                                            <span className="text-lg font-extrabold text-accent">98.4%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Dashboard Stats */}
                {showResults && (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 animate-fade-in-up">
                        {[
                            { label: "Optimal Matches", v: internships.length, i: Target, c: "text-primary", bg: "bg-primary/10" },
                            { label: "Elite Tier (90%+)", v: internships.filter(i => i.matchScore >= 90).length, i: Zap, c: "text-amber-400", bg: "bg-amber-400/10" },
                            { label: "Saved Vault", v: internships.filter(i => i.saved).length, i: BookmarkPlus, c: "text-success", bg: "bg-success/10" },
                            { label: "Matching Average", v: Math.round(internships.reduce((a, i) => a + i.matchScore, 0) / internships.length) + "%", i: TrendingUp, c: "text-accent", bg: "bg-accent/10" }
                        ].map(s => (
                            <Card key={s.label} variant="glow" className="group">
                                <CardContent className="p-5 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{s.label}</p>
                                        <p className="text-3xl font-extrabold font-display group-hover:gradient-text transition-all duration-300">{s.v}</p>
                                    </div>
                                    <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", s.bg)}>
                                        <s.i className={cn("h-5 w-5", s.c)} />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Main Content Area */}
                {showResults && (
                    <div className="space-y-6 animate-fade-in">
                        {/* Control Bar */}
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between pb-4 border-b border-white/5">
                            <div className="flex gap-4 items-center w-full md:w-auto">
                                <div className="relative w-full md:w-80 group">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                    <Input
                                        placeholder="Search roles or companies..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        className="pl-9 bg-white/5 border-white/5 focus:border-primary/50 h-10"
                                    />
                                </div>
                                <Select value={minScore} onValueChange={setMinScore}>
                                    <SelectTrigger className="w-44 bg-white/5 border-white/5 h-10"><SelectValue placeholder="Neural Score" /></SelectTrigger>
                                    <SelectContent className="glass-card-strong border-white/10">
                                        <SelectItem value="all">All Ecosystems</SelectItem>
                                        <SelectItem value="90">Elite (90%+)</SelectItem>
                                        <SelectItem value="80">Priority (80%+)</SelectItem>
                                        <SelectItem value="70">Growth (70%+)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button variant="ghost" className="text-xs gap-2 hover:bg-white/5 h-10 border border-white/5">
                                <Brain className="h-4 w-4 text-primary" /> Tune Matching vX
                            </Button>
                        </div>

                        {/* Results Grid */}
                        <div className="grid gap-6">
                            {filtered.map((intern, idx) => (
                                <Card
                                    key={intern.id}
                                    variant="glass"
                                    className="group transition-all duration-500 hover:ring-1 hover:ring-primary/20 hover:shadow-2xl hover:shadow-primary/5 border-white/5 animate-fade-in-up"
                                    style={{ animationDelay: `${idx * 150}ms`, animationFillMode: 'forwards' }}
                                >
                                    <CardContent className="p-0 overflow-hidden">
                                        <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-white/5">
                                            {/* Left Column: Score & Branding */}
                                            <div className="w-full md:w-64 p-6 flex flex-col items-center justify-center space-y-4 bg-white/2 relative">
                                                <div className="absolute inset-0 bg-primary/2 pointer-events-none group-hover:bg-primary/5 transition-colors" />
                                                <div className="relative h-24 w-24 rounded-full border border-white/10 flex items-center justify-center p-3">
                                                    <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin opacity-40 group-hover:opacity-100 [animation-duration:2000ms]" />
                                                    <div className="text-center">
                                                        <span className="block text-3xl font-extrabold font-display leading-none text-white group-hover:text-primary transition-colors">{intern.matchScore}%</span>
                                                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Match Score</span>
                                                    </div>
                                                </div>
                                                <div className="text-center relative z-10">
                                                    <h3 className="font-bold font-display text-lg leading-tight group-hover:gradient-text transition-all duration-300">{intern.company}</h3>
                                                    <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                                                        <MapPin className="h-3 w-3" /> {intern.location}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Middle Column: Details */}
                                            <div className="flex-1 p-6 space-y-6">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="space-y-1">
                                                        <h2 className="text-2xl font-extrabold tracking-tight font-display">{intern.title}</h2>
                                                        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground font-bold uppercase tracking-wider">
                                                            <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {intern.duration}</span>
                                                            <span className="flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5" /> {intern.type}</span>
                                                            <span className="text-success flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 fill-current" /> {intern.stipend}</span>
                                                        </div>
                                                    </div>
                                                    <Button variant="ghost" size="icon" className={cn("rounded-full border border-white/5", intern.saved && "text-amber-400 bg-amber-400/10 border-amber-400/20")} onClick={() => toggleSave(intern.id)}>
                                                        <BookmarkPlus className={cn("h-4 w-4", intern.saved && "fill-current")} />
                                                    </Button>
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex flex-wrap gap-2">
                                                        {intern.skills.map(s => (
                                                            <Badge
                                                                key={s}
                                                                variant={userSkills.includes(s) ? "glow" : "outline"}
                                                                className={cn(
                                                                    "text-[10px] uppercase font-bold px-2.5 py-1 transition-all",
                                                                    userSkills.includes(s) ? "bg-primary/20 border-primary/30" : "border-white/5 opacity-60"
                                                                )}
                                                            >
                                                                {s} {userSkills.includes(s) && "✓"}
                                                            </Badge>
                                                        ))}
                                                    </div>

                                                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-3">
                                                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                                                            <Info className="h-3 w-3" /> Neural Match Rationale
                                                        </p>
                                                        <div className="grid gap-2">
                                                            {intern.matchReasons.map((r, i) => (
                                                                <div key={i} className="flex items-start gap-2.5 text-xs text-muted-foreground group/reason">
                                                                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 group-hover/reason:scale-150 transition-transform" />
                                                                    <span>{r}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Column: Actions */}
                                            <div className="w-full md:w-56 p-6 flex flex-col justify-between bg-primary/5">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Neural Expiration</p>
                                                    <p className="text-sm font-bold">{intern.deadline}</p>
                                                </div>
                                                <div className="space-y-3 pt-6 md:pt-0">
                                                    <Button variant="outline" className="w-full text-xs font-bold uppercase tracking-widest h-10 border-white/10 hover:bg-white/5 group">
                                                        <ThumbsDown className="mr-2 h-3 w-3" /> Archive
                                                    </Button>
                                                    <Button variant="gradient" className="w-full text-xs font-bold uppercase tracking-widest h-10 shadow-lg shadow-primary/20 group" onClick={() => openApply(intern)}>
                                                        Deploy Application <ArrowUpRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!showResults && !isScanning && (
                    <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
                        <div className="h-24 w-24 rounded-full bg-white/5 flex items-center justify-center animate-pulse">
                            <Brain className="h-12 w-12 text-muted-foreground opacity-20" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-muted-foreground">Waiting for Neural Input</h2>
                            <p className="text-muted-foreground max-w-sm mx-auto">Upload your resume to activate the AI matching engine and discover exclusive opportunities.</p>
                        </div>
                    </div>
                )}
                {/* Application Modal */}
                <Dialog open={isApplyOpen} onOpenChange={setIsApplyOpen}>
                    <DialogContent className="sm:max-w-lg glass-card border-white/10 backdrop-blur-xl">
                        {appStep === "review" && selectedJob && (
                            <>
                                <DialogHeader>
                                    <DialogTitle className="flex items-center gap-3 text-xl font-display font-bold">
                                        <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                                            <Briefcase className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            Apply to {selectedJob.company}
                                            <span className="block text-xs font-normal text-muted-foreground uppercase tracking-widest mt-1">
                                                {selectedJob.title}
                                            </span>
                                        </div>
                                    </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Neural Match Score</span>
                                            <span className="font-bold text-primary">{selectedJob.matchScore}%</span>
                                        </div>
                                        <Progress value={selectedJob.matchScore} className="h-1.5" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Cover Letter / Note</label>
                                        <Textarea
                                            value={coverLetter}
                                            onChange={(e) => setCoverLetter(e.target.value)}
                                            className="h-32 bg-black/20 border-white/10 focus:border-primary/50 text-sm resize-none"
                                            placeholder="Why are you the best fit?"
                                        />
                                    </div>

                                    <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10 text-xs text-primary/80">
                                        <Info className="h-4 w-4 shrink-0" />
                                        Your resume v2.4 (PDF) will be attached automatically.
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="ghost" onClick={() => setIsApplyOpen(false)}>Cancel</Button>
                                    <Button variant="gradient" onClick={submitApplication} className="w-full sm:w-auto">
                                        Submit Application <Send className="ml-2 h-4 w-4" />
                                    </Button>
                                </DialogFooter>
                            </>
                        )}

                        {appStep === "sending" && (
                            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                                <div className="relative">
                                    <div className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Send className="h-6 w-6 text-primary animate-pulse" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">Sending Application...</h3>
                                    <p className="text-sm text-muted-foreground">Encrypting and delivering credentials</p>
                                </div>
                            </div>
                        )}

                        {appStep === "success" && (
                            <div className="py-8 flex flex-col items-center justify-center text-center space-y-4 animate-fade-in">
                                <div className="h-20 w-20 rounded-full bg-success/20 flex items-center justify-center mb-2">
                                    <CheckCircle2 className="h-10 w-10 text-success" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-bold font-display text-success">Application Sent!</h3>
                                    <p className="text-muted-foreground">Good luck! You can track this in the Applications tab.</p>
                                </div>
                                <Button onClick={() => setIsApplyOpen(false)} className="mt-4 min-w-[120px]">
                                    Done
                                </Button>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
}
