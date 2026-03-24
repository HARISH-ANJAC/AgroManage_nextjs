import { Request, Response } from "express";
import { db } from "../db/index.js";
import { TBL_COMPANY_MASTER } from "../db/schema/index.js";
import { eq, inArray } from "drizzle-orm";
import { getSystemMacAddress } from "../utils/mac.js";

export const getCompanies = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await db.select().from(TBL_COMPANY_MASTER);
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const createCompany = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { 
            companyName, tinNumber, address, contactPerson, contactNumber, 
            email, shortCode, financeStartMonth, financeEndMonth, 
            yearCode, companyFullName, currencyId, timeZone, 
            noOfUser, webSite, remarks, statusMaster, user 
        } = req.body as {
            companyName: string;
            tinNumber: string;
            address?: string;
            contactPerson?: string;
            contactNumber?: string;
            email?: string;
            shortCode?: string;
            financeStartMonth?: string;
            financeEndMonth?: string;
            yearCode?: string;
            companyFullName?: string;
            currencyId?: number;
            timeZone?: string;
            noOfUser?: number | string;
            webSite?: string;
            remarks?: string;
            statusMaster?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        const result = await db.insert(TBL_COMPANY_MASTER).values({
            Company_Name: companyName,
            TIN_Number: tinNumber,
            Address: address,
            Contact_Person: contactPerson,
            Contact_Number: contactNumber,
            Email: email,
            Short_Code: shortCode,
            Finance_Start_Month: financeStartMonth,
            Finance_End_Month: financeEndMonth,
            Year_Code: yearCode,
            Company_Full_Name: companyFullName,
            Currency_ID: currencyId,
            TimeZone: timeZone,
            No_Of_User: noOfUser ? parseInt(String(noOfUser)) : null,
            WebSite: webSite,
            Remarks: remarks,
            Status_Master: statusMaster || "Active",
            Created_By: user,
            Created_Date: new Date(),
            Created_Mac_Address: systemMac,
        }).returning();
        return res.status(201).json(result[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const updateCompany = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const companyId = parseInt(String(id));
        if (isNaN(companyId)) return res.status(400).json({ msg: "Invalid ID" });

        const { 
            companyName, tinNumber, address, contactPerson, contactNumber, 
            email, shortCode, financeStartMonth, financeEndMonth, 
            yearCode, companyFullName, currencyId, timeZone, 
            noOfUser, webSite, remarks, statusMaster, user 
        } = req.body as {
            companyName: string;
            tinNumber: string;
            address?: string;
            contactPerson?: string;
            contactNumber?: string;
            email?: string;
            shortCode?: string;
            financeStartMonth?: string;
            financeEndMonth?: string;
            yearCode?: string;
            companyFullName?: string;
            currencyId?: number;
            timeZone?: string;
            noOfUser?: number | string;
            webSite?: string;
            remarks?: string;
            statusMaster?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        const result = await db.update(TBL_COMPANY_MASTER).set({
            Company_Name: companyName,
            TIN_Number: tinNumber,
            Address: address,
            Contact_Person: contactPerson,
            Contact_Number: contactNumber,
            Email: email,
            Short_Code: shortCode,
            Finance_Start_Month: financeStartMonth,
            Finance_End_Month: financeEndMonth,
            Year_Code: yearCode,
            Company_Full_Name: companyFullName,
            Currency_ID: currencyId,
            TimeZone: timeZone,
            No_Of_User: noOfUser ? parseInt(String(noOfUser)) : null,
            WebSite: webSite,
            Remarks: remarks,
            Status_Master: statusMaster,
            Modified_By: user,
            Modified_Date: new Date(),
            Modified_Mac_Address: systemMac,
        }).where(eq(TBL_COMPANY_MASTER.Company_Id, companyId)).returning();
        
        if (!result.length) return res.status(404).json({ msg: "Company not found" });
        return res.status(200).json(result[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const deleteCompany = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const companyId = parseInt(String(id));
        if (isNaN(companyId)) return res.status(400).json({ msg: "Invalid ID" });

        await db.delete(TBL_COMPANY_MASTER).where(eq(TBL_COMPANY_MASTER.Company_Id, companyId));
        return res.status(200).json({ msg: "Company deleted" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const bulkDeleteCompanies = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { ids } = req.body as { ids: any[] };
        if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ msg: "Invalid IDs" });
        const numericIds = ids.map(id => parseInt(String(id))).filter(id => !isNaN(id));
        if (numericIds.length === 0) return res.status(400).json({ msg: "No valid IDs provided" });

        await db.delete(TBL_COMPANY_MASTER).where(inArray(TBL_COMPANY_MASTER.Company_Id, numericIds));
        return res.status(200).json({ msg: "Companies deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
