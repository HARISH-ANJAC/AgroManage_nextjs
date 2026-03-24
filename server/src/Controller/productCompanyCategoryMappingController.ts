import { Request, Response } from "express";
import { db } from "../db/index.js";
import { TBL_PRODUCT_COMPANY_MAIN_CATEGORY_MAPPING, TBL_COMPANY_MASTER, TBL_PRODUCT_MAIN_CATEGORY_MASTER } from "../db/schema/index.js";
import { eq, inArray } from "drizzle-orm";
import { getSystemMacAddress } from "../utils/mac.js";

export const getProductCompanyCategoryMappings = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await db.select({
            Sno: TBL_PRODUCT_COMPANY_MAIN_CATEGORY_MAPPING.Sno,
            Company_Id: TBL_PRODUCT_COMPANY_MAIN_CATEGORY_MAPPING.Company_Id,
            Company_Name: TBL_COMPANY_MASTER.Company_Name,
            Main_Category_Id: TBL_PRODUCT_COMPANY_MAIN_CATEGORY_MAPPING.Main_Category_Id,
            MAIN_CATEGORY_NAME: TBL_PRODUCT_MAIN_CATEGORY_MASTER.MAIN_CATEGORY_NAME,
            Remarks: TBL_PRODUCT_COMPANY_MAIN_CATEGORY_MAPPING.Remarks,
            Status_Master: TBL_PRODUCT_COMPANY_MAIN_CATEGORY_MAPPING.Status_Master,
        })
        .from(TBL_PRODUCT_COMPANY_MAIN_CATEGORY_MAPPING)
        .leftJoin(TBL_COMPANY_MASTER, eq(TBL_PRODUCT_COMPANY_MAIN_CATEGORY_MAPPING.Company_Id, TBL_COMPANY_MASTER.Company_Id))
        .leftJoin(TBL_PRODUCT_MAIN_CATEGORY_MASTER, eq(TBL_PRODUCT_COMPANY_MAIN_CATEGORY_MAPPING.Main_Category_Id, TBL_PRODUCT_MAIN_CATEGORY_MASTER.MAIN_CATEGORY_ID));
        
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const createProductCompanyCategoryMapping = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { companyId, mainCategoryId, remarks, statusMaster, user } = req.body as {
            companyId?: number;
            mainCategoryId?: number;
            remarks?: string;
            statusMaster?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        
        const values: any = {
            Company_Id: companyId,
            Main_Category_Id: mainCategoryId,
            Created_By: user,
            Created_Mac_Address: systemMac,
        };
        
        if (remarks !== undefined) values.Remarks = remarks;
        if (statusMaster !== undefined) values.Status_Master = statusMaster || "Active";
        
        const result = await db.insert(TBL_PRODUCT_COMPANY_MAIN_CATEGORY_MAPPING).values(values).returning();
        return res.status(201).json(result[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const updateProductCompanyCategoryMapping = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const mappingId = parseInt(String(id));
        if (isNaN(mappingId)) return res.status(400).json({ msg: "Invalid ID" });

        const { companyId, mainCategoryId, remarks, statusMaster, user } = req.body as {
            companyId?: number;
            mainCategoryId?: number;
            remarks?: string;
            statusMaster?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        
        const updates: any = {
            Company_Id: companyId,
            Main_Category_Id: mainCategoryId,
            Modified_By: user,
            Modified_Mac_Address: systemMac,
        };
        
        if (remarks !== undefined) updates.Remarks = remarks;
        if (statusMaster !== undefined) updates.Status_Master = statusMaster;

        const result = await db.update(TBL_PRODUCT_COMPANY_MAIN_CATEGORY_MAPPING)
            .set(updates)
            .where(eq(TBL_PRODUCT_COMPANY_MAIN_CATEGORY_MAPPING.Sno, mappingId))
            .returning();
        
        if (!result.length) return res.status(404).json({ msg: "Mapping not found" });
        return res.status(200).json(result[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const deleteProductCompanyCategoryMapping = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const mappingId = parseInt(String(id));
        if (isNaN(mappingId)) return res.status(400).json({ msg: "Invalid ID" });

        await db.delete(TBL_PRODUCT_COMPANY_MAIN_CATEGORY_MAPPING).where(eq(TBL_PRODUCT_COMPANY_MAIN_CATEGORY_MAPPING.Sno, mappingId));
        return res.status(200).json({ msg: "Mapping deleted" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const bulkDeleteProductCompanyCategoryMappings = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { ids } = req.body as { ids: any[] };
        if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ msg: "Invalid IDs" });
        const numericIds = ids.map(id => parseInt(String(id))).filter(id => !isNaN(id));
        if (numericIds.length === 0) return res.status(400).json({ msg: "No valid IDs provided" });

        await db.delete(TBL_PRODUCT_COMPANY_MAIN_CATEGORY_MAPPING).where(inArray(TBL_PRODUCT_COMPANY_MAIN_CATEGORY_MAPPING.Sno, numericIds));
        return res.status(200).json({ msg: "Mappings deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
