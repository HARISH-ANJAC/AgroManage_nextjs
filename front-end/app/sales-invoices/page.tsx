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

interface SalesInvoice {
  id: number | string;
  invoice_ref_no: string;
  invoice_date: string | null;
  invoice_type: string | null;
  total_product_amount: number | null;
  vat_amount: number | null;
  final_sales_amount: number | null;
  remarks: string | null;
  status: string | null;
}

const columns = [
  { key: "invoice_ref_no", label: "Invoice No" },
  { key: "invoice_date", label: "Date", render: (v: string) => v ? new Date(v).toLocaleDateString() : "-" },
  { key: "invoice_type", label: "Type" },
  { key: "final_sales_amount", label: "Amount", render: (v: number) => v ? `$${v.toLocaleString()}` : "$0" },
  { key: "status", label: "Status", render: (v: string) => (
    <Badge variant={v === "Paid" ? "default" : "secondary"} className="text-xs">{v}</Badge>
  )},
];

const emptyForm = { invoice_ref_no: "", invoice_date: new Date().toISOString().split("T")[0], invoice_type: "Tax Invoice", total_product_amount: "", vat_amount: "", final_sales_amount: "", remarks: "" };

export default function SalesInvoicesPage() {
  const router = useRouter();
  const { data, loading, create, update, remove } = useMockCrud<SalesInvoice>({ table: "sales_invoices" });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<SalesInvoice | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SalesInvoice | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
      router.replace('/login');
    }
  }, [router]);

  const openAdd = () => {
    const nextNo = `INV/${new Date().toISOString().slice(5,7)}/${String(data.length + 1).padStart(3, "0")}`;
    setEditing(null); setForm({ ...emptyForm, invoice_ref_no: nextNo }); setDialogOpen(true);
  };
  const openEdit = (row: SalesInvoice) => {
    setEditing(row);
    setForm({ invoice_ref_no: row.invoice_ref_no, invoice_date: row.invoice_date?.split("T")[0] || "", invoice_type: row.invoice_type || "Tax Invoice", total_product_amount: row.total_product_amount?.toString() || "", vat_amount: row.vat_amount?.toString() || "", final_sales_amount: row.final_sales_amount?.toString() || "", remarks: row.remarks || "" });
    setDialogOpen(true);
  };
  const openDelete = (row: SalesInvoice) => { setDeleteTarget(row); setDeleteOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const record = { invoice_ref_no: form.invoice_ref_no, invoice_date: form.invoice_date || null, invoice_type: form.invoice_type || null, total_product_amount: form.total_product_amount ? parseFloat(form.total_product_amount) : 0, vat_amount: form.vat_amount ? parseFloat(form.vat_amount) : 0, final_sales_amount: form.final_sales_amount ? parseFloat(form.final_sales_amount) : 0, remarks: form.remarks || null };
    const ok = editing ? await update(editing.id, record) : await create(record);
    if (ok) setDialogOpen(false);
  };

  const handleDelete = async () => { if (deleteTarget) { await remove(deleteTarget.id); setDeleteOpen(false); } };

  return (
    <div className="animate-fade-in p-6 bg-background flex-1 overflow-auto">
      <DataPage title="Sales Invoices" description="Generate and manage customer billing documents" actionLabel="New Invoice" onAction={openAdd}>
        <DataTable columns={columns} data={data} loading={loading} searchPlaceholder="Search invoices..." onEdit={openEdit} onDelete={openDelete} />
      </DataPage>
      <CrudFormDialog open={dialogOpen} onOpenChange={setDialogOpen} title={editing ? "Edit Sales Invoice" : "New Sales Invoice"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label htmlFor="invoice_ref_no">Invoice Ref No *</Label><Input id="invoice_ref_no" required value={form.invoice_ref_no} onChange={(e) => setForm({ ...form, invoice_ref_no: e.target.value })} /></div>
            <div className="space-y-2"><Label htmlFor="invoice_date">Invoice Date *</Label><Input id="invoice_date" type="date" required value={form.invoice_date} onChange={(e) => setForm({ ...form, invoice_date: e.target.value })} /></div>
          </div>
          <div className="space-y-2"><Label htmlFor="invoice_type">Invoice Type</Label><Input id="invoice_type" value={form.invoice_type} onChange={(e) => setForm({ ...form, invoice_type: e.target.value })} /></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2"><Label htmlFor="total_product_amount">Product Amount</Label><Input id="total_product_amount" type="number" step="0.01" value={form.total_product_amount} onChange={(e) => setForm({ ...form, total_product_amount: e.target.value })} /></div>
            <div className="space-y-2"><Label htmlFor="vat_amount">VAT Amount</Label><Input id="vat_amount" type="number" step="0.01" value={form.vat_amount} onChange={(e) => setForm({ ...form, vat_amount: e.target.value })} /></div>
            <div className="space-y-2"><Label htmlFor="final_sales_amount">Final Amount</Label><Input id="final_sales_amount" type="number" step="0.01" value={form.final_sales_amount} onChange={(e) => setForm({ ...form, final_sales_amount: e.target.value })} /></div>
          </div>
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
