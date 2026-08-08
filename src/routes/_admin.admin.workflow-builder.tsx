import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Plus, Workflow, ArrowRight, Play, Pause, Copy, Clock } from "lucide-react";
import { WORKFLOWS } from "@/lib/admin-data";

export const Route = createFileRoute("/_admin/admin/workflow-builder")({
  head: () => ({ meta: [{ title: "Workflow Builder — FG Debt Advisor AI" }] }),
  component: AdminWorkflowPage,
});

function AdminWorkflowPage() {
  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        eyebrow="Admin / Operations"
        title="Workflow Builder"
        description="Design and orchestrate no-code automation workflows for matter assignment, escalation, reminders, and compliance sign-off routing."
        actions={
          <Button className="rounded-xl gradient-deep text-primary-foreground shadow-soft">
            <Plus className="size-4 mr-1.5" /> New Workflow
          </Button>
        }
      />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {[
          { label: "Workflows", value: WORKFLOWS.length, icon: Workflow, color: "primary" },
          { label: "Enabled", value: WORKFLOWS.filter(w => w.enabled).length, icon: Play, color: "emerald" },
          { label: "Runs Last 24h", value: 847, icon: Clock, color: "blue" },
          { label: "Avg Success", value: "98.2%", icon: Progress, color: "purple" },
        ].map((s) => (
          <Card key={s.label} className="surface-card">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`grid size-10 place-items-center rounded-xl border ${
                s.color === "primary" ? "bg-primary/10 text-primary border-primary/20" :
                s.color === "emerald" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                s.color === "blue" ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
                "bg-purple-500/10 text-purple-600 border-purple-500/20"
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {WORKFLOWS.map((w) => (
          <Card key={w.id} className="surface-card">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-sm font-display">{w.name}</CardTitle>
                    <Badge variant="outline" className="text-[0.6rem] font-mono">{w.id}</Badge>
                  </div>
                  <CardDescription className="text-xs mt-0.5">Trigger: {w.trigger}</CardDescription>
                </div>
                <Switch checked={w.enabled} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-muted/40 border border-border">
                <div className="flex items-center gap-2 text-xs flex-1 min-w-0">
                  <div className="grid size-7 place-items-center rounded-md bg-primary/10 border border-primary/20 text-primary shrink-0">
                    <span className="text-[0.6rem] font-bold">1</span>
                  </div>
                  <span className="font-semibold truncate">Trigger fired</span>
                </div>
                <ArrowRight className="size-3.5 text-muted-foreground shrink-0 mx-1" />
                <div className="flex items-center gap-2 text-xs flex-1 min-w-0">
                  <div className="grid size-7 place-items-center rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-600 shrink-0">
                    <span className="text-[0.6rem] font-bold">2</span>
                  </div>
                  <span className="font-semibold truncate">Condition check</span>
                </div>
                <ArrowRight className="size-3.5 text-muted-foreground shrink-0 mx-1" />
                <div className="flex items-center gap-2 text-xs flex-1 min-w-0">
                  <div className="grid size-7 place-items-center rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 shrink-0">
                    <span className="text-[0.6rem] font-bold">{w.steps}</span>
                  </div>
                  <span className="font-semibold truncate">Complete</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-border">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="size-3.5" /> Last run: {w.lastRun}
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="size-7"><Play className="size-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="size-7"><Copy className="size-3.5" /></Button>
                  <Button variant="outline" size="sm" className="rounded-lg h-7 text-xs">Edit</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
