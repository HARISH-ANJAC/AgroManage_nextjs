"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import {
  PlusCircle,
  Save,
  Send,
  Trash2,
  UploadCloud,
  CheckCircle2,
  Wallet,
  ShieldCheck,
  Truck,
  Info,
  ClipboardList,
  Paperclip,
  ArrowLeft
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Suspense, useEffect, useState, useMemo, JSX } from 'react';
import { toast } from "sonner";
import { useMasterData } from "@/hooks/useMasterData";
import {
  useCompanies,
  useCustomers,
  useStores,
  useSalesPersons,
  useCurrencies,
  usePaymentTerms,
  useProducts,
  useUoms
} from "@/hooks/useStoreData";
import { useSalesOrderStore } from "@/hooks/useSalesOrderStore";

function CreateSalesOrderContent(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const { orders: allOrders, addOrder: add, updateOrder: update } = useSalesOrderStore();

  // Master Data Hooks
  const { data: companies = [] } = useCompanies();
  const { data: customers = [] } = useCustomers();
  const { data: stores = [] } = useStores();
  const { data: salesPersons = [] } = useSalesPersons();
  const { data: currencies = [] } = useCurrencies();
  const { data: paymentTerms = [] } = usePaymentTerms();
  const { data: productsData = [] } = useProducts();
  const { data: uoms = [] } = useUoms();

  const [form, setForm] = useState({
    orderDate: new Date().toISOString().split("T")[0],
    company: "AGRO",
    customerId: "",
    customer: "",
    store: "",
    salesPerson: "",
    currency: "",
    paymentTerm: "",
    deliveryDate: "",
    status: "Pending",
    remarks: ""
  });

  const [items, setItems] = useState([
    { id: 1, category: "", productName: "", productId: "", qtyPack: 0, totalQty: 0, uom: "KG", rate: 0, disc: 0, vat: 15 },
  ]);

  // Load existing data if editing or set defaults
  useEffect(() => {
    if (editId && allOrders.length > 0) {
      const existing = allOrders.find((o: any) => o.id === editId);
      if (existing) {
        setForm({
          orderDate: existing.salesOrderDate || existing.orderDate || new Date().toISOString().split("T")[0],
          company: existing.company || companies[0]?.companyName || "AGRO",
          customerId: String(existing.customerId || ""),
          customer: existing.customer || "",
          store: String(existing.store || ""),
          salesPerson: String(existing.salesPerson || ""),
          currency: String(existing.currency || ""),
          paymentTerm: String(existing.paymentTerm || ""),
          deliveryDate: existing.deliveryDate || "",
          status: existing.status || "Pending",
          remarks: existing.remarks || ""
        });
        if (existing.items) setItems(existing.items);
      }
    } else if (companies.length > 0 && !form.company) {
      setForm(prev => ({
        ...prev,
        company: companies[0].companyName,
        store: stores[0]?.storeName || "",
        currency: currencies[0]?.currencyName || "",
        paymentTerm: paymentTerms[0]?.paymentTermName || ""
      }));
    }
  }, [editId, allOrders, companies, stores, currencies, paymentTerms]);

  const calculateAmount = (item: any) => item.totalQty * item.rate;
  const calculateFinal = (item: any) => {
    const amt = calculateAmount(item);
    const discAmt = amt * (item.disc / 100);
    const vatAmt = (amt - discAmt) * (item.vat / 100);
    return amt - discAmt + vatAmt;
  };

  const removeItem = (id: number) => setItems(items.filter(i => i.id !== id));

  const addItem = () => {
    const newId = Date.now();
    setItems([...items, { id: newId, category: "", productName: "", productId: "", qtyPack: 0, totalQty: 0, uom: "KG", rate: 0, disc: 0, vat: 15 }]);
  };

  const updateItem = (id: number, field: string, value: any) => {
    setItems(items.map(item => {
      if (item.id !== id) return item;
      const updated = { ...item, [field]: value };
      if (field === "productName") {
        const p = productsData.find((pr: any) => pr.productName === value);
        if (p) {
          updated.category = p.mainCategoryName || "";
          updated.uom = p.uom || "KG";
          updated.qtyPack = Number(p.qtyPerPacking) || 0;
          updated.productId = p.id;
        }
      }
      return updated;
    }));
  };

  const subtotal = useMemo(() => items.reduce((acc, item) => acc + calculateAmount(item), 0), [items]);
  const totalDiscount = useMemo(() => items.reduce((acc, item) => acc + (calculateAmount(item) * (item.disc / 100)), 0), [items]);
  const totalVat = useMemo(() => items.reduce((acc, item) => {
    const amt = calculateAmount(item);
    const discAmt = amt * (item.disc / 100);
    return acc + ((amt - discAmt) * (item.vat / 100));
  }, 0), [items]);
  const grandTotal = subtotal - totalDiscount + totalVat;

  const handleSubmit = async (status: string = "Delivered") => {
    const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0");
    const soRefNo = editId
      ? (allOrders.find((o: any) => o.id === editId)?.salesOrderRefNo || `SO/MA/${currentMonth}/${String(allOrders.length + 1).padStart(3, "0")}`)
      : `SO/MA/${currentMonth}/${String(allOrders.length + 1).padStart(3, "0")}`;

    const payload = {
      header: {
        salesOrderRefNo: soRefNo,
        salesOrderDate: form.orderDate,
        customerId: form.customerId,
        storeId: form.store,
        currencyId: form.currency,
        paymentTermName: form.paymentTerm,
        productAmount: subtotal,
        totalVatAmount: totalVat,
        finalAmount: grandTotal,
        status: status,
        remarks: form.remarks,
        deliveryDate: form.deliveryDate
      },
      items: items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        totalQty: item.totalQty,
        rate: item.rate,
        vatPercent: item.vat,
        amount: calculateFinal(item),
        uom: item.uom
      }))
    };

    try {
      if (editId) {
        update(editId, { id: soRefNo, ...payload, salesOrderRefNo: soRefNo, customer: form.customer, finalAmount: grandTotal });
        toast.success(`Sales Order Updated Successfully!`);
      } else {
        add({
          id: soRefNo,
          salesOrderRefNo: soRefNo,
          salesOrderDate: form.orderDate,
          customer: form.customer,
          finalSalesAmount: grandTotal, // for legacy list visibility
          status: status,
          ...payload
        });
        toast.success(`Sales Order Created Successfully!`);
      }
      router.push('/sales-orders');
    } catch (e) {
      toast.error("Failed to save Sales Order");
    }
  };

  return (
    <main className="flex-1 bg-slate-50 p-6 sm:p-8 overflow-auto pb-12">
      <div className="max-w-6xl mx-auto space-y-8 text-[#0F172A]">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push("/sales-orders")} className="p-2 rounded-lg hover:bg-muted bg-white border">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">{editId ? "Edit" : "New"} Sales Order</h2>
              <div className="flex items-center gap-1.5 mt-1 text-[#059669] font-medium text-[13px]">
                <Info className="w-4 h-4" />
                <span>Link products to PO stock. SO ref auto-generated.</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => handleSubmit("Draft")} className="gap-2 rounded-xl h-10 px-4 font-bold border-slate-200 bg-white shadow-sm">
                <Save className="w-4 h-4" /> Save Draft
              </Button>
              <Button onClick={() => handleSubmit("Confirmed")} className="gap-2 rounded-xl h-10 px-6 font-bold shadow-lg shadow-black/10 bg-[#1A2E28] hover:bg-[#1A2E28]/90 text-white">
                <CheckCircle2 className="w-4 h-4" /> Confirm Order
              </Button>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Auto Ref</p>
              <p className="text-xl font-mono font-bold text-[#0F172A]">
                {editId ? (allOrders.find(o => o.id === editId)?.salesOrderRefNo || "SO/MA/03/001") : `SO/MA/${String(new Date().getMonth() + 1).padStart(2, "0")}/${String(allOrders.length + 1).padStart(3, "0")}`}
              </p>
            </div>
          </div>
        </div>



        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[10px] font-bold text-[#64748B]">1</span>
                <h3 className="font-bold text-[#0F172A] text-sm">Header Details</h3>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-black text-[#94A3B8] tracking-widest">Date</Label>
                  <Input type="date" value={form.orderDate} onChange={(e) => setForm({ ...form, orderDate: e.target.value })} className="rounded-xl border-slate-200 h-11 bg-[#F8FAFC]/50" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-black text-[#94A3B8] tracking-widest">Customer (TIN) *</Label>
                  <Select value={form.customer} onValueChange={(v) => {
                    const cust = customers.find((c: any) => c.tinNumber === v || c.customerName === v);
                    setForm({ ...form, customer: v, customerId: cust?.id || "" });
                  }}>
                    <SelectTrigger className="rounded-xl border-slate-200 h-11 bg-[#F8FAFC]/50 font-bold"><SelectValue placeholder="Select customer" /></SelectTrigger>
                    <SelectContent>
                      {customers.map((c: any) => <SelectItem key={c.id} value={c.tinNumber || c.customerName}>{c.customerName}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-black text-[#94A3B8] tracking-widest">Store Selection</Label>
                  <Select value={form.store} onValueChange={(v) => setForm({ ...form, store: v })}>
                    <SelectTrigger className="rounded-xl border-slate-200 h-11 bg-[#F8FAFC]/50"><SelectValue placeholder="Select Store" /></SelectTrigger>
                    <SelectContent>
                      {stores.map((s: any) => <SelectItem key={s.id} value={s.storeName}>{s.storeName}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-black text-[#94A3B8] tracking-widest">Currency</Label>
                  <Select value={form.currency} onValueChange={(v) => setForm({ ...form, currency: v })}>
                    <SelectTrigger className="rounded-xl border-slate-200 h-11 bg-[#F8FAFC]/50"><SelectValue placeholder="Select Currency" /></SelectTrigger>
                    <SelectContent>
                      {currencies.map((c: any) => <SelectItem key={c.id} value={c.currencyName}>{c.currencyName}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-black text-[#94A3B8] tracking-widest">Payment Term</Label>
                  <Select value={form.paymentTerm} onValueChange={(v) => setForm({ ...form, paymentTerm: v })}>
                    <SelectTrigger className="rounded-xl border-slate-200 h-11 bg-[#F8FAFC]/50"><SelectValue placeholder="Select Term" /></SelectTrigger>
                    <SelectContent>
                      {paymentTerms.map((pt: any) => <SelectItem key={pt.id} value={pt.paymentTermName}>{pt.paymentTermName}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-black text-[#94A3B8] tracking-widest">Delivery Date</Label>
                  <Input type="date" value={form.deliveryDate} onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })} className="rounded-xl border-slate-200 h-11 bg-[#F8FAFC]/50" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-black text-[#94A3B8] tracking-widest">Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                    <SelectTrigger className="rounded-xl border-slate-200 h-11 bg-[#F8FAFC]/50"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Confirmed">Confirmed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[10px] font-bold text-[#64748B]">2</span>
                  <h3 className="font-bold text-[#0F172A] text-sm">Product Allocation</h3>
                </div>
                <Button onClick={addItem} size="sm" className="gap-1.5 rounded-xl text-xs font-bold bg-[#1A2E28] text-white hover:bg-[#1A2E28]/90">
                  <PlusCircle className="w-3.5 h-3.5" /> Add Row
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#F8FAFC]/50 text-[10px] uppercase font-bold text-[#94A3B8] tracking-widest border-b">
                    <tr>
                      <th className="px-6 py-4 text-center w-12">#</th>
                      <th className="px-6 py-4">Product</th>
                      <th className="px-4 py-4 text-center">PO Ref</th>
                      <th className="px-4 py-4 text-center">Qty</th>
                      <th className="px-4 py-4 text-center w-24">UOM</th>
                      <th className="px-4 py-4 text-center">Sales Rate</th>
                      <th className="px-4 py-4 text-center w-24">VAT %</th>
                      <th className="px-6 py-4 text-right">Amount</th>
                      <th className="px-6 py-4 text-center w-12"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm font-medium">
                    {items.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-[#F8FAFC]/30 transition-colors">
                        <td className="px-6 py-5 text-center text-[11px] font-bold text-[#94A3B8]">{idx + 1}</td>
                        <td className="px-6 py-5">
                          <Select value={item.productName} onValueChange={(v) => updateItem(item.id, "productName", v)}>
                            <SelectTrigger className="w-full md:w-[200px] h-10 bg-white border-slate-200 rounded-lg font-medium text-[#0F172A] shadow-sm">
                              <SelectValue placeholder="Select Product" />
                            </SelectTrigger>
                            <SelectContent>
                              {productsData.map((p: any) => <SelectItem key={p.id} value={p.productName}>{p.productName}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-4 py-5 font-bold text-xs text-[#64748B]">
                          <Select defaultValue="PO/MA/03/001">
                            <SelectTrigger className="w-28 h-10 bg-white border-slate-200 rounded-lg text-[11px] font-bold shadow-sm mx-auto">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PO/MA/03/001">PO/MA/03/001</SelectItem>
                              <SelectItem value="PO/MA/03/002">PO/MA/03/002</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-4 py-5 text-center">
                          <Input
                            type="number"
                            value={item.totalQty}
                            onChange={(e) => updateItem(item.id, 'totalQty', parseFloat(e.target.value) || 0)}
                            className="w-20 h-10 text-center bg-white border-slate-200 rounded-lg font-bold shadow-sm mx-auto"
                          />
                        </td>
                        <td className="px-4 py-5 text-center">
                          <Select value={item.uom} onValueChange={(v) => updateItem(item.id, "uom", v)}>
                            <SelectTrigger className="w-20 h-10 bg-white border-slate-200 rounded-lg text-[11px] font-bold shadow-sm mx-auto">
                              <SelectValue placeholder="UOM" />
                            </SelectTrigger>
                            <SelectContent>
                              {uoms.map((u: any) => <SelectItem key={u.id} value={u.unitName}>{u.unitName}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-4 py-5 text-center">
                          <Input
                            type="number"
                            value={item.rate}
                            step="0.01"
                            onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                            className="w-24 h-10 text-center bg-white border-slate-200 rounded-lg font-bold shadow-sm mx-auto"
                          />
                        </td>
                        <td className="px-4 py-5 text-center">
                          <Input 
                            type="number" 
                            value={item.vat} 
                            onChange={(e) => updateItem(item.id, 'vat', parseFloat(e.target.value) || 0)} 
                            className="w-16 h-10 text-center bg-white border-slate-200 rounded-lg font-bold shadow-sm mx-auto" 
                          />
                        </td>
                        <td className="px-6 py-5 text-right font-black text-[#0F172A] tabular-nums">
                          {calculateFinal(item).toLocaleString(undefined, { minimumFractionDigits: 0 })}
                        </td>
                        <td className="px-6 py-5 text-center">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-slate-300 hover:text-red-500 transition-all p-2 hover:bg-red-50 rounded-lg group"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <div className="bg-primary rounded-2xl p-8 text-white shadow-xl shadow-primary/20 h-fit lg:sticky lg:top-24 overflow-hidden relative">
              <h3 className="text-lg font-bold mb-8 flex items-center gap-3 relative"><Wallet className="w-6 h-6 text-white" /> Order Finalization</h3>
              <div className="space-y-5 relative">
                <div className="flex justify-between text-sm"><span className="text-white/60 font-bold uppercase text-[10px] tracking-widest">Subtotal</span><span className="font-mono font-bold">TZS {subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between text-sm"><span className="text-white/60 font-bold uppercase text-[10px] tracking-widest">Discount</span><span className="font-mono font-bold text-white">-TZS {totalDiscount.toLocaleString()}</span></div>
                <div className="flex justify-between text-sm"><span className="text-white/60 font-bold uppercase text-[10px] tracking-widest">Tax (VAT 15%)</span><span className="font-mono font-bold">TZS {totalVat.toLocaleString()}</span></div>
                <div className="pt-8 mt-8 border-t border-white/10">
                  <p className="text-[10px] uppercase font-black tracking-[0.2em] text-white/40 mb-2">Grand Total (TZS)</p>
                  <p className="text-5xl font-black text-white tracking-tighter">TZS {grandTotal.toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-10 space-y-4 relative">
                <Button onClick={() => handleSubmit(form.status)} className="w-full py-8 bg-white text-[#1A2E28] hover:bg-white/90 rounded-xl font-black text-lg shadow-lg h-auto">
                  {editId ? "Update Order" : "Approve Order"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CreateSalesOrder() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-12 min-h-screen text-muted-foreground animate-pulse">Loading Sales Order Form...</div>}>
      <CreateSalesOrderContent />
    </Suspense>
  );
}
