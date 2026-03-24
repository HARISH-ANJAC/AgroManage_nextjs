"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData";

export default function BankMasterPage() {
  const { data: banks } = useMasterData("banks");

  return <MasterCrudPage
    domain="banks" title="Banks" description="Manage your banks" idPrefix="BNK" fields={[
    { key: "bankName", label: "Bank Name", type: "text", required: true },
    { key: "address", label: "Address", type: "text" },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "statusMaster", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
  ]} initialData={banks} 
  columns={[
    { key: "bankName", label: "Bank Name" }, { key: "address", label: "Address" }, { key: "statusMaster", label: "Status" },
  ]} />;
}
