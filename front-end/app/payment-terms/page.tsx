"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData";

export default function PaymentTermsPage() {
  const { data: paymentTerms } = useMasterData("payment-terms");

  return <MasterCrudPage
    domain="payment-terms" title="Payment Terms" description="Manage your payment terms" idPrefix="PT" fields={[
    { key: "paymentTermName", label: "Payment Term Name", type: "text", required: true },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "statusEntry", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
  ]} initialData={paymentTerms} 
  columns={[
    { key: "paymentTermName", label: "Term" }, { key: "remarks", label: "Remarks" }, { key: "statusEntry", label: "Status" },
  ]} />;
}
