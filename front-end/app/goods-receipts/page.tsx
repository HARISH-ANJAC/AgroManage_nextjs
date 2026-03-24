"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData";
import { useGoodsReceiptStore } from "@/hooks/useGoodsReceiptStore";
import { usePurchaseOrderStore } from "@/hooks/usePurchaseOrderStore";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";

export default function GoodsReceiptsPage() {
  const { data: companies } = useMasterData("companies");
  const { data: stores } = useMasterData("stores");
  const { data: suppliers } = useMasterData("suppliers");
  const { orders: pos } = usePurchaseOrderStore();
  const { grns, addGRN, updateGRN, deleteGRN } = useGoodsReceiptStore();

  const handleExportPDF = (grn: any) => {
    const h = grn.header || grn;
    const items = grn.items || [];
    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42); 
    doc.text("GOODS RECEIPT NOTE", 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); 
    doc.text(`Reference: ${h.grnRefNo || h.id}`, 14, 30);
    doc.text(`Date: ${h.grnDate || "N/A"}`, 14, 35);
    doc.text(`PO Ref: ${h.poRefNo || "General"}`, 14, 40);
    doc.text(`Status: ${h.status || "Received"}`, 14, 45);

    // Logistics Info
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text("Supplier / Source", 14, 60);
    doc.text("Receiving Store", 120, 60);

    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(h.supplierName || "N/A", 14, 67);
    doc.text(h.grnStoreName || "Main Warehouse", 120, 67);
    
    if (h.vehicleNo) doc.text(`Vehicle: ${h.vehicleNo}`, 14, 72);
    if (h.driverName) doc.text(`Driver: ${h.driverName}`, 14, 77);

    // Item Table
    autoTable(doc, {
      startY: 90,
      head: [['#', 'Product', 'PO Qty', 'Received Qty', 'UOM', 'Shortage']],
      body: items.map((item: any, index: number) => [
        index + 1,
        item.productName || item.product,
        item.poQty || 0,
        item.recvQty || 0,
        item.uom || "Unit",
        (item.poQty || 0) - (item.recvQty || 0)
      ]),
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [26, 46, 40], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 15;
    
    // Verification Section
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text("Verified By:", 14, finalY);
    doc.text("__________________", 14, finalY + 10);
    
    doc.text("Store Manager Signature:", 120, finalY);
    doc.text("__________________", 120, finalY + 10);

    doc.save(`${h.grnRefNo || "GRN_Note"}.pdf`);
    toast.success("GRN PDF generated successfully");
  };

  return <MasterCrudPage
    domain="goods-receipts"
    title="Goods Receipt Notes (GRN)"
    description="Record incoming goods — must select existing PO. Qty ≤ PO Qty."
    idPrefix="GRN"
    onPrint={handleExportPDF}
    customAddUrl="/goods-receipts/create"
    customEditUrl={(id) => `/goods-receipts/create?id=${id}`}
    customStoreOverrides={{
      data: grns.map((g: any) => ({
        ...g,
        supplierName: g.header?.supplierName || g.supplierName || suppliers.find((s: any) => s.id === g.supplierId)?.supplierName || "-",
        grnStoreName: stores.find((s: any) => s.id === (g.header?.grnStoreId || g.grnStoreId))?.storeName || "-",
        itemsCount: g.items?.length || 0
      })),
      add: addGRN,
      update: (item: any) => updateGRN(item.id, item),
      remove: deleteGRN
    }}
    fields={[
      { key: "grnRefNo", label: "GRN Ref No", type: "text", required: true },
      { key: "grnDate", label: "GRN Date", type: "date", required: true },
      {
        key: "companyId",
        label: "Company",
        type: "select",
        options: companies.map((c: any) => ({ label: c.companyName, value: c.id }))
      },
      {
        key: "grnStoreId",
        label: "GRN Store",
        type: "select",
        options: stores.map((s: any) => ({ label: s.storeName, value: s.id }))
      },
      {
        key: "supplierId",
        label: "Supplier",
        type: "select",
        options: suppliers.map((s: any) => ({ label: s.supplierName, value: s.id }))
      },
      {
        key: "poRefNo",
        label: "PO Reference",
        type: "select",
        options: pos.map((p: any) => {
          const refNo = p.header?.poRefNo || p.poRefNo;
          return { label: refNo, value: refNo };
        })
      },
      { key: "grnSource", label: "GRN Source", type: "select", options: ["Purchase Order", "Stock Transfer"] },
      { key: "deliveryNoteRefNo", label: "Delivery Note Ref", type: "text" },
      { key: "driverName", label: "Driver Name", type: "text" },
      { key: "vehicleNo", label: "Vehicle No", type: "text" },
      { key: "status", label: "Status", type: "select", required: true, options: ["Received", "Pending"] },
    ]}
    initialData={[]}
    columns={[
      { key: "grnRefNo", label: "GRN Ref" },
      { key: "grnDate", label: "Date" },
      { key: "poRefNo", label: "PO Ref" },
      { key: "supplierName", label: "Supplier" },
      { key: "grnStoreName", label: "Store" },
      { key: "itemsCount", label: "Items" },
      { key: "vehicleNo", label: "Vehicle" },
      { key: "status", label: "Status" },
    ]}
  />;
}
