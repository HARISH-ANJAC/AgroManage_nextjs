"use client";

import MasterCrudPage from "@/components/MasterCrudPage";

export default function ExchangeRatePage() {
  return <MasterCrudPage
    domain="exchange-rate" title="Exchange Rates" description="Manage your exchange rates" idPrefix="EXR" fields={[
    { key: "company", label: "Company", type: "text" },
    { key: "currency", label: "Currency", type: "text", required: true },
    { key: "exchangeRate", label: "Exchange Rate", type: "number", required: true },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "status", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
  ]} initialData={[
    { id: "EXR001", company: "AgroTanzania Ltd", currency: "USD", exchangeRate: 2650, remarks: "", status: "Active" },
    { id: "EXR002", company: "AgroTanzania Ltd", currency: "EUR", exchangeRate: 2900, remarks: "", status: "Active" },
  ]} columns={[
    { key: "company", label: "Company" }, { key: "currency", label: "Currency" }, { key: "exchangeRate", label: "Rate" }, { key: "status", label: "Status" },
  ]} />;
}

