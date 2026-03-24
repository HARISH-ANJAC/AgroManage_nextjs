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
import { DeliveryNote } from "@/app/mock/types/sales.types";

type DeliveryNoteWithId = DeliveryNote & { id: string | number };

const columns = [
  { key: "deliveryNoteRefNo", label: "Delivery No" },
  { key: "deliveryDate", label: "Date", render: (v: string) => v ? new Date(v).toLocaleDateString() : "-" },
  { key: "deliverySourceRefNo", label: "Source Ref" },
  { key: "truckNo", label: "Truck" },
  { key: "driverName", label: "Driver" },
  { key: "finalSalesAmount", label: "Amount", render: (v: number) => v ? `$${v.toLocaleString()}` : "$0" },
  { key: "statusEntry", label: "Status", render: (v: string) => {
    const variants: Record<string, string> = {
      'Dispatched': 'secondary',
      'Delivered': 'default',
      'Draft': 'outline',
      'Cancelled': 'destructive'
    };
    return <Badge variant={(variants[v] || 'outline') as any} className="text-xs">{v}</Badge>;
  }},
];

const emptyForm = { deliveryNoteRefNo: "", deliveryDate: new Date().toISOString().split("T")[0], deliverySourceType: "Sales Order" as any, deliverySourceRefNo: "", truckNo: "", trailerNo: "", driverName: "", driverContactNumber: "", sealNo: "", remarks: "", statusEntry: "Draft" as any };

export default function DeliveriesPage() {
  const router = useRouter();
  const { data, loading, create, update, remove } = useMockCrud<DeliveryNoteWithId>({ table: "deliveryNotes" });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<DeliveryNoteWithId | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeliveryNoteWithId | null>(null);
  const [form, setForm] = useState(emptyForm);


  const openAdd = () => {
    const nextNo = `DN/${new Date().toISOString().slice(5,7)}/${String(data.length + 1).padStart(3, "0")}`;
    setEditing(null); 
    setForm({ ...emptyForm, deliveryNoteRefNo: nextNo }); 
    setDialogOpen(true);
  };

  const openEdit = (row: DeliveryNoteWithId) => {
    setEditing(row);
    setForm({ 
      deliveryNoteRefNo: row.deliveryNoteRefNo, 
      deliveryDate: row.deliveryDate?.split("T")[0] || "", 
      deliverySourceType: row.deliverySourceType || "Sales Order", 
      deliverySourceRefNo: row.deliverySourceRefNo || "", 
      truckNo: row.truckNo || "", 
      trailerNo: row.trailerNo || "", 
      driverName: row.driverName || "", 
      driverContactNumber: row.driverContactNumber || "", 
      sealNo: row.sealNo || "", 
      remarks: row.remarks || "",
      statusEntry: row.statusEntry || "Draft"
    });
    setDialogOpen(true);
  };

  const openDelete = (row: DeliveryNoteWithId) => { setDeleteTarget(row); setDeleteOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const record = { 
      deliveryNoteRefNo: form.deliveryNoteRefNo, 
      deliveryDate: form.deliveryDate || new Date().toISOString(), 
      deliverySourceType: form.deliverySourceType, 
      deliverySourceRefNo: form.deliverySourceRefNo || null, 
      truckNo: form.truckNo || null, 
      trailerNo: form.trailerNo || null, 
      driverName: form.driverName || null, 
      driverContactNumber: form.driverContactNumber || null, 
      sealNo: form.sealNo || null, 
      remarks: form.remarks || "",
      statusEntry: form.statusEntry,
      sno: editing ? editing.sno : String(data.length + 1),
      companyId: editing ? editing.companyId : "COMP001",
      fromStoreId: editing ? editing.fromStoreId : "STR001",
      customerId: editing ? editing.customerId : "CUST001",
      currencyId: editing ? editing.currencyId : "CUR001",
      exchangeRate: editing ? editing.exchangeRate : 1,
      totalProductAmount: editing ? editing.totalProductAmount : 0,
      vatAmount: editing ? editing.vatAmount : 0,
      finalSalesAmount: editing ? editing.finalSalesAmount : 0,
      createdBy: editing ? editing.createdBy : "admin",
      createdDate: editing ? editing.createdDate : new Date().toISOString(),
      submittedBy: editing ? editing.submittedBy : "admin",
      submittedDate: editing ? editing.submittedDate : new Date().toISOString(),
    };
    const ok = editing ? await update(editing.id, record as any) : await create(record as any);
    if (ok) setDialogOpen(false);
  };

  const handleDelete = async () => { if (deleteTarget) { await remove(deleteTarget.id); setDeleteOpen(false); } };

  return (
    <div className="animate-fade-in p-6 bg-background flex-1 overflow-auto">
      <DataPage title="Deliveries" description="Track goods dispatched to customers" actionLabel="New Delivery" onAction={openAdd}>
        <DataTable columns={columns} data={data} loading={loading} searchPlaceholder="Search deliveries..." onEdit={openEdit} onDelete={openDelete} />
      </DataPage>
      <CrudFormDialog open={dialogOpen} onOpenChange={setDialogOpen} title={editing ? "Edit Delivery Note" : "New Delivery Note"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label htmlFor="deliveryNoteRefNo">Delivery Ref No *</Label><Input id="deliveryNoteRefNo" required value={form.deliveryNoteRefNo} onChange={(e) => setForm({ ...form, deliveryNoteRefNo: e.target.value })} /></div>
            <div className="space-y-2"><Label htmlFor="deliveryDate">Delivery Date *</Label><Input id="deliveryDate" type="date" required value={form.deliveryDate} onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label htmlFor="deliverySourceType">Source Type</Label><Input id="deliverySourceType" value={form.deliverySourceType} onChange={(e) => setForm({ ...form, deliverySourceType: e.target.value as any })} placeholder="Sales Order" /></div>
            <div className="space-y-2"><Label htmlFor="deliverySourceRefNo">Source Ref No</Label><Input id="deliverySourceRefNo" value={form.deliverySourceRefNo} onChange={(e) => setForm({ ...form, deliverySourceRefNo: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label htmlFor="truckNo">Truck No</Label><Input id="truckNo" value={form.truckNo} onChange={(e) => setForm({ ...form, truckNo: e.target.value })} /></div>
            <div className="space-y-2"><Label htmlFor="trailerNo">Trailer No</Label><Input id="trailerNo" value={form.trailerNo} onChange={(e) => setForm({ ...form, trailerNo: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label htmlFor="driverName">Driver Name</Label><Input id="driverName" value={form.driverName} onChange={(e) => setForm({ ...form, driverName: e.target.value })} /></div>
            <div className="space-y-2"><Label htmlFor="driverContactNumber">Driver Contact</Label><Input id="driverContactNumber" value={form.driverContactNumber} onChange={(e) => setForm({ ...form, driverContactNumber: e.target.value })} /></div>
          </div>
          <div className="space-y-2"><Label htmlFor="sealNo">Seal No</Label><Input id="sealNo" value={form.sealNo} onChange={(e) => setForm({ ...form, sealNo: e.target.value })} /></div>
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

