import { createFileRoute } from "@tanstack/react-router";
import { TriangleAlert } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { COMPLIANCE_ALERTS } from "@/lib/supervisor-data";
import { toast } from "sonner";

export const Route = createFileRoute("/_supervisor/supervisor/compliance")({
  head: () => ({ meta: [{ title: "Compliance Issues — Supervisor Dashboard" }] }),
  component: ComplianceIssuesPage,
});

function ComplianceIssuesPage() {
  const open = COMPLIANCE_ALERTS.filter((a) => !a.resolved);

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        eyebrow="Supervisor / Compliance & Quality"
        title="Compliance Issues"
        description="SRA, FCA and vulnerability compliance alerts assigned for supervising solicitor review and resolution."
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {[
          { label: "Open", value: open.length, color: "rose" },
          { label: "Critical", value: open.filter((a) => a.severity === "critical").length, color: "rose" },
          { label: "High", value: open.filter((a) => a.severity === "high").length, color: "amber" },
          { label: "Resolved", value: COMPLIANCE_ALERTS.filter((a) => a.resolved).length, color: "emerald" },
        ].map((s) => (
          <Card key={s.label} className="surface-card">
            <CardContent className="p-4">
              <div className="text-xl font-display font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground font-semibold">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="surface-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-display flex items-center gap-2">
            <TriangleAlert className="size-5 text-amber-500" /> Compliance Alert Register
          </CardTitle>
          <CardDescription className="text-xs">Open and recently resolved regulatory alerts.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-semibold w-24">Severity</TableHead>
                <TableHead className="text-xs font-semibold">Alert</TableHead>
                <TableHead className="text-xs font-semibold">Matter</TableHead>
                <TableHead className="text-xs font-semibold">Assignee</TableHead>
                <TableHead className="text-xs font-semibold">Time</TableHead>
                <TableHead className="text-xs font-semibold text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {COMPLIANCE_ALERTS.map((a) => (
                <TableRow key={a.id} className={`group hover:bg-muted/50 ${a.resolved ? "opacity-60" : ""}`}>
                  <TableCell className="py-3">
                    <Badge
                      variant={a.severity === "critical" ? "destructive" : a.severity === "high" ? "default" : "secondary"}
                      className="text-[0.65rem] capitalize"
                    >
                      {a.severity}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="text-xs font-semibold">{a.type}</div>
                    <div className="text-[0.7rem] text-muted-foreground mt-0.5 leading-relaxed">{a.message}</div>
                  </TableCell>
                  <TableCell className="py-3 text-xs font-mono text-primary">{a.matterId ?? "—"}</TableCell>
                  <TableCell className="py-3 text-xs">{a.assignee ?? "Unassigned"}</TableCell>
                  <TableCell className="py-3 text-xs text-muted-foreground whitespace-nowrap">{a.timestamp}</TableCell>
                  <TableCell className="py-3 text-right">
                    {!a.resolved ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="text-xs"
                        onClick={() => toast.success("Alert marked in progress", { description: a.id })}
                      >
                        Take ownership
                      </Button>
                    ) : (
                      <Badge variant="outline" className="text-[0.65rem]">Resolved</Badge>
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
