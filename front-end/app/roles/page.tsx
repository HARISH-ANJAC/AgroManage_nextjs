"use client";

import MasterCrudPage from "@/components/MasterCrudPage";

export default function RolesPage() {
  return <MasterCrudPage
    domain="roles" title="Roles" description="Manage your roles" idPrefix="ROL" fields={[
    { key: "roleName", label: "Role Name", type: "text", required: true },
    { key: "roleDescription", label: "Role Description", type: "text" },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "status", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
  ]} initialData={[
    { id: "ROL001", roleName: "Administrator", roleDescription: "Full system access", remarks: "", status: "Active" },
    { id: "ROL002", roleName: "Manager", roleDescription: "Department level access", remarks: "", status: "Active" },
    { id: "ROL003", roleName: "User", roleDescription: "Standard user access", remarks: "", status: "Active" },
    { id: "ROL004", roleName: "Viewer", roleDescription: "Read-only access", remarks: "", status: "Active" },
  ]} columns={[
    { key: "roleName", label: "Role" }, { key: "roleDescription", label: "Description" }, { key: "status", label: "Status" },
  ]} />;
}

