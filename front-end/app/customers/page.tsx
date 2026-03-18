"use client";

import MasterCrudPage from "@/components/MasterCrudPage";

export default function CustomersPage() {
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
      { key: "billingLocation", label: "Billing Location", type: "text" },
      { key: "country", label: "Country", type: "text", placeholder: "e.g. Tanzania" },
      { key: "region", label: "Region", type: "text" },
      { key: "district", label: "District", type: "text" },
      { key: "currency", label: "Currency", type: "select", options: ["TZS", "USD", "EUR"] },
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
      { key: "status", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
    ]}
    initialData={[
      { id: "CUS001", customerName: "Metro Foods Inc", tinNumber: "TIN-5551234", vatNumber: "VAT-111", contactPerson: "David Mgonja", contactNumber: "+255 754 999888", phoneNumber2: "", emailAddress: "david@metrofoods.co.tz", location: "Dar es Salaam", natureOfBusiness: "Food Distribution", billingLocation: "Dar es Salaam HQ", country: "Tanzania", region: "Dar es Salaam", district: "Kinondoni", currency: "TZS", creditAllowed: "Yes", address: "Mikocheni, Dar es Salaam", tier: "Tier 1", companyHeadContactPerson: "CEO David", companyHeadPhoneNo: "+255 754 999888", companyHeadEmail: "ceo@metrofoods.co.tz", accountsContactPerson: "Finance Dept", accountsPhoneNo: "+255 754 999889", accountsEmail: "finance@metrofoods.co.tz", remarks: "", status: "Active" },
      { id: "CUS002", customerName: "East Africa Traders", tinNumber: "TIN-5559876", vatNumber: "VAT-222", contactPerson: "Amina Rashid", contactNumber: "+255 712 777666", phoneNumber2: "", emailAddress: "amina@eatraders.co.tz", location: "Mwanza", natureOfBusiness: "Trading", billingLocation: "Mwanza Office", country: "Tanzania", region: "Mwanza", district: "Nyamagana", currency: "TZS", creditAllowed: "Yes", address: "Pamba Road, Mwanza", tier: "Tier 2", companyHeadContactPerson: "", companyHeadPhoneNo: "", companyHeadEmail: "", accountsContactPerson: "", accountsPhoneNo: "", accountsEmail: "", remarks: "", status: "Active" },
      { id: "CUS003", customerName: "Green Valley Farms", tinNumber: "TIN-5554567", vatNumber: "VAT-333", contactPerson: "Peter Kato", contactNumber: "+255 789 555444", phoneNumber2: "", emailAddress: "peter@greenvalley.co.tz", location: "Arusha", natureOfBusiness: "Agriculture", billingLocation: "Arusha Office", country: "Tanzania", region: "Arusha", district: "Arusha City", currency: "USD", creditAllowed: "No", address: "Old Moshi Road, Arusha", tier: "Tier 1", companyHeadContactPerson: "", companyHeadPhoneNo: "", companyHeadEmail: "", accountsContactPerson: "", accountsPhoneNo: "", accountsEmail: "", remarks: "", status: "Active" },
    ]}
    columns={[
      { key: "customerName", label: "Customer Name" },
      { key: "tinNumber", label: "TIN" },
      { key: "contactPerson", label: "Contact" },
      { key: "contactNumber", label: "Phone" },
      { key: "emailAddress", label: "Email" },
      { key: "region", label: "Region" },
      { key: "creditAllowed", label: "Credit" },
      { key: "tier", label: "Tier" },
      { key: "status", label: "Status" },
    ]}
  />;
}

