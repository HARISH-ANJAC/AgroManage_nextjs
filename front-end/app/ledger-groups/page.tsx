"use client";

import MasterCrudPage from "@/components/MasterCrudPage";

export default function LedgerGroupsPage() {
  return <MasterCrudPage
    domain="ledger-groups" title="Ledger Groups" description="Manage your ledger groups" idPrefix="LGR" fields={[
    { key: "ledgerGroupName", label: "Ledger Group Name", type: "text", required: true },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "status", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
  ]} initialData={[
    { id: "LGR001", ledgerGroupName: "Current Assets", remarks: "", status: "Active" },
    { id: "LGR002", ledgerGroupName: "Current Liabilities", remarks: "", status: "Active" },
    { id: "LGR003", ledgerGroupName: "Income", remarks: "", status: "Active" },
    { id: "LGR004", ledgerGroupName: "Expenses", remarks: "", status: "Active" },
  ]} columns={[
    { key: "ledgerGroupName", label: "Group Name" }, { key: "remarks", label: "Remarks" }, { key: "status", label: "Status" },
  ]} />;
}

