"use client";

import MasterCrudPage from "@/components/MasterCrudPage";

export default function PaymentModesPage() {
  return <MasterCrudPage
    domain="payment-modes" title="Payment Modes" description="Manage your payment modes" idPrefix="PMD" fields={[
    { key: "paymentModeName", label: "Payment Mode Name", type: "text", required: true },
    { key: "paymentModePercentage", label: "Payment Mode Percentage", type: "number" },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "status", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
  ]} initialData={[
    { id: "PMD001", paymentModeName: "Bank Transfer", paymentModePercentage: 0, remarks: "", status: "Active" },
    { id: "PMD002", paymentModeName: "Cheque", paymentModePercentage: 0, remarks: "", status: "Active" },
    { id: "PMD003", paymentModeName: "Cash", paymentModePercentage: 0, remarks: "", status: "Active" },
    { id: "PMD004", paymentModeName: "Mobile Money", paymentModePercentage: 0, remarks: "", status: "Active" },
  ]} columns={[
    { key: "paymentModeName", label: "Mode" }, { key: "paymentModePercentage", label: "%" }, { key: "status", label: "Status" },
  ]} />;
}

