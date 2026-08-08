import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Download, History, Cpu, FileText, Shield, Users, Scale, Activity } from "lucide-react";
import { AUDIT_LOGS } from "@/lib/admin-data";

export const Route = createFileRoute("/_admin/admin/audit-logs")({
  head: () => ({ meta: [{ title: "Audit Logs — FG Debt Advisor AI" }] }),
  component: AdminAuditLogsPage,
});

function AdminAuditLogsPage() {
  const categoryConfig: Record<string, { icon: any; styles: string }> = {
    user: { icon: Users, styles: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30" },
    matter: { icon: Scale, styles: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30" },
    document: { icon: FileText, styles: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30" },
    rule: { icon: Shield, styles: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30" },
    system: { icon: Cpu, styles: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30" },
  };

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        eyebrow="Admin / Integrations & Reporting"
        title="Audit Logs"
        description="Immutable record of every user, system, rule engine, document and matter event for SRA, FCA and GDPR compliance audit."
        actions={
          <Button variant="outline" size="sm" className="rounded-xl">
            <Download className="size-4 mr-1.5" /> Export (CSV)
          </Button>
        }
      />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {[
          { label: "Events (24h)", value: "2,846", icon: Activity, color: "primary" },
          { label: "User Actions", value: 842, icon: Users, color: "blue" },
          { label: "Rule Changes", value: 12, icon: Shield, color: "amber" },
          { label: "SRA Reconciled", value: "100%", icon: History, color: "emerald" },
        ].map((s) => (
          <Card key={s.label} className="surface-card">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`grid size-10 place-items-center rounded-xl border ${
                s.color === "primary" ? "bg-primary/10 text-primary border-primary/20" :
                s.color === "blue" ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
                s.color === "amber" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-base font-display">Full Audit Trail</CardTitle>
              <CardDescription className="text-xs">Append-only log; read-only for GDPR/SRA compliance.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search audit events…" className="pl-9 h-9 w-56 rounded-xl" />
              </div>
              <Button variant="outline" size="sm" className="rounded-xl"><Filter className="size-4 mr-1.5" /> Filters</Button>
            </div>
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
                <TableHead className="text-xs font-semibold">Target Reference</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {AUDIT_LOGS.map((a) => {
                const cfg = categoryConfig[a.category] ?? categoryConfig.system;
                const Icon = cfg.icon;
                return (
                  <TableRow key={a.id} className="group hover:bg-muted/50">
                    <TableCell className="py-3 text-xs text-muted-foreground whitespace-nowrap font-mono">
                      {a.timestamp}
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge variant="outline" className={`text-[0.65rem] capitalize border ${cfg.styles}`}>
                        <Icon className="size-3 mr-1.5" /> {a.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="text-xs font-semibold text-foreground">{a.actor}</div>
                      <div className="text-[0.65rem] text-muted-foreground">{a.role}</div>
                    </TableCell>
                    <TableCell className="py-3 text-xs text-foreground">{a.action}</TableCell>
                    <TableCell className="py-3 text-xs font-mono text-primary">{a.target}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
