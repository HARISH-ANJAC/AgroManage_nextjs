"use client";

import { useState, useEffect, useCallback } from "react";
import { useMasterData } from "@/hooks/useMasterData";
import { toast } from "sonner";
import {
  RefreshCcw,
  Calendar,
  Building,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Info,
  ArrowRightLeft,
  FileSpreadsheet,
  History,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function ExchangeRevaluationPage() {
  const { data: companies = [], isLoading: companiesLoading } = useMasterData("companies");
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [revaluationDate, setRevaluationDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

  const fetchHistory = useCallback(async (companyId?: string) => {
    setIsLoadingHistory(true);
    try {
      const token = localStorage.getItem("accessToken");
      const url = companyId
        ? `${BASE_URL}/multi-currency/revaluation-history?companyId=${companyId}`
        : `${BASE_URL}/multi-currency/revaluation-history`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setHistory(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      // silently fail — table may not have data yet
    } finally {
      setIsLoadingHistory(false);
    }
  }, [BASE_URL]);

  // Load history on mount and whenever selected company changes
  useEffect(() => {
    fetchHistory(selectedCompany || undefined);
  }, [selectedCompany, fetchHistory]);

  const handleRunRevaluation = async () => {
    if (!selectedCompany) {
      toast.error("Please select a company");
      return;
    }
    setIsProcessing(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${BASE_URL}/multi-currency/revaluation`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ companyId: selectedCompany, revaluationDate }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(`Revaluation complete — ${data.processedCount ?? 0} transaction(s) processed.`);
        // Refresh history to show new records
        await fetchHistory(selectedCompany);
      } else {
        throw new Error(data.msg || "Failed to run revaluation");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Derived summary stats
  const totalGain = history
    .filter((r) => r.GL_TYPE === "GAIN")
    .reduce((s, r) => s + Number(r.UNREALIZED_GAIN_LOSS ?? 0), 0);
  const totalLoss = history
    .filter((r) => r.GL_TYPE === "LOSS")
    .reduce((s, r) => s + Number(r.UNREALIZED_GAIN_LOSS ?? 0), 0);
  const netPosition = totalGain - totalLoss;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 min-h-screen bg-[#F8FAFC]/30">
      {/* ── Header ── */}
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 rounded-2xl">
            <RefreshCcw className={`w-7 h-7 text-indigo-600 ${isProcessing ? "animate-spin" : ""}`} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Exchange Revaluation</h1>
            <p className="text-slate-500 font-medium text-sm">
              Unrealized gain/loss on open foreign currency balances.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="rounded-xl h-10 px-5 font-bold border-slate-200 gap-2"
            onClick={() => fetchHistory(selectedCompany || undefined)}
            disabled={isLoadingHistory}
          >
            {isLoadingHistory ? <Loader2 className="w-4 h-4 animate-spin" /> : <History className="w-4 h-4" />}
            Refresh
          </Button>
          <Button
            onClick={handleRunRevaluation}
            disabled={isProcessing || !selectedCompany}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10 px-6 font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95 gap-2"
          >
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
            {isProcessing ? "Processing…" : "Run Revaluation"}
          </Button>
        </div>
      </div>

      {/* ── KPI Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="rounded-2xl border-none shadow-md shadow-emerald-100/60 bg-emerald-50/60">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest mb-1">Total Gains</p>
              <p className="text-2xl font-black text-slate-900 tabular-nums">
                {totalGain.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-emerald-500/60" />
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-none shadow-md shadow-rose-100/60 bg-rose-50/60">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-[10px] font-black uppercase text-rose-600 tracking-widest mb-1">Total Losses</p>
              <p className="text-2xl font-black text-slate-900 tabular-nums">
                {totalLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <TrendingDown className="w-8 h-8 text-rose-500/60" />
          </CardContent>
        </Card>
        <Card className={`rounded-2xl border-none shadow-md ${netPosition >= 0 ? "bg-blue-50/60 shadow-blue-100/60" : "bg-orange-50/60 shadow-orange-100/60"}`}>
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${netPosition >= 0 ? "text-blue-600" : "text-orange-600"}`}>
                Net Position
              </p>
              <p className="text-2xl font-black text-slate-900 tabular-nums">
                {netPosition >= 0 ? "+" : ""}
                {netPosition.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <ArrowRightLeft className={`w-8 h-8 ${netPosition >= 0 ? "text-blue-400/60" : "text-orange-400/60"}`} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ── Config Sidebar ── */}
        <Card className="lg:col-span-3 rounded-3xl border-none shadow-xl shadow-slate-200/50">
          <CardHeader className="bg-slate-50/50 p-6 rounded-t-3xl">
            <CardTitle className="text-base font-black text-slate-900 flex items-center gap-2">
              <Info className="w-4 h-4 text-indigo-600" /> Parameters
            </CardTitle>
            <CardDescription className="text-xs">Define the scope for revaluation</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1.5">
                <Building className="w-3 h-3" /> Company
              </Label>
              {companiesLoading ? (
                <Skeleton className="h-10 w-full rounded-xl" />
              ) : (
                <Select value={selectedCompany || "all"} onValueChange={(v) => setSelectedCompany(v === "all" ? "" : v)}>
                  <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 border-slate-200 font-bold text-sm">
                    <SelectValue placeholder="Select Company" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all">All Companies</SelectItem>
                    {companies.map((c: any) => (
                      <SelectItem key={c.id || c.Company_Id} value={String(c.id || c.Company_Id)}>
                        {c.companyName || c.Company_Name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1.5">
                <Calendar className="w-3 h-3" /> Valuation Date
              </Label>
              <Input
                type="date"
                value={revaluationDate}
                onChange={(e) => setRevaluationDate(e.target.value)}
                className="h-10 rounded-xl bg-slate-50/50 border-slate-200 font-bold text-sm"
              />
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 rounded-2xl border border-amber-100/60">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[10px] font-bold text-amber-800 leading-relaxed">
                  Revaluation re-calculates base currency equivalents for all open foreign-currency
                  transactions using the latest master rates.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── History Table ── */}
        <div className="lg:col-span-9">
          <Card className="rounded-3xl border shadow-xl shadow-slate-200/50 overflow-hidden bg-white">
            <CardHeader className="border-b bg-slate-50/30 p-6">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-base font-black text-slate-900">Revaluation History</CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    {history.length} record{history.length !== 1 ? "s" : ""} found
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" className="rounded-lg font-bold gap-2 text-xs">
                  <FileSpreadsheet className="w-3.5 h-3.5" /> Export
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {isLoadingHistory ? (
                <div className="p-6 space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full rounded-xl" />
                  ))}
                </div>
              ) : history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center px-8">
                  <div className="p-5 bg-slate-100 rounded-full mb-5">
                    <ArrowRightLeft className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-1">No revaluation records yet</h3>
                  <p className="text-slate-400 text-sm max-w-sm font-medium">
                    Select a company and click <strong>Run Revaluation</strong> to calculate unrealized
                    gain/loss on open foreign currency balances.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-[10px] font-black uppercase text-slate-400 bg-slate-50/50 border-b tracking-wider">
                        <th className="px-6 py-3.5 text-left">Document</th>
                        <th className="px-5 py-3.5 text-left">Currency</th>
                        <th className="px-5 py-3.5 text-left">Valuation Date</th>
                        <th className="px-5 py-3.5 text-right">Old Base</th>
                        <th className="px-5 py-3.5 text-right">New Base</th>
                        <th className="px-5 py-3.5 text-right">Gain / Loss</th>
                        <th className="px-5 py-3.5 text-center">JV No.</th>
                        <th className="px-5 py-3.5 text-center">Type</th>
                        <th className="px-5 py-3.5 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {history.map((item: any, idx: number) => (
                        <tr key={item.GL_ID ?? idx} className="hover:bg-slate-50/60 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-900 text-sm">
                              {item.DOCUMENT_NUMBER ?? `#TX-${item.TRANSACTION_ID}`}
                            </div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase">
                              {item.ACCOUNT_TYPE ?? item.DOCUMENT_TYPE} Revaluation
                            </div>
                          </td>
                          <td className="px-5 py-4 text-sm font-medium text-slate-600">
                            {item.CURRENCY_NAME ?? "—"}
                          </td>
                          <td className="px-5 py-4 text-sm font-medium text-slate-500">
                            {item.REVALUATION_DATE
                              ? new Date(item.REVALUATION_DATE).toLocaleDateString()
                              : "—"}
                          </td>
                          <td className="px-5 py-4 text-right font-medium text-slate-500 tabular-nums text-sm">
                            {Number(item.OLD_BASE_AMOUNT ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="px-5 py-4 text-right font-bold text-slate-900 tabular-nums text-sm">
                            {Number(item.NEW_BASE_AMOUNT ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className={`px-5 py-4 text-right font-black tabular-nums text-sm ${item.GL_TYPE === "GAIN" ? "text-emerald-600" : "text-rose-600"}`}>
                            {item.GL_TYPE === "GAIN" ? "+" : "-"}
                            {Number(item.UNREALIZED_GAIN_LOSS ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="px-5 py-4 text-center">
                            <Badge variant="outline" className="bg-white border-slate-200 text-slate-600 font-mono text-xs">
                              {item.JOURNAL_VOUCHER_NO ?? "—"}
                            </Badge>
                          </td>
                          <td className="px-5 py-4 text-center">
                            <Badge
                              className={
                                item.GL_TYPE === "GAIN"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                  : "bg-rose-50 text-rose-700 border-rose-100"
                              }
                            >
                              {item.GL_TYPE === "GAIN" ? "Gain" : "Loss"}
                            </Badge>
                          </td>
                          <td className="px-5 py-4 text-center">
                            <Badge
                              variant="outline"
                              className={item.IS_REVERSED ? "text-slate-400 border-slate-200" : "text-blue-600 border-blue-200 bg-blue-50"}
                            >
                              {item.IS_REVERSED ? "Reversed" : item.STATUS ?? "Active"}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
