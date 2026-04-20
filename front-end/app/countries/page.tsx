"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData";

export default function CountriesPage() {
  const { data: countries } = useMasterData("countries");

  return <MasterCrudPage
    domain="countries" title="Countries" description="Manage your countries" idPrefix="CTR" fields={[
      { key: "countryName", label: "Country Name", type: "text", required: true },
      { key: "nicename", label: "Nice Name", type: "text" },
      { key: "iso3", label: "ISO3 Code", type: "text" },
      { key: "numcode", label: "Num Code", type: "number" },
      { key: "phonecode", label: "Phone Code", type: "number" },
      { key: "batchNo", label: "Batch No", type: "text" },
      { key: "remarks", label: "Remarks", type: "textarea" },
      { key: "statusMaster", label: "Status", type: "select", required: true, options: ["Active", "Inactive"], defaultValue: "Active" },
    ]} initialData={countries}
    columns={[
      { key: "countryName", label: "Country" }, { key: "iso3", label: "ISO3" }, { key: "phonecode", label: "Phone Code" }, { key: "statusMaster", label: "Status" },
    ]} />;
}
