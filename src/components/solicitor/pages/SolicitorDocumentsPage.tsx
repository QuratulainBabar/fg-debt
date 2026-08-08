import { useState } from "react";
import { FileText, Search, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { INITIAL_MATTERS, DocumentItem } from "@/lib/solicitor-data";
import { DocumentPreviewModal } from "@/components/solicitor/DocumentPreviewModal";

export function SolicitorDocumentsPage() {
  const allDocs = INITIAL_MATTERS.flatMap((m) =>
    m.documents.map((d) => ({ ...d, matterId: m.id, clientName: m.clientName }))
  );

  const [docs, setDocs] = useState(allDocs);
  const [query, setQuery] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = docs.filter(
    (d) =>
      !query ||
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.clientName.toLowerCase().includes(query.toLowerCase()) ||
      d.matterId.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <DocumentPreviewModal
        doc={selectedDoc}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onStatusChange={(id, status) => {
          setDocs((prev) => prev.map((d) => (d.id === id ? { ...d, verificationStatus: status } : d)));
        }}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold tracking-tight text-foreground sm:text-3xl">
            Documents & OCR Hub
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Centralized document verification queue across all active client matters.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documents or client..."
            className="pl-9 h-9 text-xs"
          />
        </div>
      </div>

      <Card className="surface-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs font-semibold">Document Name</TableHead>
                <TableHead className="text-xs font-semibold">Client & Matter</TableHead>
                <TableHead className="text-xs font-semibold">Category</TableHead>
                <TableHead className="text-xs font-semibold">OCR Status</TableHead>
                <TableHead className="text-xs font-semibold">Verification</TableHead>
                <TableHead className="text-xs font-semibold">Confidence</TableHead>
                <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((doc) => (
                <TableRow key={doc.id} className="text-xs group hover:bg-muted/50">
                  <TableCell className="font-semibold">
                    <div className="flex items-center gap-2">
                      <FileText className="size-4 text-primary" />
                      <span>{doc.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-foreground">{doc.clientName}</div>
                    <div className="text-[0.68rem] text-muted-foreground font-mono">{doc.matterId}</div>
                  </TableCell>
                  <TableCell className="capitalize">{doc.category.replace(/_/g, " ")}</TableCell>
                  <TableCell className="font-semibold text-emerald-600 dark:text-emerald-400 capitalize">
                    {doc.ocrStatus}
                  </TableCell>
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
                        setModalOpen(true);
                      }}
                      className="text-xs"
                    >
                      <Eye className="size-3.5 mr-1" /> Inspect & Verify
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
