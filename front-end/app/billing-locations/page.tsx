"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData";

export default function BillingLocationsPage() {
  const { data: billingLocations } = useMasterData("billing-locations");

  return <MasterCrudPage
    domain="billing-locations" title="Billing Locations" description="Manage your billing locations" idPrefix="BLO" fields={[
    { key: "billingLocationName", label: "Billing Location Name", type: "text", required: true },
    { key: "billingLocationDescription", label: "Description", type: "text" },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "statusMaster", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
  ]} initialData={billingLocations} columns={[
    { key: "billingLocationName", label: "Name" }, 
    { key: "billingLocationDescription", label: "Description" }, 
    { key: "statusMaster", label: "Status" },
  ]} />;
}
