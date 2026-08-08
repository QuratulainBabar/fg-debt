import { createFileRoute } from "@tanstack/react-router";
import { FileCheck2 } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SENSITIVE_APPROVALS } from "@/lib/supervisor-data";
import { toast } from "sonner";

export const Route = createFileRoute("/_supervisor/supervisor/sensitive-approvals")({
  head: () => ({ meta: [{ title: "Sensitive Case Approvals — Supervisor Dashboard" }] }),
  component: SensitiveApprovalsPage,
});

function SensitiveApprovalsPage() {
  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        eyebrow="Supervisor / Case Oversight"
        title="Sensitive Case Approvals"
        description="Vulnerability, AML, domestic abuse safe-harbour and high-value matters requiring supervising solicitor approval before progression."
      />

      <Card className="surface-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-display flex items-center gap-2">
            <FileCheck2 className="size-5 text-primary" /> Sensitive Approval Queue
          </CardTitle>
          <CardDescription className="text-xs">
            {SENSITIVE_APPROVALS.filter((s) => s.status === "pending").length} pending approvals.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-semibold">Matter</TableHead>
                <TableHead className="text-xs font-semibold">Category</TableHead>
                <TableHead className="text-xs font-semibold">Summary</TableHead>
                <TableHead className="text-xs font-semibold">Due</TableHead>
                <TableHead className="text-xs font-semibold">Status</TableHead>
                <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SENSITIVE_APPROVALS.map((s) => (
                <TableRow key={s.id} className="group hover:bg-muted/50">
                  <TableCell className="py-3">
                    <div className="font-semibold text-sm">{s.clientName}</div>
                    <div className="text-[0.7rem] font-mono text-muted-foreground">{s.matterId}</div>
                    <div className="text-[0.65rem] text-muted-foreground">{s.solicitor}</div>
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge variant="outline" className="text-[0.65rem] capitalize">
                      {s.category.replace(/_/g, " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 text-xs text-muted-foreground max-w-[280px]">{s.summary}</TableCell>
                  <TableCell className="py-3 text-xs whitespace-nowrap">{s.dueBy}</TableCell>
                  <TableCell className="py-3">
                    <Badge
                      variant={s.status === "approved" ? "secondary" : s.status === "returned" ? "destructive" : "default"}
                      className="text-[0.65rem] capitalize"
                    >
                      {s.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 text-right space-x-2">
                    {s.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs rounded-lg"
                          onClick={() => toast.message("Returned to solicitor", { description: s.id })}
                        >
                          Return
                        </Button>
                        <Button
                          size="sm"
                          className="text-xs rounded-lg"
                          onClick={() => toast.success("Sensitive case approved", { description: s.matterId })}
                        >
                          Approve
                        </Button>
                      </>
                    )}
                    {s.status === "approved" && (
                      <Badge variant="outline" className="text-[0.65rem] text-emerald-700 border-emerald-500/30">Approved</Badge>
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
