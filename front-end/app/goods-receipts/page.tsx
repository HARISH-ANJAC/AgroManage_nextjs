"use client";

import { useState } from "react";
import { Plus, Search, Eye, Pencil, FileText, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useGoodsReceiptStore } from "@/hooks/useGoodsReceiptStore";
import { useMasterData } from "@/hooks/useMasterData";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
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
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const statusColors: Record<string, string> = {
  Received: "bg-success/10 text-success border-success/30",
  Pending: "bg-warning/10 text-warning border-warning/30",
  Partial: "bg-orange-100 text-orange-600 border-orange-200",
  Active: "bg-success/10 text-success border-success/30",
};

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(date);
};

export default function GoodsReceiptsPage() {
  const navigate = useRouter();
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { grns, isLoading, getGRNById } = useGoodsReceiptStore();
  const { data: stores } = useMasterData("stores");
  const { data: suppliers } = useMasterData("suppliers");

  const storeMap = Object.fromEntries(stores.map((s: any) => [s.id, s.storeName]));
  const supplierMap = Object.fromEntries(suppliers.map((s: any) => [s.id, s.supplierName]));

  const handleExportPDF = async (grnHeader: any) => {
    toast.loading("Fetching GRN details...", { id: "grn-pdf" });
    const fullGrn = await getGRNById(grnHeader.GRN_REF_NO || grnHeader.grnRefNo);

    if (!fullGrn) {
      toast.error("Failed to load GRN details", { id: "grn-pdf" });
      return;
    }

    const grn = { ...fullGrn.header, items: fullGrn.items };
    const doc = new jsPDF();
    const refNo = grn.GRN_REF_NO || grn.grnRefNo || "GRN";
    const date = formatDate(grn.GRN_DATE || grn.grnDate);
    const poRef = grn.PO_REF_NO || grn.poRefNo || "N/A";
    const supplierName = supplierMap[grn.SUPPLIER_ID] || grn.supplierName || "N/A";
    const storeName = storeMap[grn.GRN_STORE_ID] || grn.storeName || "N/A";

    // Header & Logo — Logo LEFT, Title RIGHT
    // Handle logo with proper aspect ratio (placed on the left)
    try {
      const logoImg = new Image();
      logoImg.src = "/assets/tbgs-logo.jpg";
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

    // GOODS RECEIPT NOTE title on the right
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42);
    doc.text("GOODS RECEIPT NOTE", 196, 22, { align: "right" });

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`GRN Ref: ${refNo}`, 196, 30, { align: "right" });
    doc.text(`Date: ${date}`, 196, 35, { align: "right" });
    doc.text(`PO Ref: ${poRef}`, 196, 40, { align: "right" });
    doc.text(`Status: ${grn.STATUS_ENTRY || grn.status || "Received"}`, 196, 45, { align: "right" });

    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text("Supplier", 14, 58);
    doc.text("Receiving Store", 120, 58);

    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(supplierName, 14, 65);
    doc.text(storeName, 120, 65);
    if (grn.VEHICLE_NO || grn.vehicleNo) doc.text(`Vehicle: ${grn.VEHICLE_NO || grn.vehicleNo}`, 14, 70);
    if (grn.DRIVER_NAME || grn.driverName) doc.text(`Driver: ${grn.DRIVER_NAME || grn.driverName}`, 14, 75);

    autoTable(doc, {
      startY: 88,
      head: [["#", "Product", "PO Qty", "Received Qty", "UOM", "Shortage", "Remarks"]],
      body: (grn.items || []).map((item: any, idx: number) => {
        const poQty = Number(item.poQty || item.PO_QTY || 0);
        const recQty = Number(item.TOTAL_QTY || item.receivedQty || 0);
        return [
          idx + 1,
          item.productName || item.PRODUCT_NAME || "—",
          poQty,
          recQty,
          item.UOM || item.uom || "KG",
          poQty - recQty,
          item.REMARKS || ""
        ];
      }),
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [26, 46, 40], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text("Verified By:", 14, finalY);
    doc.text("__________________", 14, finalY + 10);
    doc.text("Store Manager Signature:", 120, finalY);
    doc.text("__________________", 120, finalY + 10);

    doc.save(`${refNo}.pdf`);
    toast.success("GRN PDF generated successfully", { id: "grn-pdf" });
  };

  const confirmDelete = async () => {
    // GRNs are generally archived rather than deleted; show info
    toast.info("GRN deletion is restricted. Please contact admin.");
    setDeleteId(null);
  };

  const filtered = (grns as any[]).filter((g) => {
    const refNo = (g.GRN_REF_NO || g.grnRefNo || "").toLowerCase();
    const poRef = (g.PO_REF_NO || g.poRefNo || "").toLowerCase();
    const supplier = (supplierMap[g.SUPPLIER_ID] || g.supplierName || "").toLowerCase();
    const q = search.toLowerCase();
    return refNo.includes(q) || poRef.includes(q) || supplier.includes(q);
  });

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Goods Receipt Notes (GRN)</h1>
          <p className="text-sm text-muted-foreground">
            Record incoming goods against approved Purchase Orders
          </p>
        </div>
        <Button
          onClick={() => navigate.push("/goods-receipts/create")}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" /> New GRN
        </Button>
      </div>

      {/* Table Card */}
      <div className="bg-card rounded-xl border p-6">
        <div className="relative mb-4 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by GRN ref, PO ref, supplier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {isLoading ? (
          <div className="w-full space-y-4 py-8">
            <div className="flex items-center space-x-4 border-b pb-4">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 flex-1" />
            </div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 py-4 border-b">
                <Skeleton className="h-4 w-4" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 flex-1" />
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-semibold text-muted-foreground uppercase text-xs">Action</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground uppercase text-xs">GRN Ref No</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground uppercase text-xs">GRN Date</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground uppercase text-xs">PO Ref No</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground uppercase text-xs">Supplier</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground uppercase text-xs">GRN Store</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground uppercase text-xs">Source</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground uppercase text-xs">Vehicle No</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground uppercase text-xs">Driver</th>
                  <th className="text-center p-3 font-semibold text-muted-foreground uppercase text-xs">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((g: any) => {
                  const refNo = g.GRN_REF_NO || g.grnRefNo || "";
                  const poRef = g.PO_REF_NO || g.poRefNo || "—";
                  const supplierName = supplierMap[g.SUPPLIER_ID] || g.supplierName || "—";
                  const storeName = storeMap[g.GRN_STORE_ID] || g.storeName || "—";
                  const status = g.STATUS_ENTRY || g.status || "Received";

                  return (
                    <tr key={refNo} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-3">
                        <div className="flex gap-1">
                          <button
                            onClick={() => navigate.push(`/goods-receipts/create?id=${encodeURIComponent(refNo)}`)}
                            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                            title="View / Edit"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate.push(`/goods-receipts/create?id=${encodeURIComponent(refNo)}`)}
                            className="p-1.5 rounded-lg hover:bg-muted text-[#059669] transition-colors"
                            title="Edit GRN"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleExportPDF(g)}
                            className="p-1.5 rounded-lg hover:bg-muted text-blue-600 transition-colors"
                            title="Export PDF"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(refNo)}
                            className="p-1.5 rounded-lg hover:bg-destructive/5 text-destructive/40 hover:text-destructive transition-colors"
                            title="Delete GRN"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="p-3 font-mono text-xs font-bold text-[#0F172A]">{refNo || "—"}</td>
                      <td className="p-3 text-muted-foreground text-xs">{formatDate(g.GRN_DATE || g.grnDate)}</td>
                      <td className="p-3 font-mono text-xs font-semibold text-[#475569]">{poRef}</td>
                      <td className="p-3 font-semibold text-[#0F172A] text-xs max-w-[150px] truncate">{supplierName}</td>
                      <td className="p-3 text-[10px] text-[#64748B]">{storeName}</td>
                      <td className="p-3">
                        <Badge variant="secondary" className="bg-[#F1F5F9] text-[#64748B] border-none font-bold text-[10px]">
                          {g.GRN_SOURCE || g.grnSource || "PO"}
                        </Badge>
                      </td>
                      <td className="p-3 text-xs text-[#64748B]">{g.VEHICLE_NO || g.vehicleNo || "—"}</td>
                      <td className="p-3 text-xs text-[#64748B]">{g.DRIVER_NAME || g.driverName || "—"}</td>
                      <td className="p-3 text-center">
                        <Badge variant="outline" className={`${statusColors[status] || ""} font-bold text-[9px] px-2 h-5`}>
                          {status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={10} className="p-10 text-center text-muted-foreground">
                      {search ? `No GRNs matching "${search}"` : "No Goods Receipts found. Click + New GRN to create one."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restrict GRN Deletion?</AlertDialogTitle>
            <AlertDialogDescription>
              Goods Receipt Notes (GRN) are part of the permanent inventory audit trail and cannot be permanently deleted. You may archive or reverse a GRN through the appropriate workflow.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Understood
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
