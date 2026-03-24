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
  ClipboardList
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

function CreateDNContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const today = new Date().toISOString().split("T")[0];

  const { orders: salesOrders } = useSalesOrderStore();
  const { notes, addNote, updateNote } = useDeliveryNoteStore();
  const { data: stores = [] } = useStores();

  const [header, setHeader] = useState({
    deliveryDate: today,
    deliveryNoteRefNo: "",
    soRefNo: "",
    customer: "",
    fromStore: "",
    truckNo: "",
    driverName: "",
    status: "In Transit",
    remarks: ""
  });

  const [items, setItems] = useState<any[]>([]);

  // Load existing data if editing
  useEffect(() => {
    if (editId && notes.length > 0) {
      const existing = notes.find((n: any) => n.id === editId || n.deliveryNoteRefNo === editId);
      if (existing) {
        const h = existing.header || existing;
        setHeader({
          deliveryDate: h.deliveryDate || today,
          deliveryNoteRefNo: h.deliveryNoteRefNo || "",
          soRefNo: h.deliverySourceRefNo || h.soRefNo || "",
          customer: h.customer || "",
          fromStore: h.fromStore || "",
          truckNo: h.truckNo || "",
          driverName: h.driverName || "",
          status: h.status || "In Transit",
          remarks: h.remarks || ""
        });
        if (existing.items) setItems(existing.items);
      }
    }
  }, [editId, notes]);

  // Handle SO Selection
  useEffect(() => {
    if (!editId && header.soRefNo) {
      const selectedSO = salesOrders.find((so: any) =>
        (so.header?.salesOrderRefNo || so.salesOrderRefNo || so.id) === header.soRefNo
      );

      if (selectedSO) {
        setHeader(prev => ({
          ...prev,
          customer: selectedSO.customer || selectedSO.header?.customerName || "N/A",
          fromStore: selectedSO.store || selectedSO.header?.storeName || prev.fromStore || (stores[0]?.storeName || "")
        }));

        const soItems = selectedSO.items || [];
        setItems(soItems.map((item: any, idx: number) => ({
          id: idx + 1,
          productId: item.productId,
          productName: item.productName || item.remarks || "Unknown Product",
          soQty: item.totalQty || 0,
          deliveryQty: item.totalQty || 0,
          uom: item.uom || "KG",
          packing: item.qtyPack || 0,
          rate: item.ratePerQty || item.rate || 0,
          amount: (item.totalQty || 0) * (item.ratePerQty || item.rate || 0)
        })));
      }
    }
  }, [header.soRefNo, salesOrders, editId, stores]);

  const updateDeliveryQty = (id: number, qty: number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const validatedQty = Math.max(0, Math.min(qty, item.soQty));
        return {
          ...item,
          deliveryQty: validatedQty,
          amount: validatedQty * item.rate
        };
      }
      return item;
    }));
  };

  const handleCreateDN = (status: string = "Submitted") => {
    if (!header.soRefNo) {
      toast.error("Please select a Sales Order Reference");
      return;
    }

    const totalProductAmount = items.reduce((sum, i) => sum + i.amount, 0);
    const vatAmount = totalProductAmount * 0.15;
    const finalSalesAmount = totalProductAmount + vatAmount;

    const dnRefNo = editId ? (header.deliveryNoteRefNo || `DN-${Date.now()}`) : `DN-${Date.now()}`;
    const payload = {
      header: {
        ...header,
        deliveryNoteRefNo: dnRefNo,
        deliverySourceRefNo: header.soRefNo,
        totalProductAmount,
        vatAmount,
        finalSalesAmount,
        status: typeof status === "string" ? status : "Submitted"
      },
      items,
      audit: {
        lastModified: new Date().toISOString()
      }
    };

    try {
      if (editId) {
        updateNote(editId, payload);
        toast.success("Delivery Note Updated Successfully!");
      } else {
        addNote(payload);
        toast.success(`Delivery Note ${status === "Draft" ? "Saved as Draft" : "Created"} Successfully!`);
      }
      router.push("/delivery-notes");
    } catch (e) {
      toast.error("Failed to save Delivery Note");
    }
  };

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
              <Select value={header.soRefNo} onValueChange={(v) => setHeader({ ...header, soRefNo: v })}>
                <SelectTrigger className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11 font-bold">
                  <SelectValue placeholder="Select SO" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {salesOrders.map((so: any) => {
                    const ref = so.header?.salesOrderRefNo || so.salesOrderRefNo || so.id;
                    const customerName = so.customer || so.header?.customerName || "N/A";
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
              <Input value={header.customer} disabled className="bg-[#F1F5F9] border-[#E2E8F0] rounded-xl h-11 font-bold italic" placeholder="Auto-populated..." />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Dispatch Status</Label>
              <Select value={header.status} onValueChange={(v) => setHeader({ ...header, status: v })}>
                <SelectTrigger className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11 font-bold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
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
              <Select value={header.fromStore} onValueChange={(v) => setHeader({ ...header, fromStore: v })}>
                <SelectTrigger className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11 font-bold text-[#0F172A]">
                  <SelectValue placeholder="Select Warehouse" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {stores.map((s: any) => <SelectItem key={s.id} value={s.storeName}>{s.storeName}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Truck Plate No#</Label>
              <Input value={header.truckNo} onChange={(e) => setHeader({ ...header, truckNo: e.target.value.toUpperCase() })} placeholder="EX: T 456 DEF" className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11 font-bold placeholder:font-normal uppercase" />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Driver Name</Label>
              <Input value={header.driverName} onChange={(e) => setHeader({ ...header, driverName: e.target.value })} placeholder="Full Name" className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11 font-medium" />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Logistics Remarks</Label>
              <Input value={header.remarks} onChange={(e) => setHeader({ ...header, remarks: e.target.value })} placeholder="Seal #, Trailer #..." className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11" />
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
                  <th className="text-center p-4 text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">SO Qty</th>
                  <th className="text-center p-4 text-[10px] font-bold uppercase tracking-widest text-[#059669]">Allocated Qty *</th>
                  <th className="text-center p-4 text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">UOM</th>
                  <th className="text-center p-4 text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Packing</th>
                  <th className="text-right p-4 text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Line Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {items.length > 0 ? (
                  items.map((item) => (
                    <tr key={item.id} className="hover:bg-[#F8FAFC]/30 transition-colors">
                      <td className="p-4 py-6 font-bold text-[#0F172A]">{item.productName}</td>
                      <td className="p-4 text-center text-[#64748B] font-medium">{item.soQty.toLocaleString()}</td>
                      <td className="p-4 text-center">
                        <Input
                          type="number"
                          value={item.deliveryQty}
                          onChange={(e) => updateDeliveryQty(item.id, parseFloat(e.target.value) || 0)}
                          className="w-24 mx-auto bg-white border-[#E2E8F0] rounded-xl h-10 text-center font-black text-[#059669]"
                        />
                      </td>
                      <td className="p-4 text-center text-[#94A3B8] font-black uppercase text-xs">{item.uom}</td>
                      <td className="p-4 text-center text-[#64748B] font-medium">{item.packing || 0}</td>
                      <td className="p-4 text-right font-black text-[#0F172A] tabular-nums tracking-tighter">
                        TZS {item.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-16 text-center">
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
        </div>


      </div>
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
