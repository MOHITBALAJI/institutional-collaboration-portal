import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    Shield, Search, Eye, Clock, User, FileText, Settings, AlertTriangle,
    LogIn, LogOut, Edit, Trash2, Plus, Download, ChevronLeft, ChevronRight,
} from "lucide-react";

interface AuditEntry {
    id: string; timestamp: string; user: string; role: string; action: string;
    resource: string; detail: string; ip: string; severity: "info" | "warning" | "critical";
}

const auditLogs: AuditEntry[] = [
    { id: "al1", timestamp: "2026-02-17 13:42:11", user: "Dr. Iyer", role: "admin", action: "UPDATE", resource: "MoU #MOU-2024-007", detail: "Changed status from 'Draft' to 'Active'", ip: "10.0.1.45", severity: "info" },
    { id: "al2", timestamp: "2026-02-17 13:38:05", user: "System", role: "system", action: "BACKUP", resource: "Database", detail: "Automated daily backup completed (2.3 GB)", ip: "10.0.0.1", severity: "info" },
    { id: "al3", timestamp: "2026-02-17 13:25:33", user: "Sneha Reddy", role: "faculty", action: "CREATE", resource: "Event", detail: "Created event 'AI/ML Workshop 2026' with 150 seat capacity", ip: "10.0.2.12", severity: "info" },
    { id: "al4", timestamp: "2026-02-17 13:15:22", user: "Dr. Iyer", role: "admin", action: "DELETE", resource: "User Account", detail: "Deleted inactive account: student_2021_045@college.edu", ip: "10.0.1.45", severity: "warning" },
    { id: "al5", timestamp: "2026-02-17 13:02:19", user: "Unknown", role: "—", action: "LOGIN_FAIL", resource: "Auth", detail: "Failed login attempt for admin@college.edu (wrong password, 3rd attempt)", ip: "203.45.67.89", severity: "critical" },
    { id: "al6", timestamp: "2026-02-17 12:55:44", user: "Rahul Sharma", role: "student", action: "DOWNLOAD", resource: "Resume", detail: "Generated and downloaded resume PDF", ip: "10.0.3.78", severity: "info" },
    { id: "al7", timestamp: "2026-02-17 12:41:08", user: "Dr. Iyer", role: "admin", action: "UPDATE", resource: "Settings", detail: "Updated email notification preferences", ip: "10.0.1.45", severity: "info" },
    { id: "al8", timestamp: "2026-02-17 12:30:55", user: "Arjun Das", role: "student", action: "REGISTER", resource: "Event #EVT-042", detail: "Registered for Web Dev Bootcamp", ip: "10.0.3.91", severity: "info" },
    { id: "al9", timestamp: "2026-02-17 12:15:33", user: "System", role: "system", action: "ALERT", resource: "Security", detail: "Rate limit triggered: 100+ requests/min from IP 203.45.67.89", ip: "10.0.0.1", severity: "critical" },
    { id: "al10", timestamp: "2026-02-17 11:58:12", user: "Prof. Kumar", role: "faculty", action: "EXPORT", resource: "Reports", detail: "Exported internship placement report (CSV, 245 records)", ip: "10.0.2.34", severity: "warning" },
    { id: "al11", timestamp: "2026-02-17 11:42:09", user: "Admin Bot", role: "system", action: "CLEANUP", resource: "Sessions", detail: "Cleared 34 expired user sessions", ip: "10.0.0.1", severity: "info" },
    { id: "al12", timestamp: "2026-02-17 11:30:00", user: "Vikram Mehta", role: "student", action: "UPDATE", resource: "Profile", detail: "Updated skills: added Docker, Kubernetes", ip: "10.0.3.55", severity: "info" },
];

const sevStyle: Record<string, { bg: string; text: string; icon: typeof Shield }> = {
    info: { bg: "bg-primary/20", text: "text-primary", icon: Eye },
    warning: { bg: "bg-warning/20", text: "text-warning", icon: AlertTriangle },
    critical: { bg: "bg-destructive/20", text: "text-destructive", icon: Shield },
};

const actionIcons: Record<string, typeof Shield> = { CREATE: Plus, UPDATE: Edit, DELETE: Trash2, LOGIN_FAIL: LogIn, DOWNLOAD: Download, REGISTER: FileText, BACKUP: Settings, EXPORT: Download, ALERT: AlertTriangle, CLEANUP: Settings };

export default function AuditLog() {
    const [search, setSearch] = useState("");
    const [sevF, setSevF] = useState("all");
    const [page, setPage] = useState(0);
    const perPage = 8;

    const filtered = auditLogs.filter(l => {
        const ms = l.user.toLowerCase().includes(search.toLowerCase()) || l.detail.toLowerCase().includes(search.toLowerCase()) || l.resource.toLowerCase().includes(search.toLowerCase());
        return ms && (sevF === "all" || l.severity === sevF);
    });

    const pages = Math.ceil(filtered.length / perPage);
    const paged = filtered.slice(page * perPage, (page + 1) * perPage);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold font-display">Audit <span className="gradient-text">Log</span></h1>
                    <p className="text-muted-foreground">Track all system activities and security events</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-4">
                    {[{ l: "Total Events", v: auditLogs.length, i: Eye, c: "text-primary" }, { l: "Warnings", v: auditLogs.filter(l => l.severity === "warning").length, i: AlertTriangle, c: "text-warning" }, { l: "Critical", v: auditLogs.filter(l => l.severity === "critical").length, i: Shield, c: "text-destructive" }, { l: "Unique Users", v: new Set(auditLogs.map(l => l.user)).size, i: User, c: "text-accent" }].map(s => (
                        <Card key={s.l} variant="glow"><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">{s.l}</p><p className="text-2xl font-bold">{s.v}</p></div><s.i className={`h-6 w-6 ${s.c}`} /></div></CardContent></Card>
                    ))}
                </div>

                <Card variant="glass">
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                            <CardTitle>Activity Log</CardTitle>
                            <div className="flex gap-2">
                                <div className="relative flex-1 sm:w-56"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search logs..." value={search} onChange={e => { setSearch(e.target.value); setPage(0); }} className="pl-9" /></div>
                                <Select value={sevF} onValueChange={v => { setSevF(v); setPage(0); }}><SelectTrigger className="w-36"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Severity</SelectItem><SelectItem value="info">Info</SelectItem><SelectItem value="warning">Warning</SelectItem><SelectItem value="critical">Critical</SelectItem></SelectContent></Select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader><TableRow><TableHead className="w-36">Time</TableHead><TableHead>User</TableHead><TableHead>Action</TableHead><TableHead>Resource</TableHead><TableHead className="hidden lg:table-cell">Detail</TableHead><TableHead className="hidden md:table-cell">IP</TableHead><TableHead>Level</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {paged.map(log => {
                                    const ActionIcon = actionIcons[log.action] || Eye;
                                    const sev = sevStyle[log.severity];
                                    return (
                                        <TableRow key={log.id}>
                                            <TableCell className="text-xs text-muted-foreground font-mono">{log.timestamp.split(" ")[1]}</TableCell>
                                            <TableCell><div className="flex items-center gap-2"><div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center"><User className="h-3 w-3" /></div><div><span className="text-sm font-medium">{log.user}</span><p className="text-[10px] text-muted-foreground capitalize">{log.role}</p></div></div></TableCell>
                                            <TableCell><Badge variant="outline" className="text-[10px] gap-1"><ActionIcon className="h-3 w-3" />{log.action}</Badge></TableCell>
                                            <TableCell className="text-sm">{log.resource}</TableCell>
                                            <TableCell className="hidden lg:table-cell text-xs text-muted-foreground max-w-[200px] truncate">{log.detail}</TableCell>
                                            <TableCell className="hidden md:table-cell text-xs font-mono text-muted-foreground">{log.ip}</TableCell>
                                            <TableCell><Badge className={`${sev.bg} ${sev.text} text-[10px] capitalize`}>{log.severity}</Badge></TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                        {pages > 1 && (
                            <div className="flex items-center justify-between mt-4">
                                <span className="text-xs text-muted-foreground">Page {page + 1} of {pages}</span>
                                <div className="flex gap-1">
                                    <Button variant="outline" size="icon" className="h-7 w-7" disabled={page === 0} onClick={() => setPage(page - 1)}><ChevronLeft className="h-3 w-3" /></Button>
                                    <Button variant="outline" size="icon" className="h-7 w-7" disabled={page >= pages - 1} onClick={() => setPage(page + 1)}><ChevronRight className="h-3 w-3" /></Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
