import { createFileRoute, Link } from "@tanstack/react-router";
import { HelpCircle, MessageSquare } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_portal/answer-questions")({
  head: () => ({
    meta: [
      { title: "Answer Questions — FG Debt Advisor AI" },
      {
        name: "description",
        content: "Get answers about your case, debt terminology and next steps from the AI Adviser.",
      },
      { property: "og:title", content: "Answer Questions — FG Debt Advisor AI" },
      {
        property: "og:description",
        content: "Ask questions about your debt advice journey.",
      },
    ],
  }),
  component: AnswerQuestionsPage,
});

const prompts = [
  "What happens during solicitor review?",
  "Can creditors still contact me?",
  "What if my income changes?",
  "How long does a DRO take?",
  "Do I need to attend court?",
  "What documents prove my income?",
];

function AnswerQuestionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="AI support"
        title="Answer questions"
        description="Choose a common question or open the AI Adviser for a free-form conversation about your case."
        actions={
          <Button asChild>
            <Link to="/assistant">
              <MessageSquare className="size-4" /> Open AI Adviser
            </Link>
          </Button>
        }
      />

      <section className="surface-card p-6">
        <div className="mb-5 flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-secondary/50 text-primary">
            <HelpCircle className="size-5" />
          </span>
          <div>
            <h2 className="text-lg font-semibold">Suggested questions</h2>
            <p className="text-sm text-muted-foreground">
              Tap one to continue in the AI Adviser chat
            </p>
          </div>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {prompts.map((q) => (
            <li key={q}>
              <Button asChild variant="outline" className="h-auto w-full justify-start whitespace-normal px-4 py-3 text-left text-sm">
                <Link to="/assistant">{q}</Link>
              </Button>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-4 text-sm text-muted-foreground">
        The AI Adviser explains process and terminology. Formal legal advice is only issued by your
        solicitor after review.
      </p>
    </>
  );
}
