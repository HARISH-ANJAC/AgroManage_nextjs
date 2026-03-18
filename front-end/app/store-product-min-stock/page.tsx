"use client";

import MasterCrudPage from "@/components/MasterCrudPage";

export default function StoreProductMinStockPage() {
  return <MasterCrudPage
    domain="store-product-min-stock" title="Store Product Minimum Stock" description="Manage your store product minimum stock" idPrefix="SMS" fields={[
    { key: "company", label: "Company", type: "text" },
    { key: "store", label: "Store", type: "text", required: true },
    { key: "mainCategory", label: "Main Category", type: "text" },
    { key: "subCategory", label: "Sub Category", type: "text" },
    { key: "product", label: "Product", type: "text", required: true },
    { key: "minimumStockPcs", label: "Minimum Stock (pcs)", type: "number" },
    { key: "purchaseAlertQty", label: "Purchase Alert Qty", type: "number" },
    { key: "requestedBy", label: "Requested By", type: "text" },
    { key: "effectiveFrom", label: "Effective From", type: "date" },
    { key: "effectiveTo", label: "Effective To", type: "date" },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "status", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
  ]} initialData={[
    { id: "SMS001", company: "AgroTanzania Ltd", store: "Dar es Salaam Main Warehouse", mainCategory: "Grains", subCategory: "Maize", product: "White Maize – Grade A", minimumStockPcs: 1000, purchaseAlertQty: 500, requestedBy: "Julian Thorne", effectiveFrom: "2024-01-01", effectiveTo: "2025-12-31", remarks: "", status: "Active" },
  ]} columns={[
    { key: "store", label: "Store" }, { key: "product", label: "Product" }, { key: "minimumStockPcs", label: "Min Stock" }, { key: "purchaseAlertQty", label: "Alert Qty" }, { key: "status", label: "Status" },
  ]} />;
}

