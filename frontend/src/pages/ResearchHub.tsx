import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Lightbulb, Search, BookOpen, Users, ArrowRight, DollarSign, Loader2, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Define TypeScript interface for Research Project
interface ResearchProject {
    id: string;
    title: string;
    abstract: string;
    principal_investigator: string;
    co_investigators: string[];
    funding_amount: number;
    status: string;
    objectives: string[];
    methodology?: string;
    created_at?: string;
}

export default function ResearchHub() {
    const [searchTerm, setSearchTerm] = useState("");
    const [projects, setProjects] = useState<ResearchProject[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    // Dialog States
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<ResearchProject | null>(null);

    const [newProposal, setNewProposal] = useState({
        title: "",
        abstract: "",
        funding_amount: "",
        objectives: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('research_projects')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            
            setProjects(data || []);
        } catch (error: any) {
            console.error('Error fetching projects:', error);
            toast({
                title: "Error fetching research projects",
                description: error.message || "Failed to load projects",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSponsor = async (projectId: string, currentStatus: string) => {
        if (currentStatus === 'approved' || currentStatus === 'in_progress') {
            toast({
                title: "Waitlist Joined",
                description: "You have been added to the waitlist for this project.",
            });
            return;
        }

        try {
            toast({
                title: "Processing Sponsorship",
                description: "Initiating sponsorship request...",
            });
            setTimeout(() => {
                toast({
                    title: "Sponsorship Request Sent",
                    description: "The principal investigator has been notified of your interest.",
                });
            }, 1000);
        } catch (error: any) {
            toast({
                title: "Error",
                description: "Could not process sponsorship.",
                variant: "destructive",
            });
        }
    };

    const handleViewDetails = (project: ResearchProject) => {
        setSelectedProject(project);
        setIsDetailDialogOpen(true);
    };

    const handleSubmitProposal = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!newProposal.title || !newProposal.abstract || !newProposal.funding_amount) {
            toast({
                title: "Missing Fields",
                description: "Please fill in all required fields.",
                variant: "destructive",
            });
            return;
        }

        try {
            setIsSubmitting(true);
            
            const { data: userData } = await supabase.auth.getUser();
            const userId = userData.user?.id;
            
            let principalInvestigator = "Anonymous";
            if (userId) {
                const { data: profile } = await supabase.from('profiles').select('full_name').eq('user_id', userId).single();
                if (profile && profile.full_name) {
                    principalInvestigator = profile.full_name;
                }
            }

            const objectivesArray = newProposal.objectives 
                ? newProposal.objectives.split(',').map(tag => tag.trim()) 
                : [];

            const { error } = await supabase
                .from('research_projects')
                .insert([
                    {
                        title: newProposal.title,
                        abstract: newProposal.abstract,
                        funding_amount: parseFloat(newProposal.funding_amount) || 0,
                        principal_investigator: principalInvestigator,
                        objectives: objectivesArray,
                        status: 'proposal',
                        created_by: userId
                    }
                ]);

            if (error) throw error;

            toast({
                title: "Proposal Submitted",
                description: "Your research proposal has been successfully submitted.",
            });
            
            setIsDialogOpen(false);
            setNewProposal({ title: "", abstract: "", funding_amount: "", objectives: "" });
            fetchProjects(); // Refresh the list
            
        } catch (error: any) {
            console.error('Submission error:', error);
            toast({
                title: "Failed to submit proposal",
                description: error.message || "An unexpected error occurred",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredResearch = projects.filter(r => 
        (r.title && r.title.toLowerCase().includes(searchTerm.toLowerCase())) || 
        (r.objectives && r.objectives.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())))
    );

    const formatCurrency = (amount: number) => {
        if (!amount) return "₹0";
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const activeProjectsCount = projects.filter(p => p.status === 'in_progress' || p.status === 'approved').length;
    const totalFundingReq = projects.filter(p => p.status === 'proposal').reduce((acc, curr) => acc + (curr.funding_amount || 0), 0);

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold font-display tracking-tight flex items-center gap-2">
                            Research & Innovation <Lightbulb className="text-warning h-8 w-8" />
                        </h1>
                        <p className="text-muted-foreground mt-1 max-w-2xl">
                            Bridging groundbreaking academic research with industry applications. Explore ongoing projects, sponsor innovations, or collaborate with leading faculty.
                        </p>
                    </div>
                    
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="gradient" className="shrink-0 gap-2">
                                <BookOpen className="h-4 w-4" /> Submit Proposal
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <form onSubmit={handleSubmitProposal}>
                                <DialogHeader>
                                    <DialogTitle>Submit Research Proposal</DialogTitle>
                                    <DialogDescription>
                                        Share your innovative research idea to attract funding and collaborators.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="title">Project Title</Label>
                                        <Input 
                                            id="title" 
                                            placeholder="e.g., Quantum-Resistant Cryptography" 
                                            value={newProposal.title}
                                            onChange={(e) => setNewProposal({...newProposal, title: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="abstract">Abstract / Description</Label>
                                        <Textarea 
                                            id="abstract" 
                                            placeholder="Briefly describe your research goals and methodology..." 
                                            className="min-h-[100px]"
                                            value={newProposal.abstract}
                                            onChange={(e) => setNewProposal({...newProposal, abstract: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="funding">Funding Required (₹)</Label>
                                        <Input 
                                            id="funding" 
                                            type="number"
                                            placeholder="e.g., 1500000" 
                                            value={newProposal.funding_amount}
                                            onChange={(e) => setNewProposal({...newProposal, funding_amount: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="tags">Tags / Objectives (comma separated)</Label>
                                        <Input 
                                            id="tags" 
                                            placeholder="e.g., AI, Sustainability, Materials Science" 
                                            value={newProposal.objectives}
                                            onChange={(e) => setNewProposal({...newProposal, objectives: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Submitting...
                                            </>
                                        ) : "Submit Proposal"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Search Bar */}
                <div className="relative max-w-xl">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search by keywords, tags, or topics..." 
                        className="pl-10 glass-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Grants Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card variant="glass" className="border-l-4 border-l-primary">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Projects</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{projects.length}</div>
                        </CardContent>
                    </Card>
                    <Card variant="glass" className="border-l-4 border-l-success">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Active Projects</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{activeProjectsCount}</div>
                        </CardContent>
                    </Card>
                    <Card variant="glass" className="border-l-4 border-l-warning">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Seeking Funding</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{formatCurrency(totalFundingReq)}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Research Feed */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold font-display mb-4">Ongoing Innovations</h2>
                    
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : filteredResearch.length > 0 ? (
                        filteredResearch.map((project) => (
                            <Card key={project.id} variant="glass" className="hover:border-primary/50 transition-colors">
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row justify-between gap-6">
                                        <div className="space-y-4 flex-1">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Badge variant={project.status === "approved" || project.status === "in_progress" ? "success" : "warning"} className="text-xs uppercase">
                                                        {project.status.replace('_', ' ')}
                                                    </Badge>
                                                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                                                        <Users className="h-3 w-3" /> {(project.co_investigators?.length || 0) + 1} Researchers
                                                    </span>
                                                </div>
                                                <h3 className="text-xl font-bold">{project.title}</h3>
                                                <p className="text-sm text-primary font-medium mt-1">Lead: {project.principal_investigator || "Unknown"}</p>
                                            </div>
                                            <p className="text-muted-foreground text-sm">
                                                {project.abstract}
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {project.objectives && project.objectives.map((tag, idx) => (
                                                    <Badge key={idx} variant="secondary" className="bg-secondary/50 text-xs">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-col items-start md:items-end justify-between border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6 shrink-0 min-w-[200px]">
                                            <div className="mb-4 md:mb-0 text-left md:text-right w-full">
                                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Funding Goal</p>
                                                <p className="text-2xl font-bold text-foreground mt-1">{formatCurrency(project.funding_amount)}</p>
                                                <p className="text-xs text-muted-foreground mt-1">For Lab Equipment & Stipends</p>
                                            </div>
                                            
                                            <div className="flex flex-col gap-2 w-full">
                                                <Button 
                                                    className="w-full justify-between group" 
                                                    variant={project.status === "approved" || project.status === 'in_progress' ? "outline" : "default"}
                                                    onClick={() => handleSponsor(project.id, project.status)}
                                                >
                                                    {project.status === "approved" || project.status === 'in_progress' ? "Join Waitlist" : "Sponsor Project"}
                                                    <DollarSign className="h-4 w-4 ml-2 opacity-70 group-hover:opacity-100 transition-opacity" />
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    className="w-full justify-between text-muted-foreground hover:text-foreground"
                                                    onClick={() => handleViewDetails(project)}
                                                >
                                                    Detailed Proposal
                                                    <ArrowRight className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <Lightbulb className="h-12 w-12 text-muted/50 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-muted-foreground">No projects found.</h3>
                            <p className="text-sm text-muted-foreground mt-1">Try adjusting your search criteria or be the first to submit a proposal.</p>
                        </div>
                    )}
                </div>

                {/* Detail Dialog */}
                <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
                    <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
                        {selectedProject && (
                            <>
                                <DialogHeader className="mb-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge variant={selectedProject.status === "approved" || selectedProject.status === "in_progress" ? "success" : "warning"} className="text-xs uppercase">
                                            {selectedProject.status.replace('_', ' ')}
                                        </Badge>
                                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                                            <Calendar className="h-3 w-3" /> 
                                            {selectedProject.created_at ? new Date(selectedProject.created_at).toLocaleDateString() : 'Recent'}
                                        </span>
                                    </div>
                                    <DialogTitle className="text-2xl font-bold font-display leading-tight">{selectedProject.title}</DialogTitle>
                                    <DialogDescription className="text-base text-primary font-medium mt-1">
                                        Lead Investigator: {selectedProject.principal_investigator || "Unknown"}
                                    </DialogDescription>
                                </DialogHeader>
                                
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Abstract & Goals</h4>
                                        <p className="text-foreground leading-relaxed">{selectedProject.abstract}</p>
                                    </div>

                                    {selectedProject.methodology && (
                                        <div>
                                            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Methodology</h4>
                                            <p className="text-foreground leading-relaxed">{selectedProject.methodology}</p>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Funding Required</h4>
                                            <p className="text-2xl font-bold font-display">{formatCurrency(selectedProject.funding_amount)}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Research Team</h4>
                                            <ul className="text-foreground text-sm list-disc list-inside">
                                                <li>{selectedProject.principal_investigator || "Unknown"} (Lead)</li>
                                                {selectedProject.co_investigators && selectedProject.co_investigators.map((co, idx) => (
                                                    <li key={idx}>{co}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Tags & Disciplines</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedProject.objectives && selectedProject.objectives.map((tag, idx) => (
                                                <Badge key={idx} variant="secondary" className="bg-secondary/50">
                                                    {tag}
                                                </Badge>
                                            ))}
                                            {(!selectedProject.objectives || selectedProject.objectives.length === 0) && (
                                                <span className="text-sm text-muted-foreground">No specific tags identified.</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <DialogFooter className="mt-8 border-t pt-4">
                                    <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                                        Close
                                    </Button>
                                    <Button 
                                        variant={selectedProject.status === "approved" || selectedProject.status === 'in_progress' ? "outline" : "default"}
                                        onClick={() => {
                                            handleSponsor(selectedProject.id, selectedProject.status);
                                            setIsDetailDialogOpen(false);
                                        }}
                                        className="gap-2"
                                    >
                                        {selectedProject.status === "approved" || selectedProject.status === 'in_progress' ? "Join Waitlist" : "Sponsor Project"}
                                        <DollarSign className="h-4 w-4 opacity-70" />
                                    </Button>
                                </DialogFooter>
                            </>
                        )}
                    </DialogContent>
                </Dialog>

            </div>
        </DashboardLayout>
    );
}
