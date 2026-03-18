"use client";

import MasterCrudPage from "@/components/MasterCrudPage";

export default function UomPage() {
  return <MasterCrudPage
    domain="uom" title="Units of Measure" description="UOM Master" idPrefix="UOM" fields={[
    { key: "name", label: "Unit Name", type: "text", required: true },
    { key: "shortCode", label: "Short Code", type: "text", required: true },
    { key: "description", label: "Description", type: "text" },
    { key: "status", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
  ]} initialData={[
    { id: "UOM001", name: "Kilogram", shortCode: "KG", description: "Standard weight", status: "Active" },
    { id: "UOM002", name: "Metric Ton", shortCode: "MT", description: "1000 KG", status: "Active" },
    { id: "UOM003", name: "Bag", shortCode: "BAG", description: "Standard bag", status: "Active" },
    { id: "UOM004", name: "Liter", shortCode: "LTR", description: "Volume", status: "Active" },
  ]} columns={[
    { key: "name", label: "Unit" }, { key: "shortCode", label: "Code" }, { key: "description", label: "Description" }, { key: "status", label: "Status" },
  ]} />;
}

