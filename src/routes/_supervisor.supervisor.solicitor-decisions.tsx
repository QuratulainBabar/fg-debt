import { createFileRoute } from "@tanstack/react-router";
import { Scale } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SOLICITOR_DECISIONS } from "@/lib/supervisor-data";
import { toast } from "sonner";

export const Route = createFileRoute("/_supervisor/supervisor/solicitor-decisions")({
  head: () => ({ meta: [{ title: "Solicitor Decisions — Supervisor Dashboard" }] }),
  component: SolicitorDecisionsPage,
});

function SolicitorDecisionsPage() {
  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        eyebrow="Supervisor / Case Oversight"
        title="Solicitor Decisions"
        description="Review recent solicitor approve, amend, reject and override decisions — including those requiring supervisor countersignature."
      />

      <Card className="surface-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-display flex items-center gap-2">
            <Scale className="size-5 text-primary" /> Decision Trail
          </CardTitle>
          <CardDescription className="text-xs">
            {SOLICITOR_DECISIONS.filter((d) => d.requiresSupervisorReview).length} decisions flagged for supervisor review.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-semibold">Matter</TableHead>
                <TableHead className="text-xs font-semibold">Solicitor</TableHead>
                <TableHead className="text-xs font-semibold">Outcome</TableHead>
                <TableHead className="text-xs font-semibold">AI → Final</TableHead>
                <TableHead className="text-xs font-semibold">Notes</TableHead>
                <TableHead className="text-xs font-semibold text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SOLICITOR_DECISIONS.map((d) => (
                <TableRow key={d.id} className="group hover:bg-muted/50">
                  <TableCell className="py-3">
                    <div className="font-semibold text-sm">{d.clientName}</div>
                    <div className="text-[0.7rem] font-mono text-muted-foreground">{d.matterId}</div>
                    <div className="text-[0.65rem] text-muted-foreground mt-0.5">{d.decidedAt}</div>
                  </TableCell>
                  <TableCell className="py-3 text-xs">{d.solicitor}</TableCell>
                  <TableCell className="py-3">
                    <div className="flex flex-col gap-1 items-start">
                      <Badge
                        variant={
                          d.outcome === "override"
                            ? "destructive"
                            : d.outcome === "reject"
                              ? "secondary"
                              : "default"
                        }
                        className="text-[0.65rem] capitalize"
                      >
                        {d.outcome}
                      </Badge>
                      {d.requiresSupervisorReview && (
                        <Badge variant="outline" className="text-[0.62rem] border-violet-500/40 text-violet-700 dark:text-violet-300">
                          Supervisor review
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-xs">
                    <div className="text-muted-foreground">{d.aiRecommendation}</div>
                    <div className="font-medium">{d.finalSolution}</div>
                  </TableCell>
                  <TableCell className="py-3 text-xs text-muted-foreground max-w-[220px]">{d.notes}</TableCell>
                  <TableCell className="py-3 text-right">
                    {d.requiresSupervisorReview ? (
                      <Button
                        size="sm"
                        className="text-xs rounded-lg"
                        onClick={() => toast.success("Decision acknowledged", { description: `${d.matterId} reviewed by supervisor.` })}
                      >
                        Acknowledge
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" className="text-xs rounded-lg" onClick={() => toast.info("Logged as reviewed")}>
                        Mark seen
                      </Button>
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
