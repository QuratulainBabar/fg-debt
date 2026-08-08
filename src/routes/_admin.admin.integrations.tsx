import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Network, CheckCircle2, AlertTriangle, XCircle, RefreshCcw, Settings as SettingsIcon } from "lucide-react";
import { INTEGRATIONS } from "@/lib/admin-data";

export const Route = createFileRoute("/_admin/admin/integrations")({
  head: () => ({ meta: [{ title: "Integrations — FG Debt Advisor AI" }] }),
  component: AdminIntegrationsPage,
});

function AdminIntegrationsPage() {
  const statusInfo: Record<string, { label: string; styles: string; icon: any }> = {
    operational: { label: "Operational", styles: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30", icon: CheckCircle2 },
    degraded: { label: "Degraded", styles: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30", icon: AlertTriangle },
    offline: { label: "Offline", styles: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30", icon: XCircle },
  };
  const uptimePct = (s: string) => parseFloat(s.replace("%", ""));

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        eyebrow="Admin / Integrations & Reporting"
        title="Integrations"
        description="Monitor and configure regulatory APIs, credit reference agencies, HMRC, Insolvency Service, OCR pipelines, Gov Notify, and SRA compliance registers."
        actions={
          <Button className="rounded-xl gradient-deep text-primary-foreground shadow-soft">
            <Plus className="size-4 mr-1.5" /> Add Integration
          </Button>
        }
      />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {[
          { label: "Total Integrations", value: INTEGRATIONS.length, icon: Network, color: "primary" },
          { label: "Operational", value: INTEGRATIONS.filter(i => i.status === "operational").length, icon: CheckCircle2, color: "emerald" },
          { label: "Degraded", value: INTEGRATIONS.filter(i => i.status === "degraded").length, icon: AlertTriangle, color: "amber" },
          { label: "Offline", value: INTEGRATIONS.filter(i => i.status === "offline").length, icon: XCircle, color: "rose" },
        ].map((s) => (
          <Card key={s.label} className="surface-card">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`grid size-10 place-items-center rounded-xl border ${
                s.color === "primary" ? "bg-primary/10 text-primary border-primary/20" :
                s.color === "emerald" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                s.color === "amber" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                "bg-rose-500/10 text-rose-600 border-rose-500/20"
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {INTEGRATIONS.map((i) => {
          const info = statusInfo[i.status];
          const StatusIcon = info.icon;
          return (
            <Card key={i.id} className={`surface-card ${i.status !== "operational" ? "ring-1 ring-rose-500/20" : ""}`}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-sm font-display">{i.name}</CardTitle>
                      <Badge variant="outline" className={`text-[0.6rem] border capitalize ${info.styles}`}>
                        <StatusIcon className="size-3 mr-1" /> {info.label}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs mt-0.5">{i.category}</CardDescription>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="size-7"><RefreshCcw className="size-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="size-7"><SettingsIcon className="size-3.5" /></Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Uptime (30d)</span>
                    <span className="font-semibold">{i.uptime}</span>
                  </div>
                  <Progress
                    value={uptimePct(i.uptime)}
                    className={`h-1.5 ${i.status === "offline" ? "!bg-rose-100 dark:!bg-rose-900/30" : i.status === "degraded" ? "!bg-amber-100 dark:!bg-amber-900/30" : ""}`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-border">
                  <div>
                    <div className="text-muted-foreground">Last sync</div>
                    <div className="font-semibold mt-0.5">{i.lastSync}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Latency</div>
                    <div className="font-semibold mt-0.5">{i.latency ?? "N/A"}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
