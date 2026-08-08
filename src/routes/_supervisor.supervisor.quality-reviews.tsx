import { createFileRoute } from "@tanstack/react-router";
import { ClipboardCheck } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { QUALITY_REVIEWS } from "@/lib/supervisor-data";
import { toast } from "sonner";

export const Route = createFileRoute("/_supervisor/supervisor/quality-reviews")({
  head: () => ({ meta: [{ title: "Matter Quality Reviews — Supervisor Dashboard" }] }),
  component: QualityReviewsPage,
});

function QualityReviewsPage() {
  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        eyebrow="Supervisor / Compliance & Quality"
        title="Matter Quality Reviews"
        description="Peer and supervisory sampling of solicitor work product — advice letters, evidence packs and decision rationale."
      />

      <Card className="surface-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-display flex items-center gap-2">
            <ClipboardCheck className="size-5 text-primary" /> Quality Sampling Queue
          </CardTitle>
          <CardDescription className="text-xs">
            {QUALITY_REVIEWS.filter((q) => q.status !== "completed").length} reviews open or scheduled.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-semibold">Matter</TableHead>
                <TableHead className="text-xs font-semibold">Solicitor</TableHead>
                <TableHead className="text-xs font-semibold">Reviewer</TableHead>
                <TableHead className="text-xs font-semibold">Score</TableHead>
                <TableHead className="text-xs font-semibold">Findings</TableHead>
                <TableHead className="text-xs font-semibold">Status</TableHead>
                <TableHead className="text-xs font-semibold text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {QUALITY_REVIEWS.map((q) => (
                <TableRow key={q.id} className="group hover:bg-muted/50">
                  <TableCell className="py-3">
                    <div className="font-semibold text-sm">{q.clientName}</div>
                    <div className="text-[0.7rem] font-mono text-muted-foreground">{q.matterId}</div>
                  </TableCell>
                  <TableCell className="py-3 text-xs">{q.solicitor}</TableCell>
                  <TableCell className="py-3 text-xs">{q.reviewer}</TableCell>
                  <TableCell className="py-3 text-xs font-semibold">{q.score != null ? `${q.score}%` : "—"}</TableCell>
                  <TableCell className="py-3 text-xs text-muted-foreground max-w-[240px]">{q.findings}</TableCell>
                  <TableCell className="py-3">
                    <Badge
                      variant={
                        q.status === "action_required"
                          ? "destructive"
                          : q.status === "completed"
                            ? "secondary"
                            : "default"
                      }
                      className="text-[0.65rem] capitalize"
                    >
                      {q.status.replace(/_/g, " ")}
                    </Badge>
                    <div className="text-[0.65rem] text-muted-foreground mt-1">{q.reviewedAt}</div>
                  </TableCell>
                  <TableCell className="py-3 text-right">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="text-xs"
                      onClick={() => toast.info("Quality review opened", { description: q.id })}
                    >
                      {q.status === "scheduled" ? "Start review" : "Open"}
                    </Button>
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
