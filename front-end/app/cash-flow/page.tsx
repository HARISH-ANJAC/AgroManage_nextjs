"use client";

import { useState, useEffect } from "react";
import { useAccountingStore } from "@/hooks/useAccountingStore";
import { useMasterData } from "@/hooks/useMasterData";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import {
  Building2,
  Calendar,
  Download,
  FileText,
  FileSpreadsheet,
  TrendingUp,
  ArrowRightLeft,
  PieChart,
  ArrowUpCircle,
  ArrowDownCircle,
  Activity,
  Zap,
  DollarSign,
  Briefcase,
  Layers
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

const fmt = (num: number) => {
  const isNeg = num < 0;
  const val = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Math.abs(num));
  return isNeg ? `(${val})` : val;
};

const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

export default function CashFlowPage() {
  const [companyId, setCompanyId] = useState<string>("");
  const [startDate, setStartDate] = useState<string>(new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const { cashFlow, isLoading } = useAccountingStore(Number(companyId), startDate, endDate);
  const { data: companies = [] } = useMasterData("companies");

  useEffect(() => {
    if (companies.length > 0 && !companyId) {
      setCompanyId(String(companies[0].id));
    }
  }, [companies, companyId]);

  const operatingTotal = (cashFlow?.operating.netProfit || 0) +
    (cashFlow?.operating.adjustments.reduce((s: number, a: any) => s + a.amount, 0) || 0) +
    (cashFlow?.operating.workingCapital.reduce((s: number, w: any) => s + w.amount, 0) || 0);

  const investingTotal = cashFlow?.investing.reduce((s: number, i: any) => s + i.amount, 0) || 0;
  const financingTotal = cashFlow?.financing.reduce((s: number, f: any) => s + f.amount, 0) || 0;
  const netIncrease = operatingTotal + investingTotal + financingTotal;

  const handleExportPDF = async () => {
    if (!cashFlow) {
      toast.error("No data to export");
      return;
    }

    toast.loading("Generating Cash Flow Report...", { id: "cf-pdf" });
    const doc = new jsPDF();
    const company = companies.find((c: any) => String(c.id) === companyId);

    doc.setFontSize(20);
    doc.text("Cash Flow Statement", 14, 20);

    doc.setFontSize(10);
    doc.text(`Company: ${company?.companyName || "All Companies"}`, 14, 30);
    doc.text(`Period: ${fmtDate(startDate)} to ${fmtDate(endDate)}`, 14, 35);

    // Section Helper
    const addSection = (title: string, data: any[], startY: number) => {
      autoTable(doc, {
        startY,
        head: [[title, 'Amount']],
        body: data.map(item => [item.label, fmt(item.amount)]),
        theme: 'striped',
        headStyles: { fillColor: [51, 65, 85] }
      });
      return (doc as any).lastAutoTable.finalY;
    };

    let y = 45;
    y = addSection('Operating Activities', [
      { label: 'Net Profit before tax', amount: cashFlow.operating.netProfit },
      ...cashFlow.operating.adjustments,
      ...cashFlow.operating.workingCapital
    ], y);

    doc.setFontSize(10);
    doc.text(`Net Cash from Operating: ${fmt(operatingTotal)}`, 14, y + 10);
    y += 20;

    y = addSection('Investing Activities', cashFlow.investing, y);
    doc.text(`Net Cash used in Investing: ${fmt(investingTotal)}`, 14, y + 10);
    y += 20;

    y = addSection('Financing Activities', cashFlow.financing, y);
    doc.text(`Net Cash from Financing: ${fmt(financingTotal)}`, 14, y + 10);
    y += 20;

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Net Increase/Decrease in Cash: ${fmt(netIncrease)}`, 14, y + 10);

    doc.save(`CashFlow_${company?.companyName || "Report"}_${startDate}.pdf`);
    toast.success("Report exported successfully", { id: "cf-pdf" });
  };

  const handleExportExcel = () => {
    if (!cashFlow) return;
    const data: (string | number)[][] = [
      ["Activity", "Particulars", "Amount"],
      ["Operating", "Net Profit before tax", cashFlow.operating.netProfit],
      ...cashFlow.operating.adjustments.map((a: { label: string; amount: number }) => ["Operating (Adj)", a.label, a.amount]),
      ...cashFlow.operating.workingCapital.map((w: { label: string; amount: number }) => ["Operating (WC)", w.label, w.amount]),
      ["Operating Total", "", operatingTotal],
      ["Investing", "", ""],
      ...cashFlow.investing.map((i: { label: string; amount: number }) => ["Investing", i.label, i.amount]),
      ["Investing Total", "", investingTotal],
      ["Financing", "", ""],
      ...cashFlow.financing.map((f: { label: string; amount: number }) => ["Financing", f.label, f.amount]),
      ["Financing Total", "", financingTotal],
      ["Net Increase", "", netIncrease]
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Cash Flow");
    XLSX.writeFile(wb, `CashFlow_${startDate}_to_${endDate}.xlsx`);
    toast.success("Excel exported successfully");
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Cash Flow Statement</h1>
          <p className="text-sm text-slate-500">Categorized analysis of cash movements by activity</p>
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

      {/* Main Analysis Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Detailed Statement */}
        <div className="lg:col-span-8 space-y-6">
          {/* Operating Activities */}
          <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Briefcase size={80} />
            </div>

            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                <Briefcase size={18} />
              </div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Operating Activities</h2>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 font-semibold">Net Profit before tax</span>
                <span className="font-mono font-bold text-slate-900">{fmt(cashFlow?.operating.netProfit || 0)}</span>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-2">Adjustments for non-cash items</p>
                {cashFlow?.operating.adjustments.map((adj: any) => (
                  <div key={adj.label} className="flex justify-between items-center pl-4 text-xs">
                    <span className="text-slate-500 font-medium">{adj.label}</span>
                    <span className="font-mono font-bold text-emerald-600">+{fmt(adj.amount)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-2">Changes in working capital</p>
                {cashFlow?.operating.workingCapital.map((wc: any) => (
                  <div key={wc.label} className="flex justify-between items-center pl-4 text-xs">
                    <span className="text-slate-500 font-medium">{wc.label}</span>
                    <span className="font-mono font-bold text-slate-400">{fmt(wc.amount)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center bg-slate-50/50 -mx-6 px-6 py-4">
                <span className="text-slate-900 font-bold uppercase text-[10px] tracking-widest">Net Cash from Operating</span>
                <span className="text-xl font-bold text-emerald-600">{fmt(operatingTotal)}</span>
              </div>
            </div>
          </section>

          {/* Investing Activities */}
          <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <PieChart size={18} />
              </div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Investing Activities</h2>
            </div>

            <div className="space-y-3">
              {cashFlow?.investing.map((inv: any) => (
                <div key={inv.label} className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 font-semibold">{inv.label}</span>
                  <span className="font-mono font-bold text-rose-500">{fmt(inv.amount)}</span>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="text-slate-900 font-bold uppercase text-[10px] tracking-widest">Net Cash used in Investing</span>
                <span className="text-lg font-bold text-rose-500">{fmt(investingTotal)}</span>
              </div>
            </div>
          </section>

          {/* Financing Activities */}
          <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                <Layers size={18} />
              </div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Financing Activities</h2>
            </div>

            <div className="space-y-3">
              {cashFlow?.financing.map((fin: any) => (
                <div key={fin.label} className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 font-semibold">{fin.label}</span>
                  <span className="font-mono font-bold text-emerald-600">{fmt(fin.amount)}</span>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="text-slate-900 font-bold uppercase text-[10px] tracking-widest">Net Cash from Financing</span>
                <span className="text-lg font-bold text-emerald-600">{fmt(financingTotal)}</span>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Summary Cards */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-4 -mt-4 opacity-5">
              <DollarSign size={120} />
            </div>

            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total Net Movement</p>
            <h3 className="text-3xl font-bold mb-6">{fmt(netIncrease)}</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-2 text-xs">
                  <ArrowUpCircle size={14} className="text-emerald-400" />
                  <span className="font-medium text-slate-300">Total Inflow</span>
                </div>
                <span className="font-mono font-bold text-emerald-400 text-sm">+{fmt(operatingTotal + financingTotal)}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-2 text-xs">
                  <ArrowDownCircle size={14} className="text-rose-400" />
                  <span className="font-medium text-slate-300">Total Outflow</span>
                </div>
                <span className="font-mono font-bold text-rose-400 text-sm">-{fmt(Math.abs(investingTotal))}</span>
              </div>
            </div>

            <Button onClick={handleExportPDF} className="w-full mt-8 bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-11">
              <Download size={16} className="mr-2" />
              Download Report
            </Button>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <h4 className="text-slate-900 font-bold uppercase text-[10px] tracking-widest mb-4 border-b border-slate-100 pb-3 flex items-center gap-2">
              <ArrowRightLeft size={14} className="text-primary" />
              Statement Summary
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Opening Balance</span>
                <span className="font-bold text-slate-900">$250,000.00</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Net Cash Change</span>
                <span className={`font-bold ${netIncrease >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {netIncrease >= 0 ? '+' : ''}{fmt(netIncrease)}
                </span>
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                <span className="text-slate-900 font-bold text-xs uppercase">Closing Balance</span>
                <span className="text-xl font-bold text-primary">$260,200.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
