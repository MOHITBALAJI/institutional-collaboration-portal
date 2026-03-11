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
        const names = ["Mohit", "Naresh", "Monish", "Lohith"];
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
