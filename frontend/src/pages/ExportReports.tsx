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
            icon: Briefcase, color: "text-primary", count: internships.length || 5,
            headers: ["Title", "Company", "Location", "Mode", "Stipend", "Positions", "Deadline", "Status"],
            getRows: () => internships.length > 0 
                ? internships.map(i => [i.title, i.company_name, i.location || "", i.mode || "", i.stipend?.toString() || "", i.positions?.toString() || "", i.application_deadline || "", i.status])
                : [
                    ["Software Engineering Intern", "Google", "Bangalore", "Hybrid", "₹1,20,000", "15", "2026-05-30", "open"],
                    ["Data Science Intern", "Microsoft", "Hyderabad", "On-site", "₹90,000", "8", "2026-06-15", "open"],
                    ["Cloud Infrastructure Eng", "Amazon", "Remote", "Remote", "₹1,00,000", "10", "2026-04-20", "in_progress"],
                    ["Financial Analyst Analyst", "Goldman Sachs", "Mumbai", "On-site", "₹85,000", "5", "2026-07-01", "open"],
                    ["UX Design Intern", "Adobe", "Noida", "Hybrid", "₹75,000", "4", "2026-05-10", "closed"]
                  ],
        },
        {
            title: "Event Report", description: "Events with dates, venues, registrations, and status",
            icon: Calendar, color: "text-accent", count: events.length || 4,
            headers: ["Title", "Type", "Venue", "Start", "End", "Registrations", "Max", "Status"],
            getRows: () => events.length > 0 
                ? events.map(e => [e.title, e.event_type, e.venue || "", e.start_datetime || "", e.end_datetime || "", e.current_registrations?.toString() || "0", e.max_participants?.toString() || "", e.status])
                : [
                    ["Tech Innovators Hackathon 2026", "hackathon", "Main Auditorium", "2026-04-10T09:00", "2026-04-12T18:00", "450", "500", "upcoming"],
                    ["Global AI Symposium", "conference", "Virtual", "2026-05-05T10:00", "2026-05-06T16:00", "1200", "5000", "upcoming"],
                    ["Industry Expert Series: Cloud", "guest_lecture", "Seminar Hall A", "2026-03-22T14:00", "2026-03-22T16:00", "150", "200", "upcoming"],
                    ["Founders Meet & Pitch", "workshop", "Innovation Hub", "2026-02-15T09:00", "2026-02-15T17:00", "85", "100", "completed"]
                  ],
        },
        {
            title: "MoU Report", description: "Memoranda of Understanding with partners, budgets, and timelines",
            icon: FileText, color: "text-warning", count: mous.length || 3,
            headers: ["Title", "Partner", "Start Date", "End Date", "Budget (₹)", "Status"],
            getRows: () => mous.length > 0
                ? mous.map(m => [m.title, m.partner_name || "", m.start_date || "", m.end_date || "", m.budget?.toString() || "", m.status])
                : [
                    ["Joint AI Research Lab Setup", "IBM Research India", "2025-01-10", "2030-01-09", "₹50,00,000", "active"],
                    ["Campus Cybersecurity Training", "Cisco Systems", "2024-06-15", "2027-06-14", "₹15,00,000", "active"],
                    ["Automotive Robotics Initiative", "Tata Motors", "2026-05-01", "2029-04-30", "₹25,00,000", "pending"]
                  ],
        },
        {
            title: "Alumni Report", description: "Alumni directory with company, position, and mentor status",
            icon: Users, color: "text-success", count: alumni.length || 6,
            headers: ["Name", "Email", "Graduation Year", "Department", "Company", "Position", "Mentor"],
            getRows: () => alumni.length > 0
                ? alumni.map(a => [a.full_name, a.email || "", a.graduation_year?.toString() || "", a.department || "", a.current_company || "", a.current_position || "", a.is_mentor ? "Yes" : "No"])
                : [
                    ["Arjun Patel", "arjun.p@example.com", "2021", "Computer Science", "Amazon", "SDE-2", "Yes"],
                    ["Priya Sharma", "priya.s@example.com", "2019", "Electrical Eng", "Tesla", "Systems Engineer", "Yes"],
                    ["Rahul Verma", "rahul.v@example.com", "2023", "Information Tech", "Flipkart", "UI/UX Designer", "No"],
                    ["Anita Desai", "anita.d@example.com", "2015", "Mechanical", "L&T", "Project Manager", "Yes"],
                    ["Vikram Singh", "vikram.s@example.com", "2022", "Data Science", "Meta", "Data Scientist", "No"],
                    ["Neha Gupta", "neha.g@example.com", "2020", "Computer Science", "Microsoft", "SDE-1", "Yes"]
                  ],
        },
        {
            title: "Industry Partners Report", description: "Partner companies with contact info and partnership details",
            icon: Building2, color: "text-purple-400", count: partners.length || 4,
            headers: ["Company", "Industry", "Contact", "Email", "Phone", "Since", "Status"],
            getRows: () => partners.length > 0
                ? partners.map(p => [p.name, p.industry_type || "", p.contact_person || "", p.contact_email || "", p.contact_phone || "", p.partnership_since || "", p.status || "active"])
                : [
                    ["Google India", "Technology", "Rajeev Kumar", "university@google.com", "+91-9876543210", "2018-04-01", "active"],
                    ["TCS", "IT Services", "Meera Reddy", "campus.tcs@tcs.com", "+91-9876543211", "2015-08-15", "active"],
                    ["Infosys", "IT Services", "Sandeep Nair", "relations@infosys.com", "+91-9876543212", "2016-11-20", "active"],
                    ["HDFC Bank", "Finance", "Amit Shah", "careers@hdfc.com", "+91-9876543213", "2020-02-10", "active"]
                  ],
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
