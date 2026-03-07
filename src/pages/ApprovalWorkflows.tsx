import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
    CheckCircle2, Clock, XCircle, AlertTriangle, FileText, Users, Calendar,
    Search, Eye, MessageSquare, ChevronRight, Building,
} from "lucide-react";

interface ApprovalItem {
    id: string; type: "mou" | "event" | "internship" | "budget"; title: string;
    requestedBy: string; requestedDate: string; description: string;
    priority: "low" | "medium" | "high" | "urgent"; status: "pending" | "approved" | "rejected" | "revision";
    comments: { author: string; text: string; date: string }[];
}

const approvals: ApprovalItem[] = [
    { id: "ap1", type: "mou", title: "MoU with TCS for Student Training Program", requestedBy: "Prof. Suresh Kumar", requestedDate: "2026-02-15", description: "Establish a 3-year MoU with TCS covering student training, guest lectures, and internship placements. Estimated value: ₹25 Lakhs.", priority: "high", status: "pending", comments: [{ author: "Dean Academics", text: "Please share the draft MoU document.", date: "2026-02-16" }] },
    { id: "ap2", type: "event", title: "National Level Hackathon 2026", requestedBy: "Dr. Sneha Iyer", requestedDate: "2026-02-14", description: "3-day national hackathon with 500 participants. Budget: ₹5 Lakhs for prizes, infrastructure, and food. Venue: Main Auditorium.", priority: "high", status: "pending", comments: [] },
    { id: "ap3", type: "internship", title: "Samsung R&D Internship Tie-up", requestedBy: "Prof. Rajesh Nair", requestedDate: "2026-02-12", description: "Partner with Samsung R&D for 20 summer internship slots. Areas: Hardware, IoT, AI. Stipend: ₹40K/month.", priority: "medium", status: "pending", comments: [{ author: "Placement Officer", text: "Samsung has confirmed 20 slots. Awaiting admin approval.", date: "2026-02-13" }] },
    { id: "ap4", type: "budget", title: "Lab Equipment Upgrade — AI Research Lab", requestedBy: "Dr. Priya Krishnan", requestedDate: "2026-02-10", description: "Procure 4x NVIDIA A100 GPUs (₹12L each), 2x workstations (₹3L each). Total: ₹54 Lakhs from TEQIP-III funds.", priority: "urgent", status: "pending", comments: [{ author: "Finance Dept", text: "TEQIP-III funds available: ₹60L. Procurement needs 3 quotes.", date: "2026-02-11" }] },
    { id: "ap5", type: "event", title: "Alumni Meet 2026", requestedBy: "Prof. Anand Verma", requestedDate: "2026-02-08", description: "Annual alumni reunion with keynote speakers, panel discussions, and networking dinner. Expected attendance: 300. Budget: ₹3 Lakhs.", priority: "low", status: "approved", comments: [{ author: "Dr. Iyer", text: "Approved. Please coordinate with facilities team.", date: "2026-02-09" }] },
    { id: "ap6", type: "mou", title: "Infosys Campus Connect Extension", requestedBy: "Prof. Suresh Kumar", requestedDate: "2026-02-05", description: "Extend existing Infosys Campus Connect MoU for 2 more years with additional certification programs.", priority: "medium", status: "approved", comments: [{ author: "Dr. Iyer", text: "Approved. Send final draft for signature.", date: "2026-02-07" }] },
    { id: "ap7", type: "budget", title: "Library Subscription — IEEE Xplore", requestedBy: "Librarian", requestedDate: "2026-02-01", description: "Renew IEEE Xplore institutional subscription. Annual cost: ₹8 Lakhs. Essential for research publications.", priority: "high", status: "rejected", comments: [{ author: "Finance Dept", text: "Budget allocated to other priorities this quarter. Resubmit in Q3.", date: "2026-02-03" }] },
];

const typeIcons: Record<string, typeof FileText> = { mou: FileText, event: Calendar, internship: Building, budget: AlertTriangle };
const prioStyle: Record<string, { bg: string; text: string }> = { low: { bg: "bg-muted/30", text: "text-muted-foreground" }, medium: { bg: "bg-primary/20", text: "text-primary" }, high: { bg: "bg-warning/20", text: "text-warning" }, urgent: { bg: "bg-destructive/20", text: "text-destructive" } };
const statusStyle: Record<string, { bg: string; text: string; icon: typeof CheckCircle2 }> = { pending: { bg: "bg-warning/20", text: "text-warning", icon: Clock }, approved: { bg: "bg-success/20", text: "text-success", icon: CheckCircle2 }, rejected: { bg: "bg-destructive/20", text: "text-destructive", icon: XCircle }, revision: { bg: "bg-accent/20", text: "text-accent", icon: MessageSquare } };

export default function ApprovalWorkflows() {
    const [items, setItems] = useState(approvals);
    const [search, setSearch] = useState("");
    const [statusF, setStatusF] = useState("all");
    const [selected, setSelected] = useState<ApprovalItem | null>(null);
    const [comment, setComment] = useState("");

    const filtered = items.filter(i => {
        const ms = i.title.toLowerCase().includes(search.toLowerCase()) || i.requestedBy.toLowerCase().includes(search.toLowerCase());
        return ms && (statusF === "all" || i.status === statusF);
    });

    const updateStatus = (id: string, status: ApprovalItem["status"]) => {
        setItems(prev => prev.map(i => i.id === id ? { ...i, status, comments: [...i.comments, { author: "You (Admin)", text: `Status changed to ${status}`, date: new Date().toISOString().slice(0, 10) }] } : i));
        setSelected(prev => prev?.id === id ? { ...prev, status } : prev);
    };

    const addComment = () => {
        if (!comment.trim() || !selected) return;
        const c = { author: "You (Admin)", text: comment, date: new Date().toISOString().slice(0, 10) };
        setItems(prev => prev.map(i => i.id === selected.id ? { ...i, comments: [...i.comments, c] } : i));
        setSelected(prev => prev ? { ...prev, comments: [...prev.comments, c] } : prev);
        setComment("");
    };

    const pending = items.filter(i => i.status === "pending").length;

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold font-display">Approval <span className="gradient-text">Workflows</span></h1>
                    <p className="text-muted-foreground">Review and approve pending requests from departments</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-4">
                    {[{ l: "Pending", v: pending, i: Clock, c: "text-warning" }, { l: "Approved", v: items.filter(i => i.status === "approved").length, i: CheckCircle2, c: "text-success" }, { l: "Rejected", v: items.filter(i => i.status === "rejected").length, i: XCircle, c: "text-destructive" }, { l: "Total", v: items.length, i: FileText, c: "text-primary" }].map(s => (
                        <Card key={s.l} variant="glow"><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">{s.l}</p><p className="text-2xl font-bold">{s.v}</p></div><s.i className={`h-6 w-6 ${s.c}`} /></div></CardContent></Card>
                    ))}
                </div>

                <div className="flex gap-2">
                    <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search requests..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /></div>
                    <Select value={statusF} onValueChange={setStatusF}><SelectTrigger className="w-36"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="approved">Approved</SelectItem><SelectItem value="rejected">Rejected</SelectItem></SelectContent></Select>
                </div>

                <div className="space-y-3">
                    {filtered.map(item => {
                        const TypeIcon = typeIcons[item.type] || FileText;
                        const ss = statusStyle[item.status];
                        const StatusIcon = ss.icon;
                        return (
                            <Card key={item.id} variant="glass" className={item.status === "pending" ? "border-warning/20" : "transition-all"}>
                                <CardContent className="p-5">
                                    <div className="flex items-start gap-4">
                                        <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center shrink-0"><TypeIcon className="h-5 w-5 text-primary" /></div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <h3 className="font-semibold">{item.title}</h3>
                                                    <p className="text-xs text-muted-foreground mt-0.5">Requested by <strong>{item.requestedBy}</strong> on {item.requestedDate}</p>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <Badge className={`${prioStyle[item.priority].bg} ${prioStyle[item.priority].text} text-[10px] capitalize`}>{item.priority}</Badge>
                                                    <Badge className={`${ss.bg} ${ss.text} text-[10px] capitalize gap-1`}><StatusIcon className="h-3 w-3" />{item.status}</Badge>
                                                </div>
                                            </div>
                                            <p className="text-sm mt-2 line-clamp-2">{item.description}</p>
                                            <div className="flex items-center gap-3 mt-3">
                                                {item.comments.length > 0 && <span className="text-xs text-muted-foreground flex items-center gap-1"><MessageSquare className="h-3 w-3" />{item.comments.length} comment{item.comments.length > 1 ? "s" : ""}</span>}
                                                <Button variant="ghost" size="sm" className="text-xs ml-auto" onClick={() => setSelected(item)}><Eye className="h-3 w-3 mr-1" />Review<ChevronRight className="h-3 w-3 ml-1" /></Button>
                                                {item.status === "pending" && <>
                                                    <Button variant="default" size="sm" className="text-xs bg-success hover:bg-success/90" onClick={() => updateStatus(item.id, "approved")}><CheckCircle2 className="h-3 w-3 mr-1" />Approve</Button>
                                                    <Button variant="destructive" size="sm" className="text-xs" onClick={() => updateStatus(item.id, "rejected")}><XCircle className="h-3 w-3 mr-1" />Reject</Button>
                                                </>}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Detail Dialog */}
                <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
                    <DialogContent className="max-w-lg max-h-[80vh] overflow-auto">
                        {selected && (<>
                            <DialogHeader><DialogTitle>{selected.title}</DialogTitle><DialogDescription>{selected.requestedBy} • {selected.requestedDate}</DialogDescription></DialogHeader>
                            <div className="space-y-4 py-2">
                                <p className="text-sm">{selected.description}</p>
                                <div className="flex gap-2"><Badge className={`${prioStyle[selected.priority].bg} ${prioStyle[selected.priority].text} text-xs capitalize`}>{selected.priority} priority</Badge><Badge className={`${statusStyle[selected.status].bg} ${statusStyle[selected.status].text} text-xs capitalize`}>{selected.status}</Badge></div>
                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold">Comments ({selected.comments.length})</h4>
                                    {selected.comments.map((c, i) => (
                                        <div key={i} className="bg-secondary/30 rounded-lg p-3"><div className="flex justify-between text-xs text-muted-foreground mb-1"><span className="font-medium">{c.author}</span><span>{c.date}</span></div><p className="text-sm">{c.text}</p></div>
                                    ))}
                                    <div className="flex gap-2"><Input placeholder="Add a comment..." value={comment} onChange={e => setComment(e.target.value)} onKeyDown={e => e.key === "Enter" && addComment()} /><Button variant="outline" size="sm" onClick={addComment}>Send</Button></div>
                                </div>
                            </div>
                            {selected.status === "pending" && (
                                <DialogFooter><Button variant="destructive" onClick={() => { updateStatus(selected.id, "rejected"); setSelected(null); }}>Reject</Button><Button className="bg-success hover:bg-success/90" onClick={() => { updateStatus(selected.id, "approved"); setSelected(null); }}>Approve</Button></DialogFooter>
                            )}
                        </>)}
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
}
