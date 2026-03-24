"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData";

export default function RolesPage() {
  const { data: roles } = useMasterData("roles");

  return <MasterCrudPage
    domain="roles" title="Roles" description="Manage your roles" idPrefix="ROL" fields={[
    { key: "roleName", label: "Role Name", type: "text", required: true },
    { key: "roleDescription", label: "Role Description", type: "text" },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "statusMaster", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
  ]} initialData={roles} 
  columns={[
    { key: "roleName", label: "Role" }, { key: "roleDescription", label: "Description" }, { key: "statusMaster", label: "Status" },
  ]} />;
}
