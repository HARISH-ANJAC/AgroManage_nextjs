"use client";

import MasterCrudPage from "@/components/MasterCrudPage";

export default function ProductsPage() {
  return <MasterCrudPage
    domain="products"
    title="Products"
    description="Manage your agricultural products and inventory catalog"
    idPrefix="PRD"
    fields={[
      { key: "productName", label: "Product Name", type: "text", required: true },
      { key: "mainCategory", label: "Main Category", type: "select", required: true, options: ["Grains", "Pulses", "Fertilizers", "Seeds", "Spices"] },
      { key: "subCategory", label: "Sub Category", type: "text", required: true },
      { key: "uom", label: "Unit of Measure (UOM)", type: "text", placeholder: "e.g. KG, MT, BAG" },
      { key: "qtyPerPacking", label: "Qty Per Packing", type: "number" },
      { key: "alternateUom", label: "Alternate UOM", type: "text" },
      { key: "shortCode", label: "Short Code", type: "text", placeholder: "e.g. MA, RI" },
      { key: "remarks", label: "Remarks", type: "textarea" },
      { key: "status", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
    ]}
    initialData={[
      { id: "PRD001", productName: "White Maize – Grade A", mainCategory: "Grains", subCategory: "Maize", uom: "KG", qtyPerPacking: 50, alternateUom: "BAG", shortCode: "MA", remarks: "", status: "Active" },
      { id: "PRD002", productName: "Yellow Maize – Standard", mainCategory: "Grains", subCategory: "Maize", uom: "KG", qtyPerPacking: 50, alternateUom: "BAG", shortCode: "MA", remarks: "", status: "Active" },
      { id: "PRD003", productName: "Hard Wheat", mainCategory: "Grains", subCategory: "Wheat", uom: "KG", qtyPerPacking: 50, alternateUom: "BAG", shortCode: "WH", remarks: "", status: "Active" },
      { id: "PRD004", productName: "IR64 Rice", mainCategory: "Grains", subCategory: "Rice", uom: "KG", qtyPerPacking: 25, alternateUom: "BAG", shortCode: "RI", remarks: "", status: "Active" },
      { id: "PRD005", productName: "Red Kidney Beans", mainCategory: "Pulses", subCategory: "Beans", uom: "KG", qtyPerPacking: 50, alternateUom: "BAG", shortCode: "BE", remarks: "", status: "Active" },
      { id: "PRD006", productName: "NPK 17:17:17", mainCategory: "Fertilizers", subCategory: "NPK Fertilizer", uom: "KG", qtyPerPacking: 50, alternateUom: "BAG", shortCode: "FE", remarks: "", status: "Active" },
      { id: "PRD007", productName: "Karafu", mainCategory: "Spices", subCategory: "Karafu", uom: "KG", qtyPerPacking: 25, alternateUom: "BAG", shortCode: "KA", remarks: "", status: "Active" },
    ]}
    columns={[
      { key: "productName", label: "Product Name" },
      { key: "mainCategory", label: "Category" },
      { key: "subCategory", label: "Sub Category" },
      { key: "uom", label: "UOM" },
      { key: "qtyPerPacking", label: "Qty/Pack" },
      { key: "alternateUom", label: "Alt UOM" },
      { key: "shortCode", label: "Code" },
      { key: "status", label: "Status" },
    ]}
  />;
}

