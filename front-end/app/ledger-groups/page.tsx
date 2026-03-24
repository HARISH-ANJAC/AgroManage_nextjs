"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData";

export default function LedgerGroupsPage() {
  const { data: ledgerGroups } = useMasterData("ledger-groups");

  return <MasterCrudPage
    domain="ledger-groups" title="Ledger Groups" description="Manage your ledger groups" idPrefix="LGR" fields={[
    { key: "ledgerGroupName", label: "Ledger Group Name", type: "text", required: true },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "statusMaster", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
  ]} initialData={ledgerGroups} columns={[
    { key: "ledgerGroupName", label: "Group Name" }, 
    { key: "remarks", label: "Remarks" }, 
    { key: "statusMaster", label: "Status" },
  ]} />;
}
