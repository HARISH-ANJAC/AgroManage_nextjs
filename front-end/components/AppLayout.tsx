"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar as AppSidebar } from "./sidebar"; // Updated import to use consolidated sidebar
import { Bell, Search } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/products": "Products",
  "/categories": "Categories",
  "/suppliers": "Suppliers",
  "/customers": "Customers",
  "/companies": "Companies",
  "/stores": "Stores",
  "/employees": "Employees",
  "/bank-accounts": "Bank Accounts",
  "/uom": "Units of Measure",
  "/tax-master": "Tax Master",
  "/account-heads": "Account Heads",
  "/billing-locations": "Billing Locations",
  "/financial-years": "Financial Years",
  "/payment-modes": "Payment Modes",
  "/purchase-orders": "Purchase Orders",
  "/purchase-orders/create": "Create",
  "/goods-receipts": "Goods Receipts",
  "/purchase-booking": "Purchase Booking",
  "/sales-orders": "Sales Orders",
  "/delivery-notes": "Delivery Notes",
  "/sales-invoices": "Sales Invoices",
  "/expenses": "Expenses",
  "/reports": "Reports",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const title = pageTitles[pathname] || "AgroManage";

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-3 border-b bg-card">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
              <span className="text-xs font-bold text-muted-foreground">⊞</span>
            </div>
            <span className="text-sm font-semibold text-foreground">{title}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-1.5 rounded-lg border bg-background text-sm w-56 focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <button className="relative p-2 rounded-lg hover:bg-muted">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-0 right-0 size-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
              JT
            </div>
          </div>
        </header>
        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
