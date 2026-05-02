"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

export default function ProfitCenterTargetPage() {
  const { data: targets, isLoading, add, update, remove, bulkRemove } = useMasterData("profit-centers/targets");
  const [profitCenters, setProfitCenters] = useState<{ id: number; profitCenterName: string }[]>([]);

  useEffect(() => {
    const fetchProfitCenters = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch(`${API_BASE}/profit-centers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setProfitCenters(
          data.map((pc: any) => ({
            id: pc.PROFIT_CENTER_ID,
            profitCenterName: pc.PROFIT_CENTER_NAME,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch profit centers", error);
      }
    };
    fetchProfitCenters();
  }, []);

  return (
    <MasterCrudPage
      domain="profit-centers/targets"
      title="Profit Center Targets"
      description="Set revenue targets for profit centers. Achievement % is computed automatically."
      idPrefix="TGT"
      fields={[
        {
          key: "profitCenterId",
          label: "Profit Center",
          type: "select",
          required: true,
          options: profitCenters.map((pc) => ({
            value: pc.id,
            label: pc.profitCenterName,
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
          key: "periodName",
          label: "Period Name",
          type: "text",
          placeholder: "e.g., Q1, H1, Annual",
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
          key: "targetAmount",
          label: "Target Amount (TZS)",
          type: "number",
          required: true,
          defaultValue: 0,
        },
        {
          key: "actualRevenue",
          label: "Actual Revenue (TZS)",
          type: "number",
          defaultValue: 0,
        },
      ]}
      initialData={targets}
      columns={[
        { key: "profitCenterName", label: "Profit Center" },
        { key: "financialYear",    label: "Financial Year" },
        { key: "periodName",       label: "Period" },
        {
          key: "targetAmount",
          label: "Target (TZS)",
          render: (val) =>
            parseFloat(val || 0).toLocaleString("en-TZ", { minimumFractionDigits: 2 }),
        },
        {
          key: "actualRevenue",
          label: "Actual (TZS)",
          render: (val) =>
            parseFloat(val || 0).toLocaleString("en-TZ", { minimumFractionDigits: 2 }),
        },
        {
          key: "achievementPercent",
          label: "Achievement %",
          render: (val) => `${parseFloat(val || 0).toFixed(1)}%`,
        },
        { key: "periodStartDate", label: "Start Date" },
        { key: "periodEndDate",   label: "End Date" },
      ]}
      customStoreOverrides={{ data: targets, add, update, remove, bulkRemove, isLoading }}
    />
  );
}
