import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bell, Shield, Key, Mail, Save } from 'lucide-react';

export function SettingsPage() {
  return (
    <div className="p-8 space-y-6 max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground mt-2">Manage your platform preferences and integrations.</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-primary" /> Profile Settings</CardTitle>
            <CardDescription>Manage your account details and display name.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Display Name</label>
              <Input defaultValue="Ocular DevEx User" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" defaultValue="admin@netflix.com" disabled />
            </div>
            <Button><Save className="h-4 w-4 mr-2" /> Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-primary" /> Alert Preferences</CardTitle>
            <CardDescription>Configure how you receive system alerts and anomalies.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Email Alerts</div>
                  <div className="text-sm text-muted-foreground">Receive critical alerts via email.</div>
                </div>
              </div>
              <Button variant="outline">Configured</Button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="h-5 w-5 bg-[#36C5F0] rounded mask mask-squircle flex items-center justify-center text-white font-bold text-[10px]">Slack</div>
                <div>
                  <div className="font-medium">Slack Integration</div>
                  <div className="text-sm text-muted-foreground">Route alerts to #eng-ops channel.</div>
                </div>
              </div>
              <Button variant="secondary">Configure</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Key className="h-5 w-5 text-primary" /> API Keys</CardTitle>
            <CardDescription>Manage API keys for programmatic access.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border bg-card text-card-foreground">
              <div className="p-4 border-b flex justify-between items-center">
                <div>
                  <p className="font-medium">Production Token</p>
                  <p className="text-xs text-muted-foreground">Created: Jan 12, 2026</p>
                </div>
                <Button variant="destructive" size="sm">Revoke</Button>
              </div>
              <div className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">CI/CD Integration</p>
                  <p className="text-xs text-muted-foreground">Created: Feb 04, 2026</p>
                </div>
                <Button variant="destructive" size="sm">Revoke</Button>
              </div>
              <div className="p-4 bg-muted/50 rounded-b-lg">
                <Button variant="outline" className="w-full bg-background"><Plus className="h-4 w-4 mr-2" /> Generate New Key</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Temporary local import for plus icon, as it was not imported at the top
import { Plus } from 'lucide-react';
