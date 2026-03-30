"use client";

import { useQuery } from "@tanstack/react-query";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

export function useDashboard() {
  const getAuthToken = () => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("accessToken") || "";
  };

  const fetchDashboardData = async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        // Handle auth error if needed
      }
      throw new Error("Failed to fetch dashboard data");
    }

    const data = await response.json();
    
    // Map recentActivity to include statusColor and formatted amount
    const mappedRecentActivity = (data.recentActivity || []).map((a: any) => {
      let statusColor = "bg-muted-foreground";
      if (a.status === "PENDING") statusColor = "bg-amber-500";
      if (a.status === "RECEIVED") statusColor = "bg-green-500";
      if (a.status === "DELIVERED") statusColor = "bg-green-500";
      if (a.status === "IN TRANSIT") statusColor = "bg-blue-500";

      return {
        ...a,
        amount: `$${Number(a.amount).toLocaleString()}`,
        statusColor
      };
    });

    return {
      stats: [
        { label: "TOTAL PURCHASES", value: `$${Number(data.stats.totalPurchases).toLocaleString()}`, change: "+12% from last month", icon: "ShoppingCart", color: "text-primary" },
        { label: "TOTAL SALES", value: `$${Number(data.stats.totalSales).toLocaleString()}`, change: "+18% from last month", icon: "DollarSign", color: "text-green-500" },
        { label: "PRODUCTS", value: data.stats.products.toString(), change: "3 new this month", icon: "Package", color: "text-blue-500" },
        { label: "REVENUE", value: `$${Number(data.stats.revenue).toLocaleString()}`, change: "+23% from last month", icon: "TrendingUp", color: "text-amber-500" },
        { label: "PENDING DELIVERIES", value: data.stats.pendingDeliveries.toString(), change: "5 due today", icon: "Truck", color: "text-primary" },
        { label: "LOW STOCK ALERTS", value: data.stats.lowStockAlerts.toString(), change: "Action required", icon: "AlertTriangle", color: "text-destructive" },
      ],
      monthlyData: data.monthlyData,
      categories: data.categories,
      recentActivity: mappedRecentActivity
    };
  };

  return useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboardData,
  });
}
