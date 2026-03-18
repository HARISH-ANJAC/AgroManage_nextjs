"use client";

import MasterCrudPage from "@/components/MasterCrudPage";

export default function GoodsReceiptsPage() {
  return <MasterCrudPage
    domain="goods-receipts" title="Goods Receipts (GRN)" description="Manage your goods receipts" idPrefix="GRN" fields={[
    { key: "grnRefNo", label: "GRN Ref No", type: "text", required: true },
    { key: "grnDate", label: "GRN Date", type: "date", required: true },
    { key: "company", label: "Company", type: "text" },
    { key: "sourceStore", label: "Source Store", type: "text" },
    { key: "grnStore", label: "GRN Store", type: "text" },
    { key: "grnSource", label: "GRN Source", type: "select", options: ["Purchase Order", "Stock Transfer"] },
    { key: "deliveryNoteRefNo", label: "Delivery Note Ref", type: "text" },
    { key: "supplier", label: "Supplier", type: "text" },
    { key: "poRefNo", label: "PO Reference", type: "text", required: true },
    { key: "purchaseInvoiceRefNo", label: "Purchase Invoice Ref", type: "text" },
    { key: "supplierInvoiceNumber", label: "Supplier Invoice No", type: "text" },
    { key: "containerNo", label: "Container No", type: "text" },
    { key: "driverName", label: "Driver Name", type: "text" },
    { key: "driverContactNumber", label: "Driver Contact", type: "text" },
    { key: "vehicleNo", label: "Vehicle No", type: "text" },
    { key: "sealNo", label: "Seal No", type: "text" },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "status", label: "Status", type: "select", required: true, options: ["Received", "Pending", "Rejected"] },
  ]} initialData={[
    { id: "GRN001", grnRefNo: "GRN/03/001", grnDate: "2024-02-10", company: "AgroTanzania Ltd", sourceStore: "", grnStore: "Dar es Salaam Main Warehouse", grnSource: "Purchase Order", deliveryNoteRefNo: "", supplier: "Kilimo Bora Suppliers", poRefNo: "PO/MA/02/001", purchaseInvoiceRefNo: "", supplierInvoiceNumber: "SUP-INV-001", containerNo: "", driverName: "Juma Ali", driverContactNumber: "+255 789 111222", vehicleNo: "T 123 ABC", sealNo: "SEAL-001", remarks: "", status: "Received" },
  ]} columns={[
    { key: "grnRefNo", label: "GRN No" }, { key: "grnDate", label: "Date" }, { key: "poRefNo", label: "PO Ref" }, { key: "supplier", label: "Supplier" }, { key: "vehicleNo", label: "Vehicle" }, { key: "status", label: "Status" },
  ]} />;
}

