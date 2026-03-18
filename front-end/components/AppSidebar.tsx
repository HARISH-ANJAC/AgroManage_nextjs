"use client";

import { useState } from "react";
import { usePathname } from 'next/navigation';

import {
  LayoutDashboard, Package, Users, ShoppingCart, ClipboardCheck,
  Settings, LogOut, Sprout, ChevronDown, Building2, Store,
  MapPin, Calendar, Tag, Ruler, Landmark, CreditCard, Receipt, FileText,
  Truck, DollarSign, BarChart3, Briefcase, Globe, Map, MapPinned,
  Shield, UserCircle, Link2, Layers, Database, ArrowRightLeft,
  Percent, BookOpen, Wallet, CircleDollarSign, Coins, Hash
} from "lucide-react";

interface NavItem { label: string; path: string; icon: React.ElementType; }
interface NavSection { title: string; items: NavItem[]; }

const navSections: NavSection[] = [
  {
    title: "OVERVIEW",
    items: [{ label: "Dashboard", path: "/", icon: LayoutDashboard }],
  },
  {
    title: "ORGANIZATION",
    items: [
      { label: "Companies", path: "/companies", icon: Building2 },
      { label: "Stores", path: "/stores", icon: Store },
      { label: "Locations", path: "/locations", icon: MapPin },
      { label: "Billing Locations", path: "/billing-locations", icon: MapPinned },
      { label: "Financial Years", path: "/financial-years", icon: Calendar },
    ],
  },
  {
    title: "INVENTORY",
    items: [
      { label: "Products", path: "/products", icon: Package },
      { label: "Main Categories", path: "/categories", icon: Tag },
      { label: "Sub Categories", path: "/sub-categories", icon: Layers },
      { label: "UOM", path: "/uom", icon: Ruler },
      { label: "Min Stock Settings", path: "/store-product-min-stock", icon: Database },
      { label: "Opening Stock", path: "/product-opening-stock", icon: Database },
      { label: "Category Mapping", path: "/product-company-category", icon: Link2 },
    ],
  },
  {
    title: "STAKEHOLDERS",
    items: [
      { label: "Suppliers", path: "/suppliers", icon: Truck },
      { label: "Customers", path: "/customers", icon: Users },
      { label: "Employees", path: "/employees", icon: Briefcase },
      { label: "Sales Persons", path: "/sales-persons", icon: UserCircle },
    ],
  },
  {
    title: "FINANCIAL",
    items: [
      { label: "Banks", path: "/bank-master", icon: Landmark },
      { label: "Bank Accounts", path: "/bank-accounts", icon: Wallet },
      { label: "Currencies", path: "/currencies", icon: Coins },
      { label: "Exchange Rates", path: "/exchange-rates", icon: ArrowRightLeft },
      { label: "Tax Master", path: "/tax-master", icon: Receipt },
      { label: "VAT Settings", path: "/vat-settings", icon: Percent },
      { label: "Account Heads", path: "/account-heads", icon: FileText },
      { label: "Ledger Groups", path: "/ledger-groups", icon: BookOpen },
      { label: "Ledger Master", path: "/ledger-master", icon: BookOpen },
      { label: "Payment Modes", path: "/payment-modes", icon: CreditCard },
      { label: "Customer Pay Modes", path: "/customer-payment-modes", icon: CreditCard },
      { label: "Payment Terms", path: "/payment-terms", icon: Hash },
      { label: "Additional Cost Types", path: "/additional-cost-types", icon: CircleDollarSign },
    ],
  },
  {
    title: "GEOGRAPHY",
    items: [
      { label: "Countries", path: "/countries", icon: Globe },
      { label: "Regions", path: "/regions", icon: Map },
      { label: "Districts", path: "/districts", icon: MapPinned },
    ],
  },
  {
    title: "PURCHASING",
    items: [
      { label: "Purchase Orders", path: "/purchase-orders", icon: ShoppingCart },
      { label: "Goods Receipts", path: "/goods-receipts", icon: ClipboardCheck },
      { label: "Purchase Invoices", path: "/purchase-booking", icon: FileText },
    ],
  },
  {
    title: "SALES",
    items: [
      { label: "Sales Orders", path: "/sales-orders", icon: DollarSign },
      { label: "Delivery Notes", path: "/delivery-notes", icon: Truck },
      { label: "Sales Invoices", path: "/sales-invoices", icon: Receipt },
      { label: "Customer Receipts", path: "/customer-receipts", icon: Wallet },
    ],
  },
  {
    title: "FINANCE",
    items: [
      { label: "Expenses", path: "/expenses", icon: CreditCard },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      { label: "Roles", path: "/roles", icon: Shield },
      { label: "Users", path: "/users", icon: UserCircle },
      { label: "User-Store Map", path: "/user-store-mapping", icon: Link2 },
    ],
  },
];

export default function AppSidebar() {
  const location = usePathname();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleSection = (title: string) => {
    setCollapsed((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <aside className="sidebar-gradient flex flex-col w-[240px] min-h-screen text-sidebar-foreground">
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
          <Sprout className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-bold text-base text-sidebar-foreground">AgroManage</h1>
          <p className="text-[10px] uppercase tracking-widest text-sidebar-foreground/60">ERP v2.0</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {navSections.map((section) => (
          <div key={section.title} className="mb-1">
            <button
              onClick={() => toggleSection(section.title)}
              className="flex items-center justify-between w-full px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/50 hover:text-sidebar-foreground/70"
            >
              {section.title}
              <ChevronDown className={`w-3 h-3 transition-transform ${collapsed[section.title] ? "-rotate-90" : ""}`} />
            </button>
            {!collapsed[section.title] && (
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? "bg-accent text-accent-foreground"
                          : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                      }`}
                    >
                      <item.icon className="w-3.5 h-3.5" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="px-3 pb-2">
        <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-sidebar-accent">
          <div className="w-9 h-9 rounded-full bg-sidebar-foreground/20 flex items-center justify-center text-sm font-bold">JT</div>
          <div>
            <p className="text-sm font-semibold text-sidebar-foreground">Julian Thorne</p>
            <p className="text-[10px] uppercase tracking-wider text-sidebar-foreground/50">Chief Agronomist</p>
          </div>
        </div>
        <Link to="/settings" className="flex items-center gap-3 px-3 py-2 mt-1 rounded-lg text-xs text-sidebar-foreground/70 hover:bg-sidebar-accent">
          <Settings className="w-3.5 h-3.5" /> Settings
        </Link>
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-sidebar-foreground/70 hover:bg-sidebar-accent w-full">
          <LogOut className="w-3.5 h-3.5" /> Sign Out
        </button>
      </div>
    </aside>
  );
}
