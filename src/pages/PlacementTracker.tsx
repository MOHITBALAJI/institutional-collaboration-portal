import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell, Legend,
} from "recharts";
import {
    Trophy, TrendingUp, Users, Building, Search, Briefcase, GraduationCap,
    IndianRupee, ArrowUpRight, Filter, CheckCircle2,
} from "lucide-react";

interface Placement {
    id: string; name: string; department: string; company: string; role: string;
    package: string; packageNum: number; type: "on-campus" | "off-campus"; year: number; status: "placed" | "interning" | "ppo";
}

const placements: Placement[] = [
    { id: "pl1", name: "Arun Prakash", department: "CSE", company: "Google", role: "SWE", package: "₹45 LPA", packageNum: 45, type: "on-campus", year: 2026, status: "placed" },
    { id: "pl2", name: "Sneha Reddy", department: "CSE", company: "Microsoft", role: "PM Associate", package: "₹5 LPA", packageNum: 38, type: "on-campus", year: 2026, status: "placed" },
    { id: "pl3", name: "Vikram Mehta", department: "ECE", company: "Qualcomm", role: "Design Engineer", package: "₹28 LPA", packageNum: 28, type: "on-campus", year: 2026, status: "placed" },
    { id: "pl4", name: "Priya Krishnan", department: "CSE", company: "Amazon", role: "SDE-1", package: "₹42 LPA", packageNum: 42, type: "on-campus", year: 2026, status: "placed" },
    { id: "pl5", name: "Rahul Jain", department: "IT", company: "Goldman Sachs", role: "Quant Analyst", package: "₹52 LPA", packageNum: 52, type: "on-campus", year: 2026, status: "placed" },
    { id: "pl6", name: "Ananya Gupta", department: "CSE", company: "Flipkart", role: "SDE-1", package: "₹32 LPA", packageNum: 32, type: "on-campus", year: 2026, status: "placed" },
    { id: "pl7", name: "Karthik Nair", department: "ME", company: "Tata Motors", role: "Product Engineer", package: "₹12 LPA", packageNum: 12, type: "on-campus", year: 2026, status: "placed" },
    { id: "pl8", name: "Deepika Joshi", department: "CSE", company: "Razorpay", role: "Backend Intern → PPO", package: "₹28 LPA", packageNum: 28, type: "off-campus", year: 2026, status: "ppo" },
    { id: "pl9", name: "Arjun Das", department: "ECE", company: "Intel", role: "VLSI Intern", package: "₹55K/mo stipend", packageNum: 6.6, type: "on-campus", year: 2026, status: "interning" },
    { id: "pl10", name: "Meera Patel", department: "IT", company: "Atlassian", role: "SDE Intern", package: "₹60K/mo stipend", packageNum: 7.2, type: "on-campus", year: 2026, status: "interning" },
    { id: "pl11", name: "Tanvi Sharma", department: "CSE", company: "Adobe", role: "Research Intern", package: "₹80K/mo stipend", packageNum: 9.6, type: "off-campus", year: 2026, status: "interning" },
    { id: "pl12", name: "Rohan Singh", department: "CSE", company: "Netflix", role: "SWE", package: "₹65 LPA", packageNum: 65, type: "off-campus", year: 2026, status: "placed" },
];

const yearTrend = [
    { year: "2022", placed: 180, avgPkg: 8.5 }, { year: "2023", placed: 210, avgPkg: 10.2 },
    { year: "2024", placed: 245, avgPkg: 12.8 }, { year: "2025", placed: 268, avgPkg: 14.5 },
    { year: "2026", placed: placements.filter(p => p.status === "placed").length, avgPkg: Math.round(placements.filter(p => p.status === "placed" && p.packageNum > 10).reduce((a, p) => a + p.packageNum, 0) / placements.filter(p => p.status === "placed" && p.packageNum > 10).length) },
];

const deptData = [
    { name: "CSE", value: 6, color: "hsl(262,83%,58%)" }, { name: "ECE", value: 2, color: "hsl(187,85%,53%)" },
    { name: "IT", value: 2, color: "hsl(142,76%,36%)" }, { name: "ME", value: 1, color: "hsl(38,92%,50%)" },
    { name: "Others", value: 1, color: "hsl(0,84%,60%)" },
];

const statusBg: Record<string, { bg: string; text: string; label: string }> = {
    placed: { bg: "bg-success/20", text: "text-success", label: "Placed" },
    interning: { bg: "bg-warning/20", text: "text-warning", label: "Interning" },
    ppo: { bg: "bg-primary/20", text: "text-primary", label: "PPO" },
};

export default function PlacementTracker() {
    const [search, setSearch] = useState("");
    const [deptF, setDeptF] = useState("all");
    const [statusF, setStatusF] = useState("all");

    const depts = ["all", ...new Set(placements.map(p => p.department))];
    const filtered = placements.filter(p => {
        const ms = p.name.toLowerCase().includes(search.toLowerCase()) || p.company.toLowerCase().includes(search.toLowerCase());
        return ms && (deptF === "all" || p.department === deptF) && (statusF === "all" || p.status === statusF);
    });

    const placedCount = placements.filter(p => p.status === "placed").length;
    const highPkgs = placements.filter(p => p.packageNum >= 10);
    const avgPkg = highPkgs.length ? Math.round(highPkgs.reduce((a, p) => a + p.packageNum, 0) / highPkgs.length * 10) / 10 : 0;
    const maxPkg = Math.max(...placements.map(p => p.packageNum));

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold font-display">Placement <span className="gradient-text">Tracker</span></h1>
                        <p className="text-muted-foreground">Track campus placements, internships, and PPO conversions</p>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-4">
                    {[{ l: "Total Placed", v: placedCount, i: Trophy, c: "text-success" }, { l: "Avg Package", v: `₹${avgPkg} LPA`, i: IndianRupee, c: "text-primary" }, { l: "Highest Package", v: `₹${maxPkg} LPA`, i: ArrowUpRight, c: "text-warning" }, { l: "Companies", v: new Set(placements.map(p => p.company)).size, i: Building, c: "text-accent" }].map(s => (
                        <Card key={s.l} variant="glow"><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">{s.l}</p><p className="text-2xl font-bold">{s.v}</p></div><s.i className={`h-6 w-6 ${s.c}`} /></div></CardContent></Card>
                    ))}
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <Card variant="glass">
                        <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" />Placement Trend (5 Years)</CardTitle></CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={250}>
                                <AreaChart data={yearTrend}>
                                    <defs>
                                        <linearGradient id="placedGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(262,83%,58%)" stopOpacity={0.3} /><stop offset="95%" stopColor="hsl(262,83%,58%)" stopOpacity={0} /></linearGradient>
                                        <linearGradient id="pkgGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(187,85%,53%)" stopOpacity={0.3} /><stop offset="95%" stopColor="hsl(187,85%,53%)" stopOpacity={0} /></linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(217,33%,17%)" />
                                    <XAxis dataKey="year" stroke="hsl(215,20%,55%)" fontSize={12} />
                                    <YAxis stroke="hsl(215,20%,55%)" fontSize={12} />
                                    <Tooltip contentStyle={{ backgroundColor: "hsl(222,47%,8%)", border: "1px solid hsl(217,33%,17%)", borderRadius: "8px" }} />
                                    <Legend />
                                    <Area type="monotone" dataKey="placed" stroke="hsl(262,83%,58%)" fill="url(#placedGrad)" strokeWidth={2} name="Students Placed" dot={{ r: 4, fill: "hsl(262,83%,58%)" }} />
                                    <Area type="monotone" dataKey="avgPkg" stroke="hsl(187,85%,53%)" fill="url(#pkgGrad)" strokeWidth={2} name="Avg Pkg (LPA)" dot={{ r: 4, fill: "hsl(187,85%,53%)" }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <Card variant="glass">
                        <CardHeader><CardTitle>Department Distribution</CardTitle></CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={deptData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(217,33%,17%)" horizontal={false} />
                                    <XAxis type="number" stroke="hsl(215,20%,55%)" fontSize={11} />
                                    <YAxis type="category" dataKey="name" width={50} stroke="hsl(215,20%,55%)" fontSize={11} />
                                    <Tooltip contentStyle={{ backgroundColor: "hsl(222,47%,8%)", border: "1px solid hsl(217,33%,17%)", borderRadius: "8px" }} />
                                    <Bar dataKey="value" radius={[0, 6, 6, 0]}>{deptData.map((e, i) => <Cell key={i} fill={e.color} />)}</Bar>
                                </BarChart>
                            </ResponsiveContainer>
                            <div className="flex flex-wrap justify-center gap-3 mt-2">{deptData.map(d => <div key={d.name} className="flex items-center gap-1 text-xs"><div className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} /><span>{d.name} ({d.value})</span></div>)}</div>
                        </CardContent>
                    </Card>
                </div>


                <Card variant="glass">
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                            <CardTitle>Placement Records</CardTitle>
                            <div className="flex gap-2">
                                <div className="relative flex-1 sm:w-52"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /></div>
                                <Select value={deptF} onValueChange={setDeptF}><SelectTrigger className="w-28"><SelectValue /></SelectTrigger><SelectContent>{depts.map(d => <SelectItem key={d} value={d}>{d === "all" ? "All Dept" : d}</SelectItem>)}</SelectContent></Select>
                                <Select value={statusF} onValueChange={setStatusF}><SelectTrigger className="w-32"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="placed">Placed</SelectItem><SelectItem value="interning">Interning</SelectItem><SelectItem value="ppo">PPO</SelectItem></SelectContent></Select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Dept</TableHead><TableHead>Company</TableHead><TableHead>Role</TableHead><TableHead>Package</TableHead><TableHead>Type</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {filtered.map(p => (
                                    <TableRow key={p.id}>
                                        <TableCell className="font-medium">{p.name}</TableCell>
                                        <TableCell>{p.department}</TableCell>
                                        <TableCell className="font-medium">{p.company}</TableCell>
                                        <TableCell>{p.role}</TableCell>
                                        <TableCell className="text-success font-medium">{p.package}</TableCell>
                                        <TableCell><Badge variant="outline" className="text-[10px] capitalize">{p.type}</Badge></TableCell>
                                        <TableCell><Badge className={`${statusBg[p.status].bg} ${statusBg[p.status].text} text-[10px]`}>{statusBg[p.status].label}</Badge></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
