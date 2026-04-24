"use client";

import { useState, useMemo } from "react";
import { useJournalStore } from "@/hooks/useJournalStore";
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
  AlertCircle
} from "lucide-react";

// ── Module badge colors (Light Theme Optimized) ──────────────────────────────
const MODULE_COLORS: Record<string, { bg: string; text: string; dot: string; border: string }> = {
  PURCHASE_INVOICE:  { bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-500", border: "border-indigo-100" },
  TAX_INVOICE:       { bg: "bg-emerald-50",text: "text-emerald-700",dot: "bg-emerald-500",border: "border-emerald-100" },
  SALES_ORDER:       { bg: "bg-teal-50",   text: "text-teal-700",   dot: "bg-teal-500",   border: "border-teal-100" },
  SALES_PROFORMA:    { bg: "bg-cyan-50",   text: "text-cyan-700",   dot: "bg-cyan-500",   border: "border-cyan-100" },
  CUSTOMER_RECEIPT:  { bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-500",  border: "border-green-100" },
  EXPENSE:           { bg: "bg-rose-50",   text: "text-rose-700",   dot: "bg-rose-500",   border: "border-rose-100" },
  OPENING_BALANCE:   { bg: "bg-amber-50",  text: "text-amber-700",  dot: "bg-amber-500",  border: "border-amber-100" },
};

const DEFAULT_COLOR = { bg: "bg-slate-50", text: "text-slate-700", dot: "bg-slate-500", border: "border-slate-100" };

function ModuleBadge({ module }: { module: string }) {
  const c = MODULE_COLORS[module] ?? DEFAULT_COLOR;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${c.bg} ${c.text} ${c.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {module.replace(/_/g, " ")}
    </span>
  );
}

function fmt(date: string | Date | null) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function fmtNum(n: any) {
  return Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ── Detail Drawer ────────────────────────────────────────────────────────────
function JournalDrawer({ refNo, onClose, onDelete }: { refNo: string; onClose: () => void; onDelete: () => void }) {
  const { getJournalById } = useJournalStore();
  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useState(() => {
    getJournalById(refNo).then((d) => { setDetail(d); setLoading(false); });
  });

  const totalDebit  = detail?.details?.reduce((s: number, d: any) => s + Number(d.debit), 0) ?? 0;
  const totalCredit = detail?.details?.reduce((s: number, d: any) => s + Number(d.credit), 0) ?? 0;
  const isBalanced  = Math.abs(totalDebit - totalCredit) < 0.01;

  return (
    <div className="fixed inset-0 z-50 flex animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="flex-1 bg-slate-900/40 backdrop-blur-[2px]" onClick={onClose} />

      {/* Panel */}
      <div className="w-full max-w-2xl bg-white border-l border-slate-200 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BookOpen size={14} className="text-primary" />
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Journal Entry</p>
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
          <div className="flex-1 flex items-center justify-center text-slate-400 italic">Journal entry not found</div>
        ) : (
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {/* Meta Cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Date",         value: fmt(detail.header.JOURNAL_DATE), icon: Calendar },
                { label: "Module",       value: <ModuleBadge module={detail.header.MODULE_NAME ?? ""} />, icon: Layers },
                { label: "Source Ref",   value: detail.header.MODULE_REF_NO ?? "—", icon: FileText },
                { label: "Created By",   value: detail.header.CREATED_BY ?? "—", icon: User },
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

            {/* Narration */}
            {detail.header.NARRATION && (
              <div className="bg-primary/[0.03] border border-primary/10 rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary/20" />
                <div className="flex items-center gap-2 mb-2">
                  <Info size={14} className="text-primary" />
                  <p className="text-[10px] text-primary/70 font-bold uppercase tracking-widest">Narration</p>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed italic">"{detail.header.NARRATION}"</p>
              </div>
            )}

            {/* Balance Status */}
            <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-semibold border ${isBalanced ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-rose-50 border-rose-100 text-rose-700"}`}>
              {isBalanced ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span>{isBalanced ? "Journal entry is perfectly balanced" : "Entry is UNBALANCED — Out of sync by " + fmtNum(Math.abs(totalDebit - totalCredit))}</span>
            </div>

            {/* Ledger Table */}
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Double Entry Details</p>
                <div className="flex gap-4 text-[10px] font-bold uppercase">
                  <span className="text-blue-600">DR: {fmtNum(totalDebit)}</span>
                  <span className="text-emerald-600">CR: {fmtNum(totalCredit)}</span>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase tracking-wider">
                      <th className="text-left px-5 py-3 font-bold">Ledger Account</th>
                      <th className="text-left px-5 py-3 font-bold">Type</th>
                      <th className="text-right px-5 py-3 font-bold">Debit (DR)</th>
                      <th className="text-right px-5 py-3 font-bold">Credit (CR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {detail.details.map((d: any, i: number) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-5 py-4">
                          <div className="font-semibold text-slate-700 group-hover:text-primary transition-colors">{d.ledgerName ?? `Account #${d.ledgerId}`}</div>
                          {d.remarks && <div className="text-[10px] text-slate-400 mt-0.5">{d.remarks}</div>}
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md uppercase">{d.ledgerType ?? "—"}</span>
                        </td>
                        <td className="px-5 py-4 text-right font-mono font-bold text-blue-600 bg-blue-50/20">{Number(d.debit) > 0 ? fmtNum(d.debit) : "—"}</td>
                        <td className="px-5 py-4 text-right font-mono font-bold text-emerald-600 bg-emerald-50/20">{Number(d.credit) > 0 ? fmtNum(d.credit) : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50/80 border-t-2 border-slate-200 font-bold">
                    <tr>
                      <td colSpan={2} className="px-5 py-4 text-xs text-slate-500 uppercase tracking-widest">Total Trial Balance</td>
                      <td className="px-5 py-4 text-right font-mono text-blue-700 text-base">{fmtNum(totalDebit)}</td>
                      <td className="px-5 py-4 text-right font-mono text-emerald-700 text-base">{fmtNum(totalCredit)}</td>
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
const ALL_MODULES = ["ALL", "PURCHASE_INVOICE", "TAX_INVOICE", "SALES_ORDER", "SALES_PROFORMA", "CUSTOMER_RECEIPT", "EXPENSE", "OPENING_BALANCE"];

export default function JournalsPage() {
  const { journals, isLoading, deleteJournal } = useJournalStore();
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("ALL");
  const [selectedRef, setSelectedRef] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 15;

  const filtered = useMemo(() => {
    let list = (journals as any[]).filter(j => j.moduleName !== "PURCHASE_ORDER");
    if (moduleFilter !== "ALL") list = list.filter((j) => j.moduleName === moduleFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((j) =>
        (j.journalRefNo ?? "").toLowerCase().includes(q) ||
        (j.moduleRefNo ?? "").toLowerCase().includes(q) ||
        (j.narration ?? "").toLowerCase().includes(q) ||
        (j.createdBy ?? "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [journals, search, moduleFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleDelete = async (refNo: string) => {
    try {
      await deleteJournal(refNo);
      toast.success(`Journal entry ${refNo} has been removed.`);
      setSelectedRef(null);
    } catch {
      toast.error("Operation failed. Ensure you have proper permissions.");
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
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Journal Entries</h1>
            </div>
            <p className="text-slate-500 font-medium max-w-2xl">
              Audit and track all double-entry ledger movements generated automatically across the AgroManage ecosystem.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-sm">
             <div className="text-center px-4 border-r border-slate-200">
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Total Postings</p>
               <p className="text-2xl font-black text-slate-800">{(journals as any[]).length}</p>
             </div>
             <div className="text-center px-4">
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Active Filters</p>
               <p className="text-2xl font-black text-primary">{moduleFilter === 'ALL' ? 'None' : '1'}</p>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        {/* Module Selector Chips */}
        <div className="flex flex-wrap gap-2.5">
          {ALL_MODULES.map((m) => {
            const count = m === "ALL" ? (journals as any[]).length : (journals as any[]).filter((j) => j.moduleName === m).length;
            if (m !== "ALL" && count === 0) return null;
            const isSelected = moduleFilter === m;
            return (
              <button
                key={m}
                onClick={() => { setModuleFilter(m); setPage(1); }}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border shadow-sm ${
                  isSelected 
                    ? "bg-slate-900 text-white border-slate-900 scale-105" 
                    : "bg-white text-slate-600 border-slate-200 hover:border-primary/30 hover:bg-slate-50"
                }`}
              >
                {m === "ALL" ? <Filter size={14} /> : <div className={`w-2 h-2 rounded-full ${MODULE_COLORS[m]?.dot || "bg-slate-400"}`} />}
                {m === "ALL" ? "All Entries" : m.replace(/_/g, " ")}
                <span className={`px-2 py-0.5 rounded-lg text-[10px] ${isSelected ? "bg-white/20" : "bg-slate-100 text-slate-500"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by journal reference, source ID, or user..."
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-5 py-3.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all placeholder:text-slate-400"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
              <Download size={16} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Entries Table */}
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50/80 text-slate-400 text-[10px] font-bold uppercase tracking-[0.1em] border-b border-slate-200">
                  <th className="text-left px-8 py-5">Reference</th>
                  <th className="text-left px-8 py-5">Date</th>
                  <th className="text-left px-8 py-5">Originating Module</th>
                  <th className="text-left px-8 py-5">Source Ref</th>
                  <th className="text-left px-8 py-5">Narration</th>
                  <th className="text-center px-8 py-5">Entries</th>
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
                      <h3 className="text-lg font-bold text-slate-800">No matching journals</h3>
                      <p className="text-slate-400 mt-2 font-medium">Try adjusting your filters or search terms.</p>
                    </td>
                  </tr>
                ) : (
                  paged.map((j: any) => (
                    <tr
                      key={j.journalRefNo}
                      className="group hover:bg-slate-50/50 transition-all cursor-pointer"
                      onClick={() => setSelectedRef(j.journalRefNo)}
                    >
                      <td className="px-8 py-6">
                        <span className="font-mono text-xs font-bold text-primary bg-primary/5 px-2.5 py-1 rounded-lg group-hover:bg-primary group-hover:text-white transition-all">
                          {j.journalRefNo}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-slate-700 font-bold">{fmt(j.journalDate)}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">{j.createdBy}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6"><ModuleBadge module={j.moduleName ?? ""} /></td>
                      <td className="px-8 py-6 font-mono text-[11px] font-bold text-slate-500">{j.moduleRefNo ?? "—"}</td>
                      <td className="px-8 py-6 max-w-[200px] truncate text-slate-500 font-medium italic">"{j.narration ?? "—"}"</td>
                      <td className="px-8 py-6 text-center">
                        <span className="inline-flex items-center justify-center min-w-8 h-8 rounded-xl bg-slate-100 text-slate-600 text-[11px] font-black border border-slate-200 group-hover:bg-white group-hover:shadow-sm transition-all">
                          {j.lineCount ?? 0}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setSelectedRef(j.journalRefNo)}
                            className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-primary hover:text-white transition-all"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (!confirm(`Are you sure you want to permanently delete journal ${j.journalRefNo}?`)) return;
                              await handleDelete(j.journalRefNo);
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
        <JournalDrawer
          refNo={selectedRef}
          onClose={() => setSelectedRef(null)}
          onDelete={() => handleDelete(selectedRef)}
        />
      )}
    </div>
  );
}
