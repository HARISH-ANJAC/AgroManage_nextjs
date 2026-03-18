"use client";

import MasterCrudPage from "@/components/MasterCrudPage";

export default function StoresPage() {
  return <MasterCrudPage
    domain="stores" title="Stores" description="Manage your stores" idPrefix="STR" fields={[
    { key: "storeName", label: "Store Name", type: "text", required: true },
    { key: "storeShortCode", label: "Short Code", type: "text" },
    { key: "storeShortName", label: "Short Name", type: "text" },
    { key: "location", label: "Location", type: "text" },
    { key: "managerName", label: "Manager Name", type: "text" },
    { key: "emailAddress", label: "Email Address", type: "text" },
    { key: "ccEmailAddress", label: "CC Email Address", type: "text" },
    { key: "bccEmailAddress", label: "BCC Email Address", type: "text" },
    { key: "responseDirectorsName", label: "Response Directors Name", type: "text" },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "status", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
  ]} initialData={[
    { id: "STR001", storeName: "Dar es Salaam Main Warehouse", storeShortCode: "DSM", storeShortName: "DSM Main", location: "Dar es Salaam", managerName: "James Kondo", emailAddress: "dsm@agromanage.co.tz", ccEmailAddress: "", bccEmailAddress: "", responseDirectorsName: "Julian Thorne", remarks: "", status: "Active" },
    { id: "STR002", storeName: "Mbeya Storage Facility", storeShortCode: "MBY", storeShortName: "Mbeya Store", location: "Mbeya", managerName: "Rose Mwita", emailAddress: "mbeya@agromanage.co.tz", ccEmailAddress: "", bccEmailAddress: "", responseDirectorsName: "", remarks: "", status: "Active" },
  ]} columns={[
    { key: "storeName", label: "Store" }, { key: "storeShortCode", label: "Code" }, { key: "location", label: "Location" }, { key: "managerName", label: "Manager" }, { key: "emailAddress", label: "Email" }, { key: "status", label: "Status" },
  ]} />;
}

