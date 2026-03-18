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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface PurchaseInvoice {
  id: number | string;
  invoice_ref_no: string;
  invoice_no: string | null;
  invoice_date: string | null;
  purchase_type: string | null;
  mode_of_payment: string | null;
  price_terms: string | null;
  product_amount: number | null;
  total_vat_amount: number | null;
  final_amount: number | null;
  remarks: string | null;
  status: string | null;
}

const columns = [
  { key: "invoice_ref_no", label: "Ref No" },
  { key: "invoice_no", label: "Invoice No" },
  { key: "invoice_date", label: "Date", render: (v: string) => v ? new Date(v).toLocaleDateString() : "-" },
  { key: "purchase_type", label: "Type" },
  { key: "final_amount", label: "Amount", render: (v: number) => v ? `$${v.toLocaleString()}` : "$0" },
  { key: "status", label: "Status", render: (v: string) => (
    <Badge variant={v === "Confirmed" ? "default" : v === "Pending" ? "secondary" : "outline"} className="text-xs">{v}</Badge>
  )},
];

const emptyForm = { invoice_ref_no: "", invoice_no: "", invoice_date: new Date().toISOString().split("T")[0], purchase_type: "Local", mode_of_payment: "", price_terms: "", product_amount: "", total_vat_amount: "", final_amount: "", remarks: "" };

export default function SupplierInvoicesPage() {
  const router = useRouter();
  const { data, loading, create, update, remove } = useMockCrud<PurchaseInvoice>({ table: "purchase_invoices" });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<PurchaseInvoice | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PurchaseInvoice | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
      router.replace('/login');
    }
  }, [router]);

  const openAdd = () => {
    const nextNo = `SI/${new Date().toISOString().slice(5,7)}/${String(data.length + 1).padStart(3, "0")}`;
    setEditing(null); setForm({ ...emptyForm, invoice_ref_no: nextNo }); setDialogOpen(true);
  };
  const openEdit = (row: PurchaseInvoice) => {
    setEditing(row);
    setForm({ invoice_ref_no: row.invoice_ref_no, invoice_no: row.invoice_no || "", invoice_date: row.invoice_date?.split("T")[0] || "", purchase_type: row.purchase_type || "Local", mode_of_payment: row.mode_of_payment || "", price_terms: row.price_terms || "", product_amount: row.product_amount?.toString() || "", total_vat_amount: row.total_vat_amount?.toString() || "", final_amount: row.final_amount?.toString() || "", remarks: row.remarks || "" });
    setDialogOpen(true);
  };
  const openDelete = (row: PurchaseInvoice) => { setDeleteTarget(row); setDeleteOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const record = { invoice_ref_no: form.invoice_ref_no, invoice_no: form.invoice_no || null, invoice_date: form.invoice_date || null, purchase_type: form.purchase_type || null, mode_of_payment: form.mode_of_payment || null, price_terms: form.price_terms || null, product_amount: form.product_amount ? parseFloat(form.product_amount) : 0, total_vat_amount: form.total_vat_amount ? parseFloat(form.total_vat_amount) : 0, final_amount: form.final_amount ? parseFloat(form.final_amount) : 0, remarks: form.remarks || null };
    const ok = editing ? await update(editing.id, record) : await create(record);
    if (ok) setDialogOpen(false);
  };

  const handleDelete = async () => { if (deleteTarget) { await remove(deleteTarget.id); setDeleteOpen(false); } };

  return (
    <div className="animate-fade-in p-6 bg-background flex-1 overflow-auto">
      <DataPage title="Supplier Invoices" description="Process supplier invoices with three-way matching validation" actionLabel="New Invoice" onAction={openAdd}>
        <DataTable columns={columns} data={data} loading={loading} searchPlaceholder="Search invoices..." onEdit={openEdit} onDelete={openDelete} />
      </DataPage>

      <CrudFormDialog open={dialogOpen} onOpenChange={setDialogOpen} title={editing ? "Edit Supplier Invoice" : "New Supplier Invoice"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Ref No *</Label><Input required value={form.invoice_ref_no} onChange={(e) => setForm({ ...form, invoice_ref_no: e.target.value })} /></div>
            <div className="space-y-2"><Label>Invoice No</Label><Input value={form.invoice_no} onChange={(e) => setForm({ ...form, invoice_no: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Invoice Date</Label><Input type="date" value={form.invoice_date} onChange={(e) => setForm({ ...form, invoice_date: e.target.value })} /></div>
            <div className="space-y-2"><Label>Purchase Type</Label><Input value={form.purchase_type} onChange={(e) => setForm({ ...form, purchase_type: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Payment Mode</Label><Input value={form.mode_of_payment} onChange={(e) => setForm({ ...form, mode_of_payment: e.target.value })} /></div>
            <div className="space-y-2"><Label>Price Terms</Label><Input value={form.price_terms} onChange={(e) => setForm({ ...form, price_terms: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2"><Label>Product Amount</Label><Input type="number" step="0.01" value={form.product_amount} onChange={(e) => setForm({ ...form, product_amount: e.target.value })} /></div>
            <div className="space-y-2"><Label>VAT Amount</Label><Input type="number" step="0.01" value={form.total_vat_amount} onChange={(e) => setForm({ ...form, total_vat_amount: e.target.value })} /></div>
            <div className="space-y-2"><Label>Final Amount</Label><Input type="number" step="0.01" value={form.final_amount} onChange={(e) => setForm({ ...form, final_amount: e.target.value })} /></div>
          </div>
          <div className="space-y-2"><Label>Remarks</Label><Textarea value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} /></div>
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
