"use client";

import MasterCrudPage from "@/components/MasterCrudPage";

export default function AccountHeadsPage() {
  return <MasterCrudPage
    domain="account-heads" title="Account Heads" description="Manage your account heads" idPrefix="ACH" fields={[
    { key: "accountHeadName", label: "Account Head Name", type: "text", required: true },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "status", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
  ]} initialData={[
    { id: "ACH001", accountHeadName: "Transportation", remarks: "Transport costs", status: "Active" },
    { id: "ACH002", accountHeadName: "Loading/Offloading", remarks: "Loading costs", status: "Active" },
    { id: "ACH003", accountHeadName: "Accommodation", remarks: "Travel accommodation", status: "Active" },
    { id: "ACH004", accountHeadName: "Sales Revenue", remarks: "Product sales", status: "Active" },
  ]} columns={[
    { key: "accountHeadName", label: "Account Head" }, { key: "remarks", label: "Remarks" }, { key: "status", label: "Status" },
  ]} />;
}

