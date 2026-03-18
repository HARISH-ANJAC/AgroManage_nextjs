"use client";

import MasterCrudPage from "@/components/MasterCrudPage";

export default function CompaniesPage() {
  return <MasterCrudPage
    domain="companies" title="Companies" description="Manage your companies" idPrefix="CMP" fields={[
    { key: "companyName", label: "Company Name", type: "text", required: true },
    { key: "companyFullName", label: "Company Full Name", type: "text" },
    { key: "tinNumber", label: "TIN Number", type: "text", required: true },
    { key: "address", label: "Address", type: "textarea" },
    { key: "contactPerson", label: "Contact Person", type: "text" },
    { key: "contactNumber", label: "Contact Number", type: "text" },
    { key: "email", label: "Email", type: "text" },
    { key: "shortCode", label: "Short Code", type: "text", placeholder: "Max 4 chars" },
    { key: "website", label: "Website", type: "text" },
    { key: "currency", label: "Currency", type: "select", options: ["TZS", "USD", "EUR"] },
    { key: "financeStartMonth", label: "Finance Start Month", type: "text", placeholder: "e.g. July" },
    { key: "financeEndMonth", label: "Finance End Month", type: "text", placeholder: "e.g. June" },
    { key: "yearCode", label: "Year Code", type: "text" },
    { key: "timeZone", label: "TimeZone", type: "text", placeholder: "e.g. EAT" },
    { key: "noOfUser", label: "No. of Users", type: "number" },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "status", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
  ]} initialData={[
    { id: "CMP001", companyName: "AgroTanzania Ltd", companyFullName: "AgroTanzania Limited", tinNumber: "TIN-001", address: "Dar es Salaam", contactPerson: "Julian Thorne", contactNumber: "+255 22 123456", email: "info@agrotanzania.co.tz", shortCode: "AGTZ", website: "www.agrotanzania.co.tz", currency: "TZS", financeStartMonth: "July", financeEndMonth: "June", yearCode: "2025-26", timeZone: "EAT", noOfUser: 25, remarks: "", status: "Active" },
  ]} columns={[
    { key: "companyName", label: "Name" }, { key: "tinNumber", label: "TIN" }, { key: "contactPerson", label: "Contact" }, { key: "email", label: "Email" }, { key: "currency", label: "Currency" }, { key: "status", label: "Status" },
  ]} />;
}

