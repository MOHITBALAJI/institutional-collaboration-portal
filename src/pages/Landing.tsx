import { useState, useEffect, useRef } from "react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  GraduationCap,
  Users,
  Briefcase,
  ArrowRight,
  FileText,
  BarChart3,
  Calendar,
  Shield,
  Zap,
  Globe,
  ChevronRight,
  Star,
  Quote,
  Sparkles,
  Rocket,
  Menu,
  X,
  ArrowUpRight,
  Play,
  ChevronLeft,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "MoU Management",
    description: "Digital lifecycle management with automated renewals and compliance tracking",
    color: "from-violet-500/20 to-blue-500/20",
    iconBg: "bg-violet-500/15",
    iconColor: "text-violet-400",
    span: "md:col-span-2",
  },
  {
    icon: Briefcase,
    title: "Internship Exchange",
    description: "Connect students with industry opportunities through smart matching",
    color: "from-blue-500/20 to-cyan-500/20",
    iconBg: "bg-blue-500/15",
    iconColor: "text-blue-400",
    span: "",
  },
  {
    icon: GraduationCap,
    title: "Research Hub",
    description: "Manage collaborative research, patents, and funding in one place",
    color: "from-emerald-500/20 to-teal-500/20",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-400",
    span: "",
  },
  {
    icon: Users,
    title: "Alumni Network",
    description: "Build lasting mentorship connections between alumni and students",
    color: "from-amber-500/20 to-orange-500/20",
    iconBg: "bg-amber-500/15",
    iconColor: "text-amber-400",
    span: "md:col-span-2",
  },
  {
    icon: BarChart3,
    title: "Impact Analytics",
    description: "Track skill gaps, placement trends, and collaboration outcomes",
    color: "from-rose-500/20 to-pink-500/20",
    iconBg: "bg-rose-500/15",
    iconColor: "text-rose-400",
    span: "",
  },
  {
    icon: Calendar,
    title: "Event Management",
    description: "Workshops, hackathons, and guest lectures with QR attendance",
    color: "from-sky-500/20 to-indigo-500/20",
    iconBg: "bg-sky-500/15",
    iconColor: "text-sky-400",
    span: "",
  },
];

const stats = [
  { value: 500, suffix: "+", label: "Industry Partners", icon: Building2 },
  { value: 10000, suffix: "+", label: "Students Placed", icon: GraduationCap },
  { value: 95, suffix: "%", label: "Satisfaction Rate", icon: Star },
  { value: 200, suffix: "+", label: "Active MoUs", icon: FileText },
];

const testimonials = [
  {
    name: "Dr. Priya Sharma",
    role: "Dean, Computer Science",
    content: "This platform transformed how we collaborate with industry partners. Our placement rate increased by 40% in just one year.",
    rating: 5,
    initials: "PS",
  },
  {
    name: "Rajesh Kumar",
    role: "CTO, TechVentures India",
    content: "Finding the right talent from campuses has never been easier. The matching algorithm is incredibly accurate.",
    rating: 5,
    initials: "RK",
  },
  {
    name: "Ananya Patel",
    role: "Student, Final Year CSE",
    content: "I landed my dream internship through the platform. The skill gap analysis helped me prepare perfectly.",
    rating: 5,
    initials: "AP",
  },
];

// Counter Hook
function useCounter(target: number, duration: number = 2000, startCounting: boolean = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startCounting) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, startCounting]);

  return count;
}

export default function Landing() {
  const [email, setEmail] = useState("");
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [heroText, setHeroText] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const statsRef = useRef<HTMLElement>(null);
  const fullText = "Institutional Collaboration Portal";

  // Typewriter effect
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i <= fullText.length) {
        setHeroText(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 50);
    return () => clearInterval(timer);
  }, []);

  // Scroll detection for navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Testimonial auto-slide
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Intersection observer for stats
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
        }
      },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navbar */}
      <nav className={`fixed top-0 z-50 w-full transition-all duration-500 ${scrolled
        ? "border-b border-border/50 bg-background/80 backdrop-blur-2xl shadow-lg shadow-primary/5"
        : "bg-transparent"
        }`}>
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
              <Building2 className="h-5 w-5 text-white" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary to-accent animate-glow-pulse opacity-40 blur-lg" />
            </div>
            <span className="font-display font-extrabold text-xl tracking-tight">
              Academia<span className="gradient-text">Connect</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {["Features", "Stats", "Testimonials", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/login" className="hidden sm:inline-flex">
              <Button variant="ghost" className="font-medium">Sign In</Button>
            </Link>
            <Link to="/login" className="hidden sm:inline-flex">
              <Button variant="gradient" className="shadow-lg shadow-primary/25 group">
                Get Started
                <ArrowUpRight className="ml-1 h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl p-4 space-y-3 animate-slide-up">
            <a href="#features" className="block py-2 text-sm" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#stats" className="block py-2 text-sm" onClick={() => setMobileMenuOpen(false)}>Stats</a>
            <a href="#testimonials" className="block py-2 text-sm" onClick={() => setMobileMenuOpen(false)}>Testimonials</a>
            <Link to="/login" className="block">
              <Button variant="gradient" className="w-full">Get Started</Button>
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 min-h-[100vh] flex items-center overflow-hidden">
        {/* Aurora Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.06]" />
          {/* Large morphing aurora blobs */}
          <div className="absolute top-[10%] left-[10%] h-[600px] w-[600px] rounded-full bg-primary/20 blur-[120px] animate-morph-blob" />
          <div className="absolute bottom-[10%] right-[10%] h-[500px] w-[500px] rounded-full bg-accent/15 blur-[120px] animate-morph-blob" style={{ animationDelay: "-4s" }} />
          <div className="absolute top-[40%] left-[50%] h-[400px] w-[400px] rounded-full bg-violet-500/10 blur-[120px] animate-morph-blob" style={{ animationDelay: "-2s" }} />

          {/* Floating geometric shapes */}
          <div className="hidden lg:block">
            <div className="absolute top-[15%] left-[8%] w-4 h-4 rounded-full border-2 border-primary/30 animate-geo-drift" />
            <div className="absolute top-[25%] right-[12%] w-6 h-6 rounded-lg border-2 border-accent/25 animate-geo-drift" style={{ animationDelay: "-3s" }} />
            <div className="absolute bottom-[30%] left-[15%] w-3 h-3 rounded-full bg-primary/20 animate-geo-drift" style={{ animationDelay: "-6s" }} />
            <div className="absolute top-[60%] right-[8%] w-5 h-5 rounded-full border-2 border-violet-400/20 animate-geo-drift" style={{ animationDelay: "-9s" }} />
            <div className="absolute bottom-[20%] right-[25%] w-3 h-3 rounded-lg bg-accent/15 animate-geo-drift" style={{ animationDelay: "-4s" }} />
          </div>

          {/* Orbiting particles */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="absolute h-2.5 w-2.5 rounded-full bg-primary/50 animate-orbit" />
            <div className="absolute h-2 w-2 rounded-full bg-accent/50 animate-orbit-reverse" />
          </div>
        </div>

        <div className="container relative mx-auto px-4 text-center">
          <Badge variant="glow" className="mb-8 animate-bounce-in px-5 py-2 text-sm">
            <Sparkles className="mr-2 h-3.5 w-3.5" />
            Bridging Academia & Industry
          </Badge>

          <h1 className="text-4xl md:text-6xl lg:text-8xl font-extrabold font-display mb-4 leading-[1.1] tracking-tight">
            <span className="neon-text">{heroText}</span>
            <span className="inline-block w-[3px] h-[0.8em] bg-primary ml-1 align-middle animate-pulse rounded-full" />
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in opacity-0 leading-relaxed" style={{ animationDelay: "1800ms" }}>
            A unified platform connecting educational institutions, industries, faculty,
            students, and alumni into a powerful ecosystem for growth and innovation.
          </p>


          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in opacity-0" style={{ animationDelay: "2200ms" }}>
            <Link to="/login">
              <Button variant="gradient" size="xl" className="group shadow-2xl shadow-primary/25 px-10 text-base">
                <Rocket className="mr-2 h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:rotate-[-15deg]" />
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <a href="#features">
              <Button variant="outline" size="xl" className="backdrop-blur-sm px-10 text-base group">
                <Play className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                Explore Features
              </Button>
            </a>
          </div>

          {/* Floating glass stat cards */}
          <div className="hidden lg:block">
            <div className="absolute top-36 left-4 xl:left-12 glass-card rounded-2xl p-5 animate-float-gentle opacity-0 animate-fade-in" style={{ animationDelay: "2600ms" }}>
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-extrabold font-display gradient-text">500+</div>
                  <div className="text-xs text-muted-foreground">Partners</div>
                </div>
              </div>
            </div>
            <div className="absolute top-52 right-4 xl:right-12 glass-card rounded-2xl p-5 animate-float-slow opacity-0 animate-fade-in" style={{ animationDelay: "2900ms", animationFillMode: "forwards" }}>
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-success/20 flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-success" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-extrabold font-display gradient-text">95%</div>
                  <div className="text-xs text-muted-foreground">Placed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" ref={statsRef} className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 aurora-bg" />
        <div className="absolute inset-0 border-y border-border/30" />
        <div className="container relative mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat) => {
              const count = useCounter(stat.value, 2000, statsVisible);
              return (
                <div key={stat.label} className="text-center group">
                  <div className="flex justify-center mb-4">
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300 group-hover:scale-110 transform">
                      <stat.icon className="h-7 w-7 text-primary" />
                    </div>
                  </div>
                  <p className="text-4xl md:text-5xl font-extrabold font-display gradient-text mb-2">
                    {count.toLocaleString()}{stat.suffix}
                  </p>
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-5 px-5 py-1.5">
              <Zap className="mr-2 h-3.5 w-3.5" />
              Features
            </Badge>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold font-display mb-6 tracking-tight">
              Everything You <span className="gradient-text">Need</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              A comprehensive suite of tools designed to streamline industry-academia collaboration
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                variant="glow"
                className={`group cursor-pointer card-hover-3d animate-fade-in-up opacity-0 relative overflow-hidden ${feature.span}`}
                style={{ animationDelay: `${index * 120}ms`, animationFillMode: "forwards" }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                <CardHeader className="relative p-6">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${feature.iconBg} mb-5 group-hover:scale-110 transition-all duration-500`}>
                    <feature.icon className={`h-7 w-7 ${feature.iconColor} transition-transform duration-300`} />
                  </div>
                  <CardTitle className="flex items-center gap-2 text-lg font-display font-bold">
                    {feature.title}
                    <ChevronRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed mt-2">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 via-transparent to-secondary/20" />
        <div className="container relative mx-auto px-4">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-5 px-5 py-1.5">
              <Shield className="mr-2 h-3.5 w-3.5" />
              User Roles
            </Badge>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold font-display mb-6 tracking-tight">
              Built for <span className="gradient-text">Everyone</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Dedicated dashboards and features for each stakeholder
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {[
              { icon: Shield, title: "College Admin", desc: "Full control & oversight", gradient: "from-primary/20 to-blue-500/20", iconColor: "text-primary" },
              { icon: Building2, title: "Industry", desc: "Hire & collaborate", gradient: "from-accent/20 to-cyan-500/20", iconColor: "text-accent" },
              { icon: GraduationCap, title: "Faculty", desc: "Research & mentoring", gradient: "from-emerald-500/20 to-green-500/20", iconColor: "text-emerald-400" },
              { icon: Users, title: "Student", desc: "Learn & grow", gradient: "from-amber-500/20 to-orange-500/20", iconColor: "text-amber-400" },
              { icon: Briefcase, title: "Alumni", desc: "Give back & connect", gradient: "from-rose-500/20 to-pink-500/20", iconColor: "text-rose-400" },
            ].map((role, index) => (
              <div key={role.title} className="group relative">
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${role.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`} />
                <Card
                  variant="glass"
                  className="relative text-center p-8 hover:border-primary/30 transition-all duration-500 card-hover-lift animate-fade-in-up opacity-0"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 mx-auto mb-5 group-hover:scale-110 transition-transform duration-500">
                    <role.icon className={`h-8 w-8 ${role.iconColor}`} />
                  </div>
                  <h3 className="font-display font-bold text-lg mb-1.5">{role.title}</h3>
                  <p className="text-xs text-muted-foreground">{role.desc}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-5 px-5 py-1.5">
              <Star className="mr-2 h-3.5 w-3.5" />
              Testimonials
            </Badge>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold font-display mb-6 tracking-tight">
              Loved by <span className="gradient-text">Thousands</span>
            </h2>
          </div>

          <div className="max-w-3xl mx-auto relative">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`transition-all duration-700 ${index === activeTestimonial
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4 absolute inset-0 pointer-events-none"
                  }`}
              >
                <Card variant="glass" className="p-8 md:p-12 text-center relative overflow-hidden">
                  <div className="absolute top-6 left-8 opacity-[0.07]">
                    <Quote className="h-20 w-20 text-primary" />
                  </div>
                  <CardContent className="relative space-y-6">
                    <div className="flex justify-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-warning text-warning" />
                      ))}
                    </div>
                    <p className="text-lg md:text-xl leading-relaxed text-foreground/90 italic">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center justify-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-sm font-bold">
                        {testimonial.initials}
                      </div>
                      <div className="text-left">
                        <p className="font-display font-bold text-lg">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setActiveTestimonial((p) => (p - 1 + testimonials.length) % testimonials.length)}
                className="h-10 w-10 rounded-full border border-border/50 flex items-center justify-center hover:bg-secondary/50 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${index === activeTestimonial ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30"
                      }`}
                  />
                ))}
              </div>
              <button
                onClick={() => setActiveTestimonial((p) => (p + 1) % testimonials.length)}
                className="h-10 w-10 rounded-full border border-border/50 flex items-center justify-center hover:bg-secondary/50 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Nexus Synergy AI Section */}
      <section id="nexus-synergy" className="py-28 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />

        <div className="container relative mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Neural Visualization Side */}
            <div className="relative h-[400px] md:h-[500px] rounded-[2.5rem] bg-gradient-to-br from-white/5 to-white/0 border border-white/10 overflow-hidden group shadow-2xl">
              <div className="absolute inset-0 bg-grid-pattern opacity-10" />

              {/* Animated Neural Nodes */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="h-32 w-32 rounded-full border-2 border-primary/30 animate-ping opacity-20" />
                  <div className="absolute inset-0 h-32 w-32 rounded-full bg-primary/20 blur-xl animate-pulse" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="h-12 w-12 text-primary animate-float-slow" />
                  </div>

                  {/* Orbiting Elements */}
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute h-4 w-4 rounded-lg bg-accent/30 border border-accent/50 animate-orbit"
                      style={{
                        animationDelay: `${i * -2}s`,
                        animationDuration: '10s',
                        transform: `rotate(${i * 60}deg) translateX(120px)`
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Glass Stats Bar */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex justify-around">
                <div className="text-center">
                  <div className="text-xl font-bold font-display text-primary">0.4s</div>
                  <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Latency</div>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div className="text-center">
                  <div className="text-xl font-bold font-display text-accent">99.9%</div>
                  <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Accuracy</div>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div className="text-center">
                  <div className="text-xl font-bold font-display text-emerald-400">1.2M</div>
                  <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Syncs</div>
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div className="space-y-8 text-left">
              <div>
                <Badge variant="glow" className="mb-4">Advanced Infrastructure</Badge>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black font-display tracking-tight leading-none mb-6">
                  Nexus AI <br />
                  <span className="gradient-text">Synergy Engine</span>
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Our proprietary intelligence layer that synchronizes institutional data with industry trends in real-time. Experience the next generation of academic collaboration.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { title: "Predictive Placement", desc: "Forecast career trajectories with 94% precision.", icon: Rocket },
                  { title: "Smart MoU Auditing", desc: "Automated compliance and renewal forecasting.", icon: Shield },
                  { title: "Neural Skill Mapping", desc: "Discover hidden talent pools via graph-based matching.", icon: Zap },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link to="/login">
                  <Button variant="gradient" size="xl" className="px-10 group shadow-xl shadow-primary/20">
                    Initialize Nexus
                    <ArrowUpRight className="ml-2 h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="border-t border-border/30 py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/[0.02] to-transparent" />
        <div className="container relative mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
                <Building2 className="h-4 w-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg">
                Academia<span className="gradient-text">Connect</span> Pro
              </span>
            </div>
            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors relative group">
                Privacy
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-300" />
              </a>
              <a href="#" className="hover:text-foreground transition-colors relative group">
                Terms
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-300" />
              </a>
              <a href="#" className="hover:text-foreground transition-colors relative group">
                Support
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-300" />
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 ACP. Built for Academic Excellence.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
