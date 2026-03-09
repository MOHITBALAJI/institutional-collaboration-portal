import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
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
        <Card variant="glass" className="border-primary/10 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
            <CardContent className="pt-6 relative z-10">
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="application/pdf"
                    onChange={handleFileChange}
                />

                <div className="flex items-center justify-between mb-4">
                    <div className="text-left">
                        <h3 className="text-sm font-black font-display uppercase tracking-widest">Profile Completion</h3>
                        <p className="text-[10px] text-muted-foreground mt-1">
                            {completed.length}/{profileItems.length} steps done — keep going!
                        </p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center relative shrink-0">
                        <svg viewBox="0 0 36 36" className="h-10 w-10 -rotate-90">
                            <circle
                                cx="18" cy="18" r="16"
                                fill="none" stroke="currentColor" strokeWidth="3"
                                className="text-white/5"
                            />
                            <motion.circle
                                cx="18" cy="18" r="16"
                                fill="none" stroke="currentColor" strokeWidth="3"
                                strokeDasharray="100"
                                initial={{ strokeDashoffset: 100 }}
                                animate={{ strokeDashoffset: 100 - percent }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                strokeLinecap="round"
                                className="text-primary transition-all duration-700"
                            />
                        </svg>
                        <span className="absolute text-[10px] font-black">{percent}%</span>
                    </div>
                </div>

                <div className="space-y-2">
                    {profileItems.map(item => {
                        const done = completed.includes(item.key);
                        const isResume = item.key === "resume";
                        return (
                            <button
                                key={item.key}
                                onClick={() => toggle(item.key)}
                                disabled={isResume && uploading}
                                className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all duration-300 text-left group border
                                    ${done
                                        ? "bg-primary/5 text-primary/80 border-primary/20"
                                        : "bg-white/5 hover:bg-white/10 text-muted-foreground border-white/5 hover:border-white/10"
                                    }
                                `}
                            >
                                <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-colors
                                    ${done ? "bg-primary/10 text-primary" : "bg-white/5 text-muted-foreground group-hover:text-primary"}
                                `}>
                                    {isResume && uploading ? <Loader2 className="h-4 w-4 animate-spin" /> :
                                        <item.icon className="h-4 w-4" />
                                    }
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className={`block truncate text-[10px] font-bold uppercase tracking-tight ${done ? "opacity-60" : ""}`}>{item.label}</span>
                                </div>
                                {done && <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary" />}
                            </button>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
