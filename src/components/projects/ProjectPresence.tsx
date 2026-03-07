import React, { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Cursor {
    id: string; x: number; y: number; name: string; color: string;
}

export const ProjectPresence: React.FC = () => {
    const [cursors, setCursors] = useState<Cursor[]>([]);

    useEffect(() => {
        // Simulated real-time presence
        const names = ["Ananya", "Rahul", "Sarah", "Kevin"];
        const colors = ["bg-blue-500", "bg-purple-500", "bg-emerald-500", "bg-amber-500"];

        const initialCursors = names.slice(0, 3).map((name, i) => ({
            id: String(i),
            name,
            color: colors[i],
            x: Math.random() * 80 + 10,
            y: Math.random() * 80 + 10
        }));

        setCursors(initialCursors);

        const interval = setInterval(() => {
            setCursors(prev => prev.map(c => ({
                ...c,
                x: Math.max(0, Math.min(100, c.x + (Math.random() - 0.5) * 5)),
                y: Math.max(0, Math.min(100, c.y + (Math.random() - 0.5) * 5)),
            })));
        }, 100);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {cursors.map(c => (
                <div
                    key={c.id}
                    className="absolute transition-all duration-300 ease-out"
                    style={{ left: `${c.x}%`, top: `${c.y}%` }}
                >
                    <div className="relative">
                        <User className={cn("h-4 w-4 text-white drop-shadow-lg", c.color.replace('bg-', 'text-'))} fill="currentColor" />
                        <div className={cn("absolute left-4 top-0 px-2 py-0.5 rounded-full text-[10px] font-bold text-white whitespace-nowrap shadow-xl", c.color)}>
                            {c.name}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export const HuddleBubble: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed bottom-24 right-8 z-[60] animate-in slide-in-from-right-10 duration-500">
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-[2rem] blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                <div className="relative bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-4 shadow-2xl w-80">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                            <span className="text-xs font-black uppercase tracking-widest">Active Huddle (3)</span>
                        </div>
                        <button onClick={onClose} className="text-muted-foreground hover:text-white transition-colors">
                            <span className="text-xl">×</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="aspect-video rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/40 text-[8px] font-bold uppercase">Rahul (You)</div>
                            <User className="h-8 w-8 text-primary/40" />
                        </div>
                        <div className="aspect-video rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/40 text-[8px] font-bold uppercase">Ananya</div>
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=225&fit=crop')] bg-cover opacity-60" />
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-4">
                        <button className="h-10 w-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors">
                            <Mic className="h-4 w-4" />
                        </button>
                        <button className="h-10 w-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors">
                            <Video className="h-4 w-4" />
                        </button>
                        <button onClick={onClose} className="h-10 px-6 rounded-full bg-destructive text-white text-xs font-bold uppercase tracking-widest hover:bg-destructive/80 transition-colors">
                            Leave
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

import { Mic, Video } from 'lucide-react';
