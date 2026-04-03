"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  Save,
  Send,
  Truck,
  User,
  Calendar,
  Info,
  Package,
  Warehouse,
  CheckCircle2,
  Clock,
  ClipboardList,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSalesOrderStore } from "@/hooks/useSalesOrderStore";
import { useDeliveryNoteStore } from "@/hooks/useDeliveryNoteStore";
import { useStores } from "@/hooks/useStoreData";
import { useMasterData } from "@/hooks/useMasterData";
import { getCurrentUser } from "@/lib/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { SupportingDoc } from "@/components/ui/Supporting-Doc";

function CreateDNContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const today = new Date().toISOString().split("T")[0];

  const { orders: salesOrders, getOrderById } = useSalesOrderStore();
  const { notes, addNote, updateNote, getNoteById } = useDeliveryNoteStore();
  const { data: stores = [], isLoading: storesLoading } = useStores();
  const { data: productsData = [], isLoading: productsDataLoading } = useMasterData("products");

  const [header, setHeader] = useState({
    deliveryDate: today,
    deliveryNoteRefNo: "",
    deliverySourceType: "Sales Order",
    deliverySourceRefNo: "",
    companyId: 0,
    fromStoreId: 0,
    customerId: 0,
    customerName: "",
    truckNo: "",
    trailerNo: "",
    driverName: "",
    driverContactNumber: "",
    sealNo: "",
    status: "In Transit",
    remarks: ""
  });

  const [items, setItems] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Load existing data if editing
  useEffect(() => {
    const loadNote = async () => {
      if (editId) {
        setIsFetchingData(true);
        const res = await getNoteById(editId as string);
        if (res && res.header) {
          const h = res.header;
          setHeader({
            deliveryDate: h.deliveryDate ? new Date(h.deliveryDate).toISOString().split("T")[0] : today,
            deliveryNoteRefNo: h.deliveryNoteRefNo || "",
            deliverySourceType: h.deliverySourceType || "Sales Order",
            deliverySourceRefNo: h.deliverySourceRefNo || "",
            companyId: h.companyId || 0,
            fromStoreId: h.fromStoreId || 0,
            customerId: h.customerId || 0,
            customerName: h.customerName || "",
            truckNo: h.truckNo || "",
            trailerNo: h.trailerNo || "",
            driverName: h.driverName || "",
            driverContactNumber: h.driverContactNumber || "",
            sealNo: h.sealNo || "",
            status: h.status || "In Transit",
            remarks: h.remarks || ""
          });

          if (res.items) {
            setItems(res.items.map((it: any) => ({
              id: it.id,
              productId: it.productId,
              productName: it.productName || "Unknown Product",
              requestQty: Number(it.requestQty) || 0,
              deliveryQty: Number(it.deliveryQty) || 0,
              uom: it.uom || "KG",
              rate: Number(it.rate) || 0,
              amount: Number(it.amount) || 0,
              salesOrderDtlSno: it.salesOrderDtlSno
            })));
          }

          if (res.files) {
            setFiles(res.files);
          }
        } else {
          toast.error("Delivery Note not found");
        }
        setIsFetchingData(false);
      }
    };
    loadNote();
  }, [editId]);

  // Handle SO Selection (Auto-populate)
  useEffect(() => {
    const loadSO = async () => {
      if (!editId && header.deliverySourceRefNo) {
        const fullSO = await getOrderById(header.deliverySourceRefNo);

        if (fullSO && fullSO.header) {
          const h = fullSO.header;
          setHeader(prev => ({
            ...prev,
            companyId: h.companyId,
            customerId: h.customerId,
            customerName: h.customerName || "N/A",
            fromStoreId: h.storeId || prev.fromStoreId
          }));

          const soItems = fullSO.items || [];
          setItems(soItems.map((item: any) => ({
            id: item.id || Math.random(),
            productId: item.productId,
            productName: item.productName || "Unknown Product",
            requestQty: item.totalQty || 0,
            deliveryQty: item.totalQty || 0,
            uom: item.uom || "KG",
            rate: item.rate || 0,
            amount: (item.totalQty || 0) * (item.rate || 0),
            salesOrderDtlSno: item.id
          })));
        }
      }
    };
    loadSO();
  }, [header.deliverySourceRefNo, editId]);

  const updateDeliveryQty = (id: any, qty: number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        // Quantities shouldn't exceed request quantity
        const validatedQty = Math.max(0, Math.min(qty, item.requestQty));
        return {
          ...item,
          deliveryQty: validatedQty,
          amount: validatedQty * item.rate
        };
      }
      return item;
    }));
  };

  const handleCreateDN = async (statusValue: string = "Submitted") => {
    if (!header.deliverySourceRefNo) {
      toast.error("Please select a Sales Order Reference");
      return;
    }

    const totalProductAmount = items.reduce((sum, i) => sum + i.amount, 0);
    const vatAmount = totalProductAmount * 0.15;
    const finalSalesAmount = totalProductAmount + vatAmount;

    // Auto-generate Ref if not provided
    const dnRefNo = header.deliveryNoteRefNo || `DN-${Date.now()}`;
    
    const payload = {
      header: {
        ...header,
        deliveryNoteRefNo: dnRefNo,
        totalProductAmount,
        vatAmount,
        finalSalesAmount,
        status: statusValue === "Draft" ? "Draft" : (header.status || "Submitted")
      },
      items,
      audit: {
        user: getCurrentUser()?.username || "System",
        lastModified: new Date().toISOString()
      },
      files: files.map(f => ({
        documentType: f.DOCUMENT_TYPE || f.documentType,
        descriptionDetails: f.DESCRIPTION_DETAILS || f.descriptionDetails,
        fileName: f.FILE_NAME || f.fileName,
        contentType: f.CONTENT_TYPE || f.contentType,
        contentData: f.CONTENT_DATA || f.contentData,
        remarks: f.REMARKS || f.remarks,
      }))
    };

    try {
      if (editId) {
        await updateNote(editId as string, payload);
        toast.success("Delivery Note Updated Successfully!");
      } else {
        await addNote(payload);
        toast.success(`Delivery Note ${statusValue === "Draft" ? "Saved as Draft" : "Created"} Successfully!`);
      }
      router.push("/delivery-notes");
    } catch (e) {
      toast.error("Failed to save Delivery Note");
    }
  };

  if (isFetchingData) {
    return (
      <div className="max-w-full mx-auto pb-20 px-4 sm:px-6 space-y-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4 mt-4">
          <div className="flex items-center gap-4">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-5 w-48" />
            </div>
          </div>
          <div className="flex gap-3">
             <Skeleton className="h-11 w-32 rounded-xl" />
             <Skeleton className="h-11 w-40 rounded-xl" />
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-[24px] border p-8">
             <Skeleton className="h-6 w-48 mb-6" />
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-11 w-full" />)}
             </div>
          </div>
          <div className="bg-white rounded-[24px] border p-8">
             <Skeleton className="h-6 w-48 mb-6" />
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-11 w-full" />)}
               <div className="lg:col-span-2">
                 <Skeleton className="h-11 w-full" />
               </div>
             </div>
          </div>
          <div className="bg-white rounded-[24px] border p-8">
             <Skeleton className="h-6 w-48 mb-6" />
             <Skeleton className="h-12 w-full mb-4 bg-slate-50" />
             {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 w-full mb-2" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto pb-20 px-4 sm:px-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4 mt-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/delivery-notes")}
            className="p-2.5 rounded-full border border-[#E2E8F0] hover:bg-muted transition-colors bg-white shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">
              {editId ? `Edit Delivery Note: ${editId}` : "Generate Delivery Note (DN)"}
            </h1>
            <div className="flex items-center gap-1.5 mt-1 text-[#059669] font-medium text-[13px]">
              <Info className="w-4 h-4" />
              <span>
                {editId
                  ? "Update logistics and verify quantities before final dispatch."
                  : "Step 2: Allocate stock and organize logistics for Sales Order fulfillment."}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => handleCreateDN("Draft")}
            className="rounded-xl border-[#E2E8F0] h-11 px-6 font-bold hover:bg-[#F8FAFC]"
          >
            <Save className="w-4 h-4 mr-2" /> Save Draft
          </Button>
          <Button
            onClick={() => handleCreateDN("Submitted")}
            className="bg-[#1A2E28] hover:bg-[#1A2E28]/90 text-white font-bold rounded-xl px-8 h-11 transition-all active:scale-95 shadow-md shadow-black/10"
          >
            <Send className="w-4 h-4 mr-2" /> {editId ? "Update DN" : "Generate DN"}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Main Information Card */}
        <div className="bg-white rounded-[24px] border border-[#E2E8F0] p-8 shadow-sm">
          <h2 className="text-base font-bold text-[#0F172A] mb-8 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[10px] font-bold text-[#64748B]">1</span>
            Header & Source Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Delivery Date*</Label>
              <Input
                type="date"
                value={header.deliveryDate}
                onChange={(e) => setHeader({ ...header, deliveryDate: e.target.value })}
                className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11 font-medium"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">SO Reference*</Label>
              <Select value={header.deliverySourceRefNo} onValueChange={(v) => setHeader({ ...header, deliverySourceRefNo: v })}>
                <SelectTrigger className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11 font-bold">
                  <SelectValue placeholder="Select SO" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {salesOrders.filter((so: any) => {
                    const ref = so.salesOrderRefNo || so.id;
                    const alreadyUsed = notes.some((n: any) => n.deliverySourceRefNo === ref);
                    // Show if not used yet OR if it's the one already assigned to this note we are editing
                    return !alreadyUsed || header.deliverySourceRefNo === ref;
                  }).map((so: any) => {
                    const ref = so.salesOrderRefNo || so.id;
                    const customerName = so.customerName || "N/A";
                    return (
                      <SelectItem key={so.id} value={ref} className="font-medium">
                        {ref} <span className="text-[#94A3B8] font-normal">— {customerName}</span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Customer</Label>
              <Input value={header.customerName} disabled className="bg-[#F1F5F9] border-[#E2E8F0] rounded-xl h-11 font-bold italic" placeholder="Auto-populated..." />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Dispatch Status</Label>
              <Select value={header.status} onValueChange={(v) => setHeader({ ...header, status: v })}>
                <SelectTrigger className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11 font-bold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Transit">In Transit</SelectItem>
                  <SelectItem value="Loaded">Loaded</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Logistics Information Card */}
        <div className="bg-white rounded-[24px] border border-[#E2E8F0] p-8 shadow-sm">
          <h2 className="text-base font-bold text-[#0F172A] mb-8 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[10px] font-bold text-[#64748B]">2</span>
            Logistics & Deployment
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">From Store</Label>
              {storesLoading ? (
                <Skeleton className="h-11 w-full rounded-xl" />
              ) : (
                <Select value={header.fromStoreId.toString()} onValueChange={(v) => setHeader({ ...header, fromStoreId: Number(v) })}>
                  <SelectTrigger className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11 font-bold text-[#0F172A]">
                    <SelectValue placeholder="Select Warehouse" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {stores.map((s: any) => <SelectItem key={s.id} value={s.storeIdUserToRole.toString()}>{s.storeName} (@{s.userName})</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Truck Plate No#</Label>
              <Input value={header.truckNo} onChange={(e) => setHeader({ ...header, truckNo: e.target.value.toUpperCase() })} placeholder="EX: T 456 DEF" className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11 font-bold placeholder:font-normal uppercase" />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Trailer No#</Label>
              <Input value={header.trailerNo} onChange={(e) => setHeader({ ...header, trailerNo: e.target.value.toUpperCase() })} placeholder="EX: TR 789" className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11 font-bold" />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Driver Name</Label>
              <Input value={header.driverName} onChange={(e) => setHeader({ ...header, driverName: e.target.value })} placeholder="Full Name" className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11 font-medium" />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Driver Contact</Label>
              <Input value={header.driverContactNumber} onChange={(e) => setHeader({ ...header, driverContactNumber: e.target.value })} placeholder="+255..." className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11 font-medium" />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Seal No#</Label>
              <Input value={header.sealNo} onChange={(e) => setHeader({ ...header, sealNo: e.target.value })} placeholder="Seal Identifier" className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11 font-medium" />
            </div>

            <div className="space-y-2 lg:col-span-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Logistics Remarks</Label>
              <Input value={header.remarks} onChange={(e) => setHeader({ ...header, remarks: e.target.value })} placeholder="Special handling notes..." className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11" />
            </div>
          </div>
        </div>

        {/* Item Allocation Table Card */}
        <div className="bg-white rounded-[24px] border border-[#E2E8F0] p-8 shadow-sm">
          <h2 className="text-base font-bold text-[#0F172A] mb-8 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[10px] font-bold text-[#64748B]">3</span>
            Allocation & Quantities
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-[#F8FAFC]/50 transition-colors">
                  <th className="text-left p-4 text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Product Description</th>
                  <th className="text-center p-4 text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Requested Qty</th>
                  <th className="text-center p-4 text-[10px] font-bold uppercase tracking-widest text-[#059669]">Allocated Qty *</th>
                  <th className="text-center p-4 text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">UOM</th>
                  <th className="text-right p-4 text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Line Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {items.length > 0 ? (
                  items.map((item) => (
                    <tr key={item.id} className="hover:bg-[#F8FAFC]/30 transition-colors">
                      <td className="p-4 py-6 font-bold text-[#0F172A]">
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
                      <td className="p-4 text-center text-[#64748B] font-medium">{item.requestQty.toLocaleString()}</td>
                      <td className="p-4 text-center">
                        <Input
                          type="number"
                          value={item.deliveryQty}
                          onChange={(e) => updateDeliveryQty(item.id, parseFloat(e.target.value) || 0)}
                          className="w-24 mx-auto bg-white border-[#E2E8F0] rounded-xl h-10 text-center font-black text-[#059669]"
                        />
                      </td>
                      <td className="p-4 text-center text-[#94A3B8] font-black uppercase text-xs">{item.uom}</td>
                      <td className="p-4 text-right font-black text-[#0F172A] tabular-nums tracking-tighter">
                        TZS {item.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-16 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <ClipboardList className="w-12 h-12 text-[#E2E8F0]" />
                        <p className="text-[#94A3B8] font-bold text-sm">Select a Valid Sales Order Reference to load allocation grid.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Supporting Documents Section */}
          <SupportingDoc 
            files={files} 
            onFilesChange={setFiles} 
          />
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

export default function CreateDNPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-24 min-h-screen text-slate-400 font-bold animate-pulse uppercase tracking-widest">Initialising Premium Delivery Suite...</div>}>
      <CreateDNContent />
    </Suspense>
  );
}
