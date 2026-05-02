"use client";

import { useState, useEffect, useMemo } from "react";
import { useAccountingStore, CashBookEntry } from "@/hooks/useAccountingStore";
import { useMasterData } from "@/hooks/useMasterData";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import {
  Search,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Filter,
  Download,
  BookOpen,
  ArrowRightLeft,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Building2,
  FileText,
  FileSpreadsheet
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const fmt = (num: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
const fmtDate = (date: any) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
};

export default function CashBookPage() {
  const [companyId, setCompanyId] = useState<string>("");
  const [startDate, setStartDate] = useState<string>(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [search, setSearch] = useState("");

  const { cashBook, isLoading } = useAccountingStore(Number(companyId), startDate, endDate);
  const { data: companies = [] } = useMasterData("companies");

  useEffect(() => {
    if (companies.length > 0 && !companyId) {
      setCompanyId(String(companies[0].id));
    }
  }, [companies, companyId]);

  const filteredEntries = useMemo(() => {
    if (!cashBook?.entries) return [];
    if (!search.trim()) return cashBook.entries;
    const q = search.toLowerCase();
    return cashBook.entries.filter((e: CashBookEntry) =>
      (e.narration ?? "").toLowerCase().includes(q) ||
      (e.moduleRefNo ?? "").toLowerCase().includes(q) ||
      (e.ledgerName ?? "").toLowerCase().includes(q)
    );
  }, [cashBook, search]);

  const handleExportPDF = async () => {
    if (!cashBook || filteredEntries.length === 0) {
      toast.error("No data to export");
      return;
    }

    toast.loading("Generating Cash Book PDF...", { id: "cashbook-pdf" });
    const doc = new jsPDF();
    const company = companies.find((c: any) => String(c.id) === companyId);
    
    // Header
    doc.setFontSize(20);
    doc.text("Cash Book Report", 14, 20);
    
    doc.setFontSize(10);
    doc.text(`Company: ${company?.companyName || "All Companies"}`, 14, 30);
    doc.text(`Period: ${fmtDate(startDate)} to ${fmtDate(endDate)}`, 14, 35);
    doc.text(`Run Date: ${new Date().toLocaleString()}`, 14, 40);

    // Summary Table
    autoTable(doc, {
      startY: 45,
      head: [['Metric', 'Amount']],
      body: [
        ['Opening Balance', fmt(cashBook.summary.opening)],
        ['Total Receipts', fmt(cashBook.summary.receipts)],
        ['Total Payments', fmt(cashBook.summary.payments)],
        ['Closing Balance', fmt(cashBook.summary.closing)],
      ],
      theme: 'grid',
      headStyles: { fillColor: [51, 65, 85] }
    });

    // Transactions Table
    const tableData = filteredEntries.map((e: any) => [
      fmtDate(e.date),
      e.ledgerName,
      e.narration || "—",
      e.moduleRefNo,
      Number(e.debit) > 0 ? fmt(e.debit) : "—",
      Number(e.credit) > 0 ? fmt(e.credit) : "—"
    ]);

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [['Date', 'Particulars', 'Narration', 'Ref No', 'Debit (Dr)', 'Credit (Cr)']],
      body: tableData,
      headStyles: { fillColor: [15, 23, 42] },
      styles: { fontSize: 8 }
    });

    doc.save(`CashBook_${company?.companyName || "Report"}_${startDate}.pdf`);
    toast.success("PDF exported successfully", { id: "cashbook-pdf" });
  };

  const handleExportExcel = () => {
    if (!cashBook || filteredEntries.length === 0) {
      toast.error("No data to export");
      return;
    }

    const data = filteredEntries.map((e: any) => ({
      Date: fmtDate(e.date),
      Particulars: e.ledgerName,
      Narration: e.narration,
      "Voucher Type": e.moduleName,
      "Voucher No": e.moduleRefNo,
      "Receipt (Debit)": Number(e.debit),
      "Payment (Credit)": Number(e.credit)
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Cash Book");
    XLSX.writeFile(wb, `CashBook_${startDate}_to_${endDate}.xlsx`);
    toast.success("Excel exported successfully");
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Cash Book</h1>
          <p className="text-sm text-slate-500">Real-time tracking of cash and bank movements</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
            <Building2 size={16} className="text-slate-400" />
            <Select value={companyId} onValueChange={setCompanyId}>
              <SelectTrigger className="w-[180px] h-8 border-none shadow-none focus:ring-0 text-sm font-semibold text-slate-700 p-0">
                <SelectValue placeholder="Select Company" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((c: any) => (
                  <SelectItem key={c.id} value={String(c.id)}>{c.companyName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
            <Calendar size={16} className="text-slate-400" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="text-xs font-semibold text-slate-700 focus:outline-none bg-transparent"
            />
            <span className="text-slate-300 text-xs font-bold px-1">—</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="text-xs font-semibold text-slate-700 focus:outline-none bg-transparent"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white gap-2 shadow-sm">
                <Download size={14} />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleExportPDF} className="gap-2 cursor-pointer">
                <FileText size={14} />
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportExcel} className="gap-2 cursor-pointer">
                <FileSpreadsheet size={14} />
                Export as Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Opening Balance", value: cashBook?.summary.opening || 0, icon: ArrowRightLeft, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
          { label: "Total Receipts", value: cashBook?.summary.receipts || 0, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
          { label: "Total Payments", value: cashBook?.summary.payments || 0, icon: TrendingDown, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
          { label: "Closing Balance", value: cashBook?.summary.closing || 0, icon: Wallet, color: "text-primary", bg: "bg-primary/5", border: "border-primary/20" },
        ].map((stat) => (
          <div key={stat.label} className={`bg-white p-5 rounded-xl border ${stat.border} shadow-sm group transition-all`}>
            <div className="flex items-center gap-4">
              <div className={`p-2.5 rounded-lg ${stat.bg}`}>
                <stat.icon className={`${stat.color} size-5`} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <h3 className={`text-xl font-bold ${stat.label === 'Total Payments' ? 'text-rose-600' : 'text-slate-900'}`}>
                  {fmt(stat.value)}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/30">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by narration, reference or ledger..."
              className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 gap-2 text-slate-600">
              <Filter size={14} />
              Filters
            </Button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-200">
                <th className="text-left px-6 py-4">Date</th>
                <th className="text-left px-6 py-4">Particulars / Narration</th>
                <th className="text-left px-6 py-4">Vch Type</th>
                <th className="text-left px-6 py-4">Vch No</th>
                <th className="text-right px-6 py-4">Receipt (Dr)</th>
                <th className="text-right px-6 py-4">Payment (Cr)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Opening Balance Row */}
              <tr className="bg-primary/5">
                <td className="px-6 py-3 font-semibold text-primary">{fmtDate(startDate)}</td>
                <td className="px-6 py-3 font-bold text-slate-900 text-xs uppercase tracking-wide">Opening Balance</td>
                <td className="px-6 py-3">—</td>
                <td className="px-6 py-3">—</td>
                <td className="px-6 py-3 text-right font-bold text-emerald-600">{fmt(cashBook?.summary.opening || 0)}</td>
                <td className="px-6 py-3 text-right">—</td>
              </tr>

              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 6 }).map((__, j) => (
                      <td key={j} className="px-6 py-5"><div className="h-4 bg-slate-100 rounded w-full" /></td>
                    ))}
                  </tr>
                ))
              ) : filteredEntries.length > 0 ? (
                filteredEntries.map((entry: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-slate-700 font-semibold">{fmtDate(entry.date)}</span>
                        <span className="text-[10px] text-slate-400 font-medium uppercase mt-0.5">
                          {new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 p-1 rounded ${Number(entry.debit) > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {Number(entry.debit) > 0 ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-slate-900 font-bold text-sm">{entry.ledgerName}</span>
                          <span className="text-xs text-slate-500 line-clamp-1 mt-0.5">{entry.narration || "—"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                        {entry.moduleName.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-500 font-mono text-xs">{entry.moduleRefNo}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {Number(entry.debit) > 0 ? (
                        <span className="font-semibold text-emerald-600">+{fmt(entry.debit)}</span>
                      ) : "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {Number(entry.credit) > 0 ? (
                        <span className="font-semibold text-rose-600">-{fmt(entry.credit)}</span>
                      ) : "—"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <p className="text-slate-400 text-sm font-medium italic">No cash transactions found for this period</p>
                  </td>
                </tr>
              )}

              {/* Closing Balance Row */}
              <tr className="bg-slate-900 text-white font-semibold">
                <td className="px-6 py-4">{fmtDate(endDate)}</td>
                <td className="px-6 py-4 uppercase tracking-widest text-[10px]">Closing Balance</td>
                <td className="px-6 py-4">—</td>
                <td className="px-6 py-4">—</td>
                <td className="px-6 py-4 text-right font-bold text-emerald-400">
                  {cashBook?.summary.closing && cashBook.summary.closing > 0 ? fmt(cashBook.summary.closing) : "—"}
                </td>
                <td className="px-6 py-4 text-right font-bold text-rose-400">
                  {cashBook?.summary.closing && cashBook.summary.closing < 0 ? fmt(Math.abs(cashBook.summary.closing)) : "—"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
