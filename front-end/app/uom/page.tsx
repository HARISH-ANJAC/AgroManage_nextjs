"use client";

import MasterCrudPage from "@/components/MasterCrudPage";

export default function UomPage() {
  return <MasterCrudPage
    domain="uom" 
    title="Units of Measure" 
    description="Manage your units of measure" 
    idPrefix="UOM" 
    fields={[
      { key: "uomName", label: "Unit Name", type: "text", required: true },
      { key: "uomShortCode", label: "Short Code", type: "text", required: true },
      { key: "remarks", label: "Description", type: "textarea" },
      { key: "statusMaster", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
    ]} 
    initialData={[]} 
    columns={[
      { key: "uomName", label: "Unit" }, 
      { key: "uomShortCode", label: "Code" }, 
      { key: "remarks", label: "Description" }, 
      { key: "statusMaster", label: "Status" },
    ]} 
  />;
}
