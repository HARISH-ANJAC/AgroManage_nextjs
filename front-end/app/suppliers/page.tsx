"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData"; 

export default function SuppliersPage() {
  const { data: suppliers, isLoading: loadingSuppliers } = useMasterData("suppliers");
  const { data: countries } = useMasterData("countries");
  const { data: regions } = useMasterData("regions");
  const { data: districts } = useMasterData("districts");

  const countryOptions = countries?.map((c: any) => ({ value: c.id, label: c.countryName })) || [];
  const regionOptions = regions?.map((r: any) => ({ value: r.id, label: r.regionName })) || [];
  const districtOptions = districts?.map((d: any) => ({ value: d.id, label: d.districtName })) || [];

  return <MasterCrudPage
    domain="suppliers"
    title="Suppliers"
    description="Manage your supplier network and vendor relationships"
    idPrefix="SUP"
    fields={[
      { key: "supplierType", label: "Supplier Type", type: "select", options: ["Local", "International", "Agent"], placeholder: "Select type" },
      { key: "supplierName", label: "Supplier Name", type: "text", required: true },
      { key: "tinNumber", label: "TIN Number", type: "text" },
      { key: "vatRegisterNo", label: "VAT Register No", type: "text" },
      { key: "shNickName", label: "Short/Nick Name", type: "text" },
      { key: "shipmentMode", label: "Shipment Mode", type: "select", options: ["Road Transport", "Rail", "Sea", "Air"] },
      { key: "countryId", label: "Country", type: "select", options: countryOptions },
      { key: "regionId", label: "Region", type: "select", options: regionOptions },
      { key: "districtId", label: "District", type: "select", options: districtOptions },
      { key: "address", label: "Address", type: "textarea" },
      { key: "contactPerson", label: "Contact Person", type: "text" },
      { key: "phoneNumber", label: "Phone Number", type: "text" },
      { key: "mailId", label: "Email", type: "text" },
      { key: "fax", label: "Fax", type: "text" },
      { key: "vatPercentage", label: "VAT Percentage (%)", type: "number" },
      { key: "withholdingVatPercentage", label: "Withholding VAT (%)", type: "number" },
      { key: "remarks", label: "Remarks", type: "textarea" },
      { key: "statusMaster", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
    ]}
    initialData={suppliers || []}
    columns={[
      { key: "supplierName", label: "Supplier Name" },
      { key: "supplierType", label: "Type" },
      { key: "contactPerson", label: "Contact" },
      { key: "phoneNumber", label: "Phone" },
      { key: "tinNumber", label: "TIN" },
      { key: "vatRegisterNo", label: "VAT Reg" },
      { key: "countryName", label: "Country" },
      { key: "regionName", label: "Region" },
      { key: "statusMaster", label: "Status" },
    ]}
  />;
}
