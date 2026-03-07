import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Download, FileSpreadsheet, FileText, Briefcase, Calendar,
    Users, Building2, FileCheck, Loader2
} from "lucide-react";
import { useInternships } from "@/hooks/useInternships";
import { useEvents } from "@/hooks/useEvents";
import { useMoUs } from "@/hooks/useMoUs";
import { useAlumni } from "@/hooks/useAlumni";
import { useIndustryPartners } from "@/hooks/useIndustryPartners";


function downloadCSV(filename: string, headers: string[], rows: string[][]) {
    const csv = [headers.join(","), ...rows.map(r => r.map(c => `"${(c || "").replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
}

function printReport(title: string, headers: string[], rows: string[][]) {
    const win = window.open("", "_blank");
    if (!win) return;
    const tableRows = rows.map(r => `<tr>${r.map(c => `<td style="padding:8px;border:1px solid #e2e8f0;font-size:13px">${c || "-"}</td>`).join("")}</tr>`).join("");
    win.document.write(`<!DOCTYPE html><html><head><title>${title}</title><style>
    body{font-family:'Segoe UI',sans-serif;padding:40px;color:#1a1a2e}
    h1{font-size:22px;margin-bottom:4px;color:#0f172a} .meta{color:#64748b;font-size:13px;margin-bottom:20px}
    table{border-collapse:collapse;width:100%} th{background:#6366f1;color:white;padding:10px;text-align:left;font-size:13px}
    tr:nth-child(even){background:#f8fafc} @media print{body{padding:20px}}
  </style></head><body>
    <h1>${title}</h1><p class="meta">Generated on ${new Date().toLocaleDateString()} | Institutional Collaboration Portal</p>
    <table><thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>${tableRows}</tbody></table>
  </body></html>`);
    win.document.close();
    win.print();
}

interface ReportCard {
    title: string; description: string; icon: React.ElementType; color: string;
    count: number; headers: string[]; getRows: () => string[][];
}

export default function ExportReports() {
    const { internships } = useInternships();
    const { events } = useEvents();
    const { mous } = useMoUs();
    const { alumni } = useAlumni();
    const { partners } = useIndustryPartners();
    const [downloading, setDownloading] = useState<string | null>(null);

    const reports: ReportCard[] = [
        {
            title: "Internship Report", description: "All internship listings with status, stipend, and application details",
            icon: Briefcase, color: "text-primary", count: internships.length,
            headers: ["Title", "Company", "Location", "Mode", "Stipend", "Positions", "Deadline", "Status"],
            getRows: () => internships.map(i => [i.title, i.company_name, i.location || "", i.mode || "", i.stipend?.toString() || "", i.positions?.toString() || "", i.application_deadline || "", i.status]),
        },
        {
            title: "Event Report", description: "Events with dates, venues, registrations, and status",
            icon: Calendar, color: "text-accent", count: events.length,
            headers: ["Title", "Type", "Venue", "Start", "End", "Registrations", "Max", "Status"],
            getRows: () => events.map(e => [e.title, e.event_type, e.venue || "", e.start_datetime || "", e.end_datetime || "", e.current_registrations?.toString() || "0", e.max_participants?.toString() || "", e.status]),
        },
        {
            title: "MoU Report", description: "Memoranda of Understanding with partners, budgets, and timelines",
            icon: FileText, color: "text-warning", count: mous.length,
            headers: ["Title", "Partner", "Start Date", "End Date", "Budget (₹)", "Status"],
            getRows: () => mous.map(m => [m.title, m.partner_name || "", m.start_date || "", m.end_date || "", m.budget?.toString() || "", m.status]),
        },
        {
            title: "Alumni Report", description: "Alumni directory with company, position, and mentor status",
            icon: Users, color: "text-success", count: alumni.length,
            headers: ["Name", "Email", "Graduation Year", "Department", "Company", "Position", "Mentor"],
            getRows: () => alumni.map(a => [a.full_name, a.email || "", a.graduation_year?.toString() || "", a.department || "", a.current_company || "", a.current_position || "", a.is_mentor ? "Yes" : "No"]),
        },
        {
            title: "Industry Partners Report", description: "Partner companies with contact info and partnership details",
            icon: Building2, color: "text-purple-400", count: partners.length,
            headers: ["Company", "Industry", "Contact", "Email", "Phone", "Since", "Status"],
            getRows: () => partners.map(p => [p.name, p.industry_type || "", p.contact_person || "", p.contact_email || "", p.contact_phone || "", p.partnership_since || "", p.status || "active"]),
        },
    ];

    const handleCSV = (report: ReportCard) => {
        setDownloading(report.title + "-csv");
        setTimeout(() => {
            downloadCSV(`${report.title.replace(/ /g, "_").toLowerCase()}.csv`, report.headers, report.getRows());
            setDownloading(null);
        }, 500);
    };

    const handlePDF = (report: ReportCard) => {
        setDownloading(report.title + "-pdf");
        setTimeout(() => {
            printReport(report.title, report.headers, report.getRows());
            setDownloading(null);
        }, 500);
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold font-display">
                        Export <span className="gradient-text">Reports</span>
                    </h1>
                    <p className="text-muted-foreground">Download data reports as CSV or PDF for offline use</p>
                </div>

                {/* Summary Stats */}
                <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
                    {reports.map(r => (
                        <Card key={r.title} variant="glass">
                            <CardContent className="p-4 text-center">
                                <r.icon className={`h-6 w-6 mx-auto mb-2 ${r.color}`} />
                                <div className="text-2xl font-bold">{r.count}</div>
                                <div className="text-xs text-muted-foreground">{r.title.replace(" Report", "s")}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Report Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {reports.map(report => (
                        <Card key={report.title} variant="glass" className="flex flex-col">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <report.icon className={`h-5 w-5 ${report.color}`} />
                                    {report.title}
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">{report.description}</p>
                            </CardHeader>
                            <CardContent className="mt-auto">
                                <div className="flex items-center justify-between mb-4">
                                    <Badge variant="secondary">{report.count} records</Badge>
                                    <Badge variant="outline">{report.headers.length} columns</Badge>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => handleCSV(report)}
                                        disabled={downloading === report.title + "-csv" || report.count === 0}
                                    >
                                        {downloading === report.title + "-csv" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileSpreadsheet className="mr-2 h-4 w-4" />}
                                        CSV
                                    </Button>
                                    <Button
                                        variant="gradient"
                                        className="flex-1"
                                        onClick={() => handlePDF(report)}
                                        disabled={downloading === report.title + "-pdf" || report.count === 0}
                                    >
                                        {downloading === report.title + "-pdf" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileCheck className="mr-2 h-4 w-4" />}
                                        PDF
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
