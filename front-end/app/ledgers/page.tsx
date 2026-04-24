"use client";

import { useState, useMemo, useEffect } from "react";
import { useJournalStore } from "@/hooks/useJournalStore";
import { useMasterData } from "@/hooks/useMasterData";
import { toast } from "sonner";
import {
  Search,
  FileText,
  Eye,
  ChevronLeft,
  ChevronRight,
  Calendar,
  ArrowRightLeft,
  Filter,
  Download,
  BookOpen,
  Info,
  Layers,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Printer,
  Calculator,
  LayoutGrid
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

function fmtNum(n: any) {
  return Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function LedgersPage() {
  const { getLedgerReport } = useJournalStore();
  const { data: ledgersMaster = [], isLoading: masterLoading } = useMasterData("ledger-master");
  const { data: ledgerGroups = [] } = useMasterData("ledger-groups");

  const [selectedLedgerId, setSelectedLedgerId] = useState<string>("all");
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [reportData, setReportData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");

  const filteredLedgers = useMemo(() => {
    if (!selectedGroupId || selectedGroupId === "none") return ledgersMaster;
    return ledgersMaster.filter((l: any) => String(l.ledgerGroupId) === selectedGroupId);
  }, [ledgersMaster, selectedGroupId]);

  const selectedLedger = useMemo(() =>
    ledgersMaster.find((l: any) => String(l.id) === selectedLedgerId),
    [ledgersMaster, selectedLedgerId]
  );

  const selectedGroup = useMemo(() =>
    ledgerGroups.find((g: any) => String(g.id) === selectedGroupId),
    [ledgerGroups, selectedGroupId]
  );

  useEffect(() => {
    const isGroupSelected = selectedGroupId && selectedGroupId !== "none";
    if (isGroupSelected || (selectedLedgerId && selectedLedgerId !== "all")) {
      setIsLoading(true);
      const lid = selectedLedgerId !== "all" ? Number(selectedLedgerId) : undefined;
      const gid = !lid && isGroupSelected ? Number(selectedGroupId) : undefined;

      getLedgerReport(lid, gid)
        .then(data => {
          setReportData(data);
          setIsLoading(false);
        })
        .catch(() => {
          toast.error("Failed to fetch ledger report");
          setIsLoading(false);
        });
    } else {
      setReportData([]);
    }
  }, [selectedLedgerId, selectedGroupId, getLedgerReport]);

  const filtered = useMemo(() => {
    if (!search.trim()) return reportData;
    const q = search.toLowerCase();
    return reportData.filter(r =>
      (r.journalRefNo ?? "").toLowerCase().includes(q) ||
      (r.narration ?? "").toLowerCase().includes(q) ||
      (r.moduleRefNo ?? "").toLowerCase().includes(q)
    );
  }, [reportData, search]);

  // Calculate Running Balance
  const transactionsWithBalance = useMemo(() => {
    let balance = 0;
    // We ordered by DESC in controller, but for running balance we usually need ASC.
    // However, showing the latest at top is better for UI.
    // Let's reverse for calculation, then show what's requested.
    // Standard Ledger: ASC date order.
    const sorted = [...filtered].sort((a, b) => new Date(a.journalDate).getTime() - new Date(b.journalDate).getTime());

    return sorted.map(t => {
      balance += (Number(t.debit) - Number(t.credit));
      return { ...t, runningBalance: balance };
    }).reverse(); // Latest at top
  }, [filtered]);

  const totals = useMemo(() => {
    return reportData.reduce((acc, t) => ({
      debit: acc.debit + Number(t.debit),
      credit: acc.credit + Number(t.credit)
    }), { debit: 0, credit: 0 });
  }, [reportData]);

  const closingBalance = totals.debit - totals.credit;

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Page Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 border border-indigo-500">
                <Calculator size={22} />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">General Ledger</h1>
            </div>
            <p className="text-slate-500 font-medium max-w-2xl ml-1">
              Detailed transaction history and running balance for specific ledger accounts.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <div className="w-full sm:w-64">
              <Select value={selectedGroupId} onValueChange={(val) => {
                setSelectedGroupId(val);
                setSelectedLedgerId("all");
              }}>
                <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-slate-50 font-bold text-slate-700 shadow-sm">
                  <SelectValue placeholder="Common Ledger / Group" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-200 shadow-xl">
                  <SelectItem value="none" className="py-2.5 font-bold text-slate-400">Clear Selection</SelectItem>
                  {ledgerGroups.map((g: any) => (
                    <SelectItem key={g.id} value={String(g.id)} className="py-2.5 font-medium">
                      {g.ledgerGroupName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-64">
              <Select value={selectedLedgerId} onValueChange={setSelectedLedgerId} disabled={!selectedGroupId || selectedGroupId === "none"}>
                <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-slate-50 font-bold text-slate-700 shadow-sm">
                  <SelectValue placeholder="Ledger Account" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-200 shadow-xl">
                  <SelectItem value="all" className="py-2.5 font-bold text-indigo-600">All Group Accounts Combined</SelectItem>
                  {filteredLedgers.map((l: any) => (
                    <SelectItem key={l.id} value={String(l.id)} className="py-2.5 font-medium">
                      {l.ledgerName}
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
        {(!selectedGroupId || selectedGroupId === "none") ? (
          <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 p-24 text-center">
            <div className="inline-flex items-center justify-center p-8 rounded-full bg-slate-50 text-slate-300 mb-6">
              <LayoutGrid size={64} strokeWidth={1} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">No Account Selected</h3>
            <p className="text-slate-400 mt-2 max-w-md mx-auto font-medium leading-relaxed">
              Please select a ledger account from the dropdown above to view its transaction history and financial movements.
            </p>
          </div>
        ) : (
          <>
            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Total Debits", value: fmtNum(totals.debit), icon: ArrowUpRight, color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Total Credits", value: fmtNum(totals.credit), icon: ArrowDownLeft, color: "text-emerald-600", bg: "bg-emerald-50" },
                { label: "Closing Balance", value: fmtNum(Math.abs(closingBalance)), suffix: closingBalance >= 0 ? "Dr" : "Cr", icon: Calculator, color: "text-slate-900", bg: "bg-slate-900 text-white" }
              ].map((stat, i) => (
                <div key={i} className={`rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center justify-between ${stat.bg.includes('slate-900') ? stat.bg : 'bg-white'}`}>
                  <div>
                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${stat.bg.includes('slate-900') ? 'text-slate-400' : 'text-slate-400'}`}>{stat.label}</p>
                    <div className="flex items-baseline gap-2">
                      <p className={`text-2xl font-black tracking-tight ${stat.bg.includes('slate-900') ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
                      {stat.suffix && <span className="text-[10px] font-bold uppercase text-primary bg-primary/10 px-1.5 py-0.5 rounded-md">{stat.suffix}</span>}
                    </div>
                  </div>
                  <div className={`p-3 rounded-2xl ${stat.bg.includes('slate-900') ? 'bg-white/10 text-white' : stat.bg + ' ' + stat.color}`}>
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
                  placeholder="Filter transactions by ref, narration or module..."
                  className="w-full bg-slate-50 border border-transparent rounded-2xl pl-11 pr-5 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white focus:border-indigo-500/20 transition-all placeholder:text-slate-400"
                />
              </div>
              <div className="flex items-center gap-2 px-2">
                <div className="h-8 w-px bg-slate-100 mx-2 hidden md:block" />
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest hidden sm:block">
                  {filtered.length} Transactions
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
                      <th className="text-left px-8 py-5">Reference</th>
                      <th className="text-left px-8 py-5">Description / Narration</th>
                      <th className="text-right px-8 py-5">Debit (DR)</th>
                      <th className="text-right px-8 py-5">Credit (CR)</th>
                      <th className="text-right px-8 py-5">Balance</th>
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
                    ) : transactionsWithBalance.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-8 py-24 text-center">
                          <div className="inline-flex items-center justify-center p-6 rounded-full bg-slate-50 text-slate-300 mb-4">
                            <Clock size={40} strokeWidth={1.5} />
                          </div>
                          <h3 className="text-lg font-bold text-slate-800">No Transactions Found</h3>
                          <p className="text-slate-400 mt-2 font-medium">This account has no movements recorded yet.</p>
                        </td>
                      </tr>
                    ) : (
                      transactionsWithBalance.map((t, idx) => (
                        <tr key={idx} className="group hover:bg-slate-50/50 transition-all">
                          <td className="px-8 py-6">
                            <span className="text-slate-900 font-bold">{fmt(t.journalDate)}</span>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex flex-col">
                              <span className="font-mono text-[11px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md inline-block w-fit mb-1">{t.journalRefNo}</span>
                              <span className="text-[10px] text-slate-400 font-bold uppercase">{t.moduleName} | {t.moduleRefNo}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="max-w-xs">
                              <p className="text-slate-700 font-medium text-xs leading-relaxed">{t.narration || "—"}</p>
                              {t.remarks && <p className="text-[10px] text-slate-400 mt-1 italic">{t.remarks}</p>}
                            </div>
                          </td>
                          <td className="px-8 py-6 text-right font-mono font-bold text-blue-600">
                            {Number(t.debit) > 0 ? fmtNum(t.debit) : "—"}
                          </td>
                          <td className="px-8 py-6 text-right font-mono font-bold text-emerald-600">
                            {Number(t.credit) > 0 ? fmtNum(t.credit) : "—"}
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex flex-col items-end">
                              <span className="font-mono font-black text-slate-900">{fmtNum(Math.abs(t.runningBalance))}</span>
                              <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${t.runningBalance >= 0 ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"}`}>
                                {t.runningBalance >= 0 ? "Dr" : "Cr"}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  {!isLoading && transactionsWithBalance.length > 0 && (
                    <tfoot className="bg-slate-50/80 font-black text-slate-900 border-t-2 border-slate-200">
                      <tr>
                        <td colSpan={3} className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Account Totals & Closing</td>
                        <td className="px-8 py-6 text-right font-mono text-blue-700 text-lg">{fmtNum(totals.debit)}</td>
                        <td className="px-8 py-6 text-right font-mono text-emerald-700 text-lg">{fmtNum(totals.credit)}</td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex flex-col items-end">
                            <span className="font-mono text-xl text-indigo-600">{fmtNum(Math.abs(closingBalance))}</span>
                            <span className="text-[10px] font-black uppercase text-indigo-400">{closingBalance >= 0 ? "Dr Balance" : "Cr Balance"}</span>
                          </div>
                        </td>
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
