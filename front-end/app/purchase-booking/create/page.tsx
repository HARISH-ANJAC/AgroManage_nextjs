"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { ArrowLeft, Save, BookOpen, Info, FileText, Calendar, User, DollarSign, Link as LinkIcon, CheckCircle2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMasterData } from "@/hooks/useMasterData";
import { usePurchaseOrderStore } from "@/hooks/usePurchaseOrderStore";
import { useGoodsReceiptStore } from "@/hooks/useGoodsReceiptStore";
import { usePurchaseBookingStore } from "@/hooks/usePurchaseBookingStore";

function CreatePurchaseBookingContent() {
    const navigate = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get("id");
    const today = new Date().toISOString().split("T")[0];

    // Global Stores
    const { orders: pos } = usePurchaseOrderStore();
    const { grns } = useGoodsReceiptStore();
    const { data: suppliers } = useMasterData("suppliers");
    const { addBooking, updateBooking, getBookingById } = usePurchaseBookingStore();

    const [header, setHeader] = useState({
        purchaseInvoiceRefNo: "",
        invoiceNo: "",
        invoiceDate: today,
        supplier: "",
        supplierId: "",
        store: "",
        currency: "",
        status: "Pending",
        poRefNo: "",
        grnRefNo: "",
        productAmount: 0,
        totalVatAmount: 0,
        finalAmount: 0,
    });

    const [items, setItems] = useState<any[]>([]);

    // Effect to match items and pull header data
    useEffect(() => {
        if (editId) return;

        if (header.poRefNo) {
            const selectedPO = pos.find((p: any) => (p.header?.poRefNo || p.poRefNo) === header.poRefNo);
            if (selectedPO) {
                setHeader(prev => ({
                    ...prev,
                    supplier: selectedPO.header?.supplier || selectedPO.supplier || "",
                    supplierId: selectedPO.header?.supplierId || selectedPO.supplierId || "",
                    store: selectedPO.header?.store || selectedPO.store || "",
                    currency: selectedPO.header?.currency || selectedPO.currency || "TZS",
                }));

                if (header.grnRefNo) {
                    const selectedGRN = grns.find((g: any) => g.grnRefNo === header.grnRefNo);
                    if (selectedGRN && selectedPO.items) {
                        const matched = selectedPO.items.map((poItem: any, idx: number) => {
                            const grnItem = selectedGRN.items?.find((gi: any) => gi.productName === (poItem.product || poItem.productName));
                            const qty = grnItem?.receivedQty || 0;
                            const rate = poItem.rate || 0;
                            const vatPercent = poItem.vatPercent || 0;
                            const amount = qty * rate;
                            const vatAmount = amount * (vatPercent / 100);

                            return {
                                id: idx + 1,
                                productName: poItem.product || poItem.productName,
                                grnQty: qty,
                                invoiceQty: qty, // Default to GRN Qty
                                uom: poItem.uom || "KG",
                                poRate: rate,
                                invoiceRate: rate, // Default to PO Rate
                                vatPercent: vatPercent,
                                amount: amount + vatAmount,
                                productAmount: amount,
                                vatAmount: vatAmount
                            };
                        });
                        setItems(matched);
                    }
                }
            }
        }
    }, [header.poRefNo, header.grnRefNo, pos, grns, editId]);

    // Recalculate totals when items or invoice rates change
    useEffect(() => {
        const productAmount = items.reduce((sum, item) => sum + (item.invoiceQty * item.invoiceRate), 0);
        const totalVatAmount = items.reduce((sum, item) => sum + (item.invoiceQty * item.invoiceRate * (item.vatPercent / 100)), 0);
        setHeader(prev => ({
            ...prev,
            productAmount,
            totalVatAmount,
            finalAmount: productAmount + totalVatAmount
        }));
    }, [items]);

    // Pre-fill on Edit
    useEffect(() => {
        if (editId) {
            const existing = getBookingById(editId);
            if (existing) {
                setHeader({
                    purchaseInvoiceRefNo: existing.purchaseInvoiceRefNo || "",
                    invoiceNo: existing.invoiceNo || "",
                    invoiceDate: existing.invoiceDate ? new Date(existing.invoiceDate).toISOString().split('T')[0] : today,
                    supplier: existing.supplier || "",
                    supplierId: existing.supplierId || "",
                    store: existing.store || "",
                    currency: existing.currency || "TZS",
                    status: existing.status || "Pending",
                    poRefNo: existing.poRefNo || "",
                    grnRefNo: existing.grnRefNo || "",
                    productAmount: existing.productAmount || 0,
                    totalVatAmount: existing.totalVatAmount || 0,
                    finalAmount: existing.finalAmount || 0,
                });
                if (existing.items) setItems(existing.items);
            }
        }
    }, [editId, getBookingById, today]);

    const handleBookInvoice = async () => {
        if (!header.invoiceNo) {
            toast.error("Please enter Supplier Invoice Number");
            return;
        }
        if (!header.poRefNo || !header.grnRefNo) {
            toast.error("Please select PO and GRN references");
            return;
        }

        try {
            const payload = {
                ...header,
                purchaseInvoiceRefNo: editId ? (getBookingById(editId)?.purchaseInvoiceRefNo) : `PI/${String(new Date().getMonth() + 1).padStart(2, "0")}/${String(Math.floor(Math.random() * 900) + 100)}`,
                items,
                audit: { user: "Admin", macAddress: "MAC-ADDR-BOOKING" }
            };

            if (editId) {
                updateBooking(editId, payload);
                toast.success("Purchase Invoice updated successfully!");
            } else {
                addBooking(payload);
                toast.success("Purchase Invoice booked successfully!");
            }
            navigate.push("/purchase-booking");
        } catch (error) {
            toast.error("Failed to process transaction.");
        }
    };

    const updateInvoiceRate = (id: number, rate: number) => {
        setItems(prev => prev.map(item => item.id === id ? { ...item, invoiceRate: rate } : item));
    };

    return (
        <div className="max-w-full mx-auto pb-20 px-4 sm:px-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 mt-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate.push("/purchase-booking")}
                        className="p-2.5 rounded-full border border-border hover:bg-muted transition-colors bg-white shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5 text-foreground" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">
                            {editId ? `Edit Invoice: ${header.purchaseInvoiceRefNo || "PI/03/001"}` : "New Purchase Invoice (3-Way Matching)"}
                        </h1>
                        <div className="flex items-center gap-1.5 mt-1 text-[#059669] font-medium text-[13px]">
                            <Info className="w-4 h-4" />
                            <span>Invoice MUST link to valid PO + GRN. Qty and Rate are validated.</span>
                        </div>
                    </div>
                </div>
                <Button
                    onClick={handleBookInvoice}
                    className="bg-[#1A2E28] hover:bg-[#1A2E28]/90 text-white font-bold rounded-xl px-6 h-11 transition-all active:scale-95 shadow-md shadow-black/10"
                >
                    {editId ? <Save className="w-4 h-4 mr-2" /> : <BookOpen className="w-4 h-4 mr-2" />} 
                    {editId ? "Save Changes" : "Confirm and Book"}
                </Button>
            </div>

            <div className="space-y-6">
                {/* Header Grid */}
                <div className="bg-white rounded-[24px] border border-[#E2E8F0] p-8 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Date</Label>
                            <Input type="date" value={header.invoiceDate} onChange={(e) => setHeader({ ...header, invoiceDate: e.target.value })} className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Supplier Invoice No *</Label>
                            <Input placeholder="Invoice #" value={header.invoiceNo} onChange={(e) => setHeader({ ...header, invoiceNo: e.target.value })} className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11 focus:ring-2 focus:ring-primary/20" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Currency</Label>
                            <Input value={header.currency} disabled className="bg-[#F1F5F9] border-[#E2E8F0] rounded-xl h-11 font-bold" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Status</Label>
                            <Select value={header.status} onValueChange={(v) => setHeader({ ...header, status: v })}>
                                <SelectTrigger className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Approved">Approved</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">PO Reference * (Step 1)</Label>
                            <Select value={header.poRefNo} onValueChange={(v) => setHeader({ ...header, poRefNo: v })}>
                                <SelectTrigger className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11">
                                    <SelectValue placeholder="Select PO" />
                                </SelectTrigger>
                                <SelectContent>
                                    {pos.map((p: any) => {
                                        const refNo = p.header?.poRefNo || p.poRefNo;
                                        const supplier = p.header?.supplier || p.supplier;
                                        return refNo ? <SelectItem key={p.id} value={refNo}>{refNo} - {supplier}</SelectItem> : null;
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">GRN Reference * (Step 2)</Label>
                            <Select value={header.grnRefNo} onValueChange={(v) => setHeader({ ...header, grnRefNo: v })}>
                                <SelectTrigger className="bg-[#F8FAFC]/50 border-[#E2E8F0] rounded-xl h-11">
                                    <SelectValue placeholder="Select GRN" />
                                </SelectTrigger>
                                <SelectContent>
                                    {grns.filter(g => g.poRefNo === header.poRefNo).map((g: any) => (
                                        <SelectItem key={g.id} value={g.grnRefNo}>{g.grnRefNo}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Supplier / Store</Label>
                            <Input value={`${header.supplier} / ${header.store}`} disabled className="bg-[#F1F5F9] border-[#E2E8F0] rounded-xl h-11 text-xs" />
                        </div>
                    </div>

                    {header.poRefNo && header.grnRefNo && (
                        <div className="mt-8 p-4 bg-[#F0FDF4] border border-[#DCFCE7] rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
                            <CheckCircle2 className="w-5 h-5 text-[#166534]" />
                            <span className="text-sm font-bold text-[#166534]">3-Way Match Passed ✓</span>
                        </div>
                    )}
                </div>

                {/* Invoice Lines Table */}
                <div className="bg-white rounded-[24px] border border-[#E2E8F0] p-8 shadow-sm overflow-hidden">
                    <h2 className="text-lg font-bold text-[#0F172A] mb-6">Invoice Lines</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-[#F8FAFC]">
                                    <th className="text-left p-4 text-[10px] font-bold uppercase text-[#94A3B8]">#</th>
                                    <th className="text-left p-4 text-[10px] font-bold uppercase text-[#94A3B8]">Product</th>
                                    <th className="text-center p-4 text-[10px] font-bold uppercase text-[#94A3B8]">GRN Qty</th>
                                    <th className="text-center p-4 text-[10px] font-bold uppercase text-[#94A3B8]">Invoice Qty</th>
                                    <th className="text-center p-4 text-[10px] font-bold uppercase text-[#94A3B8]">UOM</th>
                                    <th className="text-right p-4 text-[10px] font-bold uppercase text-[#94A3B8]">PO Rate</th>
                                    <th className="text-right p-4 text-[10px] font-bold uppercase text-[#94A3B8]">Invoice Rate</th>
                                    <th className="text-center p-4 text-[10px] font-bold uppercase text-[#94A3B8]">VAT %</th>
                                    <th className="text-right p-4 text-[10px] font-bold uppercase text-[#94A3B8]">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.length > 0 ? (
                                    items.map((item, idx) => (
                                        <tr key={idx} className="border-b hover:bg-slate-50/50">
                                            <td className="p-4 text-xs font-bold text-slate-400">{idx + 1}</td>
                                            <td className="p-4 font-bold text-[#0F172A]">{item.productName}</td>
                                            <td className="p-4 text-center font-bold text-[#059669]">{item.grnQty}</td>
                                            <td className="p-4 text-center font-medium text-slate-500">{item.invoiceQty}</td>
                                            <td className="p-4 text-center text-xs font-bold text-slate-400">{item.uom}</td>
                                            <td className="p-4 text-right font-medium text-slate-600">{item.poRate.toLocaleString()}</td>
                                            <td className="p-4 text-right">
                                                <Input 
                                                    type="number" 
                                                    value={item.invoiceRate} 
                                                    onChange={(e) => updateInvoiceRate(item.id, Number(e.target.value))}
                                                    className="w-24 ml-auto h-9 text-right font-bold border-[#E2E8F0] rounded-lg"
                                                />
                                            </td>
                                            <td className="p-4 text-center font-medium text-slate-500">{item.vatPercent}%</td>
                                            <td className="p-4 text-right font-bold text-[#0F172A]">{(item.invoiceQty * item.invoiceRate * (1 + item.vatPercent/100)).toLocaleString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={9} className="p-12 text-center text-slate-400 font-medium">Select PO & GRN to load invoice lines</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Summary Card */}
                <div className="flex justify-end">
                    <div className="w-full md:w-80 bg-[#1A2E28] text-white rounded-[24px] p-8 shadow-xl">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                                <span>Product Amount</span>
                                <span className="text-white">{header.currency} {header.productAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                                <span>Total VAT</span>
                                <span className="text-white">{header.currency} {header.totalVatAmount.toLocaleString()}</span>
                            </div>
                            <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                                <span className="text-sm font-bold">Total Payable</span>
                                <span className="text-xl font-black">{header.currency} {header.finalAmount.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CreatePurchaseBookingPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center p-12 min-h-screen text-muted-foreground animate-pulse">Loading Booking Interface...</div>}>
            <CreatePurchaseBookingContent />
        </Suspense>
    );
}