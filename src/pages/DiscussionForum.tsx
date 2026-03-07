import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    MessageSquare, Plus, Search, ThumbsUp, MessageCircle, Clock, User, Tag, Pin,
    TrendingUp, ChevronUp, Eye, Send, Filter, CheckCircle2, Zap, Brain, Activity, Sparkles,
    Flame, Target, Share2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ForumPost {
    id: string; title: string; body: string; author: string; avatar: string;
    category: string; tags: string[]; votes: number; replies: Reply[];
    views: number; pinned: boolean; solved: boolean; createdAt: string;
    sentiment?: "positive" | "technical" | "neutral" | "urgent";
}

interface Reply {
    id: string; author: string; avatar: string; body: string; votes: number; accepted: boolean; createdAt: string;
    sentiment?: "positive" | "technical" | "neutral";
}

const samplePosts: ForumPost[] = [
    {
        id: "p1", title: "How to prepare for Google SWE internship?", body: "I'm a 3rd year CSE student targeting Google's summer internship. What's the best roadmap for DSA preparation?", author: "Rahul Sharma", avatar: "RS",
        category: "career", tags: ["Internship", "Google", "DSA"], votes: 24, views: 342,
        pinned: true, solved: true, createdAt: "2026-02-15T10:30:00Z", sentiment: "positive",
        replies: [
            { id: "r1", author: "Sneha Reddy (Alumni @ Microsoft)", avatar: "SR", body: "I cracked Google in 2019. Striver's SDE sheet is gold for Indian campus placements.", votes: 18, accepted: true, createdAt: "2026-02-15T12:00:00Z", sentiment: "technical" },
            { id: "r2", author: "Prof. Meena Iyer", avatar: "MI", body: "Check our upcoming DSA Masterclass workshop.", votes: 8, accepted: false, createdAt: "2026-02-15T14:00:00Z", sentiment: "positive" },
        ],
    },
    {
        id: "p4", title: "Team for Smart India Hackathon 2026?", body: "Looking for 1 UI/UX designer and 1 backend dev for crop disease detection project.", author: "Aditya Verma", avatar: "AV",
        category: "collaboration", tags: ["Hackathon", "SIH", "AI/ML"], votes: 31, views: 489,
        pinned: true, solved: false, createdAt: "2026-02-12T08:00:00Z", sentiment: "urgent",
        replies: [
            { id: "r5", author: "Meera Patel", avatar: "MP", body: "I'm a Biotech student, can help as domain expert!", votes: 5, accepted: false, createdAt: "2026-02-12T09:30:00Z", sentiment: "positive" },
        ],
    },
    {
        id: "p3", title: "IEEE formatting help needed - LaTeX", body: "I'm struggling with the IEEE two-column format in LaTeX for my federated learning paper.", author: "Karthik Nair", avatar: "KN",
        category: "academic", tags: ["Research", "IEEE", "LaTeX"], votes: 9, views: 145,
        pinned: false, solved: true, createdAt: "2026-02-13T15:00:00Z", sentiment: "technical",
        replies: [
            { id: "r4", author: "Dr. Priya Sharma", avatar: "PS", body: "Use the official IEEE conference template from Overleaf.", votes: 7, accepted: true, createdAt: "2026-02-13T16:30:00Z", sentiment: "technical" },
        ],
    },
];

const sentimentStyles = {
    positive: "bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]",
    technical: "bg-indigo-500/10 border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]",
    neutral: "bg-white/5 border-white/10 shadow-none",
    urgent: "bg-rose-500/10 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]",
};

const categories = [
    { value: "all", label: "Neural Nexus (All)", icon: Brain },
    { value: "career", label: "Career Streams", icon: Target },
    { value: "academic", label: "Academic Vault", icon: GraduationCap },
    { value: "collaboration", label: "Synapse (Collab)", icon: Zap },
    { value: "technical", label: "Core Technical", icon: Activity },
];

export default function DiscussionForum() {
    const [posts, setPosts] = useState<ForumPost[]>(samplePosts);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [newPost, setNewPost] = useState({ title: "", body: "", category: "technical", tags: "" });

    const filteredPosts = useMemo(() => {
        return posts.filter(p => {
            const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchCat = categoryFilter === "all" || p.category === categoryFilter;
            return matchSearch && matchCat;
        }).sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || b.votes - a.votes);
    }, [posts, searchQuery, categoryFilter]);

    const handleVote = (postId: string) => {
        setPosts(posts.map(p => p.id === postId ? { ...p, votes: p.votes + 1 } : p));
        if (selectedPost?.id === postId) setSelectedPost({ ...selectedPost, votes: selectedPost.votes + 1 });
    };

    const handleReply = () => {
        if (!replyText.trim() || !selectedPost) return;
        const reply: Reply = { id: `r-${Date.now()}`, author: "You", avatar: "YO", body: replyText, votes: 0, accepted: false, createdAt: new Date().toISOString(), sentiment: "neutral" };
        const updated = { ...selectedPost, replies: [...selectedPost.replies, reply] };
        setPosts(posts.map(p => p.id === selectedPost.id ? updated : p));
        setSelectedPost(updated);
        setReplyText("");
    };

    const handleCreate = () => {
        const post: ForumPost = {
            id: `p-${Date.now()}`, title: newPost.title, body: newPost.body, author: "You", avatar: "YO",
            category: newPost.category, tags: newPost.tags.split(",").map(t => t.trim()).filter(Boolean),
            votes: 0, replies: [], views: 0, pinned: false, solved: false, createdAt: new Date().toISOString(), sentiment: "neutral"
        };
        setPosts([post, ...posts]);
        setIsCreateOpen(false);
        setNewPost({ title: "", body: "", category: "technical", tags: "" });
    };

    return (
        <DashboardLayout>
            <div className="space-y-8 max-w-[1600px] mx-auto animate-fade-in relative">
                {/* Visual Flair Background */}
                <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-primary/10 rounded-full blur-[120px] opacity-20" />

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Sidebar: Categories & Heatmap */}
                    <div className="w-full lg:w-72 space-y-6">
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-4 ml-2">Channels</h2>
                            <div className="space-y-1">
                                {categories.map((cat) => {
                                    const Icon = cat.icon;
                                    const active = categoryFilter === cat.value;
                                    return (
                                        <button
                                            key={cat.value}
                                            onClick={() => setCategoryFilter(cat.value)}
                                            className={cn(
                                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                                                active ? "bg-primary/20 border border-primary/20 text-primary" : "text-muted-foreground hover:bg-white/5"
                                            )}
                                        >
                                            <Icon className={cn("h-4 w-4 transition-transform group-hover:scale-110", active ? "text-primary" : "text-muted-foreground")} />
                                            <span className="text-sm font-bold tracking-tight">{cat.label}</span>
                                            {active && <motion.div layoutId="cat-indicator" className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </section>

                        <section className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-4">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-2">
                                <Flame className="h-3 w-3 text-rose-500" />
                                Expert Heat-Map
                            </h2>
                            <div className="space-y-4">
                                {[
                                    { name: "Dr. Priya Sharma", sub: "Quantum Expert", intensity: 92 },
                                    { name: "Rahul S.", sub: "Career Guide", intensity: 75 },
                                    { name: "Sneha R.", sub: "System Design", intensity: 88 },
                                ].map((expert, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center font-bold text-xs ring-2 ring-white/5">
                                                {expert.name[0]}
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 border-2 border-black" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold truncate leading-none mb-1">{expert.name}</p>
                                            <p className="text-[10px] text-muted-foreground">{expert.sub}</p>
                                            <div className="mt-2 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${expert.intensity}%` }}
                                                    className="h-full bg-gradient-to-r from-primary to-accent"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <Button
                            variant="gradient"
                            className="w-full py-6 rounded-2xl shadow-xl shadow-primary/10 group"
                            onClick={() => setIsCreateOpen(true)}
                        >
                            <Plus className="mr-2 h-5 w-5 transition-transform group-hover:rotate-90" />
                            Initiate Discussion
                        </Button>
                    </div>

                    {/* Middle: Thread Stream */}
                    <div className="flex-1 space-y-6">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Sync with discussion manifold..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="pl-12 h-14 bg-white/5 border-white/5 rounded-2xl focus-visible:ring-primary/40 text-lg"
                            />
                        </div>

                        <div className="space-y-4">
                            <AnimatePresence mode="popLayout">
                                {filteredPosts.map((post, idx) => (
                                    <motion.div
                                        key={post.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: idx * 0.05 }}
                                    >
                                        <Card
                                            variant="glass"
                                            className={cn(
                                                "cursor-pointer group border-white/5 hover:border-primary/30 transition-all duration-500",
                                                selectedPost?.id === post.id && "bg-primary/5 border-primary/40 ring-1 ring-primary/20",
                                                sentimentStyles[post.sentiment || 'neutral']
                                            )}
                                            onClick={() => setSelectedPost(post)}
                                        >
                                            <CardContent className="p-6">
                                                <div className="flex gap-6">
                                                    <div className="flex flex-col items-center gap-1.5 pt-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-10 w-10 rounded-xl bg-white/5 border border-white/5 hover:bg-primary/20 hover:text-primary transition-colors"
                                                            onClick={e => { e.stopPropagation(); handleVote(post.id); }}
                                                        >
                                                            <ChevronUp className="h-6 w-6" />
                                                        </Button>
                                                        <span className="text-sm font-black font-mono">{post.votes}</span>
                                                    </div>

                                                    <div className="flex-1 space-y-3">
                                                        <div className="flex items-center justify-between gap-4">
                                                            <div className="flex items-center gap-4">
                                                                <h3 className="text-xl font-display font-black tracking-tight leading-tight group-hover:text-primary transition-colors">{post.title}</h3>
                                                                {post.pinned && <Pin className="h-4 w-4 text-warning fill-warning/20 rotate-45" />}
                                                                {post.solved && <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" title="Solution Found" />}
                                                            </div>
                                                            <div className="flex -space-x-2">
                                                                {post.replies.slice(0, 3).map((r, i) => (
                                                                    <div key={i} className="h-7 w-7 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-[10px] font-bold">
                                                                        {r.avatar}
                                                                    </div>
                                                                ))}
                                                                {post.replies.length > 3 && (
                                                                    <div className="h-7 w-7 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-[10px] font-bold text-primary">
                                                                        +{post.replies.length - 3}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                                                            {post.body}
                                                        </p>

                                                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                                                            <span className="flex items-center gap-1.5"><User className="h-3 w-3 text-primary" /> {post.author}</span>
                                                            <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> {new Date(post.createdAt).toLocaleDateString()}</span>
                                                            <span className="flex items-center gap-1.5"><Tag className="h-3 w-3" /> {post.category}</span>
                                                        </div>

                                                        <div className="flex gap-2 pt-1 overflow-x-auto pb-1 scrollbar-none">
                                                            {post.tags.map(tag => (
                                                                <Badge key={tag} variant="secondary" className="bg-white/5 border-white/5 text-[9px] hover:bg-primary/20 hover:text-primary transition-all cursor-crosshair">
                                                                    {tag}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Right Panel: Active Feed Detail */}
                    <div className="w-full lg:w-[450px] lg:sticky lg:top-4 h-fit max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-thin pr-1">
                        <AnimatePresence mode="wait">
                            {selectedPost ? (
                                <motion.div
                                    key={selectedPost.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="space-y-6"
                                >
                                    <Card variant="glass" className="overflow-hidden border-primary/20 shadow-2xl shadow-primary/5">
                                        <div className="h-1.5 w-full bg-gradient-to-r from-primary via-accent to-primary" />
                                        <CardHeader className="p-8 pb-4">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-lg border border-primary/20 shadow-inner">
                                                    {selectedPost.avatar}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-sm tracking-tight">{selectedPost.author}</h3>
                                                    <p className="text-[10px] text-muted-foreground font-mono uppercase">{new Date(selectedPost.createdAt).toLocaleString()}</p>
                                                </div>
                                                <Button variant="ghost" size="icon" className="ml-auto opacity-40 hover:opacity-100"><Share2 className="h-4 w-4" /></Button>
                                            </div>
                                            <CardTitle className="text-2xl font-display font-black leading-tight tracking-tight mb-4">
                                                {selectedPost.title}
                                            </CardTitle>
                                            <div className="flex gap-2">
                                                <Badge className="bg-primary/20 text-primary border-primary/20 capitalize font-black text-[9px] tracking-widest">{selectedPost.category}</Badge>
                                                {selectedPost.solved && <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/20 font-black text-[9px] tracking-widest">SOLVED</Badge>}
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-8 pt-0 space-y-8">
                                            <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                                {selectedPost.body}
                                            </p>

                                            <div className="flex items-center gap-6 py-4 border-y border-white/5">
                                                <div className="flex flex-col items-center">
                                                    <span className="text-xl font-bold font-mono">{selectedPost.votes}</span>
                                                    <span className="text-[8px] font-black uppercase text-muted-foreground/60 tracking-widest">Signal Boost</span>
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    <span className="text-xl font-bold font-mono">{selectedPost.views}</span>
                                                    <span className="text-[8px] font-black uppercase text-muted-foreground/60 tracking-widest">Neural Views</span>
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    <span className="text-xl font-bold font-mono">{selectedPost.replies.length}</span>
                                                    <span className="text-[8px] font-black uppercase text-muted-foreground/60 tracking-widest">Synapses</span>
                                                </div>
                                            </div>

                                            <div className="space-y-6 relative">
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Neural Synapses (Replies)</h4>

                                                {/* Connecting Nerve Filaments Effect */}
                                                <div className="absolute left-[19px] top-12 bottom-0 w-[2px] bg-gradient-to-b from-primary/30 to-transparent pointer-events-none" />

                                                <div className="space-y-6">
                                                    {selectedPost.replies.map((reply, i) => (
                                                        <motion.div
                                                            key={reply.id}
                                                            initial={{ opacity: 0, x: 10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: i * 0.1 }}
                                                            className={cn(
                                                                "relative pl-12 group",
                                                                sentimentStyles[reply.sentiment || 'neutral']
                                                            )}
                                                        >
                                                            {/* Filament Connection Point */}
                                                            <div className="absolute left-[10px] top-6 h-5 w-8 border-l-2 border-b-2 border-primary/20 rounded-bl-xl group-hover:border-primary transition-colors" />

                                                            <div className="relative p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all duration-300">
                                                                <div className="flex items-center gap-2 mb-3">
                                                                    <div className="h-6 w-6 rounded-lg bg-secondary text-[10px] font-black flex items-center justify-center border border-white/10">{reply.avatar}</div>
                                                                    <span className="text-[11px] font-black tracking-tight">{reply.author}</span>
                                                                    {reply.accepted && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 ml-auto" />}
                                                                </div>
                                                                <p className="text-xs text-muted-foreground leading-relaxed italic">"{reply.body}"</p>
                                                                <div className="flex items-center gap-3 mt-4">
                                                                    <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px] font-bold text-muted-foreground hover:text-primary">
                                                                        <ChevronUp className="h-3 w-3 mr-1" /> {reply.votes}
                                                                    </Button>
                                                                    <span className="text-[8px] text-muted-foreground/40 font-mono ml-auto">{new Date(reply.createdAt).toLocaleDateString()}</span>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="pt-6 border-t border-white/5 space-y-4">
                                                <div className="relative">
                                                    <div className="absolute top-4 left-4">
                                                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary border border-primary/20">ME</div>
                                                    </div>
                                                    <Textarea
                                                        placeholder="Transmit solution..."
                                                        value={replyText}
                                                        onChange={e => setReplyText(e.target.value)}
                                                        className="min-h-[120px] pl-16 pt-5 bg-white/5 border-white/5 rounded-2xl focus-visible:ring-primary/40 resize-none"
                                                    />
                                                </div>
                                                <Button
                                                    variant="gradient"
                                                    className="w-full h-12 rounded-xl"
                                                    onClick={handleReply}
                                                    disabled={!replyText.trim()}
                                                >
                                                    <Send className="mr-2 h-4 w-4" /> Finalize Transmission
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 text-center space-y-2">
                                        <p className="text-xs font-bold uppercase tracking-widest text-primary">Nexus Reward</p>
                                        <p className="text-[10px] text-muted-foreground italic">Providing helpful solutions increases your Expert Heat-Map intensity by +5.0%</p>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col items-center justify-center h-[600px] text-center p-8 bg-black/20 rounded-3xl border border-dashed border-white/10"
                                >
                                    <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-6 animate-pulse">
                                        <Brain className="h-10 w-10 text-primary/40" />
                                    </div>
                                    <h3 className="text-2xl font-display font-black uppercase tracking-tight mb-2">Neural Link Idle</h3>
                                    <p className="text-muted-foreground text-sm max-w-[200px]">Select a discussion node to engage with the synapse network.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Create Post Dialog - Facelift */}
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogContent className="max-w-2xl glass-card-strong border-white/10 p-0 overflow-hidden shadow-[0_0_50px_rgba(var(--primary-rgb),0.2)]">
                        <div className="p-8">
                            <DialogHeader className="mb-8">
                                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
                                    <Zap className="h-7 w-7 text-primary" />
                                </div>
                                <DialogTitle className="text-3xl font-display font-black uppercase tracking-tighter">Initiate Neural Link</DialogTitle>
                                <DialogDescription className="text-base text-muted-foreground">Broadcast your query across the academic synchronization manifold.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Discussion Topic</Label>
                                        <Input variant="glass" placeholder="How do I crack..." value={newPost.title} onChange={e => setNewPost({ ...newPost, title: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Manifest Category</Label>
                                        <Select value={newPost.category} onValueChange={v => setNewPost({ ...newPost, category: v })}>
                                            <SelectTrigger className="bg-white/5 border-white/10 rounded-xl h-10 px-4"><SelectValue /></SelectTrigger>
                                            <SelectContent className="glass-card-strong border-white/10">
                                                {categories.filter(c => c.value !== "all").map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Detailed Transmission</Label>
                                    <Textarea variant="glass" placeholder="Describe the core of your inquiry..." value={newPost.body} onChange={e => setNewPost({ ...newPost, body: e.target.value })} rows={5} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Synapse Tags (Comma-Separated)</Label>
                                    <Input variant="glass" placeholder="IEEE, ML, Internships..." value={newPost.tags} onChange={e => setNewPost({ ...newPost, tags: e.target.value })} />
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="p-6 bg-secondary/10 border-t border-white/5 flex gap-4">
                            <Button variant="ghost" onClick={() => setIsCreateOpen(false)}>Abort Process</Button>
                            <Button variant="gradient" className="px-10 h-11" onClick={handleCreate} disabled={!newPost.title || !newPost.body}>Deploy Transmission</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
}

import GraduationCap from "lucide-react/dist/esm/icons/graduation-cap";
