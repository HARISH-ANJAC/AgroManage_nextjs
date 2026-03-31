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
  ShoppingCart,
  ClipboardCheck,
  FileText,
  Receipt,
  DollarSign,
  Sprout,
  Settings,
  LogOut,
  X,
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
  Wallet,
  CircleDollarSign,
  Coins,
  Hash,
  ChevronDown,
  CheckSquare,
  User
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

// Context for managing sidebar state across the layout
interface UserData {
  id: number;
  loginName: string;
  mailId: string;
  role: string;
  stockShowStatus?: string;
  outsideAccessYn?: string;
}

const SidebarContext = createContext({
  isCollapsed: false,
  toggleSidebar: () => { },
  isMobileOpen: false,
  setIsMobileOpen: (open: boolean) => { },
  user: null as UserData | null,
  refreshUser: () => { },
});

export const useSidebar = () => useContext(SidebarContext);

export function Header() {
  const { toggleSidebar, isCollapsed, user } = useSidebar();
  const pathname = usePathname();

  // Helper to get initials
  const getInitials = (name: string) => {
    return name?.charAt(0).toUpperCase() || 'U';
  };

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
            {getInitials(user?.loginName || 'User')}
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

    ]
  },
  {
    group: 'Inventory',
    items: [
      { name: 'Products', href: '/products', icon: Package },
      { name: 'Main Categories', href: '/categories', icon: Tag },
      { name: 'Sub Categories', href: '/sub-categories', icon: Layers },
      { name: 'Opening Stock', href: '/product-opening-stock', icon: Database },
      { name: 'Category Mapping', href: '/product-company-category-mapping', icon: Link2 },
    ]
  },
  {
    group: 'People',
    items: [
      { name: 'Suppliers', href: '/suppliers', icon: Truck },
      { name: 'Customers', href: '/customers', icon: Users },
      { name: 'Employees', href: '/employees', icon: Briefcase },
      { name: 'Sales Persons', href: '/sales-person', icon: User },
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
      { name: 'Purchase Approval', href: '/purchase-approvals', icon: CheckSquare },
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
  const [user, setUser] = useState<UserData | null>(null);
  const isMobile = useIsMobile();

  const refreshUser = React.useCallback(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse user data');
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  React.useEffect(() => {
    refreshUser();

    // Listen for storage changes (works across tabs and same window if manually triggered)
    const handleStorageChange = () => {
      refreshUser();
    };

    window.addEventListener('storage', handleStorageChange);
    // Custom event to handle updates in the same window
    window.addEventListener('user-data-updated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('user-data-updated', handleStorageChange);
    };
  }, [refreshUser]);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar, isMobileOpen, setIsMobileOpen, user, refreshUser }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar, isMobileOpen, setIsMobileOpen, user } = useSidebar();
  const isMobile = useIsMobile();
  const router = useRouter();
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (title: string) => {
    setCollapsedSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const handleLogout = () => {
    import('@/lib/auth').then(({ logout }) => {
      logout();
      router.push('/login');
    });
  };

  // Don't show sidebar on login or root home pages
  if (pathname === '/' || pathname === '/login') return null;

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobile && (
        <div
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 transition-all duration-500 ease-in-out sidebar-gradient text-sidebar-foreground overflow-hidden flex flex-col ${isMobile
          ? (isMobileOpen ? 'w-[280px] translate-x-0' : 'w-[280px] -translate-x-full')
          : (isCollapsed ? 'w-20' : 'w-[260px]')
          }`}
      >
        {/* Branding Section */}
        <div className={`flex items-center gap-3 px-5 py-6 group cursor-pointer ${isCollapsed && !isMobile ? 'justify-center' : ''}`}>
          <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-lg shadow-black/10 shrink-0 transition-all duration-500 group-hover:scale-105 active:scale-95 ring-4 ring-white/5">
            <img
              src="/Prime-Harvest-L-PNG.png"
              alt="Prime Harvest Logo"
              className="w-24 h-24 object-contain transition-transform duration-500"
            />
          </div>
          {(!isCollapsed || isMobile) && (
            <div className="animate-in fade-in slide-in-from-left-2 duration-300 overflow-hidden">
              <h1 className="font-bold text-lg text-white leading-none whitespace-nowrap transition-all duration-500 group-hover:translate-x-0.5">Prime Harvest</h1>
              <p className="text-[10px] uppercase tracking-widest text-white/50 mt-1 whitespace-nowrap transition-all duration-500 group-hover:translate-x-0.5 group-hover:text-white/80">ERP v1.0</p>
            </div>
          )}
          {isMobile && (
            <button onClick={() => setIsMobileOpen(false)} className="ml-auto text-white/50 hover:text-white">
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar px-3 py-2 space-y-1">
          {navigation
            .filter((group) => {
              // RBAC Filtering Logic
              // If outsideAccessYn is 'Y', show everything.
              if (user?.outsideAccessYn === 'Y') return true;

              // Groups allowed for outsideAccessYn === 'N'
              const defaultGroups = ['Overview', 'Purchasing', 'Sales', 'Finance'];

              if (defaultGroups.includes(group.group)) return true;

              // Inventory group special check
              if (group.group === 'Inventory' && user?.stockShowStatus === 'Y') return true;

              return false;
            })
            .map((group) => (
              <div key={group.group} className="mb-2">
                {(!isCollapsed || isMobile) ? (
                  <button
                    onClick={() => toggleSection(group.group)}
                    className="flex items-center justify-between w-full px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-white/40 hover:text-white/60 transition-colors"
                  >
                    {group.group}
                    <ChevronDown className={`w-3 h-3 transition-transform ${collapsedSections[group.group] ? "-rotate-90" : ""}`} />
                  </button>
                ) : (
                  <div className="h-4" />
                )}

                {(!collapsedSections[group.group] || isCollapsed) && (
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 relative ${isActive
                            ? "bg-accent text-accent-foreground shadow-lg shadow-accent/20"
                            : "text-white/70 hover:bg-white/10 hover:text-white"
                            } ${isCollapsed && !isMobile ? 'justify-center px-0 mx-1' : ''}`}
                          title={isCollapsed ? item.name : ''}
                        >
                          <item.icon className={`size-5 shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'opacity-70 group-hover:opacity-100'}`} />
                          {(!isCollapsed || isMobile) && (
                            <span className="truncate whitespace-nowrap animate-in fade-in slide-in-from-left-1 duration-300">{item.name}</span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
        </nav>

        {/* User Profile / Footer */}
        <div className="px-3 py-4 border-t border-white/10 space-y-3">
          <div className={`flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5 border border-white/5 ${isCollapsed && !isMobile ? 'justify-center px-0' : ''}`}>
            <div className="size-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm shrink-0">
              {user?.loginName?.charAt(0).toUpperCase() || 'U'}
            </div>
            {(!isCollapsed || isMobile) && (
              <div className="overflow-hidden animate-in fade-in slide-in-from-left-2 duration-300">
                <p className="text-sm font-semibold text-white truncate leading-none mb-1">
                  {user?.loginName || 'User'}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-white/30 truncate">
                  {user?.role || 'Guest'}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1">

            <button onClick={handleLogout} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-white/50 hover:bg-red-500/10 hover:text-red-400 transition-all ${isCollapsed && !isMobile ? 'justify-center' : ''}`}>
              <LogOut size={16} />
              {(!isCollapsed || isMobile) && <span>Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Dynamic Spacer for Desktop Layout */}
      {!isMobile && (
        <div
          className={`hidden lg:block shrink-0 transition-all duration-500 ease-in-out h-screen ${isCollapsed ? 'w-20' : 'w-[260px]'}`}
        />
      )}
    </>
  );
}
