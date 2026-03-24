"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData";

export default function LedgerMasterPage() {
  const { data: ledgerGroups } = useMasterData("ledger-groups");
  const { data: accountHeads } = useMasterData("account-heads");

  const ledgerGroupOptions = ledgerGroups?.map((g: any) => ({
    value: g.id,
    label: g.ledgerGroupName
  })) || [];

  const accountHeadOptions = accountHeads?.map((h: any) => ({
    value: h.id,
    label: h.accountHeadName
  })) || [];

  return <MasterCrudPage
    domain="ledger-master" title="Ledger Master" description="Manage your ledgers" idPrefix="LDG" fields={[
    { key: "ledgerName", label: "Ledger Name", type: "text", required: true },
    { key: "ledgerGroupId", label: "Ledger Group", type: "select", required: true, options: ledgerGroupOptions },
    { key: "accountHeadId", label: "Account Head", type: "select", required: true, options: accountHeadOptions },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "statusMaster", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
  ]} initialData={[]} columns={[
    { key: "ledgerName", label: "Ledger Name" }, 
    { key: "ledgerGroupName", label: "Group" }, 
    { key: "accountHeadName", label: "Head" }, 
    { key: "statusMaster", label: "Status" },
  ]} />;
}
