"use client";

import MasterCrudPage from "@/components/MasterCrudPage";

export default function DistrictsPage() {
  return <MasterCrudPage
    domain="districts" title="Districts" description="Manage your districts" idPrefix="DST" fields={[
    { key: "districtName", label: "District Name", type: "text", required: true },
    { key: "country", label: "Country", type: "text" },
    { key: "region", label: "Region", type: "text" },
    { key: "totalPopulation", label: "Total Population", type: "number" },
    { key: "zoneName", label: "Zone Name", type: "text" },
    { key: "distanceFromArusha", label: "Distance from Arusha (km)", type: "number" },
    { key: "status", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
  ]} initialData={[
    { id: "DST001", districtName: "Ilala", country: "Tanzania", region: "Dar es Salaam", totalPopulation: 1220611, zoneName: "Eastern", distanceFromArusha: 662, status: "Active" },
    { id: "DST002", districtName: "Kinondoni", country: "Tanzania", region: "Dar es Salaam", totalPopulation: 1775049, zoneName: "Eastern", distanceFromArusha: 662, status: "Active" },
    { id: "DST003", districtName: "Arusha City", country: "Tanzania", region: "Arusha", totalPopulation: 416442, zoneName: "Northern", distanceFromArusha: 0, status: "Active" },
  ]} columns={[
    { key: "districtName", label: "District" }, { key: "region", label: "Region" }, { key: "zoneName", label: "Zone" }, { key: "status", label: "Status" },
  ]} />;
}

