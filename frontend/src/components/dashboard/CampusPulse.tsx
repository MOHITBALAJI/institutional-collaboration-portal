import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, BrainCircuit, Zap, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { motion } from "framer-motion";
import { getMockPulseData, analyzeSentiment } from "@/lib/SentimentEngine";
import { cn } from "@/lib/utils";

export function CampusPulse() {
    const pulseData = useMemo(() => getMockPulseData(), []);

    const averageSentiment = pulseData.reduce((acc, curr) => acc + curr.sentiment, 0) / pulseData.length;
    const peakVolume = Math.max(...pulseData.map(d => d.volume));

    const sentimentStatus = useMemo(() => {
        if (averageSentiment > 0.2) return { label: 'Otimistic', color: 'text-success', icon: TrendingUp };
        if (averageSentiment < -0.2) return { label: 'Under Pressure', color: 'text-destructive', icon: TrendingDown };
        return { label: 'Stable', color: 'text-primary', icon: Minus };
    }, [averageSentiment]);

    return (
        <Card variant="glass" className="bg-black/40 border-primary/20 relative overflow-hidden group">
            {/* Background Grid Accent */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--primary-rgb),0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--primary-rgb),0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

            <CardHeader className="flex flex-row items-center justify-between relative z-10">
                <div className="space-y-1">
                    <CardTitle className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2">
                        <BrainCircuit className="h-4 w-4 text-primary animate-pulse" />
                        Strategic Sentiment AI
                    </CardTitle>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Neural Campus Pulse Feed</p>
                </div>
                <Badge variant="outline" className={cn("border-current text-[10px] font-black uppercase px-2 py-0.5", sentimentStatus.color)}>
                    <sentimentStatus.icon className="h-3 w-3 mr-1" />
                    {sentimentStatus.label}
                </Badge>
            </CardHeader>

            <CardContent className="relative z-10">
                <div className="h-32 flex items-end gap-1 px-2">
                    {pulseData.map((d, i) => {
                        const height = (d.volume / peakVolume) * 100;
                        const opacity = Math.abs(d.sentiment) + 0.1;
                        const color = d.sentiment > 0.1
                            ? "bg-success"
                            : d.sentiment < -0.1
                                ? "bg-destructive"
                                : "bg-primary";

                        return (
                            <motion.div
                                key={i}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: `${height}%`, opacity: 1 }}
                                transition={{ delay: i * 0.02, duration: 0.5 }}
                                className={cn("flex-1 rounded-t-sm relative group/bar", color)}
                                style={{ opacity }}
                            >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black border border-white/10 rounded px-2 py-0.5 text-[8px] font-black opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-20">
                                    {d.hour}:00 • Sent: {(d.sentiment * 100).toFixed(0)}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "Neural Sync", value: "98.4%", icon: Zap, color: "text-primary" },
                        { label: "Engagement Hub", value: "High", icon: Activity, color: "text-success" },
                        { label: "Anomalies", value: "None", icon: BrainCircuit, color: "text-accent" },
                        { label: "Peak Activity", value: "2:00 PM", icon: Activity, color: "text-warning" }
                    ].map((stat, i) => (
                        <div key={i} className="bg-white/5 border border-white/5 rounded-xl p-3 flex flex-col gap-1 transition-transform hover:scale-[1.05]">
                            <div className="flex items-center justify-between">
                                <span className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">{stat.label}</span>
                                <stat.icon className={cn("h-3 w-3", stat.color)} />
                            </div>
                            <span className="text-sm font-black uppercase tracking-tight">{stat.value}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-success" /> Positive
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary" /> Neutral
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-destructive" /> Strained
                        </div>
                    </div>
                    <span className="opacity-40 animate-pulse">Scanning live streams...</span>
                </div>
            </CardContent>
        </Card>
    );
}
