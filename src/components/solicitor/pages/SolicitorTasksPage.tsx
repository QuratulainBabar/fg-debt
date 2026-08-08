import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { INITIAL_MATTERS } from "@/lib/solicitor-data";

export function SolicitorTasksPage() {
  const allTasks = INITIAL_MATTERS.flatMap((m) =>
    m.tasks.map((t) => ({ ...t, matterId: m.id, clientName: m.clientName }))
  );

  const [tasks] = useState(allTasks);
  const navigate = useNavigate();

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-display font-bold tracking-tight text-foreground sm:text-3xl">
          Tasks & Client Requests
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pending solicitor action items, document requests, and client clarifications.
        </p>
      </div>

      <Card className="surface-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs font-semibold">Task Title</TableHead>
                <TableHead className="text-xs font-semibold">Matter & Client</TableHead>
                <TableHead className="text-xs font-semibold">Type</TableHead>
                <TableHead className="text-xs font-semibold">Priority</TableHead>
                <TableHead className="text-xs font-semibold">Due Date</TableHead>
                <TableHead className="text-xs font-semibold">Status</TableHead>
                <TableHead className="text-xs font-semibold text-right">View Matter</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id} className="text-xs group hover:bg-muted/50">
                  <TableCell className="font-semibold">
                    <div>{task.title}</div>
                    <div className="text-[0.68rem] text-muted-foreground">{task.description}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-foreground">{task.clientName}</div>
                    <div className="text-[0.68rem] font-mono text-muted-foreground">{task.matterId}</div>
                  </TableCell>
                  <TableCell className="capitalize">{task.type.replace(/_/g, " ")}</TableCell>
                  <TableCell>
                    <Badge variant={task.priority === "urgent" ? "destructive" : "secondary"} className="text-[0.62rem] capitalize">
                      {task.priority} Priority
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono">{task.dueDate}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">{task.status.replace(/_/g, " ")}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigate({ to: `/solicitor/matters/${task.matterId}` as any })}
                      className="text-xs"
                    >
                      Open Matter <ArrowUpRight className="size-3.5 ml-1" />
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
