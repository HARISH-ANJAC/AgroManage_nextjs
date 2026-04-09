"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import {
  Plus, Save, Send, Trash2, ArrowLeft, Calendar, User,
  MapPin, BadgeDollarSign, Briefcase, FileText, X, ArrowRight
} from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense, useEffect, useState, useMemo, JSX } from 'react';
import { toast } from "sonner";
import {
  useCompanies, useCustomers, useStores, useSalesPersons,
  useCurrencies, useProducts, useUoms, useBillingLocations
} from "@/hooks/useStoreData";
import { useSalesProformaStore } from "@/hooks/useSalesProformaStore";
import { usePurchaseBookingStore } from "@/hooks/usePurchaseBookingStore";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { SupportingDoc } from '@/components/ui/Supporting-Doc';

interface LineItem {
  id: string | number;
  productId: string | number;
  productName: string;
  mainCategoryId: number | null;
  subCategoryId: number | null;
  qtyPerPacking: number;
  totalQty: number;
  uom: string;
  alternateUom: string;
  salesRatePerQty: number;
  vatPercentage: number;
  storeStockPcs: number;
  poRefNo: string;
  poDtlSno: number | null;
  totalProductAmount: number;
  vatAmount: number;
  finalSalesAmount: number;
}

const emptyItem = (): LineItem => ({
  id: Date.now() + Math.random(),
  productId: "",
  productName: "",
  mainCategoryId: null,
  subCategoryId: null,
  qtyPerPacking: 1,
  totalQty: 0,
  uom: "KG",
  alternateUom: "",
  salesRatePerQty: 0,
  vatPercentage: 15,
  storeStockPcs: 0,
  poRefNo: "",
  poDtlSno: null,
  totalProductAmount: 0,
  vatAmount: 0,
  finalSalesAmount: 0,
});

function CreateProformaContent(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const today = new Date().toISOString().split("T")[0];

  const { addProforma, updateProforma, getProformaById } = useSalesProformaStore();

  // Master Data
  const { data: companies = [], isLoading: companiesLoading } = useCompanies();
  const { data: customers = [], isLoading: customersLoading } = useCustomers();
  const { data: stores = [], isLoading: storesLoading } = useStores();
  const { data: salesPersons = [], isLoading: salesPersonsLoading } = useSalesPersons();
  const { data: currencies = [], isLoading: currenciesLoading } = useCurrencies();
  const { data: productsData = [] } = useProducts();
  const { data: uoms = [] } = useUoms();
  const { data: billingLocations = [], isLoading: billingLocationsLoading } = useBillingLocations();
  const { bookings: purchaseInvoices, isLoading: invoicesLoading } = usePurchaseBookingStore();

  const [header, setHeader] = useState({
    salesProformaDate: today,
    companyId: 0,
    customerId: 0,
    storeId: 0,
    billingLocationId: 0,
    salesPersonEmpId: 0,
    currencyId: 0,
    exchangeRate: 1,
    status: "Draft",
    remarks: "",
    testDesc: "",
    salesProformaRefNo: "",
  });

  const [items, setItems] = useState<LineItem[]>([emptyItem()]);
  const [files, setFiles] = useState<any[]>([]);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Load for edit
  useEffect(() => {
    const load = async () => {
      if (editId) {
        setIsFetchingData(true);
        const res = await getProformaById(editId);
        if (res?.header) {
          const h = res.header;
          setHeader({
            salesProformaDate: h.salesProformaDate ? new Date(h.salesProformaDate).toISOString().split("T")[0] : today,
            companyId: h.companyId || 0,
            customerId: h.customerId || 0,
            storeId: h.storeId || 0,
            billingLocationId: h.billingLocationId || 0,
            salesPersonEmpId: h.salesPersonEmpId || 0,
            currencyId: h.currencyId || 0,
            exchangeRate: Number(h.exchangeRate) || 1,
            status: h.status || "Draft",
            remarks: h.remarks || "",
            testDesc: h.testDesc || "",
            salesProformaRefNo: h.salesProformaRefNo || "",
          });
          if (res.items) {
            setItems(res.items.map((it: any) => ({
              id: it.id,
              productId: it.productId,
              productName: it.productName || "",
              mainCategoryId: it.mainCategoryId,
              subCategoryId: it.subCategoryId,
              qtyPerPacking: Number(it.qtyPerPacking) || 1,
              totalQty: Number(it.totalQty) || 0,
              uom: it.uom || "KG",
              alternateUom: it.alternateUom || "",
              salesRatePerQty: Number(it.salesRatePerQty) || 0,
              vatPercentage: Number(it.vatPercentage) || 0,
              storeStockPcs: Number(it.storeStockPcs) || 0,
              poRefNo: it.poRefNo || "",
              poDtlSno: it.poDtlSno || null,
              totalProductAmount: Number(it.totalProductAmount) || 0,
              vatAmount: Number(it.vatAmount) || 0,
              finalSalesAmount: Number(it.finalSalesAmount) || 0,
            })));
          }
          if (res.files) setFiles(res.files);
        }
        setIsFetchingData(false);
      } else {
        if (companies.length && !header.companyId) {
          setHeader(prev => ({
            ...prev,
            companyId: prev.companyId || (companies[0]?.companyId || 0),
            storeId: prev.storeId || (stores[0]?.storeIdUserToRole || 0),
            currencyId: prev.currencyId || (currencies[0]?.id || 0),
            salesPersonEmpId: prev.salesPersonEmpId || (salesPersons[0]?.id || 0),
            billingLocationId: prev.billingLocationId || (billingLocations[0]?.id || 0),
          }));
        }
      }
    };
    load();
  }, [editId, companies, stores, currencies, salesPersons, billingLocations]);

  const recalcItem = (item: LineItem): LineItem => {
    const totalProductAmount = item.totalQty * item.salesRatePerQty;
    const vatAmount = totalProductAmount * (item.vatPercentage / 100);
    return { ...item, totalProductAmount, vatAmount, finalSalesAmount: totalProductAmount + vatAmount };
  };

  const updateItem = (id: string | number, field: string, value: any) => {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      let updated = { ...item, [field]: value };
      if (field === "productName") {
        const p = productsData.find((pr: any) => pr.productName === value);
        if (p) {
          updated.productId = p.id;
          updated.uom = p.uom || "KG";
          updated.alternateUom = p.alternateUom || "";
          updated.qtyPerPacking = Number(p.qtyPerPacking) || 1;
          updated.mainCategoryId = p.mainCategoryId;
          updated.subCategoryId = p.subCategoryId;
        }
      }
      return recalcItem(updated);
    }));
  };

  const removeItem = (id: string | number) => setItems(items.filter(i => i.id !== id));
  const addItem = () => setItems([...items, emptyItem()]);

  const selectedCurrency = useMemo(() => {
    const c = currencies.find((c: any) => Number(c.id) === Number(header.currencyId));
    return c?.currencyCode || c?.currencyName || "TZS";
  }, [header.currencyId, currencies]);

  const subtotal = useMemo(() => items.reduce((s, i) => s + i.totalProductAmount, 0), [items]);
  const totalVat = useMemo(() => items.reduce((s, i) => s + i.vatAmount, 0), [items]);
  const grandTotal = subtotal + totalVat;
  const exchangeRate = header.exchangeRate || 1;

  const handleSubmit = async (status: string = "Draft") => {
    if (!header.customerId || !header.companyId || !header.storeId) {
      toast.error("Please fill in Company, Store, and Customer fields");
      return;
    }
    const userInfo = JSON.parse(localStorage.getItem('user') || '{"loginName":"admin"}');
    const payload = {
      header: {
        ...header,
        status,
        totalProductAmount: subtotal,
        vatAmount: totalVat,
        finalSalesAmount: grandTotal,
      },
      items: items.filter(it => it.productId).map(it => ({
        productId: it.productId,
        mainCategoryId: it.mainCategoryId,
        subCategoryId: it.subCategoryId,
        salesRatePerQty: it.salesRatePerQty,
        qtyPerPacking: it.qtyPerPacking,
        totalQty: it.totalQty,
        uom: it.uom,
        alternateUom: it.alternateUom,
        totalProductAmount: it.totalProductAmount,
        vatPercentage: it.vatPercentage,
        vatAmount: it.vatAmount,
        finalSalesAmount: it.finalSalesAmount,
        storeStockPcs: it.storeStockPcs,
        poRefNo: it.poRefNo,
        poDtlSno: it.poDtlSno,
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
        await updateProforma(editId, payload);
        toast.success("Sales Proforma updated successfully!");
      } else {
        await addProforma(payload);
        toast.success("Sales Proforma created successfully!");
      }
      router.push('/sales-proformas');
    } catch {
      toast.error("Failed to save Sales Proforma");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!editId) return;
    try {
      toast.loading("Generating PDF...", { id: "pf-pdf" });
      const data = await getProformaById(editId);
      if (!data) throw new Error("Proforma data not found");

      const h = data.header || data;
      const items = data.items || [];
      const doc = new jsPDF();
      const currency = h.currencyName || "TZS";

      try {
        const logoImg = new Image();
        logoImg.src = "/assets/logo.png";
        await new Promise((resolve) => {
          logoImg.onload = resolve;
          logoImg.onerror = resolve; // Continue even if logo fails
        });

        if (logoImg.complete && logoImg.naturalWidth) {
          const imgWidth = 40;
          const imgHeight = (logoImg.naturalHeight * imgWidth) / logoImg.naturalWidth;
          doc.addImage(logoImg, "PNG", 14, 8, imgWidth, imgHeight);
        }
      } catch (e) {
        console.warn("Logo failed to load", e);
      }

      doc.setFontSize(22);
      doc.setTextColor(15, 23, 42);
      doc.text("SALES PROFORMA", 196, 22, { align: "right" });

      const dDate = h.salesProformaDate ? new Date(h.salesProformaDate) : new Date();
      const fmtDate = !isNaN(dDate.getTime()) ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(dDate) : h.salesProformaDate;

      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text(`Proforma Ref: ${h.salesProformaRefNo || h.SALES_PROFORMA_REF_NO || editId}`, 196, 30, { align: "right" });
      doc.text(`Date: ${fmtDate}`, 196, 35, { align: "right" });

      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text("Billing Details", 14, 55);

      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      doc.text(`Customer: ${h.customerName || h.CUSTOMER_NAME || "N/A"}`, 14, 62);
      doc.text(`Store: ${h.storeName || h.STORE_NAME || "-"}`, 14, 67);
      doc.text(`Currency: ${currency}`, 120, 67);

      const tableData = items.map((item: any, idx: number) => {
        const product = item.productName || item.PRODUCT_NAME || `Product #${item.productId || item.PRODUCT_ID}`;
        return [
          idx + 1,
          product,
          item.totalQty || item.TOTAL_QTY,
          item.uom || item.UOM,
          `${currency} ${Number(item.salesRatePerQty || item.SALES_RATE_PER_QTY).toLocaleString()}`,
          `${currency} ${Number(item.totalProductAmount || item.TOTAL_PRODUCT_AMOUNT).toLocaleString()}`,
          `${item.vatPercentage || item.VAT_PERCENTAGE}%`,
          `${currency} ${Number(item.vatAmount || item.VAT_AMOUNT).toLocaleString()}`
        ];
      });

      autoTable(doc, {
        startY: 80,
        head: [['#', 'Description', 'Qty', 'UOM', 'Rate', 'Amount', 'VAT%', 'VAT Total']],
        body: tableData,
        styles: { fontSize: 8, cellPadding: 3 },
        headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [248, 250, 252] },
      });

      const finalY = (doc as any).lastAutoTable.finalY + 10;
      const marginX = 130;

      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text("Subtotal:", marginX, finalY);
      doc.text("VAT Total:", marginX, finalY + 7);

      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text("Net Payable:", marginX, finalY + 16);

      const subtotal = Number(h.totalProductAmount || h.TOTAL_PRODUCT_AMOUNT || 0);

      doc.setFontSize(10);
      doc.text(`${currency} ${subtotal.toLocaleString()}`, 190, finalY, { align: 'right' });
      doc.text(`${currency} ${Number(h.vatAmount || h.VAT_AMOUNT || 0).toLocaleString()}`, 190, finalY + 7, { align: 'right' });

      doc.setFontSize(14);
      doc.setTextColor(16, 185, 129);
      doc.text(`${currency} ${Number(h.finalSalesAmount || h.FINAL_SALES_AMOUNT || 0).toLocaleString()}`, 190, finalY + 16, { align: 'right' });

      if (h.remarks || h.REMARKS) {
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text("Remarks:", 14, finalY + 30);
        doc.text(h.remarks || h.REMARKS, 14, finalY + 35, { maxWidth: 100 });
      }

      doc.save(`Proforma_${h.salesProformaRefNo || h.SALES_PROFORMA_REF_NO || editId}.pdf`);
      toast.success("PDF generated", { id: "pf-pdf" });
    } catch (e: any) {
      toast.error(e.message || "Failed to generate PDF", { id: "pf-pdf" });
    }
  };

  const handleConvertToSO = () => {
    if (!editId) return;
    router.push(`/sales-orders/create?proformaRef=${encodeURIComponent(editId)}`);
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
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-10 w-full mb-3" />)}
            </div>
          </div>
          <div>
            <div className="bg-[#1A2E28] rounded-[32px] p-8 h-96">
              <Skeleton className="h-10 w-48 mb-6 bg-white/20" />
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
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()} className="rounded-full h-10 w-10 p-0">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {editId ? `Proforma: ${header.salesProformaRefNo}` : "Create Sales Proforma"}
            </h1>
            <Badge variant="outline" className="mt-1">{header.status}</Badge>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          {editId && (
            <>
              <Button variant="outline" size="sm" onClick={handleDownloadPdf}>
                <FileText className="w-4 h-4 mr-1" /> PDF
              </Button>
              {header.status === "Confirmed" && (
                <Button
                  size="sm"
                  onClick={handleConvertToSO}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <ArrowRight className="w-4 h-4 mr-1" /> Convert to Sales Order
                </Button>
              )}
            </>
          )}
          <Button variant="outline" onClick={() => handleSubmit("Draft")} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" /> Save Draft
          </Button>
          <Button onClick={() => handleSubmit("Confirmed")} className="bg-[#1A2E28]" disabled={isSaving}>
            <Send className="w-4 h-4 mr-2" /> Confirm Proforma
          </Button>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">

          {/* General Info Card */}
          <div className="bg-white rounded-3xl border p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg">General Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Date */}
              <div className="space-y-2">
                <Label>Proforma Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="date"
                    value={header.salesProformaDate}
                    onChange={e => setHeader({ ...header, salesProformaDate: e.target.value })}
                    className="rounded-xl h-11 pl-9"
                  />
                </div>
              </div>

              {/* Company */}
              <div className="space-y-2">
                <Label>Company</Label>
                {companiesLoading ? <Skeleton className="h-11 w-full rounded-xl" /> : (
                  <Select value={header.companyId ? String(header.companyId) : undefined} onValueChange={v => setHeader({ ...header, companyId: Number(v) })}>
                    <SelectTrigger className="rounded-xl h-11 font-bold"><SelectValue placeholder="Select Company" /></SelectTrigger>
                    <SelectContent>{companies.map((c: any, i: number) => <SelectItem key={c.companyId || c.id || i} value={String(c.companyId || c.id)}>{c.companyName}</SelectItem>)}</SelectContent>
                  </Select>
                )}
              </div>

              {/* Customer */}
              <div className="space-y-2">
                <Label>Customer <span className="text-red-500">*</span></Label>
                {customersLoading ? <Skeleton className="h-11 w-full rounded-xl" /> : (
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground z-10" />
                    <Select value={header.customerId ? String(header.customerId) : undefined} onValueChange={v => setHeader({ ...header, customerId: Number(v) })}>
                      <SelectTrigger className="rounded-xl h-11 pl-9 font-bold text-slate-700">
                        <SelectValue placeholder="Select Customer" />
                      </SelectTrigger>
                      <SelectContent>{customers.map((c: any, i: number) => <SelectItem key={c.id || i} value={String(c.id)}>{c.CUSTOMER_NAME || c.customerName}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Store */}
              <div className="space-y-2">
                <Label>Store <span className="text-red-500">*</span></Label>
                {storesLoading ? <Skeleton className="h-11 w-full rounded-xl" /> : (
                  <Select value={header.storeId ? String(header.storeId) : undefined} onValueChange={v => setHeader({ ...header, storeId: Number(v) })}>
                    <SelectTrigger className="rounded-xl h-11"><SelectValue placeholder="Select Store" /></SelectTrigger>
                    <SelectContent>{stores.map((s: any, i: number) => <SelectItem key={s.id || s.storeIdUserToRole || i} value={String(s.storeIdUserToRole || s.id)}>{s.storeName}</SelectItem>)}</SelectContent>
                  </Select>
                )}
              </div>

              {/* Billing Location */}
              <div className="space-y-2">
                <Label>Billing Location</Label>
                {billingLocationsLoading ? <Skeleton className="h-11 w-full rounded-xl" /> : (
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground z-10" />
                    <Select value={header.billingLocationId ? String(header.billingLocationId) : undefined} onValueChange={v => setHeader({ ...header, billingLocationId: Number(v) })}>
                      <SelectTrigger className="rounded-xl h-11 pl-9"><SelectValue placeholder="Select Location" /></SelectTrigger>
                      <SelectContent>{billingLocations.map((l: any, i: number) => <SelectItem key={l.id || i} value={String(l.id)}>{l.billingLocationName || l.locationName}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Sales Person */}
              <div className="space-y-2">
                <Label>Sales Person</Label>
                {salesPersonsLoading ? <Skeleton className="h-11 w-full rounded-xl" /> : (
                  <Select value={header.salesPersonEmpId ? String(header.salesPersonEmpId) : undefined} onValueChange={v => setHeader({ ...header, salesPersonEmpId: Number(v) })}>
                    <SelectTrigger className="rounded-xl h-11"><SelectValue placeholder="Select Sales Person" /></SelectTrigger>
                    <SelectContent>{salesPersons.map((p: any, i: number) => <SelectItem key={p.id || i} value={String(p.id)}>{p.salesPersonName}</SelectItem>)}</SelectContent>
                  </Select>
                )}
              </div>

              {/* Currency */}
              <div className="space-y-2">
                <Label>Currency</Label>
                {currenciesLoading ? <Skeleton className="h-11 w-full rounded-xl" /> : (
                  <Select value={header.currencyId ? String(header.currencyId) : undefined} onValueChange={v => setHeader({ ...header, currencyId: Number(v) })}>
                    <SelectTrigger className="rounded-xl h-11"><SelectValue placeholder="Currency" /></SelectTrigger>
                    <SelectContent>{currencies.map((c: any, i: number) => <SelectItem key={c.id || i} value={String(c.id)}>{c.CURRENCY_NAME || c.currencyName}</SelectItem>)}</SelectContent>
                  </Select>
                )}
              </div>

              {/* Exchange Rate */}
              <div className="space-y-2">
                <Label>Exchange Rate</Label>
                <Input
                  type="number"
                  value={header.exchangeRate}
                  onChange={e => setHeader({ ...header, exchangeRate: Number(e.target.value) })}
                  className="rounded-xl h-11 font-bold"
                />
              </div>

              {/* Remarks */}
              <div className="space-y-2 md:col-span-3">
                <Label>Remarks</Label>
                <Input
                  value={header.remarks}
                  onChange={e => setHeader({ ...header, remarks: e.target.value })}
                  className="rounded-xl h-11"
                  placeholder="Notes or special instructions..."
                />
              </div>

              {/* Test Desc */}
              <div className="space-y-2">
                <Label>Test Description</Label>
                <Input
                  value={header.testDesc}
                  onChange={e => setHeader({ ...header, testDesc: e.target.value })}
                  className="rounded-xl h-11"
                  placeholder="Optional..."
                />
              </div>
            </div>
          </div>

          {/* Line Items Card */}
          <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Product Lines</h3>
              <Button variant="outline" size="sm" onClick={addItem}>
                <Plus className="w-4 h-4 mr-1" /> Add Product
              </Button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b">
                  <th className="p-4 text-left text-xs font-bold uppercase text-muted-foreground">Product</th>
                  <th className="p-4 text-center text-xs font-bold uppercase text-muted-foreground whitespace-nowrap">PO Link</th>
                  <th className="p-4 text-center text-xs font-bold uppercase text-muted-foreground">Stock</th>
                  <th className="p-4 text-center text-xs font-bold uppercase text-muted-foreground">Qty</th>
                  <th className="p-4 text-center text-xs font-bold uppercase text-muted-foreground">UOM</th>
                  <th className="p-4 text-center text-xs font-bold uppercase text-muted-foreground">Rate</th>
                  <th className="p-4 text-center text-xs font-bold uppercase text-muted-foreground whitespace-nowrap">VAT %</th>
                  <th className="p-4 text-right text-xs font-bold uppercase text-muted-foreground whitespace-nowrap">Subtotal</th>
                  <th className="p-4 text-right text-xs font-bold uppercase text-muted-foreground whitespace-nowrap">VAT Amt</th>
                  <th className="p-4 text-right text-xs font-bold uppercase text-muted-foreground whitespace-nowrap">Final Amt</th>
                  <th className="p-4 w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map(item => {
                  const prod = productsData.find((p: any) => p.productName === item.productName);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                      {/* Product */}
                      <td className="p-4 min-w-[240px]">
                        <div className="flex items-center gap-2">
                          {prod?.contentData ? (
                            <img src={prod.contentData} alt="" className="w-8 h-8 rounded object-cover border shrink-0 cursor-pointer" onClick={() => setPreviewImage(prod.contentData)} />
                          ) : (
                            <div className="w-8 h-8 rounded bg-slate-50 border flex items-center justify-center text-[9px] text-slate-400 font-bold shrink-0">IMG</div>
                          )}
                          <div className="flex-1">
                            <Select value={item.productName} onValueChange={v => updateItem(item.id, "productName", v)}>
                              <SelectTrigger className="border-none shadow-none focus:ring-0 font-bold text-slate-700 w-full">
                                <SelectValue placeholder="Select product" />
                              </SelectTrigger>
                              <SelectContent>
                                {productsData.map((p: any, i: number) => <SelectItem key={p.id || i} value={p.productName}>{p.productName}</SelectItem>)}
                              </SelectContent>
                            </Select>
                            {item.mainCategoryId && <p className="text-[9px] text-slate-400 px-3 uppercase tracking-tight">Cat: {item.mainCategoryId}</p>}
                          </div>
                        </div>
                      </td>
                      {/* PO Link */}
                      <td className="p-4">
                        <Select value={item.poRefNo || ""} onValueChange={v => updateItem(item.id, "poRefNo", v === "none" ? "" : v)}>
                          <SelectTrigger className="w-24 mx-auto text-center border-dashed font-bold text-xs h-9 shadow-sm">
                            <SelectValue placeholder="PO Ref..." />
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
                      {/* Store Stock */}
                      <td className="p-4">
                        <Input
                          type="number"
                          value={item.storeStockPcs}
                          onChange={e => updateItem(item.id, "storeStockPcs", Number(e.target.value))}
                          className="w-20 mx-auto text-center font-bold text-xs h-9 border-dashed"
                        />
                      </td>
                      {/* Qty */}
                      <td className="p-4">
                        <Input
                          type="number"
                          value={item.totalQty}
                          onChange={e => updateItem(item.id, "totalQty", Number(e.target.value))}
                          className="w-20 mx-auto text-center font-black border-none"
                        />
                      </td>
                      {/* UOM */}
                      <td className="p-4">
                        <Select value={item.uom} onValueChange={v => updateItem(item.id, "uom", v)}>
                          <SelectTrigger className="w-20 mx-auto border-none shadow-none focus:ring-0 text-center font-bold text-slate-500 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>{uoms.map((u: any, i: number) => <SelectItem key={u.id || i} value={u.UNIT_NAME || u.unitName}>{u.UNIT_NAME || u.unitName}</SelectItem>)}</SelectContent>
                        </Select>
                      </td>
                      {/* Rate */}
                      <td className="p-4">
                        <Input
                          type="number"
                          value={item.salesRatePerQty}
                          onChange={e => updateItem(item.id, "salesRatePerQty", Number(e.target.value))}
                          className="w-24 mx-auto text-center font-black border-none"
                        />
                      </td>
                      {/* VAT % */}
                      <td className="p-4">
                        <Input
                          type="number"
                          value={item.vatPercentage}
                          onChange={e => updateItem(item.id, "vatPercentage", Number(e.target.value))}
                          className="w-16 mx-auto text-center font-bold text-slate-500 border-none"
                        />
                      </td>
                      {/* Subtotal */}
                      <td className="p-4 text-right font-bold text-slate-700 tabular-nums text-xs">
                        {item.totalProductAmount.toLocaleString()}
                      </td>
                      {/* VAT Amt */}
                      <td className="p-4 text-right font-semibold text-slate-500 tabular-nums text-xs">
                        {item.vatAmount.toLocaleString()}
                      </td>
                      {/* Final Amt */}
                      <td className="p-4 text-right font-black text-slate-900 tabular-nums">
                        {selectedCurrency} {item.finalSalesAmount.toLocaleString()}
                      </td>
                      {/* Delete */}
                      <td className="p-4 text-center">
                        <button onClick={() => removeItem(item.id)} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 p-2">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Supporting Documents */}
          <SupportingDoc files={files} onFilesChange={setFiles} />
        </div>

        {/* Financial Sidebar */}
        <div className="space-y-6">
          <div className="bg-[#1A2E28] rounded-[32px] p-8 text-white shadow-xl lg:sticky lg:top-8 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />

            <div className="flex items-center gap-3 mb-8 relative">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <BadgeDollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Proforma Financials</h3>
            </div>

            <div className="space-y-4 text-sm opacity-80">
              <div className="flex justify-between">
                <span className="font-bold uppercase text-[10px] tracking-widest text-white/50">Subtotal</span>
                <span className="font-mono text-lg">{selectedCurrency} {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold uppercase text-[10px] tracking-widest text-white/50">VAT Total</span>
                <span className="font-mono text-lg">{selectedCurrency} {totalVat.toLocaleString()}</span>
              </div>
              <div className="flex justify-between opacity-60">
                <span className="font-bold uppercase text-[10px] tracking-widest text-white/50">LC Total</span>
                <span className="font-mono">{(grandTotal * exchangeRate).toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-white/10">
              <p className="text-[10px] uppercase font-black tracking-[0.2em] text-white/30 mb-2">Grand Total</p>
              <p className="text-5xl font-black tracking-tighter tabular-nums mb-1">{grandTotal.toLocaleString()}</p>
              <p className="text-[10px] text-white/40 font-medium italic">Amount in {selectedCurrency}</p>

              <Button
                onClick={() => handleSubmit("Confirmed")}
                disabled={isSaving}
                className="w-full mt-10 h-14 bg-emerald-500 hover:bg-emerald-600 rounded-2xl font-black text-lg shadow-xl transition-all active:scale-95"
              >
                {editId ? "Update Proforma" : "Confirm Proforma"}
              </Button>

              {editId && header.status === "Confirmed" && (
                <Button
                  onClick={handleConvertToSO}
                  variant="outline"
                  className="w-full mt-3 h-12 rounded-2xl font-bold bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <ArrowRight className="w-4 h-4 mr-2" /> Convert to Sales Order
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Dialog */}
      <Dialog open={!!previewImage} onOpenChange={open => !open && setPreviewImage(null)}>
        <DialogContent className="max-w-4xl border-none bg-transparent shadow-none p-0 flex items-center justify-center">
          <DialogTitle className="sr-only">Product Image Preview</DialogTitle>
          <div className="relative group">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-3 -right-3 z-50 bg-white text-black hover:bg-destructive hover:text-white p-1.5 rounded-full shadow-2xl border"
            >
              <X className="w-4 h-4" />
            </button>
            {previewImage && (
              <img
                src={previewImage}
                alt="Product Preview"
                className="max-h-[85vh] max-w-full rounded-lg shadow-2xl border-4 border-white object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function CreateSalesProformaPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-12 min-h-screen text-muted-foreground animate-pulse">Loading Proforma Form...</div>}>
      <CreateProformaContent />
    </Suspense>
  );
}
