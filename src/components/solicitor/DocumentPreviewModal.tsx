import { useState } from "react";
import { FileText, CheckCircle2, AlertTriangle, Eye, Download, ShieldCheck, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DocumentItem } from "@/lib/solicitor-data";
import { toast } from "sonner";

export function DocumentPreviewModal({
  doc,
  open,
  onClose,
  onStatusChange,
}: {
  doc: DocumentItem | null;
  open: boolean;
  onClose: () => void;
  onStatusChange?: (docId: string, status: "verified" | "flagged") => void;
}) {
  if (!doc) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto shadow-lift border-border bg-card p-6">
        <DialogHeader className="border-b border-border/70 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <FileText className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-display">{doc.name}</DialogTitle>
                <DialogDescription className="text-xs mt-0.5">
                  Category: <span className="font-semibold text-foreground capitalize">{doc.category.replace(/_/g, " ")}</span> • Size: {doc.size} • Version {doc.version}
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={doc.verificationStatus === "verified" ? "default" : doc.verificationStatus === "flagged" ? "destructive" : "secondary"}
                className="capitalize"
              >
                {doc.verificationStatus}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Document visual mock preview */}
          <div className="rounded-xl border border-border bg-muted/40 p-5 flex flex-col items-center justify-center min-h-[320px] text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80 pointer-events-none" />
            <FileText className="size-16 text-muted-foreground/40 mb-3 group-hover:scale-105 transition-transform" />
            <h4 className="font-semibold text-sm text-foreground">{doc.name}</h4>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs">
              PDF Document (Uploaded on {doc.uploadedAt})
            </p>
            <div className="mt-4 flex items-center gap-2 relative z-10">
              <Button size="sm" variant="outline" onClick={() => toast.info("Opening full document reader...")}>
                <Eye className="size-3.5 mr-1" /> Full View
              </Button>
              <Button size="sm" variant="secondary" onClick={() => toast.success("Document downloaded.")}>
                <Download className="size-3.5 mr-1" /> Download
              </Button>
            </div>
          </div>

          {/* OCR & Extracted Information side panel */}
          <div className="space-y-5">
            <div className="rounded-xl border border-border bg-card p-4 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                <span>OCR Scanning Metrics</span>
                <Badge variant="outline" className="text-[0.65rem] bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30">
                  {doc.confidenceScore}% Confidence
                </Badge>
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-muted-foreground block">Processing Engine</span>
                  <span className="font-medium">Tesseract OCR v5.3</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Scan Date</span>
                  <span className="font-medium">{doc.uploadedAt}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">OCR Status</span>
                  <span className="font-semibold capitalize text-emerald-600 dark:text-emerald-400">{doc.ocrStatus}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Verification Flag</span>
                  <span className="font-medium capitalize">{doc.verificationStatus}</span>
                </div>
              </div>
            </div>

            {/* Extracted Key-Value Pairs */}
            <div className="rounded-xl border border-border bg-card p-4 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Extracted Data Fields
              </h4>
              <div className="space-y-2">
                {Object.entries(doc.extractedInfo || {}).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between p-2 rounded-lg bg-muted/50 text-xs">
                    <span className="text-muted-foreground font-medium">{key}</span>
                    <span className="font-semibold text-foreground font-mono">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification Actions */}
            <div className="flex items-center gap-2 pt-2">
              <Button
                variant="default"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => {
                  onStatusChange?.(doc.id, "verified");
                  toast.success("Document Verified", { description: `${doc.name} marked as verified.` });
                  onClose();
                }}
              >
                <ShieldCheck className="size-4 mr-1.5" /> Verify Document
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-rose-500/50 text-rose-600 hover:bg-rose-500/10"
                onClick={() => {
                  onStatusChange?.(doc.id, "flagged");
                  toast.warning("Document Flagged", { description: `${doc.name} marked for clarification.` });
                  onClose();
                }}
              >
                <AlertTriangle className="size-4 mr-1.5" /> Flag Issue
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
