"use client";

import MasterCrudPage from "@/components/MasterCrudPage";

export default function EmployeesPage() {
  return <MasterCrudPage
    domain="employees" title="Employees" description="Manage your employees" idPrefix="EMP" fields={[
    { key: "name", label: "Full Name", type: "text", required: true },
    { key: "role", label: "Role / Designation", type: "text" },
    { key: "department", label: "Department", type: "text" },
    { key: "phone", label: "Phone", type: "text" },
    { key: "email", label: "Email", type: "text" },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "status", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
  ]} initialData={[
    { id: "EMP001", name: "Julian Thorne", role: "Chief Agronomist", department: "Operations", phone: "+255 754 100200", email: "julian@agromanage.co.tz", remarks: "", status: "Active" },
    { id: "EMP002", name: "Sarah Kimani", role: "Procurement Manager", department: "Purchasing", phone: "+255 712 300400", email: "sarah@agromanage.co.tz", remarks: "", status: "Active" },
  ]} columns={[
    { key: "name", label: "Name" }, { key: "role", label: "Role" }, { key: "department", label: "Dept" }, { key: "phone", label: "Phone" }, { key: "status", label: "Status" },
  ]} />;
}

