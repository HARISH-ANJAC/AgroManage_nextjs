"use client";

import MasterCrudPage from "@/components/MasterCrudPage";

export default function FinancialYearsPage() {
  return <MasterCrudPage
    domain="financial-years" title="Financial Years" description="Manage your financial years" idPrefix="FY" fields={[
    { key: "name", label: "Year Name", type: "text", required: true, placeholder: "e.g. FY 2025-26" },
    { key: "startDate", label: "Start Date", type: "date", required: true },
    { key: "endDate", label: "End Date", type: "date", required: true },
    { key: "status", label: "Status", type: "select", required: true, options: ["Active", "Closed"] },
  ]} initialData={[
    { id: "FY001", name: "FY 2025-26", startDate: "2025-07-01", endDate: "2026-06-30", status: "Active" },
    { id: "FY002", name: "FY 2024-25", startDate: "2024-07-01", endDate: "2025-06-30", status: "Closed" },
  ]} columns={[
    { key: "name", label: "Year" }, { key: "startDate", label: "Start" }, { key: "endDate", label: "End" }, { key: "status", label: "Status" },
  ]} />;
}

