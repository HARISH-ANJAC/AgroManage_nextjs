"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useCustomerReceiptStore } from "@/hooks/useCustomerReceiptStore";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";

export default function CustomerReceiptsPage() {
  const { receipts, addReceipt, deleteReceipt, getReceiptById, isLoading } = useCustomerReceiptStore();

  const handlePrintReceipt = async (receipt: any) => {
    toast.loading("Generating Payment Receipt PDF...", { id: "cr-pdf" });
    const fullReceipt = await getReceiptById(receipt.receiptRefNo || receipt.id);
    
    if (!fullReceipt) {
      toast.error("Failed to load receipt details", { id: "cr-pdf" });
      return;
    }

    const h = fullReceipt.header;
    const items = fullReceipt.items || [];
    const doc = new jsPDF();
    const currency = "TZS";

    // Header & Logo
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42); 
    doc.text("OFFICIAL RECEIPT", 14, 22);

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
    doc.text(`Receipt Ref: ${h.receiptRefNo || h.id}`, 14, 30);
    doc.text(`Date: ${h.receiptDate ? new Date(h.receiptDate).toLocaleDateString() : "N/A"}`, 14, 35);
    doc.text(`Payment Mode: ${h.paymentModeName || "Regular Payment"}`, 14, 40);

    // Business Info
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text("Received From (Customer)", 14, 60);

    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(h.customerName || "N/A", 14, 67);
    
    // Summary Box
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, 80, 182, 30, 2, 2, 'F');
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text(`Total Amount Received:`, 20, 95);
    doc.setFontSize(18);
    doc.setTextColor(26, 46, 40);
    doc.text(`${currency} ${(h.receiptAmount || 0).toLocaleString()}`, 100, 95);

    // Allocations (if any)
    if (items.length > 0) {
        doc.setFontSize(11);
        doc.setTextColor(15, 23, 42);
        doc.text("Invoice Allocations", 14, 125);

        autoTable(doc, {
            startY: 130,
            head: [['#', 'Invoice Ref', 'Invoiced Amt', 'Allocated Amt', 'Balance']],
            body: items.map((it: any, idx: number) => [
                idx + 1,
                it.taxInvoiceRefNo,
                `${currency} ${(it.actualInvoiceAmount || 0).toLocaleString()}`,
                `${currency} ${(it.receiptInvoiceAdjustAmount || 0).toLocaleString()}`,
                `${currency} ${(it.outstandingInvoiceAmount || 0).toLocaleString()}`
            ]),
            styles: { fontSize: 8 },
            headStyles: { fillColor: [26, 46, 40] }
        });
    }

    doc.save(`Receipt_${h.receiptRefNo || "Export"}.pdf`);
    toast.success("Payment receipt generated successfully", { id: "cr-pdf" });
  };

  return <MasterCrudPage
    domain="customer-receipts"
    title="Customer Receipts"
    description="Record and track inbound payments from customers for settled deliveries."
    idPrefix="CR"
    onPrint={handlePrintReceipt}
    customStoreOverrides={{
      data: receipts.map((n: any) => ({
        ...n,
        id: n.receiptRefNo || n.SNO,
        formattedDate: n.receiptDate ? new Date(n.receiptDate).toLocaleDateString() : "-",
        formattedAmount: `TZS ${(n.receiptAmount || 0).toLocaleString()}`,
      })),
      add: async () => {}, // Handled by separate page
      update: async () => {}, // Handled by separate page
      remove: deleteReceipt,
      isLoading: isLoading
    }}
    columns={[
      { key: "receiptRefNo", label: "Receipt Ref" },
      { key: "formattedDate", label: "Date" },
      { key: "customerName", label: "Customer" },
      { key: "paymentModeName", label: "Payment Method" },
      { key: "transactionRefNo", label: "Txn Ref" },
      { key: "formattedAmount", label: "Amount" },
      { key: "status", label: "Status" },
    ]}
    fields={[]}
    initialData={[]}
    customAddUrl="/customer-receipts/create"
    customEditUrl={(id) => `/customer-receipts/create?id=${encodeURIComponent(id)}`}
  />;
}
