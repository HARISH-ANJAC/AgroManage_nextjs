"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData";

export default function LocationsPage() {
  const { data: locations } = useMasterData("locations");

  return <MasterCrudPage
    domain="locations" title="Locations" description="Manage your locations" idPrefix="LOC" fields={[
      { key: "locationName", label: "Location Name", type: "text", required: true },
      { key: "locationDescription", label: "Description", type: "text" },
      { key: "remarks", label: "Remarks", type: "textarea" },
      { key: "statusMaster", label: "Status", type: "select", required: true, options: ["Active", "Inactive"], defaultValue: "Active" },
    ]} initialData={locations || []} columns={[
      { key: "locationName", label: "Name" }, { key: "locationDescription", label: "Description" }, { key: "statusMaster", label: "Status" },
    ]} />;
}

