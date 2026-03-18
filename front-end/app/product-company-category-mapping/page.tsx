"use client";

import MasterCrudPage from "@/components/MasterCrudPage";

export default function ProductCompanyCategoryMappingPage() {
  return <MasterCrudPage
    domain="product-company-category-mapping" title="Product Company Category Mapping" description="Manage your product company category mappings" idPrefix="PCM" fields={[
    { key: "company", label: "Company", type: "text", required: true },
    { key: "mainCategory", label: "Main Category", type: "text", required: true },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "status", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
  ]} initialData={[
    { id: "PCM001", company: "AgroTanzania Ltd", mainCategory: "Grains", remarks: "", status: "Active" },
    { id: "PCM002", company: "AgroTanzania Ltd", mainCategory: "Pulses", remarks: "", status: "Active" },
  ]} columns={[
    { key: "company", label: "Company" }, { key: "mainCategory", label: "Category" }, { key: "status", label: "Status" },
  ]} />;
}

