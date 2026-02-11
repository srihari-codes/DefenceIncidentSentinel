import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon, Moon, Sun, Bell, Mail, ShieldCheck, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Settings() {
  const [isDark, setIsDark] = useState(false);
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    caseUpdates: true,
    systemNotifications: false
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const isDarkMode = root.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const root = window.document.documentElement;
    root.classList.toggle("dark");
    setIsDark(!isDark);
  };

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-foreground">Settings</h2>
        <SettingsIcon className="h-8 w-8 text-primary" />
      </div>

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <p className="text-sm text-muted-foreground">
            Customize the look and feel of the dashboard
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isDark ? (
                <Moon className="h-5 w-5 text-primary" />
              ) : (
                <Sun className="h-5 w-5 text-primary" />
              )}
              <div>
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  {isDark ? "Currently using dark theme" : "Currently using light theme"}
                </p>
              </div>
            </div>
            <Switch
              id="dark-mode"
              checked={isDark}
              onCheckedChange={toggleTheme}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage how you receive updates and alerts
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="email-alerts">Email Alerts</Label>
                <p className="text-xs text-muted-foreground">Receive critical alerts via email</p>
              </div>
            </div>
            <Switch
              id="email-alerts"
              checked={notifications.emailAlerts}
              onCheckedChange={(val) => setNotifications({...notifications, emailAlerts: val})}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="case-updates">Case Updates</Label>
                <p className="text-xs text-muted-foreground">Notification when case status changes</p>
              </div>
            </div>
            <Switch
              id="case-updates"
              checked={notifications.caseUpdates}
              onCheckedChange={(val) => setNotifications({...notifications, caseUpdates: val})}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="sys-notif">System Notifications</Label>
                <p className="text-xs text-muted-foreground">Technical updates and maintenance</p>
              </div>
            </div>
            <Switch
              id="sys-notif"
              checked={notifications.systemNotifications}
              onCheckedChange={(val) => setNotifications({...notifications, systemNotifications: val})}
            />
          </div>
        </CardContent>
      </Card>

      {/* Other Settings */}
      <Card>
        <CardHeader>
          <CardTitle>System Preferences</CardTitle>
          <p className="text-sm text-muted-foreground">
            Additional security and system settings
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground italic">Backend integration required for session management and 2FA settings.</p>
          <div className="pt-4 flex justify-end">
            <Button className="gap-2" onClick={handleSave}>
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

