import { Request, Response } from "express";
import { db } from "../db/index.js";
import { 
    TBL_PURCHASE_INVOICE_HDR, 
    TBL_TAX_INVOICE_HDR, 
    TBL_PURCHASE_ORDER_HDR,
    TBL_SALES_ORDER_HDR
} from "../db/schema/StoEntries.js";
import { 
    TBL_PRODUCT_MASTER, 
    TBL_PRODUCT_MAIN_CATEGORY_MASTER,
    TBL_SUPPLIER_MASTER,
    TBL_CUSTOMER_MASTER
} from "../db/schema/StoMaster.js";
import { sql, eq, desc } from "drizzle-orm";

const logError = (msg: string, err: any) => {
    console.error(`[Dashboard Error] ${msg}:`, err?.message || err);
};

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const purchases = await db.select({ total: sql<number>`sum(${TBL_PURCHASE_INVOICE_HDR.FINAL_INVOICE_HDR_AMOUNT})` }).from(TBL_PURCHASE_INVOICE_HDR);
        const sales = await db.select({ total: sql<number>`sum(${TBL_TAX_INVOICE_HDR.FINAL_SALES_AMOUNT})` }).from(TBL_TAX_INVOICE_HDR);
        const productsCount = await db.select({ count: sql<number>`count(*)` }).from(TBL_PRODUCT_MASTER);
        const pendingDeliveries = await db.select({ count: sql<number>`count(*)` }).from(TBL_PURCHASE_ORDER_HDR).where(eq(TBL_PURCHASE_ORDER_HDR.STATUS_ENTRY, "PENDING"));

        const recentPOs = await db.select({
            ref: TBL_PURCHASE_ORDER_HDR.PO_REF_NO,
            companyId: TBL_PURCHASE_ORDER_HDR.SUPPLIER_ID,
            amount: TBL_PURCHASE_ORDER_HDR.FINAL_PURCHASE_HDR_AMOUNT,
            status: TBL_PURCHASE_ORDER_HDR.STATUS_ENTRY,
            date: TBL_PURCHASE_ORDER_HDR.CREATED_DATE
        }).from(TBL_PURCHASE_ORDER_HDR).orderBy(desc(TBL_PURCHASE_ORDER_HDR.CREATED_DATE)).limit(5);

        const poWithNames = await Promise.all(recentPOs.map(async (po) => {
            const supplier = await db.select({ name: TBL_SUPPLIER_MASTER.Supplier_Name }).from(TBL_SUPPLIER_MASTER).where(eq(TBL_SUPPLIER_MASTER.Supplier_Id, po.companyId as number)).limit(1);
            return { ...po, company: supplier[0]?.name || "Unknown Supplier", type: "PURCHASE" };
        }));

        const monthlyPurchases = await db.select({
            month: sql<string>`to_char(${TBL_PURCHASE_INVOICE_HDR.INVOICE_DATE}, 'Mon')`,
            total: sql<number>`sum(${TBL_PURCHASE_INVOICE_HDR.FINAL_INVOICE_HDR_AMOUNT})`
        }).from(TBL_PURCHASE_INVOICE_HDR).groupBy(sql`to_char(${TBL_PURCHASE_INVOICE_HDR.INVOICE_DATE}, 'Mon')`);

        const monthlySales = await db.select({
            month: sql<string>`to_char(${TBL_TAX_INVOICE_HDR.INVOICE_DATE}, 'Mon')`,
            total: sql<number>`sum(${TBL_TAX_INVOICE_HDR.FINAL_SALES_AMOUNT})`
        }).from(TBL_TAX_INVOICE_HDR).groupBy(sql`to_char(${TBL_TAX_INVOICE_HDR.INVOICE_DATE}, 'Mon')`);

        const categories = await db.select({
            name: TBL_PRODUCT_MAIN_CATEGORY_MASTER.MAIN_CATEGORY_NAME,
            value: sql<number>`count(${TBL_PRODUCT_MASTER.PRODUCT_ID})`
        }).from(TBL_PRODUCT_MASTER)
          .innerJoin(TBL_PRODUCT_MAIN_CATEGORY_MASTER, eq(TBL_PRODUCT_MASTER.MAIN_CATEGORY_ID, TBL_PRODUCT_MAIN_CATEGORY_MASTER.MAIN_CATEGORY_ID))
          .groupBy(TBL_PRODUCT_MAIN_CATEGORY_MASTER.MAIN_CATEGORY_NAME);

        res.status(200).json({
            stats: {
                totalPurchases: purchases[0]?.total || 0,
                totalSales: sales[0]?.total || 0,
                products: productsCount[0]?.count || 0,
                revenue: (sales[0]?.total || 0) - (purchases[0]?.total || 0),
                pendingDeliveries: pendingDeliveries[0]?.count || 0,
                lowStockAlerts: 0
            },
            monthlyData: monthlyPurchases.map(p => ({
                month: p.month,
                purchases: p.total,
                sales: monthlySales.find(s => s.month === p.month)?.total || 0
            })),
            categories: categories.map((c, i) => ({
                name: c.name,
                value: Number(c.value),
                color: `hsl(${i * 60 % 360}, 70%, 50%)`
            })),
            recentActivity: poWithNames
        });
    } catch (error) {
        logError("Global Dashboard Stats", error);
        res.status(500).json({ msg: "Error fetching global dashboard stats" });
    }
};

export const getPurchaseDashboardStats = async (req: Request, res: Response) => {
    try {
        const poCount = await db.select({ count: sql<number>`count(*)` }).from(TBL_PURCHASE_ORDER_HDR);
        const approvedPOs = await db.select({ count: sql<number>`count(*)` }).from(TBL_PURCHASE_ORDER_HDR).where(eq(TBL_PURCHASE_ORDER_HDR.STATUS_ENTRY, 'Approved'));
        const pendingPOs = await db.select({ count: sql<number>`count(*)` }).from(TBL_PURCHASE_ORDER_HDR).where(eq(TBL_PURCHASE_ORDER_HDR.STATUS_ENTRY, 'PENDING'));
        const totalPurchases = await db.select({ total: sql<number>`sum(${TBL_PURCHASE_ORDER_HDR.FINAL_PURCHASE_HDR_AMOUNT})` }).from(TBL_PURCHASE_ORDER_HDR);

        const monthlyData = await db.select({
            month: sql<string>`to_char(${TBL_PURCHASE_ORDER_HDR.PO_DATE}, 'Mon')`,
            total: sql<number>`sum(${TBL_PURCHASE_ORDER_HDR.FINAL_PURCHASE_HDR_AMOUNT})`
        }).from(TBL_PURCHASE_ORDER_HDR).groupBy(sql`to_char(${TBL_PURCHASE_ORDER_HDR.PO_DATE}, 'Mon')`);

        const supplierStats = await db.select({
            name: TBL_SUPPLIER_MASTER.Supplier_Name,
            value: sql<number>`sum(${TBL_PURCHASE_ORDER_HDR.FINAL_PURCHASE_HDR_AMOUNT})`
        }).from(TBL_PURCHASE_ORDER_HDR)
          .innerJoin(TBL_SUPPLIER_MASTER, eq(TBL_PURCHASE_ORDER_HDR.SUPPLIER_ID, TBL_SUPPLIER_MASTER.Supplier_Id))
          .groupBy(TBL_SUPPLIER_MASTER.Supplier_Name)
          .limit(5);

        const recentActivity = await db.select({
            ref: TBL_PURCHASE_ORDER_HDR.PO_REF_NO,
            amount: TBL_PURCHASE_ORDER_HDR.FINAL_PURCHASE_HDR_AMOUNT,
            status: TBL_PURCHASE_ORDER_HDR.STATUS_ENTRY,
            date: TBL_PURCHASE_ORDER_HDR.CREATED_DATE,
            supplierId: TBL_PURCHASE_ORDER_HDR.SUPPLIER_ID
        }).from(TBL_PURCHASE_ORDER_HDR).orderBy(desc(TBL_PURCHASE_ORDER_HDR.CREATED_DATE)).limit(5);

        const recentWithNames = await Promise.all(recentActivity.map(async (a) => {
            const supplier = await db.select({ name: TBL_SUPPLIER_MASTER.Supplier_Name }).from(TBL_SUPPLIER_MASTER).where(eq(TBL_SUPPLIER_MASTER.Supplier_Id, a.supplierId as number)).limit(1);
            return { ...a, company: supplier[0]?.name || "Unknown Supplier", type: "PURCHASE" };
        }));

        res.status(200).json({
            stats: {
                totalPOs: poCount[0]?.count || 0,
                approvedPOs: approvedPOs[0]?.count || 0,
                pendingPOs: pendingPOs[0]?.count || 0,
                totalSpent: totalPurchases[0]?.total || 0,
                activeSuppliers: supplierStats.length,
            },
            monthlyData: monthlyData.map(m => ({ month: m.month, purchases: m.total })),
            supplierMetrics: supplierStats.map((s, i) => ({ 
                name: s.name, 
                value: Number(s.value),
                color: `hsl(${i * 80 % 360}, 65%, 45%)` 
            })),
            recentActivity: recentWithNames
        });
    } catch (error) {
        logError("Purchase Dashboard", error);
        res.status(500).json({ msg: "Error fetching purchase stats" });
    }
};

export const getSalesDashboardStats = async (req: Request, res: Response) => {
    try {
        const soCount = await db.select({ count: sql<number>`count(*)` }).from(TBL_SALES_ORDER_HDR);
        const invoiceCount = await db.select({ count: sql<number>`count(*)` }).from(TBL_TAX_INVOICE_HDR);
        const totalSales = await db.select({ total: sql<number>`sum(${TBL_TAX_INVOICE_HDR.FINAL_SALES_AMOUNT})` }).from(TBL_TAX_INVOICE_HDR);
        
        const monthlyData = await db.select({
            month: sql<string>`to_char(${TBL_TAX_INVOICE_HDR.INVOICE_DATE}, 'Mon')`,
            total: sql<number>`sum(${TBL_TAX_INVOICE_HDR.FINAL_SALES_AMOUNT})`
        }).from(TBL_TAX_INVOICE_HDR).groupBy(sql`to_char(${TBL_TAX_INVOICE_HDR.INVOICE_DATE}, 'Mon')`);

        const customerStats = await db.select({
            name: TBL_CUSTOMER_MASTER.Customer_Name,
            value: sql<number>`sum(${TBL_TAX_INVOICE_HDR.FINAL_SALES_AMOUNT})`
        }).from(TBL_TAX_INVOICE_HDR)
          .innerJoin(TBL_CUSTOMER_MASTER, eq(TBL_TAX_INVOICE_HDR.CUSTOMER_ID, TBL_CUSTOMER_MASTER.Customer_Id))
          .groupBy(TBL_CUSTOMER_MASTER.Customer_Name)
          .limit(5);

        const recentActivity = await db.select({
            ref: TBL_TAX_INVOICE_HDR.TAX_INVOICE_REF_NO,
            amount: TBL_TAX_INVOICE_HDR.FINAL_SALES_AMOUNT,
            status: TBL_TAX_INVOICE_HDR.STATUS_ENTRY,
            date: TBL_TAX_INVOICE_HDR.CREATED_DATE,
            customerId: TBL_TAX_INVOICE_HDR.CUSTOMER_ID
        }).from(TBL_TAX_INVOICE_HDR).orderBy(desc(TBL_TAX_INVOICE_HDR.CREATED_DATE)).limit(5);

        const recentWithNames = await Promise.all(recentActivity.map(async (a) => {
            const customer = await db.select({ name: TBL_CUSTOMER_MASTER.Customer_Name }).from(TBL_CUSTOMER_MASTER).where(eq(TBL_CUSTOMER_MASTER.Customer_Id, a.customerId as number)).limit(1);
            return { ...a, company: customer[0]?.name || "Unknown Customer", type: "SALES" };
        }));

        res.status(200).json({
            stats: {
                totalOrders: soCount[0]?.count || 0,
                totalInvoices: invoiceCount[0]?.count || 0,
                revenue: totalSales[0]?.total || 0,
                activeCustomers: customerStats.length,
            },
            monthlyData: monthlyData.map(m => ({ month: m.month, sales: m.total })),
            customerMetrics: customerStats.map((c, i) => ({ 
                name: c.name, 
                value: Number(c.value),
                color: `hsl(${220 + (i * 40) % 360}, 65%, 45%)` 
            })),
            recentActivity: recentWithNames
        });
    } catch (error) {
        logError("Sales Dashboard", error);
        res.status(500).json({ msg: "Error fetching sales stats" });
    }
};
