import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SUPERVISOR_OVERRIDES } from "@/lib/supervisor-data";
import { toast } from "sonner";

export const Route = createFileRoute("/_supervisor/supervisor/ai-overrides")({
  head: () => ({ meta: [{ title: "AI Overrides — Supervisor Dashboard" }] }),
  component: AiOverridesPage,
});

function AiOverridesPage() {
  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        eyebrow="Supervisor / Case Oversight"
        title="AI Overrides"
        description="Solicitor overrides of the AI recommendation engine. SRA mandate requires supervising solicitor sign-off before advice is issued."
        actions={
          <Badge variant="outline" className="border-violet-500/40 text-violet-700 dark:text-violet-300 bg-violet-500/5">
            Human-in-the-loop
          </Badge>
        }
      />

      <Card className="surface-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-display flex items-center gap-2">
            <Sparkles className="size-5 text-violet-500" /> Override Sign-off Queue
          </CardTitle>
          <CardDescription className="text-xs">
            {SUPERVISOR_OVERRIDES.filter((o) => o.status === "awaiting_signoff" || o.status === "escalated").length} awaiting action.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-semibold">Matter</TableHead>
                <TableHead className="text-xs font-semibold">AI Recommendation</TableHead>
                <TableHead className="text-xs font-semibold">Override Solution</TableHead>
                <TableHead className="text-xs font-semibold">Reason</TableHead>
                <TableHead className="text-xs font-semibold">Status / SLA</TableHead>
                <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SUPERVISOR_OVERRIDES.map((o) => (
                <TableRow key={o.id} className="group hover:bg-muted/50">
                  <TableCell className="py-3">
                    <div className="font-semibold text-sm">{o.clientName}</div>
                    <div className="text-[0.7rem] font-mono text-muted-foreground">{o.matterId}</div>
                    <div className="text-[0.65rem] text-muted-foreground">{o.solicitor} · {o.submittedAt}</div>
                  </TableCell>
                  <TableCell className="py-3 text-xs text-muted-foreground">{o.aiRecommendation}</TableCell>
                  <TableCell className="py-3 text-xs font-semibold text-foreground">{o.overrideSolution}</TableCell>
                  <TableCell className="py-3 text-xs text-muted-foreground max-w-[240px]">{o.reason}</TableCell>
                  <TableCell className="py-3">
                    <Badge
                      variant={o.status === "signed_off" ? "secondary" : o.status === "escalated" ? "destructive" : "default"}
                      className="text-[0.65rem] capitalize"
                    >
                      {o.status.replace(/_/g, " ")}
                    </Badge>
                    <div className={`text-[0.65rem] mt-1 ${o.slaHoursRemaining <= 2 ? "text-rose-600 font-semibold" : "text-muted-foreground"}`}>
                      {o.slaHoursRemaining > 0 ? `${o.slaHoursRemaining}h SLA` : "SLA breached"}
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-right space-x-2">
                    {(o.status === "awaiting_signoff" || o.status === "escalated") && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs rounded-lg"
                          onClick={() => toast.message("Override returned", { description: `${o.id} sent back to solicitor.` })}
                        >
                          Return
                        </Button>
                        <Button
                          size="sm"
                          className="text-xs rounded-lg"
                          onClick={() => toast.success("Override signed off", { description: `${o.matterId} approved by supervisor.` })}
                        >
                          Sign off
                        </Button>
                      </>
                    )}
                    {o.status === "signed_off" && (
                      <Badge variant="outline" className="text-[0.65rem] text-emerald-700 border-emerald-500/30">Completed</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
