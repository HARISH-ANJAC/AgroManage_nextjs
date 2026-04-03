"use client";

import { ShoppingCart, DollarSign, Package, TrendingUp, Truck, AlertTriangle, Users, CheckCircle2, Clock, FileText } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { useSalesDashboard } from "@/hooks/useDashboard";
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

export default function SalesDashboard() {
  const { data, isLoading, error } = useSalesDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
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
        <p className="font-semibold">Failed to load sales dashboard</p>
        <p className="text-sm opacity-80">{(error as Error).message}</p>
      </div>
    );
  }

  const stats = data?.stats || [];
  const barData = data?.monthlyData || [];
  const pieData = data?.customerMetrics || [];
  const recentActivity = data?.recentActivity || [];

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Sales Dashboard</h1>
            <p className="text-sm text-slate-500">Track revenue, customer growth and order performance</p>
          </div>
       </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s: any) => {
          const Icon = ICON_MAP[s.icon] || TrendingUp;
          return (
            <div key={s.label} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-slate-50 ${s.color}`}>
                   <Icon className="w-5 h-5" />
                </div>
                <div>
                   <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{s.label}</span>
                   <p className="text-2xl font-black text-slate-900 leading-none mt-1">{s.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
             <TrendingUp className="w-5 h-5 text-emerald-600" />
             Sales Growth Tracker
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
              <Bar dataKey="sales" fill="hsl(210, 80%, 45%)" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 font-primary">Revenue per Customer</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} dataKey="value">
                {pieData.map((entry: any) => (
                  <Cell key={entry.name} fill={entry.color} stroke="none" />
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

      {/* Activity Feed */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Recent Tax Invoices</h3>
        <div className="space-y-4">
           {recentActivity.map((a: any) => (
             <div key={a.ref} className="group p-5 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/20 transition-all">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="size-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-emerald-600 transition-colors">
                         <FileText className="w-5 h-5" />
                      </div>
                      <div>
                         <p className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{a.ref}</p>
                         <p className="text-xs text-slate-400 font-medium">{a.company}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-lg font-black text-slate-900">{a.amount}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{new Date(a.date).toLocaleDateString()}</p>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
