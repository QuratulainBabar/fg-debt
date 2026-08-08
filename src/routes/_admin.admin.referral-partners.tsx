import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Network, TrendingUp, Building, Users } from "lucide-react";
import { REFERRAL_PARTNERS } from "@/lib/admin-data";

export const Route = createFileRoute("/_admin/admin/referral-partners")({
  head: () => ({ meta: [{ title: "Referral Partners — FG Debt Advisor AI" }] }),
  component: AdminReferralPartnersPage,
});

function AdminReferralPartnersPage() {
  const statusBadge: Record<string, any> = {
    active: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    inactive: "bg-muted text-muted-foreground border-border",
  };
  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        eyebrow="Admin / Operations"
        title="Referral Partners"
        description="Manage network of Insolvency Practitioners, IP firms, DRO intermediaries, housing charities, Money Advice Scotland, and vulnerability support partners."
        actions={
          <Button className="rounded-xl gradient-deep text-primary-foreground shadow-soft">
            <Plus className="size-4 mr-1.5" /> Add Partner
          </Button>
        }
      />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {[
          { label: "Total Partners", value: REFERRAL_PARTNERS.length, icon: Building, color: "primary" },
          { label: "Active", value: REFERRAL_PARTNERS.filter(p => p.status === "active").length, icon: Network, color: "emerald" },
          { label: "Referrals YTD", value: REFERRAL_PARTNERS.reduce((a, p) => a + p.mattersReferred, 0).toLocaleString(), icon: Users, color: "blue" },
          { label: "Avg Conversion", value: "80%", icon: TrendingUp, color: "purple" },
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
      <Card className="surface-card">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-base font-display">Partner Directory</CardTitle>
              <CardDescription className="text-xs">Active referral partner firms and their performance metrics.</CardDescription>
            </div>
            <div className="relative">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search partners…" className="pl-9 h-9 w-56 rounded-xl" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-semibold">Partner</TableHead>
                <TableHead className="text-xs font-semibold">Type</TableHead>
                <TableHead className="text-xs font-semibold">Contact</TableHead>
                <TableHead className="text-xs font-semibold">Matters Referred</TableHead>
                <TableHead className="text-xs font-semibold">Conversion</TableHead>
                <TableHead className="text-xs font-semibold">Status</TableHead>
                <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {REFERRAL_PARTNERS.map((p) => (
                <TableRow key={p.id} className="group hover:bg-muted/50">
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="grid size-9 place-items-center rounded-lg bg-primary/5 border border-primary/15">
                        <Building className="size-4 text-primary" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-foreground">{p.name}</div>
                        <div className="text-[0.65rem] text-muted-foreground font-mono">{p.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-xs">{p.type}</TableCell>
                  <TableCell className="py-3 text-xs text-muted-foreground">{p.contactName}</TableCell>
                  <TableCell className="py-3 text-xs font-semibold">{p.mattersReferred.toLocaleString()}</TableCell>
                  <TableCell className="py-3">
                    <Badge variant="secondary" className="text-[0.65rem]">{p.conversionRate}</Badge>
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge variant="outline" className={`text-[0.65rem] capitalize border ${statusBadge[p.status]}`}>{p.status}</Badge>
                  </TableCell>
                  <TableCell className="py-3 text-right">
                    <Button variant="outline" size="sm" className="rounded-lg text-xs mr-1">View</Button>
                    <Button variant="ghost" size="sm" className="rounded-lg text-xs">Edit</Button>
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
