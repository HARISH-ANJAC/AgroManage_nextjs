"use client";

import { ShoppingCart, DollarSign, Package, TrendingUp, Truck, AlertTriangle, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { useDashboard } from "@/hooks/useDashboard";

const ICON_MAP: Record<string, any> = {
  ShoppingCart,
  DollarSign,
  Package,
  TrendingUp,
  Truck,
  AlertTriangle
};

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-center">
        <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
        <p className="font-semibold">Failed to load dashboard</p>
        <p className="text-sm opacity-80">{(error as Error).message}</p>
      </div>
    );
  }

  const stats = data?.stats || [];
  const barData = data?.monthlyData || [];
  const pieData = data?.categories || [];
  const recentActivity = data?.recentActivity || [];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((s: any) => {
          const Icon = ICON_MAP[s.icon] || Package;
          return (
            <div key={s.label} className="bg-card rounded-xl p-4 shadow-sm border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{s.label}</span>
                <Icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-amber-600 mt-1">{s.change}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-xl p-6 border shadow-sm">
          <h3 className="font-semibold text-foreground mb-4">Purchases vs Sales (Monthly)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  borderColor: "hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px"
                }} 
              />
              <Bar dataKey="purchases" fill="hsl(150, 35%, 22%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="sales" fill="hsl(38, 80%, 55%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card rounded-xl p-6 border shadow-sm">
          <h3 className="font-semibold text-foreground mb-4">Product Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value">
                {pieData.map((entry: any) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Legend />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  borderColor: "hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px"
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card rounded-xl p-6 border shadow-sm">
        <h3 className="font-semibold text-foreground mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivity.map((a: any) => (
            <div key={a.ref} className="flex items-center justify-between py-3 border-b last:border-0 border-border/50">
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${a.statusColor}`} />
                <div>
                  <p className="text-sm font-semibold text-foreground">{a.ref}</p>
                  <p className="text-xs text-muted-foreground">{a.company}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">{a.amount}</p>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{a.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
