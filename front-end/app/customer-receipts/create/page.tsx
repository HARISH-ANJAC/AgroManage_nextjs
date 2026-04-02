"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  ShoppingBag,
  CreditCard,
  Building,
  User,
  Calendar,
  Hash,
  Wallet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useCustomerReceiptStore } from "@/hooks/useCustomerReceiptStore";
import { useCustomers, useCompanies, useCurrencies } from "@/hooks/useStoreData";
import { getCurrentUser } from "@/lib/auth";
import { Skeleton } from "@/components/ui/skeleton";

function CreateReceiptContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const today = new Date().toISOString().split("T")[0];

  const { addReceipt, getReceiptById, getUnpaidInvoicesByCustomerId, isLoading } = useCustomerReceiptStore();
  const { data: customers = [], isLoading: customersLoading } = useCustomers();
  const { data: companies = [], isLoading: companiesLoading } = useCompanies();
  const { data: currencies = [], isLoading: currenciesLoading } = useCurrencies();

  const [header, setHeader] = useState({
    receiptDate: today,
    companyId: 1,
    customerId: 0,
    paymentModeId: 1, // Default regular
    receiptAmount: 0,
    transactionRefNo: "",
    transactionDate: today,
    currencyId: 1,
    exchangeRate: 1,
    paymentType: "Regular",
    status: "Open",
    remarks: ""
  });

  const [items, setItems] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);

  // Initialize defaults
  useEffect(() => {
    if (!editId && (companies as any[]).length > 0) {
      setHeader(prev => ({
        ...prev,
        companyId: prev.companyId || ((companies as any[])[0]?.companyId || 0)
      }));
    }
  }, [editId, companies]);

  // Load existing data if editing
  useEffect(() => {
    const loadReceipt = async () => {
      if (editId) {
        toast.loading("Loading Receipt details...", { id: "load-cr" });
        const res = await getReceiptById(editId as string);
        if (res && res.header) {
          const h = res.header;
          setHeader({
            receiptDate: h.receiptDate ? new Date(h.receiptDate).toISOString().split("T")[0] : today,
            companyId: h.companyId || 1,
            customerId: h.customerId || 0,
            paymentModeId: h.paymentModeId || 1,
            receiptAmount: Number(h.receiptAmount) || 0,
            transactionRefNo: h.transactionRefNo || "",
            transactionDate: h.transactionDate ? new Date(h.transactionDate).toISOString().split("T")[0] : today,
            currencyId: h.currencyId || 1,
            exchangeRate: Number(h.exchangeRate) || 1,
            paymentType: h.paymentType || "Regular",
            status: h.status || "Open",
            remarks: h.remarks || ""
          });

          if (res.items) {
            setItems(res.items.map((it: any) => ({
              id: it.id,
              taxInvoiceRefNo: it.taxInvoiceRefNo,
              actualInvoiceAmount: Number(it.actualInvoiceAmount) || 0,
              alreadyPaidAmount: Number(it.alreadyPaidAmount) || 0,
              outstandingInvoiceAmount: Number(it.outstandingInvoiceAmount) || 0,
              receiptInvoiceAdjustAmount: Number(it.receiptInvoiceAdjustAmount) || 0,
              remarks: it.remarks || ""
            })));
          }
          toast.success("Details loaded", { id: "load-cr" });
        }
      }
    };
    loadReceipt();
  }, [editId, getReceiptById]);

  // Load Customer Invoices when customer changes
  useEffect(() => {
    const loadInvoices = async () => {
      if (header.customerId && !editId) {
        const data = await getUnpaidInvoicesByCustomerId(header.customerId);
        setInvoices(data);

        // Auto-allocate if possible
        setItems(data.map((inv: any) => ({
          id: inv.taxInvoiceRefNo,
          taxInvoiceRefNo: inv.taxInvoiceRefNo,
          actualInvoiceAmount: Number(inv.finalSalesAmount) || 0,
          alreadyPaidAmount: 0,
          outstandingInvoiceAmount: Number(inv.finalSalesAmount) || 0,
          receiptInvoiceAdjustAmount: 0,
          remarks: ""
        })));
      }
    };
    loadInvoices();
  }, [header.customerId, editId, getUnpaidInvoicesByCustomerId]);

  const handleSave = async () => {
    if (!header.customerId) {
      toast.error("Please select a Customer");
      return;
    }
    if (header.receiptAmount <= 0) {
      toast.error("Receipt Amount must be greater than 0");
      return;
    }

    try {
      const payload = {
        header: header,
        items: items.filter(it => it.receiptInvoiceAdjustAmount > 0),
        audit: { user: getCurrentUser()?.username || "System" }
      };

      if (editId) {
        toast.error("Edit not supported for finalized receipts yet.");
      } else {
        await addReceipt(payload);
        toast.success("Receipt created successfully!");
      }
      router.push("/customer-receipts");
    } catch (e: any) {
      toast.error(e.message || "Error saving receipt");
    }
  };

  const allocateAmount = (id: string, value: number) => {
    setItems(items.map(it => it.id === id ? { ...it, receiptInvoiceAdjustAmount: value } : it));
  };

  const totalAllocated = items.reduce((acc, it) => acc + (Number(it.receiptInvoiceAdjustAmount) || 0), 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Top Header */}
      <div className="bg-white border-b border-[#E2E8F0]  z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
              <ArrowLeft className="w-5 h-5 text-[#64748B]" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-[#0F172A]">{editId ? "View Receipt" : "Create Customer Receipt"}</h1>
              <p className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider">Settlement & Inbound Payment</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => router.back()} className="rounded-xl border-[#E2E8F0] font-semibold text-[#64748B] hover:bg-[#F8FAFC]">Cancel</Button>
            <Button onClick={handleSave} className="bg-[#1A2E28] hover:bg-[#254139] text-white rounded-xl px-6 flex items-center gap-2 shadow-lg">
              <Save className="w-4 h-4" />
              <span>{editId ? "Update Receipt" : "Save Receipt"}</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8 space-y-8">
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-emerald-50 rounded-xl">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-base font-bold text-[#0F172A]">Payment Header</h3>
              </div>
              <div className="grid grid-cols-2 gap-x-10 gap-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]"> Receipt Date</Label>
                  <Input type="date" value={header.receiptDate} onChange={(e) => setHeader({ ...header, receiptDate: e.target.value })} className="rounded-xl h-11" />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Customer*</Label>
                  {customersLoading ? (
                    <Skeleton className="h-11 w-full rounded-xl" />
                  ) : (
                    <Select value={String(header.customerId)} onValueChange={(v) => setHeader({ ...header, customerId: Number(v) })}>
                      <SelectTrigger className="rounded-xl h-11 font-bold">
                        <SelectValue placeholder="Select Customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((c: any) => (
                          <SelectItem key={c.id} value={String(c.id)}>{c.customerName || c.CUSTOMER_NAME}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Receipt Amount (Grand)*</Label>
                  <Input
                    type="number"
                    value={header.receiptAmount}
                    onChange={(e) => setHeader({ ...header, receiptAmount: Number(e.target.value) })}
                    className="rounded-xl h-11 font-black text-lg bg-emerald-50 border-emerald-100"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Transaction Ref (Cheque/EFT)</Label>
                  <Input
                    placeholder="Enter Reference Number"
                    value={header.transactionRefNo}
                    onChange={(e) => setHeader({ ...header, transactionRefNo: e.target.value })}
                    className="rounded-xl h-11"
                  />
                </div>
              </div>
            </div>

            {/* Allocation Table */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
              <div className="p-6 border-b border-[#F1F5F9] bg-[#F8FAFC]/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <ShoppingBag className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-base font-bold text-[#0F172A]">Outstanding Invoices</h3>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                      <th className="px-6 py-4 text-[10px] font-bold uppercase text-[#64748B] text-left">Invoice Ref</th>
                      <th className="px-4 py-4 text-[10px] font-bold uppercase text-[#64748B] text-center">Inv. Amount</th>
                      <th className="px-4 py-4 text-[10px] font-bold uppercase text-[#64748B] text-center">Outstanding</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase text-[#64748B] text-right w-48">Allocation Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9]">
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-[#F8FAFC]/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-[#1E293B]">{item.taxInvoiceRefNo}</td>
                        <td className="px-4 py-4 text-center text-[#64748B]">{(item.actualInvoiceAmount).toLocaleString()}</td>
                        <td className="px-4 py-4 text-center font-bold text-red-500">{(item.outstandingInvoiceAmount).toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <Input
                            type="number"
                            value={item.receiptInvoiceAdjustAmount}
                            onChange={(e) => allocateAmount(item.id, Number(e.target.value))}
                            className="text-right font-black rounded-lg h-9 border-blue-100 bg-blue-50/30"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {items.length === 0 && (
                  <div className="p-12 text-center text-[#94A3B8]">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p className="font-medium italic">No outstanding invoices for this customer.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-8">
            <div className="bg-[#1A2E28] text-white rounded-2xl shadow-xl p-8">
              <h3 className="text-sm font-bold opacity-70 uppercase tracking-widest mb-6">Allocation Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[#A7B4B1]">
                  <span className="text-xs font-bold uppercase tracking-tight">Receipt Total</span>
                  <span className="font-mono font-medium">{(header.receiptAmount).toLocaleString()} TZS</span>
                </div>
                <div className="flex justify-between items-center text-[#A7B4B1]">
                  <span className="text-xs font-bold uppercase tracking-tight">Allocated to Inv</span>
                  <span className="font-mono font-medium">{(totalAllocated).toLocaleString()} TZS</span>
                </div>
                <div className="h-px bg-white/10 my-4" />
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Unallocated Balance</span>
                  <div className="text-3xl font-black font-sans leading-none">{(header.receiptAmount - totalAllocated).toLocaleString()}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Company Account</Label>
                {companiesLoading ? (
                  <Skeleton className="h-11 w-full rounded-xl" />
                ) : (
                  <Select value={String(header.companyId)} onValueChange={(v) => setHeader({ ...header, companyId: Number(v) })}>
                    <SelectTrigger className="rounded-xl font-bold bg-[#F8FAFC]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(companies as any[]).map((c: any) => (
                        <SelectItem key={c.id} value={String(c.companyId)}>{c.companyName} (@{c.categoryName})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Internal Remarks</Label>
                <Textarea
                  value={header.remarks}
                  onChange={(e) => setHeader({ ...header, remarks: e.target.value })}
                  className="min-h-[120px] rounded-xl bg-[#F8FAFC]"
                  placeholder="Note for audit purposes..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreateCustomerReceiptPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-20 min-h-screen">Loading Receipt system...</div>}>
      <CreateReceiptContent />
    </Suspense>
  );
}
