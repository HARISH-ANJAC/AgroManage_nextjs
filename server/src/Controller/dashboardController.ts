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
        // 1. Total Purchases (from Purchase Invoices)
        const purchases = await db.select({
            total: sql<number>`sum(${TBL_PURCHASE_INVOICE_HDR.FINAL_INVOICE_HDR_AMOUNT})`
        }).from(TBL_PURCHASE_INVOICE_HDR);

        // 2. Total Sales (from Tax Invoices)
        const sales = await db.select({
            total: sql<number>`sum(${TBL_TAX_INVOICE_HDR.FINAL_SALES_AMOUNT})`
        }).from(TBL_TAX_INVOICE_HDR);

        // 3. Product Count
        const productsCount = await db.select({
            count: sql<number>`count(*)`
        }).from(TBL_PRODUCT_MASTER);

        // 4. Pending Deliveries (POs with status 'PENDING' or similar)
        const pendingDeliveries = await db.select({
            count: sql<number>`count(*)`
        }).from(TBL_PURCHASE_ORDER_HDR)
          .where(eq(TBL_PURCHASE_ORDER_HDR.STATUS_ENTRY, "PENDING"));

        // 5. Recent Activity (Mix of POs and SOs)
        const recentPOs = await db.select({
            ref: TBL_PURCHASE_ORDER_HDR.PO_REF_NO,
            companyId: TBL_PURCHASE_ORDER_HDR.SUPPLIER_ID,
            amount: TBL_PURCHASE_ORDER_HDR.FINAL_PURCHASE_HDR_AMOUNT,
            status: TBL_PURCHASE_ORDER_HDR.STATUS_ENTRY,
            date: TBL_PURCHASE_ORDER_HDR.CREATED_DATE
        })
        .from(TBL_PURCHASE_ORDER_HDR)
        .orderBy(desc(TBL_PURCHASE_ORDER_HDR.CREATED_DATE))
        .limit(5);

        // Fetch supplier names for POs
        const poWithNames = await Promise.all(recentPOs.map(async (po) => {
            const supplier = await db.select({ name: TBL_SUPPLIER_MASTER.Supplier_Name })
                .from(TBL_SUPPLIER_MASTER)
                .where(eq(TBL_SUPPLIER_MASTER.Supplier_Id, po.companyId as number))
                .limit(1);
            return {
                ...po,
                company: supplier[0]?.name || "Unknown Supplier",
                type: "PURCHASE"
            };
        }));

        // 6. Monthly Chart Data (Purchases vs Sales)
        // Group by month (Postgres syntax)
        const monthlyPurchases = await db.select({
            month: sql<string>`to_char(${TBL_PURCHASE_INVOICE_HDR.INVOICE_DATE}, 'Mon')`,
            total: sql<number>`sum(${TBL_PURCHASE_INVOICE_HDR.FINAL_INVOICE_HDR_AMOUNT})`
        })
        .from(TBL_PURCHASE_INVOICE_HDR)
        .groupBy(sql`to_char(${TBL_PURCHASE_INVOICE_HDR.INVOICE_DATE}, 'Mon')`);

        const monthlySales = await db.select({
            month: sql<string>`to_char(${TBL_TAX_INVOICE_HDR.INVOICE_DATE}, 'Mon')`,
            total: sql<number>`sum(${TBL_TAX_INVOICE_HDR.FINAL_SALES_AMOUNT})`
        })
        .from(TBL_TAX_INVOICE_HDR)
        .groupBy(sql`to_char(${TBL_TAX_INVOICE_HDR.INVOICE_DATE}, 'Mon')`);

        // 7. Category Data for Pie Chart
        const categories = await db.select({
            name: TBL_PRODUCT_MAIN_CATEGORY_MASTER.MAIN_CATEGORY_NAME,
            value: sql<number>`count(${TBL_PRODUCT_MASTER.PRODUCT_ID})`
        })
        .from(TBL_PRODUCT_MASTER)
        .innerJoin(TBL_PRODUCT_MAIN_CATEGORY_MASTER, eq(TBL_PRODUCT_MASTER.MAIN_CATEGORY_ID, TBL_PRODUCT_MAIN_CATEGORY_MASTER.MAIN_CATEGORY_ID))
        .groupBy(TBL_PRODUCT_MAIN_CATEGORY_MASTER.MAIN_CATEGORY_NAME);

        res.status(200).json({
            stats: {
                totalPurchases: purchases[0]?.total || 0,
                totalSales: sales[0]?.total || 0,
                products: productsCount[0]?.count || 0,
                revenue: (sales[0]?.total || 0) - (purchases[0]?.total || 0),
                pendingDeliveries: pendingDeliveries[0]?.count || 0,
                lowStockAlerts: 0 // Placeholder until stock logic defined
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
        logError("Dashboard Controller Error", error);
        res.status(500).json({ msg: "Internal server error" });
    }
};
