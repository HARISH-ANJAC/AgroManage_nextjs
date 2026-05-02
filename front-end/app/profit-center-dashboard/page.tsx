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
    TrendingUp, 
    Target,
    Trophy,
    RefreshCw,
    Download,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

export default function ProfitCenterDashboard() {
    const [report, setReport]             = useState<any[]>([]);
    const [isLoading, setIsLoading]        = useState(true);
    const [ledger, setLedger]              = useState<any[]>([]);
    const [ledgerOpen, setLedgerOpen]      = useState(false);
    const [ledgerTitle, setLedgerTitle]    = useState("");
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
            
            const res = await axios.get(`${API_BASE}/profit-centers/report/target-vs-actual`, {
                params: { companyId, financialYear: '2025-2026' },
                headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
            });
            setReport(res.data);
        } catch (error) {
            console.error("Failed to fetch report:", error);
            toast({
                title: "Report Error",
                description: "Failed to load revenue performance.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const viewRevenueLedger = async (row: any) => {
        setLedgerTitle(`${row.PROFIT_CENTER_NAME} — Revenue Transactions`);
        setLedgerOpen(true);
        setLedgerLoading(true);
        setLedger([]);
        try {
            const res = await axios.get(`${API_BASE}/profit-centers/ledger/${row.PROFIT_CENTER_ID}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
            });
            setLedger(res.data);
        } catch {
            setLedger([{
                REVENUE_DATE:     "—",
                SOURCE_TABLE:     "—",
                SOURCE_REF_NO:    "—",
                REVENUE_CATEGORY: "—",
                ALLOCATED_AMOUNT: row.ACTUAL_REVENUE || "0",
                STATUS_ENTRY:     "—",
            }]);
        } finally {
            setLedgerLoading(false);
        }
    };

    const exportPDF = async () => {
        try {
            const doc = new jsPDF();
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
            doc.text("Profit Center Performance", 196, 16, { align: "right" });
            doc.setFontSize(9);
            doc.text(`FY 2025-2026  |  Exported: ${new Date().toLocaleString()}`, 196, 23, { align: "right" });

            autoTable(doc, {
                startY: 32,
                head: [["Profit Center", "Code", "Target (TZS)", "Actual Revenue (TZS)", "Achievement %", "Gap / Surplus"]],
                body: report.map(r => {
                    const target = parseFloat(r.TARGET_AMOUNT || "0");
                    const actual = parseFloat(r.ACTUAL_REVENUE || "0");
                    const achievement = target > 0 ? (actual / target) * 100 : 0;
                    const gap = actual - target;
                    return [
                        r.PROFIT_CENTER_NAME,
                        r.PROFIT_CENTER_CODE,
                        target.toLocaleString(),
                        actual.toLocaleString(),
                        `${achievement.toFixed(1)}%`,
                        (gap >= 0 ? "+" : "-") + Math.abs(gap).toLocaleString(),
                    ];
                }),
                styles: { fontSize: 8 },
                headStyles: { fillColor: [5, 150, 105] },
            });
            doc.save("profit_center_performance.pdf");
        } catch (e) {
            toast({ title: "Export failed", description: "Could not generate PDF.", variant: "destructive" });
        }
    };

    const exportExcel = () => {
        const headers = ["Profit Center", "Code", "Target (TZS)", "Actual Revenue (TZS)", "Achievement %", "Gap/Surplus"];
        const rows = report.map(r => {
            const target = parseFloat(r.TARGET_AMOUNT || "0");
            const actual = parseFloat(r.ACTUAL_REVENUE || "0");
            const achievement = target > 0 ? (actual / target) * 100 : 0;
            return [r.PROFIT_CENTER_NAME, r.PROFIT_CENTER_CODE, target, actual, parseFloat(achievement.toFixed(2)), actual - target];
        });
        const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Profit Center Performance");
        XLSX.writeFile(wb, "profit_center_performance.xlsx");
    };

    useEffect(() => {
        fetchReport();
    }, []);

    const getAchievementColor = (percent: number) => {
        if (percent >= 100) return "bg-emerald-500";
        if (percent >= 70) return "bg-blue-500";
        if (percent >= 40) return "bg-amber-500";
        return "bg-rose-500";
    };

    const totalTarget = report.reduce((acc, curr) => acc + parseFloat(curr.TARGET_AMOUNT || "0"), 0);
    const totalActual = report.reduce((acc, curr) => acc + parseFloat(curr.ACTUAL_REVENUE || "0"), 0);
    const overallAchievement = totalTarget > 0 ? (totalActual / totalTarget) * 100 : 0;

    return (
        <>
        <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Profit Center Performance</h1>
                    <p className="text-slate-500 mt-1">Track revenue achievement across business units.</p>
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
                    <Button onClick={exportPDF} className="bg-emerald-600 hover:bg-emerald-700 text-white flex gap-2">
                        <Download className="h-4 w-4" />
                        Export PDF
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Total Target</CardTitle>
                        <Target className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalTarget.toLocaleString()} TZS</div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Actual Revenue</CardTitle>
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalActual.toLocaleString()} TZS</div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Overall Achievement</CardTitle>
                        <Trophy className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{overallAchievement.toFixed(1)}%</div>
                        <Progress value={Math.min(overallAchievement, 100)} className="h-1 mt-2 bg-slate-100" />
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-sm overflow-hidden">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead className="font-semibold text-slate-700 py-4">Profit Center</TableHead>
                                <TableHead className="font-semibold text-slate-700">Code</TableHead>
                                <TableHead className="font-semibold text-slate-700">Target</TableHead>
                                <TableHead className="font-semibold text-slate-700">Actual Revenue</TableHead>
                                <TableHead className="font-semibold text-slate-700 min-w-[200px]">Achievement</TableHead>
                                <TableHead className="font-semibold text-slate-700">Gap/Surplus</TableHead>
                                <TableHead className="font-semibold text-slate-700 text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {report.map((row) => {
                                const target = parseFloat(row.TARGET_AMOUNT || "0");
                                const actual = parseFloat(row.ACTUAL_REVENUE || "0");
                                const achievement = target > 0 ? (actual / target) * 100 : 0;
                                const gap = actual - target;
                                
                                return (
                                    <TableRow key={row.PROFIT_CENTER_ID} className="hover:bg-slate-50/50 transition-colors">
                                        <TableCell className="font-medium text-slate-900">{row.PROFIT_CENTER_NAME}</TableCell>
                                        <TableCell><Badge variant="outline" className="font-mono">{row.PROFIT_CENTER_CODE}</Badge></TableCell>
                                        <TableCell>{target.toLocaleString()}</TableCell>
                                        <TableCell>{actual.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-xs">
                                                    <span>{achievement.toFixed(1)}%</span>
                                                    <span className={achievement >= 100 ? "text-emerald-600 font-medium" : "text-slate-500"}>
                                                        {achievement >= 100 ? "Target Met" : "In Progress"}
                                                    </span>
                                                </div>
                                                <Progress value={Math.min(achievement, 100)} className={`h-2 ${getAchievementColor(achievement)}`} />
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className={`flex items-center gap-1 font-semibold ${gap >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                {gap >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                                                {Math.abs(gap).toLocaleString()}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm"
                                                onClick={() => viewRevenueLedger(row)}
                                                className="text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50">
                                                Revenue Details
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {report.length === 0 && !isLoading && (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                                        No revenue performance data found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>

        {/* Revenue Ledger Modal */}
        <Dialog open={ledgerOpen} onOpenChange={setLedgerOpen}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{ledgerTitle}</DialogTitle>
                </DialogHeader>
                {ledgerLoading ? (
                    <div className="flex items-center justify-center h-32 text-slate-400">Loading transactions…</div>
                ) : ledger.length === 0 ? (
                    <div className="flex items-center justify-center h-32 text-slate-400">No revenue transactions recorded yet.</div>
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
                                    <TableCell>{tx.REVENUE_DATE ? new Date(tx.REVENUE_DATE).toLocaleDateString() : "—"}</TableCell>
                                    <TableCell><Badge variant="outline" className="font-mono text-xs">{tx.SOURCE_TABLE || "—"}</Badge></TableCell>
                                    <TableCell className="font-mono text-xs">{tx.SOURCE_REF_NO || "—"}</TableCell>
                                    <TableCell>{tx.REVENUE_CATEGORY || "—"}</TableCell>
                                    <TableCell className="text-right font-semibold">
                                        {parseFloat(tx.ALLOCATED_AMOUNT || tx.LC_AMOUNT || "0").toLocaleString("en-TZ", { minimumFractionDigits: 2 })}
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={tx.STATUS_ENTRY === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}>
                                            {tx.STATUS_ENTRY || "Active"}
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
