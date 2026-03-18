import {
  LayoutDashboard,
  Package,
  Users,
  UserCheck,
  ShoppingCart,
  ClipboardCheck,
  FileText,
  Truck,
  Receipt,
  DollarSign,
  BarChart3,
  Warehouse,
  Leaf,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

const dashboardItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
];

const masterDataItems = [
  { title: "Products", url: "/dashboard/products", icon: Package },
  { title: "Suppliers", url: "/dashboard/suppliers", icon: UserCheck },
  { title: "Customers", url: "/dashboard/customers", icon: Users },
];

const purchaseItems = [
  { title: "Purchase Orders", url: "/purchase-orders", icon: ShoppingCart },
  { title: "Goods Receipts", url: "/dashboard/goods-receipts", icon: ClipboardCheck },
  { title: "Supplier Invoices", url: "/dashboard/supplier-invoices", icon: FileText },
];

const salesItems = [
  { title: "Sales Orders", url: "/dashboard/sales-orders", icon: Receipt },
  { title: "Deliveries", url: "/dashboard/deliveries", icon: Truck },
  { title: "Sales Invoices", url: "/dashboard/sales-invoices", icon: DollarSign },
];

const otherItems = [
  { title: "Inventory", url: "/dashboard/inventory", icon: Warehouse },
  { title: "Expenses", url: "/dashboard/expenses", icon: DollarSign },
  { title: "Reports", url: "/dashboard/reports", icon: BarChart3 },
];

interface NavGroupProps {
  label: string;
  items: typeof dashboardItems;
  collapsed: boolean;
}

function NavGroup({ label, items, collapsed }: NavGroupProps) {
  const pathname = usePathname();
  return (
    <SidebarGroup>
      {!collapsed && <SidebarGroupLabel className="text-sidebar-foreground/50 uppercase text-[10px] tracking-widest">{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={pathname === item.url}>
                <NavLink
                  href={item.url}
                  end={item.url === "/dashboard"}
                  className="text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                  activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold"
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
            <Leaf className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="text-sm font-display font-bold text-sidebar-foreground">AgroFlow</h2>
              <p className="text-[10px] text-sidebar-foreground/50">Business Management</p>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <NavGroup label="Overview" items={dashboardItems} collapsed={collapsed} />
        <NavGroup label="Master Data" items={masterDataItems} collapsed={collapsed} />
        <NavGroup label="Purchasing" items={purchaseItems} collapsed={collapsed} />
        <NavGroup label="Sales" items={salesItems} collapsed={collapsed} />
        <NavGroup label="Operations" items={otherItems} collapsed={collapsed} />
      </SidebarContent>
    </Sidebar>
  );
}
