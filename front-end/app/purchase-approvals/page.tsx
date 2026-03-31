"use client";

import { useEffect, useState } from "react";
import { Search, Eye, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useRouter } from 'next/navigation';
import { usePurchaseOrderStore } from "@/hooks/usePurchaseOrderStore";
import { Skeleton } from "@/components/ui/skeleton";

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
import { Textarea } from "@/components/ui/textarea";

const statusColors: Record<string, string> = {
  Approved: "bg-success/10 text-success border-success/30",
  Submitted: "bg-warning/10 text-warning border-warning/30",
  Completed: "bg-success/10 text-success border-success/30",
  Draft: "bg-muted text-muted-foreground border-border",
  "In-Approval": "bg-warning/10 text-warning border-warning/30",
  Rejected: "bg-destructive/10 text-destructive border-destructive/30",
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

export default function PurchaseApprovalsPage() {
  const { orders, refetchOrders, isLoading, approveOrder } = usePurchaseOrderStore();
  const [search, setSearch] = useState("");
  const [approvalModal, setApprovalModal] = useState<{ id: string, action: 'Approve' | 'Reject' } | null>(null);
  const [remarks, setRemarks] = useState("");
  const navigate = useRouter();

  // Refetch is handled by React Query inherently, but we can do a forced refetch if needed
  useEffect(() => {
    refetchOrders();
  }, [refetchOrders]);


  // Filter for pending approvals (Submitted or In-Approval)
  const pendingOrders = (orders || []).filter((o: any) => {
    const h = o.header || o;
    return ["Submitted", "In-Approval"].includes(h.STATUS_ENTRY || h.status);
  });

  const filtered = pendingOrders.filter((o: any) => {
    const h = o.header || o;
    return (h.poNumber || h.poRefNo || h.PO_REF_NO || "").toLowerCase().includes(search.toLowerCase()) ||
      (h.supplier || h.SUPPLIER_ID || "").toString().toLowerCase().includes(search.toLowerCase());
  });

  const confirmAction = async () => {
    if (!approvalModal) return;
    try {
      await approveOrder({
        id: approvalModal.id, 
        level: "head", 
        status: approvalModal.action === "Approve" ? "Approved" : "Rejected", 
        remarks, 
        user: "Admin" 
      });
      toast.success(`Purchase Order ${approvalModal.action === "Approve" ? "Approved" : "Rejected"} successfully`);
      setApprovalModal(null);
      setRemarks("");
      refetchOrders(); // Refresh Data
    } catch (e) {
      toast.error(`Failed to ${approvalModal.action.toLowerCase()} Purchase Order`);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pending Approvals</h1>
          <p className="text-sm text-muted-foreground">Review and approve purchase orders</p>
        </div>
      </div>

      <div className="bg-card rounded-xl border p-6">
        <div className="relative mb-4 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search approvals..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="w-full space-y-4 py-8">
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
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-semibold text-muted-foreground uppercase text-xs">Action</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground uppercase text-xs">PO Ref No</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground uppercase text-xs">Date</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground uppercase text-xs">Supplier</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground uppercase text-xs">Store</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground uppercase text-xs">Items</th>
                  <th className="p-3 font-semibold text-muted-foreground uppercase text-xs text-right">Final Amt</th>
                  <th className="text-center p-3 font-semibold text-muted-foreground uppercase text-xs">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o: any) => {
                  const h = o.header || o;
                  const itemsCount = o.items?.length || h.itemsCount || 0;
                  const currency = h.CURRENCY_ID === 2 ? "TZS" : "$";
                  const finalStatus = h.STATUS_ENTRY || "Draft";

                  return (
                    <tr key={h.PO_REF_NO} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button onClick={() => navigate.push(`/purchase-orders/create?id=${encodeURIComponent(h.PO_REF_NO)}`)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors" title="View Details"><Eye className="w-4 h-4" /></button>
                          <button onClick={() => setApprovalModal({ id: h.PO_REF_NO, action: 'Approve' })} className="p-1.5 rounded-lg hover:bg-success/20 text-success transition-colors" title="Approve"><CheckCircle className="w-4 h-4" /></button>
                          <button onClick={() => setApprovalModal({ id: h.PO_REF_NO, action: 'Reject' })} className="p-1.5 rounded-lg hover:bg-destructive/20 text-destructive transition-colors" title="Reject"><XCircle className="w-4 h-4" /></button>
                        </div>
                      </td>
                      <td className="p-3 font-mono text-xs font-bold text-[#0F172A]">{h.PO_REF_NO || "-"}</td>
                      <td className="p-3 text-muted-foreground text-xs">{formatDate(h.PO_DATE)}</td>
                      <td className="p-3 font-semibold text-[#0F172A] text-xs max-w-[150px] truncate">{h.SUPPLIER_ID || "-"}</td>
                      <td className="p-3 text-[10px] text-[#64748B]">{h.PO_STORE_ID || "-"}</td>
                      <td className="p-3 text-center font-bold text-[#0F172A]">{itemsCount}</td>
                      <td className="p-3 text-right font-bold text-[#0F172A] text-xs">{currency} {(Number(h.FINAL_PURCHASE_HDR_AMOUNT) || 0).toLocaleString()}</td>
                      <td className="p-3 text-center">
                        <Badge variant="outline" className={`${statusColors[finalStatus] || ""} font-bold text-[9px] px-1 h-5`}>{finalStatus}</Badge>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">No pending approvals found</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <AlertDialog open={!!approvalModal} onOpenChange={(open) => !open && setApprovalModal(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{approvalModal?.action} Purchase Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {approvalModal?.action.toLowerCase()} this purchase order? You can leave remarks below:
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4">
              <Textarea placeholder="Enter remarks (optional)..." value={remarks} onChange={(e) => setRemarks(e.target.value)} />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmAction} 
              className={approvalModal?.action === 'Approve' ? "bg-success text-success-foreground hover:bg-success/90" : "bg-destructive text-destructive-foreground hover:bg-destructive/90"}
            >
              Confirm {approvalModal?.action}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
