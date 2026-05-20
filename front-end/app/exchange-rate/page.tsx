"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData";
import { Calendar, ArrowRightLeft } from "lucide-react";

export default function ExchangeRatePage() {
  // Using plural "exchange-rates" to target the specialized controller
  const { data: exchangeRates } = useMasterData("exchange-rates");
  const { data: companies } = useMasterData("companies");
  const { data: currencies } = useMasterData("currencies");

  const companyOptions = companies?.map((c: any) => ({
    value: String(c.id || c.Company_Id || c.companyId),
    label: c.companyName || c.Company_Name
  })) || [];

  const currencyOptions = currencies?.map((c: any) => ({
    value: String(c.id || c.CURRENCY_ID || c.currencyId),
    label: `${c.address || c.CURRENCY_CODE || c.currencyCode || '???'} - ${c.currencyName || c.CURRENCY_NAME}`
  })) || [];

  return (
    <MasterCrudPage
      domain="exchange-rates"
      title="Exchange Rate Master"
      description="Manage daily currency conversion rates for multi-currency accounting."
      idPrefix="EXR"
      fields={[
        { key: "companyId", label: "Company", type: "select", options: companyOptions, required: true },
        { key: "currencyId", label: "Currency", type: "select", required: true, options: currencyOptions },
        { key: "exchangeRate", label: "Exchange Rate", type: "number", required: true, placeholder: "e.g. 1.0000" },
        { key: "effectiveDate", label: "Effective Date", type: "date", required: true },
        { key: "remarks", label: "Remarks", type: "textarea" },
        { key: "statusMaster", label: "Status", type: "select", required: true, options: ["Active", "Inactive"], defaultValue: "Active" },
      ]}
      initialData={exchangeRates || []}
      columns={[
        {
          key: "currencyName",
          label: "Currency",
          render: (val: any, row: any) => (
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-50 rounded-lg">
                <ArrowRightLeft className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <div className="font-bold text-slate-900">{row.currencyCode || row.address || val}</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">{row.currencyName || val}</div>
              </div>
            </div>
          )
        },
        { key: "companyName", label: "Company" },
        {
          key: "exchangeRate",
          label: "Rate (1 FC = ? LC)",
          render: (val: any) => (
            <div className="font-black text-slate-900 tabular-nums">
              {val ? Number(val).toFixed(2) : "0.00"}
            </div>
          )
        },
        {
          key: "effectiveDate",
          label: "Effective Date",
          render: (val: any) => (
            <div className="flex items-center gap-2 text-slate-500 font-medium">
              <Calendar className="w-3.5 h-3.5" />
              {val ? new Date(val).toLocaleDateString() : "N/A"}
            </div>
          )
        },
        { key: "statusMaster", label: "Status" },
      ]}
    />
  );
}
