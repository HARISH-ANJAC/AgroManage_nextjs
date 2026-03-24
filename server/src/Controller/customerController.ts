import { Request, Response } from "express";
import { db } from "../db/index.js";
import { 
    TBL_CUSTOMER_MASTER, TBL_COUNTRY_MASTER, TBL_REGION_MASTER, 
    TBL_DISTRICT_MASTER, TBL_BILLING_LOCATION_MASTER, TBL_CURRENCY_MASTER 
} from "../db/schema/index.js";
import { eq, inArray } from "drizzle-orm";
import { getSystemMacAddress } from "../utils/mac.js";

export const getCustomers = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await db.select({
            Customer_Id: TBL_CUSTOMER_MASTER.Customer_Id,
            Customer_Name: TBL_CUSTOMER_MASTER.Customer_Name,
            TIN_Number: TBL_CUSTOMER_MASTER.TIN_Number,
            VAT_Number: TBL_CUSTOMER_MASTER.VAT_Number,
            Contact_Person: TBL_CUSTOMER_MASTER.Contact_Person,
            Contact_Number: TBL_CUSTOMER_MASTER.Contact_Number,
            PHONE_NUMBER_2: TBL_CUSTOMER_MASTER.PHONE_NUMBER_2,
            Email_Address: TBL_CUSTOMER_MASTER.Email_Address,
            Location: TBL_CUSTOMER_MASTER.Location,
            Nature_Of_Business: TBL_CUSTOMER_MASTER.Nature_Of_Business,
            Billing_Location_Id: TBL_CUSTOMER_MASTER.Billing_Location_Id,
            Billing_Location_Name: TBL_BILLING_LOCATION_MASTER.Billing_Location_Name,
            Country_Id: TBL_CUSTOMER_MASTER.Country_Id,
            Country_Name: TBL_COUNTRY_MASTER.Country_Name,
            Region_Id: TBL_CUSTOMER_MASTER.Region_Id,
            Region_Name: TBL_REGION_MASTER.REGION_NAME,
            District_Id: TBL_CUSTOMER_MASTER.District_Id,
            District_Name: TBL_DISTRICT_MASTER.District_Name,
            currency_id: TBL_CUSTOMER_MASTER.currency_id,
            Currency_Name: TBL_CURRENCY_MASTER.CURRENCY_NAME,
            CREDIT_ALLOWED: TBL_CUSTOMER_MASTER.CREDIT_ALLOWED,
            Address: TBL_CUSTOMER_MASTER.Address,
            TIER: TBL_CUSTOMER_MASTER.TIER,
            Company_Head_Contact_Person: TBL_CUSTOMER_MASTER.Company_Head_Contact_Person,
            Company_Head_Phone_No: TBL_CUSTOMER_MASTER.Company_Head_Phone_No,
            Company_Head_Email: TBL_CUSTOMER_MASTER.Company_Head_Email,
            Accounts_Contact_Person: TBL_CUSTOMER_MASTER.Accounts_Contact_Person,
            Accounts_Phone_No: TBL_CUSTOMER_MASTER.Accounts_Phone_No,
            Accounts_Email: TBL_CUSTOMER_MASTER.Accounts_Email,
            Remarks: TBL_CUSTOMER_MASTER.Remarks,
            Status_Master: TBL_CUSTOMER_MASTER.Status_Master,
        })
        .from(TBL_CUSTOMER_MASTER)
        .leftJoin(TBL_COUNTRY_MASTER, eq(TBL_CUSTOMER_MASTER.Country_Id, TBL_COUNTRY_MASTER.Country_Id))
        .leftJoin(TBL_REGION_MASTER, eq(TBL_CUSTOMER_MASTER.Region_Id, TBL_REGION_MASTER.REGION_ID))
        .leftJoin(TBL_DISTRICT_MASTER, eq(TBL_CUSTOMER_MASTER.District_Id, TBL_DISTRICT_MASTER.District_id))
        .leftJoin(TBL_BILLING_LOCATION_MASTER, eq(TBL_CUSTOMER_MASTER.Billing_Location_Id, TBL_BILLING_LOCATION_MASTER.Billing_Location_Id))
        .leftJoin(TBL_CURRENCY_MASTER, eq(TBL_CUSTOMER_MASTER.currency_id, TBL_CURRENCY_MASTER.CURRENCY_ID));
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const createCustomer = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { 
            customerName, tinNumber, vatNumber, contactPerson, contactNumber, phoneNumber2, emailAddress,
            location, natureOfBusiness, billingLocationId, countryId, regionId, districtId, currencyId,
            creditAllowed, address, tier, companyHeadContactPerson, companyHeadPhoneNo, companyHeadEmail,
            accountsContactPerson, accountsPhoneNo, accountsEmail, remarks, statusMaster, user 
        } = req.body as {
            customerName?: string;
            tinNumber?: string;
            vatNumber?: string;
            contactPerson?: string;
            contactNumber?: string;
            phoneNumber2?: string;
            emailAddress?: string;
            location?: string;
            natureOfBusiness?: string;
            billingLocationId?: number;
            countryId?: number;
            regionId?: number;
            districtId?: number;
            currencyId?: number;
            creditAllowed?: string;
            address?: string;
            tier?: string;
            companyHeadContactPerson?: string;
            companyHeadPhoneNo?: string;
            companyHeadEmail?: string;
            accountsContactPerson?: string;
            accountsPhoneNo?: string;
            accountsEmail?: string;
            remarks?: string;
            statusMaster?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        
        const values: any = {
            Customer_Name: customerName,
            TIN_Number: tinNumber,
            VAT_Number: vatNumber,
            Contact_Person: contactPerson,
            Contact_Number: contactNumber,
            PHONE_NUMBER_2: phoneNumber2,
            Email_Address: emailAddress,
            Location: location,
            Nature_Of_Business: natureOfBusiness,
            Billing_Location_Id: billingLocationId,
            Country_Id: countryId,
            Region_Id: regionId,
            District_Id: districtId,
            currency_id: currencyId,
            CREDIT_ALLOWED: creditAllowed,
            Address: address,
            TIER: tier,
            Company_Head_Contact_Person: companyHeadContactPerson,
            Company_Head_Phone_No: companyHeadPhoneNo,
            Company_Head_Email: companyHeadEmail,
            Accounts_Contact_Person: accountsContactPerson,
            Accounts_Phone_No: accountsPhoneNo,
            Accounts_Email: accountsEmail,
            Created_By: user,
            Created_Mac_Address: systemMac,
        };
        
        if (remarks !== undefined) values.Remarks = remarks;
        if (statusMaster !== undefined) values.Status_Master = statusMaster || "Active";
        
        const result = await db.insert(TBL_CUSTOMER_MASTER).values(values).returning();
        return res.status(201).json(result[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const updateCustomer = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const customerId = parseInt(String(id));
        if (isNaN(customerId)) return res.status(400).json({ msg: "Invalid ID" });

        const { 
            customerName, tinNumber, vatNumber, contactPerson, contactNumber, phoneNumber2, emailAddress,
            location, natureOfBusiness, billingLocationId, countryId, regionId, districtId, currencyId,
            creditAllowed, address, tier, companyHeadContactPerson, companyHeadPhoneNo, companyHeadEmail,
            accountsContactPerson, accountsPhoneNo, accountsEmail, remarks, statusMaster, user 
        } = req.body as {
            customerName?: string;
            tinNumber?: string;
            vatNumber?: string;
            contactPerson?: string;
            contactNumber?: string;
            phoneNumber2?: string;
            emailAddress?: string;
            location?: string;
            natureOfBusiness?: string;
            billingLocationId?: number;
            countryId?: number;
            regionId?: number;
            districtId?: number;
            currencyId?: number;
            creditAllowed?: string;
            address?: string;
            tier?: string;
            companyHeadContactPerson?: string;
            companyHeadPhoneNo?: string;
            companyHeadEmail?: string;
            accountsContactPerson?: string;
            accountsPhoneNo?: string;
            accountsEmail?: string;
            remarks?: string;
            statusMaster?: string;
            user: string;
        };
        const systemMac = getSystemMacAddress();
        
        const updates: any = {
            Customer_Name: customerName,
            TIN_Number: tinNumber,
            VAT_Number: vatNumber,
            Contact_Person: contactPerson,
            Contact_Number: contactNumber,
            PHONE_NUMBER_2: phoneNumber2,
            Email_Address: emailAddress,
            Location: location,
            Nature_Of_Business: natureOfBusiness,
            Billing_Location_Id: billingLocationId,
            Country_Id: countryId,
            Region_Id: regionId,
            District_Id: districtId,
            currency_id: currencyId,
            CREDIT_ALLOWED: creditAllowed,
            Address: address,
            TIER: tier,
            Company_Head_Contact_Person: companyHeadContactPerson,
            Company_Head_Phone_No: companyHeadPhoneNo,
            Company_Head_Email: companyHeadEmail,
            Accounts_Contact_Person: accountsContactPerson,
            Accounts_Phone_No: accountsPhoneNo,
            Accounts_Email: accountsEmail,
            Modified_By: user,
            Modified_Mac_Address: systemMac,
        };
        
        if (remarks !== undefined) updates.Remarks = remarks;
        if (statusMaster !== undefined) updates.Status_Master = statusMaster;

        const result = await db.update(TBL_CUSTOMER_MASTER)
            .set(updates)
            .where(eq(TBL_CUSTOMER_MASTER.Customer_Id, customerId))
            .returning();
        
        if (!result.length) return res.status(404).json({ msg: "Customer not found" });
        return res.status(200).json(result[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const deleteCustomer = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const customerId = parseInt(String(id));
        if (isNaN(customerId)) return res.status(400).json({ msg: "Invalid ID" });

        await db.delete(TBL_CUSTOMER_MASTER).where(eq(TBL_CUSTOMER_MASTER.Customer_Id, customerId));
        return res.status(200).json({ msg: "Customer deleted" });
    } catch (error: any) {
        console.error(error);
        if (error.code === "23503") {
            return res.status(400).json({ msg: "Cannot delete customer as it has associated transactions (sales, payments, etc.)" });
        }
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const bulkDeleteCustomers = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { ids } = req.body as { ids: any[] };
        if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ msg: "Invalid IDs" });
        const numericIds = ids.map(id => parseInt(String(id))).filter(id => !isNaN(id));
        if (numericIds.length === 0) return res.status(400).json({ msg: "No valid IDs provided" });

        await db.delete(TBL_CUSTOMER_MASTER).where(inArray(TBL_CUSTOMER_MASTER.Customer_Id, numericIds));
        return res.status(200).json({ msg: "Customers deleted successfully" });
    } catch (error: any) {
        console.error(error);
        if (error.code === "23503") {
            return res.status(400).json({ msg: "One or more customers cannot be deleted due to associated transactions" });
        }
        return res.status(500).json({ msg: "Internal server error" });
    }
};
