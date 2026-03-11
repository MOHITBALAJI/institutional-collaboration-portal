import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Pencil, Eraser, Download, Trash2, Users,
    Share2, ShieldCheck, Zap, Activity, MousePointer2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSound } from "@/hooks/useSound";
import { cn } from "@/lib/utils";

interface Presence {
    id: string;
    name: string;
    x: number;
    y: number;
    color: string;
}

export const NeuralCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [tool, setTool] = useState<'pencil' | 'eraser'>('pencil');
    const [presences, setPresences] = useState<Presence[]>([
        { id: '1', name: 'Dr. Sarah (Mentor)', x: 100, y: 100, color: '#00f2ff' },
        { id: '2', name: 'Alex K. (Industry)', x: 400, y: 300, color: '#7000ff' }
    ]);
    const { playClick, playSuccess } = useSound();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.strokeStyle = '#00f2ff';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';

        // Background grid for that holographic feel
        const drawGrid = () => {
            ctx.strokeStyle = 'rgba(0, 242, 255, 0.05)';
            ctx.lineWidth = 1;
            for (let i = 0; i < canvas.width; i += 30) {
                ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
            }
        };
        drawGrid();

        // Simulate moving cursors
        const interval = setInterval(() => {
            setPresences(prev => prev.map(p => ({
                ...p,
                x: p.x + (Math.random() - 0.5) * 10,
                y: p.y + (Math.random() - 0.5) * 10
            })));
        }, 100);

        return () => clearInterval(interval);
    }, []);

    const startDrawing = (e: React.MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
    };

    const draw = (e: React.MouseEvent) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.strokeStyle = tool === 'pencil' ? '#00f2ff' : '#000';
        ctx.lineWidth = tool === 'pencil' ? 2 : 20;
        ctx.globalCompositeOperation = tool === 'pencil' ? 'source-over' : 'destination-out';

        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => setIsDrawing(false);

    const clearCanvas = () => {
        playClick();
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Redraw grid
        ctx.strokeStyle = 'rgba(0, 242, 255, 0.05)';
        ctx.lineWidth = 1;
        ctx.globalCompositeOperation = 'source-over';
        for (let i = 0; i < canvas.width; i += 30) {
            ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
        }
    };

    return (
        <Card variant="glass" className="bg-black/40 border-primary/20 overflow-hidden relative">
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 bg-white/5">
                <div className="space-y-1">
                    <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                        <Share2 className="h-4 w-4 text-primary" /> Strategic Neural Canvas
                    </CardTitle>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-60">Real-time Multi-Entity Uplink</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex -space-x-2 mr-4">
                        {presences.map(p => (
                            <div key={p.id} className="h-6 w-6 rounded-full border-2 border-black flex items-center justify-center text-[8px] font-black uppercase" style={{ backgroundColor: p.color }}>
                                {p.name[0]}
                            </div>
                        ))}
                        <div className="h-6 w-6 rounded-full bg-white/10 border-2 border-black flex items-center justify-center text-[10px] font-bold">+1</div>
                    </div>
                    <Badge className="bg-success/20 text-success border-success/30 text-[8px] font-black uppercase tracking-widest">Live Sync Ready</Badge>
                </div>
            </CardHeader>
            <CardContent className="p-0 relative bg-[radial-gradient(circle_at_center,rgba(0,242,255,0.05),transparent)]">
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                    <Button
                        variant={tool === 'pencil' ? "gradient" : "outline"}
                        size="icon"
                        className="h-10 w-10 rounded-xl"
                        onClick={() => { playClick(); setTool('pencil'); }}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={tool === 'eraser' ? "gradient" : "outline"}
                        size="icon"
                        className="h-10 w-10 rounded-xl"
                        onClick={() => { playClick(); setTool('eraser'); }}
                    >
                        <Eraser className="h-4 w-4" />
                    </Button>
                    <div className="h-[1px] bg-white/10 my-2" />
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl text-destructive hover:bg-destructive/10" onClick={clearCanvas}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>

                <div className="absolute bottom-4 right-4 z-10 flex gap-2">
                    <Button variant="outline" className="rounded-xl text-[10px] font-black uppercase tracking-widest h-10 border-white/10 bg-black/40">
                        <Download className="mr-2 h-3.5 w-3.5" /> Export Artifact
                    </Button>
                    <Button variant="gradient" className="rounded-xl text-[10px] font-black uppercase tracking-widest h-10 shadow-xl shadow-primary/20">
                        <Users className="mr-2 h-3.5 w-3.5" /> Invite Operative
                    </Button>
                </div>

                <div className="relative cursor-crosshair">
                    <canvas
                        ref={canvasRef}
                        width={1200}
                        height={600}
                        className="w-full h-[500px]"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                    />

                    {/* Cursor Presence Overlay */}
                    <AnimatePresence>
                        {presences.map(p => (
                            <motion.div
                                key={p.id}
                                className="absolute pointer-events-none flex flex-col items-start gap-1 z-20"
                                animate={{ left: p.x, top: p.y }}
                                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            >
                                <MousePointer2 className="h-4 w-4" style={{ color: p.color, fill: p.color }} />
                                <div className="bg-black/80 border border-white/10 rounded px-2 py-0.5 whitespace-nowrap">
                                    <span className="text-[8px] font-black uppercase tracking-widest" style={{ color: p.color }}>{p.name}</span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>


                </div>

                <div className="absolute bottom-4 left-4 flex gap-4 pointer-events-none">
                    <div className="flex items-center gap-2">
                        <Activity className="h-3 w-3 text-primary animate-pulse" />
                        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground">Neural Uplink Protocol Active</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-3 w-3 text-success" />
                        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground">Encrypted Data Stream</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
