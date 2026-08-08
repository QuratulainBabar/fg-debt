import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Bell, Mail, MessageSquare, Send, PhoneCall } from "lucide-react";
import { REMINDER_SETTINGS } from "@/lib/admin-data";

export const Route = createFileRoute("/_admin/admin/reminder-settings")({
  head: () => ({ meta: [{ title: "Reminder Settings — FG Debt Advisor AI" }] }),
  component: AdminReminderSettingsPage,
});

function AdminReminderSettingsPage() {
  const channelIcons: Record<string, any> = {
    "Email": Mail,
    "SMS": PhoneCall,
    "In-app": Bell,
    "Email + SMS": Send,
    "In-app + Email": MessageSquare,
  };
  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        eyebrow="Admin / Operations"
        title="Reminder Settings"
        description="Configure multi-channel reminder cadence for client document requests, SLA breaches, supervisor escalations, and compliance training."
        actions={
          <Button className="rounded-xl gradient-deep text-primary-foreground shadow-soft">
            <Plus className="size-4 mr-1.5" /> New Reminder
          </Button>
        }
      />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {[
          { label: "Reminders Configured", value: REMINDER_SETTINGS.length, icon: Bell, color: "primary" },
          { label: "Sent (Last 7 days)", value: REMINDER_SETTINGS.reduce((a, r) => a + r.sentLast7d, 0).toLocaleString(), icon: Send, color: "blue" },
          { label: "Channels Enabled", value: 4, icon: MessageSquare, color: "emerald" },
          { label: "Disabled Rules", value: REMINDER_SETTINGS.filter(r => !r.enabled).length, icon: Bell, color: "amber" },
        ].map((s) => (
          <Card key={s.label} className="surface-card">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`grid size-10 place-items-center rounded-xl border ${
                s.color === "primary" ? "bg-primary/10 text-primary border-primary/20" :
                s.color === "blue" ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
                s.color === "emerald" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                "bg-amber-500/10 text-amber-600 border-amber-500/20"
              }`}>
                <s.icon className="size-5" />
              </div>
              <div>
                <div className="text-xl font-display font-bold">{s.value}</div>
                <div className="text-xs text-muted-foreground font-semibold">{s.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="surface-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-display">Reminder Policies</CardTitle>
          <CardDescription className="text-xs">Manage cadence, delivery channels and reminder rules.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {REMINDER_SETTINGS.map((r) => {
              const parts = r.channel.split(" ");
              return (
                <div key={r.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-muted/30 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-foreground">{r.name}</span>
                      <Badge variant="outline" className="text-[0.6rem] font-mono">{r.id}</Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        {parts.filter(p => channelIcons[p]).map((p) => {
                          const Icon = channelIcons[p];
                          return <Icon key={p} className="size-3.5" />;
                        })}
                        <span>{r.channel}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Cadence: {r.interval}</span>
                      <Badge variant="secondary" className="text-[0.65rem]">{r.sentLast7d.toLocaleString()} sent · 7d</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Switch checked={r.enabled} />
                    <Button variant="outline" size="sm" className="rounded-lg text-xs">Configure</Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
