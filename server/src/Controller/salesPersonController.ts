import { Request, Response } from "express";
import { db } from "../db/index.js";
import { TBL_SALES_PERSON_MASTER } from "../db/schema/index.js";
import { eq, inArray } from "drizzle-orm";
import { getSystemMacAddress } from "../utils/mac.js";

export const getSalesPersons = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await db.select().from(TBL_SALES_PERSON_MASTER);
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const createSalesPerson = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { 
            personName, empId, designationName, salesContactPhone, salesPersonEmail,
            reportingManagerCardNo, reportingManagerName, reportingManagerEmail, 
            salesPersonDesignation, remarks, status, user 
        } = req.body as {
            personName?: string;
            empId?: number;
            designationName?: string;
            salesContactPhone?: string;
            salesPersonEmail?: string;
            reportingManagerCardNo?: number;
            reportingManagerName?: string;
            reportingManagerEmail?: string;
            salesPersonDesignation?: string;
            remarks?: string;
            status?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        
        const values: any = {
            PERSON_NAME: personName,
            Emp_Id: empId,
            Designation_Name: designationName,
            Sales_Contact_Person_Phone: salesContactPhone,
            Sales_Person_Email_Addres: salesPersonEmail,
            Reporting_Manager_Card_No: reportingManagerCardNo,
            Reporting_Manager_Name: reportingManagerName,
            Reporting_Manager_Email_Address: reportingManagerEmail,
            Sales_Person_Designation: salesPersonDesignation,
            CREATED_BY: user,
            CREATED_MAC_ADDRESS: systemMac,
        };
        
        if (remarks !== undefined) values.REMARKS = remarks;
        if (status !== undefined) values.STATUS_MASTER = status || "Active";
        
        const result = await db.insert(TBL_SALES_PERSON_MASTER).values(values).returning();
        return res.status(201).json(result[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const updateSalesPerson = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const salesPersonId = parseInt(String(id));
        if (isNaN(salesPersonId)) return res.status(400).json({ msg: "Invalid ID" });

        const { 
            personName, empId, designationName, salesContactPhone, salesPersonEmail,
            reportingManagerCardNo, reportingManagerName, reportingManagerEmail, 
            salesPersonDesignation, remarks, status, user 
        } = req.body as {
            personName?: string;
            empId?: number;
            designationName?: string;
            salesContactPhone?: string;
            salesPersonEmail?: string;
            reportingManagerCardNo?: number;
            reportingManagerName?: string;
            reportingManagerEmail?: string;
            salesPersonDesignation?: string;
            remarks?: string;
            status?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        
        const updates: any = {
            PERSON_NAME: personName,
            Emp_Id: empId,
            Designation_Name: designationName,
            Sales_Contact_Person_Phone: salesContactPhone,
            Sales_Person_Email_Addres: salesPersonEmail,
            Reporting_Manager_Card_No: reportingManagerCardNo,
            Reporting_Manager_Name: reportingManagerName,
            Reporting_Manager_Email_Address: reportingManagerEmail,
            Sales_Person_Designation: salesPersonDesignation,
            MODIFIED_BY: user,
            MODIFIED_MAC_ADDRESS: systemMac,
        };
        
        if (remarks !== undefined) updates.REMARKS = remarks;
        if (status !== undefined) updates.STATUS_MASTER = status;

        const result = await db.update(TBL_SALES_PERSON_MASTER)
            .set(updates)
            .where(eq(TBL_SALES_PERSON_MASTER.Sales_Person_ID, salesPersonId))
            .returning();
        
        if (!result.length) return res.status(404).json({ msg: "Sales Person not found" });
        return res.status(200).json(result[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const deleteSalesPerson = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const salesPersonId = parseInt(String(id));
        if (isNaN(salesPersonId)) return res.status(400).json({ msg: "Invalid ID" });

        await db.delete(TBL_SALES_PERSON_MASTER).where(eq(TBL_SALES_PERSON_MASTER.Sales_Person_ID, salesPersonId));
        return res.status(200).json({ msg: "Sales Person deleted" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const bulkDeleteSalesPersons = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { ids } = req.body as { ids: any[] };
        if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ msg: "Invalid IDs" });
        const numericIds = ids.map(id => parseInt(String(id))).filter(id => !isNaN(id));
        if (numericIds.length === 0) return res.status(400).json({ msg: "No valid IDs provided" });

        await db.delete(TBL_SALES_PERSON_MASTER).where(inArray(TBL_SALES_PERSON_MASTER.Sales_Person_ID, numericIds));
        return res.status(200).json({ msg: "Sales Persons deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
