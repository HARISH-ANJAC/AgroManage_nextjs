"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  FileText,
  Boxes,
  Settings2,
  Calendar,
  Truck,
  Building,
  User,
  Hash,
  ShoppingBag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useSalesInvoiceStore } from "@/hooks/useSalesInvoiceStore";
import { useDeliveryNoteStore } from "@/hooks/useDeliveryNoteStore";
import { useStores } from "@/hooks/useStoreData";
import { getCurrentUser } from "@/lib/auth";
import { SupportingDoc } from "@/components/ui/Supporting-Doc";

function CreateInvoiceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const today = new Date().toISOString().split("T")[0];

  const { notes: deliveryNotes, getNoteById: getDNById } = useDeliveryNoteStore();
  const { invoices, addInvoice, updateInvoice, getInvoiceById, isLoading } = useSalesInvoiceStore();
  const { data: stores = [], isLoading: storesLoading } = useStores();

  const [header, setHeader] = useState({
    invoiceDate: today,
    taxInvoiceRefNo: "",
    deliveryNoteRefNo: "",
    companyId: 0,
    fromStoreId: 0,
    customerId: 0,
    customerName: "",
    currencyId: 1,
    exchangeRate: 1,
    invoiceType: "Standard",
    status: "Open",
    remarks: ""
  });

  const [items, setItems] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const [isFetchingData, setIsFetchingData] = useState(false);

  // Initialize defaults
  useEffect(() => {
    if (!editId && stores.length > 0) {
      setHeader(prev => ({
        ...prev,
        fromStoreId: prev.fromStoreId || (stores[0]?.storeIdUserToRole || 0)
      }));
    }
  }, [editId, stores]);

  // Load existing data if editing
  useEffect(() => {
    const loadInvoice = async () => {
      if (editId) {
        setIsFetchingData(true);
        const res = await getInvoiceById(editId as string);
        if (res && res.header) {
          const h = res.header;
          setHeader({
            invoiceDate: h.invoiceDate ? new Date(h.invoiceDate).toISOString().split("T")[0] : today,
            taxInvoiceRefNo: h.taxInvoiceRefNo || "",
            deliveryNoteRefNo: h.deliveryNoteRefNo || "",
            companyId: h.companyId || 0,
            fromStoreId: h.fromStoreId || 0,
            customerId: h.customerId || 0,
            customerName: h.customerName || "",
            currencyId: h.currencyId || 1,
            exchangeRate: h.exchangeRate || 1,
            invoiceType: h.invoiceType || "Standard",
            status: h.status || "Open",
            remarks: h.remarks || ""
          });

          if (res.items) {
            setItems(res.items.map((it: any) => ({
              id: it.id,
              productId: it.productId,
              productName: it.productName || "Unknown Product",
              deliveryQty: Number(it.deliveryQty) || 0,
              invoiceQty: Number(it.invoiceQty) || 0,
              uom: it.uom || "Unit",
              rate: Number(it.rate) || 0,
              amount: Number(it.amount) || 0,
              vatPercent: Number(it.vatPercent) || 0,
              vatAmount: Number(it.vatAmount) || 0,
              finalAmount: Number(it.finalAmount) || 0,
              deliveryNoteDtlSno: it.deliveryNoteDtlSno
            })));
          }

          if (res.files) {
            setFiles(res.files);
          }
        } else {
          toast.error("Invoice not found");
        }
        setIsFetchingData(false);
      }
    };
    loadInvoice();
  }, [editId, getInvoiceById]);

  // Handle DN Selection (Auto-populate)
  useEffect(() => {
    const loadDN = async () => {
      // Only auto-populate if we are in "Create" mode (no editId)
      if (!editId && header.deliveryNoteRefNo) {
        const fullDN = await getDNById(header.deliveryNoteRefNo);

        if (fullDN && fullDN.header) {
          const h = fullDN.header;
          setHeader(prev => ({
            ...prev,
            companyId: h.companyId,
            customerId: h.customerId,
            customerName: h.customerName || "N/A",
            fromStoreId: h.fromStoreId || prev.fromStoreId,
            deliveryNoteRefNo: h.deliveryNoteRefNo // Keep original ref
          }));

          const dnItems = fullDN.items || [];
          setItems(dnItems.map((item: any) => ({
            id: item.id || Math.random(),
            productId: item.productId,
            productName: item.productName || "Unknown Product",
            deliveryQty: item.deliveryQty || 0,
            invoiceQty: item.deliveryQty || 0, // Default invoice qty to delivery qty
            uom: item.uom || "Unit",
            rate: item.rate || 0,
            amount: (item.deliveryQty || 0) * (item.rate || 0),
            vatPercent: item.vatPercent || 15, // Default VAT 15% if not provided
            vatAmount: ((item.deliveryQty || 0) * (item.rate || 0)) * (15 / 100),
            finalAmount: ((item.deliveryQty || 0) * (item.rate || 0)) * 1.15,
            deliveryNoteDtlSno: item.id
          })));
        }
      }
    };
    loadDN();
  }, [header.deliveryNoteRefNo, editId, getDNById]);

  // Recalculate item totals when quantity or rate changes
  const updateItem = (id: string, field: string, value: any) => {
    setItems(items.map(it => {
      if (it.id === id) {
        const updated = { ...it, [field]: value };
        if (field === "invoiceQty" || field === "rate" || field === "vatPercent") {
          updated.amount = Number(updated.invoiceQty) * Number(updated.rate);
          updated.vatAmount = updated.amount * (Number(updated.vatPercent) / 100);
          updated.finalAmount = updated.amount + updated.vatAmount;
        }
        return updated;
      }
      return it;
    }));
  };

  const totals = items.reduce((acc, it) => ({
    subtotal: acc.subtotal + (it.amount || 0),
    vat: acc.vat + (it.vatAmount || 0),
    grandTotal: acc.grandTotal + (it.finalAmount || 0)
  }), { subtotal: 0, vat: 0, grandTotal: 0 });

  const handleSave = async () => {
    if (!header.deliveryNoteRefNo && header.invoiceType === "Standard") {
      toast.error("Please select a Delivery Note Reference");
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        header: {
          ...header,
          totalProductAmount: totals.subtotal,
          vatAmount: totals.vat,
          finalSalesAmount: totals.grandTotal,
          invoiceDate: header.invoiceDate
        },
        items: items,
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
        await updateInvoice(editId as string, payload);
        toast.success("Invoice updated successfully!");
      } else {
        await addInvoice(payload);
        toast.success("Invoice created successfully!");
      }
      router.push("/sales-invoices");
    } catch (e: any) {
      toast.error(e.message || "Error saving invoice");
    } finally {
      setIsSaving(false);
    }
  };

  if (isFetchingData) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-8 space-y-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Skeleton className="h-10 w-48" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-36" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8 space-y-8">
            <div className="bg-white rounded-2xl border p-8">
              <Skeleton className="h-6 w-32 mb-6" />
              <div className="grid grid-cols-2 gap-6">
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
              </div>
            </div>
            <div className="bg-white rounded-2xl border p-8 space-y-4">
              <Skeleton className="h-8 w-40 mb-4" />
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          </div>
          <div className="col-span-12 lg:col-span-4 space-y-8">
            <div className="bg-white rounded-2xl border p-8 h-64">
              <Skeleton className="h-8 w-32 mb-8" />
              <Skeleton className="h-6 w-full mb-4" />
              <Skeleton className="h-12 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Top Header */}
      <div className="bg-white border-b border-[#E2E8F0]  z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full hover:bg-[#F1F5F9]">
              <ArrowLeft className="w-5 h-5 text-[#64748B]" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-[#0F172A]">{editId ? "Edit Sales Invoice" : "Create Tax Invoice"}</h1>
              <p className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider">Financial & Billing Processing</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => router.back()} className="rounded-xl border-[#E2E8F0] font-semibold text-[#64748B] hover:bg-[#F8FAFC]">Cancel</Button>
            <Button onClick={handleSave} className="bg-[#1A2E28] hover:bg-[#254139] text-white rounded-xl px-6 flex items-center gap-2 shadow-lg shadow-[#1A2E28]/10" disabled={isSaving}>
              <Save className="w-4 h-4" />
              <span>{editId ? "Update Invoice" : "Generate Invoice"}</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Main Info */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-blue-50 rounded-xl">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-base font-bold text-[#0F172A]">Tax Details</h3>
              </div>
              <div className="grid grid-cols-2 gap-x-10 gap-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] flex items-center gap-2">
                    <Calendar className="w-3 h-3" /> Invoice Date*
                  </Label>
                  <Input type="date" value={header.invoiceDate} onChange={(e) => setHeader({ ...header, invoiceDate: e.target.value })} className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11 font-medium select-none" />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] flex items-center gap-2">
                    <Truck className="w-3 h-3" /> Delivery Note Ref*
                  </Label>
                  <Select
                    value={header.deliveryNoteRefNo}
                    onValueChange={(v) => setHeader({ ...header, deliveryNoteRefNo: v })}
                    disabled={!!editId}
                  >
                    <SelectTrigger className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11 font-bold">
                      <SelectValue placeholder="Link DN Ref" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {deliveryNotes
                        .filter((dn: any) => dn.status === "Delivered" || dn.status === "In Transit")
                        .map((dn: any) => (
                          <SelectItem key={dn.deliveryNoteRefNo} value={dn.deliveryNoteRefNo} className="font-medium">
                            {dn.deliveryNoteRefNo} <span className="text-[#94A3B8] font-normal">— {dn.customerName}</span>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] flex items-center gap-2">
                    <User className="w-3 h-3" /> Customer
                  </Label>
                  <Input value={header.customerName} disabled className="bg-[#F1F5F9] border-[#E2E8F0] rounded-xl h-11 font-bold italic" />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] flex items-center gap-2">
                    Invoice Type
                  </Label>
                  <Select value={header.invoiceType} onValueChange={(v) => setHeader({ ...header, invoiceType: v })}>
                    <SelectTrigger className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11 font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="Standard">Standard (Tax)</SelectItem>
                      <SelectItem value="Cash">Cash Invoice</SelectItem>
                      <SelectItem value="Exempt">Tax Exempt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
              <div className="p-6 border-b border-[#F1F5F9] bg-[#F8FAFC]/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <Boxes className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h3 className="text-base font-bold text-[#0F172A]">Billing Articles</h3>
                </div>
                <Badge variant="outline" className="bg-white text-indigo-700 border-indigo-100 font-bold px-3 py-1">{items.length} Items</Badge>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                      <th className="px-6 py-4 text-[10px] font-bold uppercase text-[#64748B] text-left">Product / Service</th>
                      <th className="px-4 py-4 text-[10px] font-bold uppercase text-[#64748B] text-center w-28">Quantity</th>
                      <th className="px-4 py-4 text-[10px] font-bold uppercase text-[#64748B] text-center w-36">Rate (TZS)</th>
                      <th className="px-4 py-4 text-[10px] font-bold uppercase text-[#64748B] text-center w-24">VAT %</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase text-[#64748B] text-right">Final Amt</th>
                      <th className="px-4 py-4 text-center w-14"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9]">
                    {items.map((item, idx) => (
                      <tr key={item.id || `item-${idx}`} className="hover:bg-[#F8FAFC]/80 transition-colors group">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-bold text-[#1E293B] text-sm">{item.productName}</p>
                            <p className="text-[10px] text-[#94A3B8] mt-0.5">UOM: {item.uom} | Delivered: {item.deliveryQty}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <Input
                            type="number"
                            value={item.invoiceQty}
                            onChange={(e) => updateItem(item.id, "invoiceQty", e.target.value)}
                            max={item.deliveryQty} // Logical limit
                            className="text-center font-bold bg-[#F8FAFC] border-[#E2E8F0] rounded-lg h-9"
                          />
                        </td>
                        <td className="px-4 py-4">
                          <Input
                            type="number"
                            value={item.rate}
                            onChange={(e) => updateItem(item.id, "rate", e.target.value)}
                            className="text-center font-bold bg-[#F8FAFC] border-[#E2E8F0] rounded-lg h-9"
                          />
                        </td>
                        <td className="px-4 py-4">
                          <Input
                            type="number"
                            value={item.vatPercent}
                            onChange={(e) => updateItem(item.id, "vatPercent", e.target.value)}
                            className="text-center font-medium bg-[#F1F5F9] border-[#E2E8F0] rounded-lg h-9"
                          />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="font-black text-[#0F172A] text-sm">{(item.finalAmount || 0).toLocaleString()}</div>
                          <div className="text-[9px] text-[#64748B] font-medium">VAT: {(item.vatAmount || 0).toLocaleString()}</div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <Button
                            variant="ghost" size="icon"
                            onClick={() => setItems(items.filter(i => i.id !== item.id))}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {items.length === 0 && (
                  <div className="p-12 text-center text-[#94A3B8]">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p className="font-medium">No articles picked for invoicing.</p>
                    <p className="text-xs mt-1 italic">Select a Delivery Note to populate lines.</p>
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

          {/* Summaries & Sidebar */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            <div className="bg-[#1A2E28] text-white rounded-2xl shadow-xl p-8 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-sm font-bold opacity-70 uppercase tracking-widest mb-6">Financial Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[#A7B4B1]">
                    <span className="text-xs font-bold uppercase tracking-tight">Net Product Amt</span>
                    <span className="font-mono font-medium">{(totals.subtotal).toLocaleString()} TZS</span>
                  </div>
                  <div className="flex justify-between items-center text-[#A7B4B1]">
                    <span className="text-xs font-bold uppercase tracking-tight">VAT Consolidated</span>
                    <span className="font-mono font-medium">{(totals.vat).toLocaleString()} TZS</span>
                  </div>
                  <div className="h-px bg-white/10 my-4" />
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Grand Total</span>
                    <div className="text-4xl font-black font-sans leading-none">{(totals.grandTotal).toLocaleString()}</div>
                    <p className="text-[10px] font-medium text-[#A7B4B1] mt-2">Tanzanian Shillings Payable</p>
                  </div>
                </div>
              </div>
              {/* Pattern overlay */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 blur-[80px] rounded-full -mr-16 -mt-16" />
            </div>

            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Settings2 className="w-4 h-4 text-[#64748B]" />
                <h3 className="text-sm font-bold text-[#0F172A]">Additional Params</h3>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-[#94A3B8] uppercase">Dispatch Hub</Label>
                {storesLoading ? (
                  <Skeleton className="h-10 w-full rounded-xl" />
                ) : (
                  <Select value={String(header.fromStoreId)} onValueChange={(v) => setHeader({ ...header, fromStoreId: Number(v) })}>
                    <SelectTrigger className="h-10 rounded-xl font-bold bg-[#F8FAFC]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {stores.map((s: any, sIdx: number) => (
                        <SelectItem key={s.id || `store-${sIdx}`} value={String(s.storeIdUserToRole)}>{s.storeName} (@{s.userName})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-[#94A3B8] uppercase">Internal Remarks</Label>
                <Textarea
                  value={header.remarks}
                  onChange={(e) => setHeader({ ...header, remarks: e.target.value })}
                  placeholder="E.g. Special discounts applied..."
                  className="min-h-[100px] bg-[#F8FAFC] border-[#E2E8F0] rounded-xl focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreateSalesInvoicePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-20 min-h-screen">Loading...</div>}>
      <CreateInvoiceContent />
    </Suspense>
  );
}
