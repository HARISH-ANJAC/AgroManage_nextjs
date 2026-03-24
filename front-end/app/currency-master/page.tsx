"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData";

export default function CurrencyMasterPage() {
  const { data: currencies } = useMasterData("currencies");

  return <MasterCrudPage
    domain="currencies" title="Currencies" description="Manage your currencies" idPrefix="CUR" fields={[
    { key: "currencyName", label: "Currency Name", type: "text", required: true },
    { key: "exchangeRate", label: "Exchange Rate", type: "number" },
    { key: "address", label: "Symbol / Address", type: "text" },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "statusMaster", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
  ]} initialData={currencies} 
  columns={[
    { key: "currencyName", label: "Currency" }, { key: "address", label: "Symbol" }, { key: "exchangeRate", label: "Rate" }, { key: "statusMaster", label: "Status" },
  ]} />;
}
