"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useSalesProformaStore } from "@/hooks/useSalesProformaStore";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";

export default function SalesProformasPage() {
  const { proformas, isLoading, getProformaById, deleteProforma, bulkDelete } = useSalesProformaStore();

  const handleExportPDF = async (proforma: any) => {
    toast.loading("Generating Sales Proforma PDF...", { id: "sp-pdf" });
    const fullProforma = await getProformaById(proforma.salesProformaRefNo || proforma.id);
    
    if (!fullProforma) {
      toast.error("Failed to load proforma details", { id: "sp-pdf" });
      return;
    }

    const h = fullProforma.header || fullProforma;
    const items = fullProforma.items || [];
    const doc = new jsPDF();
    const currency = h.currencyName || "TZS";

    try {
      const logoImg = new Image();
      logoImg.src = "/assets/logo.png";
      await new Promise((resolve) => {
        logoImg.onload = resolve;
        logoImg.onerror = resolve;
      });

      if (logoImg.naturalWidth) {
        const canvas = document.createElement("canvas");
        canvas.width = logoImg.naturalWidth;
        canvas.height = logoImg.naturalHeight;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(logoImg, 0, 0);
        const logoData = canvas.toDataURL("image/png");
        const imgWidth = 40;
        const imgHeight = (logoImg.naturalHeight * imgWidth) / logoImg.naturalWidth;
        doc.addImage(logoData, "PNG", 14, 8, imgWidth, imgHeight);
      }
    } catch (e) {
      console.warn("Logo failed to load", e);
    }

    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42);
    doc.text("SALES PROFORMA", 196, 22, { align: "right" });

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Reference: ${h.salesProformaRefNo || proforma.id}`, 196, 30, { align: "right" });
    doc.text(`Date: ${h.salesProformaDate ? new Date(h.salesProformaDate).toLocaleDateString() : "N/A"}`, 196, 35, { align: "right" });
    doc.text(`Status: ${h.status || "Draft"}`, 196, 40, { align: "right" });

    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text("Customer Details", 14, 55);
    doc.text("Store / Currency", 120, 55);

    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(h.customerName || "N/A", 14, 62);
    doc.text(`${h.storeName || "Main"} / ${h.currencyName || "TZS"}`, 120, 62);

    if (items.length > 0) {
      autoTable(doc, {
        startY: 85,
        head: [['#', 'Product', 'Qty', 'UOM', 'Rate', 'Amount']],
        body: items.map((item: any, index: number) => [
          index + 1,
          item.productName || "—",
          item.totalQty || 0,
          item.uom || "Unit",
          `${currency} ${(item.salesRatePerQty || 0).toLocaleString()}`,
          `${currency} ${(item.totalProductAmount || 0).toLocaleString()}`
        ]),
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [248, 250, 252] },
      });
    }

    const finalY = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 10 : 95;
    const marginX = 140;

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text("Subtotal:", marginX, finalY);
    doc.text("VAT Amount:", marginX, finalY + 7);
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text("Grand Total:", marginX, finalY + 16);

    doc.setFontSize(10);
    doc.text(`${currency} ${(h.totalProductAmount || 0).toLocaleString()}`, 190, finalY, { align: 'right' });
    doc.text(`${currency} ${(h.vatAmount || 0).toLocaleString()}`, 190, finalY + 7, { align: 'right' });
    doc.setFontSize(14);
    doc.text(`${currency} ${(h.finalSalesAmount || 0).toLocaleString()}`, 190, finalY + 16, { align: 'right' });

    doc.save(`${h.salesProformaRefNo || "Proforma"}.pdf`);
    toast.success("PDF generated successfully", { id: "sp-pdf" });
  };

  return <MasterCrudPage
    domain="sales-proformas"
    title="Sales Proformas"
    description="Manage proforma invoices and conversions"
    idPrefix="PF"
    onPrint={handleExportPDF}
    customStoreOverrides={{
      data: proformas.map((p: any) => ({
        ...p,
        id: p.salesProformaRefNo || p.id,
        formattedDate: p.salesProformaDate ? new Date(p.salesProformaDate).toLocaleDateString() : "-",
        formattedTotal: `TZS ${(p.finalSalesAmount || 0).toLocaleString()}`,
      })),
      add: () => { toast.error("Please use the New Proforma button"); },
      update: (item: any) => { toast.error("Please use the Edit button"); },
      remove: deleteProforma,
      bulkRemove: bulkDelete,
      isLoading
    }}
    fields={[
      { key: "salesProformaRefNo", label: "Ref No", type: "text", required: true },
      { key: "salesProformaDate", label: "Date", type: "date", required: true },
      { key: "customerName", label: "Customer", type: "text", required: true },
      { key: "status", label: "Status", type: "select", options: ["Draft", "Confirmed", "Submitted", "Cancelled"] },
    ]}
    initialData={[]}
    columns={[
      { key: "salesProformaRefNo", label: "Reference" },
      { key: "formattedDate", label: "Date" },
      { key: "customerName", label: "Customer" },
      { key: "storeName", label: "Store" },
      { key: "formattedTotal", label: "Total Amount" },
      { key: "status", label: "Status" },
    ]}
    customAddUrl="/sales-proformas/create"
    customEditUrl={(id) => `/sales-proformas/create?id=${encodeURIComponent(id)}`}
  />;
}
