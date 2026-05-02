"use client";

import { useState, useMemo, useEffect } from "react";
import { useInventoryStore } from "@/hooks/useInventoryStore";
import { useMasterData } from "@/hooks/useMasterData";
import { toast } from "sonner";
import {
  Search,
  Package,
  Warehouse,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Filter,
  Download,
  Info,
  Clock,
  LayoutGrid,
  TrendingUp,
  History,
  FileSpreadsheet
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

function fmt(date: string | Date | null) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function fmtQty(n: any) {
  return Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function StockLedgerPage() {
  const { getStockLedger } = useInventoryStore();
  const { data: stores = [] } = useMasterData("stores");
  const { data: products = [] } = useMasterData("products");

  const [selectedStoreId, setSelectedStoreId] = useState<string>("");
  const [selectedProductId, setSelectedProductId] = useState<string>("all");
  const [reportData, setReportData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (selectedStoreId) {
      setIsLoading(true);
      getStockLedger(Number(selectedStoreId), selectedProductId === "all" ? undefined : Number(selectedProductId))
        .then(data => {
          setReportData(data);
          setIsLoading(false);
        })
        .catch(() => {
          toast.error("Failed to fetch stock ledger");
          setIsLoading(false);
        });
    } else {
      setReportData([]);
    }
  }, [selectedStoreId, selectedProductId, getStockLedger]);

  const filtered = useMemo(() => {
    if (!search.trim()) return reportData;
    const q = search.toLowerCase();
    return reportData.filter(r =>
      (r.refNo ?? "").toLowerCase().includes(q) ||
      (r.remarks ?? "").toLowerCase().includes(q) ||
      (r.type ?? "").toLowerCase().includes(q)
    );
  }, [reportData, search]);

  const ledgerWithBalance = useMemo(() => {
    let balance = 0;
    // Data is already sorted ASC by date from server
    return filtered.map(t => {
      balance += (Number(t.inQty) - Number(t.outQty));
      return { ...t, runningBalance: balance };
    }).reverse(); // Latest at top for UI
  }, [filtered]);

  const totals = useMemo(() => {
    return reportData.reduce((acc, t) => ({
      in: acc.in + Number(t.inQty),
      out: acc.out + Number(t.outQty)
    }), { in: 0, out: 0 });
  }, [reportData]);

  const currentStock = totals.in - totals.out;

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 px-8 py-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-200 border border-emerald-500">
                <Package size={22} />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Stock Ledger</h1>
            </div>
            <p className="text-slate-500 font-medium max-w-2xl ml-1">
              Track item-wise inventory movements across different stores and warehouses.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <div className="w-full sm:w-64">
              <Select value={selectedStoreId} onValueChange={setSelectedStoreId}>
                <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-slate-50 font-bold text-slate-700 shadow-sm">
                  <Warehouse className="size-4 mr-2 text-slate-400" />
                  <SelectValue placeholder="Select Store" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-200 shadow-xl">
                  {stores.map((s: any) => (
                    <SelectItem key={s.id} value={String(s.id)} className="py-2.5 font-medium">
                      {s.storeName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-64">
              <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-slate-50 font-bold text-slate-700 shadow-sm">
                  <Package className="size-4 mr-2 text-slate-400" />
                  <SelectValue placeholder="All Products" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-200 shadow-xl">
                  <SelectItem value="all" className="py-2.5 font-bold text-emerald-600 italic">All Products Combined</SelectItem>
                  {products.map((p: any) => (
                    <SelectItem key={p.id} value={String(p.id)} className="py-2.5 font-medium">
                      {p.productName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" className="h-12 rounded-2xl border-slate-200 bg-white font-bold text-slate-600 hover:bg-slate-50 gap-2 w-full sm:w-auto px-6">
              <Download size={16} /> Export
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8 space-y-6">
        {!selectedStoreId ? (
          <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 p-24 text-center">
            <div className="inline-flex items-center justify-center p-8 rounded-full bg-slate-50 text-slate-300 mb-6">
              <Warehouse size={64} strokeWidth={1} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Select Store to View Ledger</h3>
            <p className="text-slate-400 mt-2 max-w-md mx-auto font-medium leading-relaxed">
              Choose a store from the dropdown above to analyze stock entries and withdrawals.
            </p>
          </div>
        ) : (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Stock Inward", value: fmtQty(totals.in), icon: ArrowUpRight, color: "text-emerald-600", bg: "bg-emerald-50" },
                { label: "Stock Outward", value: fmtQty(totals.out), icon: ArrowDownLeft, color: "text-rose-600", bg: "bg-rose-50" },
                { label: "Current Stock", value: fmtQty(currentStock), icon: TrendingUp, color: "text-slate-900", bg: "bg-indigo-600 text-white" }
              ].map((stat, i) => (
                <div key={i} className={`rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center justify-between ${stat.bg.includes('indigo-600') ? stat.bg : 'bg-white'}`}>
                  <div>
                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${stat.bg.includes('indigo-600') ? 'text-indigo-200' : 'text-slate-400'}`}>{stat.label}</p>
                    <p className={`text-2xl font-black tracking-tight ${stat.bg.includes('indigo-600') ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-2xl ${stat.bg.includes('indigo-600') ? 'bg-white/10 text-white' : stat.bg + ' ' + stat.color}`}>
                    <stat.icon size={20} />
                  </div>
                </div>
              ))}
            </div>

            {/* Toolbar */}
            <div className="bg-white rounded-4xl p-4 shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter by ref, remarks or type..."
                  className="w-full bg-slate-50 border border-transparent rounded-2xl pl-11 pr-5 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white focus:border-emerald-500/20 transition-all placeholder:text-slate-400"
                />
              </div>
              <div className="flex items-center gap-2 px-2">
                <div className="h-8 w-px bg-slate-100 mx-2 hidden md:block" />
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest hidden sm:block">
                  {filtered.length} Entries
                </p>
              </div>
            </div>

            {/* Ledger Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50/80 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-200">
                      <th className="text-left px-8 py-5">Date</th>
                      <th className="text-left px-8 py-5">Ref No</th>
                      <th className="text-left px-8 py-5">Transaction Type</th>
                      <th className="text-right px-8 py-5">Inward (+)</th>
                      <th className="text-right px-8 py-5">Outward (-)</th>
                      <th className="text-right px-8 py-5">Closing Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i} className="animate-pulse">
                          {Array.from({ length: 6 }).map((__, j) => (
                            <td key={j} className="px-8 py-6"><div className="h-4 bg-slate-50 rounded-lg w-full" /></td>
                          ))}
                        </tr>
                      ))
                    ) : ledgerWithBalance.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-8 py-24 text-center">
                          <div className="inline-flex items-center justify-center p-6 rounded-full bg-slate-50 text-slate-300 mb-4">
                            <History size={40} strokeWidth={1.5} />
                          </div>
                          <h3 className="text-lg font-bold text-slate-800">No History Found</h3>
                          <p className="text-slate-400 mt-2 font-medium">No transactions found for the selected criteria.</p>
                        </td>
                      </tr>
                    ) : (
                      ledgerWithBalance.map((t, idx) => (
                        <tr key={idx} className="group hover:bg-slate-50/50 transition-all">
                          <td className="px-8 py-6">
                            <span className="text-slate-900 font-bold">{fmt(t.date)}</span>
                          </td>
                          <td className="px-8 py-6">
                            <span className="font-mono text-[11px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md inline-block w-fit">{t.refNo}</span>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex flex-col">
                              <span className={`text-[10px] font-bold uppercase w-fit px-2 py-0.5 rounded ${t.type.includes('Inward') ? 'bg-emerald-50 text-emerald-600' :
                                t.type.includes('Outward') ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-600'
                                }`}>
                                {t.type}
                              </span>
                              {t.remarks && <p className="text-[10px] text-slate-400 mt-1 italic max-w-[200px] truncate">{t.remarks}</p>}
                            </div>
                          </td>
                          <td className="px-8 py-6 text-right font-mono font-bold text-emerald-600">
                            {Number(t.inQty) > 0 ? `+${fmtQty(t.inQty)}` : "—"}
                          </td>
                          <td className="px-8 py-6 text-right font-mono font-bold text-rose-600">
                            {Number(t.outQty) > 0 ? `-${fmtQty(t.outQty)}` : "—"}
                          </td>
                          <td className="px-8 py-6 text-right">
                            <span className="font-mono font-black text-slate-900">{fmtQty(t.runningBalance)}</span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  {!isLoading && ledgerWithBalance.length > 0 && (
                    <tfoot className="bg-slate-50/80 font-black text-slate-900 border-t-2 border-slate-200">
                      <tr>
                        <td colSpan={3} className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Movements & Current Position</td>
                        <td className="px-8 py-6 text-right font-mono text-emerald-700 text-lg">+{fmtQty(totals.in)}</td>
                        <td className="px-8 py-6 text-right font-mono text-rose-700 text-lg">-{fmtQty(totals.out)}</td>
                        <td className="px-8 py-6 text-right font-mono text-indigo-600 text-xl bg-indigo-50/30">{fmtQty(currentStock)}</td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
