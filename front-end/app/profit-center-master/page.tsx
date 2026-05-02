"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData";

export default function ProfitCenterMasterPage() {
  const { data: profitCenters } = useMasterData("profit-centers");

  return (
    <MasterCrudPage
      domain="profit-centers"
      title="Profit Center Master"
      description="Manage revenue-generating units like regions, branches, or product lines."
      idPrefix="PC"
      fields={[
        { key: "profitCenterCode", label: "Code", type: "text", required: true },
        { key: "profitCenterName", label: "Name", type: "text", required: true },
        { key: "managerName", label: "Manager Name", type: "text" },
        { 
          key: "status", 
          label: "Status", 
          type: "select", 
          required: true, 
          options: ["Active", "Inactive"], 
          defaultValue: "Active" 
        },
      ]}
      initialData={profitCenters}
      columns={[
        { key: "profitCenterCode", label: "Code" },
        { key: "profitCenterName", label: "Name" },
        { key: "managerName", label: "Manager" },
        { key: "status", label: "Status" },
      ]}
    />
  );
}
