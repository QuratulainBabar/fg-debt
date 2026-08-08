import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, Flame, ShieldAlert, Sparkles, FileText, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SOLICITOR_NOTIFICATIONS } from "@/lib/solicitor-data";

export function SolicitorNotificationsPage() {
  const [notifs, setNotifs] = useState(SOLICITOR_NOTIFICATIONS);
  const navigate = useNavigate();

  const markAllRead = () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold tracking-tight text-foreground sm:text-3xl">
            Solicitor Notification Center
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Alerts for statutory demands, risk escalations, AI completions, and client replies.
          </p>
        </div>

        <Button onClick={markAllRead} variant="outline" size="sm" className="text-xs">
          <CheckCircle2 className="size-3.5 mr-1" /> Mark All as Read
        </Button>
      </div>

      <div className="space-y-3">
        {notifs.map((n) => (
          <Card
            key={n.id}
            onClick={() => navigate({ to: `/solicitor/matters/${n.matterId}` as any })}
            className={`surface-card hover-lift cursor-pointer transition-colors p-4 ${
              n.unread ? "border-primary/40 bg-primary/5" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {n.type === "urgent_risk" && <Flame className="size-5 text-rose-500 animate-pulse" />}
                  {n.type === "high_vulnerability" && <ShieldAlert className="size-5 text-amber-500" />}
                  {n.type === "ai_completed" && <Sparkles className="size-5 text-emerald-500" />}
                  {n.type === "new_matter" && <Bell className="size-5 text-blue-500" />}
                  {n.type === "doc_uploaded" && <FileText className="size-5 text-purple-500" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-foreground">{n.title}</h3>
                    {n.unread && <Badge variant="default" className="text-[0.6rem] bg-rose-600">NEW</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{n.body}</p>
                </div>
              </div>

              <div className="text-right shrink-0 text-xs text-muted-foreground">
                <span className="font-mono text-primary font-semibold block">{n.matterId}</span>
                <span>{n.timestamp}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
