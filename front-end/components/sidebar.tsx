'use client';

import React, { useState, createContext, useContext } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  Bell,
  PanelLeftClose,
  PanelLeftOpen,
  LayoutDashboard,
  Package,
  Truck,
  Users,
  UserCheck,
  ShoppingCart,
  ClipboardCheck,
  FileText,
  Receipt,
  DollarSign,
  Warehouse,
  Sprout,
  Settings,
  LogOut,
  X,
  BarChart3,
  Wallet,
  Building2,
  Store,
  MapPin,
  Calendar,
  Tag,
  Ruler,
  Landmark,
  CreditCard,
  Briefcase,
  Globe,
  Map,
  MapPinned,
  Shield,
  UserCircle,
  Link2,
  Layers,
  Database,
  ArrowRightLeft,
  Percent,
  BookOpen,
  CircleDollarSign,
  Coins,
  Hash,
  ChevronDown
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

// Context for managing sidebar state across the layout
const SidebarContext = createContext({
  isCollapsed: false,
  toggleSidebar: () => { },
  isMobileOpen: false,
  setIsMobileOpen: (open: boolean) => { },
});

export const useSidebar = () => useContext(SidebarContext);

export function Header() {
  const { toggleSidebar, isCollapsed } = useSidebar();
  const pathname = usePathname();

  // Simple breadcrumb logic
  const pathSegments = pathname.split('/').filter(Boolean);
  const currentPath = pathSegments[pathSegments.length - 1] || 'Dashboard';
  const formattedPath = currentPath.charAt(0).toUpperCase() + currentPath.slice(1).replace(/-/g, ' ');

  // Don't show header on login or root home pages
  if (pathname === '/' || pathname === '/login') return null;

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30 transition-all duration-500">
      <div className="flex items-center gap-3 sm:gap-6">
        <button
          onClick={toggleSidebar}
          className="text-slate-500 hover:text-primary transition-all active:scale-95 p-1"
        >
          {isCollapsed ? <PanelLeftOpen size={20} strokeWidth={2.5} /> : <PanelLeftClose size={20} strokeWidth={2.5} />}
        </button>
        <nav className="flex items-center gap-2 text-sm overflow-hidden whitespace-nowrap">
          <span className="text-slate-400 font-medium hidden xs:inline">Dashboard</span>
          <span className="text-slate-300 hidden xs:inline">/</span>
          <span className="text-slate-900 font-bold">{formattedPath}</span>
        </nav>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        <div className="relative w-40 sm:w-64 group hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4 group-focus-within:text-primary transition-colors" strokeWidth={2.5} />
          <input
            className="w-full bg-slate-50 border border-slate-200 rounded-full pl-10 pr-4 py-1.5 text-xs focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none transition-all placeholder:text-slate-400"
            placeholder="Search..."
            type="text"
          />
        </div>
        <button className="relative text-slate-400 hover:text-primary transition-colors active:scale-90 p-1">
          <Bell size={20} strokeWidth={2} />
          <span className="absolute top-0 right-0 size-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="flex items-center gap-3">
          <div className="size-8 sm:size-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-lg shadow-primary/20 shrink-0">
            JT
          </div>
        </div>
      </div>
    </header>
  );
}

const navigation = [
  {
    group: 'Overview',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ]
  },
  {
    group: 'Organization',
    items: [
      { name: 'Companies', href: '/companies', icon: Building2 },
      { name: 'Stores', href: '/stores', icon: Store },
      { name: 'Locations', href: '/locations', icon: MapPin },
      { name: 'Billing Locations', href: '/billing-locations', icon: MapPinned },
      { name: 'Financial Years', href: '/financial-years', icon: Calendar },
    ]
  },
  {
    group: 'Inventory',
    items: [
      { name: 'Products', href: '/products', icon: Package },
      { name: 'Main Categories', href: '/categories', icon: Tag },
      { name: 'Sub Categories', href: '/sub-categories', icon: Layers },
      { name: 'UOM', href: '/uom', icon: Ruler },
      { name: 'Min Stock Settings', href: '/store-product-min-stock', icon: Database },
      { name: 'Opening Stock', href: '/product-opening-stock', icon: Database },
      { name: 'Category Mapping', href: '/product-company-category-mapping', icon: Link2 },
    ]
  },
  {
    group: 'Stakeholders',
    items: [
      { name: 'Suppliers', href: '/suppliers', icon: Truck },
      { name: 'Customers', href: '/customers', icon: Users },
      { name: 'Employees', href: '/employees', icon: Briefcase },
      { name: 'Sales Persons', href: '/sales-persons', icon: UserCircle },
    ]
  },
  {
    group: 'Financial',
    items: [
      { name: 'Banks', href: '/bank-master', icon: Landmark },
      { name: 'Bank Accounts', href: '/bank-accounts', icon: Wallet },
      { name: 'Currencies', href: '/currency-master', icon: Coins },
      { name: 'Exchange Rates', href: '/exchange-rate', icon: ArrowRightLeft },
      { name: 'Tax Master', href: '/tax-master', icon: Receipt },
      { name: 'VAT Settings', href: '/vat-settings', icon: Percent },
      { name: 'Account Heads', href: '/account-heads', icon: FileText },
      { name: 'Ledger Groups', href: '/ledger-groups', icon: BookOpen },
      { name: 'Ledger Master', href: '/ledger-master', icon: BookOpen },
      { name: 'Payment Modes', href: '/payment-modes', icon: CreditCard },
      { name: 'Customer Pay Modes', href: '/customer-payment-modes', icon: CreditCard },
      { name: 'Payment Terms', href: '/payment-terms', icon: Hash },
      { name: 'Additional Cost Types', href: '/additional-cost-types', icon: CircleDollarSign },
    ]
  },
  {
    group: 'Geography',
    items: [
      { name: 'Countries', href: '/countries', icon: Globe },
      { name: 'Regions', href: '/regions', icon: Map },
      { name: 'Districts', href: '/districts', icon: MapPinned },
    ]
  },
  {
    group: 'Purchasing',
    items: [
      { name: 'Purchase Orders', href: '/purchase-orders', icon: ShoppingCart },
      { name: 'Goods Receipts', href: '/goods-receipts', icon: ClipboardCheck },
      { name: 'Purchase Invoices', href: '/purchase-booking', icon: FileText },
    ]
  },
  {
    group: 'Sales',
    items: [
      { name: 'Sales Orders', href: '/sales-orders', icon: DollarSign },
      { name: 'Delivery Notes', href: '/delivery-notes', icon: Truck },
      { name: 'Sales Invoices', href: '/sales-invoices', icon: Receipt },
      { name: 'Customer Receipts', href: '/customer-receipts', icon: Wallet },
    ]
  },
  {
    group: 'Finance',
    items: [
      { name: 'Expenses', href: '/expenses', icon: CreditCard },
    ]
  },
  {
    group: 'System',
    items: [
      { name: 'Roles', href: '/roles', icon: Shield },
      { name: 'Users', href: '/users', icon: UserCircle },
      { name: 'User-Store Map', href: '/user-store-mapping', icon: Link2 },
    ]
  }
];


export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar, isMobileOpen, setIsMobileOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar, isMobileOpen, setIsMobileOpen } = useSidebar();
  const isMobile = useIsMobile();
  const router = useRouter();
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (title: string) => {
    setCollapsedSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    router.push('/login');
  };

  // Don't show sidebar on login or root home pages
  if (pathname === '/' || pathname === '/login') return null;

  const SidebarContent = (
    <div className={`flex flex-col h-full sidebar-gradient border-r border-sidebar-border transition-all duration-500 ease-in-out`}>
      {/* Brand Section */}
      <div className={`px-6 py-8 flex items-center ${isCollapsed && !isMobile ? 'justify-center' : 'justify-between'}`}>
        <div className="flex items-center gap-3.5 group cursor-pointer overflow-hidden whitespace-nowrap">
          <div className="bg-amber-500/90 p-2.5 rounded-2xl shadow-lg shadow-amber-500/30 shrink-0 group-hover:rotate-6 transition-transform">
            <Sprout className="text-white w-7 h-7" strokeWidth={2.5} />
          </div>
          {(!isCollapsed || isMobile) && (
            <div className="flex flex-col animate-in fade-in slide-in-from-left-2 duration-300">
              <h1 className="text-xl font-display font-black text-white leading-none tracking-tight">AgroManage</h1>
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.25em] mt-1">Agro Business</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {navigation.map((group) => (
          <div key={group.group} className="mb-2">
            {(!isCollapsed || isMobile) ? (
              <button
                onClick={() => toggleSection(group.group)}
                className="flex items-center justify-between w-full px-4 py-2 text-[10px] font-black text-white/30 uppercase tracking-[0.3em] hover:text-white/50 transition-colors"
              >
                {group.group}
                <ChevronDown className={`w-3 h-3 transition-transform ${collapsedSections[group.group] ? "-rotate-90" : ""}`} />
              </button>
            ) : (
              <div className="h-4" /> // Spacer when collapsed
            )}

            {(!collapsedSections[group.group] || isCollapsed) && (
              <div className="space-y-0.5 mt-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      title={isCollapsed ? item.name : ''}
                      className={`flex items-center group px-4 py-2 rounded-xl transition-all duration-300 relative overflow-hidden ${isActive
                        ? 'text-white font-bold bg-amber-500 shadow-lg shadow-amber-500/40'
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                        } ${isCollapsed && !isMobile ? 'justify-center mx-1' : ''}`}
                    >
                      <div className="flex items-center gap-3.5">
                        <item.icon className={`w-[18px] h-[18px] shrink-0 transition-all duration-500 ${isActive ? 'text-white scale-110' : 'text-white/50 group-hover:text-amber-500 group-hover:scale-110'}`} strokeWidth={isActive ? 2.5 : 2} />
                        {(!isCollapsed || isMobile) && (
                          <span className={`text-[13px] tracking-tight whitespace-nowrap animate-in fade-in slide-in-from-left-1 duration-300 ${isActive ? 'font-black' : 'font-semibold'}`}>
                            {item.name}
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Sidebar Footer / User Profile */}
      <div className="mt-auto p-5 border-t border-white/5 space-y-4">
        <button className={`w-full flex items-center gap-4 p-3.5 rounded-2xl transition-all duration-500 ${isCollapsed && !isMobile ? 'justify-center px-0' : 'bg-white/10 backdrop-blur-sm border border-white/10 shadow-lg'} hover:bg-white/20 group`}>
          <div className="relative shrink-0">
            <div className="size-11 rounded-full bg-linear-to-tr from-white/10 to-white/20 border border-white/10 overflow-hidden shadow-inner group-hover:scale-110 transition-transform duration-700">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAX0gtvcHOOLcve2FWFBLfqrFuQikNqmGUVSW4PzyAbjQ4OMdvQPkJR8WP6wO07MVzKkYGiahd_I_xifcFE1Hhiz22zsAOjB_GPPq7tPYKmDurwtlXwLmIoucf_e0MrcvArWUwVfE5gAnFxxp7zk3OQN5TUH1UNTscLlmb-Azm5Xg162T3T84NiIB4LzNDv4gyRwheeldtC-BG_-pdMKHDDkv3x9oVXoW34NdgyduUI7qTZh34bqzQ0nC3Jp60HeOh4jbIS6WQCz9aw"
                alt="Julian Thorne"
                className="w-full h-full object-cover transition-all duration-1000 grayscale group-hover:grayscale-0"
              />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 size-3.5 bg-green-500 rounded-full border-4 border-sidebar animate-pulse shadow-sm" />
          </div>
          {(!isCollapsed || isMobile) && (
            <div className="flex-1 min-w-0 text-left animate-in fade-in slide-in-from-left-2 duration-300">
              <p className="text-sm font-black text-white truncate leading-none mb-1.5">Harish Prabhu</p>
              <p className="text-[10px] font-black text-white/20 uppercase truncate tracking-tight">Admin</p>
            </div>
          )}
        </button>

        <div className={`flex flex-col gap-1 ${isCollapsed && !isMobile ? 'items-center px-0' : ''}`}>

          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full px-4 py-2 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all ${isCollapsed && !isMobile ? 'justify-center' : ''}`}
            title="Sign Out"
          >
            <LogOut size={16} />
            {(!isCollapsed || isMobile) && <span className="text-xs font-bold">Sign Out</span>}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobile && (
        <div
          className={`fixed inset-0 bg-sidebar/80 backdrop-blur-md z-150 transition-opacity duration-500 ${isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-200 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) transform ${isMobile
          ? (isMobileOpen ? 'translate-x-0 w-[300px]' : '-translate-x-full w-[300px]')
          : (isCollapsed ? 'w-20' : 'w-[280px]')
          } shadow-2xl overflow-hidden`}
      >
        {isMobile && isMobileOpen && (
          <button
            onClick={() => setIsMobileOpen(false)}
            className="absolute top-6 right-6 size-11 bg-white/10 text-white rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/10 shadow-2xl active:scale-95 transition-transform duration-500"
          >
            <X size={24} strokeWidth={2.5} />
          </button>
        )}

        {SidebarContent}
      </aside>

      {/* Dynamic Spacer for Desktop Layout - Synchronized with Sidebar animation */}
      {!isMobile && (
        <div
          className={`hidden lg:block shrink-0 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) h-screen ${isCollapsed ? 'w-20' : 'w-[280px]'}`}
        />
      )}
    </>
  );
}


