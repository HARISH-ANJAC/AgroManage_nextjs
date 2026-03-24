"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData";

export default function UsersPage() {
  const { data: users, isLoading: loadingUsers } = useMasterData("users");

  return <MasterCrudPage
    domain="users" title="Users" description="Manage your users" idPrefix="USR" fields={[
    { key: "loginName", label: "Login Name", type: "text", required: true },
    { key: "role", label: "Role", type: "select", options: ["Administrator", "Manager", "User", "Viewer"] },
    { key: "mobileNo", label: "Mobile No", type: "text" },
    { key: "mailId", label: "Email", type: "text" },
    { key: "stockShowStatus", label: "Stock Show Status", type: "select", options: ["Yes", "No"] },
    { key: "outsideAccess", label: "Outside Access", type: "select", options: ["Yes", "No"] },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "status", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
  ]} initialData={users} columns={[
    { key: "loginName", label: "Login" }, { key: "role", label: "Role" }, { key: "mobileNo", label: "Mobile" }, { key: "mailId", label: "Email" }, { key: "status", label: "Status" },
  ]} />;
}
