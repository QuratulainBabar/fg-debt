import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  Eye,
  FileText,
  Plus,
  RefreshCcw,
  Settings as SettingsIcon,
} from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
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

  if (mode === "create") {
    return (
      <div className="space-y-6 pb-10 max-w-3xl">
        <PageHeader
          eyebrow="Referrals"
          title="Create Referral"
          description="Initiate a regulated referral to an insolvency practitioner or specialist support partner."
        />
        <Card className="surface-card">
          <CardContent className="p-6 space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Matter</label>
              <Input className="mt-1.5" defaultValue="MAT-2026-4417 — Amelia Hartley" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Referral partner</label>
              <Input className="mt-1.5" placeholder="Select partner…" defaultValue={REFERRAL_PARTNERS[0]?.name} />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Reason</label>
              <Input className="mt-1.5" placeholder="e.g. IVA nominee required" />
            </div>
            <Button className="rounded-xl gradient-deep text-primary-foreground shadow-soft">
              <Plus className="size-4 mr-1.5" /> Create Referral
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (mode === "pack") {
    return (
      <div className="space-y-6 pb-10">
        <PageHeader
          eyebrow="Referrals"
          title="Referral Pack"
          description="Document bundles assembled for partner handoff, including SFS, debt schedule, and advice summary."
        />
        <Card className="surface-card">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs font-semibold">Pack item</TableHead>
                  <TableHead className="text-xs font-semibold">Required</TableHead>
                  <TableHead className="text-xs font-semibold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  "Financial Statement (SFS)",
                  "Debt Schedule",
                  "Advice Summary",
                  "Identity Verification",
                  "Client Consent",
                  "Referral Cover Letter",
                ].map((item, i) => (
                  <TableRow key={item} className="text-xs">
                    <TableCell className="font-semibold">{item}</TableCell>
                    <TableCell>{i < 5 ? "Yes" : "Optional"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-[0.65rem] border ${statusBadge(i < 4 ? "verified" : "pending")}`}>
                        {i < 4 ? "Ready" : "Pending"}
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

  const title = mode === "status" ? "Referral Status" : "Referral List";
  const description =
    mode === "status"
      ? "Track initiated, accepted, in-progress, and completed referrals across matters."
      : "All active and historical referrals from solicitor-managed matters.";

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        eyebrow="Referrals"
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

      {mode === "list" && (
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
      )}
    </div>
  );
}

function CompliancePage(slug: string) {
  const docs = INITIAL_MATTERS.flatMap((m) =>
    m.documents.map((d) => ({ ...d, matterId: m.id, clientName: m.clientName }))
  );
  const approvals = INITIAL_MATTERS.filter((m) => m.solicitorDecision);

  const configs: Record<string, { title: string; description: string }> = {
    "compliance/advice-history": {
      title: "Advice History",
      description: "Chronology of advice drafts, amendments, and solicitor-issued letters.",
    },
    "compliance/document-history": {
      title: "Document History",
      description: "Upload, OCR, verification, and version events across matter documents.",
    },
    "compliance/version-control": {
      title: "Version Control",
      description: "Document and advice version lineage for audit and rollback awareness.",
    },
    "compliance/conflict-checks": {
      title: "Conflict Checks",
      description: "Conflict of interest screening records for clients and opposing parties.",
    },
    "compliance/identity-checks": {
      title: "Identity Checks",
      description: "ID verification outcomes and outstanding AML identity tasks.",
    },
    "compliance/client-consent": {
      title: "Client Consent",
      description: "Consent captures for advice, data processing, open banking, and referrals.",
    },
    "compliance/gdpr-records": {
      title: "GDPR Records",
      description: "Processing records, retention schedules, and subject-access readiness.",
    },
    "compliance/matter-reviews": {
      title: "Matter Reviews",
      description: "Quality and file reviews completed by the supervising solicitor function.",
    },
    "compliance/approvals": {
      title: "Approvals",
      description: "Solicitor approvals, amendments, rejections, and overrides awaiting or completed.",
    },
  };

  const cfg = configs[slug];
  if (!cfg) return <FallbackSectionPage path={slug} />;

  return (
    <div className="space-y-6 pb-10">
      <PageHeader eyebrow="Compliance & Audit" title={cfg.title} description={cfg.description} />
      <Card className="surface-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs font-semibold">Record</TableHead>
                <TableHead className="text-xs font-semibold">Matter</TableHead>
                <TableHead className="text-xs font-semibold">Detail</TableHead>
                <TableHead className="text-xs font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {slug === "compliance/approvals"
                ? approvals.map((m) => (
                    <TableRow key={m.id} className="text-xs">
                      <TableCell className="font-semibold">Solicitor decision</TableCell>
                      <TableCell className="font-mono">{m.id}</TableCell>
                      <TableCell className="capitalize">{m.solicitorDecision?.action}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-[0.65rem] border ${statusBadge("active")}`}>
                          Recorded
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                : docs.slice(0, 8).map((d) => (
                    <TableRow key={`${slug}-${d.id}`} className="text-xs">
                      <TableCell className="font-semibold">{d.name}</TableCell>
                      <TableCell>
                        <div>{d.clientName}</div>
                        <div className="font-mono text-[0.65rem] text-muted-foreground">{d.matterId}</div>
                      </TableCell>
                      <TableCell>
                        {slug.includes("version")
                          ? `v${d.version}`
                          : slug.includes("identity")
                            ? "ID evidence"
                            : d.category.replace(/_/g, " ")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-[0.65rem] capitalize border ${statusBadge(d.verificationStatus)}`}
                        >
                          {d.verificationStatus}
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
  const path = splat.replace(/^\/+|\/+$/g, "");

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
