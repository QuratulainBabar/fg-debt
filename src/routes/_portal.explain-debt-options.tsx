import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_portal/explain-debt-options")({
  head: () => ({
    meta: [
      { title: "Explain Debt Options — FG Debt Advisor AI" },
      {
        name: "description",
        content: "Get plain-English explanations of DRO, IVA, DMP, bankruptcy and related terms.",
      },
      { property: "og:title", content: "Explain Debt Options — FG Debt Advisor AI" },
      {
        property: "og:description",
        content: "Ask the AI Adviser to explain debt solutions in clear language.",
      },
    ],
  }),
  component: ExplainDebtOptionsPage,
});

const topics = [
  {
    title: "Debt Relief Order (DRO)",
    body: "A formal insolvency option that freezes qualifying debts for 12 months, then writes them off if your circumstances do not improve.",
  },
  {
    title: "IVA",
    body: "A legally binding agreement with creditors to repay an affordable amount over typically 5–6 years, often used when DRO limits are exceeded.",
  },
  {
    title: "Debt Management Plan",
    body: "An informal arrangement where you make a single monthly payment distributed to creditors. Interest may still apply.",
  },
  {
    title: "Priority vs non-priority debts",
    body: "Priority debts (rent, council tax, energy) carry stronger enforcement powers. Non-priority consumer credit is treated differently in advice.",
  },
];

function ExplainDebtOptionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="AI support"
        title="Explain debt options"
        description="Short guides to the main solutions. Ask the AI Adviser for a deeper explanation tailored to your case."
        actions={
          <Button asChild>
            <Link to="/assistant">
              <Sparkles className="size-4" /> Ask AI Adviser
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        {topics.map((t) => (
          <section key={t.title} className="surface-card p-5">
            <div className="flex items-start gap-3">
              <span className="grid size-9 place-items-center rounded-lg bg-secondary/50 text-primary">
                <BookOpen className="size-4" />
              </span>
              <div>
                <h2 className="text-base font-semibold">{t.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.body}</p>
              </div>
            </div>
          </section>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button asChild variant="outline">
          <Link to="/debt-options">Compare options for your case</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/recommendation">View AI recommendation</Link>
        </Button>
      </div>
    </>
  );
}
