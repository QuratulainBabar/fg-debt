import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Scale, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { disposableIncome, gbp, totalDebt } from "@/lib/mock-data";

export const Route = createFileRoute("/_portal/debt-options")({
  head: () => ({
    meta: [
      { title: "Debt Options — FG Debt Advisor AI" },
      {
        name: "description",
        content: "Explore formal and informal debt solutions matched to your circumstances.",
      },
      { property: "og:title", content: "Debt Options — FG Debt Advisor AI" },
      {
        property: "og:description",
        content: "Compare debt solutions including DRO, IVA, DMP and bankruptcy.",
      },
    ],
  }),
  component: DebtOptionsPage,
});

const options = [
  {
    name: "Debt Relief Order",
    fit: 91,
    status: "Recommended",
    summary: `Best fit for low surplus (${gbp(disposableIncome)}/mo) and unsecured debt under £50,000.`,
  },
  {
    name: "Individual Voluntary Arrangement",
    fit: 62,
    status: "Alternative",
    summary: "Consider if income rises above DRO limits within the next 12 months.",
  },
  {
    name: "Debt Management Plan",
    fit: 48,
    status: "Alternative",
    summary: "Informal arrangement — flexible but interest may continue on some accounts.",
  },
  {
    name: "Bankruptcy",
    fit: 31,
    status: "Less suitable",
    summary: `Usually for higher debt or asset positions — your total of ${gbp(totalDebt)} is within DRO range.`,
  },
];

function DebtOptionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="My journey"
        title="Debt options"
        description="Solutions considered for your case. Formal advice is only issued after solicitor review — this page helps you understand the landscape."
        actions={
          <Button asChild>
            <Link to="/recommendation">
              <Sparkles className="size-4" /> View AI recommendation
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4">
        {options.map((o) => (
          <section key={o.name} className="surface-card p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-secondary/50 text-primary">
                  <Scale className="size-5" />
                </span>
                <div>
                  <h2 className="text-lg font-semibold">{o.name}</h2>
                  <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{o.summary}</p>
                </div>
              </div>
              <StatusBadge status={o.status} />
            </div>
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span>Suitability match</span>
                <span>{o.fit}%</span>
              </div>
              <Progress value={o.fit} className="h-2" />
            </div>
          </section>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button asChild variant="outline">
          <Link to="/explain-debt-options">
            Explain options with AI <ArrowRight className="size-4" />
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/advice">View advice records</Link>
        </Button>
      </div>
    </>
  );
}
