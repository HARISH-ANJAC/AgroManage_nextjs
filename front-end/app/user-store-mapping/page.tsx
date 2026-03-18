"use client";

import MasterCrudPage from "@/components/MasterCrudPage";

export default function UserStoreMappingPage() {
  return <MasterCrudPage
    domain="user-store-mapping" title="User-Store Mapping" description="Manage your user to store mappings" idPrefix="USM" fields={[
    { key: "user", label: "User", type: "text", required: true },
    { key: "company", label: "Company", type: "text" },
    { key: "store", label: "Store", type: "text", required: true },
    { key: "role", label: "Role", type: "text" },
    { key: "status", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
  ]} initialData={[
    { id: "USM001", user: "julian.thorne", company: "AgroTanzania Ltd", store: "Dar es Salaam Main Warehouse", role: "Administrator", status: "Active" },
    { id: "USM002", user: "sarah.kimani", company: "AgroTanzania Ltd", store: "Dar es Salaam Main Warehouse", role: "Manager", status: "Active" },
  ]} columns={[
    { key: "user", label: "User" }, { key: "company", label: "Company" }, { key: "store", label: "Store" }, { key: "role", label: "Role" }, { key: "status", label: "Status" },
  ]} />;
}

