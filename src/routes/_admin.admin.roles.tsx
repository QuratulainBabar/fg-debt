import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Plus, ShieldCheck, Users, Check, Eye } from "lucide-react";
import { ROLE_PERMISSIONS } from "@/lib/admin-data";

export const Route = createFileRoute("/_admin/admin/roles")({
  head: () => ({ meta: [{ title: "Roles & Permissions — FG Debt Advisor AI" }] }),
  component: AdminRolesPage,
});

function AdminRolesPage() {
  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        eyebrow="Admin / Users & Access"
        title="Roles & Permissions"
        description="Define role-based access controls, permission scopes and user assignment counts across the platform."
        actions={
          <Button className="rounded-xl gradient-deep text-primary-foreground shadow-soft">
            <Plus className="size-4 mr-1.5" /> Create New Role
          </Button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {[
          { label: "Roles Defined", value: ROLE_PERMISSIONS.length, icon: ShieldCheck, color: "primary" },
          { label: "Users Assigned", value: "2,848", icon: Users, color: "blue" },
          { label: "Permissions Configured", value: 48, icon: Check, color: "emerald" },
          { label: "Audited in 30d", value: 3, icon: Eye, color: "purple" },
        ].map((s) => (
          <Card key={s.label} className="surface-card">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`grid size-10 place-items-center rounded-xl border ${
                s.color === "primary" ? "bg-primary/10 text-primary border-primary/20" :
                s.color === "blue" ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
                s.color === "emerald" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
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
          <CardTitle className="text-base font-display">Role Matrix</CardTitle>
          <CardDescription className="text-xs">Toggle roles, edit permission scopes and review assignment counts.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-semibold">Role</TableHead>
                <TableHead className="text-xs font-semibold">Description</TableHead>
                <TableHead className="text-xs font-semibold">Users</TableHead>
                <TableHead className="text-xs font-semibold">Permissions</TableHead>
                <TableHead className="text-xs font-semibold">Status</TableHead>
                <TableHead className="text-xs font-semibold text-right w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ROLE_PERMISSIONS.map((r) => (
                <TableRow key={r.id} className="group hover:bg-muted/50">
                  <TableCell className="py-3">
                    <div className="text-xs font-semibold text-foreground">{r.name}</div>
                    <div className="text-[0.65rem] text-muted-foreground font-mono">{r.id}</div>
                  </TableCell>
                  <TableCell className="py-3 text-xs text-muted-foreground max-w-sm">{r.description}</TableCell>
                  <TableCell className="py-3">
                    <Badge variant="secondary" className="text-[0.65rem]">{r.userCount.toLocaleString()} users</Badge>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {r.permissions.slice(0, 3).map(p => (
                        <span key={p} className="text-[0.6rem] px-1.5 py-0.5 rounded-md bg-primary/5 text-primary border border-primary/20 font-mono">
                          {p}
                        </span>
                      ))}
                      {r.permissions.length > 3 && (
                        <Badge variant="outline" className="text-[0.6rem]">+{r.permissions.length - 3} more</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <Switch defaultChecked={r.id !== "RL-999"} />
                  </TableCell>
                  <TableCell className="py-3 text-right">
                    <Button variant="outline" size="sm" className="rounded-lg text-xs mr-1">Edit</Button>
                    <Button variant="ghost" size="sm" className="rounded-lg text-xs">Clone</Button>
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
