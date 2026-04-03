"use client";

import { ShoppingCart, DollarSign, Package, TrendingUp, Truck, AlertTriangle, Users, CheckCircle2, Clock, FileText } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { usePurchaseDashboard } from "@/hooks/useDashboard";
import { Skeleton } from "@/components/ui/skeleton";

const ICON_MAP: Record<string, any> = {
  ShoppingCart,
  DollarSign,
  Package,
  TrendingUp,
  Truck,
  AlertTriangle,
  Users,
  CheckCircle2,
  Clock,
  FileText
};

export default function PurchaseDashboard() {
  const { data, isLoading, error } = usePurchaseDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-card rounded-xl p-4 shadow-sm border space-y-3">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-8 w-24" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card rounded-xl p-6 border shadow-sm h-[400px]">
            <Skeleton className="h-full w-full" />
          </div>
          <div className="bg-card rounded-xl p-6 border shadow-sm h-[400px]">
            <Skeleton className="h-full w-full rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-center">
        <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
        <p className="font-semibold">Failed to load purchase dashboard</p>
        <p className="text-sm opacity-80">{(error as Error).message}</p>
      </div>
    );
  }

  const stats = data?.stats || [];
  const barData = data?.monthlyData || [];
  const pieData = data?.supplierMetrics || [];
  const recentActivity = data?.recentActivity || [];

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Purchase Dashboard</h1>
            <p className="text-sm text-slate-500">Overview of procurement, suppliers and purchase orders</p>
          </div>
       </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((s: any) => {
          const Icon = ICON_MAP[s.icon] || Package;
          return (
            <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{s.label}</span>
                <div className={`p-2 rounded-lg bg-slate-50 ${s.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900">{s.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
             <TrendingUp className="w-5 h-5 text-primary" />
             Purchase Trends (Monthly)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ 
                  backgroundColor: "#fff", 
                  borderColor: "#e2e8f0",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: 600,
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)"
                }} 
              />
              <Bar dataKey="purchases" fill="hsl(150, 40%, 30%)" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Top Suppliers (Volume)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                {pieData.map((entry: any) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                 contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: '20px', fontSize: '11px', fontWeight: 600 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Recent Purchase Orders</h3>
        <div className="overflow-x-auto">
           <table className="w-full">
              <thead>
                 <tr className="text-left text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <td className="pb-4">Ref No</td>
                    <td className="pb-4">Supplier</td>
                    <td className="pb-4">Date</td>
                    <td className="pb-4">Amount</td>
                    <td className="pb-4 text-right">Status</td>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentActivity.map((a: any) => (
                  <tr key={a.ref} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 text-sm font-bold text-slate-900">{a.ref}</td>
                    <td className="py-4">
                       <span className="text-sm font-medium text-slate-600">{a.company}</span>
                    </td>
                    <td className="py-4 text-xs text-slate-400 font-medium">{new Date(a.date).toLocaleDateString()}</td>
                    <td className="py-4 text-sm font-bold text-slate-900">{a.amount}</td>
                    <td className="py-4 text-right">
                       <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                         a.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 
                         a.status === 'PENDING' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'
                       }`}>
                          {a.status}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
}
