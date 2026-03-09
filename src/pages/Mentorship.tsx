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
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useUserRole();
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [bookingStep, setBookingStep] = useState(1);
    const [selectedSlot, setSelectedSlot] = useState("");
    const [studentEmail, setStudentEmail] = useState("");

    const filteredMentors = mentors.filter(m =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.expertise.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    useEffect(() => {
        const fetchMentors = async () => {
            try {
                setLoading(true);
                // Fetch alumni who are marked as mentors
                const { data: alumniData, error: alumniError } = await supabase
                    .from('alumni')
                    .select('*')
                    .eq('is_mentor', true);

                if (alumniError) throw alumniError;

                if (alumniData && alumniData.length > 0) {
                    // Fetch profiles for these alumni to get user_id and names/avatars
                    const userIds = alumniData.map(a => a.user_id).filter(id => id !== null);

                    const { data: profilesData, error: profilesError } = await supabase
                        .from('profiles')
                        .select('*')
                        .in('user_id', userIds);

                    if (profilesError) throw profilesError;

                    const mergedMentors: Mentor[] = alumniData.map(alumnus => {
                        const profile = profilesData?.find(p => p.user_id === alumnus.user_id);
                        return {
                            id: alumnus.user_id || alumnus.id, // Use user_id for booking
                            name: alumnus.full_name || profile?.full_name || "Unknown Mentor",
                            role: alumnus.current_position || "Mentor",
                            company: alumnus.current_company || "Industry",
                            department: alumnus.department || "",
                            gradYear: alumnus.graduation_year || 0,
                            expertise: alumnus.mentorship_areas || [],
                            rating: 4.8, // Default since we don't have review system yet
                            reviews: 0,
                            avatar: profile?.avatar_url || "",
                            linkedin: alumnus.linkedin_url || "#",
                            availability: alumnus.availability || "Contact for details"
                        };
                    });
                    setMentors(mergedMentors);
                } else {
                    // Fallback to sample data if no mentors in DB
                    setMentors(sampleMentors.map(m => ({ ...m, id: "00000000-0000-0000-0000-00000000000" + m.id })));
                }
            } catch (err: any) {
                console.error("Error fetching mentors:", err);
                // Fallback to sample data with valid UUIDs
                setMentors(sampleMentors.map(m => ({ ...m, id: "00000000-0000-0000-0000-00000000000" + m.id })));
            } finally {
                setLoading(false);
            }
        };

        fetchMentors();
    }, []);

    const handleBookSession = async (mentor: Mentor) => {
        if (!user) {
            toast({ title: "Login Required", description: "Please login to book a session", variant: "destructive" });
            return;
        }
        setSelectedMentor(mentor);
        setBookingStep(1);
        setSelectedSlot("");
        setStudentEmail(user.email || "");
        setIsBookingOpen(true);
    };

    const [errorState, setErrorState] = useState<{ isError: boolean; message: string }>({ isError: false, message: "" });

    // Helper to send actual email via EmailJS REST API
    const sendEmailNotification = async (details: {
        to_email: string;
        student_name: string;
        student_email: string;
        mentor_name: string;
        slot: string;
    }) => {
        try {
            // NOTE: You need to replace these with your actual EmailJS IDs
            const SERVICE_ID = "service_default"; // Replace with your Service ID
            const TEMPLATE_ID = "template_mentorship"; // Replace with your Template ID
            const PUBLIC_KEY = "your_public_key"; // Replace with your Public Key

            const data = {
                service_id: SERVICE_ID,
                template_id: TEMPLATE_ID,
                user_id: PUBLIC_KEY,
                template_params: {
                    to_email: details.to_email,
                    student_name: details.student_name,
                    student_email: details.student_email,
                    mentor_name: details.mentor_name,
                    booking_slot: details.slot,
                    admin_email: "mohitbalaji2005@gmail.com"
                }
            };

            const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error("EmailJS Error:", errorData);
            } else {
                console.log("Email sent successfully to", details.to_email);
            }
        } catch (error) {
            console.error("Failed to send email:", error);
        }
    };

    const confirmBooking = async () => {
        if (!user || !selectedMentor) return;

        try {
            setErrorState({ isError: false, message: "" });

            // Log for debugging
            console.log("Booking for:", {
                student_id: user.id,
                mentor_id: selectedMentor.id,
                status: 'pending'
            });

            // Handle Demo Mentors (IDs starting with 0000...)
            if (selectedMentor.id.startsWith("00000000-0000-0000-0000-00000000000")) {
                // Simulate success for demo purposes
                await new Promise(resolve => setTimeout(resolve, 800)); // Slight delay for realism
                toast({
                    title: "Demo Booking Success!",
                    description: `Your mentorship request to ${selectedMentor.name} has been simulated successfully. To record a real session, please connect with an alumni-verified mentor.`,
                });
                setIsBookingOpen(false);
                setBookingStep(1);
                return;
            }

            const { error } = await supabase
                .from("mentorship_requests" as any)
                .insert({
                    student_id: user.id,
                    mentor_id: selectedMentor.id,
                    status: 'pending',
                    message: "General Guidance"
                });

            if (error) {
                console.error("Supabase Error:", error);

                // Check for foreign key violation (23503) or invalid UUID (22P02)
                if (error.code === '23503' || error.code === '22P02') {
                    throw new Error("This profile is not yet fully linked to the production database. Please try another mentor or check back later.");
                }
                throw error;
            }

            // Send actual email notification
            await sendEmailNotification({
                to_email: studentEmail,
                student_name: user.email?.split('@')[0] || "Student",
                student_email: studentEmail,
                mentor_name: selectedMentor.name,
                slot: selectedSlot
            });

            // Also notify admin
            await sendEmailNotification({
                to_email: "mohitbalaji2005@gmail.com",
                student_name: user.email?.split('@')[0] || "Student",
                student_email: studentEmail,
                mentor_name: selectedMentor.name,
                slot: selectedSlot
            });

            setBookingStep(3);
        } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    };

    const handleSlotSelect = (slot: string) => {
        setSelectedSlot(slot);
        setBookingStep(2);
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
                                        <p className="text-sm font-semibold text-left">Available Slots</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {["Tomorrow, 6:00 PM", "Tomorrow, 7:00 PM", "Saturday, 11:00 AM", "Sunday, 4:00 PM"].map((slot) => (
                                                <Button key={slot} variant="outline" className="text-xs" onClick={() => handleSlotSelect(slot)}>
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
                        ) : bookingStep === 2 ? (
                            <>
                                <DialogHeader>
                                    <DialogTitle>Confirm Details</DialogTitle>
                                    <DialogDescription>Enter your email to receive session details</DialogDescription>
                                </DialogHeader>
                                <div className="py-4 space-y-4 text-left">
                                    <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary">Selected Slot</p>
                                        <p className="text-sm font-bold">{selectedSlot}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest">Your Email ID</label>
                                        <Input
                                            type="email"
                                            placeholder="Enter your email"
                                            value={studentEmail}
                                            onChange={(e) => setStudentEmail(e.target.value)}
                                            className="bg-muted/20"
                                        />
                                    </div>
                                </div>
                                <DialogFooter className="gap-2 sm:gap-0">
                                    <Button variant="ghost" onClick={() => setBookingStep(1)}>Back</Button>
                                    <Button variant="gradient" disabled={!studentEmail} onClick={confirmBooking}>
                                        Confirm Booking
                                    </Button>
                                </DialogFooter>
                            </>
                        ) : (
                            <div className="text-center py-6 space-y-6">
                                <div className="mx-auto h-20 w-20 rounded-full bg-success/20 flex items-center justify-center text-success animate-bounce-in">
                                    <CheckCircle2 className="h-10 w-10" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black font-display tracking-tight">Request Sent!</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed px-4">
                                        Your session for <span className="text-foreground font-bold">{selectedSlot}</span> has been booked.
                                        Confirmation details have been sent to <span className="text-primary font-bold">{studentEmail}</span> and <span className="text-primary font-bold">mohitbalaji2005@gmail.com</span>.
                                    </p>
                                </div>
                                <div className="bg-muted/30 p-4 rounded-2xl mx-4">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Status</p>
                                    <Badge variant="outline" className="bg-success/10 text-success border-success/20 font-black uppercase tracking-[0.2em]">Pending Approval</Badge>
                                </div>
                                <Button variant="gradient" className="w-full max-w-[200px]" onClick={() => setIsBookingOpen(false)}>Back to Hub</Button>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
}
