"use client";

import MasterCrudPage from "@/components/MasterCrudPage";

export default function RegionsPage() {
  return <MasterCrudPage
    domain="regions" title="Regions" description="Manage your regions" idPrefix="REG" fields={[
    { key: "regionName", label: "Region Name", type: "text", required: true },
    { key: "country", label: "Country", type: "text" },
    { key: "capital", label: "Capital", type: "text" },
    { key: "noOfDistricts", label: "No. of Districts", type: "number" },
    { key: "totalPopulation", label: "Total Population", type: "number" },
    { key: "zoneName", label: "Zone Name", type: "text" },
    { key: "distanceFromArusha", label: "Distance from Arusha (km)", type: "number" },
    { key: "status", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
  ]} initialData={[
    { id: "REG001", regionName: "Dar es Salaam", country: "Tanzania", capital: "Dar es Salaam", noOfDistricts: 5, totalPopulation: 5383728, zoneName: "Eastern", distanceFromArusha: 662, status: "Active" },
    { id: "REG002", regionName: "Arusha", country: "Tanzania", capital: "Arusha", noOfDistricts: 7, totalPopulation: 1694310, zoneName: "Northern", distanceFromArusha: 0, status: "Active" },
    { id: "REG003", regionName: "Mbeya", country: "Tanzania", capital: "Mbeya", noOfDistricts: 7, totalPopulation: 2707410, zoneName: "Southern Highlands", distanceFromArusha: 880, status: "Active" },
  ]} columns={[
    { key: "regionName", label: "Region" }, { key: "country", label: "Country" }, { key: "capital", label: "Capital" }, { key: "zoneName", label: "Zone" }, { key: "status", label: "Status" },
  ]} />;
}

