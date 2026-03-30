"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData";

export default function MinimumStockPage() {
    const { data: minStocks, isLoading: loadingMinStocks } = useMasterData("store-product-min-stock");
    const { data: companies } = useMasterData("companies");
    const { data: stores } = useMasterData("stores");
    const { data: products } = useMasterData("products");

    const companyOptions = companies?.map((c: any) => ({ value: c.id, label: c.companyName })) || [];
    const storeOptions = stores?.map((s: any) => ({ value: s.id, label: s.storeName })) || [];
    const productOptions = products?.map((p: any) => ({ value: p.id, label: p.productName })) || [];

    return <MasterCrudPage
        domain="store-product-min-stock" 
        title="Minimum Stock Pcs" 
        description="Manage minimum stock levels and purchase alerts for products per store" 
        idPrefix="MIN" 
        fields={[
            { key: "companyId", label: "Company", type: "select", options: companyOptions },
            { key: "storeId", label: "Store", type: "select", required: true, options: storeOptions },
            { key: "productId", label: "Product", type: "select", required: true, options: productOptions },
            { key: "minimumStockPcs", label: "Min Stock (Pcs)", type: "number", required: true },
            { key: "purchaseAlertQty", label: "Purchase Alert Qty", type: "number", required: true },
            { key: "requestedBy", label: "Requested By", type: "text" },
            { key: "effectiveFrom", label: "Effective From", type: "date" },
            { key: "effectiveTo", label: "Effective To", type: "date" },
            { key: "remarks", label: "Remarks", type: "textarea" },
            { key: "statusMaster", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
        ]} 
        initialData={minStocks || []}
        columns={[
            { key: "storeStoreName", label: "Store" }, 
            { key: "productProductName", label: "Product" }, 
            { key: "minimumStockPcs", label: "Min Stock" }, 
            { key: "purchaseAlertQty", label: "Alert Qty" }, 
            { key: "statusMaster", label: "Status" },
        ]} 
    />;
}
