"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface InvoiceData {
  type: "Sales Invoice" | "Purchase Invoice" | "Goods Receipt Note" | "Delivery Note";
  refNo: string;
  date: string;
  company: { name: string; address: string; tin: string };
  party: { name: string; address: string; tin: string };
  items: { product: string; qty: number; rate: number; amount: number; vat: number }[];
  subtotal: number;
  vatAmount: number;
  total: number;
  currency: string;
  remarks?: string;
}

interface Props {
  data: InvoiceData;
}

export default function InvoiceTemplate({ data }: Props) {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    if (!invoiceRef.current) return;
    const canvas = await html2canvas(invoiceRef.current, { scale: 2, backgroundColor: "#ffffff" });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${data.type.replace(/\s+/g, "_")}_${data.refNo}.pdf`);
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={downloadPDF} variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" /> Download PDF
        </Button>
      </div>

      <div ref={invoiceRef} className="bg-white p-8 max-w-3xl mx-auto border rounded-lg" style={{ color: "#1a1a1a", fontFamily: "DM Sans, sans-serif" }}>
        {/* Header */}
        <div className="flex justify-between items-start mb-6 pb-4" style={{ borderBottom: "3px solid #224432" }}>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "#224432" }}>{data.company.name}</h1>
            <p className="text-sm" style={{ color: "#666" }}>{data.company.address}</p>
            <p className="text-sm" style={{ color: "#666" }}>TIN: {data.company.tin}</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold" style={{ color: "#c8922a" }}>{data.type.toUpperCase()}</h2>
            <p className="text-sm font-mono font-bold">{data.refNo}</p>
            <p className="text-sm" style={{ color: "#666" }}>Date: {data.date}</p>
          </div>
        </div>

        {/* Party Info */}
        <div className="mb-6 p-4 rounded" style={{ backgroundColor: "#f8f6f1" }}>
          <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#888" }}>
            {data.type.includes("Purchase") || data.type === "Goods Receipt Note" ? "Supplier" : "Customer"}
          </p>
          <p className="font-bold text-lg">{data.party.name}</p>
          <p className="text-sm">{data.party.address}</p>
          <p className="text-sm">TIN: {data.party.tin}</p>
        </div>

        {/* Items Table */}
        <table className="w-full mb-6" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#224432", color: "#fff" }}>
              <th className="p-2 text-left text-xs">#</th>
              <th className="p-2 text-left text-xs">Product</th>
              <th className="p-2 text-right text-xs">Qty</th>
              <th className="p-2 text-right text-xs">Rate</th>
              <th className="p-2 text-right text-xs">Amount</th>
              <th className="p-2 text-right text-xs">VAT %</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #e5e5e5" }}>
                <td className="p-2 text-sm">{i + 1}</td>
                <td className="p-2 text-sm font-medium">{item.product}</td>
                <td className="p-2 text-sm text-right">{item.qty.toLocaleString()}</td>
                <td className="p-2 text-sm text-right">{item.rate.toLocaleString()}</td>
                <td className="p-2 text-sm text-right font-medium">{item.amount.toLocaleString()}</td>
                <td className="p-2 text-sm text-right">{item.vat}%</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mb-6">
          <div className="w-64">
            <div className="flex justify-between py-1 text-sm">
              <span>Subtotal:</span>
              <span className="font-medium">{data.currency} {data.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1 text-sm">
              <span>VAT:</span>
              <span className="font-medium">{data.currency} {data.vatAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 text-lg font-bold" style={{ borderTop: "2px solid #224432" }}>
              <span>Total:</span>
              <span style={{ color: "#224432" }}>{data.currency} {data.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Remarks */}
        {data.remarks && (
          <div className="mb-6 p-3 rounded" style={{ backgroundColor: "#fffbe6", border: "1px solid #e5d9a0" }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#888" }}>Remarks</p>
            <p className="text-sm">{data.remarks}</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between pt-4" style={{ borderTop: "1px solid #e5e5e5" }}>
          <div>
            <p className="text-xs" style={{ color: "#888" }}>Authorized Signature</p>
            <div className="mt-6" style={{ borderBottom: "1px solid #333", width: "150px" }}></div>
          </div>
          <div className="text-right">
            <p className="text-xs" style={{ color: "#888" }}>Received By</p>
            <div className="mt-6" style={{ borderBottom: "1px solid #333", width: "150px" }}></div>
          </div>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "#aaa" }}>
          This is a computer-generated document. No signature is required.
        </p>
      </div>
    </div>
  );
}
