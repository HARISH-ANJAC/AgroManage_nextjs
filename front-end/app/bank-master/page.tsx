"use client";

import MasterCrudPage from "@/components/MasterCrudPage";

export default function BankMasterPage() {
  return <MasterCrudPage
    domain="bank-master" title="Banks" description="Manage your banks" idPrefix="BNK" fields={[
    { key: "bankName", label: "Bank Name", type: "text", required: true },
    { key: "address", label: "Address", type: "text" },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "status", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
  ]} initialData={[
    { id: "BNK001", bankName: "CRDB Bank", address: "Dar es Salaam", remarks: "", status: "Active" },
    { id: "BNK002", bankName: "NMB Bank", address: "Dar es Salaam", remarks: "", status: "Active" },
    { id: "BNK003", bankName: "Stanbic Bank", address: "Dar es Salaam", remarks: "", status: "Active" },
  ]} columns={[
    { key: "bankName", label: "Bank Name" }, { key: "address", label: "Address" }, { key: "status", label: "Status" },
  ]} />;
}

