"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData";

export default function AdditionalCostTypesPage() {
  const { data: additionalCostTypes } = useMasterData("additional-cost-types");

  return <MasterCrudPage
    domain="additional-cost-types" title="Additional Cost Types" description="Manage your additional cost types" idPrefix="ACT" fields={[
    { key: "additionalCostTypeName", label: "Cost Type Name", type: "text", required: true },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "statusEntry", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
  ]} initialData={additionalCostTypes || []} columns={[
    { key: "additionalCostTypeName", label: "Cost Type" },
    { key: "remarks", label: "Remarks" },
    { key: "statusEntry", label: "Status" },
  ]} />;
}
