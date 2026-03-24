"use client";

import MasterCrudPage from "@/components/MasterCrudPage";

export default function CategoriesPage() {
  return <MasterCrudPage
    domain="categories" 
    title="Main Categories" 
    description="Manage your main categories" 
    idPrefix="CAT" 
    fields={[
      { key: "mainCategoryName", label: "Main Category Name", type: "text", required: true },
      { key: "remarks", label: "Remarks", type: "textarea" },
      { key: "statusMaster", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
    ]} 
    initialData={[]} 
    columns={[
      { key: "mainCategoryName", label: "Category Name" }, 
      { key: "remarks", label: "Remarks" }, 
      { key: "statusMaster", label: "Status" },
    ]} 
  />;
}
