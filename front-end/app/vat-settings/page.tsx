"use client";

import MasterCrudPage from "@/components/MasterCrudPage";

export default function VatSettingsPage() {
  return <MasterCrudPage
    domain="vat-settings" title="VAT Percentage Settings" description="Manage your VAT percentage settings" idPrefix="VAT" fields={[
    { key: "company", label: "Company", type: "text" },
    { key: "vatPercentage", label: "VAT Percentage (%)", type: "number", required: true },
    { key: "effectiveFrom", label: "Effective From", type: "date" },
    { key: "effectiveTo", label: "Effective To", type: "date" },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "status", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
  ]} initialData={[
    { id: "VAT001", company: "AgroTanzania Ltd", vatPercentage: 18, effectiveFrom: "2024-01-01", effectiveTo: "2025-12-31", remarks: "Standard VAT rate", status: "Active" },
  ]} columns={[
    { key: "company", label: "Company" }, { key: "vatPercentage", label: "VAT %" }, { key: "effectiveFrom", label: "From" }, { key: "effectiveTo", label: "To" }, { key: "status", label: "Status" },
  ]} />;
}

