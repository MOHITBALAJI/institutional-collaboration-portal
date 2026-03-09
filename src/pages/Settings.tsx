import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { User, Bell, Shield, Palette, Save, Loader2 } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";

export default function Settings() {
  const { toast } = useToast();
  const { profile, loading, refetch } = useUserRole();
  const [saving, setSaving] = useState(false);

  const [profileData, setProfileData] = useState({
    full_name: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    bio: "",
  });

  const [notifications, setNotifications] = useState({
    email_mou: true,
    email_internship: true,
    email_events: false,
    push_all: true,
  });

  // Initialize state from profile
  useEffect(() => {
    if (profile) {
      setProfileData({
        full_name: profile.full_name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        department: profile.department || "",
        designation: profile.designation || "",
        bio: profile.bio || "",
      });

      if (profile.preferences?.notifications) {
        setNotifications(profile.preferences.notifications);
      }
    }
  }, [profile]);

  // Realtime subscription
  useEffect(() => {
    if (!profile?.user_id) return;

    const channel = supabase
      .channel('public:profiles')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'profiles',
        filter: `user_id=eq.${profile.user_id}`
      }, (payload) => {
        console.log('Realtime profile update:', payload);
        refetch();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.user_id, refetch]);

  const handleSaveProfile = async () => {
    if (!profile?.user_id) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('user_id', profile.user_id);

      if (error) throw error;

      toast({ title: "Profile Updated", description: "Your profile has been saved successfully." });
    } catch (error: any) {
      toast({ title: "Update Failed", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    if (!profile?.user_id) return;

    try {
      setSaving(true);
      const updatedPreferences = {
        ...(profile.preferences || {}),
        notifications
      };

      const { error } = await supabase
        .from('profiles' as any)
        .update({ preferences: updatedPreferences })
        .eq('user_id', profile.user_id);

      if (error) throw error;

      toast({ title: "Notifications Updated", description: "Your notification preferences have been saved." });
    } catch (error: any) {
      toast({ title: "Update Failed", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading && !profile) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold font-display">
            <span className="gradient-text">Settings</span>
          </h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-secondary">
            <TabsTrigger value="profile"><User className="h-4 w-4 mr-2" />Profile</TabsTrigger>
            <TabsTrigger value="notifications"><Bell className="h-4 w-4 mr-2" />Notifications</TabsTrigger>
            <TabsTrigger value="security"><Shield className="h-4 w-4 mr-2" />Security</TabsTrigger>
            <TabsTrigger value="appearance"><Palette className="h-4 w-4 mr-2" />Appearance</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input value={profileData.full_name} onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" value={profileData.email} disabled className="bg-muted opacity-70" />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Input value={profileData.department} onChange={(e) => setProfileData({ ...profileData, department: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Designation</Label>
                    <Input value={profileData.designation} onChange={(e) => setProfileData({ ...profileData, designation: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Bio</Label>
                  <Textarea value={profileData.bio} onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })} rows={3} />
                </div>
                <Button variant="gradient" onClick={handleSaveProfile} disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose what notifications you receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div><Label>MoU Updates</Label><p className="text-sm text-muted-foreground">Get notified about MoU status changes</p></div>
                    <Switch checked={notifications.email_mou} onCheckedChange={(c) => setNotifications({ ...notifications, email_mou: c })} />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div><Label>Internship Alerts</Label><p className="text-sm text-muted-foreground">New internship postings and applications</p></div>
                    <Switch checked={notifications.email_internship} onCheckedChange={(c) => setNotifications({ ...notifications, email_internship: c })} />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div><Label>Event Reminders</Label><p className="text-sm text-muted-foreground">Upcoming events and registrations</p></div>
                    <Switch checked={notifications.email_events} onCheckedChange={(c) => setNotifications({ ...notifications, email_events: c })} />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div><Label>Push Notifications</Label><p className="text-sm text-muted-foreground">Receive push notifications</p></div>
                    <Switch checked={notifications.push_all} onCheckedChange={(c) => setNotifications({ ...notifications, push_all: c })} />
                  </div>
                </div>
                <Button variant="gradient" onClick={handleSaveNotifications} disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Account Recovery</Label>
                    <p className="text-sm text-muted-foreground">Password reset emails will be sent to your registered email address.</p>
                  </div>
                  <Button variant="outline" onClick={() => {
                    supabase.auth.resetPasswordForEmail(profileData.email);
                    toast({ title: "Reset Email Sent", description: "Standard recovery process initiated." });
                  }}>Send Reset Link</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize the look and feel (Coming Soon)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select defaultValue="dark" disabled>
                    <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
