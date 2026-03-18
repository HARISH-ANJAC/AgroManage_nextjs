'use client';

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BarChart3, TrendingUp, Package, DollarSign } from "lucide-react";

const reportCards = [
  { title: "Purchase Reports", description: "Purchase by supplier, monthly purchases", icon: BarChart3 },
  { title: "Sales Reports", description: "Sales by customer, sales by product, revenue analytics", icon: TrendingUp },
  { title: "Inventory Reports", description: "Current stock, stock movement, low stock alerts", icon: Package },
  { title: "Expense Reports", description: "Expense by category, expense by purchase order", icon: DollarSign },
];

export default function ReportsPage() {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
      router.replace('/login');
    }
  }, [router]);

  return (
    <div className="animate-fade-in p-6 bg-background flex-1 overflow-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground">Reports</h1>
        <p className="text-muted-foreground mt-1">Generate business intelligence and financial reports</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportCards.map((report) => (
          <div key={report.title} className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer group">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <report.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <div>
                <h3 className="font-display font-semibold">{report.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
