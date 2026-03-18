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
import { Supplier } from "@/app/mock/types/master.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SupplierWithId = Supplier & { id: string | number };

const columns = [
  { key: "supplierId", label: "ID" },
  { key: "supplierName", label: "Supplier Name" },
  { key: "contactPerson", label: "Contact Person" },
  { key: "contactNumber", label: "Phone" },
  { key: "location", label: "Location" },
  { key: "tinNumber", label: "TIN" },
  { key: "vatNumber", label: "VAT No" },
  { key: "statusMaster", label: "Status", render: (v: string) => (
    <Badge variant={v === "Active" ? "default" : "secondary"} className="text-xs">{v}</Badge>
  )},
];

const emptyForm = { supplierName: "", tinNumber: "", vatNumber: "", contactPerson: "", contactNumber: "", location: "", remarks: "", statusMaster: "Active" };

export default function SuppliersPage() {
  const router = useRouter();
  const { data, loading, create, update, remove } = useMockCrud<SupplierWithId>({ table: "suppliers" });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<SupplierWithId | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SupplierWithId | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
      router.replace('/login');
    }
  }, [router]);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (row: SupplierWithId) => {
    setEditing(row);
    setForm({
      supplierName: row.supplierName || "",
      tinNumber: row.tinNumber || "",
      vatNumber: row.vatNumber || "",
      contactPerson: row.contactPerson || "",
      contactNumber: row.contactNumber || "",
      location: row.location || "",
      remarks: row.remarks || "",
      statusMaster: row.statusMaster || "Active",
    });
    setDialogOpen(true);
  };
  const openDelete = (row: SupplierWithId) => { setDeleteTarget(row); setDeleteOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const record = {
      supplierName: form.supplierName,
      tinNumber: form.tinNumber || undefined,
      vatNumber: form.vatNumber || undefined,
      contactPerson: form.contactPerson || undefined,
      contactNumber: form.contactNumber || undefined,
      location: form.location || undefined,
      remarks: form.remarks || undefined,
      statusMaster: form.statusMaster as 'Active' | 'Inactive',
      supplierId: editing ? editing.supplierId : `SUP${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    };
    
    const ok = editing ? await update(editing.id, record) : await create(record);
    if (ok) setDialogOpen(false);
  };

  const handleDelete = async () => {
    if (deleteTarget) { await remove(deleteTarget.id); setDeleteOpen(false); }
  };

  return (
    <div className="animate-fade-in p-6 bg-background flex-1 overflow-auto">
      <DataPage title="Suppliers" description="Manage your commodity suppliers" actionLabel="Add Supplier" onAction={openAdd}>
        <DataTable columns={columns} data={data} loading={loading} searchPlaceholder="Search suppliers..." onEdit={openEdit} onDelete={openDelete} />
      </DataPage>

      <CrudFormDialog open={dialogOpen} onOpenChange={setDialogOpen} title={editing ? "Edit Supplier" : "Add Supplier"} description={editing ? "Update supplier details" : "Add a new supplier"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label required>Supplier Name</Label>
            <Input id="supplierName" required value={form.supplierName} onChange={(e) => setForm({ ...form, supplierName: e.target.value })} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label required>Contact Person</Label>
              <Input id="contactPerson" required value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label required>Phone Number</Label>
              <Input id="contactNumber" required value={form.contactNumber} onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} />
            </div>
          </div>

          <div className="space-y-2">
            <Label required>Location Address</Label>
            <Input id="location" required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label required>TIN Number</Label>
              <Input id="tinNumber" required value={form.tinNumber} onChange={(e) => setForm({ ...form, tinNumber: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>VAT Number</Label>
              <Input id="vatNumber" value={form.vatNumber} onChange={(e) => setForm({ ...form, vatNumber: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label required>Status</Label>
              <Select value={form.statusMaster} onValueChange={(v: any) => setForm({ ...form, statusMaster: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Remarks</Label>
            <Textarea id="remarks" value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} />
          </div>

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

