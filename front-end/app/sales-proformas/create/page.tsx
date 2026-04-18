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
import { useExpenseStore } from "@/hooks/useExpenseStore";
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
  purchaseRate: number;
  expenseRate: number;
  costPrice: number;
  salesRatePerQty: number;
  vatPercentage: number;
  storeStockPcs: number;
  poRefNo: string;
  selectedPiNo?: string;
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
  purchaseRate: 0,
  expenseRate: 0,
  costPrice: 0,
  salesRatePerQty: 0,
  vatPercentage: 18,
  storeStockPcs: 0,
  poRefNo: "",
  selectedPiNo: "",
  poDtlSno: null,
  totalProductAmount: 0,
  vatAmount: 0,
  finalSalesAmount: 0,
});

const getLineItemMeta = (item: LineItem) => ({
  totalPacking: item.qtyPerPacking ? item.totalQty / item.qtyPerPacking : 0,
});

const formatAmount = (value: number) =>
  Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
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
  const { bookings: purchaseInvoices, isLoading: invoicesLoading, getBookingById: getPIById } = usePurchaseBookingStore();
  const { expenses } = useExpenseStore();

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
            salesProformaDate: (h.salesProformaDate || h.SALES_PROFORMA_DATE) ? new Date(h.salesProformaDate || h.SALES_PROFORMA_DATE).toISOString().split("T")[0] : today,
            companyId: h.companyId || h.COMPANY_ID || 0,
            customerId: h.customerId || h.CUSTOMER_ID || 0,
            storeId: h.storeId || h.STORE_ID || 0,
            billingLocationId: h.billingLocationId || h.BILLING_LOCATION_ID || 0,
            salesPersonEmpId: h.salesPersonEmpId || h.SALES_PERSON_EMP_ID || 0,
            currencyId: h.currencyId || h.CURRENCY_ID || 0,
            exchangeRate: Number(h.exchangeRate || h.EXCHANGE_RATE) || 1,
            status: h.status || h.STATUS || "Draft",
            remarks: h.remarks || h.REMARKS || "",
            testDesc: h.testDesc || h.TEST_DESC || "",
            salesProformaRefNo: h.salesProformaRefNo || h.SALES_PROFORMA_REF_NO || "",
          });
          if (res.items) {
            setItems(res.items.map((it: any) => ({
              id: it.id || it.ID || Date.now() + Math.random(),
              productId: it.productId || it.PRODUCT_ID,
              productName: it.productName || it.PRODUCT_NAME || "",
              mainCategoryId: it.mainCategoryId || it.MAIN_CATEGORY_ID,
              subCategoryId: it.subCategoryId || it.SUB_CATEGORY_ID,
              qtyPerPacking: Number(it.qtyPerPacking || it.QTY_PER_PACKING) || 1,
              totalQty: Number(it.totalQty || it.TOTAL_QTY) || 0,
              uom: it.uom || it.UOM || "KG",
              alternateUom: it.alternateUom || it.ALTERNATE_UOM || "",
              purchaseRate: Number(it.purchaseRate || it.PURCHASE_RATE) || 0,
              expenseRate: Number(it.expenseRate || it.EXPENSE_RATE) || 0,
              costPrice: Number(it.costPrice || it.COST_PRICE) || 0,
              salesRatePerQty: Number(it.salesRatePerQty || it.SALES_RATE_PER_QTY) || 0,
              vatPercentage: Number(it.vatPercentage || it.VAT_PERCENTAGE) || 0,
              storeStockPcs: Number(it.storeStockPcs || it.STORE_STOCK_PCS) || 0,
              poRefNo: it.poRefNo || it.PO_REF_NO || "",
              selectedPiNo: it.poRefNo || it.PO_REF_NO || "", // Map saved PO Ref to selection link
              poDtlSno: it.poDtlSno || it.PO_DTL_SNO || null,
              totalProductAmount: Number(it.totalProductAmount || it.TOTAL_PRODUCT_AMOUNT) || 0,
              vatAmount: Number(it.vatAmount || it.VAT_AMOUNT) || 0,
              finalSalesAmount: Number(it.finalSalesAmount || it.FINAL_SALES_AMOUNT) || 0,
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
      const updated = { ...item, [field]: value };
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

  const updateItemFields = (id: string | number, fields: Record<string, any>) => {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      return recalcItem({ ...item, ...fields });
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
      <div className="max-w-[1760px] mx-auto pb-20 px-4 pt-6 space-y-8">
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
    <div className="max-w-[1760px] mx-auto pb-20 px-4 pt-6">
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
                    value={header.salesProformaDate || ""}
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
                  value={header.exchangeRate || 1}
                  onChange={e => setHeader({ ...header, exchangeRate: Number(e.target.value) })}
                  className="rounded-xl h-11 font-bold"
                />
              </div>

              {/* Remarks */}
              <div className="space-y-2 md:col-span-3">
                <Label>Remarks</Label>
                <Input
                  value={header.remarks || ""}
                  onChange={e => setHeader({ ...header, remarks: e.target.value })}
                  className="rounded-xl h-11"
                  placeholder="Notes or special instructions..."
                />
              </div>

              {/* Test Desc */}
              <div className="space-y-2">
                <Label>Test Description</Label>
                <Input
                  value={header.testDesc || ""}
                  onChange={e => setHeader({ ...header, testDesc: e.target.value })}
                  className="rounded-xl h-11"
                  placeholder="Optional..."
                />
              </div>
            </div>
          </div>

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
                <span className="font-mono text-lg">{selectedCurrency} {formatAmount(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold uppercase text-[10px] tracking-widest text-white/50">VAT Total</span>
                <span className="font-mono text-lg">{selectedCurrency} {formatAmount(totalVat)}</span>
              </div>
              <div className="flex justify-between opacity-60">
                <span className="font-bold uppercase text-[10px] tracking-widest text-white/50">LC Total</span>
                <span className="font-mono">{formatAmount(grandTotal * exchangeRate)}</span>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-white/10">
              <p className="text-[10px] uppercase font-black tracking-[0.2em] text-white/30 mb-2">Grand Total</p>
              <p className="text-5xl font-black tracking-tighter tabular-nums mb-1">{formatAmount(grandTotal)}</p>
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
                onClick={addItem}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Product
              </Button>
            </div>

            <div className="space-y-4 p-6">
              {items.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50/80 px-6 py-16 text-center">
                  <p className="text-lg font-bold text-slate-900">No line items added yet</p>
                  <p className="mt-2 text-sm text-slate-500">
                    Add the first product line to start preparing the sales proforma.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-6 h-11 rounded-xl border-emerald-200 bg-white px-5 font-semibold text-emerald-700 hover:bg-emerald-50"
                    onClick={addItem}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add First Item
                  </Button>
                </div>
              ) : (
                items.map((item, index) => {
                  const prod = productsData.find((p: any) => p.productName === item.productName);
                  const totalPacking = getLineItemMeta(item).totalPacking;

                  return (
                    <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px]">
                        <div className="min-w-0 space-y-3 lg:max-w-[820px]">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="rounded-full border-slate-200 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                              Item {index + 1}
                            </Badge>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Product</Label>
                            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
                              {prod?.contentData ? (
                                <img
                                  src={prod.contentData}
                                  alt=""
                                  className="h-10 w-10 shrink-0 rounded-lg border border-slate-200 object-cover shadow-sm cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
                                  onClick={() => setPreviewImage(prod.contentData)}
                                />
                              ) : (
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-[10px] font-bold uppercase text-slate-400">
                                  Img
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <Select value={item.productName} onValueChange={(v) => {
                                    updateItem(item.id, "productName", v);
                                }}>
                                  <SelectTrigger className="h-10 w-full border-0 bg-transparent px-0 text-left font-semibold text-slate-900 shadow-none focus:ring-0">
                                    <SelectValue placeholder="Select Product" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {productsData.map((p: any, i: number) => <SelectItem key={p.id || i} value={p.productName}>{p.productName}</SelectItem>)}
                                  </SelectContent>
                                </Select>
                                {item.mainCategoryId && <p className="px-0.5 text-[10px] uppercase tracking-tight text-slate-400">Cat: {item.mainCategoryId}</p>}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                            <span className="rounded-full border border-slate-200 bg-white px-3 py-1">UOM: {item.uom || "-"}</span>
                            <span className="rounded-full border border-slate-200 bg-white px-3 py-1">Pack: {item.qtyPerPacking || 0} {item.alternateUom || item.uom}</span>
                            <span className="rounded-full border border-slate-200 bg-white px-3 py-1">Total Packs: {totalPacking.toFixed(2)}</span>
                            <span className="rounded-full border border-slate-200 bg-white px-3 py-1">Stock: {Number(item.storeStockPcs || 0).toLocaleString("en-US")}</span>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-4">
                          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Final Amount</p>
                          <p className="mt-2 text-2xl font-extrabold text-slate-900">{selectedCurrency} {formatAmount(item.finalSalesAmount)}</p>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-2.5 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">PO Link</Label>
                          <Select 
                            key={item.id + (item.selectedPiNo || "none")}
                            value={item.selectedPiNo || "none"} 
                            onValueChange={async (v) => {
                              const refNo = v === "none" ? "" : v;
                              updateItem(item.id, "selectedPiNo", refNo);
                              if (refNo) {
                                toast.loading("Fetching PI details...", { id: `pi-fetch-${item.id}` });
                                const pi = await getPIById(refNo);
                                toast.dismiss(`pi-fetch-${item.id}`);
                                if (pi && pi.items) {
                                  const piItem = pi.items.find((i: any) => Number(i.productId || i.PRODUCT_ID) === Number(item.productId));
                                  if (piItem) {
                                    const qty = Number(piItem.receivedQty || piItem.totalQty || piItem.TOTAL_QTY || 0);
                                    const uom = piItem.uom || piItem.UOM || item.uom;
                                    const pRate = Number(piItem.ratePerQty || piItem.RATE_PER_QTY || 0);

                                    // Use PO Ref for expense filtering, but store PI Ref as the "Link"
                                    const poRef = pi.header?.PO_REF_NO || pi.header?.poRefNo || pi.PO_REF_NO || pi.poRefNo || "";
                                    const poExpenses = expenses?.filter((e: any) => {
                                      const expPo = e.poRefNo || e.PO_REF_NO || e.header?.poRefNo || e.header?.PO_REF_NO || "";
                                      return expPo && poRef && String(expPo).trim() === String(poRef).trim();
                                    }) || [];

                                    const totalExp = poExpenses.reduce((sum: number, e: any) => {
                                      const amount = Number(e.totalExpenseAmount || e.TOTAL_EXPENSE_AMOUNT || e.totalExpenseAmountLc || e.amount || e.AMOUNT || 0);
                                      return sum + amount;
                                    }, 0);

                                    const eRate = qty > 0 ? totalExp / qty : 0;
                                    const cPrice = pRate + eRate;

                                    updateItemFields(item.id, {
                                      poRefNo: refNo, // Store the PI Reference so it matches dropdown on reload
                                      poDtlSno: piItem.sno || piItem.SNO || piItem.poDtlSno || null,
                                      totalQty: qty,
                                      storeStockPcs: qty,
                                      uom: uom,
                                      purchaseRate: pRate,
                                      expenseRate: eRate,
                                      costPrice: cPrice
                                    });
                                  } else {
                                    toast.error("Product not found in this Purchase Invoice");
                                  }
                                }
                              } else {
                                // Clear all reference fields if none selected
                                updateItemFields(item.id, {
                                  poRefNo: "",
                                  poDtlSno: null,
                                  purchaseRate: 0,
                                  expenseRate: 0,
                                  costPrice: 0
                                });
                              }
                            }}
                          >
                            <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white font-semibold">
                              <SelectValue placeholder="PO Ref..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              {purchaseInvoices?.filter((inv: any) => {
                                const piRef = inv.PURCHASE_INVOICE_REF_NO || String(inv.id);
                                // Always show the currently selected PI, even if the product filter fails
                                if (item.selectedPiNo && String(piRef).trim() === String(item.selectedPiNo).trim()) return true;

                                if (inv.items && inv.items.length > 0) {
                                  return inv.items.some((i: any) => Number(i.productId || i.PRODUCT_ID) === Number(item.productId));
                                }
                                return true;
                              }).map((inv: any) => (
                                <SelectItem key={inv.PURCHASE_INVOICE_REF_NO || inv.id} value={inv.PURCHASE_INVOICE_REF_NO || String(inv.id)}>
                                  {inv.PURCHASE_INVOICE_REF_NO || String(inv.id)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Store Stock</Label>
                          <Input
                            readOnly
                            disabled
                            type="number"
                            value={item.storeStockPcs || 0}
                            className="h-11 rounded-xl border-slate-200 bg-slate-50 text-center font-bold opacity-70 cursor-not-allowed"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Quantity</Label>
                          <Input
                            type="number"
                            value={item.totalQty || 0}
                            onChange={e => updateItem(item.id, "totalQty", Number(e.target.value))}
                            className="h-11 rounded-xl border-slate-200 bg-white text-center font-bold"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">UOM</Label>
                          <Input
                            readOnly
                            disabled
                            value={item.uom || ""}
                            className="h-11 rounded-xl border-slate-200 bg-slate-50 font-semibold opacity-70 cursor-not-allowed text-center"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Selling Price</Label>
                          <Input
                            type="number"
                            value={item.salesRatePerQty || 0}
                            onChange={e => updateItem(item.id, "salesRatePerQty", Number(e.target.value))}
                            className="h-11 rounded-xl border-slate-200 bg-white text-center font-bold"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Purchase Rate</Label>
                          <Input
                            readOnly
                            disabled
                            type="number"
                            value={item.purchaseRate || 0}
                            className="h-11 rounded-xl border-slate-200 bg-slate-50 text-center font-bold opacity-70 cursor-not-allowed"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Expense Rate</Label>
                          <Input
                            readOnly
                            disabled
                            type="number"
                            value={item.expenseRate || 0}
                            className="h-11 rounded-xl border-slate-200 bg-slate-50 text-center font-bold opacity-70 cursor-not-allowed"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Cost Price</Label>
                          <Input
                            readOnly
                            disabled
                            type="number"
                            value={item.costPrice || 0}
                            className="h-11 rounded-xl border-slate-200 bg-slate-50 text-center font-bold opacity-70 cursor-not-allowed"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">VAT %</Label>
                          <Input
                            type="number"
                            value={item.vatPercentage || 0}
                            onChange={e => updateItem(item.id, "vatPercentage", Number(e.target.value))}
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

          <SupportingDoc files={files} onFilesChange={setFiles} />
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
