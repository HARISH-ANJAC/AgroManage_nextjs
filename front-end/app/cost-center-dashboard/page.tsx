"use client";

import { useState, useEffect } from "react";
import { 
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
    Target, 
    TrendingDown, 
    AlertTriangle, 
    CheckCircle2, 
    RefreshCw,
    Download
} from "lucide-react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

export default function CostCenterDashboard() {
    const [report, setReport]         = useState<any[]>([]);
    const [isLoading, setIsLoading]   = useState(true);
    const [ledger, setLedger]         = useState<any[]>([]);
    const [ledgerOpen, setLedgerOpen] = useState(false);
    const [ledgerTitle, setLedgerTitle] = useState("");
    const [ledgerLoading, setLedgerLoading] = useState(false);

    const fetchReport = async () => {
        try {
            setIsLoading(true);
            const userJson = localStorage.getItem('user');
            let companyId = 1;
            if (userJson) {
                const parsed = JSON.parse(userJson);
                companyId = parsed.Company_Id || parsed.Company_ID || parsed.companyId || 1;
            }
            
            const res = await axios.get(`${API_BASE}/cost-centers/report/budget-vs-actual`, {
                params: { companyId, financialYear: '2025-2026' }, // Dynamic year in production
                headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
            });
            setReport(res.data);
        } catch (error) {
            console.error("Failed to fetch report:", error);
            toast({
                title: "Report Error",
                description: "Failed to load budget analysis.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const viewLedger = async (row: any) => {
        setLedgerTitle(`${row.COST_CENTER_NAME} — Expense Ledger`);
        setLedgerOpen(true);
        setLedgerLoading(true);
        setLedger([]);
        try {
            const res = await axios.get(`${API_BASE}/cost-centers/ledger/${row.COST_CENTER_ID}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
            });
            setLedger(res.data);
        } catch {
            // Fallback: show what we already have from the report
            setLedger([{
                EXPENSE_DATE:     "—",
                SOURCE_TABLE:     "—",
                SOURCE_REF_NO:    "—",
                EXPENSE_CATEGORY: "—",
                ALLOCATED_AMOUNT: row.ACTUAL_EXPENSE || "0",
                APPROVAL_STATUS:  "—",
            }]);
        } finally {
            setLedgerLoading(false);
        }
    };

    const exportPDF = async () => {
        try {
            const doc = new jsPDF();
            // Logo
            try {
                const logoImg = new Image();
                logoImg.src = "/Prime-Harvest-L-PNG.png";
                await new Promise(r => { logoImg.onload = r; logoImg.onerror = r; });
                if (logoImg.naturalWidth) {
                    const w = 28, h = (logoImg.naturalHeight * w) / logoImg.naturalWidth;
                    doc.addImage(logoImg, "PNG", 14, 8, w, h);
                }
            } catch (_) {}
            doc.setFontSize(16);
            doc.text("Cost Center Analysis", 196, 16, { align: "right" });
            doc.setFontSize(9);
            doc.text(`FY 2025-2026  |  Exported: ${new Date().toLocaleString()}`, 196, 23, { align: "right" });

            autoTable(doc, {
                startY: 32,
                head: [["Cost Center", "Code", "Budget (TZS)", "Actual (TZS)", "Used %", "Variance"]],
                body: report.map(r => {
                    const budget  = parseFloat(r.BUDGET_AMOUNT || "0");
                    const actual  = parseFloat(r.ACTUAL_EXPENSE || "0");
                    const used    = parseFloat(r.VARIANCE_PERCENTAGE || "0");
                    return [
                        r.COST_CENTER_NAME,
                        r.COST_CENTER_CODE,
                        budget.toLocaleString(),
                        actual.toLocaleString(),
                        `${used.toFixed(1)}%`,
                        (budget - actual).toLocaleString(),
                    ];
                }),
                styles: { fontSize: 8 },
                headStyles: { fillColor: [79, 70, 229] },
            });
            doc.save("cost_center_analysis.pdf");
        } catch (e) {
            toast({ title: "Export failed", description: "Could not generate PDF.", variant: "destructive" });
        }
    };

    const exportExcel = () => {
        const headers = ["Cost Center", "Code", "Budget (TZS)", "Actual (TZS)", "Used %", "Variance"];
        const rows = report.map(r => {
            const budget = parseFloat(r.BUDGET_AMOUNT || "0");
            const actual = parseFloat(r.ACTUAL_EXPENSE || "0");
            return [
                r.COST_CENTER_NAME,
                r.COST_CENTER_CODE,
                budget,
                actual,
                parseFloat(r.VARIANCE_PERCENTAGE || "0"),
                budget - actual,
            ];
        });
        const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Cost Center Analysis");
        XLSX.writeFile(wb, "cost_center_analysis.xlsx");
    };

    useEffect(() => {
        fetchReport();
    }, []);

    const getUsageColor = (percent: number) => {
        if (percent >= 100) return "bg-rose-500";
        if (percent >= 80) return "bg-amber-500";
        return "bg-emerald-500";
    };

    return (
        <>
        <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Cost Center Analysis</h1>
                    <p className="text-slate-500 mt-1">Real-time budget tracking and variance monitoring.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={fetchReport} disabled={isLoading} className="flex gap-2">
                        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Button variant="outline" onClick={exportExcel} className="flex gap-2">
                        <Download className="h-4 w-4" />
                        Export Excel
                    </Button>
                    <Button onClick={exportPDF} className="bg-indigo-600 hover:bg-indigo-700 text-white flex gap-2">
                        <Download className="h-4 w-4" />
                        Export PDF
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Total Budget</CardTitle>
                        <Target className="h-4 w-4 text-indigo-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {report.reduce((acc, curr) => acc + parseFloat(curr.BUDGET_AMOUNT || "0"), 0).toLocaleString()} TZS
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Actual Spend</CardTitle>
                        <TrendingDown className="h-4 w-4 text-rose-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {report.reduce((acc, curr) => acc + parseFloat(curr.ACTUAL_EXPENSE || "0"), 0).toLocaleString()} TZS
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Alerts</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {report.filter(r => parseFloat(r.VARIANCE_PERCENTAGE || "0") >= 80).length} Over Threshold
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-sm overflow-hidden">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead className="font-semibold text-slate-700 py-4">Cost Center</TableHead>
                                <TableHead className="font-semibold text-slate-700">Code</TableHead>
                                <TableHead className="font-semibold text-slate-700">Budget</TableHead>
                                <TableHead className="font-semibold text-slate-700">Actual</TableHead>
                                <TableHead className="font-semibold text-slate-700 min-w-[200px]">Usage Status</TableHead>
                                <TableHead className="font-semibold text-slate-700">Variance</TableHead>
                                <TableHead className="font-semibold text-slate-700 text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {report.map((row) => {
                                const usagePercent = parseFloat(row.VARIANCE_PERCENTAGE || "0");
                                const budget = parseFloat(row.BUDGET_AMOUNT || "0");
                                const actual = parseFloat(row.ACTUAL_EXPENSE || "0");
                                
                                return (
                                    <TableRow key={row.COST_CENTER_ID} className="hover:bg-slate-50/50 transition-colors">
                                        <TableCell className="font-medium text-slate-900">{row.COST_CENTER_NAME}</TableCell>
                                        <TableCell><Badge variant="outline" className="font-mono">{row.COST_CENTER_CODE}</Badge></TableCell>
                                        <TableCell>{budget.toLocaleString()}</TableCell>
                                        <TableCell>{actual.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-xs">
                                                    <span>{usagePercent.toFixed(1)}% Used</span>
                                                    <span className={usagePercent > 100 ? "text-rose-600" : "text-slate-500"}>
                                                        {usagePercent > 100 ? "Over Budget" : "Remaining"}
                                                    </span>
                                                </div>
                                                <Progress value={Math.min(usagePercent, 100)} className={`h-2 ${getUsageColor(usagePercent)}`} />
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className={`flex items-center gap-1 font-semibold ${usagePercent > 100 ? 'text-rose-600' : 'text-emerald-600'}`}>
                                                {usagePercent > 100 ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                                                {(budget - actual).toLocaleString()}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" onClick={() => viewLedger(row)}
                                                className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50">
                                                View Ledger
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {report.length === 0 && !isLoading && (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                                        No budget data found for the selected period.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>

        {/* Ledger Modal */}
        <Dialog open={ledgerOpen} onOpenChange={setLedgerOpen}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{ledgerTitle}</DialogTitle>
                </DialogHeader>
                {ledgerLoading ? (
                    <div className="flex items-center justify-center h-32 text-slate-400">Loading transactions…</div>
                ) : ledger.length === 0 ? (
                    <div className="flex items-center justify-center h-32 text-slate-400">No expense transactions recorded yet.</div>
                ) : (
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Source</TableHead>
                                <TableHead>Ref No</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead className="text-right">Amount (TZS)</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {ledger.map((tx: any, i: number) => (
                                <TableRow key={i}>
                                    <TableCell>{tx.EXPENSE_DATE ? new Date(tx.EXPENSE_DATE).toLocaleDateString() : "—"}</TableCell>
                                    <TableCell><Badge variant="outline" className="font-mono text-xs">{tx.SOURCE_TABLE || "—"}</Badge></TableCell>
                                    <TableCell className="font-mono text-xs">{tx.SOURCE_REF_NO || "—"}</TableCell>
                                    <TableCell>{tx.EXPENSE_CATEGORY || "—"}</TableCell>
                                    <TableCell className="text-right font-semibold">
                                        {parseFloat(tx.ALLOCATED_AMOUNT || tx.LC_AMOUNT || "0").toLocaleString("en-TZ", { minimumFractionDigits: 2 })}
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={tx.APPROVAL_STATUS === 'APPROVED' ? 'bg-green-100 text-green-700' : tx.APPROVAL_STATUS === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}>
                                            {tx.APPROVAL_STATUS || "PENDING"}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </DialogContent>
        </Dialog>
        </>
    );
}
