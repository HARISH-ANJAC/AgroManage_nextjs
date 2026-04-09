"use client";

import { useState } from "react";
import { Plus, Search, Eye, Pencil, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useRouter } from 'next/navigation';
import { useSalesProformaStore } from "@/hooks/useSalesProformaStore";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const statusColors: Record<string, string> = {
  Confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Draft: "bg-slate-100 text-slate-500 border-slate-200",
  Submitted: "bg-amber-50 text-amber-700 border-amber-200",
  Cancelled: "bg-red-50 text-red-500 border-red-200",
};

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(d);
};

export default function SalesProformasPage() {
  const { proformas, isLoading, getProformaById } = useSalesProformaStore();
  const [search, setSearch] = useState("");
  const router = useRouter();

  const filtered = (proformas || []).filter((p: any) =>
    (p.salesProformaRefNo || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.customerName || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.storeName || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleDownloadPdf = async (refNo: string) => {
    try {
      toast.loading("Generating PDF...", { id: "pf-pdf" });
      const data = await getProformaById(refNo);
      if (!data) throw new Error("Proforma data not found");

      const h = data.header || data;
      const items = data.items || [];
      const doc = new jsPDF();
      const currency = h.currencyName || "TZS";

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

      doc.setFontSize(22);
      doc.setTextColor(15, 23, 42);
      doc.text("SALES PROFORMA", 196, 22, { align: "right" });

      const dDate = h.salesProformaDate ? new Date(h.salesProformaDate) : new Date();
      const fmtDate = !isNaN(dDate.getTime()) ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(dDate) : h.salesProformaDate;

      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text(`Proforma Ref: ${h.salesProformaRefNo || h.SALES_PROFORMA_REF_NO || refNo}`, 196, 30, { align: "right" });
      doc.text(`Date: ${fmtDate}`, 196, 35, { align: "right" });

      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text("Billing Details", 14, 55);

      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      doc.text(`Customer: ${h.customerName || h.CUSTOMER_NAME || "N/A"}`, 14, 62);
      doc.text(`Store: ${h.storeName || h.STORE_NAME || "-"}`, 14, 67);
      doc.text(`Currency: ${currency}`, 120, 67);

      const tableData = items.map((item: any, idx: number) => {
        const product = item.productName || item.PRODUCT_NAME || `Product #${item.productId || item.PRODUCT_ID}`;
        return [
          idx + 1,
          product,
          item.totalQty || item.TOTAL_QTY,
          item.uom || item.UOM,
          `${currency} ${Number(item.salesRatePerQty || item.SALES_RATE_PER_QTY).toLocaleString()}`,
          `${currency} ${Number(item.totalProductAmount || item.TOTAL_PRODUCT_AMOUNT).toLocaleString()}`,
          `${item.vatPercentage || item.VAT_PERCENTAGE}%`,
          `${currency} ${Number(item.vatAmount || item.VAT_AMOUNT).toLocaleString()}`
        ];
      });

      autoTable(doc, {
        startY: 80,
        head: [['#', 'Description', 'Qty', 'UOM', 'Rate', 'Amount', 'VAT%', 'VAT Total']],
        body: tableData,
        styles: { fontSize: 8, cellPadding: 3 },
        headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [248, 250, 252] },
      });

      const finalY = (doc as any).lastAutoTable.finalY + 10;
      const marginX = 130;

      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text("Subtotal:", marginX, finalY);
      doc.text("VAT Total:", marginX, finalY + 7);

      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text("Net Payable:", marginX, finalY + 16);

      const subtotal = Number(h.totalProductAmount || h.TOTAL_PRODUCT_AMOUNT || 0);

      doc.setFontSize(10);
      doc.text(`${currency} ${subtotal.toLocaleString()}`, 190, finalY, { align: 'right' });
      doc.text(`${currency} ${Number(h.vatAmount || h.VAT_AMOUNT || 0).toLocaleString()}`, 190, finalY + 7, { align: 'right' });

      doc.setFontSize(14);
      doc.setTextColor(16, 185, 129);
      doc.text(`${currency} ${Number(h.finalSalesAmount || h.FINAL_SALES_AMOUNT || 0).toLocaleString()}`, 190, finalY + 16, { align: 'right' });

      if (h.remarks || h.REMARKS) {
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text("Remarks:", 14, finalY + 30);
        doc.text(h.remarks || h.REMARKS, 14, finalY + 35, { maxWidth: 100 });
      }

      doc.save(`Proforma_${h.salesProformaRefNo || h.SALES_PROFORMA_REF_NO || refNo}.pdf`);
      toast.success("PDF generated", { id: "pf-pdf" });
    } catch (e: any) {
      toast.error(e.message || "Failed to generate PDF", { id: "pf-pdf" });
    }
  };

  const handleConvertToSO = (refNo: string) => {
    router.push(`/sales-orders/create?proformaRef=${encodeURIComponent(refNo)}`);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Sales Proformas</h1>
          <p className="text-sm text-muted-foreground">
            Manage proforma invoices &rarr; Sales Orders &rarr; Delivery Notes &rarr; Sales Invoices
          </p>
        </div>
        <Button
          onClick={() => router.push("/sales-proformas/create")}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" /> New Proforma
        </Button>
      </div>


      {/* Table Card */}
      <div className="bg-card rounded-xl border p-6">
        <div className="relative mb-4 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by ref no, customer, store..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="w-full space-y-4 py-8">
              <div className="flex items-center space-x-4 border-b pb-4">
                {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-4 flex-1" />)}
              </div>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 py-4 border-b">
                  <div className="flex gap-2">
                    {[...Array(4)].map((_, j) => <Skeleton key={j} className="h-8 w-8 rounded" />)}
                  </div>
                  {[...Array(5)].map((_, j) => <Skeleton key={j} className="h-4 flex-1" />)}
                </div>
              ))}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-semibold text-muted-foreground uppercase text-xs">Action</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground uppercase text-xs">Proforma Ref</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground uppercase text-xs">Date</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground uppercase text-xs">Customer</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground uppercase text-xs">Store</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground uppercase text-xs">Sales Person</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground uppercase text-xs">Currency</th>
                  <th className="text-right p-3 font-semibold text-muted-foreground uppercase text-xs">Subtotal</th>
                  <th className="text-right p-3 font-semibold text-muted-foreground uppercase text-xs">VAT</th>
                  <th className="text-right p-3 font-semibold text-muted-foreground uppercase text-xs">Total</th>
                  <th className="text-center p-3 font-semibold text-muted-foreground uppercase text-xs">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p: any) => (
                  <tr key={p.salesProformaRefNo} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="p-3">
                      <div className="flex gap-1">
                        <button
                          onClick={() => router.push(`/sales-proformas/create?id=${encodeURIComponent(p.salesProformaRefNo)}`)}
                          className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                          title="View/Edit"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/sales-proformas/create?id=${encodeURIComponent(p.salesProformaRefNo)}`)}
                          className="p-1.5 rounded-lg hover:bg-muted text-emerald-600 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownloadPdf(p.salesProformaRefNo)}
                          className="p-1.5 rounded-lg hover:bg-muted text-blue-600 transition-colors"
                          title="Download PDF"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        {p.status === "Confirmed" && (
                          <button
                            onClick={() => handleConvertToSO(p.salesProformaRefNo)}
                            className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-700 transition-colors font-bold"
                            title="Convert to Sales Order"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="p-3 font-mono text-xs font-bold text-slate-800">{p.salesProformaRefNo || "–"}</td>
                    <td className="p-3 text-muted-foreground text-xs">{formatDate(p.salesProformaDate)}</td>
                    <td className="p-3 font-semibold text-xs text-slate-800 max-w-[160px] truncate">{p.customerName || "–"}</td>
                    <td className="p-3 text-xs text-slate-500">{p.storeName || "–"}</td>
                    <td className="p-3 text-xs text-slate-500">{p.salesPersonName || "–"}</td>
                    <td className="p-3 text-xs font-bold text-slate-600">{p.currencyName || "–"}</td>
                    <td className="p-3 text-right text-xs text-slate-500 tabular-nums">{Number(p.totalProductAmount || 0).toLocaleString()}</td>
                    <td className="p-3 text-right text-xs text-slate-500 tabular-nums">{Number(p.vatAmount || 0).toLocaleString()}</td>
                    <td className="p-3 text-right text-xs font-bold text-slate-900 tabular-nums">{Number(p.finalSalesAmount || 0).toLocaleString()}</td>
                    <td className="p-3 text-center">
                      <Badge variant="outline" className={`${statusColors[p.status] || ""} font-bold text-[9px] px-2 h-5`}>
                        {p.status || "Draft"}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={11} className="p-10 text-center text-muted-foreground text-sm">
                      No proforma invoices found. Create your first one above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
