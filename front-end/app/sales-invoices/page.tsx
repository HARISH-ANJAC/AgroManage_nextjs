"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useSalesInvoiceStore } from "@/hooks/useSalesInvoiceStore";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";

export default function SalesInvoicesPage() {
  const { invoices, addInvoice, updateInvoice, deleteInvoice, getInvoiceById, isLoading } = useSalesInvoiceStore();

  const handleExportPDF = async (invoice: any) => {
    toast.loading("Generating Sales Invoice PDF...", { id: "inv-pdf" });
    const fullInv = await getInvoiceById(invoice.taxInvoiceRefNo || invoice.id);
    
    if (!fullInv) {
      toast.error("Failed to load invoice details", { id: "inv-pdf" });
      return;
    }

    const h = fullInv.header;
    const items = fullInv.items || [];
    const doc = new jsPDF();
    const currency = "TZS";

    // Header & Logo
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42); 
    doc.text("TAX INVOICE", 14, 22);

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
        doc.addImage(logoData, "PNG", 155, 10, imgWidth, imgHeight);
      }
    } catch (e) {
      console.warn("Logo failed to load", e);
    }
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); 
    doc.text(`Invoice Ref: ${h.taxInvoiceRefNo || h.id}`, 14, 30);
    doc.text(`Invoice Date: ${h.invoiceDate ? new Date(h.invoiceDate).toLocaleDateString() : "N/A"}`, 14, 35);
    doc.text(`Delivery Note: ${h.deliveryNoteRefNo || "N/A"}`, 14, 40);
    doc.text(`Status: ${h.status || "Open"}`, 14, 45);

    // Business Info
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text("Customer Billing Details", 14, 60);
    doc.text("Dispatch From", 120, 60);

    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(h.customerName || "N/A", 14, 67);
    doc.text(h.fromStoreName || "Main Warehouse", 120, 67);
    
    // Item Table
    autoTable(doc, {
      startY: 85,
      head: [['#', 'Product', 'Qty', 'UOM', 'Rate', 'Amount', 'VAT', 'Total']],
      body: items.map((item: any, index: number) => [
        index + 1,
        item.productName || "—",
        item.invoiceQty || 0,
        item.uom || "Unit",
        `${currency} ${(item.rate || 0).toLocaleString()}`,
        `${currency} ${(item.amount || 0).toLocaleString()}`,
        `${currency} ${(item.vatAmount || 0).toLocaleString()}`,
        `${currency} ${(item.finalAmount || 0).toLocaleString()}`
      ]),
      styles: { fontSize: 8, cellPadding: 2.5 },
      headStyles: { fillColor: [26, 46, 40], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });

    const finalY = ((doc as any).lastAutoTable?.finalY || 100) + 15;
    
    // Summary
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Subtotal:`, 140, finalY);
    doc.text(`${currency} ${(h.totalProductAmount || 0).toLocaleString()}`, 190, finalY, { align: 'right' });

    doc.text(`VAT Amount:`, 140, finalY + 7);
    doc.text(`${currency} ${(h.vatAmount || 0).toLocaleString()}`, 190, finalY + 7, { align: 'right' });

    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text(`Grand Total:`, 140, finalY + 16);
    doc.text(`${currency} ${(h.finalSalesAmount || 0).toLocaleString()}`, 190, finalY + 16, { align: 'right' });

    doc.save(`Invoice_${h.taxInvoiceRefNo || "Export"}.pdf`);
    toast.success("Sales Invoice PDF generated successfully", { id: "inv-pdf" });
  };

  return <MasterCrudPage
    domain="sales-invoices"
    title="Sales Invoices"
    description="Manage and track tax invoices generated for sales deliveries."
    idPrefix="INV"
    onPrint={handleExportPDF}
    customStoreOverrides={{
      data: invoices.map((n: any) => ({
        ...n,
        id: n.taxInvoiceRefNo || n.id,
        formattedDate: n.invoiceDate ? new Date(n.invoiceDate).toLocaleDateString() : "-",
        formattedTotal: `TZS ${(n.finalSalesAmount || 0).toLocaleString()}`,
        formattedVat: `TZS ${(n.vatAmount || 0).toLocaleString()}`,
      })),
      add: addInvoice,
      update: (item: any) => updateInvoice(item.taxInvoiceRefNo || item.id, item),
      remove: deleteInvoice,
      isLoading: isLoading
    }}
    columns={[
      { key: "taxInvoiceRefNo", label: "Invoice Ref" },
      { key: "formattedDate", label: "Date" },
      { key: "deliveryNoteRefNo", label: "DN Ref" },
      { key: "customerName", label: "Customer" },
      { key: "fromStoreName", label: "Store" },
      { key: "formattedTotal", label: "Total Value" },
      { key: "status", label: "Status" },
    ]}
    fields={[]}
    initialData={[]}
    customAddUrl="/sales-invoices/create"
    customEditUrl={(id) => `/sales-invoices/create?id=${encodeURIComponent(id)}`}
  />;
}
