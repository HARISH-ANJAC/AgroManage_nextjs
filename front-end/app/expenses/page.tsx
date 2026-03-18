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

interface Expense {
  id: number | string;
  expense_ref_no: string;
  expense_date: string | null;
  expense_against: string | null;
  expense_type: string | null;
  receipt_no: string | null;
  total_expense_amount: number | null;
  remarks: string | null;
  status: string | null;
}

const columns = [
  { key: "expense_ref_no", label: "Ref No" },
  { key: "expense_date", label: "Date", render: (v: string) => v ? new Date(v).toLocaleDateString() : "-" },
  { key: "expense_type", label: "Type" },
  { key: "expense_against", label: "Against" },
  { key: "receipt_no", label: "Receipt No" },
  { key: "total_expense_amount", label: "Amount", render: (v: number) => v ? `$${v.toLocaleString()}` : "$0" },
  { key: "status", label: "Status" },
];

const emptyForm = { expense_ref_no: "", expense_date: new Date().toISOString().split("T")[0], expense_against: "", expense_type: "", receipt_no: "", total_expense_amount: "", remarks: "" };

export default function ExpensesPage() {
  const router = useRouter();
  const { data, loading, create, update, remove } = useMockCrud<Expense>({ table: "expenses" });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
      router.replace('/login');
    }
  }, [router]);

  const openAdd = () => {
    const nextNo = `EXP/${new Date().toISOString().slice(5,7)}/${String(data.length + 1).padStart(3, "0")}`;
    setEditing(null); setForm({ ...emptyForm, expense_ref_no: nextNo }); setDialogOpen(true);
  };
  const openEdit = (row: Expense) => {
    setEditing(row);
    setForm({ expense_ref_no: row.expense_ref_no, expense_date: row.expense_date?.split("T")[0] || "", expense_against: row.expense_against || "", expense_type: row.expense_type || "", receipt_no: row.receipt_no || "", total_expense_amount: row.total_expense_amount?.toString() || "", remarks: row.remarks || "" });
    setDialogOpen(true);
  };
  const openDelete = (row: Expense) => { setDeleteTarget(row); setDeleteOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const record = { expense_ref_no: form.expense_ref_no, expense_date: form.expense_date || null, expense_against: form.expense_against || null, expense_type: form.expense_type || null, receipt_no: form.receipt_no || null, total_expense_amount: form.total_expense_amount ? parseFloat(form.total_expense_amount) : 0, remarks: form.remarks || null };
    const ok = editing ? await update(editing.id, record) : await create(record);
    if (ok) setDialogOpen(false);
  };

  const handleDelete = async () => { if (deleteTarget) { await remove(deleteTarget.id); setDeleteOpen(false); } };

  return (
    <div className="animate-fade-in p-6 bg-background flex-1 overflow-auto">
      <DataPage title="Expenses" description="Track logistics and operational expenses" actionLabel="New Expense" onAction={openAdd}>
        <DataTable columns={columns} data={data} loading={loading} searchPlaceholder="Search expenses..." onEdit={openEdit} onDelete={openDelete} />
      </DataPage>
      <CrudFormDialog open={dialogOpen} onOpenChange={setDialogOpen} title={editing ? "Edit Expense" : "New Expense"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label htmlFor="expense_ref_no">Ref No *</Label><Input id="expense_ref_no" required value={form.expense_ref_no} onChange={(e) => setForm({ ...form, expense_ref_no: e.target.value })} /></div>
            <div className="space-y-2"><Label htmlFor="expense_date">Date *</Label><Input id="expense_date" type="date" required value={form.expense_date} onChange={(e) => setForm({ ...form, expense_date: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label htmlFor="expense_type">Expense Type</Label><Input id="expense_type" value={form.expense_type} onChange={(e) => setForm({ ...form, expense_type: e.target.value })} placeholder="Transport, Loading, etc." /></div>
            <div className="space-y-2"><Label htmlFor="expense_against">Against</Label><Input id="expense_against" value={form.expense_against} onChange={(e) => setForm({ ...form, expense_against: e.target.value })} placeholder="PO / General" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label htmlFor="receipt_no">Receipt No</Label><Input id="receipt_no" value={form.receipt_no} onChange={(e) => setForm({ ...form, receipt_no: e.target.value })} /></div>
            <div className="space-y-2"><Label htmlFor="total_expense_amount">Total Amount</Label><Input id="total_expense_amount" type="number" step="0.01" value={form.total_expense_amount} onChange={(e) => setForm({ ...form, total_expense_amount: e.target.value })} /></div>
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
