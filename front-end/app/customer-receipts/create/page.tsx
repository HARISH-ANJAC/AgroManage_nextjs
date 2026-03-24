"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo, Suspense } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  Save,
  Send,
  Plus,
  Trash2,
  Info,
  Receipt,
  CreditCard,
  Banknote,
  ShieldCheck,
  X,
  History,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCustomerReceiptStore } from "@/hooks/useCustomerReceiptStore";
import { useSalesInvoiceStore } from "@/hooks/useSalesInvoiceStore";
import { useMasterData } from "@/hooks/useMasterData";

interface InvoiceLine {
  id: string;
  taxInvoiceRefNo: string;
  actualAmount: number;
  paidAmount: number;
  outstanding: number;
  adjustingAmount: number;
  remarks: string;
}

function CreateReceiptContent() {
  const navigate = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const { receipts: allReceipts, addReceipt, updateReceipt } = useCustomerReceiptStore();
  const { invoices: taxInvoices = [] } = useSalesInvoiceStore();
  const today = new Date().toISOString().split("T")[0];

  // Master Data
  const { data: companies = [] } = useMasterData("companies");
  const { data: customers = [] } = useMasterData("customers");
  const { data: paymentModes = [] } = useMasterData("payment-modes");
  const { data: banks = [] } = useMasterData("banks");
  const { data: bankAccounts = [] } = useMasterData("company-bank-accounts");
  const { data: currencies = [] } = useMasterData("currencies");

  const [header, setHeader] = useState({
    receiptDate: today,
    paymentType: "Partial Payment",
    company: "",
    customer: "",
    paymentMode: "",
    crBankCash: "",
    crAccount: "",
    drBankCash: "",
    transactionRefNo: "",
    transactionDate: today,
    currency: "TZS",
    exchangeRate: 1,
    status: "Pending",
    remarks: "",
  });

  const [items, setItems] = useState<InvoiceLine[]>([]);

  // Load Initial Data
  useEffect(() => {
    if (editId && allReceipts.length > 0) {
      const existing = allReceipts.find((r: any) => r.id === editId || r.receiptRefNo === editId);
      if (existing) {
        setHeader({
          receiptDate: existing.receiptDate || today,
          paymentType: existing.paymentType || "Partial Payment",
          company: String(existing.company || ""),
          customer: String(existing.customer || ""),
          paymentMode: String(existing.paymentMode || ""),
          crBankCash: String(existing.crBankCash || ""),
          crAccount: String(existing.crAccount || ""),
          drBankCash: String(existing.drBankCash || ""),
          transactionRefNo: existing.transactionRefNo || "",
          transactionDate: existing.transactionDate || today,
          currency: String(existing.currency || "TZS"),
          exchangeRate: Number(existing.exchangeRate) || 1,
          status: existing.status || "Pending",
          remarks: existing.remarks || "",
        });
        if (existing.items) setItems(existing.items);
      }
    } else if (companies.length > 0) {
      setHeader(prev => ({
        ...prev,
        company: companies[0]?.companyName || "",
        currency: currencies[0]?.currencyName || "TZS",
        paymentMode: paymentModes[0]?.paymentModeName || ""
      }));
    }
  }, [editId, allReceipts, companies, currencies, paymentModes]);

  const totalReceiptAmount = useMemo(() => items.reduce((sum, i) => sum + i.adjustingAmount, 0), [items]);

  const addBlankRow = () => {
    setItems([...items, {
      id: Math.random().toString(36).substr(2, 9),
      taxInvoiceRefNo: "",
      actualAmount: 0,
      paidAmount: 0,
      outstanding: 0,
      adjustingAmount: 0,
      remarks: ""
    }]);
  };

  const handleInvoiceSelect = (id: string, ref: string) => {
    const inv = taxInvoices.find((i: any) => i.taxInvoiceRefNo === ref || i.header?.invoiceRefNo === ref);
    if (!inv) return;

    setItems(items.map(item => {
      if (item.id === id) {
        const amount = Number(inv.finalSalesAmount || inv.header?.grandTotal || 0);
        return {
          ...item,
          taxInvoiceRefNo: ref,
          actualAmount: amount,
          paidAmount: 0,
          outstanding: amount,
          adjustingAmount: 0
        };
      }
      return item;
    }));
  };

  const updateAdjustAmount = (id: string, amt: number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, adjustingAmount: Math.max(0, Math.min(amt, item.outstanding)) };
      }
      return item;
    }));
  };

  const handleSaveReceipt = async (status: string = "Pending") => {
    if (!header.customer) { toast.error("Please select a customer"); return; }
    if (items.some(i => !i.taxInvoiceRefNo)) { toast.error("Please select invoices for all lines"); return; }

    const receiptRefNo = editId ? editId : `RCP/${new Date().getMonth() + 1}/${Math.floor(Math.random() * 1000)}`;

    // Simplification for brevity in this UI update
    const payload = {
      header: {
        ...header,
        receiptRefNo,
        receiptAmount: totalReceiptAmount,
        status: typeof status === "string" ? status : header.status
      },
      items,
      audit: { createdAt: new Date().toISOString() }
    };

    try {
      if (editId) {
        await updateReceipt(editId, payload);
        toast.success("Receipt updated successfully");
      } else {
        await addReceipt(payload);
        toast.success(`Receipt ${status === "Draft" ? "saved" : "recorded"} successfully`);
      }
      navigate.push("/customer-receipts");
    } catch (error) {
      toast.error("Failed to save receipt");
    }
  };

  return (
    <div className="max-w-full mx-auto pb-20 px-4 sm:px-6">
      {/* Premium Navigation Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4 mt-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate.push("/customer-receipts")}
            className="p-2.5 rounded-full border border-[#E2E8F0] hover:bg-muted transition-colors bg-white shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">
              {editId ? `Edit Receipt: ${editId}` : "Record Customer Receipt"}
            </h1>
            <div className="flex items-center gap-1.5 mt-1 text-[#059669] font-medium text-[13px]">
              <Info className="w-4 h-4" />
              <span>Map payments against tax invoices to close outstanding receivables.</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate.push("/customer-receipts")} className="rounded-xl border-[#E2E8F0] h-11 px-6 font-bold hover:bg-[#F8FAFC]">
            Cancel
          </Button>
          <Button onClick={() => handleSaveReceipt("Pending")} className="bg-[#1A2E28] hover:bg-[#1A2E28]/90 text-white font-bold rounded-xl px-8 h-11 transition-all active:scale-95 shadow-md shadow-black/10">
            <Send className="w-4 h-4 mr-2" /> {editId ? "Update Receipt" : "Record Receipt"}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Settlement Core Details Card */}
        <div className="bg-white rounded-[24px] border border-[#E2E8F0] p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Receipt Date*</Label>
              <Input type="date" value={header.receiptDate} onChange={(e) => setHeader({ ...header, receiptDate: e.target.value })} className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-12 font-medium" />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Customer Source*</Label>
              <Select value={header.customer} onValueChange={(v) => setHeader({ ...header, customer: v })}>
                <SelectTrigger className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-12 font-bold focus:ring-emerald-500/20">
                  <SelectValue placeholder="Select XYZ Industries..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {customers.map((c: any) => <SelectItem key={c.id} value={c.customerName}>{c.customerName}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Payment Mode</Label>
              <Select value={header.paymentMode} onValueChange={(v) => setHeader({ ...header, paymentMode: v })}>
                <SelectTrigger className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-12 font-bold">
                  <SelectValue placeholder="Cash / Bank Transfer" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {paymentModes.map((pm: any) => <SelectItem key={pm.id} value={pm.paymentModeName}>{pm.paymentModeName}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Deposit Bank</Label>
              <Select value={header.crBankCash} onValueChange={(v) => setHeader({ ...header, crBankCash: v })}>
                <SelectTrigger className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-12 font-bold">
                  <SelectValue placeholder="Select Depository Bank" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {banks.map((b: any) => <SelectItem key={b.id} value={b.bankName}>{b.bankName}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Transaction Reference</Label>
              <Input value={header.transactionRefNo} onChange={(e) => setHeader({ ...header, transactionRefNo: e.target.value })} placeholder="TXN-2026-001" className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-12 font-mono font-bold" />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Workflow Status</Label>
              <Select value={header.status} onValueChange={(v) => setHeader({ ...header, status: v })}>
                <SelectTrigger className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-12 font-bold text-[#059669]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Confirmed" className="text-emerald-600 font-bold">Confirmed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Financial Summary Line */}
          <div className="mt-12 pt-8 border-t border-[#F1F5F9] flex flex-col sm:flex-row items-end sm:items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#94A3B8] mb-1">Total Liquidation</p>
                <p className="text-3xl font-black text-[#0F172A] tracking-tighter">
                  {header.currency} {totalReceiptAmount.toLocaleString()}
                </p>
              </div>
            </div>
            <Button onClick={addBlankRow} variant="outline" className="rounded-2xl h-12 px-6 border-emerald-100 bg-[#F0FDF4]/50 text-[#059669] font-black hover:bg-emerald-100 transition-all">
              <Plus className="w-4 h-4 mr-2" /> Add Invoice Allocation
            </Button>
          </div>
        </div>

        {/* Allocation Grid Card */}
        <div className="bg-white rounded-[24px] border border-[#E2E8F0] p-8 shadow-sm">
          <h2 className="text-base font-bold text-[#0F172A] mb-8 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[10px] font-bold text-[#64748B]">2</span>
            Invoice Allocation Details
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-[#F8FAFC]/50 transition-colors">
                  <th className="text-left p-4 w-12 text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">#</th>
                  <th className="text-left p-4 text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Tax Invoice</th>
                  <th className="text-right p-4 text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Invoice Amt</th>
                  <th className="text-right p-4 text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Already Paid</th>
                  <th className="text-right p-4 text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Outstanding</th>
                  <th className="text-center p-4 text-[10px] font-bold uppercase tracking-widest text-[#059669]">Adjust Amount *</th>
                  <th className="p-4 w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {items.length > 0 ? (
                  items.map((item, index) => (
                    <tr key={item.id} className="hover:bg-[#F8FAFC]/30 transition-colors group">
                      <td className="p-4 text-[#94A3B8] font-bold">{index + 1}</td>
                      <td className="p-4 min-w-[200px]">
                        <Select value={item.taxInvoiceRefNo} onValueChange={(v) => handleInvoiceSelect(item.id, v)}>
                          <SelectTrigger className="bg-white border-[#E2E8F0] rounded-xl h-10 font-bold text-[#059669]">
                            <SelectValue placeholder="Select Invoice..." />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            {taxInvoices.map((inv: any) => {
                              const ref = inv.taxInvoiceRefNo || inv.header?.invoiceRefNo || inv.id;
                              return <SelectItem key={ref} value={ref}>{ref}</SelectItem>;
                            })}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-4 text-right font-medium text-[#64748B]">{item.actualAmount.toLocaleString()}</td>
                      <td className="p-4 text-right font-medium text-[#64748B]">{item.paidAmount.toLocaleString()}</td>
                      <td className="p-4 text-right font-bold text-[#0F172A]">{item.outstanding.toLocaleString()}</td>
                      <td className="p-4 text-center">
                        <Input
                          type="number"
                          value={item.adjustingAmount}
                          onChange={(e) => updateAdjustAmount(item.id, parseFloat(e.target.value) || 0)}
                          className="w-32 mx-auto bg-white border-[#E2E8F0] rounded-xl h-10 text-center font-black text-[#059669]"
                        />
                      </td>
                      <td className="p-4">
                        <button onClick={() => setItems(items.filter(i => i.id !== item.id))} className="p-2 rounded-lg hover:bg-destructive/10 text-[#94A3B8] hover:text-destructive transition-all">
                          <X className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-16 text-center">
                      <div className="flex flex-col items-center gap-4 text-[#94A3B8]">
                        <Receipt className="w-12 h-12 opacity-20" />
                        <p className="font-bold text-sm">No allocations defined. Click "Add Invoice Allocation" to begin.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>


      </div>
    </div>
  );
}

export default function CreateCustomerReceiptPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-24 min-h-screen text-slate-400 font-bold animate-pulse uppercase tracking-widest">Initialising Premium Settlement Suite...</div>}>
      <CreateReceiptContent />
    </Suspense>
  );
}
