import { 
    TBL_COMPANY_MASTER,
    TBL_STORE_MASTER,
    TBL_PRODUCT_MAIN_CATEGORY_MASTER,
    TBL_PRODUCT_SUB_CATEGORY_MASTER,
    TBL_PRODUCT_MASTER,
    TBL_SUPPLIER_MASTER,
    TBL_COUNTRY_MASTER,
    TBL_REGION_MASTER,
    TBL_DISTRICT_MASTER,
    TBL_CUSTOMER_MASTER,
    TBL_CURRENCY_MASTER,
    TBL_LOCATION_MASTER,
    TBL_BILLING_LOCATION_MASTER,
    TBL_ADDITIONAL_COST_TYPE_MASTER,
    TBL_PAYMENT_TERM_MASTER,
    TBL_ACCOUNTS_HEAD_MASTER
} from "../db/schema/index.js";
import { eq, inArray, getTableColumns, getTableName } from "drizzle-orm";

// 1. Domain to Table mapping with optional Joins
const TABLE_MAP: Record<string, { table: any; pk: string; joins?: any[] }> = {
    "companies": { 
        table: TBL_COMPANY_MASTER, 
        pk: "Company_Id",
        joins: [{ table: TBL_CURRENCY_MASTER, on: eq(TBL_COMPANY_MASTER.Currency_ID, TBL_CURRENCY_MASTER.CURRENCY_ID), prefix: "CURRENCY" }]
    },
    "stores": { 
        table: TBL_STORE_MASTER, 
        pk: "Store_Id",
        joins: [{ table: TBL_LOCATION_MASTER, on: eq(TBL_STORE_MASTER.Location_Id, TBL_LOCATION_MASTER.Location_Id), prefix: "LOCATION" }]
    },
    "categories": { table: TBL_PRODUCT_MAIN_CATEGORY_MASTER, pk: "MAIN_CATEGORY_ID" },
    "sub-categories": { 
        table: TBL_PRODUCT_SUB_CATEGORY_MASTER, 
        pk: "SUB_CATEGORY_ID",
        joins: [{ table: TBL_PRODUCT_MAIN_CATEGORY_MASTER, on: eq(TBL_PRODUCT_SUB_CATEGORY_MASTER.MAIN_CATEGORY_ID, TBL_PRODUCT_MAIN_CATEGORY_MASTER.MAIN_CATEGORY_ID), prefix: "MAIN_CATEGORY" }]
    },
    "products": { 
        table: TBL_PRODUCT_MASTER, 
        pk: "PRODUCT_ID",
        joins: [
            { table: TBL_PRODUCT_MAIN_CATEGORY_MASTER, on: eq(TBL_PRODUCT_MASTER.MAIN_CATEGORY_ID, TBL_PRODUCT_MAIN_CATEGORY_MASTER.MAIN_CATEGORY_ID), prefix: "MAIN_CATEGORY" },
            { table: TBL_PRODUCT_SUB_CATEGORY_MASTER, on: eq(TBL_PRODUCT_MASTER.SUB_CATEGORY_ID, TBL_PRODUCT_SUB_CATEGORY_MASTER.SUB_CATEGORY_ID), prefix: "SUB_CATEGORY" }
        ]
    },
    "suppliers": { 
        table: TBL_SUPPLIER_MASTER, 
        pk: "Supplier_Id",
        joins: [
            { table: TBL_COUNTRY_MASTER, on: eq(TBL_SUPPLIER_MASTER.Country_Id, TBL_COUNTRY_MASTER.Country_Id), prefix: "COUNTRY" },
            { table: TBL_REGION_MASTER, on: eq(TBL_SUPPLIER_MASTER.Region_Id, TBL_REGION_MASTER.REGION_ID), prefix: "REGION" }
        ]
    },
    "countries": { table: TBL_COUNTRY_MASTER, pk: "Country_Id" },
    "regions": { 
        table: TBL_REGION_MASTER, 
        pk: "REGION_ID",
        joins: [{ table: TBL_COUNTRY_MASTER, on: eq(TBL_REGION_MASTER.COUNTRY_ID, TBL_COUNTRY_MASTER.Country_Id), prefix: "COUNTRY" }]
    },
    "districts": { 
        table: TBL_DISTRICT_MASTER, 
        pk: "District_id",
        joins: [
            { table: TBL_COUNTRY_MASTER, on: eq(TBL_DISTRICT_MASTER.Country_Id, TBL_COUNTRY_MASTER.Country_Id), prefix: "COUNTRY" },
            { table: TBL_REGION_MASTER, on: eq(TBL_DISTRICT_MASTER.Region_Id, TBL_REGION_MASTER.REGION_ID), prefix: "REGION" }
        ]
    },
    "customers": { 
        table: TBL_CUSTOMER_MASTER, 
        pk: "Customer_Id",
        joins: [
            { table: TBL_COUNTRY_MASTER, on: eq(TBL_CUSTOMER_MASTER.Country_Id, TBL_COUNTRY_MASTER.Country_Id), prefix: "COUNTRY" },
            { table: TBL_REGION_MASTER, on: eq(TBL_CUSTOMER_MASTER.Region_Id, TBL_REGION_MASTER.REGION_ID), prefix: "REGION" },
            { table: TBL_DISTRICT_MASTER, on: eq(TBL_CUSTOMER_MASTER.District_Id, TBL_DISTRICT_MASTER.District_id), prefix: "DISTRICT" }
        ]
    },
    "currencies": { table: TBL_CURRENCY_MASTER, pk: "CURRENCY_ID" },
    "locations": { table: TBL_LOCATION_MASTER, pk: "Location_Id" },
    "billing-locations": { table: TBL_BILLING_LOCATION_MASTER, pk: "Billing_Location_Id" },
    "additional-cost-types": { table: TBL_ADDITIONAL_COST_TYPE_MASTER, pk: "ADDITIONAL_COST_TYPE_ID" },
    "payment-terms": { table: TBL_PAYMENT_TERM_MASTER, pk: "PAYMENT_TERM_ID" },
    "account-heads": { table: TBL_ACCOUNTS_HEAD_MASTER, pk: "ACCOUNT_HEAD_ID" }
};

// 2. Dynamic Mappers: Bridge the gap between camelCase frontend and DB-specific casing
const normalizeKey = (key: string) => {
    return key.toLowerCase().replace(/_([a-z0-9])/g, (m, c) => c.toUpperCase());
};

const toDbCase = (table: any, data: any, excludePk: boolean = false) => {
    const columns = getTableColumns(table);
    const mapped: any = {};
    
    const normalizedCols: Record<string, string> = {};
    Object.keys(columns).forEach(colKey => {
        normalizedCols[normalizeKey(colKey)] = colKey;
    });

    Object.keys(data).forEach(key => {
        let targetKey = normalizedCols[key] || 
                         Object.keys(columns).find(k => normalizeKey(k) === key.toLowerCase());
        
        if (excludePk && targetKey && (columns[targetKey] as any).primary) return;
        if (excludePk && key === "id") return;

        if (targetKey) {
            mapped[targetKey] = data[key];
        }
    });

    return mapped;
};

const fromDbCase = (data: any) => {
    if (!data) return data;
    const mapped: any = {};
    Object.keys(data).forEach(colKey => {
        if (colKey === 'id') {
            mapped[colKey] = data[colKey];
            return;
        }
        mapped[normalizeKey(colKey)] = data[colKey];
    });
    return mapped;
};

import { Request, Response } from "express";
import { db } from "../db/index.js";
import fs from 'fs';

const logError = (msg: string, err: any) => {
    const errorMsg = `[${new Date().toISOString()}] ${msg}: ${err instanceof Error ? err.stack : JSON.stringify(err)}\n`;
    fs.appendFileSync('master-errors.log', errorMsg);
    console.error(msg, err);
};

// 3. Controller Handlers
export const getAll = async (req: Request, res: Response): Promise<Response> => {
    try {
        const domain = req.params.domain as string;
        const config = TABLE_MAP[domain];
        if (!config) return res.status(404).json({ msg: "Domain not found" });

        let query = db.select().from(config.table);
        
        if (config.joins) {
            config.joins.forEach((join: any) => {
                query = query.leftJoin(join.table, join.on) as any;
            });
        }

        const rawData = await query;
        const mainTableName = getTableName(config.table);
        const mainTableNameLower = mainTableName.toLowerCase();
        
        const data = rawData.map((row: any) => {
            // 1. Resolve main record (handling potential casing differences in Drizzle output keys)
            const main = config.joins 
                ? (row[mainTableName] || row[mainTableNameLower] || row[Object.keys(row).find(k => k.toLowerCase() === mainTableNameLower) || ''] || row[Object.keys(row)[0]]) 
                : row;
            
            // 2. Map main record to camelCase
            const final: any = fromDbCase(main);
            
            // 3. Ensure 'id' field is present for the UI
            if (main && main[config.pk] !== undefined) {
                final.id = main[config.pk];
            } else if (main && main[Object.keys(main).find(k => k.toLowerCase() === config.pk.toLowerCase()) || ''] !== undefined) {
                final.id = main[Object.keys(main).find(k => k.toLowerCase() === config.pk.toLowerCase()) || ''];
            }

            // 4. Enrich with joined data
            if (config.joins) {
                config.joins.forEach((join: any) => {
                    const jTableName = getTableName(join.table);
                    const joinedData = row[jTableName] || row[jTableName.toLowerCase()] || row[Object.keys(row).find(k => k.toLowerCase() === jTableName.toLowerCase()) || ''];
                    
                    if (joinedData) {
                        const prefix = normalizeKey(join.prefix);
                        Object.keys(joinedData).forEach(col => {
                            // Map name fields: e.g. COUNTRY prefix + name field -> countryName
                            if (col.toLowerCase().includes("name")) {
                                final[prefix + "Name"] = joinedData[col];
                            }
                            // Map code fields: e.g. LOCATION prefix + short code -> locationShortCode
                            if (col.toLowerCase().includes("code") || col.toLowerCase().includes("symbol")) {
                                final[prefix + col.charAt(0).toUpperCase() + col.slice(1).toLowerCase()] = joinedData[col];
                            }
                        });
                    }
                });
            }
            return final;
        });

        return res.status(200).json(data);
    } catch (error) {
        logError(`Master Controller Error [${req.method} ${req.originalUrl}]`, error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const createOne = async (req: Request, res: Response): Promise<Response> => {
    try {
        const domain = req.params.domain as string;
        const { audit, ...data } = req.body;
        const config = TABLE_MAP[domain];
        if (!config) return res.status(404).json({ msg: "Domain not found" });

        // Build composite audit object
        const auditData = {
           CREATED_BY: audit?.user || "System",
           CREATED_DATE: new Date(),
           CREATED_MAC_ADDRESS: audit?.macAddress || "Unknown",
           CREATED_IP_ADDRESS: audit?.macAddress || "Unknown",
           Created_By: audit?.user || "System",
           Created_Date: new Date(),
           Created_Mac_Address: audit?.macAddress || "Unknown",
           Created_User: audit?.user,
           CREATED_USER: audit?.user
        };
        
        const insertData = toDbCase(config.table, { ...data, ...auditData }, true);

        const result = await db.insert(config.table).values(insertData as any).returning() as any[];
        const createdRecord = fromDbCase(result[0] || {});
        // Ensure ID mapping for the frontend
        if (result[0] && result[0][config.pk]) {
            createdRecord.id = result[0][config.pk];
        } else if (result[0]) {
             // Fallback for case variations
             const pkKey = Object.keys(result[0]).find(k => k.toLowerCase() === config.pk.toLowerCase());
             if (pkKey) createdRecord.id = result[0][pkKey];
        }

        return res.status(201).json(createdRecord);
    } catch (error: any) {
        logError(`Master Controller Error [${req.method} ${req.originalUrl}]`, error);
        // Catch Postgres Unique Constraint Violation (23505)
        if (error.code === '23505' || error.originalError?.code === '23505') {
            return res.status(400).json({ msg: "Duplicate entry found" });
        }
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const updateOne = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const domain = req.params.domain as string;
        const { audit, ...data } = req.body;
        const config = TABLE_MAP[domain];
        if (!config) return res.status(404).json({ msg: "Domain not found" });

        const auditData = {
           MODIFIED_BY: audit?.user || "System",
           MODIFIED_DATE: new Date(),
           MODIFIED_MAC_ADDRESS: audit?.macAddress || "Unknown",
           MODIFIED_IP_ADDRESS: audit?.macAddress || "Unknown",
           Modified_By: audit?.user || "System",
           Modified_Date: new Date(),
           Modified_Mac_Address: audit?.macAddress || "Unknown",
           Modified_User: audit?.user,
           MODIFIED_USER: audit?.user
        };
        
        const updateData = toDbCase(config.table, { ...data, ...auditData }, true);

        const parsedId = parseInt(id as string, 10);
        const targetId = isNaN(parsedId) ? id : parsedId;
        await db.update(config.table)
            .set(updateData as any)
            .where(eq(config.table[config.pk], targetId as any));

        return res.status(200).json({ msg: `${domain} updated successfully` });
    } catch (error) {
        logError(`Master Controller Error [${req.method} ${req.url}]`, error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const deleteOne = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const domain = req.params.domain as string;
        const config = TABLE_MAP[domain];
        if (!config) return res.status(404).json({ msg: "Domain not found" });

        const parsedId = parseInt(id as string, 10);
        const targetId = isNaN(parsedId) ? id : parsedId;
        await db.delete(config.table).where(eq(config.table[config.pk], targetId as any));
        return res.status(200).json({ msg: `${domain} deleted successfully` });
    } catch (error) {
        logError(`Master Controller Error [${req.method} ${req.url}]`, error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const bulkDelete = async (req: Request, res: Response): Promise<Response> => {
    try {
        const domain = req.params.domain as string;
        const { ids } = req.body;
        const config = TABLE_MAP[domain];
        if (!config) return res.status(404).json({ msg: "Domain not found" });

        if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ msg: "No IDs provided" });

        const targetIds = ids.map((id: any) => {
            const p = parseInt(id, 10);
            return isNaN(p) ? id : p;
        });
        await db.delete(config.table).where(inArray(config.table[config.pk], targetIds as any[]));
        return res.status(200).json({ msg: `${ids.length} items deleted successfully from ${domain}` });
    } catch (error) {
        logError(`Master Controller Error [${req.method} ${req.url}]`, error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
