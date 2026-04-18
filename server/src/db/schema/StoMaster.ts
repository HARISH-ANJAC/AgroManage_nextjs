import { relations } from "drizzle-orm";
import { pgSchema, integer, serial, bigint, bigserial, varchar, text, numeric, timestamp, customType } from "drizzle-orm/pg-core";

export const bytea = customType<{ data: Buffer, notNull: false, default: false }>({
  dataType() { return 'bytea'; },
});



export const StoMasterSchema = pgSchema("stomaster");

export const TBL_CUSTOMER_PAYMENT_MODE_MASTER = StoMasterSchema.table("TBL_CUSTOMER_PAYMENT_MODE_MASTER", {
  PAYMENT_MODE_ID: serial("PAYMENT_MODE_ID").primaryKey(),
  PAYMENT_MODE_NAME: varchar("PAYMENT_MODE_NAME", { length: 50 }),
  SHORT_CODE: varchar("SHORT_CODE", { length: 20 }),
  REMARKS: varchar("REMARKS", { length: 1000 }),
  STATUS_MASTER: varchar("STATUS_MASTER", { length: 20 }),
  CREATED_BY: varchar("CREATED_BY", { length: 50 }),
  CREATED_DATE: timestamp("CREATED_DATE", { mode: "date" }),
  CREATED_MAC_ADDRESS: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
  MODIFIED_BY: varchar("MODIFIED_BY", { length: 50 }),
  MODIFIED_DATE: timestamp("MODIFIED_DATE", { mode: "date" }),
  MODIFIED_MAC_ADDRESS: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
});

export const TBL_BILLING_LOCATION_MASTER = StoMasterSchema.table("tbl_Billing_Location_Master", {
  Billing_Location_Id: serial("Billing_Location_Id").primaryKey(),
  Billing_Location_Name: varchar("Billing_Location_Name", { length: 100 }).unique(),
  Billing_Location_Description: varchar("Billing_Location_Description", { length: 100 }),
  Remarks: varchar("Remarks", { length: 2000 }),
  Status_Master: varchar("Status_Master", { length: 20 }),
  Created_By: varchar("Created_By", { length: 50 }),
  Created_Date: timestamp("Created_Date", { mode: "date" }),
  Created_Mac_Address: varchar("Created_Mac_Address", { length: 50 }),
  Modified_By: varchar("Modified_By", { length: 50 }),
  Modified_Date: timestamp("Modified_Date", { mode: "date" }),
  Modified_Mac_Address: varchar("Modified_Mac_Address", { length: 50 }),
});

export const TBL_BANK_MASTER = StoMasterSchema.table("TBL_BANK_MASTER", {
  BANK_ID: serial("BANK_ID").primaryKey(),
  BANK_NAME: varchar("BANK_NAME", { length: 50 }).unique(),
  ADDRESS: varchar("ADDRESS", { length: 50 }),
  REMARKS: varchar("REMARKS", { length: 1000 }),
  STATUS_MASTER: varchar("STATUS_MASTER", { length: 20 }),
  CREATED_BY: varchar("CREATED_BY", { length: 50 }),
  CREATED_DATE: timestamp("CREATED_DATE", { mode: "date" }),
  CREATED_MAC_ADDRESS: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
  MODIFIED_BY: varchar("MODIFIED_BY", { length: 50 }),
  MODIFIED_DATE: timestamp("MODIFIED_DATE", { mode: "date" }),
  MODIFIED_MAC_ADDRESS: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
});

export const TBL_ROLE_MASTER = StoMasterSchema.table("TBL_ROLE_MASTER", {
  ROLE_ID: serial("ROLE_ID").primaryKey(),
  ROLE_NAME: varchar("ROLE_NAME", { length: 50 }).unique(),
  ROLE_DESCRIPTION: varchar("ROLE_DESCRIPTION", { length: 50 }),
  REMARKS: varchar("REMARKS", { length: 1000 }),
  STATUS_MASTER: varchar("STATUS_MASTER", { length: 20 }),
  CREATED_BY: varchar("CREATED_BY", { length: 50 }),
  CREATED_DATE: timestamp("CREATED_DATE", { mode: "date" }),
  CREATED_MAC_ADDRESS: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
  MODIFIED_BY: varchar("MODIFIED_BY", { length: 50 }),
  MODIFIED_DATE: timestamp("MODIFIED_DATE", { mode: "date" }),
  MODIFIED_MAC_ADDRESS: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
});

export const TBL_CURRENCY_MASTER = StoMasterSchema.table("TBL_CURRENCY_MASTER", {
  CURRENCY_ID: serial("CURRENCY_ID").primaryKey(),
  CURRENCY_NAME: varchar("CURRENCY_NAME", { length: 50 }).unique(),
  ADDRESS: varchar("ADDRESS", { length: 50 }),
  Exchange_Rate: numeric("Exchange_Rate", { precision: 30, scale: 5 }),
  REMARKS: varchar("REMARKS", { length: 1000 }),
  STATUS_MASTER: varchar("STATUS_MASTER", { length: 20 }),
  CREATED_BY: varchar("CREATED_BY", { length: 50 }),
  CREATED_DATE: timestamp("CREATED_DATE", { mode: "date" }),
  CREATED_MAC_ADDRESS: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
  MODIFIED_BY: varchar("MODIFIED_BY", { length: 50 }),
  MODIFIED_DATE: timestamp("MODIFIED_DATE", { mode: "date" }),
  MODIFIED_MAC_ADDRESS: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
});

export const TBL_COMPANY_MASTER = StoMasterSchema.table("tbl_Company_Master", {
  Company_Id: serial("Company_Id").primaryKey(),
  Company_Name: varchar("Company_Name", { length: 100 }).unique(),
  TIN_Number: varchar("TIN_Number", { length: 50 }).unique(),
  Address: varchar("Address", { length: 2000 }),
  Contact_Person: varchar("Contact_Person", { length: 50 }),
  Contact_Number: varchar("Contact_Number", { length: 50 }),
  Email: varchar("Email", { length: 50 }),
  Short_Code: varchar("Short_Code", { length: 4 }),
  Finance_Start_Month: varchar("Finance_Start_Month", { length: 50 }),
  Finance_End_Month: varchar("Finance_End_Month", { length: 50 }),
  Year_Code: varchar("Year_Code", { length: 50 }),
  Company_Full_Name: varchar("Company_Full_Name", { length: 150 }),
  Currency_ID: integer("Currency_ID").references(() => TBL_CURRENCY_MASTER.CURRENCY_ID),
  TimeZone: varchar("TimeZone", { length: 50 }),
  No_Of_User: integer("No_Of_User"),
  WebSite: varchar("WebSite", { length: 50 }),
  Comp_Big_Logo: bytea("Comp_Big_Logo"),
  Comp_Small_Logo: bytea("Comp_Small_Logo"),
  Comp_Letter_Head: bytea("Comp_Letter_Head"),
  Comp_Stamp_LOGO: bytea("Comp_Stamp_LOGO"),
  Remarks: varchar("Remarks", { length: 2000 }),
  Status_Master: varchar("Status_Master", { length: 20 }),
  Created_By: varchar("Created_By", { length: 50 }),
  Created_Date: timestamp("Created_Date", { mode: "date" }),
  Created_Mac_Address: varchar("Created_Mac_Address", { length: 50 }),
  Modified_By: varchar("Modified_By", { length: 50 }),
  Modified_Date: timestamp("Modified_Date", { mode: "date" }),
  Modified_Mac_Address: varchar("Modified_Mac_Address", { length: 50 }),
});

export const TBL_EXCHANGE_RATE_MASTER = StoMasterSchema.table("TBL_EXCHANGE_RATE_MASTER", {
  SNO: serial("SNO").primaryKey(),
  Company_ID: integer("Company_ID").references(() => TBL_COMPANY_MASTER.Company_Id),
  CURRENCY_ID: integer("CURRENCY_ID").references(() => TBL_CURRENCY_MASTER.CURRENCY_ID),
  Exchange_Rate: numeric("Exchange_Rate", { precision: 30, scale: 5 }),
  REMARKS: varchar("REMARKS", { length: 1000 }),
  STATUS_MASTER: varchar("STATUS_MASTER", { length: 20 }),
  CREATED_BY: varchar("CREATED_BY", { length: 50 }),
  CREATED_DATE: timestamp("CREATED_DATE", { mode: "date" }),
  CREATED_MAC_ADDRESS: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
  MODIFIED_BY: varchar("MODIFIED_BY", { length: 50 }),
  MODIFIED_DATE: timestamp("MODIFIED_DATE", { mode: "date" }),
  MODIFIED_MAC_ADDRESS: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
});

export const TBL_USER_INFO_HDR = StoMasterSchema.table("TBL_USER_INFO_HDR", {
  LOGIN_ID_USER_HDR: serial("LOGIN_ID_USER_HDR").primaryKey(),
  NEW_CARD_NO_USER_HDR: integer("NEW_CARD_NO_USER_HDR"),
  LOGIN_NAME: varchar("LOGIN_NAME", { length: 50 }).unique(),
  PASSWORD_USER_HDR: varchar("PASSWORD_USER_HDR", { length: 100 }),
  ROLE_USER_HDR: varchar("ROLE_USER_HDR", { length: 100 }),
  MOBILE_NO_USER_HDR: varchar("MOBILE_NO_USER_HDR", { length: 30 }),
  MAIL_ID_USER_HDR: varchar("MAIL_ID_USER_HDR", { length: 150 }),
  STOCK_SHOW_STATUS: varchar("STOCK_SHOW_STATUS", { length: 10 }),
  OUTSIDE_ACCESS_Y_N: varchar("OUTSIDE_ACCESS_Y_N", { length: 20 }),
  STATUS_USER_HDR: varchar("STATUS_USER_HDR", { length: 20 }),
  REMARKS_USER_HDR: varchar("REMARKS_USER_HDR", { length: 1000 }),
  CREATED_USER_USER_HDR: varchar("CREATED_USER_USER_HDR", { length: 50 }),
  CREATED_DATE_USER_HDR: timestamp("CREATED_DATE_USER_HDR", { mode: "date" }),
  CREATED_MAC_ADDR_USER_HDR: varchar("CREATED_MAC_ADDR_USER_HDR", { length: 50 }),
  MODIFIED_USER_USER_HDR: varchar("MODIFIED_USER_USER_HDR", { length: 50 }),
  MODIFIED_DATE_USER_HDR: timestamp("MODIFIED_DATE_USER_HDR", { mode: "date" }),
  MODIFIED_MAC_ADDR_USER_HDR: varchar("MODIFIED_MAC_ADDR_USER_HDR", { length: 50 }),
});

export const TBL_VAT_PERCENTAGE_SETTING = StoMasterSchema.table("TBL_VAT_PERCENTAGE_SETTING", {
  SNO: serial("SNO").primaryKey(),
  COMPANY_ID: integer("COMPANY_ID").references(() => TBL_COMPANY_MASTER.Company_Id),
  VAT_PERCENTAGE: numeric("VAT_PERCENTAGE", { precision: 30, scale: 2 }),
  EFFECTIVE_FROM: timestamp("EFFECTIVE_FROM", { mode: "date" }),
  EFFECTIVE_TO: timestamp("EFFECTIVE_TO", { mode: "date" }),
  REMARKS: varchar("REMARKS", { length: 2000 }),
  STATUS_MASTER: varchar("STATUS_MASTER", { length: 20 }),
  CREATED_BY: varchar("CREATED_BY", { length: 50 }),
  CREATED_DATE: timestamp("CREATED_DATE", { mode: "date" }),
  CREATED_MAC_ADDRESS: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
  MODIFIED_BY: varchar("MODIFIED_BY", { length: 50 }),
  MODIFIED_DATE: timestamp("MODIFIED_DATE", { mode: "date" }),
  MODIFIED_MAC_ADDRESS: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
});

export const TBL_LOCATION_MASTER = StoMasterSchema.table("tbl_Location_Master", {
  Location_Id: serial("Location_Id").primaryKey(),
  Location_Name: varchar("Location_Name", { length: 100 }).unique(),
  Location_Description: varchar("Location_Description", { length: 100 }),
  Remarks: varchar("Remarks", { length: 2000 }),
  Status_Master: varchar("Status_Master", { length: 20 }),
  Created_By: varchar("Created_By", { length: 50 }),
  Created_Date: timestamp("Created_Date", { mode: "date" }),
  Created_Mac_Address: varchar("Created_Mac_Address", { length: 50 }),
  Modified_By: varchar("Modified_By", { length: 50 }),
  Modified_Date: timestamp("Modified_Date", { mode: "date" }),
  Modified_Mac_Address: varchar("Modified_Mac_Address", { length: 50 }),
});

export const TBL_STORE_MASTER = StoMasterSchema.table("tbl_Store_Master", {
  Store_Id: serial("Store_Id").primaryKey(),
  Store_Name: varchar("Store_Name", { length: 100 }).unique(),
  Location_Id: integer("Location_Id").references(() => TBL_LOCATION_MASTER.Location_Id),
  Manager_Name: varchar("Manager_Name", { length: 50 }),
  Store_Short_Code: varchar("Store_Short_Code", { length: 5 }),
  Store_Short_Name: varchar("Store_Short_Name", { length: 100 }),
  Email_Address: varchar("Email_Address", { length: 1000 }),
  CC_Email_Address: text("CC_Email_Address"),
  BCC_Email_Address: varchar("BCC_Email_Address", { length: 50 }),
  Response_Directors_Name: varchar("Response_Directors_Name", { length: 1000 }),
  Remarks: varchar("Remarks", { length: 2000 }),
  Status_Master: varchar("Status_Master", { length: 20 }),
  Created_By: varchar("Created_By", { length: 50 }),
  Created_Date: timestamp("Created_Date", { mode: "date" }),
  Created_Mac_Address: varchar("Created_Mac_Address", { length: 50 }),
  Modified_By: varchar("Modified_By", { length: 50 }),
  Modified_Date: timestamp("Modified_Date", { mode: "date" }),
  Modified_Mac_Address: varchar("Modified_Mac_Address", { length: 50 }),
});

export const TBL_USER_TO_STORE_MAPPING = StoMasterSchema.table("TBL_USER_TO_STORE_MAPPING", {
  USER_TO_LOCATION_ID_USER_TO_ROLE: serial("USER_TO_LOCATION_ID_USER_TO_ROLE").primaryKey(),
  USER_ID_USER_TO_ROLE: integer("USER_ID_USER_TO_ROLE").references(() => TBL_USER_INFO_HDR.LOGIN_ID_USER_HDR),
  COMPANY_ID: integer("COMPANY_ID").references(() => TBL_COMPANY_MASTER.Company_Id),
  STORE_ID_USER_TO_ROLE: integer("STORE_ID_USER_TO_ROLE").references(() => TBL_STORE_MASTER.Store_Id),
  ROLE_ID_USER_TO_ROLE: integer("ROLE_ID_USER_TO_ROLE").references(() => TBL_ROLE_MASTER.ROLE_ID),
  STATUS_USER_TO_ROLE: varchar("STATUS_USER_TO_ROLE", { length: 20 }),
  CREATED_USER_USER_TO_ROLE: varchar("CREATED_USER_USER_TO_ROLE", { length: 50 }),
  CREATED_DATE_USER_TO_ROLE: timestamp("CREATED_DATE_USER_TO_ROLE", { mode: "date" }),
  CREATED_MAC_ADDR_USER_TO_ROLE: varchar("CREATED_MAC_ADDR_USER_TO_ROLE", { length: 50 }),
  MODIFIED_USER_USER_TO_ROLE: varchar("MODIFIED_USER_USER_TO_ROLE", { length: 50 }),
  MODIFIED_DATE_USER_TO_ROLE: timestamp("MODIFIED_DATE_USER_TO_ROLE", { mode: "date" }),
  MODIFIED_MAC_ADDR_USER_TO_ROLE: varchar("MODIFIED_MAC_ADDR_USER_TO_ROLE", { length: 50 }),
});

export const TBL_PAYMENT_MODE_MASTER = StoMasterSchema.table("TBL_PAYMENT_MODE_MASTER", {
  PAYMENT_MODE_ID: serial("PAYMENT_MODE_ID").primaryKey(),
  PAYMENT_MODE_NAME: varchar("PAYMENT_MODE_NAME", { length: 50 }).unique(),
  PAYMENT_MODE_PERCENTAGE: numeric("PAYMENT_MODE_PERCENTAGE", { precision: 30, scale: 2 }),
  REMARKS: varchar("REMARKS", { length: 1000 }),
  STATUS_ENTRY: varchar("STATUS_ENTRY", { length: 50 }),
  CREATED_BY: varchar("CREATED_BY", { length: 50 }),
  CREATED_DATE: timestamp("CREATED_DATE", { mode: "date" }),
  CREATED_MAC_ADDRESS: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
  MODIFIED_BY: varchar("MODIFIED_BY", { length: 50 }),
  MODIFIED_DATE: timestamp("MODIFIED_DATE", { mode: "date" }),
  MODIFIED_MAC_ADDRESS: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
});

export const TBL_ADDITIONAL_COST_TYPE_MASTER = StoMasterSchema.table("TBL_ADDITIONAL_COST_TYPE_MASTER", {
  ADDITIONAL_COST_TYPE_ID: serial("ADDITIONAL_COST_TYPE_ID").primaryKey(),
  ADDITIONAL_COST_TYPE_NAME: varchar("ADDITIONAL_COST_TYPE_NAME", { length: 50 }).unique(),
  REMARKS: varchar("REMARKS", { length: 1000 }),
  STATUS_ENTRY: varchar("STATUS_ENTRY", { length: 50 }),
  CREATED_BY: varchar("CREATED_BY", { length: 50 }),
  CREATED_DATE: timestamp("CREATED_DATE", { mode: "date" }),
  CREATED_MAC_ADDRESS: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
  MODIFIED_BY: varchar("MODIFIED_BY", { length: 50 }),
  MODIFIED_DATE: timestamp("MODIFIED_DATE", { mode: "date" }),
  MODIFIED_MAC_ADDRESS: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
});

export const TBL_PAYMENT_TERM_MASTER = StoMasterSchema.table("TBL_PAYMENT_TERM_MASTER", {
  PAYMENT_TERM_ID: serial("PAYMENT_TERM_ID").primaryKey(),
  PAYMENT_TERM_NAME: varchar("PAYMENT_TERM_NAME", { length: 50 }).unique(),
  REMARKS: varchar("REMARKS", { length: 1000 }),
  STATUS_ENTRY: varchar("STATUS_ENTRY", { length: 50 }),
  CREATED_BY: varchar("CREATED_BY", { length: 50 }),
  CREATED_DATE: timestamp("CREATED_DATE", { mode: "date" }),
  CREATED_MAC_ADDRESS: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
  MODIFIED_BY: varchar("MODIFIED_BY", { length: 50 }),
  MODIFIED_DATE: timestamp("MODIFIED_DATE", { mode: "date" }),
  MODIFIED_MAC_ADDRESS: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
});

export const TBL_ACCOUNTS_LEDGER_GROUP_MASTER = StoMasterSchema.table("TBL_ACCOUNTS_LEDGER_GROUP_MASTER", {
  LEDGER_GROUP_ID: serial("LEDGER_GROUP_ID").primaryKey(),
  LEDGER_GROUP_NAME: varchar("LEDGER_GROUP_NAME", { length: 50 }).unique(),
  REMARKS: varchar("REMARKS", { length: 1000 }),
  STATUS_ENTRY: varchar("STATUS_ENTRY", { length: 50 }),
  CREATED_BY: varchar("CREATED_BY", { length: 50 }),
  CREATED_DATE: timestamp("CREATED_DATE", { mode: "date" }),
  CREATED_MAC_ADDRESS: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
  MODIFIED_BY: varchar("MODIFIED_BY", { length: 50 }),
  MODIFIED_DATE: timestamp("MODIFIED_DATE", { mode: "date" }),
  MODIFIED_MAC_ADDRESS: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
});

export const TBL_ACCOUNTS_HEAD_MASTER = StoMasterSchema.table("TBL_ACCOUNTS_HEAD_MASTER", {
  ACCOUNT_HEAD_ID: serial("ACCOUNT_HEAD_ID").primaryKey(),
  ACCOUNT_HEAD_NAME: varchar("ACCOUNT_HEAD_NAME", { length: 50 }).unique(),
  REMARKS: varchar("REMARKS", { length: 1000 }),
  STATUS_ENTRY: varchar("STATUS_ENTRY", { length: 50 }),
  CREATED_BY: varchar("CREATED_BY", { length: 50 }),
  CREATED_DATE: timestamp("CREATED_DATE", { mode: "date" }),
  CREATED_MAC_ADDRESS: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
  MODIFIED_BY: varchar("MODIFIED_BY", { length: 50 }),
  MODIFIED_DATE: timestamp("MODIFIED_DATE", { mode: "date" }),
  MODIFIED_MAC_ADDRESS: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
});

export const TBL_PRODUCT_MAIN_CATEGORY_MASTER = StoMasterSchema.table("TBL_PRODUCT_MAIN_CATEGORY_MASTER", {
  MAIN_CATEGORY_ID: serial("MAIN_CATEGORY_ID").primaryKey(),
  MAIN_CATEGORY_NAME: varchar("MAIN_CATEGORY_NAME", { length: 100 }).unique(),
  REMARKS: varchar("REMARKS", { length: 2000 }),
  STATUS_MASTER: varchar("STATUS_MASTER", { length: 20 }),
  CREATED_BY: varchar("CREATED_BY", { length: 50 }),
  CREATED_DATE: timestamp("CREATED_DATE", { mode: "date" }),
  CREATED_MAC_ADDRESS: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
  MODIFIED_BY: varchar("MODIFIED_BY", { length: 50 }),
  MODIFIED_DATE: timestamp("MODIFIED_DATE", { mode: "date" }),
  MODIFIED_MAC_ADDRESS: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
});

export const TBL_PRODUCT_SUB_CATEGORY_MASTER = StoMasterSchema.table("TBL_PRODUCT_SUB_CATEGORY_MASTER", {
  SUB_CATEGORY_ID: serial("SUB_CATEGORY_ID").primaryKey(),
  SUB_CATEGORY_NAME: varchar("SUB_CATEGORY_NAME", { length: 50 }).unique(),
  MAIN_CATEGORY_ID: integer("MAIN_CATEGORY_ID").references(() => TBL_PRODUCT_MAIN_CATEGORY_MASTER.MAIN_CATEGORY_ID),
  REMARKS: varchar("REMARKS", { length: 2000 }),
  STATUS_MASTER: varchar("STATUS_MASTER", { length: 20 }),
  CREATED_BY: varchar("CREATED_BY", { length: 50 }),
  CREATED_DATE: timestamp("CREATED_DATE", { mode: "date" }),
  CREATED_MAC_ADDRESS: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
  MODIFIED_BY: varchar("MODIFIED_BY", { length: 50 }),
  MODIFIED_DATE: timestamp("MODIFIED_DATE", { mode: "date" }),
  MODIFIED_MAC_ADDRESS: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
});

export const TBL_PRODUCT_MASTER = StoMasterSchema.table("TBL_PRODUCT_MASTER", {
  PRODUCT_ID: serial("PRODUCT_ID").primaryKey(),
  PRODUCT_NAME: varchar("PRODUCT_NAME", { length: 150 }).unique(),
  MAIN_CATEGORY_ID: integer("MAIN_CATEGORY_ID").references(() => TBL_PRODUCT_MAIN_CATEGORY_MASTER.MAIN_CATEGORY_ID),
  SUB_CATEGORY_ID: integer("SUB_CATEGORY_ID").references(() => TBL_PRODUCT_SUB_CATEGORY_MASTER.SUB_CATEGORY_ID),
  UOM: varchar("UOM", { length: 50 }),
  QTY_PER_PACKING: numeric("QTY_PER_PACKING", { precision: 30, scale: 2 }),
  ALTERNATE_UOM: varchar("ALTERNATE_UOM", { length: 50 }),
  FILE_NAME: varchar("FILE_NAME", { length: 150 }),
  CONTENT_TYPE: varchar("CONTENT_TYPE", { length: 50 }),
  CONTENT_DATA: bytea("CONTENT_DATA"),
  REMARKS: varchar("REMARKS", { length: 2000 }),
  STATUS_MASTER: varchar("STATUS_MASTER", { length: 20 }),
  CREATED_BY: varchar("CREATED_BY", { length: 50 }),
  CREATED_DATE: timestamp("CREATED_DATE", { mode: "date" }),
  CREATED_MAC_ADDRESS: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
  MODIFIED_BY: varchar("MODIFIED_BY", { length: 50 }),
  MODIFIED_DATE: timestamp("MODIFIED_DATE", { mode: "date" }),
  MODIFIED_MAC_ADDRESS: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
});

export const TBL_COUNTRY_MASTER = StoMasterSchema.table("tbl_country_master", {
  Country_Id: serial("Country_Id").primaryKey(),
  Country_Name: varchar("Country_Name", { length: 100 }).unique(),
  nicename: varchar("nicename", { length: 80 }),
  iso3: varchar("iso3", { length: 50 }),
  numcode: integer("numcode"),
  phonecode: integer("phonecode"),
  Batch_No: varchar("Batch_No", { length: 2 }),
  Remarks: varchar("Remarks", { length: 1000 }),
  Status_Master: varchar("Status_Master", { length: 50 }),
  Created_User: varchar("Created_User", { length: 50 }),
  Created_Date: timestamp("Created_Date", { mode: "date" }),
  Created_Mac_Address: varchar("Created_Mac_Address", { length: 50 }),
  Modified_User: varchar("Modified_User", { length: 50 }),
  Modified_Date: timestamp("Modified_Date", { mode: "date" }),
  Modified_Mac_Address: varchar("Modified_Mac_Address", { length: 50 }),
});

export const TBL_REGION_MASTER = StoMasterSchema.table("TBL_REGION_MASTER", {
  REGION_ID: serial("REGION_ID").primaryKey(),
  REGION_NAME: varchar("REGION_NAME", { length: 50 }).unique(),
  COUNTRY_ID: integer("COUNTRY_ID").references(() => TBL_COUNTRY_MASTER.Country_Id),
  CAPITAL: varchar("CAPITAL", { length: 50 }),
  NO_OF_DISTRICTS: integer("NO_OF_DISTRICTS"),
  TOTAL_POPULATION: numeric("TOTAL_POPULATION", { precision: 30, scale: 2 }),
  ZONE_NAME: varchar("ZONE_NAME", { length: 50 }),
  DISTANCE_FROM_ARUSHA: numeric("DISTANCE_FROM_ARUSHA", { precision: 30, scale: 2 }),
  STATUS_MASTER: varchar("STATUS_MASTER", { length: 20 }),
  CREATED_BY: varchar("CREATED_BY", { length: 50 }),
  CREATED_DATE: timestamp("CREATED_DATE", { mode: "date" }),
  CREATED_MAC_ADDRESS: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
  MODIFIED_BY: varchar("MODIFIED_BY", { length: 50 }),
  MODIFIED_DATE: timestamp("MODIFIED_DATE", { mode: "date" }),
  MODIFIED_MAC_ADDRESS: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
});

export const TBL_PRODUCT_OPENING_STOCK = StoMasterSchema.table("TBL_PRODUCT_OPENING_STOCK", {
  SNO: serial("SNO").primaryKey(),
  OPENING_STOCK_DATE: timestamp("OPENING_STOCK_DATE", { mode: "date" }),
  COMPANY_ID: integer("COMPANY_ID").references(() => TBL_COMPANY_MASTER.Company_Id),
  STORE_ID: integer("STORE_ID").references(() => TBL_STORE_MASTER.Store_Id),
  MAIN_CATEGORY_ID: integer("MAIN_CATEGORY_ID").references(() => TBL_PRODUCT_MAIN_CATEGORY_MASTER.MAIN_CATEGORY_ID),
  SUB_CATEGORY_ID: integer("SUB_CATEGORY_ID").references(() => TBL_PRODUCT_SUB_CATEGORY_MASTER.SUB_CATEGORY_ID),
  PRODUCT_ID: integer("PRODUCT_ID").references(() => TBL_PRODUCT_MASTER.PRODUCT_ID),
  TOTAL_QTY: numeric("TOTAL_QTY", { precision: 30, scale: 2 }),
  REMARKS: varchar("REMARKS", { length: 2000 }),
  STATUS_MASTER: varchar("STATUS_MASTER", { length: 20 }),
  CREATED_BY: varchar("CREATED_BY", { length: 50 }),
  CREATED_DATE: timestamp("CREATED_DATE", { mode: "date" }),
  CREATED_MAC_ADDRESS: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
  MODIFIED_BY: varchar("MODIFIED_BY", { length: 50 }),
  MODIFIED_DATE: timestamp("MODIFIED_DATE", { mode: "date" }),
  MODIFIED_MAC_ADDRESS: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
});

export const TBL_FIELD_HDR = StoMasterSchema.table("tbl_field_hdr", {
  field_id_fld_hdr: bigserial("field_id_fld_hdr", { mode: "number" }).primaryKey(),
  project_name_fld_hdr: varchar("project_name_fld_hdr", { length: 50 }),
  field_category_fld_hdr: varchar("field_category_fld_hdr", { length: 50 }).unique(),
  field_desc_fld_hdr: varchar("field_desc_fld_hdr", { length: 150 }),
  status_fld_hdr: varchar("status_fld_hdr", { length: 20 }),
  remarks_fld_hdr: varchar("remarks_fld_hdr", { length: 1000 }),
  created_user_fld_hdr: varchar("created_user_fld_hdr", { length: 50 }),
  created_date_fld_hdr: timestamp("created_date_fld_hdr", { mode: "date" }),
  created_mac_addr_fld_hdr: varchar("created_mac_addr_fld_hdr", { length: 50 }),
  modified_user_fld_hdr: varchar("modified_user_fld_hdr", { length: 50 }),
  modified_date_fld_hdr: timestamp("modified_date_fld_hdr", { mode: "date" }),
  modified_mac_addr_fld_hdr: varchar("modified_mac_addr_fld_hdr", { length: 50 }),
});

export const TBL_FIELD_DTL = StoMasterSchema.table("tbl_field_dtl", {
  activity_id_fld_dtl: bigserial("activity_id_fld_dtl", { mode: "number" }).primaryKey(),
  field_id_fld_dtl: bigint("field_id_fld_dtl", { mode: "number" }).references(() => TBL_FIELD_HDR.field_id_fld_hdr),
  activity_name_fld_dtl: text("activity_name_fld_dtl"),
  activity_desc_fld_dtl: text("activity_desc_fld_dtl"),
  status_fld_dtl: varchar("status_fld_dtl", { length: 10 }),
  remarks_fld_dtl: varchar("remarks_fld_dtl", { length: 1000 }),
  created_user_fld_dtl: varchar("created_user_fld_dtl", { length: 50 }),
  created_date_fld_dtl: timestamp("created_date_fld_dtl", { mode: "date" }),
  created_mac_addr_fld_dtl: varchar("created_mac_addr_fld_dtl", { length: 50 }),
  modified_user_fld_dtl: varchar("modified_user_fld_dtl", { length: 50 }),
  modified_date_fld_dtl: timestamp("modified_date_fld_dtl", { mode: "date" }),
  modified_mac_addr_fld_dtl: varchar("modified_mac_addr_fld_dtl", { length: 50 }),
});

export const TBL_PRODUCT_COMPANY_MAIN_CATEGORY_MAPPING = StoMasterSchema.table("tbl_Product_Company_Main_Category_Mapping", {
  Sno: serial("Sno").primaryKey(),
  Company_Id: integer("Company_Id").references(() => TBL_COMPANY_MASTER.Company_Id),
  Main_Category_Id: integer("Main_Category_Id").references(() => TBL_PRODUCT_MAIN_CATEGORY_MASTER.MAIN_CATEGORY_ID),
  Remarks: varchar("Remarks", { length: 2000 }),
  Status_Master: varchar("Status_Master", { length: 20 }),
  Created_By: varchar("Created_By", { length: 50 }),
  Created_Date: timestamp("Created_Date", { mode: "date" }),
  Created_Mac_Address: varchar("Created_Mac_Address", { length: 50 }),
  Modified_By: varchar("Modified_By", { length: 50 }),
  Modified_Date: timestamp("Modified_Date", { mode: "date" }),
  Modified_Mac_Address: varchar("Modified_Mac_Address", { length: 50 }),
});

export const TBL_STORE_PRODUCT_MINIMUM_STOCK = StoMasterSchema.table("tbl_Store_Product_Minimum_Stock", {
  Sno: serial("Sno").primaryKey(),
  Company_id: integer("Company_id").references(() => TBL_COMPANY_MASTER.Company_Id),
  Store_Id: integer("Store_Id").references(() => TBL_STORE_MASTER.Store_Id),
  Main_Category_Id: integer("Main_Category_Id").references(() => TBL_PRODUCT_MAIN_CATEGORY_MASTER.MAIN_CATEGORY_ID),
  Sub_Category_Id: integer("Sub_Category_Id").references(() => TBL_PRODUCT_SUB_CATEGORY_MASTER.SUB_CATEGORY_ID),
  Product_Id: integer("Product_Id").references(() => TBL_PRODUCT_MASTER.PRODUCT_ID),
  Minimum_Stock_Pcs: integer("Minimum_Stock_Pcs"),
  Purchase_Alert_Qty: numeric("Purchase_Alert_Qty", { precision: 30, scale: 2 }),
  Requested_By: varchar("Requested_By", { length: 50 }),
  Effective_From: timestamp("Effective_From", { mode: "date" }),
  Effective_To: timestamp("Effective_To", { mode: "date" }),
  Remarks: varchar("Remarks", { length: 2000 }),
  Status_Master: varchar("Status_Master", { length: 20 }),
  Created_By: varchar("Created_By", { length: 50 }),
  Created_Date: timestamp("Created_Date", { mode: "date" }),
  Created_Mac_Address: varchar("Created_Mac_Address", { length: 50 }),
  Modified_By: varchar("Modified_By", { length: 50 }),
  Modified_Date: timestamp("Modified_Date", { mode: "date" }),
  Modified_Mac_Address: varchar("Modified_Mac_Address", { length: 50 }),
});

export const TBL_SUPPLIER_MASTER = StoMasterSchema.table("tbl_Supplier_Master", {
  Supplier_Id: serial("Supplier_Id").primaryKey(),
  Supplier_Type: varchar("Supplier_Type", { length: 50 }),
  Supplier_Name: varchar("Supplier_Name", { length: 250 }).unique(),
  TIN_Number: varchar("TIN_Number", { length: 100 }),
  Vat_Register_No: varchar("Vat_Register_No", { length: 50 }),
  SH_Nick_Name: varchar("SH_Nick_Name", { length: 50 }),
  Shipment_Mode: varchar("Shipment_Mode", { length: 100 }),
  Country_Id: integer("Country_Id").references(() => TBL_COUNTRY_MASTER.Country_Id),
  Region_Id: integer("Region_Id"),
  District_Id: integer("District_Id"),
  Address: varchar("Address", { length: 2500 }),
  Contact_Person: varchar("Contact_Person", { length: 50 }),
  Phone_number: varchar("Phone_number", { length: 50 }),
  Mail_Id: varchar("Mail_Id", { length: 50 }),
  Fax: varchar("Fax", { length: 50 }),
  vat_Percentage: numeric("vat_Percentage", { precision: 30, scale: 2 }),
  Withholding_vat_percentage: numeric("Withholding_vat_percentage", { precision: 30, scale: 2 }),
  Remarks: varchar("Remarks", { length: 150 }),
  Status_Master: varchar("Status_Master", { length: 20 }),
  Created_User: varchar("Created_User", { length: 50 }),
  Created_Date: timestamp("Created_Date", { mode: "date" }),
  Created_Mac_Address: varchar("Created_Mac_Address", { length: 50 }),
  Modified_User: varchar("Modified_User", { length: 50 }),
  Modified_Date: timestamp("Modified_Date", { mode: "date" }),
  Modified_Mac_Address: varchar("Modified_Mac_Address", { length: 50 }),
});

export const TBL_COMPANY_BANK_ACCOUNT_MASTER = StoMasterSchema.table("tbl_Company_Bank_Account_Master", {
  Account_Id: serial("Account_Id").primaryKey(),
  Company_id: integer("Company_id").references(() => TBL_COMPANY_MASTER.Company_Id),
  Bank_Id: integer("Bank_Id").references(() => TBL_BANK_MASTER.BANK_ID),
  Account_Name: varchar("Account_Name", { length: 100 }).unique(),
  Account_Number: varchar("Account_Number", { length: 100 }).unique(),
  Swift_Code: varchar("Swift_Code", { length: 50 }),
  Branch_Address: varchar("Branch_Address", { length: 200 }),
  Bank_Branch_Name: varchar("Bank_Branch_Name", { length: 50 }),
  Currency_Id: integer("Currency_Id").references(() => TBL_CURRENCY_MASTER.CURRENCY_ID),
  Remarks: varchar("Remarks", { length: 2000 }),
  Status_Master: varchar("Status_Master", { length: 20 }),
  Created_By: varchar("Created_By", { length: 50 }),
  Created_Date: timestamp("Created_Date", { mode: "date" }),
  Created_Mac_Address: varchar("Created_Mac_Address", { length: 50 }),
  Modified_By: varchar("Modified_By", { length: 50 }),
  Modified_Date: timestamp("Modified_Date", { mode: "date" }),
  Modified_Mac_Address: varchar("Modified_Mac_Address", { length: 50 }),
});

export const TBL_CHANGE_PASSWORD_LOG = StoMasterSchema.table("tbl_Change_Password_Log", {
  Sno: serial("Sno").primaryKey(),
  login_id: integer("login_id").references(() => TBL_USER_INFO_HDR.LOGIN_ID_USER_HDR),
  User_Name: varchar("User_Name", { length: 50 }),
  Old_Password: varchar("Old_Password", { length: 50 }),
  New_Password: varchar("New_Password", { length: 50 }),
  Reason: varchar("Reason", { length: 1000 }),
  status_entry: varchar("status_entry", { length: 50 }),
  Created_by: varchar("Created_by", { length: 50 }),
  Created_Date: timestamp("Created_Date", { mode: "date" }),
  Created_Mac_Address: varchar("Created_Mac_Address", { length: 50 }),
  Modified_by: varchar("Modified_by", { length: 50 }),
  Modified_Date: timestamp("Modified_Date", { mode: "date" }),
  Modified_Mac_Address: varchar("Modified_Mac_Address", { length: 50 }),
});

export const TBL_DISTRICT_MASTER = StoMasterSchema.table("tbl_District_Master", {
  District_id: serial("District_id").primaryKey(),
  Country_Id: integer("Country_Id").references(() => TBL_COUNTRY_MASTER.Country_Id),
  Region_Id: integer("Region_Id").references(() => TBL_REGION_MASTER.REGION_ID),
  District_Name: varchar("District_Name", { length: 50 }),
  Total_Population: numeric("Total_Population", { precision: 30, scale: 2 }),
  Zone_Name: varchar("Zone_Name", { length: 50 }),
  Distance_From_Arusha: numeric("Distance_From_Arusha", { precision: 30, scale: 2 }),
  Status_Master: varchar("Status_Master", { length: 20 }),
  Created_By: varchar("Created_By", { length: 50 }),
  Created_Date: timestamp("Created_Date", { mode: "date" }),
  Created_Mac_Address: varchar("Created_Mac_Address", { length: 50 }),
  Modified_By: varchar("Modified_By", { length: 50 }),
  Modified_Date: timestamp("Modified_Date", { mode: "date" }),
  Modified_Mac_Address: varchar("Modified_Mac_Address", { length: 50 }),
});

export const TBL_CUSTOMER_MASTER = StoMasterSchema.table("tbl_Customer_Master", {
  Customer_Id: serial("Customer_Id").primaryKey(),
  Customer_Name: varchar("Customer_Name", { length: 250 }).unique(),
  TIN_Number: varchar("TIN_Number", { length: 100 }),
  VAT_Number: varchar("VAT_Number", { length: 50 }),
  Contact_Person: varchar("Contact_Person", { length: 50 }),
  Contact_Number: varchar("Contact_Number", { length: 50 }),
  Location: varchar("Location", { length: 100 }),
  Nature_Of_Business: varchar("Nature_Of_Business", { length: 50 }),
  Billing_Location_Id: integer("Billing_Location_Id").references(() => TBL_BILLING_LOCATION_MASTER.Billing_Location_Id),
  Country_Id: integer("Country_Id").references(() => TBL_COUNTRY_MASTER.Country_Id),
  Region_Id: integer("Region_Id").references(() => TBL_REGION_MASTER.REGION_ID),
  District_Id: integer("District_Id").references(() => TBL_DISTRICT_MASTER.District_id),
  currency_id: integer("currency_id").references(() => TBL_CURRENCY_MASTER.CURRENCY_ID),
  CREDIT_ALLOWED: varchar("CREDIT_ALLOWED", { length: 50 }),
  Address: varchar("Address", { length: 1500 }),
  Email_Address: varchar("Email_Address", { length: 100 }),
  PHONE_NUMBER_2: varchar("PHONE_NUMBER_2", { length: 50 }),
  LAT: numeric("LAT", { precision: 30, scale: 9 }),
  LNG: numeric("LNG", { precision: 30, scale: 9 }),
  TIER: varchar("TIER", { length: 50 }),
  Company_Head_Contact_Person: varchar("Company_Head_Contact_Person", { length: 250 }),
  Company_Head_Phone_No: varchar("Company_Head_Phone_No", { length: 250 }),
  Company_Head_Email: varchar("Company_Head_Email", { length: 250 }),
  Accounts_Contact_Person: varchar("Accounts_Contact_Person", { length: 250 }),
  Accounts_Phone_No: varchar("Accounts_Phone_No", { length: 250 }),
  Accounts_Email: varchar("Accounts_Email", { length: 250 }),
  Remarks: varchar("Remarks", { length: 2000 }),
  Status_Master: varchar("Status_Master", { length: 20 }),
  Created_By: varchar("Created_By", { length: 50 }),
  Created_Date: timestamp("Created_Date", { mode: "date" }),
  Created_Mac_Address: varchar("Created_Mac_Address", { length: 50 }),
  Modified_By: varchar("Modified_By", { length: 50 }),
  Modified_Date: timestamp("Modified_Date", { mode: "date" }),
  Modified_Mac_Address: varchar("Modified_Mac_Address", { length: 50 }),
});

export const TBL_CUSTOMER_ADDRESS_DETAILS = StoMasterSchema.table("tbl_Customer_Address_Details", {
  Sno: serial("Sno").primaryKey(),
  Customer_Id: integer("Customer_Id").references(() => TBL_CUSTOMER_MASTER.Customer_Id),
  ADDRESS_TYPE: varchar("ADDRESS_TYPE", { length: 50 }),
  Address: varchar("Address", { length: 5000 }),
  LOCATION_AREA: varchar("LOCATION_AREA", { length: 200 }),
  Remarks: varchar("Remarks", { length: 2000 }),
  Status_Master: varchar("Status_Master", { length: 20 }),
  Created_By: varchar("Created_By", { length: 50 }),
  Created_Date: timestamp("Created_Date", { mode: "date" }),
  Created_Mac_Address: varchar("Created_Mac_Address", { length: 50 }),
  Modified_By: varchar("Modified_By", { length: 50 }),
  Modified_Date: timestamp("Modified_Date", { mode: "date" }),
  Modified_Mac_Address: varchar("Modified_Mac_Address", { length: 50 }),
});

export const TBL_CUSTOMER_MASTER_FILES_UPLOAD = StoMasterSchema.table("TBL_CUSTOMER_MASTER_FILES_UPLOAD", {
  SNO: integer("SNO").primaryKey().generatedAlwaysAsIdentity(),
  Customer_Id: integer("Customer_Id").references(() => TBL_CUSTOMER_MASTER.Customer_Id),
  DOCUMENT_TYPE: varchar("DOCUMENT_TYPE", { length: 50 }),
  DESCRIPTIONS: varchar("DESCRIPTIONS", { length: 100 }),
  FILE_NAME: varchar("FILE_NAME", { length: 150 }),
  CONTENT_TYPE: varchar("CONTENT_TYPE", { length: 50 }),
  CONTENT_DATA: bytea("CONTENT_DATA"),
  STATUS_MASTER: varchar("STATUS_MASTER", { length: 20 }),
  CREATED_BY: varchar("CREATED_BY", { length: 50 }),
  CREATED_DATE: timestamp("CREATED_DATE", { mode: "date" }),
  CREATED_MAC_ADDRESS: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
  MODIFIED_BY: varchar("MODIFIED_BY", { length: 50 }),
  MODIFIED_DATE: timestamp("MODIFIED_DATE", { mode: "date" }),
  MODIFIED_MAC_ADDRESS: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
});

export const TBL_CUSTOMER_COMPANY_WISE_BILLING_LOCATION_MAPPING = StoMasterSchema.table("TBL_CUSTOMER_COMPANY_WISE_BILLING_LOCATION_MAPPING", {
  SNO: serial("SNO").primaryKey(),
  Customer_Id: integer("Customer_Id").references(() => TBL_CUSTOMER_MASTER.Customer_Id),
  Company_id: integer("Company_id").references(() => TBL_COMPANY_MASTER.Company_Id),
  Billing_Location_Id: integer("Billing_Location_Id").references(() => TBL_BILLING_LOCATION_MASTER.Billing_Location_Id),
  EFFECTIVE_FROM: timestamp("EFFECTIVE_FROM", { mode: "date" }),
  EFFECTIVE_TO: timestamp("EFFECTIVE_TO", { mode: "date" }),
  REMARKS: varchar("REMARKS", { length: 500 }),
  STATUS_MASTER: varchar("STATUS_MASTER", { length: 50 }),
  CREATED_BY: varchar("CREATED_BY", { length: 50 }),
  CREATED_DATE: timestamp("CREATED_DATE", { mode: "date" }),
  CREATED_MAC_ADDRESS: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
  MODIFIED_BY: varchar("MODIFIED_BY", { length: 50 }),
  MODIFIED_DATE: timestamp("MODIFIED_DATE", { mode: "date" }),
  MODIFIED_MAC_ADDRESS: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
});

export const TBL_CUSTOMER_PRODUCT_VAT_PERCENTAGE_SETTINGS = StoMasterSchema.table("TBL_CUSTOMER_PRODUCT_VAT_PERCENTAGE_SETTINGS", {
  SNO: serial("SNO").primaryKey(),
  Company_id: integer("Company_id").references(() => TBL_COMPANY_MASTER.Company_Id),
  Customer_Id: integer("Customer_Id").references(() => TBL_CUSTOMER_MASTER.Customer_Id),
  Main_Category_Id: integer("Main_Category_Id").references(() => TBL_PRODUCT_MAIN_CATEGORY_MASTER.MAIN_CATEGORY_ID),
  Sub_Category_Id: integer("Sub_Category_Id").references(() => TBL_PRODUCT_SUB_CATEGORY_MASTER.SUB_CATEGORY_ID),
  Product_Id: integer("Product_Id").references(() => TBL_PRODUCT_MASTER.PRODUCT_ID),
  VAT_PERCENTAGE: numeric("VAT_PERCENTAGE", { precision: 30, scale: 2 }),
  EFFECTIVE_FROM: timestamp("EFFECTIVE_FROM", { mode: "date" }),
  EFFECTIVE_TO: timestamp("EFFECTIVE_TO", { mode: "date" }),
  REQUEST_STATUS: varchar("REQUEST_STATUS", { length: 50 }),
  REMARKS: varchar("REMARKS", { length: 100 }),
  CREATED_BY: varchar("CREATED_BY", { length: 50 }),
  CREATED_DATE: timestamp("CREATED_DATE", { mode: "date" }),
  CREATED_MAC_ADDRESS: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
  MODIFIED_BY: varchar("MODIFIED_BY", { length: 50 }),
  MODIFIED_DATE: timestamp("MODIFIED_DATE", { mode: "date" }),
  MODIFIED_MAC_ADDRESS: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
});

export const TBL_CUSTOMER_WISE_PRODUCT_PRICE_SETTINGS = StoMasterSchema.table("tbl_Customer_Wise_Product_Price_Settings", {
  Sno: serial("Sno").primaryKey(),
  Company_id: integer("Company_id").references(() => TBL_COMPANY_MASTER.Company_Id),
  Customer_Id: integer("Customer_Id").references(() => TBL_CUSTOMER_MASTER.Customer_Id),
  Main_Category_Id: integer("Main_Category_Id").references(() => TBL_PRODUCT_MAIN_CATEGORY_MASTER.MAIN_CATEGORY_ID),
  Sub_Category_Id: integer("Sub_Category_Id").references(() => TBL_PRODUCT_SUB_CATEGORY_MASTER.SUB_CATEGORY_ID),
  Product_Id: integer("Product_Id").references(() => TBL_PRODUCT_MASTER.PRODUCT_ID),
  UNIT_PRICE: numeric("UNIT_PRICE", { precision: 30, scale: 2 }),
  VAT_Percentage: numeric("VAT_Percentage", { precision: 30, scale: 2 }),
  Valid_Type: varchar("Valid_Type", { length: 50 }),
  currency_id: integer("currency_id").references(() => TBL_CURRENCY_MASTER.CURRENCY_ID),
  Effective_From: timestamp("Effective_From", { mode: "date" }),
  Effective_To: timestamp("Effective_To", { mode: "date" }),
  Requested_By: varchar("Requested_By", { length: 50 }),
  Requested_Date: timestamp("Requested_Date", { mode: "date" }),
  Requested_Product_Amount: numeric("Requested_Product_Amount", { precision: 30, scale: 4 }),
  Approved_Product_Amount: numeric("Approved_Product_Amount", { precision: 30, scale: 4 }),
  Respond_By: varchar("Respond_By", { length: 50 }),
  Response_Status: varchar("Response_Status", { length: 50 }),
  REspond_Date: timestamp("REspond_Date", { mode: "date" }),
  Respond_Mac_Address: varchar("Respond_Mac_Address", { length: 50 }),
  Response_Remarks: varchar("Response_Remarks", { length: 1000 }),
  Accounts_Response_Person: varchar("Accounts_Response_Person", { length: 50 }),
  Accounts_Response_Date: timestamp("Accounts_Response_Date", { mode: "date" }),
  Accounts_Response_Status: varchar("Accounts_Response_Status", { length: 50 }),
  Accounts_Response_Remarks: varchar("Accounts_Response_Remarks", { length: 500 }),
  Remarks: varchar("Remarks", { length: 2000 }),
  Status_Master: varchar("Status_Master", { length: 20 }),
  Created_By: varchar("Created_By", { length: 50 }),
  Created_Date: timestamp("Created_Date", { mode: "date" }),
  Created_Mac_Address: varchar("Created_Mac_Address", { length: 50 }),
  Modified_By: varchar("Modified_By", { length: 50 }),
  Modified_Date: timestamp("Modified_Date", { mode: "date" }),
  Modified_Mac_Address: varchar("Modified_Mac_Address", { length: 50 }),
});

export const TBL_CUSTOMER_CREDIT_LIMIT_DETAILS = StoMasterSchema.table("tbl_Customer_Credit_Limit_Details", {
  Sno: serial("Sno").primaryKey(),
  Company_id: integer("Company_id").references(() => TBL_COMPANY_MASTER.Company_Id),
  Customer_Id: integer("Customer_Id").references(() => TBL_CUSTOMER_MASTER.Customer_Id),
  Currency_id: integer("Currency_id").references(() => TBL_CURRENCY_MASTER.CURRENCY_ID),
  Valid_Type: varchar("Valid_Type", { length: 50 }),
  Requested_Credit_Limit_Days: integer("Requested_Credit_Limit_Days"),
  Requested_Credit_Limit_Amount: numeric("Requested_Credit_Limit_Amount", { precision: 30, scale: 2 }),
  Requested_Payment_Mode_Id: integer("Requested_Payment_Mode_Id").references(() => TBL_CUSTOMER_PAYMENT_MODE_MASTER.PAYMENT_MODE_ID),
  Requested_By: varchar("Requested_By", { length: 50 }),
  Requested_Date: timestamp("Requested_Date", { mode: "date" }),
  Total_Outstanding_Amount: numeric("Total_Outstanding_Amount", { precision: 30, scale: 2 }),
  Over_Due_Outstanding_Amount: numeric("Over_Due_Outstanding_Amount", { precision: 30, scale: 2 }),
  Approved_Credit_Limit_Days: integer("Approved_Credit_Limit_Days"),
  Approved_Credit_Limit_Amount: numeric("Approved_Credit_Limit_Amount", { precision: 30, scale: 2 }),
  Approved_PAYMENT_MODE_ID: integer("Approved_PAYMENT_MODE_ID").references(() => TBL_CUSTOMER_PAYMENT_MODE_MASTER.PAYMENT_MODE_ID),
  Effective_From: timestamp("Effective_From", { mode: "date" }),
  Effective_To: timestamp("Effective_To", { mode: "date" }),
  Finance_Head_1_Response_By: varchar("Finance_Head_1_Response_By", { length: 50 }),
  Finance_Head_1_Response_Date: timestamp("Finance_Head_1_Response_Date", { mode: "date" }),
  Finance_Head_1_Response_Status: varchar("Finance_Head_1_Response_Status", { length: 50 }),
  Finance_Head_1_Response_IP_Address: varchar("Finance_Head_1_Response_IP_Address", { length: 50 }),
  Finance_Head_1_Response_Remarks: varchar("Finance_Head_1_Response_Remarks", { length: 500 }),
  Respond_by: varchar("Respond_by", { length: 50 }),
  Respond_Status: varchar("Respond_Status", { length: 50 }),
  Respond_Date: timestamp("Respond_Date", { mode: "date" }),
  Respond_Mac_address: varchar("Respond_Mac_address", { length: 50 }),
  Response_Remarks: varchar("Response_Remarks", { length: 1000 }),
  Remarks: varchar("Remarks", { length: 2000 }),
  Status_Master: varchar("Status_Master", { length: 20 }),
  Created_By: varchar("Created_By", { length: 50 }),
  Created_Date: timestamp("Created_Date", { mode: "date" }),
  Created_Mac_Address: varchar("Created_Mac_Address", { length: 50 }),
  Modified_By: varchar("Modified_By", { length: 50 }),
  Modified_Date: timestamp("Modified_Date", { mode: "date" }),
  Modified_Mac_Address: varchar("Modified_Mac_Address", { length: 50 }),
});

export const CUSTOMER_CREDIT_LIMIT_FILE_UPLOAD = StoMasterSchema.table("CUSTOMER_CREDIT_LIMIT_FILE_UPLOAD", {
  SNO: integer("SNO").primaryKey().generatedAlwaysAsIdentity(),
  CREDIT_LIMIT_ID: integer("CREDIT_LIMIT_ID").references(() => TBL_CUSTOMER_CREDIT_LIMIT_DETAILS.Sno),
  DESCRIPTION_DETAILS: varchar("DESCRIPTION_DETAILS", { length: 100 }),
  FILE_NAME: varchar("FILE_NAME", { length: 150 }),
  CONTENT_TYPE: varchar("CONTENT_TYPE", { length: 50 }),
  CONTENT_DATA: bytea("CONTENT_DATA"),
  STATUS_MASTER: varchar("STATUS_MASTER", { length: 20 }),
  CREATED_BY: varchar("CREATED_BY", { length: 50 }),
  CREATED_DATE: timestamp("CREATED_DATE", { mode: "date" }),
  CREATED_MAC_ADDRESS: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
  MODIFIED_BY: varchar("MODIFIED_BY", { length: 50 }),
  MODIFIED_DATE: timestamp("MODIFIED_DATE", { mode: "date" }),
  MODIFIED_MAC_ADDRESS: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
  DOCUMENT_TYPE: varchar("DOCUMENT_TYPE", { length: 60 }),
});

export const TBL_ACCOUNTS_LEDGER_MASTER = StoMasterSchema.table("TBL_ACCOUNTS_LEDGER_MASTER", {
  LEDGER_ID: serial("LEDGER_ID").primaryKey(),
  Company_id: integer("Company_id").references(() => TBL_COMPANY_MASTER.Company_Id),
  LEDGER_TYPE: varchar("LEDGER_TYPE", { length: 50 }),
  LEDGER_GROUP_ID: integer("LEDGER_GROUP_ID"),
  LEDGER_NAME: varchar("LEDGER_NAME", { length: 100 }),
  LEDGER_DESC: varchar("LEDGER_DESC", { length: 100 }),
  REMARKS: varchar("REMARKS", { length: 100 }),
  STATUS_MASTER: varchar("STATUS_MASTER", { length: 20 }),
  CREATED_BY: varchar("CREATED_BY", { length: 50 }),
  CREATED_DATE: timestamp("CREATED_DATE", { mode: "date" }),
  CREATED_MAC_ADDRESS: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
  MODIFIED_BY: varchar("MODIFIED_BY", { length: 50 }),
  MODIFIED_DATE: timestamp("MODIFIED_DATE", { mode: "date" }),
  MODIFIED_MAC_ADDRESS: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
});

export const TBL_SALES_PERSON_MASTER = StoMasterSchema.table("TBL_SALES_PERSON_MASTER", {
  Sales_Person_ID: serial("Sales_Person_ID").primaryKey(),
  Emp_Id: integer("Emp_Id"),
  PERSON_NAME: varchar("PERSON_NAME", { length: 50 }),
  Designation_Name: varchar("Designation_Name", { length: 50 }),
  Sales_Contact_Person_Phone: varchar("Sales_Contact_Person_Phone", { length: 60 }),
  Sales_Person_Email_Addres: varchar("Sales_Person_Email_Addres", { length: 60 }),
  Reporting_Manager_Card_No: integer("Reporting_Manager_Card_No"),
  Reporting_Manager_Name: varchar("Reporting_Manager_Name", { length: 100 }),
  Reporting_Manager_Email_Address: varchar("Reporting_Manager_Email_Address", { length: 100 }),
  Sales_Person_Designation: varchar("Sales_Person_Designation", { length: 100 }),
  REMARKS: varchar("REMARKS", { length: 50 }),
  STATUS_MASTER: varchar("STATUS_MASTER", { length: 50 }),
  CREATED_BY: varchar("CREATED_BY", { length: 50 }),
  CREATED_DATE: timestamp("CREATED_DATE", { mode: "date" }),
  CREATED_MAC_ADDRESS: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
  MODIFIED_BY: varchar("MODIFIED_BY", { length: 50 }),
  MODIFIED_DATE: timestamp("MODIFIED_DATE", { mode: "date" }),
  MODIFIED_MAC_ADDRESS: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
});

export const TBL_SCHEDULER_SETTINGS = StoMasterSchema.table("TBL_SCHEDULER_SETTINGS", {
  SNO: serial("SNO").primaryKey(),
  JOB_NAME: varchar("JOB_NAME", { length: 100 }).unique(),
  CRON_EXPRESSION: varchar("CRON_EXPRESSION", { length: 50 }),
  IS_ENABLED: varchar("IS_ENABLED", { length: 20 }).default("True"),
  LAST_RUN: timestamp("LAST_RUN", { mode: "date" }),
  REMARKS: varchar("REMARKS", { length: 1000 }),
  MODIFIED_BY: varchar("MODIFIED_BY", { length: 50 }),
  MODIFIED_DATE: timestamp("MODIFIED_DATE", { mode: "date" }),
});



export const TBL_COMPANY_MASTERRelations = relations(TBL_COMPANY_MASTER, ({ one }) => ({
  currency_master: one(TBL_CURRENCY_MASTER, { fields: [TBL_COMPANY_MASTER.Currency_ID], references: [TBL_CURRENCY_MASTER.CURRENCY_ID] }),
}));


export const TBL_EXCHANGE_RATE_MASTERRelations = relations(TBL_EXCHANGE_RATE_MASTER, ({ one }) => ({
  company_master: one(TBL_COMPANY_MASTER, { fields: [TBL_EXCHANGE_RATE_MASTER.Company_ID], references: [TBL_COMPANY_MASTER.Company_Id] }),
  currency_master: one(TBL_CURRENCY_MASTER, { fields: [TBL_EXCHANGE_RATE_MASTER.CURRENCY_ID], references: [TBL_CURRENCY_MASTER.CURRENCY_ID] }),
}));


export const TBL_VAT_PERCENTAGE_SETTINGRelations = relations(TBL_VAT_PERCENTAGE_SETTING, ({ one }) => ({
  company_master: one(TBL_COMPANY_MASTER, { fields: [TBL_VAT_PERCENTAGE_SETTING.COMPANY_ID], references: [TBL_COMPANY_MASTER.Company_Id] }),
}));


export const TBL_STORE_MASTERRelations = relations(TBL_STORE_MASTER, ({ one }) => ({
  location_master: one(TBL_LOCATION_MASTER, { fields: [TBL_STORE_MASTER.Location_Id], references: [TBL_LOCATION_MASTER.Location_Id] }),
}));


export const TBL_USER_TO_STORE_MAPPINGRelations = relations(TBL_USER_TO_STORE_MAPPING, ({ one }) => ({
  user_info_hdr: one(TBL_USER_INFO_HDR, { fields: [TBL_USER_TO_STORE_MAPPING.USER_ID_USER_TO_ROLE], references: [TBL_USER_INFO_HDR.LOGIN_ID_USER_HDR] }),
  company_master: one(TBL_COMPANY_MASTER, { fields: [TBL_USER_TO_STORE_MAPPING.COMPANY_ID], references: [TBL_COMPANY_MASTER.Company_Id] }),
  store_master: one(TBL_STORE_MASTER, { fields: [TBL_USER_TO_STORE_MAPPING.STORE_ID_USER_TO_ROLE], references: [TBL_STORE_MASTER.Store_Id] }),
  role_master: one(TBL_ROLE_MASTER, { fields: [TBL_USER_TO_STORE_MAPPING.ROLE_ID_USER_TO_ROLE], references: [TBL_ROLE_MASTER.ROLE_ID] }),
}));


export const TBL_PRODUCT_SUB_CATEGORY_MASTERRelations = relations(TBL_PRODUCT_SUB_CATEGORY_MASTER, ({ one }) => ({
  product_main_category_master: one(TBL_PRODUCT_MAIN_CATEGORY_MASTER, { fields: [TBL_PRODUCT_SUB_CATEGORY_MASTER.MAIN_CATEGORY_ID], references: [TBL_PRODUCT_MAIN_CATEGORY_MASTER.MAIN_CATEGORY_ID] }),
}));


export const TBL_PRODUCT_MASTERRelations = relations(TBL_PRODUCT_MASTER, ({ one }) => ({
  product_main_category_master: one(TBL_PRODUCT_MAIN_CATEGORY_MASTER, { fields: [TBL_PRODUCT_MASTER.MAIN_CATEGORY_ID], references: [TBL_PRODUCT_MAIN_CATEGORY_MASTER.MAIN_CATEGORY_ID] }),
  product_sub_category_master: one(TBL_PRODUCT_SUB_CATEGORY_MASTER, { fields: [TBL_PRODUCT_MASTER.SUB_CATEGORY_ID], references: [TBL_PRODUCT_SUB_CATEGORY_MASTER.SUB_CATEGORY_ID] }),
}));


export const TBL_REGION_MASTERRelations = relations(TBL_REGION_MASTER, ({ one }) => ({
  country_master: one(TBL_COUNTRY_MASTER, { fields: [TBL_REGION_MASTER.COUNTRY_ID], references: [TBL_COUNTRY_MASTER.Country_Id] }),
}));


export const TBL_PRODUCT_OPENING_STOCKRelations = relations(TBL_PRODUCT_OPENING_STOCK, ({ one }) => ({
  company_master: one(TBL_COMPANY_MASTER, { fields: [TBL_PRODUCT_OPENING_STOCK.COMPANY_ID], references: [TBL_COMPANY_MASTER.Company_Id] }),
  store_master: one(TBL_STORE_MASTER, { fields: [TBL_PRODUCT_OPENING_STOCK.STORE_ID], references: [TBL_STORE_MASTER.Store_Id] }),
  product_main_category_master: one(TBL_PRODUCT_MAIN_CATEGORY_MASTER, { fields: [TBL_PRODUCT_OPENING_STOCK.MAIN_CATEGORY_ID], references: [TBL_PRODUCT_MAIN_CATEGORY_MASTER.MAIN_CATEGORY_ID] }),
  product_sub_category_master: one(TBL_PRODUCT_SUB_CATEGORY_MASTER, { fields: [TBL_PRODUCT_OPENING_STOCK.SUB_CATEGORY_ID], references: [TBL_PRODUCT_SUB_CATEGORY_MASTER.SUB_CATEGORY_ID] }),
  product_master: one(TBL_PRODUCT_MASTER, { fields: [TBL_PRODUCT_OPENING_STOCK.PRODUCT_ID], references: [TBL_PRODUCT_MASTER.PRODUCT_ID] }),
}));


export const TBL_FIELD_DTLRelations = relations(TBL_FIELD_DTL, ({ one }) => ({
  field_hdr: one(TBL_FIELD_HDR, { fields: [TBL_FIELD_DTL.field_id_fld_dtl], references: [TBL_FIELD_HDR.field_id_fld_hdr] }),
}));


export const TBL_PRODUCT_COMPANY_MAIN_CATEGORY_MAPPINGRelations = relations(TBL_PRODUCT_COMPANY_MAIN_CATEGORY_MAPPING, ({ one }) => ({
  company_master: one(TBL_COMPANY_MASTER, { fields: [TBL_PRODUCT_COMPANY_MAIN_CATEGORY_MAPPING.Company_Id], references: [TBL_COMPANY_MASTER.Company_Id] }),
  product_main_category_master: one(TBL_PRODUCT_MAIN_CATEGORY_MASTER, { fields: [TBL_PRODUCT_COMPANY_MAIN_CATEGORY_MAPPING.Main_Category_Id], references: [TBL_PRODUCT_MAIN_CATEGORY_MASTER.MAIN_CATEGORY_ID] }),
}));


export const TBL_STORE_PRODUCT_MINIMUM_STOCKRelations = relations(TBL_STORE_PRODUCT_MINIMUM_STOCK, ({ one }) => ({
  company_master: one(TBL_COMPANY_MASTER, { fields: [TBL_STORE_PRODUCT_MINIMUM_STOCK.Company_id], references: [TBL_COMPANY_MASTER.Company_Id] }),
  store_master: one(TBL_STORE_MASTER, { fields: [TBL_STORE_PRODUCT_MINIMUM_STOCK.Store_Id], references: [TBL_STORE_MASTER.Store_Id] }),
  product_main_category_master: one(TBL_PRODUCT_MAIN_CATEGORY_MASTER, { fields: [TBL_STORE_PRODUCT_MINIMUM_STOCK.Main_Category_Id], references: [TBL_PRODUCT_MAIN_CATEGORY_MASTER.MAIN_CATEGORY_ID] }),
  product_sub_category_master: one(TBL_PRODUCT_SUB_CATEGORY_MASTER, { fields: [TBL_STORE_PRODUCT_MINIMUM_STOCK.Sub_Category_Id], references: [TBL_PRODUCT_SUB_CATEGORY_MASTER.SUB_CATEGORY_ID] }),
  product_master: one(TBL_PRODUCT_MASTER, { fields: [TBL_STORE_PRODUCT_MINIMUM_STOCK.Product_Id], references: [TBL_PRODUCT_MASTER.PRODUCT_ID] }),
}));


export const TBL_SUPPLIER_MASTERRelations = relations(TBL_SUPPLIER_MASTER, ({ one }) => ({
  country_master: one(TBL_COUNTRY_MASTER, { fields: [TBL_SUPPLIER_MASTER.Country_Id], references: [TBL_COUNTRY_MASTER.Country_Id] }),
}));


export const TBL_COMPANY_BANK_ACCOUNT_MASTERRelations = relations(TBL_COMPANY_BANK_ACCOUNT_MASTER, ({ one }) => ({
  company_master: one(TBL_COMPANY_MASTER, { fields: [TBL_COMPANY_BANK_ACCOUNT_MASTER.Company_id], references: [TBL_COMPANY_MASTER.Company_Id] }),
  bank_master: one(TBL_BANK_MASTER, { fields: [TBL_COMPANY_BANK_ACCOUNT_MASTER.Bank_Id], references: [TBL_BANK_MASTER.BANK_ID] }),
  currency_master: one(TBL_CURRENCY_MASTER, { fields: [TBL_COMPANY_BANK_ACCOUNT_MASTER.Currency_Id], references: [TBL_CURRENCY_MASTER.CURRENCY_ID] }),
}));


export const TBL_CHANGE_PASSWORD_LOGRelations = relations(TBL_CHANGE_PASSWORD_LOG, ({ one }) => ({
  user_info_hdr: one(TBL_USER_INFO_HDR, { fields: [TBL_CHANGE_PASSWORD_LOG.login_id], references: [TBL_USER_INFO_HDR.LOGIN_ID_USER_HDR] }),
}));


export const TBL_DISTRICT_MASTERRelations = relations(TBL_DISTRICT_MASTER, ({ one }) => ({
  country_master: one(TBL_COUNTRY_MASTER, { fields: [TBL_DISTRICT_MASTER.Country_Id], references: [TBL_COUNTRY_MASTER.Country_Id] }),
  region_master: one(TBL_REGION_MASTER, { fields: [TBL_DISTRICT_MASTER.Region_Id], references: [TBL_REGION_MASTER.REGION_ID] }),
}));


export const TBL_CUSTOMER_MASTERRelations = relations(TBL_CUSTOMER_MASTER, ({ one }) => ({
  billing_location_master: one(TBL_BILLING_LOCATION_MASTER, { fields: [TBL_CUSTOMER_MASTER.Billing_Location_Id], references: [TBL_BILLING_LOCATION_MASTER.Billing_Location_Id] }),
  country_master: one(TBL_COUNTRY_MASTER, { fields: [TBL_CUSTOMER_MASTER.Country_Id], references: [TBL_COUNTRY_MASTER.Country_Id] }),
  region_master: one(TBL_REGION_MASTER, { fields: [TBL_CUSTOMER_MASTER.Region_Id], references: [TBL_REGION_MASTER.REGION_ID] }),
  district_master: one(TBL_DISTRICT_MASTER, { fields: [TBL_CUSTOMER_MASTER.District_Id], references: [TBL_DISTRICT_MASTER.District_id] }),
  currency_master: one(TBL_CURRENCY_MASTER, { fields: [TBL_CUSTOMER_MASTER.currency_id], references: [TBL_CURRENCY_MASTER.CURRENCY_ID] }),
}));


export const TBL_CUSTOMER_ADDRESS_DETAILSRelations = relations(TBL_CUSTOMER_ADDRESS_DETAILS, ({ one }) => ({
  customer_master: one(TBL_CUSTOMER_MASTER, { fields: [TBL_CUSTOMER_ADDRESS_DETAILS.Customer_Id], references: [TBL_CUSTOMER_MASTER.Customer_Id] }),
}));


export const TBL_CUSTOMER_MASTER_FILES_UPLOADRelations = relations(TBL_CUSTOMER_MASTER_FILES_UPLOAD, ({ one }) => ({
  customer_master: one(TBL_CUSTOMER_MASTER, { fields: [TBL_CUSTOMER_MASTER_FILES_UPLOAD.Customer_Id], references: [TBL_CUSTOMER_MASTER.Customer_Id] }),
}));


export const TBL_CUSTOMER_COMPANY_WISE_BILLING_LOCATION_MAPPINGRelations = relations(TBL_CUSTOMER_COMPANY_WISE_BILLING_LOCATION_MAPPING, ({ one }) => ({
  customer_master: one(TBL_CUSTOMER_MASTER, { fields: [TBL_CUSTOMER_COMPANY_WISE_BILLING_LOCATION_MAPPING.Customer_Id], references: [TBL_CUSTOMER_MASTER.Customer_Id] }),
  company_master: one(TBL_COMPANY_MASTER, { fields: [TBL_CUSTOMER_COMPANY_WISE_BILLING_LOCATION_MAPPING.Company_id], references: [TBL_COMPANY_MASTER.Company_Id] }),
  billing_location_master: one(TBL_BILLING_LOCATION_MASTER, { fields: [TBL_CUSTOMER_COMPANY_WISE_BILLING_LOCATION_MAPPING.Billing_Location_Id], references: [TBL_BILLING_LOCATION_MASTER.Billing_Location_Id] }),
}));


export const TBL_CUSTOMER_PRODUCT_VAT_PERCENTAGE_SETTINGSRelations = relations(TBL_CUSTOMER_PRODUCT_VAT_PERCENTAGE_SETTINGS, ({ one }) => ({
  company_master: one(TBL_COMPANY_MASTER, { fields: [TBL_CUSTOMER_PRODUCT_VAT_PERCENTAGE_SETTINGS.Company_id], references: [TBL_COMPANY_MASTER.Company_Id] }),
  customer_master: one(TBL_CUSTOMER_MASTER, { fields: [TBL_CUSTOMER_PRODUCT_VAT_PERCENTAGE_SETTINGS.Customer_Id], references: [TBL_CUSTOMER_MASTER.Customer_Id] }),
  product_main_category_master: one(TBL_PRODUCT_MAIN_CATEGORY_MASTER, { fields: [TBL_CUSTOMER_PRODUCT_VAT_PERCENTAGE_SETTINGS.Main_Category_Id], references: [TBL_PRODUCT_MAIN_CATEGORY_MASTER.MAIN_CATEGORY_ID] }),
  product_sub_category_master: one(TBL_PRODUCT_SUB_CATEGORY_MASTER, { fields: [TBL_CUSTOMER_PRODUCT_VAT_PERCENTAGE_SETTINGS.Sub_Category_Id], references: [TBL_PRODUCT_SUB_CATEGORY_MASTER.SUB_CATEGORY_ID] }),
  product_master: one(TBL_PRODUCT_MASTER, { fields: [TBL_CUSTOMER_PRODUCT_VAT_PERCENTAGE_SETTINGS.Product_Id], references: [TBL_PRODUCT_MASTER.PRODUCT_ID] }),
}));


export const TBL_CUSTOMER_WISE_PRODUCT_PRICE_SETTINGSRelations = relations(TBL_CUSTOMER_WISE_PRODUCT_PRICE_SETTINGS, ({ one }) => ({
  company_master: one(TBL_COMPANY_MASTER, { fields: [TBL_CUSTOMER_WISE_PRODUCT_PRICE_SETTINGS.Company_id], references: [TBL_COMPANY_MASTER.Company_Id] }),
  customer_master: one(TBL_CUSTOMER_MASTER, { fields: [TBL_CUSTOMER_WISE_PRODUCT_PRICE_SETTINGS.Customer_Id], references: [TBL_CUSTOMER_MASTER.Customer_Id] }),
  product_main_category_master: one(TBL_PRODUCT_MAIN_CATEGORY_MASTER, { fields: [TBL_CUSTOMER_WISE_PRODUCT_PRICE_SETTINGS.Main_Category_Id], references: [TBL_PRODUCT_MAIN_CATEGORY_MASTER.MAIN_CATEGORY_ID] }),
  product_sub_category_master: one(TBL_PRODUCT_SUB_CATEGORY_MASTER, { fields: [TBL_CUSTOMER_WISE_PRODUCT_PRICE_SETTINGS.Sub_Category_Id], references: [TBL_PRODUCT_SUB_CATEGORY_MASTER.SUB_CATEGORY_ID] }),
  product_master: one(TBL_PRODUCT_MASTER, { fields: [TBL_CUSTOMER_WISE_PRODUCT_PRICE_SETTINGS.Product_Id], references: [TBL_PRODUCT_MASTER.PRODUCT_ID] }),
  currency_master: one(TBL_CURRENCY_MASTER, { fields: [TBL_CUSTOMER_WISE_PRODUCT_PRICE_SETTINGS.currency_id], references: [TBL_CURRENCY_MASTER.CURRENCY_ID] }),
}));


export const TBL_CUSTOMER_CREDIT_LIMIT_DETAILSRelations = relations(TBL_CUSTOMER_CREDIT_LIMIT_DETAILS, ({ one }) => ({
  company_master: one(TBL_COMPANY_MASTER, { fields: [TBL_CUSTOMER_CREDIT_LIMIT_DETAILS.Company_id], references: [TBL_COMPANY_MASTER.Company_Id] }),
  customer_master: one(TBL_CUSTOMER_MASTER, { fields: [TBL_CUSTOMER_CREDIT_LIMIT_DETAILS.Customer_Id], references: [TBL_CUSTOMER_MASTER.Customer_Id] }),
  currency_master: one(TBL_CURRENCY_MASTER, { fields: [TBL_CUSTOMER_CREDIT_LIMIT_DETAILS.Currency_id], references: [TBL_CURRENCY_MASTER.CURRENCY_ID] }),
  customer_payment_mode_master: one(TBL_CUSTOMER_PAYMENT_MODE_MASTER, { fields: [TBL_CUSTOMER_CREDIT_LIMIT_DETAILS.Requested_Payment_Mode_Id], references: [TBL_CUSTOMER_PAYMENT_MODE_MASTER.PAYMENT_MODE_ID] }),
  customer_payment_mode_master_approved_payment_mode_id: one(TBL_CUSTOMER_PAYMENT_MODE_MASTER, { fields: [TBL_CUSTOMER_CREDIT_LIMIT_DETAILS.Approved_PAYMENT_MODE_ID], references: [TBL_CUSTOMER_PAYMENT_MODE_MASTER.PAYMENT_MODE_ID] }),
}));


export const CUSTOMER_CREDIT_LIMIT_FILE_UPLOADRelations = relations(CUSTOMER_CREDIT_LIMIT_FILE_UPLOAD, ({ one }) => ({
  customer_credit_limit_details: one(TBL_CUSTOMER_CREDIT_LIMIT_DETAILS, { fields: [CUSTOMER_CREDIT_LIMIT_FILE_UPLOAD.CREDIT_LIMIT_ID], references: [TBL_CUSTOMER_CREDIT_LIMIT_DETAILS.Sno] }),
}));


export const TBL_ACCOUNTS_LEDGER_MASTERRelations = relations(TBL_ACCOUNTS_LEDGER_MASTER, ({ one }) => ({
  company_master: one(TBL_COMPANY_MASTER, { fields: [TBL_ACCOUNTS_LEDGER_MASTER.Company_id], references: [TBL_COMPANY_MASTER.Company_Id] }),
}));

