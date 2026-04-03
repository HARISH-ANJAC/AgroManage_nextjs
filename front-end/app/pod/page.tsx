"use client";

import { useState, useMemo } from "react";
import { Search, Eye, Truck, User, Calendar, CheckCircle2, Clock, MapPin, Receipt, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useRouter } from 'next/navigation';
import { usePurchaseOrderStore } from "@/hooks/usePurchaseOrderStore";
import { useMasterData } from "@/hooks/useMasterData";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function PODPage() {
  const { orders, isLoading, updatePOD } = usePurchaseOrderStore();
  const { data: suppliers = [] } = useMasterData("suppliers");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [podData, setPodData] = useState({
    deliveryPerson: "",
    deliveryDate: new Date().toISOString().split('T')[0],
    remarks: ""
  });

  const navigate = useRouter();

  const podOrders = useMemo(() => {
    return (orders || []).filter((o: any) => {
      const h = o.header || o;
      // Only show Approved POs for Proof of Delivery
      if (h.STATUS_ENTRY !== 'Approved') return false;

      const matchesSearch = (h.PO_REF_NO || "").toLowerCase().includes(search.toLowerCase());
      return matchesSearch;
    }).sort((a: any, b: any) => new Date(b.PO_DATE).getTime() - new Date(a.PO_DATE).getTime());
  }, [orders, search]);

  const handleOpenPod = (order: any) => {
    const h = order.header || order;
    setSelectedOrder(h);
    setPodData({
      deliveryPerson: h.POD_DELIVERY_PERSON || "",
      deliveryDate: h.POD_DELIVERY_DATE ? new Date(h.POD_DELIVERY_DATE).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      remarks: h.POD_REMARKS || ""
    });
  };

  const handleSavePod = async () => {
    if (!selectedOrder) return;
    try {
      await updatePOD({
        id: selectedOrder.PO_REF_NO,
        ...podData
      });
      toast.success("POD Details Updated Successfully");
      setSelectedOrder(null);
    } catch (e) {
      toast.error("Failed to update POD details");
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-20 px-4 pt-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Truck className="w-6 h-6 text-primary" strokeWidth={2.5} />
            </div>
            Proof of Delivery (POD)
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage and track last-mile delivery details for approved Purchase Orders</p>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden border-t-4 border-t-primary">
        <div className="p-8 border-b border-slate-100 bg-slate-50/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search PO Reference..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 h-12 rounded-2xl bg-white border-slate-200 focus:ring-primary/20 shadow-sm"
            />
          </div>
          <div className="flex gap-4">
            <div className="px-4 py-2 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3">
              <div className="size-8 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Active PODs</span>
                <span className="text-lg font-black text-emerald-900 leading-none">{podOrders.length}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 space-y-4">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)}
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="text-left p-6 font-bold text-[11px] uppercase text-slate-400 tracking-[0.2em] pl-8">Order Details</th>
                  <th className="text-left p-6 font-bold text-[11px] uppercase text-slate-400 tracking-[0.2em]">Supplier</th>
                  <th className="text-left p-6 font-bold text-[11px] uppercase text-slate-400 tracking-[0.2em]">POD Info</th>
                  <th className="text-center p-6 font-bold text-[11px] uppercase text-slate-400 tracking-[0.2em]">Status</th>
                  <th className="text-right p-6 font-bold text-[11px] uppercase text-slate-400 tracking-[0.2em] pr-8">Action</th>
                </tr>
              </thead>
              <tbody>
                {podOrders.map((o: any) => {
                  const h = o.header || o;
                  const supplier = suppliers.find(s => Number(s.id) === Number(h.SUPPLIER_ID))?.supplierName || "ID: " + h.SUPPLIER_ID;
                  const hasPOD = !!h.POD_DELIVERY_PERSON;

                  return (
                    <tr key={h.PO_REF_NO} className="border-b border-slate-50 hover:bg-slate-50/40 transition-all group">
                      <td className="p-6 pl-8">
                        <div className="flex flex-col gap-1.5">
                          <span className="font-black text-slate-900 text-[15px] group-hover:text-primary transition-colors">{h.PO_REF_NO}</span>
                          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                            <Calendar className="w-3 h-3" />
                            {new Date(h.PO_DATE).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                            <User className="w-5 h-5" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800 text-sm">{supplier}</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{h.PURCHASE_TYPE} Purchase</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        {hasPOD ? (
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
                              <Truck className="w-3.5 h-3.5" />
                              {h.POD_DELIVERY_PERSON}
                            </div>
                            <div className="text-[10px] text-slate-400 font-medium">
                              Delivered on {new Date(h.POD_DELIVERY_DATE).toLocaleDateString()}
                            </div>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                            <Clock className="w-3 h-3" />
                            Pending POD
                          </span>
                        )}
                      </td>
                      <td className="p-6 text-center">
                        <Badge className={`rounded-xl px-4 py-1.5 font-bold text-[10px] uppercase tracking-widest shadow-sm ${hasPOD ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                          {hasPOD ? 'Delivered' : 'Ready for POD'}
                        </Badge>
                      </td>
                      <td className="p-6 text-right pr-8">
                        <Button
                          onClick={() => handleOpenPod(o)}
                          variant={hasPOD ? "outline" : "default"}
                          size="sm"
                          className={`rounded-2xl h-10 px-5 font-bold transition-all shadow-md group-hover:shadow-lg ${!hasPOD ? 'bg-primary hover:bg-primary/90' : 'border-slate-200 hover:bg-slate-50'}`}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {hasPOD ? 'Update POD' : 'Update POD'}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                {podOrders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-24 text-center">
                      <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                        <div className="size-20 rounded-[32px] bg-slate-50 flex items-center justify-center text-slate-300 mb-8 border border-slate-100 shadow-inner">
                          <Truck className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">No POD Pending</h3>
                        <p className="text-sm text-slate-500 leading-relaxed font-medium">Only Approved Purchase Orders appear here for delivery tracking and proof of delivery updates.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl rounded-2xl border-none shadow-2xl p-0 overflow-hidden bg-white">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-slate-800">
                Update Proof of Delivery
              </DialogTitle>
            </DialogHeader>
          </div>

          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Delivery Person Name</Label>
                <Input
                  value={podData.deliveryPerson}
                  onChange={e => setPodData({ ...podData, deliveryPerson: e.target.value })}
                  className="h-11 rounded-xl border-slate-200 focus:ring-emerald-500/20 bg-slate-50/30"
                  placeholder="Enter name..."
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Delivery Date</Label>
                <Input
                  type="date"
                  value={podData.deliveryDate}
                  onChange={e => setPodData({ ...podData, deliveryDate: e.target.value })}
                  className="h-11 rounded-xl border-slate-200 focus:ring-emerald-500/20 bg-slate-50/30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">POD Remarks</Label>
              <textarea
                value={podData.remarks}
                onChange={e => setPodData({ ...podData, remarks: e.target.value })}
                className="w-full min-h-[120px] p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm bg-slate-50/30"
                placeholder="Details about delivery status, condition, or exceptions..."
              />
            </div>

            <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100/50">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Receipt className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest leading-none mb-1">Reference Order</span>
                  <span className="text-sm font-bold text-slate-700">{selectedOrder?.PO_REF_NO}</span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button variant="ghost" onClick={() => setSelectedOrder(null)} className="h-10 px-6 rounded-lg font-bold text-slate-500 hover:bg-slate-100">Cancel</Button>
            <Button onClick={handleSavePod} className="h-10 px-8 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-sm">
              Confirm Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
