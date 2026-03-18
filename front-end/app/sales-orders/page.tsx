'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DataPage } from "@/components/DataPage";
import { DataTable } from "@/components/DataTable";
import { CrudFormDialog } from "@/components/CrudFormDialog";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { useMockCrud } from "@/hooks/useMockCrud";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormLabel as Label } from "@/components/FormLabel";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { SalesOrderHeader } from "@/app/mock/types/sales.types";

type SalesOrderWithId = SalesOrderHeader & { id: string | number };

const columns = [
  { key: "salesOrderRefNo", label: "SO Number" },
  { key: "salesOrderDate", label: "Date", render: (v: string) => v ? new Date(v).toLocaleDateString() : "-" },
  { key: "customerName", label: "Customer" },
  { key: "storeId", label: "Store" }, // Added store column
  { key: "finalSalesAmount", label: "Amount", render: (v: number) => v ? `$${v.toLocaleString()}` : "$0" },
  { key: "statusEntry", label: "Status", render: (v: string) => {
    const variants: Record<string, string> = {
      'Confirmed': 'default',
      'Processing': 'secondary',
      'Delivered': 'success',
      'Invoiced': 'default',
      'Draft': 'outline',
      'Cancelled': 'destructive'
    };
    return <Badge variant={(variants[v] || 'outline') as any} className="text-xs">{v}</Badge>;
  }},
];

const emptyForm = { salesOrderRefNo: "", salesOrderDate: new Date().toISOString().split("T")[0], customerName: "", finalSalesAmount: "", remarks: "", statusEntry: "Draft" as any };

export default function SalesOrdersPage() {
  const router = useRouter();
  const { data, loading, create, update, remove } = useMockCrud<SalesOrderWithId>({ table: "salesOrders" });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<SalesOrderWithId | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SalesOrderWithId | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
      router.replace('/login');
    }
  }, [router]);

  const openAdd = () => {
    router.push('/sales-orders/create');
  };

  const openEdit = (row: SalesOrderWithId) => {
    setEditing(row);
    setForm({ 
      salesOrderRefNo: row.salesOrderRefNo, 
      salesOrderDate: row.salesOrderDate?.split("T")[0] || "", 
      customerName: row.customerName || "", 
      finalSalesAmount: row.finalSalesAmount?.toString() || "", 
      remarks: row.remarks || "",
      statusEntry: row.statusEntry || "Draft"
    });
    setDialogOpen(true);
  };

  const openDelete = (row: SalesOrderWithId) => { setDeleteTarget(row); setDeleteOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const record = { 
      salesOrderRefNo: form.salesOrderRefNo, 
      salesOrderDate: form.salesOrderDate || new Date().toISOString(), 
      customerName: form.customerName || null, 
      finalSalesAmount: form.finalSalesAmount ? parseFloat(form.finalSalesAmount) : 0, 
      remarks: form.remarks || "",
      statusEntry: form.statusEntry,
      sno: editing ? editing.sno : String(data.length + 1),
      companyId: editing ? editing.companyId : "COMP001",
      storeId: editing ? editing.storeId : "STR001",
      customerId: editing ? editing.customerId : "CUST001",
      billingLocationId: editing ? editing.billingLocationId : "BL001",
      creditLimitAmount: editing ? editing.creditLimitAmount : 0,
      creditLimitDays: editing ? editing.creditLimitDays : 0,
      outstandingAmount: editing ? editing.outstandingAmount : 0,
      creditCheckPassed: editing ? editing.creditCheckPassed : true,
      currencyId: editing ? editing.currencyId : "CUR001",
      exchangeRate: editing ? editing.exchangeRate : 1,
      totalProductAmount: form.finalSalesAmount ? parseFloat(form.finalSalesAmount) * 0.85 : 0,
      vatAmount: form.finalSalesAmount ? parseFloat(form.finalSalesAmount) * 0.15 : 0,
      createdBy: editing ? editing.createdBy : "admin",
      createdDate: editing ? editing.createdDate : new Date().toISOString(),
    };
    const ok = editing ? await update(editing.id, record as any) : await create(record as any);
    if (ok) setDialogOpen(false);
  };

  const handleDelete = async () => { if (deleteTarget) { await remove(deleteTarget.id); setDeleteOpen(false); } };

  return (
    <div className="animate-fade-in p-6 bg-background flex-1 overflow-auto">
      <DataPage title="Sales Orders" description="Manage customer orders and sales fulfillment" actionLabel="New Sales Order" onAction={openAdd}>
        <DataTable 
          columns={columns} 
          data={data} 
          loading={loading} 
          searchPlaceholder="Search sales orders..." 
          onEdit={openEdit} 
          onDelete={openDelete} 
          onView={openEdit} 
          onPrint={(row) => console.log("Print", row)}
        />
      </DataPage>

      <CrudFormDialog open={dialogOpen} onOpenChange={setDialogOpen} title={editing ? "Edit Sales Order" : "New Sales Order"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label htmlFor="salesOrderRefNo">SO Ref No *</Label><Input id="salesOrderRefNo" required value={form.salesOrderRefNo} onChange={(e) => setForm({ ...form, salesOrderRefNo: e.target.value })} /></div>
            <div className="space-y-2"><Label htmlFor="salesOrderDate">SO Date *</Label><Input id="salesOrderDate" type="date" required value={form.salesOrderDate} onChange={(e) => setForm({ ...form, salesOrderDate: e.target.value })} /></div>
          </div>
          <div className="space-y-2"><Label htmlFor="customerName">Customer Name</Label><Input id="customerName" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} /></div>
          <div className="space-y-2"><Label htmlFor="finalSalesAmount">Final Amount</Label><Input id="finalSalesAmount" type="number" step="0.01" value={form.finalSalesAmount} onChange={(e) => setForm({ ...form, finalSalesAmount: e.target.value })} /></div>
          <div className="space-y-2"><Label htmlFor="remarks">Remarks</Label><Textarea id="remarks" value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} /></div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit">{editing ? "Update" : "Create"}</Button>
          </div>
        </form>
      </CrudFormDialog>
      <DeleteConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} onConfirm={handleDelete} />
    </div>
  );
}

