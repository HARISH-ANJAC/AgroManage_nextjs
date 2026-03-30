"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData";

export default function AccountHeadsPage() {
  const { data: accountHeads } = useMasterData("account-heads");

  return <MasterCrudPage
    domain="account-heads" title="Account Heads" description="Manage your account heads" idPrefix="ACH" fields={[
    { key: "accountHeadName", label: "Account Head Name", type: "text", required: true },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "statusEntry", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
  ]} initialData={accountHeads} columns={[
    { key: "accountHeadName", label: "Account Head" }, 
    { key: "remarks", label: "Remarks" }, 
    { key: "statusEntry", label: "Status" },
  ]} />;
}
