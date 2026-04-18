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
import { Skeleton } from "@/components/ui/skeleton";

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
  const { orders, deleteOrder, isLoading, getOrderById } = usePurchaseOrderStore();
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const navigate = useRouter();

  const handleExportPDF = async (orderHeader: any) => {
    toast.loading("Fetching PO details...", { id: "po-pdf" });
    const fullOrder = await getOrderById(orderHeader.PO_REF_NO || orderHeader.poRefNo);

    if (!fullOrder) {
      toast.error("Failed to load PO details", { id: "po-pdf" });
      return;
    }

    const h = fullOrder.header;
    const items = fullOrder.items || [];
    const doc = new jsPDF();
    const currency = h.CURRENCY_ID === 2 ? "TZS" : "$";

    // Header & Logo — Logo LEFT, Title RIGHT
    // Handle logo with proper aspect ratio (placed on the left)
    try {
      const logoImg = new Image();
      logoImg.src = "/assets/logo.png";
      await new Promise((resolve) => {
        logoImg.onload = resolve;
        logoImg.onerror = resolve; // Continue even if logo fails
      });

      if (logoImg.complete && logoImg.naturalWidth) {
        const imgWidth = 40;
        const imgHeight = (logoImg.naturalHeight * imgWidth) / logoImg.naturalWidth;
        doc.addImage(logoImg, "PNG", 14, 8, imgWidth, imgHeight);
      }
    } catch (e) {
      console.warn("Logo failed to load", e);
    }

    // PURCHASE ORDER title on the right
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42); // #0F172A
    doc.text("PURCHASE ORDER", 196, 22, { align: "right" });

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // #64748B
    doc.text(`Reference: ${h.PO_REF_NO}`, 196, 30, { align: "right" });
    doc.text(`Date: ${formatDate(h.PO_DATE)}`, 196, 35, { align: "right" });
    doc.text(`Status: ${h.STATUS_ENTRY || "Draft"}`, 196, 40, { align: "right" });

    // Supplier & Store Info - using IDs as a fallback if names not joined
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text("Supplier Details", 14, 55);
    doc.text("Ship To", 120, 55);

    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(`Supplier: ${h.SUPPLIER_ID}`, 14, 62);
    doc.text(`Store: ${h.PO_STORE_ID}`, 120, 62);

    if (h.PURCHASE_TYPE) doc.text(`Type: ${h.PURCHASE_TYPE}`, 14, 67);
    if (h.PAYMENT_TERM_ID) doc.text(`Payment Term ID: ${h.PAYMENT_TERM_ID}`, 14, 72);

    // Item Table
    autoTable(doc, {
      startY: 85,
      head: [['#', 'Product', 'Qty/Pack', 'Total Qty', 'UOM', 'Rate', 'Amount']],
      body: items.map((item: any, index: number) => [
        index + 1,
        item.PRODUCT_NAME || item.PRODUCT_ID || "—",
        item.QTY_PER_PACKING || "—",
        item.TOTAL_QTY || 0,
        item.UOM || "—",
        `${currency} ${(Number(item.RATE_PER_QTY) || 0).toLocaleString()}`,
        `${currency} ${(Number(item.PRODUCT_AMOUNT) || 0).toLocaleString()}`
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
    doc.text(`${currency} ${(Number(h.PRODUCT_HDR_AMOUNT) || 0).toLocaleString()}`, 190, finalY, { align: 'right' });
    doc.text(`${currency} ${(Number(h.TOTAL_VAT_HDR_AMOUNT) || 0).toLocaleString()}`, 190, finalY + 7, { align: 'right' });

    doc.setFontSize(14);
    doc.text(`${currency} ${(Number(h.FINAL_PURCHASE_HDR_AMOUNT) || 0).toLocaleString()}`, 190, finalY + 16, { align: 'right' });

    // Footer note
    if (h.SHIPMENT_REMARKS) {
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text("Remarks:", 14, finalY + 30);
      doc.text(h.SHIPMENT_REMARKS, 14, finalY + 35, { maxWidth: 100 });
    }

    doc.save(`${h.PO_REF_NO || "Purchase_Order"}.pdf`);
    toast.success("PDF generated successfully", { id: "po-pdf" });
  };



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
                  <th className="text-left p-3 font-semibold text-muted-foreground uppercase text-xs">Type</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground uppercase text-xs">Supplier</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground uppercase text-xs">Store</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground uppercase text-xs">Items</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground uppercase text-xs">Product</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground uppercase text-xs">Amt</th>
                  <th className="p-3 font-semibold text-muted-foreground uppercase text-xs text-right">VAT</th>
                  <th className="p-3 font-semibold text-muted-foreground uppercase text-xs text-right">Final Amt</th>
                  <th className="text-center p-3 font-semibold text-muted-foreground uppercase text-xs">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o: any) => {
                  const h = o.header || o;
                  const itemsCount = o.items?.length || h.itemsCount || 0;
                  const currency = h.CURRENCY_ID === 2 ? "TZS" : "$";

                  // Approval summary
                  const headStatus = h.PURCHASE_HEAD_RESPONSE_STATUS || "Pending";
                  const finalStatus = h.STATUS_ENTRY || "Draft";

                  return (
                    <tr key={h.PO_REF_NO} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-3">
                        <div className="flex gap-1">
                          <button onClick={() => navigate.push(`/purchase-orders/create?id=${encodeURIComponent(h.PO_REF_NO)}`)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors" title="View Details"><Eye className="w-4 h-4" /></button>
                          <button onClick={() => navigate.push(`/purchase-orders/create?id=${encodeURIComponent(h.PO_REF_NO)}`)} className="p-1.5 rounded-lg hover:bg-muted text-[#059669] transition-colors" title="Edit PO"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => handleExportPDF(o)} className="p-1.5 rounded-lg hover:bg-muted text-blue-600 transition-colors" title="Export as PDF"><FileText className="w-4 h-4" /></button>
                          <button onClick={() => setDeleteId(h.PO_REF_NO)} className="p-1.5 rounded-lg hover:bg-destructive/5 text-destructive/40 hover:text-destructive transition-colors" title="Delete PO"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                      <td className="p-3 font-mono text-xs font-bold text-[#0F172A]">{h.PO_REF_NO || "-"}</td>
                      <td className="p-3 text-muted-foreground text-xs">{formatDate(h.PO_DATE)}</td>
                      <td className="p-3"><Badge variant="secondary" className="bg-[#F1F5F9] text-[#64748B] border-none font-bold text-[10px] whitespace-nowrap">{h.PURCHASE_TYPE || "Local"}</Badge></td>
                      <td className="p-3 font-semibold text-[#0F172A] text-xs max-w-[150px] truncate">{h.SUPPLIER_ID || "-"}</td>
                      <td className="p-3 text-[10px] text-[#64748B]">{h.PO_STORE_ID || "-"}</td>
                      <td className="p-3 text-center font-bold text-[#0F172A]">{itemsCount}</td>
                      <td className="p-3 text-[10px] font-medium text-[#475569]">{h.SHIPMENT_MODE}</td>
                      <td className="p-3 text-right font-medium text-[#64748B] text-xs">{(Number(h.PRODUCT_HDR_AMOUNT) || 0).toLocaleString()}</td>
                      <td className="p-3 text-right font-medium text-[#64748B] text-xs">{(Number(h.TOTAL_VAT_HDR_AMOUNT) || 0).toLocaleString()}</td>
                      <td className="p-3 text-right font-bold text-[#0F172A] text-xs">{currency} {(Number(h.FINAL_PURCHASE_HDR_AMOUNT) || 0).toLocaleString()}</td>
                      <td className="p-3 text-center">
                        <div className="flex flex-col gap-1 items-center">
                          <Badge variant="outline" className={`${statusColors[finalStatus] || ""} font-bold text-[9px] px-1 h-5`}>{finalStatus}</Badge>
                          <span className="text-[8px] text-muted-foreground uppercase tracking-tighter">Head: {headStatus}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={12} className="p-8 text-center text-muted-foreground">No purchase orders found</td></tr>
                )}
              </tbody>
            </table>
          )}
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