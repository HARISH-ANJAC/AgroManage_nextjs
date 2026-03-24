"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData";

export default function VatSettingsPage() {
  const { data: vats, isLoading: loadingVats } = useMasterData("vat");
  const { data: companies, isLoading: loadingCompanies } = useMasterData("companies");

  if (loadingCompanies || loadingVats) return <div className="p-8 text-center text-muted-foreground font-medium">Loading data...</div>;

  const companyOptions = companies.map((c: any) => ({ value: c.id, label: c.companyName }));

  return <MasterCrudPage
    domain="vat" title="VAT Percentage Settings" description="Manage your VAT percentage settings" idPrefix="VAT" fields={[
    { key: "companyId", label: "Company", type: "select", options: companyOptions },
    { key: "vatPercentage", label: "VAT Percentage (%)", type: "number", required: true },
    { key: "effectiveFrom", label: "Effective From", type: "date" },
    { key: "effectiveTo", label: "Effective To", type: "date" },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "statusMaster", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
  ]} initialData={vats}
  columns={[
    { key: "companyName", label: "Company" }, { key: "vatPercentage", label: "VAT %" }, { key: "effectiveFrom", label: "From" }, { key: "effectiveTo", label: "To" }, { key: "statusMaster", label: "Status" },
  ]} />;
}
