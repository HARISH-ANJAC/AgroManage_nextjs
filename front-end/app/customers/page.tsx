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
import { Customer } from "@/app/mock/types/master.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CustomerWithId = Customer & { id: string | number };

const columns = [
  { key: "customerId", label: "ID" },
  { key: "customerName", label: "Customer Name" },
  { key: "customerCode", label: "Code" },
  { key: "contactPerson", label: "Contact" },
  { key: "contactNumber", label: "Phone" },
  { key: "location", label: "Location" },
  { key: "natureOfBusiness", label: "Type" },
  { key: "statusMaster", label: "Status", render: (v: string) => (
    <Badge variant={v === "Active" ? "default" : "secondary"} className="text-xs">{v}</Badge>
  )},
];

const emptyForm = { customerName: "", customerCode: "", tinNumber: "", vatNumber: "", contactPerson: "", contactNumber: "", emailAddress: "", location: "", address: "", natureOfBusiness: "", creditAllowed: "No" as 'Yes'|'No', tier: "Silver" as any, statusMaster: "Active" as any };

export default function CustomersPage() {
  const router = useRouter();
  const { data, loading, create, update, remove } = useMockCrud<CustomerWithId>({ table: "customers" });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<CustomerWithId | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CustomerWithId | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
      router.replace('/login');
    }
  }, [router]);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (row: CustomerWithId) => {
    setEditing(row);
    setForm({
      customerName: row.customerName || "",
      customerCode: row.customerCode || "",
      tinNumber: row.tinNumber || "",
      vatNumber: row.vatNumber || "",
      contactPerson: row.contactPerson || "",
      contactNumber: row.contactNumber || "",
      emailAddress: row.emailAddress || "",
      location: row.location || "",
      address: row.address || "",
      natureOfBusiness: row.natureOfBusiness || "",
      creditAllowed: row.creditAllowed || "No",
      tier: row.tier || "Silver",
      statusMaster: row.statusMaster || "Active",
    });
    setDialogOpen(true);
  };
  const openDelete = (row: CustomerWithId) => { setDeleteTarget(row); setDeleteOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const record = {
      customerName: form.customerName,
      customerCode: form.customerCode || undefined,
      tinNumber: form.tinNumber || undefined,
      vatNumber: form.vatNumber || undefined,
      contactPerson: form.contactPerson || undefined,
      contactNumber: form.contactNumber || undefined,
      emailAddress: form.emailAddress || undefined,
      location: form.location || undefined,
      address: form.address || undefined,
      natureOfBusiness: form.natureOfBusiness || undefined,
      creditAllowed: form.creditAllowed,
      tier: form.tier,
      statusMaster: form.statusMaster,
      customerId: editing ? editing.customerId : `CUST${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    };
    const ok = editing ? await update(editing.id, record as any) : await create(record as any);
    if (ok) setDialogOpen(false);
  };

  const handleDelete = async () => {
    if (deleteTarget) { await remove(deleteTarget.id); setDeleteOpen(false); }
  };

  return (
    <div className="animate-fade-in p-6 bg-background flex-1 overflow-auto">
      <DataPage title="Customers" description="Manage your wholesale and retail customers" actionLabel="Add Customer" onAction={openAdd}>
        <DataTable columns={columns} data={data} loading={loading} searchPlaceholder="Search customers..." onEdit={openEdit} onDelete={openDelete} />
      </DataPage>

      <CrudFormDialog open={dialogOpen} onOpenChange={setDialogOpen} title={editing ? "Edit Customer" : "Add Customer"} description={editing ? "Update customer details" : "Add a new customer"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label required>Customer Name</Label>
            <Input id="customerName" required value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Customer Code</Label>
              <Input id="customerCode" value={form.customerCode} onChange={(e) => setForm({ ...form, customerCode: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label required>Nature of Business</Label>
              <Input id="natureOfBusiness" required value={form.natureOfBusiness} onChange={(e) => setForm({ ...form, natureOfBusiness: e.target.value })} placeholder="e.g. Wholesale, Retail" />
            </div>
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
            <Label>Email Address</Label>
            <Input id="emailAddress" type="email" value={form.emailAddress} onChange={(e) => setForm({ ...form, emailAddress: e.target.value })} />
          </div>

          <div className="space-y-2">
            <Label required>Location Address</Label>
            <Input id="location" required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>

          <div className="space-y-2">
            <Label>Full Address</Label>
            <Textarea id="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>TIN Number</Label>
              <Input id="tinNumber" value={form.tinNumber} onChange={(e) => setForm({ ...form, tinNumber: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>VAT Number</Label>
              <Input id="vatNumber" value={form.vatNumber} onChange={(e) => setForm({ ...form, vatNumber: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Credit Allowed</Label>
              <Select value={form.creditAllowed} onValueChange={(v: any) => setForm({ ...form, creditAllowed: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tier</Label>
              <Select value={form.tier} onValueChange={(v: any) => setForm({ ...form, tier: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Gold">Gold</SelectItem>
                  <SelectItem value="Silver">Silver</SelectItem>
                  <SelectItem value="Bronze">Bronze</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label required>Status</Label>
              <Select value={form.statusMaster} onValueChange={(v: any) => setForm({ ...form, statusMaster: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
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

