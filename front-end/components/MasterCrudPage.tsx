"use client";

import { useState, useMemo } from "react";
import { Plus, Search, Pencil, Trash2, Download, FileSpreadsheet, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export interface MasterField {
  key: string;
  label: string;
  type: "text" | "number" | "select" | "textarea" | "date";
  required?: boolean;
  options?: string[];
  placeholder?: string;
}

import { useRouter } from "next/navigation";

interface MasterPageProps {
  title: string;
  description: string;
  idPrefix: string;
  domain: string; 
  fields: MasterField[];
  initialData: Record<string, any>[];
  columns: { key: string; label: string }[];
  customAddUrl?: string;
  customEditUrl?: (id: string) => string;
}

const PAGE_SIZES = [5, 10, 25, 50, "ALL"] as const;

import { useMasterData } from "@/hooks/useMasterData";

export default function MasterCrudPage({ title, description, idPrefix, domain, fields, initialData, columns, customAddUrl, customEditUrl }: MasterPageProps) {
  const router = useRouter();
  const { data, isLoading, add, update, remove, bulkRemove } = useMasterData(domain, initialData, idPrefix);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Record<string, any> | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [pageSize, setPageSize] = useState<number | "ALL">(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // Get unique statuses for the filter dropdown
  const uniqueStatuses = useMemo(() => {
    const statuses = new Set<string>();
    data.forEach((d: Record<string, any>) => {
      const status = d.status || d.statusMaster;
      if (status) statuses.add(String(status));
    });
    return Array.from(statuses);
  }, [data]);

  const filtered = useMemo(() => {
    return data.filter((d: Record<string, any>) => {
      const searchable = columns.map((c) => String(d[c.key] || "").toLowerCase()).join(" ");
      const matchesSearch = searchable.includes(search.toLowerCase());
      
      const itemStatus = d.status || d.statusMaster;
      const matchesStatus = statusFilter === "ALL" || String(itemStatus) === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [data, search, columns, statusFilter]);

  const totalPages = pageSize === "ALL" ? 1 : Math.ceil(filtered.length / pageSize);
  const paginated = useMemo(() => {
    if (pageSize === "ALL") return filtered;
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  // Bulk Selection Handlers
  const toggleSelectAll = () => {
    if (selectedIds.size === paginated.length && paginated.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginated.map((i: Record<string, any>) => i.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleBulkDeleteFinal = async () => {
    try {
      await bulkRemove(Array.from(selectedIds));
      setSelectedIds(new Set());
      setIsBulkDeleting(false);
      toast.success(`${title} deleted successfully!`);
    } catch (e) {
      toast.error(`Failed to delete items!`);
    }
  };

  const handleSingleDeleteFinal = async () => {
    if (!deleteId) return;
    try {
       await remove(deleteId);
       setDeleteId(null);
       toast.success(`${title.replace(/s$/, "")} deleted successfully!`);
    } catch (e) {
       toast.error(`Failed to delete ${title.replace(/s$/, "")}!`);
    }
  };

  const emptyForm = () => {
    const f: Record<string, any> = {};
    fields.forEach((field) => { f[field.key] = field.type === "number" ? 0 : ""; });
    return f;
  };

  const openAdd = () => { if (customAddUrl) router.push(customAddUrl); else { setEditing(null); setForm(emptyForm()); setDialogOpen(true); } };
  const openEdit = (item: Record<string, any>) => { if (customEditUrl) router.push(customEditUrl(item.id)); else { setEditing(item); setForm({ ...item }); setDialogOpen(true); } };

  const handleSave = async () => {
    const requiredMissing = fields.some((f) => f.required && !form[f.key]);
    if (requiredMissing) {
      toast.error(`Required fields are missing!`);
      return;
    }
    try {
       if (editing) {
          await update({ ...editing, ...form });
          toast.success(`${title.replace(/s$/, "")} updated successfully!`);
       } else {
          await add(form);
          toast.success(`${title.replace(/s$/, "")} created successfully!`);
       }
       setDialogOpen(false);
    } catch (e) {
       toast.error(`Error saving ${title.toLowerCase()}!`);
    }
  };

  const handlePageSizeChange = (val: string) => {
    if (val === "ALL") { setPageSize("ALL"); setCurrentPage(1); }
    else { setPageSize(Number(val)); setCurrentPage(1); }
  };

  // Export functions
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(title, 14, 20);
    doc.setFontSize(10);
    doc.text(`Exported: ${new Date().toLocaleString()}`, 14, 28);
    const headers = ["ID", ...columns.map(c => c.label)];
    const rows = filtered.map((item: Record<string, any>) => [item.id, ...columns.map(c => String(item[c.key] || ""))]);
    autoTable(doc, { head: [headers], body: rows, startY: 34, styles: { fontSize: 8 }, headStyles: { fillColor: [34, 68, 50] } });
    doc.save(`${title.toLowerCase().replace(/\s+/g, "_")}.pdf`);
  };

  const exportExcel = () => {
    const wsData = [["ID", ...columns.map(c => c.label)], ...filtered.map((item: Record<string, any>) => [item.id, ...columns.map(c => item[c.key] || "")])];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, title);
    XLSX.writeFile(wb, `${title.toLowerCase().replace(/\s+/g, "_")}.xlsx`);
  };

  const exportCSV = () => {
    const headers = ["ID", ...columns.map(c => c.label)];
    const rows = filtered.map((item: Record<string, any>) => [item.id, ...columns.map(c => `"${String(item[c.key] || "").replace(/"/g, '""')}"`)]);
    const csv = [headers.join(","), ...rows.map((r: string[]) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${title.toLowerCase().replace(/\s+/g, "_")}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto mt-4 sm:mt-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" /> Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={exportPDF}><FileText className="w-4 h-4 mr-2" /> Export as PDF</DropdownMenuItem>
              <DropdownMenuItem onClick={exportExcel}><FileSpreadsheet className="w-4 h-4 mr-2" /> Export as Excel</DropdownMenuItem>
              <DropdownMenuItem onClick={exportCSV}><FileText className="w-4 h-4 mr-2" /> Export as CSV</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={openAdd} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" /> Add {title.replace(/s$/, "")}
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-xl border p-4 sm:p-6 shadow-sm overflow-hidden w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex flex-1 flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:max-w-3xl">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder={`Search ${title.toLowerCase()}...`} value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} className="pl-9" />
            </div>
            
            {uniqueStatuses.length > 0 && (
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-muted-foreground whitespace-nowrap font-medium">Filter Status:</span>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px] h-9 text-xs"><SelectValue placeholder="All Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Status</SelectItem>
                    {uniqueStatuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedIds.size > 0 && (
              <Button variant="destructive" size="sm" onClick={() => setIsBulkDeleting(true)} className="animate-in fade-in zoom-in duration-200 shadow-sm border border-red-200">
                <Trash2 className="w-4 h-4 mr-2" /> Delete Selected ({selectedIds.size})
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 w-full sm:w-auto justify-end">
            <span className="text-xs text-muted-foreground">Show</span>
            <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
              <SelectTrigger className="w-20 h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {PAGE_SIZES.map(s => <SelectItem key={String(s)} value={String(s)}>{String(s)}</SelectItem>)}
              </SelectContent>
            </Select>
            <span className="text-xs text-muted-foreground uppercase tracking-wider text-[10px]">entries</span>
          </div>
        </div>

        <div className="overflow-x-auto w-full max-w-[calc(100vw-2rem)] sm:max-w-none">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12 space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground animate-pulse">Loading {title.toLowerCase()}...</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50 transition-colors">
                  <th className="p-3 w-10">
                    <input 
                      type="checkbox" 
                      className="rounded border-border w-4 h-4 accent-primary" 
                      checked={paginated.length > 0 && selectedIds.size === paginated.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="text-left p-3 font-semibold text-muted-foreground uppercase text-xs">Actions</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground uppercase text-xs">ID</th>
                  {columns.map((c) => (
                    <th key={c.key} className="text-left p-3 font-semibold text-muted-foreground uppercase text-xs">{c.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((item: Record<string, any>) => (
                  <tr key={item.id} className={`border-b hover:bg-muted/30 transition-colors ${selectedIds.has(item.id) ? 'bg-primary/5 border-primary/20' : ''}`}>
                    <td className="p-3 w-10">
                       <input 
                        type="checkbox" 
                        className="rounded border-border w-4 h-4 accent-primary" 
                        checked={selectedIds.has(item.id)}
                        onChange={() => toggleSelect(item.id)}
                      />
                    </td>
                    <td className="p-3 flex gap-2">
                      <button onClick={() => openEdit(item)} className="p-1.5 rounded hover:bg-muted transition-colors"><Pencil className="w-4 h-4 text-muted-foreground" /></button>
                      <button onClick={() => setDeleteId(item.id)} className="p-1.5 rounded hover:bg-destructive/10 transition-colors"><Trash2 className="w-4 h-4 text-destructive" /></button>
                    </td>
                    <td className="p-3 font-mono text-xs">{item.id}</td>
                    {columns.map((c) => (
                      <td key={c.key} className="p-3">
                        {c.key === "status" || c.key === "statusMaster" ? (
                          <Badge variant="outline" className={`
                            ${String(item[c.key]).toLowerCase().includes("active") || String(item[c.key]).toLowerCase().includes("approved") || String(item[c.key]).toLowerCase().includes("received") || String(item[c.key]).toLowerCase().includes("delivered") || String(item[c.key]).toLowerCase().includes("success") || String(item[c.key]).toLowerCase().includes("confirmed") || String(item[c.key]).toLowerCase().includes("paid")
                              ? "bg-green-500/10 text-green-600 border-green-200" 
                              : String(item[c.key]).toLowerCase().includes("draft") || String(item[c.key]).toLowerCase().includes("pending")
                              ? "bg-amber-500/10 text-amber-600 border-amber-200"
                              : String(item[c.key]).toLowerCase().includes("rejected") || String(item[c.key]).toLowerCase().includes("cancelled") || String(item[c.key]).toLowerCase().includes("inactive")
                              ? "bg-red-500/10 text-red-600 border-red-200"
                              : "bg-blue-500/10 text-blue-600 border-blue-200"}
                            px-2 py-0.5 text-[10px] uppercase font-bold
                          `}>
                            {item[c.key]}
                          </Badge>
                        ) : (
                          String(item[c.key] ?? "")
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
                {paginated.length === 0 && (
                  <tr><td colSpan={columns.length + 3} className="p-8 text-center text-muted-foreground">No records found matching your filters</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Info */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <p className="text-xs text-muted-foreground font-medium">
            Showing <span className="text-foreground">{filtered.length === 0 ? 0 : ((currentPage - 1) * (pageSize === "ALL" ? 0 : pageSize)) + 1}</span>
            {" "}to <span className="text-foreground">{Math.min(currentPage * (pageSize === "ALL" ? filtered.length : pageSize), filtered.length)}</span>
            {" "}of <span className="text-foreground">{filtered.length}</span> entries
          </p>
          {pageSize !== "ALL" && totalPages > 1 && (
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="h-8 text-xs">Previous</Button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let page: number;
                if (totalPages <= 5) page = i + 1;
                else if (currentPage <= 3) page = i + 1;
                else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
                else page = currentPage - 2 + i;
                return (
                  <Button key={page} variant={currentPage === page ? "default" : "outline"} size="sm" onClick={() => setCurrentPage(page)} className="h-8 w-8 text-xs p-0">
                    {page}
                  </Button>
                );
              })}
              <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="h-8 text-xs">Next</Button>
            </div>
          )}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? `Edit ${title.replace(/s$/, "")}` : `Add ${title.replace(/s$/, "")}`}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {fields.map((field) => (
                <div key={field.key} className={field.type === "textarea" ? "col-span-2" : ""}>
                  <Label className="text-xs">{field.label} {field.required && <span className="text-destructive">*</span>}</Label>
                  {field.type === "select" ? (
                    <Select value={form[field.key] || ""} onValueChange={(v) => setForm({ ...form, [field.key]: v })}>
                      <SelectTrigger><SelectValue placeholder={field.placeholder || `Select ${field.label}`} /></SelectTrigger>
                      <SelectContent>{(field.options || []).map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                    </Select>
                  ) : field.type === "textarea" ? (
                    <Textarea value={form[field.key] || ""} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })} placeholder={field.placeholder} />
                  ) : (
                    <Input
                      type={field.type === "date" ? "date" : field.type}
                      placeholder={field.placeholder}
                      value={form[field.key] ?? ""}
                      onChange={(e) => setForm({ ...form, [field.key]: field.type === "number" ? Number(e.target.value) : e.target.value })}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} className="bg-primary text-primary-foreground">{editing ? "Update" : "Create"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this {title.toLowerCase().replace(/s$/, "")}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSingleDeleteFinal} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isBulkDeleting} onOpenChange={setIsBulkDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete multiple records?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedIds.size} selected items? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDeleteFinal} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete All</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
