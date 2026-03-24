"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData";

export default function SalesPersonsPage() {
  const { data: salesPersons } = useMasterData("sales-persons");

  return <MasterCrudPage
    domain="sales-persons" title="Sales Persons" description="Manage your sales persons" idPrefix="SP" fields={[
    { key: "personName", label: "Person Name", type: "text", required: true },
    { key: "empId", label: "Employee ID", type: "number" },
    { key: "designationName", label: "Designation", type: "text" },
    { key: "salesContactPhone", label: "Contact Phone", type: "text" },
    { key: "salesPersonEmail", label: "Email", type: "text" },
    { key: "reportingManagerName", label: "Reporting Manager", type: "text" },
    { key: "reportingManagerEmail", label: "Manager Email", type: "text" },
    { key: "salesPersonDesignation", label: "Sales Designation", type: "text" },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "status", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
  ]} initialData={salesPersons} columns={[
    { key: "personName", label: "Name" }, { key: "designationName", label: "Designation" }, { key: "salesContactPhone", label: "Phone" }, { key: "reportingManagerName", label: "Manager" }, { key: "status", label: "Status" },
  ]} />;
}
