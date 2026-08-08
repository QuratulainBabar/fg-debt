import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, ArrowUpRight, ShieldAlert } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getHighRiskMatters } from "@/lib/supervisor-data";

export const Route = createFileRoute("/_supervisor/supervisor/high-risk")({
  head: () => ({ meta: [{ title: "High-Risk Cases — Supervisor Dashboard" }] }),
  component: HighRiskCasesPage,
});

function HighRiskCasesPage() {
  const navigate = useNavigate();
  const matters = getHighRiskMatters();

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        eyebrow="Supervisor / Case Oversight"
        title="High-Risk Cases"
        description="Matters flagged high or critical risk — enforcement deadlines, vulnerability, and escalation require supervising solicitor oversight."
      />

      <Card className="surface-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-display flex items-center gap-2">
            <ShieldAlert className="size-5 text-rose-500" /> Escalated Risk Queue
          </CardTitle>
          <CardDescription className="text-xs">{matters.length} matters currently at high or critical risk.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-semibold">Client & Ref</TableHead>
                <TableHead className="text-xs font-semibold">Status & Risk</TableHead>
                <TableHead className="text-xs font-semibold">Solicitor</TableHead>
                <TableHead className="text-xs font-semibold">Debt / Surplus</TableHead>
                <TableHead className="text-xs font-semibold">Next Action</TableHead>
                <TableHead className="text-xs font-semibold text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matters.map((m) => (
                <TableRow key={m.id} className="group hover:bg-muted/50">
                  <TableCell className="py-3">
                    <div className="font-semibold text-sm">{m.clientName}</div>
                    <div className="text-[0.7rem] font-mono text-muted-foreground">{m.id}</div>
                    {m.vulnerability !== "none" && (
                      <span className="inline-flex items-center gap-1 text-[0.65rem] text-amber-600 dark:text-amber-400 mt-0.5">
                        <AlertTriangle className="size-3" /> {m.vulnerability.replace(/_/g, " ")}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex flex-col gap-1 items-start">
                      <Badge variant={m.status === "urgent_review" ? "destructive" : "secondary"} className="text-[0.65rem] capitalize">
                        {m.status.replace(/_/g, " ")}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-[0.62rem] capitalize ${
                          m.riskLevel === "critical"
                            ? "border-rose-500 text-rose-600 bg-rose-500/10"
                            : "border-amber-500 text-amber-600 bg-amber-500/10"
                        }`}
                      >
                        {m.riskLevel} risk
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-xs">{m.assignedSolicitor}</TableCell>
                  <TableCell className="py-3 text-xs">
                    <div className="font-semibold">£{m.totalDebt.toLocaleString()}</div>
                    <div className="text-muted-foreground">£{m.disposableIncome}/mo</div>
                  </TableCell>
                  <TableCell className="py-3 text-xs text-muted-foreground max-w-[220px]">{m.nextRequiredAction}</TableCell>
                  <TableCell className="py-3 text-right">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="text-xs group-hover:bg-primary group-hover:text-primary-foreground"
                      onClick={() => navigate({ to: `/solicitor/matters/${m.id}` as any })}
                    >
                      Review <ArrowUpRight className="size-3.5 ml-1" />
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
