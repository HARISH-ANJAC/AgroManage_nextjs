"use client";

import MasterCrudPage from "@/components/MasterCrudPage";

export default function BankAccountsPage() {
  return <MasterCrudPage
    domain="bank-accounts" title="Company Bank Accounts" description="Manage your bank accounts" idPrefix="CBA" fields={[
    { key: "company", label: "Company", type: "text" },
    { key: "bank", label: "Bank", type: "text", required: true },
    { key: "accountName", label: "Account Name", type: "text", required: true },
    { key: "accountNumber", label: "Account Number", type: "text", required: true },
    { key: "swiftCode", label: "Swift Code", type: "text" },
    { key: "branchAddress", label: "Branch Address", type: "text" },
    { key: "bankBranchName", label: "Bank Branch Name", type: "text" },
    { key: "currency", label: "Currency", type: "select", options: ["TZS", "USD", "EUR"] },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "status", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
  ]} initialData={[
    { id: "CBA001", company: "AgroTanzania Ltd", bank: "CRDB Bank", accountName: "AgroTanzania Ltd", accountNumber: "0150-123456789", swiftCode: "CORUTZTZ", branchAddress: "Dar es Salaam", bankBranchName: "Main Branch", currency: "TZS", remarks: "", status: "Active" },
    { id: "CBA002", company: "AgroTanzania Ltd", bank: "NMB Bank", accountName: "AgroTanzania USD", accountNumber: "2200-987654321", swiftCode: "NMIBTZTZ", branchAddress: "Dar es Salaam", bankBranchName: "HQ Branch", currency: "USD", remarks: "", status: "Active" },
  ]} columns={[
    { key: "bank", label: "Bank" }, { key: "accountName", label: "Account Name" }, { key: "accountNumber", label: "Account No" }, { key: "swiftCode", label: "Swift" }, { key: "currency", label: "Currency" }, { key: "status", label: "Status" },
  ]} />;
}

