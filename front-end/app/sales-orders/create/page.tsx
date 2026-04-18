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
  useCurrencies, useProducts, useUoms, useBillingLocations, usePaymentTerms
} from "@/hooks/useStoreData";
import { useSalesOrderStore } from "@/hooks/useSalesOrderStore";
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
  vatPercentage: 15,
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

function CreateSalesOrderContent(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const proformaRef = searchParams.get("proformaRef");
  const today = new Date().toISOString().split("T")[0];

  const { addOrder, updateOrder, getOrderById } = useSalesOrderStore();
  const { getProformaById, proformas, isLoading: proformasLoading } = useSalesProformaStore();

  // Master Data
  const { data: companies = [], isLoading: companiesLoading } = useCompanies();
  const { data: customers = [], isLoading: customersLoading } = useCustomers();
  const { data: stores = [], isLoading: storesLoading } = useStores();
  const { data: salesPersons = [], isLoading: salesPersonsLoading } = useSalesPersons();
  const { data: currencies = [], isLoading: currenciesLoading } = useCurrencies();
  const { data: productsData = [], isLoading: productsLoading } = useProducts();
  const { data: uoms = [] } = useUoms();
  const { data: billingLocations = [], isLoading: billingLocationsLoading } = useBillingLocations();
  const { data: paymentTerms = [], isLoading: paymentTermsLoading } = usePaymentTerms();
  const { bookings: purchaseInvoices, isLoading: invoicesLoading, getBookingById } = usePurchaseBookingStore();
  const { expenses } = useExpenseStore();

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

  const [items, setItems] = useState<LineItem[]>([emptyItem()]);
  const [files, setFiles] = useState<any[]>([]);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Load logic for Edit or Conversion from Proforma
  useEffect(() => {
    const load = async () => {
      if (editId) {
        setIsFetchingData(true);
        const res = await getOrderById(editId);
        if (res?.header) {
          const h = res.header;
          setHeader({
            salesOrderDate: h.salesOrderDate ? new Date(h.salesOrderDate).toISOString().split("T")[0] : today,
            companyId: h.companyId || h.COMPANY_ID || 0,
            customerId: h.customerId || h.CUSTOMER_ID || 0,
            storeId: h.storeId || h.STORE_ID || 0,
            billingLocationId: h.billingLocationId || h.BILLING_LOCATION_ID || 0,
            salesPersonId: h.salesPersonId || h.SALES_PERSON_ID || 0,
            currencyId: h.currencyId || h.CURRENCY_ID || 0,
            paymentTermId: h.paymentTermId || h.PAYMENT_TERM_ID || 0,
            exchangeRate: Number(h.exchangeRate || h.EXCHANGE_RATE) || 1,
            creditLimitAmt: Number(h.creditLimitAmt || h.CREDIT_LIMIT_AMT) || 0,
            creditLimitDays: Number(h.creditLimitDays || h.CREDIT_LIMIT_DAYS) || 0,
            outstandingAmt: Number(h.outstandingAmt || h.OUTSTANDING_AMT) || 0,
            status: h.status || h.STATUS || "Draft",
            remarks: h.remarks || h.REMARKS || "",
            salesOrderRefNo: h.salesOrderRefNo || h.SALES_ORDER_REF_NO || "",
            salesProformaRefNo: h.salesProformaRefNo || h.SALES_PROFORMA_REF_NO || ""
          });

          if (res.items) {
            const mappedItems = await Promise.all(res.items.map(async (it: any) => {
              const pId = it.productId || it.PRODUCT_ID || it.id;
              let itemData = {
                id: it.id || it.ID || Date.now() + Math.random(),
                productId: pId,
                productName: it.productName || it.PRODUCT_NAME || "",
                mainCategoryId: it.mainCategoryId || it.MAIN_CATEGORY_ID || it.mainCategory || null,
                subCategoryId: it.subCategoryId || it.SUB_CATEGORY_ID || it.subCategory || null,
                qtyPerPacking: Number(it.qtyPerPacking || it.QTY_PER_PACKING || it.qtyPerPack) || 1,
                totalQty: Number(it.totalQty || it.TOTAL_QTY) || 0,
                uom: it.uom || it.UOM || "KG",
                alternateUom: it.alternateUom || it.ALTERNATE_UOM || "",
                purchaseRate: Number(it.purchaseRate || it.PURCHASE_RATE || it.rate) || 0,
                expenseRate: Number(it.expenseRate || it.EXPENSE_RATE) || 0,
                costPrice: Number(it.costPrice || it.COST_PRICE) || 0,
                salesRatePerQty: Number(it.salesRatePerQty || it.SALES_RATE_PER_QTY || it.rate) || 0,
                vatPercentage: Number(it.vatPercentage || it.VAT_PERCENTAGE || it.vatPercent) || 0,
                storeStockPcs: Number(it.storeStockPcs || it.STORE_STOCK_PCS) || 0,
                poRefNo: it.poRefNo || it.PO_REF_NO || "",
                selectedPiNo: it.poRefNo || it.PO_REF_NO || "",
                poDtlSno: it.poDtlSno || it.PO_DTL_SNO || it.po_dtl_sno || null,
                totalProductAmount: Number(it.totalProductAmount || it.TOTAL_PRODUCT_AMOUNT || it.amount) || 0,
                vatAmount: Number(it.vatAmount || it.VAT_AMOUNT) || 0,
                finalSalesAmount: Number(it.finalSalesAmount || it.FINAL_SALES_AMOUNT || it.amount) || 0,
              };

              // Aggressive PI auto-matching for Edit mode
              let piRef = itemData.selectedPiNo;
              if (!piRef && purchaseInvoices && purchaseInvoices.length > 0) {
                const matchingPI = purchaseInvoices.find((inv: any) => 
                  inv.items?.some((i: any) => String(i.productId || i.PRODUCT_ID) === String(pId))
                );
                if (matchingPI) {
                   piRef = matchingPI.PURCHASE_INVOICE_REF_NO || String(matchingPI.id || matchingPI.SNO);
                   itemData.selectedPiNo = piRef;
                   itemData.poRefNo = piRef;
                }
              }

              if (piRef) {
                try {
                  const pi = await getBookingById(piRef);
                  if (pi && pi.items) {
                    const piItem = pi.items.find((i: any) => 
                      String(i.productId || i.PRODUCT_ID || i.id).trim() === String(pId).trim()
                    );
                    if (piItem) {
                      const qty = Number(piItem.receivedQty || piItem.totalQty || piItem.TOTAL_QTY || 1);
                      const pRate = Number(piItem.purchaseRatePerQty || piItem.ratePerQty || piItem.PURCHASE_RATE_PER_QTY || piItem.RATE_PER_QTY || 0);
                      const poRefHdr = pi.header?.PO_REF_NO || pi.header?.poRefNo || pi.PO_REF_NO || pi.poRefNo || "";
                      
                      const poExpenses = (expenses || []).filter((e: any) => {
                        const expPo = e.poRefNo || e.PO_REF_NO || e.header?.poRefNo || e.header?.PO_REF_NO || "";
                        return expPo && poRefHdr && String(expPo).trim() === String(poRefHdr).trim();
                      });
                      
                      const totalExp = poExpenses.reduce((sum: number, e: any) => sum + Number(e.totalExpenseAmount || e.amount || 0), 0);
                      const eRate = qty > 0 ? totalExp / qty : 0;
                      
                      itemData = {
                        ...itemData,
                        poDtlSno: piItem.sno || piItem.SNO || piItem.poDtlSno || null,
                        storeStockPcs: qty,
                        purchaseRate: pRate,
                        expenseRate: eRate,
                        costPrice: pRate + eRate
                      };
                    }
                  }
                } catch (err) { }
              }
              return recalcItem(itemData);
            }));
            setItems(mappedItems);
          }
          if (res.files) setFiles(res.files);
        }
        setIsFetchingData(false);
      } else if (proformaRef) {
        setIsFetchingData(true);
        const res = await getProformaById(proformaRef);
        if (res?.header) {
          const h = res.header;
          setHeader(prev => ({
            ...prev,
            companyId: h.companyId || h.COMPANY_ID || 0,
            customerId: h.customerId || h.CUSTOMER_ID || 0,
            storeId: h.storeId || h.STORE_ID || 0,
            billingLocationId: h.billingLocationId || h.BILLING_LOCATION_ID || 0,
            salesPersonId: h.salesPersonEmpId || h.SALES_PERSON_EMP_ID || 0,
            currencyId: h.currencyId || h.CURRENCY_ID || 0,
            exchangeRate: Number(h.exchangeRate || h.EXCHANGE_RATE) || 1,
            remarks: h.remarks || h.REMARKS || "",
            salesProformaRefNo: h.salesProformaRefNo || h.SALES_PROFORMA_REF_NO || proformaRef
          }));

          if (res.items) {
            setItems(res.items.map((it: any) => recalcItem({
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
              selectedPiNo: it.poRefNo || it.PO_REF_NO || "",
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
            salesPersonId: prev.salesPersonId || (salesPersons[0]?.id || 0),
            billingLocationId: prev.billingLocationId || (billingLocations[0]?.id || 0),
            paymentTermId: prev.paymentTermId || (paymentTerms[0]?.id || 0)
          }));
        }
      }
    };
    load();
  }, [editId, proformaRef, companies, stores, currencies, salesPersons, billingLocations]);

  // Fetch Customer Credit Details
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

  const recalcItem = (item: LineItem): LineItem => {
    const purchaseRate = Number(item.purchaseRate) || 0;
    const expenseRate = Number(item.expenseRate) || 0;
    const costPrice = purchaseRate + expenseRate;
    const totalProductAmount = item.totalQty * item.salesRatePerQty;
    const vatAmount = totalProductAmount * (item.vatPercentage / 100);
    return { ...item, costPrice, totalProductAmount, vatAmount, finalSalesAmount: totalProductAmount + vatAmount };
  };

  const updateItem = (id: string | number, field: string, value: any) => {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const updated = { ...item, [field]: value };
      if (field === "productId") {
        const p = productsData.find((pr: any) => String(pr.id || pr.PRODUCT_ID) === String(value));
        if (p) {
          updated.productId = p.id || p.PRODUCT_ID;
          updated.productName = p.productName || p.PRODUCT_NAME || "";
          updated.uom = p.uom || p.UOM || "KG";
          updated.alternateUom = p.alternateUom || p.ALTERNATE_UOM || "";
          updated.qtyPerPacking = Number(p.qtyPerPacking || p.QTY_PER_PACKING) || 1;
          updated.mainCategoryId = p.mainCategoryId || p.MAIN_CATEGORY_ID;
          updated.subCategoryId = p.subCategoryId || p.SUB_CATEGORY_ID;
          updated.vatPercentage = Number(p.vatPercentage || p.VAT_PERCENTAGE) || 15;
        }
      } else if (field === "productName") {
        const p = productsData.find((pr: any) => (pr.productName || pr.PRODUCT_NAME) === value);
        if (p) {
          updated.productId = p.id || p.PRODUCT_ID;
          updated.productName = p.productName || p.PRODUCT_NAME || "";
          updated.uom = p.uom || p.UOM || "KG";
          updated.alternateUom = p.alternateUom || p.ALTERNATE_UOM || "";
          updated.qtyPerPacking = Number(p.qtyPerPacking || p.QTY_PER_PACKING) || 1;
          updated.mainCategoryId = p.mainCategoryId || p.MAIN_CATEGORY_ID;
          updated.subCategoryId = p.subCategoryId || p.SUB_CATEGORY_ID;
          updated.vatPercentage = Number(p.vatPercentage || p.VAT_PERCENTAGE) || 15;
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

  const handleProformaSelect = async (proformaRefNo: string) => {
    if (!proformaRefNo || proformaRefNo === "none") {
      setHeader(prev => ({ ...prev, salesProformaRefNo: "" }));
      return;
    }
    
    setIsFetchingData(true);
    try {
      const res = await getProformaById(proformaRefNo);
      if (res?.header) {
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
          const mappedItems = await Promise.all(res.items.map(async (it: any) => {
            const pId = it.productId || it.PRODUCT_ID || it.product_id;
            let itemData = {
              id: it.id || it.ID || Date.now() + Math.random(),
              productId: pId,
              productName: it.productName || it.PRODUCT_NAME || "",
              mainCategoryId: it.mainCategoryId || it.MAIN_CATEGORY_ID || it.mainCategory || null,
              subCategoryId: it.subCategoryId || it.SUB_CATEGORY_ID || it.subCategory || null,
              qtyPerPacking: Number(it.qtyPerPacking || it.QTY_PER_PACKING) || 1,
              totalQty: Number(it.totalQty || it.TOTAL_QTY || 0),
              uom: it.uom || it.UOM || "KG",
              alternateUom: it.alternateUom || it.ALTERNATE_UOM || "",
              purchaseRate: Number(it.purchaseRate || it.PURCHASE_RATE || it.purchase_rate_per_qty || 0),
              expenseRate: Number(it.expenseRate || it.EXPENSE_RATE || it.po_expense_amount || 0),
              costPrice: Number(it.costPrice || it.COST_PRICE || 0),
              salesRatePerQty: Number(it.salesRatePerQty || it.SALES_RATE_PER_QTY || 0),
              vatPercentage: Number(it.vatPercentage || it.VAT_PERCENTAGE || it.vat_percentage || 0),
              storeStockPcs: Number(it.storeStockPcs || it.STORE_STOCK_PCS || 0),
              poRefNo: it.poRefNo || it.PO_REF_NO || "",
              selectedPiNo: it.poRefNo || it.PO_REF_NO || "",
              poDtlSno: it.poDtlSno || it.PO_DTL_SNO || it.po_dtl_sno || null,
              totalProductAmount: Number(it.totalProductAmount || it.TOTAL_PRODUCT_AMOUNT || 0),
              vatAmount: Number(it.vatAmount || it.VAT_AMOUNT || 0),
              finalSalesAmount: Number(it.finalSalesAmount || it.FINAL_SALES_AMOUNT || 0),
            };

            // Aggressive PI auto-matching
            let piRef = itemData.selectedPiNo;
            
            // If Proforma is linked to a PI, priority 1
            if (piRef) {
               // Great
            } else if (purchaseInvoices && purchaseInvoices.length > 0) {
              // Priority 2: Try to find a PI for this product in the already loaded list
              const matchingPI = purchaseInvoices.find((inv: any) => 
                inv.items?.some((i: any) => String(i.productId || i.PRODUCT_ID) === String(pId))
              );
              if (matchingPI) {
                 piRef = matchingPI.PURCHASE_INVOICE_REF_NO || String(matchingPI.id || matchingPI.SNO);
                 itemData.selectedPiNo = piRef;
                 itemData.poRefNo = piRef;
              }
            }

            if (piRef) {
              try {
                const pi = await getBookingById(piRef);
                if (pi && pi.items) {
                  const piItem = pi.items.find((i: any) => 
                    String(i.productId || i.PRODUCT_ID || i.id).trim() === String(pId).trim()
                  );
                  if (piItem) {
                    const qty = Number(piItem.receivedQty || piItem.totalQty || piItem.TOTAL_QTY || 1);
                    const pRate = Number(piItem.purchaseRatePerQty || piItem.ratePerQty || piItem.PURCHASE_RATE_PER_QTY || piItem.RATE_PER_QTY || piItem.purchaseRate || 0);
                    const poRefHdr = pi.header?.PO_REF_NO || pi.header?.poRefNo || pi.PO_REF_NO || pi.poRefNo || "";
                    
                    // Always try to get expenses for calculation
                    const poExpenses = (expenses || []).filter((e: any) => {
                      const expPo = e.poRefNo || e.PO_REF_NO || e.header?.poRefNo || e.header?.PO_REF_NO || "";
                      return expPo && poRefHdr && String(expPo).trim() === String(poRefHdr).trim();
                    });
                    
                    const totalExp = poExpenses.reduce((sum: number, e: any) => sum + Number(e.totalExpenseAmount || e.amount || 0), 0);
                    const eRate = qty > 0 ? totalExp / qty : 0;
                    
                    itemData = {
                      ...itemData,
                      poDtlSno: piItem.sno || piItem.SNO || piItem.poDtlSno || null,
                      storeStockPcs: qty,
                      purchaseRate: pRate,
                      expenseRate: eRate,
                      costPrice: pRate + eRate
                    };
                  }
                }
              } catch (err) { }
            }
            return recalcItem(itemData);
          }));
          setItems(mappedItems);
        }
        if (res.files) setFiles(res.files);
      }
    } catch (e) {
      toast.error("Failed to load Proforma details");
    } finally {
      setIsFetchingData(false);
    }
  };

  const selectedCurrency = useMemo(() => {
    const c = currencies.find((c: any) => Number(c.id) === Number(header.currencyId));
    return c?.currencyCode || c?.currencyName || "TZS";
  }, [header.currencyId, currencies]);

  const subtotal = useMemo(() => items.reduce((s, i) => s + i.totalProductAmount, 0), [items]);
  const totalVat = useMemo(() => items.reduce((s, i) => s + i.vatAmount, 0), [items]);
  const grandTotal = subtotal + totalVat;

  const handleSubmit = async (status: string = "Draft") => {
    if (!header.customerId || !header.companyId || !header.storeId || !header.salesProformaRefNo) {
      toast.error("Please fill in Company, Store, Customer, and Proforma Reference");
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
        purchaseRate: it.purchaseRate,
        expenseRate: it.expenseRate,
        costPrice: it.costPrice
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
        toast.success("Sales Order updated successfully!");
      } else {
        await addOrder(payload);
        toast.success("Sales Order created successfully!");
      }
      router.push('/sales-orders');
    } catch {
      toast.error("Failed to save Sales Order");
    } finally {
      setIsSaving(false);
    }
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
          </div>
          <div>
            <div className="bg-[#1A2E28] rounded-[32px] p-8 h-96">
              <Skeleton className="h-10 w-48 mb-6 bg-white/20" />
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
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()} className="rounded-full h-10 w-10 p-0">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {editId ? `Sales Order: ${header.salesOrderRefNo}` : "Create Sales Order"}
            </h1>
            <Badge variant="outline" className="mt-1">{header.status}</Badge>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => handleSubmit("Draft")} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" /> Save Draft
          </Button>
          <Button onClick={() => handleSubmit("Confirmed")} className="bg-[#1A2E28]" disabled={isSaving}>
            <Send className="w-4 h-4 mr-2" /> Confirm & Send
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          {/* General Information */}
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
                    <Select value={String(header.salesProformaRefNo || "none")} onValueChange={handleProformaSelect}>
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
                <Label>Order Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                  <Input type="date" value={header.salesOrderDate} onChange={e => setHeader({ ...header, salesOrderDate: e.target.value })} className="rounded-xl h-11 pl-9" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Company</Label>
                <Select value={header.companyId ? String(header.companyId) : undefined} onValueChange={v => setHeader({ ...header, companyId: Number(v) })}>
                  <SelectTrigger className="rounded-xl h-11 font-bold"><SelectValue placeholder="Select Company" /></SelectTrigger>
                  <SelectContent>{companies.map((c: any) => <SelectItem key={c.companyId || c.id} value={String(c.companyId || c.id)}>{c.companyName}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Customer <span className="text-red-500">*</span></Label>
                <Select value={header.customerId ? String(header.customerId) : undefined} onValueChange={v => setHeader({ ...header, customerId: Number(v) })}>
                  <SelectTrigger className="rounded-xl h-11 pl-3 font-bold text-slate-700 shadow-sm focus:ring-emerald-500"><SelectValue placeholder="Select Customer" /></SelectTrigger>
                  <SelectContent>{customers.map((c: any) => <SelectItem key={c.id} value={String(c.id)}>{c.CUSTOMER_NAME || c.customerName}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Store <span className="text-red-500">*</span></Label>
                <Select value={header.storeId ? String(header.storeId) : undefined} onValueChange={v => setHeader({ ...header, storeId: Number(v) })}>
                  <SelectTrigger className="rounded-xl h-11"><SelectValue placeholder="Select Store" /></SelectTrigger>
                  <SelectContent>{stores.map((s: any) => <SelectItem key={s.id || s.storeIdUserToRole} value={String(s.storeIdUserToRole || s.id)}>{s.storeName}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2 font-bold focus:ring-emerald-500">
                <Label>Billing Location</Label>
                <Select value={header.billingLocationId ? String(header.billingLocationId) : undefined} onValueChange={v => setHeader({ ...header, billingLocationId: Number(v) })}>
                  <SelectTrigger className="rounded-xl h-11"><SelectValue placeholder="Select Location" /></SelectTrigger>
                  <SelectContent>{billingLocations.map((l: any) => <SelectItem key={l.id} value={String(l.id)}>{l.billingLocationName || l.locationName}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2 font-bold focus:ring-emerald-500">
                <Label>Sales Person</Label>
                <Select value={header.salesPersonId ? String(header.salesPersonId) : undefined} onValueChange={v => setHeader({ ...header, salesPersonId: Number(v) })}>
                  <SelectTrigger className="rounded-xl h-11"><SelectValue placeholder="Select Person" /></SelectTrigger>
                  <SelectContent>{salesPersons.map((p: any) => <SelectItem key={p.id} value={String(p.id)}>{p.salesPersonName}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2 font-bold focus:ring-emerald-500">
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
              <div className="space-y-2 md:col-span-2">
                <Label>Remarks</Label>
                <Input value={header.remarks} onChange={e => setHeader({ ...header, remarks: e.target.value })} className="rounded-xl h-11" placeholder="Notes..." />
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
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
           <div className="bg-[#1A2E28] rounded-[32px] p-8 text-white shadow-xl lg:sticky lg:top-8 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
            <div className="flex items-center gap-3 mb-8 relative">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <BadgeDollarSign className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold">Order Financials</h3>
            </div>
            <div className="space-y-4 text-sm opacity-80">
              <div className="flex justify-between">
                <span className="font-bold uppercase text-[10px] tracking-widest text-white/50">Subtotal</span>
                <span className="font-mono text-lg">{selectedCurrency} {formatAmount(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold uppercase text-[10px] tracking-widest text-white/50">VAT ({items[0]?.vatPercentage}%)</span>
                <span className="font-mono text-lg">{selectedCurrency} {formatAmount(totalVat)}</span>
              </div>
            </div>
            <div className="mt-10 pt-8 border-t border-white/10 relative">
              <p className="text-[10px] uppercase font-black tracking-[0.2em] text-white/30 mb-2">Grand Total</p>
              <p className="text-5xl font-black tracking-tighter tabular-nums mb-1">{formatAmount(grandTotal)}</p>
              <Button onClick={() => handleSubmit("Confirmed")} disabled={isSaving} className="w-full mt-10 h-14 bg-emerald-500 hover:bg-emerald-600 rounded-2xl font-black text-lg shadow-xl shadow-emerald-500/20 active:scale-95 transition-all">
                {editId ? "Update Order" : "Confirm & Send"}
              </Button>
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="lg:col-span-4 space-y-8">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
             <div className="flex flex-col gap-4 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">Order Lines</h3>
                <Badge variant="outline" className="rounded-full border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold text-slate-600">
                  {items.length} {items.length === 1 ? "Item" : "Items"}
                </Badge>
              </div>
              <Button variant="outline" className="h-11 rounded-xl border-emerald-200 bg-white px-5 font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors" onClick={addItem}>
                <Plus className="mr-2 h-4 w-4" /> Add Product
              </Button>
            </div>

            <div className="p-6">
               {items.map((item, index) => {
                  const prod = productsData.find((p: any) => p.productName === item.productName);
                  const totalPacking = getLineItemMeta(item).totalPacking;
                  return (
                    <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 mb-4 last:mb-0">
                      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px]">
                        <div className="min-w-0 space-y-3">
                          <div className="flex items-center gap-2">
                             <Badge variant="outline" className="rounded-full border-slate-200 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                              Item {index + 1}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2">
                             <Label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Product</Label>
                             <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
                                {prod?.contentData || prod?.PRODUCT_IMAGE ? (
                                  <img src={prod.contentData || prod.PRODUCT_IMAGE} className="h-10 w-10 shrink-0 rounded-lg border border-slate-200 object-cover shadow-sm cursor-pointer" onClick={() => setPreviewImage(prod.contentData || prod.PRODUCT_IMAGE)} />
                                ) : (
                                  <div className="h-10 w-10 shrink-0 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center text-[10px] font-bold text-slate-400">IMG</div>
                                )}
                                <div className="flex-1">
                                  {productsLoading || isFetchingData ? (
                                    <Skeleton className="h-10 w-full rounded-xl" />
                                  ) : (
                                    <Select 
                                      value={item.productId ? String(item.productId) : ""} 
                                      onValueChange={(v) => updateItem(item.id, "productId", v)}
                                    >
                                      <SelectTrigger className="h-10 border-0 bg-transparent px-0 font-semibold text-slate-900 focus:ring-0 shadow-none">
                                        <SelectValue placeholder="Select Product" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {productsData.map((p: any) => (
                                          <SelectItem key={p.id || p.PRODUCT_ID} value={String(p.id || p.PRODUCT_ID)}>
                                            {p.productName || p.PRODUCT_NAME}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  )}
                                </div>
                             </div>
                          </div>

                          <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                            <span className="rounded-full border border-slate-200 bg-white px-3 py-1">UOM: {item.uom}</span>
                            <span className="rounded-full border border-slate-200 bg-white px-3 py-1">Pack: {item.qtyPerPacking} {item.alternateUom || item.uom}</span>
                            <span className="rounded-full border border-slate-200 bg-white px-3 py-1">Stock: {Number(item.storeStockPcs || 0).toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-4">
                           <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Final Amount</p>
                           <p className="mt-2 text-2xl font-extrabold text-slate-900">{selectedCurrency} {formatAmount(item.finalSalesAmount)}</p>
                           <button onClick={() => removeItem(item.id)} className="mt-4 w-full flex items-center justify-center rounded-xl border border-destructive/10 bg-destructive/5 py-2.5 text-sm font-semibold text-destructive hover:bg-destructive/10 transition-colors"><Trash2 className="w-4 h-4 mr-2" /> Remove</button>
                        </div>
                      </div>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
                        <div className="space-y-2">
                           <Label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">PO Link</Label>
                           <Select 
                               key={item.id + (item.selectedPiNo || "none")}
                               value={item.selectedPiNo ? String(item.selectedPiNo).trim() : "none"} 
                               onValueChange={async (v) => {
                                 const refNo = v === "none" ? "" : v;
                                 updateItem(item.id, "selectedPiNo", refNo);
                                 if (refNo) {
                                   toast.loading("Fetching PI data...", { id: `pi-${item.id}` });
                                   const pi = await getBookingById(refNo);
                                   toast.dismiss(`pi-${item.id}`);
                                   
                                   if (pi && pi.items) {
                                     const piItem = pi.items.find((i: any) => String(i.productId || i.PRODUCT_ID) === String(item.productId));
                                     if (piItem) {
                                       const qty = Number(piItem.receivedQty || piItem.totalQty || piItem.TOTAL_QTY || 0);
                                       const pRate = Number(piItem.ratePerQty || piItem.RATE_PER_QTY || piItem.purchaseRatePerQty || 0);
                                       const poRef = pi.header?.PO_REF_NO || pi.header?.poRefNo || pi.PO_REF_NO || pi.poRefNo || "";
                                       
                                       const poExpenses = expenses?.filter((e: any) => {
                                         const expPo = e.poRefNo || e.PO_REF_NO || e.header?.poRefNo || e.header?.PO_REF_NO || "";
                                         return expPo && poRef && String(expPo).trim() === String(poRef).trim();
                                       }) || [];
                                       
                                       const totalExp = poExpenses.reduce((sum: number, e: any) => sum + Number(e.totalExpenseAmount || e.amount || 0), 0);
                                       const eRate = qty > 0 ? totalExp / qty : 0;
                                       
                                       updateItemFields(item.id, {
                                          poRefNo: refNo,
                                          poDtlSno: piItem.sno || piItem.SNO || null,
                                          storeStockPcs: qty,
                                          purchaseRate: pRate,
                                          expenseRate: eRate,
                                          costPrice: pRate + eRate
                                       });
                                     }
                                   }
                                 }
                               }}
                            >
                               <SelectTrigger className="h-11 rounded-xl font-bold bg-white text-xs whitespace-nowrap"><SelectValue placeholder="Select PI" /></SelectTrigger>
                               <SelectContent>
                                 <SelectItem value="none">None</SelectItem>
                                 {purchaseInvoices?.filter((inv: any) => {
                                   const piRef = String(inv.PURCHASE_INVOICE_REF_NO || inv.id || inv.SNO || "").trim();
                                   const selectedRef = String(item.selectedPiNo || "").trim();
                                   if (selectedRef && piRef === selectedRef) return true;
                                   
                                   if (inv.items && inv.items.length > 0) {
                                     return inv.items.some((i: any) => String(i.productId || i.PRODUCT_ID) === String(item.productId));
                                   }
                                   return true;
                                 }).map((inv: any) => {
                                   const val = String(inv.PURCHASE_INVOICE_REF_NO || inv.id || inv.SNO).trim();
                                   return (
                                     <SelectItem key={val} value={val}>
                                       {val}
                                     </SelectItem>
                                   );
                                 })}
                               </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                           <Label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Qty</Label>
                           <Input type="number" value={item.totalQty} onChange={e => updateItem(item.id, "totalQty", Number(e.target.value))} className="h-11 rounded-xl font-bold text-center" />
                        </div>
                        <div className="space-y-2">
                           <Label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Selling Price</Label>
                           <Input type="number" value={item.salesRatePerQty} onChange={e => updateItem(item.id, "salesRatePerQty", Number(e.target.value))} className="h-11 rounded-xl font-bold text-center" />
                        </div>
                        <div className="space-y-2">
                           <Label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Cost Price</Label>
                           <Input readOnly disabled value={item.costPrice} className="h-11 rounded-xl font-bold text-center bg-slate-50 opacity-70 cursor-not-allowed" />
                        </div>
                         <div className="space-y-2">
                           <Label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Expense Rate</Label>
                           <Input readOnly disabled value={item.expenseRate} className="h-11 rounded-xl font-bold text-center bg-slate-50 opacity-70 cursor-not-allowed" />
                        </div>
                        <div className="space-y-2">
                           <Label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">VAT %</Label>
                           <Input type="number" value={item.vatPercentage} onChange={e => updateItem(item.id, "vatPercentage", Number(e.target.value))} className="h-11 rounded-xl font-bold text-center" />
                        </div>
                      </div>
                    </div>
                  );
               })}
            </div>
          </div>

          <SupportingDoc files={files} onFilesChange={setFiles} />
        </div>
      </div>

       {/* Image Preview */}
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

export default function CreateSalesOrderPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-12 min-h-screen text-muted-foreground animate-pulse">Loading Order Form...</div>}>
      <CreateSalesOrderContent />
    </Suspense>
  );
}
