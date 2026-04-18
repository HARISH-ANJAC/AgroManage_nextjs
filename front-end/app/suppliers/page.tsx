"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData";
import { enforceSupplierValidation, formatTanzaniaPhone, cleanPhoneForStorage } from "@/lib/validation";

export default function SuppliersPage() {
  const masterData = useMasterData("suppliers");
  const { data: suppliers, isLoading: loadingSuppliers } = masterData;
  const { data: countries } = useMasterData("countries");
  const { data: regions } = useMasterData("regions");
  const { data: districts } = useMasterData("districts");

  const countryOptions = countries?.map((c: any) => ({ value: c.id, label: c.countryName })) || [];
  const regionOptions = regions?.map((r: any) => ({ value: r.id, label: r.regionName })) || [];
  const districtOptions = districts?.map((d: any) => ({ value: d.id, label: d.districtName })) || [];

  const customOverrides = {
    ...masterData,
    add: async (item: any) => {
      enforceSupplierValidation(item);
      const cleanedItem = { ...item, phoneNumber: cleanPhoneForStorage(item.phoneNumber) };
      return masterData.add(cleanedItem);
    },
    update: async (item: any) => {
      enforceSupplierValidation(item);
      const cleanedItem = { ...item, phoneNumber: cleanPhoneForStorage(item.phoneNumber) };
      return masterData.update(cleanedItem);
    }
  };

  return <MasterCrudPage
    domain="suppliers"
    title="Suppliers"
    description="Manage your supplier network and vendor relationships"
    idPrefix="SUP"
    customStoreOverrides={customOverrides}
    fields={[
      { key: "supplierType", label: "Supplier Type", type: "select", options: ["Local", "International", "Agent"], placeholder: "Select type" },
      { key: "supplierName", label: "Supplier Name", type: "text", required: true },
      { key: "tinNumber", label: "TIN Number", type: "text", placeholder: "Exactly 9 digits", maxLength: 9 },
      { key: "vatRegisterNo", label: "VAT Register No", type: "text" },
      { key: "shNickName", label: "Short/Nick Name", type: "text" },
      { key: "shipmentMode", label: "Shipment Mode", type: "select", options: ["Road Transport", "Sea", "Air"] },
      { key: "countryId", label: "Country", type: "select", options: countryOptions },
      { 
        key: "regionId", 
        label: "Region", 
        type: "select", 
        dependsOn: "countryId",
        options: (form) => {
          if (!form.countryId) return [];
          return regions
            ?.filter((r: any) => String(r.countryId) === String(form.countryId))
            ?.map((r: any) => ({ value: r.id, label: r.regionName })) || [];
        }
      },
      { 
        key: "districtId", 
        label: "District", 
        type: "select", 
        dependsOn: "regionId",
        options: (form) => {
          if (!form.regionId) return [];
          return districts
            ?.filter((d: any) => String(d.regionId) === String(form.regionId))
            ?.map((d: any) => ({ value: d.id, label: d.districtName })) || [];
        }
      },
      { key: "address", label: "Address", type: "textarea" },
      { key: "contactPerson", label: "Contact Person", type: "text" },
      { key: "phoneNumber", label: "Phone Number", type: "text", placeholder: "+255 XX XXX XXXX", formatter: formatTanzaniaPhone },
      { key: "mailId", label: "Email", type: "text", placeholder: "example@domain.com" },
      { key: "fax", label: "Fax", type: "text" },
      { key: "vatPercentage", label: "VAT Percentage (%)", type: "number" },
      { key: "withholdingVatPercentage", label: "Withholding VAT (%)", type: "number" },
      { key: "remarks", label: "Remarks", type: "textarea" },
      { key: "statusMaster", label: "Status", type: "select", required: true, options: ["Active", "Inactive"], defaultValue: "Active" },
    ]}
    initialData={suppliers || []}
    columns={[
      { key: "supplierName", label: "Supplier Name" },
      { key: "supplierType", label: "Type" },
      { key: "contactPerson", label: "Contact" },
      { key: "phoneNumber", label: "Phone", render: (val) => formatTanzaniaPhone(val) },
      { key: "tinNumber", label: "TIN" },
      { key: "vatRegisterNo", label: "VAT Reg" },
      { key: "countryId", label: "Country" },
      { key: "regionId", label: "Region" },
      { key: "statusMaster", label: "Status" },
    ]}
  />;
}
