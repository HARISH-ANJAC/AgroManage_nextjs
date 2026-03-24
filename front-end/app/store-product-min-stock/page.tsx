"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData";

export default function StoreProductMinStockPage() {
  const { data: stocks, isLoading: loadingStocks } = useMasterData("store-product-min-stocks");
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

  const formatData = (data: any[]) => {
    return data?.map((item) => ({
      ...item,
      effectiveFrom: item.effectiveFrom ? new Date(item.effectiveFrom).toISOString().split('T')[0] : '',
      effectiveTo: item.effectiveTo ? new Date(item.effectiveTo).toISOString().split('T')[0] : '',
    })) || [];
  };

  return <MasterCrudPage
    domain="store-product-min-stocks" title="Store Product Minimum Stock" description="Manage your store product minimum stock" idPrefix="SMS" fields={[
    { key: "companyId", label: "Company", type: "select", options: companyOptions },
    { key: "storeId", label: "Store", type: "select", required: true, options: storeOptions },
    { key: "mainCategoryId", label: "Main Category", type: "select", options: mainCategoryOptions },
    { key: "subCategoryId", label: "Sub Category", type: "select", options: subCategoryOptions },
    { key: "productId", label: "Product", type: "select", required: true, options: productOptions },
    { key: "minimumStockPcs", label: "Minimum Stock (pcs)", type: "number" },
    { key: "purchaseAlertQty", label: "Purchase Alert Qty", type: "number" },
    { key: "requestedBy", label: "Requested By", type: "text" },
    { key: "effectiveFrom", label: "Effective From", type: "date" },
    { key: "effectiveTo", label: "Effective To", type: "date" },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "statusMaster", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
  ]} initialData={formatData(stocks)} columns={[
    { key: "storeName", label: "Store" }, { key: "productName", label: "Product" }, { key: "minimumStockPcs", label: "Min Stock" }, { key: "purchaseAlertQty", label: "Alert Qty" }, { key: "statusMaster", label: "Status" },
  ]} />;
}
