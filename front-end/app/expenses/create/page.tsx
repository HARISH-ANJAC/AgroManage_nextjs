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
  Wallet,
  Banknote,
  Calculator,
  ShieldCheck,
  CheckCircle2,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMasterData } from "@/hooks/useMasterData";
import { usePurchaseOrderStore } from "@/hooks/usePurchaseOrderStore";
import { useExpenseStore } from "@/hooks/useExpenseStore";

interface AllocationLine {
  id: string;
  productId: string;
  productName: string;
  poQty: number;
  allocatedAmount: number;
}

function CreateExpenseContent() {
  const navigate = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  // Custom Stores & Master Data
  const { expenses: allExpenses, addExpense, updateExpense } = useExpenseStore();
  const { orders: poList = [] } = usePurchaseOrderStore();
  const { data: companies = [] } = useMasterData("companies");
  const { data: accountHeads = [] } = useMasterData("account-heads");
  const { data: currencies = [] } = useMasterData("currencies");

  const today = new Date().toISOString().split("T")[0];

  const [header, setHeader] = useState({
    expenseDate: today,
    poRefNo: "",
    accountHead: "Loading/Offloading",
    serviceProvider: "",
    tin: "",
    traEfdReceiptNo: "",
    currency: "TZS",
    status: "Draft",
    remarks: "",
  });

  const [allocations, setAllocations] = useState<AllocationLine[]>([]);

  // Calculate total amount from allocations
  const totalAmount = useMemo(() =>
    allocations.reduce((sum, item) => sum + item.allocatedAmount, 0)
    , [allocations]);

  // Load Initial Data
  useEffect(() => {
    if (editId && allExpenses.length > 0) {
      const existing = allExpenses.find((e: any) => e.id === editId || e.header?.expenseRefNo === editId);
      if (existing) {
        const h = existing.header || existing;
        setHeader({
          expenseDate: h.expenseDate || today,
          poRefNo: h.poRefNo || "",
          accountHead: h.accountHead || "Loading/Offloading",
          serviceProvider: h.serviceProvider || "",
          tin: h.tin || "",
          traEfdReceiptNo: h.traEfdReceiptNo || "",
          currency: h.currency || "TZS",
          status: h.status || "Draft",
          remarks: h.remarks || "",
        });
        if (existing.items) {
          setAllocations(existing.items.map((it: any) => ({
            id: it.id || Math.random().toString(36).substr(2, 9),
            productId: it.productId || "",
            productName: it.productName || "Unknown",
            poQty: it.poQty || 0,
            allocatedAmount: it.expenseAmount || it.amount || 0
          })));
        }
      }
    }
  }, [editId, allExpenses]);

  // Handle PO Selection -> Auto-populate allocations
  const handlePOChange = (ref: string) => {
    setHeader(prev => ({ ...prev, poRefNo: ref }));
    const selectedPO = poList.find((po: any) =>
      (po.header?.poRefNo || po.poRefNo || po.id) === ref
    );

    if (selectedPO) {
      const poItems = selectedPO.items || [];
      setAllocations(poItems.map((item: any, idx: number) => ({
        id: Math.random().toString(36).substr(2, 9),
        productId: item.productId || item.product || idx,
        productName: item.productName || item.product || "Product",
        poQty: Number(item.totalQty || item.qty || 0),
        allocatedAmount: 0
      })));
    }
  };

  const updateAllocation = (id: string, amount: number) => {
    setAllocations(prev => prev.map((item: any) =>
      item.id === id ? { ...item, allocatedAmount: amount } : item
    ));
  };

  const handleSaveExpense = async (finalStatus: string = "Submitted") => {
    if (!header.poRefNo) { toast.error("Please select a PO Reference"); return; }
    if (!header.traEfdReceiptNo) { toast.error("TRA EFD Receipt No is mandatory"); return; }

    const expenseRefNo = editId ? editId : `EXP/${new Date().getMonth() + 1}/${Math.floor(Math.random() * 1000)}`;

    const payload = {
      header: {
        ...header,
        expenseRefNo,
        totalAmount,
        status: finalStatus
      },
      items: allocations.map(a => ({
        productId: a.productId,
        productName: a.productName,
        poQty: a.poQty,
        expenseAmount: a.allocatedAmount
      })),
      audit: { createdAt: new Date().toISOString() }
    };

    try {
      if (editId) {
        await updateExpense(editId, payload);
        toast.success("Expense record updated successfully");
      } else {
        await addExpense(payload);
        toast.success(`Expense ${finalStatus === "Draft" ? "saved as draft" : "recorded"} successfully`);
      }
      navigate.push("/expenses");
    } catch (error) {
      toast.error("Failed to process expense record");
    }
  };

  return (
    <div className="max-w-full mx-auto pb-20 px-4 sm:px-6 text-[#0F172A]">
      {/* Header Section Matches PO Style */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4 mt-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate.push("/expenses")}
            className="p-2.5 rounded-full border border-border hover:bg-muted transition-colors bg-white shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">
              {editId ? `Edit Expense: ${editId}` : "Record Business Expense"}
            </h1>
            <div className="flex items-center gap-1.5 mt-1 text-[#059669] font-medium text-[13px]">
              <Info className="w-4 h-4" />
              <span>All expenses must be allocated under correct account head with PO reference.</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            onClick={() => handleSaveExpense("Draft")}
            className="rounded-xl border-[#E2E8F0] h-11 px-6 font-semibold hover:bg-[#F8FAFC]"
          >
            <Save className="w-4 h-4 mr-2" /> Save Draft
          </Button>
          <Button
            onClick={() => handleSaveExpense("Submitted")}
            className="bg-[#1A2E28] hover:bg-[#1A2E28]/90 text-white font-bold rounded-xl px-6 h-11 transition-all active:scale-95 shadow-md shadow-black/10"
          >
            <Send className="w-4 h-4 mr-2" /> Record Expense
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card Matches PO Detail Style */}
          <div className="bg-white rounded-[24px] border border-[#E2E8F0] p-8 shadow-sm">
            <h2 className="text-base font-bold text-[#0F172A] mb-6 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[10px] font-bold text-[#64748B]">1</span>
              Expense Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Transaction Date</Label>
                <Input type="date" value={header.expenseDate} onChange={(e) => setHeader({ ...header, expenseDate: e.target.value })} className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11 font-semibold" />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">PO Reference *</Label>
                <Select value={header.poRefNo} onValueChange={handlePOChange}>
                  <SelectTrigger className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11 font-semibold">
                    <SelectValue placeholder="Select PO Reference" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {poList.map((po: any) => {
                      const ref = po.header?.poRefNo || po.poRefNo || po.id;
                      return <SelectItem key={ref} value={ref}>{ref}</SelectItem>;
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Account Head *</Label>
                <Select value={header.accountHead} onValueChange={(v) => setHeader({ ...header, accountHead: v })}>
                  <SelectTrigger className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11 font-semibold">
                    <SelectValue placeholder="Loading/Offloading" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {accountHeads.length > 0 ?
                      accountHeads.map((ah: any) => <SelectItem key={ah.id} value={ah.accountHeadName}>{ah.accountHeadName}</SelectItem>) :
                      <SelectItem value="Loading/Offloading">Loading/Offloading</SelectItem>
                    }
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Service Provider</Label>
                <Input value={header.serviceProvider} onChange={(e) => setHeader({ ...header, serviceProvider: e.target.value })} placeholder="Enter vendor name..." className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11 font-medium" />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">TIN (Tax ID)</Label>
                <Input value={header.tin} onChange={(e) => setHeader({ ...header, tin: e.target.value })} placeholder="Required for services" className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11 font-medium" />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">TRA EFD Receipt No *</Label>
                <Input value={header.traEfdReceiptNo} onChange={(e) => setHeader({ ...header, traEfdReceiptNo: e.target.value })} placeholder="Enter Receipt No" className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11 font-bold text-[#0F172A]" />
              </div>
            </div>
          </div>

          {/* Allocation Table Matches PO Items Style */}
          <div className="bg-white rounded-[24px] border border-[#E2E8F0] p-8 shadow-sm">
            <div className="flex flex-col mb-6">
              <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[10px] font-bold text-[#64748B]">2</span>
                Product-Level Cost Allocation
              </h2>
              <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mt-2 px-1">
                Formula: expense_per_unit = total_expense / total_qty
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-[#F8FAFC]/50">
                    <th className="text-left p-4 w-12 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">#</th>
                    <th className="text-left p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Product</th>
                    <th className="text-center p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">PO Dtl (Qty)</th>
                    <th className="text-right p-4 text-[10px] font-bold text-[#059669] uppercase tracking-widest px-8">Allocated Amount *</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allocations.length > 0 ? (
                    allocations.map((item, index) => (
                      <tr key={item.id} className="hover:bg-[#F8FAFC]/30 transition-colors group">
                        <td className="p-4 text-slate-400 font-bold">{index + 1}</td>
                        <td className="p-4">
                          <span className="font-bold text-[#0F172A]">{item.productName}</span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="inline-flex items-center px-2.5 py-1 bg-[#F1F5F9] text-[#64748B] rounded-lg text-xs font-bold">
                            {item.poQty}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end pr-4">
                            <Input
                              type="number"
                              value={item.allocatedAmount}
                              onChange={(e) => updateAllocation(item.id, parseFloat(e.target.value) || 0)}
                              className="w-40 bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11 text-right font-bold text-[#0F172A] focus:ring-[#059669]/20"
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-16 text-center">
                        <div className="flex flex-col items-center gap-3 text-slate-300">
                          <Calculator className="w-12 h-12 opacity-20" />
                          <p className="font-bold text-xs tracking-tight">Select a Purchase Order to start allocation</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Summary Matches PO Style */}
        <div className="space-y-6">
          <div className="bg-[#1A2E28] rounded-[32px] p-8 text-white h-fit shadow-2xl shadow-black/20 sticky top-24 transition-all hover:scale-[1.01]">
            <h3 className="text-lg font-bold mb-8 flex items-center gap-3">
              <Wallet className="w-6 h-6 text-[#059669]" />
              Financial Summary
              <div className="h-px flex-1 bg-white/10 ml-2" />
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center opacity-60 text-[10px] font-bold uppercase tracking-widest">
                <span>Currency</span>
                <span className="text-white opacity-100">{header.currency}</span>
              </div>
              <div className="flex justify-between items-center opacity-60 text-[10px] font-bold uppercase tracking-widest">
                <span>Account Head</span>
                <span className="text-white opacity-100 truncate max-w-[120px]">{header.accountHead}</span>
              </div>

              <div className="pt-10 border-t border-white/10">
                <p className="text-[10px] uppercase font-bold tracking-widest opacity-40 mb-2 font-mono">Total Payable Record</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold opacity-30">{header.currency}</span>
                  <p className="text-4xl font-extrabold tracking-tight">
                    {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={() => handleSaveExpense("Submitted")}
              className="w-full mt-12 py-7 bg-[#059669] hover:bg-[#059669]/90 text-white font-bold rounded-2xl shadow-lg shadow-emerald-950/40 transition-all active:scale-95 text-lg"
            >
              Record Expense
            </Button>

            <div className="mt-8 flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">Verified ERP Protocol</span>
              </div>
              <p className="text-[9px] text-center opacity-30 leading-relaxed font-medium">
                Procurement data validated via AgroManage Enterprise Security Standards
              </p>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}

export default function CreateExpensePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-24 min-h-screen text-[#94A3B8] font-bold animate-pulse uppercase tracking-widest">Loading Expense Interface...</div>}>
      <CreateExpenseContent />
    </Suspense>
  );
}
