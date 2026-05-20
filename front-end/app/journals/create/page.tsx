"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useJournalStore } from "@/hooks/useJournalStore";
import { useMasterData } from "@/hooks/useMasterData";
import { toast } from "sonner";
import {
  Save,
  XCircle,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  BookOpen
} from "lucide-react";

export default function CreateJournalPage() {
  const router = useRouter();
  const { createJournal } = useJournalStore();
  const { data: companies = [] } = useMasterData("companies");
  const { data: ledgers = [] } = useMasterData("ledger-master");

  const [companyId, setCompanyId] = useState("");
  const [journalDate, setJournalDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [narration, setNarration] = useState("");

  const [details, setDetails] = useState<any[]>([
    { id: 1, ledgerId: "", remarks: "", debit: "", credit: "" },
    { id: 2, ledgerId: "", remarks: "", debit: "", credit: "" },
  ]);

  const addRow = () => {
    setDetails([
      ...details,
      { id: Date.now(), ledgerId: "", remarks: "", debit: "", credit: "" }
    ]);
  };

  const removeRow = (id: number) => {
    if (details.length <= 2) return toast.error("A journal entry requires at least 2 lines");
    setDetails(details.filter((d) => d.id !== id));
  };

  const updateRow = (id: number, field: string, value: string) => {
    setDetails(
      details.map((d) => {
        if (d.id !== id) return d;
        const newRow = { ...d, [field]: value };
        // Clear the other side if one is filled
        if (field === "debit" && Number(value) > 0) newRow.credit = "";
        if (field === "credit" && Number(value) > 0) newRow.debit = "";
        return newRow;
      })
    );
  };

  const totalDebit = details.reduce((sum, d) => sum + Number(d.debit || 0), 0);
  const totalCredit = details.reduce((sum, d) => sum + Number(d.credit || 0), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;
  const isZero = totalDebit === 0 && totalCredit === 0;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!companyId) return toast.error("Please select a company");
    if (!journalDate) return toast.error("Please select a journal date");
    if (!isBalanced) return toast.error("Journal is unbalanced. Total Debit must equal Total Credit.");
    if (isZero) return toast.error("Journal entry cannot be zero.");

    // Validate details
    const validDetails = details.filter(d => d.ledgerId && (Number(d.debit) > 0 || Number(d.credit) > 0));
    if (validDetails.length < 2) return toast.error("At least 2 valid ledger entries are required");

    const payload = {
      companyId: Number(companyId),
      journalDate: new Date(journalDate).toISOString(),
      narration,
      details: validDetails.map(d => ({
        ledgerId: Number(d.ledgerId),
        debit: Number(d.debit || 0),
        credit: Number(d.credit || 0),
        remarks: d.remarks
      })),
      audit: { user: "Admin" } // Typically you'd get this from context/localStorage
    };

    try {
      setIsSubmitting(true);
      await createJournal(payload);
      toast.success("Manual Journal Entry posted successfully!");
      router.push("/journals");
    } catch (error: any) {
      toast.error(error.message || "Failed to post journal entry");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-xl bg-primary/10 text-primary shadow-sm border border-primary/5">
                <BookOpen size={20} />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Create Journal Voucher</h1>
            </div>
            <p className="text-slate-500 font-medium">Post a manual double-entry journal directly to the general ledger.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/journals")}
              className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !isBalanced || isZero}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 transition-all"
            >
              <Save size={18} />
              {isSubmitting ? "Posting..." : "Post Journal"}
            </button>
          </div>
        </div>

        {/* Master Details */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Company *</label>
            <select
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            >
              <option value="">Select Company</option>
              {companies.map((c: any) => (
                <option key={c.id} value={c.id}>{c.companyName || c.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Journal Date *</label>
            <input
              type="date"
              value={journalDate}
              onChange={(e) => setJournalDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
          </div>
          <div className="space-y-2 md:col-span-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Narration / Description</label>
            <textarea
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
              rows={2}
              placeholder="Provide a detailed description for this entry..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
            />
          </div>
        </div>

        {/* Ledger Details */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800">Ledger Postings</h3>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold ${
              isZero ? "bg-slate-100 text-slate-500" :
              isBalanced ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100"
            }`}>
              {isZero ? (
                <>Pending Entry</>
              ) : isBalanced ? (
                <><CheckCircle2 size={14} /> Perfectly Balanced</>
              ) : (
                <><AlertCircle size={14} /> Out of Balance by {Math.abs(totalDebit - totalCredit).toLocaleString()}</>
              )}
            </div>
          </div>
          
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[10px] uppercase tracking-widest text-slate-400 font-bold border-b border-slate-200">
                    <th className="pb-3 text-left w-12">#</th>
                    <th className="pb-3 text-left min-w-[250px]">Ledger Account</th>
                    <th className="pb-3 text-left">Remarks</th>
                    <th className="pb-3 text-right w-40">Debit</th>
                    <th className="pb-3 text-right w-40">Credit</th>
                    <th className="pb-3 text-center w-16"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {details.map((row, index) => (
                    <tr key={row.id} className="group">
                      <td className="py-4 text-slate-400 font-bold">{index + 1}</td>
                      <td className="py-4 pr-4">
                        <select
                          value={row.ledgerId}
                          onChange={(e) => updateRow(row.id, "ledgerId", e.target.value)}
                          className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        >
                          <option value="">Select Ledger...</option>
                          {ledgers
                             .filter((l: any) => l.companyId === Number(companyId) || !companyId)
                             .map((l: any) => (
                            <option key={l.id} value={l.id}>{l.ledgerName} ({l.ledgerType})</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-4 pr-4">
                        <input
                          type="text"
                          placeholder="Line description..."
                          value={row.remarks}
                          onChange={(e) => updateRow(row.id, "remarks", e.target.value)}
                          className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                      </td>
                      <td className="py-4 pr-4">
                        <input
                          type="number"
                          placeholder="0.00"
                          value={row.debit}
                          onChange={(e) => updateRow(row.id, "debit", e.target.value)}
                          disabled={Number(row.credit) > 0}
                          className="w-full bg-blue-50/30 border border-blue-100/50 rounded-xl px-3 py-2 text-sm font-mono font-bold text-right focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all disabled:opacity-40"
                        />
                      </td>
                      <td className="py-4 pr-4">
                        <input
                          type="number"
                          placeholder="0.00"
                          value={row.credit}
                          onChange={(e) => updateRow(row.id, "credit", e.target.value)}
                          disabled={Number(row.debit) > 0}
                          className="w-full bg-emerald-50/30 border border-emerald-100/50 rounded-xl px-3 py-2 text-sm font-mono font-bold text-right focus:bg-white focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all disabled:opacity-40"
                        />
                      </td>
                      <td className="py-4 text-center">
                        <button
                          onClick={() => removeRow(row.id)}
                          className="p-2 rounded-lg text-slate-300 hover:bg-rose-50 hover:text-rose-500 transition-all"
                        >
                          <XCircle size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-slate-200">
                    <td colSpan={3} className="py-5 text-right pr-6">
                      <button
                        onClick={addRow}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 transition-all"
                      >
                        <Plus size={14} /> Add Line
                      </button>
                    </td>
                    <td className="py-5 pr-4 text-right font-mono font-black text-blue-600 text-lg">
                      {totalDebit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-5 pr-4 text-right font-mono font-black text-emerald-600 text-lg">
                      {totalCredit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
