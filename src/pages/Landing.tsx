import { useState } from "react";
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
  ChevronRight
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "MoU Management",
    description: "Digital lifecycle management with automated renewals and compliance tracking",
  },
  {
    icon: Briefcase,
    title: "Internship Exchange",
    description: "Connect students with industry opportunities through smart matching",
  },
  {
    icon: GraduationCap,
    title: "Research Hub",
    description: "Manage collaborative research, patents, and funding in one place",
  },
  {
    icon: Users,
    title: "Alumni Network",
    description: "Build lasting mentorship connections between alumni and students",
  },
  {
    icon: BarChart3,
    title: "Impact Analytics",
    description: "Track skill gaps, placement trends, and collaboration outcomes",
  },
  {
    icon: Calendar,
    title: "Event Management",
    description: "Workshops, hackathons, and guest lectures with QR attendance",
  },
];

const stats = [
  { value: "500+", label: "Industry Partners" },
  { value: "10,000+", label: "Students Placed" },
  { value: "95%", label: "Satisfaction Rate" },
  { value: "200+", label: "Active MoUs" },
];

export default function Landing() {
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl">ICP</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</a>
            <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/login">
              <Button variant="gradient">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30" />
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
        
        <div className="container relative mx-auto px-4 text-center">
          <Badge variant="glow" className="mb-6 animate-fade-in">
            <Zap className="mr-1 h-3 w-3" />
            Bridging Academia & Industry
          </Badge>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-display mb-6 animate-slide-up">
            Industrial Collaboration
            <br />
            <span className="gradient-text">Portal</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: "100ms" }}>
            A unified platform connecting educational institutions, industries, faculty, 
            students, and alumni into a powerful ecosystem for growth and innovation.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: "200ms" }}>
            <Link to="/dashboard">
              <Button variant="gradient" size="xl" className="group">
                Explore Dashboard
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button variant="outline" size="xl">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={stat.label} 
                className="text-center animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <p className="text-3xl md:text-4xl font-bold font-display gradient-text mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A comprehensive suite of tools designed to streamline industry-academia collaboration
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={feature.title} 
                variant="glow" 
                className="group cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="flex items-center gap-2">
                    {feature.title}
                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">User Roles</Badge>
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
              Built for Everyone
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Dedicated dashboards and features for each stakeholder
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { icon: Shield, title: "College Admin", color: "text-primary" },
              { icon: Building2, title: "Industry Partner", color: "text-accent" },
              { icon: GraduationCap, title: "Faculty", color: "text-success" },
              { icon: Users, title: "Student", color: "text-warning" },
              { icon: Briefcase, title: "Alumni", color: "text-destructive" },
            ].map((role, index) => (
              <Card 
                key={role.title} 
                variant="glass" 
                className="text-center p-6 hover:border-primary/30 transition-colors animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-card mx-auto mb-4 ${role.color}`}>
                  <role.icon className="h-7 w-7" />
                </div>
                <h3 className="font-semibold">{role.title}</h3>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card variant="gradient" className="relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-10" />
            <CardContent className="relative p-8 md:p-12 text-center">
              <Globe className="h-12 w-12 mx-auto mb-6 text-primary" />
              <h2 className="text-2xl md:text-3xl font-bold font-display mb-4">
                Ready to Transform Your Institution?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                Join hundreds of institutions already using ICP to bridge the gap 
                between education and industry.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <Input
                  variant="glass"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                />
                <Button variant="gradient">Request Demo</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Building2 className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold">Industrial Collaboration Portal</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 ICP. Built for Academic Excellence.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
