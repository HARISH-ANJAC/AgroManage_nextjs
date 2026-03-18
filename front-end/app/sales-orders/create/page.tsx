'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  PlusCircle, 
  Save, 
  Send, 
  Trash2, 
  UploadCloud, 
  FileText, 
  X, 
  ChevronRight, 
  Info,
  ClipboardList,
  Truck,
  Paperclip,
  Wallet,
  CheckCircle2,
  User,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormLabel as Label } from "@/components/FormLabel";
import { useMockCrud } from "@/hooks/useMockCrud";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function CreateSalesOrder() {
  const router = useRouter();
  const { create } = useMockCrud({ table: "salesOrders" });

  const [form, setForm] = useState({
    orderDate: "2024-05-24",
    customerId: "global-agro",
    storeId: "warehouse-a",
    salesPerson: "jt",
    currencyId: "usd",
    paymentTermId: "30",
    shipmentMethod: "road",
    deliveryDate: "",
    remarks: ""
  });

  const [items, setItems] = useState([
    { id: 1, category: "Grains", productName: "Premium White Maize", qtyPack: 50, totalQty: 500, uom: "KG", rate: 5.50, disc: 2, vat: 15 },
    { id: 2, category: "Pulses", productName: "Red Kidney Beans", qtyPack: 25, totalQty: 200, uom: "KG", rate: 8.00, disc: 0, vat: 15 }
  ]);

  const calculateAmount = (item: typeof items[0]) => item.totalQty * item.rate;
  const calculateFinal = (item: typeof items[0]) => {
    const amt = calculateAmount(item);
    const discAmt = amt * (item.disc / 100);
    const vatAmt = (amt - discAmt) * (item.vat / 100);
    return amt - discAmt + vatAmt;
  };

  const removeItem = (id: number) => setItems(items.filter(i => i.id !== id));

  const addItem = () => {
    const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
    setItems([...items, { id: newId, category: "Grains", productName: "New Grain Product", qtyPack: 1, totalQty: 0, uom: "KG", rate: 0, disc: 0, vat: 15 }]);
  };

  const updateItem = (id: number, field: string, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const subtotal = items.reduce((acc, item) => acc + calculateAmount(item), 0);
  const totalDiscount = items.reduce((acc, item) => acc + (calculateAmount(item) * (item.disc / 100)), 0);
  const totalVat = items.reduce((acc, item) => {
    const amt = calculateAmount(item);
    const discAmt = amt * (item.disc / 100);
    return acc + ((amt - discAmt) * (item.vat / 100));
  }, 0);
  const grandTotal = subtotal - totalDiscount + totalVat;

  const handleSubmit = async () => {
    const record = {
      ...form,
      soRefNo: "SO/MA/24/102",
      productAmount: subtotal,
      totalVatAmount: totalVat,
      finalAmount: grandTotal,
      statusEntry: 'Approved',
      createdDate: new Date().toISOString(),
      createdBy: 'admin'
    };
    const ok = await create(record as any);
    if (ok) router.push('/sales-orders');
  };

  return (
    <main className="flex-1 bg-slate-50 animate-fade-in p-6 sm:p-8 overflow-auto">
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        {/* Title Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Create Sales Order</h2>
            <p className="text-slate-500 mt-1 max-w-md">
              <span className="font-bold text-slate-700">Instruction:</span> Process new customer order and verify credit status
            </p>
          </div>
          <div className="flex flex-col items-end gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-2 rounded-xl h-10 px-4 font-bold border-slate-200">
                <Save className="w-4 h-4" />
                Save Draft
              </Button>
              <Button className="gap-2 rounded-xl h-10 px-6 font-bold shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90">
                <Send className="w-4 h-4" />
                Confirm Order
              </Button>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">SO Reference</p>
              <p className="text-xl font-mono font-bold text-secondary">SO/MA/24/102</p>
            </div>
          </div>
        </div>

        {/* Credit Check Banner */}
        <div className="bg-linear-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="size-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-900">Customer Credit Status: Good</p>
              <p className="text-xs text-emerald-600 font-medium">Available Limit: $15,000.00 • Outstanding: $2,450.00</p>
            </div>
          </div>
          <Badge className="bg-emerald-500 hover:bg-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">Cleared</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* 1. Header Details Section */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-slate-800 text-sm">1. Header Details</h3>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <Label required className="text-[10px] uppercase font-black text-slate-400">Order Date</Label>
                  <Input type="date" value={form.orderDate} onChange={(e) => setForm({...form, orderDate: e.target.value})} className="rounded-xl border-slate-200" />
                </div>
                <div className="space-y-1.5">
                  <Label required className="text-[10px] uppercase font-black text-slate-400">Customer</Label>
                  <Select value={form.customerId} onValueChange={(v) => setForm({...form, customerId: v})}>
                    <SelectTrigger className="rounded-xl border-slate-200 font-bold">
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="global-agro">Global Agro Exports</SelectItem>
                      <SelectItem value="nile-trading">Nile Trading Co.</SelectItem>
                      <SelectItem value="safari-foods">Safari Foods Ltd.</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label required className="text-[10px] uppercase font-black text-slate-400">Store / Warehouse</Label>
                  <Select value={form.storeId} onValueChange={(v) => setForm({...form, storeId: v})}>
                    <SelectTrigger className="rounded-xl border-slate-200">
                      <SelectValue placeholder="Select warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="warehouse-a">Main Warehouse A</SelectItem>
                      <SelectItem value="silo-04">Regional Silo 04</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label required className="text-[10px] uppercase font-black text-slate-400">Sales Person</Label>
                  <Select value={form.salesPerson} onValueChange={(v) => setForm({...form, salesPerson: v})}>
                    <SelectTrigger className="rounded-xl border-slate-200">
                      <SelectValue placeholder="Select sales person" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jt">Julian Thorne</SelectItem>
                      <SelectItem value="ms">Michael Scott</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-black text-slate-400">Currency</Label>
                  <Select value={form.currencyId} onValueChange={(v) => setForm({...form, currencyId: v})}>
                    <SelectTrigger className="rounded-xl border-slate-200 font-mono">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-black text-slate-400">Payment Term</Label>
                  <Select value={form.paymentTermId} onValueChange={(v) => setForm({...form, paymentTermId: v})}>
                    <SelectTrigger className="rounded-xl border-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">Net 30 Days</SelectItem>
                      <SelectItem value="lc">Letter of Credit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>

            {/* 2. Item Details Section */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-slate-800 text-sm">2. Product Allocation</h3>
                </div>
                <Button onClick={addItem} size="sm" className="gap-1.5 rounded-xl text-xs font-bold bg-primary hover:bg-primary/90">
                  <PlusCircle className="w-3.5 h-3.5" />
                  Add Row
                </Button>
              </div>
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Product details</th>
                      <th className="px-4 py-4 text-center">Unit</th>
                      <th className="px-4 py-4 text-center">Qty</th>
                      <th className="px-4 py-4 text-right">Price</th>
                      <th className="px-4 py-4 text-center">Disc %</th>
                      <th className="px-6 py-4 text-right font-bold text-slate-900">Total</th>
                      <th className="px-4 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <Input 
                            value={item.productName} 
                            onChange={(e) => updateItem(item.id, 'productName', e.target.value)}
                            className="bg-transparent border-none p-0 h-auto text-xs font-black text-slate-800 focus-visible:ring-0"
                          />
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{item.category}</p>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <Badge variant="outline" className="text-[9px] font-black border-slate-200">{item.uom}</Badge>
                        </td>
                        <td className="px-4 py-4">
                          <Input 
                            type="number" 
                            value={item.totalQty} 
                            onChange={(e) => updateItem(item.id, 'totalQty', parseFloat(e.target.value) || 0)}
                            className="w-20 h-8 text-center bg-slate-50 border-none rounded-lg font-black mx-auto" 
                          />
                        </td>
                        <td className="px-4 py-4">
                          <Input 
                            type="number" 
                            value={item.rate} 
                            step="0.01" 
                            onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                            className="w-20 h-8 text-right bg-slate-50 border-none rounded-lg font-black ml-auto" 
                          />
                        </td>
                        <td className="px-4 py-4">
                          <Input 
                            type="number" 
                            value={item.disc} 
                            onChange={(e) => updateItem(item.id, 'disc', parseFloat(e.target.value) || 0)}
                            className="w-12 h-8 text-center bg-slate-50 border-none rounded-lg font-black mx-auto" 
                          />
                        </td>
                        <td className="px-6 py-4 text-right font-black text-primary">
                          ${calculateFinal(item).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-500 transition-colors p-1">
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
            {/* Summary Card */}
            <div className="bg-primary rounded-2xl p-8 text-white shadow-xl shadow-primary/20 h-fit lg:sticky lg:top-24 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
              <h3 className="text-lg font-bold mb-8 flex items-center gap-3 relative">
                <Wallet className="w-6 h-6 text-secondary" />
                Order Finalization
              </h3>
              <div className="space-y-5 relative">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60 font-bold uppercase text-[10px] tracking-widest">Subtotal</span>
                  <span className="font-mono font-bold">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60 font-bold uppercase text-[10px] tracking-widest">Discount</span>
                  <span className="font-mono font-bold text-secondary">-${totalDiscount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60 font-bold uppercase text-[10px] tracking-widest">Tax (VAT 15%)</span>
                  <span className="font-mono font-bold">${totalVat.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="pt-8 mt-8 border-t border-white/10">
                  <p className="text-[10px] uppercase font-black tracking-[0.2em] text-white/40 mb-2">Grand Total (USD)</p>
                  <p className="text-5xl font-black text-secondary tracking-tighter">${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
              </div>
              <div className="mt-10 space-y-4 relative">
                <Button onClick={handleSubmit} className="w-full py-8 bg-secondary hover:bg-secondary/90 text-white rounded-xl font-black text-lg flex items-center justify-center gap-2 shadow-lg shadow-secondary/20 h-auto group transition-all">
                  <CheckCircle2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  Approve Order
                </Button>
                <div className="flex items-center gap-2 justify-center text-[10px] text-white/40 font-bold uppercase tracking-wide">
                  <ShieldCheck className="w-3 h-3 text-secondary" />
                  Secured Transaction
                </div>
              </div>
            </div>

            {/* Delivery / Shipping Info */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-slate-800 text-sm">Shipping Details</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-black text-slate-400 font-body">Shipment Method</Label>
                  <Select value={form.shipmentMethod} onValueChange={(v) => setForm({...form, shipmentMethod: v})}>
                    <SelectTrigger className="rounded-xl border-slate-200 font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="road">Road Freight</SelectItem>
                      <SelectItem value="sea">Sea Cargo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-black text-slate-400 font-body">Est. Delivery Date</Label>
                  <Input type="date" value={form.deliveryDate} onChange={(e) => setForm({...form, deliveryDate: e.target.value})} className="rounded-xl border-slate-200 font-bold" />
                </div>
              </div>
            </section>

            {/* Attachments */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                <Paperclip className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-slate-800 text-sm">Documents</h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="p-3 border border-dashed border-slate-200 rounded-xl bg-slate-50/50 text-center cursor-pointer hover:bg-slate-50 transition-colors group">
                  <UploadCloud className="w-6 h-6 text-slate-300 mx-auto mb-1 group-hover:text-primary transition-colors" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Upload PO / Contract</p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Remarks Section */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-slate-800 text-sm">Admin Remarks</h3>
          </div>
          <div className="p-6">
            <textarea 
              value={form.remarks}
              onChange={(e) => setForm({...form, remarks: e.target.value})}
              className="w-full h-32 rounded-2xl border-slate-200 bg-slate-50/30 p-4 text-sm font-medium focus:ring-primary focus:bg-white outline-none transition-all placeholder:text-slate-400"
              placeholder="Add internal notes for fulfillment team..."
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 py-10 border-t border-slate-100 text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">© 2024 AgroManage ERP • Sales Module v4.2</p>
        </footer>
      </div>
    </main>
  );
}
