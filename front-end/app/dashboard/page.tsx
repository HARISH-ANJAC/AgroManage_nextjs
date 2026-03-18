'use client';

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { StatCard } from "@/components/StatCard";
import { ShoppingCart, DollarSign, Package, TrendingUp, Truck, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const monthlyData = [
  { month: "Jan", purchases: 42000, sales: 58000 },
  { month: "Feb", purchases: 38000, sales: 52000 },
  { month: "Mar", purchases: 55000, sales: 67000 },
  { month: "Apr", purchases: 47000, sales: 61000 },
  { month: "May", purchases: 51000, sales: 72000 },
  { month: "Jun", purchases: 60000, sales: 80000 },
];

const categoryData = [
  { name: "Maize", value: 35 },
  { name: "Rice", value: 25 },
  { name: "Wheat", value: 20 },
  { name: "Soybeans", value: 12 },
  { name: "Other", value: 8 },
];

const COLORS = [
  "hsl(145, 45%, 28%)",
  "hsl(35, 80%, 55%)",
  "hsl(200, 70%, 50%)",
  "hsl(0, 72%, 51%)",
  "hsl(280, 60%, 50%)",
];

const recentOrders = [
  { id: "PO/MA/03/001", party: "Green Valley Farms", amount: "$12,500", status: "Pending" },
  { id: "PO/RI/03/002", party: "Eastern Grains Ltd", amount: "$8,200", status: "Received" },
  { id: "SO/03/001", party: "Metro Foods Inc", amount: "$15,800", status: "Delivered" },
  { id: "PO/WH/03/003", party: "Sunset Agriculture", amount: "$6,400", status: "In Transit" },
];

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
      router.replace('/login');
    }
  }, [router]);

  return (
    <main className="p-6 space-y-6 animate-fade-in bg-background flex-1 overflow-auto">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Total Purchases" value="$293,000" change="+12% from last month" changeType="positive" icon={ShoppingCart} />
        <StatCard title="Total Sales" value="$390,000" change="+18% from last month" changeType="positive" icon={DollarSign} />
        <StatCard title="Products" value="48" change="3 new this month" changeType="neutral" icon={Package} />
        <StatCard title="Revenue" value="$97,000" change="+23% from last month" changeType="positive" icon={TrendingUp} />
        <StatCard title="Pending Deliveries" value="12" change="5 due today" changeType="neutral" icon={Truck} />
        <StatCard title="Low Stock Alerts" value="7" change="Action required" changeType="negative" icon={AlertTriangle} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5 shadow-sm">
          <h3 className="font-display font-semibold text-sm mb-4">Purchases vs Sales (Monthly)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(40, 15%, 88%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="purchases" fill="hsl(145, 45%, 28%)" radius={[4, 4, 0, 0]} name="Purchases" />
              <Bar dataKey="sales" fill="hsl(35, 80%, 55%)" radius={[4, 4, 0, 0]} name="Sales" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <h3 className="font-display font-semibold text-sm mb-4">Product Categories</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 mt-2 justify-center">
            {categoryData.map((entry, i) => (
              <div key={entry.name} className="flex items-center gap-1.5 text-xs">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-muted-foreground">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
        <h3 className="font-display font-semibold text-sm mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
              <div className="flex items-center gap-3">
                <div className={`h-2.5 w-2.5 rounded-full ${
                  order.status === "Delivered" || order.status === "Received" ? "bg-success" :
                  order.status === "Pending" ? "bg-warning" : "bg-info"
                }`} />
                <div>
                  <p className="text-sm font-semibold">{order.id}</p>
                  <p className="text-xs text-muted-foreground">{order.party}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-foreground">{order.amount}</p>
                <p className="text-[10px] font-black uppercase text-muted-foreground">{order.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
