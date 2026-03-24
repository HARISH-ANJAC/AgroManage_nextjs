"use client";

import { useState } from "react";
import { Plus, Search, Eye, Pencil, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useRouter } from 'next/navigation';
import { usePurchaseOrders } from "@/hooks/useStoreData";

import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";

const statusColors: Record<string, string> = {
    Approved: "bg-success/10 text-success border-success/30",
    Submitted: "bg-warning/10 text-warning border-warning/30",
    Completed: "bg-success/10 text-success border-success/30",
    Draft: "bg-muted text-muted-foreground border-border",
    "In-Approval": "bg-warning/10 text-warning border-warning/30",
    Rejected: "bg-destructive/10 text-destructive border-destructive/30",
};

export default function QuotationsRFQPage() {
    const { data: orders, isLoading, remove } = usePurchaseOrders();
    const [search, setSearch] = useState("");
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const navigate = useRouter();

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 space-y-4 min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                <p className="text-sm text-muted-foreground animate-pulse">Loading Quotations{`(RFQ)`}...</p>
            </div>
        );
    }

    const filtered = (orders || []).filter((o: any) =>
        (o.poNumber || o.poRefNo || "").toLowerCase().includes(search.toLowerCase()) ||
        (o.supplier || "").toLowerCase().includes(search.toLowerCase())
    );

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await remove(deleteId);
            setDeleteId(null);
            toast.success("RFQ deleted successfully");
        } catch (e) {
            toast.error("Failed to delete RFQ");
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Purchase Quotations (RFQ)</h1>
                    <p className="text-sm text-muted-foreground">Manage requests for quotations from suppliers</p>
                </div>
                <Button onClick={() => navigate.push("/quotations-rfq/create")} className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" /> New RFQ
                </Button>
            </div>

            <div className="bg-card rounded-xl border p-6">
                <div className="relative mb-4 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search RFQ..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="p-3 w-8"><input type="checkbox" className="rounded" /></th>
                                <th className="text-left p-3 font-semibold text-muted-foreground uppercase text-xs">Actions</th>
                                <th className="text-left p-3 font-semibold text-muted-foreground uppercase text-xs">RFQ Number</th>
                                <th className="text-left p-3 font-semibold text-muted-foreground uppercase text-xs">Date</th>
                                <th className="text-left p-3 font-semibold text-muted-foreground uppercase text-xs">Supplier</th>
                                <th className="text-left p-3 font-semibold text-muted-foreground uppercase text-xs">Amount</th>
                                <th className="text-left p-3 font-semibold text-muted-foreground uppercase text-xs">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((o: any) => (
                                <tr key={o.id} className="border-b hover:bg-muted/30">
                                    <td className="p-3"><input type="checkbox" className="rounded" /></td>
                                    <td className="p-3">
                                        <div className="flex gap-1.5">
                                            <button className="p-1 rounded hover:bg-muted"><Eye className="w-4 h-4 text-muted-foreground" /></button>
                                            <button className="p-1 rounded hover:bg-muted"><FileText className="w-4 h-4 text-muted-foreground" /></button>
                                            <button onClick={() => navigate.push(`/purchase-orders/create?id=${o.id}`)} className="p-1 rounded hover:bg-muted"><Pencil className="w-4 h-4 text-muted-foreground" /></button>
                                            <button onClick={() => setDeleteId(o.id)} className="p-1 rounded hover:bg-destructive/10"><Trash2 className="w-4 h-4 text-destructive" /></button>
                                        </div>
                                    </td>
                                    <td className="p-3 font-mono text-xs font-medium">{o.poNumber || o.poRefNo}</td>
                                    <td className="p-3">{o.date || o.poDate}</td>
                                    <td className="p-3">{o.supplier}</td>
                                    <td className="p-3 text-xs">{o.store}</td>
                                    <td className="p-3">{o.type || o.purchaseType || "Local"}</td>
                                    <td className="p-3">{o.payment || o.paymentMode || "Bank Transfer"}</td>
                                    <td className="p-3 font-medium">${(o.amount || o.finalAmount || 0).toLocaleString()}</td>
                                    <td className="p-3"><Badge variant="outline" className={statusColors[o.status] || ""}>{o.status}</Badge></td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr><td colSpan={10} className="p-8 text-center text-muted-foreground">No RFQ found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete this RFQ. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
