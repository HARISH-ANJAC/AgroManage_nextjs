"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { ArrowLeft, Save, Send, Plus, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePurchaseOrders } from "@/hooks/useStoreData";

interface LineItem {
  id: number;
  category: string;
  subCategory: string;
  product: string;
  qtyPerPack: number;
  totalQty: number;
  uom: string;
  rate: number;
  amount: number;
  discPercent: number;
  vatPercent: number;
}

interface AdditionalCost {
  id: number;
  type: string;
  currency: string;
  amount: number;
}

const products = [
  { name: "White Maize – Grade A", code: "MA", category: "Grains", sub: "Maize" },
  { name: "IR64 Rice", code: "RI", category: "Grains", sub: "Rice" },
  { name: "Hard Wheat", code: "WH", category: "Grains", sub: "Wheat" },
  { name: "Red Kidney Beans", code: "BE", category: "Pulses", sub: "Beans" },
  { name: "NPK 17:17:17", code: "FE", category: "Fertilizers", sub: "NPK Fertilizer" },
  { name: "Karafu", code: "KA", category: "Spices", sub: "Karafu" },
];

const suppliers = ["Kilimo Bora Suppliers", "Agro-Inputs Ltd", "Mbeya Rice Mills", "Sun Valley Farms", "Kigoma Pulse Exporters"];

export default function CreatePurchaseOrderPage() {
  const navigate = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const { data: allOrders, add, update } = usePurchaseOrders();
  const today = new Date().toISOString().split("T")[0];

  const [header, setHeader] = useState({
    poDate: today,
    purchaseType: "Local Purchase",
    company: "AgroTanzania Ltd",
    supplier: "",
    store: "Dar es Salaam Main Warehouse",
    paymentTerm: "Net 30 Days",
    paymentMode: "Bank Transfer",
    currency: "USD ($)",
    shipmentMode: "Road Transport",
    estShipmentDate: "",
    priceTerms: "FOB",
  });

  const [items, setItems] = useState<LineItem[]>([
    { id: 1, category: "", subCategory: "", product: "", qtyPerPack: 0, totalQty: 0, uom: "KG", rate: 0, amount: 0, discPercent: 0, vatPercent: 15 },
  ]);

  const [additionalCosts, setAdditionalCosts] = useState<AdditionalCost[]>([
    { id: 1, type: "Transportation Cost", currency: "$", amount: 150 },
  ]);

  // Load existing data if editing
  useEffect(() => {
    if (editId && allOrders.length > 0) {
      const existing = allOrders.find((o: any) => o.id === editId);
      if (existing) {
        setHeader({
          poDate: existing.poDate || existing.date || today,
          purchaseType: existing.purchaseType || "Local Purchase",
          company: existing.company || "AgroTanzania Ltd",
          supplier: existing.supplier || "",
          store: existing.store || "Dar es Salaam Main Warehouse",
          paymentTerm: existing.paymentTerm || "Net 30 Days",
          paymentMode: existing.paymentMode || "Bank Transfer",
          currency: existing.currency || "USD ($)",
          shipmentMode: existing.shipmentMode || "Road Transport",
          estShipmentDate: existing.estShipmentDate || "",
          priceTerms: existing.priceTerms || "FOB",
        });
        if (existing.items) setItems(existing.items);
        if (existing.additionalCosts) setAdditionalCosts(existing.additionalCosts);
      }
    }
  }, [editId, allOrders, today]);

  const addItem = () => {
    setItems((prev) => [...prev, { id: Date.now(), category: "", subCategory: "", product: "", qtyPerPack: 0, totalQty: 0, uom: "KG", rate: 0, amount: 0, discPercent: 0, vatPercent: 15 }]);
  };

  const updateItem = (id: number, field: string, value: string | number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        if (field === "product") {
          const p = products.find((pr) => pr.name === value);
          if (p) { updated.category = p.category; updated.subCategory = p.sub; }
        }
        updated.amount = updated.totalQty * updated.rate;
        return updated;
      })
    );
  };

  const removeItem = (id: number) => {
    if (items.length > 1) setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.amount, 0), [items]);
  const totalDiscount = useMemo(() => items.reduce((sum, i) => sum + (i.amount * i.discPercent) / 100, 0), [items]);
  const totalVat = useMemo(() => items.reduce((sum, i) => sum + ((i.amount - (i.amount * i.discPercent) / 100) * i.vatPercent) / 100, 0), [items]);
  const totalAdditional = useMemo(() => additionalCosts.reduce((sum, c) => sum + c.amount, 0), [additionalCosts]);
  const grandTotal = subtotal - totalDiscount + totalVat + totalAdditional;
  const totalItems = items.reduce((sum, i) => sum + i.totalQty, 0);

  // Generate PO reference
  const selectedProduct = items[0]?.product ? products.find((p) => p.name === items[0].product) : null;
  const month = String(new Date().getMonth() + 1).padStart(2, "0");
  const poRefValue = selectedProduct ? `PO/${selectedProduct.code}/${month}/${Math.floor(Math.random() * 1000)}` : "PO/----/--/---";

  const handleCreatePO = async (status: string = "Submitted") => {
    if (!header.supplier) {
      toast.error("Please select a supplier");
      return;
    }
    
    const poPayload = {
      ...header,
      poRefNo: editId ? (allOrders.find((o: any) => o.id === editId)?.poRefNo || poRefValue) : poRefValue,
      items,
      additionalCosts,
      finalAmount: grandTotal,
      status
    };

    try {
      if (editId) {
        await update({ id: editId, ...poPayload });
        toast.success(`Purchase Order Updated Successfully!`);
      } else {
        await add(poPayload);
        toast.success(`Purchase Order ${status === "Draft" ? "Saved as Draft" : "Submitted"} Successfully!`);
      }
      navigate.push("/purchase-orders");
    } catch (error) {
       console.error("Failed to save PO", error);
       toast.error("Failed to save Purchase Order");
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate.push("/purchase-orders")} className="p-2 rounded-lg hover:bg-muted">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{editId ? "Edit" : "Create"} Purchase Order</h1>
            <p className="text-sm text-accent">{editId ? "Modify the details of the existing purchase order" : "Complete the information below to generate a new purchase reference"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right mr-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Reference Number</p>
            <p className="text-lg font-mono font-bold text-accent">{poRefValue}</p>
          </div>
          <Button variant="outline" onClick={() => handleCreatePO("Draft")}><Save className="w-4 h-4 mr-2" /> Save Draft</Button>
          <Button onClick={() => handleCreatePO("Submitted")} className="bg-primary text-primary-foreground"><Send className="w-4 h-4 mr-2" /> Submit PO</Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Header Details */}
        <div className="bg-card rounded-xl border p-6 shadow-sm">
          <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold">1</span>
            Header Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div><Label className="text-[10px] uppercase tracking-wider text-muted-foreground">PO Date</Label><Input type="date" value={header.poDate} onChange={(e) => setHeader({ ...header, poDate: e.target.value })} /></div>
            <div><Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Purchase Type</Label>
              <Select value={header.purchaseType} onValueChange={(v) => setHeader({ ...header, purchaseType: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Local Purchase">Local Purchase</SelectItem><SelectItem value="Import">Import</SelectItem></SelectContent>
              </Select>
            </div>
            <div><Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Company</Label>
              <Select value={header.company} onValueChange={(v) => setHeader({ ...header, company: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="AgroTanzania Ltd">AgroTanzania Ltd</SelectItem></SelectContent>
              </Select>
            </div>
            <div><Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Supplier</Label>
              <Select value={header.supplier} onValueChange={(v) => setHeader({ ...header, supplier: v })}>
                <SelectTrigger><SelectValue placeholder="Select supplier" /></SelectTrigger>
                <SelectContent>{suppliers.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Store Selection</Label>
              <Select value={header.store} onValueChange={(v) => setHeader({ ...header, store: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Dar es Salaam Main Warehouse">Dar es Salaam Main Warehouse</SelectItem></SelectContent>
              </Select>
            </div>
            <div><Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Payment Term</Label>
              <Select value={header.paymentTerm} onValueChange={(v) => setHeader({ ...header, paymentTerm: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Net 30 Days">Net 30 Days</SelectItem><SelectItem value="Net 60 Days">Net 60 Days</SelectItem><SelectItem value="Cash on Delivery">Cash on Delivery</SelectItem></SelectContent>
              </Select>
            </div>
            <div><Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Mode of Payment</Label>
              <Select value={header.paymentMode} onValueChange={(v) => setHeader({ ...header, paymentMode: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Bank Transfer">Bank Transfer</SelectItem><SelectItem value="Cheque">Cheque</SelectItem><SelectItem value="Cash">Cash</SelectItem></SelectContent>
              </Select>
            </div>
            <div><Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Currency</Label>
              <Select value={header.currency} onValueChange={(v) => setHeader({ ...header, currency: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="USD ($)">USD ($)</SelectItem><SelectItem value="TZS">TZS</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Item Details */}
        <div className="bg-card rounded-xl border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold">2</span>
              Item Details
            </h2>
            <Button onClick={addItem} size="sm" className="bg-primary text-primary-foreground"><Plus className="w-4 h-4 mr-1" /> Add Product</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-2 text-[10px] font-semibold text-muted-foreground uppercase">Product Name</th>
                  <th className="text-left p-2 text-[10px] font-semibold text-muted-foreground uppercase">Qty/Pack</th>
                  <th className="text-left p-2 text-[10px] font-semibold text-muted-foreground uppercase">Total Qty</th>
                  <th className="text-left p-2 text-[10px] font-semibold text-muted-foreground uppercase">Rate</th>
                  <th className="text-left p-2 text-[10px] font-semibold text-muted-foreground uppercase">Amount</th>
                  <th className="text-left p-2 text-[10px] font-semibold text-muted-foreground uppercase">Disc %</th>
                  <th className="text-left p-2 text-[10px] font-semibold text-muted-foreground uppercase">VAT %</th>
                  <th className="p-2"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="p-2">
                      <Select value={item.product} onValueChange={(v) => updateItem(item.id, "product", v)}>
                        <SelectTrigger className="min-w-[200px]"><SelectValue placeholder="Select Product" /></SelectTrigger>
                        <SelectContent>{products.map((p) => <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>)}</SelectContent>
                      </Select>
                    </td>
                    <td className="p-2"><Input type="number" className="w-20" value={item.qtyPerPack} onChange={(e) => updateItem(item.id, "qtyPerPack", Number(e.target.value))} /></td>
                    <td className="p-2"><Input type="number" className="w-20" value={item.totalQty} onChange={(e) => updateItem(item.id, "totalQty", Number(e.target.value))} /></td>
                    <td className="p-2"><Input type="number" className="w-24" value={item.rate} onChange={(e) => updateItem(item.id, "rate", Number(e.target.value))} /></td>
                    <td className="p-2 font-medium">${item.amount.toFixed(2)}</td>
                    <td className="p-2"><Input type="number" className="w-16" value={item.discPercent} onChange={(e) => updateItem(item.id, "discPercent", Number(e.target.value))} /></td>
                    <td className="p-2"><Input type="number" className="w-16" value={item.vatPercent} onChange={(e) => updateItem(item.id, "vatPercent", Number(e.target.value))} /></td>
                    <td className="p-2 text-right"><button onClick={() => removeItem(item.id)} className="p-1 rounded hover:bg-destructive/10"><Trash2 className="w-4 h-4 text-destructive" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-xl border p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-foreground">Additional Costs</h2>
                <button onClick={() => setAdditionalCosts((prev) => [...prev, { id: Date.now(), type: "", currency: "$", amount: 0 }])} className="text-sm text-accent font-medium hover:underline">Add Row</button>
              </div>
              {additionalCosts.map((cost) => (
                <div key={cost.id} className="flex gap-3 mb-3">
                  <Select value={cost.type} onValueChange={(v) => setAdditionalCosts((prev) => prev.map((c) => c.id === cost.id ? { ...c, type: v } : c))}>
                    <SelectTrigger className="flex-1 text-xs"><SelectValue placeholder="Select cost type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Transportation Cost">Transportation Cost</SelectItem>
                      <SelectItem value="Loading/Offloading">Loading/Offloading</SelectItem>
                      <SelectItem value="Insurance">Insurance</SelectItem>
                      <SelectItem value="Customs Duty">Customs Duty</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input className="w-16" value={cost.currency} readOnly />
                  <Input type="number" className="w-32" value={cost.amount} onChange={(e) => setAdditionalCosts((prev) => prev.map((c) => c.id === cost.id ? { ...c, amount: Number(e.target.value) } : c))} />
                </div>
              ))}
            </div>

            <div className="bg-card rounded-xl border p-6 shadow-sm">
              <h2 className="text-base font-semibold text-foreground mb-4">Supporting Documents</h2>
              <div className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center">
                <Upload className="w-10 h-10 text-muted-foreground mb-2" />
                <p className="text-sm font-medium text-foreground">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground">PDF, JPG, PNG up to 10MB</p>
              </div>
            </div>
          </div>

          <div className="bg-primary rounded-xl p-6 text-primary-foreground h-fit shadow-lg shadow-primary/20">
            <h2 className="text-base font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between opactiy-90"><span>Subtotal</span><span className="font-medium">${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between opactiy-90"><span>Total Discount</span><span className="font-medium text-accent">-${totalDiscount.toFixed(2)}</span></div>
              <div className="flex justify-between opactiy-90"><span>Total VAT (15%)</span><span className="font-medium">${totalVat.toFixed(2)}</span></div>
              <div className="flex justify-between opactiy-90"><span>Additional Costs</span><span className="font-medium">${totalAdditional.toFixed(2)}</span></div>
            </div>
            <div className="border-t border-primary-foreground/20 mt-4 pt-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] uppercase tracking-wider opacity-70 mb-1">Grand Total (USD)</p>
                  <p className="text-3xl font-bold">${grandTotal.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider opacity-70 mb-1">Total Items</p>
                  <p className="text-2xl font-bold">{totalItems}</p>
                </div>
              </div>
            </div>
            <Button onClick={() => handleCreatePO("Submitted")} className="w-full mt-6 bg-accent text-accent-foreground hover:bg-accent/90 font-bold py-6">
              Confirm and Submit PO
            </Button>
            <p className="text-[10px] text-center mt-3 opacity-60">Procurement validated via AgroManage v2.0 Enterprise Protocols</p>
          </div>
        </div>
      </div>
    </div>
  );
}
