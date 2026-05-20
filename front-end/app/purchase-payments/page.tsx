"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { usePurchasePaymentStore } from "@/hooks/usePurchasePaymentStore";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";

type PaymentRow = {
  id?: string | number;
  SNO?: string | number;
  paymentRefNo?: string;
  paymentDate?: string;
  companyName?: string;
  supplierName?: string;
  paymentModeName?: string;
  currencyName?: string;
  paymentAmount?: number | string;
  paymentAmountLc?: number | string;
  status?: string;
};

type PaymentHeader = PaymentRow & {
  bankName?: string;
  exchangeRate?: number | string;
  paymentModeName?: string;
  remarks?: string;
  supplierId?: string | number;
  transactionRefNo?: string;
};

type PaymentAllocation = {
  actualInvoiceAmount?: number | string;
  outstandingInvoiceAmount?: number | string;
  paymentInvoiceAdjustAmount?: number | string;
  purchaseInvoiceRefNo?: string;
};

type PurchasePaymentDetails = {
  header?: PaymentHeader;
  items?: PaymentAllocation[];
};

type AutoTableDocument = jsPDF & {
  lastAutoTable?: {
    finalY?: number;
  };
};

export default function PurchasePaymentsPage() {
  const { payments, deletePayment, getPaymentById, isLoading } = usePurchasePaymentStore();

  const handlePrintPayment = async (payment: PaymentRow) => {
    toast.loading("Generating Purchase Payment PDF...", { id: "pp-pdf" });
    
    try {
      const paymentId = String(payment.paymentRefNo || payment.id || payment.SNO || "");
      const fullPayment = await getPaymentById(paymentId) as PurchasePaymentDetails | null;
      
      if (!fullPayment) {
        toast.error("Failed to load payment details", { id: "pp-pdf" });
        return;
      }

      const h = fullPayment.header || {};
      const items = fullPayment.items || [];
      const doc = new jsPDF();
      const currency = h.currencyName || "TZS";
      
      const formatDate = (dateStr: unknown) => {
        if (!dateStr) return "N/A";
        const d = new Date(String(dateStr));
        return isNaN(d.getTime()) ? "N/A" : d.toLocaleDateString("en-GB", { 
          day: '2-digit', month: 'short', year: 'numeric' 
        });
      };

      const safeText = (value: unknown, fallback = "N/A") => {
        const text = value === null || value === undefined ? "" : String(value).trim();
        return text || fallback;
      };

      const safeFilePart = (value: unknown) =>
        safeText(value, "Export").replace(/[<>:"/\\|?*\x00-\x1F]/g, "_").replace(/\s+/g, "_");

      const drawTextInWidth = (
        text: string,
        x: number,
        y: number,
        maxWidth: number,
        options?: Parameters<typeof doc.text>[3],
      ) => {
        const lines = doc.splitTextToSize(text, maxWidth).slice(0, 2);
        if (lines.length === 2 && doc.getTextWidth(lines[1]) > maxWidth) {
          while (lines[1].length > 0 && doc.getTextWidth(`${lines[1]}...`) > maxWidth) {
            lines[1] = lines[1].slice(0, -1);
          }
          lines[1] = `${lines[1]}...`;
        }
        doc.text(lines, x, y, options);
      };

      const loadLogoDataUrl = async () => {
        try {
          const logoImg = new Image();
          logoImg.crossOrigin = "anonymous";
          logoImg.src = "/assets/logo.png";
          await new Promise((resolve) => {
            logoImg.onload = resolve;
            logoImg.onerror = resolve;
          });

          if (!logoImg.naturalWidth || !logoImg.naturalHeight) return null;

          const maxCanvasWidth = 480;
          const scale = Math.min(1, maxCanvasWidth / logoImg.naturalWidth);
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(logoImg.naturalWidth * scale));
          canvas.height = Math.max(1, Math.round(logoImg.naturalHeight * scale));
          const ctx = canvas.getContext("2d");
          if (!ctx) return null;

          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(logoImg, 0, 0, canvas.width, canvas.height);

          return {
            dataUrl: canvas.toDataURL("image/jpeg", 0.86),
            width: canvas.width,
            height: canvas.height,
          };
        } catch (e) {
          console.warn("Logo failed to load", e);
          return null;
        }
      };

      const primaryColor: [number, number, number] = [26, 46, 40];
      const textColor: [number, number, number] = [15, 23, 42];
      const lightTextColor: [number, number, number] = [100, 116, 139];
      const borderColor: [number, number, number] = [226, 232, 240];
      const logo = await loadLogoDataUrl();

      // --- FORMAL BOXED HEADER ---
      const headerY = 10;
      const headerH = 45;
      const midPoint = 135;

      // Outer Border
      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setLineWidth(0.5);
      doc.rect(14, headerY, 182, headerH);

      // 1. Top Title Bar
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(14, headerY, 182, 10, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("PAYMENT VOUCHER", 105, headerY + 7, { align: "center" });

      // 2. Internal Dividers
      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setLineWidth(0.3);
      doc.line(midPoint, headerY + 10, midPoint, headerY + headerH); // Vertical middle line
      
      // 3. Logo & Company (Left Side)
      if (logo) {
        const imgWidth = 25;
        const imgHeight = Math.min(23, (logo.height * imgWidth) / logo.width);
        doc.addImage(logo.dataUrl, "JPEG", 18, headerY + 15, imgWidth, imgHeight, undefined, "FAST");
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      drawTextInWidth(safeText(h.companyName, "AGRO MANAGE SYSTEM"), 50, headerY + 19, 78);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
      doc.text("Professional Agricultural Solutions & Services", 50, 25 + headerY);
      doc.text("Email: accounts@agromanage.com", 50, 30 + headerY);
      doc.text("Web: www.agromanage.com", 50, 35 + headerY);

      // 4. Metadata (Right Side)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
      
      doc.text("VOUCHER NO", midPoint + 5, headerY + 18);
      doc.text("DATE", midPoint + 5, headerY + 28);
      doc.text("METHOD", midPoint + 5, headerY + 38);

      doc.setFontSize(10);
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.text(safeText(h.paymentRefNo || h.id), 192, headerY + 18, { align: "right" });
      doc.text(formatDate(h.paymentDate), 192, headerY + 28, { align: "right" });
      drawTextInWidth(safeText(h.paymentModeName, "Direct"), 192, headerY + 38, 42, { align: "right" });

      // --- Parties Info (Below Header Box) ---
      // Paid To Box
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(14, headerY + headerH + 5, 182, 22, 2, 2, 'F');
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text("PAID TO (SUPPLIER)", 20, headerY + headerH + 11);
      
      doc.setFontSize(12);
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      drawTextInWidth(safeText(h.supplierName), 20, headerY + headerH + 18, 118);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
      doc.text("Supplier ID: " + safeText(h.supplierId), 190, headerY + headerH + 18, { align: "right" });

      // Adjust the start of the next section
      const summaryStartY = headerY + headerH + 35;

      // --- Payment Details Section ---
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text("PAYMENT SUMMARY", 14, summaryStartY);

      autoTable(doc, {
        startY: summaryStartY + 5,
        head: [["Description", "Details"]],
        body: [
          ["Bank/Cash Account", h.bankName || "Main Account"],
          ["Transaction Reference", h.transactionRefNo || "N/A"],
          ["Currency", currency],
          ["Exchange Rate", h.exchangeRate?.toString() || "1.00"],
          ["Internal Remarks", h.remarks || "No remarks provided."]
        ],
        theme: 'grid',
        headStyles: { fillColor: primaryColor, fontSize: 10 },
        bodyStyles: { fontSize: 9, cellPadding: 3 },
        margin: { bottom: 55 },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } }
      });

      // --- Amount Box ---
      const finalY = (doc as AutoTableDocument).lastAutoTable?.finalY || 120;
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.roundedRect(14, finalY + 10, 182, 20, 2, 2, 'F');
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.text("TOTAL AMOUNT PAID", 20, finalY + 22);
      
      doc.setFontSize(16);
      const displayAmount = Number(h.paymentAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 });
      doc.text(`${currency} ${displayAmount}`, 190, finalY + 22, { align: "right" });

      // --- Allocations Table ---
      if (items.length > 0) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text("INVOICE ALLOCATIONS", 14, finalY + 40);

        autoTable(doc, {
          startY: finalY + 45,
          head: [['#', 'Invoice Reference', 'Invoice Amt', 'Allocated Amt', 'Balance']],
          body: items.map((it, idx) => [
            idx + 1,
            it.purchaseInvoiceRefNo || "N/A",
            `${currency} ${Number(it.actualInvoiceAmount || 0).toLocaleString()}`,
            `${currency} ${Number(it.paymentInvoiceAdjustAmount || 0).toLocaleString()}`,
            `${currency} ${Number(it.outstandingInvoiceAmount || 0).toLocaleString()}`
          ]),
          theme: 'striped',
          headStyles: { fillColor: primaryColor, fontSize: 9 },
          bodyStyles: { fontSize: 8, cellPadding: 4 },
          margin: { bottom: 55 },
          columnStyles: {
            2: { halign: 'right' },
            3: { halign: 'right' },
            4: { halign: 'right' }
          }
        });
      }

      // --- Signature Section ---
      const pageHeight = doc.internal.pageSize.height;
      const sigY = pageHeight - 40;

      doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
      doc.setLineWidth(0.2);
      
      // Line 1
      doc.line(14, sigY, 65, sigY);
      doc.text("Prepared By", 14, sigY + 5);

      // Line 2
      doc.line(78, sigY, 129, sigY);
      doc.text("Approved By", 78, sigY + 5);

      // Line 3
      doc.line(142, sigY, 193, sigY);
      doc.text("Receiver's Signature", 142, sigY + 5);

      // Footer Text
      doc.setFontSize(8);
      doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
      doc.text("This is a computer generated document. No signature is required unless specified.", 14, pageHeight - 15);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 196, pageHeight - 15, { align: "right" });

      doc.save(`Payment_Voucher_${safeFilePart(h.paymentRefNo)}.pdf`);
      toast.success("Payment voucher generated successfully", { id: "pp-pdf" });
    } catch (error: unknown) {
      console.error("PDF Generation Error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast.error("Failed to generate PDF: " + errorMessage, { id: "pp-pdf" });
    }
  };

  return <MasterCrudPage
    domain="purchase-payments"
    title="Purchase Payments"
    description="Manage outbound payments to suppliers and reconcile purchase invoices."
    idPrefix="PP"
    onPrint={handlePrintPayment}
    customStoreOverrides={{
      data: ((payments || []) as PaymentRow[]).map((n) => ({
        ...n,
        id: n.paymentRefNo || n.SNO,
        formattedDate: n.paymentDate ? new Date(n.paymentDate).toLocaleDateString() : "-",
        formattedAmount: `${n.currencyName || "TZS"} ${Number(n.paymentAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
        formattedAmountLc: `TZS ${Number(n.paymentAmountLc || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      })),
      add: async () => {}, // Handled by separate page
      update: async () => {}, // Handled by separate page
      remove: deletePayment,
      isLoading: isLoading
    }}
    columns={[
      { key: "paymentRefNo", label: "Payment Ref" },
      { key: "formattedDate", label: "Date" },
      { key: "companyName", label: "Company" },
      { key: "supplierName", label: "Supplier" },
      { key: "paymentModeName", label: "Method" },
      { key: "currencyName", label: "Cur" },
      { key: "formattedAmount", label: "Amount" },
      { key: "status", label: "Status" },
    ]}
    fields={[]}
    initialData={[]}
    customAddUrl="/purchase-payments/create"
    customEditUrl={(id) => `/purchase-payments/create?id=${encodeURIComponent(id)}`}
  />;
}
