"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData";

export default function PaymentModesPage() {
  const { data: paymentModes } = useMasterData("payment-modes");

  return <MasterCrudPage
    domain="payment-modes" title="Payment Modes" description="Manage your payment modes" idPrefix="PMD" fields={[
      { key: "paymentModeName", label: "Payment Mode Name", type: "text", required: true },
      { key: "paymentModePercentage", label: "Payment Mode Percentage", type: "number" },
      { key: "remarks", label: "Remarks", type: "textarea" },
      { key: "statusEntry", label: "Status", type: "select", required: true, options: ["Active", "Inactive"], defaultValue: "Active" },
    ]} initialData={paymentModes} columns={[
      { key: "paymentModeName", label: "Mode" },
      { key: "paymentModePercentage", label: "%" },
      { key: "statusEntry", label: "Status" },
    ]} />;
}
