"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useSalesOrderStore } from "@/hooks/useSalesOrderStore";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";

export default function SalesOrdersPage() {
  const { orders, addOrder, updateOrder, deleteOrder } = useSalesOrderStore();

  const handleExportPDF = (order: any) => {
    const h = order.header || order;
    const items = order.items || [];
    const doc = new jsPDF();
    const currency = h.currencyId || h.currency || "TZS";

    // Header
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42); 
    doc.text("SALES ORDER", 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); 
    doc.text(`Reference: ${h.salesOrderRefNo || h.id}`, 14, 30);
    doc.text(`Date: ${h.salesOrderDate || "N/A"}`, 14, 35);
    doc.text(`Status: ${h.status || "Draft"}`, 14, 40);

    // Customer Info
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text("Customer Details", 14, 55);
    doc.text("From Store", 120, 55);

    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(h.customer || "N/A", 14, 62);
    doc.text(h.storeId || h.store || "Main Warehouse", 120, 62);
    
    if (h.salesType) doc.text(`Type: ${h.salesType}`, 14, 67);

    // Item Table
    autoTable(doc, {
      startY: 85,
      head: [['#', 'Product', 'Qty', 'UOM', 'Rate', 'Amount']],
      body: items.map((item: any, index: number) => [
        index + 1,
        item.product || item.productName,
        item.qty || item.quantity,
        item.uom || "Unit",
        `${currency} ${(item.rate || 0).toLocaleString()}`,
        `${currency} ${(item.amount || 0).toLocaleString()}`
      ]),
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [26, 46, 40], textColor: [255, 255, 255] },
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
    doc.text(`${currency} ${(h.productAmount || h.totalProductAmount || 0).toLocaleString()}`, 190, finalY, { align: 'right' });
    doc.text(`${currency} ${(h.totalVatAmount || h.vatAmount || 0).toLocaleString()}`, 190, finalY + 7, { align: 'right' });
    
    doc.setFontSize(14);
    doc.text(`${currency} ${(h.finalAmount || h.finalSalesAmount || 0).toLocaleString()}`, 190, finalY + 16, { align: 'right' });

    doc.save(`${h.salesOrderRefNo || "Sales_Order"}.pdf`);
    toast.success("PDF generated successfully");
  };

  return <MasterCrudPage
    domain="sales-orders" 
    title="Sales Orders" 
    description="Manage your sales orders" 
    idPrefix="SO" 
    onPrint={handleExportPDF}
    customStoreOverrides={{
      data: orders.map((o: any) => {
        const currency = o.header?.currencyId || o.currency || "TZS";
        const itemsList = o.items || [];
        return {
          ...o,
          storeName: o.header?.storeId || o.store || "-",
          itemsCount: `${itemsList.length} Items`,
          formattedAmount: `${currency} ${(o.header?.productAmount || o.totalProductAmount || 0).toLocaleString()}`,
          formattedTotal: `${currency} ${(o.header?.finalAmount || o.finalSalesAmount || 0).toLocaleString()}`,
        };
      }),
      add: addOrder,
      update: (item: any) => updateOrder(item.id, item),
      remove: deleteOrder
    }}
    fields={[
      { key: "salesOrderRefNo", label: "SO Ref", type: "text", required: true },
      { key: "salesOrderDate", label: "Date", type: "date", required: true },
      { key: "customer", label: "Customer", type: "text", required: true },
      { key: "storeName", label: "Store", type: "text" },
      { key: "status", label: "Status", type: "select", required: true, options: ["Draft", "Pending", "Confirmed"] },
    ]} 
    initialData={[]} 
    columns={[
      { key: "salesOrderRefNo", label: "SO Ref" }, 
      { key: "salesOrderDate", label: "Date" }, 
      { key: "customer", label: "Customer" }, 
      { key: "storeName", label: "Store" }, 
      { key: "itemsCount", label: "Items" }, 
      { key: "formattedAmount", label: "Amount" }, 
      { key: "formattedTotal", label: "Total" }, 
      { key: "status", label: "Status" },
    ]} 
    customAddUrl="/sales-orders/create"
    customEditUrl={(id) => `/sales-orders/create?id=${id}`}
  />;
}
