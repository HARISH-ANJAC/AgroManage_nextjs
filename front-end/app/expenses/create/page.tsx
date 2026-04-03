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
  Calculator,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Building,
  User,
  Hash
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMasterData } from "@/hooks/useMasterData";
import { usePurchaseOrderStore } from "@/hooks/usePurchaseOrderStore";
import { useExpenseStore } from "@/hooks/useExpenseStore";
import { getCurrentUser } from "@/lib/auth";
import { SupportingDoc } from "@/components/ui/Supporting-Doc";

interface AllocationLine {
  id: string;
  productId: string;
  productName: string;
  poQty: number;
  allocatedAmount: number;
  poDtlSno?: number;
}

function CreateExpenseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const { expenses = [], getExpenseById, addExpense, updateExpense } = useExpenseStore();
  const { orders: poList = [], getOrderById, isLoading: isPOListLoading } = usePurchaseOrderStore();
  const { data: companies = [], isLoading: companiesLoading } = useMasterData("product-company-category-mappings");
  const { data: accountHeads = [], isLoading: accountHeadsLoading } = useMasterData("account-heads");
  const { data: suppliers = [], isLoading: suppliersLoading } = useMasterData("suppliers");
  const { data: currencies = [], isLoading: currenciesLoading } = useMasterData("currencies");

  const today = new Date().toISOString().split("T")[0];

  const [header, setHeader] = useState({
    expenseDate: today,
    companyId: 0,
    poRefNo: "",
    accountHeadId: 0,
    expenseSupplierId: 0,
    expenseAgainst: "PO",
    expenseType: "General",
    traEfdReceiptNo: "",
    currencyId: 1,
    exchangeRate: 1,
    status: "Draft",
    remarks: "",
  });

  // Calculate Available POs (Filter out already expensed ones)
  const availablePOs = useMemo(() => {
    const expensedRefs = new Set(expenses.map((e: any) => e.poRefNo).filter(Boolean));
    return poList.filter((po: any) => {
      const ref = po.PO_REF_NO || po.poRefNo;
      // In Edit mode, allow the current record's PO to remain in the list
      if (editId && ref === header.poRefNo) return true;
      return !expensedRefs.has(ref);
    });
  }, [poList, expenses, editId, header.poRefNo]);

  const [allocations, setAllocations] = useState<AllocationLine[]>([]);
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

  const totalAmount = useMemo(() =>
    allocations.reduce((sum, item) => sum + item.allocatedAmount, 0)
  , [allocations]);

  // Load Initial Data for Edit
  useEffect(() => {
    if (editId) {
      const load = async () => {
        const data = await getExpenseById(editId);
        if (data && data.header) {
          setHeader({
            expenseDate: data.header.expenseDate ? new Date(data.header.expenseDate).toISOString().split('T')[0] : today,
            companyId: data.header.companyId || 0,
            poRefNo: data.header.poRefNo || "",
            accountHeadId: data.header.accountHeadId || 0,
            expenseSupplierId: data.header.expenseSupplierId || 0,
            expenseAgainst: data.header.expenseAgainst || "PO",
            expenseType: data.header.expenseType || "General",
            traEfdReceiptNo: data.header.traEfdReceiptNo || "",
            currencyId: data.header.currencyId || 1,
            exchangeRate: Number(data.header.exchangeRate) || 1,
            status: data.header.status || "Draft",
            remarks: data.header.remarks || "",
          });
          if (data.items) {
            setAllocations(data.items.map((it: any) => ({
              id: String(it.SNO || Math.random()),
              productId: it.PRODUCT_ID,
              productName: it.PRODUCT_NAME || "Product",
              poQty: Number(it.PO_QTY || 0),
              allocatedAmount: Number(it.EXPENSE_AMOUNT || 0),
              poDtlSno: it.PO_DTL_SNO
            })));
          }
          if (data.files) {
            setFiles(data.files);
          }
        }
      };
      load();
    }
  }, [editId]);

  const handlePOChange = async (ref: string) => {
    setHeader(prev => ({ ...prev, poRefNo: ref }));
    
    try {
      const fullPO = await getOrderById(ref);
      if (fullPO && fullPO.items) {
        setAllocations(fullPO.items.map((item: any) => ({
          id: `temp-${item.SNO || Math.random()}`,
          productId: item.productId || item.PRODUCT_ID,
          productName: item.productName || item.PRODUCT_NAME || "Product",
          poQty: Number(item.TOTAL_QTY || item.totalQty || item.QTY || 0),
          allocatedAmount: 0,
          poDtlSno: item.SNO || item.sno
        })));
      }
    } catch (err) {
      toast.error("Failed to load PO details");
    }
  };

  const handleSave = async (finalStatus: string = "Submitted") => {
    if (!header.poRefNo) { toast.error("Please select a PO Reference"); return; }
    if (!header.traEfdReceiptNo) { toast.error("TRA EFD Receipt No is mandatory"); return; }
    if (!header.accountHeadId) { toast.error("Please select an Account Head"); return; }

    const payload = {
      header: { ...header, totalExpenseAmount: totalAmount, status: finalStatus },
      items: allocations.map(a => ({
        productId: a.productId,
        poRefNo: header.poRefNo,
        poDtlSno: a.poDtlSno,
        expenseAmount: a.allocatedAmount,
        remarks: ""
      })),
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

    try {
      if (editId) {
        await updateExpense(editId, payload);
        toast.success("Expense updated");
      } else {
        await addExpense(payload);
        toast.success("Expense recorded");
      }
      router.push("/expenses");
    } catch (error: any) {
      toast.error(error.message || "Process failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Top Header */}
      <div className="bg-white border-b border-[#E2E8F0] z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
              <ArrowLeft className="w-5 h-5 text-[#64748B]" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-[#0F172A]">{editId ? "Edit Expense" : "Record Expense"}</h1>
              <p className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">{editId ? `Ref: ${editId}` : "New Business Expense Entry"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => router.back()} className="rounded-xl border-[#E2E8F0] font-semibold text-[#64748B] hover:bg-[#F8FAFC]">Cancel</Button>
            <Button onClick={() => handleSave("Submitted")} className="bg-[#1A2E28] hover:bg-[#254139] text-white rounded-xl px-6 flex items-center gap-2 shadow-lg">
              <Save className="w-4 h-4" />
              <span>{editId ? "Update Record" : "Save Record"}</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8 space-y-8">
            {/* Main Info */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <Receipt className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-base font-bold text-[#0F172A]">General Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Transaction Date*</Label>
                  <Input type="date" value={header.expenseDate} onChange={(e) => setHeader({ ...header, expenseDate: e.target.value })} className="rounded-xl h-11" />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">PO Reference*</Label>
                  <Select value={header.poRefNo} onValueChange={handlePOChange} disabled={isPOListLoading}>
                    <SelectTrigger className="rounded-xl h-11 font-bold">
                      <SelectValue placeholder={isPOListLoading ? "Synchronizing Orders..." : "Select Purchase Order"} />
                    </SelectTrigger>
                    <SelectContent>
                      {availablePOs.length === 0 && !isPOListLoading ? (
                        <div className="p-4 text-center text-xs text-slate-400 font-bold italic uppercase tracking-wider">All active POs are already expensed.</div>
                      ) : (
                        availablePOs.map((po: any, idx: number) => {
                          const ref = po.PO_REF_NO || po.poRefNo || String(po.SNO || po.id || idx);
                          return <SelectItem key={`${ref}-${idx}`} value={ref}>{ref}</SelectItem>;
                        })
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Account Head*</Label>
                  {accountHeadsLoading ? (
                    <Skeleton className="h-11 w-full rounded-xl" />
                  ) : (
                    <Select value={String(header.accountHeadId)} onValueChange={(v) => setHeader({ ...header, accountHeadId: Number(v) })}>
                      <SelectTrigger className="rounded-xl h-11 font-bold">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {accountHeads.map((ah: any, idx: number) => (
                          <SelectItem key={`${ah.id || ah.accountHeadId}-${idx}`} value={String(ah.id || ah.accountHeadId)}>{ah.accountHeadName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">TRA EFD Receipt No*</Label>
                  <Input placeholder="Enter Receipt Number" value={header.traEfdReceiptNo} onChange={(e) => setHeader({ ...header, traEfdReceiptNo: e.target.value })} className="rounded-xl h-11 font-bold" />
                </div>
              </div>
            </div>

            {/* Allocation */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
              <div className="p-6 border-b border-[#F1F5F9] bg-[#F8FAFC]/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Calculator className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-base font-bold text-[#0F172A]">Cost Allocation (Per Product)</h3>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-[#F1F5F9]">
                      <th className="px-6 py-4 text-left text-[10px] font-black text-[#94A3B8] uppercase">Product Name</th>
                      <th className="px-6 py-4 text-center text-[10px] font-black text-[#94A3B8] uppercase">PO Qty</th>
                      <th className="px-6 py-4 text-right text-[10px] font-black text-[#94A3B8] uppercase">Allocated Amt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9]">
                    {allocations.length === 0 ? (
                      <tr key="empty"><td colSpan={3} className="px-6 py-12 text-center text-[#94A3B8] font-bold">Select a PO to allocate expenses</td></tr>
                    ) : (
                      allocations.map((item, idx) => (
                        <tr key={`${item.id}-${idx}`}>
                          <td className="px-6 py-4">
                            <span className="text-sm font-bold text-[#0F172A]">{item.productName}</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="px-2 py-1 bg-[#F1F5F9] rounded-lg text-xs font-bold text-[#64748B]">{item.poQty}</span>
                          </td>
                          <td className="px-6 py-4">
                            <Input 
                              type="number" 
                              value={item.allocatedAmount}
                              onChange={(e) => setAllocations(allocations.map(a => a.id === item.id ? { ...a, allocatedAmount: Number(e.target.value) } : a))}
                              className="text-right font-black rounded-lg h-9 border-blue-100 bg-blue-50/30 ml-auto w-32"
                            />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Supporting Documents Section */}
            <SupportingDoc 
              files={files} 
              onFilesChange={setFiles} 
            />
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-8">
            <div className="bg-[#1A2E28] text-white rounded-2xl shadow-xl p-8">
              <h3 className="text-sm font-bold opacity-70 uppercase tracking-widest mb-6">Expense Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[#A7B4B1]">
                  <span className="text-xs font-bold uppercase tracking-tight">PO Reference</span>
                  <span className="font-bold text-white">{header.poRefNo || "None"}</span>
                </div>
                <div className="h-px bg-white/10 my-4" />
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Total Tax Invoice Amount</span>
                  <div className="text-3xl font-black font-sans leading-none">{totalAmount.toLocaleString()} TZS</div>
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
                      <SelectValue placeholder="Select Company" />
                    </SelectTrigger>
                    <SelectContent>
                      {(companies as any[]).map((c: any, idx: number) => (
                        <SelectItem key={`${c.id}-${idx}`} value={String(c.companyId)}>{c.companyName} (@{c.categoryName})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Service Provider (Supplier)</Label>
                {suppliersLoading ? (
                  <Skeleton className="h-11 w-full rounded-xl" />
                ) : (
                  <Select value={String(header.expenseSupplierId)} onValueChange={(v) => setHeader({ ...header, expenseSupplierId: Number(v) })}>
                    <SelectTrigger className="rounded-xl font-bold bg-[#F8FAFC]">
                      <SelectValue placeholder="Select Supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((s: any, idx: number) => (
                        <SelectItem key={`${s.id}-${idx}`} value={String(s.id)}>{s.supplierName}</SelectItem>
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

export default function CreateExpensePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-24 min-h-screen text-[#94A3B8] font-bold animate-pulse uppercase tracking-widest">Loading Expense Interface...</div>}>
      <CreateExpenseContent />
    </Suspense>
  );
}
