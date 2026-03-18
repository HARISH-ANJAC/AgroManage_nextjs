"use client";

import MasterCrudPage from "@/components/MasterCrudPage";

export default function CategoriesPage() {
  return <MasterCrudPage
    domain="categories" title="Main Categories" description="Manage your main categories" idPrefix="CAT" fields={[
    { key: "mainCategoryName", label: "Main Category Name", type: "text", required: true },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "status", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
  ]} initialData={[
    { id: "CAT001", mainCategoryName: "Grains", remarks: "Cereal grains", status: "Active" },
    { id: "CAT002", mainCategoryName: "Pulses", remarks: "Legumes and beans", status: "Active" },
    { id: "CAT003", mainCategoryName: "Fertilizers", remarks: "Agricultural fertilizers", status: "Active" },
    { id: "CAT004", mainCategoryName: "Seeds", remarks: "Planting seeds", status: "Active" },
    { id: "CAT005", mainCategoryName: "Spices", remarks: "Spices and herbs", status: "Active" },
  ]} columns={[
    { key: "mainCategoryName", label: "Category Name" }, { key: "remarks", label: "Remarks" }, { key: "status", label: "Status" },
  ]} />;
}

