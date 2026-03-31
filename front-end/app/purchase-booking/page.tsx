"use client";

import { usePurchaseBookingStore } from "@/hooks/usePurchaseBookingStore";
import { useMasterData } from "@/hooks/useMasterData";
import { useState } from "react";
import { Plus, Search, Eye, Pencil, FileText, Trash2, Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Skeleton } from "@/components/ui/skeleton";

const statusColors: Record<string, string> = {
  Approved: "bg-success/10 text-success border-success/30",
  Pending: "bg-warning/10 text-warning border-warning/30",
  Draft: "bg-slate-100 text-slate-600 border-slate-200",
};

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(date);
};

export default function PurchaseBookingPage() {
  const navigate = useRouter();
  const [search, setSearch] = useState("");
  const { bookings, isLoading, getBookingById, deleteBooking } = usePurchaseBookingStore();
  const { data: suppliers } = useMasterData("suppliers");
  const { data: companies } = useMasterData("companies");

  const supplierMap = Object.fromEntries(suppliers.map((s: any) => [s.id || s.Supplier_Id, s.supplierName || s.Supplier_Name]));
  const companyMap = Object.fromEntries(companies.map((c: any) => [c.id || c.Company_Id, c.companyName || c.Company_Name]));

  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownloadPDF = async (id: string) => {
    setDownloadingId(id);
    try {
      const data = await getBookingById(id);
      if (!data) throw new Error("Invoice data not found");

      const h = data.header || data;
      const items = data.items || [];
      const additionalCosts = data.additionalCosts || [];
      const doc = new jsPDF();
      const currency = "TZS";

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

      // PURCHASE INVOICE title on the right
      doc.setFontSize(22);
      doc.setTextColor(15, 23, 42);
      doc.text("PURCHASE INVOICE", 196, 22, { align: "right" });

      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text(`PI Ref: ${h.purchaseInvoiceRefNo || h.PURCHASE_INVOICE_REF_NO}`, 196, 30, { align: "right" });
      doc.text(`Supplier Inv: ${h.invoiceNo || h.INVOICE_NO}`, 196, 35, { align: "right" });
      doc.text(`Date: ${formatDate(h.invoiceDate || h.INVOICE_DATE)}`, 196, 40, { align: "right" });

      // Supplier & Match Details
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text("Billing Details", 14, 55);
      doc.text("Purchase Link", 120, 55);

      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      doc.text(`Supplier: ${supplierMap[h.supplierId || h.SUPPLIER_ID] || "N/A"}`, 14, 62);
      doc.text(`Store: ${h.storeId || h.STORE_ID || "-"}`, 14, 67);
      doc.text(`PO Ref: ${h.poRefNo || h.PO_REF_NO || "-"}`, 120, 62);
      doc.text(`Currency: ${currency}`, 120, 67);

      // Items Table
      const tableData = items.map((item: any, idx: number) => {
        const product = `Product #${item.PRODUCT_ID || item.productId}`;
        return [
          idx + 1,
          product,
          item.TOTAL_QTY || item.totalQty,
          item.UOM || item.uom,
          `${currency} ${Number(item.RATE_PER_QTY || item.ratePerQty).toLocaleString()}`,
          `${currency} ${Number(item.PRODUCT_AMOUNT || item.productAmount).toLocaleString()}`,
          `${item.VAT_PERCENTAGE || item.vatPercentage}%`,
          `${currency} ${Number(item.VAT_AMOUNT || item.vatAmount).toLocaleString()}`
        ];
      });

      // Add Additional Costs as rows if any
      additionalCosts.forEach((ac: any) => {
        tableData.push([
          "AC",
          `Additional Cost #${ac.ADDITIONAL_COST_TYPE_ID || ac.typeId}`,
          "-", "-", "-",
          `${currency} ${Number(ac.ADDITIONAL_COST_AMOUNT || ac.amount).toLocaleString()}`,
          "0%", "0.00"
        ]);
      });

      autoTable(doc, {
        startY: 80,
        head: [['#', 'Description', 'Qty', 'UOM', 'Rate', 'Amount', 'VAT%', 'VAT Total']],
        body: tableData,
        styles: { fontSize: 8, cellPadding: 3 },
        headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255] }, // Emerald-500
        alternateRowStyles: { fillColor: [248, 250, 252] },
      });

      // Summary
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      const marginX = 130;

      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text("Subtotal (Incl AC):", marginX, finalY);
      doc.text("VAT Total:", marginX, finalY + 7);
      
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text("Net Payable:", marginX, finalY + 16);

      const subtotal = Number(h.PRODUCT_HDR_AMOUNT || h.productAmount || 0) + Number(h.TOTAL_ADDITIONAL_COST_AMOUNT || h.totalAdditionalCostAmount || 0);

      doc.setFontSize(10);
      doc.text(`${currency} ${subtotal.toLocaleString()}`, 190, finalY, { align: 'right' });
      doc.text(`${currency} ${Number(h.TOTAL_VAT_HDR_AMOUNT || h.totalVatAmount || 0).toLocaleString()}`, 190, finalY + 7, { align: 'right' });
      
      doc.setFontSize(14);
      doc.setTextColor(16, 185, 129);
      doc.text(`${currency} ${Number(h.FINAL_INVOICE_HDR_AMOUNT || h.finalAmount || 0).toLocaleString()}`, 190, finalY + 16, { align: 'right' });

      if (h.REMARKS || h.remarks) {
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text("Remarks:", 14, finalY + 30);
        doc.text(h.REMARKS || h.remarks, 14, finalY + 35, { maxWidth: 100 });
      }

      doc.save(`PI_${h.purchaseInvoiceRefNo || h.PURCHASE_INVOICE_REF_NO}.pdf`);
      toast.success("Invoice PDF generated");
    } catch (e: any) {
      toast.error(e.message || "Failed to generate PDF");
    } finally {
      setDownloadingId(null);
    }
  };

  const filtered = bookings.filter((b: any) => {
    const ref = (b.purchaseInvoiceRefNo || b.PURCHASE_INVOICE_REF_NO || "").toLowerCase();
    const invNo = (b.invoiceNo || b.INVOICE_NO || "").toLowerCase();
    const poRef = (b.poRefNo || b.PO_REF_NO || "").toLowerCase();
    const grnRef = (b.grnRefNo || b.GRN_REF_NO || "").toLowerCase();
    const term = search.toLowerCase();
    return ref.includes(term) || invNo.includes(term) || poRef.includes(term) || grnRef.includes(term);
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Purchase Invoices</h1>
          <p className="text-sm text-muted-foreground">Manage and track your supplier invoices against PO and GRN</p>
        </div>
        <Button onClick={() => navigate.push("/purchase-booking/create")} className="bg-primary text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" /> New Purchase Invoice
        </Button>
      </div>

      <div className="bg-card rounded-xl border p-6 shadow-sm">
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by PI Ref, Invoice No, PO Ref..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="pl-9 h-11 rounded-xl"
          />
        </div>

        {isLoading ? (
          <div className="w-full space-y-4 py-8">
            <div className="flex items-center space-x-4 border-b pb-4">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-32" />
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
          <div className="overflow-x-auto rounded-xl border border-border/50">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b">
                  <th className="text-left p-4 font-bold uppercase text-[10px] tracking-widest text-[#94A3B8]">Actions</th>
                  <th className="text-left p-4 font-bold uppercase text-[10px] tracking-widest text-[#94A3B8]">PI Ref No</th>
                  <th className="text-left p-4 font-bold uppercase text-[10px] tracking-widest text-[#94A3B8]">Inv Date</th>
                  <th className="text-left p-4 font-bold uppercase text-[10px] tracking-widest text-[#94A3B8]">Supplier Inv No</th>
                  <th className="text-left p-4 font-bold uppercase text-[10px] tracking-widest text-[#94A3B8]">Supplier</th>
                  <th className="text-left p-4 font-bold uppercase text-[10px] tracking-widest text-[#94A3B8]">PO Ref</th>
                  <th className="text-left p-4 font-bold uppercase text-[10px] tracking-widest text-[#94A3B8]">GRN Ref</th>
                  <th className="text-right p-4 font-bold uppercase text-[10px] tracking-widest text-[#94A3B8]">Final Amount</th>
                  <th className="text-center p-4 font-bold uppercase text-[10px] tracking-widest text-[#94A3B8]">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b: any) => {
                  const id = b.purchaseInvoiceRefNo || b.PURCHASE_INVOICE_REF_NO;
                  const supplier = supplierMap[b.supplierId || b.SUPPLIER_ID] || b.supplier || "N/A";
                  const status = b.status || b.STATUS_ENTRY || "Pending";
                  const amount = Number(b.finalAmount || b.FINAL_INVOICE_HDR_AMOUNT || 0);

                  return (
                    <tr key={id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate.push(`/purchase-booking/create?id=${encodeURIComponent(id)}`)}
                            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-all border border-transparent hover:border-slate-200"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                                if (window.confirm("Are you sure you want to delete this invoice?")) {
                                    deleteBooking(id).then(() => toast.success("Invoice deleted")).catch((e:any) => toast.error(e.message));
                                }
                            }}
                            className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-all border border-transparent hover:border-red-200"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDownloadPDF(id)}
                            disabled={downloadingId === id}
                            className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-all border border-transparent hover:border-blue-200 disabled:opacity-50"
                            title="Download PDF Invoice"
                          >
                            {downloadingId === id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <FileText className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-xs font-bold text-[#0F172A]">{id}</td>
                      <td className="p-4 text-xs font-medium text-slate-500">{formatDate(b.invoiceDate || b.INVOICE_DATE)}</td>
                      <td className="p-4 font-semibold text-slate-700">{b.invoiceNo || b.INVOICE_NO}</td>
                      <td className="p-4 font-medium text-slate-600 truncate max-w-[150px]">{supplier}</td>
                      <td className="p-4 font-mono text-[10px] font-bold text-slate-500">{b.poRefNo || b.PO_REF_NO || "—"}</td>
                      <td className="p-4 font-mono text-[10px] font-bold text-slate-500">{b.grnRefNo || b.GRN_REF_NO || "—"}</td>
                      <td className="p-4 text-right font-bold text-[#0F172A]">
                        {amount.toLocaleString("en-TZ", { style: "currency", currency: "TZS" })}
                      </td>
                      <td className="p-4 text-center">
                        <Badge variant="outline" className={`${statusColors[status]} font-bold text-[9px] px-2 h-5`}>
                          {status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} className="p-16 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="w-12 h-12 text-slate-200" />
                        <p className="text-slate-400 font-medium">No purchase invoices found matching your search</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
