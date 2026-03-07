import { useState, useRef } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Upload, FileSpreadsheet, CheckCircle2, AlertTriangle, XCircle, Users,
    Download, Eye, RotateCcw, FileText, Briefcase, Calendar,
    Database, Cpu, Zap, Activity, ShieldCheck, Box
} from "lucide-react";
import { useSound } from "@/hooks/useSound";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type ImportTarget = "students" | "faculty" | "events" | "internships" | "alumni";

interface ImportResult {
    row: number; name: string; email: string; status: "success" | "error" | "duplicate"; message: string;
}

const templates: Record<ImportTarget, { label: string; icon: typeof Users; columns: string[]; sample: string[][] }> = {
    students: { label: "Students", icon: Users, columns: ["Name", "Email", "Roll No", "Department", "Year", "Phone"], sample: [["Rahul Sharma", "rahul@college.edu", "CSE2022001", "CSE", "3", "9876543210"], ["Ananya Gupta", "ananya@college.edu", "CSE2022002", "CSE", "3", "9876543211"]] },
    faculty: { label: "Faculty", icon: Users, columns: ["Name", "Email", "Department", "Designation", "Specialization", "Phone"], sample: [["Dr. Iyer", "iyer@college.edu", "CSE", "Professor", "AI/ML", "9876543220"]] },
    events: { label: "Events", icon: Calendar, columns: ["Title", "Date", "Location", "Type", "Capacity", "Department"], sample: [["AI Workshop", "2026-03-15", "Main Auditorium", "Workshop", "100", "CSE"]] },
    internships: { label: "Internships", icon: Briefcase, columns: ["Company", "Role", "Location", "Stipend", "Duration", "Deadline"], sample: [["Google", "SWE Intern", "Bangalore", "₹80,000/mo", "6 months", "2026-04-01"]] },
    alumni: { label: "Alumni", icon: Users, columns: ["Name", "Email", "Grad Year", "Department", "Company", "Role", "Location"], sample: [["Arun P", "arun@gmail.com", "2020", "CSE", "Google", "SWE", "Bangalore"]] },
};

export default function BulkImport() {
    const { playClick, playSuccess, playScan, playError } = useSound();
    const [target, setTarget] = useState<ImportTarget>("students");
    const [file, setFile] = useState<File | null>(null);
    const [importing, setImporting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [results, setResults] = useState<ImportResult[] | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const tmpl = templates[target];

    const downloadTemplate = () => {
        playClick();
        const csv = [tmpl.columns.join(","), ...tmpl.sample.map(r => r.join(","))].join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
        a.download = `${target}_import_template.csv`; a.click();
    };

    const handleImport = () => {
        if (!file) return;
        playScan();
        setImporting(true); setProgress(0); setResults(null);

        // Simulate CSV parsing/import
        const mockResults: ImportResult[] = [
            { row: 1, name: "Rahul Sharma", email: "rahul@college.edu", status: "success", message: "Imported successfully" },
            { row: 2, name: "Ananya Gupta", email: "ananya@college.edu", status: "success", message: "Imported successfully" },
            { row: 3, name: "Vikram Mehta", email: "vikram@college.edu", status: "success", message: "Imported successfully" },
            { row: 4, name: "Priya K", email: "priya@college.edu", status: "duplicate", message: "Email already exists in database" },
            { row: 5, name: "", email: "invalid-email", status: "error", message: "Invalid email format" },
            { row: 6, name: "Arjun Das", email: "arjun@college.edu", status: "success", message: "Imported successfully" },
            { row: 7, name: "Sneha Reddy", email: "sneha@college.edu", status: "success", message: "Imported successfully" },
            { row: 8, name: "Karthik N", email: "karthik@college.edu", status: "success", message: "Imported successfully" },
        ];

        let p = 0;
        const timer = setInterval(() => {
            p += 12;
            setProgress(Math.min(p, 100));
            if (p >= 100) {
                clearInterval(timer);
                setImporting(false);
                setResults(mockResults);
                playSuccess();
            }
        }, 200);
    };

    const reset = () => { setFile(null); setResults(null); setProgress(0); if (fileRef.current) fileRef.current.value = ""; };

    const successCount = results?.filter(r => r.status === "success").length || 0;
    const errorCount = results?.filter(r => r.status === "error").length || 0;
    const dupCount = results?.filter(r => r.status === "duplicate").length || 0;

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold font-display">Bulk <span className="gradient-text">Import</span></h1>
                    <p className="text-muted-foreground">Upload CSV files to bulk-import records into the system</p>
                </div>

                {/* Step 1: Select Target */}
                <Card variant="glass" className="bg-black/40 border-primary/20 relative overflow-hidden">
                    {/* Background grid */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--primary-rgb),0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--primary-rgb),0.05)_1px,transparent_1px)] bg-[size:30px_30px] opacity-20" />

                    <CardHeader className="relative z-10">
                        <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                            <Database className="h-4 w-4 text-primary" /> 01: Data Target Selection
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="grid gap-4 sm:grid-cols-5">
                            {(Object.entries(templates) as [ImportTarget, typeof tmpl][]).map(([key, t]) => (
                                <button
                                    key={key}
                                    onClick={() => { playClick(); setTarget(key); reset(); }}
                                    className={cn(
                                        "relative group p-6 rounded-2xl border transition-all duration-500 text-center overflow-hidden",
                                        target === key
                                            ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)]"
                                            : "border-white/5 bg-white/5 hover:border-primary/50 hover:bg-primary/5"
                                    )}
                                >
                                    {target === key && (
                                        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-aurora-drift" />
                                    )}
                                    <t.icon className={cn("h-8 w-8 mx-auto mb-3 transition-transform group-hover:scale-110", target === key ? "text-primary" : "text-muted-foreground opacity-50")} />
                                    <span className={cn("text-[10px] font-black uppercase tracking-widest block", target === key ? "text-primary" : "text-muted-foreground")}>{t.label}</span>
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Step 2: Download Template & Upload */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <Card variant="glass" className="bg-black/40 border-primary/20 group">
                        <CardHeader>
                            <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                <Cpu className="h-4 w-4 text-primary" /> 02: Structural Template
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest opacity-60">Synchronize your records with the system schema:</p>
                            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-2">
                                    <Zap className="h-3 w-3 text-primary animate-pulse" />
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {tmpl.columns.map(c => (
                                        <Badge key={c} variant="outline" className="text-[9px] font-black uppercase tracking-tighter border-primary/20 bg-primary/5 text-primary">
                                            {c}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            <Button variant="outline" onClick={downloadTemplate} className="w-full rounded-xl border-white/10 bg-white/5 font-black uppercase tracking-widest text-[10px] h-12 hover:bg-white/10 transition-all">
                                <Download className="mr-2 h-4 w-4" /> Download Sequence
                            </Button>
                        </CardContent>
                    </Card>

                    <Card variant="glass" className="bg-black/40 border-primary/20 relative overflow-hidden group">
                        <CardHeader>
                            <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                <Activity className="h-4 w-4 text-primary" /> 03: Injection Protocol
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 relative z-10">
                            <div
                                className={cn(
                                    "relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-500 overflow-hidden",
                                    file
                                        ? "border-primary bg-primary/10"
                                        : "border-white/10 bg-white/5 hover:border-primary/50 hover:bg-primary/5"
                                )}
                                onClick={() => fileRef.current?.click()}
                            >
                                {importing && (
                                    <div className="absolute inset-0 pointer-events-none">
                                        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent animate-scan" />
                                    </div>
                                )}
                                <Upload className={cn("h-10 w-10 mx-auto mb-4 transition-transform group-hover:scale-110", file ? "text-primary" : "text-muted-foreground opacity-50")} />
                                <div className="space-y-1">
                                    <p className="text-sm font-black uppercase tracking-tight">{file ? file.name : "Inject Data Stream"}</p>
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest opacity-60">CSV Sequence • Max 10MB</p>
                                </div>
                            </div>
                            <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={e => { playScan(); setFile(e.target.files?.[0] || null); }} />

                            {importing && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Sequence Injected: {progress}%</span>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground animate-pulse">Syncing...</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            className="h-full bg-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.6)]"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-4">
                                <Button
                                    variant="gradient"
                                    onClick={handleImport}
                                    disabled={!file || importing}
                                    className="flex-1 rounded-xl font-black uppercase tracking-widest text-[10px] h-12 shadow-xl shadow-primary/20"
                                >
                                    <FileSpreadsheet className="mr-2 h-4 w-4" /> Start Injection
                                </Button>
                                {results && (
                                    <Button variant="outline" onClick={() => { playClick(); reset(); }} className="rounded-xl border-white/10 bg-white/5 font-black uppercase tracking-widest text-[10px] h-12">
                                        <RotateCcw className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Results */}
                <AnimatePresence>
                    {results && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <Card variant="glass" className="bg-black/40 border-primary/20 relative overflow-hidden">
                                <CardHeader className="border-b border-white/5 bg-white/5">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                            <ShieldCheck className="h-4 w-4 text-primary" /> Injection Manifest
                                        </CardTitle>
                                        <div className="flex gap-4">
                                            <div className="flex items-center gap-2">
                                                <div className="h-1 w-1 rounded-full bg-success shadow-[0_0_5px_rgba(var(--success-rgb),0.5)]" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-success">{successCount} OK</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="h-1 w-1 rounded-full bg-warning" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-warning">{dupCount} DUP</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="h-1 w-1 rounded-full bg-destructive" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-destructive">{errorCount} ERR</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <Table>
                                        <TableHeader className="bg-white/5">
                                            <TableRow className="hover:bg-transparent border-white/5">
                                                <TableHead className="w-16 text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-6">Line</TableHead>
                                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Entity</TableHead>
                                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Address</TableHead>
                                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</TableHead>
                                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pr-6">Diagnostics</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {results.map(r => (
                                                <TableRow key={r.row} className="border-white/5 hover:bg-white/5 transition-colors group">
                                                    <TableCell className="font-mono text-[10px] text-muted-foreground pl-6">{r.row.toString().padStart(3, '0')}</TableCell>
                                                    <TableCell className="font-black text-sm uppercase tracking-tight">{r.name || "—"}</TableCell>
                                                    <TableCell className="text-[10px] font-bold text-muted-foreground uppercase opacity-60 tracking-tighter">{r.email}</TableCell>
                                                    <TableCell>
                                                        {r.status === "success" && (
                                                            <div className="flex items-center gap-2 text-success">
                                                                <CheckCircle2 className="h-3 w-3" />
                                                                <span className="text-[10px] font-black uppercase tracking-widest">Injected</span>
                                                            </div>
                                                        )}
                                                        {r.status === "duplicate" && (
                                                            <div className="flex items-center gap-2 text-warning">
                                                                <AlertTriangle className="h-3 w-3" />
                                                                <span className="text-[10px] font-black uppercase tracking-widest">Duplicate</span>
                                                            </div>
                                                        )}
                                                        {r.status === "error" && (
                                                            <div className="flex items-center gap-2 text-destructive">
                                                                <XCircle className="h-3 w-3" />
                                                                <span className="text-[10px] font-black uppercase tracking-widest">Rejected</span>
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-[10px] font-medium text-muted-foreground pr-6 italic group-hover:text-white transition-colors">
                                                        {r.message}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                                <div className="p-4 bg-white/5 border-t border-white/5 text-center">
                                    <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-40">End of Manifest • Protocol Version 4.0.1</p>
                                </div>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </DashboardLayout>
    );
}
