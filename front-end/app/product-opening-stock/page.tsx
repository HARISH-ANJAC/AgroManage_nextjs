"use client";

import MasterCrudPage from "@/components/MasterCrudPage";

export default function ProductOpeningStockPage() {
  return <MasterCrudPage
    domain="product-opening-stock" title="Product Opening Stock" description="Manage your product opening stock" idPrefix="POS" fields={[
    { key: "openingStockDate", label: "Opening Stock Date", type: "date", required: true },
    { key: "company", label: "Company", type: "text" },
    { key: "store", label: "Store", type: "text" },
    { key: "mainCategory", label: "Main Category", type: "text" },
    { key: "subCategory", label: "Sub Category", type: "text" },
    { key: "product", label: "Product", type: "text", required: true },
    { key: "totalQty", label: "Total Qty", type: "number", required: true },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "status", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
  ]} initialData={[
    { id: "POS001", openingStockDate: "2024-01-01", company: "AgroTanzania Ltd", store: "Dar es Salaam Main Warehouse", mainCategory: "Grains", subCategory: "Maize", product: "White Maize – Grade A", totalQty: 5000, remarks: "", status: "Active" },
  ]} columns={[
    { key: "product", label: "Product" }, { key: "store", label: "Store" }, { key: "totalQty", label: "Qty" }, { key: "openingStockDate", label: "Date" }, { key: "status", label: "Status" },
  ]} />;
}

