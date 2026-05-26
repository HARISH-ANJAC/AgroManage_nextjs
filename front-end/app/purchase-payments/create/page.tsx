"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Save,
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
import { usePurchasePaymentStore } from "@/hooks/usePurchasePaymentStore";
import { useSuppliers, useCompanies, useCurrencies } from "@/hooks/useStoreData";
import { useMasterData } from "@/hooks/useMasterData";
import { getCurrentUser } from "@/lib/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { SupportingDoc } from "@/components/ui/Supporting-Doc";

function CreatePaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const today = new Date().toISOString().split("T")[0];

  const { addPayment, updatePayment, getPaymentById, getUnpaidInvoicesBySupplierId, isLoading } = usePurchasePaymentStore();
  const { data: suppliers = [], isLoading: suppliersLoading } = useSuppliers();
  const { data: companies = [], isLoading: companiesLoading } = useCompanies();
  const { data: currencies = [], isLoading: currenciesLoading } = useCurrencies();
  const { data: paymentModes = [] } = useMasterData("payment-modes");
  const { data: banks = [] } = useMasterData("banks");
  const { data: accounts = [] } = useMasterData("company-bank-accounts");

  const [header, setHeader] = useState({
    paymentDate: today,
    companyId: 1,
    supplierId: 0,
    paymentModeId: 1,
    crBankCashId: 0, // Bank Account to Credit (Reduce)
    drBankCashId: 0, // Not typically used for outbound payment but schema has it
    drAccountId: 0, // Supplier Account to Debit (Reduce Liability)
    paymentAmount: 0,
    transactionRefNo: "",
    transactionDate: today,
    currencyId: 1,
    exchangeRate: 1,
    paymentType: "Regular",
    status: "Open",
    remarks: ""
  });

  const [items, setItems] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);

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
    const loadPayment = async () => {
      if (editId) {
        toast.loading("Loading Payment details...", { id: "load-pp" });
        const res = await getPaymentById(editId as string);
        if (res && res.header) {
          const h = res.header;
          setHeader({
            paymentDate: h.paymentDate ? new Date(h.paymentDate).toISOString().split("T")[0] : today,
            companyId: h.companyId || 1,
            supplierId: h.supplierId || 0,
            paymentModeId: h.paymentModeId || 1,
            crBankCashId: h.crBankCashId || 0,
            drBankCashId: h.drBankCashId || 0,
            drAccountId: h.drAccountId || 0,
            paymentAmount: Number(h.paymentAmount) || 0,
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
              purchaseInvoiceRefNo: it.purchaseInvoiceRefNo,
              actualInvoiceAmount: Number(it.actualInvoiceAmount) || 0,
              alreadyPaidAmount: Number(it.alreadyPaidAmount) || 0,
              outstandingInvoiceAmount: Number(it.outstandingInvoiceAmount) || 0,
              paymentInvoiceAdjustAmount: Number(it.paymentInvoiceAdjustAmount) || 0,
              remarks: it.remarks || ""
            })));
          }

          if (res.files) {
            setFiles(res.files);
          }
          toast.success("Details loaded", { id: "load-pp" });
        }
      }
    };
    loadPayment();
  }, [editId, getPaymentById]);

  // Load Supplier Invoices when supplier changes
  useEffect(() => {
    const loadInvoices = async () => {
      if (header.supplierId && !editId) {
        const data = await getUnpaidInvoicesBySupplierId(header.supplierId);
        const unpaid = data.filter((inv: any) => inv.outstandingAmount === undefined || Number(inv.outstandingAmount) > 0);
        setInvoices(unpaid);

        // Auto-allocate if possible
        setItems(unpaid.map((inv: any) => ({
          id: inv.purchaseInvoiceRefNo,
          purchaseInvoiceRefNo: inv.purchaseInvoiceRefNo,
          actualInvoiceAmount: Number(inv.finalInvoiceHdrAmount) || 0,
          alreadyPaidAmount: Number(inv.alreadyPaidAmount) || 0,
          outstandingInvoiceAmount: inv.outstandingAmount !== undefined ? Number(inv.outstandingAmount) : (Number(inv.finalInvoiceHdrAmount) || 0),
          paymentInvoiceAdjustAmount: 0,
          remarks: ""
        })));
      }
    };
    loadInvoices();
  }, [header.supplierId, editId, getUnpaidInvoicesBySupplierId]);

  const handleSave = async () => {
    if (!header.supplierId) {
      toast.error("Please select a Supplier");
      return;
    }
    if (header.paymentAmount <= 0) {
      toast.error("Payment Amount must be greater than 0");
      return;
    }
    if (!header.crBankCashId) {
      toast.error("Please select a Credit Bank (CR)");
      return;
    }

    if (totalAllocated > header.paymentAmount) {
      toast.error("Total Allocated cannot exceed Payment Amount");
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        header: header,
        items: items.filter(it => it.paymentInvoiceAdjustAmount > 0),
        files: files.map(f => ({
          documentType: f.DOCUMENT_TYPE || f.documentType,
          descriptionDetails: f.DESCRIPTION_DETAILS || f.descriptionDetails,
          fileName: f.FILE_NAME || f.fileName,
          contentType: f.CONTENT_TYPE || f.contentType,
          contentData: f.CONTENT_DATA || f.contentData,
          remarks: f.REMARKS || f.remarks,
        })),
        audit: { user: getCurrentUser()?.username || "System" }
      };

      if (editId) {
        await updatePayment({ id: editId, payload });
        toast.success("Purchase Payment updated successfully!");
      } else {
        await addPayment(payload);
        toast.success("Purchase Payment created successfully!");
      }
      router.push("/purchase-payments");
    } catch (e: any) {
      toast.error(e.message || "Error saving payment");
    } finally {
      setIsSaving(false);
    }
  };

  const allocateAmount = (id: string, value: number) => {
    setItems(items.map(it => {
      if (it.id === id) {
        const cappedValue = Math.min(Math.max(0, value), Number(it.outstandingInvoiceAmount) || 0);
        return { ...it, paymentInvoiceAdjustAmount: cappedValue };
      }
      return it;
    }));
  };

  // Auto-allocate logic when Payment Amount changes
  useEffect(() => {
    if (header.paymentAmount > 0 && items.length > 0) {
      const currentAllocated = items.reduce((acc, it) => acc + (Number(it.paymentInvoiceAdjustAmount) || 0), 0);
      if (currentAllocated === 0) {
        let remaining = header.paymentAmount;
        const newItems = items.map(it => {
          const outstanding = Number(it.outstandingInvoiceAmount) || 0;
          const allocation = Math.min(remaining, outstanding);
          remaining -= allocation;
          return { ...it, paymentInvoiceAdjustAmount: allocation };
        });
        setItems(newItems);
      }
    }
  }, [header.paymentAmount]);

  const totalAllocated = items.reduce((acc, it) => acc + (Number(it.paymentInvoiceAdjustAmount) || 0), 0);
  const unallocatedBalance = header.paymentAmount - totalAllocated;
  const isOverAllocated = unallocatedBalance < 0;

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
              <h1 className="text-xl font-bold text-[#0F172A]">{editId ? "View Payment" : "Create Purchase Payment"}</h1>
              <p className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider">Settlement & Outbound Payment</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => router.back()} className="rounded-xl border-[#E2E8F0] font-semibold text-[#64748B] hover:bg-[#F8FAFC]">Cancel</Button>
            <Button onClick={handleSave} className="bg-[#1A2E28] hover:bg-[#254139] text-white rounded-xl px-6 flex items-center gap-2 shadow-lg" disabled={isSaving}>
              <Save className="w-4 h-4" />
              <span>{editId ? "Update Payment" : "Save Payment"}</span>
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
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]"> Payment Date</Label>
                  <Input type="date" value={header.paymentDate} onChange={(e) => setHeader({ ...header, paymentDate: e.target.value })} className="rounded-xl h-11" />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Supplier<span className="text-red-500">*</span></Label>
                  {suppliersLoading ? (
                    <Skeleton className="h-11 w-full rounded-xl" />
                  ) : (
                    <Select value={header.supplierId ? String(header.supplierId) : undefined} onValueChange={(v) => setHeader({ ...header, supplierId: Number(v) })}>
                      <SelectTrigger className="rounded-xl h-11 font-bold">
                        <SelectValue placeholder="Select Supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map((s: any) => (
                          <SelectItem key={s.id} value={String(s.id)}>{s.supplierName || s.SUPPLIER_NAME}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Payment Mode<span className="text-red-500">*</span></Label>
                  <Select value={header.paymentModeId ? String(header.paymentModeId) : undefined} onValueChange={(v) => setHeader({ ...header, paymentModeId: Number(v) })}>
                    <SelectTrigger className="rounded-xl h-11 font-bold">
                      <SelectValue placeholder="Select Mode" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentModes.map((pm: any) => (
                        <SelectItem key={pm.id} value={String(pm.id)}>{pm.paymentModeName || pm.PAYMENT_MODE_NAME}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Currency<span className="text-red-500">*</span></Label>
                  {currenciesLoading ? (
                    <Skeleton className="h-11 w-full rounded-xl" />
                  ) : (
                    <Select value={header.currencyId ? String(header.currencyId) : undefined} onValueChange={(v) => setHeader({ ...header, currencyId: Number(v) })}>
                      <SelectTrigger className="rounded-xl h-11 font-bold">
                        <SelectValue placeholder="Select Currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((c: any) => (
                          <SelectItem key={c.id} value={String(c.id)}>{c.currencyName || c.CURRENCY_NAME}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Exchange Rate</Label>
                  <Input
                    type="number"
                    value={header.exchangeRate}
                    onChange={(e) => setHeader({ ...header, exchangeRate: Number(e.target.value) })}
                    className="rounded-xl h-11 font-bold"
                    disabled={header.currencyId === 1}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Payment Amount (Grand)<span className="text-red-500">*</span></Label>
                  <Input
                    type="number"
                    value={header.paymentAmount}
                    onChange={(e) => setHeader({ ...header, paymentAmount: Number(e.target.value) })}
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

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Transaction Date</Label>
                  <Input type="date" value={header.transactionDate} onChange={(e) => setHeader({ ...header, transactionDate: e.target.value })} className="rounded-xl h-11" />
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
                        <td className="px-6 py-4 font-bold text-[#1E293B]">{item.purchaseInvoiceRefNo}</td>
                        <td className="px-4 py-4 text-center text-[#64748B]">{(item.actualInvoiceAmount).toLocaleString()}</td>
                        <td className="px-4 py-4 text-center font-bold text-red-500">{(item.outstandingInvoiceAmount - (item.paymentInvoiceAdjustAmount || 0)).toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <Input
                            type="number"
                            value={item.paymentInvoiceAdjustAmount}
                            onChange={(e) => allocateAmount(item.id, Number(e.target.value))}
                            className={`text-right font-black rounded-lg h-9 transition-all ${item.paymentInvoiceAdjustAmount > 0 ? 'border-emerald-200 bg-emerald-50/30' : 'border-blue-100 bg-blue-50/30'}`}
                            max={item.outstandingInvoiceAmount}
                            min={0}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {items.length === 0 && (
                  <div className="p-12 text-center text-[#94A3B8]">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p className="font-medium italic">No outstanding invoices for this supplier.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Supporting Documents Section */}
            <SupportingDoc
              files={files}
              onFilesChange={setFiles}
            />
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-8">
            <div className={`rounded-2xl shadow-xl p-8 transition-colors duration-300 ${isOverAllocated ? 'bg-red-600 text-white animate-pulse' : 'bg-[#1A2E28] text-white'}`}>
              <h3 className="text-sm font-bold opacity-70 uppercase tracking-widest mb-6">Allocation Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center opacity-80">
                  <span className="text-xs font-bold uppercase tracking-tight">Payment Total</span>
                  <span className="font-mono font-medium">{(header.paymentAmount).toLocaleString()} TZS</span>
                </div>
                <div className="flex justify-between items-center opacity-80">
                  <span className="text-xs font-bold uppercase tracking-tight">Allocated to Inv</span>
                  <span className="font-mono font-medium">{(totalAllocated).toLocaleString()} TZS</span>
                </div>
                <div className="h-px bg-white/10 my-4" />
                <div className="space-y-1">
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isOverAllocated ? 'text-white' : 'text-blue-400'}`}>
                    {isOverAllocated ? "❗ OVER ALLOCATED" : "Unallocated Balance"}
                  </span>
                  <div className="text-3xl font-black font-sans leading-none">{(unallocatedBalance).toLocaleString()}</div>
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
                <Label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Credit From Bank (CR)<span className="text-red-500">*</span></Label>
                <Select value={header.crBankCashId ? String(header.crBankCashId) : undefined} onValueChange={(v) => setHeader({ ...header, crBankCashId: Number(v) })}>
                  <SelectTrigger className="rounded-xl font-bold bg-[#F8FAFC]">
                    <SelectValue placeholder="Select Payment Bank" />
                  </SelectTrigger>
                  <SelectContent>
                    {banks.map((b: any) => (
                      <SelectItem key={b.id} value={String(b.id)}>{b.bankName || b.BANK_NAME}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Debit Bank (DR)</Label>
                <Select value={header.drBankCashId ? String(header.drBankCashId) : undefined} onValueChange={(v) => setHeader({ ...header, drBankCashId: Number(v) })}>
                  <SelectTrigger className="rounded-xl font-bold bg-[#F8FAFC]">
                    <SelectValue placeholder="Select Debit Bank" />
                  </SelectTrigger>
                  <SelectContent>
                    {banks.map((b: any) => (
                      <SelectItem key={b.id} value={String(b.id)}>{b.bankName || b.BANK_NAME}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Debit Account (DR)</Label>
                <Select value={header.drAccountId ? String(header.drAccountId) : undefined} onValueChange={(v) => setHeader({ ...header, drAccountId: Number(v) })}>
                  <SelectTrigger className="rounded-xl font-bold bg-[#F8FAFC]">
                    <SelectValue placeholder="Select Debit Account" />
                  </SelectTrigger>
                  <SelectContent>
                    {(() => {
                      const filtered = accounts.filter((a: any) => Number(a.companyId || a.COMPANY_ID || a.company_id) === Number(header.companyId));
                      const displayAccounts = filtered.length > 0 ? filtered : accounts;
                      return displayAccounts.map((a: any) => (
                        <SelectItem key={a.id} value={String(a.id)}>
                          {a.accountNumber || a.ACCOUNT_NUMBER || a.accountName || 'Unknown Account'} {a.bankName || a.BANK_NAME ? `(${a.bankName || a.BANK_NAME})` : ''}
                        </SelectItem>
                      ));
                    })()}
                  </SelectContent>
                </Select>
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

export default function CreatePurchasePaymentPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-20 min-h-screen">Loading Payment system...</div>}>
      <CreatePaymentContent />
    </Suspense>
  );
}
