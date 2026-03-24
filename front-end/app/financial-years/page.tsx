"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData";

export default function FinancialYearsPage() {
  const { data: financialYears } = useMasterData("financial-years");

  return <MasterCrudPage
    domain="financial-years" title="Financial Years" description="Manage your financial years" idPrefix="FY" fields={[
    { key: "fyName", label: "Year Name", type: "text", required: true, placeholder: "e.g. FY 2025-26" },
    { key: "startDate", label: "Start Date", type: "date", required: true },
    { key: "endDate", label: "End Date", type: "date", required: true },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "statusMaster", label: "Status", type: "select", required: true, options: ["Active", "Closed"] },
  ]} initialData={financialYears} 
  columns={[
    { key: "fyName", label: "Year" }, { key: "startDate", label: "Start" }, { key: "endDate", label: "End" }, { key: "statusMaster", label: "Status" },
  ]} />;
}
