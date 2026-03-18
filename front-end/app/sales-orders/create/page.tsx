"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
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
import { useSalesOrders } from "@/hooks/useStoreData";
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from "sonner";

export default function CreateSalesOrder() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const { data: allOrders, add, update } = useSalesOrders();

  const [form, setForm] = useState({
    orderDate: new Date().toISOString().split("T")[0],
    customerId: "global-agro",
    customer: "Global Agro Exports",
    store: "Main Warehouse A",
    salesPerson: "Julian Thorne",
    currency: "USD ($)",
    paymentTerm: "Net 30 Days",
    shipmentMode: "Road Freight",
    deliveryDate: "",
    remarks: ""
  });

  const [items, setItems] = useState([
    { id: 1, category: "Grains", productName: "Premium White Maize", qtyPack: 50, totalQty: 500, uom: "KG", rate: 5.50, disc: 2, vat: 15 },
    { id: 2, category: "Pulses", productName: "Red Kidney Beans", qtyPack: 25, totalQty: 200, uom: "KG", rate: 8.00, disc: 0, vat: 15 }
  ]);

  // Load existing data if editing
  useEffect(() => {
    if (editId && allOrders.length > 0) {
      const existing = allOrders.find((o: any) => o.id === editId);
      if (existing) {
        setForm({
          orderDate: existing.salesOrderDate || existing.orderDate || new Date().toISOString().split("T")[0],
          customerId: existing.customerId || "global-agro",
          customer: existing.customer || "Global Agro Exports",
          store: existing.store || "Main Warehouse A",
          salesPerson: existing.salesPerson || "Julian Thorne",
          currency: existing.currency || "USD ($)",
          paymentTerm: existing.paymentTerm || "Net 30 Days",
          shipmentMode: existing.shipmentMode || "Road Freight",
          deliveryDate: existing.deliveryDate || "",
          remarks: existing.remarks || ""
        });
        if (existing.items) setItems(existing.items);
      }
    }
  }, [editId, allOrders]);

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
    setItems([...items, { id: newId, category: "Grains", productName: "New Grain Product", qtyPack: 1, totalQty: 0, uom: "KG", rate: 0, disc: 0, vat: 15 }]);
  };

  const updateItem = (id: number, field: string, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
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
    const soRefNo = editId ? (allOrders.find((o: any) => o.id === editId)?.salesOrderRefNo || `SO/MA/24/${Math.floor(Math.random() * 900) + 100}`) : `SO/MA/24/${Math.floor(Math.random() * 900) + 100}`;
    const record = {
      ...form,
      salesOrderRefNo: soRefNo,
      salesOrderDate: form.orderDate,
      totalProductAmount: subtotal,
      vatAmount: totalVat,
      finalSalesAmount: grandTotal,
      status: status,
      items
    };
    
    try {
      if (editId) {
        await update({ id: editId, ...record });
        toast.success(`Sales Order Updated Successfully!`);
      } else {
        await add(record);
        toast.success(`Sales Order ${status} Successfully!`);
      }
      router.push('/sales-orders');
    } catch (e) {
      toast.error("Failed to save Sales Order");
    }
  };

  return (
    <main className="flex-1 bg-slate-50 p-6 sm:p-8 overflow-auto pb-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex items-center gap-4">
             <button onClick={() => router.push("/sales-orders")} className="p-2 rounded-lg hover:bg-muted bg-white border">
                <ArrowLeft className="w-5 h-5" />
             </button>
             <div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{editId ? "Edit" : "Create"} Sales Order</h2>
                <p className="text-slate-500 mt-1">{editId ? "Modify the existing sales order details" : "Processed new customer order and verify credit status"}</p>
             </div>
          </div>
          <div className="flex flex-col items-end gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => handleSubmit("Draft")} className="gap-2 rounded-xl h-10 px-4 font-bold border-slate-200 bg-white">
                <Save className="w-4 h-4" /> Save Draft
              </Button>
              <Button onClick={() => handleSubmit("Confirmed")} className="gap-2 rounded-xl h-10 px-6 font-bold shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-white">
                <Send className="w-4 h-4" /> Confirm Order
              </Button>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">SO Reference</p>
              <p className="text-xl font-mono font-bold text-secondary">AUTO-GENERATE</p>
            </div>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="size-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-900">Customer Credit Status: Good</p>
              <p className="text-xs text-emerald-600 font-medium">Available Limit: $15,000.00 • Outstanding: $2,450.00</p>
            </div>
          </div>
          <Badge className="bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase">Cleared</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-slate-800 text-sm">1. Header Details</h3>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-black text-slate-400">Order Date</Label>
                  <Input type="date" value={form.orderDate} onChange={(e) => setForm({...form, orderDate: e.target.value})} className="rounded-xl border-slate-200" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-black text-slate-400">Customer</Label>
                  <Select value={form.customerId} onValueChange={(v) => {
                    const names: Record<string, string> = {"global-agro": "Global Agro Exports", "nile-trading": "Nile Trading Co.", "safari-foods": "Safari Foods Ltd."};
                    setForm({...form, customerId: v, customer: names[v]});
                  }}>
                    <SelectTrigger className="rounded-xl border-slate-200 font-bold"><SelectValue placeholder="Select customer" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="global-agro">Global Agro Exports</SelectItem>
                      <SelectItem value="nile-trading">Nile Trading Co.</SelectItem>
                      <SelectItem value="safari-foods">Safari Foods Ltd.</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-black text-slate-400">Warehouse</Label>
                  <Select value={form.store} onValueChange={(v) => setForm({...form, store: v})}>
                    <SelectTrigger className="rounded-xl border-slate-200"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Main Warehouse A">Main Warehouse A</SelectItem>
                      <SelectItem value="Regional Silo 04">Regional Silo 04</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-black text-slate-400">Sales Person</Label>
                  <Select value={form.salesPerson} onValueChange={(v) => setForm({...form, salesPerson: v})}>
                    <SelectTrigger className="rounded-xl border-slate-200 font-bold"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Julian Thorne">Julian Thorne</SelectItem>
                      <SelectItem value="Michael Scott">Michael Scott</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-slate-800 text-sm">2. Product Allocation</h3>
                </div>
                <Button onClick={addItem} size="sm" className="gap-1.5 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary/90">
                  <PlusCircle className="w-3.5 h-3.5" /> Add Row
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Product details</th>
                      <th className="px-4 py-4 text-center">Qty</th>
                      <th className="px-4 py-4 text-right">Price</th>
                      <th className="px-4 py-4 text-center">Disc %</th>
                      <th className="px-6 py-4 text-right font-bold text-slate-900">Total</th>
                      <th className="px-4 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm font-medium">
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <Input value={item.productName} onChange={(e) => updateItem(item.id, 'productName', e.target.value)} className="bg-transparent border-none p-0 h-auto text-xs font-bold text-slate-800 focus-visible:ring-0" />
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{item.category}</p>
                        </td>
                        <td className="px-4 py-4"><Input type="number" value={item.totalQty} onChange={(e) => updateItem(item.id, 'totalQty', parseFloat(e.target.value) || 0)} className="w-20 h-8 text-center bg-slate-50 border-none rounded-lg font-bold mx-auto" /></td>
                        <td className="px-4 py-4"><Input type="number" value={item.rate} step="0.01" onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)} className="w-20 h-8 text-right bg-slate-50 border-none rounded-lg font-bold ml-auto" /></td>
                        <td className="px-4 py-4"><Input type="number" value={item.disc} onChange={(e) => updateItem(item.id, 'disc', parseFloat(e.target.value) || 0)} className="w-12 h-8 text-center bg-slate-50 border-none rounded-lg font-bold mx-auto" /></td>
                        <td className="px-6 py-4 text-right font-black text-primary">${calculateFinal(item).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        <td className="px-4 py-4 text-center"><button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-500 transition-colors p-1"><Trash2 className="w-4 h-4" /></button></td>
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
                <div className="flex justify-between text-sm"><span className="text-white/60 font-bold uppercase text-[10px] tracking-widest">Subtotal</span><span className="font-mono font-bold">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                <div className="flex justify-between text-sm"><span className="text-white/60 font-bold uppercase text-[10px] tracking-widest">Discount</span><span className="font-mono font-bold text-white">-${totalDiscount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                <div className="flex justify-between text-sm"><span className="text-white/60 font-bold uppercase text-[10px] tracking-widest">Tax (VAT 15%)</span><span className="font-mono font-bold">${totalVat.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                <div className="pt-8 mt-8 border-t border-white/10">
                  <p className="text-[10px] uppercase font-black tracking-[0.2em] text-white/40 mb-2">Grand Total (USD)</p>
                  <p className="text-5xl font-black text-white tracking-tighter">${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
              </div>
              <div className="mt-10 space-y-4 relative">
                <Button onClick={() => handleSubmit("Delivered")} className="w-full py-8 bg-white text-primary hover:bg-white/90 rounded-xl font-black text-lg shadow-lg h-auto">
                  {editId ? "Update Order" : "Approve Order"}
                </Button>
              </div>
            </div>

            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2"><Truck className="w-5 h-5 text-primary" /><h3 className="font-bold text-slate-800 text-sm">Shipping Details</h3></div>
               <div className="p-6 space-y-4">
                 <Label className="text-[10px] uppercase font-black text-slate-400">Est. Delivery Date</Label>
                 <Input type="date" value={form.deliveryDate} onChange={(e) => setForm({...form, deliveryDate: e.target.value})} className="rounded-xl border-slate-200 font-bold" />
               </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
