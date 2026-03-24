'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DataPage } from "@/components/DataPage";
import { DataTable } from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { useMockCrud } from "@/hooks/useMockCrud";

interface StockRecord {
  id: number | string;
  opening_stock_date: string | null;
  total_qty: number | null;
  remarks: string | null;
  status: string | null;
}

const columns = [
  { key: "id", label: "ID" },
  { key: "opening_stock_date", label: "Stock Date", render: (v: string) => v ? new Date(v).toLocaleDateString() : "-" },
  { key: "total_qty", label: "Quantity", render: (v: number) => (
    <Badge variant={v && v < 100 ? "destructive" : "default"} className="text-xs">{v || 0} MT</Badge>
  )},
  { key: "remarks", label: "Remarks" },
  { key: "status", label: "Status", render: (v: string) => (
    <Badge variant={v === "Active" ? "default" : "secondary"} className="text-xs">{v}</Badge>
  )},
];

export default function InventoryPage() {
  const router = useRouter();
  const { data, loading } = useMockCrud<StockRecord>({ table: "product_opening_stock" });


  return (
    <div className="animate-fade-in p-6 bg-background flex-1 overflow-auto">
      <DataPage title="Inventory" description="Track stock levels across warehouses">
        <DataTable columns={columns} data={data} loading={loading} searchPlaceholder="Search inventory..." />
      </DataPage>
    </div>
  );
}
