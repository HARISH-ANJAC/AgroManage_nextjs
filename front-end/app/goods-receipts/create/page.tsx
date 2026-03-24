"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo, Suspense } from "react";
import { toast } from "sonner";
import { ArrowLeft, Save, Send, CheckCircle2, Info, Truck, User, Package, Calendar, Warehouse as WarehouseIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMasterData } from "@/hooks/useMasterData";
import { usePurchaseOrderStore } from "@/hooks/usePurchaseOrderStore";
import { useGoodsReceiptStore } from "@/hooks/useGoodsReceiptStore";

interface GRNItem {
  id: number;
  productName: string;
  poQty: number;
  receivedQty: number;
  uom: string;
  qtyPerPack: number;
  packing: string;
  qualityCheck: string;
  condition: string;
  remarks: string;
}

function CreateGRNContent() {
  const navigate = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const today = new Date().toISOString().split("T")[0];

  // Master Data
  const { orders: pos } = usePurchaseOrderStore();
  const { data: stores } = useMasterData("stores");
  const { addGRN, updateGRN, getGRNById } = useGoodsReceiptStore();

  const [header, setHeader] = useState({
    grnRefNo: `GRN/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, "0")}/001`,
    grnDate: today,
    poRefNo: "",
    supplierId: "",
    supplierName: "",
    companyId: "",
    grnStoreId: "",
    driverName: "",
    driverContact: "",
    vehicleNo: "",
    containerNo: "",
    sealNo: "",
    status: "Received",
  });

  const [items, setItems] = useState<GRNItem[]>([]);

  // Effect to load items when PO is selected
  useEffect(() => {
    // If editing, we skip the auto-populator unless specifically requested or if data is missing
    if (editId) return;

    if (header.poRefNo) {
      const selectedPO = pos.find((p: any) => (p.header?.poRefNo || p.poRefNo) === header.poRefNo);
      
      if (selectedPO) {
        // Automatically link the backend identifiers
        setHeader(prev => ({
           ...prev,
           supplierId: selectedPO.header?.supplierId || selectedPO.supplierId || "",
           supplierName: selectedPO.header?.supplier || selectedPO.supplier || "",
           companyId: selectedPO.header?.companyId || selectedPO.companyId || "",
        }));
      }

      if (selectedPO && selectedPO.items) {
        const grnItems = selectedPO.items.map((item: any, index: number) => ({
          id: index + 1,
          productName: item.product || item.productName || "Product",
          poQty: item.totalQty || item.quantity || 0,
          receivedQty: item.totalQty || item.quantity || 0,
          uom: item.uom || "KG",
          qtyPerPack: item.qtyPerPack || 0,
          packing: item.packing || "",
          qualityCheck: "Good",
          condition: "Perfect",
          remarks: "",
        }));
        setItems(grnItems);
      } else {
        // Mock items if selectedPO does not have items (for demo)
        setItems([
          { 
            id: 1, 
            productName: "Premium White Maize", 
            poQty: 500, 
            receivedQty: 500, 
            uom: "KG",
            qtyPerPack: 50,
            packing: "Bags",
            qualityCheck: "Good", 
            condition: "Perfect", 
            remarks: "" 
          }
        ]);
      }
    }
  }, [header.poRefNo, pos, editId]);

  // Load GRN for Editing
  useEffect(() => {
    if (editId) {
      const existing = getGRNById(editId);
      if (existing) {
        setHeader({
          grnRefNo: existing.grnRefNo || "",
          grnDate: existing.grnDate ? new Date(existing.grnDate).toISOString().split('T')[0] : today,
          poRefNo: existing.poRefNo || "",
          supplierId: existing.supplierId || "",
          supplierName: existing.supplierName || "",
          companyId: existing.companyId || "",
          grnStoreId: existing.grnStoreId || "",
          driverName: existing.driverName || "",
          driverContact: existing.driverContact || "",
          vehicleNo: existing.vehicleNo || "",
          containerNo: existing.containerNo || "",
          sealNo: existing.sealNo || "",
          status: existing.status || "Received",
        });
        setItems(existing.items || []);
      } else {
        toast.error("GRN not found.");
      }
    }
  }, [editId, getGRNById, today]);

  const updateItem = (id: number, field: string, value: string | number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleGenerateGRN = async () => {
    if (!header.poRefNo) {
      toast.error("Please select a PO Reference");
      return;
    }
    if (!header.grnStoreId) {
      toast.error("Please select a Warehouse/Store");
      return;
    }

    let resolvedSupplierId = header.supplierId;
    let resolvedCompanyId = header.companyId;

    const selectedPO = pos.find((p: any) => (p.header?.poRefNo || p.poRefNo) === header.poRefNo);
    if (selectedPO) {
        resolvedSupplierId = selectedPO.header?.supplierId || selectedPO.supplierId || selectedPO.header?.supplier || selectedPO.supplier || resolvedSupplierId;
        resolvedCompanyId = selectedPO.header?.companyId || selectedPO.companyId || selectedPO.header?.company || selectedPO.company || resolvedCompanyId;
    }

    // Validation: Check Qty ≤ PO Qty
    for (const item of items) {
      if (item.receivedQty > item.poQty) {
        toast.error(`Received quantity for ${item.productName} (${item.receivedQty}) cannot exceed PO quantity (${item.poQty})`);
        return;
      }
      if (item.receivedQty < 0) {
        toast.error(`Received quantity for ${item.productName} cannot be negative`);
        return;
      }
    }

    try {
      const payload = {
        ...header,
        supplierId: resolvedSupplierId,
        companyId: resolvedCompanyId,
        items,
        audit: {
          user: "Admin", // Should come from auth context
          macAddress: "MAC-ADDR-GRN"
        }
      };
      
      if (editId) {
        updateGRN(editId, payload);
        toast.success("Goods Receipt Note updated successfully!");
      } else {
        addGRN(payload);
        toast.success("Goods Receipt Note generated successfully!");
      }
      navigate.push("/goods-receipts");
    } catch (error) {
      toast.error("Failed to process GRN");
    }
  };

  return (
    <div className="max-w-full mx-auto pb-20 px-4 sm:px-6">
      {/* Header Section */}
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
                  : "Step 2: Verify Quantity, Quality, and Condition of goods upon arrival"}
              </span>
            </div>
          </div>
        </div>
        <Button 
          onClick={handleGenerateGRN} 
          className="bg-[#1A2E28] hover:bg-[#1A2E28]/90 text-white font-bold rounded-xl px-6 h-11 transition-all active:scale-95 shadow-md shadow-black/10"
        >
          {editId ? <Save className="w-4 h-4 mr-2" /> : <Send className="w-4 h-4 mr-2" />} 
          {editId ? "Save Changes" : "Generate GRN"}
        </Button>
      </div>

      <div className="space-y-6">
        {/* Main Details Card */}
        <div className="bg-white rounded-[24px] border border-[#E2E8F0] p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-10">
            <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">GRN Date</Label>
                <Input type="date" value={header.grnDate} onChange={(e) => setHeader({ ...header, grnDate: e.target.value })} className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11" />
            </div>
            <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">PO Reference*</Label>
                <Select value={header.poRefNo} onValueChange={(v) => setHeader({ ...header, poRefNo: v })}>
                    <SelectTrigger className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11"><SelectValue placeholder="Select PO" /></SelectTrigger>
                    <SelectContent>
                        {pos.map((p: any) => {
                            const refNo = p.header?.poRefNo || p.poRefNo;
                            return refNo ? <SelectItem key={p.id} value={refNo}>{refNo}</SelectItem> : null;
                        })}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Supplier</Label>
                <Input value={header.supplierName} disabled className="bg-[#F1F5F9] border-[#E2E8F0] rounded-xl h-11" />
            </div>
            <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">GRN Store</Label>
                <Select value={header.grnStoreId} onValueChange={(v) => setHeader({ ...header, grnStoreId: v })}>
                    <SelectTrigger className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11"><SelectValue placeholder="Select Store" /></SelectTrigger>
                    <SelectContent>
                        {stores.map((s: any) => <SelectItem key={s.id} value={s.id}>{s.storeName}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Driver Name</Label>
                <Input value={header.driverName} onChange={(e) => setHeader({ ...header, driverName: e.target.value })} placeholder="Enter Name" className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11" />
            </div>
            <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Driver Contact</Label>
                <Input value={header.driverContact} onChange={(e) => setHeader({ ...header, driverContact: e.target.value })} placeholder="Enter Contact" className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11" />
            </div>
            <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Vehicle No</Label>
                <Input value={header.vehicleNo} onChange={(e) => setHeader({ ...header, vehicleNo: e.target.value })} placeholder="Enter Vehicle No" className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11" />
            </div>
            <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Container No</Label>
                <Input value={header.containerNo} onChange={(e) => setHeader({ ...header, containerNo: e.target.value })} placeholder="Enter Container No" className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11" />
            </div>
            <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Seal No</Label>
                <Input value={header.sealNo} onChange={(e) => setHeader({ ...header, sealNo: e.target.value })} placeholder="Enter Seal No" className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11" />
            </div>
            <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Status</Label>
                <Select value={header.status} onValueChange={(v) => setHeader({ ...header, status: v })}>
                    <SelectTrigger className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Received">Received</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          </div>

          {/* Items Section */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-[#F8FAFC]/30">
                  <th className="text-left p-4 text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Product</th>
                  <th className="text-center p-4 text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">PO Qty</th>
                  <th className="text-center p-4 text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Received Qty *</th>
                  <th className="text-center p-4 text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">UOM</th>
                  <th className="text-center p-4 text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Qty/Pack</th>
                  <th className="text-center p-4 text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Packing</th>
                </tr>
              </thead>
              <tbody>
                {items.length > 0 ? (
                  items.map((item) => (
                    <tr key={item.id} className="border-b transition-colors hover:bg-[#F8FAFC]/50">
                      <td className="p-4 font-bold text-[#0F172A]">{item.productName}</td>
                      <td className="p-4 text-center font-medium text-[#64748B]">{item.poQty}</td>
                      <td className="p-4 text-center">
                        <Input 
                          type="number" 
                          value={item.receivedQty}
                          onChange={(e) => updateItem(item.id, "receivedQty", Number(e.target.value))}
                          className="w-24 mx-auto bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-10 text-center font-bold"
                        />
                      </td>
                      <td className="p-4 text-center text-[#64748B] font-medium">{item.uom}</td>
                      <td className="p-4 text-center text-[#64748B] font-medium">{item.qtyPerPack}</td>
                      <td className="p-4 text-center text-[#64748B] font-medium">{item.packing}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-[#94A3B8] font-medium">
                      Select a PO Reference to load item details
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

export default function CreateGRNPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-12 min-h-screen text-muted-foreground animate-pulse">Loading GRN interface...</div>}>
      <CreateGRNContent />
    </Suspense>
  );
}
