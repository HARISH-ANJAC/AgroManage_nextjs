'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  ArrowLeft,
  Printer
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormLabel as Label } from "@/components/FormLabel";
import { useMockCrud } from "@/hooks/useMockCrud";
import {
  mockData,
  PurchaseOrderHeader,
  PurchaseOrderDetail
} from '@/app/mock';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

type PurchaseOrderWithId = PurchaseOrderHeader & { id: string | number };

interface PurchaseOrderItemState {
  id: number;
  mainCategoryId: string;
  subCategoryId: string;
  productId: string;
  productName: string;
  qtyPack: number;
  totalQty: number;
  uom: string;
  rate: number;
  disc: number;
  vat: number;
}

interface SupportingDocument {
  DOCUMENT_TYPE: string;
  DESCRIPTIONS: string;
  FILE_NAME: string;
  CONTENT_TYPE: string;
  CONTENT_DATA: string | ArrayBuffer | null;
  STATUS_MASTER: string;
  size?: number;
}

interface AdditionalCostItem {
  id: number;
  type: string;
  amount: number;
}

function CreatePOContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const viewOnly = searchParams.get('view') === 'true';

  const { create, update, data: allPOs } = useMockCrud<PurchaseOrderWithId>({ table: "purchaseOrders" });

  const [form, setForm] = useState({
    poRefNo: "",
    poDate: new Date().toISOString().split('T')[0],
    purchaseType: "Local" as "Local" | "Import",
    companyId: "COMP001",
    supplierId: "",
    poStoreId: "STR001",
    paymentTermId: "PT001",
    modeOfPayment: "Bank Transfer",
    currencyId: "CUR001",
    shipmentMode: "Road",
    estimatedShipmentDate: "",
    priceTerms: "FOB"
  });

  const [items, setItems] = useState<PurchaseOrderItemState[]>([]);
  const [documents, setDocuments] = useState<SupportingDocument[]>([]);
  const [costItems, setCostItems] = useState<AdditionalCostItem[]>([
    { id: 1, type: "transport", amount: 150 }
  ]);

  const currencyMap: Record<string, { symbol: string, code: string }> = {
    "CUR001": { symbol: "$", code: "USD" },
    "CUR002": { symbol: "€", code: "EUR" },
    "CUR003": { symbol: "£", code: "GBP" },
    "CUR004": { symbol: "TSh ", code: "TZS" },
    "CUR005": { symbol: "₹", code: "INR" },
  };

  const currentCurrency = currencyMap[form.currencyId] || currencyMap["CUR001"];

  // Load data for edit mode
  useEffect(() => {
    if (id) {
      const existing = (mockData.purchaseOrders as any[]).find(p => String(p.id) === id || String(p.sno) === id);
      if (existing) {
        setForm({
          poRefNo: existing.poRefNo,
          poDate: existing.poDate.split('T')[0],
          purchaseType: existing.purchaseType,
          companyId: existing.companyId,
          supplierId: existing.supplierId,
          poStoreId: existing.poStoreId,
          paymentTermId: existing.paymentTermId,
          modeOfPayment: existing.modeOfPayment,
          currencyId: existing.currencyId,
          shipmentMode: existing.shipmentMode || "",
          estimatedShipmentDate: existing.estimatedShipmentDate?.split('T')[0] || "",
          priceTerms: existing.priceTerms || ""
        });

        const existingItems = (mockData.purchaseOrderDetails as any[]).filter(d => d.poRefNo === existing.poRefNo);
        if (existingItems.length > 0) {
          setItems(existingItems.map((item, index) => ({
            id: index + 1,
            mainCategoryId: item.mainCategoryId,
            subCategoryId: item.subCategoryId,
            productId: item.productId,
            productName: item.productName,
            qtyPack: item.qtyPerPacking,
            totalQty: item.totalQty,
            uom: item.uom,
            rate: item.ratePerQty,
            disc: item.discountPercentage,
            vat: item.vatPercentage
          })));
        }
      }
    } else {
      // Default item for new PO
      addItem();
    }
  }, [id]);

  const generatePORef = (productId: string) => {
    const product = mockData.products.find(p => p.productId === productId);
    let code = "GE"; // General
    if (product) {
      const sub = product.subCategoryName?.toUpperCase() || "";
      if (sub.includes("MAIZE")) code = "MA";
      else if (sub.includes("WHEAT")) code = "WH";
      else if (sub.includes("RICE")) code = "RI";
      else if (sub.includes("BEANS")) code = "BE";
      else if (product.mainCategoryName?.toUpperCase().includes("FERTILIZER")) code = "FE";
    }
    const month = new Date().toISOString().slice(5, 7);
    const count = (allPOs.length + 1).toString().padStart(3, '0');
    return `PO/${code}/${month}/${count}`;
  };

  const addItem = () => {
    const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
    setItems([...items, {
      id: newId,
      mainCategoryId: "",
      subCategoryId: "",
      productId: "",
      productName: "",
      qtyPack: 0,
      totalQty: 0,
      uom: "KG",
      rate: 0,
      disc: 0,
      vat: 15
    }]);
  };

  const updateItem = (id: number, field: string, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };

        // If Category changed, reset sub and product
        if (field === 'mainCategoryId') {
          updated.subCategoryId = "";
          updated.productId = "";
        }
        // If Sub Category changed, reset product
        if (field === 'subCategoryId') {
          updated.productId = "";
        }
        // If product changed, update defaults and PO Ref if it's the first item
        if (field === 'productId') {
          const product = mockData.products.find(p => p.productId === value);
          if (product) {
            updated.productName = product.productName;
            updated.uom = product.uom;
            updated.qtyPack = product.qtyPerPacking;

            // Auto update PO Ref if it's the first item and not set
            if (id === items[0].id && !form.poRefNo) {
              setForm(prev => ({ ...prev, poRefNo: generatePORef(value) }));
            }
          }
        }
        return updated;
      }
      return item;
    }));
  };

  const calculateAmount = (item: PurchaseOrderItemState) => (item.totalQty || 0) * (item.rate || 0);
  const calculateFinal = (item: PurchaseOrderItemState) => {
    const amt = calculateAmount(item);
    const discAmt = amt * (item.disc / 100);
    const vatAmt = (amt - discAmt) * (item.vat / 100);
    return amt - discAmt + vatAmt;
  };

  const removeItem = (id: number) => setItems(items.filter(i => i.id !== id));

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result;
        const newDoc: SupportingDocument = {
          DOCUMENT_TYPE: "Purchase Order Attachment",
          DESCRIPTIONS: "Uploaded supporting document",
          FILE_NAME: file.name,
          CONTENT_TYPE: file.type,
          CONTENT_DATA: base64 ?? null,
          STATUS_MASTER: "Active",
          size: file.size
        };
        setDocuments(prev => [...prev, newDoc]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const addCostRow = () => {
    const newId = costItems.length > 0 ? Math.max(...costItems.map(c => c.id)) + 1 : 1;
    setCostItems([...costItems, { id: newId, type: "transport", amount: 0 }]);
  };

  const updateCostRow = (id: number, field: string, value: any) => {
    setCostItems(costItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeCostRow = (id: number) => {
    setCostItems(costItems.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((acc, item) => acc + calculateAmount(item), 0);
  const totalDiscount = items.reduce((acc, item) => acc + (calculateAmount(item) * (item.disc / 100)), 0);
  const totalVat = items.reduce((acc, item) => {
    const amt = calculateAmount(item);
    const discAmt = amt * (item.disc / 100);
    return acc + ((amt - discAmt) * (item.vat / 100));
  }, 0);
  const totalAdditionalCosts = costItems.reduce((acc, item) => acc + (item.amount || 0), 0);
  const grandTotal = subtotal - totalDiscount + totalVat + totalAdditionalCosts;

  const getProductCode = () => {
    if (items.length === 0) return "GEN";
    const subCat = items[0].subCategoryName;
    if (!subCat) return "GEN";
    // Get first two characters or first letters of words
    const words = subCat.split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return subCat.slice(0, 2).toUpperCase();
  };

  const handleSubmit = async () => {
    if (viewOnly) return;

    const productCode = getProductCode();
    const month = new Date().toISOString().slice(5, 7);
    const runningNo = String(allPOs.length + 1).padStart(3, '0');
    const poRefNo = form.poRefNo || `PO/${productCode}/${month}/${runningNo}`;

    const mappedDetails: Partial<PurchaseOrderDetail>[] = items.map((item, idx) => {
      const amt = (item.totalQty || 0) * (item.rate || 0);
      const discAmt = amt * (item.disc / 100);
      const vatAmt = (amt - discAmt) * (item.vat / 100);

      return {
        sno: String(idx + 1),
        poRefNo: poRefNo,
        mainCategoryId: item.mainCategoryId,
        subCategoryId: item.subCategoryId,
        productId: item.productId,
        productName: item.productName,
        qtyPerPacking: item.qtyPack,
        totalQty: item.totalQty,
        uom: item.uom,
        ratePerQty: item.rate,
        productAmount: amt,
        discountPercentage: item.disc,
        discountAmount: discAmt,
        totalProductAmount: amt - discAmt,
        vatPercentage: item.vat,
        vatAmount: vatAmt,
        finalProductAmount: amt - discAmt + vatAmt,
        statusEntry: 'Active',
        createdBy: 'admin',
        createdDate: new Date().toISOString()
      };
    });

    const supplier = mockData.suppliers.find(s => s.supplierId === form.supplierId);
    const store = mockData.stores.find(s => s.storeId === form.poStoreId);

    const record = {
      ...form,
      sno: id || String(allPOs.length + 1),
      poRefNo: poRefNo,
      supplierName: supplier?.supplierName || "",
      storeName: store?.storeName || "",
      exchangeRate: 1.0,
      productHdrAmount: subtotal,
      totalVatHdrAmount: totalVat,
      totalAdditionalCostAmount: totalAdditionalCosts,
      totalProductHdrAmount: subtotal + totalAdditionalCosts,
      finalPurchaseHdrAmount: grandTotal,
      // Local currency equivalents
      productHdrAmountLc: subtotal * 2500, // Mock rate
      totalVatHdrAmountLc: totalVat * 2500,
      totalAdditionalCostAmountLc: totalAdditionalCosts * 2500,
      finalPurchaseHdrAmountLc: grandTotal * 2500,
      totalProductHdrAmountLc: (subtotal + totalAdditionalCosts) * 2500,

      remarks: "",
      statusEntry: 'Submitted' as any,
      modifiedDate: new Date().toISOString(),
      modifiedBy: 'admin',
      ...(!id && { createdDate: new Date().toISOString(), createdBy: 'admin' }),

      // Include child records
      details: mappedDetails,
      attachments: documents
    };

    const ok = id ? await update(id, record as any) : await create(record as any);
    if (ok) router.push('/purchase-orders');
  };

  return (
    <main className="flex-1 bg-slate-50 animate-fade-in p-6 sm:p-8 overflow-auto">
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        {/* Title Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200">
              <ArrowLeft className="w-5 h-5 text-slate-500" />
            </button>
            <div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                {id ? (viewOnly ? "View Purchase Order" : "Edit Purchase Order") : "Create Purchase Order"}
              </h2>
              <p className="text-slate-500 mt-1 max-w-md">
                <span className="font-bold text-slate-700">Instruction:</span> {viewOnly ? "Reviewing existing purchase reference" : "Complete the information below to generate a new purchase reference"}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3 w-full sm:w-auto">
            {!viewOnly && (
              <div className="flex items-center gap-2">
                <Button onClick={() => router.push('/purchase-orders')} variant="outline" className="gap-2 rounded-xl h-10 px-4 font-bold border-slate-200">
                  <Save className="w-4 h-4" />
                  Save Draft
                </Button>
                {id && (
                  <Button 
                    onClick={() => window.print()} 
                    variant="outline" 
                    className="gap-2 rounded-xl h-10 px-4 font-bold border-slate-200"
                  >
                    <Printer className="w-4 h-4" />
                    Print PO
                  </Button>
                )}
                <Button onClick={handleSubmit} className="gap-2 rounded-xl h-10 px-6 font-bold shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90">
                  <Send className="w-4 h-4" />
                  {id ? "Update PO" : "Submit PO"}
                </Button>
              </div>
            )}
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Reference Number</p>
              <p className="text-xl font-mono font-bold text-secondary">{form.poRefNo || "PO/----/--/---"}</p>
            </div>
          </div>
        </div>

        {/* 1. Header Details Section */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-slate-800 text-sm">1. Header Details</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PO Date</Label>
              <Input type="date" value={form.poDate} onChange={(e) => setForm({ ...form, poDate: e.target.value })} className="rounded-xl border-slate-200 focus:ring-primary" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Purchase Type</Label>
              <Select value={form.purchaseType} onValueChange={(v) => setForm({ ...form, purchaseType: v as "Local" | "Import" })} disabled={viewOnly}>
                <SelectTrigger className="rounded-xl border-slate-200">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Local">Local Purchase</SelectItem>
                  <SelectItem value="Import">Import Purchase</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Company</Label>
              <Select value={form.companyId} onValueChange={(v) => setForm({ ...form, companyId: v })} disabled={viewOnly}>
                <SelectTrigger className="rounded-xl border-slate-200">
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  {mockData.companies.map(c => (
                    <SelectItem key={c.companyId} value={c.companyId}>{c.companyName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Supplier</Label>
              <Select value={form.supplierId} onValueChange={(v) => setForm({ ...form, supplierId: v })} disabled={viewOnly}>
                <SelectTrigger className="rounded-xl border-slate-200">
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {mockData.suppliers.map(s => (
                    <SelectItem key={s.supplierId} value={s.supplierId}>{s.supplierName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Store Selection</Label>
              <Select value={form.poStoreId} onValueChange={(v) => setForm({ ...form, poStoreId: v })} disabled={viewOnly}>
                <SelectTrigger className="rounded-xl border-slate-200">
                  <SelectValue placeholder="Select store" />
                </SelectTrigger>
                <SelectContent>
                  {mockData.stores.map(s => (
                    <SelectItem key={s.storeId} value={s.storeId}>{s.storeName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Payment Term</Label>
              <Select value={form.paymentTermId} onValueChange={(v) => setForm({ ...form, paymentTermId: v })} disabled={viewOnly}>
                <SelectTrigger className="rounded-xl border-slate-200">
                  <SelectValue placeholder="Select term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PT001">Net 30 Days</SelectItem>
                  <SelectItem value="PT002">Net 60 Days</SelectItem>
                  <SelectItem value="PT003">Immediate Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mode of Payment</Label>
              <Select value={form.modeOfPayment} onValueChange={(v) => setForm({ ...form, modeOfPayment: v })} disabled={viewOnly}>
                <SelectTrigger className="rounded-xl border-slate-200">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="Cheque">Cheque</SelectItem>
                  <SelectItem value="Letter of Credit">Letter of Credit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Currency</Label>
              <Select value={form.currencyId} onValueChange={(v) => setForm({ ...form, currencyId: v })} disabled={viewOnly}>
                <SelectTrigger className="rounded-xl border-slate-200">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CUR001">USD ($)</SelectItem>
                  <SelectItem value="CUR002">EUR (€)</SelectItem>
                  <SelectItem value="CUR003">GBP (£)</SelectItem>
                  <SelectItem value="CUR004">TZS (TSh)</SelectItem>
                  <SelectItem value="CUR005">INR (₹)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="lg:col-span-2 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Shipment Mode</Label>
                <Select value={form.shipmentMode} onValueChange={(v) => setForm({ ...form, shipmentMode: v })} disabled={viewOnly}>
                  <SelectTrigger className="rounded-xl border-slate-200">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sea">Sea Freight</SelectItem>
                    <SelectItem value="Air">Air Freight</SelectItem>
                    <SelectItem value="Road">Road Transport</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Est. Shipment Date</Label>
                <Input type="date" value={form.estimatedShipmentDate} onChange={(e) => setForm({ ...form, estimatedShipmentDate: e.target.value })} className="rounded-xl border-slate-200 focus:ring-primary" disabled={viewOnly} />
              </div>
            </div>
            <div className="lg:col-span-2 space-y-1.5 border-t border-slate-100 pt-4">
              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Price Terms</Label>
              <Input value={form.priceTerms} onChange={(e) => setForm({ ...form, priceTerms: e.target.value })} placeholder="e.g. FOB, CIF, EXW" className="rounded-xl border-slate-200 focus:ring-primary" disabled={viewOnly} />
            </div>
          </div>
        </section>

        {/* 2. Item Details Section */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-slate-800 text-sm">2. Item Details</h3>
            </div>
            {!viewOnly && (
              <Button onClick={addItem} size="sm" className="gap-1.5 rounded-xl text-xs font-bold bg-primary hover:bg-primary/90">
                <PlusCircle className="w-3.5 h-3.5" />
                Add Product
              </Button>
            )}
          </div>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Item Category</th>
                  <th className="px-6 py-4">Sub Category</th>
                  <th className="px-6 py-4">Product Name</th>
                  <th className="px-4 py-4 text-center">Qty/Pack</th>
                  <th className="px-4 py-4 text-center">Total Qty</th>
                  <th className="px-4 py-4 text-center">UOM</th>
                  <th className="px-4 py-4 text-right">Rate</th>
                  <th className="px-4 py-4 text-right">Amount</th>
                  <th className="px-4 py-4 text-center">Disc %</th>
                  <th className="px-4 py-4 text-center">VAT %</th>
                  <th className="px-6 py-4 text-right font-bold text-slate-900">Final Amt</th>
                  <th className="px-4 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <Select value={item.mainCategoryId} onValueChange={(v) => updateItem(item.id, 'mainCategoryId', v)} disabled={viewOnly}>
                        <SelectTrigger className="w-32 h-8 text-[10px] border-none bg-slate-50 font-bold">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockData.mainCategories.map(c => (
                            <SelectItem key={c.mainCategoryId} value={c.mainCategoryId}>{c.mainCategoryName}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-6 py-4">
                      <Select value={item.subCategoryId} onValueChange={(v) => updateItem(item.id, 'subCategoryId', v)} disabled={!item.mainCategoryId || viewOnly}>
                        <SelectTrigger className="w-32 h-8 text-[10px] border-none bg-slate-50 font-bold">
                          <SelectValue placeholder="Sub Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockData.subCategories.filter(s => s.mainCategoryId === item.mainCategoryId).map(s => (
                            <SelectItem key={s.subCategoryId} value={s.subCategoryId}>{s.subCategoryName}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-6 py-4 min-w-[200px]">
                      <Select value={item.productId} onValueChange={(v) => updateItem(item.id, 'productId', v)} disabled={!item.subCategoryId || viewOnly}>
                        <SelectTrigger className="w-full h-8 text-xs border-none bg-slate-50 font-bold">
                          <SelectValue placeholder="Select Product" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockData.products.filter(p => p.subCategoryId === item.subCategoryId).map(p => (
                            <SelectItem key={p.productId} value={p.productId}>{p.productName}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-4">
                      <Input
                        type="number"
                        value={item.qtyPack}
                        onChange={(e) => updateItem(item.id, 'qtyPack', parseFloat(e.target.value) || 0)}
                        className="w-16 h-8 text-center bg-slate-50 border-none rounded-lg font-medium mx-auto"
                        disabled={viewOnly}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <Input
                        type="number"
                        value={item.totalQty}
                        onChange={(e) => updateItem(item.id, 'totalQty', parseFloat(e.target.value) || 0)}
                        className="w-20 h-8 text-center bg-slate-50 border-none rounded-lg font-medium mx-auto"
                        disabled={viewOnly}
                      />
                    </td>
                    <td className="px-4 py-4 text-center font-bold text-slate-400">{item.uom}</td>
                    <td className="px-4 py-4">
                      <Input
                        type="number"
                        value={item.rate}
                        step="0.01"
                        onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                        className="w-20 h-8 text-right bg-slate-50 border-none rounded-lg font-medium ml-auto"
                        disabled={viewOnly}
                      />
                    </td>
                    <td className="px-4 py-4 text-right font-bold text-slate-700">{currentCurrency.symbol}{calculateAmount(item).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-4">
                      <Input
                        type="number"
                        value={item.disc}
                        onChange={(e) => updateItem(item.id, 'disc', parseFloat(e.target.value) || 0)}
                        className="w-12 h-8 text-center bg-slate-50 border-none rounded-lg font-medium mx-auto"
                        disabled={viewOnly}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <Input
                        type="number"
                        value={item.vat}
                        onChange={(e) => updateItem(item.id, 'vat', parseFloat(e.target.value) || 0)}
                        className="w-12 h-8 text-center bg-slate-50 border-none rounded-lg font-medium mx-auto"
                        disabled={viewOnly}
                      />
                    </td>
                    <td className="px-6 py-4 text-right font-black text-primary">{currentCurrency.symbol}{calculateFinal(item).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-4 text-center">
                      {!viewOnly && (
                        <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-500 transition-colors p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 3. Additional Costs & Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-slate-800 text-sm">Additional Costs</h3>
                </div>
                {!viewOnly && (
                  <button onClick={addCostRow} className="text-secondary text-xs font-bold hover:underline py-1">Add Row</button>
                )}
              </div>
              <div className="p-6 space-y-4">
                {costItems.map((item) => (
                  <div key={item.id} className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start relative group">
                    <Select value={item.type} onValueChange={(v) => updateCostRow(item.id, 'type', v)} disabled={viewOnly}>
                      <SelectTrigger className="rounded-xl border-slate-200 bg-slate-50 h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="transport">Transportation Cost</SelectItem>
                        <SelectItem value="insurance">Insurance Premium</SelectItem>
                        <SelectItem value="customs">Customs Duty</SelectItem>
                        <SelectItem value="loading">Loading/Unloading</SelectItem>
                        <SelectItem value="other">Other Charges</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">{currentCurrency.symbol}</span>
                        <Input
                          type="number"
                          value={item.amount}
                          onChange={(e) => updateCostRow(item.id, 'amount', parseFloat(e.target.value) || 0)}
                          className="pl-8 text-right font-bold bg-slate-50 rounded-xl border-slate-200 h-10"
                          disabled={viewOnly}
                        />
                      </div>
                      {!viewOnly && costItems.length > 1 && (
                        <button onClick={() => removeCostRow(item.id)} className="text-slate-300 hover:text-red-500 transition-colors p-2">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                <Paperclip className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-slate-800 text-sm">Supporting Documents</h3>
              </div>
              <div className="p-6">
                <div
                  className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer group relative"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={viewOnly}
                  />
                  <UploadCloud className="w-10 h-10 text-slate-300 group-hover:text-primary transition-colors" />
                  <p className="text-sm font-bold text-slate-600 text-center">Click to upload or drag and drop</p>
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest text-center">PDF, JPG, PNG up to 10MB</p>
                </div>

                <div className="mt-4 space-y-3">
                  {documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-amber-100 flex items-center justify-center">
                          <FileText className="w-4 h-4 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-700">{doc.FILE_NAME}</p>
                          <p className="text-[9px] font-medium text-slate-400 uppercase">
                            {(doc.size! / 1024 / 1024).toFixed(2)} MB • {doc.CONTENT_TYPE.split('/')[1]?.toUpperCase() || 'FILE'}
                          </p>
                        </div>
                      </div>
                      {!viewOnly && (
                        <button
                          onClick={() => removeDocument(idx)}
                          className="text-slate-300 hover:text-red-500 transition-colors p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Summary Card */}
          <div className="bg-primary rounded-2xl p-8 text-white shadow-xl shadow-primary/20 h-fit lg:sticky lg:top-24">
            <h3 className="text-lg font-bold mb-8 flex items-center gap-3">
              <Wallet className="w-6 h-6 text-secondary" />
              Order Summary
            </h3>
            <div className="space-y-5">
              <div className="flex justify-between text-sm">
                <span className="text-white/60 font-medium font-body">Subtotal</span>
                <span className="font-mono font-bold">{currentCurrency.symbol}{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60 font-medium font-body">Total Discount</span>
                <span className="font-mono font-bold text-secondary">-{currentCurrency.symbol}{totalDiscount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60 font-medium font-body">Total VAT (15%)</span>
                <span className="font-mono font-bold">{currentCurrency.symbol}{totalVat.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60 font-medium font-body">Additional Costs</span>
                <span className="font-mono font-bold">{currentCurrency.symbol}{totalAdditionalCosts.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="pt-8 mt-8 border-t border-white/10">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] uppercase font-black tracking-[0.2em] text-white/40 mb-1 font-body">Grand Total ({currentCurrency.code})</p>
                    <p className="text-4xl font-black text-secondary tracking-tight">{currentCurrency.symbol}{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-black tracking-[0.2em] text-white/40 mb-1 font-body">Total Items</p>
                    <p className="text-xl font-bold">{items.reduce((acc, item) => acc + item.totalQty, 0).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-10 space-y-4">
              {!viewOnly && (
                <Button onClick={handleSubmit} className="w-full py-8 bg-secondary hover:bg-secondary/90 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-secondary/20 h-auto">
                  <CheckCircle2 className="w-6 h-6" />
                  {id ? "Confirm and Update PO" : "Confirm and Submit PO"}
                </Button>
              )}
              {viewOnly && (
                <Button onClick={() => router.back()} className="w-full py-8 bg-slate-700 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg h-auto">
                  <ArrowLeft className="w-6 h-6" />
                  Back to List
                </Button>
              )}
              <p className="text-[10px] text-center text-white/40 font-medium leading-relaxed italic font-body">
                By {id ? 'updating' : 'submitting'}, you agree to the procurement terms and inventory logging protocols of AgroManage v2.0
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 py-10 border-t border-slate-100 text-center">
          <p className="text-xs font-medium text-slate-400">© {new Date().getFullYear()} AgroManage ERP - System V4.2.1. Enterprise Edition</p>
        </footer>
      </div>
    </main>
  );
}

export default function CreatePurchaseOrder() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading PO Engine...</div>}>
      <CreatePOContent />
    </Suspense>
  );
}
