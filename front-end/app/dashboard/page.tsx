'use client';

import React from 'react';
import {
  ShoppingCart,
  DollarSign,
  Package,
  TrendingUp,
  Truck,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  MoreHorizontal
} from 'lucide-react';
import {
  mockPurchaseOrders,
  mockSalesOrders,
  mockProducts,
  formatCurrency,
  formatDate
} from '@/app/mock';

import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  React.useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
      router.replace('/login');
    }
  }, [router]);

  // Aggregate monthly data from mock orders
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  const monthlyData = months.map(month => {
    const monthShort = month;
    const sales = mockSalesOrders
      .filter(so => new Date(so.salesOrderDate).toLocaleString('default', { month: 'short' }) === monthShort)
      .reduce((sum, so) => sum + so.finalSalesAmount, 0);

    const purchases = mockPurchaseOrders
      .filter(po => new Date(po.poDate).toLocaleString('default', { month: 'short' }) === monthShort)
      .reduce((sum, po) => sum + po.finalPurchaseHdrAmount, 0);

    return { label: month, p: purchases, s: sales };
  });

  // Calculate scaling for bar chart (max value to 100%)
  const maxOrderVal = Math.max(...monthlyData.map(m => Math.max(m.p, m.s)), 1000);
  const chartBars = monthlyData.map(m => ({
    label: m.label,
    p: (m.p / maxOrderVal) * 100,
    s: (m.s / maxOrderVal) * 100,
    rawP: m.p,
    rawS: m.s
  }));

  // Aggregate Category Distribution
  const categoryCounts = mockProducts.reduce((acc, prd) => {
    const category = prd.subCategoryName || 'Others';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalProducts = mockProducts.length;
  const categoryDistribution = Object.entries(categoryCounts).map(([name, count]) => ({
    name,
    percentage: Math.round((count / totalProducts) * 100),
    color: name === 'Maize' ? 'bg-primary' : name === 'Rice' ? 'bg-secondary' : name === 'Wheat' ? 'bg-sky-400' : 'bg-rose-500'
  }));

  // KPI Calculations
  const totalPurchasesValue = mockPurchaseOrders.reduce((acc, curr) => acc + curr.finalPurchaseHdrAmount, 0);
  const totalSalesValue = mockSalesOrders.reduce((acc, curr) => acc + curr.finalSalesAmount, 0);
  const revenueValue = totalSalesValue - (totalPurchasesValue * 0.65);
  const pendingDeliveriesCount = mockSalesOrders.filter(so => so.statusEntry === 'Confirmed').length;
  const lowStockCount = 4; // Mock logic

  return (
    <main className="flex-1 flex flex-col min-w-0 bg-[#fafafa]">
      {/* Dashboard Body - Better spacing for mobile */}
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-[1600px] mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* KPI Cards - Responsive Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
          {/* Total Purchases */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
            <div className="flex items-start justify-between mb-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Purchases</p>
              <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                <ShoppingCart size={18} strokeWidth={2.5} />
              </div>
            </div>
            <p className="text-xl font-display font-bold text-slate-900">{formatCurrency(totalPurchasesValue)}</p>
            <p className="text-[10px] text-green-600 font-bold mt-1">+12% from last month</p>
          </div>

          {/* Total Sales */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
            <div className="flex items-start justify-between mb-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Sales</p>
              <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                <DollarSign size={18} strokeWidth={2.5} />
              </div>
            </div>
            <p className="text-xl font-display font-bold text-slate-900">{formatCurrency(totalSalesValue)}</p>
            <p className="text-[10px] text-green-600 font-bold mt-1">+18% from last month</p>
          </div>

          {/* Products */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
            <div className="flex items-start justify-between mb-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Products</p>
              <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                <Package size={18} strokeWidth={2.5} />
              </div>
            </div>
            <p className="text-xl font-display font-bold text-slate-900">{totalProducts}</p>
            <p className="text-[10px] text-slate-400 font-bold mt-1">3 new this month</p>
          </div>

          {/* Revenue */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
            <div className="flex items-start justify-between mb-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Revenue</p>
              <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                <TrendingUp size={18} strokeWidth={2.5} />
              </div>
            </div>
            <p className="text-xl font-display font-bold text-slate-900">{formatCurrency(revenueValue)}</p>
            <p className="text-[10px] text-green-600 font-bold mt-1">+23% from last month</p>
          </div>

          {/* Pending Deliveries */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
            <div className="flex items-start justify-between mb-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Deliveries</p>
              <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                <Truck size={18} strokeWidth={2.5} />
              </div>
            </div>
            <p className="text-xl font-display font-bold text-slate-900">{pendingDeliveriesCount}</p>
            <p className="text-[10px] text-slate-400 font-bold mt-1">5 due today</p>
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-red-200/20 transition-all duration-300 group">
            <div className="flex items-start justify-between mb-3">
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Low Stock Alerts</p>
              <div className="size-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                <AlertTriangle size={18} strokeWidth={2.5} />
              </div>
            </div>
            <p className="text-xl font-display font-bold text-slate-900">{lowStockCount}</p>
            <p className="text-[10px] text-red-500 font-bold mt-1">Action required</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Purchases vs Sales Bar Chart */}
          <div className="lg:col-span-2 bg-white p-4 sm:p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <h3 className="font-display font-bold text-slate-800 text-sm sm:text-base">Purchases vs Sales (Monthly)</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <span className="size-2 rounded-full bg-primary"></span> Purchases
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <span className="size-2 rounded-full bg-secondary"></span> Sales
                </div>
              </div>
            </div>
            <div className="h-48 sm:h-64 flex items-end justify-between gap-2 sm:gap-4 px-1 sm:px-2">
              {chartBars.map((bar, i) => (
                <div key={bar.label} className="flex-1 flex flex-col justify-end gap-1 group">
                  <div className="flex items-end gap-1.5 h-full relative">
                    <div
                      className="w-full bg-primary/20 rounded-t-sm transition-all group-hover:bg-primary/40"
                      style={{ height: `${bar.p}%`, background: bar.rawP === maxOrderVal ? 'hsl(var(--primary))' : '' }}
                      title={formatCurrency(bar.rawP)}
                    ></div>
                    <div
                      className="w-full bg-secondary/20 rounded-t-sm transition-all group-hover:bg-secondary/40"
                      style={{ height: `${bar.s}%`, background: bar.rawS === maxOrderVal ? 'hsl(var(--secondary))' : '' }}
                      title={formatCurrency(bar.rawS)}
                    ></div>
                  </div>
                  <span className="text-[10px] text-center text-slate-400 mt-2 font-bold uppercase">{bar.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Product Categories Doughnut */}
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col hover:shadow-md transition-shadow duration-300">
            <h3 className="font-display font-bold text-slate-800 mb-8 uppercase text-xs tracking-widest text-center">Product Categories</h3>
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="relative size-40 rounded-full border-24 border-primary flex items-center justify-center mb-10 shadow-inner">
                <div className="absolute inset-[-24px] rounded-full border-24 border-transparent border-t-secondary border-r-sky-400 border-b-rose-500 border-l-purple-500 rotate-45"></div>
                <div className="text-center">
                  <p className="text-3xl font-display font-black text-slate-800">{totalProducts}</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Total Items</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3 w-full">
                {categoryDistribution.map(cat => (
                  <div key={cat.name} className="flex items-center justify-between group cursor-default">
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold">
                      <span className={`size-2 rounded-full ${cat.color}`}></span> {cat.name}
                    </div>
                    <span className={`text-[10px] font-black text-slate-300 group-hover:text-slate-600 transition-colors`}>{cat.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-10">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white">
            <h3 className="font-display font-bold text-slate-800 tracking-tight">Recent Activity</h3>
            <button className="text-secondary text-[10px] font-black hover:underline underline-offset-4 uppercase tracking-[0.2em] transition-all">
              View All Activity
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#fcfcfd]">
                <tr>
                  <th className="px-4 sm:px-8 py-4 sm:py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Transaction ID</th>
                  <th className="px-4 sm:px-8 py-4 sm:py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hidden xs:table-cell">Entity / Party</th>
                  <th className="px-4 sm:px-8 py-4 sm:py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Amount</th>
                  <th className="px-4 sm:px-8 py-4 sm:py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hidden sm:table-cell">Date</th>
                  <th className="px-4 sm:px-8 py-4 sm:py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {/* Combined & Sorted Activity */}
                {[...mockSalesOrders, ...mockPurchaseOrders]
                  .sort((a, b) => {
                    const dateB = new Date('salesOrderDate' in b ? b.salesOrderDate : b.poDate).getTime();
                    const dateA = new Date('salesOrderDate' in a ? a.salesOrderDate : a.poDate).getTime();
                    return dateB - dateA;
                  })
                  .slice(0, 5)
                  .map((item) => {
                    const isSO = 'salesOrderRefNo' in item;
                    const refNo = isSO ? item.salesOrderRefNo : item.poRefNo;
                    const name = isSO ? item.customerName : item.supplierName;
                    const amount = isSO ? item.finalSalesAmount : item.finalPurchaseHdrAmount;
                    const date = isSO ? item.salesOrderDate : item.poDate;
                    const status = item.statusEntry;

                    return (
                      <tr key={refNo} className="hover:bg-slate-50/80 transition-all group duration-300">
                        <td className="px-4 sm:px-8 py-4 sm:py-5">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <span className={`size-2 rounded-full ${isSO ? 'bg-secondary' : 'bg-primary'} shadow-sm shrink-0`}></span>
                            <span className={`text-xs sm:text-sm font-black text-slate-800 tracking-tight group-hover:text-primary transition-colors`}>{refNo}</span>
                          </div>
                        </td>
                        <td className="px-4 sm:px-8 py-4 sm:py-5 hidden xs:table-cell">
                          <div className="flex flex-col">
                            <span className="text-xs sm:text-sm font-bold text-slate-600 truncate max-w-[120px]">{name}</span>
                            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-wider">{isSO ? 'Customer' : 'Supplier'}</span>
                          </div>
                        </td>
                        <td className="px-4 sm:px-8 py-4 sm:py-5 text-xs sm:text-sm font-black text-slate-800">{formatCurrency(amount)}</td>
                        <td className="px-4 sm:px-8 py-4 sm:py-5 text-[10px] sm:text-xs text-slate-400 font-bold hidden sm:table-cell">{formatDate(date)}</td>
                        <td className="px-4 sm:px-8 py-4 sm:py-5">
                          <span className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${status === 'Confirmed' || status === 'Approved' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                            }`}>
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
