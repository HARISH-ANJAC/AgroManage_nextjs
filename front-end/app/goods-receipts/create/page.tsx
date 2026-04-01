"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo, Suspense } from "react";
import { toast } from "sonner";
import { ArrowLeft, Save, Send, Info, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMasterData } from "@/hooks/useMasterData";
import { usePurchaseOrderStore } from "@/hooks/usePurchaseOrderStore";
import { useGoodsReceiptStore } from "@/hooks/useGoodsReceiptStore";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface GRNItem {
  id: number;
  poDtlSno: number | null;
  productId: number | null;
  productName: string;
  mainCategoryId: number | null;
  subCategoryId: number | null;
  poQty: number;
  receivedQty: number;
  uom: string;
  qtyPerPack: number;
  remarks: string;
}

function CreateGRNContent() {
  const navigate = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const today = new Date().toISOString().split("T")[0];

  const { orders: pos, getOrderById, isLoading: posLoading } = usePurchaseOrderStore();
  const { data: stores } = useMasterData("stores");
  const { addGRN, updateGRN, getGRNById, grns = [], isLoading: grnsLoading } = useGoodsReceiptStore();
  const { data: productsData = [] } = useMasterData("products");

  const [poLoading, setPoLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Compute next GRN ref no from existing GRNs
  const nextGrnRefNo = useMemo(() => {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, "0");
    const prefix = `GRN/${year}/${month}/`;
    const existing = grns
      .map((g: any) => {
        const ref = g.GRN_REF_NO || g.grnRefNo || "";
        if (ref.startsWith(prefix)) {
          return parseInt(ref.replace(prefix, ""), 10) || 0;
        }
        return 0;
      })
      .filter(Boolean);
    const next = existing.length > 0 ? Math.max(...existing) + 1 : 1;
    return `${prefix}${String(next).padStart(3, "0")}`;
  }, [grns]);

  // POs that are Approved and don't have an existing GRN
  const usedPoRefs = useMemo(() => {
    return new Set(grns.map((g: any) => g.PO_REF_NO || g.poRefNo || "").filter(Boolean));
  }, [grns]);

  const availablePOs = useMemo(() => {
    return pos.filter((p: any) => {
      const h = p.header || p;
      const refNo = h.PO_REF_NO || h.poRefNo || "";
      const status = h.STATUS_ENTRY || h.status || "";
      const isApproved = status === "Approved";
      const alreadyUsed = usedPoRefs.has(refNo);
      return isApproved && !alreadyUsed;
    });
  }, [pos, usedPoRefs]);

  const [header, setHeader] = useState({
    grnRefNo: nextGrnRefNo,
    grnDate: today,
    poRefNo: "",
    supplierId: "" as string | number,
    supplierName: "",
    companyId: "" as string | number,
    grnStoreId: "" as string | number,
    grnSource: "Purchase Order",
    supplierInvoiceNo: "",
    deliveryNoteRefNo: "",
    driverName: "",
    driverContact: "",
    vehicleNo: "",
    containerNo: "",
    sealNo: "",
    remarks: "",
    status: "Received",
  });

  const [items, setItems] = useState<GRNItem[]>([]);

  // Update GRN ref no once grns load (only for new GRN)
  useEffect(() => {
    if (!editId) {
      setHeader(prev => ({ ...prev, grnRefNo: nextGrnRefNo }));
    }
  }, [nextGrnRefNo, editId]);

  // Auto-populate from PO when selected
  useEffect(() => {
    if (editId || !header.poRefNo) return;

    const load = async () => {
      setPoLoading(true);
      try {
        // Try full fetch for items
        const full = await getOrderById(header.poRefNo);
        const h = full?.header || full;
        const poItems: any[] = full?.items || [];

        if (h) {
          setHeader(prev => ({
            ...prev,
            supplierId: h.SUPPLIER_ID || h.supplierId || prev.supplierId,
            supplierName: h.supplierName || h.supplier || h.Supplier_Name || "",
            companyId: h.COMPANY_ID || h.companyId || prev.companyId,
          }));
        }

        if (poItems.length > 0) {
          setItems(poItems.map((item: any, idx: number) => ({
            id: idx + 1,
            poDtlSno: item.SNO || item.poDtlSno || null,
            productId: item.PRODUCT_ID || item.productId || null,
            productName: item.PRODUCT_NAME || item.productName || item.product || "Product",
            mainCategoryId: item.MAIN_CATEGORY_ID || item.mainCategoryId || null,
            subCategoryId: item.SUB_CATEGORY_ID || item.subCategoryId || null,
            poQty: Number(item.TOTAL_QTY || item.totalQty || 0),
            receivedQty: Number(item.TOTAL_QTY || item.totalQty || 0),
            uom: item.UOM || item.uom || "KG",
            qtyPerPack: Number(item.QTY_PER_PACKING || item.qtyPerPack || 0),
            remarks: "",
          })));
        } else {
          setItems([]);
        }
      } catch (e) {
        toast.error("Failed to load PO details");
      } finally {
        setPoLoading(false);
      }
    };

    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [header.poRefNo, editId]);

  // Load GRN for Editing
  useEffect(() => {
    if (!editId) return;

    const loadEdit = async () => {
      setIsFetchingData(true);
      const existing = await getGRNById(editId);
      if (!existing) { toast.error("GRN not found."); setIsFetchingData(false); return; }

      const eHeader = existing.header || existing;
      setHeader({
        grnRefNo: eHeader.GRN_REF_NO || eHeader.grnRefNo || "",
        grnDate: eHeader.GRN_DATE ? new Date(eHeader.GRN_DATE).toISOString().split("T")[0] : today,
        poRefNo: eHeader.PO_REF_NO || eHeader.poRefNo || "",
        supplierId: eHeader.SUPPLIER_ID || eHeader.supplierId || "",
        supplierName: eHeader.supplierName || "",
        companyId: eHeader.COMPANY_ID || eHeader.companyId || "",
        grnStoreId: eHeader.GRN_STORE_ID || eHeader.grnStoreId || "",
        grnSource: eHeader.GRN_SOURCE || "Purchase Order",
        supplierInvoiceNo: eHeader.SUPPLIER_INVOICE_NUMBER || "",
        deliveryNoteRefNo: eHeader.DELIVERY_NOTE_REF_NO || "",
        driverName: eHeader.DRIVER_NAME || "",
        driverContact: eHeader.DRIVER_CONTACT_NUMBER || "",
        vehicleNo: eHeader.VEHICLE_NO || "",
        containerNo: eHeader.CONTAINER_NO || "",
        sealNo: eHeader.SEAL_NO || "",
        remarks: eHeader.REMARKS || "",
        status: eHeader.STATUS_ENTRY || "Received",
      });

      const rawItems: any[] = existing.items || [];
      setItems(rawItems.map((item: any, idx: number) => ({
        id: idx + 1,
        poDtlSno: item.PO_DTL_SNO || item.poDtlSno || null,
        productId: item.PRODUCT_ID || item.productId || null,
        productName: item.productName || item.PRODUCT_NAME || "Product",
        mainCategoryId: item.MAIN_CATEGORY_ID || null,
        subCategoryId: item.SUB_CATEGORY_ID || null,
        poQty: Number(item.poQty || item.PO_QTY || item.TOTAL_QTY || 0),
        receivedQty: Number(item.TOTAL_QTY || item.receivedQty || 0),
        uom: item.UOM || item.uom || "KG",
        qtyPerPack: Number(item.QTY_PER_PACKING || item.qtyPerPack || 0),
        remarks: item.REMARKS || "",
      })));
      setIsFetchingData(false);
    };

    loadEdit();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId]);

  const updateItem = (id: number, field: string, value: string | number) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleSubmit = async () => {
    if (!header.poRefNo) { toast.error("Please select a PO Reference"); return; }
    if (!header.grnStoreId) { toast.error("Please select a GRN Store"); return; }
    if (items.length === 0) { toast.error("No items loaded from PO"); return; }

    for (const item of items) {
      if (item.receivedQty > item.poQty) {
        toast.error(`Received qty for ${item.productName} (${item.receivedQty}) exceeds PO qty (${item.poQty})`);
        return;
      }
      if (item.receivedQty < 0) {
        toast.error(`Received qty for ${item.productName} cannot be negative`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const payload = {
        header: {
          grnRefNo: header.grnRefNo,
          grnDate: header.grnDate,
          poRefNo: header.poRefNo,
          supplierId: header.supplierId ? Number(header.supplierId) : undefined,
          companyId: header.companyId ? Number(header.companyId) : undefined,
          grnStoreId: header.grnStoreId ? Number(header.grnStoreId) : undefined,
          grnSource: header.grnSource,
          supplierInvoiceNo: header.supplierInvoiceNo,
          deliveryNoteRefNo: header.deliveryNoteRefNo,
          driverName: header.driverName,
          driverContact: header.driverContact,
          vehicleNo: header.vehicleNo,
          containerNo: header.containerNo,
          sealNo: header.sealNo,
          remarks: header.remarks,
          status: header.status,
        },
        items: items.map(item => ({
          poDtlSno: item.poDtlSno,
          productId: item.productId,
          productName: item.productName,
          mainCategoryId: item.mainCategoryId,
          subCategoryId: item.subCategoryId,
          totalQty: item.receivedQty,
          qtyPerPacking: item.qtyPerPack,
          uom: item.uom,
          remarks: item.remarks,
        })),
        audit: { user: typeof window !== "undefined" ? (localStorage.getItem("userName") || "Admin") : "Admin" }
      };

      if (editId) {
        await updateGRN(editId, payload);
        toast.success("Goods Receipt Note updated successfully!");
      } else {
        await addGRN(payload);
        toast.success("Goods Receipt Note created successfully!");
      }
      navigate.push("/goods-receipts");
    } catch (error: any) {
      toast.error(error?.message || "Failed to process GRN");
    } finally {
      setSubmitting(false);
    }
  };

  const isLoading = posLoading || grnsLoading;

  if (isFetchingData) {
    return (
      <div className="max-w-full mx-auto pb-20 px-4 sm:px-6 space-y-8 mt-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div>
               <Skeleton className="h-8 w-64 mb-2" />
               <Skeleton className="h-5 w-48" />
            </div>
          </div>
          <Skeleton className="h-11 w-40 rounded-xl" />
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-[24px] border p-8">
            <Skeleton className="h-6 w-32 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
              {[...Array(12)].map((_, i) => <Skeleton key={i} className="h-11 w-full" />)}
            </div>
          </div>
          <div className="bg-white rounded-[24px] border p-8">
            <Skeleton className="h-6 w-48 mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-full bg-slate-100" />
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto pb-20 px-4 sm:px-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 mt-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate.push("/goods-receipts")}
            className="p-2.5 rounded-full border border-border hover:bg-muted transition-colors bg-white shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">
              {editId ? `Edit GRN: ${header.grnRefNo}` : "Prepare Goods Receipt Note (GRN)"}
            </h1>
            <div className="flex items-center gap-1.5 mt-1 text-[#059669] font-medium text-[13px]">
              <Info className="w-4 h-4" />
              <span>
                {editId
                  ? "Update received quantities and logistics details"
                  : "Step 2: Select Approved PO → Verify quantities upon arrival"}
              </span>
            </div>
          </div>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={submitting}
          className="bg-[#1A2E28] hover:bg-[#1A2E28]/90 text-white font-bold rounded-xl px-6 h-11 transition-all active:scale-95 shadow-md shadow-black/10"
        >
          {submitting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : editId ? (
            <Save className="w-4 h-4 mr-2" />
          ) : (
            <Send className="w-4 h-4 mr-2" />
          )}
          {editId ? "Save Changes" : "Generate GRN"}
        </Button>
      </div>

      <div className="space-y-6">
        {/* Header Card */}
        <div className="bg-white rounded-[24px] border border-[#E2E8F0] p-8 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#94A3B8] mb-6">Header Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            
            {/* GRN Ref No */}
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">GRN Ref No</Label>
              <Input value={header.grnRefNo} disabled className="bg-[#F1F5F9] border-[#E2E8F0] rounded-xl h-11 font-mono font-bold text-[#0F172A]" />
            </div>

            {/* GRN Date */}
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">GRN Date</Label>
              <Input type="date" value={header.grnDate} onChange={(e) => setHeader({ ...header, grnDate: e.target.value })} className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11" />
            </div>

            {/* PO Reference — excludes already-GRN'd POs */}
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">
                PO Reference *{" "}
                {editId && <span className="text-[#059669]">(Locked)</span>}
              </Label>
              {editId ? (
                <Input value={header.poRefNo} disabled className="bg-[#F1F5F9] border-[#E2E8F0] rounded-xl h-11 font-mono font-bold" />
              ) : (
                <Select value={header.poRefNo} onValueChange={(v) => { setHeader({ ...header, poRefNo: v }); setItems([]); }}>
                  <SelectTrigger className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11">
                    <SelectValue placeholder={isLoading ? "Loading POs..." : availablePOs.length === 0 ? "No approved POs available" : "Select approved PO"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePOs.map((p: any) => {
                      const h2 = p.header || p;
                      const refNo = h2.PO_REF_NO || h2.poRefNo || "";
                      return refNo ? <SelectItem key={refNo} value={refNo}>{refNo}</SelectItem> : null;
                    })}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Supplier (auto-filled) */}
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Supplier (Auto)</Label>
              <Input value={header.supplierName || String(header.supplierId) || ""} disabled placeholder="Auto-filled from PO" className="bg-[#F1F5F9] border-[#E2E8F0] rounded-xl h-11" />
            </div>

            {/* GRN Store */}
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">GRN Store *</Label>
              <Select value={String(header.grnStoreId)} onValueChange={(v) => setHeader({ ...header, grnStoreId: Number(v) })}>
                <SelectTrigger className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11"><SelectValue placeholder="Select Store" /></SelectTrigger>
                <SelectContent>
                  {stores.map((s: any) => <SelectItem key={s.id} value={String(s.id)}>{s.storeName}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* GRN Source */}
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">GRN Source</Label>
              <Select value={header.grnSource} onValueChange={(v) => setHeader({ ...header, grnSource: v })}>
                <SelectTrigger className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Purchase Order">Purchase Order</SelectItem>
                  <SelectItem value="Stock Transfer">Stock Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Driver */}
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Driver Name</Label>
              <Input value={header.driverName} onChange={(e) => setHeader({ ...header, driverName: e.target.value })} placeholder="Enter driver name" className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11" />
            </div>

            {/* Driver Contact */}
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Driver Contact</Label>
              <Input value={header.driverContact} onChange={(e) => setHeader({ ...header, driverContact: e.target.value })} placeholder="Enter contact number" className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11" />
            </div>

            {/* Vehicle */}
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Vehicle No</Label>
              <Input value={header.vehicleNo} onChange={(e) => setHeader({ ...header, vehicleNo: e.target.value })} placeholder="e.g. T 123 AAA" className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11" />
            </div>

            {/* Container */}
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Container No</Label>
              <Input value={header.containerNo} onChange={(e) => setHeader({ ...header, containerNo: e.target.value })} placeholder="Enter container no" className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11" />
            </div>

            {/* Seal */}
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Seal No</Label>
              <Input value={header.sealNo} onChange={(e) => setHeader({ ...header, sealNo: e.target.value })} placeholder="Enter seal no" className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11" />
            </div>

            {/* Supplier Invoice */}
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Supplier Invoice No</Label>
              <Input value={header.supplierInvoiceNo} onChange={(e) => setHeader({ ...header, supplierInvoiceNo: e.target.value })} placeholder="Supplier invoice ref" className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11" />
            </div>

            {/* Delivery Note */}
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Delivery Note Ref</Label>
              <Input value={header.deliveryNoteRefNo} onChange={(e) => setHeader({ ...header, deliveryNoteRefNo: e.target.value })} placeholder="DN reference" className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11" />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Status</Label>
              <Select value={header.status} onValueChange={(v) => setHeader({ ...header, status: v })}>
                <SelectTrigger className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Received">Received</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Partial">Partial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Remarks */}
            <div className="space-y-2 xl:col-span-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Remarks</Label>
              <Input value={header.remarks} onChange={(e) => setHeader({ ...header, remarks: e.target.value })} placeholder="Any remarks..." className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11" />
            </div>
          </div>
        </div>

        {/* Items Table Card */}
        <div className="bg-white rounded-[24px] border border-[#E2E8F0] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#94A3B8]">
              Goods Line Items {items.length > 0 && <span className="text-[#059669]">({items.length} items)</span>}
            </h2>
            {poLoading && (
              <div className="flex items-center gap-2 text-xs text-[#64748B]">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading PO items...
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-[#F8FAFC]/50">
                  <th className="text-left p-4 text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">#</th>
                  <th className="text-left p-4 text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Product</th>
                  <th className="text-center p-4 text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">PO Qty</th>
                  <th className="text-center p-4 text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Received Qty *</th>
                  <th className="text-center p-4 text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Shortage</th>
                  <th className="text-center p-4 text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">UOM</th>
                  <th className="text-center p-4 text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Qty/Pack</th>
                  <th className="text-left p-4 text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {items.length > 0 ? (
                  items.map((item, idx) => {
                    const shortage = item.poQty - item.receivedQty;
                    return (
                      <tr key={item.id} className="border-b transition-colors hover:bg-[#F8FAFC]/50">
                        <td className="p-4 text-[#94A3B8] font-medium text-sm">{idx + 1}</td>
                        <td className="p-4 font-bold text-[#0F172A]">
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
                            <span>{item.productName}</span>
                          </div>
                        </td>
                        <td className="p-4 text-center font-medium text-[#64748B]">{item.poQty}</td>
                        <td className="p-4 text-center">
                          <Input
                            type="number"
                            min={0}
                            max={item.poQty}
                            value={item.receivedQty}
                            onChange={(e) => updateItem(item.id, "receivedQty", Number(e.target.value))}
                            className={`w-28 mx-auto border rounded-xl h-10 text-center font-bold ${
                              item.receivedQty > item.poQty
                                ? "border-red-400 bg-red-50 text-red-600"
                                : "bg-[#F8FAFC]/50 border-[#E2E8F0]"
                            }`}
                          />
                        </td>
                        <td className="p-4 text-center">
                          <span className={`font-bold text-sm ${shortage > 0 ? "text-amber-600" : shortage < 0 ? "text-red-500" : "text-[#059669]"}`}>
                            {shortage > 0 ? `-${shortage}` : shortage < 0 ? `+${Math.abs(shortage)}` : "✓"}
                          </span>
                        </td>
                        <td className="p-4 text-center text-[#64748B] font-medium">{item.uom}</td>
                        <td className="p-4 text-center text-[#64748B] font-medium">{item.qtyPerPack}</td>
                        <td className="p-4">
                          <Input
                            value={item.remarks}
                            onChange={(e) => updateItem(item.id, "remarks", e.target.value)}
                            placeholder="Remarks..."
                            className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-9 text-xs"
                          />
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="p-16 text-center">
                      {poLoading ? (
                        <div className="flex flex-col items-center gap-3">
                          <Loader2 className="w-8 h-8 animate-spin text-[#059669]" />
                          <p className="text-[#94A3B8] font-medium">Loading items from PO...</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <p className="text-[#94A3B8] font-medium">
                            {header.poRefNo ? "No items found in selected PO" : "Select an Approved PO Reference above to load items"}
                          </p>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Summary Row */}
          {items.length > 0 && (
            <div className="mt-6 pt-5 border-t border-[#E2E8F0] flex flex-wrap gap-6 justify-end text-sm">
              <div className="text-[#94A3B8]">Total PO Qty: <span className="font-bold text-[#0F172A]">{items.reduce((s, i) => s + i.poQty, 0)}</span></div>
              <div className="text-[#94A3B8]">Total Received: <span className="font-bold text-[#059669]">{items.reduce((s, i) => s + i.receivedQty, 0)}</span></div>
              <div className="text-[#94A3B8]">Total Shortage: <span className={`font-bold ${items.reduce((s, i) => s + (i.poQty - i.receivedQty), 0) > 0 ? "text-amber-600" : "text-[#059669]"}`}>{items.reduce((s, i) => s + (i.poQty - i.receivedQty), 0)}</span></div>
            </div>
          )}
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

export default function CreateGRNPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-12 min-h-screen text-muted-foreground animate-pulse">Loading GRN interface...</div>}>
      <CreateGRNContent />
    </Suspense>
  );
}
