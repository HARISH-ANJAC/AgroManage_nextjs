"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import {
  Plus,
  Save,
  Send,
  Trash2,
  CheckCircle2,
  ArrowLeft,
  Calendar,
  User,
  MapPin,
  BadgeDollarSign,
  Briefcase,
  FileText,
  Upload,
  Info,
  X
} from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense, useEffect, useState, useMemo, JSX } from 'react';
import { toast } from "sonner";
import {
  useCompanies,
  useCustomers,
  useStores,
  useSalesPersons,
  useCurrencies,
  usePaymentTerms,
  useProducts,
  useUoms,
  useBillingLocations,
} from "@/hooks/useStoreData";
import { useSalesOrderStore } from "@/hooks/useSalesOrderStore";
import { useSalesProformaStore } from "@/hooks/useSalesProformaStore";
import { SupportingDoc } from "@/components/ui/Supporting-Doc";
import { usePurchaseBookingStore } from "@/hooks/usePurchaseBookingStore";

interface LineItem {
  id: string | number;
  productId: string | number;
  productName: string;
  mainCategoryId: number | null;
  subCategoryId: number | null;
  qtyPerPack: number;
  totalQty: number;
  uom: string;
  rate: number;
  discPercent: number;
  vatPercent: number;
  poRefNo: string;
  poDtlSno: number | null;
  amount: number;
}

function CreateSalesOrderContent(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const proformaRef = searchParams.get("proformaRef");
  const { addOrder, updateOrder, getOrderById } = useSalesOrderStore();
  const { getProformaById, proformas, isLoading: proformasLoading } = useSalesProformaStore();
  const today = new Date().toISOString().split("T")[0];

  // Master Data Hooks
  const { data: companies = [], isLoading: companiesLoading } = useCompanies();
  const { data: customers = [], isLoading: customersLoading } = useCustomers();
  const { data: stores = [], isLoading: storesLoading } = useStores();
  const { data: salesPersons = [], isLoading: salesPersonsLoading } = useSalesPersons();
  const { data: currencies = [], isLoading: currenciesLoading } = useCurrencies();
  const { data: paymentTerms = [], isLoading: paymentTermsLoading } = usePaymentTerms();
  const { data: productsData = [], isLoading: productsDataLoading } = useProducts();
  const { data: uoms = [], isLoading: uomsLoading } = useUoms();
  const { data: billingLocations = [], isLoading: billingLocationsLoading } = useBillingLocations();
  const { bookings: purchaseInvoices, isLoading: invoicesLoading } = usePurchaseBookingStore();

  const [header, setHeader] = useState({
    salesOrderDate: today,
    companyId: 0,
    customerId: 0,
    storeId: 0,
    billingLocationId: 0,
    salesPersonId: 0,
    currencyId: 0,
    paymentTermId: 0,
    exchangeRate: 1,
    creditLimitAmt: 0,
    creditLimitDays: 0,
    outstandingAmt: 0,
    status: "Draft",
    remarks: "",
    salesOrderRefNo: "",
    salesProformaRefNo: ""
  });

  const [items, setItems] = useState<LineItem[]>([
    { id: Date.now(), productId: "", productName: "", mainCategoryId: null, subCategoryId: null, qtyPerPack: 1, totalQty: 0, uom: "KG", rate: 0, discPercent: 0, vatPercent: 15, poRefNo: "", poDtlSno: null, amount: 0 },
  ]);

  const [files, setFiles] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Load existing data if editing
  useEffect(() => {
    const loadOrder = async () => {
      if (editId) {
        setIsFetchingData(true);
        const res = await getOrderById(editId);
        if (res && res.header) {
          const h = res.header;
          setHeader({
            salesOrderDate: h.salesOrderDate ? new Date(h.salesOrderDate).toISOString().split("T")[0] : today,
            companyId: h.companyId || 0,
            customerId: h.customerId || 0,
            storeId: h.storeId || 0,
            billingLocationId: h.billingLocationId || 0,
            salesPersonId: h.salesPersonId || 0,
            currencyId: h.currencyId || 0,
            paymentTermId: h.paymentTermId || 0,
            exchangeRate: Number(h.exchangeRate) || 1,
            creditLimitAmt: Number(h.creditLimitAmt) || 0,
            creditLimitDays: Number(h.creditLimitDays) || 0,
            outstandingAmt: Number(h.outstandingAmt) || 0,
            status: h.status || "Draft",
            remarks: h.remarks || "",
            salesOrderRefNo: h.salesOrderRefNo || "",
            salesProformaRefNo: h.salesProformaRefNo || ""
          });

          if (res.items) {
            setItems(res.items.map((it: any) => ({
              id: it.id,
              productId: it.productId,
              productName: it.productName || "",
              mainCategoryId: it.mainCategoryId,
              subCategoryId: it.subCategoryId,
              qtyPerPack: Number(it.qtyPerPacking) || 1,
              totalQty: Number(it.totalQty) || 0,
              uom: it.uom || "KG",
              rate: Number(it.rate) || 0,
              discPercent: 0,
              vatPercent: Number(it.vatPercent) || 0,
              poRefNo: it.poRefNo || "",
              poDtlSno: it.poDtlSno,
              amount: Number(it.amount) || 0
            })));
          }

          if (res.files) {
            setFiles(res.files);
          }
        }
        setIsFetchingData(false);
      } else if (proformaRef) {
        setIsFetchingData(true);
        const res = await getProformaById(proformaRef);
        if (res && res.header) {
          const h = res.header;
          setHeader({
            salesOrderDate: today,
            companyId: h.companyId || 0,
            customerId: h.customerId || 0,
            storeId: h.storeId || 0,
            billingLocationId: h.billingLocationId || 0,
            salesPersonId: h.salesPersonEmpId || 0,
            currencyId: h.currencyId || 0,
            paymentTermId: 0,
            exchangeRate: Number(h.exchangeRate) || 1,
            creditLimitAmt: 0,
            creditLimitDays: 0,
            outstandingAmt: 0,
            status: "Draft",
            remarks: h.remarks || "",
            salesOrderRefNo: "",
            salesProformaRefNo: h.salesProformaRefNo || proformaRef
          });

          if (res.items) {
            setItems(res.items.map((it: any) => ({
              id: it.id || Date.now() + Math.random(),
              productId: it.productId,
              productName: it.productName || "",
              mainCategoryId: it.mainCategoryId,
              subCategoryId: it.subCategoryId,
              qtyPerPack: Number(it.qtyPerPacking) || 1,
              totalQty: Number(it.totalQty) || 0,
              uom: it.uom || "KG",
              rate: Number(it.salesRatePerQty) || 0,
              discPercent: 0,
              vatPercent: Number(it.vatPercentage) || 0,
              poRefNo: it.poRefNo || "",
              poDtlSno: it.poDtlSno,
              amount: Number(it.totalProductAmount) || 0
            })));
          }

          if (res.files) {
            setFiles(res.files);
          }
        }
        setIsFetchingData(false);
      } else {
        // Set Defaults for new order
        if (companies.length && !header.companyId) {
          setHeader(prev => ({
            ...prev,
            companyId: prev.companyId || (companies[0]?.companyId || 0),
            storeId: prev.storeId || (stores[0]?.storeIdUserToRole || 0),
            currencyId: prev.currencyId || (currencies[0]?.id || 0),
            paymentTermId: prev.paymentTermId || (paymentTerms[0]?.id || 0),
            salesPersonId: prev.salesPersonId || (salesPersons[0]?.id || 0),
            billingLocationId: prev.billingLocationId || (billingLocations[0]?.id || 0)
          }));
        }
      }
    };
    loadOrder();
  }, [editId, companies, stores, currencies, salesPersons, billingLocations]);

  // Fetch Customer Details when customer changes
  useEffect(() => {
    if (header.customerId) {
      const cust = customers.find((c: any) => Number(c.id) === Number(header.customerId));
      if (cust) {
        setHeader(prev => ({
          ...prev,
          creditLimitAmt: Number(cust.creditLimit) || 0,
          creditLimitDays: Number(cust.creditDays) || 0,
          outstandingAmt: Number(cust.outstandingBalance) || 0
        }));
      }
    }
  }, [header.customerId, customers]);

  const handleProformaSelect = async (proformaRefNo: string) => {
    if (!proformaRefNo || proformaRefNo === "none") {
      setHeader(prev => ({ ...prev, salesProformaRefNo: "" }));
      return;
    }
    
    setIsFetchingData(true);
    try {
      const res = await getProformaById(proformaRefNo);
      if (res && res.header) {
        const h = res.header;
        setHeader(prev => ({
          ...prev,
          salesProformaRefNo: h.salesProformaRefNo || proformaRefNo,
          companyId: h.companyId || prev.companyId,
          customerId: h.customerId || prev.customerId,
          storeId: h.storeId || prev.storeId,
          billingLocationId: h.billingLocationId || prev.billingLocationId,
          salesPersonId: h.salesPersonEmpId || prev.salesPersonId,
          currencyId: h.currencyId || prev.currencyId,
          exchangeRate: Number(h.exchangeRate) || prev.exchangeRate,
          remarks: h.remarks || prev.remarks
        }));

        if (res.items) {
          setItems(res.items.map((it: any) => ({
            id: it.id || Date.now() + Math.random(),
            productId: it.productId,
            productName: it.productName || "",
            mainCategoryId: it.mainCategoryId,
            subCategoryId: it.subCategoryId,
            qtyPerPack: Number(it.qtyPerPacking) || 1,
            totalQty: Number(it.totalQty) || 0,
            uom: it.uom || "KG",
            rate: Number(it.salesRatePerQty) || 0,
            discPercent: 0,
            vatPercent: Number(it.vatPercentage) || 0,
            poRefNo: it.poRefNo || "",
            poDtlSno: it.poDtlSno,
            amount: Number(it.totalProductAmount) || 0
          })));
        }
      }
    } catch (e) {
      toast.error("Failed to load Proforma details");
    } finally {
      setIsFetchingData(false);
    }
  };

  const removeItem = (id: string | number) => setItems(items.filter(i => i.id !== id));

  const addItem = () => {
    setItems([...items, { id: Date.now(), productId: "", productName: "", mainCategoryId: null, subCategoryId: null, qtyPerPack: 1, totalQty: 0, uom: "KG", rate: 0, discPercent: 0, vatPercent: 15, poRefNo: "", poDtlSno: null, amount: 0 }]);
  };

  const updateItem = (id: string | number, field: string, value: any) => {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const updated = { ...item, [field]: value };

      if (field === "productName") {
        const p = productsData.find((pr: any) => pr.productName === value);
        if (p) {
          updated.productId = p.id;
          updated.uom = p.uom || "KG";
          updated.qtyPerPack = Number(p.qtyPerPacking) || 1;
          updated.mainCategoryId = p.mainCategoryId;
          updated.subCategoryId = p.subCategoryId;
        }
      }

      updated.amount = updated.totalQty * updated.rate;
      return updated;
    }));
  };

  const selectedCurrency = useMemo(() => {
    const curr = currencies.find((c: any) => Number(c.id) === Number(header.currencyId));
    return curr?.currencyCode || curr?.currencyName || "TZS";
  }, [header.currencyId, currencies]);

  const subtotal = useMemo(() => items.reduce((acc, item) => acc + item.amount, 0), [items]);
  const totalVat = useMemo(() => items.reduce((acc, item) => acc + (item.amount * (item.vatPercent / 100)), 0), [items]);
  const grandTotal = subtotal + totalVat;

  const handleSubmit = async (status: string = "Pending") => {
    if (!header.salesOrderDate || !header.customerId || !header.companyId || !header.storeId || !header.salesProformaRefNo) {
      toast.error("Please fill all required fields (Date, Company, Customer, Store, Proforma)");
      return;
    }

    const userInfo = JSON.parse(localStorage.getItem('user') || '{"loginName": "admin"}');

    const payload = {
      header: {
        ...header,
        status,
        productAmount: subtotal,
        totalVatAmount: totalVat,
        finalAmount: grandTotal
      },
      items: items.filter(it => it.productId).map(it => ({
        productId: it.productId,
        mainCategoryId: it.mainCategoryId,
        subCategoryId: it.subCategoryId,
        totalQty: it.totalQty,
        rate: it.rate,
        amount: it.amount,
        vatPercent: it.vatPercent,
        vatAmount: it.amount * (it.vatPercent / 100),
        finalAmount: it.amount + (it.amount * (it.vatPercent / 100)),
        poRefNo: it.poRefNo,
        poDtlSno: it.poDtlSno
      })),
      files: files.map(f => ({
        documentType: f.DOCUMENT_TYPE || f.documentType,
        descriptionDetails: f.DESCRIPTION_DETAILS || f.descriptionDetails,
        fileName: f.FILE_NAME || f.fileName,
        contentType: f.CONTENT_TYPE || f.contentType,
        contentData: f.CONTENT_DATA || f.contentData,
        remarks: f.REMARKS || f.remarks,
      })),
      audit: { user: userInfo.loginName }
    };

    setIsSaving(true);
    try {
      if (editId) {
        await updateOrder(editId, payload);
        toast.success(`Sales Order Updated Successfully!`);
      } else {
        await addOrder(payload);
        toast.success(`Sales Order Created Successfully!`);
      }
      router.push('/sales-orders');
    } catch (e) {
      console.error(e);
      toast.error("Failed to save Sales Order");
    } finally {
      setIsSaving(false);
    }
  };

  if (isFetchingData) {
    return (
      <div className="max-w-[1600px] mx-auto pb-20 px-4 pt-6 space-y-8">
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-10 w-64" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white rounded-3xl border p-8">
              <Skeleton className="h-8 w-48 mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
              </div>
            </div>
            <div className="bg-white rounded-3xl border p-8">
               <Skeleton className="h-8 w-48 mb-6" />
               {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-10 w-full mb-3" />)}
            </div>
          </div>
          <div className="space-y-8">
            <div className="bg-[#1A2E28] rounded-[32px] p-8 h-96">
                <Skeleton className="h-10 w-48 mb-8 bg-white/20" />
                <Skeleton className="h-6 w-full mb-4 bg-white/10" />
                <Skeleton className="h-6 w-full mb-4 bg-white/10" />
                <Skeleton className="h-14 w-full mt-10 bg-white/20" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto pb-20 px-4 pt-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()} className="rounded-full h-10 w-10 p-0"><ArrowLeft className="w-5 h-5" /></Button>
          <div>
            <h1 className="text-2xl font-bold">{editId ? `Sales Order: ${header.salesOrderRefNo}` : "Create Sales Order"}</h1>
            <Badge variant="outline" className="mt-1">{header.status}</Badge>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => handleSubmit("Draft")} disabled={isSaving}><Save className="w-4 h-4 mr-2" /> Save Draft</Button>
          <Button onClick={() => handleSubmit("Confirmed")} className="bg-[#1A2E28]" disabled={isSaving}><Send className="w-4 h-4 mr-2" /> Confirm & Send</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          {/* Header Card */}
          <div className="bg-white rounded-3xl border p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg">General Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label>Proforma Reference <span className="text-red-500">*</span></Label>
                {proformasLoading ? (
                  <Skeleton className="h-11 w-full rounded-xl" />
                ) : (
                  <div className="relative">
                    <FileText className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground z-10" />
                    <Select value={String(header.salesProformaRefNo || "")} onValueChange={handleProformaSelect}>
                      <SelectTrigger className="rounded-xl h-11 pl-9"><SelectValue placeholder="Select Proforma" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {proformas.map((p: any) => (
                          <SelectItem key={p.salesProformaRefNo || p.id} value={p.salesProformaRefNo}>
                            {p.salesProformaRefNo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label>Order Date <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                  <Input type="date" value={header.salesOrderDate} onChange={e => setHeader({ ...header, salesOrderDate: e.target.value })} className="rounded-xl h-11 pl-9" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Company</Label>
                {companiesLoading ? (
                  <Skeleton className="h-11 w-full rounded-xl" />
                ) : (
                  <Select value={header.companyId ? String(header.companyId) : undefined} onValueChange={v => setHeader({ ...header, companyId: Number(v) })}>
                    <SelectTrigger className="rounded-xl h-11 font-bold"><SelectValue placeholder="Select Company" /></SelectTrigger>
                    <SelectContent>{companies.map((c: any) => <SelectItem key={c.id} value={String(c.companyId)}>{c.companyName} (@{c.categoryName})</SelectItem>)}</SelectContent>
                  </Select>
                )}
              </div>
              <div className="space-y-2">
                <Label>Customer</Label>
                {customersLoading ? (
                  <Skeleton className="h-11 w-full rounded-xl" />
                ) : (
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground z-10" />
                    <Select value={header.customerId ? String(header.customerId) : undefined} onValueChange={v => setHeader({ ...header, customerId: Number(v) })}>
                      <SelectTrigger className="rounded-xl h-11 pl-9 font-bold text-slate-700 shadow-sm transition-all focus:ring-emerald-500"><SelectValue placeholder="Select Customer" /></SelectTrigger>
                      <SelectContent>{customers.map((c: any) => <SelectItem key={c.id} value={String(c.id)}>{c.CUSTOMER_NAME || c.customerName}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label>Store</Label>
                {storesLoading ? (
                  <Skeleton className="h-11 w-full rounded-xl" />
                ) : (
                  <Select value={header.storeId ? String(header.storeId) : undefined} onValueChange={v => setHeader({ ...header, storeId: Number(v) })}>
                    <SelectTrigger className="rounded-xl h-11"><SelectValue placeholder="Select Store" /></SelectTrigger>
                    <SelectContent>{stores.map((s: any) => <SelectItem key={s.id} value={String(s.storeIdUserToRole)}>{s.storeName} (@{s.userName})</SelectItem>)}</SelectContent>
                  </Select>
                )}
              </div>
              <div className="space-y-2">
                <Label>Billing Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground z-10" />
                  <Select value={header.billingLocationId ? String(header.billingLocationId) : undefined} onValueChange={v => setHeader({ ...header, billingLocationId: Number(v) })}>
                    <SelectTrigger className="rounded-xl h-11 pl-9"><SelectValue placeholder="Select Location" /></SelectTrigger>
                    <SelectContent>{billingLocations.map((l: any) => <SelectItem key={l.id} value={String(l.id)}>{l.billingLocationName || l.locationName}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Sales Person</Label>
                <Select value={header.salesPersonId ? String(header.salesPersonId) : undefined} onValueChange={v => setHeader({ ...header, salesPersonId: Number(v) })}>
                  <SelectTrigger className="rounded-xl h-11"><SelectValue placeholder="Select Sales Person" /></SelectTrigger>
                  <SelectContent>{salesPersons.map((p: any) => <SelectItem key={p.id} value={String(p.id)}>{p.salesPersonName}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select value={header.currencyId ? String(header.currencyId) : undefined} onValueChange={v => setHeader({ ...header, currencyId: Number(v) })}>
                  <SelectTrigger className="rounded-xl h-11"><SelectValue placeholder="Select Currency" /></SelectTrigger>
                  <SelectContent>{currencies.map((c: any) => <SelectItem key={c.id} value={String(c.id)}>{c.CURRENCY_NAME || c.currencyName}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Exchange Rate</Label>
                <Input type="number" value={header.exchangeRate} onChange={e => setHeader({ ...header, exchangeRate: Number(e.target.value) })} className="rounded-xl h-11 font-bold" />
              </div>
              <div className="space-y-2">
                <Label>Payment Term</Label>
                <Select value={header.paymentTermId ? String(header.paymentTermId) : undefined} onValueChange={v => setHeader({ ...header, paymentTermId: Number(v) })}>
                  <SelectTrigger className="rounded-xl h-11"><SelectValue placeholder="Select Term" /></SelectTrigger>
                  <SelectContent>{paymentTerms.map((pt: any) => <SelectItem key={pt.id} value={String(pt.id)}>{pt.paymentTermName}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-3">
                <Label>Remarks</Label>
                <Input value={header.remarks} onChange={e => setHeader({ ...header, remarks: e.target.value })} className="rounded-xl h-11" placeholder="Any special instructions or notes..." />
              </div>
            </div>

            {/* Credit Info Strip */}
            <div className="mt-8 p-6 bg-slate-900 rounded-2xl flex flex-wrap gap-8 justify-between text-white shadow-inner">
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Credit Limit</p>
                <p className="text-lg font-bold">{selectedCurrency} {header.creditLimitAmt.toLocaleString()}</p>
              </div>
              <div className="space-y-1 text-center">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Credit Days</p>
                <p className="text-lg font-bold">{header.creditLimitDays} Days</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Outstanding</p>
                <p className={`text-lg font-bold ${header.outstandingAmt > header.creditLimitAmt ? 'text-red-400' : 'text-emerald-400'}`}>
                  {selectedCurrency} {header.outstandingAmt.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Items Card */}
          <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Product Allocation</h3>
              <Button variant="outline" size="sm" onClick={addItem}><Plus className="w-4 h-4 mr-1" /> Add Product</Button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b">
                  <th className="p-4 text-left font-bold text-xs uppercase text-muted-foreground">Product</th>
                  <th className="p-4 text-center font-bold text-xs uppercase text-muted-foreground whitespace-nowrap">PO Link</th>
                  <th className="p-4 text-center font-bold text-xs uppercase text-muted-foreground whitespace-nowrap">Qty</th>
                  <th className="p-4 text-center font-bold text-xs uppercase text-muted-foreground">UOM</th>
                  <th className="p-4 text-center font-bold text-xs uppercase text-muted-foreground">Rate</th>
                  <th className="p-4 text-center font-bold text-xs uppercase text-muted-foreground whitespace-nowrap">VAT %</th>
                  <th className="p-4 text-right font-bold text-xs uppercase text-muted-foreground whitespace-nowrap">Final Amt</th>
                  <th className="p-4 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="p-4 min-w-[280px]">
                      <div className="flex items-center gap-3">
                        {(() => {
                          const selectedProd = productsData.find((p: any) => p.productName === item.productName);
                          const imgData = selectedProd?.contentData;
                          return imgData ? (
                            <img src={imgData} alt="Product" className="w-8 h-8 rounded shrink-0 object-cover border border-slate-200 shadow-sm cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all" onClick={() => setPreviewImage(imgData)} title="Click to view" />
                          ) : (
                            <div className="w-8 h-8 rounded shrink-0 bg-slate-50 flex items-center justify-center border border-slate-200 text-[10px] text-slate-400 shadow-sm uppercase font-bold text-center leading-none">Img</div>
                          );
                        })()}
                        <div className="flex-1">
                          <Select value={item.productName} onValueChange={v => updateItem(item.id, "productName", v)}>
                            <SelectTrigger className="w-full border-none shadow-none focus:ring-0 font-bold text-slate-700"><SelectValue placeholder="Select Product" /></SelectTrigger>
                            <SelectContent>{productsData.map((p: any) => <SelectItem key={p.id} value={p.productName}>{p.productName}</SelectItem>)}</SelectContent>
                          </Select>
                          {item.mainCategoryId && <p className="text-[10px] text-slate-400 px-3 uppercase font-bold tracking-tighter">ID: {item.productId} | Cat: {item.mainCategoryId}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Select value={item.poRefNo || ""} onValueChange={v => updateItem(item.id, 'poRefNo', v === "none" ? "" : v)}>
                        <SelectTrigger className="w-24 mx-auto text-center border-dashed font-bold text-xs h-9 shadow-sm">
                          <SelectValue placeholder="Link PO..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {purchaseInvoices?.map((inv: any) => (
                            <SelectItem key={inv.PURCHASE_INVOICE_REF_NO || inv.id} value={inv.PURCHASE_INVOICE_REF_NO || String(inv.id)}>
                              {inv.PURCHASE_INVOICE_REF_NO || String(inv.id)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-4">
                      <Input
                        type="number"
                        value={item.totalQty}
                        onChange={e => updateItem(item.id, "totalQty", Number(e.target.value))}
                        className="w-20 mx-auto text-center font-black border-none"
                      />
                    </td>
                    <td className="p-4">
                      <Select value={item.uom} onValueChange={v => updateItem(item.id, "uom", v)}>
                        <SelectTrigger className="w-20 mx-auto border-none shadow-none focus:ring-0 text-center font-bold text-slate-500 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>{uoms.map((u: any) => <SelectItem key={u.id} value={u.UNIT_NAME || u.unitName}>{u.UNIT_NAME || u.unitName}</SelectItem>)}</SelectContent>
                      </Select>
                    </td>
                    <td className="p-4">
                      <Input
                        type="number"
                        value={item.rate}
                        onChange={e => updateItem(item.id, "rate", Number(e.target.value))}
                        className="w-24 mx-auto text-center font-black border-none"
                      />
                    </td>
                    <td className="p-4">
                      <Input
                        type="number"
                        value={item.vatPercent}
                        onChange={e => updateItem(item.id, "vatPercent", Number(e.target.value))}
                        className="w-16 mx-auto text-center font-bold text-slate-500 border-none"
                      />
                    </td>
                    <td className="p-4 text-right font-black text-slate-900 tabular-nums">
                      {selectedCurrency} {item.amount.toLocaleString()}
                    </td>
                    <td className="p-4 text-center">
                      <button onClick={() => removeItem(item.id)} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 p-2"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Supporting Documents Section */}
          {/* <SupportingDoc 
            files={files} 
            onFilesChange={setFiles} 
          /> */}
        </div>

        {/* Financial Sidebar */}
        <div className="space-y-8">
          <div className="bg-[#1A2E28] rounded-[32px] p-8 text-white shadow-xl lg:sticky lg:top-8 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>

            <div className="flex items-center gap-3 mb-8 relative">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <BadgeDollarSign className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold">Order Financials</h3>
            </div>

            <div className="space-y-4 relative opacity-80 text-sm">
              <div className="flex justify-between">
                <span className="font-bold uppercase text-[10px] tracking-widest text-white/50">Subtotal</span>
                <span className="font-mono text-lg">{selectedCurrency} {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold uppercase text-[10px] tracking-widest text-white/50">VAT ({items[0]?.vatPercent}%)</span>
                <span className="font-mono text-lg">{selectedCurrency} {totalVat.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-white/10 relative">
              <p className="text-[10px] uppercase font-black tracking-[0.2em] text-white/30 mb-2">Grand Total</p>
              <p className="text-5xl font-black tracking-tighter tabular-nums mb-1">{grandTotal.toLocaleString()}</p>
              <p className="text-[10px] text-white/40 font-medium italic">Amount in {selectedCurrency}</p>

              <Button onClick={() => handleSubmit("Confirmed")} disabled={isSaving} className="w-full mt-10 h-14 bg-emerald-500 hover:bg-emerald-600 rounded-2xl font-black text-lg shadow-xl transition-all active:scale-95">
                {editId ? "Update Order" : "Confirm & Send"}
              </Button>
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

export default function CreateSalesOrder() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-12 min-h-screen text-muted-foreground animate-pulse">Loading Sales Order Form...</div>}>
      <CreateSalesOrderContent />
    </Suspense>
  );
}
