"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData";

export default function LedgerMasterPage() {
    const { data: ledgers } = useMasterData("ledger-master");
    const { data: ledgerGroups } = useMasterData("ledger-groups");
    const { data: companies } = useMasterData("companies");

    const ledgerGroupOptions = ledgerGroups?.map((g: any) => ({
        value: g.id,
        label: g.ledgerGroupName
    })) || [];

    const companyOptions = companies?.map((c: any) => ({
        value: c.id,
        label: c.companyName
    })) || [];

    return <MasterCrudPage
        domain="ledger-master" 
        title="Ledger Master" 
        description="Manage your financial ledgers and mappings to groups" 
        idPrefix="LDG" 
        fields={[
            { key: "companyId", label: "Company", type: "select", options: companyOptions },
            { key: "ledgerName", label: "Ledger Name", type: "text", required: true },
            { key: "ledgerGroupId", label: "Ledger Group", type: "select", required: true, options: ledgerGroupOptions },
            { key: "ledgerType", label: "Ledger Type", type: "text" },
            { key: "ledgerDesc", label: "Description", type: "text" },
            { key: "remarks", label: "Remarks", type: "textarea" },
            { key: "statusMaster", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
        ]} 
        initialData={ledgers || []} 
        columns={[
            { key: "ledgerName", label: "Ledger" }, 
            { key: "groupLedgerGroupName", label: "Group" }, 
            { key: "ledgerType", label: "Type" }, 
            { key: "statusMaster", label: "Status" },
        ]} 
    />;
}
