"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { ArrowLeft, Save, Send, Plus, Trash2, Upload, Info, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePurchaseOrders } from "@/hooks/useStoreData";
import { useMasterData } from "@/hooks/useMasterData";

interface LineItem {
  id: number;
  category: string;
  subCategory: string;
  product: string;
  productId?: number | string;
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

export default function CreateQuotationRFQPage() {
  const navigate = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const { data: allOrders, add, update } = usePurchaseOrders(); // Using PO hook for now as they share similar structure
  const today = new Date().toISOString().split("T")[0];

  // Master Data Hooks
  const { data: companies = [] } = useMasterData("companies");
  const { data: suppliers = [] } = useMasterData("suppliers");
  const { data: stores = [] } = useMasterData("stores");
  const { data: paymentTerms = [] } = useMasterData("payment-terms");
  const { data: paymentModes = [] } = useMasterData("payment-modes");
  const { data: currencies = [] } = useMasterData("currencies");
  const { data: productsData = [] } = useMasterData("products");
  const { data: additionalCostTypes = [] } = useMasterData("additional-cost-types");

  const [header, setHeader] = useState({
    poDate: today,
    purchaseType: "Local Purchase",
    company: "",
    supplier: "",
    store: "",
    paymentTerm: "",
    paymentMode: "",
    currency: "",
    shipmentMode: "Road Transport",
    estShipmentDate: "",
    priceTerms: "FOB",
  });

  const [items, setItems] = useState<LineItem[]>([
    { id: 1, category: "", subCategory: "", product: "", qtyPerPack: 0, totalQty: 0, uom: "KG", rate: 0, amount: 0, discPercent: 0, vatPercent: 15 },
  ]);
  const [isSaving, setIsSaving] = useState(false);

  const [additionalCosts, setAdditionalCosts] = useState<AdditionalCost[]>([
    { id: 1, type: "", currency: "TZS", amount: 0 },
  ]);

  const [files, setFiles] = useState<any[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        type: file.type,
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
        fileObject: file
      }));
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (id: number) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  // Load existing data if editing or set defaults
  useEffect(() => {
    if (editId && allOrders.length > 0) {
      const existing = allOrders.find((o: any) => o.id === editId);
      if (existing) {
        setHeader({
          poDate: existing.poDate || existing.date || today,
          purchaseType: existing.purchaseType || "Local Purchase",
          company: String(existing.company || companies[0]?.companyName || ""),
          supplier: String(existing.supplier || ""),
          store: String(existing.store || stores[0]?.storeName || ""),
          paymentTerm: String(existing.paymentTerm || paymentTerms[0]?.paymentTermName || ""),
          paymentMode: String(existing.paymentMode || paymentModes[0]?.paymentModeName || ""),
          currency: String(existing.currency || currencies[0]?.currencyName || ""),
          shipmentMode: existing.shipmentMode || "Road Transport",
          estShipmentDate: existing.estShipmentDate || "",
          priceTerms: existing.priceTerms || "FOB",
        });
        if (existing.items) setItems(existing.items);
        if (existing.additionalCosts) setAdditionalCosts(existing.additionalCosts);
      }
    } else if (companies.length > 0 && !header.company) {
      // Set some defaults from masters if available
      setHeader(prev => ({
        ...prev,
        company: companies[0].companyName,
        store: stores[0]?.storeName || "",
        currency: currencies[0]?.currencyName || "",
        paymentTerm: paymentTerms[0]?.paymentTermName || "",
        paymentMode: paymentModes[0]?.paymentModeName || ""
      }));
    }
  }, [editId, allOrders, today, companies, stores, currencies, paymentTerms, paymentModes]);

  const addItem = () => {
    setItems((prev) => [...prev, { id: Date.now(), category: "", subCategory: "", product: "", qtyPerPack: 0, totalQty: 0, uom: "KG", rate: 0, amount: 0, discPercent: 0, vatPercent: 15 }]);
  };

  const updateItem = (id: number, field: string, value: string | number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        if (field === "product") {
          const p = productsData.find((pr: any) => pr.productName === value);
          if (p) {
            updated.category = p.mainCategoryName || "";
            updated.subCategory = p.subCategoryName || "";
            updated.uom = p.uom || "KG";
            updated.qtyPerPack = Number(p.qtyPerPacking) || 0;
            updated.productId = p.id;
          }
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

  // Generate RFQ reference
  const rfqRefValue = useMemo(() => {
    const selectedProduct = items[0]?.product ? productsData.find((p: any) => p.productName === items[0].product) : null;
    const month = String(new Date().getMonth() + 1).padStart(2, "0");
    const code = selectedProduct ? (selectedProduct.productName?.substring(0, 2).toUpperCase() || "RFQ") : "----";
    return `RFQ/${code}/${month}/${Math.floor(Math.random() * 1000)}`;
  }, [items, productsData]);

  const handleCreateRFQ = async (status: string = "Submitted") => {
    if (!header.supplier) {
      toast.error("Please select a supplier");
      return;
    }

    const companyId = companies.find((c: any) => c.companyName === header.company)?.id;
    const supplierId = suppliers.find((s: any) => s.supplierName === header.supplier)?.id;
    const storeId = stores.find((s: any) => s.storeName === header.store)?.id;
    const paymentTermId = paymentTerms.find((pt: any) => pt.paymentTermName === header.paymentTerm)?.id;
    const currencyId = currencies.find((c: any) => c.currencyName === header.currency)?.id;

    const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
    const audit = {
        user: userInfo?.loginName || userInfo?.LOGIN_NAME || "unknown",
        macAddress: "MAC-ADDR-RFQ-CREATE"
    };

    const refNo = editId ? (allOrders.find((o: any) => o.id === editId)?.refNo || rfqRefValue) : rfqRefValue;

    const payload = {
      header: {
        ...header,
        rfqRefNo: refNo,
        companyId,
        supplierId,
        storeId,
        paymentTermId,
        currencyId,
        finalAmount: grandTotal,
        status
      },
      items: items.map(item => ({
        ...item,
        productId: productsData.find((p: any) => p.productName === item.product)?.id
      })),
      additionalCosts: additionalCosts.map(cost => ({
        ...cost,
        typeId: additionalCostTypes.find((act: any) => act.additionalCostTypeName === cost.type)?.id
      })),
      audit
    };

    setIsSaving(true);

    try {
      if (editId) {
        await update({ id: refNo, ...payload });
        toast.success(`Quotation/RFQ Updated Successfully!`);
      } else {
        await add(payload as any);
        toast.success(`Quotation/RFQ ${status === "Draft" ? "Saved as Draft" : "Submitted"} Successfully!`);
      }
      navigate.push("/quotations-rfq");
    } catch (error) {
       console.error("Failed to save RFQ", error);
       toast.error("Failed to save Quotation/RFQ");
    }
  };

  return (
    <div className="max-w-full mx-auto pb-20 px-4 sm:px-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4 mt-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate.push("/quotations-rfq")}
            className="p-2.5 rounded-full border border-border hover:bg-muted transition-colors bg-white shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">{editId ? "Edit" : "Create"} Quotation/RFQ</h1>
            <div className="flex items-center gap-1.5 mt-1 text-[#059669] font-medium text-[13px]">
              <Info className="w-4 h-4" />
              <span>Step 1: Invite suppliers to quote for required quantities</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-right mr-4 hidden sm:block">
            <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-widest">RFQ Reference</p>
            <p className="text-lg font-mono font-bold text-[#059669]">{rfqRefValue}</p>
          </div>
          <Button
            variant="outline"
            onClick={() => handleCreateRFQ("Draft")}
            className="rounded-xl border-[#E2E8F0] h-11 px-6 font-semibold hover:bg-[#F8FAFC]"
          >
            <Save className="w-4 h-4 mr-2" /> Save Draft
          </Button>
          <Button
            onClick={() => handleCreateRFQ("Submitted")}
            className="bg-[#1A2E28] hover:bg-[#1A2E28]/90 text-white font-bold rounded-xl px-6 h-11 transition-all active:scale-95 shadow-md shadow-black/10"
          >
            <Send className="w-4 h-4 mr-2" /> Send RFQ
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Header Details Card */}
        <div className="bg-white rounded-[24px] border border-[#E2E8F0] p-8 shadow-sm">
          <h2 className="text-base font-bold text-[#0F172A] mb-6 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[10px] font-bold text-[#64748B]">1</span>
            RFQ Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Request Date</Label>
                <Input type="date" value={header.poDate} onChange={(e) => setHeader({ ...header, poDate: e.target.value })} className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11" />
            </div>
            <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Type</Label>
                <Select value={header.purchaseType} onValueChange={(v) => setHeader({ ...header, purchaseType: v })}>
                    <SelectTrigger className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="Local Purchase">Local RFQ</SelectItem><SelectItem value="Import">Import RFQ</SelectItem></SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Company</Label>
                <Select value={header.company} onValueChange={(v) => setHeader({ ...header, company: v })}>
                    <SelectTrigger className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11"><SelectValue placeholder="Select company" /></SelectTrigger>
                    <SelectContent>
                    {companies.map((c: any) => <SelectItem key={c.id} value={c.companyName}>{c.companyName}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Supplier Master</Label>
                <Select value={header.supplier} onValueChange={(v) => setHeader({ ...header, supplier: v })}>
                    <SelectTrigger className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11"><SelectValue placeholder="Select supplier" /></SelectTrigger>
                    <SelectContent>
                    {suppliers.map((s: any) => <SelectItem key={s.id} value={s.supplierName}>{s.supplierName}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Store Selection</Label>
                <Select value={header.store} onValueChange={(v) => setHeader({ ...header, store: v })}>
                    <SelectTrigger className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11"><SelectValue placeholder="Select store" /></SelectTrigger>
                    <SelectContent>
                    {stores.map((s: any) => <SelectItem key={s.id} value={s.storeName}>{s.storeName}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Payment Term Master</Label>
                <Select value={header.paymentTerm} onValueChange={(v) => setHeader({ ...header, paymentTerm: v })}>
                    <SelectTrigger className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11"><SelectValue placeholder="Select payment term" /></SelectTrigger>
                    <SelectContent>
                    {paymentTerms.map((pt: any) => <SelectItem key={pt.id} value={pt.paymentTermName}>{pt.paymentTermName}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Mode of Payment</Label>
                <Select value={header.paymentMode} onValueChange={(v) => setHeader({ ...header, paymentMode: v })}>
                    <SelectTrigger className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11"><SelectValue placeholder="Select payment mode" /></SelectTrigger>
                    <SelectContent>
                    {paymentModes.map((pm: any) => <SelectItem key={pm.id} value={pm.paymentModeName}>{pm.paymentModeName}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Currency</Label>
                <Select value={header.currency} onValueChange={(v) => setHeader({ ...header, currency: v })}>
                    <SelectTrigger className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11"><SelectValue placeholder="Select currency" /></SelectTrigger>
                    <SelectContent>
                    {currencies.map((c: any) => <SelectItem key={c.id} value={c.currencyName}>{c.currencyName}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
          </div>
        </div>

        {/* Item Details Card */}
        <div className="bg-white rounded-[24px] border border-[#E2E8F0] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[10px] font-bold text-[#64748B]">2</span>
              Items for Quotation
            </h2>
            <Button
                onClick={addItem}
                size="sm"
                className="bg-[#1A2E28] text-white rounded-xl px-4 font-bold"
            >
                <Plus className="w-4 h-4 mr-1" /> Add Product
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-[#F8FAFC]/50">
                  <th className="text-left p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Product Master</th>
                  <th className="text-center p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Qty/Pack</th>
                  <th className="text-center p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Total Qty</th>
                  <th className="text-left p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Est. Rate</th>
                  <th className="text-left p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Amount</th>
                  <th className="text-center p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Disc %</th>
                  <th className="text-center p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">VAT %</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-[#F8FAFC]/30 transition-colors">
                    <td className="p-4">
                      <Select value={item.product} onValueChange={(v) => updateItem(item.id, "product", v)}>
                        <SelectTrigger className="min-w-[220px] bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11"><SelectValue placeholder="Select Product" /></SelectTrigger>
                        <SelectContent>
                          {productsData.map((p: any) => <SelectItem key={p.id} value={p.productName}>{p.productName}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-4 text-center"><Input type="number" className="w-20 mx-auto bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11 text-center font-medium" value={item.qtyPerPack} onChange={(e) => updateItem(item.id, "qtyPerPack", Number(e.target.value))} /></td>
                    <td className="p-4 text-center"><Input type="number" className="w-20 mx-auto bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11 text-center font-bold text-[#0F172A]" value={item.totalQty} onChange={(e) => updateItem(item.id, "totalQty", Number(e.target.value))} /></td>
                    <td className="p-4"><Input type="number" className="w-24 bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11 font-medium" value={item.rate} onChange={(e) => updateItem(item.id, "rate", Number(e.target.value))} /></td>
                    <td className="p-4 font-bold text-[#0F172A]">TZS {item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="p-4 text-center"><Input type="number" className="w-16 mx-auto bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11 text-center" value={item.discPercent} onChange={(e) => updateItem(item.id, "discPercent", Number(e.target.value))} /></td>
                    <td className="p-4 text-center"><Input type="number" className="w-16 mx-auto bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11 text-center" value={item.vatPercent} onChange={(e) => updateItem(item.id, "vatPercent", Number(e.target.value))} /></td>
                    <td className="p-4 text-right">
                        <button
                            onClick={() => removeItem(item.id)}
                            className="p-2.5 rounded-xl hover:bg-destructive/5 text-destructive/40 hover:text-destructive transition-all"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Additional Costs Card */}
            <div className="bg-white rounded-[24px] border border-[#E2E8F0] p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-bold text-[#0F172A]">Additional Costs (Est.)</h2>
                <button
                    onClick={() => setAdditionalCosts((prev) => [...prev, { id: Date.now(), type: "", currency: "TZS", amount: 0 }])}
                    className="text-xs text-[#059669] font-bold hover:underline"
                >
                    + Add Cost Row
                </button>
              </div>
              <div className="space-y-4">
                {additionalCosts.map((cost) => (
                    <div key={cost.id} className="flex gap-4 animate-in fade-in duration-300">
                    <Select value={cost.type} onValueChange={(v) => setAdditionalCosts((prev) => prev.map((c) => c.id === cost.id ? { ...c, type: v } : c))}>
                        <SelectTrigger className="flex-1 bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11 text-xs"><SelectValue placeholder="Select cost type" /></SelectTrigger>
                        <SelectContent>
                        {additionalCostTypes.map((act: any) => <SelectItem key={act.id} value={act.additionalCostTypeName}>{act.additionalCostTypeName}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Input className="w-20 bg-[#F1F5F9] border-none rounded-xl h-11 text-center font-bold text-[#64748B]" value={cost.currency} readOnly />
                    <Input type="number" className="w-32 bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11 font-medium" value={cost.amount} onChange={(e) => setAdditionalCosts((prev) => prev.map((c) => c.id === cost.id ? { ...c, amount: Number(e.target.value) } : c))} />
                    </div>
                ))}
              </div>
            </div>

            {/* Documents Card */}
            <div className="bg-white rounded-[24px] border border-[#E2E8F0] p-8 shadow-sm">
              <h2 className="text-base font-bold text-[#0F172A] mb-6">Supporting Documents</h2>
              
              <input 
                type="file" 
                id="file-upload" 
                className="hidden" 
                multiple 
                onChange={handleFileChange} 
                accept=".pdf,.jpg,.jpeg,.png"
              />
              
              <label 
                htmlFor="file-upload"
                className="border-2 border-dashed border-[#E2E8F0] rounded-3xl p-10 flex flex-col items-center justify-center text-center group hover:border-[#059669]/30 hover:bg-[#F0FDF4]/30 transition-all cursor-pointer mb-6"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#F8FAFC] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6 text-[#94A3B8] group-hover:text-[#059669]" />
                </div>
                <p className="text-sm font-bold text-[#0F172A]">Click to upload or drag and drop</p>
                <p className="text-xs text-[#94A3B8] mt-1 font-medium">PDF, JPG, PNG up to 10MB</p>
              </label>

              {files.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest pl-1">Selected Files ({files.length})</p>
                  <div className="grid grid-cols-1 gap-2">
                    {files.map(file => (
                      <div key={file.id} className="flex items-center justify-between p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl animate-in slide-in-from-top-2 duration-300">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-lg border border-[#E2E8F0]">
                            <FileText className="w-4 h-4 text-[#059669]" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#0F172A] truncate max-w-[200px]">{file.name}</p>
                            <p className="text-[10px] text-[#94A3B8] font-medium">{file.size}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeFile(file.id)}
                          className="p-2 rounded-lg hover:bg-destructive/5 text-destructive/40 hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="bg-[#1A2E28] rounded-[32px] p-8 text-white h-fit shadow-2xl shadow-black/20 sticky top-24 transition-all hover:scale-[1.01]">
            <h2 className="text-lg font-bold mb-8 flex items-center gap-2">
                Quotation Summary
                <div className="h-px flex-1 bg-white/10" />
            </h2>
            <div className="space-y-4 text-[13px]">
              <div className="flex justify-between opacity-70"><span>Subtotal</span><span className="font-bold">TZS {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
              <div className="flex justify-between text-[#FBBF24]"><span>Total Discount</span><span className="font-bold">-TZS {totalDiscount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
              <div className="flex justify-between opacity-70"><span>Total VAT (15%)</span><span className="font-bold">TZS {totalVat.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
              <div className="flex justify-between opacity-70"><span>Additional Costs</span><span className="font-bold">TZS {totalAdditional.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
            </div>

            <div className="mt-10 pt-8 border-t border-white/10">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest opacity-50 mb-2">Grand Total (TZS)</p>
                  <p className="text-4xl font-extrabold tracking-tight">TZS {grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold tracking-widest opacity-50 mb-2">Items</p>
                  <p className="text-2xl font-bold">{totalItems}</p>
                </div>
              </div>

              <Button
                onClick={() => handleCreateRFQ("Submitted")}
                className="w-full bg-[#059669] hover:bg-[#059669]/90 text-white font-bold py-7 rounded-2xl shadow-lg shadow-emerald-900/40 transition-all active:scale-95"
              >
                Send Official RFQ
              </Button>
              <div className="mt-8 flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Procurement Protocol</span>
                </div>
                <p className="text-[9px] text-center opacity-40 leading-relaxed max-w-[200px]">
                    Quotation data validated via AgroManage v2.0 Enterprise Standards
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
