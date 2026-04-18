"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData";
import { enforceValidation, formatTanzaniaPhone, cleanPhoneForStorage } from "@/lib/validation";
import { MONTHS, TIMEZONES, YEARS } from "@/lib/utils";

export default function CompaniesPage() {
  const { data: companies, isLoading: loadingCompanies } = useMasterData("companies");
  const { data: currencies, isLoading: loadingCurrencies } = useMasterData("currencies");

  if (loadingCurrencies || loadingCompanies) return <div className="p-8 text-center text-muted-foreground font-medium">Loading data...</div>;

  const currencyOptions = currencies.map((c: any) => ({ value: c.id, label: c.currencyName }));

  const masterData = useMasterData("companies", companies);

  const customOverrides = {
    ...masterData,
    add: async (item: any) => {
      enforceValidation(item);
      const cleanedItem = { ...item, contactNumber: cleanPhoneForStorage(item.contactNumber) };
      return masterData.add(cleanedItem);
    },
    update: async (item: any) => {
      enforceValidation(item);
      const cleanedItem = { ...item, contactNumber: cleanPhoneForStorage(item.contactNumber) };
      return masterData.update(cleanedItem);
    }
  };

  return <MasterCrudPage
    domain="companies" title="Companies" description="Manage your companies" idPrefix="CMP" fields={[
      { key: "companyName", label: "Company Name", type: "text", required: true },
      { key: "companyFullName", label: "Company Full Name", type: "text" },
      { key: "tinNumber", label: "TIN Number", type: "text", required: true, placeholder: "Exactly 9 digits", maxLength: 9 },
      { key: "address", label: "Address", type: "textarea" },
      { key: "contactPerson", label: "Contact Person", type: "text" },
      { key: "contactNumber", label: "Contact Number", type: "text", placeholder: "+255 XX XXX XXXX", formatter: formatTanzaniaPhone },
      { key: "email", label: "Email", type: "text", placeholder: "example@domain.com" },
      { key: "shortCode", label: "Short Code", type: "text", placeholder: "Max 4 chars", maxLength: 4 },
      { key: "website", label: "Website", type: "text", placeholder: "http://...", formatter: (val: string) => val },
      { key: "currencyId", label: "Currency", type: "select", options: currencyOptions },
      { key: "financeStartMonth", label: "Finance Start Month", type: "select", options: MONTHS },
      { key: "financeEndMonth", label: "Finance End Month", type: "select", options: MONTHS },
      { key: "yearCode", label: "Year Code", type: "select", options: YEARS, defaultValue: new Date().getFullYear().toString() },
      { key: "timezone", label: "TimeZone", type: "select", options: TIMEZONES, defaultValue: "Select Time Zone" },
      { key: "noOfUser", label: "No. of Users", type: "number" },
      { key: "remarks", label: "Remarks", type: "textarea" },
      { key: "statusMaster", label: "Status", type: "select", required: true, options: ["Active", "Inactive"], defaultValue: "Active" },
    ]} initialData={companies}
    customStoreOverrides={customOverrides}
    columns={[
      { key: "companyName", label: "Name" },
      { key: "tinNumber", label: "TIN" },
      { key: "contactPerson", label: "Contact" },
      { key: "contactNumber", label: "Phone", render: (val) => formatTanzaniaPhone(val) },
      { key: "email", label: "Email" },
      { key: "statusMaster", label: "Status" },
    ]} />;
}
