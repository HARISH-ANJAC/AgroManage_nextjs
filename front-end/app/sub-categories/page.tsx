"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData";

export default function SubCategoriesPage() {
  const { data: categories, isLoading: loadingCats } = useMasterData("categories");

  const categoryOptions = categories.map((c: any) => ({
    value: c.id,
    label: c.mainCategoryName
  }));

  if (loadingCats) return <div className="p-8 text-center text-muted-foreground">Loading Categories...</div>;

  return <MasterCrudPage
    domain="subcategories" 
    title="Sub Categories" 
    description="Manage your business sub categories" 
    idPrefix="SUB" 
    fields={[
      { key: "subCategoryName", label: "Sub Category Name", type: "text", required: true },
      { 
        key: "mainCategoryId", 
        label: "Main Category", 
        type: "select", 
        required: true,
        options: categoryOptions,
        placeholder: "Select Category"
      },
      { key: "remarks", label: "Remarks", type: "textarea" },
      { key: "statusMaster", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
    ]} 
    initialData={[]} 
    columns={[
      { key: "subCategoryName", label: "Sub Category" }, 
      { key: "mainCategoryName", label: "Main Category" }, 
      { key: "statusMaster", label: "Status" },
    ]} 
  />;
}
