"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useDeliveryNoteStore } from "@/hooks/useDeliveryNoteStore";
import { useSalesOrderStore } from "@/hooks/useSalesOrderStore";
import { useCompanies, useStores, useCustomers } from "@/hooks/useStoreData";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";

export default function DeliveryNotesPage() {
  const { notes, addNote, updateNote, deleteNote, getNoteById, isLoading } = useDeliveryNoteStore();

  const handleExportPDF = async (note: any) => {
    toast.loading("Generating Delivery Note PDF...", { id: "dn-pdf" });
    const fullNote = await getNoteById(note.deliveryNoteRefNo || note.id);
    
    if (!fullNote) {
      toast.error("Failed to load delivery note details", { id: "dn-pdf" });
      return;
    }

    const h = fullNote.header;
    const items = fullNote.items || [];
    const doc = new jsPDF();
    const currency = "TZS";

    // Header & Logo with Canvas for reliability
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42); 
    doc.text("DELIVERY NOTE", 14, 22);

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
    doc.text(`Reference: ${h.deliveryNoteRefNo || h.id}`, 14, 30);
    doc.text(`Date: ${h.deliveryDate ? new Date(h.deliveryDate).toLocaleDateString() : "N/A"}`, 14, 35);
    doc.text(`SO Ref: ${h.deliverySourceRefNo || "General"}`, 14, 40);
    doc.text(`Status: ${h.status || "Pending"}`, 14, 45);

    // Logistics & Customer Info
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text("Customer Details", 14, 60);
    doc.text("Dispatch Details", 120, 60);

    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(h.customerName || "N/A", 14, 67);
    doc.text(`From: ${h.fromStoreName || "Main Store"}`, 120, 67);
    
    if (h.truckNo) doc.text(`Truck: ${h.truckNo} / ${h.trailerNo || ""}`, 120, 72);
    if (h.driverName) doc.text(`Driver: ${h.driverName}`, 120, 77);
    if (h.sealNo) doc.text(`Seal No: ${h.sealNo}`, 120, 82);

    // Item Table
    autoTable(doc, {
      startY: 95,
      head: [['#', 'Product', 'Quantity', 'UOM', 'Rate', 'Amount']],
      body: items.map((item: any, index: number) => [
        index + 1,
        item.productName || "—",
        item.deliveryQty || 0,
        item.uom || "Unit",
        `${currency} ${(item.rate || 0).toLocaleString()}`,
        `${currency} ${(item.amount || 0).toLocaleString()}`
      ]),
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [26, 46, 40], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });

    const finalY = ((doc as any).lastAutoTable?.finalY || 100) + 15;
    
    // Summary
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text(`Total Amount: ${currency} ${(h.finalSalesAmount || 0).toLocaleString()}`, 190, finalY, { align: 'right' });

    // Verification Section
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text("Received By (Customer):", 14, finalY + 15);
    doc.text("________________________", 14, finalY + 25);
    
    doc.text("Driver Confirmation:", 120, finalY + 15);
    doc.text("________________________", 120, finalY + 25);

    doc.save(`${h.deliveryNoteRefNo || "Delivery_Note"}.pdf`);
    toast.success("Delivery Note PDF generated successfully", { id: "dn-pdf" });
  };

  return <MasterCrudPage
    domain="delivery-notes"
    title="Delivery Notes"
    description="Manage and track dispatch of goods against Sales Orders."
    idPrefix="DN"
    onPrint={handleExportPDF}
    customStoreOverrides={{
      data: notes.map((n: any) => ({
        ...n,
        id: n.deliveryNoteRefNo || n.id
      })),
      add: addNote,
      update: (item: any) => updateNote(item.deliveryNoteRefNo || item.id, item),
      remove: deleteNote,
      isLoading: isLoading
    }}
    columns={[
      { key: "deliveryNoteRefNo", label: "DN Ref" },
      { key: "deliveryDate", label: "Date" },
      { key: "deliverySourceRefNo", label: "SO Ref" },
      { key: "customerName", label: "Customer" },
      { key: "fromStoreName", label: "Dispatch From" },
      { key: "truckNo", label: "Truck" },
      { key: "driverName", label: "Driver" },
      { key: "finalSalesAmount", label: "Total Value" },
      { key: "status", label: "Status" },
    ]}
    fields={[]}
    initialData={[]}
    customAddUrl="/delivery-notes/create"
    customEditUrl={(id) => `/delivery-notes/create?id=${id}`}
  />;
}
