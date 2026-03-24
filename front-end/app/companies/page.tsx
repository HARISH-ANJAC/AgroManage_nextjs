"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData";

export default function CompaniesPage() {
  const { data: companies, isLoading: loadingCompanies } = useMasterData("companies");
  const { data: currencies, isLoading: loadingCurrencies } = useMasterData("currencies");

  if (loadingCurrencies || loadingCompanies) return <div className="p-8 text-center text-muted-foreground font-medium">Loading data...</div>;

  const currencyOptions = currencies.map((c: any) => ({ value: c.id, label: c.currencyName }));

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
    { key: "webSite", label: "Website", type: "text" },
    { key: "currencyId", label: "Currency", type: "select", options: currencyOptions },
    { key: "financeStartMonth", label: "Finance Start Month", type: "text", placeholder: "e.g. July" },
    { key: "financeEndMonth", label: "Finance End Month", type: "text", placeholder: "e.g. June" },
    { key: "yearCode", label: "Year Code", type: "text" },
    { key: "timeZone", label: "TimeZone", type: "text", placeholder: "e.g. EAT" },
    { key: "noOfUser", label: "No. of Users", type: "number" },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "statusMaster", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
  ]} initialData={companies}
  columns={[
    { key: "companyName", label: "Name" }, { key: "tinNumber", label: "TIN" }, { key: "contactPerson", label: "Contact" }, { key: "email", label: "Email" }, { key: "statusMaster", label: "Status" },
  ]} />;
}
