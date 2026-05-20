import { Request, Response } from "express";
import { db } from "../db/index.js";
import { TBL_EXCHANGE_RATE_MASTER, TBL_CURRENCY_MASTER, TBL_COMPANY_MASTER } from "../db/schema/StoMaster.js";
import { eq, desc, and } from "drizzle-orm";

export const getExchangeRates = async (req: Request, res: Response) => {
  try {
    const data = await db.select({
      id: TBL_EXCHANGE_RATE_MASTER.SNO,
      companyId: TBL_EXCHANGE_RATE_MASTER.Company_ID,
      companyName: TBL_COMPANY_MASTER.Company_Name,
      currencyId: TBL_EXCHANGE_RATE_MASTER.CURRENCY_ID,
      currencyName: TBL_CURRENCY_MASTER.CURRENCY_NAME,
      currencyCode: TBL_CURRENCY_MASTER.CURRENCY_NAME, // Fallback if no code field
      exchangeRate: TBL_EXCHANGE_RATE_MASTER.Exchange_Rate,
      effectiveDate: TBL_EXCHANGE_RATE_MASTER.EFFECTIVE_DATE,
      remarks: TBL_EXCHANGE_RATE_MASTER.REMARKS,
      statusMaster: TBL_EXCHANGE_RATE_MASTER.STATUS_MASTER,
    })
    .from(TBL_EXCHANGE_RATE_MASTER)
    .leftJoin(TBL_CURRENCY_MASTER, eq(TBL_EXCHANGE_RATE_MASTER.CURRENCY_ID, TBL_CURRENCY_MASTER.CURRENCY_ID))
    .leftJoin(TBL_COMPANY_MASTER, eq(TBL_EXCHANGE_RATE_MASTER.Company_ID, TBL_COMPANY_MASTER.Company_Id))
    .orderBy(desc(TBL_EXCHANGE_RATE_MASTER.EFFECTIVE_DATE));

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createExchangeRate = async (req: Request, res: Response) => {
  try {
    const { currencyId, exchangeRate, effectiveDate, remarks, companyId, statusMaster } = req.body;
    
    const [newRate] = await db.insert(TBL_EXCHANGE_RATE_MASTER).values({
      CURRENCY_ID: Number(currencyId),
      Exchange_Rate: String(exchangeRate),
      EFFECTIVE_DATE: effectiveDate ? new Date(effectiveDate) : new Date(),
      REMARKS: remarks,
      Company_ID: Number(companyId),
      STATUS_MASTER: statusMaster || 'Active',
      CREATED_BY: 'Admin',
      CREATED_DATE: new Date(),
    }).returning();

    res.json(newRate);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateExchangeRate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { exchangeRate, effectiveDate, remarks, statusMaster, currencyId, companyId } = req.body;

    const [updated] = await db.update(TBL_EXCHANGE_RATE_MASTER)
      .set({
        CURRENCY_ID: currencyId ? Number(currencyId) : undefined,
        Company_ID: companyId ? Number(companyId) : undefined,
        Exchange_Rate: exchangeRate ? String(exchangeRate) : undefined,
        EFFECTIVE_DATE: effectiveDate ? new Date(effectiveDate) : undefined,
        REMARKS: remarks,
        STATUS_MASTER: statusMaster,
        MODIFIED_BY: 'Admin',
        MODIFIED_DATE: new Date(),
      })
      .where(eq(TBL_EXCHANGE_RATE_MASTER.SNO, Number(id)))
      .returning();

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteExchangeRate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.delete(TBL_EXCHANGE_RATE_MASTER).where(eq(TBL_EXCHANGE_RATE_MASTER.SNO, Number(id)));
    res.json({ message: "Deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getLatestRates = async (req: Request, res: Response) => {
  try {
    const allCurrencies = await db.select().from(TBL_CURRENCY_MASTER);
    const latestRates = [];

    for (const curr of allCurrencies) {
      const [rate] = await db.select()
        .from(TBL_EXCHANGE_RATE_MASTER)
        .where(eq(TBL_EXCHANGE_RATE_MASTER.CURRENCY_ID, curr.CURRENCY_ID))
        .orderBy(desc(TBL_EXCHANGE_RATE_MASTER.EFFECTIVE_DATE))
        .limit(1);
      
      if (rate) {
        latestRates.push({
          currencyId: curr.CURRENCY_ID,
          currencyName: curr.CURRENCY_NAME,
          exchangeRate: rate.Exchange_Rate,
          effectiveDate: rate.EFFECTIVE_DATE
        });
      }
    }

    res.json(latestRates);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
