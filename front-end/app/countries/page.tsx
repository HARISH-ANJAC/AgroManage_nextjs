"use client";

import MasterCrudPage from "@/components/MasterCrudPage";

export default function CountriesPage() {
  return <MasterCrudPage
    domain="countries" title="Countries" description="Manage your countries" idPrefix="CTR" fields={[
    { key: "countryName", label: "Country Name", type: "text", required: true },
    { key: "nicename", label: "Nice Name", type: "text" },
    { key: "iso3", label: "ISO3 Code", type: "text" },
    { key: "numcode", label: "Num Code", type: "number" },
    { key: "phonecode", label: "Phone Code", type: "number" },
    { key: "batchNo", label: "Batch No", type: "text" },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "status", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
  ]} initialData={[
    { id: "CTR001", countryName: "TANZANIA", nicename: "Tanzania", iso3: "TZA", numcode: 834, phonecode: 255, batchNo: "TZ", remarks: "", status: "Active" },
    { id: "CTR002", countryName: "KENYA", nicename: "Kenya", iso3: "KEN", numcode: 404, phonecode: 254, batchNo: "KE", remarks: "", status: "Active" },
    { id: "CTR003", countryName: "UGANDA", nicename: "Uganda", iso3: "UGA", numcode: 800, phonecode: 256, batchNo: "UG", remarks: "", status: "Active" },
  ]} columns={[
    { key: "countryName", label: "Country" }, { key: "iso3", label: "ISO3" }, { key: "phonecode", label: "Phone Code" }, { key: "status", label: "Status" },
  ]} />;
}

