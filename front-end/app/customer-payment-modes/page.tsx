"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData";

export default function CustomerPaymentModesPage() {
  const { data: customerPaymentModes } = useMasterData("customer-payment-modes");

  return <MasterCrudPage
    domain="customer-payment-modes" title="Customer Payment Modes" description="Manage your customer payment modes" idPrefix="CPM" fields={[
    { key: "paymentModeName", label: "Payment Mode Name", type: "text", required: true },
    { key: "shortCode", label: "Short Code", type: "text" },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "statusMaster", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
  ]} initialData={customerPaymentModes} columns={[
    { key: "paymentModeName", label: "Mode" }, 
    { key: "shortCode", label: "Code" }, 
    { key: "statusMaster", label: "Status" },
  ]} />;
}
