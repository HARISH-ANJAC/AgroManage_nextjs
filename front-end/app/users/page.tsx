"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData";

export default function UsersPage() {
  const { data: users, isLoading: loadingUsers } = useMasterData("users");

  return <MasterCrudPage
    domain="users" title="Users" description="Manage your users" idPrefix="USR" fields={[
    { key: "loginName", label: "Login Name", type: "text", required: true },
    { key: "passwordUserHdr", label: "Password", type: "password", required: false, placeholder: "Default: [name]123" },
    { key: "roleUserHdr", label: "Role", type: "select", options: ["Super Admin", "Manager", "User", "Viewer"] },
    { key: "mobileNoUserHdr", label: "Mobile No", type: "text" },
    { key: "mailIdUserHdr", label: "Email", type: "text" },
    { key: "stockShowStatus", label: "Stock Show Status", type: "select", options: ["Y", "N"] },
    { key: "outsideAccessYN", label: "Outside Access", type: "select", options: ["Y", "N"] },
    { key: "remarksUserHdr", label: "Remarks", type: "textarea" },
    { key: "statusUserHdr", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
  ]} initialData={users} columns={[
    { key: "loginName", label: "Login" }, { key: "roleUserHdr", label: "Role" }, { key: "mobileNoUserHdr", label: "Mobile" }, { key: "mailIdUserHdr", label: "Email" }, { key: "statusUserHdr", label: "Status" },
  ]} />;
}
