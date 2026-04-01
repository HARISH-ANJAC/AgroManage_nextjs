"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData";

export default function ProductCompanyCategoryMappingPage() {
  const { data: mappings, isLoading: loadingMappings } = useMasterData("product-company-category-mappings");
  const { data: companies } = useMasterData("companies");
  const { data: categories } = useMasterData("categories");

  const companyOptions = companies?.map((c: any) => ({ value: c.id, label: c.companyName })) || [];
  const categoryOptions = categories?.map((c: any) => ({ value: c.id, label: c.mainCategoryName })) || [];

  return <MasterCrudPage
    domain="product-company-category-mappings" title="Product Company Category Mapping" description="Manage your product company category mappings" idPrefix="PCM" fields={[
    { key: "companyId", label: "Company", type: "select", required: true, options: companyOptions },
    { key: "mainCategoryId", label: "Main Category", type: "select", required: true, options: categoryOptions },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "statusMaster", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
  ]} initialData={mappings || []} columns={[
    { key: "companyName", label: "Company" }, { key: "categoryName", label: "Category" }, { key: "statusMaster", label: "Status" },
  ]} />;
}
