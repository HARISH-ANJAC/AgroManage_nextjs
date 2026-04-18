"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData";

export default function CategoriesPage() {
  const { data: categories } = useMasterData("categories");

  return <MasterCrudPage
    domain="categories"
    title="Main Categories"
    description="Manage your main categories"
    idPrefix="CAT"
    fields={[
      { key: "mainCategoryName", label: "Main Category Name", type: "text", required: true },
      { key: "remarks", label: "Remarks", type: "textarea" },
      { key: "statusMaster", label: "Status", type: "select", required: true, options: ["Active", "Inactive"], defaultValue: "Active" },
    ]}
    initialData={categories || []}
    columns={[
      { key: "mainCategoryName", label: "Category Name" },
      { key: "remarks", label: "Remarks" },
      { key: "statusMaster", label: "Status" },
    ]}
  />;
}
