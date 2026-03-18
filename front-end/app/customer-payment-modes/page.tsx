"use client";

import MasterCrudPage from "@/components/MasterCrudPage";

export default function CustomerPaymentModesPage() {
  return <MasterCrudPage
    domain="customer-payment-modes" title="Customer Payment Modes" description="Manage your customer payment modes" idPrefix="CPM" fields={[
    { key: "paymentModeName", label: "Payment Mode Name", type: "text", required: true },
    { key: "shortCode", label: "Short Code", type: "text" },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "status", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
  ]} initialData={[
    { id: "CPM001", paymentModeName: "Bank Transfer", shortCode: "BT", remarks: "", status: "Active" },
    { id: "CPM002", paymentModeName: "Mobile Money", shortCode: "MM", remarks: "", status: "Active" },
  ]} columns={[
    { key: "paymentModeName", label: "Mode" }, { key: "shortCode", label: "Code" }, { key: "status", label: "Status" },
  ]} />;
}

