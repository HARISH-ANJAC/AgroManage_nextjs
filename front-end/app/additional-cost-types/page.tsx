"use client";

import MasterCrudPage from "@/components/MasterCrudPage";

export default function AdditionalCostTypesPage() {
  return <MasterCrudPage
    domain="additional-cost-types" title="Additional Cost Types" description="Manage your additional cost types" idPrefix="ACT" fields={[
    { key: "additionalCostTypeName", label: "Cost Type Name", type: "text", required: true },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "status", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
  ]} initialData={[
    { id: "ACT001", additionalCostTypeName: "Transportation Cost", remarks: "", status: "Active" },
    { id: "ACT002", additionalCostTypeName: "Loading/Offloading", remarks: "", status: "Active" },
    { id: "ACT003", additionalCostTypeName: "Insurance", remarks: "", status: "Active" },
    { id: "ACT004", additionalCostTypeName: "Customs Duty", remarks: "", status: "Active" },
    { id: "ACT005", additionalCostTypeName: "Fumigation", remarks: "", status: "Active" },
  ]} columns={[
    { key: "additionalCostTypeName", label: "Cost Type" }, { key: "remarks", label: "Remarks" }, { key: "status", label: "Status" },
  ]} />;
}

