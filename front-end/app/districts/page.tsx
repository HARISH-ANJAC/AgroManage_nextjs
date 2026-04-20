"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData";
import { TANZANIA_ZONES } from "@/lib/validation";

export default function DistrictsPage() {
  const { data: districts } = useMasterData("districts");
  const { data: countries } = useMasterData("countries");
  const { data: regions } = useMasterData("regions");
  
  const countryOptions = (countries || []).map((c: any) => ({
    value: c.id,
    label: c.countryName
  }));

  return <MasterCrudPage
    domain="districts" title="Districts" description="Manage your districts" idPrefix="DST" fields={[
    { key: "districtName", label: "District Name", type: "text", required: true },
    { key: "countryId", label: "Country", type: "select", options: countryOptions },
    { 
      key: "regionId", 
      label: "Region", 
      type: "select", 
      dependsOn: "countryId",
      options: (form) => {
        if (!form.countryId) return [];
        return (regions || [])
          .filter((r: any) => String(r.countryId) === String(form.countryId))
          .map((r: any) => ({ value: r.id, label: r.regionName }));
      }
    },
    { key: "totalPopulation", label: "Total Population", type: "number" },
    { key: "zoneName", label: "Zone", type: "select", options: TANZANIA_ZONES },
    { key: "distanceFromArusha", label: "Distance from Arusha (km)", type: "number" },
    { key: "statusMaster", label: "Status", type: "select", required: true, options: ["Active", "Inactive"], defaultValue: "Active" },
  ]} initialData={districts || []} columns={[
    { key: "districtName", label: "District" }, 
    { key: "regionName", label: "Region" }, 
    { key: "countryName", label: "Country" }, 
    { key: "zoneName", label: "Zone" }, 
    { key: "statusMaster", label: "Status" },
  ]} />;
}
