"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData";

export default function FinancialYearsPage() {
  const { data: companies, isLoading: loadingCompanies } = useMasterData("companies");
  const { data: years, isLoading: loadingYears } = useMasterData("financial-years");

  if (loadingCompanies || loadingYears) return <div className="p-8 text-center text-muted-foreground font-medium">Loading data...</div>;

  const companyOptions = companies.map((c: any) => ({ value: c.id, label: c.companyName }));

  return <MasterCrudPage
    domain="financial-years" 
    title="Financial Years" 
    description="Manage financial years for your companies" 
    idPrefix="FY" 
    fields={[
      { key: "companyId", label: "Company", type: "select", required: true, options: companyOptions },
      { key: "financialYear", label: "Financial Year", type: "text", required: true, placeholder: "e.g. 2024-2025" },
      { key: "startDate", label: "Start Date", type: "date", required: true },
      { key: "endDate", label: "End Date", type: "date", required: true },
      { key: "isCurrent", label: "Is Current Year?", type: "select", options: ["Yes", "No"], defaultValue: "No" },
      { key: "statusMaster", label: "Status", type: "select", required: true, options: ["Active", "Inactive"], defaultValue: "Active" },
    ]} 
    initialData={years}
    columns={[
      { key: "companyName", label: "Company" },
      { key: "financialYear", label: "Financial Year" },
      { key: "startDate", label: "Start Date", render: (val) => val ? new Date(val).toLocaleDateString() : '-' },
      { key: "endDate", label: "End Date", render: (val) => val ? new Date(val).toLocaleDateString() : '-' },
      { key: "isCurrent", label: "Current", render: (val) => (
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${val === 'Yes' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
          {val}
        </span>
      )},
      { key: "statusMaster", label: "Status" },
    ]} />;
}
