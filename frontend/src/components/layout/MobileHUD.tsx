import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, User, MessageSquare,
    Calendar, Briefcase, Plus, X, Power,
    Settings, Bell, Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSound } from '@/hooks/useSound';
import { cn } from '@/lib/utils';

export const MobileHUD = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { playClick, playHover } = useSound();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dash', route: '/dashboard', angle: -140 },
        { icon: User, label: 'Profile', route: '/settings', angle: -100 },
        { icon: MessageSquare, label: 'Forum', route: '/forum', angle: -60 },
        { icon: Calendar, label: 'Events', route: '/events', angle: -20 },
        { icon: Briefcase, label: 'Jobs', route: '/internships', angle: 20 },
    ];

    const toggleMenu = () => {
        playClick();
        setIsOpen(!isOpen);
    };

    const handleNavigate = (route: string) => {
        playClick();
        navigate(route);
        setIsOpen(false);
    };

    return (
        <div className="md:hidden fixed bottom-8 right-8 z-[100]">
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Overlay Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={toggleMenu}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[-1]"
                        />

                        {/* Radial Menu Items */}
                        <div className="absolute bottom-0 right-0">
                            {menuItems.map((item, i) => (
                                <motion.button
                                    key={item.label}
                                    initial={{ scale: 0, x: 0, y: 0 }}
                                    animate={{
                                        scale: 1,
                                        x: Math.cos(item.angle * (Math.PI / 180)) * 120,
                                        y: Math.sin(item.angle * (Math.PI / 180)) * 120
                                    }}
                                    exit={{ scale: 0, x: 0, y: 0 }}
                                    transition={{ type: 'spring', damping: 15, stiffness: 200, delay: i * 0.05 }}
                                    onClick={() => handleNavigate(item.route)}
                                    onMouseEnter={() => playHover()}
                                    className="absolute h-14 w-14 rounded-full bg-black/80 border border-primary/40 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(0,242,255,0.2)] group"
                                >
                                    <item.icon className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                                    <span className="text-[7px] font-black uppercase text-white mt-0.5 tracking-tighter">{item.label}</span>
                                </motion.button>
                            ))}
                        </div>

                        {/* Center HUD Stats */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="absolute bottom-24 right-0 w-48 bg-black/80 border border-white/10 rounded-2xl p-4 shadow-2xl pointer-events-none"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[8px] font-black tracking-widest text-primary uppercase">System Uplink</span>
                                <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                            </div>
                            <div className="space-y-1.5">
                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-[82%] animate-pulse" />
                                </div>
                                <div className="flex justify-between text-[6px] font-black text-muted-foreground uppercase">
                                    <span>Signal Strength</span>
                                    <span>82%</span>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Toggle Button */}
            <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleMenu}
                className={cn(
                    "h-16 w-16 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl relative z-10",
                    isOpen
                        ? "bg-destructive shadow-[0_0_30px_rgba(239,68,68,0.3)] rotate-90"
                        : "bg-primary shadow-[0_0_30px_rgba(0,242,255,0.3)]"
                )}
            >
                <div className="absolute inset-0 rounded-full border border-white/20 animate-ping [animation-duration:3s]" />
                {isOpen ? <X className="h-8 w-8 text-white" /> : <Power className="h-8 w-8 text-black" />}
            </motion.button>

            {/* Ambient Scan Line */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
                <div className="absolute top-0 left-0 w-full h-1 bg-white/20 animate-scan" style={{ animationDuration: '2s' }} />
            </div>
        </div>
    );
};
