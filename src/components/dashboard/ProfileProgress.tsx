import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
    User, FileText, Code, GraduationCap, Briefcase, Linkedin, Image, CheckCircle2, Circle, Upload, Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUserRole } from "@/hooks/useUserRole";

interface ProfileItem {
    key: string;
    label: string;
    icon: React.ElementType;
}

const profileItems: ProfileItem[] = [
    { key: "avatar", label: "Upload Profile Photo", icon: Image },
    { key: "bio", label: "Add Professional Bio", icon: User },
    { key: "skills", label: "Add at Least 3 Skills", icon: Code },
    { key: "education", label: "Add Education Details", icon: GraduationCap },
    { key: "experience", label: "Add Work Experience", icon: Briefcase },
    { key: "resume", label: "Upload Resume (PDF)", icon: FileText },
    { key: "linkedin", label: "Connect LinkedIn Profile", icon: Linkedin },
];

// Simulate most items already completed for a realistic look
const defaultCompleted = ["avatar", "bio", "skills", "education", "experience"];

export function ProfileProgress() {
    const [completed, setCompleted] = useState<string[]>(() => {
        try {
            const saved = localStorage.getItem("profile_progress");
            return saved ? JSON.parse(saved) : defaultCompleted;
        } catch { return defaultCompleted; }
    });
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    const { user } = useUserRole();

    useEffect(() => {
        localStorage.setItem("profile_progress", JSON.stringify(completed));
    }, [completed]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        if (file.type !== "application/pdf") {
            toast({ title: "Invalid File", description: "Please upload a PDF file.", variant: "destructive" });
            return;
        }

        try {
            setUploading(true);
            const fileName = `${user.id}/${Date.now()}_resume.pdf`;

            const { error } = await supabase.storage
                .from("resumes")
                .upload(fileName, file);

            if (error) throw error;

            toast({ title: "Resume Uploaded!", description: "Your resume has been securely stored." });
            setCompleted(prev => {
                const newCompleted = [...prev, "resume"];
                // Ensure unique
                return Array.from(new Set(newCompleted));
            });

        } catch (error: any) {
            console.error("Upload failed", error);
            toast({ title: "Upload Failed", description: error.message, variant: "destructive" });
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const toggle = (key: string) => {
        if (key === "resume") {
            if (completed.includes("resume")) {
                // If already uploaded, maybe allow re-upload? Or just toggle off?
                // Let's just trigger upload for now to update it
                fileInputRef.current?.click();
            } else {
                fileInputRef.current?.click();
            }
            return;
        }

        setCompleted(prev =>
            prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
        );
    };

    const percent = Math.round((completed.length / profileItems.length) * 100);

    return (
        <Card variant="glass" className="md:col-span-2">
            <CardContent className="pt-6">
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="application/pdf"
                    onChange={handleFileChange}
                />

                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-1">Profile Completion</h3>
                        <p className="text-sm text-muted-foreground">
                            {completed.length}/{profileItems.length} steps done — {percent < 100 ? "keep going!" : "🎉 All complete!"}
                        </p>
                    </div>
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative">
                        <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
                            <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none" stroke="hsl(217, 33%, 17%)" strokeWidth="3"
                            />
                            <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none" stroke="hsl(262, 83%, 58%)" strokeWidth="3"
                                strokeDasharray={`${percent}, 100`}
                                strokeLinecap="round"
                                className="transition-all duration-700"
                            />
                        </svg>
                        <span className="absolute text-base font-bold">{percent}%</span>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {profileItems.map(item => {
                        const done = completed.includes(item.key);
                        const isResume = item.key === "resume";
                        return (
                            <button
                                key={item.key}
                                onClick={() => toggle(item.key)}
                                disabled={isResume && uploading}
                                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 text-left text-xs group
                                    ${done ? "bg-success/5 text-success border border-success/10" : "bg-white/5 hover:bg-white/10 text-muted-foreground border border-white/5"}
                                `}
                            >
                                <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-colors
                                    ${done ? "bg-success/10 text-success" : "bg-white/5 text-muted-foreground group-hover:text-primary"}
                                `}>
                                    {isResume && uploading ? <Loader2 className="h-4 w-4 animate-spin" /> :
                                        <item.icon className="h-4 w-4" />
                                    }
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className={`block truncate font-bold ${done ? "line-through opacity-70" : ""}`}>{item.label}</span>
                                    {done && <span className="text-[8px] font-black uppercase tracking-widest opacity-60">Verified</span>}
                                </div>
                                {done && <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />}
                            </button>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
