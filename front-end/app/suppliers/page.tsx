"use client";

import MasterCrudPage from "@/components/MasterCrudPage";

export default function SuppliersPage() {
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
      { key: "country", label: "Country", type: "text", placeholder: "e.g. Tanzania" },
      { key: "region", label: "Region", type: "text" },
      { key: "district", label: "District", type: "text" },
      { key: "address", label: "Address", type: "textarea" },
      { key: "contactPerson", label: "Contact Person", type: "text" },
      { key: "phoneNumber", label: "Phone Number", type: "text" },
      { key: "mailId", label: "Email", type: "text" },
      { key: "fax", label: "Fax", type: "text" },
      { key: "vatPercentage", label: "VAT Percentage (%)", type: "number" },
      { key: "withholdingVatPercentage", label: "Withholding VAT (%)", type: "number" },
      { key: "remarks", label: "Remarks", type: "textarea" },
      { key: "status", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
    ]}
    initialData={[
      { id: "SUP001", supplierType: "Local", supplierName: "Kilimo Bora Suppliers", tinNumber: "TIN-1234567", vatRegisterNo: "VAT-001", shNickName: "KBS", shipmentMode: "Road Transport", country: "Tanzania", region: "Dar es Salaam", district: "Ilala", address: "Kariakoo, Dar es Salaam", contactPerson: "John Mwangi", phoneNumber: "+255 754 123456", mailId: "john@kilimobora.co.tz", fax: "", vatPercentage: 18, withholdingVatPercentage: 2, remarks: "", status: "Active" },
      { id: "SUP002", supplierType: "Local", supplierName: "Agro-Inputs Ltd", tinNumber: "TIN-7654321", vatRegisterNo: "VAT-002", shNickName: "AIL", shipmentMode: "Road Transport", country: "Tanzania", region: "Arusha", district: "Arusha City", address: "Sokoine Road, Arusha", contactPerson: "Sarah Kimani", phoneNumber: "+255 712 654321", mailId: "sarah@agroinputs.co.tz", fax: "", vatPercentage: 18, withholdingVatPercentage: 2, remarks: "", status: "Active" },
      { id: "SUP003", supplierType: "Local", supplierName: "Mbeya Rice Mills", tinNumber: "TIN-9876543", vatRegisterNo: "VAT-003", shNickName: "MRM", shipmentMode: "Road Transport", country: "Tanzania", region: "Mbeya", district: "Mbeya City", address: "Industrial Area, Mbeya", contactPerson: "Ali Hassan", phoneNumber: "+255 762 111222", mailId: "ali@mbeyarice.co.tz", fax: "", vatPercentage: 18, withholdingVatPercentage: 2, remarks: "", status: "Active" },
      { id: "SUP004", supplierType: "Local", supplierName: "Sun Valley Farms", tinNumber: "TIN-1122334", vatRegisterNo: "VAT-004", shNickName: "SVF", shipmentMode: "Road Transport", country: "Tanzania", region: "Morogoro", district: "Morogoro Urban", address: "Old Dar Road, Morogoro", contactPerson: "Grace Mushi", phoneNumber: "+255 789 333444", mailId: "grace@sunvalley.co.tz", fax: "", vatPercentage: 18, withholdingVatPercentage: 2, remarks: "", status: "Active" },
    ]}
    columns={[
      { key: "supplierName", label: "Supplier Name" },
      { key: "supplierType", label: "Type" },
      { key: "contactPerson", label: "Contact" },
      { key: "phoneNumber", label: "Phone" },
      { key: "tinNumber", label: "TIN" },
      { key: "vatRegisterNo", label: "VAT Reg" },
      { key: "country", label: "Country" },
      { key: "region", label: "Region" },
      { key: "status", label: "Status" },
    ]}
  />;
}

