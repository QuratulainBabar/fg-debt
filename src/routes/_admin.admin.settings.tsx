import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Save, Cog, Shield, Mail, Palette, Database, Bell, KeyRound } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/settings")({
  head: () => ({ meta: [{ title: "System Settings — FG Debt Advisor AI" }] }),
  component: AdminSettingsPage,
});

function AdminSettingsPage() {
  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        eyebrow="Admin / Platform"
        title="System Settings"
        description="Configure platform-level branding, security, notifications, data retention, and deployment environment settings."
        actions={
          <Button className="rounded-xl gradient-deep text-primary-foreground shadow-soft">
            <Save className="size-4 mr-1.5" /> Save Changes
          </Button>
        }
      />
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="w-full sm:w-auto inline-flex h-auto p-1 mb-6">
          <TabsTrigger value="general" className="text-xs px-3.5 py-2 data-[state=active]:shadow-soft">
            <Cog className="size-3.5 mr-1.5" /> General
          </TabsTrigger>
          <TabsTrigger value="branding" className="text-xs px-3.5 py-2 data-[state=active]:shadow-soft">
            <Palette className="size-3.5 mr-1.5" /> Branding
          </TabsTrigger>
          <TabsTrigger value="security" className="text-xs px-3.5 py-2 data-[state=active]:shadow-soft">
            <Shield className="size-3.5 mr-1.5" /> Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs px-3.5 py-2 data-[state=active]:shadow-soft">
            <Bell className="size-3.5 mr-1.5" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="data" className="text-xs px-3.5 py-2 data-[state=active]:shadow-soft">
            <Database className="size-3.5 mr-1.5" /> Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 mt-0">
          <Card className="surface-card">
            <CardHeader>
              <CardTitle className="text-base font-display">Platform Identity</CardTitle>
              <CardDescription className="text-xs">Core platform configuration applied globally.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="pname" className="text-xs">Platform Name</Label>
                  <Input id="pname" defaultValue="FG Debt Advisor AI" className="h-9 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pdomain" className="text-xs">Primary Domain</Label>
                  <Input id="pdomain" defaultValue="portal.fgdebtadvisor.co.uk" className="h-9 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminmail" className="text-xs">Administrator Contact Email</Label>
                  <Input id="adminmail" defaultValue="admin@fgdebtadvisor.co.uk" className="h-9 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="srareg" className="text-xs">SRA Registration Number</Label>
                  <Input id="srareg" defaultValue="629104" className="h-9 rounded-xl font-mono" />
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                {[
                  { label: "Enable Client Self-Service Registration", desc: "Allow public clients to start debt assessments.", def: true },
                  { label: "Solicitor Manual Matter Assignment", desc: "Disable auto-assignment workflows for new matters.", def: false },
                  { label: "Platform Maintenance Banner", desc: "Show upcoming maintenance notice banner to all users.", def: false },
                  { label: "Beta AI Features for Supervisors", desc: "Enable experimental triage features for supervisors only.", def: true },
                ].map((t, i) => (
                  <div key={i} className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold text-foreground">{t.label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{t.desc}</div>
                    </div>
                    <Switch defaultChecked={t.def} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="space-y-6 mt-0">
          <Card className="surface-card">
            <CardHeader>
              <CardTitle className="text-base font-display">Brand & Appearance</CardTitle>
              <CardDescription className="text-xs">Customise logos, colours, email templates and client-facing copy.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: "Midnight Blue", hex: "#1C2B48", primary: true },
                  { title: "Cool Cerulean", hex: "#8EB1D1" },
                  { title: "Baby Blue Eyes", hex: "#A7C7E7" },
                ].map((c) => (
                  <div key={c.hex} className="p-3 rounded-xl border border-border">
                    <div className="h-16 rounded-lg mb-2.5 border border-border" style={{ backgroundColor: c.hex }} />
                    <div className="text-xs font-semibold">{c.title}</div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-[0.65rem] font-mono text-muted-foreground">{c.hex}</span>
                      {c.primary && <Badge variant="outline" className="text-[0.55rem] border-primary/40 text-primary">Active</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6 mt-0">
          <Card className="surface-card">
            <CardHeader>
              <CardTitle className="text-base font-display flex items-center gap-2">
                <KeyRound className="size-4 text-primary" />
                Authentication & Access Control
              </CardTitle>
              <CardDescription className="text-xs">SRA-mandated security controls for user access management.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Two-Factor Authentication", desc: "Require TOTP 2FA for all solicitor and admin logins.", def: true },
                { label: "Single Sign-On (SAML)", desc: "Azure AD / Okta enterprise SSO integration.", def: false },
                { label: "Session Timeout (30 min)", desc: "Auto-logout idle users after 30 minutes.", def: true },
                { label: "IP Whitelisting (Solicitor)", desc: "Restrict solicitor access to office VPN ranges.", def: false },
                { label: "Password Expiry (90 days)", desc: "Enforce password rotation for admin users.", def: true },
              ].map((t, i) => (
                <div key={i} className="flex items-center justify-between gap-4 py-1">
                  <div>
                    <div className="text-sm font-semibold text-foreground">{t.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{t.desc}</div>
                  </div>
                  <Switch defaultChecked={t.def} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6 mt-0">
          <Card className="surface-card">
            <CardHeader>
              <CardTitle className="text-base font-display flex items-center gap-2">
                <Mail className="size-4 text-primary" />
                Notification Channels
              </CardTitle>
              <CardDescription className="text-xs">Email, SMS and in-app delivery configuration for users.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Gov.uk Notify — Email", desc: "DEL-7452832 — 98.4% deliverability", def: true },
                { label: "Gov.uk Notify — SMS", desc: "DEL-7452833 — UK mobile numbers only", def: true },
                { label: "In-app Push Notifications", desc: "Service Worker / PWA delivery", def: true },
                { label: "Slack Admin Alert Channel", desc: "#fg-platform-alerts", def: false },
              ].map((t, i) => (
                <div key={i} className="flex items-center justify-between gap-4 py-1">
                  <div>
                    <div className="text-sm font-semibold text-foreground">{t.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{t.desc}</div>
                  </div>
                  <Switch defaultChecked={t.def} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6 mt-0">
          <Card className="surface-card">
            <CardHeader>
              <CardTitle className="text-base font-display flex items-center gap-2">
                <Database className="size-4 text-primary" />
                Data Retention & Privacy
              </CardTitle>
              <CardDescription className="text-xs">GDPR and data protection schedule for client records.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Matter Document Retention (7 years)", desc: "Post-completion archival per SRA Accounts Rules.", def: true },
                { label: "GDPR Right to Erasure Queue", desc: "Auto-forward deletion requests to data controller.", def: true },
                { label: "Cross-Border Data Transfer (UK/EEA)", desc: "IDTA adequacy coverage enabled.", def: true },
                { label: "Automated Backups (Hourly)", desc: "Encrypted offsite replication to secondary region.", def: true },
              ].map((t, i) => (
                <div key={i} className="flex items-center justify-between gap-4 py-1">
                  <div>
                    <div className="text-sm font-semibold text-foreground">{t.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{t.desc}</div>
                  </div>
                  <Switch defaultChecked={t.def} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
