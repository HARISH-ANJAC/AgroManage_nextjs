"use client";

import MasterCrudPage from "@/components/MasterCrudPage";

export default function LedgerMasterPage() {
  return <MasterCrudPage
    domain="ledger-master" title="Ledger Master" description="Manage your ledger master" idPrefix="LED" fields={[
    { key: "company", label: "Company", type: "text" },
    { key: "ledgerType", label: "Ledger Type", type: "select", options: ["Asset", "Liability", "Income", "Expense"] },
    { key: "ledgerGroupId", label: "Ledger Group", type: "text" },
    { key: "ledgerName", label: "Ledger Name", type: "text", required: true },
    { key: "ledgerDesc", label: "Description", type: "text" },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "status", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
  ]} initialData={[
    { id: "LED001", company: "AgroTanzania Ltd", ledgerType: "Expense", ledgerGroupId: "Expenses", ledgerName: "Purchase Account", ledgerDesc: "All purchases", remarks: "", status: "Active" },
    { id: "LED002", company: "AgroTanzania Ltd", ledgerType: "Income", ledgerGroupId: "Income", ledgerName: "Sales Account", ledgerDesc: "All sales", remarks: "", status: "Active" },
  ]} columns={[
    { key: "ledgerName", label: "Ledger" }, { key: "ledgerType", label: "Type" }, { key: "ledgerDesc", label: "Description" }, { key: "status", label: "Status" },
  ]} />;
}

