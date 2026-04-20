"use client";

import MasterCrudPage from "@/components/MasterCrudPage";

export default function TaxMasterPage() {
  return <MasterCrudPage
    domain="tax-master" title="Tax Master" description="Tax rates and categories" idPrefix="TAX" fields={[
      { key: "name", label: "Tax Name", type: "text", required: true },
      { key: "rate", label: "Rate (%)", type: "number", required: true },
      { key: "description", label: "Description", type: "text" },
      { key: "statusMaster", label: "Status", type: "select", required: true, options: ["Active", "Inactive"], defaultValue: "Active" },
    ]} initialData={[
      { id: "TAX001", name: "VAT", rate: 18, description: "Value Added Tax", status: "Active" },
      { id: "TAX002", name: "Withholding Tax", rate: 2, description: "WHT on services", status: "Active" },
    ]} columns={[
      { key: "name", label: "Tax Name" }, { key: "rate", label: "Rate (%)" }, { key: "description", label: "Description" }, { key: "statusMaster", label: "Status" },
    ]} />;
}

