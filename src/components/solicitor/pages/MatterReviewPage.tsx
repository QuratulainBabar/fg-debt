import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Download,
  FileText,
  History,
  Info,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { INITIAL_MATTERS, Matter, DocumentItem } from "@/lib/solicitor-data";
import { DecisionModal, DecisionType } from "@/components/solicitor/DecisionModals";
import { DocumentPreviewModal } from "@/components/solicitor/DocumentPreviewModal";
import { toast } from "sonner";

export function MatterReviewPage() {
  const params = useParams({ strict: false });
  const matterId = (params as any).matterId || "MAT-2026-4417";
  const navigate = useNavigate();

  const initialMatter = INITIAL_MATTERS.find((m) => m.id === matterId) || INITIAL_MATTERS[0];
  const [matter, setMatter] = useState<Matter>(initialMatter);

  const [decisionModalOpen, setDecisionModalOpen] = useState(false);
  const [activeDecision, setActiveDecision] = useState<DecisionType>(null);

  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [docModalOpen, setDocModalOpen] = useState(false);

  const [newNoteContent, setNewNoteContent] = useState("");
  const [isInternalNote, setIsInternalNote] = useState(true);

  const [newTaskTitle, setNewTaskTitle] = useState("");

  const handleDecisionConfirm = (
    action: "approve" | "amend" | "reject" | "override",
    payload: { notes: string; amendedSolution?: string }
  ) => {
    const updatedStatus =
      action === "approve"
        ? "approved"
        : action === "amend"
        ? "amended"
        : action === "reject"
        ? "rejected"
        : "overridden";

    const newAuditRecord = {
      id: `AUD-${Date.now()}`,
      user: "Rachel Okonkwo",
      role: "Solicitor",
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
      section: "Solicitor Decision",
      previousValue: matter.status,
      newValue: updatedStatus,
      reason: payload.notes,
    };

    setMatter((prev) => ({
      ...prev,
      status: updatedStatus as any,
      solicitorDecision: {
        action,
        solicitorName: "Rachel Okonkwo",
        decidedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
        notes: payload.notes,
        amendedSolution: payload.amendedSolution,
      },
      auditHistory: [newAuditRecord, ...prev.auditHistory],
      notes: [
        {
          id: `N-${Date.now()}`,
          author: "Rachel Okonkwo",
          role: "Solicitor",
          date: new Date().toISOString().replace("T", " ").substring(0, 16),
          content: `Solicitor Action [${action.toUpperCase()}]: ${payload.notes}`,
          isInternal: true,
        },
        ...prev.notes,
      ],
    }));
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;
    const note = {
      id: `N-${Date.now()}`,
      author: "Rachel Okonkwo",
      role: "Solicitor",
      date: new Date().toISOString().replace("T", " ").substring(0, 16),
      content: newNoteContent,
      isInternal: isInternalNote,
    };
    setMatter((prev) => ({ ...prev, notes: [note, ...prev.notes] }));
    setNewNoteContent("");
    toast.success("Note added to case file.");
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const task = {
      id: `T-${Date.now()}`,
      title: newTaskTitle,
      assignee: matter.clientName,
      type: "client_clarification" as const,
      dueDate: "2026-08-15",
      priority: "high" as const,
      status: "sent_to_client" as const,
      description: "Solicitor requested additional detail.",
    };
    setMatter((prev) => ({ ...prev, tasks: [task, ...prev.tasks] }));
    setNewTaskTitle("");
    toast.success("Task sent to client.");
  };

  return (
    <div className="space-y-6 pb-16">
      <DecisionModal
        matter={matter}
        actionType={activeDecision}
        open={decisionModalOpen}
        onClose={() => setDecisionModalOpen(false)}
        onConfirm={handleDecisionConfirm}
      />

      <DocumentPreviewModal
        doc={selectedDoc}
        open={docModalOpen}
        onClose={() => setDocModalOpen(false)}
        onStatusChange={(docId, status) => {
          setMatter((prev) => ({
            ...prev,
            documents: prev.documents.map((d) => (d.id === docId ? { ...d, verificationStatus: status } : d)),
          }));
        }}
      />

      <div className="flex items-center justify-between">
        <Link to="/solicitor/matters" className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-3.5 mr-1" /> Back to All Matters
        </Link>
        <span className="text-xs text-muted-foreground">Assigned Solicitor: <strong>{matter.assignedSolicitor}</strong></span>
      </div>

      <div className="sticky top-16 z-20 rounded-2xl border border-border bg-card/95 p-4 shadow-soft backdrop-blur-xl space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-display font-bold text-foreground">{matter.clientName}</h1>
              <span className="font-mono text-xs text-muted-foreground">{matter.id}</span>
              <Badge
                variant={
                  matter.status === "approved"
                    ? "default"
                    : matter.status === "urgent_review"
                    ? "destructive"
                    : "secondary"
                }
                className="text-xs capitalize"
              >
                {matter.status.replace(/_/g, " ")}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-muted-foreground">
              <span>NI: <strong>{matter.niNumber}</strong></span>
              <span>•</span>
              <span>Dob: {matter.dob}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <ShieldCheck className="size-3.5" /> Identity Verified
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="px-3 py-1.5 rounded-xl bg-muted/60 border border-border text-center">
              <span className="text-[0.65rem] text-muted-foreground block uppercase font-semibold">Total Debt</span>
              <span className="text-sm font-bold text-foreground">£{matter.totalDebt.toLocaleString()}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-muted/60 border border-border text-center">
              <span className="text-[0.65rem] text-muted-foreground block uppercase font-semibold">Disposable</span>
              <span className={`text-sm font-bold ${matter.disposableIncome < 0 ? "text-rose-600" : "text-emerald-600 dark:text-emerald-400"}`}>
                £{matter.disposableIncome}/mo
              </span>
            </div>

            <div className="flex items-center gap-1.5 ml-2 border-l border-border pl-3">
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs"
                onClick={() => {
                  setActiveDecision("approve");
                  setDecisionModalOpen(true);
                }}
              >
                <CheckCircle2 className="size-3.5 mr-1" /> Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-xs border-amber-500/50 text-amber-700 dark:text-amber-300 hover:bg-amber-500/10"
                onClick={() => {
                  setActiveDecision("amend");
                  setDecisionModalOpen(true);
                }}
              >
                <Sparkles className="size-3.5 mr-1" /> Amend
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-xs border-rose-500/50 text-rose-600 hover:bg-rose-500/10"
                onClick={() => {
                  setActiveDecision("reject");
                  setDecisionModalOpen(true);
                }}
              >
                <XCircle className="size-3.5 mr-1" /> Reject
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-xs text-purple-600 dark:text-purple-400 hover:bg-purple-500/10"
                onClick={() => {
                  setActiveDecision("override");
                  setDecisionModalOpen(true);
                }}
              >
                <ShieldAlert className="size-3.5 mr-1" /> Override
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-950 dark:text-amber-200">
          <Info className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>
            <strong>Regulatory Disclaimer:</strong> AI recommendations require solicitor approval before advice is issued to the client.
          </span>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="flex w-full overflow-x-auto justify-start h-11 p-1 bg-muted/60 rounded-xl mb-6">
          <TabsTrigger value="overview" className="text-xs font-semibold">Overview</TabsTrigger>
          <TabsTrigger value="client" className="text-xs">Client Info</TabsTrigger>
          <TabsTrigger value="financial" className="text-xs">Financial Statement</TabsTrigger>
          <TabsTrigger value="debts" className="text-xs">Debts ({matter.debts.length})</TabsTrigger>
          <TabsTrigger value="assets" className="text-xs">Assets ({matter.assets.length})</TabsTrigger>
          <TabsTrigger value="vulnerabilities" className="text-xs">Vulnerabilities</TabsTrigger>
          <TabsTrigger value="risks" className="text-xs">Risks</TabsTrigger>
          <TabsTrigger value="documents" className="text-xs">Documents ({matter.documents.length})</TabsTrigger>
          <TabsTrigger value="ai_rec" className="text-xs font-semibold text-primary">AI Recommendation</TabsTrigger>
          <TabsTrigger value="advice" className="text-xs">Advice Docs</TabsTrigger>
          <TabsTrigger value="referrals" className="text-xs">Referrals</TabsTrigger>
          <TabsTrigger value="tasks" className="text-xs">Tasks ({matter.tasks.length})</TabsTrigger>
          <TabsTrigger value="notes" className="text-xs">Notes ({matter.notes.length})</TabsTrigger>
          <TabsTrigger value="audit" className="text-xs">Audit History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="surface-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-display">Client Summary</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block">Full Name</span>
                    <span className="font-semibold text-foreground">{matter.clientName}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Contact Email</span>
                    <span className="font-semibold text-foreground">{matter.clientEmail}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Phone</span>
                    <span className="font-semibold text-foreground">{matter.clientPhone}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Address</span>
                    <span className="font-medium text-foreground">{matter.clientAddress}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Employment</span>
                    <span className="font-medium text-foreground">{matter.employmentStatus} ({matter.employerName})</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Assigned Solicitor</span>
                    <span className="font-medium text-foreground">{matter.assignedSolicitor}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="surface-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-display">Financial Snapshot</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-3 rounded-xl bg-muted/50 text-xs">
                    <span className="text-muted-foreground block">Monthly Income</span>
                    <span className="text-lg font-bold text-foreground">£{matter.totalIncome.toLocaleString()}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/50 text-xs">
                    <span className="text-muted-foreground block">Monthly Expenses</span>
                    <span className="text-lg font-bold text-foreground">£{matter.monthlyExpenses.toLocaleString()}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/50 text-xs">
                    <span className="text-muted-foreground block">Disposable Income</span>
                    <span className={`text-lg font-bold ${matter.disposableIncome < 0 ? "text-rose-600" : "text-emerald-600 dark:text-emerald-400"}`}>
                      £{matter.disposableIncome.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/50 text-xs">
                    <span className="text-muted-foreground block">Total Debt Balance</span>
                    <span className="text-lg font-bold text-foreground">£{matter.totalDebt.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="surface-card border-primary/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-display flex items-center justify-between text-primary">
                    <span className="flex items-center gap-1.5"><Sparkles className="size-4" /> AI Recommendation</span>
                    <Badge variant="outline" className="text-[0.65rem] bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                      {matter.aiConfidenceScore}% Confidence
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
                    <span className="text-muted-foreground block text-[0.68rem] uppercase font-semibold">Recommended Solution</span>
                    <span className="text-base font-bold text-foreground">{matter.aiRecommendedSolution}</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {matter.aiReasoning[0]}
                  </p>
                </CardContent>
              </Card>

              <Card className="surface-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-display">Risk & Safeguarding</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50">
                    <span className="text-muted-foreground">Risk Rating</span>
                    <Badge variant="outline" className="capitalize">{matter.riskLevel}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50">
                    <span className="text-muted-foreground">Vulnerability</span>
                    <Badge variant="secondary" className="capitalize">{matter.vulnerability.replace(/_/g, " ")}</Badge>
                  </div>
                  {matter.vulnerabilityNotes && (
                    <p className="text-xs text-amber-700 dark:text-amber-300 p-2 rounded bg-amber-500/10 border border-amber-500/20">
                      {matter.vulnerabilityNotes}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="client">
          <Card className="surface-card">
            <CardHeader>
              <CardTitle className="text-base font-display">Detailed Client Profile & KYC</CardTitle>
              <CardDescription className="text-xs">Identity verification, employment, housing, and emergency contacts.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground uppercase tracking-wider text-[0.7rem] text-muted-foreground">Personal Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between p-2 rounded bg-muted/40"><span>Full Name</span><span className="font-semibold">{matter.clientName}</span></div>
                  <div className="flex justify-between p-2 rounded bg-muted/40"><span>Date of Birth</span><span className="font-semibold">{matter.dob}</span></div>
                  <div className="flex justify-between p-2 rounded bg-muted/40"><span>National Insurance No.</span><span className="font-mono font-semibold">{matter.niNumber}</span></div>
                  <div className="flex justify-between p-2 rounded bg-muted/40"><span>Residential Address</span><span className="font-semibold">{matter.clientAddress}</span></div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-foreground uppercase tracking-wider text-[0.7rem] text-muted-foreground">Employment & Verification</h4>
                <div className="space-y-2">
                  <div className="flex justify-between p-2 rounded bg-muted/40"><span>Status</span><span className="font-semibold">{matter.employmentStatus}</span></div>
                  <div className="flex justify-between p-2 rounded bg-muted/40"><span>Employer</span><span className="font-semibold">{matter.employerName}</span></div>
                  <div className="flex justify-between p-2 rounded bg-muted/40"><span>Identity Verification</span><span className="text-emerald-600 dark:text-emerald-400 font-semibold">Pass (Passport & Utility)</span></div>
                  <div className="flex justify-between p-2 rounded bg-muted/40"><span>Dependents</span><span className="font-semibold">2 Children</span></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial">
          <Card className="surface-card">
            <CardHeader>
              <CardTitle className="text-base font-display">Standard Financial Statement (SFS)</CardTitle>
              <CardDescription className="text-xs">FCA-compliant household income and expenditure breakdown.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Monthly Income Breakdown</h4>
                  <Table>
                    <TableBody>
                      <TableRow><TableCell>Net Salary / Wage</TableCell><TableCell className="text-right font-semibold">£{matter.monthlyNetIncome}</TableCell></TableRow>
                      <TableRow><TableCell>Benefits / Universal Credit</TableCell><TableCell className="text-right font-semibold">£{matter.benefitsIncome}</TableCell></TableRow>
                      <TableRow className="font-bold border-t"><TableCell>Total Household Income</TableCell><TableCell className="text-right text-emerald-600">£{matter.totalIncome}</TableCell></TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">Monthly Expenditure Breakdown</h4>
                  <Table>
                    <TableBody>
                      <TableRow><TableCell>Housing & Utilities</TableCell><TableCell className="text-right font-semibold">£1,060</TableCell></TableRow>
                      <TableRow><TableCell>Food & Housekeeping</TableCell><TableCell className="text-right font-semibold">£340</TableCell></TableRow>
                      <TableRow><TableCell>Childcare & Transport</TableCell><TableCell className="text-right font-semibold">£345</TableCell></TableRow>
                      <TableRow><TableCell>Insurance & Other</TableCell><TableCell className="text-right font-semibold">£655</TableCell></TableRow>
                      <TableRow className="font-bold border-t"><TableCell>Total Household Expenses</TableCell><TableCell className="text-right text-rose-600">£{matter.monthlyExpenses}</TableCell></TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="debts">
          <Card className="surface-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-display">Verified Debts Schedule</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs font-semibold">Creditor</TableHead>
                    <TableHead className="text-xs font-semibold">Type</TableHead>
                    <TableHead className="text-xs font-semibold">Classification</TableHead>
                    <TableHead className="text-xs font-semibold">Balance</TableHead>
                    <TableHead className="text-xs font-semibold">Arrears</TableHead>
                    <TableHead className="text-xs font-semibold">Interest Rate</TableHead>
                    <TableHead className="text-xs font-semibold">OCR Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {matter.debts.map((d) => (
                    <TableRow key={d.id} className="text-xs">
                      <TableCell className="font-semibold">{d.creditor}</TableCell>
                      <TableCell>{d.type}</TableCell>
                      <TableCell>
                        <Badge variant={d.isPriority ? "destructive" : "secondary"} className="text-[0.62rem]">
                          {d.isPriority ? "Priority Debt" : "Non-Priority"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold">£{d.balance.toLocaleString()}</TableCell>
                      <TableCell className={d.arrears > 0 ? "text-rose-600 font-semibold" : ""}>£{d.arrears}</TableCell>
                      <TableCell>{d.interestRate}</TableCell>
                      <TableCell>
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium capitalize">{d.status}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assets">
          <Card className="surface-card">
            <CardHeader><CardTitle className="text-base font-display">Client Assets Inventory</CardTitle></CardHeader>
            <CardContent className="p-0">
              {matter.assets.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted-foreground">No registrable assets reported.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs font-semibold">Asset Type</TableHead>
                      <TableHead className="text-xs font-semibold">Description</TableHead>
                      <TableHead className="text-xs font-semibold">Estimated Value</TableHead>
                      <TableHead className="text-xs font-semibold">DRO Exemption Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {matter.assets.map((a) => (
                      <TableRow key={a.id} className="text-xs">
                        <TableCell className="font-semibold">{a.type}</TableCell>
                        <TableCell>{a.description}</TableCell>
                        <TableCell className="font-bold">£{a.estimatedValue.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={a.exempt ? "default" : "secondary"} className="text-[0.62rem]">
                            {a.exempt ? "Exempt (< £2k)" : "Non-Exempt"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vulnerabilities">
          <Card className="surface-card">
            <CardHeader><CardTitle className="text-base font-display">Vulnerability Assessment Matrix</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-amber-900 dark:text-amber-200">
                  <AlertTriangle className="size-4 text-amber-600" />
                  <span>Vulnerability Flag: {matter.vulnerability.replace(/_/g, " ").toUpperCase()}</span>
                </div>
                <p className="text-muted-foreground">{matter.vulnerabilityNotes || "No specific vulnerability notes registered."}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risks">
          <Card className="surface-card">
            <CardHeader><CardTitle className="text-base font-display">Risk & Enforcement Analysis</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-3 rounded-lg border border-border flex items-center justify-between">
                <span>Overall Risk Severity Level</span>
                <Badge variant="outline" className="capitalize">{matter.riskLevel}</Badge>
              </div>
              <p className="text-muted-foreground">Automated risk checks performed against statutory enforcement rules and debt limits.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card className="surface-card">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-display">Uploaded Documents & OCR Status</CardTitle>
                <CardDescription className="text-xs">Click any document to inspect side-by-side OCR extractions.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs font-semibold">Document Name</TableHead>
                    <TableHead className="text-xs font-semibold">Category</TableHead>
                    <TableHead className="text-xs font-semibold">OCR Status</TableHead>
                    <TableHead className="text-xs font-semibold">Verification</TableHead>
                    <TableHead className="text-xs font-semibold">Confidence</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {matter.documents.map((doc) => (
                    <TableRow key={doc.id} className="text-xs group hover:bg-muted/50">
                      <TableCell className="font-semibold">{doc.name}</TableCell>
                      <TableCell className="capitalize">{doc.category.replace(/_/g, " ")}</TableCell>
                      <TableCell className="capitalize font-medium text-emerald-600">{doc.ocrStatus}</TableCell>
                      <TableCell>
                        <Badge variant={doc.verificationStatus === "verified" ? "default" : "secondary"} className="text-[0.62rem] capitalize">
                          {doc.verificationStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono">{doc.confidenceScore}%</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setSelectedDoc(doc);
                            setDocModalOpen(true);
                          }}
                          className="text-xs"
                        >
                          Preview & Verify
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai_rec" className="space-y-6">
          <Card className="surface-card border-primary/40">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-display text-primary flex items-center gap-2">
                  <Sparkles className="size-5" /> AI Recommendation Engine Evaluation
                </CardTitle>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 font-mono text-xs">
                  {matter.aiConfidenceScore}% Evaluation Score
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 text-xs">
              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-2">
                <span className="text-muted-foreground uppercase font-semibold text-[0.68rem] tracking-wider block">Recommended Legal Solution</span>
                <h3 className="text-xl font-display font-bold text-foreground">{matter.aiRecommendedSolution}</h3>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">AI Evaluation Reasoning Engine</h4>
                <ul className="space-y-2">
                  {matter.aiReasoning.map((r, i) => (
                    <li key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-muted/50 border border-border">
                      <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-foreground">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {matter.alternativeSolutions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Alternative Solutions Considered</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {matter.alternativeSolutions.map((alt, i) => (
                      <div key={i} className="p-3 rounded-xl border border-border bg-card space-y-1">
                        <span className="font-semibold text-foreground block">{alt.name}</span>
                        <p className="text-emerald-700 dark:text-emerald-300">Pros: {alt.pros}</p>
                        <p className="text-rose-700 dark:text-rose-300">Cons: {alt.cons}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {matter.rejectedSolutions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Rejected Solutions</h4>
                  <div className="space-y-2">
                    {matter.rejectedSolutions.map((rej, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-rose-500/5 border border-rose-500/20 text-rose-950 dark:text-rose-200">
                        <strong>{rej.name}:</strong> {rej.reason}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advice">
          <Card className="surface-card">
            <CardHeader><CardTitle className="text-base font-display">Generated Legal Advice Package</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-3 rounded-xl border border-border flex items-center justify-between">
                <div>
                  <span className="font-semibold text-foreground block">Formal Advice Letter — {matter.aiRecommendedSolution}</span>
                  <span className="text-muted-foreground text-[0.68rem]">Drafted on {matter.updatedAt}</span>
                </div>
                <Button size="sm" variant="outline" onClick={() => toast.success("Draft advice letter downloaded.")}>
                  <Download className="size-3.5 mr-1" /> Download PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="referrals">
          <Card className="surface-card">
            <CardHeader><CardTitle className="text-base font-display">Third-Party Referrals</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-xs">
              {matter.referrals.length === 0 ? (
                <p className="text-muted-foreground">No active third-party referrals for this matter.</p>
              ) : (
                matter.referrals.map((r) => (
                  <div key={r.id} className="p-3 rounded-xl border border-border bg-card space-y-1">
                    <div className="flex items-center justify-between font-semibold">
                      <span>{r.partner}</span>
                      <Badge variant="secondary" className="capitalize">{r.status}</Badge>
                    </div>
                    <p className="text-muted-foreground">Reason: {r.reason}</p>
                    <p className="text-primary font-medium">Notes: {r.notes}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <Card className="surface-card">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-display">Client Clarifications & Tasks</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleAddTask} className="flex gap-2">
                <Input
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Request client clarification or upload..."
                  className="text-xs h-9"
                />
                <Button type="submit" size="sm" className="text-xs">Request Info</Button>
              </form>
              <div className="space-y-2 text-xs">
                {matter.tasks.map((t) => (
                  <div key={t.id} className="p-3 rounded-xl border border-border bg-card flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-foreground block">{t.title}</span>
                      <span className="text-muted-foreground">{t.description}</span>
                    </div>
                    <Badge variant="outline" className="capitalize">{t.status.replace(/_/g, " ")}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card className="surface-card">
            <CardHeader><CardTitle className="text-base font-display">Solicitor Internal Case Notes</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleAddNote} className="space-y-2">
                <Textarea
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder="Add confidential legal case note..."
                  className="text-xs min-h-[70px]"
                />
                <Button type="submit" size="sm" className="text-xs">Add Case Note</Button>
              </form>
              <div className="space-y-2 text-xs">
                {matter.notes.map((n) => (
                  <div key={n.id} className="p-3 rounded-xl border border-border bg-muted/40 space-y-1">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="font-semibold text-foreground">{n.author} ({n.role})</span>
                      <span>{n.date}</span>
                    </div>
                    <p className="text-foreground leading-relaxed">{n.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <Card className="surface-card">
            <CardHeader>
              <CardTitle className="text-base font-display flex items-center gap-2">
                <History className="size-4 text-primary" /> Read-Only Compliance Audit Timeline
              </CardTitle>
              <CardDescription className="text-xs">Immutable log of system triage, OCR actions, and solicitor decisions.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs font-semibold">Timestamp</TableHead>
                    <TableHead className="text-xs font-semibold">User & Role</TableHead>
                    <TableHead className="text-xs font-semibold">Section</TableHead>
                    <TableHead className="text-xs font-semibold">Previous State</TableHead>
                    <TableHead className="text-xs font-semibold">New State</TableHead>
                    <TableHead className="text-xs font-semibold">Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {matter.auditHistory.map((a) => (
                    <TableRow key={a.id} className="text-xs">
                      <TableCell className="font-mono text-muted-foreground">{a.timestamp}</TableCell>
                      <TableCell className="font-semibold">{a.user} ({a.role})</TableCell>
                      <TableCell>{a.section}</TableCell>
                      <TableCell className="text-muted-foreground">{a.previousValue}</TableCell>
                      <TableCell className="font-semibold text-primary">{a.newValue}</TableCell>
                      <TableCell className="text-muted-foreground max-w-[200px] truncate">{a.reason}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
