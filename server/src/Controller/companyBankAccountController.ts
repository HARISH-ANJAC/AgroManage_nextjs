import { Request, Response } from "express";
import { db } from "../db/index.js";
import { TBL_COMPANY_BANK_ACCOUNT_MASTER, TBL_COMPANY_MASTER, TBL_BANK_MASTER, TBL_CURRENCY_MASTER } from "../db/schema/index.js";
import { eq, inArray } from "drizzle-orm";
import { getSystemMacAddress } from "../utils/mac.js";

export const getCompanyBankAccounts = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await db.select({
            Account_Id: TBL_COMPANY_BANK_ACCOUNT_MASTER.Account_Id,
            Company_id: TBL_COMPANY_BANK_ACCOUNT_MASTER.Company_id,
            Company_Name: TBL_COMPANY_MASTER.Company_Name,
            Bank_Id: TBL_COMPANY_BANK_ACCOUNT_MASTER.Bank_Id,
            Bank_Name: TBL_BANK_MASTER.BANK_NAME,
            Account_Name: TBL_COMPANY_BANK_ACCOUNT_MASTER.Account_Name,
            Account_Number: TBL_COMPANY_BANK_ACCOUNT_MASTER.Account_Number,
            Swift_Code: TBL_COMPANY_BANK_ACCOUNT_MASTER.Swift_Code,
            Branch_Address: TBL_COMPANY_BANK_ACCOUNT_MASTER.Branch_Address,
            Bank_Branch_Name: TBL_COMPANY_BANK_ACCOUNT_MASTER.Bank_Branch_Name,
            Currency_Id: TBL_COMPANY_BANK_ACCOUNT_MASTER.Currency_Id,
            Currency_Name: TBL_CURRENCY_MASTER.CURRENCY_NAME,
            Remarks: TBL_COMPANY_BANK_ACCOUNT_MASTER.Remarks,
            Status_Master: TBL_COMPANY_BANK_ACCOUNT_MASTER.Status_Master,
        })
        .from(TBL_COMPANY_BANK_ACCOUNT_MASTER)
        .leftJoin(TBL_COMPANY_MASTER, eq(TBL_COMPANY_BANK_ACCOUNT_MASTER.Company_id, TBL_COMPANY_MASTER.Company_Id))
        .leftJoin(TBL_BANK_MASTER, eq(TBL_COMPANY_BANK_ACCOUNT_MASTER.Bank_Id, TBL_BANK_MASTER.BANK_ID))
        .leftJoin(TBL_CURRENCY_MASTER, eq(TBL_COMPANY_BANK_ACCOUNT_MASTER.Currency_Id, TBL_CURRENCY_MASTER.CURRENCY_ID));
        
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const createCompanyBankAccount = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { 
            companyId, bankId, accountName, accountNumber, swiftCode, branchAddress, 
            bankBranchName, currencyId, remarks, statusMaster, user 
        } = req.body as {
            companyId?: number;
            bankId?: number;
            accountName?: string;
            accountNumber?: string;
            swiftCode?: string;
            branchAddress?: string;
            bankBranchName?: string;
            currencyId?: number;
            remarks?: string;
            statusMaster?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        
        const values: any = {
            Company_id: companyId,
            Bank_Id: bankId,
            Account_Name: accountName,
            Account_Number: accountNumber,
            Swift_Code: swiftCode,
            Branch_Address: branchAddress,
            Bank_Branch_Name: bankBranchName,
            Currency_Id: currencyId,
            Created_By: user,
            Created_Mac_Address: systemMac,
        };
        
        if (remarks !== undefined) values.Remarks = remarks;
        if (statusMaster !== undefined) values.Status_Master = statusMaster || "Active";
        
        const result = await db.insert(TBL_COMPANY_BANK_ACCOUNT_MASTER).values(values).returning();
        return res.status(201).json(result[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const updateCompanyBankAccount = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const accountId = parseInt(String(id));
        if (isNaN(accountId)) return res.status(400).json({ msg: "Invalid ID" });

        const { 
            companyId, bankId, accountName, accountNumber, swiftCode, branchAddress, 
            bankBranchName, currencyId, remarks, statusMaster, user 
        } = req.body as {
            companyId?: number;
            bankId?: number;
            accountName?: string;
            accountNumber?: string;
            swiftCode?: string;
            branchAddress?: string;
            bankBranchName?: string;
            currencyId?: number;
            remarks?: string;
            statusMaster?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        
        const updates: any = {
            Company_id: companyId,
            Bank_Id: bankId,
            Account_Name: accountName,
            Account_Number: accountNumber,
            Swift_Code: swiftCode,
            Branch_Address: branchAddress,
            Bank_Branch_Name: bankBranchName,
            Currency_Id: currencyId,
            Modified_By: user,
            Modified_Mac_Address: systemMac,
        };
        
        if (remarks !== undefined) updates.Remarks = remarks;
        if (statusMaster !== undefined) updates.Status_Master = statusMaster;

        const result = await db.update(TBL_COMPANY_BANK_ACCOUNT_MASTER)
            .set(updates)
            .where(eq(TBL_COMPANY_BANK_ACCOUNT_MASTER.Account_Id, accountId))
            .returning();
        
        if (!result.length) return res.status(404).json({ msg: "Account not found" });
        return res.status(200).json(result[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const deleteCompanyBankAccount = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const accountId = parseInt(String(id));
        if (isNaN(accountId)) return res.status(400).json({ msg: "Invalid ID" });

        await db.delete(TBL_COMPANY_BANK_ACCOUNT_MASTER).where(eq(TBL_COMPANY_BANK_ACCOUNT_MASTER.Account_Id, accountId));
        return res.status(200).json({ msg: "Account deleted" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const bulkDeleteCompanyBankAccounts = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { ids } = req.body as { ids: any[] };
        if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ msg: "Invalid IDs" });
        const numericIds = ids.map(id => parseInt(String(id))).filter(id => !isNaN(id));
        if (numericIds.length === 0) return res.status(400).json({ msg: "No valid IDs provided" });

        await db.delete(TBL_COMPANY_BANK_ACCOUNT_MASTER).where(inArray(TBL_COMPANY_BANK_ACCOUNT_MASTER.Account_Id, numericIds));
        return res.status(200).json({ msg: "Accounts deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
