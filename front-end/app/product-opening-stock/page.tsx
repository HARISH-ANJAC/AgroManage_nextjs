"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData";

export default function ProductOpeningStockPage() {
  const { data: stocks, isLoading: loadingStocks } = useMasterData("product-opening-stocks");
  const { data: companies } = useMasterData("companies");
  const { data: stores } = useMasterData("stores");
  const { data: mainCategories } = useMasterData("categories");
  const { data: subCategories } = useMasterData("subcategories");
  const { data: products } = useMasterData("products");

  const companyOptions = companies?.map((c: any) => ({ value: c.id, label: c.companyName })) || [];
  const storeOptions = stores?.map((s: any) => ({ value: s.id, label: s.storeName })) || [];
  const mainCategoryOptions = mainCategories?.map((c: any) => ({ value: c.id, label: c.mainCategoryName })) || [];
  const subCategoryOptions = subCategories?.map((c: any) => ({ value: c.id, label: c.subCategoryName })) || [];
  const productOptions = products?.map((p: any) => ({ value: p.id, label: p.productName })) || [];

  return <MasterCrudPage
    domain="product-opening-stocks" title="Product Opening Stock" description="Manage your product opening stock" idPrefix="POS" fields={[
    { key: "openingStockDate", label: "Opening Stock Date", type: "date", required: true },
    { key: "companyId", label: "Company", type: "select", options: companyOptions },
    { key: "storeId", label: "Store", type: "select", options: storeOptions },
    { key: "mainCategoryId", label: "Main Category", type: "select", options: mainCategoryOptions },
    { key: "subCategoryId", label: "Sub Category", type: "select", options: subCategoryOptions },
    { key: "productId", label: "Product", type: "select", required: true, options: productOptions },
    { key: "totalQty", label: "Total Qty", type: "number", required: true },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "statusMaster", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
  ]} initialData={stocks ? stocks.map((s: any) => ({...s, openingStockDate: s.openingStockDate ? new Date(s.openingStockDate).toISOString().split('T')[0] : ''})) : []} columns={[
    { key: "productName", label: "Product" }, { key: "storeName", label: "Store" }, { key: "totalQty", label: "Qty" }, { key: "openingStockDate", label: "Date" }, { key: "statusMaster", label: "Status" },
  ]} />;
}
