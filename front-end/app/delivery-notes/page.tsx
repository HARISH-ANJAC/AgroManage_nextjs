"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useDeliveryNoteStore } from "@/hooks/useDeliveryNoteStore";
import { useSalesOrderStore } from "@/hooks/useSalesOrderStore";
import { useCompanies, useStores, useCustomers } from "@/hooks/useStoreData";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";

export default function DeliveryNotesPage() {
  const { notes, addNote, updateNote, deleteNote } = useDeliveryNoteStore();
  const { orders: salesOrders } = useSalesOrderStore();
  const { data: companies } = useCompanies();
  const { data: stores } = useStores();
  const { data: customers } = useCustomers();

  const handleExportPDF = (note: any) => {
    const h = note.header || note;
    const items = note.items || [];
    const doc = new jsPDF();
    const currency = h.currency || "TZS";

    // Header
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42); 
    doc.text("DELIVERY NOTE", 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); 
    doc.text(`Reference: ${h.deliveryNoteRefNo || h.id}`, 14, 30);
    doc.text(`Date: ${h.deliveryDate || "N/A"}`, 14, 35);
    doc.text(`SO Ref: ${h.deliverySourceRefNo || "General"}`, 14, 40);
    doc.text(`Status: ${h.status || "Pending"}`, 14, 45);

    // Logistics & Customer Info
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text("Customer Details", 14, 60);
    doc.text("Dispatch Details", 120, 60);

    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(h.customer || "N/A", 14, 67);
    doc.text(`From: ${h.fromStore || "Main Store"}`, 120, 67);
    
    if (h.truckNo) doc.text(`Truck: ${h.truckNo} / ${h.trailerNo || ""}`, 120, 72);
    if (h.driverName) doc.text(`Driver: ${h.driverName}`, 120, 77);
    if (h.sealNo) doc.text(`Seal No: ${h.sealNo}`, 120, 82);

    // Item Table
    autoTable(doc, {
      startY: 95,
      head: [['#', 'Product', 'Quantity', 'UOM', 'Rate', 'Amount']],
      body: items.map((item: any, index: number) => [
        index + 1,
        item.productName || item.product,
        item.deliveryQty || item.qty || 0,
        item.uom || "Unit",
        `${currency} ${(item.rate || 0).toLocaleString()}`,
        `${currency} ${(item.amount || 0).toLocaleString()}`
      ]),
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [26, 46, 40], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 15;
    
    // Summary
    doc.setFontSize(10);
    doc.text(`Total Amount: ${currency} ${(h.finalSalesAmount || 0).toLocaleString()}`, 190, finalY, { align: 'right' });

    // Verification Section
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text("Received By (Customer):", 14, finalY + 15);
    doc.text("________________________", 14, finalY + 25);
    
    doc.text("Driver Confirmation:", 120, finalY + 15);
    doc.text("________________________", 120, finalY + 25);

    doc.save(`${h.deliveryNoteRefNo || "Delivery_Note"}.pdf`);
    toast.success("Delivery Note PDF generated successfully");
  };

  return <MasterCrudPage
    domain="delivery-notes"
    title="Delivery Notes"
    description="Create from Sales Order. Delivery Qty ≤ SO Qty."
    idPrefix="DN"
    onPrint={handleExportPDF}
    customStoreOverrides={{
      data: notes,
      add: addNote,
      update: (item: any) => updateNote(item.id, item),
      remove: deleteNote
    }}
    fields={[
      { key: "deliveryNoteRefNo", label: "Delivery Note Ref No", type: "text", required: true },
      { key: "deliveryDate", label: "Delivery Date", type: "date", required: true },
      {
        key: "company",
        label: "Company",
        type: "select",
        options: companies.map((c: any) => ({ label: c.companyName, value: c.companyName }))
      },
      {
        key: "fromStore",
        label: "From Store",
        type: "select",
        options: stores.map((s: any) => ({ label: s.storeName, value: s.storeName }))
      },
      { key: "deliverySourceType", label: "Delivery Source Type", type: "select", options: ["Sales Order", "Stock Transfer"] },
      {
        key: "deliverySourceRefNo",
        label: "Source Ref No (SO)",
        type: "select",
        options: salesOrders.map((so: any) => ({
          label: so.header?.salesOrderRefNo || so.salesOrderRefNo || so.id,
          value: so.header?.salesOrderRefNo || so.salesOrderRefNo || so.id
        }))
      },
      { key: "toStore", label: "To Store / Customer", type: "text" },
      {
        key: "customer",
        label: "Customer",
        type: "select",
        options: customers.map((c: any) => ({ label: c.customerName, value: c.customerName }))
      },
      { key: "truckNo", label: "Truck No", type: "text" },
      { key: "trailerNo", label: "Trailer No", type: "text" },
      { key: "driverName", label: "Driver Name", type: "text" },
      { key: "driverContactNumber", label: "Driver Contact", type: "text" },
      { key: "sealNo", label: "Seal No", type: "text" },
      { key: "currency", label: "Currency", type: "select", options: ["TZS", "USD", "EUR"] },
      { key: "totalProductAmount", label: "Total Product Amount", type: "number" },
      { key: "vatAmount", label: "VAT Amount", type: "number" },
      { key: "finalSalesAmount", label: "Final Amount", type: "number" },
      { key: "remarks", label: "Remarks", type: "textarea" },
      { key: "status", label: "Status", type: "select", required: true, options: ["Pending", "Dispatched", "Delivered"] },
    ]}
    initialData={[]}
    columns={[
      { key: "header.deliveryNoteRefNo", label: "DN Ref" },
      { key: "header.deliveryDate", label: "Date" },
      { key: "header.deliverySourceRefNo", label: "SO Ref" },
      { key: "header.customer", label: "Customer" },
      { key: "header.fromStore", label: "From Store" },
      { key: "header.truckNo", label: "Truck" },
      { key: "header.driverName", label: "Driver" },
      { key: "header.finalSalesAmount", label: "Total" },
      { key: "header.status", label: "Status" },
    ]}
    customAddUrl="/delivery-notes/create"
    customEditUrl={(id) => `/delivery-notes/create?id=${id}`}
  />;
}
