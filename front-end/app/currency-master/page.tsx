"use client";

import MasterCrudPage from "@/components/MasterCrudPage";

export default function CurrencyMasterPage() {
  return <MasterCrudPage
    domain="currency-master" title="Currencies" description="Manage your currencies" idPrefix="CUR" fields={[
    { key: "currencyName", label: "Currency Name", type: "text", required: true },
    { key: "exchangeRate", label: "Exchange Rate", type: "number" },
    { key: "address", label: "Symbol / Address", type: "text" },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "status", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
  ]} initialData={[
    { id: "CUR001", currencyName: "Tanzanian Shilling", exchangeRate: 1, address: "TZS", remarks: "Base currency", status: "Active" },
    { id: "CUR002", currencyName: "US Dollar", exchangeRate: 2650, address: "USD", remarks: "", status: "Active" },
    { id: "CUR003", currencyName: "Euro", exchangeRate: 2900, address: "EUR", remarks: "", status: "Active" },
  ]} columns={[
    { key: "currencyName", label: "Currency" }, { key: "address", label: "Symbol" }, { key: "exchangeRate", label: "Rate" }, { key: "status", label: "Status" },
  ]} />;
}

