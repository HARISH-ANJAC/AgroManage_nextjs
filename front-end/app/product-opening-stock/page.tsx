"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData";

export default function ProductOpeningStockPage() {
  const { data: stocks, isLoading: loadingStocks } = useMasterData("product-opening-stocks");
  const { data: companies } = useMasterData("companies");
  const { data: stores } = useMasterData("stores");
  const { data: mainCategories } = useMasterData("categories");
  const { data: subCategories } = useMasterData("sub-categories");
  const { data: products } = useMasterData("products");

  const companyOptions = companies?.map((c: any) => ({ value: c.id, label: c.companyName })) || [];
  const storeOptions = stores?.map((s: any) => ({ value: s.id, label: s.storeName })) || [];
  const mainCategoryOptions = mainCategories?.map((c: any) => ({ value: c.id, label: c.mainCategoryName })) || [];

  return <MasterCrudPage
    domain="product-opening-stocks" title="Product Opening Stock" description="Manage your product opening stock" idPrefix="POS" fields={[
      { key: "openingStockDate", label: "Opening Stock Date", type: "date", required: true },
      { key: "companyId", label: "Company", type: "select", options: companyOptions },
      { key: "storeId", label: "Store", type: "select", options: storeOptions },
      { key: "mainCategoryId", label: "Main Category", type: "select", required: true, options: mainCategoryOptions },
      { 
        key: "subCategoryId", 
        label: "Sub Category", 
        type: "select", 
        required: true,
        dependsOn: "mainCategoryId",
        options: (form) => {
          if (!form.mainCategoryId) return [];
          return subCategories
            ?.filter((s: any) => String(s.mainCategoryId) === String(form.mainCategoryId))
            ?.map((s: any) => ({ value: s.id, label: s.subCategoryName })) || [];
        }
      },
      { 
        key: "productId", 
        label: "Product", 
        type: "select", 
        required: true, 
        dependsOn: "subCategoryId",
        options: (form) => {
          if (!form.subCategoryId) return [];
          return products
            ?.filter((p: any) =>
              String(p.mainCategoryId) === String(form.mainCategoryId) &&
              String(p.subCategoryId) === String(form.subCategoryId)
            )
            ?.map((p: any) => ({ value: p.id, label: p.productName })) || [];
        }
      },
      { key: "totalQty", label: "Total Qty", type: "number", required: true },
      { key: "remarks", label: "Remarks", type: "textarea" },
      { key: "statusMaster", label: "Status", type: "select", required: true, options: ["Active", "Inactive"], defaultValue: "Active" },
    ]} initialData={stocks ?? []} columns={[
      { key: "productId", label: "Product" },
      { key: "storeId", label: "Store" },
      { key: "totalQty", label: "Qty" },
      { 
        key: "openingStockDate", 
        label: "Date",
        render: (val: any) => {
          if (!val) return "—";
          try { return new Date(val).toLocaleDateString(); } catch { return String(val); }
        }
      },
      { key: "statusMaster", label: "Status" },
    ]} />;
}
