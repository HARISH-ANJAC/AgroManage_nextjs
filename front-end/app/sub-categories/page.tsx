"use client";

import MasterCrudPage from "@/components/MasterCrudPage";

export default function SubCategoriesPage() {
  return <MasterCrudPage
    domain="sub-categories" title="Sub Categories" description="Manage your sub categories" idPrefix="SUB" fields={[
    { key: "subCategoryName", label: "Sub Category Name", type: "text", required: true },
    { key: "mainCategory", label: "Main Category", type: "select", options: ["Grains", "Pulses", "Fertilizers", "Seeds", "Spices"] },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "status", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
  ]} initialData={[
    { id: "SUB001", subCategoryName: "Maize", mainCategory: "Grains", remarks: "", status: "Active" },
    { id: "SUB002", subCategoryName: "Rice", mainCategory: "Grains", remarks: "", status: "Active" },
    { id: "SUB003", subCategoryName: "Wheat", mainCategory: "Grains", remarks: "", status: "Active" },
    { id: "SUB004", subCategoryName: "Beans", mainCategory: "Pulses", remarks: "", status: "Active" },
    { id: "SUB005", subCategoryName: "NPK Fertilizer", mainCategory: "Fertilizers", remarks: "", status: "Active" },
    { id: "SUB006", subCategoryName: "Karafu", mainCategory: "Spices", remarks: "", status: "Active" },
  ]} columns={[
    { key: "subCategoryName", label: "Sub Category" }, { key: "mainCategory", label: "Main Category" }, { key: "status", label: "Status" },
  ]} />;
}

