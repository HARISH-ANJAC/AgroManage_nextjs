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
    TBL_ACCOUNTS_HEAD_MASTER,
    TBL_CUSTOMER_PAYMENT_MODE_MASTER,
    TBL_BANK_MASTER,
    TBL_EXCHANGE_RATE_MASTER,
    TBL_VAT_PERCENTAGE_SETTING,
    TBL_USER_TO_STORE_MAPPING,
    TBL_PAYMENT_MODE_MASTER,
    TBL_ACCOUNTS_LEDGER_GROUP_MASTER,
    TBL_ACCOUNTS_LEDGER_MASTER,
    TBL_PRODUCT_OPENING_STOCK,
    TBL_FIELD_HDR,
    TBL_FIELD_DTL,
    TBL_PRODUCT_COMPANY_MAIN_CATEGORY_MAPPING,
    TBL_STORE_PRODUCT_MINIMUM_STOCK,
    TBL_COMPANY_BANK_ACCOUNT_MASTER,
    TBL_CHANGE_PASSWORD_LOG,
    TBL_CUSTOMER_ADDRESS_DETAILS,
    TBL_CUSTOMER_MASTER_FILES_UPLOAD,
    TBL_CUSTOMER_COMPANY_WISE_BILLING_LOCATION_MAPPING,
    TBL_CUSTOMER_PRODUCT_VAT_PERCENTAGE_SETTINGS,
    TBL_CUSTOMER_WISE_PRODUCT_PRICE_SETTINGS,
    TBL_CUSTOMER_CREDIT_LIMIT_DETAILS,
    CUSTOMER_CREDIT_LIMIT_FILE_UPLOAD,
    TBL_SALES_PERSON_MASTER,
    TBL_USER_INFO_HDR,
    TBL_ROLE_MASTER
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
    "account-heads": { table: TBL_ACCOUNTS_HEAD_MASTER, pk: "ACCOUNT_HEAD_ID" },
    "customer-payment-modes": { table: TBL_CUSTOMER_PAYMENT_MODE_MASTER, pk: "PAYMENT_MODE_ID" },
    "banks": { table: TBL_BANK_MASTER, pk: "BANK_ID" },
    "exchange-rate": {
        table: TBL_EXCHANGE_RATE_MASTER,
        pk: "SNO",
        joins: [
            { table: TBL_COMPANY_MASTER, on: eq(TBL_EXCHANGE_RATE_MASTER.Company_ID, TBL_COMPANY_MASTER.Company_Id), prefix: "COMPANY" },
            { table: TBL_CURRENCY_MASTER, on: eq(TBL_EXCHANGE_RATE_MASTER.CURRENCY_ID, TBL_CURRENCY_MASTER.CURRENCY_ID), prefix: "CURRENCY" }
        ]
    },
    "vat": {
        table: TBL_VAT_PERCENTAGE_SETTING,
        pk: "SNO",
        joins: [{ table: TBL_COMPANY_MASTER, on: eq(TBL_VAT_PERCENTAGE_SETTING.COMPANY_ID, TBL_COMPANY_MASTER.Company_Id), prefix: "COMPANY" }]
    },
    "user-store-mappings": {
        table: TBL_USER_TO_STORE_MAPPING,
        pk: "USER_TO_LOCATION_ID_USER_TO_ROLE",
        joins: [
            { table: TBL_COMPANY_MASTER, on: eq(TBL_USER_TO_STORE_MAPPING.COMPANY_ID, TBL_COMPANY_MASTER.Company_Id), prefix: "COMPANY" },
            { table: TBL_STORE_MASTER, on: eq(TBL_USER_TO_STORE_MAPPING.STORE_ID_USER_TO_ROLE, TBL_STORE_MASTER.Store_Id), prefix: "STORE" },
            { table: TBL_USER_INFO_HDR, on: eq(TBL_USER_TO_STORE_MAPPING.USER_ID_USER_TO_ROLE, TBL_USER_INFO_HDR.LOGIN_ID_USER_HDR), prefix: "USER" },
            { table: TBL_ROLE_MASTER, on: eq(TBL_USER_TO_STORE_MAPPING.ROLE_ID_USER_TO_ROLE, TBL_ROLE_MASTER.ROLE_ID), prefix: "ROLE" }
        ]
    },
    "payment-modes": { table: TBL_PAYMENT_MODE_MASTER, pk: "PAYMENT_MODE_ID" },
    "ledger-groups": { table: TBL_ACCOUNTS_LEDGER_GROUP_MASTER, pk: "LEDGER_GROUP_ID" },
    "ledger-master": {
        table: TBL_ACCOUNTS_LEDGER_MASTER,
        pk: "LEDGER_ID",
        joins: [
            { table: TBL_COMPANY_MASTER, on: eq(TBL_ACCOUNTS_LEDGER_MASTER.Company_id, TBL_COMPANY_MASTER.Company_Id), prefix: "COMPANY" },
            { table: TBL_ACCOUNTS_LEDGER_GROUP_MASTER, on: eq(TBL_ACCOUNTS_LEDGER_MASTER.LEDGER_GROUP_ID, TBL_ACCOUNTS_LEDGER_GROUP_MASTER.LEDGER_GROUP_ID), prefix: "GROUP" }
        ]
    },
    "product-opening-stocks": {
        table: TBL_PRODUCT_OPENING_STOCK,
        pk: "SNO",
        joins: [
            { table: TBL_STORE_MASTER, on: eq(TBL_PRODUCT_OPENING_STOCK.STORE_ID, TBL_STORE_MASTER.Store_Id), prefix: "STORE" },
            { table: TBL_PRODUCT_MASTER, on: eq(TBL_PRODUCT_OPENING_STOCK.PRODUCT_ID, TBL_PRODUCT_MASTER.PRODUCT_ID), prefix: "PRODUCT" }
        ]
    },
    "field-headers": { table: TBL_FIELD_HDR, pk: "field_id_fld_hdr" },
    "field-details": {
        table: TBL_FIELD_DTL,
        pk: "activity_id_fld_dtl",
        joins: [{ table: TBL_FIELD_HDR, on: eq(TBL_FIELD_DTL.field_id_fld_dtl, TBL_FIELD_HDR.field_id_fld_hdr), prefix: "HEADER" }]
    },
    "product-company-category-mappings": {
        table: TBL_PRODUCT_COMPANY_MAIN_CATEGORY_MAPPING,
        pk: "Sno",
        joins: [
            { table: TBL_COMPANY_MASTER, on: eq(TBL_PRODUCT_COMPANY_MAIN_CATEGORY_MAPPING.Company_Id, TBL_COMPANY_MASTER.Company_Id), prefix: "COMPANY" },
            { table: TBL_PRODUCT_MAIN_CATEGORY_MASTER, on: eq(TBL_PRODUCT_COMPANY_MAIN_CATEGORY_MAPPING.Main_Category_Id, TBL_PRODUCT_MAIN_CATEGORY_MASTER.MAIN_CATEGORY_ID), prefix: "CATEGORY" }
        ]
    },
    "store-product-min-stock": {
        table: TBL_STORE_PRODUCT_MINIMUM_STOCK,
        pk: "Sno",
        joins: [
            { table: TBL_STORE_MASTER, on: eq(TBL_STORE_PRODUCT_MINIMUM_STOCK.Store_Id, TBL_STORE_MASTER.Store_Id), prefix: "STORE" },
            { table: TBL_PRODUCT_MASTER, on: eq(TBL_STORE_PRODUCT_MINIMUM_STOCK.Product_Id, TBL_PRODUCT_MASTER.PRODUCT_ID), prefix: "PRODUCT" }
        ]
    },
    "company-bank-accounts": {
        table: TBL_COMPANY_BANK_ACCOUNT_MASTER,
        pk: "Account_Id",
        joins: [
            { table: TBL_COMPANY_MASTER, on: eq(TBL_COMPANY_BANK_ACCOUNT_MASTER.Company_id, TBL_COMPANY_MASTER.Company_Id), prefix: "COMPANY" },
            { table: TBL_BANK_MASTER, on: eq(TBL_COMPANY_BANK_ACCOUNT_MASTER.Bank_Id, TBL_BANK_MASTER.BANK_ID), prefix: "BANK" },
            { table: TBL_CURRENCY_MASTER, on: eq(TBL_COMPANY_BANK_ACCOUNT_MASTER.Currency_Id, TBL_CURRENCY_MASTER.CURRENCY_ID), prefix: "CURRENCY" }
        ]
    },
    "password-logs": {
        table: TBL_CHANGE_PASSWORD_LOG,
        pk: "Sno",
        joins: [{ table: TBL_USER_INFO_HDR, on: eq(TBL_CHANGE_PASSWORD_LOG.login_id, TBL_USER_INFO_HDR.LOGIN_ID_USER_HDR), prefix: "USER" }]
    },
    "customer-addresses": {
        table: TBL_CUSTOMER_ADDRESS_DETAILS,
        pk: "Sno",
        joins: [{ table: TBL_CUSTOMER_MASTER, on: eq(TBL_CUSTOMER_ADDRESS_DETAILS.Customer_Id, TBL_CUSTOMER_MASTER.Customer_Id), prefix: "CUSTOMER" }]
    },
    "customer-files": {
        table: TBL_CUSTOMER_MASTER_FILES_UPLOAD,
        pk: "SNO",
        joins: [{ table: TBL_CUSTOMER_MASTER, on: eq(TBL_CUSTOMER_MASTER_FILES_UPLOAD.Customer_Id, TBL_CUSTOMER_MASTER.Customer_Id), prefix: "CUSTOMER" }]
    },
    "customer-billing-mappings": {
        table: TBL_CUSTOMER_COMPANY_WISE_BILLING_LOCATION_MAPPING,
        pk: "SNO",
        joins: [
            { table: TBL_CUSTOMER_MASTER, on: eq(TBL_CUSTOMER_COMPANY_WISE_BILLING_LOCATION_MAPPING.Customer_Id, TBL_CUSTOMER_MASTER.Customer_Id), prefix: "CUSTOMER" },
            { table: TBL_BILLING_LOCATION_MASTER, on: eq(TBL_CUSTOMER_COMPANY_WISE_BILLING_LOCATION_MAPPING.Billing_Location_Id, TBL_BILLING_LOCATION_MASTER.Billing_Location_Id), prefix: "BILLING" }
        ]
    },
    "customer-vat-settings": {
        table: TBL_CUSTOMER_PRODUCT_VAT_PERCENTAGE_SETTINGS,
        pk: "SNO",
        joins: [{ table: TBL_CUSTOMER_MASTER, on: eq(TBL_CUSTOMER_PRODUCT_VAT_PERCENTAGE_SETTINGS.Customer_Id, TBL_CUSTOMER_MASTER.Customer_Id), prefix: "CUSTOMER" }]
    },
    "customer-pricing": {
        table: TBL_CUSTOMER_WISE_PRODUCT_PRICE_SETTINGS,
        pk: "Sno",
        joins: [
            { table: TBL_CUSTOMER_MASTER, on: eq(TBL_CUSTOMER_WISE_PRODUCT_PRICE_SETTINGS.Customer_Id, TBL_CUSTOMER_MASTER.Customer_Id), prefix: "CUSTOMER" },
            { table: TBL_PRODUCT_MASTER, on: eq(TBL_CUSTOMER_WISE_PRODUCT_PRICE_SETTINGS.Product_Id, TBL_PRODUCT_MASTER.PRODUCT_ID), prefix: "PRODUCT" }
        ]
    },
    "customer-credit-limits": {
        table: TBL_CUSTOMER_CREDIT_LIMIT_DETAILS,
        pk: "Sno",
        joins: [{ table: TBL_CUSTOMER_MASTER, on: eq(TBL_CUSTOMER_CREDIT_LIMIT_DETAILS.Customer_Id, TBL_CUSTOMER_MASTER.Customer_Id), prefix: "CUSTOMER" }]
    },
    "credit-limit-files": {
        table: CUSTOMER_CREDIT_LIMIT_FILE_UPLOAD,
        pk: "SNO",
        joins: [
            { table: TBL_CUSTOMER_CREDIT_LIMIT_DETAILS, on: eq(CUSTOMER_CREDIT_LIMIT_FILE_UPLOAD.CREDIT_LIMIT_ID, TBL_CUSTOMER_CREDIT_LIMIT_DETAILS.Sno), prefix: "LIMIT" },
            { table: TBL_CUSTOMER_MASTER, on: eq(TBL_CUSTOMER_CREDIT_LIMIT_DETAILS.Customer_Id, TBL_CUSTOMER_MASTER.Customer_Id), prefix: "CUSTOMER" }
        ]
    },
    "sales-person": { table: TBL_SALES_PERSON_MASTER, pk: "Sales_Person_ID" }
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
        const normalizedKey = key.toLowerCase();
        let targetKey = normalizedCols[key] ||
            Object.keys(columns).find(k => normalizeKey(k).toLowerCase() === normalizedKey);

        if (excludePk && targetKey && (columns[targetKey] as any).primary) return;
        if (excludePk && key === "id") return;

        if (targetKey) {
            let value = data[key];
            const columnInfo = columns[targetKey] as any;
            const columnType = columnInfo.columnType;

            // Handle timestamps
            if (columnType === 'PgTimestamp' && value && typeof value === 'string') {
                const parsedDate = new Date(value);
                if (!isNaN(parsedDate.getTime())) {
                    value = parsedDate;
                }
            }

            // Handle binary data (bytea) - Convert Base64 to Buffer
            if (typeof value === 'string' && value.startsWith('data:') && value.includes('base64,')) {
                // If it's a data URI, extract the base64 part
                const base64Data = value.split(',')[1];
                value = Buffer.from(base64Data, 'base64');
            } else if (typeof value === 'string' && (targetKey.toLowerCase().includes('data') || targetKey.toLowerCase().includes('logo')) && value.length > 50) {
                // Heuristic: if it's a long string and the column name suggests binary, try to treat as raw base64
                try {
                    // Check if it's valid base64 (very basic check)
                    if (/^[A-Za-z0-9+/=]+$/.test(value)) {
                        value = Buffer.from(value, 'base64');
                    }
                } catch (e) {
                    // Fail silently and keep as string
                }
            }

            mapped[targetKey] = value;
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

        let value = data[colKey];

        // Convert Buffer (bytea) to Base64 for the frontend
        if (Buffer.isBuffer(value)) {
            // Check if there's a corresponding CONTENT_TYPE field to make it a Data URI
            // We look for a key that ends with _TYPE or starts with CONTENT_TYPE etc.
            const contentTypeKey = Object.keys(data).find(k => k.toUpperCase() === 'CONTENT_TYPE' || k.toUpperCase().includes('_CONTENT_TYPE'));
            if (contentTypeKey && data[contentTypeKey]) {
                value = `data:${data[contentTypeKey]};base64,${value.toString('base64')}`;
            } else {
                // Fallback to raw base64 if no type info is found
                value = value.toString('base64');
            }
        }

        mapped[normalizeKey(colKey)] = value;
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
                            const normalizedCol = normalizeKey(col);
                            
                            // Map all columns with prefix: e.g. PRODUCT + productName -> productName
                            // If the column already contains the prefix or is a generic 'name' field, map it smartly
                            if (col.toLowerCase().includes("name")) {
                                final[prefix + "Name"] = joinedData[col];
                            }
                            
                            // Also map the original normalized column with prefix for safe access
                            // This ensures keys like 'productName' or 'unitPrice' work if they come from the join
                            final[prefix + normalizedCol.charAt(0).toUpperCase() + normalizedCol.slice(1)] = joinedData[col];
                            
                            // Compatibility: map common name fields directly if not already set
                            if (!final[prefix + "Name"] && col.toLowerCase().includes("name")) {
                                final[prefix + "Name"] = joinedData[col];
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
            createdBy: audit?.user || "System",
            createdDate: new Date(),
            createdMacAddress: audit?.macAddress || "Unknown",
            createdIpAddress: audit?.macAddress || "Unknown",
            createdUser: audit?.user || "System",
            createdUserFldHdr: audit?.user || "System",
            createdDateFldHdr: new Date(),
            createdMacAddrFldHdr: audit?.macAddress || "Unknown",
            statusMaster: data.statusMaster || "Active",
            statusEntry: data.statusMaster || "Active",
            statusFldHdr: data.statusMaster || "Active",
            statusFldDtl: data.statusMaster || "Active",
            statusUserToRole: data.statusMaster || "Active",
            remarksFldHdr: data.remarks,
            remarksFldDtl: data.remarks,
            createdUserUserToRole: audit?.user || "System",
            createdDateUserToRole: new Date(),
            createdMacAddrUserToRole: audit?.macAddress || "Unknown"
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
            modifiedBy: audit?.user || "System",
            modifiedDate: new Date(),
            modifiedMacAddress: audit?.macAddress || "Unknown",
            modifiedIpAddress: audit?.macAddress || "Unknown",
            modifiedUser: audit?.user || "System",
            modifiedUserFldHdr: audit?.user || "System",
            modifiedDateFldHdr: new Date(),
            modifiedMacAddrFldHdr: audit?.macAddress || "Unknown",
            statusMaster: data.statusMaster || "Active",
            statusEntry: data.statusMaster || "Active",
            statusFldHdr: data.statusMaster || "Active",
            statusFldDtl: data.statusMaster || "Active",
            statusUserToRole: data.statusMaster || "Active",
            remarksFldHdr: data.remarks,
            remarksFldDtl: data.remarks,
            modifiedUserUserToRole: audit?.user || "System",
            modifiedDateUserToRole: new Date(),
            modifiedMacAddrUserToRole: audit?.macAddress || "Unknown"
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
