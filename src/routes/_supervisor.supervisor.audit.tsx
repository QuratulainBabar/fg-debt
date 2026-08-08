import { createFileRoute } from "@tanstack/react-router";
import { Download, History } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SUPERVISOR_AUDIT } from "@/lib/supervisor-data";

export const Route = createFileRoute("/_supervisor/supervisor/audit")({
  head: () => ({ meta: [{ title: "Audit History — Supervisor Dashboard" }] }),
  component: AuditHistoryPage,
});

function AuditHistoryPage() {
  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        eyebrow="Supervisor / Compliance & Quality"
        title="Audit History"
        description="Immutable supervisor oversight trail — overrides, compliance actions, quality reviews and sensitive approvals."
        actions={
          <Button variant="outline" size="sm" className="rounded-xl">
            <Download className="size-4 mr-1.5" /> Export (CSV)
          </Button>
        }
      />

      <Card className="surface-card">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-base font-display flex items-center gap-2">
                <History className="size-5 text-primary" /> Supervisor Audit Trail
              </CardTitle>
              <CardDescription className="text-xs">Append-only log for SRA / FCA oversight evidence.</CardDescription>
            </div>
            <Input placeholder="Search audit events…" className="h-9 w-56 rounded-xl" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-semibold">Timestamp</TableHead>
                <TableHead className="text-xs font-semibold">Category</TableHead>
                <TableHead className="text-xs font-semibold">Actor / Role</TableHead>
                <TableHead className="text-xs font-semibold">Action</TableHead>
                <TableHead className="text-xs font-semibold">Target</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SUPERVISOR_AUDIT.map((a) => (
                <TableRow key={a.id} className="hover:bg-muted/50">
                  <TableCell className="py-3 text-xs font-mono text-muted-foreground whitespace-nowrap">{a.timestamp}</TableCell>
                  <TableCell className="py-3">
                    <Badge variant="outline" className="text-[0.65rem] capitalize">{a.category}</Badge>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="text-xs font-semibold">{a.actor}</div>
                    <div className="text-[0.65rem] text-muted-foreground">{a.role}</div>
                  </TableCell>
                  <TableCell className="py-3 text-xs">{a.action}</TableCell>
                  <TableCell className="py-3 text-xs font-mono text-primary">{a.target}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
