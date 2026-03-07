import React from 'react';
import { motion } from 'framer-motion';

export const HUDOverlay = () => {
    return (
        <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
            {/* Scanning Line */}
            <motion.div
                initial={{ top: "-10%" }}
                animate={{ top: "110%" }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 w-full h-[2px] bg-primary/10 shadow-[0_0_15px_rgba(0,242,255,0.2)]"
            />

            {/* Corner Data Streams */}
            <div className="absolute top-4 right-4 text-right">
                <p className="text-[6px] font-black uppercase tracking-[0.4em] text-primary/40 leading-none">Uplink Status: Optimized</p>
                <p className="text-[6px] font-black uppercase tracking-[0.4em] text-primary/20 leading-none mt-1">Buffer: 0.12ms</p>
            </div>

            <div className="absolute bottom-4 left-4">
                <p className="text-[6px] font-black uppercase tracking-[0.4em] text-primary/40 leading-none">Security Protocol: Active</p>
                <p className="text-[6px] font-black uppercase tracking-[0.4em] text-primary/20 leading-none mt-1">Encryption: AES-256-GCM</p>
            </div>

            {/* Vignette / Edge Pulse */}
            <div className="absolute inset-0 border-[20px] border-primary/[0.02] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_70%,rgba(0,242,255,0.02)_100%)]" />
        </div>
    );
};
