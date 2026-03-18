"use client";

import MasterCrudPage from "@/components/MasterCrudPage";

export default function PaymentTermsPage() {
  return <MasterCrudPage
    domain="payment-terms" title="Payment Terms" description="Manage your payment terms" idPrefix="PT" fields={[
    { key: "paymentTermName", label: "Payment Term Name", type: "text", required: true },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "status", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
  ]} initialData={[
    { id: "PT001", paymentTermName: "Cash on Delivery", remarks: "", status: "Active" },
    { id: "PT002", paymentTermName: "Net 30 Days", remarks: "", status: "Active" },
    { id: "PT003", paymentTermName: "Net 60 Days", remarks: "", status: "Active" },
    { id: "PT004", paymentTermName: "Advance Payment", remarks: "", status: "Active" },
  ]} columns={[
    { key: "paymentTermName", label: "Term" }, { key: "remarks", label: "Remarks" }, { key: "status", label: "Status" },
  ]} />;
}

