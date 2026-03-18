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
import { GoodsReceiptNote } from "@/app/mock/types/purchase.types";

type GoodsReceiptWithId = GoodsReceiptNote & { id: string | number };

const columns = [
  { key: "grnRefNo", label: "GRN Number" },
  { key: "grnDate", label: "Date", render: (v: string) => v ? new Date(v).toLocaleDateString() : "-" },
  { key: "grnSource", label: "Source" },
  { key: "supplierInvoiceNumber", label: "Supplier Invoice" },
  { key: "vehicleNo", label: "Vehicle" },
  { key: "driverName", label: "Driver" },
  { key: "statusEntry", label: "Status", render: (v: string) => (
    <Badge variant={v === "Confirmed" ? "default" : v === "Draft" ? "outline" : "secondary"} className="text-xs">{v}</Badge>
  )},
];

const emptyForm = { grnRefNo: "", grnDate: new Date().toISOString().split("T")[0], grnSource: "Purchase Order" as any, supplierInvoiceNumber: "", containerNo: "", driverName: "", driverContactNumber: "", vehicleNo: "", sealNo: "", remarks: "", statusEntry: "Draft" as any };

export default function GoodsReceiptsPage() {
  const router = useRouter();
  const { data, loading, create, update, remove } = useMockCrud<GoodsReceiptWithId>({ table: "grns" });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<GoodsReceiptWithId | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GoodsReceiptWithId | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
      router.replace('/login');
    }
  }, [router]);

  const openAdd = () => {
    const nextNo = `GRN/${new Date().toISOString().slice(5,7)}/${String(data.length + 1).padStart(3, "0")}`;
    setEditing(null); 
    setForm({ ...emptyForm, grnRefNo: nextNo }); 
    setDialogOpen(true);
  };

  const openEdit = (row: GoodsReceiptWithId) => {
    setEditing(row);
    setForm({ 
      grnRefNo: row.grnRefNo, 
      grnDate: row.grnDate?.split("T")[0] || "", 
      grnSource: row.grnSource || "Purchase Order", 
      supplierInvoiceNumber: row.supplierInvoiceNumber || "", 
      containerNo: row.containerNo || "", 
      driverName: row.driverName || "", 
      driverContactNumber: row.driverContactNumber || "", 
      vehicleNo: row.vehicleNo || "", 
      sealNo: row.sealNo || "", 
      remarks: row.remarks || "",
      statusEntry: row.statusEntry || "Draft"
    });
    setDialogOpen(true);
  };

  const openDelete = (row: GoodsReceiptWithId) => { setDeleteTarget(row); setDeleteOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const record = { 
      grnRefNo: form.grnRefNo, 
      grnDate: form.grnDate || new Date().toISOString(), 
      grnSource: form.grnSource, 
      supplierInvoiceNumber: form.supplierInvoiceNumber || null, 
      containerNo: form.containerNo || null, 
      driverName: form.driverName || null, 
      driverContactNumber: form.driverContactNumber || null, 
      vehicleNo: form.vehicleNo || null, 
      sealNo: form.sealNo || null, 
      remarks: form.remarks || "",
      statusEntry: form.statusEntry,
      sno: editing ? editing.sno : String(data.length + 1),
      companyId: editing ? editing.companyId : "COMP001",
      supplierId: editing ? editing.supplierId : "SUP001",
      poRefNo: editing ? editing.poRefNo : "",
      sourceStoreId: editing ? editing.sourceStoreId : "STR001",
      grnStoreId: editing ? editing.grnStoreId : "STR001",
      createdBy: editing ? editing.createdBy : "admin",
      createdDate: editing ? editing.createdDate : new Date().toISOString(),
    };
    const ok = editing ? await update(editing.id, record as any) : await create(record as any);
    if (ok) setDialogOpen(false);
  };

  const handleDelete = async () => { if (deleteTarget) { await remove(deleteTarget.id); setDeleteOpen(false); } };

  return (
    <div className="animate-fade-in p-6 bg-background flex-1 overflow-auto">
      <DataPage title="Goods Receipts" description="Record and track goods received at the warehouse" actionLabel="New Goods Receipt" onAction={openAdd}>
        <DataTable columns={columns} data={data} loading={loading} searchPlaceholder="Search goods receipts..." onEdit={openEdit} onDelete={openDelete} />
      </DataPage>

      <CrudFormDialog open={dialogOpen} onOpenChange={setDialogOpen} title={editing ? "Edit Goods Receipt" : "New Goods Receipt"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label htmlFor="grnRefNo">GRN Ref No *</Label><Input id="grnRefNo" required value={form.grnRefNo} onChange={(e) => setForm({ ...form, grnRefNo: e.target.value })} /></div>
            <div className="space-y-2"><Label htmlFor="grnDate">GRN Date *</Label><Input id="grnDate" type="date" required value={form.grnDate} onChange={(e) => setForm({ ...form, grnDate: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label htmlFor="grnSource">Source</Label><Input id="grnSource" value={form.grnSource} onChange={(e) => setForm({ ...form, grnSource: e.target.value as any })} placeholder="Purchase / Transfer" /></div>
            <div className="space-y-2"><Label htmlFor="supplierInvoiceNumber">Supplier Invoice No</Label><Input id="supplierInvoiceNumber" value={form.supplierInvoiceNumber} onChange={(e) => setForm({ ...form, supplierInvoiceNumber: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label htmlFor="containerNo">Container No</Label><Input id="containerNo" value={form.containerNo} onChange={(e) => setForm({ ...form, containerNo: e.target.value })} /></div>
            <div className="space-y-2"><Label htmlFor="vehicleNo">Vehicle No</Label><Input id="vehicleNo" value={form.vehicleNo} onChange={(e) => setForm({ ...form, vehicleNo: e.target.value })} /></div>
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

