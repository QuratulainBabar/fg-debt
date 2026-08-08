import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, UserPlus, MoreHorizontal, Mail, Shield, ShieldAlert, ShieldCheck, UserRound, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ADMIN_USERS } from "@/lib/admin-data";

export const Route = createFileRoute("/_admin/admin/users")({
  head: () => ({
    meta: [{ title: "Users Management — FG Debt Advisor AI" }],
  }),
  component: AdminUsersPage,
});

function AdminUsersPage() {
  const roleIcons: Record<string, any> = { admin: ShieldAlert, supervisor: ShieldCheck, solicitor: Shield, client: UserRound };
  const roleBadge: Record<string, any> = {
    admin: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30",
    supervisor: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30",
    solicitor: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30",
    client: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  };
  const statusBadge: Record<string, any> = {
    active: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    invited: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30",
    suspended: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30",
  };

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        eyebrow="Admin / Users & Access"
        title="Users Management"
        description="Create, manage and audit platform users across clients, solicitors, supervisors and administrators."
        actions={
          <Button className="rounded-xl gradient-deep text-primary-foreground shadow-soft">
            <UserPlus className="size-4 mr-1.5" /> Invite New User
          </Button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {[
          { label: "Total Registered", value: ADMIN_USERS.length + 2834, icon: Users, color: "blue" },
          { label: "Active Today", value: 187, icon: UserRound, color: "emerald" },
          { label: "Invited Pending", value: 12, icon: Mail, color: "amber" },
          { label: "Suspended", value: 3, icon: ShieldAlert, color: "rose" },
        ].map((s) => (
          <Card key={s.label} className="surface-card">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`grid size-10 place-items-center rounded-xl border ${
                s.color === "blue" ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
                s.color === "emerald" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                s.color === "amber" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                "bg-rose-500/10 text-rose-600 border-rose-500/20"
              }`}>
                <s.icon className="size-5" />
              </div>
              <div>
                <div className="text-xl font-display font-bold">{s.value.toLocaleString()}</div>
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
              <CardTitle className="text-base font-display">All Platform Users</CardTitle>
              <CardDescription className="text-xs">Search, filter and manage every platform account.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search users, email…" className="pl-9 h-9 w-56 rounded-xl" />
              </div>
              <Button variant="outline" size="sm" className="rounded-xl">
                <Filter className="size-4 mr-1.5" /> Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-semibold">User</TableHead>
                <TableHead className="text-xs font-semibold">Role</TableHead>
                <TableHead className="text-xs font-semibold">Status</TableHead>
                <TableHead className="text-xs font-semibold">Matters / Assigned</TableHead>
                <TableHead className="text-xs font-semibold">Created</TableHead>
                <TableHead className="text-xs font-semibold">Last Login</TableHead>
                <TableHead className="text-xs font-semibold text-right w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ADMIN_USERS.map((u) => {
                const RIcon = roleIcons[u.role];
                return (
                  <TableRow key={u.id} className="group hover:bg-muted/50">
                    <TableCell className="py-3">
                      <div className="flex items-center gap-3">
                        <span className="grid size-9 place-items-center rounded-full gradient-deep text-xs font-bold text-primary-foreground shrink-0">
                          {u.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </span>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-foreground">{u.name}</div>
                          <div className="text-[0.7rem] text-muted-foreground truncate">{u.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge variant="outline" className={`text-[0.65rem] capitalize border ${roleBadge[u.role]}`}>
                        <RIcon className="size-3 mr-1.5" /> {u.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge variant="outline" className={`text-[0.65rem] capitalize border ${statusBadge[u.status]}`}>
                        {u.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3 text-xs">
                      {u.assignedMatters ?? "—"}
                    </TableCell>
                    <TableCell className="py-3 text-xs text-muted-foreground">{u.createdAt}</TableCell>
                    <TableCell className="py-3 text-xs text-muted-foreground whitespace-nowrap">{u.lastLogin}</TableCell>
                    <TableCell className="py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 text-xs">
                          <DropdownMenuItem>Edit profile</DropdownMenuItem>
                          <DropdownMenuItem>Change role</DropdownMenuItem>
                          <DropdownMenuItem>Reset password</DropdownMenuItem>
                          <DropdownMenuItem className="text-rose-600">Suspend account</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
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
