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
import { Product } from "@/app/mock/types/master.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock categories for the form
const mainCategories = [
  { id: 'MC001', name: 'Grains' },
  { id: 'MC002', name: 'Pulses' },
  { id: 'MC003', name: 'Fertilizers' },
];

const subCategories = [
  { id: 'SC001', name: 'Maize', mainId: 'MC001' },
  { id: 'SC002', name: 'Wheat', mainId: 'MC001' },
  { id: 'SC003', name: 'Rice', mainId: 'MC001' },
  { id: 'SC004', name: 'Beans', mainId: 'MC002' },
  { id: 'SC005', name: 'NPK Fertilizer', mainId: 'MC003' },
];

type ProductWithId = Product & { id: string | number };

const columns = [
  { key: "productId", label: "ID" },
  { key: "productName", label: "Product Name" },
  { key: "mainCategoryName", label: "Category" },
  { key: "subCategoryName", label: "Sub Category" },
  { key: "uom", label: "Unit" },
  { key: "qtyPerPacking", label: "Qty/Pack" },
  { key: "alternateUom", label: "Alt. Unit" },
  {
    key: "statusMaster", label: "Status", render: (v: string) => (
      <Badge variant={v === "Active" ? "default" : "secondary"} className="text-xs">{v}</Badge>
    )
  },
];

const emptyForm = { productName: "", mainCategoryId: "", subCategoryId: "", uom: "", qtyPerPacking: "", alternateUom: "", remarks: "", statusMaster: "Active" };

export default function ProductsPage() {
  const router = useRouter();
  const { data, loading, create, update, remove } = useMockCrud<ProductWithId>({ table: "products" });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<ProductWithId | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProductWithId | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
      router.replace('/login');
    }
  }, [router]);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (row: ProductWithId) => {
    setEditing(row);
    setForm({
      productName: row.productName || "",
      mainCategoryId: row.mainCategoryId || "",
      subCategoryId: row.subCategoryId || "",
      uom: row.uom || "",
      qtyPerPacking: row.qtyPerPacking?.toString() || "",
      alternateUom: row.alternateUom || "",
      remarks: row.remarks || "",
      statusMaster: row.statusMaster || "Active",
    });
    setDialogOpen(true);
  };

  const openDelete = (row: ProductWithId) => {
    setDeleteTarget(row);
    setDeleteOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const mainCat = mainCategories.find(c => c.id === form.mainCategoryId);
    const subCat = subCategories.find(c => c.id === form.subCategoryId);

    const record = {
      productName: form.productName,
      mainCategoryId: form.mainCategoryId,
      mainCategoryName: mainCat?.name,
      subCategoryId: form.subCategoryId,
      subCategoryName: subCat?.name,
      uom: form.uom || undefined,
      qtyPerPacking: form.qtyPerPacking ? parseFloat(form.qtyPerPacking) : 0,
      alternateUom: form.alternateUom || undefined,
      remarks: form.remarks || undefined,
      statusMaster: form.statusMaster as 'Active' | 'Inactive',
      productId: editing ? editing.productId : `PRD${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    };

    const ok = editing ? await update(editing.id, record as any) : await create(record as any);
    if (ok) setDialogOpen(false);
  };

  const handleDelete = async () => {
    if (deleteTarget) {
      await remove(deleteTarget.id);
      setDeleteOpen(false);
    }
  };

  return (
    <div className="animate-fade-in p-6 bg-background flex-1 overflow-auto">
      <DataPage title="Products" description="Manage your agricultural commodities catalog" actionLabel="Add Product" onAction={openAdd}>
        <DataTable columns={columns} data={data} loading={loading} searchPlaceholder="Search products..." onEdit={openEdit} onDelete={openDelete} />
      </DataPage>

      <CrudFormDialog open={dialogOpen} onOpenChange={setDialogOpen} title={editing ? "Edit Product" : "Add Product"} description={editing ? "Update product details" : "Add a new product to the catalog"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label required>Product Name</Label>
            <Input id="productName" required value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label required>Category</Label>
              <Select value={form.mainCategoryId} onValueChange={(v) => setForm({ ...form, mainCategoryId: v, subCategoryId: "" })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {mainCategories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label required>Sub Category</Label>
              <Select value={form.subCategoryId} onValueChange={(v) => setForm({ ...form, subCategoryId: v })} disabled={!form.mainCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Sub Category" />
                </SelectTrigger>
                <SelectContent>
                  {subCategories.filter(s => s.mainId === form.mainCategoryId).map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label required>Unit of Measure</Label>
              <Input id="uom" required value={form.uom} onChange={(e) => setForm({ ...form, uom: e.target.value })} placeholder="e.g. MT, KG" />
            </div>
            <div className="space-y-2">
              <Label required>Qty per Pack</Label>
              <Input id="qtyPerPacking" type="number" step="0.01" required value={form.qtyPerPacking} onChange={(e) => setForm({ ...form, qtyPerPacking: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Alternate Unit</Label>
              <Input id="alternateUom" value={form.alternateUom} onChange={(e) => setForm({ ...form, alternateUom: e.target.value })} />
            </div>
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

