import { Request, Response } from "express";
import { db } from "../db/index.js";
import { TBL_SUPPLIER_MASTER, TBL_COUNTRY_MASTER, TBL_REGION_MASTER, TBL_DISTRICT_MASTER } from "../db/schema/index.js";
import { eq, inArray } from "drizzle-orm";
import { getSystemMacAddress } from "../utils/mac.js";

export const getSuppliers = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await db.select({
            Supplier_Id: TBL_SUPPLIER_MASTER.Supplier_Id,
            Supplier_Type: TBL_SUPPLIER_MASTER.Supplier_Type,
            Supplier_Name: TBL_SUPPLIER_MASTER.Supplier_Name,
            TIN_Number: TBL_SUPPLIER_MASTER.TIN_Number,
            Vat_Register_No: TBL_SUPPLIER_MASTER.Vat_Register_No,
            SH_Nick_Name: TBL_SUPPLIER_MASTER.SH_Nick_Name,
            Shipment_Mode: TBL_SUPPLIER_MASTER.Shipment_Mode,
            Country_Id: TBL_SUPPLIER_MASTER.Country_Id,
            Country_Name: TBL_COUNTRY_MASTER.Country_Name,
            Region_Id: TBL_SUPPLIER_MASTER.Region_Id,
            Region_Name: TBL_REGION_MASTER.REGION_NAME,
            District_Id: TBL_SUPPLIER_MASTER.District_Id,
            District_Name: TBL_DISTRICT_MASTER.District_Name,
            Address: TBL_SUPPLIER_MASTER.Address,
            Contact_Person: TBL_SUPPLIER_MASTER.Contact_Person,
            Phone_number: TBL_SUPPLIER_MASTER.Phone_number,
            Mail_Id: TBL_SUPPLIER_MASTER.Mail_Id,
            Fax: TBL_SUPPLIER_MASTER.Fax,
            vat_Percentage: TBL_SUPPLIER_MASTER.vat_Percentage,
            Withholding_vat_percentage: TBL_SUPPLIER_MASTER.Withholding_vat_percentage,
            Remarks: TBL_SUPPLIER_MASTER.Remarks,
            Status_Master: TBL_SUPPLIER_MASTER.Status_Master,
        })
        .from(TBL_SUPPLIER_MASTER)
        .leftJoin(TBL_COUNTRY_MASTER, eq(TBL_SUPPLIER_MASTER.Country_Id, TBL_COUNTRY_MASTER.Country_Id))
        .leftJoin(TBL_REGION_MASTER, eq(TBL_SUPPLIER_MASTER.Region_Id, TBL_REGION_MASTER.REGION_ID))
        .leftJoin(TBL_DISTRICT_MASTER, eq(TBL_SUPPLIER_MASTER.District_Id, TBL_DISTRICT_MASTER.District_id));
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const createSupplier = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { 
            supplierType, supplierName, tinNumber, vatRegisterNo, shNickName, shipmentMode,
            countryId, regionId, districtId, address, contactPerson, phoneNumber, mailId, fax,
            vatPercentage, withholdingVatPercentage, remarks, statusMaster, user 
        } = req.body as {
            supplierType?: string;
            supplierName?: string;
            tinNumber?: string;
            vatRegisterNo?: string;
            shNickName?: string;
            shipmentMode?: string;
            countryId?: number;
            regionId?: number;
            districtId?: number;
            address?: string;
            contactPerson?: string;
            phoneNumber?: string;
            mailId?: string;
            fax?: string;
            vatPercentage?: string;
            withholdingVatPercentage?: string;
            remarks?: string;
            statusMaster?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        
        const values: any = {
            Supplier_Type: supplierType,
            Supplier_Name: supplierName,
            TIN_Number: tinNumber,
            Vat_Register_No: vatRegisterNo,
            SH_Nick_Name: shNickName,
            Shipment_Mode: shipmentMode,
            Country_Id: countryId,
            Region_Id: regionId,
            District_Id: districtId,
            Address: address,
            Contact_Person: contactPerson,
            Phone_number: phoneNumber,
            Mail_Id: mailId,
            Fax: fax,
            vat_Percentage: vatPercentage,
            Withholding_vat_percentage: withholdingVatPercentage,
            Created_User: user,
            Created_Mac_Address: systemMac,
        };
        
        if (remarks !== undefined) values.Remarks = remarks;
        if (statusMaster !== undefined) values.Status_Master = statusMaster || "Active";
        
        const result = await db.insert(TBL_SUPPLIER_MASTER).values(values).returning();
        return res.status(201).json(result[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const updateSupplier = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const supplierId = parseInt(String(id));
        if (isNaN(supplierId)) return res.status(400).json({ msg: "Invalid ID" });

        const { 
            supplierType, supplierName, tinNumber, vatRegisterNo, shNickName, shipmentMode,
            countryId, regionId, districtId, address, contactPerson, phoneNumber, mailId, fax,
            vatPercentage, withholdingVatPercentage, remarks, statusMaster, user 
        } = req.body as {
            supplierType?: string;
            supplierName?: string;
            tinNumber?: string;
            vatRegisterNo?: string;
            shNickName?: string;
            shipmentMode?: string;
            countryId?: number;
            regionId?: number;
            districtId?: number;
            address?: string;
            contactPerson?: string;
            phoneNumber?: string;
            mailId?: string;
            fax?: string;
            vatPercentage?: string;
            withholdingVatPercentage?: string;
            remarks?: string;
            statusMaster?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        
        const updates: any = {
            Supplier_Type: supplierType,
            Supplier_Name: supplierName,
            TIN_Number: tinNumber,
            Vat_Register_No: vatRegisterNo,
            SH_Nick_Name: shNickName,
            Shipment_Mode: shipmentMode,
            Country_Id: countryId,
            Region_Id: regionId,
            District_Id: districtId,
            Address: address,
            Contact_Person: contactPerson,
            Phone_number: phoneNumber,
            Mail_Id: mailId,
            Fax: fax,
            vat_Percentage: vatPercentage,
            Withholding_vat_percentage: withholdingVatPercentage,
            Modified_User: user,
            Modified_Mac_Address: systemMac,
        };
        
        if (remarks !== undefined) updates.Remarks = remarks;
        if (statusMaster !== undefined) updates.Status_Master = statusMaster;

        const result = await db.update(TBL_SUPPLIER_MASTER)
            .set(updates)
            .where(eq(TBL_SUPPLIER_MASTER.Supplier_Id, supplierId))
            .returning();
        
        if (!result.length) return res.status(404).json({ msg: "Supplier not found" });
        return res.status(200).json(result[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const deleteSupplier = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const supplierId = parseInt(String(id));
        if (isNaN(supplierId)) return res.status(400).json({ msg: "Invalid ID" });

        await db.delete(TBL_SUPPLIER_MASTER).where(eq(TBL_SUPPLIER_MASTER.Supplier_Id, supplierId));
        return res.status(200).json({ msg: "Supplier deleted" });
    } catch (error: any) {
        console.error(error);
        if (error.code === "23503") {
            return res.status(400).json({ msg: "Cannot delete supplier as it has associated transactions (orders, receipts, etc.)" });
        }
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const bulkDeleteSuppliers = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { ids } = req.body as { ids: any[] };
        if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ msg: "Invalid IDs" });
        const numericIds = ids.map(id => parseInt(String(id))).filter(id => !isNaN(id));
        if (numericIds.length === 0) return res.status(400).json({ msg: "No valid IDs provided" });

        await db.delete(TBL_SUPPLIER_MASTER).where(inArray(TBL_SUPPLIER_MASTER.Supplier_Id, numericIds));
        return res.status(200).json({ msg: "Suppliers deleted successfully" });
    } catch (error: any) {
        console.error(error);
        if (error.code === "23503") {
            return res.status(400).json({ msg: "One or more suppliers cannot be deleted due to associated transactions" });
        }
        return res.status(500).json({ msg: "Internal server error" });
    }
};
