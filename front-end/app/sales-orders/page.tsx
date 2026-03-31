"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useSalesOrderStore } from "@/hooks/useSalesOrderStore";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";

export default function SalesOrdersPage() {
  const { orders, isLoading, addOrder, updateOrder, deleteOrder, getOrderById } = useSalesOrderStore();

  const handleExportPDF = async (order: any) => {
    toast.loading("Generating Sales Order PDF...", { id: "so-pdf" });
    const fullOrder = await getOrderById(order.salesOrderRefNo || order.id);
    
    if (!fullOrder) {
      toast.error("Failed to load order details", { id: "so-pdf" });
      return;
    }

    const h = fullOrder.header;
    const items = fullOrder.items || [];
    const doc = new jsPDF();
    const currency = "TZS";

    // Header & Logo — Logo LEFT, Title RIGHT
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

    // SALES ORDER title on the right
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42);
    doc.text("SALES ORDER", 196, 22, { align: "right" });

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Reference: ${h.salesOrderRefNo || order.id}`, 196, 30, { align: "right" });
    doc.text(`Date: ${h.salesOrderDate ? new Date(h.salesOrderDate).toLocaleDateString() : "N/A"}`, 196, 35, { align: "right" });
    doc.text(`Status: ${h.status || "Draft"}`, 196, 40, { align: "right" });

    // Customer Info
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text("Customer Details", 14, 55);
    doc.text("From Store", 120, 55);

    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(h.customerName || "N/A", 14, 62);
    doc.text(h.storeName || "Main Warehouse", 120, 62);

    // Item Table
    if (items.length > 0) {
      autoTable(doc, {
        startY: 85,
        head: [['#', 'Product', 'Qty', 'UOM', 'Rate', 'Amount']],
        body: items.map((item: any, index: number) => [
          index + 1,
          item.productName || "—",
          item.totalQty || 0,
          item.uom || "Unit",
          `${currency} ${(item.rate || 0).toLocaleString()}`,
          `${currency} ${(item.amount || 0).toLocaleString()}`
        ]),
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: { fillColor: [26, 46, 40], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [248, 250, 252] },
      });
    }

    // Summary Section
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

    doc.save(`${h.salesOrderRefNo || "Sales_Order"}.pdf`);
    toast.success("PDF generated successfully", { id: "so-pdf" });
  };

  return <MasterCrudPage
    domain="sales-orders"
    title="Sales Orders"
    description="Manage your sales orders"
    idPrefix="SO"
    onPrint={handleExportPDF}
    customStoreOverrides={{
      data: orders.map((o: any, idx: number) => {
        const currency = "TZS";
        return {
          ...o,
          id: o.salesOrderRefNo || o.id || `so-${idx}`,
          formattedDate: o.salesOrderDate ? new Date(o.salesOrderDate).toLocaleDateString() : "-",
          formattedAmount: `${currency} ${(o.totalProductAmount || 0).toLocaleString()}`,
          formattedTotal: `${currency} ${(o.finalSalesAmount || 0).toLocaleString()}`,
        };
      }),
      add: addOrder,
      update: (item: any) => updateOrder(item.id, item),
      remove: deleteOrder,
      isLoading
    }}
    fields={[
      { key: "salesOrderRefNo", label: "SO Ref", type: "text", required: true },
      { key: "salesOrderDate", label: "Date", type: "date", required: true },
      { key: "customerName", label: "Customer", type: "text", required: true },
      { key: "storeName", label: "Store", type: "text" },
      { key: "status", label: "Status", type: "select", required: true, options: ["Draft", "Pending", "Confirmed"] },
    ]}
    initialData={[]}
    columns={[
      { key: "salesOrderRefNo", label: "SO Ref" },
      { key: "formattedDate", label: "Date" },
      { key: "customerName", label: "Customer" },
      { key: "storeName", label: "Store" },
      { key: "formattedAmount", label: "Amount" },
      { key: "formattedTotal", label: "Total" },
      { key: "status", label: "Status" },
    ]}
    customAddUrl="/sales-orders/create"
    customEditUrl={(id) => `/sales-orders/create?id=${encodeURIComponent(id)}`}
  />;
}
