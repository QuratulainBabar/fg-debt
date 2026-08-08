import { Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { INITIAL_MATTERS } from "@/lib/solicitor-data";

export function SolicitorAuditPage() {
  const allAudit = INITIAL_MATTERS.flatMap((m) =>
    m.auditHistory.map((a) => ({ ...a, matterId: m.id, clientName: m.clientName }))
  );

  return (
    <div className="space-y-6 pb-12">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-display font-bold tracking-tight text-foreground sm:text-3xl">
            Enterprise Compliance Audit Log
          </h1>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
            <Lock className="size-3" /> Read-Only Immutable Trail
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          System-wide audit trail recording user logins, AI evaluations, document scans, and solicitor approvals.
        </p>
      </div>

      <Card className="surface-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs font-semibold">Timestamp</TableHead>
                <TableHead className="text-xs font-semibold">Matter & Client</TableHead>
                <TableHead className="text-xs font-semibold">User & Role</TableHead>
                <TableHead className="text-xs font-semibold">Section</TableHead>
                <TableHead className="text-xs font-semibold">Previous Value</TableHead>
                <TableHead className="text-xs font-semibold">New Value</TableHead>
                <TableHead className="text-xs font-semibold">Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allAudit.map((item) => (
                <TableRow key={item.id} className="text-xs hover:bg-muted/50">
                  <TableCell className="font-mono text-muted-foreground">{item.timestamp}</TableCell>
                  <TableCell>
                    <div className="font-semibold">{item.clientName}</div>
                    <div className="text-[0.68rem] text-muted-foreground font-mono">{item.matterId}</div>
                  </TableCell>
                  <TableCell className="font-semibold">{item.user} ({item.role})</TableCell>
                  <TableCell>{item.section}</TableCell>
                  <TableCell className="text-muted-foreground">{item.previousValue}</TableCell>
                  <TableCell className="font-semibold text-primary">{item.newValue}</TableCell>
                  <TableCell className="text-muted-foreground">{item.reason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
