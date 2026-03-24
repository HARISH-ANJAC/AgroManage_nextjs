"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  Save,
  Send,
  Info,
  FileText,
  User,
  Calendar,
  Package,
  Receipt,
  BadgeCheck,
  Globe,
  Settings,
  ReceiptText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDeliveryNoteStore } from "@/hooks/useDeliveryNoteStore";
import { useSalesInvoiceStore } from "@/hooks/useSalesInvoiceStore";

function CreateInvoiceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const today = new Date().toISOString().split("T")[0];

  const { notes: deliveryNotes } = useDeliveryNoteStore();
  const { invoices, addInvoice, updateInvoice } = useSalesInvoiceStore();

  const [header, setHeader] = useState({
    invoiceDate: today,
    dnRefNo: "",
    customer: "",
    currency: "TZS",
    status: "Draft",
    remarks: ""
  });

  const [items, setItems] = useState<any[]>([]);

  // Filter delivered notes only for new invoices
  const availableDNs = useMemo(() => {
    return deliveryNotes.filter((dn: any) =>
      (dn.header?.status === "Delivered" || dn.status === "Delivered" || dn.status === "Submitted")
    );
  }, [deliveryNotes]);

  // Load existing data if editing
  useEffect(() => {
    if (editId && invoices.length > 0) {
      const existing = invoices.find((inv: any) => inv.id === editId || (inv.header && (inv.header.invoiceRefNo === editId)));
      if (existing) {
        const h = existing.header || existing;
        setHeader({
          invoiceDate: h.invoiceDate || today,
          dnRefNo: h.dnRefNo || h.deliveryNoteRefNo || "",
          customer: h.customer || "",
          currency: h.currency || "TZS",
          status: h.status || "Draft",
          remarks: h.remarks || ""
        });
        if (existing.items) setItems(existing.items);
      }
    }
  }, [editId, invoices]);

  // Handle DN Selection
  useEffect(() => {
    if (!editId && header.dnRefNo) {
      const selectedDN = deliveryNotes.find((dn: any) =>
        (dn.header?.deliveryNoteRefNo || dn.deliveryNoteRefNo || dn.id) === header.dnRefNo
      );

      if (selectedDN) {
        const h = selectedDN.header || selectedDN;
        setHeader(prev => ({
          ...prev,
          customer: h.customer || "N/A",
          currency: h.currency || "TZS"
        }));

        const dnItems = selectedDN.items || [];
        setItems(dnItems.map((item: any, idx: number) => ({
          id: idx + 1,
          productId: item.productId,
          productName: item.productName || "Unknown Product",
          dnQty: item.deliveryQty || item.totalQty || 0,
          invoiceQty: item.deliveryQty || item.totalQty || 0,
          uom: item.uom || "KG",
          rate: item.rate || 0,
          vatPercent: 18,
          amount: (item.deliveryQty || item.totalQty || 0) * (item.rate || 0)
        })));
      }
    }
  }, [header.dnRefNo, deliveryNotes, editId]);

  const updateInvoiceQty = (id: number, qty: number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const validatedQty = Math.max(0, Math.min(qty, item.dnQty));
        return {
          ...item,
          invoiceQty: validatedQty,
          amount: validatedQty * item.rate
        };
      }
      return item;
    }));
  };

  const totals = useMemo(() => {
    const totalAmount = items.reduce((sum, i) => sum + i.amount, 0);
    const totalVat = items.reduce((sum, i) => sum + (i.amount * (i.vatPercent / 100)), 0);
    const grandTotal = totalAmount + totalVat;
    return { totalAmount, totalVat, grandTotal };
  }, [items]);

  const handleCreateInvoice = (status: string = "Issued") => {
    if (!header.dnRefNo) {
      toast.error("Please select a Delivery Note Reference");
      return;
    }

    const payload = {
      header: {
        ...header,
        ...totals,
        invoiceRefNo: `INV-${Date.now()}`,
        status: typeof status === "string" ? status : header.status
      },
      items,
      audit: {
        createdAt: new Date().toISOString()
      }
    };

    try {
      if (editId) {
        updateInvoice(editId, payload);
        toast.success("Invoice Updated Successfully!");
      } else {
        addInvoice(payload);
        toast.success(`Invoice ${status === "Draft" ? "Saved as Draft" : "Generated"} Successfully!`);
      }
      router.push("/sales-invoices");
    } catch (e) {
      toast.error("Failed to save Invoice");
    }
  };

  return (
    <div className="max-w-full mx-auto pb-20 px-4 sm:px-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4 mt-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/sales-invoices")}
            className="p-2.5 rounded-full border border-[#E2E8F0] hover:bg-muted transition-colors bg-white shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">
              {editId ? `Edit Invoice: ${editId}` : "Create New Tax Invoice"}
            </h1>
            <div className="flex items-center gap-1.5 mt-1 text-[#059669] font-medium text-[13px]">
              <Info className="w-4 h-4" />
              <span>
                {editId
                  ? "Update invoice quantities and verify financial totals."
                  : "Step 3: Generate financial obligation based on verified Delivery Note (DN)."}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => handleCreateInvoice("Draft")}
            className="rounded-xl border-[#E2E8F0] h-11 px-6 font-bold hover:bg-[#F8FAFC]"
          >
            <Save className="w-4 h-4 mr-2" /> Save Draft
          </Button>
          <Button
            onClick={() => handleCreateInvoice("Issued")}
            className="bg-[#1A2E28] hover:bg-[#1A2E28]/90 text-white font-bold rounded-xl px-8 h-11 transition-all active:scale-95 shadow-md shadow-black/10"
          >
            <Send className="w-4 h-4 mr-2" /> {editId ? "Update Invoice" : "Generate Invoice"}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Core Details Card */}
        <div className="bg-white rounded-[24px] border border-[#E2E8F0] p-8 shadow-sm">
          <h2 className="text-base font-bold text-[#0F172A] mb-8 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[10px] font-bold text-[#64748B]">1</span>
            Header Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Invoice Date*</Label>
              <Input
                type="date"
                value={header.invoiceDate}
                onChange={(e) => setHeader({ ...header, invoiceDate: e.target.value })}
                className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11 font-medium"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">DN Reference Source*</Label>
              <Select value={header.dnRefNo} onValueChange={(v) => setHeader({ ...header, dnRefNo: v })}>
                <SelectTrigger className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11 font-bold">
                  <SelectValue placeholder="Select DN Reference" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {availableDNs.map((dn: any) => {
                    const ref = dn.header?.deliveryNoteRefNo || dn.deliveryNoteRefNo || dn.id;
                    const customer = dn.header?.customer || dn.customer || "N/A";
                    return (
                      <SelectItem key={dn.id} value={ref} className="font-medium">
                        {ref} <span className="text-[#94A3B8] font-normal">— {customer}</span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Customer (Context)</Label>
              <Input value={header.customer} disabled className="bg-[#F1F5F9] border-[#E2E8F0] rounded-xl h-11 font-bold italic" placeholder="Auto-populated..." />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Status</Label>
              <Select value={header.status} onValueChange={(v) => setHeader({ ...header, status: v })}>
                <SelectTrigger className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11 font-bold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Issued">Issued</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Currency</Label>
              <div className="h-11 bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl flex items-center px-4 font-black text-[#64748B]">
                <Globe className="w-4 h-4 mr-2" /> {header.currency}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Remarks / Internal Notes</Label>
              <Input
                placeholder="Enter any additional context..."
                value={header.remarks}
                onChange={(e) => setHeader({ ...header, remarks: e.target.value })}
                className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11"
              />
            </div>
          </div>
        </div>

        {/* Line Items Card */}
        <div className="bg-white rounded-[24px] border border-[#E2E8F0] p-8 shadow-sm">
          <h2 className="text-base font-bold text-[#0F172A] mb-8 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[10px] font-bold text-[#64748B]">2</span>
            Invoice Line Items
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-[#F8FAFC]/50 transition-colors">
                  <th className="text-left p-4 text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Product</th>
                  <th className="text-center p-4 text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">DN Qty</th>
                  <th className="text-center p-4 text-[10px] font-bold uppercase tracking-widest text-[#059669]">Inv Qty *</th>
                  <th className="text-center p-4 text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">UOM</th>
                  <th className="text-right p-4 text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Rate</th>
                  <th className="text-center p-4 text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">VAT %</th>
                  <th className="text-right p-4 text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {items.length > 0 ? (
                  items.map((item) => (
                    <tr key={item.id} className="hover:bg-[#F8FAFC]/30 transition-colors group">
                      <td className="p-4 py-6 font-bold text-[#0F172A]">{item.productName}</td>
                      <td className="p-4 text-center text-[#64748B] font-medium">{item.dnQty.toLocaleString()}</td>
                      <td className="p-4 text-center">
                        <Input
                          type="number"
                          value={item.invoiceQty}
                          onChange={(e) => updateInvoiceQty(item.id, parseFloat(e.target.value) || 0)}
                          className="w-24 mx-auto bg-white border-[#E2E8F0] rounded-xl h-10 text-center font-black text-[#059669]"
                        />
                      </td>
                      <td className="p-4 text-center text-[#94A3B8] font-black uppercase text-xs">{item.uom}</td>
                      <td className="p-4 text-right font-medium text-[#0F172A]">{item.rate.toLocaleString()}</td>
                      <td className="p-4 text-center text-[#64748B] font-bold text-xs">{item.vatPercent}%</td>
                      <td className="p-4 text-right font-black text-[#0F172A] tabular-nums tracking-tighter">
                        {item.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-16 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <ReceiptText className="w-12 h-12 text-[#E2E8F0]" />
                        <p className="text-[#94A3B8] font-bold text-sm">Select a Valid Delivery Note Reference to populate items.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Financial Summary Overlay */}
          {items.length > 0 && (
            <div className="mt-8 flex justify-end">
              <div className="w-full max-w-sm space-y-4 bg-[#F8FAFC]/50 p-6 rounded-3xl border border-[#F1F5F9]">
                <div className="flex justify-between items-center text-xs font-bold text-[#64748B] uppercase tracking-widest px-1">
                  <span>Subtotal</span>
                  <span className="text-[#0F172A] font-black tracking-tight">{header.currency} {totals.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold text-[#64748B] uppercase tracking-widest px-1">
                  <span>VAT (18%)</span>
                  <span className="text-[#059669] font-black tracking-tight">{header.currency} {totals.totalVat.toLocaleString()}</span>
                </div>
                <div className="pt-4 border-t border-[#E2E8F0] flex justify-between items-center">
                  <span className="text-[10px] font-black text-[#0F172A] uppercase tracking-[0.2em]">Total Obligation</span>
                  <span className="text-2xl font-black text-[#0F172A] tracking-tighter tabular-nums">{header.currency} {totals.grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>


      </div>
    </div>
  );
}

export default function CreateSalesInvoicePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-24 min-h-screen text-slate-400 font-bold animate-pulse uppercase tracking-widest">Initialising Premium Financial Suite...</div>}>
      <CreateInvoiceContent />
    </Suspense>
  );
}
