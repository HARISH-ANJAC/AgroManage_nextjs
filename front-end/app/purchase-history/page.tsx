"use client";

import { useEffect, useState, useMemo } from "react";
import { Search, Eye, Calendar, User, Building2, History, ArrowLeft, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useRouter } from 'next/navigation';
import { usePurchaseOrderStore } from "@/hooks/usePurchaseOrderStore";
import { useMasterData } from "@/hooks/useMasterData";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const statusColors: Record<string, string> = {
  Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Submitted: "bg-blue-50 text-blue-700 border-blue-200",
  Draft: "bg-slate-50 text-slate-700 border-slate-200",
  Rejected: "bg-red-50 text-red-700 border-red-200",
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
};

export default function PurchaseHistoryPage() {
  const { orders, isLoading } = usePurchaseOrderStore();
  const { data: companies = [] } = useMasterData("product-company-category-mappings");
  const { data: suppliers = [] } = useMasterData("suppliers");
  const [search, setSearch] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("all");
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>("all");
  
  const navigate = useRouter();

  const filtered = useMemo(() => {
    return (orders || []).filter((o: any) => {
      const h = o.header || o;
      const matchesSearch = (h.PO_REF_NO || "").toLowerCase().includes(search.toLowerCase());
      const matchesCompany = selectedCompanyId === "all" || Number(h.COMPANY_ID) === Number(selectedCompanyId);
      const matchesSupplier = selectedSupplierId === "all" || Number(h.SUPPLIER_ID) === Number(selectedSupplierId);
      return matchesSearch && matchesCompany && matchesSupplier;
    }).sort((a: any, b: any) => new Date(b.PO_DATE).getTime() - new Date(a.PO_DATE).getTime());
  }, [orders, search, selectedCompanyId, selectedSupplierId]);

  return (
    <div className="max-w-[1600px] mx-auto pb-20 px-4 pt-6 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate.back()} className="rounded-full h-10 w-10 p-0"><ArrowLeft className="w-5 h-5" /></Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <History className="w-6 h-6 text-primary" />
              Purchase History
            </h1>
            <p className="text-sm text-slate-500">View and track past purchase orders across all suppliers</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden transition-all duration-300">
        <div className="p-8 border-b border-slate-100 bg-slate-50/30">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Search PO</label>
              <div className="relative group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                <Input 
                  placeholder="Enter PO Reference..." 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                  className="pl-10 h-11 rounded-xl bg-white border-slate-200 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Filter Company</label>
              <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
                <SelectTrigger className="h-11 rounded-xl bg-white border-slate-200">
                   <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      <SelectValue placeholder="All Companies" />
                   </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">All Companies</SelectItem>
                  {companies.map((c: any) => (
                    <SelectItem key={c.id} value={String(c.companyId)}>{c.companyName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Filter Supplier</label>
              <Select value={selectedSupplierId} onValueChange={setSelectedSupplierId}>
                <SelectTrigger className="h-11 rounded-xl bg-white border-slate-200">
                   <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" />
                      <SelectValue placeholder="All Suppliers" />
                   </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">All Suppliers</SelectItem>
                  {suppliers.map((s: any) => (
                    <SelectItem key={s.id} value={String(s.id)}>{s.supplierName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
               <div className="bg-emerald-50 text-emerald-700 font-bold px-4 h-11 rounded-xl flex items-center justify-between w-full border border-emerald-100">
                  <span className="text-xs uppercase tracking-tight">Total Results:</span>
                  <span className="text-lg">{filtered.length}</span>
               </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 space-y-4">
               {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-2xl" />)}
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="text-left p-6 font-bold text-xs uppercase text-slate-400 tracking-widest">PO Reference</th>
                  <th className="text-left p-6 font-bold text-xs uppercase text-slate-400 tracking-widest">Date</th>
                  <th className="text-left p-6 font-bold text-xs uppercase text-slate-400 tracking-widest">Company</th>
                  <th className="text-left p-6 font-bold text-xs uppercase text-slate-400 tracking-widest">Supplier</th>
                  <th className="text-right p-6 font-bold text-xs uppercase text-slate-400 tracking-widest">Amount</th>
                  <th className="text-center p-6 font-bold text-xs uppercase text-slate-400 tracking-widest">Status</th>
                  <th className="text-center p-6 font-bold text-xs uppercase text-slate-400 tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o: any) => {
                  const h = o.header || o;
                  const company = companies.find(c => Number(c.companyId) === Number(h.COMPANY_ID))?.companyName || h.COMPANY_ID;
                  const supplier = suppliers.find(s => Number(s.id) === Number(h.SUPPLIER_ID))?.supplierName || h.SUPPLIER_ID;
                  
                  return (
                    <tr key={h.PO_REF_NO} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                      <td className="p-6">
                        <span className="font-bold text-slate-900 group-hover:text-primary transition-colors text-sm">{h.PO_REF_NO}</span>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2 text-slate-500 font-medium text-xs">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(h.PO_DATE)}
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2 text-slate-700 font-bold text-xs">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          {company}
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2 text-slate-700 font-bold text-xs">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          {supplier}
                        </div>
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex flex-col items-end">
                           <span className="font-bold text-slate-900 text-sm">{(Number(h.FINAL_PURCHASE_HDR_AMOUNT) || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                           <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">TZS equivalent</span>
                        </div>
                      </td>
                      <td className="p-6 text-center">
                        <Badge className={`rounded-lg px-3 py-1 font-bold text-[10px] uppercase tracking-wider border ${statusColors[h.STATUS_ENTRY] || ""}`}>
                          {h.STATUS_ENTRY}
                        </Badge>
                      </td>
                      <td className="p-6 text-center">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => navigate.push(`/purchase-orders/create?id=${encodeURIComponent(h.PO_REF_NO)}`)}
                          className="rounded-xl h-9 px-4 font-bold border-slate-200 hover:bg-primary hover:text-white transition-all shadow-sm"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-20 text-center">
                       <div className="flex flex-col items-center justify-center max-w-xs mx-auto">
                          <div className="size-16 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-200 mb-6 border shadow-sm">
                             <History className="w-8 h-8" />
                          </div>
                          <h3 className="text-lg font-bold text-slate-900 mb-2">No History Found</h3>
                          <p className="text-sm text-slate-500">Adjust your search or filters to find specific purchase orders from the past.</p>
                       </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
