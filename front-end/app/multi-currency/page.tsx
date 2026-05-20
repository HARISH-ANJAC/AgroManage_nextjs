"use client";

import { useState, useEffect } from "react";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { RefreshCcw, Landmark, Calculator, History } from "lucide-react";
import axios from "axios";
import { useMasterData } from "@/hooks/useMasterData";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function MultiCurrencyLedgerPage() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isRevaluing, setIsRevaluing] = useState(false);
    const { data: companies = [] } = useMasterData("companies");
    const [selectedCompany, setSelectedCompany] = useState<string>("");
    const { toast } = useToast();

    const getAuthHeader = () => {
        const token = localStorage.getItem("accessToken");
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const fetchTransactions = async (companyId?: string) => {
        try {
            setLoading(true);
            const url = companyId 
                ? `${API_BASE}/multi-currency/transactions?companyId=${companyId}`
                : `${API_BASE}/multi-currency/transactions`;
            const res = await axios.get(url, {
                headers: getAuthHeader()
            });
            setTransactions(res.data);
        } catch (error: any) {
            console.error(error);
            if (error.response?.status === 401) {
                toast({ title: "Session Expired", description: "Please login again", variant: "destructive" });
                window.location.href = "/login";
            } else {
                toast({ title: "Error", description: "Failed to fetch transactions", variant: "destructive" });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSyncRates = async () => {
        if (!selectedCompany) {
            toast({ title: "Validation Error", description: "Please select a company first", variant: "destructive" });
            return;
        }
        try {
            setIsSyncing(true);
            await axios.post(`${API_BASE}/multi-currency/update-rates`,
                { companyId: selectedCompany },
                { headers: getAuthHeader() }
            );
            toast({ title: "Success", description: "Master rates synced from history" });
            fetchTransactions(selectedCompany);
        } catch (error) {
            toast({ title: "Sync Failed", description: "Could not sync rates", variant: "destructive" });
        } finally {
            setIsSyncing(false);
        }
    };

    const handleRevaluation = async () => {
        if (!selectedCompany) {
            toast({ title: "Validation Error", description: "Please select a company first", variant: "destructive" });
            return;
        }
        try {
            setIsRevaluing(true);
            const res = await axios.post(`${API_BASE}/multi-currency/revaluation`,
                { companyId: selectedCompany, revaluationDate: new Date() },
                { headers: getAuthHeader() }
            );
            toast({
                title: "Revaluation Complete",
                description: `Processed ${res.data.processedCount} entries.`
            });
            fetchTransactions(selectedCompany);
        } catch (error) {
            toast({ title: "Revaluation Failed", description: "Error during calculation", variant: "destructive" });
        } finally {
            setIsRevaluing(false);
        }
    };

    useEffect(() => {
        fetchTransactions(selectedCompany || undefined);
    }, [selectedCompany]);

    return (
        <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Multi-Currency</h1>
                    <p className="text-slate-500 mt-1">Track and revalue foreign currency transactions.</p>
                </div>
                <div className="flex gap-3 items-center">
                    <Select value={selectedCompany || "all"} onValueChange={(v) => setSelectedCompany(v === "all" ? "" : v)}>
                        <SelectTrigger className="w-[200px] h-10 bg-white">
                            <SelectValue placeholder="Select Company" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Companies</SelectItem>
                            {companies.map((c: any) => (
                                <SelectItem key={c.id || c.Company_Id} value={String(c.id || c.Company_Id)}>
                                    {c.companyName || c.Company_Name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button
                        variant="outline"
                        onClick={handleSyncRates}
                        disabled={isSyncing || !selectedCompany}
                        className="flex gap-2"
                    >
                        <RefreshCcw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                        Sync Master Rates
                    </Button>
                    <Button
                        onClick={handleRevaluation}
                        disabled={isRevaluing || !selectedCompany}
                        className="flex gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                        <Calculator className="w-4 h-4" />
                        Run Revaluation
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="shadow-sm border-slate-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 uppercase">Total Tracked</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{transactions.length}</div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-slate-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 uppercase">Pending Settlements</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {transactions.filter(t => t.STATUS !== 'FULLY_SETTLED').length}
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-slate-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 uppercase">Active Currencies</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-indigo-600">
                            {new Set(transactions.map(t => t.TRANSACTION_CURRENCY_ID)).size}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-lg border-slate-200 overflow-hidden">
                <CardHeader className="bg-white border-b border-slate-100 flex flex-row items-center justify-between py-4">
                    <div>
                        <CardTitle className="text-lg">Transaction History</CardTitle>
                        <CardDescription>Native currency vs. reporting currency conversion log.</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Input placeholder="Search document..." className="w-64" />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead className="w-[150px]">Date</TableHead>
                                <TableHead>Document</TableHead>
                                <TableHead>Currency</TableHead>
                                <TableHead className="text-right">Amount (Original)</TableHead>
                                <TableHead className="text-right">Rate Used</TableHead>
                                <TableHead className="text-right">Base Amount (LC)</TableHead>
                                <TableHead className="text-right">Settled</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={8} className="text-center py-10">Loading transactions...</TableCell></TableRow>
                            ) : transactions.length === 0 ? (
                                <TableRow><TableCell colSpan={8} className="text-center py-10 text-slate-400">No multi-currency transactions found.</TableCell></TableRow>
                            ) : (
                                transactions.map((tx) => (
                                    <TableRow key={tx.TRANSACTION_ID} className="hover:bg-slate-50 transition-colors">
                                        <TableCell className="font-medium">
                                            {new Date(tx.DOCUMENT_DATE).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-slate-700">{tx.DOCUMENT_NUMBER}</span>
                                                <span className="text-xs text-slate-400">{tx.DOCUMENT_TYPE}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-100">
                                                {tx.CURRENCY_SYMBOL} {tx.CURRENCY_NAME}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-mono">
                                            {parseFloat(tx.TRANSACTION_AMOUNT).toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-right text-slate-500 font-mono">
                                            {parseFloat(tx.EXCHANGE_RATE_USED).toFixed(4)}
                                        </TableCell>
                                        <TableCell className="text-right font-bold text-slate-900 font-mono">
                                            {parseFloat(tx.BASE_AMOUNT).toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-right text-slate-500 font-mono">
                                            {parseFloat(tx.SETTLED_AMOUNT || "0").toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                className={
                                                    tx.STATUS === 'FULLY_SETTLED' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none' :
                                                        tx.STATUS === 'PARTIAL' ? 'bg-amber-100 text-amber-700 hover:bg-amber-100 border-none' :
                                                            'bg-slate-100 text-slate-700 hover:bg-slate-100 border-none'
                                                }
                                            >
                                                {tx.STATUS}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
