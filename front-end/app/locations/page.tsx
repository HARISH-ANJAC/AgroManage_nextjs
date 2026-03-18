"use client";

import MasterCrudPage from "@/components/MasterCrudPage";

export default function LocationsPage() {
  return <MasterCrudPage
    domain="locations" title="Locations" description="Manage your locations" idPrefix="LOC" fields={[
    { key: "locationName", label: "Location Name", type: "text", required: true },
    { key: "locationDescription", label: "Description", type: "text" },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "status", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
  ]} initialData={[
    { id: "LOC001", locationName: "Dar es Salaam", locationDescription: "Capital city hub", remarks: "", status: "Active" },
    { id: "LOC002", locationName: "Arusha", locationDescription: "Northern region hub", remarks: "", status: "Active" },
    { id: "LOC003", locationName: "Mbeya", locationDescription: "Southern highlands", remarks: "", status: "Active" },
  ]} columns={[
    { key: "locationName", label: "Name" }, { key: "locationDescription", label: "Description" }, { key: "status", label: "Status" },
  ]} />;
}

