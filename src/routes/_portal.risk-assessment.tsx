import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, ShieldAlert, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { StatCard } from "@/components/portal/StatCard";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { Button } from "@/components/ui/button";
import { totalArrears, totalDebt, gbp } from "@/lib/mock-data";

export const Route = createFileRoute("/_portal/risk-assessment")({
  head: () => ({
    meta: [
      { title: "Risk Assessment — FG Debt Advisor AI" },
      {
        name: "description",
        content: "See enforcement, hardship and compliance risks flagged on your case.",
      },
      { property: "og:title", content: "Risk Assessment — FG Debt Advisor AI" },
      {
        property: "og:description",
        content: "Client-facing risk overview for your debt advice matter.",
      },
    ],
  }),
  component: RiskAssessmentPage,
});

const risks = [
  {
    title: "Priority debt arrears",
    level: "Medium",
    detail: `Council tax and energy arrears total ${gbp(totalArrears)} across priority accounts.`,
    action: "Continue payment plans where agreed; solicitor monitoring enforcement risk.",
  },
  {
    title: "Enforcement / bailiff activity",
    level: "Low",
    detail: "No active bailiff visits recorded on your current assessment.",
    action: "Notify us immediately if enforcement agents make contact.",
  },
  {
    title: "Vulnerability / hardship",
    level: "Medium",
    detail: "Financial hardship indicators present — communication and pace adjusted.",
    action: "Complete remaining vulnerability questions if prompted.",
  },
  {
    title: "Document completeness",
    level: "Action required",
    detail: "One payslip and one creditor letter still outstanding for verification.",
    action: "Upload missing evidence to keep solicitor review on track.",
  },
];

function RiskAssessmentPage() {
  return (
    <>
      <PageHeader
        eyebrow="Insights"
        title="Risk assessment"
        description="Flags that affect urgency, communication and the solution path. Your solicitor reviews these before formal advice is issued."
        actions={<StatusBadge status="In review" />}
      />

      <div className="grid gap-5 sm:grid-cols-3">
        <StatCard icon={ShieldAlert} label="Overall risk" value="Medium" hint="Solicitor monitoring" tone="warning" />
        <StatCard icon={AlertTriangle} label="Total debt" value={gbp(totalDebt)} hint="Unsecured position" />
        <StatCard icon={ShieldCheck} label="Identity" value="Verified" hint="Checks complete" tone="positive" />
      </div>

      <ul className="mt-6 space-y-4">
        {risks.map((r) => (
          <li key={r.title} className="surface-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold">{r.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{r.detail}</p>
                <p className="mt-3 text-sm">
                  <span className="font-medium">Next step: </span>
                  <span className="text-muted-foreground">{r.action}</span>
                </p>
              </div>
              <StatusBadge status={r.level} />
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button asChild>
          <Link to="/missing-evidence">Resolve missing evidence</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/vulnerability-assessment">Open vulnerability assessment</Link>
        </Button>
      </div>
    </>
  );
}
