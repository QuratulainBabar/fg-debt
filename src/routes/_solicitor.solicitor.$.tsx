import { createFileRoute } from "@tanstack/react-router";
import { MatterReviewPage } from "@/components/solicitor/pages/MatterReviewPage";
import { SolicitorSectionPage } from "@/components/solicitor/pages/SolicitorSectionPage";
import { INITIAL_MATTERS } from "@/lib/solicitor-data";
import { solicitorNav } from "@/lib/solicitor-nav";

const REVIEW_TAB_BY_SECTION: Record<string, string> = {
  overview: "overview",
  "financial-statement": "financial",
  "debt-review": "debts",
  "vulnerability-review": "vulnerabilities",
  "risk-review": "risks",
  "ai-recommendation": "ai_rec",
  decision: "ai_rec",
};

function titleForSplat(splat: string) {
  const path = `/solicitor/${splat.replace(/^\/+|\/+$/g, "")}`;
  const item = solicitorNav.flatMap((g) => g.items).find((i) => i.to === path);
  return item?.label ?? "Solicitor";
}

export const Route = createFileRoute("/_solicitor/solicitor/$")({
  head: ({ params }) => {
    const splat = (params as { _splat?: string })._splat ?? "";
    return {
      meta: [{ title: `${titleForSplat(splat)} — Solicitor Dashboard` }],
    };
  },
  component: SolicitorSplatPage,
});

function SolicitorSplatPage() {
  const { _splat } = Route.useParams();
  const splat = (_splat ?? "").replace(/^\/+|\/+$/g, "");

  if (splat.startsWith("review/") || splat === "review") {
    const section = splat === "review" ? "overview" : splat.slice("review/".length);
    const tab = REVIEW_TAB_BY_SECTION[section] ?? "overview";
    const matter =
      INITIAL_MATTERS.find((m) => m.status === "awaiting_review" || m.status === "urgent_review") ||
      INITIAL_MATTERS[0];

    return <MatterReviewPage matterIdOverride={matter.id} defaultTab={tab} />;
  }

  return <SolicitorSectionPage splat={splat} />;
}
