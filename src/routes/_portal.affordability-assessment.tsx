import { createFileRoute, Link } from "@tanstack/react-router";
import { Calculator, CheckCircle2, Info } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { StatCard } from "@/components/portal/StatCard";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { disposableIncome, gbp, totalExpenses, totalIncome } from "@/lib/mock-data";

export const Route = createFileRoute("/_portal/affordability-assessment")({
  head: () => ({
    meta: [
      { title: "Affordability Assessment — FG Debt Advisor AI" },
      {
        name: "description",
        content: "See how your income and expenditure affect what you can afford to pay creditors.",
      },
      { property: "og:title", content: "Affordability Assessment — FG Debt Advisor AI" },
      {
        property: "og:description",
        content: "Affordability calculation based on your Standard Financial Statement.",
      },
    ],
  }),
  component: AffordabilityAssessmentPage,
});

const checks = [
  { label: "Income verified against documents", done: true },
  { label: "Essential expenditure within CFS guidelines", done: true },
  { label: "Disposable income calculated", done: true },
  { label: "Solicitor affordability sign-off", done: false },
];

function AffordabilityAssessmentPage() {
  const rate = Math.round((disposableIncome / totalIncome) * 100);
  return (
    <>
      <PageHeader
        eyebrow="My journey"
        title="Affordability assessment"
        description="We compare your income and essential spending to work out a sustainable surplus for creditors — using Standard Financial Statement categories."
        actions={<StatusBadge status="In review" />}
      />

      <div className="grid gap-5 sm:grid-cols-3">
        <StatCard icon={Calculator} label="Income" value={gbp(totalIncome)} hint="Monthly net" />
        <StatCard icon={Calculator} label="Essentials" value={gbp(totalExpenses)} hint="Allowed expenditure" />
        <StatCard
          icon={Calculator}
          label="Surplus"
          value={gbp(disposableIncome)}
          hint={`${rate}% of income`}
          tone="positive"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section className="surface-card p-6">
          <h2 className="text-lg font-semibold">Affordability checks</h2>
          <p className="text-sm text-muted-foreground">
            Progress toward solicitor-ready affordability confirmation
          </p>
          <Progress value={75} className="mt-5 h-2" />
          <ul className="mt-6 space-y-3">
            {checks.map((c) => (
              <li
                key={c.label}
                className="flex items-center gap-3 rounded-lg border border-border px-4 py-3 text-sm"
              >
                <CheckCircle2
                  className={`size-4 shrink-0 ${c.done ? "text-success" : "text-muted-foreground"}`}
                />
                <span className={c.done ? "font-medium" : "text-muted-foreground"}>{c.label}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-2">
            <Button asChild>
              <Link to="/financial-information">Review financial information</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/financial-summary">Open financial summary</Link>
            </Button>
          </div>
        </section>

        <aside className="surface-card p-5">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 size-4 shrink-0 text-accent" />
            <div>
              <h3 className="text-sm font-semibold">What this means</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Your current surplus of {gbp(disposableIncome)} per month sits within Debt Relief
                Order disposable income limits. If income rises before an application is made, your
                solicitor will recalculate suitability.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
