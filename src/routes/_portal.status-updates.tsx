import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, Bell } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Button } from "@/components/ui/button";
import { activity, notifications } from "@/lib/mock-data";

export const Route = createFileRoute("/_portal/status-updates")({
  head: () => ({
    meta: [
      { title: "Status Updates — FG Debt Advisor AI" },
      {
        name: "description",
        content: "Track recent case activity, notifications and progress updates.",
      },
      { property: "og:title", content: "Status Updates — FG Debt Advisor AI" },
      {
        property: "og:description",
        content: "Live status and activity for your debt advice case.",
      },
    ],
  }),
  component: StatusUpdatesPage,
});

function StatusUpdatesPage() {
  return (
    <>
      <PageHeader
        eyebrow="AI support"
        title="Status updates"
        description="Recent activity on your matters and notifications from FG Debt Advisor AI and your solicitor."
        actions={
          <Button asChild variant="outline">
            <Link to="/messages">
              <Bell className="size-4" /> Open messages
            </Link>
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="surface-card p-6">
          <div className="mb-5 flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-secondary/50 text-primary">
              <Activity className="size-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold">Case activity</h2>
              <p className="text-sm text-muted-foreground">Latest events across your cases</p>
            </div>
          </div>
          <ul className="space-y-4">
            {activity.map((a) => (
              <li key={a.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                <p className="text-sm font-medium">{a.text}</p>
                <p className="mt-1 text-xs text-muted-foreground">{a.time}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="surface-card p-6">
          <div className="mb-5 flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-secondary/50 text-primary">
              <Bell className="size-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold">Notifications</h2>
              <p className="text-sm text-muted-foreground">Alerts that need your attention</p>
            </div>
          </div>
          <ul className="space-y-4">
            {notifications.map((n) => (
              <li key={n.id} className="rounded-xl border border-border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{n.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{n.time}</span>
                </div>
                {n.unread && (
                  <span className="mt-3 inline-block rounded-full bg-accent/15 px-2 py-0.5 text-[0.65rem] font-semibold text-accent">
                    Unread
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button asChild variant="outline">
          <Link to="/cases">View my cases</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/assistant">Ask about case status</Link>
        </Button>
      </div>
    </>
  );
}
