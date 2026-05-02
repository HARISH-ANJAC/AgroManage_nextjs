"use client";

import { useState, useMemo, useEffect } from "react";
import { useTrialBalanceStore } from "@/hooks/useTrialBalanceStore";
import { toast } from "sonner";
import {
  Search,
  FileText,
  Eye,
  Trash2,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  ArrowRightLeft,
  Filter,
  Download,
  BookOpen,
  Info,
  Layers,
  Building2,
  Clock,
  History,
  AlertCircle,
  Save
} from "lucide-react";

function fmt(date: string | Date | null) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function fmtNum(n: any) {
  return Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ── Detail Drawer ────────────────────────────────────────────────────────────
function TrialBalanceDrawer({ refNo, onClose, onDelete }: { refNo: string; onClose: () => void; onDelete: () => void }) {
  const { getSavedTrialBalanceById } = useTrialBalanceStore();
  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    getSavedTrialBalanceById(refNo).then((d) => { setDetail(d); setLoading(false); });
  }, [refNo, getSavedTrialBalanceById]);

  const totalDebit = Number(detail?.header?.TOTAL_DEBIT || 0);
  const totalCredit = Number(detail?.header?.TOTAL_CREDIT || 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

  return (
    <div className="fixed inset-0 z-50 flex animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="flex-1 bg-slate-900/40 backdrop-blur-[2px]" onClick={onClose} />

      {/* Panel */}
      <div className="w-full max-w-[800px] bg-white border-l border-slate-200 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BookOpen size={14} className="text-primary" />
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Trial Balance Snapshot</p>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">{refNo}</h2>
          </div>
          <div className="flex items-center gap-2">
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-semibold transition-all border border-rose-100"
              >
                <Trash2 size={14} />
                Delete
              </button>
            ) : (
              <div className="flex items-center gap-2 animate-in zoom-in-95 duration-200">
                <button onClick={() => setConfirmDelete(false)} className="px-3.5 py-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-semibold transition-all">
                  Cancel
                </button>
                <button onClick={onDelete} className="px-3.5 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700 text-xs font-semibold shadow-lg shadow-rose-200 transition-all">
                  Confirm
                </button>
              </div>
            )}
            <button onClick={onClose} className="ml-2 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all">
              <XCircle size={20} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <div className="animate-spin w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full" />
            <p className="text-sm text-slate-400 font-medium">Fetching details...</p>
          </div>
        ) : !detail ? (
          <div className="flex-1 flex items-center justify-center text-slate-400 italic">Snapshot not found</div>
        ) : (
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {/* Meta Cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "As of Date", value: fmt(detail.header.AS_OF_DATE), icon: Calendar },
                { label: "Financial Year", value: detail.header.FINANCIAL_YEAR ?? "—", icon: Layers },
                { label: "Created Date", value: fmt(detail.header.CREATED_DATE), icon: Clock },
                { label: "Created By", value: detail.header.CREATED_BY ?? "System", icon: User },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white border border-slate-100 text-slate-400 shadow-sm">
                    <Icon size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{label}</p>
                    <div className="text-sm text-slate-700 font-semibold">{value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Balance Status */}
            <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-semibold border ${isBalanced ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-rose-50 border-rose-100 text-rose-700"}`}>
              {isBalanced ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span>{isBalanced ? "Trial Balance Snapshot is perfectly balanced" : "Trial Balance is UNBALANCED — Out of sync by " + fmtNum(Math.abs(totalDebit - totalCredit))}</span>
            </div>

            {/* Ledger Table */}
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Snapshot Accounts Detail</p>
                <div className="flex gap-4 text-[10px] font-bold uppercase">
                  <span className="text-blue-600">DR: {fmtNum(totalDebit)}</span>
                  <span className="text-emerald-600">CR: {fmtNum(totalCredit)}</span>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase tracking-wider">
                      <th className="text-left px-4 py-3 font-bold">Ledger Account</th>
                      <th className="text-right px-4 py-3 font-bold">Opening Dr</th>
                      <th className="text-right px-4 py-3 font-bold">Opening Cr</th>
                      <th className="text-right px-4 py-3 font-bold">Period Dr</th>
                      <th className="text-right px-4 py-3 font-bold">Period Cr</th>
                      <th className="text-right px-4 py-3 font-bold text-blue-600 bg-blue-50/30">Closing Dr</th>
                      <th className="text-right px-4 py-3 font-bold text-emerald-600 bg-emerald-50/30">Closing Cr</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {detail.details.map((d: any, i: number) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-700 group-hover:text-primary transition-colors">{d.ledgerName ?? `Account #${d.ledgerId}`}</div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase">{d.ledgerType ?? "—"}</span>
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-[11px] text-slate-500">{Number(d.openingDebit) > 0 ? fmtNum(d.openingDebit) : "—"}</td>
                        <td className="px-4 py-3 text-right font-mono text-[11px] text-slate-500">{Number(d.openingCredit) > 0 ? fmtNum(d.openingCredit) : "—"}</td>
                        <td className="px-4 py-3 text-right font-mono text-[11px] text-slate-600">{Number(d.periodDebit) > 0 ? fmtNum(d.periodDebit) : "—"}</td>
                        <td className="px-4 py-3 text-right font-mono text-[11px] text-slate-600">{Number(d.periodCredit) > 0 ? fmtNum(d.periodCredit) : "—"}</td>
                        <td className="px-4 py-3 text-right font-mono font-bold text-blue-600 bg-blue-50/10">{Number(d.closingDebit) > 0 ? fmtNum(d.closingDebit) : "—"}</td>
                        <td className="px-4 py-3 text-right font-mono font-bold text-emerald-600 bg-emerald-50/10">{Number(d.closingCredit) > 0 ? fmtNum(d.closingCredit) : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50/80 border-t-2 border-slate-200 font-bold">
                    <tr>
                      <td className="px-4 py-4 text-xs text-slate-500 uppercase tracking-widest">Totals</td>
                      <td colSpan={4}></td>
                      <td className="px-4 py-4 text-right font-mono text-blue-700 text-sm">{fmtNum(totalDebit)}</td>
                      <td className="px-4 py-4 text-right font-mono text-emerald-700 text-sm">{fmtNum(totalCredit)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function TrialBalancesPage() {
  const { savedTrialBalances, isLoading, deleteSavedTrialBalance, getLiveTrialBalance, saveTrialBalance } = useTrialBalanceStore();
  const [search, setSearch] = useState("");
  const [selectedRef, setSelectedRef] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const PER_PAGE = 15;

  const filtered = useMemo(() => {
    let list = savedTrialBalances as any[];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((tb) =>
        (tb.TB_REF_NO ?? "").toLowerCase().includes(q) ||
        (tb.FINANCIAL_YEAR ?? "").toLowerCase().includes(q) ||
        (tb.CREATED_BY ?? "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [savedTrialBalances, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleDelete = async (refNo: string) => {
    try {
      await deleteSavedTrialBalance(refNo);
      toast.success(`Trial Balance ${refNo} has been deleted.`);
      setSelectedRef(null);
    } catch {
      toast.error("Deletion failed. Ensure you have proper permissions.");
    }
  };

  const handleGenerateSnapshot = async () => {
    if (!confirm("Are you sure you want to generate and freeze a live Trial Balance snapshot?")) return;

    setIsGenerating(true);
    try {
      // Step 1: Fetch Live Balances (usually you'd select a company ID if multi-tenant)
      const liveData = await getLiveTrialBalance(1);

      // Step 2: Format for saving
      const payload = {
        companyId: 1,
        financialYear: new Date().getFullYear().toString(),
        asOfDate: new Date().toISOString(),
        details: liveData.map((d: any) => ({
          ledgerId: d.ledgerId,
          openingDebit: 0,
          openingCredit: 0,
          periodDebit: d.debit,
          periodCredit: d.credit,
          closingDebit: d.closingBalance >= 0 ? d.closingBalance : 0,
          closingCredit: d.closingBalance < 0 ? Math.abs(d.closingBalance) : 0,
          remarks: null
        })),
        audit: { user: "Admin", macAddress: "00:00:00:00:00" }
      };

      // Step 3: Save the snapshot
      await saveTrialBalance(payload);
      toast.success("Live Trial Balance snapshot has been successfully generated and saved!");
      setPage(1);
    } catch (err: any) {
      toast.error(err.message || "Failed to generate Trial Balance");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Page Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-xl bg-primary/10 text-primary shadow-sm border border-primary/5">
                <History size={20} />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Trial Balance</h1>
            </div>
            <p className="text-slate-500 font-medium max-w-2xl">
              Audit and track frozen Trial Balance records across financial periods.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-sm">
            <div className="text-center px-4 border-r border-slate-200">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Total</p>
              <p className="text-2xl font-black text-slate-800">{(savedTrialBalances as any[]).length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        {/* Toolbar */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by reference, financial year, or creator..."
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-5 py-3.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all placeholder:text-slate-400"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={handleGenerateSnapshot}
              disabled={isGenerating}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 disabled:opacity-50"
            >
              {isGenerating ? (
                <div className="animate-spin w-4 h-4 border-2 border-white/20 border-t-white rounded-full" />
              ) : (
                <Save size={16} />
              )}
              {isGenerating ? "Generating..." : "Generate Now "}
            </button>
          </div>
        </div>

        {/* Entries Table */}
        <div className="bg-white rounded-4xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50/80 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-200">
                  <th className="text-left px-8 py-5">TB Reference</th>
                  <th className="text-left px-8 py-5">As Of Date</th>
                  <th className="text-left px-8 py-5">Financial Year</th>
                  <th className="text-right px-8 py-5">Total Debit</th>
                  <th className="text-right px-8 py-5">Total Credit</th>
                  <th className="text-center px-8 py-5">Status</th>
                  <th className="text-center px-8 py-5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {Array.from({ length: 7 }).map((__, j) => (
                        <td key={j} className="px-8 py-6"><div className="h-4 bg-slate-100 rounded-lg w-full" /></td>
                      ))}
                    </tr>
                  ))
                ) : paged.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-8 py-32 text-center">
                      <div className="inline-flex items-center justify-center p-6 rounded-full bg-slate-50 text-slate-300 mb-4 border border-slate-100">
                        <BookOpen size={48} strokeWidth={1} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-800">No trial balance found</h3>
                      <p className="text-slate-400 mt-2 font-medium">Generate a new snapshot using the button above.</p>
                    </td>
                  </tr>
                ) : (
                  paged.map((tb: any) => (
                    <tr
                      key={tb.TB_REF_NO}
                      className="group hover:bg-slate-50/50 transition-all cursor-pointer"
                      onClick={() => setSelectedRef(tb.TB_REF_NO)}
                    >
                      <td className="px-8 py-6">
                        <span className="font-mono text-xs font-bold text-primary bg-primary/5 px-2.5 py-1 rounded-lg group-hover:bg-primary group-hover:text-white transition-all">
                          {tb.TB_REF_NO}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-slate-700 font-bold">{fmt(tb.AS_OF_DATE)}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">{tb.CREATED_BY ?? "System"}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 font-bold text-slate-600">{tb.FINANCIAL_YEAR ?? "—"}</td>
                      <td className="px-8 py-6 text-right font-mono font-bold text-blue-600 bg-blue-50/10">
                        {fmtNum(tb.TOTAL_DEBIT)}
                      </td>
                      <td className="px-8 py-6 text-right font-mono font-bold text-emerald-600 bg-emerald-50/10">
                        {fmtNum(tb.TOTAL_CREDIT)}
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                          {tb.STATUS_ENTRY ?? "Finalized"}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setSelectedRef(tb.TB_REF_NO)}
                            className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-primary hover:text-white transition-all"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (!confirm(`Are you sure you want to permanently delete trial balance ${tb.TB_REF_NO}?`)) return;
                              await handleDelete(tb.TB_REF_NO);
                            }}
                            className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-500 hover:text-white transition-all"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-8 py-6 bg-slate-50/50 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Viewing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length} entries
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed shadow-sm transition-all"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="flex items-center gap-1.5 px-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pg = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                    if (pg > totalPages) return null;
                    return (
                      <button
                        key={pg}
                        onClick={() => setPage(pg)}
                        className={`w-9 h-9 rounded-xl text-xs font-black transition-all ${pg === page ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-white text-slate-400 border border-slate-200 hover:bg-slate-50"}`}
                      >
                        {pg}
                      </button>
                    );
                  })}
                </div>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed shadow-sm transition-all"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Drawer */}
      {selectedRef && (
        <TrialBalanceDrawer
          refNo={selectedRef}
          onClose={() => setSelectedRef(null)}
          onDelete={() => handleDelete(selectedRef)}
        />
      )}
    </div>
  );
}
