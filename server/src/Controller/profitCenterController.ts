import { Request, Response } from "express";
import { db } from "../db/index.js";
import { 
    TBL_PROFIT_CENTER_MASTER, 
    TBL_PROFIT_CENTER_ALLOCATION, 
    TBL_PROFIT_CENTER_TARGET,
    TBL_COMPANY_MASTER
} from "../db/schema/index.js";
import { eq, and, sql, desc, lte, gte } from "drizzle-orm";

// ─── Target Helpers ────────────────────────────────────────────────────────
const computeAchievement = (targetAmount: number, actualRevenue: number = 0) => {
    const pct = targetAmount > 0 ? ((actualRevenue / targetAmount) * 100) : 0;
    return { ACHIEVEMENT_PERCENT: pct.toFixed(2) };
};

/**
 * Get all profit centers for a company
 */
export const getProfitCenters = async (req: Request, res: Response): Promise<Response> => {
    try {
        const companyId = req.query.companyId as string;
        let query = db.select().from(TBL_PROFIT_CENTER_MASTER).$dynamic();
        
        if (companyId) {
            query = query.where(eq(TBL_PROFIT_CENTER_MASTER.Company_ID, parseInt(companyId)));
        }

        const profitCenters = await query.orderBy(desc(TBL_PROFIT_CENTER_MASTER.CREATED_DATE));
        return res.status(200).json(profitCenters);
    } catch (error) {
        console.error("Error fetching profit centers:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

/**
 * Create a new profit center
 */
export const createProfitCenter = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { audit, ...data } = req.body;
        
        const mappedData = {
            Company_ID: data.companyId || 1,
            PROFIT_CENTER_CODE: data.profitCenterCode,
            PROFIT_CENTER_NAME: data.profitCenterName,
            MANAGER_NAME: data.managerName,
            STATUS: data.status || 'Active',
            CREATED_BY: audit?.user || "System",
            CREATED_DATE: new Date(),
            CREATED_MAC_ADDRESS: audit?.macAddress || ""
        };
        
        const newPC = await db.insert(TBL_PROFIT_CENTER_MASTER).values(mappedData).returning();

        return res.status(201).json(newPC[0]);
    } catch (error) {
        console.error("Error creating profit center:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

/**
 * Update an existing profit center
 */
export const updateProfitCenter = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const { audit, ...data } = req.body;
        
        const mappedData = {
            Company_ID: data.companyId || 1,
            PROFIT_CENTER_CODE: data.profitCenterCode,
            PROFIT_CENTER_NAME: data.profitCenterName,
            MANAGER_NAME: data.managerName,
            STATUS: data.status || 'Active'
        };
        
        const updatedPC = await db.update(TBL_PROFIT_CENTER_MASTER)
            .set(mappedData)
            .where(eq(TBL_PROFIT_CENTER_MASTER.PROFIT_CENTER_ID, parseInt(id as string)))
            .returning();

        if (updatedPC.length === 0) {
            return res.status(404).json({ msg: "Profit center not found" });
        }

        return res.status(200).json(updatedPC[0]);
    } catch (error) {
        console.error("Error updating profit center:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

/**
 * Delete a profit center
 */
export const deleteProfitCenter = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        
        const deletedPC = await db.delete(TBL_PROFIT_CENTER_MASTER)
            .where(eq(TBL_PROFIT_CENTER_MASTER.PROFIT_CENTER_ID, parseInt(id as string)))
            .returning();

        if (deletedPC.length === 0) {
            return res.status(404).json({ msg: "Profit center not found" });
        }

        return res.status(200).json({ msg: "Profit center deleted successfully" });
    } catch (error) {
        console.error("Error deleting profit center:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

/**
 * Allocate revenue to profit center(s)
 */
export const allocateRevenueToProfitCenter = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { allocations, audit } = req.body;

        const insertedAllocations = [];
        for (const alloc of allocations) {
            const result = await db.insert(TBL_PROFIT_CENTER_ALLOCATION).values({
                Company_ID: alloc.companyId,
                PROFIT_CENTER_ID: alloc.profitCenterId,
                SOURCE_TABLE: alloc.sourceTable,
                SOURCE_REF_NO: alloc.sourceRefNo,
                SOURCE_LINE_SNO: alloc.sourceLineSno,
                REVENUE_DATE: alloc.revenueDate ? new Date(alloc.revenueDate) : new Date(),
                REVENUE_CATEGORY: alloc.category,
                CURRENCY_ID: alloc.currencyId,
                REVENUE_AMOUNT: alloc.amount,
                LC_AMOUNT: alloc.amountLC,
                ALLOCATION_PERCENTAGE: alloc.percentage || 100,
                ALLOCATED_AMOUNT: alloc.amountLC,
                STATUS_ENTRY: 'Active',
                CREATED_BY: audit?.user || "System",
                CREATED_DATE: new Date(),
            }).returning();
            insertedAllocations.push(result[0]);

            // Update Target actuals + recompute achievement
            const targetRow = await db.query.TBL_PROFIT_CENTER_TARGET.findFirst({
                where: and(
                    eq(TBL_PROFIT_CENTER_TARGET.PROFIT_CENTER_ID, alloc.profitCenterId),
                    lte(TBL_PROFIT_CENTER_TARGET.PERIOD_START_DATE, alloc.revenueDate || new Date().toISOString().split('T')[0]),
                    gte(TBL_PROFIT_CENTER_TARGET.PERIOD_END_DATE, alloc.revenueDate || new Date().toISOString().split('T')[0])
                )
            });

            if (targetRow) {
                const newActual = parseFloat(targetRow.ACTUAL_REVENUE || '0') + parseFloat(alloc.amountLC.toString());
                const targetAmt = parseFloat(targetRow.TARGET_AMOUNT || '0');
                const { ACHIEVEMENT_PERCENT } = computeAchievement(targetAmt, newActual);

                await db.update(TBL_PROFIT_CENTER_TARGET)
                    .set({
                        ACTUAL_REVENUE: newActual.toFixed(5),
                        ACHIEVEMENT_PERCENT,
                    })
                    .where(eq(TBL_PROFIT_CENTER_TARGET.TARGET_ID, targetRow.TARGET_ID));
            }
        }

        return res.status(201).json(insertedAllocations);
    } catch (error) {
        console.error("Error allocating revenue:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

/**
 * Get Target vs Actual report
 */
export const getTargetVsActualReport = async (req: Request, res: Response): Promise<Response> => {
    try {
        const companyId = req.query.companyId as string;
        const financialYear = req.query.financialYear as string;

        const report = await db.select({
            PROFIT_CENTER_ID: TBL_PROFIT_CENTER_MASTER.PROFIT_CENTER_ID,
            PROFIT_CENTER_NAME: TBL_PROFIT_CENTER_MASTER.PROFIT_CENTER_NAME,
            PROFIT_CENTER_CODE: TBL_PROFIT_CENTER_MASTER.PROFIT_CENTER_CODE,
            TARGET_AMOUNT: TBL_PROFIT_CENTER_TARGET.TARGET_AMOUNT,
            ACTUAL_REVENUE: TBL_PROFIT_CENTER_TARGET.ACTUAL_REVENUE
        })
        .from(TBL_PROFIT_CENTER_TARGET)
        .innerJoin(TBL_PROFIT_CENTER_MASTER, eq(TBL_PROFIT_CENTER_TARGET.PROFIT_CENTER_ID, TBL_PROFIT_CENTER_MASTER.PROFIT_CENTER_ID))
        .where(and(
            eq(TBL_PROFIT_CENTER_TARGET.Company_ID, parseInt(companyId)),
            eq(TBL_PROFIT_CENTER_TARGET.FINANCIAL_YEAR, financialYear)
        ));

        return res.status(200).json(report);
    } catch (error) {
        console.error("Error generating report:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

// ─── Target CRUD ──────────────────────────────────────────────────────────

/**
 * Get all targets with joined profit center name
 */
export const getTargets = async (req: Request, res: Response): Promise<Response> => {
    try {
        const companyId = req.query.companyId as string;
        const rows = await db
            .select({
                TARGET_ID:          TBL_PROFIT_CENTER_TARGET.TARGET_ID,
                Company_ID:         TBL_PROFIT_CENTER_TARGET.Company_ID,
                PROFIT_CENTER_ID:   TBL_PROFIT_CENTER_TARGET.PROFIT_CENTER_ID,
                PROFIT_CENTER_NAME: TBL_PROFIT_CENTER_MASTER.PROFIT_CENTER_NAME,
                PROFIT_CENTER_CODE: TBL_PROFIT_CENTER_MASTER.PROFIT_CENTER_CODE,
                FINANCIAL_YEAR:     TBL_PROFIT_CENTER_TARGET.FINANCIAL_YEAR,
                PERIOD_NAME:        TBL_PROFIT_CENTER_TARGET.PERIOD_NAME,
                PERIOD_START_DATE:  TBL_PROFIT_CENTER_TARGET.PERIOD_START_DATE,
                PERIOD_END_DATE:    TBL_PROFIT_CENTER_TARGET.PERIOD_END_DATE,
                TARGET_AMOUNT:      TBL_PROFIT_CENTER_TARGET.TARGET_AMOUNT,
                ACTUAL_REVENUE:     TBL_PROFIT_CENTER_TARGET.ACTUAL_REVENUE,
                ACHIEVEMENT_PERCENT: TBL_PROFIT_CENTER_TARGET.ACHIEVEMENT_PERCENT,
            })
            .from(TBL_PROFIT_CENTER_TARGET)
            .leftJoin(TBL_PROFIT_CENTER_MASTER, eq(TBL_PROFIT_CENTER_TARGET.PROFIT_CENTER_ID, TBL_PROFIT_CENTER_MASTER.PROFIT_CENTER_ID))
            .where(companyId ? eq(TBL_PROFIT_CENTER_TARGET.Company_ID, parseInt(companyId)) : undefined as any)
            .orderBy(desc(TBL_PROFIT_CENTER_TARGET.TARGET_ID));

        const mapped = rows.map(r => ({
            id:                 r.TARGET_ID,
            targetId:           r.TARGET_ID,
            companyId:          r.Company_ID,
            profitCenterId:     r.PROFIT_CENTER_ID,
            profitCenterName:   r.PROFIT_CENTER_NAME,
            profitCenterCode:   r.PROFIT_CENTER_CODE,
            financialYear:      r.FINANCIAL_YEAR,
            periodName:         r.PERIOD_NAME,
            periodStartDate:    r.PERIOD_START_DATE,
            periodEndDate:      r.PERIOD_END_DATE,
            targetAmount:       r.TARGET_AMOUNT,
            actualRevenue:      r.ACTUAL_REVENUE,
            achievementPercent: r.ACHIEVEMENT_PERCENT,
        }));

        return res.status(200).json(mapped);
    } catch (error) {
        console.error("Error fetching targets:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

/**
 * Create a new revenue target, auto-computing achievement %
 */
export const createTarget = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { audit, ...data } = req.body;
        const targetAmt  = parseFloat(data.targetAmount || 0);
        const actualRev  = parseFloat(data.actualRevenue || 0);
        const { ACHIEVEMENT_PERCENT } = computeAchievement(targetAmt, actualRev);

        const newTarget = await db.insert(TBL_PROFIT_CENTER_TARGET).values({
            Company_ID:         data.companyId || 1,
            PROFIT_CENTER_ID:   parseInt(data.profitCenterId),
            FINANCIAL_YEAR:     data.financialYear,
            PERIOD_NAME:        data.periodName || '',
            PERIOD_START_DATE:  data.periodStartDate,
            PERIOD_END_DATE:    data.periodEndDate,
            TARGET_AMOUNT:      targetAmt.toFixed(5),
            ACTUAL_REVENUE:     actualRev.toFixed(5),
            ACHIEVEMENT_PERCENT,
        }).returning();

        return res.status(201).json(newTarget[0]);
    } catch (error) {
        console.error("Error creating target:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

/**
 * Update a target, recomputing achievement %
 */
export const updateTarget = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const { audit, ...data } = req.body;
        const targetAmt  = parseFloat(data.targetAmount || 0);
        const actualRev  = parseFloat(data.actualRevenue || 0);
        const { ACHIEVEMENT_PERCENT } = computeAchievement(targetAmt, actualRev);

        const updated = await db.update(TBL_PROFIT_CENTER_TARGET)
            .set({
                PROFIT_CENTER_ID:  parseInt(data.profitCenterId),
                FINANCIAL_YEAR:    data.financialYear,
                PERIOD_NAME:       data.periodName || '',
                PERIOD_START_DATE: data.periodStartDate,
                PERIOD_END_DATE:   data.periodEndDate,
                TARGET_AMOUNT:     targetAmt.toFixed(5),
                ACTUAL_REVENUE:    actualRev.toFixed(5),
                ACHIEVEMENT_PERCENT,
            })
            .where(eq(TBL_PROFIT_CENTER_TARGET.TARGET_ID, parseInt(id as string)))
            .returning();

        if (updated.length === 0) return res.status(404).json({ msg: "Target not found" });
        return res.status(200).json(updated[0]);
    } catch (error) {
        console.error("Error updating target:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

/**
 * Delete a target
 */
export const deleteTarget = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const deleted = await db.delete(TBL_PROFIT_CENTER_TARGET)
            .where(eq(TBL_PROFIT_CENTER_TARGET.TARGET_ID, parseInt(id as string)))
            .returning();
        if (deleted.length === 0) return res.status(404).json({ msg: "Target not found" });
        return res.status(200).json({ msg: "Target deleted successfully" });
    } catch (error) {
        console.error("Error deleting target:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

/**
 * Get revenue ledger (all allocation transactions) for a specific profit center
 */
export const getRevenueLedger = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const rows = await db
            .select()
            .from(TBL_PROFIT_CENTER_ALLOCATION)
            .where(eq(TBL_PROFIT_CENTER_ALLOCATION.PROFIT_CENTER_ID, parseInt(id as string)))
            .orderBy(desc(TBL_PROFIT_CENTER_ALLOCATION.REVENUE_DATE));
        return res.status(200).json(rows);
    } catch (error) {
        console.error("Error fetching revenue ledger:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
