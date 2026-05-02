"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData";

export default function CostCenterMasterPage() {
  const { data: costCenters } = useMasterData("cost-centers");

  return (
    <MasterCrudPage
      domain="cost-centers"
      title="Cost Center Master"
      description="Manage departments, projects, and cost tracking units."
      idPrefix="CC"
      fields={[
        { key: "costCenterCode", label: "Code", type: "text", required: true },
        { key: "costCenterName", label: "Name", type: "text", required: true },
        { 
          key: "costCenterType", 
          label: "Type", 
          type: "select", 
          required: true, 
          options: ["DEPARTMENT", "PROJECT", "BRANCH", "ASSET", "CAMPAIGN"],
          defaultValue: "DEPARTMENT" 
        },
        { key: "budgetAlertThreshold", label: "Alert Threshold (%)", type: "number", defaultValue: 80 },
        { key: "description", label: "Remarks", type: "textarea" },
        { 
          key: "status", 
          label: "Status", 
          type: "select", 
          required: true, 
          options: ["Active", "Inactive"], 
          defaultValue: "Active" 
        },
      ]}
      initialData={costCenters}
      columns={[
        { key: "costCenterCode", label: "Code" },
        { key: "costCenterName", label: "Name" },
        { key: "costCenterType", label: "Type" },
        { key: "budgetAlertThreshold", label: "Alert Threshold" },
        { key: "status", label: "Status" },
      ]}
    />
  );
}
