import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  Building2, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  ArrowLeft,
  GraduationCap,
  Users,
  Briefcase,
  Shield,
  Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const roles = [
  { id: "admin", label: "Admin", icon: Shield, dbRole: "admin" },
  { id: "faculty", label: "Faculty", icon: GraduationCap, dbRole: "faculty" },
  { id: "student", label: "Student", icon: Users, dbRole: "student" },
];

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("student");
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Helper to get credentials for roles
  const getCredentials = (roleId: string) => {
    switch (roleId) {
      case "admin":
        return { email: "mohitbalaji2005@gmail.com", password: "12345678" };
      case "faculty":
        return { email: "mohitmjp04@gmail.com", password: "12345678" };
      case "student":
        return { email: "mohitbalaji.ec23@bitsathy.ac.in", password: "12345678" };
      default:
        return null;
    }
  };

  // Pre-fill credentials when role changes
  useState(() => {
    const creds = getCredentials(selectedRole);
    if (creds && isLogin) {
      setEmail(creds.email);
      setPassword(creds.password);
    }
  });

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    if (isLogin) {
      const creds = getCredentials(roleId);
      if (creds) {
        setEmail(creds.email);
        setPassword(creds.password);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Sign in
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });

        navigate("/dashboard");
      } else {
        // Sign up with role in metadata
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              full_name: fullName,
              role: selectedRole,
            },
          },
        });

        if (error) throw error;

        // Update the user role in the database
        if (data.user) {
          // The trigger will create default role, but we need to update it
          const roleValue = selectedRole as "admin" | "alumni" | "faculty" | "industry_partner" | "student";
          const { error: roleError } = await supabase
            .from("user_roles")
            .update({ role: roleValue })
            .eq("user_id", data.user.id);

          if (roleError) {
            console.error("Error updating role:", roleError);
          }

          // Update profile with full name
          const { error: profileError } = await supabase
            .from("profiles")
            .update({ full_name: fullName })
            .eq("user_id", data.user.id);

          if (profileError) {
            console.error("Error updating profile:", profileError);
          }
        }

        toast({
          title: "Account created!",
          description: "Please check your email to verify your account before signing in.",
        });

        setIsLogin(true);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: isLogin ? "Sign in failed" : "Sign up failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30" />
        <div className="absolute top-1/3 left-1/4 h-96 w-96 rounded-full bg-primary/30 blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/3 right-1/4 h-64 w-64 rounded-full bg-accent/30 blur-3xl" />
        
        <div className="relative z-10 flex flex-col justify-center p-12">
          <Link to="/" className="flex items-center gap-2 mb-12 group">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm text-muted-foreground">Back to Home</span>
          </Link>
          
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Building2 className="h-7 w-7 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-2xl">ICP</span>
          </div>
          
          <h1 className="text-4xl font-bold font-display mb-4">
            Welcome to the
            <br />
            <span className="gradient-text">Collaboration Hub</span>
          </h1>
          
          <p className="text-muted-foreground text-lg max-w-md">
            Connecting academia and industry for a brighter future. 
            Sign in to access your personalized dashboard.
          </p>
          
          <div className="mt-12 grid grid-cols-2 gap-4 max-w-md">
            {[
              { label: "Active Partners", value: "500+" },
              { label: "Students Placed", value: "10K+" },
            ].map((stat) => (
              <div key={stat.label} className="p-4 rounded-lg bg-card/50 backdrop-blur-xl border border-border/50">
                <p className="text-2xl font-bold font-display gradient-text">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-12">
        <Card variant="glass" className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex lg:hidden items-center justify-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Building2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl">ICP</span>
            </div>
            <CardTitle className="text-2xl font-display">
              {isLogin ? "Welcome Back" : "Create Account"}
            </CardTitle>
            <CardDescription>
              {isLogin 
                ? "Enter your credentials to access your dashboard" 
                : "Fill in your details to get started"
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
              <div className="space-y-2">
                <Label>Select Your Role</Label>
                <div className="grid grid-cols-3 gap-4">
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => handleRoleSelect(role.id)}
                      className={`flex flex-col items-center gap-1 p-3 rounded-lg border transition-all ${
                        selectedRole === role.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50 hover:bg-secondary/50"
                      }`}
                    >
                      <role.icon className="h-5 w-5" />
                      <span className="text-[10px] font-medium text-center leading-tight">
                        {role.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      variant="glass"
                      placeholder="Dr. John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required={!isLogin}
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      variant="glass"
                      placeholder="you@institution.edu"
                      className="pl-9"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    {isLogin && (
                      <a href="#" className="text-xs text-primary hover:underline">
                        Forgot password?
                      </a>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      variant="glass"
                      placeholder="••••••••"
                      className="pl-9 pr-9"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                variant="gradient" 
                className="w-full" 
                size="lg"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLogin ? "Sign In" : "Create Account"}
              </Button>

              {/* Toggle */}
              <p className="text-center text-sm text-muted-foreground">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary hover:underline font-medium"
                >
                  {isLogin ? "Sign Up" : "Sign In"}
                </button>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
