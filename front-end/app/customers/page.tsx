"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData";

export default function CustomersPage() {
  const { data: customers, isLoading: loadingCustomers } = useMasterData("customers");
  const { data: countries } = useMasterData("countries");
  const { data: regions } = useMasterData("regions");
  const { data: districts } = useMasterData("districts");
  const { data: currencies } = useMasterData("currencies");
  const { data: billingLocations } = useMasterData("billing-locations");

  const countryOptions = countries?.map((c: any) => ({ value: c.id, label: c.countryName })) || [];
  const regionOptions = regions?.map((r: any) => ({ value: r.id, label: r.regionName })) || [];
  const districtOptions = districts?.map((d: any) => ({ value: d.id, label: d.districtName })) || [];
  const currencyOptions = currencies?.map((c: any) => ({ value: c.id, label: c.currencyName })) || [];
  const billingLocationOptions = billingLocations?.map((b: any) => ({ value: b.id, label: b.billingLocationName })) || [];

  return <MasterCrudPage
    domain="customers"
    title="Customers"
    description="Manage your customers"
    idPrefix="CUS"
    fields={[
      { key: "customerName", label: "Customer Name", type: "text", required: true },
      { key: "tinNumber", label: "TIN Number", type: "text", required: true },
      { key: "vatNumber", label: "VAT Number", type: "text" },
      { key: "contactPerson", label: "Contact Person", type: "text" },
      { key: "contactNumber", label: "Contact Number", type: "text" },
      { key: "phoneNumber2", label: "Phone Number 2", type: "text" },
      { key: "emailAddress", label: "Email Address", type: "text" },
      { key: "location", label: "Location", type: "text" },
      { key: "natureOfBusiness", label: "Nature of Business", type: "text" },
      { key: "billingLocationId", label: "Billing Location", type: "select", options: billingLocationOptions },
      { key: "countryId", label: "Country", type: "select", options: countryOptions },
      { key: "regionId", label: "Region", type: "select", options: regionOptions },
      { key: "districtId", label: "District", type: "select", options: districtOptions },
      { key: "currencyId", label: "Currency", type: "select", options: currencyOptions },
      { key: "creditAllowed", label: "Credit Allowed", type: "select", options: ["Yes", "No"] },
      { key: "address", label: "Address", type: "textarea" },
      { key: "tier", label: "Tier", type: "select", options: ["Tier 1", "Tier 2", "Tier 3"] },
      { key: "companyHeadContactPerson", label: "Company Head Contact Person", type: "text" },
      { key: "companyHeadPhoneNo", label: "Company Head Phone", type: "text" },
      { key: "companyHeadEmail", label: "Company Head Email", type: "text" },
      { key: "accountsContactPerson", label: "Accounts Contact Person", type: "text" },
      { key: "accountsPhoneNo", label: "Accounts Phone", type: "text" },
      { key: "accountsEmail", label: "Accounts Email", type: "text" },
      { key: "remarks", label: "Remarks", type: "textarea" },
      { key: "statusMaster", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
    ]}
    initialData={customers || []}
    columns={[
      { key: "customerName", label: "Customer Name" },
      { key: "tinNumber", label: "TIN" },
      { key: "contactPerson", label: "Contact" },
      { key: "contactNumber", label: "Phone" },
      { key: "emailAddress", label: "Email" },
      { key: "regionName", label: "Region" },
      { key: "creditAllowed", label: "Credit" },
      { key: "tier", label: "Tier" },
      { key: "statusMaster", label: "Status" },
    ]}
  />;
}
