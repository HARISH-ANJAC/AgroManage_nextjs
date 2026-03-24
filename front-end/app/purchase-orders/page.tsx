"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Eye, Pencil, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useRouter } from 'next/navigation';
import { usePurchaseOrderStore } from "@/hooks/usePurchaseOrderStore";

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

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

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

export default function PurchaseOrdersPage() {
  const { orders, deleteOrder, isLoading } = usePurchaseOrderStore();
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const navigate = useRouter();

  const handleExportPDF = (order: any) => {
    const h = order.header || order;
    const items = order.items || [];
    const doc = new jsPDF();
    const currency = h.currency || "$";

    // Header
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42); // #0F172A
    doc.text("PURCHASE ORDER", 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // #64748B
    doc.text(`Reference: ${h.poRefNo || h.poNumber}`, 14, 30);
    doc.text(`Date: ${h.poDate || "N/A"}`, 14, 35);
    doc.text(`Status: ${h.status || "Draft"}`, 14, 40);

    // Supplier & Store Info
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text("Supplier Details", 14, 55);
    doc.text("Ship To", 120, 55);

    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(h.supplier || "N/A", 14, 62);
    doc.text(h.store || "Main Warehouse", 120, 62);
    
    if (h.purchaseType) doc.text(`Type: ${h.purchaseType}`, 14, 67);
    if (h.paymentTerm) doc.text(`Payment: ${h.paymentTerm}`, 14, 72);

    // Item Table
    autoTable(doc, {
      startY: 85,
      head: [['#', 'Product', 'Qty/Pack', 'Total Qty', 'UOM', 'Rate', 'Amount']],
      body: items.map((item: any, index: number) => [
        index + 1,
        item.product,
        item.qtyPerPack,
        item.totalQty,
        item.uom,
        `${currency} ${item.rate.toLocaleString()}`,
        `${currency} ${item.amount.toLocaleString()}`
      ]),
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [26, 46, 40], textColor: [255, 255, 255] }, // #1A2E28
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });

    // Summary Section
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    const marginX = 140;

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text("Subtotal:", marginX, finalY);
    doc.text("VAT Amount:", marginX, finalY + 7);
    
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text("Grand Total:", marginX, finalY + 16);

    doc.setFontSize(10);
    doc.text(`${currency} ${(h.productAmount || 0).toLocaleString()}`, 190, finalY, { align: 'right' });
    doc.text(`${currency} ${(h.totalVatAmount || 0).toLocaleString()}`, 190, finalY + 7, { align: 'right' });
    
    doc.setFontSize(14);
    doc.text(`${currency} ${(h.finalAmount || 0).toLocaleString()}`, 190, finalY + 16, { align: 'right' });

    // Footer note
    if (h.shipmentRemarks) {
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text("Remarks:", 14, finalY + 30);
        doc.text(h.shipmentRemarks, 14, finalY + 35, { maxWidth: 100 });
    }

    doc.save(`${h.poRefNo || "Purchase_Order"}.pdf`);
    toast.success("PDF generated successfully");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4 min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-sm text-muted-foreground animate-pulse">Loading purchase orders...</p>
      </div>
    );
  }

  const filtered = (orders || []).filter((o: any) => {
    const h = o.header || o;
    return (h.poNumber || h.poRefNo || "").toLowerCase().includes(search.toLowerCase()) ||
      (h.supplier || "").toLowerCase().includes(search.toLowerCase());
  });

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteOrder(deleteId);
      setDeleteId(null);
      toast.success("Purchase Order deleted successfully");
    } catch (e) {
      toast.error("Failed to delete Purchase Order");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Purchase Orders</h1>
          <p className="text-sm text-muted-foreground">Create and manage purchase orders for commodities</p>
        </div>
        <Button onClick={() => navigate.push("/purchase-orders/create")} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" /> New Purchase Order
        </Button>
      </div>

      <div className="bg-card rounded-xl border p-6">
        <div className="relative mb-4 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search purchase orders..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 font-semibold text-muted-foreground uppercase text-xs">Action</th>
                <th className="text-left p-3 font-semibold text-muted-foreground uppercase text-xs">PO Ref No</th>
                <th className="text-left p-3 font-semibold text-muted-foreground uppercase text-xs">Date</th>
                <th className="text-left p-3 font-semibold text-muted-foreground uppercase text-xs">Type</th>
                <th className="text-left p-3 font-semibold text-muted-foreground uppercase text-xs">Supplier</th>
                <th className="text-left p-3 font-semibold text-muted-foreground uppercase text-xs">Store</th>
                <th className="text-left p-3 font-semibold text-muted-foreground uppercase text-xs">Items</th>
                <th className="text-left p-3 font-semibold text-muted-foreground uppercase text-xs">Product</th>
                <th className="text-left p-3 font-semibold text-muted-foreground uppercase text-xs">Amt</th>
                <th className="text-left p-3 font-semibold text-muted-foreground uppercase text-xs text-right">VAT</th>
                <th className="text-left p-3 font-semibold text-muted-foreground uppercase text-xs text-right">Final Amt</th>
                <th className="text-center p-3 font-semibold text-muted-foreground uppercase text-xs">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o: any) => {
                const h = o.header || o;
                const itemsCount = o.items?.length || 0;
                const firstProduct = o.items?.[0]?.product || "-";
                const currency = h.currency || "$";

                return (
                  <tr key={o.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="p-3">
                      <div className="flex gap-1">
                        <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors" title="View Details"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => navigate.push(`/purchase-orders/create?id=${encodeURIComponent(o.id)}`)} className="p-1.5 rounded-lg hover:bg-muted text-[#059669] transition-colors" title="Edit PO"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => handleExportPDF(o)} className="p-1.5 rounded-lg hover:bg-muted text-blue-600 transition-colors" title="Export as PDF"><FileText className="w-4 h-4" /></button>
                        <button onClick={() => setDeleteId(o.id)} className="p-1.5 rounded-lg hover:bg-destructive/5 text-destructive/40 hover:text-destructive transition-colors" title="Delete PO"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                    <td className="p-3 font-mono text-xs font-bold text-[#0F172A]">{h.poRefNo || h.poNumber || "-"}</td>
                    <td className="p-3 text-muted-foreground">{h.poDate || "-"}</td>
                    <td className="p-3"><Badge variant="secondary" className="bg-[#F1F5F9] text-[#64748B] border-none font-bold text-[10px]">{h.purchaseType || "Local"}</Badge></td>
                    <td className="p-3 font-semibold text-[#0F172A]">{h.supplier || "-"}</td>
                    <td className="p-3 text-xs text-[#64748B]">{h.store || "-"}</td>
                    <td className="p-3 text-center font-bold text-[#0F172A]">{itemsCount}</td>
                    <td className="p-3 text-xs font-medium text-[#475569] truncate max-w-[120px]">{firstProduct}</td>
                    <td className="p-3 text-right font-medium text-[#64748B]">{currency} {(h.productAmount || 0).toLocaleString()}</td>
                    <td className="p-3 text-right font-medium text-[#64748B]">{currency} {(h.totalVatAmount || 0).toLocaleString()}</td>
                    <td className="p-3 text-right font-bold text-[#0F172A]">{currency} {(h.finalAmount || 0).toLocaleString()}</td>
                    <td className="p-3 text-center"><Badge variant="outline" className={`${statusColors[h.status] || ""} font-bold text-[10px]`}>{h.status || "Draft"}</Badge></td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={12} className="p-8 text-center text-muted-foreground">No purchase orders found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this purchase order. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
