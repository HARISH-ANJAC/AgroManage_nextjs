"use client";

import MasterCrudPage from "@/components/MasterCrudPage";

export default function DeliveryNotesPage() {
  return <MasterCrudPage
    domain="delivery-notes" title="Delivery Notes" description="Manage your delivery notes" idPrefix="DN" fields={[
    { key: "deliveryNoteRefNo", label: "Delivery Note Ref No", type: "text", required: true },
    { key: "deliveryDate", label: "Delivery Date", type: "date", required: true },
    { key: "company", label: "Company", type: "text" },
    { key: "fromStore", label: "From Store", type: "text" },
    { key: "deliverySourceType", label: "Delivery Source Type", type: "select", options: ["Sales Order", "Stock Transfer"] },
    { key: "deliverySourceRefNo", label: "Source Ref No (SO)", type: "text" },
    { key: "toStore", label: "To Store / Customer", type: "text" },
    { key: "customer", label: "Customer", type: "text" },
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
  ]} initialData={[
    { id: "DN001", deliveryNoteRefNo: "DN/03/001", deliveryDate: "2024-03-15", company: "AgroTanzania Ltd", fromStore: "Dar es Salaam Main Warehouse", deliverySourceType: "Sales Order", deliverySourceRefNo: "SO/03/001", toStore: "", customer: "Metro Foods Inc", truckNo: "T 456 DEF", trailerNo: "", driverName: "Hassan Juma", driverContactNumber: "+255 789 333444", sealNo: "SEAL-S001", currency: "TZS", totalProductAmount: 7900000, vatAmount: 1422000, finalSalesAmount: 9322000, remarks: "", status: "Delivered" },
  ]} columns={[
    { key: "deliveryNoteRefNo", label: "DN No" }, { key: "deliveryDate", label: "Date" }, { key: "deliverySourceRefNo", label: "SO Ref" }, { key: "customer", label: "Customer" }, { key: "truckNo", label: "Truck" }, { key: "status", label: "Status" },
  ]} />;
}

