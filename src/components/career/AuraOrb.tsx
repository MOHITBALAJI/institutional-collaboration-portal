import React, { useEffect, useRef, useState } from 'react';
import { useSound } from '@/hooks/useSound';
import { Mic, MicOff, Volume2, Sparkles, Brain, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AuraOrbProps {
    onTranscript?: (text: string) => void;
    isListening?: boolean;
}

export const AuraOrb: React.FC<AuraOrbProps> = ({ onTranscript, isListening: externalIsListening }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isListening, setIsListening] = useState(false);
    const { playScan, playSync } = useSound();

    // Synthetic Speech State
    const [isSpeaking, setIsSpeaking] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];

        class Particle {
            x: number; y: number; r: number; color: string; speed: number; angle: number;
            constructor() {
                this.x = canvas!.width / 2;
                this.y = canvas!.height / 2;
                this.r = Math.random() * 2 + 1;
                this.color = `hsla(${262 + Math.random() * 20}, 83%, 58%, ${Math.random()})`;
                this.speed = Math.random() * 2 + 0.5;
                this.angle = Math.random() * Math.PI * 2;
            }
            update() {
                const factor = isListening ? 3 : isSpeaking ? 2 : 1;
                this.x += Math.cos(this.angle) * this.speed * factor;
                this.y += Math.sin(this.angle) * this.speed * factor;
                this.r *= 0.98;
            }
            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        const render = (time: number) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw Central Core
            const pulse = Math.sin(time / 500) * 10 + 50;
            const gradient = ctx.createRadialGradient(
                canvas.width / 2, canvas.height / 2, 10,
                canvas.width / 2, canvas.height / 2, pulse + (isListening ? 40 : 20)
            );

            const themeColor = isListening ? '187, 85%, 53%' : '262, 83%, 58%';
            gradient.addColorStop(0, `hsla(${themeColor}, 0.8)`);
            gradient.addColorStop(0.5, `hsla(${themeColor}, 0.2)`);
            gradient.addColorStop(1, 'transparent');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height / 2, pulse + (isListening ? 40 : 20), 0, Math.PI * 2);
            ctx.fill();

            // Particles
            if (Math.random() > 0.5) particles.push(new Particle());
            particles = particles.filter(p => p.r > 0.1);
            particles.forEach(p => { p.update(); p.draw(); });

            animationFrameId = requestAnimationFrame(render);
        };

        render(0);
        return () => cancelAnimationFrame(animationFrameId);
    }, [isListening, isSpeaking]);

    const toggleMic = () => {
        const next = !isListening;
        setIsListening(next);
        if (next) {
            playScan();
            startRecognition();
        } else {
            stopRecognition();
        }
    };

    const simulateResponse = (text: string) => {
        setIsSpeaking(true);
        const utterance = new SpeechSynthesisUtterance();
        utterance.text = `Analyzing your query: "${text}". I recommend focusing on system design patterns for your upcoming interview at Google.`;
        utterance.rate = 1.0;
        utterance.pitch = 1.2;
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
    };

    const startRecognition = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Speech recognition not supported in this browser.");
            return;
        }
        const SpeechRecognition = (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            onTranscript?.(transcript);
            setIsListening(false);
            playSync();
            simulateResponse(transcript);
        };

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognition.start();
    };

    const stopRecognition = () => {
        // Standard API doesn't have a global stop for all instances easily, 
        // but the onend/onresult will handle state.
    };



    return (
        <div className="flex flex-col items-center gap-6 p-8 relative">
            <div className="absolute inset-0 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative h-64 w-64 flex items-center justify-center">
                <canvas
                    ref={canvasRef}
                    width={256}
                    height={256}
                    className="absolute inset-0 z-0"
                />
                <div className={cn(
                    "h-24 w-24 rounded-full bg-black/40 backdrop-blur-3xl border-2 flex items-center justify-center z-10 transition-all duration-500 shadow-[0_0_50px_rgba(var(--primary-rgb),0.3)]",
                    isListening ? "border-primary scale-110 shadow-primary" : "border-white/10"
                )}>
                    {isListening ? (
                        <Mic className="h-8 w-8 text-primary animate-pulse" />
                    ) : isSpeaking ? (
                        <Volume2 className="h-8 w-8 text-accent animate-bounce" />
                    ) : (
                        <Sparkles className="h-8 w-8 text-muted-foreground opacity-50" />
                    )}
                </div>

                {/* Visualizer Rings */}
                <div className={cn(
                    "absolute inset-0 border-2 border-primary/20 rounded-full animate-ping [animation-duration:3000ms]",
                    !isListening && "hidden"
                )} />
            </div>

            <div className="text-center space-y-2 z-10">
                <h3 className="text-2xl font-black font-display tracking-tighter uppercase">
                    {isListening ? "Aura is Listening" : isSpeaking ? "Aura is Responding" : "Talk to Aura"}
                </h3>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest opacity-60">
                    Neural Conversation v1.2
                </p>
            </div>

            <div className="flex gap-4 z-10">
                <Button
                    variant={isListening ? "destructive" : "gradient"}
                    size="xl"
                    className="rounded-2xl px-12 h-14 font-black shadow-2xl transition-all hover:scale-105 active:scale-95"
                    onClick={toggleMic}
                >
                    {isListening ? <MicOff className="mr-2 h-5 w-5" /> : <Mic className="mr-2 h-5 w-5" />}
                    {isListening ? "Stop Listening" : "Start Conversation"}
                </Button>
            </div>

            <div className="grid grid-cols-3 gap-6 w-full pt-8">
                {[
                    { label: "Neural Load", v: "14ms", i: Cpu },
                    { label: "Core Sync", v: "Active", i: Brain },
                    { label: "Vector DB", v: "Secure", i: Sparkles }
                ].map(s => (
                    <div key={s.label} className="text-center p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                        <s.i className="h-4 w-4 mx-auto text-primary opacity-50 mb-1" />
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{s.label}</p>
                        <p className="text-sm font-bold">{s.v}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
