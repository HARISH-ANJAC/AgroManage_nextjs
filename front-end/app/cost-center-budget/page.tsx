"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

export default function CostCenterBudgetPage() {
  // Use the dedicated budget endpoint which returns joined cost center names
  const { data: budgets, isLoading, add, update, remove, bulkRemove } = useMasterData("cost-centers/budgets");
  const [costCenters, setCostCenters] = useState<{ id: number; costCenterName: string }[]>([]);

  useEffect(() => {
    const fetchCostCenters = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch(`${API_BASE}/cost-centers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setCostCenters(
          data.map((cc: any) => ({
            id: cc.COST_CENTER_ID,
            costCenterName: cc.COST_CENTER_NAME,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch cost centers", error);
      }
    };
    fetchCostCenters();
  }, []);

  return (
    <MasterCrudPage
      domain="cost-centers/budgets"
      title="Cost Center Budgets"
      description="Allocate annual budgets to cost centers. Available budget and variance are computed automatically."
      idPrefix="BUD"
      fields={[
        {
          key: "costCenterId",
          label: "Cost Center",
          type: "select",
          required: true,
          options: costCenters.map((cc) => ({
            value: cc.id,
            label: cc.costCenterName,
          })),
        },
        {
          key: "financialYear",
          label: "Financial Year",
          type: "text",
          required: true,
          defaultValue: "2025-2026",
          placeholder: "e.g., 2025-2026",
        },
        {
          key: "periodStartDate",
          label: "Period Start Date",
          type: "date",
          required: true,
        },
        {
          key: "periodEndDate",
          label: "Period End Date",
          type: "date",
          required: true,
        },
        {
          key: "budgetAmount",
          label: "Budget Amount (TZS)",
          type: "number",
          required: true,
          defaultValue: 0,
        },
        {
          key: "actualExpense",
          label: "Actual Amount (TZS)",
          type: "number",
          defaultValue: 0,
        },
        {
          key: "status",
          label: "Status",
          type: "select",
          required: true,
          options: ["Active", "Inactive"],
          defaultValue: "Active",
        },
      ]}
      initialData={budgets}
      columns={[
        { key: "costCenterName", label: "Cost Center" },
        { key: "financialYear", label: "Financial Year" },
        {
          key: "budgetAmount",
          label: "Budget (TZS)",
          render: (val) =>
            parseFloat(val || 0).toLocaleString("en-TZ", {
              minimumFractionDigits: 2,
            }),
        },
        {
          key: "availableBudget",
          label: "Available",
          render: (val) =>
            parseFloat(val || 0).toLocaleString("en-TZ", {
              minimumFractionDigits: 2,
            }),
        },
        {
          key: "variancePercentage",
          label: "Used %",
          render: (val) => `${parseFloat(val || 0).toFixed(1)}%`,
        },
        { key: "periodStartDate", label: "Start Date" },
        { key: "periodEndDate", label: "End Date" },
        { key: "status", label: "Status" },
      ]}
      customStoreOverrides={{ data: budgets, add, update, remove, bulkRemove, isLoading }}
    />
  );
}
