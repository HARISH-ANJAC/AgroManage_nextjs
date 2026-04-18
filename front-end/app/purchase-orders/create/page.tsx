"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo, Suspense } from "react";
import { toast } from "sonner";
import { ArrowLeft, Save, Send, Plus, Trash2, Upload, FileText, CheckCircle2, XCircle, X, History, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePurchaseOrderStore } from "@/hooks/usePurchaseOrderStore";
import { useMasterData } from "@/hooks/useMasterData";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SupportingDoc } from "@/components/ui/Supporting-Doc";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface LineItem {
  id: string | number;
  productId?: number;
  productName: string;
  qtyPerPack: number;
  totalQty: number;
  uom: string;
  packing: string;
  rate: number;
  amount: number;
  discPercent: number;
  vatPercent: number;
}

interface AdditionalCost {
  id: string | number;
  typeId?: number;
  typeName: string;
  amount: number;
}

const createLineItem = (vatPercent = 18): LineItem => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  productName: "",
  qtyPerPack: 0,
  totalQty: 0,
  uom: "KG",
  packing: "",
  rate: 0,
  amount: 0,
  discPercent: 0,
  vatPercent,
});

const getLineItemBreakdown = (item: LineItem) => {
  const totalPacking = item.qtyPerPack ? item.totalQty / item.qtyPerPack : 0;
  const discountAmount = (item.amount * item.discPercent) / 100;
  const amountAfterDiscount = item.amount - discountAmount;
  const vatAmount = (amountAfterDiscount * item.vatPercent) / 100;
  const finalAmount = amountAfterDiscount + vatAmount;

  return {
    totalPacking,
    discountAmount,
    amountAfterDiscount,
    vatAmount,
    finalAmount,
  };
};

const formatAmount = (value: number) =>
  Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

function CreatePurchaseOrderContent() {
  const navigate = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const { orders, addOrder, updateOrder, getOrderById, approveOrder } = usePurchaseOrderStore();
  const today = new Date().toISOString().split("T")[0];

  // Master Data
  const { data: companies = [], isLoading: companiesLoading } = useMasterData("product-company-category-mappings");
  const { data: suppliers = [], isLoading: suppliersLoading } = useMasterData("suppliers");
  const { data: stores = [], isLoading: storesLoading } = useMasterData("user-store-mappings");
  const { data: paymentTerms = [], isLoading: paymentTermsLoading } = useMasterData("payment-terms");
  const { data: currencies = [], isLoading: currenciesLoading } = useMasterData("currencies");
  const { data: productsData = [], isLoading: productsDataLoading } = useMasterData("products");
  const { data: additionalCostTypes = [], isLoading: additionalCostTypesLoading } = useMasterData("additional-cost-types");

  const [header, setHeader] = useState({
    poDate: today,
    purchaseType: "Local",
    companyId: 0,
    supplierId: 0,
    storeId: 0,
    paymentTermId: 0,
    currencyId: 0,
    exchangeRate: 1,
    modeOfPayment: "",
    proformaNo: "",
    shipmentMode: "Road",
    estShipmentDate: "",
    priceTerms: "FOB",
    poRefNo: "",
    status: "Draft",
    shipmentRemarks: "",
  });

  const [items, setItems] = useState<LineItem[]>([createLineItem(18)]);

  const [additionalCosts, setAdditionalCosts] = useState<AdditionalCost[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [dbData, setDbData] = useState<any>(null);
  const [rawDbItems, setRawDbItems] = useState<any[]>([]); // raw items from DB
  const [rawDbCosts, setRawDbCosts] = useState<any[]>([]); // raw costs from DB
  const [approvalRemarks, setApprovalRemarks] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Step 1: Fetch PO data from DB (only depends on editId)
  useEffect(() => {
    const loadPo = async () => {
      if (!editId) return;
      const res = await getOrderById(editId);
      if (res && res.header) {
        setDbData(res);
        setConversations(res.conversations || []);
        setRawDbItems(res.items || []);
        setRawDbCosts(res.additionalCosts || []);
        const h = res.header;
        setHeader({
          poDate: h.PO_DATE ? new Date(h.PO_DATE).toISOString().split('T')[0] : today,
          purchaseType: h.PURCHASE_TYPE || "Local",
          companyId: h.COMPANY_ID || 0,
          supplierId: h.SUPPLIER_ID || 0,
          storeId: h.PO_STORE_ID || 0,
          paymentTermId: h.PAYMENT_TERM_ID || 0,
          currencyId: h.CURRENCY_ID || 0,
          exchangeRate: Number(h.EXCHANGE_RATE) || 1,
          modeOfPayment: h.MODE_OF_PAYMENT || "",
          proformaNo: h.SUPLIER_PROFORMA_NUMBER || "",
          shipmentMode: h.SHIPMENT_MODE || "Road",
          estShipmentDate: h.ESTIMATED_SHIPMENT_DATE ? new Date(h.ESTIMATED_SHIPMENT_DATE).toISOString().split('T')[0] : "",
          priceTerms: h.PRICE_TERMS || "FOB",
          poRefNo: h.PO_REF_NO || "",
          status: h.STATUS_ENTRY || "Draft",
          shipmentRemarks: h.SHIPMENT_REMARKS || "",
        });

        if (res.files) {
          setFiles(res.files.map((f: any) => ({
            id: f.SNO,
            documentType: f.DOCUMENT_TYPE || "Other",
            descriptionDetails: f.DESCRIPTION_DETAILS || "",
            fileName: f.FILE_NAME || "",
            contentType: f.CONTENT_TYPE || "",
            contentData: f.CONTENT_DATA || "",
            remarks: f.REMARKS || ""
          })));
        }
      }
    };
    loadPo();
  }, [editId]);

  // Step 1.5: Set default master IDs for new PO automatically from master data
  useEffect(() => {
    if (editId) return; // Only for new orders

    const shouldUpdate = !header.companyId || !header.supplierId || !header.storeId || !header.paymentTermId || !header.currencyId;
    if (!shouldUpdate) return;

    setHeader(prev => ({
      ...prev,
      companyId: prev.companyId || (companies[0]?.companyId || 0),
      supplierId: prev.supplierId || (suppliers[0]?.id || 0),
      storeId: prev.storeId || (stores[0]?.storeIdUserToRole || 0),
      paymentTermId: prev.paymentTermId || (paymentTerms[0]?.id || 0),
      currencyId: prev.currencyId || (currencies[0]?.id || 0),
      modeOfPayment: prev.modeOfPayment || "Cash"
    }));
  }, [editId, companies, suppliers, stores, paymentTerms, currencies]);

  // Step 2: Once master data arrives, resolve product names and cost type names
  useEffect(() => {
    if (!editId || rawDbItems.length === 0 || productsData.length === 0) return;
    setItems(rawDbItems.map((item: any) => {
      const prod = productsData.find((p: any) => p.id === item.PRODUCT_ID);
      return {
        id: item.SNO,
        productId: item.PRODUCT_ID,
        productName: prod?.productName || "",
        totalQty: Number(item.TOTAL_QTY),
        rate: Number(item.RATE_PER_QTY),
        amount: Number(item.PRODUCT_AMOUNT),
        discPercent: Number(item.DISCOUNT_PERCENTAGE) || 0,
        vatPercent: Number(item.VAT_PERCENTAGE) || 18,
        uom: item.UOM || prod?.uom || "KG",
        packing: prod?.packing || "",
        qtyPerPack: Number(item.QTY_PER_PACKING) || prod?.qtyPerPacking || 0,
      };
    }));
  }, [editId, rawDbItems, productsData]);

  useEffect(() => {
    if (!editId || rawDbCosts.length === 0 || additionalCostTypes.length === 0) return;
    setAdditionalCosts(rawDbCosts.map((c: any) => ({
      id: c.SNO,
      typeId: c.ADDITIONAL_COST_TYPE_ID,
      typeName: additionalCostTypes.find((t: any) => t.id === c.ADDITIONAL_COST_TYPE_ID)?.additionalCostTypeName || "",
      amount: Number(c.ADDITIONAL_COST_AMOUNT)
    })));
  }, [editId, rawDbCosts, additionalCostTypes]);

  const handleApprove = async (level: string, status: string) => {
    if (!editId) return;
    setIsSaving(true);
    const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
    try {
      await approveOrder({
        id: editId,
        level,
        status,
        remarks: approvalRemarks,
        user: userInfo.loginName || "Admin"
      });
      toast.success(`Order ${status}`);
      setApprovalRemarks("");
      // Reload
      const res = await getOrderById(editId);
      setDbData(res);
      setConversations(res.conversations || []);
    } catch (e) {
      toast.error("Approval action failed");
    } finally {
      setIsSaving(false);
    }
  };

  const selectedCurrency = useMemo(() => {
    const curr = currencies.find((c: any) => Number(c.id) === Number(header.currencyId));
    return curr?.currencyCode || curr?.currencyName || "$";
  }, [header.currencyId, currencies]);

  const purchaseHistory = useMemo(() => {
    if (!header.companyId || !header.supplierId) return [];
    return orders.filter((o: any) =>
      Number(o.COMPANY_ID) === Number(header.companyId) &&
      Number(o.SUPPLIER_ID) === Number(header.supplierId) &&
      o.PO_REF_NO !== header.poRefNo
    ).sort((a: any, b: any) => new Date(b.PO_DATE).getTime() - new Date(a.PO_DATE).getTime());
  }, [orders, header.companyId, header.supplierId, header.poRefNo]);

  // Calculations
  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.amount, 0), [items]);
  const totalDisc = useMemo(() => items.reduce((sum, i) => sum + (i.amount * i.discPercent) / 100, 0), [items]);
  const subtotalAfterDisc = subtotal - totalDisc;
  const totalVat = useMemo(() => items.reduce((sum, i) => {
    const amtAfterDisc = i.amount - (i.amount * i.discPercent) / 100;
    return sum + (amtAfterDisc * i.vatPercent) / 100;
  }, 0), [items]);
  const totalAdditional = useMemo(() => additionalCosts.reduce((sum, c) => sum + c.amount, 0), [additionalCosts]);
  const grandTotal = subtotalAfterDisc + totalVat + totalAdditional;

  const handleUpdateItem = (id: string | number, field: string, value: any) => {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const updated = { ...item, [field]: value };
      if (field === "productName") {
        const prod = productsData.find((p: any) => p.productName === value);
        if (prod) {
          updated.productId = prod.id;
          updated.uom = prod.uom;
          updated.packing = prod.packing;
          updated.qtyPerPack = prod.qtyPerPacking;
        }
      }
      updated.amount = updated.totalQty * updated.rate;
      return updated;
    }));
  };

  const handleAddCost = () => {
    setAdditionalCosts(prev => [...prev, { id: Date.now(), typeName: "", amount: 0 }]);
  };

  const handleAddItem = () => {
    setItems(prev => [...prev, createLineItem(15)]);
  };

  const handleRemoveItem = (id: string | number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };


  const handleSave = async (isSubmit: boolean = false) => {
    if (!header.supplierId || !header.companyId) {
      toast.error("Please fill required header details");
      return;
    }

    setIsSaving(true);
    const userInfo = JSON.parse(localStorage.getItem('user') || '{}');

    const payload = {
      header: { ...header, status: isSubmit ? "Submitted" : header.status, productAmount: subtotal, totalVatAmount: totalVat, finalAmount: grandTotal },
      items: items.map(i => ({ productId: i.productId, totalQty: i.totalQty, rate: i.rate, amount: i.amount, discPercent: i.discPercent, vatPercent: i.vatPercent, qtyPerPack: i.qtyPerPack, packing: i.packing, uom: i.uom })),
      additionalCosts: additionalCosts.map(c => ({ typeId: c.typeId || additionalCostTypes.find((t: any) => t.additionalCostTypeName === c.typeName)?.id, amount: c.amount })),
      files: files.map(f => ({ documentType: f.documentType, descriptionDetails: f.descriptionDetails, fileName: f.fileName, contentType: f.contentType, contentData: f.contentData, remarks: f.remarks })),
      audit: { user: userInfo.loginName || "admin" }
    };

    try {
      if (editId) {
        await updateOrder(editId, payload);
        toast.success("Order Updated");
      } else {
        await addOrder(payload);
        toast.success("Order Created");
      }
      navigate.push("/purchase-orders");
    } catch (e) {
      toast.error("Process Failed");
    } finally {
      setIsSaving(false);
    }
  };

  if (editId && !dbData) {
    return (
      <div className="max-w-[1760px] mx-auto pb-20 px-4 pt-6 space-y-8">
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-10 w-48" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white rounded-3xl border p-8 space-y-6">
              <Skeleton className="h-6 w-40" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
              </div>
            </div>
            <div className="bg-white rounded-3xl border p-8 space-y-6">
              <Skeleton className="h-6 w-32" />
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          </div>
          <div className="space-y-8">
            <div className="bg-[#1A2E28] rounded-[32px] p-8 h-80">
              <Skeleton className="h-8 w-32 mb-8 bg-white/20" />
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-4 w-full bg-white/10" />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1760px] mx-auto pb-20 px-4 pt-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate.back()} className="rounded-full h-10 w-10 p-0"><ArrowLeft className="w-5 h-5" /></Button>
          <div>
            <h1 className="text-2xl font-bold">{editId ? `PO: ${header.poRefNo}` : "Create Purchase Order"}</h1>
            <Badge variant="outline" className="mt-1">{header.status}</Badge>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => handleSave(false)} disabled={isSaving}><Save className="w-4 h-4 mr-2" /> Save Draft</Button>
          <Button onClick={() => handleSave(true)} className="bg-[#1A2E28]" disabled={isSaving}><Send className="w-4 h-4 mr-2" /> Submit Order</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          {/* Header Card */}
          <div className="bg-white rounded-3xl border p-8 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-6">Header Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label>PO Date</Label>
                <Input type="date" value={header.poDate} onChange={e => setHeader({ ...header, poDate: e.target.value })} className="rounded-xl h-11" />
              </div>
              <div className="space-y-2">
                <Label>Purchase Type</Label>
                <Select value={header.purchaseType} onValueChange={v => setHeader({ ...header, purchaseType: v })}>
                  <SelectTrigger className="rounded-xl h-11"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="Local">Local</SelectItem><SelectItem value="Import">Import</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Company</Label>
                {companiesLoading ? (
                  <Skeleton className="h-11 w-full rounded-xl" />
                ) : (
                  <Select value={String(header.companyId)} onValueChange={v => setHeader({ ...header, companyId: Number(v) })}>
                    <SelectTrigger className="rounded-xl h-11"><SelectValue placeholder="Select Company" /></SelectTrigger>
                    <SelectContent>{companies.map((c: any) => <SelectItem key={c.id} value={String(c.companyId)}>{c.companyName} (@{c.categoryName})</SelectItem>)}</SelectContent>
                  </Select>
                )}
              </div>
              <div className="space-y-2">
                <Label>Supplier</Label>
                {suppliersLoading ? (
                  <Skeleton className="h-11 w-full rounded-xl" />
                ) : (
                  <Select value={String(header.supplierId)} onValueChange={v => setHeader({ ...header, supplierId: Number(v) })}>
                    <SelectTrigger className="rounded-xl h-11"><SelectValue placeholder="Select Supplier" /></SelectTrigger>
                    <SelectContent>{suppliers.map((s: any) => <SelectItem key={s.id} value={String(s.id)}>{s.supplierName}</SelectItem>)}</SelectContent>
                  </Select>
                )}
              </div>
              <div className="space-y-2">
                <Label>Store</Label>
                {storesLoading ? (
                  <Skeleton className="h-11 w-full rounded-xl" />
                ) : (
                  <Select value={String(header.storeId)} onValueChange={v => setHeader({ ...header, storeId: Number(v) })}>
                    <SelectTrigger className="rounded-xl h-11"><SelectValue placeholder="Select Store" /></SelectTrigger>
                    <SelectContent>{stores.map((s: any) => <SelectItem key={s.id} value={String(s.storeIdUserToRole)}>{s.storeName} (@{s.userName})</SelectItem>)}</SelectContent>
                  </Select>
                )}
              </div>
              <div className="space-y-2">
                <Label>Payment Term</Label>
                <Select value={String(header.paymentTermId)} onValueChange={v => setHeader({ ...header, paymentTermId: Number(v) })}>
                  <SelectTrigger className="rounded-xl h-11"><SelectValue placeholder="Select Term" /></SelectTrigger>
                  <SelectContent>{paymentTerms.map((pt: any) => <SelectItem key={pt.id} value={String(pt.id)}>{pt.paymentTermName}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Mode of Payment</Label>
                <Select value={header.modeOfPayment} onValueChange={v => setHeader({ ...header, modeOfPayment: v })}>
                  <SelectTrigger className="rounded-xl h-11"><SelectValue placeholder="Select Mode" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="Cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select value={String(header.currencyId)} onValueChange={v => setHeader({ ...header, currencyId: Number(v) })}>
                  <SelectTrigger className="rounded-xl h-11"><SelectValue placeholder="Select Currency" /></SelectTrigger>
                  <SelectContent>{currencies.map((c: any) => <SelectItem key={c.id} value={String(c.id)}>{c.currencyName || c.currencyCode}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Exchange Rate</Label>
                <Input type="number" value={header.exchangeRate} onChange={e => setHeader({ ...header, exchangeRate: Number(e.target.value) })} className="rounded-xl h-11" />
              </div>
              <div className="space-y-2">
                <Label>Supplier Proforma No</Label>
                <Input value={header.proformaNo} onChange={e => setHeader({ ...header, proformaNo: e.target.value })} className="rounded-xl h-11" placeholder="Proforma No" />
              </div>
              <div className="space-y-2">
                <Label>Price Terms</Label>
                <Select value={header.priceTerms} onValueChange={v => setHeader({ ...header, priceTerms: v })}>
                  <SelectTrigger className="rounded-xl h-11"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="FOB">FOB</SelectItem><SelectItem value="CIF">CIF</SelectItem><SelectItem value="EXW">EXW</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Shipment Mode</Label>
                <Select value={header.shipmentMode} onValueChange={v => setHeader({ ...header, shipmentMode: v })}>
                  <SelectTrigger className="rounded-xl h-11"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="Road">Road</SelectItem><SelectItem value="Sea">Sea</SelectItem><SelectItem value="Air">Air</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Est. Shipment Date</Label>
                <Input type="date" value={header.estShipmentDate} onChange={e => setHeader({ ...header, estShipmentDate: e.target.value })} className="rounded-xl h-11" />
              </div>
              <div className="space-y-2 md:col-span-4">
                <Label>Shipment Remarks</Label>
                <Input value={header.shipmentRemarks} onChange={e => setHeader({ ...header, shipmentRemarks: e.target.value })} className="rounded-xl h-11" placeholder="Any remarks regarding shipment" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-[#1A2E28] rounded-[32px] p-8 text-white shadow-xl lg:sticky lg:top-8">
            <h3 className="text-lg font-bold mb-8">Order Summary</h3>
            <div className="space-y-4 text-sm opacity-80">
              <div className="flex justify-between"><span>Product Amount</span><span>{selectedCurrency} {formatAmount(subtotal)}</span></div>
              <div className="flex justify-between"><span>Discount</span><span>-{selectedCurrency} {formatAmount(totalDisc)}</span></div>
              <div className="flex justify-between"><span>Tax (VAT)</span><span>{selectedCurrency} {formatAmount(totalVat)}</span></div>
              <div className="flex justify-between"><span>Add. Costs</span><span>{selectedCurrency} {formatAmount(totalAdditional)}</span></div>
            </div>
            <div className="mt-10 pt-8 border-t border-white/10">
              <p className="text-[10px] uppercase font-bold tracking-widest opacity-50 mb-1">Grand Total</p>
              <p className="text-4xl font-extrabold">{selectedCurrency} {formatAmount(grandTotal)}</p>
              <Button onClick={() => handleSave(true)} disabled={isSaving} className="w-full mt-10 bg-[#059669] hover:bg-[#059669]/90 h-14 rounded-2xl font-bold">Confirm and Submit</Button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">Line Items</h3>
                <Badge variant="outline" className="rounded-full border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold text-slate-600">
                  {items.length} {items.length === 1 ? "Item" : "Items"}
                </Badge>
              </div>
              <Button
                variant="outline"
                className="h-11 rounded-xl border-emerald-200 bg-white px-5 font-semibold text-emerald-700 hover:bg-emerald-50"
                onClick={handleAddItem}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Line Item
              </Button>
            </div>

            <div className="space-y-4 p-6">
              {items.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50/80 px-6 py-16 text-center">
                  <p className="text-lg font-bold text-slate-900">No line items added yet</p>
                  <p className="mt-2 text-sm text-slate-500">
                    Add the first product line to start building the purchase order.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-6 h-11 rounded-xl border-emerald-200 bg-white px-5 font-semibold text-emerald-700 hover:bg-emerald-50"
                    onClick={handleAddItem}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add First Item
                  </Button>
                </div>
              ) : (
                items.map((item, index) => {
                  const selectedProd = productsData.find((p: any) => p.productName === item.productName);
                  const imgData = selectedProd?.contentData;
                  const { totalPacking, finalAmount } = getLineItemBreakdown(item);

                  return (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
                    >
                      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
                        <div className="min-w-0 space-y-3 lg:max-w-[760px]">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="rounded-full border-slate-200 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                              Item {index + 1}
                            </Badge>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Product</Label>
                            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
                              {imgData ? (
                                <img
                                  src={imgData}
                                  alt="Product"
                                  className="h-10 w-10 shrink-0 rounded-lg border border-slate-200 object-cover shadow-sm cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
                                  onClick={() => setPreviewImage(imgData)}
                                  title="Click to view"
                                />
                              ) : (
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-[10px] font-bold uppercase text-slate-400">
                                  Img
                                </div>
                              )}
                              <Select value={item.productName} onValueChange={v => handleUpdateItem(item.id, "productName", v)}>
                                <SelectTrigger className="h-10 flex-1 border-0 bg-transparent px-0 text-left font-semibold text-slate-900 shadow-none focus:ring-0">
                                  <SelectValue placeholder="Select Product" />
                                </SelectTrigger>
                                <SelectContent>
                                  {productsData.map((p: any) => <SelectItem key={p.id} value={p.productName}>{p.productName}</SelectItem>)}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                            <span className="rounded-full border border-slate-200 bg-white px-3 py-1">UOM: {item.uom || "-"}</span>
                            <span className="rounded-full border border-slate-200 bg-white px-3 py-1">Pack: {item.qtyPerPack || 0} {item.uom}</span>
                            <span className="rounded-full border border-slate-200 bg-white px-3 py-1">Total Packs: {totalPacking.toFixed(2)}</span>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-4">
                          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Final Amount</p>
                          <p className="mt-2 text-2xl font-extrabold text-slate-900">{selectedCurrency} {formatAmount(finalAmount)}</p>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-2.5 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10"
                            aria-label="Delete line item"
                            title="Delete line item"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Quantity</Label>
                          <Input
                            type="number"
                            value={item.totalQty}
                            onChange={e => handleUpdateItem(item.id, "totalQty", Number(e.target.value))}
                            className="h-11 rounded-xl border-slate-200 bg-white text-center font-bold"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Rate</Label>
                          <Input
                            type="number"
                            value={item.rate}
                            onChange={e => handleUpdateItem(item.id, "rate", Number(e.target.value))}
                            className="h-11 rounded-xl border-slate-200 bg-white text-center font-bold"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Discount %</Label>
                          <Input
                            type="number"
                            value={item.discPercent}
                            onChange={e => handleUpdateItem(item.id, "discPercent", Number(e.target.value))}
                            className="h-11 rounded-xl border-slate-200 bg-white text-center font-bold"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">VAT %</Label>
                          <Input
                            type="number"
                            value={item.vatPercent}
                            onChange={e => handleUpdateItem(item.id, "vatPercent", Number(e.target.value))}
                            className="h-11 rounded-xl border-slate-200 bg-white text-center font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {editId && dbData && (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm overflow-hidden border-t-4 border-t-emerald-500">
              <div className="flex flex-col gap-3 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Approval Workflow
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Review the current approval status and take the next action without losing sight of the main form.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Purchase Head</p>
                    <div className="mt-3">
                      <Badge variant={dbData.header.PURCHASE_HEAD_RESPONSE_STATUS === 'Approved' ? 'success' : 'secondary'}>
                        {dbData.header.PURCHASE_HEAD_RESPONSE_STATUS || "Pending"}
                      </Badge>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Final Decision</p>
                    <div className="mt-3">
                      <Badge variant={dbData.header.STATUS_ENTRY === 'Approved' ? 'success' : 'outline'}>
                        {dbData.header.STATUS_ENTRY}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase text-muted-foreground">Approval Remarks</Label>
                    <textarea
                      className="min-h-[120px] w-full rounded-2xl border bg-white px-4 py-3 text-sm"
                      placeholder="Type remarks for approval or rejection..."
                      value={approvalRemarks}
                      onChange={e => setApprovalRemarks(e.target.value)}
                    />
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <Button
                      onClick={() => handleApprove("head", "Approved")}
                      disabled={isSaving}
                      className="bg-emerald-600 h-11 text-sm font-bold"
                    >
                      Approve (Head)
                    </Button>
                    <Button
                      onClick={() => handleApprove("final", "Approved")}
                      disabled={isSaving}
                      className="bg-indigo-600 h-11 text-sm font-bold"
                    >
                      Final Approve
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleApprove("head", "Rejected")}
                      disabled={isSaving}
                      className="h-11 border-destructive text-destructive text-sm hover:bg-destructive/5"
                    >
                      Reject PO
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl border p-8 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-6">Additional Costs</h3>
              <div className="space-y-4">
                {additionalCosts.map(cost => (
                  <div key={cost.id} className="flex gap-4">
                    <Select value={cost.typeName} onValueChange={v => setAdditionalCosts(prev => prev.map(c => c.id === cost.id ? { ...c, typeName: v, typeId: additionalCostTypes.find((t: any) => t.additionalCostTypeName === v)?.id } : c))}>
                      <SelectTrigger className="flex-1 rounded-xl h-11"><SelectValue placeholder="Cost Type" /></SelectTrigger>
                      <SelectContent>{additionalCostTypes.map((t: any) => <SelectItem key={t.id} value={t.additionalCostTypeName}>{t.additionalCostTypeName}</SelectItem>)}</SelectContent>
                    </Select>
                    <Input type="number" value={cost.amount} onChange={e => setAdditionalCosts(prev => prev.map(c => c.id === cost.id ? { ...c, amount: Number(e.target.value) } : c))} className="w-32 rounded-xl h-11" />
                  </div>
                ))}
                <Button variant="ghost" size="sm" onClick={handleAddCost} className="text-[#059669]"><Plus className="w-4 h-4 mr-1" /> Add Cost Row</Button>
              </div>
            </div>

            <SupportingDoc files={files} onFilesChange={setFiles} />

            {/* Purchase History */}
            <div className="bg-white rounded-3xl border p-8 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-6">Purchase History</h3>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {purchaseHistory.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                    <div className="size-10 rounded-full bg-white flex items-center justify-center text-slate-300 mb-3 border shadow-sm">
                      <History className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-medium text-slate-500">No past purchases found</p>
                    <p className="text-[10px] text-slate-400 mt-1">Select a Supplier & Company to see history</p>
                  </div>
                )}
                {purchaseHistory.map((po: any) => {
                  const curr = currencies.find((c: any) => Number(c.id) === Number(po.CURRENCY_ID));
                  const sym = curr?.currencyCode || "$";
                  return (
                    <div key={po.PO_REF_NO} className="p-4 bg-slate-50/30 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md hover:border-slate-200 transition-all group">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[13px] font-bold text-slate-900 group-hover:text-primary transition-colors">{po.PO_REF_NO}</span>
                            {po.STATUS_ENTRY === 'Approved' && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                            <Calendar className="w-3 h-3" />
                            {new Date(po.PO_DATE).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                          </div>
                        </div>
                        <Badge variant={po.STATUS_ENTRY === 'Approved' ? 'success' : 'secondary'} className="text-[10px] px-2 py-0 h-5">
                          {po.STATUS_ENTRY}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center bg-white/50 p-2 rounded-xl border border-slate-100 group-hover:border-slate-200 transition-all">
                        <span className="text-sm font-bold text-slate-800">
                          <span className="text-[10px] text-slate-400 font-medium mr-1">Total:</span>
                          {sym} {formatAmount(Number(po.FINAL_PURCHASE_HDR_AMOUNT))}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-[11px] font-bold px-3 rounded-lg hover:bg-primary hover:text-white transition-all shadow-sm group-hover:shadow"
                          onClick={() => window.open(`/purchase-orders/create?id=${encodeURIComponent(po.PO_REF_NO)}`, '_blank')}
                        >
                          View PO
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Conversations/History Tracker */}
            <div className="bg-white rounded-3xl border p-8 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-6">Discussion & Audit History</h3>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {conversations.length === 0 && <p className="text-xs text-muted-foreground">No discussions yet.</p>}
                {conversations.map((conv: any) => (
                  <div key={conv.SNO} className="p-4 bg-muted/30 rounded-2xl border border-border/50">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-primary">{conv.RESPOND_PERSON}</span>
                      <span className="text-[10px] text-muted-foreground">{new Date(conv.CREATED_DATE).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">{conv.DISCUSSION_DETAILS}</p>
                    {conv.RESPONSE_STATUS && (
                      <Badge variant="outline" className="mt-2 text-[10px] font-bold">{conv.RESPONSE_STATUS}</Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={!!previewImage} onOpenChange={(open) => !open && setPreviewImage(null)}>
        <DialogContent className="max-w-4xl border-none bg-transparent shadow-none p-0 flex items-center justify-center outline-none">
          <DialogTitle className="sr-only">Image Preview</DialogTitle>
          <div className="relative group">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-3 -right-3 z-50 bg-white text-black hover:bg-destructive hover:text-white p-1.5 rounded-full shadow-2xl border border-black/10 transition-all duration-200"
            >
              <X className="w-4 h-4" />
            </button>
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview Snapshot"
                className="max-h-[85vh] max-w-full rounded-lg shadow-2xl border-4 border-white object-contain bg-white/50 backdrop-blur-sm"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function CreatePurchaseOrderPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center animate-pulse">Loading Application...</div>}>
      <CreatePurchaseOrderContent />
    </Suspense>
  );
}
