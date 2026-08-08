import { useState, useEffect } from "react";
import { Search, FileText, User, AlertTriangle, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { INITIAL_MATTERS, Matter } from "@/lib/solicitor-data";
import { Link, useNavigate } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";

export function GlobalSearchModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onOpenChange]);

  const q = query.toLowerCase().trim();

  const filteredMatters = INITIAL_MATTERS.filter(
    (m) =>
      !q ||
      m.clientName.toLowerCase().includes(q) ||
      m.id.toLowerCase().includes(q) ||
      m.aiRecommendedSolution.toLowerCase().includes(q)
  );

  const filteredDocs = INITIAL_MATTERS.flatMap((m) =>
    m.documents.map((d) => ({ ...d, matterId: m.id, clientName: m.clientName }))
  ).filter((d) => !q || d.name.toLowerCase().includes(q) || d.category.toLowerCase().includes(q));

  const filteredNotes = INITIAL_MATTERS.flatMap((m) =>
    m.notes.map((n) => ({ ...n, matterId: m.id, clientName: m.clientName }))
  ).filter((n) => !q || n.content.toLowerCase().includes(q) || n.author.toLowerCase().includes(q));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl gap-0 p-0 overflow-hidden shadow-lift border-border bg-card">
        <DialogHeader className="p-4 border-b border-border/70 flex flex-row items-center gap-3 space-y-0">
          <Search className="size-5 text-muted-foreground shrink-0" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clients, matters, documents, notes... (Press Cmd+K anytime)"
            className="border-none shadow-none focus-visible:ring-0 text-base h-9 pl-0"
            autoFocus
          />
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
          {/* Matters */}
          <div>
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span className="flex items-center gap-1.5"><User className="size-3.5" /> Clients & Matters ({filteredMatters.length})</span>
            </div>
            {filteredMatters.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">No matching matters found.</p>
            ) : (
              <div className="space-y-1">
                {filteredMatters.slice(0, 5).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      onOpenChange(false);
                      navigate({ to: `/solicitor/matters/${m.id}` as any });
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/70 transition-colors text-left group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{m.clientName}</span>
                        <span className="text-xs text-muted-foreground font-mono">{m.id}</span>
                        <Badge variant="outline" className="text-[0.65rem] capitalize">
                          {m.status.replace(/_/g, " ")}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Solution: <span className="font-medium text-foreground">{m.aiRecommendedSolution}</span> • Total Debt: £{m.totalDebt.toLocaleString()}
                      </p>
                    </div>
                    <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Documents */}
          <div>
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span className="flex items-center gap-1.5"><FileText className="size-3.5" /> Scanned Documents ({filteredDocs.length})</span>
            </div>
            {filteredDocs.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">No matching documents found.</p>
            ) : (
              <div className="space-y-1">
                {filteredDocs.slice(0, 4).map((d) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      onOpenChange(false);
                      navigate({ to: `/solicitor/matters/${d.matterId}` as any });
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/70 transition-colors text-left group"
                  >
                    <div>
                      <span className="font-medium text-sm text-foreground">{d.name}</span>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Client: {d.clientName} • OCR: <span className="capitalize">{d.ocrStatus}</span> ({d.confidenceScore}%)
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-[0.65rem]">{d.category}</Badge>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
