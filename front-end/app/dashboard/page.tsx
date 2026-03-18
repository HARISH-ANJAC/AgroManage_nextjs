"use client";

import { ShoppingCart, DollarSign, Package, TrendingUp, Truck, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const stats = [
  { label: "TOTAL PURCHASES", value: "$293,000", change: "+12% from last month", icon: ShoppingCart, color: "text-primary" },
  { label: "TOTAL SALES", value: "$390,000", change: "+18% from last month", icon: DollarSign, color: "text-green-500" },
  { label: "PRODUCTS", value: "48", change: "3 new this month", icon: Package, color: "text-blue-500" },
  { label: "REVENUE", value: "$97,000", change: "+23% from last month", icon: TrendingUp, color: "text-amber-500" },
  { label: "PENDING DELIVERIES", value: "12", change: "5 due today", icon: Truck, color: "text-primary" },
  { label: "LOW STOCK ALERTS", value: "7", change: "Action required", icon: AlertTriangle, color: "text-destructive" },
];

const barData = [
  { month: "Jan", purchases: 42000, sales: 55000 },
  { month: "Feb", purchases: 38000, sales: 48000 },
  { month: "Mar", purchases: 50000, sales: 58000 },
  { month: "Apr", purchases: 45000, sales: 52000 },
  { month: "May", purchases: 55000, sales: 68000 },
  { month: "Jun", purchases: 60000, sales: 75000 },
];

const pieData = [
  { name: "Maize", value: 35, color: "hsl(150, 35%, 22%)" },
  { name: "Rice", value: 25, color: "hsl(38, 80%, 55%)" },
  { name: "Wheat", value: 18, color: "hsl(210, 80%, 52%)" },
  { name: "Soybeans", value: 12, color: "hsl(0, 72%, 51%)" },
  { name: "Other", value: 10, color: "hsl(280, 50%, 50%)" },
];

const recentActivity = [
  { ref: "PO/MA/03/001", company: "Green Valley Farms", amount: "$12,500", status: "PENDING", statusColor: "bg-amber-500" },
  { ref: "PO/RI/03/002", company: "Eastern Grains Ltd", amount: "$8,200", status: "RECEIVED", statusColor: "bg-green-500" },
  { ref: "SO/03/001", company: "Metro Foods Inc", amount: "$15,800", status: "DELIVERED", statusColor: "bg-green-500" },
  { ref: "PO/WH/03/003", company: "Sunset Agriculture", amount: "$6,400", status: "IN TRANSIT", statusColor: "bg-blue-500" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-card rounded-xl p-4 shadow-sm border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{s.label}</span>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-amber-600 mt-1">{s.change}</p>
          </div>
        ))}
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
                {pieData.map((entry) => (
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
          {recentActivity.map((a) => (
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
