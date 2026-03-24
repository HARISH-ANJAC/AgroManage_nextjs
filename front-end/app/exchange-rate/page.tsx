"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData";

export default function ExchangeRatePage() {
  const { data: exchangeRates } = useMasterData("exchange-rate");
  const { data: companies } = useMasterData("companies");
  const { data: currencies } = useMasterData("currencies");
  
  const companyOptions = companies?.map((c: any) => ({
    value: c.id,
    label: c.companyName
  })) || [];

  const currencyOptions = currencies?.map((c: any) => ({
    value: c.id,
    label: c.currencyName
  })) || [];

  return <MasterCrudPage
    domain="exchange-rate" title="Exchange Rates" description="Manage your exchange rates" idPrefix="EXR" fields={[
    { key: "companyId", label: "Company", type: "select", options: companyOptions },
    { key: "currencyId", label: "Currency", type: "select", required: true, options: currencyOptions },
    { key: "exchangeRate", label: "Exchange Rate", type: "number", required: true },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "statusMaster", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
  ]} initialData={exchangeRates || []} columns={[
    { key: "companyName", label: "Company" }, 
    { key: "currencyName", label: "Currency" }, 
    { key: "exchangeRate", label: "Rate" }, 
    { key: "statusMaster", label: "Status" },
  ]} />;
}
