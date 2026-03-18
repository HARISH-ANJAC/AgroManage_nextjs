"use client";

import MasterCrudPage from "@/components/MasterCrudPage";

export default function BillingLocationsPage() {
  return <MasterCrudPage
    domain="billing-locations" title="Billing Locations" description="Manage your billing locations" idPrefix="BLO" fields={[
    { key: "billingLocationName", label: "Billing Location Name", type: "text", required: true },
    { key: "billingLocationDescription", label: "Description", type: "text" },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "status", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
  ]} initialData={[
    { id: "BLO001", billingLocationName: "Dar es Salaam HQ", billingLocationDescription: "Main billing", remarks: "", status: "Active" },
    { id: "BLO002", billingLocationName: "Arusha Office", billingLocationDescription: "Northern region", remarks: "", status: "Active" },
  ]} columns={[
    { key: "billingLocationName", label: "Name" }, { key: "billingLocationDescription", label: "Description" }, { key: "status", label: "Status" },
  ]} />;
}

