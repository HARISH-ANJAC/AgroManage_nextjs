import { Request, Response } from "express";
import { db } from "../db/index.js";
import { 
    TBL_COST_CENTER_MASTER, 
    TBL_COST_CENTER_ALLOCATION, 
    TBL_COST_CENTER_BUDGET, 
    TBL_BUDGET_ALERT_LOG
} from "../db/schema/index.js";
import { eq, and, desc, lte, gte } from "drizzle-orm";

// ─── Budget Helpers ────────────────────────────────────────────────────────
const computeBudgetFields = (budgetAmount: number, actualExpense: number = 0, committedAmount: number = 0) => {
    const available = budgetAmount - actualExpense - committedAmount;
    const variance = budgetAmount - actualExpense;
    const variancePct = budgetAmount > 0 ? ((actualExpense / budgetAmount) * 100) : 0;
    return {
        AVAILABLE_BUDGET: available.toFixed(5),
        VARIANCE_AMOUNT: variance.toFixed(5),
        VARIANCE_PERCENTAGE: variancePct.toFixed(2),
    };
};

/**
 * Get all cost centers for a company
 */
export const getCostCenters = async (req: Request, res: Response): Promise<Response> => {
    try {
        const companyId = req.query.companyId as string;
        let query = db.select().from(TBL_COST_CENTER_MASTER).$dynamic();
        
        if (companyId) {
            query = query.where(eq(TBL_COST_CENTER_MASTER.Company_ID, parseInt(companyId)));
        }

        const costCenters = await query.orderBy(desc(TBL_COST_CENTER_MASTER.CREATED_DATE));
        return res.status(200).json(costCenters);
    } catch (error) {
        console.error("Error fetching cost centers:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

/**
 * Create a new cost center
 */
export const createCostCenter = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { audit, ...data } = req.body;
        const mappedData = {
            Company_ID: data.companyId || 1,
            COST_CENTER_CODE: data.costCenterCode,
            COST_CENTER_NAME: data.costCenterName,
            COST_CENTER_TYPE: data.costCenterType,
            BUDGET_ALERT_THRESHOLD: data.budgetAlertThreshold !== undefined ? Number(data.budgetAlertThreshold) : 80,
            DESCRIPTION: data.description || data.remarks,
            STATUS: data.status || 'Active',
            CREATED_BY: audit?.user || "System",
            CREATED_DATE: new Date(),
            CREATED_MAC_ADDRESS: audit?.macAddress || ""
        };
        
        const newCC = await db.insert(TBL_COST_CENTER_MASTER).values(mappedData).returning();

        return res.status(201).json(newCC[0]);
    } catch (error) {
        console.error("Error creating cost center:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

/**
 * Update an existing cost center
 */
export const updateCostCenter = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const { _audit, ...data } = req.body;
        
        const mappedData = {
            Company_ID: data.companyId || 1,
            COST_CENTER_CODE: data.costCenterCode,
            COST_CENTER_NAME: data.costCenterName,
            COST_CENTER_TYPE: data.costCenterType,
            BUDGET_ALERT_THRESHOLD: data.budgetAlertThreshold !== undefined ? Number(data.budgetAlertThreshold) : 80,
            DESCRIPTION: data.description || data.remarks,
            STATUS: data.status || 'Active'
        };
        
        const updatedCC = await db.update(TBL_COST_CENTER_MASTER)
            .set(mappedData)
            .where(eq(TBL_COST_CENTER_MASTER.COST_CENTER_ID, parseInt(id as string)))
            .returning();

        if (updatedCC.length === 0) {
            return res.status(404).json({ msg: "Cost center not found" });
        }

        return res.status(200).json(updatedCC[0]);
    } catch (error) {
        console.error("Error updating cost center:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

/**
 * Delete a cost center
 */
export const deleteCostCenter = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        
        const deletedCC = await db.delete(TBL_COST_CENTER_MASTER)
            .where(eq(TBL_COST_CENTER_MASTER.COST_CENTER_ID, parseInt(id as string)))
            .returning();

        if (deletedCC.length === 0) {
            return res.status(404).json({ msg: "Cost center not found" });
        }

        return res.status(200).json({ msg: "Cost center deleted successfully" });
    } catch (error) {
        console.error("Error deleting cost center:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

/**
 * Allocate expense to cost center(s)
 */
export const allocateExpenseToCostCenter = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { allocations, audit } = req.body;
        // allocations: Array<{ costCenterId, sourceTable, sourceRefNo, amount, category, currencyId, amountLC }>

        const insertedAllocations = [];
        for (const alloc of allocations) {
            const expDate = alloc.expenseDate ? new Date(alloc.expenseDate) : new Date();
            const result = await db.insert(TBL_COST_CENTER_ALLOCATION).values({
                Company_ID: alloc.companyId,
                COST_CENTER_ID: alloc.costCenterId,
                SOURCE_TABLE: alloc.sourceTable,
                SOURCE_REF_NO: alloc.sourceRefNo,
                SOURCE_LINE_SNO: alloc.sourceLineSno,
                EXPENSE_DATE: expDate,
                EXPENSE_CATEGORY: alloc.category,
                CURRENCY_ID: alloc.currencyId,
                EXPENSE_AMOUNT: alloc.amount,
                LC_AMOUNT: alloc.amountLC,
                ALLOCATION_PERCENTAGE: alloc.percentage || 100,
                ALLOCATED_AMOUNT: alloc.amountLC,
                APPROVAL_STATUS: 'PENDING',
                STATUS_ENTRY: 'Active',
                CREATED_BY: audit?.user || "System",
                CREATED_DATE: new Date(),
            }).returning();
            insertedAllocations.push(result[0]);

            // ── Update ACTUAL_EXPENSE in the matching budget row ────────────────
            const expDateStr = expDate.toISOString().split('T')[0];
            const budgetRow = await db.query.TBL_COST_CENTER_BUDGET.findFirst({
                where: and(
                    eq(TBL_COST_CENTER_BUDGET.Company_ID, alloc.companyId),
                    eq(TBL_COST_CENTER_BUDGET.COST_CENTER_ID, alloc.costCenterId),
                    lte(TBL_COST_CENTER_BUDGET.PERIOD_START_DATE, expDateStr),
                    gte(TBL_COST_CENTER_BUDGET.PERIOD_END_DATE, expDateStr)
                )
            });

            if (budgetRow) {
                const newActual = parseFloat(budgetRow.ACTUAL_EXPENSE || '0') + parseFloat(alloc.amountLC.toString());
                const budgetAmt  = parseFloat(budgetRow.BUDGET_AMOUNT || '0');
                const committed  = parseFloat(budgetRow.COMMITTED_AMOUNT || '0');
                const newAvailable  = budgetAmt - newActual - committed;
                const newVariance   = budgetAmt - newActual;
                const newVariancePct = budgetAmt > 0 ? ((newActual / budgetAmt) * 100) : 0;

                await db.update(TBL_COST_CENTER_BUDGET)
                    .set({
                        ACTUAL_EXPENSE:     newActual.toFixed(5),
                        AVAILABLE_BUDGET:   newAvailable.toFixed(5),
                        VARIANCE_AMOUNT:    newVariance.toFixed(5),
                        VARIANCE_PERCENTAGE: newVariancePct.toFixed(2),
                    })
                    .where(eq(TBL_COST_CENTER_BUDGET.BUDGET_ID, budgetRow.BUDGET_ID));
            }

            // Budget Alert Check
            await checkBudgetAlert(alloc.companyId, alloc.costCenterId, alloc.amountLC, expDate);
        }

        return res.status(201).json(insertedAllocations);
    } catch (error) {
        console.error("Error allocating expense:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

/**
 * Check if expense exceeds budget and log alert
 */
async function checkBudgetAlert(companyId: number, costCenterId: number, amountLC: number, date: Date) {
    try {
        // 1. Find active budget
        const budget = await db.query.TBL_COST_CENTER_BUDGET.findFirst({
            where: and(
                eq(TBL_COST_CENTER_BUDGET.Company_ID, companyId),
                eq(TBL_COST_CENTER_BUDGET.COST_CENTER_ID, costCenterId),
                lte(TBL_COST_CENTER_BUDGET.PERIOD_START_DATE, date.toISOString().split('T')[0]),
                gte(TBL_COST_CENTER_BUDGET.PERIOD_END_DATE, date.toISOString().split('T')[0])
            )
        });

        if (!budget) return;

        // 2. Get threshold from Cost Center Master
        const ccMaster = await db.query.TBL_COST_CENTER_MASTER.findFirst({
            where: eq(TBL_COST_CENTER_MASTER.COST_CENTER_ID, costCenterId)
        });

        const threshold = ccMaster?.BUDGET_ALERT_THRESHOLD || 80;
        
        // 3. Calculate current usage
        const actualExpense = parseFloat(budget.ACTUAL_EXPENSE || "0");
        const committedAmount = parseFloat(budget.COMMITTED_AMOUNT || "0");
        const totalUsage = actualExpense + committedAmount + parseFloat(amountLC.toString());
        const budgetAmount = parseFloat(budget.BUDGET_AMOUNT || "0");
        
        if (budgetAmount <= 0) return;

        const usagePercent = (totalUsage / budgetAmount) * 100;

        if (usagePercent >= threshold) {
            await db.insert(TBL_BUDGET_ALERT_LOG).values({
                Company_ID: companyId,
                COST_CENTER_ID: costCenterId,
                ALERT_DATE: new Date(),
                ALERT_TYPE: usagePercent >= 100 ? 'BUDGET_EXCEEDED' : 'THRESHOLD_WARNING',
                THRESHOLD_PERCENT: threshold,
                CURRENT_USAGE_PERCENT: usagePercent.toFixed(2),
                BUDGETED_AMOUNT: budgetAmount.toString(),
                ACTUAL_EXPENSE: actualExpense.toString(),
                COMMITTED_AMOUNT: committedAmount.toString(),
                CREATED_BY: "System",
                CREATED_DATE: new Date()
            });
        }
    } catch (error) {
        console.error("Budget alert check failed:", error);
    }
}

/**
 * Get Budget vs Actual report for a company
 */
export const getBudgetVsActualReport = async (req: Request, res: Response): Promise<Response> => {
    try {
        const companyId = req.query.companyId as string;
        const financialYear = req.query.financialYear as string;

        if (!companyId || !financialYear) {
            return res.status(400).json({ msg: "Company ID and Financial Year are required" });
        }

        const report = await db.select({
            COST_CENTER_ID: TBL_COST_CENTER_MASTER.COST_CENTER_ID,
            COST_CENTER_NAME: TBL_COST_CENTER_MASTER.COST_CENTER_NAME,
            COST_CENTER_CODE: TBL_COST_CENTER_MASTER.COST_CENTER_CODE,
            BUDGET_AMOUNT: TBL_COST_CENTER_BUDGET.BUDGET_AMOUNT,
            ACTUAL_EXPENSE: TBL_COST_CENTER_BUDGET.ACTUAL_EXPENSE,
            COMMITTED_AMOUNT: TBL_COST_CENTER_BUDGET.COMMITTED_AMOUNT,
            AVAILABLE_BUDGET: TBL_COST_CENTER_BUDGET.AVAILABLE_BUDGET,
            VARIANCE_AMOUNT: TBL_COST_CENTER_BUDGET.VARIANCE_AMOUNT,
            VARIANCE_PERCENTAGE: TBL_COST_CENTER_BUDGET.VARIANCE_PERCENTAGE
        })
        .from(TBL_COST_CENTER_BUDGET)
        .innerJoin(TBL_COST_CENTER_MASTER, eq(TBL_COST_CENTER_BUDGET.COST_CENTER_ID, TBL_COST_CENTER_MASTER.COST_CENTER_ID))
        .where(and(
            eq(TBL_COST_CENTER_BUDGET.Company_ID, parseInt(companyId)),
            eq(TBL_COST_CENTER_BUDGET.FINANCIAL_YEAR, financialYear)
        ));

        return res.status(200).json(report);
    } catch (error) {
        console.error("Error generating report:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

// ─── Budget CRUD ───────────────────────────────────────────────────────────

/**
 * Get all budgets for a company (with cost center name via join)
 */
export const getBudgets = async (req: Request, res: Response): Promise<Response> => {
    try {
        const companyId = req.query.companyId as string;
        let query = db
            .select({
                BUDGET_ID: TBL_COST_CENTER_BUDGET.BUDGET_ID,
                Company_ID: TBL_COST_CENTER_BUDGET.Company_ID,
                COST_CENTER_ID: TBL_COST_CENTER_BUDGET.COST_CENTER_ID,
                COST_CENTER_NAME: TBL_COST_CENTER_MASTER.COST_CENTER_NAME,
                COST_CENTER_CODE: TBL_COST_CENTER_MASTER.COST_CENTER_CODE,
                FINANCIAL_YEAR: TBL_COST_CENTER_BUDGET.FINANCIAL_YEAR,
                PERIOD_START_DATE: TBL_COST_CENTER_BUDGET.PERIOD_START_DATE,
                PERIOD_END_DATE: TBL_COST_CENTER_BUDGET.PERIOD_END_DATE,
                BUDGET_AMOUNT: TBL_COST_CENTER_BUDGET.BUDGET_AMOUNT,
                ACTUAL_EXPENSE: TBL_COST_CENTER_BUDGET.ACTUAL_EXPENSE,
                COMMITTED_AMOUNT: TBL_COST_CENTER_BUDGET.COMMITTED_AMOUNT,
                AVAILABLE_BUDGET: TBL_COST_CENTER_BUDGET.AVAILABLE_BUDGET,
                VARIANCE_AMOUNT: TBL_COST_CENTER_BUDGET.VARIANCE_AMOUNT,
                VARIANCE_PERCENTAGE: TBL_COST_CENTER_BUDGET.VARIANCE_PERCENTAGE,
                STATUS: TBL_COST_CENTER_BUDGET.STATUS,
            })
            .from(TBL_COST_CENTER_BUDGET)
            .leftJoin(TBL_COST_CENTER_MASTER, eq(TBL_COST_CENTER_BUDGET.COST_CENTER_ID, TBL_COST_CENTER_MASTER.COST_CENTER_ID))
            .$dynamic();

        if (companyId) {
            query = query.where(eq(TBL_COST_CENTER_BUDGET.Company_ID, parseInt(companyId)));
        }

        const rows = await query.orderBy(desc(TBL_COST_CENTER_BUDGET.BUDGET_ID));

        // Map to camelCase for frontend
        const mapped = rows.map(r => ({
            id: r.BUDGET_ID,
            budgetId: r.BUDGET_ID,
            companyId: r.Company_ID,
            costCenterId: r.COST_CENTER_ID,
            costCenterName: r.COST_CENTER_NAME,
            costCenterCode: r.COST_CENTER_CODE,
            financialYear: r.FINANCIAL_YEAR,
            periodStartDate: r.PERIOD_START_DATE,
            periodEndDate: r.PERIOD_END_DATE,
            budgetAmount: r.BUDGET_AMOUNT,
            actualExpense: r.ACTUAL_EXPENSE,
            committedAmount: r.COMMITTED_AMOUNT,
            availableBudget: r.AVAILABLE_BUDGET,
            varianceAmount: r.VARIANCE_AMOUNT,
            variancePercentage: r.VARIANCE_PERCENTAGE,
            status: r.STATUS,
        }));

        return res.status(200).json(mapped);
    } catch (error) {
        console.error("Error fetching budgets:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

/**
 * Create a new budget, auto-computing derived fields
 */
export const createBudget = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { _audit, ...data } = req.body;
        const budgetAmt = parseFloat(data.budgetAmount || 0);
        const actualExpenseAmt = parseFloat(data.actualExpense || 0);
        const derived = computeBudgetFields(budgetAmt, actualExpenseAmt);
        const companyId = data.companyId || 1;

        const newBudget = await db.insert(TBL_COST_CENTER_BUDGET).values({
            Company_ID: companyId,
            COST_CENTER_ID: parseInt(data.costCenterId),
            FINANCIAL_YEAR: data.financialYear,
            PERIOD_START_DATE: data.periodStartDate,
            PERIOD_END_DATE: data.periodEndDate,
            BUDGET_AMOUNT: budgetAmt.toFixed(5),
            ACTUAL_EXPENSE: actualExpenseAmt.toFixed(5),
            COMMITTED_AMOUNT: '0',
            ...derived,
            STATUS: data.status || 'Active',
        }).returning();

        return res.status(201).json(newBudget[0]);
    } catch (error) {
        console.error("Error creating budget:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

/**
 * Update an existing budget, recomputing derived fields
 */
export const updateBudget = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const { _audit, ...data } = req.body;
        const budgetAmt = parseFloat(data.budgetAmount || 0);
        const actualExpense = parseFloat(data.actualExpense || 0);
        const committedAmount = parseFloat(data.committedAmount || 0);
        const derived = computeBudgetFields(budgetAmt, actualExpense, committedAmount);

        const updated = await db.update(TBL_COST_CENTER_BUDGET)
            .set({
                COST_CENTER_ID: parseInt(data.costCenterId),
                FINANCIAL_YEAR: data.financialYear,
                PERIOD_START_DATE: data.periodStartDate,
                PERIOD_END_DATE: data.periodEndDate,
                BUDGET_AMOUNT: budgetAmt.toFixed(5),
                ACTUAL_EXPENSE: actualExpense.toFixed(5),
                ...derived,
                STATUS: data.status || 'Active',
            })
            .where(eq(TBL_COST_CENTER_BUDGET.BUDGET_ID, parseInt(id as string)))
            .returning();

        if (updated.length === 0) return res.status(404).json({ msg: "Budget not found" });
        return res.status(200).json(updated[0]);
    } catch (error) {
        console.error("Error updating budget:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

/**
 * Delete a budget
 */
export const deleteBudget = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const deleted = await db.delete(TBL_COST_CENTER_BUDGET)
            .where(eq(TBL_COST_CENTER_BUDGET.BUDGET_ID, parseInt(id as string)))
            .returning();
        if (deleted.length === 0) return res.status(404).json({ msg: "Budget not found" });
        return res.status(200).json({ msg: "Budget deleted successfully" });
    } catch (error) {
        console.error("Error deleting budget:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

/**
 * Get expense ledger (all allocation transactions) for a specific cost center
 */
export const getLedger = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const rows = await db
            .select()
            .from(TBL_COST_CENTER_ALLOCATION)
            .where(eq(TBL_COST_CENTER_ALLOCATION.COST_CENTER_ID, parseInt(id as string)))
            .orderBy(desc(TBL_COST_CENTER_ALLOCATION.EXPENSE_DATE));
        return res.status(200).json(rows);
    } catch (error) {
        console.error("Error fetching ledger:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
