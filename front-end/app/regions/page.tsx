"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData";

export default function RegionsPage() {
  const { data: regions } = useMasterData("regions");
  const { data: countries } = useMasterData("countries");
  
  const countryOptions = (countries || []).map((c: any) => ({
    value: c.id,
    label: c.countryName
  }));

  return <MasterCrudPage
    domain="regions" title="Regions" description="Manage your regions" idPrefix="REG" fields={[
    { key: "regionName", label: "Region Name", type: "text", required: true },
    { key: "countryId", label: "Country", type: "select", options: countryOptions },
    { key: "capital", label: "Capital", type: "text" },
    { key: "noOfDistricts", label: "No. of Districts", type: "number" },
    { key: "totalPopulation", label: "Total Population", type: "number" },
    { key: "zoneName", label: "Zone Name", type: "text" },
    { key: "distanceFromArusha", label: "Distance from Arusha (km)", type: "number" },
    { key: "statusMaster", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
  ]} initialData={regions || []} columns={[
    { key: "regionName", label: "Region" }, 
    { key: "countryName", label: "Country" }, 
    { key: "capital", label: "Capital" }, 
    { key: "zoneName", label: "Zone" }, 
    { key: "statusMaster", label: "Status" },
  ]} />;
}
