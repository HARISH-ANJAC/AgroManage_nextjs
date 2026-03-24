"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData";

export default function DistrictsPage() {
  const { data: countries } = useMasterData("countries");
  const { data: regions } = useMasterData("regions");
  
  const countryOptions = countries?.map((c: any) => ({
    value: c.id,
    label: c.countryName
  })) || [];

  const regionOptions = regions?.map((r: any) => ({
    value: r.id,
    label: r.regionName
  })) || [];

  return <MasterCrudPage
    domain="districts" title="Districts" description="Manage your districts" idPrefix="DST" fields={[
    { key: "districtName", label: "District Name", type: "text", required: true },
    { key: "countryId", label: "Country", type: "select", options: countryOptions },
    { key: "regionId", label: "Region", type: "select", options: regionOptions },
    { key: "totalPopulation", label: "Total Population", type: "number" },
    { key: "zoneName", label: "Zone Name", type: "text" },
    { key: "distanceFromArusha", label: "Distance from Arusha (km)", type: "number" },
    { key: "statusMaster", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
  ]} initialData={[]} columns={[
    { key: "districtName", label: "District" }, 
    { key: "regionName", label: "Region" }, 
    { key: "countryName", label: "Country" }, 
    { key: "zoneName", label: "Zone" }, 
    { key: "statusMaster", label: "Status" },
  ]} />;
}
