'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DataPage } from "@/components/DataPage";
import { DataTable } from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { PurchaseOrderHeader } from "@/app/mock/types/purchase.types";
import { Trash2, Pencil, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { useMockCrud } from "@/hooks/useMockCrud";

type PurchaseOrderWithId = PurchaseOrderHeader & { id: string | number };

const columns = [
  { key: "poRefNo", label: "PO Number" },
  { key: "poDate", label: "Date", render: (v: string) => v ? new Date(v).toLocaleDateString() : "-" },
  { key: "supplierName", label: "Supplier" },
  { key: "storeName", label: "Store" },
  { key: "purchaseType", label: "Type" },
  { key: "modeOfPayment", label: "Payment" },
  { key: "finalPurchaseHdrAmount", label: "Amount", render: (v: number) => v ? `$${v.toLocaleString()}` : "$0" },
  { key: "statusEntry", label: "Status", render: (v: string) => (
    <Badge 
      variant={v === "Approved" || v === "Completed" ? "default" : v === "Draft" ? "outline" : "secondary"} 
      className="text-xs"
    >
      {v}
    </Badge>
  )},
];



export default function PurchaseOrdersPage() {
  const router = useRouter();
  const { data, loading, create, update, remove } = useMockCrud<PurchaseOrderWithId>({ table: "purchaseOrders" });
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PurchaseOrderWithId | null>(null);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
      router.replace('/login');
    }
  }, [router]);

  const openEdit = (row: PurchaseOrderWithId) => {
    router.push(`/purchase-orders/create?id=${row.id}`);
  };

  const onView = (row: PurchaseOrderWithId) => {
    router.push(`/purchase-orders/create?id=${row.id}&view=true`);
  };

  const openDelete = (row: PurchaseOrderWithId) => { setDeleteTarget(row); setDeleteOpen(true); };

  const handleDelete = async () => {
    if (deleteTarget) { 
      await remove(deleteTarget.id); 
      setSelectedRows(prev => prev.filter(id => id !== deleteTarget.id));
      setDeleteOpen(false); 
    }
  };

  const handleDeleteSelected = async () => {
    for (const id of selectedRows) {
      await remove(id);
    }
    setSelectedRows([]);
    setBulkDeleteOpen(false);
  };

  return (
    <main className="flex-1 bg-background animate-fade-in p-6 overflow-auto">
      <DataPage title="Purchase Orders" description="Create and manage purchase orders for commodities" actionLabel="New Purchase Order" onAction={() => router.push('/purchase-orders/create')}>
        <div className="space-y-4">
          {selectedRows.length > 0 && (
            <div className="flex items-center justify-between bg-primary/5 border border-primary/10 p-3 rounded-xl animate-in fade-in slide-in-from-top-2">
              <p className="text-sm font-medium text-primary ml-2">
                {selectedRows.length} {selectedRows.length === 1 ? 'order' : 'orders'} selected
              </p>
              <Button 
                variant="destructive" 
                size="sm" 
                className="rounded-lg h-9 font-bold flex items-center gap-2"
                onClick={() => setBulkDeleteOpen(true)}
              >
                <Trash2 className="w-4 h-4" />
                Delete Selected
              </Button>
            </div>
          )}
          <DataTable 
            columns={columns} 
            data={data} 
            loading={loading} 
            searchPlaceholder="Search purchase orders..." 
            onEdit={openEdit} 
            onDelete={openDelete} 
            onView={onView} 
            onPrint={(row) => console.log("Print", row)} 
            selectedRows={selectedRows}
            onSelectionChange={setSelectedRows}
          />
        </div>
      </DataPage>

      <DeleteConfirmDialog 
        open={deleteOpen} 
        onOpenChange={setDeleteOpen} 
        onConfirm={handleDelete} 
      />

      <DeleteConfirmDialog 
        open={bulkDeleteOpen} 
        onOpenChange={setBulkDeleteOpen} 
        onConfirm={handleDeleteSelected} 
        title={`Delete ${selectedRows.length} Orders?`}
        description={`This will permanently remove ${selectedRows.length} selected records. This action cannot be undone.`}
      />
    </main>
  );
}

