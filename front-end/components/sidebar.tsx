'use client';

import React, { useState, createContext, useContext } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  Bell,
  PanelLeftClose,
  PanelLeftOpen,
  LayoutGrid,
  Package,
  Truck,
  Users,
  ShoppingCart,
  Box,
  Receipt,
  ClipboardList,
  Warehouse,
  Wallet,
  BarChart3,
  Sprout,
  Settings,
  LogOut,
  X,
  Tags,
  FileText
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-is-mobile';

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
      { name: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
      { name: 'Purchase Orders', href: '/purchase-orders', icon: ShoppingCart }
    ]
  },
  {
    group: 'Master Data',
    items: [
      { name: 'Products', href: '/dashboard/products', icon: Package },
      { name: 'Suppliers', href: '/dashboard/suppliers', icon: Truck },
      { name: 'Customers', href: '/dashboard/customers', icon: Users }
    ]
  },
  {
    group: 'Purchasing',
    items: [
      { name: 'Goods Receipts', href: '/dashboard/goods-receipts', icon: Box },
      { name: 'Supplier Invoices', href: '/dashboard/supplier-invoices', icon: Receipt }
    ]
  },
  {
    group: 'Sales',
    items: [
      { name: 'Sales Orders', href: '/dashboard/sales-orders', icon: ClipboardList },
      { name: 'Deliveries', href: '/dashboard/deliveries', icon: Truck },
      { name: 'Sales Invoices', href: '/dashboard/sales-invoices', icon: Receipt }
    ]
  },
  {
    group: 'Operations',
    items: [
      { name: 'Inventory', href: '/dashboard/inventory', icon: Warehouse },
      { name: 'Expenses', href: '/dashboard/expenses', icon: Wallet },
      { name: 'Reports', href: '/dashboard/reports', icon: BarChart3 }
    ]
  }
];
;


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

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    router.push('/login');
  };

  // Don't show sidebar on login or root home pages
  if (pathname === '/' || pathname === '/login') return null;

  const SidebarContent = (
    <div className={`flex flex-col h-full bg-sidebar border-r border-sidebar-border transition-all duration-500 ease-in-out`}>
      {/* Brand Section */}
      <div className={`px-6 py-8 flex items-center ${isCollapsed && !isMobile ? 'justify-center' : 'justify-between'}`}>
        <div className="flex items-center gap-3.5 group cursor-pointer overflow-hidden whitespace-nowrap">
          <div className="bg-secondary p-2.5 rounded-2xl shadow-lg shadow-secondary/20 shrink-0 group-hover:rotate-6 transition-transform">
            <Sprout className="text-white w-7 h-7" strokeWidth={2.5} />
          </div>
          {(!isCollapsed || isMobile) && (
            <div className="flex flex-col animate-in fade-in slide-in-from-left-2 duration-300">
              <h1 className="text-xl font-display font-black text-white leading-none tracking-tight">AgroManage</h1>
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.25em] mt-1">Forest Admin v2.0</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 px-3 py-4 space-y-8 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {navigation.map((group) => (
          <div key={group.group} className="space-y-1.5">
            {(!isCollapsed || isMobile) && (
              <h3 className="px-4 text-[9px] font-black text-white/10 uppercase tracking-[0.3em] mb-3 animate-in fade-in duration-500">
                {group.group}
              </h3>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    title={isCollapsed ? item.name : ''}
                    className={`flex items-center group px-4 py-2.5 rounded-xl transition-all duration-300 relative overflow-hidden ${isActive
                      ? 'text-white bg-secondary shadow-lg shadow-secondary/20'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                      } ${isCollapsed && !isMobile ? 'justify-center mx-1' : ''}`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-2.5 bottom-2.5 w-1 bg-white/40 rounded-full" />
                    )}
                    <div className="flex items-center gap-3.5">
                      <item.icon className={`w-[18px] h-[18px] shrink-0 transition-all duration-500 ${isActive ? 'text-white scale-110' : 'text-secondary/60 group-hover:text-secondary group-hover:scale-110'}`} strokeWidth={isActive ? 2.5 : 2} />
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
          </div>
        ))}
      </nav>

      {/* Sidebar Footer / User Profile */}
      <div className="mt-auto p-5 border-t border-white/5 space-y-4">
        <button className={`w-full flex items-center gap-4 p-3.5 rounded-2xl transition-all duration-500 ${isCollapsed && !isMobile ? 'justify-center px-0' : 'bg-white/5 border border-white/5'} hover:bg-white/10 group`}>
          <div className="relative shrink-0">
            <div className="size-11 rounded-full bg-linear-to-tr from-white/10 to-white/20 border border-white/10 overflow-hidden shadow-inner group-hover:scale-110 transition-transform duration-700">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAX0gtvcHOOLcve2FWFBLfqrFuQikNqmGUVSW4PzyAbjQ4OMdvQPkJR8WP6wO07MVzKkYGiahd_I_xifcFE1Hhiz22zsAOjB_GPPq7tPYKmDurwtlXwLmIoucf_e0MrcvArWUwVfE5gAnFxxp7zk3OQN5TUH1UNTscLlmb-Azm5Xg162T3T84NiIB4LzNDv4gyRwheeldtC-BG_-pdMKHDDkv3x9oVXoW34NdgyduUI7qTZh34bqzQ0nC3Jp60HeOh4jbIS6WQCz9aw"
                alt="Julian Thorne"
                className="w-full h-full object-cover transition-all duration-1000 grayscale group-hover:grayscale-0"
              />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 size-3.5 bg-secondary rounded-full border-4 border-sidebar animate-pulse shadow-sm" />
          </div>
          {(!isCollapsed || isMobile) && (
            <div className="flex-1 min-w-0 text-left animate-in fade-in slide-in-from-left-2 duration-300">
              <p className="text-sm font-black text-white truncate leading-none mb-1.5">Julian Thorne</p>
              <p className="text-[10px] font-black text-white/20 uppercase truncate tracking-tight">Chief Agronomist</p>
            </div>
          )}
        </button>

        <div className={`flex flex-col gap-1.5 ${isCollapsed && !isMobile ? 'items-center px-0' : ''}`}>
          <button className={`flex items-center gap-3.5 w-full p-2.5 rounded-xl text-white/30 hover:text-white hover:bg-white/5 transition-all ${isCollapsed && !isMobile ? 'justify-center' : 'px-4'}`} title="Settings">
            <Settings size={18} />
            {(!isCollapsed || isMobile) && <span className="text-[13px] font-bold">Settings</span>}
          </button>
          <button 
            onClick={handleLogout}
            className={`flex items-center gap-3.5 w-full p-2.5 rounded-xl text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all ${isCollapsed && !isMobile ? 'justify-center' : 'px-4'}`} 
            title="Sign Out"
          >
            <LogOut size={18} />
            {(!isCollapsed || isMobile) && <span className="text-[13px] font-bold">Sign Out</span>}
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


