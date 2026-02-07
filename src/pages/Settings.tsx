import { useState } from "react";
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
import { User, Bell, Shield, Palette, Globe, Save } from "lucide-react";

export default function Settings() {
  const { toast } = useToast();
  const [profile, setProfile] = useState({
    full_name: "Dr. Priya Sharma",
    email: "priya.sharma@college.edu",
    phone: "+91 9876543210",
    department: "Computer Science",
    designation: "HOD & Professor",
    bio: "Experienced academic with 15+ years in industry-academia collaboration.",
  });

  const [notifications, setNotifications] = useState({
    email_mou: true,
    email_internship: true,
    email_events: false,
    push_all: true,
  });

  const handleSaveProfile = () => {
    toast({ title: "Profile Updated", description: "Your profile has been saved successfully." });
  };

  const handleSaveNotifications = () => {
    toast({ title: "Notifications Updated", description: "Your notification preferences have been saved." });
  };

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
                    <Input value={profile.full_name} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Input value={profile.department} onChange={(e) => setProfile({ ...profile, department: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Designation</Label>
                    <Input value={profile.designation} onChange={(e) => setProfile({ ...profile, designation: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Bio</Label>
                  <Textarea value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} rows={3} />
                </div>
                <Button variant="gradient" onClick={handleSaveProfile}><Save className="h-4 w-4 mr-2" />Save Changes</Button>
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
                <Button variant="gradient" onClick={handleSaveNotifications}><Save className="h-4 w-4 mr-2" />Save Preferences</Button>
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
                    <Label>Current Password</Label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm New Password</Label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                </div>
                <Button variant="gradient"><Save className="h-4 w-4 mr-2" />Update Password</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize the look and feel</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select defaultValue="dark">
                    <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
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
