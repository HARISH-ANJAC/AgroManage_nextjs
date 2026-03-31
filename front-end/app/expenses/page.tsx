"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Eye, Pencil, Trash2, Wallet, FileText, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useRouter } from 'next/navigation';
import { useExpenseStore } from "@/hooks/useExpenseStore";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
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

const statusColors: Record<string, string> = {
  Approved: "bg-success/10 text-success border-success/30",
  Submitted: "bg-warning/10 text-warning border-warning/30",
  Completed: "bg-success/10 text-success border-success/30",
  Draft: "bg-muted text-muted-foreground border-border",
  Closed: "bg-success/10 text-success border-success/30",
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

export default function ExpensesPage() {
  const { expenses, isLoading, deleteExpense } = useExpenseStore();
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const router = useRouter();

  const filtered = (expenses || []).filter((e: any) => 
    (e.expenseRefNo || "").toLowerCase().includes(search.toLowerCase()) ||
    (e.poRefNo || "").toLowerCase().includes(search.toLowerCase()) ||
    (e.supplierName || "").toLowerCase().includes(search.toLowerCase()) ||
    (e.accountHeadName || "").toLowerCase().includes(search.toLowerCase())
  );

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteExpense(deleteId);
      setDeleteId(null);
      toast.success("Expense record deleted successfully");
    } catch (e) {
      toast.error("Failed to delete expense");
    }
  };


  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Business Expenses</h1>
          <p className="text-sm text-muted-foreground">Monitor and track procurement-related operational expenses</p>
        </div>
        <Button onClick={() => router.push("/expenses/create")} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl h-11 px-6 shadow-md transition-all active:scale-95">
          <Plus className="w-4 h-4 mr-2" /> Record Expense
        </Button>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm p-6 overflow-hidden">
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
             placeholder="Search by Ref, PO, Supplier..." 
             value={search} 
             onChange={(e) => setSearch(e.target.value)} 
             className="pl-9 h-11 rounded-xl bg-muted/20 border-border/50 focus:ring-2 focus:ring-primary/5"
          />
        </div>

        <div className="overflow-x-auto -mx-6">
          {isLoading ? (
            <div className="w-full space-y-4 py-8 px-6">
              <div className="flex items-center space-x-4 border-b pb-4">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 flex-1" />
              </div>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 py-4 border-b">
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-4 flex-1" />
                </div>
              ))}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left p-4 font-bold text-muted-foreground uppercase text-[10px] tracking-widest pl-6 w-32">Action</th>
                  <th className="text-left p-4 font-bold text-muted-foreground uppercase text-[10px] tracking-widest">Expense Ref</th>
                  <th className="text-left p-4 font-bold text-muted-foreground uppercase text-[10px] tracking-widest">Date</th>
                  <th className="text-left p-4 font-bold text-muted-foreground uppercase text-[10px] tracking-widest">PO Reference</th>
                  <th className="text-left p-4 font-bold text-muted-foreground uppercase text-[10px] tracking-widest">Account Head</th>
                  <th className="text-right p-4 font-bold text-muted-foreground uppercase text-[10px] tracking-widest">Amount (TZS)</th>
                  <th className="text-center p-4 font-bold text-muted-foreground uppercase text-[10px] tracking-widest pr-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filtered.map((e: any) => {
                  const status = e.status || "Draft";
                  return (
                    <tr key={e.expenseRefNo} className="border-b hover:bg-muted/10 transition-colors group">
                      <td className="p-4 pl-6">
                        <div className="flex gap-1.5">
                          <button 
                            onClick={() => router.push(`/expenses/create?id=${encodeURIComponent(e.expenseRefNo)}`)} 
                            className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-all hover:text-blue-600" 
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => router.push(`/expenses/create?id=${encodeURIComponent(e.expenseRefNo)}`)} 
                            className="p-2 rounded-lg hover:bg-muted text-[#059669] transition-all hover:scale-110" 
                            title="Edit Expense"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setDeleteId(e.expenseRefNo)} 
                            className="p-2 rounded-lg hover:bg-destructive/5 text-destructive/40 hover:text-destructive transition-all" 
                            title="Delete Expense"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-[13px] font-black text-foreground">{e.expenseRefNo}</td>
                      <td className="p-4 text-muted-foreground font-medium">{formatDate(e.expenseDate)}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-blue-500/70" />
                          <span className="font-bold text-[#334155]">{e.poRefNo}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground">{e.accountHeadName}</span>
                          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">{e.supplierName || 'Internal'}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right font-black text-foreground tabular-nums">
                        {(Number(e.totalExpenseAmount) || 0).toLocaleString()}
                      </td>
                      <td className="p-4 text-center pr-6">
                        <Badge variant="outline" className={`${statusColors[status] || ""} font-black text-[10px] px-2.5 h-6 rounded-lg uppercase tracking-tight`}>
                          {status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-muted-foreground italic font-medium">
                      No expense records matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="rounded-2xl border-none shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black text-foreground">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground font-medium">
              This will permanently delete the expense record <span className="text-foreground font-bold">({deleteId})</span>. This action cannot be undone and will affect financial reconciliation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl font-bold border-border">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl font-bold">Delete Record</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
