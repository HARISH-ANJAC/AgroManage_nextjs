"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData";

export default function TaxMasterPage() {
  const { data: taxData } = useMasterData("tax-master");

  return <MasterCrudPage
    domain="tax-master" title="Tax Master" description="Tax rates and categories" idPrefix="TAX" fields={[
      { key: "name", label: "Tax Name", type: "text", required: true },
      { key: "rate", label: "Rate (%)", type: "number", required: true },
      { key: "description", label: "Description", type: "text" },
      { key: "statusMaster", label: "Status", type: "select", required: true, options: ["Active", "Inactive"], defaultValue: "Active" },
    ]} initialData={taxData || []}
    columns={[
      { key: "name", label: "Tax Name" }, { key: "rate", label: "Rate (%)" }, { key: "description", label: "Description" }, { key: "statusMaster", label: "Status" },
    ]} />;
}

