import { Link } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  CheckCircle2,
  CreditCard,
  Download,
  Eye,
  FileSearch,
  FileText,
  FileWarning,
  Flag,
  FolderOpen,
  Gauge,
  Landmark,
  PiggyBank,
  Plus,
  RefreshCcw,
  Send,
  Settings as SettingsIcon,
  Shield,
  ShieldAlert,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { StatCard } from "@/components/portal/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DEBT_SOLUTION_RULES,
  DOCUMENT_TEMPLATES,
  FINANCIAL_RULES,
  INTEGRATIONS,
  LEGAL_RULES,
  REFERRAL_PARTNERS,
  REMINDER_SETTINGS,
  RISK_RULES,
  VULNERABILITY_RULES,
  WORKFLOWS,
  type LegalRule,
} from "@/lib/admin-data";
import { gbp } from "@/lib/mock-data";
import { INITIAL_MATTERS } from "@/lib/solicitor-data";
import { solicitorNav } from "@/lib/solicitor-nav";

const LETTER_SPECS: Record<
  string,
  { title: string; description: string; category: string; samples: string[] }
> = {
  "letters/financial-statement": {
    title: "Financial Statement",
    description: "Standard Financial Statement packs ready for solicitor issue and client sharing.",
    category: "Financial",
    samples: ["SFS Summary — Amelia Hartley", "SFS Full Schedule — James Porter", "SFS Addendum — Vulnerability notes"],
  },
  "letters/income-expenditure": {
    title: "Income & Expenditure Report",
    description: "I&E reports generated from assessment data and OCR-verified bank statements.",
    category: "Financial",
    samples: ["I&E Monthly Report — MAT-2026-4417", "I&E Variance Analysis — MAT-2026-8821"],
  },
  "letters/debt-schedule": {
    title: "Debt Schedule",
    description: "Creditor-by-creditor debt schedules for advice packs and referral packs.",
    category: "Debt",
    samples: ["Priority Debts Schedule", "Non-Priority Debts Schedule", "Full Creditor Matrix"],
  },
  "letters/asset-schedule": {
    title: "Asset Schedule",
    description: "Asset disclosures including property, vehicles, and savings for insolvency eligibility.",
    category: "Assets",
    samples: ["Asset Schedule — DRO eligibility", "Vehicle & Equity Summary"],
  },
  "letters/liability-schedule": {
    title: "Liability Schedule",
    description: "Liability schedules aligned to SFS categories for solicitor review and advice letters.",
    category: "Liabilities",
    samples: ["Priority Liability Schedule", "Secured Liability Schedule"],
  },
  "letters/debt-options-report": {
    title: "Debt Options Report",
    description: "AI-prepared debt options comparisons pending solicitor approval.",
    category: "Advice",
    samples: ["Options Matrix — DRO vs DMP", "IVA Suitability Comparison"],
  },
  "letters/advice-letter": {
    title: "Advice Letter",
    description: "Solicitor-signed advice letters and drafts awaiting final approval.",
    category: "Advice",
    samples: ["Draft Advice Letter — DRO", "Issued Advice Letter — Breathing Space"],
  },
  "letters/creditor-letters": {
    title: "Creditor Letters",
    description: "Hold, settlement, and token offer letters prepared for creditor distribution.",
    category: "Creditors",
    samples: ["Hold Letter Pack", "Token Offer — Council Tax", "Full & Final Settlement Offer"],
  },
  "letters/referral-letter": {
    title: "Referral Letter",
    description: "Referral covering letters for insolvency practitioners and specialist partners.",
    category: "Referrals",
    samples: ["IP Referral Cover Letter", "Housing Support Referral Letter"],
  },
  "letters/matter-strategy": {
    title: "Matter Strategy",
    description: "Internal matter strategy notes and solicitor action plans.",
    category: "Strategy",
    samples: ["Strategy Note — Urgent Possession", "Strategy Note — Multi-creditor IVA"],
  },
  "letters/file-review-checklist": {
    title: "File Review Checklist",
    description: "File completeness checklists for SRA-compliant matter reviews.",
    category: "Compliance",
    samples: ["Pre-Advice File Checklist", "Closing File Checklist"],
  },
  "letters/closing-letter": {
    title: "Closing Letter",
    description: "Matter closing letters and client outcome confirmations.",
    category: "Closure",
    samples: ["Matter Closing Letter — DRO Granted", "Outcome Confirmation — DMP"],
  },
};

const INTEGRATION_SPECS: Record<
  string,
  { title: string; description: string; vendor: string; status: "operational" | "degraded" | "offline"; features: string[] }
> = {
  "integrations/clio": {
    title: "Clio",
    description: "Matter sync, time recording, and client contact synchronisation with Clio Manage.",
    vendor: "Clio",
    status: "operational",
    features: ["Matter bi-directional sync", "Contact import", "Document folder mapping", "Activity timeline export"],
  },
  "integrations/xero": {
    title: "Xero",
    description: "Accounting sync for fee billing, disbursements, and financial reporting.",
    vendor: "Xero",
    status: "operational",
    features: ["Invoice push", "Payment reconciliation", "Chart of accounts mapping", "Trust ledger export"],
  },
  "integrations/microsoft-365": {
    title: "Microsoft 365",
    description: "Outlook, OneDrive, and Teams connectivity for correspondence and secure document storage.",
    vendor: "Microsoft",
    status: "operational",
    features: ["Outlook mail filing", "OneDrive matter folders", "Teams notifications", "Calendar review deadlines"],
  },
  "integrations/open-banking": {
    title: "Open Banking",
    description: "Consent-based bank data retrieval for income verification and affordability analysis.",
    vendor: "Open Banking",
    status: "operational",
    features: ["Account consent flow", "Transaction categorisation", "Affordability refresh", "Consent audit trail"],
  },
  "integrations/ocr": {
    title: "OCR / Document Processing",
    description: "Document OCR pipeline for bank statements, creditor letters, and identity evidence.",
    vendor: "FG OCR Engine",
    status: "degraded",
    features: ["PDF/image OCR", "Field extraction", "Confidence scoring", "Solicitor verification queue"],
  },
  "integrations/e-signature": {
    title: "E-signature",
    description: "Secure electronic signature for advice letters, consent forms, and engagement letters.",
    vendor: "E-signature",
    status: "operational",
    features: ["Advice letter signing", "Client consent packs", "Witness workflows", "Signed PDF vault"],
  },
};

const REPORT_SPECS: Record<string, { title: string; description: string; metrics: { label: string; value: string }[] }> = {
  "reports/management": {
    title: "Management Reports",
    description: "Firm-wide operational KPIs for matter throughput, SLA adherence, and solicitor capacity.",
    metrics: [
      { label: "Matters opened (30d)", value: "94" },
      { label: "Avg review turnaround", value: "6.2h" },
      { label: "SLA met", value: "91%" },
      { label: "Active solicitors", value: "8" },
    ],
  },
  "reports/matter-outcomes": {
    title: "Matter Outcomes",
    description: "Approved, amended, rejected, and closed matter outcomes across the portfolio.",
    metrics: [
      { label: "Approved", value: "128" },
      { label: "Amended", value: "34" },
      { label: "Rejected", value: "12" },
      { label: "Closed", value: "86" },
    ],
  },
  "reports/debt-solutions": {
    title: "Debt Solutions",
    description: "Distribution of recommended and approved debt solutions.",
    metrics: [
      { label: "DRO", value: "42%" },
      { label: "DMP", value: "31%" },
      { label: "IVA", value: "18%" },
      { label: "Breathing Space", value: "9%" },
    ],
  },
  "reports/referrals": {
    title: "Referrals",
    description: "Referral volume, partner conversion, and time-to-acceptance.",
    metrics: [
      { label: "Referrals sent", value: "64" },
      { label: "Accepted", value: "51" },
      { label: "Avg accept time", value: "2.4d" },
      { label: "Conversion", value: "80%" },
    ],
  },
  "reports/client-satisfaction": {
    title: "Client Satisfaction",
    description: "Post-advice satisfaction scores and complaint rates.",
    metrics: [
      { label: "CSAT", value: "4.6/5" },
      { label: "NPS", value: "+48" },
      { label: "Complaints (90d)", value: "3" },
      { label: "Survey responses", value: "212" },
    ],
  },
  "reports/solicitor-approval-rates": {
    title: "Solicitor Approval Rates",
    description: "AI recommendation approval, amendment, and override rates by solicitor.",
    metrics: [
      { label: "Approve rate", value: "71%" },
      { label: "Amend rate", value: "19%" },
      { label: "Override rate", value: "7%" },
      { label: "Reject rate", value: "3%" },
    ],
  },
  "reports/compliance-exceptions": {
    title: "Compliance Exceptions",
    description: "Open compliance exceptions, breaches, and remediation status.",
    metrics: [
      { label: "Open exceptions", value: "9" },
      { label: "Critical", value: "2" },
      { label: "Remediated (30d)", value: "14" },
      { label: "Avg close time", value: "3.1d" },
    ],
  },
  "reports/vulnerability-statistics": {
    title: "Vulnerability Statistics",
    description: "Vulnerability flags, safeguarding interventions, and specialist referrals.",
    metrics: [
      { label: "Flagged matters", value: "38%" },
      { label: "Mental health", value: "22" },
      { label: "Housing risk", value: "11" },
      { label: "Safeguarding refs", value: "7" },
    ],
  },
};

function statusBadge(status: string) {
  if (status === "active" || status === "published" || status === "operational" || status === "verified") {
    return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30";
  }
  if (status === "draft" || status === "degraded" || status === "pending" || status === "in_progress") {
    return "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30";
  }
  if (status === "offline" || status === "critical" || status === "failed") {
    return "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30";
  }
  return "bg-muted text-muted-foreground border-border";
}

function RulesTable({ title, description, rules }: { title: string; description: string; rules: LegalRule[] }) {
  return (
    <div className="space-y-6 pb-10">
      <PageHeader eyebrow="Rules & Configuration" title={title} description={description} actions={
        <Button className="rounded-xl gradient-deep text-primary-foreground shadow-soft">
          <Plus className="size-4 mr-1.5" /> New Rule
        </Button>
      } />
      <Card className="surface-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-semibold">Rule</TableHead>
                <TableHead className="text-xs font-semibold">Category</TableHead>
                <TableHead className="text-xs font-semibold">Jurisdiction</TableHead>
                <TableHead className="text-xs font-semibold">Version</TableHead>
                <TableHead className="text-xs font-semibold">Updated</TableHead>
                <TableHead className="text-xs font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((r) => (
                <TableRow key={r.id} className="text-xs hover:bg-muted/50">
                  <TableCell>
                    <div className="font-semibold">{r.name}</div>
                    <div className="text-[0.65rem] text-muted-foreground font-mono">{r.id}</div>
                  </TableCell>
                  <TableCell>{r.category}</TableCell>
                  <TableCell>{r.jurisdiction}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[0.65rem] font-mono">{r.version}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{r.lastUpdated}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[0.65rem] capitalize border ${statusBadge(r.status)}`}>
                      {r.status}
                    </Badge>
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

function LetterLibraryPage(spec: (typeof LETTER_SPECS)[string]) {
  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        eyebrow="Documents & Letters"
        title={spec.title}
        description={spec.description}
        actions={
          <Button className="rounded-xl gradient-deep text-primary-foreground shadow-soft">
            <Plus className="size-4 mr-1.5" /> Generate
          </Button>
        }
      />
      <Card className="surface-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-display">{spec.category} library</CardTitle>
          <CardDescription className="text-xs">Draft and issued documents available for solicitor use.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs font-semibold">Document</TableHead>
                <TableHead className="text-xs font-semibold">Status</TableHead>
                <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {spec.samples.map((name, idx) => (
                <TableRow key={name} className="text-xs hover:bg-muted/50">
                  <TableCell className="font-semibold">
                    <div className="flex items-center gap-2">
                      <FileText className="size-4 text-primary" />
                      {name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[0.65rem] border ${statusBadge(idx === 0 ? "draft" : "published")}`}>
                      {idx === 0 ? "Draft" : "Ready"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost" className="h-8 px-2">
                      <Eye className="size-3.5 mr-1" /> Preview
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 px-2">
                      <Download className="size-3.5 mr-1" /> Download
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

function IntegrationDetailPage(spec: (typeof INTEGRATION_SPECS)[string]) {
  const related = INTEGRATIONS.find((i) => i.name.toLowerCase().includes(spec.vendor.toLowerCase().slice(0, 3)));
  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        eyebrow="Integrations"
        title={spec.title}
        description={spec.description}
        actions={
          <Button variant="outline" size="sm" className="rounded-xl">
            <SettingsIcon className="size-4 mr-1.5" /> Configure
          </Button>
        }
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="surface-card">
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Status</div>
            <Badge variant="outline" className={`mt-2 text-xs capitalize border ${statusBadge(spec.status)}`}>
              {spec.status}
            </Badge>
          </CardContent>
        </Card>
        <Card className="surface-card">
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Vendor</div>
            <div className="mt-2 text-sm font-semibold">{spec.vendor}</div>
          </CardContent>
        </Card>
        <Card className="surface-card">
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Last sync</div>
            <div className="mt-2 text-sm font-semibold">{related?.lastSync ?? "2 mins ago"}</div>
          </CardContent>
        </Card>
      </div>
      <Card className="surface-card">
        <CardHeader>
          <CardTitle className="text-base font-display">Capabilities</CardTitle>
          <CardDescription className="text-xs">Enabled features for this solicitor super-admin integration.</CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-3">
          {spec.features.map((f) => (
            <div key={f} className="flex items-center gap-2 text-sm rounded-lg border border-border/70 bg-muted/30 px-3 py-2">
              <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
              {f}
            </div>
          ))}
        </CardContent>
      </Card>
      <Card className="surface-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-display">Connection health</CardTitle>
            <CardDescription className="text-xs">Uptime and latency monitoring.</CardDescription>
          </div>
          <Button variant="ghost" size="icon" className="size-8">
            <RefreshCcw className="size-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-muted-foreground">Uptime</span>
            <span className="font-semibold">{related?.uptime ?? "99.90%"}</span>
          </div>
          <Progress value={parseFloat((related?.uptime ?? "99.9").replace("%", ""))} className="h-2" />
        </CardContent>
      </Card>
    </div>
  );
}

function ReportPage(spec: (typeof REPORT_SPECS)[string]) {
  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        eyebrow="Reporting"
        title={spec.title}
        description={spec.description}
        actions={
          <Button variant="outline" size="sm" className="rounded-xl">
            <Download className="size-4 mr-1.5" /> Export
          </Button>
        }
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {spec.metrics.map((m) => (
          <Card key={m.label} className="surface-card">
            <CardContent className="p-4">
              <div className="text-2xl font-display font-bold">{m.value}</div>
              <div className="text-xs text-muted-foreground font-semibold mt-1">{m.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="surface-card">
        <CardHeader>
          <CardTitle className="text-base font-display">Report detail</CardTitle>
          <CardDescription className="text-xs">Snapshot based on live solicitor workspace metrics.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Use filters and export to produce SRA-ready management packs. Underlying matter, referral, and compliance
          datasets remain available from Matter List, Referrals, and Audit Log.
        </CardContent>
      </Card>
    </div>
  );
}

function ReferralsPage(mode: "list" | "create" | "pack" | "status") {
  const allReferrals = INITIAL_MATTERS.flatMap((m) =>
    m.referrals.map((r) => ({ ...r, matterId: m.id, clientName: m.clientName }))
  );
  const matter =
    INITIAL_MATTERS.find((m) => m.status === "awaiting_review" || m.status === "urgent_review") ??
    INITIAL_MATTERS[0]!;

  if (mode === "create") {
    return (
      <div className="space-y-6 pb-10">
        <PageHeader
          eyebrow="Referral Engine"
          title="Create Referral"
          description="Initiate a regulated referral to an insolvency practitioner or specialist support partner."
        />
        <div className="grid gap-5 sm:grid-cols-3">
          <StatCard icon={FileText} label="Matter" value={matter.id} hint={matter.clientName} />
          <StatCard icon={CheckCircle2} label="Recommended" value={matter.aiRecommendedSolution} hint={`${matter.aiConfidenceScore}% confidence`} tone="deep" />
          <StatCard icon={Flag} label="Partners" value={`${REFERRAL_PARTNERS.filter((p) => p.status === "active").length}`} hint="Active partners" tone="positive" />
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Card className="surface-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-display">Referral details</CardTitle>
              <CardDescription className="text-xs">Static draft form for solicitor handoff</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Matter</label>
                <Input className="mt-1.5" defaultValue={`${matter.id} — ${matter.clientName}`} />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Referral partner</label>
                <Input className="mt-1.5" defaultValue={REFERRAL_PARTNERS[0]?.name} />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Contact person</label>
                <Input className="mt-1.5" defaultValue={REFERRAL_PARTNERS[0]?.contactName} />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Reason</label>
                <Input className="mt-1.5" defaultValue={`${matter.aiRecommendedSolution} nominee / intermediary required`} />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Internal notes</label>
                <Input className="mt-1.5" defaultValue={matter.nextRequiredAction} />
              </div>
              <Button className="rounded-xl gradient-deep text-primary-foreground shadow-soft">
                <Plus className="size-4 mr-1.5" /> Create Referral
              </Button>
            </CardContent>
          </Card>
          <Card className="surface-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-display">Suggested partners</CardTitle>
              <CardDescription className="text-xs">Active partners for this solution type</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {REFERRAL_PARTNERS.filter((p) => p.status === "active").slice(0, 4).map((p) => (
                <div key={p.id} className="rounded-xl border border-border/70 p-3 text-xs">
                  <div className="font-semibold text-sm">{p.name}</div>
                  <div className="text-muted-foreground mt-0.5">{p.type} · {p.contactName}</div>
                  <div className="mt-2 flex items-center justify-between">
                    <span>{p.mattersReferred} referred</span>
                    <Badge variant="outline" className="text-[0.65rem]">{p.conversionRate}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (mode === "pack") {
    const packItems = [
      { item: "Financial Statement (SFS)", required: true, status: "Ready", owner: "AI pack" },
      { item: "Debt Schedule", required: true, status: "Ready", owner: "OCR verified" },
      { item: "Advice Summary", required: true, status: "Ready", owner: "Solicitor draft" },
      { item: "Identity Verification", required: true, status: "Ready", owner: "Client upload" },
      { item: "Client Consent", required: true, status: "Pending", owner: "Awaiting signature" },
      { item: "Referral Cover Letter", required: false, status: "Pending", owner: "Template" },
      { item: "Vulnerability notes", required: true, status: "Ready", owner: "Matter review" },
    ];

    return (
      <div className="space-y-6 pb-10">
        <PageHeader
          eyebrow="Referral Engine"
          title="Referral Pack"
          description={`Document bundle for partner handoff — ${matter.clientName} (${matter.id}).`}
        />
        <div className="grid gap-5 sm:grid-cols-3">
          <StatCard
            icon={FolderOpen}
            label="Pack items"
            value={`${packItems.length}`}
            hint={`${packItems.filter((i) => i.status === "Ready").length} ready`}
            tone="deep"
          />
          <StatCard
            icon={CheckCircle2}
            label="Required complete"
            value={`${packItems.filter((i) => i.required && i.status === "Ready").length}/${packItems.filter((i) => i.required).length}`}
            hint="Mandatory documents"
            tone="positive"
          />
          <StatCard icon={AlertTriangle} label="Pending" value={`${packItems.filter((i) => i.status === "Pending").length}`} hint="Blocks send" tone="warning" />
        </div>
        <Card className="surface-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display">Pack checklist</CardTitle>
            <CardDescription className="text-xs">Static assembly status for DRO / IP referral</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs font-semibold">Pack item</TableHead>
                  <TableHead className="text-xs font-semibold">Required</TableHead>
                  <TableHead className="text-xs font-semibold">Owner</TableHead>
                  <TableHead className="text-xs font-semibold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packItems.map((row) => (
                  <TableRow key={row.item} className="text-xs">
                    <TableCell className="font-semibold">{row.item}</TableCell>
                    <TableCell>{row.required ? "Yes" : "Optional"}</TableCell>
                    <TableCell className="text-muted-foreground">{row.owner}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-[0.65rem] border ${statusBadge(row.status === "Ready" ? "verified" : "pending")}`}
                      >
                        {row.status}
                      </Badge>
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

  if (mode === "status") {
    const statusCounts = {
      initiated: allReferrals.filter((r) => r.status === "initiated").length,
      accepted: allReferrals.filter((r) => r.status === "accepted").length,
      in_progress: allReferrals.filter((r) => r.status === "in_progress").length,
      completed: allReferrals.filter((r) => r.status === "completed").length,
      declined: allReferrals.filter((r) => r.status === "declined").length,
    };

    return (
      <div className="space-y-6 pb-10">
        <PageHeader
          eyebrow="Referral Engine"
          title="Referral Status"
          description="Track initiated, accepted, in-progress, and completed referrals across matters."
        />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={Send} label="Initiated" value={`${statusCounts.initiated}`} hint="Awaiting partner" />
          <StatCard icon={CheckCircle2} label="Accepted" value={`${statusCounts.accepted}`} hint="Partner confirmed" tone="positive" />
          <StatCard icon={Activity} label="In progress" value={`${statusCounts.in_progress}`} hint="Active handoff" tone="deep" />
          <StatCard icon={Flag} label="Completed / declined" value={`${statusCounts.completed + statusCounts.declined}`} hint="Closed referrals" />
        </div>
        <Card className="surface-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display">Live referral tracker</CardTitle>
            <CardDescription className="text-xs">Static snapshot across solicitor caseload</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs font-semibold">Partner</TableHead>
                  <TableHead className="text-xs font-semibold">Client & Matter</TableHead>
                  <TableHead className="text-xs font-semibold">Contact</TableHead>
                  <TableHead className="text-xs font-semibold">Status</TableHead>
                  <TableHead className="text-xs font-semibold">Date</TableHead>
                  <TableHead className="text-xs font-semibold">Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allReferrals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-8">
                      No referrals recorded yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  allReferrals.map((r) => (
                    <TableRow key={r.id} className="text-xs hover:bg-muted/50">
                      <TableCell className="font-semibold">{r.partner}</TableCell>
                      <TableCell>
                        <div className="font-semibold">{r.clientName}</div>
                        <div className="font-mono text-[0.65rem] text-muted-foreground">{r.matterId}</div>
                      </TableCell>
                      <TableCell>{r.contactPerson}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-[0.65rem] capitalize border ${statusBadge(r.status)}`}>
                          {r.status.replace(/_/g, " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{r.date}</TableCell>
                      <TableCell className="text-muted-foreground max-w-[220px] truncate">{r.notes || r.reason}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  const title = "Referral List";
  const description = "All active and historical referrals from solicitor-managed matters.";

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        eyebrow="Referral Engine"
        title={title}
        description={description}
        actions={
          <Button asChild className="rounded-xl gradient-deep text-primary-foreground shadow-soft">
            <Link to={"/solicitor/referrals/create" as any}>
              <Plus className="size-4 mr-1.5" /> Create Referral
            </Link>
          </Button>
        }
      />
      <Card className="surface-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs font-semibold">Partner</TableHead>
                <TableHead className="text-xs font-semibold">Client & Matter</TableHead>
                <TableHead className="text-xs font-semibold">Reason</TableHead>
                <TableHead className="text-xs font-semibold">Status</TableHead>
                <TableHead className="text-xs font-semibold">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allReferrals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-8">
                    No referrals recorded yet.
                  </TableCell>
                </TableRow>
              ) : (
                allReferrals.map((r) => (
                  <TableRow key={r.id} className="text-xs hover:bg-muted/50">
                    <TableCell className="font-semibold">{r.partner}</TableCell>
                    <TableCell>
                      <div className="font-semibold">{r.clientName}</div>
                      <div className="font-mono text-[0.65rem] text-muted-foreground">{r.matterId}</div>
                    </TableCell>
                    <TableCell>{r.reason}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-[0.65rem] capitalize border ${statusBadge(r.status)}`}>
                        {r.status.replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{r.date}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="surface-card">
        <CardHeader>
          <CardTitle className="text-base font-display">Referral partners</CardTitle>
          <CardDescription className="text-xs">Configured partners available for solicitor referral.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-3">
          {REFERRAL_PARTNERS.map((p) => (
            <div key={p.id} className="rounded-xl border border-border/70 p-3 text-xs">
              <div className="font-semibold text-sm">{p.name}</div>
              <div className="text-muted-foreground mt-0.5">{p.type}</div>
              <div className="mt-2 flex items-center justify-between">
                <span>{p.mattersReferred} referred</span>
                <Badge variant="outline" className={`text-[0.65rem] capitalize border ${statusBadge(p.status)}`}>
                  {p.status}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function CompliancePage(slug: string) {
  const docs = INITIAL_MATTERS.flatMap((m) =>
    m.documents.map((d) => ({ ...d, matterId: m.id, clientName: m.clientName }))
  );
  const approvals = INITIAL_MATTERS.filter((m) => m.solicitorDecision);
  const matter =
    INITIAL_MATTERS.find((m) => m.status === "awaiting_review" || m.status === "urgent_review") ??
    INITIAL_MATTERS[0]!;

  const configs: Record<
    string,
    {
      title: string;
      description: string;
      kpis: { label: string; value: string; hint: string; tone?: "default" | "positive" | "warning" | "deep" }[];
      columns: [string, string, string, string];
      rows: { a: string; b: string; c: string; d: string; dTone?: string }[];
    }
  > = {
    "compliance/advice-history": {
      title: "Advice History",
      description: "Chronology of advice drafts, amendments, and solicitor-issued letters.",
      kpis: [
        { label: "Advice events", value: "6", hint: "Last 30 days", tone: "deep" },
        { label: "Issued letters", value: "2", hint: "Client-facing", tone: "positive" },
        { label: "Pending sign-off", value: "1", hint: "Awaiting solicitor", tone: "warning" },
      ],
      columns: ["Event", "Matter", "Detail", "Status"],
      rows: [
        { a: "DRO suitability draft", b: `${matter.clientName} · ${matter.id}`, c: "AI draft generated", d: "Pending review", dTone: "pending" },
        { a: "Advice letter v1", b: "MAT-2026-7492", c: "IVA advice package", d: "Issued", dTone: "verified" },
        { a: "Advice amendment", b: "MAT-2026-8821", c: "Surplus figure corrected", d: "Amended", dTone: "active" },
        { a: "Client update note", b: `${matter.clientName} · ${matter.id}`, c: "Assessment under legal sign-off", d: "Sent", dTone: "verified" },
        { a: "Breathing Space notice", b: "MAT-2026-3104", c: "Emergency filing pack", d: "Issued", dTone: "verified" },
      ],
    },
    "compliance/document-history": {
      title: "Document History",
      description: "Upload, OCR, verification, and version events across matter documents.",
      kpis: [
        { label: "Documents", value: `${docs.length}`, hint: "Across caseload", tone: "deep" },
        { label: "Verified", value: `${docs.filter((d) => d.verificationStatus === "verified").length}`, hint: "OCR confirmed", tone: "positive" },
        { label: "Flagged", value: `${docs.filter((d) => d.verificationStatus === "flagged").length}`, hint: "Needs review", tone: "warning" },
      ],
      columns: ["Document", "Matter", "Event", "Status"],
      rows: docs.slice(0, 8).map((d) => ({
        a: d.name,
        b: `${d.clientName} · ${d.matterId}`,
        c: `OCR ${d.ocrStatus} · v${d.version}`,
        d: d.verificationStatus,
        dTone: d.verificationStatus,
      })),
    },
    "compliance/version-control": {
      title: "Version Control",
      description: "Document and advice version lineage for audit and rollback awareness.",
      kpis: [
        { label: "Versioned docs", value: `${docs.length}`, hint: "Tracked files", tone: "deep" },
        { label: "Latest major", value: "v3", hint: "Advice letter pack", tone: "positive" },
        { label: "Rollbacks", value: "0", hint: "This quarter" },
      ],
      columns: ["Artifact", "Matter", "Version", "Status"],
      rows: [
        { a: "Advice letter pack", b: "MAT-2026-7492", c: "v3 → issued", d: "Published", dTone: "verified" },
        { a: "SFS summary", b: `${matter.id}`, c: `v${matter.documents[0]?.version ?? 1}`, d: "Current", dTone: "active" },
        { a: "Debt schedule", b: `${matter.id}`, c: "v2", d: "Current", dTone: "active" },
        { a: "IVA proposal draft", b: "MAT-2026-7492", c: "v1 superseded", d: "Archived", dTone: "pending" },
        ...docs.slice(0, 3).map((d) => ({
          a: d.name,
          b: d.matterId,
          c: `v${d.version}`,
          d: d.verificationStatus,
          dTone: d.verificationStatus,
        })),
      ],
    },
    "compliance/conflict-checks": {
      title: "Conflict Checks",
      description: "Conflict of interest screening records for clients and opposing parties.",
      kpis: [
        { label: "Checks run", value: "12", hint: "This week", tone: "deep" },
        { label: "Clear", value: "11", hint: "No conflict", tone: "positive" },
        { label: "Escalate", value: "1", hint: "Manual review", tone: "warning" },
      ],
      columns: ["Check", "Matter", "Result", "Status"],
      rows: [
        { a: "Client name screen", b: `${matter.clientName} · ${matter.id}`, c: "No match in opposing parties", d: "Clear", dTone: "verified" },
        { a: "Creditor conflict", b: `${matter.id}`, c: "Halbury Bank — existing matter link none", d: "Clear", dTone: "verified" },
        { a: "Related party screen", b: "MAT-2026-3104", c: "Shared address flag reviewed", d: "Clear", dTone: "verified" },
        { a: "Staff conflict", b: "MAT-2026-8821", c: "Possible acquaintance — escalated", d: "Escalate", dTone: "flagged" },
        { a: "Partner firm conflict", b: "MAT-2026-7492", c: "IP firm previously engaged — waived", d: "Waived", dTone: "active" },
      ],
    },
    "compliance/identity-checks": {
      title: "Identity Checks",
      description: "ID verification outcomes and outstanding AML identity tasks.",
      kpis: [
        { label: "ID verified", value: "7", hint: "Matters complete", tone: "positive" },
        { label: "Pending", value: "2", hint: "Client chase", tone: "warning" },
        { label: "Failed OCR", value: "1", hint: "Re-upload needed", tone: "warning" },
      ],
      columns: ["Check", "Matter", "Detail", "Status"],
      rows: [
        { a: "Passport / photo ID", b: `${matter.clientName} · ${matter.id}`, c: "OCR match to NI & DOB", d: "Verified", dTone: "verified" },
        { a: "Proof of address", b: `${matter.id}`, c: "Utility bill within 3 months", d: "Verified", dTone: "verified" },
        { a: "Photo ID page", b: "MAT-2026-1104", c: "Cropped upload — unreadable", d: "Failed", dTone: "flagged" },
        { a: "AML name screen", b: "MAT-2026-7492", c: "No PEP / sanctions hit", d: "Clear", dTone: "verified" },
        { a: "Right to remain", b: "MAT-2026-3104", c: "Awaiting client document", d: "Pending", dTone: "pending" },
      ],
    },
    "compliance/client-consent": {
      title: "Client Consent",
      description: "Consent captures for advice, data processing, open banking, and referrals.",
      kpis: [
        { label: "Consents held", value: "4", hint: `${matter.clientName}`, tone: "deep" },
        { label: "Signed", value: "3", hint: "Electronically", tone: "positive" },
        { label: "Outstanding", value: "1", hint: "Referral consent", tone: "warning" },
      ],
      columns: ["Consent type", "Matter", "Captured", "Status"],
      rows: [
        { a: "Advice & representation", b: `${matter.id}`, c: "2026-06-12", d: "Signed", dTone: "verified" },
        { a: "Data processing (GDPR)", b: `${matter.id}`, c: "2026-06-12", d: "Signed", dTone: "verified" },
        { a: "Open banking share", b: `${matter.id}`, c: "2026-06-14", d: "Signed", dTone: "verified" },
        { a: "Referral to IP / partner", b: `${matter.id}`, c: "—", d: "Outstanding", dTone: "pending" },
        { a: "Marketing / research", b: "MAT-2026-7492", c: "2026-07-02", d: "Declined", dTone: "flagged" },
      ],
    },
    "compliance/gdpr-records": {
      title: "GDPR Records",
      description: "Processing records, retention schedules, and subject-access readiness.",
      kpis: [
        { label: "ROPA entries", value: "9", hint: "Active processing", tone: "deep" },
        { label: "Retention OK", value: "8", hint: "Within schedule", tone: "positive" },
        { label: "SAR open", value: "0", hint: "Subject access", tone: "positive" },
      ],
      columns: ["Record", "Matter / scope", "Basis", "Status"],
      rows: [
        { a: "Client onboarding data", b: `${matter.id}`, c: "Contract / legal obligation", d: "Active", dTone: "active" },
        { a: "Bank statement OCR store", b: "All open matters", c: "Legitimate interest", d: "Active", dTone: "active" },
        { a: "Advice letter archive", b: "Completed matters", c: "Legal obligation (6 yrs)", d: "Retained", dTone: "verified" },
        { a: "Open banking tokens", b: `${matter.id}`, c: "Consent — revoke on close", d: "Active", dTone: "active" },
        { a: "Marketing suppression", b: "Firm-wide", c: "Consent withdrawal", d: "Applied", dTone: "verified" },
      ],
    },
    "compliance/matter-reviews": {
      title: "Matter Reviews",
      description: "Quality and file reviews completed by the supervising solicitor function.",
      kpis: [
        { label: "Reviews done", value: "5", hint: "This month", tone: "deep" },
        { label: "Pass", value: "4", hint: "File quality", tone: "positive" },
        { label: "Actions open", value: "1", hint: "Follow-up", tone: "warning" },
      ],
      columns: ["Review", "Matter", "Reviewer", "Status"],
      rows: [
        { a: "Pre-advice file review", b: `${matter.clientName} · ${matter.id}`, c: "Patricia Holloway", d: "In progress", dTone: "pending" },
        { a: "DRO pack QA", b: `${matter.id}`, c: "Rachel Okonkwo", d: "Pass", dTone: "verified" },
        { a: "Closing file checklist", b: "MAT-2026-7011", c: "Patricia Holloway", d: "Pass", dTone: "verified" },
        { a: "Override sample audit", b: "MAT-2026-9210", c: "Daniel Acheampong", d: "Action required", dTone: "flagged" },
        { a: "Breathing Space urgency QA", b: "MAT-2026-3104", c: "Rachel Okonkwo", d: "Pass", dTone: "verified" },
      ],
    },
    "compliance/approvals": {
      title: "Approvals",
      description: "Solicitor approvals, amendments, rejections, and overrides awaiting or completed.",
      kpis: [
        { label: "Recorded", value: `${approvals.length}`, hint: "With decision", tone: "deep" },
        { label: "Approved", value: `${approvals.filter((m) => m.solicitorDecision?.action === "approve").length}`, hint: "Issued path", tone: "positive" },
        { label: "Overrides", value: `${approvals.filter((m) => m.solicitorDecision?.action === "override" || m.solicitorDecision?.action === "reject").length}`, hint: "Human change", tone: "warning" },
      ],
      columns: ["Decision", "Matter", "Detail", "Status"],
      rows:
        approvals.length > 0
          ? approvals.map((m) => ({
              a: "Solicitor decision",
              b: `${m.clientName} · ${m.id}`,
              c: `${m.solicitorDecision?.action}${m.solicitorDecision?.notes ? ` — ${m.solicitorDecision.notes}` : ""}`,
              d: "Recorded",
              dTone: "active",
            }))
          : [
              { a: "Approve DRO package", b: `${matter.clientName} · ${matter.id}`, c: "Awaiting final sign-off", d: "Pending", dTone: "pending" },
              { a: "Approve IVA advice", b: "MAT-2026-7492", c: "Issued to client", d: "Approved", dTone: "verified" },
              { a: "Reject AI recommendation", b: "MAT-2026-9210", c: "Override logged", d: "Rejected", dTone: "flagged" },
            ],
    },
  };

  const cfg = configs[slug];
  if (!cfg) return <FallbackSectionPage path={slug} />;

  return (
    <div className="space-y-6 pb-10">
      <PageHeader eyebrow="Compliance Engine" title={cfg.title} description={cfg.description} />
      <div className="grid gap-5 sm:grid-cols-3">
        {cfg.kpis.map((kpi) => (
          <StatCard
            key={kpi.label}
            icon={CheckCircle2}
            label={kpi.label}
            value={kpi.value}
            hint={kpi.hint}
            {...(kpi.tone ? { tone: kpi.tone } : {})}
          />
        ))}
      </div>
      <Card className="surface-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-display">{cfg.title}</CardTitle>
          <CardDescription className="text-xs">Static compliance snapshot for solicitor review</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {cfg.columns.map((col) => (
                  <TableHead key={col} className="text-xs font-semibold">
                    {col}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {cfg.rows.map((row, i) => (
                <TableRow key={`${slug}-${i}`} className="text-xs">
                  <TableCell className="font-semibold">{row.a}</TableCell>
                  <TableCell>{row.b}</TableCell>
                  <TableCell className="text-muted-foreground">{row.c}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-[0.65rem] capitalize border ${statusBadge(row.dTone ?? row.d.toLowerCase())}`}
                    >
                      {row.d}
                    </Badge>
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

function WorkflowRemindersPage() {
  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        eyebrow="Rules & Configuration"
        title="Workflow & Reminders"
        description="Automations and reminder cadences for review SLAs, document chases, and escalations."
      />
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="surface-card">
          <CardHeader>
            <CardTitle className="text-base font-display">Workflows</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {WORKFLOWS.map((w) => (
              <div key={w.id} className="rounded-xl border border-border/70 p-3 text-xs flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-sm">{w.name}</div>
                  <div className="text-muted-foreground mt-0.5">Trigger: {w.trigger}</div>
                  <div className="text-muted-foreground">{w.steps} steps · Last run {w.lastRun}</div>
                </div>
                <Badge variant="outline" className={`text-[0.65rem] border ${statusBadge(w.enabled ? "active" : "draft")}`}>
                  {w.enabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="surface-card">
          <CardHeader>
            <CardTitle className="text-base font-display">Reminders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {REMINDER_SETTINGS.map((r) => (
              <div key={r.id} className="rounded-xl border border-border/70 p-3 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-semibold text-sm">{r.name}</div>
                  <Badge variant="outline" className={`text-[0.65rem] border ${statusBadge(r.enabled ? "active" : "draft")}`}>
                    {r.enabled ? "On" : "Off"}
                  </Badge>
                </div>
                <div className="text-muted-foreground mt-1">
                  {r.channel} · {r.interval} · {r.sentLast7d} sent (7d)
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DocumentTemplatesPage() {
  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        eyebrow="Rules & Configuration"
        title="Document Templates"
        description="Managed templates for advice letters, schedules, and compliance notices."
        actions={
          <Button className="rounded-xl gradient-deep text-primary-foreground shadow-soft">
            <Plus className="size-4 mr-1.5" /> New Template
          </Button>
        }
      />
      <Card className="surface-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs font-semibold">Template</TableHead>
                <TableHead className="text-xs font-semibold">Category</TableHead>
                <TableHead className="text-xs font-semibold">Usage</TableHead>
                <TableHead className="text-xs font-semibold">Modified</TableHead>
                <TableHead className="text-xs font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DOCUMENT_TEMPLATES.map((t) => (
                <TableRow key={t.id} className="text-xs hover:bg-muted/50">
                  <TableCell className="font-semibold">{t.name}</TableCell>
                  <TableCell>{t.category}</TableCell>
                  <TableCell>{t.usageCount.toLocaleString()}</TableCell>
                  <TableCell className="text-muted-foreground">{t.lastModified}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[0.65rem] capitalize border ${statusBadge(t.status)}`}>
                      {t.status}
                    </Badge>
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

function RiskEngineSectionPage({
  mode,
}: {
  mode: "risk-identification" | "risk-score" | "missing-documents";
}) {
  const matter =
    INITIAL_MATTERS.find((m) => m.status === "awaiting_review" || m.status === "urgent_review") ||
    INITIAL_MATTERS[0];

  const riskCategories = [
    { label: "Missing Documents", flagged: true, severity: "Medium" },
    { label: "Unverified Debts", flagged: false, severity: "Low" },
    { label: "Unreasonable Expenditure", flagged: false, severity: "Low" },
    { label: "Hidden Assets", flagged: false, severity: "Low" },
    { label: "Potential Fraud Indicators", flagged: false, severity: "Low" },
    { label: "Preference Payments", flagged: false, severity: "Low" },
    { label: "Enforcement Action", flagged: true, severity: "High" },
    { label: "Statutory Demands", flagged: false, severity: "Low" },
  ];

  const scoreDrivers = [
    { label: "Document completeness", weight: 22, note: "One payslip page outstanding" },
    { label: "Debt verification", weight: 18, note: "All listed creditors OCR-verified" },
    { label: "Enforcement exposure", weight: 28, note: "Priority arrears under monitoring" },
    { label: "Asset integrity", weight: 12, note: "No undervalue or preference flags" },
  ];

  const missingDocs = [
    { name: "Payslip — June 2026.pdf", reason: "Latest month not uploaded", priority: "High" },
    { name: "Creditor letter — Orbit Catalogue", reason: "Requested for balance confirmation", priority: "Medium" },
    { name: "ID proof (photo page)", reason: "Passport page cropped / unreadable", priority: "Medium" },
  ];

  const flaggedCount = riskCategories.filter((r) => r.flagged).length;
  const riskScore = Math.min(100, flaggedCount * 18 + 12);
  const riskBand = riskScore >= 70 ? "High" : riskScore >= 40 ? "Medium" : "Low";

  if (mode === "risk-identification") {
    return (
      <div className="space-y-6 pb-10">
        <PageHeader
          eyebrow="Risk Engine"
          title="Risk Identification"
          description={`Compliance and case-integrity risks for ${matter.clientName} (${matter.id}).`}
        />
        <div className="grid gap-5 sm:grid-cols-3">
          <StatCard icon={FileSearch} label="Flagged checks" value={`${flaggedCount}`} hint={`Of ${riskCategories.length}`} tone="warning" />
          <StatCard icon={ShieldAlert} label="Matter risk" value={matter.riskLevel} hint="Overall classification" tone="warning" />
          <StatCard icon={AlertTriangle} label="High severity" value={`${riskCategories.filter((r) => r.flagged && r.severity === "High").length}`} hint="Active high flags" />
        </div>
        <Card className="surface-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display">Risk checks</CardTitle>
            <CardDescription className="text-xs">Static Risk Engine screen results</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs font-semibold">Check</TableHead>
                  <TableHead className="text-xs font-semibold">Status</TableHead>
                  <TableHead className="text-xs font-semibold">Severity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {riskCategories.map((row) => (
                  <TableRow key={row.label} className="text-xs">
                    <TableCell className="font-semibold">{row.label}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-[0.62rem] ${
                          row.flagged
                            ? "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300"
                            : "border-border"
                        }`}
                      >
                        {row.flagged ? "Flagged" : "Clear"}
                      </Badge>
                    </TableCell>
                    <TableCell className="capitalize">{row.severity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (mode === "risk-score") {
    return (
      <div className="space-y-6 pb-10">
        <PageHeader
          eyebrow="Risk Engine"
          title="Risk Score"
          description={`Composite score used to prioritise solicitor triage for ${matter.clientName}.`}
        />
        <div className="grid gap-5 sm:grid-cols-3">
          <StatCard icon={Gauge} label="Risk score" value={`${riskScore}/100`} hint={`${riskBand} band`} tone="warning" />
          <StatCard icon={FileSearch} label="Flagged drivers" value={`${flaggedCount}`} hint="Active indicators" tone="warning" />
          <StatCard icon={CheckCircle2} label="AI confidence" value={`${matter.aiConfidenceScore}%`} hint={matter.aiRecommendedSolution} />
        </div>
        <Card className="surface-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display">Score drivers</CardTitle>
            <CardDescription className="text-xs">Weighted inputs feeding the composite score</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {scoreDrivers.map((driver) => (
              <div key={driver.label} className="space-y-1.5">
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="font-semibold">{driver.label}</span>
                  <span className="tabular-nums text-muted-foreground">{driver.weight}%</span>
                </div>
                <Progress value={driver.weight * 3} className="h-2" />
                <p className="text-[0.7rem] text-muted-foreground">{driver.note}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        eyebrow="Risk Engine"
        title="Missing Documents"
        description={`Evidence gaps blocking full verification for ${matter.clientName} (${matter.id}).`}
      />
      <div className="grid gap-5 sm:grid-cols-3">
        <StatCard icon={FileWarning} label="Missing items" value={`${missingDocs.length}`} hint="Client chase required" tone="warning" />
        <StatCard
          icon={FileText}
          label="On file"
          value={`${matter.documents.length}`}
          hint="Uploaded documents"
          tone="positive"
        />
        <StatCard icon={Flag} label="Review flag" value="Raised" hint="Awaiting evidence" tone="deep" />
      </div>
      <Card className="surface-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-display">Outstanding evidence</CardTitle>
          <CardDescription className="text-xs">Static checklist for solicitor follow-up</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-semibold">Document</TableHead>
                <TableHead className="text-xs font-semibold">Reason</TableHead>
                <TableHead className="text-xs font-semibold">Priority</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {missingDocs.map((doc) => (
                <TableRow key={doc.name} className="text-xs">
                  <TableCell className="font-semibold">{doc.name}</TableCell>
                  <TableCell className="text-muted-foreground">{doc.reason}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-[0.62rem] ${
                        doc.priority === "High"
                          ? "border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300"
                          : "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300"
                      }`}
                    >
                      {doc.priority}
                    </Badge>
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

function DebtSolutionAspectPage({
  mode,
}: {
  mode:
    | "advantages"
    | "disadvantages"
    | "eligibility"
    | "risks"
    | "alternative-options"
    | "why-recommended"
    | "why-rejected";
}) {
  const matter =
    INITIAL_MATTERS.find((m) => m.status === "awaiting_review" || m.status === "urgent_review") ||
    INITIAL_MATTERS[0];

  const content: Record<
    typeof mode,
    { title: string; description: string; rows: { label: string; detail: string }[] }
  > = {
    advantages: {
      title: "Advantages",
      description: `Key benefits of the recommended ${matter.aiRecommendedSolution}.`,
      rows: [
        {
          label: "Debt write-off",
          detail: "Writes off qualifying unsecured debt after 12 months if criteria continue to be met.",
        },
        {
          label: "Low cost route",
          detail: "DRO application fee is significantly lower than bankruptcy or IVA setup costs.",
        },
        {
          label: "Enforcement pause",
          detail: "Once approved, most creditor enforcement action is stopped for qualifying debts.",
        },
      ],
    },
    disadvantages: {
      title: "Disadvantages",
      description: "Limitations and consequences the client should understand before consent.",
      rows: [
        {
          label: "Credit impact",
          detail: "Credit file impact typically lasts six years; restrictions on obtaining further credit.",
        },
        {
          label: "Public register",
          detail: "DRO details appear on the Individual Insolvency Register during the order period.",
        },
        {
          label: "Asset limits",
          detail: "Strict asset and surplus thresholds apply; breach can lead to revocation.",
        },
      ],
    },
    eligibility: {
      title: "Eligibility",
      description: "Static eligibility checks against current DRO / insolvency criteria.",
      rows: [
        {
          label: "Total debt",
          detail: `${gbp(matter.totalDebt)} — under the £50,000 UK DRO qualifying debt threshold.`,
        },
        {
          label: "Disposable income",
          detail: `${gbp(matter.disposableIncome)}/mo — within surplus limits once health expenditure is considered.`,
        },
        {
          label: "Assets",
          detail: "Declared assets remain below the £2,000 DRO asset threshold (vehicle exemption applied).",
        },
        {
          label: "Jurisdiction",
          detail: "Client resident in England & Wales for over 3 years.",
        },
      ],
    },
    risks: {
      title: "Risks",
      description: "Residual risks if the recommended solution proceeds or is delayed.",
      rows: [
        {
          label: "Application refusal",
          detail: "Application may be refused if assets or income change before approval.",
        },
        {
          label: "Enforcement window",
          detail: "Priority arrears may escalate if Breathing Space / DRO filing is delayed.",
        },
        {
          label: "Vulnerability pacing",
          detail: `${matter.vulnerability.replace(/_/g, " ")} may require adjusted communication and timing.`,
        },
      ],
    },
    "alternative-options": {
      title: "Alternative Options",
      description: "Other viable pathways retained for solicitor comparison.",
      rows: matter.alternativeSolutions.map((alt) => ({
        label: alt.name,
        detail: `Pros: ${alt.pros}. Cons: ${alt.cons}`,
      })),
    },
    "why-recommended": {
      title: "Why Recommended",
      description: `Why AI selected ${matter.aiRecommendedSolution} (${matter.aiConfidenceScore}% confidence).`,
      rows: matter.aiReasoning.map((reason, i) => ({
        label: `Reason ${i + 1}`,
        detail: reason,
      })),
    },
    "why-rejected": {
      title: "Why Rejected",
      description: "Solutions discounted by the engine and not presented as primary advice.",
      rows: matter.rejectedSolutions.map((rej) => ({
        label: rej.name,
        detail: rej.reason,
      })),
    },
  };

  const page = content[mode];

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        eyebrow="Debt Solution Engine"
        title={page.title}
        description={`${page.description} · ${matter.clientName} (${matter.id})`}
      />

      <div className="grid gap-5 sm:grid-cols-3">
        <StatCard
          icon={CheckCircle2}
          label="Recommended"
          value={matter.aiRecommendedSolution}
          hint={`${matter.aiConfidenceScore}% confidence`}
          tone="deep"
        />
        <StatCard icon={AlertTriangle} label="Risk level" value={matter.riskLevel} hint="Matter classification" tone="warning" />
        <StatCard icon={Flag} label="Items" value={String(page.rows.length)} hint={page.title} />
      </div>

      <Card className="surface-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-display">{page.title}</CardTitle>
          <CardDescription className="text-xs">Static snapshot for solicitor review</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-semibold w-[28%]">Item</TableHead>
                <TableHead className="text-xs font-semibold">Detail</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {page.rows.map((row) => (
                <TableRow key={row.label} className="text-xs">
                  <TableCell className="font-semibold align-top">{row.label}</TableCell>
                  <TableCell className="text-muted-foreground">{row.detail}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function VulnerabilityAssessmentSectionPage({
  mode,
}: {
  mode: "risk-assessment" | "solicitor-review-flag";
}) {
  const matter =
    INITIAL_MATTERS.find((m) => m.status === "awaiting_review" || m.status === "urgent_review") ||
    INITIAL_MATTERS[0];

  const riskRows = [
    {
      label: "Risk of Homelessness",
      status: "Monitor",
      detail: "Rent current; no possession claim on file.",
      active: false,
    },
    {
      label: "Risk of Enforcement",
      status: "Active",
      detail: "Council tax and utility arrears may escalate without Breathing Space cover.",
      active: true,
    },
    {
      label: "Risk of Bankruptcy",
      status: "Low",
      detail: "DRO pathway preferred; bankruptcy not recommended.",
      active: false,
    },
  ];

  const flagRows = [
    {
      label: "Vulnerability present",
      value: matter.vulnerability.replace(/_/g, " "),
      note: matter.vulnerabilityNotes || "No notes recorded.",
    },
    {
      label: "Overall risk level",
      value: matter.riskLevel,
      note: "AI triage + solicitor monitoring",
    },
    {
      label: "Review flag",
      value: "Raised",
      note: "Human-in-the-loop required before advice issue",
    },
    {
      label: "Assigned solicitor",
      value: matter.assignedSolicitor,
      note: `Due ${matter.dueDate}`,
    },
  ];

  if (mode === "risk-assessment") {
    return (
      <div className="space-y-6 pb-10">
        <PageHeader
          eyebrow="Vulnerability Assessment"
          title="Risk Assessment"
          description={`Outcome risks linked to debt pressure for ${matter.clientName} (${matter.id}).`}
        />

        <div className="grid gap-5 sm:grid-cols-3">
          <StatCard
            icon={ShieldAlert}
            label="Matter risk"
            value={matter.riskLevel}
            hint="Overall classification"
            tone="warning"
          />
          <StatCard icon={AlertTriangle} label="Active risks" value="1" hint="Of 3 risk areas" tone="warning" />
          <StatCard icon={Flag} label="Solicitor flag" value="Raised" hint="Review required" tone="deep" />
        </div>

        <Card className="surface-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display">Risk areas</CardTitle>
            <CardDescription className="text-xs">Static snapshot used for solicitor triage</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs font-semibold">Risk</TableHead>
                  <TableHead className="text-xs font-semibold">Status</TableHead>
                  <TableHead className="text-xs font-semibold">Detail</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {riskRows.map((row) => (
                  <TableRow key={row.label} className="text-xs">
                    <TableCell className="font-semibold">{row.label}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-[0.62rem] capitalize ${
                          row.active
                            ? "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300"
                            : "border-border"
                        }`}
                      >
                        {row.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{row.detail}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        eyebrow="Vulnerability Assessment"
        title="Solicitor Review Flag"
        description="This matter is escalated for solicitor sign-off before advice is issued to the client."
      />

      <div className="grid gap-5 sm:grid-cols-3">
        <StatCard icon={Flag} label="Review flag" value="Raised" hint="Awaiting solicitor" tone="deep" />
        <StatCard
          icon={ShieldAlert}
          label="Vulnerability"
          value={matter.vulnerability.replace(/_/g, " ")}
          hint="Identified flag"
          tone="warning"
        />
        <StatCard icon={CheckCircle2} label="AI confidence" value={`${matter.aiConfidenceScore}%`} hint={matter.aiRecommendedSolution} />
      </div>

      <Card className="surface-card">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-display">Flag status</CardTitle>
              <CardDescription className="text-xs">
                {matter.clientName} · {matter.id}
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-[0.65rem] border-primary/30 bg-primary/10 text-primary">
              Solicitor review
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-semibold">Item</TableHead>
                <TableHead className="text-xs font-semibold">Value</TableHead>
                <TableHead className="text-xs font-semibold">Note</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flagRows.map((row) => (
                <TableRow key={row.label} className="text-xs">
                  <TableCell className="font-semibold">{row.label}</TableCell>
                  <TableCell className="capitalize font-medium">{row.value}</TableCell>
                  <TableCell className="text-muted-foreground">{row.note}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function DebtAnalysisSectionPage({
  mode,
}: {
  mode: "debt-summary" | "priority-debts" | "non-priority-debts" | "secured-debts";
}) {
  const matter =
    INITIAL_MATTERS.find((m) => m.status === "awaiting_review" || m.status === "urgent_review") ||
    INITIAL_MATTERS[0];

  const priorityDebts = matter.debts.filter((d) => d.isPriority);
  const nonPriorityDebts = matter.debts.filter((d) => !d.isPriority);
  const securedDebts = [
    {
      id: "S1",
      creditor: "Nationwide Building Society",
      type: "Mortgage",
      balance: 142500,
      arrears: 0,
      interestRate: "4.2%",
      accountNumber: "MORT-4417",
      status: "verified" as const,
    },
    {
      id: "S2",
      creditor: "Black Horse Finance",
      type: "Vehicle HP",
      balance: 3850,
      arrears: 120,
      interestRate: "8.9%",
      accountNumber: "HP-2291",
      status: "verified" as const,
    },
  ];

  const rows =
    mode === "priority-debts"
      ? priorityDebts
      : mode === "non-priority-debts"
        ? nonPriorityDebts
        : mode === "secured-debts"
          ? securedDebts
          : matter.debts;

  const meta = {
    "debt-summary": {
      title: "Debt Summary",
      description: `Aggregated debt position for ${matter.clientName} (${matter.id}).`,
    },
    "priority-debts": {
      title: "Priority Debts",
      description: "Liabilities that can lead to serious enforcement action if unpaid.",
    },
    "non-priority-debts": {
      title: "Non-Priority Debts",
      description: "Unsecured consumer credit managed after priority liabilities.",
    },
    "secured-debts": {
      title: "Secured Debts",
      description: "Secured liabilities requiring separate treatment in advice and referral packs.",
    },
  }[mode];

  const totalShown = rows.reduce((sum, d) => sum + d.balance, 0);
  const arrearsShown = rows.reduce((sum, d) => sum + d.arrears, 0);

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        eyebrow="Debt Analysis Engine"
        title={meta.title}
        description={meta.description}
      />

      {mode === "debt-summary" ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={Landmark} label="Total debt" value={gbp(matter.totalDebt)} hint={`${matter.debts.length} accounts`} tone="deep" />
          <StatCard
            icon={AlertTriangle}
            label="Priority debts"
            value={gbp(matter.priorityDebtTotal)}
            hint={`${priorityDebts.length} creditors`}
            tone="warning"
          />
          <StatCard
            icon={CreditCard}
            label="Non-priority debts"
            value={gbp(matter.nonPriorityDebtTotal)}
            hint={`${nonPriorityDebts.length} creditors`}
          />
          <StatCard
            icon={Shield}
            label="Secured debts"
            value={gbp(securedDebts.reduce((s, d) => s + d.balance, 0))}
            hint={`${securedDebts.length} accounts`}
          />
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            icon={mode === "priority-debts" ? AlertTriangle : mode === "secured-debts" ? Shield : CreditCard}
            label="Total balance"
            value={gbp(totalShown)}
            hint={`${rows.length} accounts`}
            tone={mode === "priority-debts" ? "warning" : "default"}
          />
          <StatCard icon={AlertTriangle} label="Arrears" value={gbp(arrearsShown)} hint="Outstanding overdue" tone={arrearsShown > 0 ? "warning" : "positive"} />
          <StatCard icon={CheckCircle2} label="Verified" value={`${rows.filter((d) => d.status === "verified").length}`} hint="OCR confirmed" tone="positive" />
        </div>
      )}

      <Card className="surface-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-display">
            {mode === "debt-summary" ? "All creditors" : meta.title}
          </CardTitle>
          <CardDescription className="text-xs">
            Static matter snapshot · {matter.clientName} · {matter.id}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-semibold">Creditor</TableHead>
                <TableHead className="text-xs font-semibold">Type</TableHead>
                {mode === "debt-summary" && (
                  <TableHead className="text-xs font-semibold">Class</TableHead>
                )}
                <TableHead className="text-xs font-semibold text-right">Balance</TableHead>
                <TableHead className="text-xs font-semibold text-right">Arrears</TableHead>
                <TableHead className="text-xs font-semibold">Rate</TableHead>
                <TableHead className="text-xs font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((d) => (
                <TableRow key={d.id} className="text-xs">
                  <TableCell className="font-semibold">
                    <div>{d.creditor}</div>
                    <div className="font-mono text-[0.65rem] text-muted-foreground">{d.accountNumber}</div>
                  </TableCell>
                  <TableCell>{d.type}</TableCell>
                  {mode === "debt-summary" && "isPriority" in d && (
                    <TableCell>
                      <Badge variant={d.isPriority ? "destructive" : "secondary"} className="text-[0.62rem]">
                        {d.isPriority ? "Priority" : "Non-priority"}
                      </Badge>
                    </TableCell>
                  )}
                  <TableCell className="text-right tabular-nums font-semibold">{gbp(d.balance)}</TableCell>
                  <TableCell className={`text-right tabular-nums ${d.arrears > 0 ? "text-rose-600 font-semibold" : ""}`}>
                    {gbp(d.arrears)}
                  </TableCell>
                  <TableCell>{d.interestRate}</TableCell>
                  <TableCell className="capitalize text-emerald-600 dark:text-emerald-400 font-medium">{d.status.replace(/_/g, " ")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function FinancialSummaryPage() {
  const matter =
    INITIAL_MATTERS.find((m) => m.status === "awaiting_review" || m.status === "urgent_review") ||
    INITIAL_MATTERS[0];

  const incomeRows = [
    { label: "Employment (net)", value: matter.monthlyNetIncome, note: matter.employerName },
    { label: "Benefits / awards", value: matter.benefitsIncome, note: "Verified awards" },
    { label: "Other income", value: Math.max(0, matter.totalIncome - matter.monthlyNetIncome - matter.benefitsIncome), note: "Declared" },
  ];

  const expenseRows = [
    { label: "Housing & utilities", value: 980, note: "Rent, council tax, energy" },
    { label: "Food & housekeeping", value: 420, note: "SFS guideline" },
    { label: "Travel & work costs", value: 185, note: "Public transport" },
    { label: "Health & care", value: 210, note: "Ongoing medical costs" },
    { label: "Communications", value: 65, note: "Phone & broadband" },
    { label: "Other essential spend", value: Math.max(0, matter.monthlyExpenses - 980 - 420 - 185 - 210 - 65), note: "Clothing, contingencies" },
  ];

  const surplusRate = matter.totalIncome
    ? Math.round((matter.disposableIncome / matter.totalIncome) * 100)
    : 0;
  const debtToIncome = matter.totalIncome
    ? Math.round((matter.totalDebt / (matter.totalIncome * 12)) * 100)
    : 0;

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        eyebrow="AI Financial Statement"
        title="Financial Summary"
        description={`Standard Financial Statement overview for ${matter.clientName} (${matter.id}). Figures verified against uploaded bank statements.`}
        actions={
          <Button variant="outline" className="rounded-xl">
            <Download className="size-4 mr-1.5" /> Export summary
          </Button>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Wallet} label="Total income" value={gbp(matter.totalIncome)} hint="Per month" />
        <StatCard icon={ArrowDownRight} label="Total expenses" value={gbp(matter.monthlyExpenses)} hint="Essential costs" />
        <StatCard
          icon={PiggyBank}
          label="Disposable income"
          value={gbp(matter.disposableIncome)}
          hint={`${surplusRate}% of income`}
          tone="positive"
        />
        <StatCard
          icon={TrendingUp}
          label="Monthly surplus"
          value={gbp(matter.disposableIncome)}
          hint="Available for creditors"
          tone="deep"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="surface-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display">Income breakdown</CardTitle>
            <CardDescription className="text-xs">
              {matter.employmentStatus} · NI {matter.niNumber}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs font-semibold">Source</TableHead>
                  <TableHead className="text-xs font-semibold">Detail</TableHead>
                  <TableHead className="text-xs font-semibold text-right">Monthly</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incomeRows.map((row) => (
                  <TableRow key={row.label} className="text-xs">
                    <TableCell className="font-semibold">{row.label}</TableCell>
                    <TableCell className="text-muted-foreground">{row.note}</TableCell>
                    <TableCell className="text-right tabular-nums font-medium">{gbp(row.value)}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="text-xs bg-muted/40 hover:bg-muted/40">
                  <TableCell className="font-semibold" colSpan={2}>
                    Total monthly income
                  </TableCell>
                  <TableCell className="text-right tabular-nums font-semibold">{gbp(matter.totalIncome)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="surface-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display">Expenditure breakdown</CardTitle>
            <CardDescription className="text-xs">Aligned to Standard Financial Statement categories</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs font-semibold">Category</TableHead>
                  <TableHead className="text-xs font-semibold">Detail</TableHead>
                  <TableHead className="text-xs font-semibold text-right">Monthly</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenseRows.map((row) => (
                  <TableRow key={row.label} className="text-xs">
                    <TableCell className="font-semibold">{row.label}</TableCell>
                    <TableCell className="text-muted-foreground">{row.note}</TableCell>
                    <TableCell className="text-right tabular-nums font-medium">{gbp(row.value)}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="text-xs bg-muted/40 hover:bg-muted/40">
                  <TableCell className="font-semibold" colSpan={2}>
                    Total monthly expenditure
                  </TableCell>
                  <TableCell className="text-right tabular-nums font-semibold">{gbp(matter.monthlyExpenses)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card className="surface-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display">Affordability summary</CardTitle>
            <CardDescription className="text-xs">Key ratios used by the AI recommendation engine</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="divide-y divide-border text-sm">
              {[
                ["Total monthly income", gbp(matter.totalIncome)],
                ["Total monthly expenditure", gbp(matter.monthlyExpenses)],
                ["Disposable income / surplus", gbp(matter.disposableIncome)],
                ["Suggested creditor offer (80%)", gbp(Math.round(matter.disposableIncome * 0.8))],
                ["Contingency retained (20%)", gbp(Math.round(matter.disposableIncome * 0.2))],
                ["Total debt", gbp(matter.totalDebt)],
                ["Debt-to-annual-income ratio", `${debtToIncome}%`],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between py-3 gap-4">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="font-semibold tabular-nums">{v}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        <Card className="surface-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display">Matter context</CardTitle>
            <CardDescription className="text-xs">Linked client and review status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Client</span>
              <span className="font-semibold text-right">{matter.clientName}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Matter</span>
              <span className="font-mono text-xs font-semibold">{matter.id}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Risk level</span>
              <Badge variant="outline" className="capitalize text-[0.65rem]">
                {matter.riskLevel}
              </Badge>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">AI recommendation</span>
              <span className="font-semibold text-right text-xs">{matter.aiRecommendedSolution}</span>
            </div>
            <div className="rounded-xl bg-muted/70 p-4 text-xs leading-relaxed text-muted-foreground">
              Figures follow Standard Financial Statement guidelines. Solicitor review may adjust allowances before
              advice is issued.
            </div>
            <Button asChild variant="outline" className="w-full rounded-xl">
              <Link to={`/solicitor/matters/${matter.id}` as any}>Open full matter review</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function FallbackSectionPage(path: string) {
  const item = solicitorNav.flatMap((g) => g.items).find((i) => i.to === `/solicitor/${path}`);
  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        eyebrow="Solicitor Portal"
        title={item?.label ?? "Section"}
        description="This workspace section is available in the solicitor super-admin navigation."
      />
      <Card className="surface-card">
        <CardContent className="p-6 text-sm text-muted-foreground flex items-start gap-3">
          <AlertTriangle className="size-5 text-amber-500 shrink-0 mt-0.5" />
          Content for this section will continue to expand. Existing matter, document, task, and audit tools remain
          available from Overview.
        </CardContent>
      </Card>
    </div>
  );
}

export function SolicitorSectionPage({ splat }: { splat: string }) {
  const path = splat.replace(/^\/+|\/+$/g, "").replace(/^solicitor\//, "");

  if (!path) {
    return <FallbackSectionPage path="" />;
  }

  if (path === "financial-summary") return <FinancialSummaryPage />;
  if (path.startsWith("risk-engine/")) {
    const section = path.replace("risk-engine/", "");
    if (
      section === "risk-identification" ||
      section === "risk-score" ||
      section === "missing-documents"
    ) {
      return <RiskEngineSectionPage mode={section} />;
    }
  }
  if (path.startsWith("debt-solution-engine/")) {
    const aspect = path.replace("debt-solution-engine/", "");
    const allowed = [
      "advantages",
      "disadvantages",
      "eligibility",
      "risks",
      "alternative-options",
      "why-recommended",
      "why-rejected",
    ] as const;
    if ((allowed as readonly string[]).includes(aspect)) {
      return <DebtSolutionAspectPage mode={aspect as (typeof allowed)[number]} />;
    }
  }
  if (path === "vulnerability-assessment/risk-assessment") {
    return <VulnerabilityAssessmentSectionPage mode="risk-assessment" />;
  }
  if (path === "vulnerability-assessment/solicitor-review-flag") {
    return <VulnerabilityAssessmentSectionPage mode="solicitor-review-flag" />;
  }
  if (path === "debt-analysis-engine/debt-summary") {
    return <DebtAnalysisSectionPage mode="debt-summary" />;
  }
  if (path === "debt-analysis-engine/priority-debts") {
    return <DebtAnalysisSectionPage mode="priority-debts" />;
  }
  if (path === "debt-analysis-engine/non-priority-debts") {
    return <DebtAnalysisSectionPage mode="non-priority-debts" />;
  }
  if (path === "debt-analysis-engine/secured-debts") {
    return <DebtAnalysisSectionPage mode="secured-debts" />;
  }
  if (path.startsWith("letters/") && LETTER_SPECS[path]) {
    return <LetterLibraryPage {...LETTER_SPECS[path]} />;
  }
  if (path.startsWith("integrations/") && INTEGRATION_SPECS[path]) {
    return <IntegrationDetailPage {...INTEGRATION_SPECS[path]} />;
  }
  if (path.startsWith("reports/") && REPORT_SPECS[path]) {
    return <ReportPage {...REPORT_SPECS[path]} />;
  }
  if (path === "referrals" || path === "referrals/") return <ReferralsPage mode="list" />;
  if (path === "referrals/create") return <ReferralsPage mode="create" />;
  if (path === "referrals/pack") return <ReferralsPage mode="pack" />;
  if (path === "referrals/status") return <ReferralsPage mode="status" />;
  if (path.startsWith("compliance/")) {
    return <CompliancePage slug={path} />;
  }
  if (path === "rules/legal") {
    return (
      <RulesTable
        title="Legal Rules"
        description="Configure jurisdictional insolvency rules and SRA compliance parameters."
        rules={LEGAL_RULES}
      />
    );
  }
  if (path === "rules/risk") {
    return (
      <RulesTable
        title="Risk Rules"
        description="Risk scoring thresholds, escalation triggers, and enforcement flags."
        rules={RISK_RULES}
      />
    );
  }
  if (path === "rules/debt-solution") {
    return (
      <RulesTable
        title="Debt Solution Rules"
        description="Eligibility and recommendation rules for DRO, IVA, DMP, and Breathing Space."
        rules={DEBT_SOLUTION_RULES}
      />
    );
  }
  if (path === "rules/vulnerability") {
    return (
      <RulesTable
        title="Vulnerability Rules"
        description="Vulnerability detection, safeguarding, and specialist referral rules."
        rules={VULNERABILITY_RULES}
      />
    );
  }
  if (path === "rules/document-templates") return <DocumentTemplatesPage />;
  if (path === "rules/workflow-reminders") return <WorkflowRemindersPage />;

  // Keep financial rules data reachable for completeness if linked later
  if (path === "rules/financial") {
    return (
      <RulesTable
        title="Financial Rules"
        description="Affordability and surplus calculation parameters."
        rules={FINANCIAL_RULES}
      />
    );
  }

  return <FallbackSectionPage path={path} />;
}
