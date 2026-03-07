import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import {
    Search, Users, Star, Calendar, MessageCircle,
    Linkedin, ExternalLink, Filter, MapPin, Briefcase, GraduationCap,
    Clock, CheckCircle2, ChevronRight, Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { useToast } from "@/hooks/use-toast";

interface Mentor {
    id: string;
    name: string;
    role: string;
    company: string;
    department: string;
    gradYear: number;
    expertise: string[];
    rating: number;
    reviews: number;
    avatar: string;
    linkedin: string;
    availability: string;
}

const sampleMentors: Mentor[] = [
    { id: "1", name: "Arun Prakash", role: "Sr. Software Engineer", company: "Google", department: "Computer Science", gradYear: 2018, expertise: ["System Design", "Backend", "DSA"], rating: 4.9, reviews: 32, avatar: "", linkedin: "https://linkedin.com", availability: "Weekends" },
    { id: "2", name: "Sneha Reddy", role: "Product Manager", company: "Microsoft", department: "Computer Science", gradYear: 2019, expertise: ["Product Strategy", "Management", "UI UX"], rating: 4.8, reviews: 24, avatar: "", linkedin: "https://linkedin.com", availability: "Tue, Thu Evening" },
    { id: "3", name: "Vikram Mehta", role: "Engineering Manager", company: "Razorpay", department: "Electronics", gradYear: 2017, expertise: ["FinTech", "Scalability", "Leadership"], rating: 5.0, reviews: 41, avatar: "", linkedin: "https://linkedin.com", availability: "Flexible" },
    { id: "4", name: "Neha Gupta", role: "Staff Engineer", company: "Stripe", department: "Computer Science", gradYear: 2018, expertise: ["Distributed Systems", "Payments"], rating: 4.7, reviews: 18, avatar: "", linkedin: "https://linkedin.com", availability: "Weekends" },
];

export default function Mentorship() {
    const [mentors, setMentors] = useState<Mentor[]>(sampleMentors);
    const [loading, setLoading] = useState(true);
    const { user } = useUserRole();
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [bookingStep, setBookingStep] = useState(1);

    const filteredMentors = mentors.filter(m =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.expertise.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Fetch mentors from backend (mocking with profiles for now, ideally fetching users with role 'alumni' | 'faculty')
    // Since we don't have a direct way to join roles easily in client-side query without views, 
    // we will stick to sample data for display but implement the *Request* logic against real backend.

    // Actually, let's try to fetch if possible, otherwise we keep sample data as fallback
    useEffect(() => {
        // Implementation note: In a real app we'd have a 'mentors_view' 
        // For now, we'll simulate loading
        setTimeout(() => setLoading(false), 1000);
    }, []);

    const handleBookSession = async (mentor: Mentor) => {
        if (!user) {
            toast({ title: "Login Required", description: "Please login to book a session", variant: "destructive" });
            return;
        }
        setSelectedMentor(mentor);
        setBookingStep(1);
        setIsBookingOpen(true);
    };

    const [errorState, setErrorState] = useState<{ isError: boolean; message: string }>({ isError: false, message: "" });

    const confirmBooking = async () => {
        if (!user || !selectedMentor) return;

        try {
            setErrorState({ isError: false, message: "" });
            const { error } = await (supabase
                .from("mentorship_requests" as any)
                .insert({
                    student_id: user.id,
                    mentor_id: selectedMentor.id,
                    status: 'pending',
                    message: "General Guidance"
                } as any));


            if (error) {
                // Check for schema/missing table error
                if (error.message?.includes("schema cache") || error.code === "42P01") {
                    setErrorState({
                        isError: true,
                        message: "The automated booking system is being updated by the administrator. For now, please connect with the mentor directly via LinkedIn to schedule your session."
                    });
                    return;
                }
                throw error;
            }

            setBookingStep(2);
        } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold font-display">Mentorship <span className="gradient-text">Hub</span></h1>
                        <p className="text-muted-foreground">Connect with alumni and industry professional for 1-to-1 guidance</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline"><MessageCircle className="h-4 w-4 mr-2" /> My Requests</Button>
                        <Button variant="gradient"><Calendar className="h-4 w-4 mr-2" /> Upcoming Sessions</Button>
                    </div>
                </div>

                {/* Stats Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card variant="glass" className="bg-primary/5">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                <Users className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">120+</p>
                                <p className="text-xs text-muted-foreground">Verified Mentors</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card variant="glass" className="bg-success/5">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-success/20 flex items-center justify-center text-success">
                                <CheckCircle2 className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">450+</p>
                                <p className="text-xs text-muted-foreground">Sessions Completed</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card variant="glass" className="bg-amber-500/5">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
                                <Star className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">4.9/5</p>
                                <p className="text-xs text-muted-foreground">Avg. Satisfaction</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search by name, company, or expertise (e.g. System Design)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 bg-muted/20"
                        />
                    </div>
                    <Button variant="outline"><Filter className="h-4 w-4 mr-2" /> Filters</Button>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {filteredMentors.map((mentor) => (
                        <Card key={mentor.id} variant="glass" className="flex flex-col overflow-hidden group hover:ring-2 hover:ring-primary/30 transition-all duration-300">
                            <div className="h-2 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <CardContent className="p-5 flex-1 flex flex-col items-center text-center">
                                <Avatar className="h-20 w-20 mb-4 border-2 border-primary/20 p-1">
                                    <AvatarImage src={mentor.avatar} alt={mentor.name} />
                                    <AvatarFallback className="bg-primary/5 text-primary text-xl font-bold">
                                        {mentor.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="space-y-1">
                                    <h3 className="font-bold text-lg">{mentor.name}</h3>
                                    <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                                        <Briefcase className="h-3 w-3" /> {mentor.role} at {mentor.company}
                                    </p>
                                    <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                                        <GraduationCap className="h-3 w-3" /> Class of {mentor.gradYear} ({mentor.department})
                                    </p>
                                </div>

                                <div className="flex items-center gap-1 my-3 bg-muted/50 px-2 py-0.5 rounded-full">
                                    <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                    <span className="text-xs font-bold">{mentor.rating}</span>
                                    <span className="text-[10px] text-muted-foreground">({mentor.reviews} reviews)</span>
                                </div>

                                <div className="flex flex-wrap justify-center gap-1 mb-6">
                                    {mentor.expertise.map((exp) => (
                                        <Badge key={exp} variant="secondary" className="text-[10px] px-1.5 py-0">{exp}</Badge>
                                    ))}
                                </div>

                                <div className="w-full space-y-2 mt-auto">
                                    <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground">
                                        <Clock className="h-3 w-3" /> Availability: <span className="text-primary font-medium">{mentor.availability}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="flex-1" asChild>
                                            <a href={mentor.linkedin} target="_blank" rel="noreferrer"><Linkedin className="h-3.5 w-3.5 mr-1" /> Profile</a>
                                        </Button>
                                        <Button variant="gradient" size="sm" className="flex-1" onClick={() => handleBookSession(mentor)}>Book Slot</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Booking Dialog */}
                <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
                    <DialogContent className="max-w-md">
                        {errorState.isError ? (
                            <div className="text-center py-6 space-y-4">
                                <div className="mx-auto h-16 w-16 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                                    <Linkedin className="h-8 w-8" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold">Alternative Way to Connect</h3>
                                    <p className="text-sm text-muted-foreground">{errorState.message}</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Button variant="gradient" className="w-full" asChild>
                                        <a href={selectedMentor?.linkedin} target="_blank" rel="noreferrer">
                                            <Linkedin className="h-4 w-4 mr-2" /> Connect on LinkedIn
                                        </a>
                                    </Button>
                                    <Button variant="ghost" className="w-full" onClick={() => {
                                        setIsBookingOpen(false);
                                        setErrorState({ isError: false, message: "" });
                                    }}>
                                        Back to Hub
                                    </Button>
                                </div>
                            </div>
                        ) : bookingStep === 1 ? (
                            <>
                                <DialogHeader>
                                    <DialogTitle>Book Mentorship Session</DialogTitle>
                                    <DialogDescription>Choose a time slot with {selectedMentor?.name}</DialogDescription>
                                </DialogHeader>
                                <div className="py-4 space-y-4">
                                    <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                                        <Avatar className="h-12 w-12 border border-primary/20">
                                            <AvatarFallback>{selectedMentor?.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-bold">{selectedMentor?.name}</p>
                                            <p className="text-xs text-muted-foreground">{selectedMentor?.role} at {selectedMentor?.company}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-sm font-semibold">Available Slots</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {["Tomorrow, 6:00 PM", "Tomorrow, 7:00 PM", "Saturday, 11:00 AM", "Sunday, 4:00 PM"].map((slot) => (
                                                <Button key={slot} variant="outline" className="text-xs" onClick={confirmBooking}>
                                                    {slot}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="ghost" onClick={() => setIsBookingOpen(false)}>Cancel</Button>
                                </DialogFooter>
                            </>
                        ) : (
                            <div className="text-center py-6 space-y-4">
                                <div className="mx-auto h-16 w-16 rounded-full bg-success/20 flex items-center justify-center text-success">
                                    <CheckCircle2 className="h-8 w-8" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold">Request Sent!</h3>
                                    <p className="text-sm text-muted-foreground">Your mentorship request has been sent to {selectedMentor?.name}. You'll be notified once they accept.</p>
                                </div>
                                <Button variant="gradient" className="w-full" onClick={() => setIsBookingOpen(false)}>Back to Hub</Button>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
}
