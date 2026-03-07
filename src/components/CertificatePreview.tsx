import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Award, ShieldCheck, Sparkles, Zap, QrCode } from "lucide-react";
import { motion } from "framer-motion";
import { useSound } from "@/hooks/useSound";
import { cn } from "@/lib/utils";

interface CertificatePreviewProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    participantName: string;
    eventTitle: string;
    eventDate: string;
    certificateId: string;
}

export function CertificatePreview({ open, onOpenChange, participantName, eventTitle, eventDate, certificateId }: CertificatePreviewProps) {
    const { playClick, playSuccess, playScan } = useSound();

    const handleDownload = () => {
        playSuccess();
        const content = document.getElementById("cert-print-area");
        if (!content) return;
        const win = window.open("", "_blank");
        if (!win) return;
        win.document.write(`<!DOCTYPE html><html><head><title>Certificate — ${participantName}</title><style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f8fafc; }
      .cert { width: 900px; padding: 60px; border: 12px double #6366f1; background: white; position: relative; text-align: center; font-family: 'Georgia', serif; }
      .cert::before { content: ''; position: absolute; inset: 12px; border: 2px solid #e2e8f0; pointer-events: none; }
      .header-bar { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 16px; margin: -60px -60px 40px -60px; border-bottom: 4px solid #4f46e5; }
      .header-bar h2 { font-size: 14px; letter-spacing: 4px; text-transform: uppercase; font-weight: 400; }
      .seal { width: 80px; height: 80px; margin: 0 auto 20px; border-radius: 50%; background: linear-gradient(135deg, #fbbf24, #f59e0b); display: flex; align-items: center; justify-content: center; color: white; font-size: 36px; border: 3px solid #d97706; }
      .title { font-size: 36px; color: #1e293b; margin-bottom: 8px; } .subtitle { font-size: 16px; color: #64748b; margin-bottom: 30px; }
      .name { font-size: 32px; color: #6366f1; border-bottom: 2px solid #6366f1; display: inline-block; padding: 4px 40px; margin-bottom: 20px; }
      .event { font-size: 18px; color: #334155; margin-bottom: 8px; } .date { font-size: 14px; color: #64748b; margin-bottom: 40px; }
      .sigs { display: flex; justify-content: space-around; margin-top: 40px; }
      .sig { text-align: center; } .sig .line { width: 180px; border-top: 1px solid #94a3b8; margin-bottom: 8px; } .sig .label { font-size: 12px; color: #64748b; }
      .cert-id { position: absolute; bottom: 20px; right: 30px; font-size: 10px; color: #94a3b8; font-family: monospace; }
      @media print { body { background: white; } .cert { border: 12px double #6366f1; box-shadow: none; } }
    </style></head><body><div class="cert">
      <div class="header-bar"><h2>Institutional Collaboration Portal</h2></div>
      <div class="seal">★</div>
      <div class="title">Certificate of Participation</div>
      <div class="subtitle">This is to certify that</div>
      <div class="name">${participantName}</div>
      <div class="event">has successfully participated in</div>
      <div class="event" style="font-weight:bold;font-size:22px;margin-top:8px">${eventTitle}</div>
      <div class="date">held on ${eventDate}</div>
      <div class="sigs">
        <div class="sig"><div class="line"></div><div class="label">Event Coordinator</div></div>
        <div class="sig"><div class="line"></div><div class="label">Head of Department</div></div>
        <div class="sig"><div class="line"></div><div class="label">Principal</div></div>
      </div>
      <div class="cert-id">Certificate ID: ${certificateId}</div>
    </div></body></html>`);
        win.document.close();
        win.print();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2"><Award className="h-5 w-5 text-primary" />Event Certificate</DialogTitle>
                </DialogHeader>
                <div
                    id="cert-print-area"
                    className="p-8 bg-black/40 backdrop-blur-xl border border-primary/20 rounded-3xl overflow-hidden relative perspective-1000 group/cert"
                >
                    {/* 3D Hover Effect Container */}
                    <motion.div
                        whileHover={{ rotateX: 5, rotateY: -5, scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="relative bg-black border-[12px] border-double border-[#D4AF37]/30 p-12 overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.1)] group"
                    >
                        {/* Holographic Watermark Pattern */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.1),transparent_70%)]" />

                        {/* Top Bar */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

                        <div className="relative z-10 text-center space-y-8">
                            <div className="flex justify-between items-start">
                                <ShieldCheck className="h-8 w-8 text-[#D4AF37]/40" />
                                <div className="text-right">
                                    <p className="text-[8px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">Official Credential</p>
                                    <p className="text-[10px] font-mono text-muted-foreground opacity-40">ID: {certificateId}</p>
                                </div>
                            </div>

                            <div className="flex justify-center flex-col items-center gap-4">
                                <div className="relative">
                                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-[#D4AF37] via-[#F9E27E] to-[#D4AF37] p-[1px] shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                                        <div className="h-full w-full rounded-full bg-black flex items-center justify-center text-[#D4AF37]">
                                            <Award className="h-10 w-10" />
                                        </div>
                                    </div>
                                    <div className="absolute -inset-4 border border-[#D4AF37]/20 rounded-full animate-ping [animation-duration:4s]" />
                                </div>
                                <h2 className="text-4xl font-display font-black tracking-tighter uppercase text-white">
                                    Certificate <span className="text-[#D4AF37]">of Completion</span>
                                </h2>
                            </div>

                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-60">This holographic record confirms that</p>
                                <div className="relative inline-block py-2">
                                    <p className="text-4xl font-display font-black tracking-tighter text-white px-12 relative z-10">
                                        {participantName}
                                    </p>
                                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-60 mt-4">Has successfully fulfilled all requirements for</p>
                            </div>

                            <div className="py-6 bg-[#D4AF37]/5 border-y border-[#D4AF37]/10 -mx-12">
                                <h3 className="text-2xl font-black uppercase tracking-tight text-white">{eventTitle}</h3>
                                <div className="flex items-center justify-center gap-4 mt-2">
                                    <Zap className="h-3 w-3 text-[#D4AF37]" />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">{eventDate}</span>
                                    <Zap className="h-3 w-3 text-[#D4AF37]" />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-12 pt-8">
                                {[
                                    { role: "Event Coordinator", name: "DR. SARAH CHEN" },
                                    { role: "Head of AI Research", name: "PROF. MARCUS V." },
                                    { role: "Executive Principal", name: "DR. ROBERT K." }
                                ].map(sig => (
                                    <div key={sig.role} className="text-center space-y-2">
                                        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
                                        <p className="text-[8px] font-black uppercase tracking-widest text-white leading-none">{sig.name}</p>
                                        <p className="text-[6px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]/60 leading-none">{sig.role}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Security QR Code */}
                        <div className="absolute bottom-6 left-6 opacity-20 group-hover:opacity-100 transition-opacity duration-700">
                            <QrCode className="h-8 w-8 text-[#D4AF37]" />
                        </div>

                        {/* Scanning Light Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform transition-duration-[1.5s] ease-in-out pointer-events-none" />
                    </motion.div>
                </div>
                <DialogFooter className="border-t border-primary/20 p-6 bg-black/40 backdrop-blur-xl">
                    <Button variant="ghost" className="rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-white/5" onClick={() => { playClick(); onOpenChange(false); }}>Dismiss</Button>
                    <Button variant="gradient" className="rounded-xl font-black uppercase tracking-widest text-[10px] px-8 h-12 shadow-xl shadow-primary/20" onClick={handleDownload}><Download className="mr-2 h-4 w-4" /> Export Credential</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
