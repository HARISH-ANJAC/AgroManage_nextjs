"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { ArrowLeft, Save, BookOpen, Info, FileText, Calendar, User, DollarSign, Link as LinkIcon, CheckCircle2, Package, Loader2, Plus, Trash2, Upload, FileUp, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMasterData } from "@/hooks/useMasterData";
import { usePurchaseOrderStore } from "@/hooks/usePurchaseOrderStore";
import { useGoodsReceiptStore } from "@/hooks/useGoodsReceiptStore";
import { usePurchaseBookingStore } from "@/hooks/usePurchaseBookingStore";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface InvoiceItem {
    id: number;
    grnRefNo: string;
    mainCategoryId: number | null;
    subCategoryId: number | null;
    productId: number;
    productName: string;
    qtyPerPacking: number;
    totalQty: number; // Invoice Qty
    grnQty: number;   // Received Qty (from GRN)
    uom: string;
    totalPacking: number;
    alternateUom: string;
    ratePerQty: number; // Invoice Rate
    poRate: number;     // Ordered Rate (from PO)
    productAmount: number;
    discountPercentage: number;
    discountAmount: number;
    totalProductAmount: number;
    vatPercentage: number;
    vatAmount: number;
    finalProductAmount: number;
    remarks: string;
}

interface AdditionalCost {
    id: number;
    typeId: number | string;
    amount: number;
    remarks: string;
}

interface UploadedFile {
    id: number;
    documentType: string;
    fileName: string;
    description: string;
}

function CreatePurchaseBookingContent() {
    const navigate = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get("id");
    const today = new Date().toISOString().split("T")[0];

    // Master Data
    const { data: stores, isLoading: storesLoading } = useMasterData("stores");
    const { data: companies, isLoading: companiesLoading } = useMasterData("product-company-category-mappings");
    const { data: suppliers, isLoading: suppliersLoading } = useMasterData("suppliers");
    const { data: currencies, isLoading: currenciesLoading } = useMasterData("currencies");
    const { data: paymentTerms, isLoading: paymentTermsLoading } = useMasterData("payment-terms");
    const { data: costTypes, isLoading: costTypesLoading } = useMasterData("additional-cost-types");
    const { data: categories, isLoading: categoriesLoading } = useMasterData("categories");

    // Enterprise Stores
    const { orders: pos, getOrderById: getPOById } = usePurchaseOrderStore();
    const { grns, getGRNById } = useGoodsReceiptStore();
    const { addBooking, updateBooking, getBookingById, bookings = [], uploadFile, getFiles } = usePurchaseBookingStore();

    const [submitting, setSubmitting] = useState(false);
    const [header, setHeader] = useState({
        purchaseInvoiceRefNo: "",
        invoiceNo: "",
        invoiceDate: today,
        companyId: "" as string | number,
        poRefNo: "",
        purchaseType: "Local",
        supplierId: "" as string | number,
        storeId: "" as string | number,
        paymentTermId: "" as string | number,
        modeOfPayment: "Credit",
        currencyId: "1" as string | number,
        priceTerms: "",
        exchangeRate: 1,
        remarks: "",
        status: "Draft",
        response1Status: "Pending",
        response2Status: "Pending",
        finalResponseStatus: "Pending"
    });

    const [items, setItems] = useState<InvoiceItem[]>([]);
    const [additionalCosts, setAdditionalCosts] = useState<AdditionalCost[]>([]);
    const [existingFiles, setExistingFiles] = useState<UploadedFile[]>([]);
    const [uploading, setUploading] = useState(false);
    const [isFetchingData, setIsFetchingData] = useState(false);

    // PI Ref No Logic
    const nextPiRefNo = useMemo(() => {
        if (editId) return "";
        const year = new Date().getFullYear();
        const month = String(new Date().getMonth() + 1).padStart(2, "0");
        const prefix = `PI/${year}/${month}/`;
        const existing = bookings.map((b: any) => {
            const ref = b.purchaseInvoiceRefNo || b.PURCHASE_INVOICE_REF_NO || "";
            return ref.startsWith(prefix) ? (parseInt(ref.replace(prefix, ""), 10) || 0) : 0;
        }).filter(Boolean);
        return `${prefix}${String((existing.length > 0 ? Math.max(...existing) : 0) + 1).padStart(3, "0")}`;
    }, [bookings, editId]);

    useEffect(() => {
        if (!editId) {
            setHeader(prev => ({ 
                ...prev, 
                purchaseInvoiceRefNo: nextPiRefNo,
                companyId: prev.companyId || (companies[0]?.companyId || "")
            }));
        }
    }, [nextPiRefNo, editId, companies]);

    // Financials
    const financials = useMemo(() => {
        const prodAmt = items.reduce((s, i) => s + i.totalProductAmount, 0);
        const vatAmt = items.reduce((s, i) => s + i.vatAmount, 0);
        const costAmt = additionalCosts.reduce((s, c) => s + c.amount, 0);
        return {
            prodAmt,
            vatAmt,
            costAmt,
            total: prodAmt + vatAmt + costAmt,
            totalLC: (prodAmt + vatAmt + costAmt) * Number(header.exchangeRate)
        };
    }, [items, additionalCosts, header.exchangeRate]);

    const approvedPOs = useMemo(() => pos.filter((p: any) => (p.header?.status || p.status || p.STATUS_ENTRY) === "Approved"), [pos]);
    const availableGRNs = useMemo(() => {
        if (!header.poRefNo) return [];
        return grns.filter((g: any) => {
            const grnPo = g.PO_REF_NO || g.poRefNo || g.header?.poRefNo || g.header?.PO_REF_NO;
            return String(grnPo).trim() === String(header.poRefNo).trim();
        });
    }, [header.poRefNo, grns]);

    // Item Calc
    const updateItem = (id: number, field: keyof InvoiceItem, value: any) => {
        setItems(prev => prev.map(item => {
            if (item.id !== id) return item;
            const updated = { ...item, [field]: value };
            const amt = updated.totalQty * updated.ratePerQty;
            const discAmt = amt * (updated.discountPercentage / 100);
            const totalProdAmt = amt - discAmt;
            const vatAmt = totalProdAmt * (updated.vatPercentage / 100);
            return { ...updated, productAmount: amt, discountAmount: discAmt, totalProductAmount: totalProdAmt, vatAmount: vatAmt, finalProductAmount: totalProdAmt + vatAmt };
        }));
    };

    // File Upload Handler
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        if (!editId) { toast.warning("Please save the invoice header before uploading documents"); return; }
        
        setUploading(true);
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const base64 = (event.target?.result as string).split(',')[1];
                await uploadFile(editId, {
                    documentType: "Invoice Attachment",
                    description: "Supplier Scan",
                    fileName: file.name,
                    contentType: file.type,
                    contentData: base64,
                    audit: { user: "Admin" }
                });
                toast.success("Document attached!");
                const files = await getFiles(editId);
                setExistingFiles(files);
            } catch (err) {
                toast.error("Upload failed");
            } finally {
                setUploading(false);
            }
        };
        reader.readAsDataURL(file);
    };

    // Save
    const handleSave = async () => {
        if (!header.invoiceNo) { toast.error("Supplier Invoice Number is mandatory"); return; }
        if (items.length === 0) { toast.error("Please add at least one line item from a GRN"); return; }

        // 3-Way Matching Validation
        const mismatches = items.filter(i => i.totalQty > i.grnQty || i.ratePerQty > i.poRate);
        if (mismatches.length > 0) {
            toast.error(`3-Way Matching Failure: ${mismatches.length} items have quantity or rate mismatches against PO/GRN.`);
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                header: {
                    ...header,
                    productAmount: financials.prodAmt,
                    totalAdditionalCostAmount: financials.costAmt,
                    totalProductHdrAmount: financials.prodAmt,
                    totalVatAmount: financials.vatAmt,
                    finalAmount: financials.total,
                },
                items,
                additionalCosts,
                audit: { user: "Admin" }
            };

            if (editId) {
                await updateBooking(editId, payload);
                toast.success("Purchase Booking Updated");
            } else {
                await addBooking(payload);
                toast.success("Purchase Booking Recorded!");
            }
            navigate.push("/purchase-booking");
        } catch (e: any) {
            toast.error(e.message || "Failed to save booking");
        } finally {
            setSubmitting(false);
        }
    };

    // Load Edit Data
    useEffect(() => {
        if (!editId) return;
        const load = async () => {
            setIsFetchingData(true);
            const res = await getBookingById(editId);
            if (!res) {
                setIsFetchingData(false);
                return;
            }
            const h = res.header || res;
            setHeader({
                purchaseInvoiceRefNo: h.PURCHASE_INVOICE_REF_NO || h.purchaseInvoiceRefNo,
                invoiceNo: h.INVOICE_NO || h.invoiceNo,
                invoiceDate: h.INVOICE_DATE ? new Date(h.INVOICE_DATE).toISOString().split('T')[0] : today,
                companyId: String(h.COMPANY_ID || h.companyId || ""),
                poRefNo: h.PO_REF_NO || h.poRefNo,
                purchaseType: h.PURCHASE_TYPE || h.purchaseType || "Local",
                supplierId: String(h.SUPPLIER_ID || h.supplierId || ""),
                storeId: String(h.STORE_ID || h.storeId || ""),
                paymentTermId: String(h.PAYMENT_TERM_ID || h.paymentTermId || ""),
                modeOfPayment: h.MODE_OF_PAYMENT || h.modeOfPayment || "Credit",
                currencyId: String(h.CURRENCY_ID || h.currencyId || "1"),
                priceTerms: h.PRICE_TERMS || h.priceTerms || "",
                exchangeRate: Number(h.EXCHANGE_RATE || h.exchangeRate || 1),
                remarks: h.REMARKS || h.remarks || "",
                status: h.STATUS_ENTRY || h.status || "Draft",
                response1Status: h.RESPONSE_1_STATUS || "Pending",
                response2Status: h.RESPONSE_2_STATUS || "Pending",
                finalResponseStatus: h.FINAL_RESPONSE_STATUS || "Pending"
            });
            if (res.items) setItems(res.items.map((i: any, idx: number) => ({ ...i, id: idx, productId: i.PRODUCT_ID, productName: i.productName || "Product", qtyPerPacking: Number(i.QTY_PER_PACKING || 0), totalQty: Number(i.TOTAL_QTY || 0), uom: i.UOM || "KG", ratePerQty: Number(i.RATE_PER_QTY || 0), productAmount: Number(i.PRODUCT_AMOUNT || 0), discountPercentage: Number(i.DISCOUNT_PERCENTAGE || 0), discountAmount: Number(i.DISCOUNT_AMOUNT || 0), totalProductAmount: Number(i.TOTAL_PRODUCT_AMOUNT || 0), vatPercentage: Number(i.VAT_PERCENTAGE || 0), vatAmount: Number(i.VAT_AMOUNT || 0), finalProductAmount: Number(i.FINAL_PRODUCT_AMOUNT || 0), grnRefNo: i.GRN_REF_NO })));
            if (res.additionalCosts) setAdditionalCosts(res.additionalCosts.map((c: any, idx: number) => ({ id: idx, typeId: String(c.ADDITIONAL_COST_TYPE_ID), amount: Number(c.ADDITIONAL_COST_AMOUNT), remarks: c.REMARKS })));
            const files = await getFiles(editId);
            setExistingFiles(files);
            setIsFetchingData(false);
        };
        load();
    }, [editId, today]);

    if (isFetchingData) {
        return (
            <div className="max-w-7xl mx-auto pb-20 px-4 sm:px-6 pt-6 space-y-8">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-10 w-10 rounded-xl" />
                        <div>
                            <Skeleton className="h-8 w-64 mb-2" />
                            <Skeleton className="h-5 w-32" />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Skeleton className="h-12 w-24 rounded-xl" />
                        <Skeleton className="h-12 w-40 rounded-xl" />
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <main className="lg:col-span-8 space-y-6">
                        <Skeleton className="h-16 w-full rounded-2xl" />
                        <div className="bg-white rounded-[32px] border p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t">
                                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                            </div>
                        </div>
                    </main>
                    <aside className="lg:col-span-4 sticky top-6">
                        <Skeleton className="h-96 w-full rounded-[40px]" />
                    </aside>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto pb-20 px-4 sm:px-6 pt-6">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate.push("/purchase-booking")} className="p-2 rounded-xl border hover:bg-slate-50 transition-colors">
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                            {editId ? "Update Booking" : "New Purchase Booking"}
                        </h1>
                        <Badge variant="outline" className="mt-1 font-mono">{header.purchaseInvoiceRefNo}</Badge>
                    </div>
                </div>
                <div className="flex gap-3">
                     <Button variant="outline" onClick={() => navigate.push("/purchase-booking")} className="rounded-xl border-slate-200">Cancel</Button>
                     <Button onClick={handleSave} disabled={submitting} className="bg-[#10B981] hover:bg-[#059669] text-white font-bold rounded-xl px-8 h-12 shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98]">
                        {submitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                        {editId ? "Save Changes" : "Confirm Booking"}
                     </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <main className="lg:col-span-8 space-y-6">
                    <Tabs defaultValue="header" className="w-full">
                        <TabsList className="bg-slate-100 p-1 rounded-2xl mb-6">
                            <TabsTrigger value="header" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">Header Details</TabsTrigger>
                            <TabsTrigger value="items" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">Products / GRN</TabsTrigger>
                            <TabsTrigger value="costs" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">Additional Costs</TabsTrigger>
                            <TabsTrigger value="files" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">Documents</TabsTrigger>
                            <TabsTrigger value="audit" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm text-[10px] tracking-tighter">Approval Audit</TabsTrigger>
                        </TabsList>

                        <TabsContent value="header" className="mt-0">
                            <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Supplier Invoice No *</Label>
                                        <Input placeholder="Enter Invoice Number" value={header.invoiceNo} onChange={(e) => setHeader({...header, invoiceNo: e.target.value})} className="h-12 rounded-2xl bg-slate-50/50 border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Invoice Date</Label>
                                        <Input type="date" value={header.invoiceDate} onChange={(e) => setHeader({...header, invoiceDate: e.target.value})} className="h-12 rounded-2xl bg-slate-50/50" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Company</Label>
                                        {companiesLoading ? (
                                            <Skeleton className="h-12 w-full rounded-2xl" />
                                        ) : (
                                            <Select value={String(header.companyId)} onValueChange={(v) => setHeader({...header, companyId: v})}>
                                                <SelectTrigger className="h-12 rounded-2xl bg-slate-50/50"><SelectValue placeholder="Select Company" /></SelectTrigger>
                                                <SelectContent>{companies.map((c: any) => <SelectItem key={c.id} value={String(c.companyId)}>{c.companyName} (@{c.categoryName})</SelectItem>)}</SelectContent>
                                            </Select>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">PO Reference</Label>
                                        <Select disabled={items.length > 0} value={header.poRefNo} onValueChange={(v) => {
                                            const po = approvedPOs.find((p: any) => (p.header?.poRefNo || p.poRefNo || p.PO_REF_NO) === v);
                                            const h = po?.header || po;
                                            setHeader({...header, poRefNo: v, supplierId: h?.supplierId || h?.SUPPLIER_ID || "", storeId: h?.storeId || h?.STORE_ID || "", currencyId: h?.currencyId || h?.CURRENCY_ID || "1", exchangeRate: Number(h?.exchangeRate || h?.EXCHANGE_RATE || 1)});
                                        }}>
                                            <SelectTrigger className="h-12 rounded-2xl bg-slate-50/50"><SelectValue placeholder="Select source PO" /></SelectTrigger>
                                            <SelectContent>{approvedPOs.map((p: any) => <SelectItem key={p.PO_REF_NO || p.poRefNo || p.id} value={p.header?.poRefNo || p.poRefNo || p.PO_REF_NO}>{p.header?.poRefNo || p.poRefNo || p.PO_REF_NO}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
                                     <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase text-slate-400">Supplier</Label>
                                        {suppliersLoading ? (
                                            <Skeleton className="h-12 w-full rounded-2xl" />
                                        ) : (
                                            <Input value={suppliers.find((s:any) => (s.id || s.Supplier_Id) == header.supplierId)?.supplierName || ""} disabled className="h-12 rounded-2xl bg-slate-100/50" placeholder="Auto-filled" />
                                        )}
                                     </div>
                                     <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase text-slate-400">Payment Mode</Label>
                                        <Select value={header.modeOfPayment} onValueChange={(v) => setHeader({...header, modeOfPayment: v})}>
                                            <SelectTrigger className="h-12 rounded-2xl"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Credit">Credit</SelectItem>
                                                <SelectItem value="Cash">Cash / Immediate</SelectItem>
                                                <SelectItem value="MobileMoney">Mobile Money</SelectItem>
                                            </SelectContent>
                                        </Select>
                                     </div>
                                     <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase text-slate-400">Currency / Ex-Rate</Label>
                                        <div className="flex gap-2">
                                            <Select value={String(header.currencyId)} onValueChange={(v) => setHeader({...header, currencyId: v})}>
                                                <SelectTrigger className="h-12 rounded-2xl flex-1"><SelectValue placeholder="Currency" /></SelectTrigger>
                                                <SelectContent>{currencies.map((c: any) => <SelectItem key={c.id} value={String(c.id)}>{c.currencyIsoCode || c.currencyCode || c.currencyName || "Currency"}</SelectItem>)}</SelectContent>
                                            </Select>
                                            <Input type="number" value={header.exchangeRate} onChange={(e) => setHeader({...header, exchangeRate: Number(e.target.value)})} className="h-12 w-20 rounded-2xl text-center" />
                                        </div>
                                     </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="items">
                            <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
                                <div className="p-6 bg-slate-50 border-b flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Select onValueChange={async (grnRef) => {
                                            const fullGrn = await getGRNById(grnRef);
                                            if (!fullGrn || !fullGrn.items) {
                                                toast.error("Could not fetch GRN items");
                                                return;
                                            }
                                            
                                            let poItems: any[] = [];
                                            if (header.poRefNo) {
                                                const fullPo = await getPOById(header.poRefNo);
                                                poItems = fullPo?.items || [];
                                            }
                                            
                                            const newITs = (fullGrn.items || []).map((i: any, dx: number) => {
                                                const poItem = poItems.find((pi: any) => Number(pi.productId || pi.PRODUCT_ID) === Number(i.productId || i.PRODUCT_ID));
                                                const poItemRate = Number(poItem?.rate || poItem?.RATE_PER_QTY || 0);
                                                
                                                return {
                                                    id: Date.now() + dx,
                                                    grnRefNo: grnRef,
                                                    productId: i.PRODUCT_ID || i.productId,
                                                    productName: i.productName || i.PRODUCT_NAME || "Product",
                                                    mainCategoryId: i.MAIN_CATEGORY_ID || null,
                                                    subCategoryId: i.SUB_CATEGORY_ID || null,
                                                    qtyPerPacking: Number(i.QTY_PER_PACKING || 0),
                                                    totalQty: Number(i.TOTAL_QTY || i.totalQty || i.receivedQty || 0),
                                                    grnQty: Number(i.TOTAL_QTY || i.totalQty || i.receivedQty || 0),
                                                    uom: i.UOM || "KG",
                                                    totalPacking: 0,
                                                    alternateUom: "",
                                                    ratePerQty: Number(i.rate || i.RATE_PER_QTY || poItemRate),
                                                    poRate: poItemRate,
                                                    productAmount: 0, discountPercentage: 0, discountAmount: 0, totalProductAmount: 0, vatPercentage: Number(i.vatPercent || i.VAT_PERCENTAGE || 0), vatAmount: 0, finalProductAmount: 0, remarks: ""
                                                };
                                            });
                                            setItems(prev => {
                                                const filtered = newITs.filter((ni: any) => !prev.some(pi => pi.productId === ni.productId && pi.grnRefNo === ni.grnRefNo));
                                                return [...prev, ...filtered].map(it => {
                                                    const amt = it.totalQty * it.ratePerQty;
                                                    const vat = amt * (it.vatPercentage / 100);
                                                    return { ...it, productAmount: amt, totalProductAmount: amt, vatAmount: vat, finalProductAmount: amt + vat };
                                                });
                                            });
                                        }}>
                                            <SelectTrigger className="w-64 rounded-xl h-10 bg-white"><SelectValue placeholder="Import items from GRN" /></SelectTrigger>
                                            <SelectContent>
                                                {availableGRNs.map((g: any) => {
                                                    const val = g.GRN_REF_NO || g.grnRefNo || g.header?.GRN_REF_NO;
                                                    if (items.some((i: any) => i.grnRefNo === val)) return null;
                                                    return <SelectItem key={val} value={val}>{val}</SelectItem>;
                                                })}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Badge variant="secondary" className="rounded-lg">{items.length} lines imported</Badge>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-slate-50/80 border-b text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                                                <th className="p-4 text-left">GRN / Product</th>
                                                <th className="p-4 text-center">Qty / Packing</th>
                                                <th className="p-4 text-center">Rate / Item</th>
                                                <th className="p-4 text-center">Disc% / VAT%</th>
                                                <th className="p-4 text-right">Final Amount</th>
                                                <th className="p-4"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {items.map(item => {
                                                const hasQtyMismatch = item.totalQty > item.grnQty;
                                                const hasRateMismatch = item.ratePerQty > item.poRate;
                                                
                                                return (
                                                    <tr key={item.id} className={`group transition-all ${hasQtyMismatch || hasRateMismatch ? 'bg-red-50/40' : 'hover:bg-slate-50/50'}`}>
                                                        <td className="p-4">
                                                            <div className="flex flex-col gap-0.5">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="font-bold text-slate-900 text-sm tracking-tight">{item.productName}</div>
                                                                    {hasQtyMismatch && <Badge className="bg-orange-500 hover:bg-orange-600 text-[8px] h-4 rounded-md uppercase font-black">Qty Error</Badge>}
                                                                    {hasRateMismatch && <Badge className="bg-red-500 hover:bg-red-600 text-[8px] h-4 rounded-md uppercase font-black">Rate Error</Badge>}
                                                                </div>
                                                                <div className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-600/70 font-bold">
                                                                    <LinkIcon className="w-3 h-3" />
                                                                    {item.grnRefNo}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="flex flex-col items-center gap-1.5">
                                                                <div className="flex items-center gap-1">
                                                                    <Input 
                                                                        type="number" 
                                                                        value={item.totalQty} 
                                                                        onChange={(e) => updateItem(item.id, "totalQty", Number(e.target.value))} 
                                                                        className={`w-20 h-9 text-center rounded-xl font-bold bg-white shadow-sm border-slate-200 focus:ring-emerald-500/10 ${hasQtyMismatch ? 'border-red-500 ring-2 ring-red-500/10' : ''}`} 
                                                                    />
                                                                    <span className="text-[10px] font-bold text-slate-400">{item.uom}</span>
                                                                </div>
                                                                <div className={`text-[9px] font-bold uppercase tracking-tight ${hasQtyMismatch ? 'text-red-500' : 'text-slate-400'}`}>
                                                                    GRN Max: <span className="font-black underline">{item.grnQty}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="flex flex-col items-center gap-1.5">
                                                                <Input 
                                                                    type="number" 
                                                                    value={item.ratePerQty} 
                                                                    onChange={(e) => updateItem(item.id, "ratePerQty", Number(e.target.value))} 
                                                                    className={`w-24 h-9 text-center rounded-xl font-bold bg-white shadow-sm border-slate-200 focus:ring-emerald-500/10 ${hasRateMismatch ? 'border-red-500 ring-2 ring-red-500/10' : ''}`} 
                                                                />
                                                                <div className={`text-[9px] font-bold uppercase tracking-tight ${hasRateMismatch ? 'text-red-500' : 'text-slate-400'}`}>
                                                                    PO Rate: <span className="font-black underline">{item.poRate}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="flex items-center justify-center gap-2">
                                                                <div className="flex flex-col items-center gap-1">
                                                                    <Input type="number" value={item.discountPercentage} onChange={(e) => updateItem(item.id, "discountPercentage", Number(e.target.value))} className="w-16 h-9 text-center rounded-xl bg-slate-50/50" />
                                                                    <span className="text-[8px] font-black text-slate-400">DISC%</span>
                                                                </div>
                                                                <div className="flex flex-col items-center gap-1">
                                                                    <Input type="number" value={item.vatPercentage} onChange={(e) => updateItem(item.id, "vatPercentage", Number(e.target.value))} className="w-16 h-9 text-center rounded-xl bg-slate-50/50" />
                                                                    <span className="text-[8px] font-black text-slate-400">VAT%</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 text-right">
                                                            <div className="text-sm font-black tabular-nums text-slate-900">{item.finalProductAmount.toLocaleString()}</div>
                                                            <div className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Verified Total</div>
                                                        </td>
                                                        <td className="p-4 text-center">
                                                            <button onClick={() => setItems(items.filter(i => i.id !== item.id))} className="p-2.5 rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100">
                                                                <Trash2 className="w-4.5 h-4.5" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            {items.length === 0 && (
                                                <tr>
                                                    <td colSpan={6} className="p-24 text-center">
                                                        <div className="flex flex-col items-center gap-3">
                                                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 border border-slate-100 italic">...</div>
                                                            <p className="text-slate-400 font-bold text-sm">Waiting for inventory data...</p>
                                                            <p className="text-[10px] text-slate-300 uppercase font-black tracking-widest">Select a GRN from above to proceed</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="costs">
                             <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-lg font-bold text-slate-800">Additional Charges / Landed Costs</h2>
                                    <Button variant="outline" size="sm" onClick={() => setAdditionalCosts([...additionalCosts, { id: Date.now(), typeId: "", amount: 0, remarks: "" }])} className="rounded-xl border-emerald-100 text-emerald-600 hover:bg-emerald-50"><Plus className="w-4 h-4 mr-2" /> Add Charge</Button>
                                </div>
                                 <div className="space-y-4">
                                    {additionalCosts.map(cost => (
                                        <div key={cost.id} className="flex gap-4 items-end bg-slate-50/50 p-4 rounded-2xl border border-slate-100 group transition-all hover:border-emerald-200">
                                            <div className="flex-1 space-y-1.5 text-center">
                                                <Label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Landed Cost Category</Label>
                                                <Select value={String(cost.typeId)} onValueChange={(v) => setAdditionalCosts(prev => prev.map(c => c.id === cost.id ? { ...c, typeId: v } : c))}>
                                                    <SelectTrigger className="h-11 rounded-xl bg-white shadow-sm border-slate-200">
                                                        <SelectValue placeholder="Select type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {costTypes.length === 0 && <div className="p-4 text-center text-xs text-slate-400">No cost categories found</div>}
                                                        {costTypes.map((ct: any) => (
                                                            <SelectItem key={ct.id} value={String(ct.id)}>
                                                                {ct.additionalCostTypeName || ct.costTypeName || ct.ADDITIONAL_COST_TYPE_NAME || `Type #${ct.id}`}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="w-48 space-y-1.5 text-center">
                                                <Label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Amount (TZS)</Label>
                                                <div className="relative">
                                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                                                    <Input 
                                                        type="number" 
                                                        value={cost.amount} 
                                                        onChange={(e) => setAdditionalCosts(prev => prev.map(c => c.id === cost.id ? { ...c, amount: Number(e.target.value) } : c))} 
                                                        className="h-11 rounded-xl bg-white pl-8 font-bold text-slate-900 border-slate-200 shadow-sm"
                                                    />
                                                </div>
                                            </div>
                                            <Button 
                                                variant="ghost" 
                                                onClick={() => setAdditionalCosts(additionalCosts.filter(c => c.id !== cost.id))} 
                                                className="text-slate-300 hover:text-red-500 hover:bg-red-50 h-11 w-11 p-0 rounded-xl transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    {additionalCosts.length === 0 && (
                                        <div className="text-center py-10 border-2 border-dashed rounded-[32px] border-slate-100">
                                            <p className="text-slate-400 text-sm font-medium">No additional costs added for this booking.</p>
                                        </div>
                                    )}
                                </div>
                             </div>
                        </TabsContent>

                        <TabsContent value="files">
                             <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm text-center">
                                 <div className="max-w-md mx-auto py-10">
                                     <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100"><FileUp className="w-8 h-8 text-emerald-500" /></div>
                                     <h3 className="text-lg font-bold text-slate-800 mb-2">Invoice Documentation</h3>
                                     <p className="text-sm text-slate-400 mb-8 px-10">Upload scanned copies of the supplier invoice, tax slips, or transport documents for audit compliance.</p>
                                     <div className="relative group">
                                         <Input type="file" onChange={handleFileUpload} className="hidden" id="file-up" />
                                         <Label htmlFor="file-up" className="inline-flex cursor-pointer items-center px-8 py-3 bg-[#10B981] text-white rounded-2xl font-bold shadow-lg shadow-emerald-500/20 hover:bg-[#059669] transition-all active:scale-95">
                                             {uploading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Upload className="w-5 h-5 mr-2" />}
                                             Upload Document
                                         </Label>
                                     </div>
                                 </div>
                                 {existingFiles.length > 0 && (
                                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
                                         {existingFiles.map(f => (
                                             <div key={f.id || f.fileName} className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between text-left group hover:border-emerald-300 transition-colors shadow-sm">
                                                 <div className="flex items-center gap-3 overflow-hidden">
                                                     <div className="p-2 bg-emerald-50 rounded-lg"><FileText className="w-5 h-5 text-emerald-600" /></div>
                                                     <div className="overflow-hidden"><div className="font-bold text-slate-800 text-xs truncate">{f.fileName}</div><div className="text-[10px] text-slate-400">{f.documentType}</div></div>
                                                 </div>
                                                 <Download className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 cursor-pointer" />
                                             </div>
                                         ))}
                                     </div>
                                 )}
                             </div>
                        </TabsContent>

                        <TabsContent value="audit">
                            <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
                                <h2 className="text-lg font-bold mb-6">Workflow Approval Status</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="p-6 rounded-[24px] bg-slate-50 border border-slate-100 flex flex-col items-center gap-3 text-center">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Response 1</div>
                                        <Badge variant="outline" className={`${header.response1Status === "Approved" ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"} border-none px-4 py-1 rounded-full font-bold`}>{header.response1Status}</Badge>
                                        <div className="text-[10px] text-slate-400 mt-2 italic">Waiting for verification</div>
                                    </div>
                                    <div className="p-6 rounded-[24px] bg-slate-50 border border-slate-100 flex flex-col items-center gap-3 text-center opacity-60">
                                         <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Response 2</div>
                                         <Badge variant="outline" className="bg-slate-200 text-slate-500 border-none px-4 py-1 rounded-full font-bold">{header.response2Status}</Badge>
                                         <div className="text-[10px] text-slate-400 mt-2 italic">Awaiting Response 1</div>
                                    </div>
                                    <div className="p-6 rounded-[24px] bg-slate-50 border border-slate-100 flex flex-col items-center gap-3 text-center opacity-60">
                                         <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Final Decision</div>
                                         <Badge variant="outline" className="bg-slate-200 text-slate-500 border-none px-4 py-1 rounded-full font-bold">{header.finalResponseStatus}</Badge>
                                         <div className="text-[10px] text-slate-400 mt-2 italic">Last Stage</div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </main>

                <aside className="lg:col-span-4 sticky top-6">
                    <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full -mr-10 -mt-10"></div>
                        <div className="relative">
                            <h2 className="text-xs font-black uppercase tracking-[.25em] text-emerald-400/80 mb-8 flex items-center gap-2">
                                <DollarSign className="w-4 h-4" /> Grand Total
                            </h2>
                            <div className="space-y-6">
                                <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                    <span className="text-sm font-medium text-slate-400">Subtotal Product</span>
                                    <span className="text-xl font-bold tabular-nums">{financials.prodAmt.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                    <span className="text-sm font-medium text-slate-400">Total VAT</span>
                                    <span className="text-xl font-bold tabular-nums text-emerald-400">{financials.vatAmt.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                    <span className="text-sm font-medium text-slate-400">Additional Cost</span>
                                    <span className="text-xl font-bold tabular-nums text-orange-400">{financials.costAmt.toLocaleString()}</span>
                                </div>
                                <div className="pt-4">
                                    <div className="text-[10px] uppercase font-black text-slate-500 tracking-widest mb-1.5">Net Payable ({currencies.find((c: any) => String(c.id) === String(header.currencyId))?.currencyIsoCode || "TZS"})</div>
                                    <div className="text-5xl font-black text-white leading-tight">{financials.total.toLocaleString()}</div>
                                    {header.exchangeRate > 1 && (
                                        <div className="text-xs text-emerald-400/60 font-medium mt-2 bg-emerald-500/5 px-3 py-1.5 rounded-lg border border-emerald-500/10 inline-block font-mono">LC EQUIV: {financials.totalLC.toLocaleString()} TZS</div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-12 space-y-4">
                                <div className="bg-white/5 rounded-3xl p-5 border border-white/10 group focus-within:border-emerald-500/30 transition-all">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">Internal Remarks</Label>
                                    <textarea 
                                        className="bg-transparent border-none w-full text-sm resize-none focus:ring-0 placeholder:text-white/10 h-24 font-medium"
                                        placeholder="Add any accounting notes..."
                                        value={header.remarks}
                                        onChange={(e) => setHeader({...header, remarks: e.target.value})}
                                    />
                                </div>
                                <Button onClick={handleSave} disabled={submitting} className="w-full h-14 bg-emerald-500 hover:bg-emerald-400 text-white rounded-[24px] font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-600/20 active:scale-95 transition-all">
                                    {submitting ? "Processing..." : editId ? "Update Record" : "Post to Accounts"}
                                </Button>
                                <p className="text-[9px] text-center text-slate-500 mt-4 leading-relaxed tracking-wide">By posting this booking, generic accounting entries will be generated for the GL modules.</p>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default function CreatePurchaseBookingPage() {
    return (
        <Suspense fallback={<div className="h-screen flex items-center justify-center bg-slate-50 flex-col gap-4 text-slate-400 font-medium animate-pulse"><Loader2 className="w-8 h-8 animate-spin" /> Initializing Procurement System...</div>}>
            <CreatePurchaseBookingContent />
        </Suspense>
    );
}