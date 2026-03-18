"use client";

import MasterCrudPage from "@/components/MasterCrudPage";

export default function UsersPage() {
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
  ]} initialData={[
    { id: "USR001", loginName: "julian.thorne", role: "Administrator", mobileNo: "+255 754 100200", mailId: "julian@agromanage.co.tz", stockShowStatus: "Yes", outsideAccess: "Yes", remarks: "", status: "Active" },
    { id: "USR002", loginName: "sarah.kimani", role: "Manager", mobileNo: "+255 712 300400", mailId: "sarah@agromanage.co.tz", stockShowStatus: "Yes", outsideAccess: "No", remarks: "", status: "Active" },
  ]} columns={[
    { key: "loginName", label: "Login" }, { key: "role", label: "Role" }, { key: "mobileNo", label: "Mobile" }, { key: "mailId", label: "Email" }, { key: "status", label: "Status" },
  ]} />;
}

