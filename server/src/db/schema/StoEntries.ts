import { relations } from "drizzle-orm";
import { pgSchema, integer, serial, bigint, bigserial, varchar, text, numeric, timestamp, customType } from "drizzle-orm/pg-core";
import * as StoMasterSchema from "./StoMaster.js";

import { bytea } from "./StoMaster.js";

export const StoEntriesSchema = pgSchema("stoentries");

export const TBL_PURCHASE_ORDER_HDR = StoEntriesSchema.table("TBL_PURCHASE_ORDER_HDR", {
  SNO: serial("SNO"),
  PO_REF_NO: varchar("PO_REF_NO", { length: 50 }).primaryKey(),
  PO_DATE: timestamp("PO_DATE", { mode: "date" }),
  PURCHASE_TYPE: varchar("PURCHASE_TYPE", { length: 20 }),
  COMPANY_ID: integer("COMPANY_ID").references(() => StoMasterSchema.TBL_COMPANY_MASTER.Company_Id),
  SUPPLIER_ID: integer("SUPPLIER_ID").references(() => StoMasterSchema.TBL_SUPPLIER_MASTER.Supplier_Id),
  PO_STORE_ID: integer("PO_STORE_ID").references(() => StoMasterSchema.TBL_STORE_MASTER.Store_Id),
  PAYMENT_TERM_ID: integer("PAYMENT_TERM_ID").references(() => StoMasterSchema.TBL_PAYMENT_TERM_MASTER.PAYMENT_TERM_ID),
  MODE_OF_PAYMENT: varchar("MODE_OF_PAYMENT", { length: 25 }),
  CURRENCY_ID: integer("CURRENCY_ID").references(() => StoMasterSchema.TBL_CURRENCY_MASTER.CURRENCY_ID),
  SUPLIER_PROFORMA_NUMBER: varchar("SUPLIER_PROFORMA_NUMBER", { length: 100 }),
  SHIPMENT_MODE: varchar("SHIPMENT_MODE", { length: 100 }),
  PRICE_TERMS: varchar("PRICE_TERMS", { length: 150 }),
  ESTIMATED_SHIPMENT_DATE: timestamp("ESTIMATED_SHIPMENT_DATE", { mode: "date" }),
  SHIPMENT_REMARKS: varchar("SHIPMENT_REMARKS", { length: 2500 }),
  PRODUCT_HDR_AMOUNT: numeric("PRODUCT_HDR_AMOUNT", { precision: 15, scale: 4 }),
  TOTAL_ADDITIONAL_COST_AMOUNT: numeric("TOTAL_ADDITIONAL_COST_AMOUNT", { precision: 15, scale: 4 }),
  TOTAL_PRODUCT_HDR_AMOUNT: numeric("TOTAL_PRODUCT_HDR_AMOUNT", { precision: 15, scale: 4 }),
  TOTAL_VAT_HDR_AMOUNT: numeric("TOTAL_VAT_HDR_AMOUNT", { precision: 15, scale: 2 }),
  FINAL_PURCHASE_HDR_AMOUNT: numeric("FINAL_PURCHASE_HDR_AMOUNT", { precision: 15, scale: 2 }),
  EXCHANGE_RATE: numeric("EXCHANGE_RATE", { precision: 10, scale: 2 }),
  PRODUCT_HDR_AMOUNT_LC: numeric("PRODUCT_HDR_AMOUNT_LC", { precision: 15, scale: 4 }),
  TOTAL_ADDITIONAL_COST_AMOUNT_LC: numeric("TOTAL_ADDITIONAL_COST_AMOUNT_LC", { precision: 15, scale: 4 }),
  TOTAL_PRODUCT_HDR_AMOUNT_LC: numeric("TOTAL_PRODUCT_HDR_AMOUNT_LC", { precision: 15, scale: 4 }),
  TOTAL_VAT_HDR_AMOUNT_LC: numeric("TOTAL_VAT_HDR_AMOUNT_LC", { precision: 15, scale: 2 }),
  FINAL_PURCHASE_HDR_AMOUNT_LC: numeric("FINAL_PURCHASE_HDR_AMOUNT_LC", { precision: 15, scale: 2 }),
  SUBMITTED_BY: varchar("SUBMITTED_BY", { length: 50 }),
  SUBMITTED_DATE: timestamp("SUBMITTED_DATE", { mode: "date" }),
  SUBMITTED_IP_ADDRESS: varchar("SUBMITTED_IP_ADDRESS", { length: 50 }),
  PURCHASE_HEAD_RESPONSE_PERSON: varchar("PURCHASE_HEAD_RESPONSE_PERSON", { length: 50 }),
  PURCHASE_HEAD_RESPONSE_DATE: timestamp("PURCHASE_HEAD_RESPONSE_DATE", { mode: "date" }),
  PURCHASE_HEAD_RESPONSE_STATUS: varchar("PURCHASE_HEAD_RESPONSE_STATUS", { length: 50 }),
  PURCHASE_HEAD_RESPONSE_REMARKS: varchar("PURCHASE_HEAD_RESPONSE_REMARKS", { length: 500 }),
  PURCHASE_HEAD_RESPONSE_IP_ADDRESS: varchar("PURCHASE_HEAD_RESPONSE_IP_ADDRESS", { length: 50 }),
  RESPONSE_1_PERSON: varchar("RESPONSE_1_PERSON", { length: 50 }),
  RESPONSE_1_DATE: timestamp("RESPONSE_1_DATE", { mode: "date" }),
  RESPONSE_1_STATUS: varchar("RESPONSE_1_STATUS", { length: 50 }),
  RESPONSE_1_REMARKS: varchar("RESPONSE_1_REMARKS", { length: 5000 }),
  RESPONSE_1_IP_ADDRESS: varchar("RESPONSE_1_IP_ADDRESS", { length: 50 }),
  RESPONSE_2_PERSON: varchar("RESPONSE_2_PERSON", { length: 50 }),
  RESPONSE_2_DATE: timestamp("RESPONSE_2_DATE", { mode: "date" }),
  RESPONSE_2_STATUS: varchar("RESPONSE_2_STATUS", { length: 50 }),
  RESPONSE_2_REMARKS: varchar("RESPONSE_2_REMARKS", { length: 5000 }),
  RESPONSE_2_IP_ADDRESS: varchar("RESPONSE_2_IP_ADDRESS", { length: 50 }),
  FINAL_RESPONSE_PERSON: varchar("FINAL_RESPONSE_PERSON", { length: 50 }),
  FINAL_RESPONSE_DATE: timestamp("FINAL_RESPONSE_DATE", { mode: "date" }),
  FINAL_RESPONSE_STATUS: varchar("FINAL_RESPONSE_STATUS", { length: 50 }),
  FINAL_RESPONSE_REMARKS: varchar("FINAL_RESPONSE_REMARKS", { length: 5000 }),
  POD_DELIVERY_PERSON: varchar("POD_DELIVERY_PERSON", { length: 150 }),
  POD_DELIVERY_DATE: timestamp("POD_DELIVERY_DATE", { mode: "date" }),
  POD_REMARKS: varchar("POD_REMARKS", { length: 2000 }),
  REMARKS: varchar("REMARKS", { length: 2000 }),
  STATUS_ENTRY: varchar("STATUS_ENTRY", { length: 20 }),
  CREATED_BY: varchar("CREATED_BY", { length: 50 }),
  CREATED_DATE: timestamp("CREATED_DATE", { mode: "date" }),
  CREATED_IP_ADDRESS: varchar("CREATED_IP_ADDRESS", { length: 50 }),
  MODIFIED_BY: varchar("MODIFIED_BY", { length: 50 }),
  MODIFIED_DATE: timestamp("MODIFIED_DATE", { mode: "date" }),
  MODIFIED_IP_ADDRESS: varchar("MODIFIED_IP_ADDRESS", { length: 50 }),
});

export const TBL_PURCHASE_ORDER_DTL = StoEntriesSchema.table("TBL_PURCHASE_ORDER_DTL", {
  SNO: serial("SNO").primaryKey(),
  PO_REF_NO: varchar("PO_REF_NO", { length: 50 }).references(() => TBL_PURCHASE_ORDER_HDR.PO_REF_NO),
  REQUEST_STORE_ID: integer("REQUEST_STORE_ID").references(() => StoMasterSchema.TBL_STORE_MASTER.Store_Id),
  MAIN_CATEGORY_ID: integer("MAIN_CATEGORY_ID").references(() => StoMasterSchema.TBL_PRODUCT_MAIN_CATEGORY_MASTER.MAIN_CATEGORY_ID),
  SUB_CATEGORY_ID: integer("SUB_CATEGORY_ID").references(() => StoMasterSchema.TBL_PRODUCT_SUB_CATEGORY_MASTER.SUB_CATEGORY_ID),
  PRODUCT_ID: integer("PRODUCT_ID").references(() => StoMasterSchema.TBL_PRODUCT_MASTER.PRODUCT_ID),
  QTY_PER_PACKING: numeric("QTY_PER_PACKING", { precision: 15, scale: 2 }),
  TOTAL_QTY: numeric("TOTAL_QTY", { precision: 15, scale: 4 }),
  UOM: varchar("UOM", { length: 50 }),
  TOTAL_PACKING: numeric("TOTAL_PACKING", { precision: 15, scale: 4 }),
  ALTERNATE_UOM: varchar("ALTERNATE_UOM", { length: 500 }),
  RATE_PER_QTY: numeric("RATE_PER_QTY", { precision: 15, scale: 6 }),
  PRODUCT_AMOUNT: numeric("PRODUCT_AMOUNT", { precision: 15, scale: 4 }),
  DISCOUNT_PERCENTAGE: numeric("DISCOUNT_PERCENTAGE", { precision: 15, scale: 2 }),
  DISCOUNT_AMOUNT: numeric("DISCOUNT_AMOUNT", { precision: 15, scale: 4 }),
  TOTAL_PRODUCT_AMOUNT: numeric("TOTAL_PRODUCT_AMOUNT", { precision: 15, scale: 4 }),
  VAT_PERCENTAGE: numeric("VAT_PERCENTAGE", { precision: 15, scale: 2 }),
  VAT_AMOUNT: numeric("VAT_AMOUNT", { precision: 15, scale: 4 }),
  FINAL_PRODUCT_AMOUNT: numeric("FINAL_PRODUCT_AMOUNT", { precision: 15, scale: 4 }),
  TOTAL_PRODUCT_AMOUNT_LC: numeric("TOTAL_PRODUCT_AMOUNT_LC", { precision: 15, scale: 4 }),
  FINAL_PRODUCT_AMOUNT_LC: numeric("FINAL_PRODUCT_AMOUNT_LC", { precision: 15, scale: 4 }),
  REMARKS: varchar("REMARKS", { length: 2000 }),
  STATUS_ENTRY: varchar("STATUS_ENTRY", { length: 20 }),
  CREATED_BY: varchar("CREATED_BY", { length: 50 }),
  CREATED_DATE: timestamp("CREATED_DATE", { mode: "date" }),
  CREATED_IP_ADDRESS: varchar("CREATED_IP_ADDRESS", { length: 50 }),
  MODIFIED_BY: varchar("MODIFIED_BY", { length: 50 }),
  MODIFIED_DATE: timestamp("MODIFIED_DATE", { mode: "date" }),
  MODIFIED_IP_ADDRESS: varchar("MODIFIED_IP_ADDRESS", { length: 50 }),
});

export const TBL_PURCHASE_ORDER_ADDITIONAL_COST_DETAILS = StoEntriesSchema.table("TBL_PURCHASE_ORDER_ADDITIONAL_COST_DETAILS", {
  SNO: serial("SNO").primaryKey(),
  PO_REF_NO: varchar("PO_REF_NO", { length: 50 }).references(() => TBL_PURCHASE_ORDER_HDR.PO_REF_NO),
  ADDITIONAL_COST_TYPE_ID: integer("ADDITIONAL_COST_TYPE_ID").references(() => StoMasterSchema.TBL_ADDITIONAL_COST_TYPE_MASTER.ADDITIONAL_COST_TYPE_ID),
  ADDITIONAL_COST_AMOUNT: numeric("ADDITIONAL_COST_AMOUNT", { precision: 15, scale: 4 }),
  REMARKS: varchar("REMARKS", { length: 1000 }),
  STATUS_MASTER: varchar("STATUS_MASTER", { length: 50 }),
  CREATED_BY: varchar("CREATED_BY", { length: 50 }),
  CREATED_DATE: timestamp("CREATED_DATE", { mode: "date" }),
  CREATED_IP_ADDRESS: varchar("CREATED_IP_ADDRESS", { length: 50 }),
  MODIFIED_BY: varchar("MODIFIED_BY", { length: 50 }),
  MODIFIED_DATE: timestamp("MODIFIED_DATE", { mode: "date" }),
  MODIFIED_IP_ADDRESS: varchar("MODIFIED_IP_ADDRESS", { length: 50 }),
});

export const TBL_PURCHASE_ORDER_FILES_UPLOAD = StoEntriesSchema.table("TBL_PURCHASE_ORDER_FILES_UPLOAD", {
  SNO: serial("SNO").primaryKey(),
  PO_REF_NO: varchar("PO_REF_NO", { length: 50 }).references(() => TBL_PURCHASE_ORDER_HDR.PO_REF_NO),
  DOCUMENT_TYPE: varchar("DOCUMENT_TYPE", { length: 50 }),
  DESCRIPTION_DETAILS: varchar("DESCRIPTION_DETAILS", { length: 100 }),
  FILE_NAME: varchar("FILE_NAME", { length: 150 }),
  CONTENT_TYPE: varchar("CONTENT_TYPE", { length: 50 }),
  CONTENT_DATA: bytea("CONTENT_DATA"),
  REMARKS: varchar("REMARKS", { length: 1000 }),
  STATUS_MASTER: varchar("STATUS_MASTER", { length: 20 }),
  CREATED_BY: varchar("CREATED_BY", { length: 50 }),
  CREATED_DATE: timestamp("CREATED_DATE", { mode: "date" }),
  CREATED_IP_ADDRESS: varchar("CREATED_IP_ADDRESS", { length: 50 }),
  MODIFIED_BY: varchar("MODIFIED_BY", { length: 50 }),
  MODIFIED_DATE: timestamp("MODIFIED_DATE", { mode: "date" }),
  MODIFIED_IP_ADDRESS: varchar("MODIFIED_IP_ADDRESS", { length: 50 }),
});

export const TBL_PURCHASE_ORDER_CONVERSATION_DTL = StoEntriesSchema.table("TBL_PURCHASE_ORDER_CONVERSATION_DTL", {
  SNO: serial("SNO").primaryKey(),
  PO_REF_NO: varchar("PO_REF_NO", { length: 50 }).references(() => TBL_PURCHASE_ORDER_HDR.PO_REF_NO),
  RESPOND_PERSON: varchar("RESPOND_PERSON", { length: 50 }),
  DISCUSSION_DETAILS: text("DISCUSSION_DETAILS"),
  RESPONSE_STATUS: varchar("RESPONSE_STATUS", { length: 50 }),
  STATUS_ENTRY: varchar("STATUS_ENTRY", { length: 50 }),
  REMARKS: varchar("REMARKS", { length: 50 }),
  CREATED_BY: varchar("CREATED_BY", { length: 50 }),
  CREATED_DATE: timestamp("CREATED_DATE", { mode: "date" }),
  CREATED_IP_ADDRESS: varchar("CREATED_IP_ADDRESS", { length: 50 }),
  MODIFIED_BY: varchar("MODIFIED_BY", { length: 50 }),
  MODIFIED_DATE: timestamp("MODIFIED_DATE", { mode: "date" }),
  MODIFIED_IP_ADDRESS: varchar("MODIFIED_IP_ADDRESS", { length: 50 }),
});

export const TBL_GOODS_INWARD_GRN_HDR = StoEntriesSchema.table("TBL_GOODS_INWARD_GRN_HDR", {
  SNO: serial("SNO"),
  GRN_REF_NO: varchar("GRN_REF_NO", { length: 50 }).primaryKey(),
  GRN_DATE: timestamp("GRN_DATE", { mode: "date" }),
  COMPANY_ID: integer("COMPANY_ID").references(() => StoMasterSchema.TBL_COMPANY_MASTER.Company_Id),
  SOURCE_STORE_ID: integer("SOURCE_STORE_ID").references(() => StoMasterSchema.TBL_STORE_MASTER.Store_Id),
  GRN_STORE_ID: integer("GRN_STORE_ID").references(() => StoMasterSchema.TBL_STORE_MASTER.Store_Id),
  GRN_SOURCE: varchar("GRN_SOURCE", { length: 50 }),
  DELIVERY_NOTE_REF_NO: varchar("DELIVERY_NOTE_REF_NO", { length: 50 }),
  SUPPLIER_ID: integer("SUPPLIER_ID").references(() => StoMasterSchema.TBL_SUPPLIER_MASTER.Supplier_Id),
  PO_REF_NO: varchar("PO_REF_NO", { length: 50 }).references(() => TBL_PURCHASE_ORDER_HDR.PO_REF_NO),
  PURCHASE_INVOICE_REF_NO: varchar("PURCHASE_INVOICE_REF_NO", { length: 50 }),
  SUPPLIER_INVOICE_NUMBER: varchar("SUPPLIER_INVOICE_NUMBER", { length: 100 }),
  CONTAINER_NO: varchar("CONTAINER_NO", { length: 20 }),
  DRIVER_NAME: varchar("DRIVER_NAME", { length: 50 }),
  DRIVER_CONTACT_NUMBER: varchar("DRIVER_CONTACT_NUMBER", { length: 50 }),
  VEHICLE_NO: varchar("VEHICLE_NO", { length: 50 }),
  SEAL_NO: varchar("SEAL_NO", { length: 50 }),
  REMARKS: varchar("REMARKS", { length: 2000 }),
  STATUS_ENTRY: varchar("STATUS_ENTRY", { length: 20 }),
  CREATED_BY: varchar("CREATED_BY", { length: 50 }),
  CREATED_DATE: timestamp("CREATED_DATE", { mode: "date" }),
  CREATED_IP_ADDRESS: varchar("CREATED_IP_ADDRESS", { length: 50 }),
  MODIFIED_BY: varchar("MODIFIED_BY", { length: 50 }),
  MODIFIED_DATE: timestamp("MODIFIED_DATE", { mode: "date" }),
  MODIFIED_IP_ADDRESS: varchar("MODIFIED_IP_ADDRESS", { length: 50 }),
});

export const TBL_GOODS_INWARD_GRN_DTL = StoEntriesSchema.table("TBL_GOODS_INWARD_GRN_DTL", {
  SNO: serial("SNO").primaryKey(),
  GRN_REF_NO: varchar("GRN_REF_NO", { length: 50 }).references(() => TBL_GOODS_INWARD_GRN_HDR.GRN_REF_NO),
  PO_DTL_SNO: integer("PO_DTL_SNO").references(() => TBL_PURCHASE_ORDER_DTL.SNO),
  MAIN_CATEGORY_ID: integer("MAIN_CATEGORY_ID").references(() => StoMasterSchema.TBL_PRODUCT_MAIN_CATEGORY_MASTER.MAIN_CATEGORY_ID),
  SUB_CATEGORY_ID: integer("SUB_CATEGORY_ID").references(() => StoMasterSchema.TBL_PRODUCT_SUB_CATEGORY_MASTER.SUB_CATEGORY_ID),
  PRODUCT_ID: integer("PRODUCT_ID").references(() => StoMasterSchema.TBL_PRODUCT_MASTER.PRODUCT_ID),
  QTY_PER_PACKING: numeric("QTY_PER_PACKING", { precision: 15, scale: 2 }),
  TOTAL_QTY: numeric("TOTAL_QTY", { precision: 15, scale: 4 }),
  UOM: varchar("UOM", { length: 50 }),
  TOTAL_PACKING: numeric("TOTAL_PACKING", { precision: 15, scale: 4 }),
  ALTERNATE_UOM: varchar("ALTERNATE_UOM", { length: 500 }),
  REMARKS: varchar("REMARKS", { length: 2000 }),
  STATUS_ENTRY: varchar("STATUS_ENTRY", { length: 20 }),
  CREATED_BY: varchar("CREATED_BY", { length: 50 }),
  CREATED_DATE: timestamp("CREATED_DATE", { mode: "date" }),
  CREATED_IP_ADDRESS: varchar("CREATED_IP_ADDRESS", { length: 50 }),
  MODIFIED_BY: varchar("MODIFIED_BY", { length: 50 }),
  MODIFIED_DATE: timestamp("MODIFIED_DATE", { mode: "date" }),
  MODIFIED_IP_ADDRESS: varchar("MODIFIED_IP_ADDRESS", { length: 50 }),
});

export const TBL_PURCHASE_INVOICE_HDR = StoEntriesSchema.table("TBL_PURCHASE_INVOICE_HDR", {
  SNO: serial("SNO"),
  PURCHASE_INVOICE_REF_NO: varchar("PURCHASE_INVOICE_REF_NO", { length: 50 }).primaryKey(),
  COMPANY_ID: integer("COMPANY_ID").references(() => StoMasterSchema.TBL_COMPANY_MASTER.Company_Id),
  INVOICE_NO: varchar("INVOICE_NO", { length: 100 }),
  INVOICE_DATE: timestamp("INVOICE_DATE", { mode: "date" }),
  PO_REF_NO: varchar("PO_REF_NO", { length: 50 }).references(() => TBL_PURCHASE_ORDER_HDR.PO_REF_NO),
  PURCHASE_TYPE: varchar("PURCHASE_TYPE", { length: 20 }),
  SUPPLIER_ID: integer("SUPPLIER_ID").references(() => StoMasterSchema.TBL_SUPPLIER_MASTER.Supplier_Id),
  STORE_ID: integer("STORE_ID").references(() => StoMasterSchema.TBL_STORE_MASTER.Store_Id),
  PAYMENT_TERM_ID: integer("PAYMENT_TERM_ID").references(() => StoMasterSchema.TBL_PAYMENT_TERM_MASTER.PAYMENT_TERM_ID),
  MODE_OF_PAYMENT: varchar("MODE_OF_PAYMENT", { length: 25 }),
  CURRENCY_ID: integer("CURRENCY_ID").references(() => StoMasterSchema.TBL_CURRENCY_MASTER.CURRENCY_ID),
  PRICE_TERMS: varchar("PRICE_TERMS", { length: 150 }),
  PRODUCT_HDR_AMOUNT: numeric("PRODUCT_HDR_AMOUNT", { precision: 15, scale: 4 }),
  TOTAL_ADDITIONAL_COST_AMOUNT: numeric("TOTAL_ADDITIONAL_COST_AMOUNT", { precision: 15, scale: 4 }),
  TOTAL_PRODUCT_HDR_AMOUNT: numeric("TOTAL_PRODUCT_HDR_AMOUNT", { precision: 15, scale: 4 }),
  TOTAL_VAT_HDR_AMOUNT: numeric("TOTAL_VAT_HDR_AMOUNT", { precision: 15, scale: 2 }),
  FINAL_INVOICE_HDR_AMOUNT: numeric("FINAL_INVOICE_HDR_AMOUNT", { precision: 15, scale: 2 }),
  EXCHANGE_RATE: numeric("EXCHANGE_RATE", { precision: 10, scale: 2 }),
  PRODUCT_HDR_AMOUNT_LC: numeric("PRODUCT_HDR_AMOUNT_LC", { precision: 15, scale: 4 }),
  TOTAL_ADDITIONAL_COST_AMOUNT_LC: numeric("TOTAL_ADDITIONAL_COST_AMOUNT_LC", { precision: 15, scale: 4 }),
  TOTAL_PRODUCT_HDR_AMOUNT_LC: numeric("TOTAL_PRODUCT_HDR_AMOUNT_LC", { precision: 15, scale: 4 }),
  TOTAL_VAT_HDR_AMOUNT_LC: numeric("TOTAL_VAT_HDR_AMOUNT_LC", { precision: 15, scale: 2 }),
  FINAL_PURCHASE_INVOICE_AMOUNT_LC: numeric("FINAL_PURCHASE_INVOICE_AMOUNT_LC", { precision: 15, scale: 2 }),
  SUBMITTED_BY: varchar("SUBMITTED_BY", { length: 50 }),
  SUBMITTED_DATE: timestamp("SUBMITTED_DATE", { mode: "date" }),
  SUBMITTED_IP_ADDRESS: varchar("SUBMITTED_IP_ADDRESS", { length: 50 }),
  RESPONSE_1_PERSON: varchar("RESPONSE_1_PERSON", { length: 50 }),
  RESPONSE_1_DATE: timestamp("RESPONSE_1_DATE", { mode: "date" }),
  RESPONSE_1_STATUS: varchar("RESPONSE_1_STATUS", { length: 50 }),
  RESPONSE_1_REMARKS: varchar("RESPONSE_1_REMARKS", { length: 5000 }),
  RESPONSE_1_IP_ADDRESS: varchar("RESPONSE_1_IP_ADDRESS", { length: 50 }),
  RESPONSE_2_PERSON: varchar("RESPONSE_2_PERSON", { length: 50 }),
  RESPONSE_2_DATE: timestamp("RESPONSE_2_DATE", { mode: "date" }),
  RESPONSE_2_STATUS: varchar("RESPONSE_2_STATUS", { length: 50 }),
  RESPONSE_2_REMARKS: varchar("RESPONSE_2_REMARKS", { length: 5000 }),
  RESPONSE_2_IP_ADDRESS: varchar("RESPONSE_2_IP_ADDRESS", { length: 50 }),
  FINAL_RESPONSE_PERSON: varchar("FINAL_RESPONSE_PERSON", { length: 50 }),
  FINAL_RESPONSE_DATE: timestamp("FINAL_RESPONSE_DATE", { mode: "date" }),
  FINAL_RESPONSE_STATUS: varchar("FINAL_RESPONSE_STATUS", { length: 50 }),
  FINAL_RESPONSE_REMARKS: varchar("FINAL_RESPONSE_REMARKS", { length: 5000 }),
  REMARKS: varchar("REMARKS", { length: 2000 }),
  STATUS_ENTRY: varchar("STATUS_ENTRY", { length: 20 }),
  CREATED_BY: varchar("CREATED_BY", { length: 50 }),
  CREATED_DATE: timestamp("CREATED_DATE", { mode: "date" }),
  CREATED_IP_ADDRESS: varchar("CREATED_IP_ADDRESS", { length: 50 }),
  MODIFIED_BY: varchar("MODIFIED_BY", { length: 50 }),
  MODIFIED_DATE: timestamp("MODIFIED_DATE", { mode: "date" }),
  MODIFIED_IP_ADDRESS: varchar("MODIFIED_IP_ADDRESS", { length: 50 }),
});

export const TBL_PURCHASE_INVOICE_DTL = StoEntriesSchema.table("TBL_PURCHASE_INVOICE_DTL", {
  SNO: serial("SNO").primaryKey(),
  PURCHASE_INVOICE_REF_NO: varchar("PURCHASE_INVOICE_REF_NO", { length: 50 }).references(() => TBL_PURCHASE_INVOICE_HDR.PURCHASE_INVOICE_REF_NO),
  GRN_REF_NO: varchar("GRN_REF_NO", { length: 50 }).references(() => TBL_GOODS_INWARD_GRN_HDR.GRN_REF_NO),
  MAIN_CATEGORY_ID: integer("MAIN_CATEGORY_ID").references(() => StoMasterSchema.TBL_PRODUCT_MAIN_CATEGORY_MASTER.MAIN_CATEGORY_ID),
  SUB_CATEGORY_ID: integer("SUB_CATEGORY_ID").references(() => StoMasterSchema.TBL_PRODUCT_SUB_CATEGORY_MASTER.SUB_CATEGORY_ID),
  PRODUCT_ID: integer("PRODUCT_ID").references(() => StoMasterSchema.TBL_PRODUCT_MASTER.PRODUCT_ID),
  QTY_PER_PACKING: numeric("QTY_PER_PACKING", { precision: 15, scale: 2 }),
  TOTAL_QTY: numeric("TOTAL_QTY", { precision: 15, scale: 4 }),
  UOM: varchar("UOM", { length: 50 }),
  TOTAL_PACKING: numeric("TOTAL_PACKING", { precision: 15, scale: 4 }),
  ALTERNATE_UOM: varchar("ALTERNATE_UOM", { length: 500 }),
  RATE_PER_QTY: numeric("RATE_PER_QTY", { precision: 15, scale: 6 }),
  PRODUCT_AMOUNT: numeric("PRODUCT_AMOUNT", { precision: 15, scale: 4 }),
  DISCOUNT_PERCENTAGE: numeric("DISCOUNT_PERCENTAGE", { precision: 15, scale: 2 }),
  DISCOUNT_AMOUNT: numeric("DISCOUNT_AMOUNT", { precision: 15, scale: 4 }),
  TOTAL_PRODUCT_AMOUNT: numeric("TOTAL_PRODUCT_AMOUNT", { precision: 15, scale: 4 }),
  VAT_PERCENTAGE: numeric("VAT_PERCENTAGE", { precision: 15, scale: 2 }),
  VAT_AMOUNT: numeric("VAT_AMOUNT", { precision: 15, scale: 4 }),
  FINAL_PRODUCT_AMOUNT: numeric("FINAL_PRODUCT_AMOUNT", { precision: 15, scale: 4 }),
  TOTAL_PRODUCT_AMOUNT_LC: numeric("TOTAL_PRODUCT_AMOUNT_LC", { precision: 15, scale: 4 }),
  FINAL_PRODUCT_AMOUNT_LC: numeric("FINAL_PRODUCT_AMOUNT_LC", { precision: 15, scale: 4 }),
  REMARKS: varchar("REMARKS", { length: 2000 }),
  STATUS_ENTRY: varchar("STATUS_ENTRY", { length: 20 }),
  CREATED_BY: varchar("CREATED_BY", { length: 50 }),
  CREATED_DATE: timestamp("CREATED_DATE", { mode: "date" }),
  CREATED_IP_ADDRESS: varchar("CREATED_IP_ADDRESS", { length: 50 }),
  MODIFIED_BY: varchar("MODIFIED_BY", { length: 50 }),
  MODIFIED_DATE: timestamp("MODIFIED_DATE", { mode: "date" }),
  MODIFIED_IP_ADDRESS: varchar("MODIFIED_IP_ADDRESS", { length: 50 }),
});

export const TBL_PURCHASE_INVOICE_ADDITIONAL_COST_DETAILS = StoEntriesSchema.table("TBL_PURCHASE_INVOICE_ADDITIONAL_COST_DETAILS", {
  SNO: serial("SNO").primaryKey(),
  PURCHASE_INVOICE_NO: varchar("PURCHASE_INVOICE_NO", { length: 50 }).references(() => TBL_PURCHASE_INVOICE_HDR.PURCHASE_INVOICE_REF_NO),
  ADDITIONAL_COST_TYPE_ID: integer("ADDITIONAL_COST_TYPE_ID").references(() => StoMasterSchema.TBL_ADDITIONAL_COST_TYPE_MASTER.ADDITIONAL_COST_TYPE_ID),
  ADDITIONAL_COST_AMOUNT: numeric("ADDITIONAL_COST_AMOUNT", { precision: 15, scale: 4 }),
  REMARKS: varchar("REMARKS", { length: 1000 }),
  STATUS_MASTER: varchar("STATUS_MASTER", { length: 50 }),
  CREATED_BY: varchar("CREATED_BY", { length: 50 }),
  CREATED_DATE: timestamp("CREATED_DATE", { mode: "date" }),
  CREATED_IP_ADDRESS: varchar("CREATED_IP_ADDRESS", { length: 50 }),
  MODIFIED_BY: varchar("MODIFIED_BY", { length: 50 }),
  MODIFIED_DATE: timestamp("MODIFIED_DATE", { mode: "date" }),
  MODIFIED_IP_ADDRESS: varchar("MODIFIED_IP_ADDRESS", { length: 50 }),
});

export const TBL_PURCHASE_INVOICE_FILES_UPLOAD = StoEntriesSchema.table("TBL_PURCHASE_INVOICE_FILES_UPLOAD", {
  SNO: serial("SNO").primaryKey(),
  PURCHASE_INVOICE_REF_NO: varchar("PURCHASE_INVOICE_REF_NO", { length: 50 }).references(() => TBL_PURCHASE_INVOICE_HDR.PURCHASE_INVOICE_REF_NO),
  DOCUMENT_TYPE: varchar("DOCUMENT_TYPE", { length: 50 }),
  DESCRIPTION_DETAILS: varchar("DESCRIPTION_DETAILS", { length: 100 }),
  FILE_NAME: varchar("FILE_NAME", { length: 150 }),
  CONTENT_TYPE: varchar("CONTENT_TYPE", { length: 50 }),
  CONTENT_DATA: bytea("CONTENT_DATA"),
  REMARKS: varchar("REMARKS", { length: 1000 }),
  STATUS_MASTER: varchar("STATUS_MASTER", { length: 20 }),
  CREATED_BY: varchar("CREATED_BY", { length: 50 }),
  CREATED_DATE: timestamp("CREATED_DATE", { mode: "date" }),
  CREATED_IP_ADDRESS: varchar("CREATED_IP_ADDRESS", { length: 50 }),
  MODIFIED_BY: varchar("MODIFIED_BY", { length: 50 }),
  MODIFIED_DATE: timestamp("MODIFIED_DATE", { mode: "date" }),
  MODIFIED_IP_ADDRESS: varchar("MODIFIED_IP_ADDRESS", { length: 50 }),
});

export const TBL_EXPENSE_HDR = StoEntriesSchema.table("TBL_EXPENSE_HDR", {
  SNO: serial("SNO"),
  EXPENSE_REF_NO: varchar("EXPENSE_REF_NO", { length: 50 }).primaryKey(),
  EXPENSE_DATE: timestamp("EXPENSE_DATE", { mode: "date" }),
  COMPANY_ID: integer("COMPANY_ID").references(() => StoMasterSchema.TBL_COMPANY_MASTER.Company_Id),
  EXPENSE_AGAINST: varchar("EXPENSE_AGAINST", { length: 50 }),
  PO_REF_NO: varchar("PO_REF_NO", { length: 50 }).references(() => TBL_PURCHASE_ORDER_HDR.PO_REF_NO),
  ACCOUNT_HEAD_ID: integer("ACCOUNT_HEAD_ID").references(() => StoMasterSchema.TBL_ACCOUNTS_HEAD_MASTER.ACCOUNT_HEAD_ID),
  EXPENSE_SUPPLIER_ID: integer("EXPENSE_SUPPLIER_ID").references(() => StoMasterSchema.TBL_SUPPLIER_MASTER.Supplier_Id),
  EXPENSE_TYPE: varchar("EXPENSE_TYPE", { length: 100 }),
  TRA_EFD_RECEIPT_NO: varchar("TRA_EFD_RECEIPT_NO", { length: 100 }),
  CURRENCY_ID: integer("CURRENCY_ID").references(() => StoMasterSchema.TBL_CURRENCY_MASTER.CURRENCY_ID),
  EXCHANGE_RATE: numeric("EXCHANGE_RATE", { precision: 15, scale: 2 }),
  TOTAL_EXPENSE_AMOUNT: numeric("TOTAL_EXPENSE_AMOUNT", { precision: 18, scale: 2 }),
  TOTAL_EXPENSE_AMOUNT_LC: numeric("TOTAL_EXPENSE_AMOUNT_LC", { precision: 18, scale: 2 }),
  REMARKS: varchar("REMARKS", { length: 2000 }),
  STATUS_ENTRY: varchar("STATUS_ENTRY", { length: 20 }),
  CREATED_BY: varchar("CREATED_BY", { length: 50 }),
  CREATED_DATE: timestamp("CREATED_DATE", { mode: "date" }),
  CREATED_IP_ADDRESS: varchar("CREATED_IP_ADDRESS", { length: 50 }),
  MODIFIED_BY: varchar("MODIFIED_BY", { length: 50 }),
  MODIFIED_DATE: timestamp("MODIFIED_DATE", { mode: "date" }),
  MODIFIED_IP_ADDRESS: varchar("MODIFIED_IP_ADDRESS", { length: 50 }),
  SUBMITTED_BY: varchar("SUBMITTED_BY", { length: 50 }),
  SUBMITTED_DATE: timestamp("SUBMITTED_DATE", { mode: "date" }),
  SUBMITTED_IP_ADDRESS: varchar("SUBMITTED_IP_ADDRESS", { length: 50 }),
});

export const TBL_EXPENSE_DTL = StoEntriesSchema.table("TBL_EXPENSE_DTL", {
  SNO: serial("SNO").primaryKey(),
  EXPENSE_REF_NO: varchar("EXPENSE_REF_NO", { length: 50 }).references(() => TBL_EXPENSE_HDR.EXPENSE_REF_NO),
  PO_REF_NO: varchar("PO_REF_NO", { length: 50 }).references(() => TBL_PURCHASE_ORDER_HDR.PO_REF_NO),
  PO_DTL_SNO: integer("PO_DTL_SNO").references(() => TBL_PURCHASE_ORDER_DTL.SNO),
  PRODUCT_ID: integer("PRODUCT_ID").references(() => StoMasterSchema.TBL_PRODUCT_MASTER.PRODUCT_ID),
  EXPENSE_AMOUNT: numeric("EXPENSE_AMOUNT", { precision: 18, scale: 2 }),
  EXPENSE_AMOUNT_LC: numeric("EXPENSE_AMOUNT_LC", { precision: 18, scale: 2 }),
  REMARKS: varchar("REMARKS", { length: 2000 }),
  STATUS_ENTRY: varchar("STATUS_ENTRY", { length: 20 }),
  CREATED_BY: varchar("CREATED_BY", { length: 50 }),
  CREATED_DATE: timestamp("CREATED_DATE", { mode: "date" }),
  CREATED_IP_ADDRESS: varchar("CREATED_IP_ADDRESS", { length: 50 }),
  MODIFIED_BY: varchar("MODIFIED_BY", { length: 50 }),
  MODIFIED_DATE: timestamp("MODIFIED_DATE", { mode: "date" }),
  MODIFIED_IP_ADDRESS: varchar("MODIFIED_IP_ADDRESS", { length: 50 }),
});

export const TBL_SALES_ORDER_HDR = StoEntriesSchema.table("TBL_SALES_ORDER_HDR", {
  SNO: serial("SNO"),
  SALES_ORDER_REF_NO: varchar("SALES_ORDER_REF_NO", { length: 50 }).primaryKey(),
  SALES_ORDER_DATE: timestamp("SALES_ORDER_DATE", { mode: "date" }).notNull(),
  SALES_PROFORMA_REF_NO: varchar("SALES_PROFORMA_REF_NO", { length: 50 }).references(() => TBL_SALES_PROFORMA_HDR.SALES_PROFORMA_REF_NO).notNull(),
  COMPANY_ID: integer("COMPANY_ID").references(() => StoMasterSchema.TBL_COMPANY_MASTER.Company_Id),
  STORE_ID: integer("STORE_ID").references(() => StoMasterSchema.TBL_STORE_MASTER.Store_Id),
  CUSTOMER_ID: integer("CUSTOMER_ID").references(() => StoMasterSchema.TBL_CUSTOMER_MASTER.Customer_Id),
  BILLING_LOCATION_ID: integer("BILLING_LOCATION_ID").references(() => StoMasterSchema.TBL_BILLING_LOCATION_MASTER.Billing_Location_Id),
  SALES_PERSON_EMP_ID: integer("SALES_PERSON_EMP_ID").references(() => StoMasterSchema.TBL_SALES_PERSON_MASTER.Sales_Person_ID),
  CREDIT_LIMIT_AMOUNT: numeric("CREDIT_LIMIT_AMOUNT", { precision: 15, scale: 2 }),
  CREDIT_LIMIT_DAYS: numeric("CREDIT_LIMIT_DAYS", { precision: 15, scale: 2 }),
  OUTSTANDING_AMOUNT: numeric("OUTSTANDING_AMOUNT", { precision: 15, scale: 2 }),
  CURRENCY_ID: integer("CURRENCY_ID").references(() => StoMasterSchema.TBL_CURRENCY_MASTER.CURRENCY_ID),
  EXCHANGE_RATE: numeric("EXCHANGE_RATE", { precision: 15, scale: 2 }),
  TOTAL_PRODUCT_AMOUNT: numeric("TOTAL_PRODUCT_AMOUNT", { precision: 15, scale: 4 }),
  VAT_AMOUNT: numeric("VAT_AMOUNT", { precision: 15, scale: 4 }),
  FINAL_SALES_AMOUNT: numeric("FINAL_SALES_AMOUNT", { precision: 15, scale: 4 }),
  TOTAL_PRODUCT_AMOUNT_LC: numeric("TOTAL_PRODUCT_AMOUNT_LC", { precision: 15, scale: 4 }),
  FINAL_SALES_AMOUNT_LC: numeric("FINAL_SALES_AMOUNT_LC", { precision: 15, scale: 4 }),
  REMARKS: varchar("REMARKS", { length: 2000 }),
  TEST_DESC: varchar("TEST_DESC", { length: 50 }),
  STATUS_ENTRY: varchar("STATUS_ENTRY", { length: 20 }),
  CREATED_BY: varchar("CREATED_BY", { length: 50 }),
  CREATED_DATE: timestamp("CREATED_DATE", { mode: "date" }),
  CREATED_MAC_ADDRESS: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
  MODIFIED_BY: varchar("MODIFIED_BY", { length: 50 }),
  MODIFIED_DATE: timestamp("MODIFIED_DATE", { mode: "date" }),
  MODIFIED_MAC_ADDRESS: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
  SUBMITTED_BY: varchar("SUBMITTED_BY", { length: 50 }),
  SUBMITTED_DATE: timestamp("SUBMITTED_DATE", { mode: "date" }),
});

export const TBL_SALES_ORDER_DTL = StoEntriesSchema.table("TBL_SALES_ORDER_DTL", {
  SNO: serial("SNO").primaryKey(),
  SALES_ORDER_REF_NO: varchar("SALES_ORDER_REF_NO", { length: 50 }).references(() => TBL_SALES_ORDER_HDR.SALES_ORDER_REF_NO),
  MAIN_CATEGORY_ID: integer("MAIN_CATEGORY_ID").references(() => StoMasterSchema.TBL_PRODUCT_MAIN_CATEGORY_MASTER.MAIN_CATEGORY_ID),
  SUB_CATEGORY_ID: integer("SUB_CATEGORY_ID").references(() => StoMasterSchema.TBL_PRODUCT_SUB_CATEGORY_MASTER.SUB_CATEGORY_ID),
  PRODUCT_ID: integer("PRODUCT_ID").references(() => StoMasterSchema.TBL_PRODUCT_MASTER.PRODUCT_ID),
  STORE_STOCK_PCS: numeric("STORE_STOCK_PCS", { precision: 15, scale: 4 }),
  PO_REF_NO: varchar("PO_REF_NO", { length: 50 }).references(() => TBL_PURCHASE_ORDER_HDR.PO_REF_NO),
  PO_DTL_SNO: integer("PO_DTL_SNO").references(() => TBL_PURCHASE_ORDER_DTL.SNO),
  PO_DTL_STOCK_QTY: numeric("PO_DTL_STOCK_QTY", { precision: 15, scale: 4 }),
  PURCHASE_RATE_PER_QTY: numeric("PURCHASE_RATE_PER_QTY", { precision: 15, scale: 6 }),
  PO_EXPENSE_AMOUNT: numeric("PO_EXPENSE_AMOUNT", { precision: 15, scale: 4 }),
  SALES_RATE_PER_QTY: numeric("SALES_RATE_PER_QTY", { precision: 15, scale: 6 }),
  QTY_PER_PACKING: numeric("QTY_PER_PACKING", { precision: 15, scale: 2 }),
  TOTAL_QTY: numeric("TOTAL_QTY", { precision: 15, scale: 4 }),
  UOM: varchar("UOM", { length: 50 }),
  TOTAL_PACKING: numeric("TOTAL_PACKING", { precision: 15, scale: 4 }),
  ALTERNATE_UOM: varchar("ALTERNATE_UOM", { length: 500 }),
  TOTAL_PRODUCT_AMOUNT: numeric("TOTAL_PRODUCT_AMOUNT", { precision: 15, scale: 4 }),
  VAT_PERCENTAGE: numeric("VAT_PERCENTAGE", { precision: 15, scale: 2 }),
  VAT_AMOUNT: numeric("VAT_AMOUNT", { precision: 15, scale: 4 }),
  FINAL_SALES_AMOUNT: numeric("FINAL_SALES_AMOUNT", { precision: 15, scale: 4 }),
  TOTAL_PRODUCT_AMOUNT_LC: numeric("TOTAL_PRODUCT_AMOUNT_LC", { precision: 15, scale: 4 }),
  FINAL_SALES_AMOUNT_LC: numeric("FINAL_SALES_AMOUNT_LC", { precision: 15, scale: 4 }),
  REMARKS: varchar("REMARKS", { length: 2000 }),
  STATUS_ENTRY: varchar("STATUS_ENTRY", { length: 20 }),
  CREATED_BY: varchar("CREATED_BY", { length: 50 }),
  CREATED_DATE: timestamp("CREATED_DATE", { mode: "date" }),
  CREATED_MAC_ADDRESS: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
  MODIFIED_BY: varchar("MODIFIED_BY", { length: 50 }),
  MODIFIED_DATE: timestamp("MODIFIED_DATE", { mode: "date" }),
  MODIFIED_MAC_ADDRESS: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
});

export const TBL_DELIVERY_NOTE_HDR = StoEntriesSchema.table("TBL_DELIVERY_NOTE_HDR", {
  SNO: serial("SNO"),
  DELIVERY_NOTE_REF_NO: varchar("DELIVERY_NOTE_REF_NO", { length: 50 }).primaryKey(),
  DELIVERY_DATE: timestamp("DELIVERY_DATE", { mode: "date" }),
  COMPANY_ID: integer("COMPANY_ID").references(() => StoMasterSchema.TBL_COMPANY_MASTER.Company_Id),
  FROM_STORE_ID: integer("FROM_STORE_ID").references(() => StoMasterSchema.TBL_STORE_MASTER.Store_Id),
  DELIVERY_SOURCE_TYPE: varchar("DELIVERY_SOURCE_TYPE", { length: 50 }),
  DELIVERY_SOURCE_REF_NO: varchar("DELIVERY_SOURCE_REF_NO", { length: 50 }),
  TO_STORE_ID: integer("TO_STORE_ID").references(() => StoMasterSchema.TBL_STORE_MASTER.Store_Id),
  CUSTOMER_ID: integer("CUSTOMER_ID").references(() => StoMasterSchema.TBL_CUSTOMER_MASTER.Customer_Id),
  TRUCK_NO: varchar("TRUCK_NO", { length: 50 }),
  TRAILER_NO: varchar("TRAILER_NO", { length: 50 }),
  DRIVER_NAME: varchar("DRIVER_NAME", { length: 50 }),
  DRIVER_CONTACT_NUMBER: varchar("DRIVER_CONTACT_NUMBER", { length: 50 }),
  SEAL_NO: varchar("SEAL_NO", { length: 50 }),
  CURRENCY_ID: integer("CURRENCY_ID").references(() => StoMasterSchema.TBL_CURRENCY_MASTER.CURRENCY_ID),
  EXCHANGE_RATE: numeric("EXCHANGE_RATE", { precision: 15, scale: 2 }),
  TOTAL_PRODUCT_AMOUNT: numeric("TOTAL_PRODUCT_AMOUNT", { precision: 15, scale: 4 }),
  VAT_AMOUNT: numeric("VAT_AMOUNT", { precision: 15, scale: 4 }),
  FINAL_SALES_AMOUNT: numeric("FINAL_SALES_AMOUNT", { precision: 15, scale: 4 }),
  TOTAL_PRODUCT_AMOUNT_LC: numeric("TOTAL_PRODUCT_AMOUNT_LC", { precision: 15, scale: 4 }),
  FINAL_SALES_AMOUNT_LC: numeric("FINAL_SALES_AMOUNT_LC", { precision: 15, scale: 4 }),
  TEST_DESC: varchar("TEST_DESC", { length: 50 }),
  REMARKS: varchar("REMARKS", { length: 2000 }),
  STATUS_ENTRY: varchar("STATUS_ENTRY", { length: 20 }),
  CREATED_BY: varchar("CREATED_BY", { length: 50 }),
  CREATED_DATE: timestamp("CREATED_DATE", { mode: "date" }),
  CREATED_MAC_ADDRESS: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
  MODIFIED_BY: varchar("MODIFIED_BY", { length: 50 }),
  MODIFIED_DATE: timestamp("MODIFIED_DATE", { mode: "date" }),
  MODIFIED_MAC_ADDRESS: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
  SUBMITTED_BY: varchar("SUBMITTED_BY", { length: 50 }),
  SUBMITTED_DATE: timestamp("SUBMITTED_DATE", { mode: "date" }),
  SUBMITTED_MAC_ADDRESS: varchar("SUBMITTED_MAC_ADDRESS", { length: 50 }),
});

export const TBL_DELIVERY_NOTE_DTL = StoEntriesSchema.table("TBL_DELIVERY_NOTE_DTL", {
  SNO: serial("SNO").primaryKey(),
  DELIVERY_NOTE_REF_NO: varchar("DELIVERY_NOTE_REF_NO", { length: 50 }).references(() => TBL_DELIVERY_NOTE_HDR.DELIVERY_NOTE_REF_NO),
  SALES_ORDER_DTL_SNO: integer("SALES_ORDER_DTL_SNO"),
  PO_DTL_SNO: integer("PO_DTL_SNO").references(() => TBL_PURCHASE_ORDER_DTL.SNO),
  PO_REF_NO: varchar("PO_REF_NO", { length: 50 }).references(() => TBL_PURCHASE_ORDER_HDR.PO_REF_NO),
  MAIN_CATEGORY_ID: integer("MAIN_CATEGORY_ID").references(() => StoMasterSchema.TBL_PRODUCT_MAIN_CATEGORY_MASTER.MAIN_CATEGORY_ID),
  SUB_CATEGORY_ID: integer("SUB_CATEGORY_ID").references(() => StoMasterSchema.TBL_PRODUCT_SUB_CATEGORY_MASTER.SUB_CATEGORY_ID),
  PRODUCT_ID: integer("PRODUCT_ID").references(() => StoMasterSchema.TBL_PRODUCT_MASTER.PRODUCT_ID),
  SALES_RATE_PER_QTY: numeric("SALES_RATE_PER_QTY", { precision: 15, scale: 6 }),
  QTY_PER_PACKING: numeric("QTY_PER_PACKING", { precision: 15, scale: 2 }),
  REQUEST_QTY: numeric("REQUEST_QTY", { precision: 15, scale: 4 }),
  DELIVERY_QTY: numeric("DELIVERY_QTY", { precision: 15, scale: 4 }),
  UOM: varchar("UOM", { length: 50 }),
  TOTAL_PACKING: numeric("TOTAL_PACKING", { precision: 15, scale: 4 }),
  ALTERNATE_UOM: varchar("ALTERNATE_UOM", { length: 500 }),
  TOTAL_PRODUCT_AMOUNT: numeric("TOTAL_PRODUCT_AMOUNT", { precision: 15, scale: 4 }),
  VAT_PERCENTAGE: numeric("VAT_PERCENTAGE", { precision: 15, scale: 2 }),
  VAT_AMOUNT: numeric("VAT_AMOUNT", { precision: 15, scale: 4 }),
  FINAL_SALES_AMOUNT: numeric("FINAL_SALES_AMOUNT", { precision: 15, scale: 4 }),
  TOTAL_PRODUCT_AMOUNT_LC: numeric("TOTAL_PRODUCT_AMOUNT_LC", { precision: 15, scale: 4 }),
  FINAL_SALES_AMOUNT_LC: numeric("FINAL_SALES_AMOUNT_LC", { precision: 15, scale: 4 }),
  STORE_STOCK_PCS: numeric("STORE_STOCK_PCS", { precision: 15, scale: 2 }),
  REMARKS: varchar("REMARKS", { length: 2000 }),
  STATUS_ENTRY: varchar("STATUS_ENTRY", { length: 20 }),
  CREATED_BY: varchar("CREATED_BY", { length: 50 }),
  CREATED_DATE: timestamp("CREATED_DATE", { mode: "date" }),
  CREATED_MAC_ADDRESS: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
  MODIFIED_BY: varchar("MODIFIED_BY", { length: 50 }),
  MODIFIED_DATE: timestamp("MODIFIED_DATE", { mode: "date" }),
  MODIFIED_MAC_ADDRESS: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
});

export const TBL_TAX_INVOICE_HDR = StoEntriesSchema.table("TBL_TAX_INVOICE_HDR", {
  SNO: serial("SNO"),
  TAX_INVOICE_REF_NO: varchar("TAX_INVOICE_REF_NO", { length: 50 }).primaryKey(),
  INVOICE_DATE: timestamp("INVOICE_DATE", { mode: "date" }),
  COMPANY_ID: integer("COMPANY_ID").references(() => StoMasterSchema.TBL_COMPANY_MASTER.Company_Id),
  FROM_STORE_ID: integer("FROM_STORE_ID").references(() => StoMasterSchema.TBL_STORE_MASTER.Store_Id),
  INVOICE_TYPE: varchar("INVOICE_TYPE", { length: 50 }),
  DELIVERY_NOTE_REF_NO: varchar("DELIVERY_NOTE_REF_NO", { length: 50 }).references(() => TBL_DELIVERY_NOTE_HDR.DELIVERY_NOTE_REF_NO),
  CUSTOMER_ID: integer("CUSTOMER_ID").references(() => StoMasterSchema.TBL_CUSTOMER_MASTER.Customer_Id),
  CURRENCY_ID: integer("CURRENCY_ID").references(() => StoMasterSchema.TBL_CURRENCY_MASTER.CURRENCY_ID),
  EXCHANGE_RATE: numeric("EXCHANGE_RATE", { precision: 15, scale: 2 }),
  TOTAL_PRODUCT_AMOUNT: numeric("TOTAL_PRODUCT_AMOUNT", { precision: 15, scale: 4 }),
  VAT_AMOUNT: numeric("VAT_AMOUNT", { precision: 15, scale: 4 }),
  FINAL_SALES_AMOUNT: numeric("FINAL_SALES_AMOUNT", { precision: 15, scale: 4 }),
  TOTAL_PRODUCT_AMOUNT_LC: numeric("TOTAL_PRODUCT_AMOUNT_LC", { precision: 15, scale: 4 }),
  FINAL_SALES_AMOUNT_LC: numeric("FINAL_SALES_AMOUNT_LC", { precision: 15, scale: 4 }),
  TEST_DESC: varchar("TEST_DESC", { length: 50 }),
  REMARKS: varchar("REMARKS", { length: 2000 }),
  STATUS_ENTRY: varchar("STATUS_ENTRY", { length: 20 }),
  CREATED_BY: varchar("CREATED_BY", { length: 50 }),
  CREATED_DATE: timestamp("CREATED_DATE", { mode: "date" }),
  CREATED_MAC_ADDRESS: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
  MODIFIED_BY: varchar("MODIFIED_BY", { length: 50 }),
  MODIFIED_DATE: timestamp("MODIFIED_DATE", { mode: "date" }),
  MODIFIED_MAC_ADDRESS: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
  SUBMITTED_BY: varchar("SUBMITTED_BY", { length: 50 }),
  SUBMITTED_DATE: timestamp("SUBMITTED_DATE", { mode: "date" }),
  SUBMITTED_MAC_ADDRESS: varchar("SUBMITTED_MAC_ADDRESS", { length: 50 }),
});

export const TBL_TAX_INVOICE_DTL = StoEntriesSchema.table("TBL_TAX_INVOICE_DTL", {
  SNO: serial("SNO").primaryKey(),
  TAX_INVOICE_REF_NO: varchar("TAX_INVOICE_REF_NO", { length: 50 }).references(() => TBL_TAX_INVOICE_HDR.TAX_INVOICE_REF_NO),
  DELIVERY_NOTE_DTL_SNO: integer("DELIVERY_NOTE_DTL_SNO"),
  PO_DTL_SNO: integer("PO_DTL_SNO").references(() => TBL_PURCHASE_ORDER_DTL.SNO),
  PO_REF_NO: varchar("PO_REF_NO", { length: 50 }).references(() => TBL_PURCHASE_ORDER_HDR.PO_REF_NO),
  MAIN_CATEGORY_ID: integer("MAIN_CATEGORY_ID").references(() => StoMasterSchema.TBL_PRODUCT_MAIN_CATEGORY_MASTER.MAIN_CATEGORY_ID),
  SUB_CATEGORY_ID: integer("SUB_CATEGORY_ID").references(() => StoMasterSchema.TBL_PRODUCT_SUB_CATEGORY_MASTER.SUB_CATEGORY_ID),
  PRODUCT_ID: integer("PRODUCT_ID").references(() => StoMasterSchema.TBL_PRODUCT_MASTER.PRODUCT_ID),
  SALES_RATE_PER_QTY: numeric("SALES_RATE_PER_QTY", { precision: 15, scale: 6 }),
  QTY_PER_PACKING: numeric("QTY_PER_PACKING", { precision: 15, scale: 2 }),
  DELIVERY_QTY: numeric("DELIVERY_QTY", { precision: 15, scale: 4 }),
  INVOICE_QTY: numeric("INVOICE_QTY", { precision: 15, scale: 4 }),
  UOM: varchar("UOM", { length: 50 }),
  TOTAL_PACKING: numeric("TOTAL_PACKING", { precision: 15, scale: 4 }),
  ALTERNATE_UOM: varchar("ALTERNATE_UOM", { length: 500 }),
  TOTAL_PRODUCT_AMOUNT: numeric("TOTAL_PRODUCT_AMOUNT", { precision: 15, scale: 4 }),
  VAT_PERCENTAGE: numeric("VAT_PERCENTAGE", { precision: 15, scale: 2 }),
  VAT_AMOUNT: numeric("VAT_AMOUNT", { precision: 15, scale: 4 }),
  FINAL_SALES_AMOUNT: numeric("FINAL_SALES_AMOUNT", { precision: 15, scale: 4 }),
  TOTAL_PRODUCT_AMOUNT_LC: numeric("TOTAL_PRODUCT_AMOUNT_LC", { precision: 15, scale: 4 }),
  FINAL_SALES_AMOUNT_LC: numeric("FINAL_SALES_AMOUNT_LC", { precision: 15, scale: 4 }),
  REMARKS: varchar("REMARKS", { length: 2000 }),
  STATUS_ENTRY: varchar("STATUS_ENTRY", { length: 20 }),
  CREATED_BY: varchar("CREATED_BY", { length: 50 }),
  CREATED_DATE: timestamp("CREATED_DATE", { mode: "date" }),
  CREATED_MAC_ADDRESS: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
  MODIFIED_BY: varchar("MODIFIED_BY", { length: 50 }),
  MODIFIED_DATE: timestamp("MODIFIED_DATE", { mode: "date" }),
  MODIFIED_MAC_ADDRESS: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
});

export const TBL_CUSTOMER_RECEIPT_HDR = StoEntriesSchema.table("TBL_CUSTOMER_RECEIPT_HDR", {
  SNO: bigserial("SNO", { mode: "number" }),
  RECEIPT_REF_NO: varchar("RECEIPT_REF_NO", { length: 50 }).primaryKey(),
  RECEIPT_DATE: timestamp("RECEIPT_DATE", { mode: "date" }),
  PAYMENT_TYPE: varchar("PAYMENT_TYPE", { length: 50 }),
  COMPANY_ID: integer("COMPANY_ID").references(() => StoMasterSchema.TBL_COMPANY_MASTER.Company_Id),
  CUSTOMER_ID: integer("CUSTOMER_ID").references(() => StoMasterSchema.TBL_CUSTOMER_MASTER.Customer_Id),
  PAYMENT_MODE_ID: integer("PAYMENT_MODE_ID").references(() => StoMasterSchema.TBL_CUSTOMER_PAYMENT_MODE_MASTER.PAYMENT_MODE_ID),
  CR_BANK_CASH_ID: integer("CR_BANK_CASH_ID").references(() => StoMasterSchema.TBL_BANK_MASTER.BANK_ID),
  CR_ACCOUNT_ID: integer("CR_ACCOUNT_ID").references(() => StoMasterSchema.TBL_COMPANY_BANK_ACCOUNT_MASTER.Account_Id),
  DR_BANK_CASH_ID: integer("DR_BANK_CASH_ID").references(() => StoMasterSchema.TBL_BANK_MASTER.BANK_ID),
  TRANSACTION_REF_NO: varchar("TRANSACTION_REF_NO", { length: 100 }),
  TRANSACTION_DATE: timestamp("TRANSACTION_DATE", { mode: "date" }),
  CURRENCY_ID: integer("CURRENCY_ID").references(() => StoMasterSchema.TBL_CURRENCY_MASTER.CURRENCY_ID),
  RECEIPT_AMOUNT: numeric("RECEIPT_AMOUNT", { precision: 15, scale: 2 }),
  EXCHANGE_RATE: numeric("EXCHANGE_RATE", { precision: 15, scale: 2 }),
  RECEIPT_AMOUNT_LC: numeric("RECEIPT_AMOUNT_LC", { precision: 15, scale: 2 }),
  REMARKS: varchar("REMARKS", { length: 1000 }),
  STATUS_ENTRY: varchar("STATUS_ENTRY", { length: 20 }),
  CREATED_BY: varchar("CREATED_BY", { length: 50 }),
  CREATED_DATE: timestamp("CREATED_DATE", { mode: "date" }),
  CREATED_MAC_ADDRESS: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
  MODIFIED_BY: varchar("MODIFIED_BY", { length: 50 }),
  MODIFIED_DATE: timestamp("MODIFIED_DATE", { mode: "date" }),
  MODIFIED_MAC_ADDRESS: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
  Submitted_By: varchar("Submitted_By", { length: 50 }),
  Submitted_Date: timestamp("Submitted_Date", { mode: "date" }),
  Submitted_IP_Address: varchar("Submitted_IP_Address", { length: 50 }),
  Tally_Ref_No: varchar("Tally_Ref_No", { length: 50 }),
  Tally_Sync_Status: varchar("Tally_Sync_Status", { length: 20 }),
  Tally_Sync_Date: timestamp("Tally_Sync_Date", { mode: "date" }),
  Tally_Sync_Person_Name: varchar("Tally_Sync_Person_Name", { length: 50 }),
});

export const TBL_CUSTOMER_RECEIPT_INVOICE_DTL = StoEntriesSchema.table("TBL_CUSTOMER_RECEIPT_INVOICE_DTL", {
  SNO: bigserial("SNO", { mode: "number" }).primaryKey(),
  RECEIPT_REF_NO: varchar("RECEIPT_REF_NO", { length: 50 }).references(() => TBL_CUSTOMER_RECEIPT_HDR.RECEIPT_REF_NO),
  TAX_INVOICE_REF_NO: varchar("TAX_INVOICE_REF_NO", { length: 50 }).references(() => TBL_TAX_INVOICE_HDR.TAX_INVOICE_REF_NO),
  ACTUAL_INVOICE_AMOUNT: numeric("ACTUAL_INVOICE_AMOUNT", { precision: 15, scale: 2 }),
  ALREADY_PAID_AMOUNT: numeric("ALREADY_PAID_AMOUNT", { precision: 15, scale: 2 }),
  OUTSTANDING_INVOICE_AMOUNT: numeric("OUTSTANDING_INVOICE_AMOUNT", { precision: 15, scale: 2 }),
  RECEIPT_INVOICE_ADJUST_AMOUNT: numeric("RECEIPT_INVOICE_ADJUST_AMOUNT", { precision: 15, scale: 2 }),
  REMARKS: varchar("REMARKS", { length: 1000 }),
  STATUS_ENTRY: varchar("STATUS_ENTRY", { length: 20 }),
  CREATED_BY: varchar("CREATED_BY", { length: 50 }),
  CREATED_DATE: timestamp("CREATED_DATE", { mode: "date" }),
  CREATED_MAC_ADDRESS: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
  MODIFIED_BY: varchar("MODIFIED_BY", { length: 50 }),
  MODIFIED_DATE: timestamp("MODIFIED_DATE", { mode: "date" }),
  MODIFIED_MAC_ADDRESS: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
});



export const TBL_PURCHASE_ORDER_HDRRelations = relations(TBL_PURCHASE_ORDER_HDR, ({ one }) => ({
  company_master: one(StoMasterSchema.TBL_COMPANY_MASTER, { fields: [TBL_PURCHASE_ORDER_HDR.COMPANY_ID], references: [StoMasterSchema.TBL_COMPANY_MASTER.Company_Id] }),
  supplier_master: one(StoMasterSchema.TBL_SUPPLIER_MASTER, { fields: [TBL_PURCHASE_ORDER_HDR.SUPPLIER_ID], references: [StoMasterSchema.TBL_SUPPLIER_MASTER.Supplier_Id] }),
  store_master: one(StoMasterSchema.TBL_STORE_MASTER, { fields: [TBL_PURCHASE_ORDER_HDR.PO_STORE_ID], references: [StoMasterSchema.TBL_STORE_MASTER.Store_Id] }),
  payment_term_master: one(StoMasterSchema.TBL_PAYMENT_TERM_MASTER, { fields: [TBL_PURCHASE_ORDER_HDR.PAYMENT_TERM_ID], references: [StoMasterSchema.TBL_PAYMENT_TERM_MASTER.PAYMENT_TERM_ID] }),
  currency_master: one(StoMasterSchema.TBL_CURRENCY_MASTER, { fields: [TBL_PURCHASE_ORDER_HDR.CURRENCY_ID], references: [StoMasterSchema.TBL_CURRENCY_MASTER.CURRENCY_ID] }),
}));


export const TBL_PURCHASE_ORDER_DTLRelations = relations(TBL_PURCHASE_ORDER_DTL, ({ one }) => ({
  purchase_order_hdr: one(TBL_PURCHASE_ORDER_HDR, { fields: [TBL_PURCHASE_ORDER_DTL.PO_REF_NO], references: [TBL_PURCHASE_ORDER_HDR.PO_REF_NO] }),
  store_master: one(StoMasterSchema.TBL_STORE_MASTER, { fields: [TBL_PURCHASE_ORDER_DTL.REQUEST_STORE_ID], references: [StoMasterSchema.TBL_STORE_MASTER.Store_Id] }),
  product_main_category_master: one(StoMasterSchema.TBL_PRODUCT_MAIN_CATEGORY_MASTER, { fields: [TBL_PURCHASE_ORDER_DTL.MAIN_CATEGORY_ID], references: [StoMasterSchema.TBL_PRODUCT_MAIN_CATEGORY_MASTER.MAIN_CATEGORY_ID] }),
  product_sub_category_master: one(StoMasterSchema.TBL_PRODUCT_SUB_CATEGORY_MASTER, { fields: [TBL_PURCHASE_ORDER_DTL.SUB_CATEGORY_ID], references: [StoMasterSchema.TBL_PRODUCT_SUB_CATEGORY_MASTER.SUB_CATEGORY_ID] }),
  product_master: one(StoMasterSchema.TBL_PRODUCT_MASTER, { fields: [TBL_PURCHASE_ORDER_DTL.PRODUCT_ID], references: [StoMasterSchema.TBL_PRODUCT_MASTER.PRODUCT_ID] }),
}));


export const TBL_PURCHASE_ORDER_ADDITIONAL_COST_DETAILSRelations = relations(TBL_PURCHASE_ORDER_ADDITIONAL_COST_DETAILS, ({ one }) => ({
  purchase_order_hdr: one(TBL_PURCHASE_ORDER_HDR, { fields: [TBL_PURCHASE_ORDER_ADDITIONAL_COST_DETAILS.PO_REF_NO], references: [TBL_PURCHASE_ORDER_HDR.PO_REF_NO] }),
  additional_cost_type_master: one(StoMasterSchema.TBL_ADDITIONAL_COST_TYPE_MASTER, { fields: [TBL_PURCHASE_ORDER_ADDITIONAL_COST_DETAILS.ADDITIONAL_COST_TYPE_ID], references: [StoMasterSchema.TBL_ADDITIONAL_COST_TYPE_MASTER.ADDITIONAL_COST_TYPE_ID] }),
}));


export const TBL_PURCHASE_ORDER_FILES_UPLOADRelations = relations(TBL_PURCHASE_ORDER_FILES_UPLOAD, ({ one }) => ({
  purchase_order_hdr: one(TBL_PURCHASE_ORDER_HDR, { fields: [TBL_PURCHASE_ORDER_FILES_UPLOAD.PO_REF_NO], references: [TBL_PURCHASE_ORDER_HDR.PO_REF_NO] }),
}));


export const TBL_PURCHASE_ORDER_CONVERSATION_DTLRelations = relations(TBL_PURCHASE_ORDER_CONVERSATION_DTL, ({ one }) => ({
  purchase_order_hdr: one(TBL_PURCHASE_ORDER_HDR, { fields: [TBL_PURCHASE_ORDER_CONVERSATION_DTL.PO_REF_NO], references: [TBL_PURCHASE_ORDER_HDR.PO_REF_NO] }),
}));


export const TBL_GOODS_INWARD_GRN_HDRRelations = relations(TBL_GOODS_INWARD_GRN_HDR, ({ one }) => ({
  company_master: one(StoMasterSchema.TBL_COMPANY_MASTER, { fields: [TBL_GOODS_INWARD_GRN_HDR.COMPANY_ID], references: [StoMasterSchema.TBL_COMPANY_MASTER.Company_Id] }),
  store_master: one(StoMasterSchema.TBL_STORE_MASTER, { fields: [TBL_GOODS_INWARD_GRN_HDR.SOURCE_STORE_ID], references: [StoMasterSchema.TBL_STORE_MASTER.Store_Id] }),
  store_master_grn_store_id: one(StoMasterSchema.TBL_STORE_MASTER, { fields: [TBL_GOODS_INWARD_GRN_HDR.GRN_STORE_ID], references: [StoMasterSchema.TBL_STORE_MASTER.Store_Id] }),
  supplier_master: one(StoMasterSchema.TBL_SUPPLIER_MASTER, { fields: [TBL_GOODS_INWARD_GRN_HDR.SUPPLIER_ID], references: [StoMasterSchema.TBL_SUPPLIER_MASTER.Supplier_Id] }),
  purchase_order_hdr: one(TBL_PURCHASE_ORDER_HDR, { fields: [TBL_GOODS_INWARD_GRN_HDR.PO_REF_NO], references: [TBL_PURCHASE_ORDER_HDR.PO_REF_NO] }),
}));


export const TBL_GOODS_INWARD_GRN_DTLRelations = relations(TBL_GOODS_INWARD_GRN_DTL, ({ one }) => ({
  goods_inward_grn_hdr: one(TBL_GOODS_INWARD_GRN_HDR, { fields: [TBL_GOODS_INWARD_GRN_DTL.GRN_REF_NO], references: [TBL_GOODS_INWARD_GRN_HDR.GRN_REF_NO] }),
  purchase_order_dtl: one(TBL_PURCHASE_ORDER_DTL, { fields: [TBL_GOODS_INWARD_GRN_DTL.PO_DTL_SNO], references: [TBL_PURCHASE_ORDER_DTL.SNO] }),
  product_main_category_master: one(StoMasterSchema.TBL_PRODUCT_MAIN_CATEGORY_MASTER, { fields: [TBL_GOODS_INWARD_GRN_DTL.MAIN_CATEGORY_ID], references: [StoMasterSchema.TBL_PRODUCT_MAIN_CATEGORY_MASTER.MAIN_CATEGORY_ID] }),
  product_sub_category_master: one(StoMasterSchema.TBL_PRODUCT_SUB_CATEGORY_MASTER, { fields: [TBL_GOODS_INWARD_GRN_DTL.SUB_CATEGORY_ID], references: [StoMasterSchema.TBL_PRODUCT_SUB_CATEGORY_MASTER.SUB_CATEGORY_ID] }),
  product_master: one(StoMasterSchema.TBL_PRODUCT_MASTER, { fields: [TBL_GOODS_INWARD_GRN_DTL.PRODUCT_ID], references: [StoMasterSchema.TBL_PRODUCT_MASTER.PRODUCT_ID] }),
}));


export const TBL_PURCHASE_INVOICE_HDRRelations = relations(TBL_PURCHASE_INVOICE_HDR, ({ one }) => ({
  company_master: one(StoMasterSchema.TBL_COMPANY_MASTER, { fields: [TBL_PURCHASE_INVOICE_HDR.COMPANY_ID], references: [StoMasterSchema.TBL_COMPANY_MASTER.Company_Id] }),
  purchase_order_hdr: one(TBL_PURCHASE_ORDER_HDR, { fields: [TBL_PURCHASE_INVOICE_HDR.PO_REF_NO], references: [TBL_PURCHASE_ORDER_HDR.PO_REF_NO] }),
  supplier_master: one(StoMasterSchema.TBL_SUPPLIER_MASTER, { fields: [TBL_PURCHASE_INVOICE_HDR.SUPPLIER_ID], references: [StoMasterSchema.TBL_SUPPLIER_MASTER.Supplier_Id] }),
  store_master: one(StoMasterSchema.TBL_STORE_MASTER, { fields: [TBL_PURCHASE_INVOICE_HDR.STORE_ID], references: [StoMasterSchema.TBL_STORE_MASTER.Store_Id] }),
  payment_term_master: one(StoMasterSchema.TBL_PAYMENT_TERM_MASTER, { fields: [TBL_PURCHASE_INVOICE_HDR.PAYMENT_TERM_ID], references: [StoMasterSchema.TBL_PAYMENT_TERM_MASTER.PAYMENT_TERM_ID] }),
  currency_master: one(StoMasterSchema.TBL_CURRENCY_MASTER, { fields: [TBL_PURCHASE_INVOICE_HDR.CURRENCY_ID], references: [StoMasterSchema.TBL_CURRENCY_MASTER.CURRENCY_ID] }),
}));


export const TBL_PURCHASE_INVOICE_DTLRelations = relations(TBL_PURCHASE_INVOICE_DTL, ({ one }) => ({
  purchase_invoice_hdr: one(TBL_PURCHASE_INVOICE_HDR, { fields: [TBL_PURCHASE_INVOICE_DTL.PURCHASE_INVOICE_REF_NO], references: [TBL_PURCHASE_INVOICE_HDR.PURCHASE_INVOICE_REF_NO] }),
  goods_inward_grn_hdr: one(TBL_GOODS_INWARD_GRN_HDR, { fields: [TBL_PURCHASE_INVOICE_DTL.GRN_REF_NO], references: [TBL_GOODS_INWARD_GRN_HDR.GRN_REF_NO] }),
  product_main_category_master: one(StoMasterSchema.TBL_PRODUCT_MAIN_CATEGORY_MASTER, { fields: [TBL_PURCHASE_INVOICE_DTL.MAIN_CATEGORY_ID], references: [StoMasterSchema.TBL_PRODUCT_MAIN_CATEGORY_MASTER.MAIN_CATEGORY_ID] }),
  product_sub_category_master: one(StoMasterSchema.TBL_PRODUCT_SUB_CATEGORY_MASTER, { fields: [TBL_PURCHASE_INVOICE_DTL.SUB_CATEGORY_ID], references: [StoMasterSchema.TBL_PRODUCT_SUB_CATEGORY_MASTER.SUB_CATEGORY_ID] }),
  product_master: one(StoMasterSchema.TBL_PRODUCT_MASTER, { fields: [TBL_PURCHASE_INVOICE_DTL.PRODUCT_ID], references: [StoMasterSchema.TBL_PRODUCT_MASTER.PRODUCT_ID] }),
}));


export const TBL_PURCHASE_INVOICE_ADDITIONAL_COST_DETAILSRelations = relations(TBL_PURCHASE_INVOICE_ADDITIONAL_COST_DETAILS, ({ one }) => ({
  purchase_invoice_hdr: one(TBL_PURCHASE_INVOICE_HDR, { fields: [TBL_PURCHASE_INVOICE_ADDITIONAL_COST_DETAILS.PURCHASE_INVOICE_NO], references: [TBL_PURCHASE_INVOICE_HDR.PURCHASE_INVOICE_REF_NO] }),
  additional_cost_type_master: one(StoMasterSchema.TBL_ADDITIONAL_COST_TYPE_MASTER, { fields: [TBL_PURCHASE_INVOICE_ADDITIONAL_COST_DETAILS.ADDITIONAL_COST_TYPE_ID], references: [StoMasterSchema.TBL_ADDITIONAL_COST_TYPE_MASTER.ADDITIONAL_COST_TYPE_ID] }),
}));


export const TBL_PURCHASE_INVOICE_FILES_UPLOADRelations = relations(TBL_PURCHASE_INVOICE_FILES_UPLOAD, ({ one }) => ({
  purchase_invoice_hdr: one(TBL_PURCHASE_INVOICE_HDR, { fields: [TBL_PURCHASE_INVOICE_FILES_UPLOAD.PURCHASE_INVOICE_REF_NO], references: [TBL_PURCHASE_INVOICE_HDR.PURCHASE_INVOICE_REF_NO] }),
}));


export const TBL_EXPENSE_HDRRelations = relations(TBL_EXPENSE_HDR, ({ one }) => ({
  company_master: one(StoMasterSchema.TBL_COMPANY_MASTER, { fields: [TBL_EXPENSE_HDR.COMPANY_ID], references: [StoMasterSchema.TBL_COMPANY_MASTER.Company_Id] }),
  purchase_order_hdr: one(TBL_PURCHASE_ORDER_HDR, { fields: [TBL_EXPENSE_HDR.PO_REF_NO], references: [TBL_PURCHASE_ORDER_HDR.PO_REF_NO] }),
  accounts_head_master: one(StoMasterSchema.TBL_ACCOUNTS_HEAD_MASTER, { fields: [TBL_EXPENSE_HDR.ACCOUNT_HEAD_ID], references: [StoMasterSchema.TBL_ACCOUNTS_HEAD_MASTER.ACCOUNT_HEAD_ID] }),
  supplier_master: one(StoMasterSchema.TBL_SUPPLIER_MASTER, { fields: [TBL_EXPENSE_HDR.EXPENSE_SUPPLIER_ID], references: [StoMasterSchema.TBL_SUPPLIER_MASTER.Supplier_Id] }),
  currency_master: one(StoMasterSchema.TBL_CURRENCY_MASTER, { fields: [TBL_EXPENSE_HDR.CURRENCY_ID], references: [StoMasterSchema.TBL_CURRENCY_MASTER.CURRENCY_ID] }),
}));


export const TBL_EXPENSE_DTLRelations = relations(TBL_EXPENSE_DTL, ({ one }) => ({
  expense_hdr: one(TBL_EXPENSE_HDR, { fields: [TBL_EXPENSE_DTL.EXPENSE_REF_NO], references: [TBL_EXPENSE_HDR.EXPENSE_REF_NO] }),
  purchase_order_hdr: one(TBL_PURCHASE_ORDER_HDR, { fields: [TBL_EXPENSE_DTL.PO_REF_NO], references: [TBL_PURCHASE_ORDER_HDR.PO_REF_NO] }),
  purchase_order_dtl: one(TBL_PURCHASE_ORDER_DTL, { fields: [TBL_EXPENSE_DTL.PO_DTL_SNO], references: [TBL_PURCHASE_ORDER_DTL.SNO] }),
  product_master: one(StoMasterSchema.TBL_PRODUCT_MASTER, { fields: [TBL_EXPENSE_DTL.PRODUCT_ID], references: [StoMasterSchema.TBL_PRODUCT_MASTER.PRODUCT_ID] }),
}));


export const TBL_SALES_ORDER_HDRRelations = relations(TBL_SALES_ORDER_HDR, ({ one }) => ({
  company_master: one(StoMasterSchema.TBL_COMPANY_MASTER, { fields: [TBL_SALES_ORDER_HDR.COMPANY_ID], references: [StoMasterSchema.TBL_COMPANY_MASTER.Company_Id] }),
  store_master: one(StoMasterSchema.TBL_STORE_MASTER, { fields: [TBL_SALES_ORDER_HDR.STORE_ID], references: [StoMasterSchema.TBL_STORE_MASTER.Store_Id] }),
  customer_master: one(StoMasterSchema.TBL_CUSTOMER_MASTER, { fields: [TBL_SALES_ORDER_HDR.CUSTOMER_ID], references: [StoMasterSchema.TBL_CUSTOMER_MASTER.Customer_Id] }),
  billing_location_master: one(StoMasterSchema.TBL_BILLING_LOCATION_MASTER, { fields: [TBL_SALES_ORDER_HDR.BILLING_LOCATION_ID], references: [StoMasterSchema.TBL_BILLING_LOCATION_MASTER.Billing_Location_Id] }),
  sales_person_master: one(StoMasterSchema.TBL_SALES_PERSON_MASTER, { fields: [TBL_SALES_ORDER_HDR.SALES_PERSON_EMP_ID], references: [StoMasterSchema.TBL_SALES_PERSON_MASTER.Sales_Person_ID] }),
  currency_master: one(StoMasterSchema.TBL_CURRENCY_MASTER, { fields: [TBL_SALES_ORDER_HDR.CURRENCY_ID], references: [StoMasterSchema.TBL_CURRENCY_MASTER.CURRENCY_ID] }),
}));


export const TBL_SALES_ORDER_DTLRelations = relations(TBL_SALES_ORDER_DTL, ({ one }) => ({
  sales_order_hdr: one(TBL_SALES_ORDER_HDR, { fields: [TBL_SALES_ORDER_DTL.SALES_ORDER_REF_NO], references: [TBL_SALES_ORDER_HDR.SALES_ORDER_REF_NO] }),
  product_main_category_master: one(StoMasterSchema.TBL_PRODUCT_MAIN_CATEGORY_MASTER, { fields: [TBL_SALES_ORDER_DTL.MAIN_CATEGORY_ID], references: [StoMasterSchema.TBL_PRODUCT_MAIN_CATEGORY_MASTER.MAIN_CATEGORY_ID] }),
  product_sub_category_master: one(StoMasterSchema.TBL_PRODUCT_SUB_CATEGORY_MASTER, { fields: [TBL_SALES_ORDER_DTL.SUB_CATEGORY_ID], references: [StoMasterSchema.TBL_PRODUCT_SUB_CATEGORY_MASTER.SUB_CATEGORY_ID] }),
  product_master: one(StoMasterSchema.TBL_PRODUCT_MASTER, { fields: [TBL_SALES_ORDER_DTL.PRODUCT_ID], references: [StoMasterSchema.TBL_PRODUCT_MASTER.PRODUCT_ID] }),
  purchase_order_hdr: one(TBL_PURCHASE_ORDER_HDR, { fields: [TBL_SALES_ORDER_DTL.PO_REF_NO], references: [TBL_PURCHASE_ORDER_HDR.PO_REF_NO] }),
  purchase_order_dtl: one(TBL_PURCHASE_ORDER_DTL, { fields: [TBL_SALES_ORDER_DTL.PO_DTL_SNO], references: [TBL_PURCHASE_ORDER_DTL.SNO] }),
}));


export const TBL_DELIVERY_NOTE_HDRRelations = relations(TBL_DELIVERY_NOTE_HDR, ({ one }) => ({
  company_master: one(StoMasterSchema.TBL_COMPANY_MASTER, { fields: [TBL_DELIVERY_NOTE_HDR.COMPANY_ID], references: [StoMasterSchema.TBL_COMPANY_MASTER.Company_Id] }),
  store_master: one(StoMasterSchema.TBL_STORE_MASTER, { fields: [TBL_DELIVERY_NOTE_HDR.FROM_STORE_ID], references: [StoMasterSchema.TBL_STORE_MASTER.Store_Id] }),
  store_master_to_store_id: one(StoMasterSchema.TBL_STORE_MASTER, { fields: [TBL_DELIVERY_NOTE_HDR.TO_STORE_ID], references: [StoMasterSchema.TBL_STORE_MASTER.Store_Id] }),
  customer_master: one(StoMasterSchema.TBL_CUSTOMER_MASTER, { fields: [TBL_DELIVERY_NOTE_HDR.CUSTOMER_ID], references: [StoMasterSchema.TBL_CUSTOMER_MASTER.Customer_Id] }),
  currency_master: one(StoMasterSchema.TBL_CURRENCY_MASTER, { fields: [TBL_DELIVERY_NOTE_HDR.CURRENCY_ID], references: [StoMasterSchema.TBL_CURRENCY_MASTER.CURRENCY_ID] }),
}));


export const TBL_DELIVERY_NOTE_DTLRelations = relations(TBL_DELIVERY_NOTE_DTL, ({ one }) => ({
  delivery_note_hdr: one(TBL_DELIVERY_NOTE_HDR, { fields: [TBL_DELIVERY_NOTE_DTL.DELIVERY_NOTE_REF_NO], references: [TBL_DELIVERY_NOTE_HDR.DELIVERY_NOTE_REF_NO] }),
  purchase_order_dtl: one(TBL_PURCHASE_ORDER_DTL, { fields: [TBL_DELIVERY_NOTE_DTL.PO_DTL_SNO], references: [TBL_PURCHASE_ORDER_DTL.SNO] }),
  purchase_order_hdr: one(TBL_PURCHASE_ORDER_HDR, { fields: [TBL_DELIVERY_NOTE_DTL.PO_REF_NO], references: [TBL_PURCHASE_ORDER_HDR.PO_REF_NO] }),
  product_main_category_master: one(StoMasterSchema.TBL_PRODUCT_MAIN_CATEGORY_MASTER, { fields: [TBL_DELIVERY_NOTE_DTL.MAIN_CATEGORY_ID], references: [StoMasterSchema.TBL_PRODUCT_MAIN_CATEGORY_MASTER.MAIN_CATEGORY_ID] }),
  product_sub_category_master: one(StoMasterSchema.TBL_PRODUCT_SUB_CATEGORY_MASTER, { fields: [TBL_DELIVERY_NOTE_DTL.SUB_CATEGORY_ID], references: [StoMasterSchema.TBL_PRODUCT_SUB_CATEGORY_MASTER.SUB_CATEGORY_ID] }),
  product_master: one(StoMasterSchema.TBL_PRODUCT_MASTER, { fields: [TBL_DELIVERY_NOTE_DTL.PRODUCT_ID], references: [StoMasterSchema.TBL_PRODUCT_MASTER.PRODUCT_ID] }),
}));


export const TBL_TAX_INVOICE_HDRRelations = relations(TBL_TAX_INVOICE_HDR, ({ one }) => ({
  company_master: one(StoMasterSchema.TBL_COMPANY_MASTER, { fields: [TBL_TAX_INVOICE_HDR.COMPANY_ID], references: [StoMasterSchema.TBL_COMPANY_MASTER.Company_Id] }),
  store_master: one(StoMasterSchema.TBL_STORE_MASTER, { fields: [TBL_TAX_INVOICE_HDR.FROM_STORE_ID], references: [StoMasterSchema.TBL_STORE_MASTER.Store_Id] }),
  delivery_note_hdr: one(TBL_DELIVERY_NOTE_HDR, { fields: [TBL_TAX_INVOICE_HDR.DELIVERY_NOTE_REF_NO], references: [TBL_DELIVERY_NOTE_HDR.DELIVERY_NOTE_REF_NO] }),
  customer_master: one(StoMasterSchema.TBL_CUSTOMER_MASTER, { fields: [TBL_TAX_INVOICE_HDR.CUSTOMER_ID], references: [StoMasterSchema.TBL_CUSTOMER_MASTER.Customer_Id] }),
  currency_master: one(StoMasterSchema.TBL_CURRENCY_MASTER, { fields: [TBL_TAX_INVOICE_HDR.CURRENCY_ID], references: [StoMasterSchema.TBL_CURRENCY_MASTER.CURRENCY_ID] }),
}));


export const TBL_TAX_INVOICE_DTLRelations = relations(TBL_TAX_INVOICE_DTL, ({ one }) => ({
  tax_invoice_hdr: one(TBL_TAX_INVOICE_HDR, { fields: [TBL_TAX_INVOICE_DTL.TAX_INVOICE_REF_NO], references: [TBL_TAX_INVOICE_HDR.TAX_INVOICE_REF_NO] }),
  purchase_order_dtl: one(TBL_PURCHASE_ORDER_DTL, { fields: [TBL_TAX_INVOICE_DTL.PO_DTL_SNO], references: [TBL_PURCHASE_ORDER_DTL.SNO] }),
  purchase_order_hdr: one(TBL_PURCHASE_ORDER_HDR, { fields: [TBL_TAX_INVOICE_DTL.PO_REF_NO], references: [TBL_PURCHASE_ORDER_HDR.PO_REF_NO] }),
  product_main_category_master: one(StoMasterSchema.TBL_PRODUCT_MAIN_CATEGORY_MASTER, { fields: [TBL_TAX_INVOICE_DTL.MAIN_CATEGORY_ID], references: [StoMasterSchema.TBL_PRODUCT_MAIN_CATEGORY_MASTER.MAIN_CATEGORY_ID] }),
  product_sub_category_master: one(StoMasterSchema.TBL_PRODUCT_SUB_CATEGORY_MASTER, { fields: [TBL_TAX_INVOICE_DTL.SUB_CATEGORY_ID], references: [StoMasterSchema.TBL_PRODUCT_SUB_CATEGORY_MASTER.SUB_CATEGORY_ID] }),
  product_master: one(StoMasterSchema.TBL_PRODUCT_MASTER, { fields: [TBL_TAX_INVOICE_DTL.PRODUCT_ID], references: [StoMasterSchema.TBL_PRODUCT_MASTER.PRODUCT_ID] }),
}));


export const TBL_CUSTOMER_RECEIPT_HDRRelations = relations(TBL_CUSTOMER_RECEIPT_HDR, ({ one }) => ({
  company_master: one(StoMasterSchema.TBL_COMPANY_MASTER, { fields: [TBL_CUSTOMER_RECEIPT_HDR.COMPANY_ID], references: [StoMasterSchema.TBL_COMPANY_MASTER.Company_Id] }),
  customer_master: one(StoMasterSchema.TBL_CUSTOMER_MASTER, { fields: [TBL_CUSTOMER_RECEIPT_HDR.CUSTOMER_ID], references: [StoMasterSchema.TBL_CUSTOMER_MASTER.Customer_Id] }),
  customer_payment_mode_master: one(StoMasterSchema.TBL_CUSTOMER_PAYMENT_MODE_MASTER, { fields: [TBL_CUSTOMER_RECEIPT_HDR.PAYMENT_MODE_ID], references: [StoMasterSchema.TBL_CUSTOMER_PAYMENT_MODE_MASTER.PAYMENT_MODE_ID] }),
  bank_master: one(StoMasterSchema.TBL_BANK_MASTER, { fields: [TBL_CUSTOMER_RECEIPT_HDR.CR_BANK_CASH_ID], references: [StoMasterSchema.TBL_BANK_MASTER.BANK_ID] }),
  company_bank_account_master: one(StoMasterSchema.TBL_COMPANY_BANK_ACCOUNT_MASTER, { fields: [TBL_CUSTOMER_RECEIPT_HDR.CR_ACCOUNT_ID], references: [StoMasterSchema.TBL_COMPANY_BANK_ACCOUNT_MASTER.Account_Id] }),
  bank_master_dr_bank_cash_id: one(StoMasterSchema.TBL_BANK_MASTER, { fields: [TBL_CUSTOMER_RECEIPT_HDR.DR_BANK_CASH_ID], references: [StoMasterSchema.TBL_BANK_MASTER.BANK_ID] }),
  currency_master: one(StoMasterSchema.TBL_CURRENCY_MASTER, { fields: [TBL_CUSTOMER_RECEIPT_HDR.CURRENCY_ID], references: [StoMasterSchema.TBL_CURRENCY_MASTER.CURRENCY_ID] }),
}));


export const TBL_CUSTOMER_RECEIPT_INVOICE_DTLRelations = relations(TBL_CUSTOMER_RECEIPT_INVOICE_DTL, ({ one }) => ({
  customer_receipt_hdr: one(TBL_CUSTOMER_RECEIPT_HDR, { fields: [TBL_CUSTOMER_RECEIPT_INVOICE_DTL.RECEIPT_REF_NO], references: [TBL_CUSTOMER_RECEIPT_HDR.RECEIPT_REF_NO] }),
  tax_invoice_hdr: one(TBL_TAX_INVOICE_HDR, { fields: [TBL_CUSTOMER_RECEIPT_INVOICE_DTL.TAX_INVOICE_REF_NO], references: [TBL_TAX_INVOICE_HDR.TAX_INVOICE_REF_NO] }),
}));

export const TBL_GOODS_FILES_UPLOAD = StoEntriesSchema.table("TBL_GOODS_FILES_UPLOAD", {
  SNO: integer("SNO").primaryKey().generatedAlwaysAsIdentity(),
  GRN_REF_NO: varchar("GRN_REF_NO", { length: 50 }).references(() => TBL_GOODS_INWARD_GRN_HDR.GRN_REF_NO),
  DOCUMENT_TYPE: varchar("DOCUMENT_TYPE", { length: 50 }),
  DESCRIPTION_DETAILS: varchar("DESCRIPTION_DETAILS", { length: 100 }),
  FILE_NAME: varchar("FILE_NAME", { length: 150 }),
  CONTENT_TYPE: varchar("CONTENT_TYPE", { length: 50 }),
  CONTENT_DATA: bytea("CONTENT_DATA"),
  REMARKS: varchar("REMARKS", { length: 1000 }),
  STATUS_MASTER: varchar("STATUS_MASTER", { length: 20 }),
  CREATED_BY: varchar("CREATED_BY", { length: 50 }),
  CREATED_DATE: timestamp("CREATED_DATE", { mode: "date" }),
  CREATED_IP_ADDRESS: varchar("CREATED_IP_ADDRESS", { length: 50 }),
  MODIFIED_BY: varchar("MODIFIED_BY", { length: 50 }),
  MODIFIED_DATE: timestamp("MODIFIED_DATE", { mode: "date" }),
  MODIFIED_IP_ADDRESS: varchar("MODIFIED_IP_ADDRESS", { length: 50 }),
});

export const TBL_EXPENSE_FILES_UPLOAD = StoEntriesSchema.table("TBL_EXPENSE_FILES_UPLOAD", {
  SNO: integer("SNO").primaryKey().generatedAlwaysAsIdentity(),
  EXPENSE_REF_NO: varchar("EXPENSE_REF_NO", { length: 50 }).references(() => TBL_EXPENSE_HDR.EXPENSE_REF_NO),
  DOCUMENT_TYPE: varchar("DOCUMENT_TYPE", { length: 50 }),
  DESCRIPTION_DETAILS: varchar("DESCRIPTION_DETAILS", { length: 100 }),
  FILE_NAME: varchar("FILE_NAME", { length: 150 }),
  CONTENT_TYPE: varchar("CONTENT_TYPE", { length: 50 }),
  CONTENT_DATA: bytea("CONTENT_DATA"),
  REMARKS: varchar("REMARKS", { length: 1000 }),
  STATUS_MASTER: varchar("STATUS_MASTER", { length: 20 }),
  CREATED_BY: varchar("CREATED_BY", { length: 50 }),
  CREATED_DATE: timestamp("CREATED_DATE", { mode: "date" }),
  CREATED_IP_ADDRESS: varchar("CREATED_IP_ADDRESS", { length: 50 }),
  MODIFIED_BY: varchar("MODIFIED_BY", { length: 50 }),
  MODIFIED_DATE: timestamp("MODIFIED_DATE", { mode: "date" }),
  MODIFIED_IP_ADDRESS: varchar("MODIFIED_IP_ADDRESS", { length: 50 }),
});

export const TBL_SALES_ORDER_FILES_UPLOAD = StoEntriesSchema.table("TBL_SALES_ORDER_FILES_UPLOAD", {
  SNO: integer("SNO").primaryKey().generatedAlwaysAsIdentity(),
  SALES_ORDER_REF_NO: varchar("SALES_ORDER_REF_NO", { length: 50 }).references(() => TBL_SALES_ORDER_HDR.SALES_ORDER_REF_NO),
  DOCUMENT_TYPE: varchar("DOCUMENT_TYPE", { length: 50 }),
  DESCRIPTION_DETAILS: varchar("DESCRIPTION_DETAILS", { length: 100 }),
  FILE_NAME: varchar("FILE_NAME", { length: 150 }),
  CONTENT_TYPE: varchar("CONTENT_TYPE", { length: 50 }),
  CONTENT_DATA: bytea("CONTENT_DATA"),
  REMARKS: varchar("REMARKS", { length: 1000 }),
  STATUS_MASTER: varchar("STATUS_MASTER", { length: 20 }),
  CREATED_BY: varchar("CREATED_BY", { length: 50 }),
  CREATED_DATE: timestamp("CREATED_DATE", { mode: "date" }),
  CREATED_IP_ADDRESS: varchar("CREATED_IP_ADDRESS", { length: 50 }),
  MODIFIED_BY: varchar("MODIFIED_BY", { length: 50 }),
  MODIFIED_DATE: timestamp("MODIFIED_DATE", { mode: "date" }),
  MODIFIED_IP_ADDRESS: varchar("MODIFIED_IP_ADDRESS", { length: 50 }),
});

export const TBL_DELIVERY_FILES_UPLOAD = StoEntriesSchema.table("TBL_DELIVERY_FILES_UPLOAD", {
  SNO: integer("SNO").primaryKey().generatedAlwaysAsIdentity(),
  DELIVERY_NOTE_REF_NO: varchar("DELIVERY_NOTE_REF_NO", { length: 50 }).references(() => TBL_DELIVERY_NOTE_HDR.DELIVERY_NOTE_REF_NO),
  DOCUMENT_TYPE: varchar("DOCUMENT_TYPE", { length: 50 }),
  DESCRIPTION_DETAILS: varchar("DESCRIPTION_DETAILS", { length: 100 }),
  FILE_NAME: varchar("FILE_NAME", { length: 150 }),
  CONTENT_TYPE: varchar("CONTENT_TYPE", { length: 50 }),
  CONTENT_DATA: bytea("CONTENT_DATA"),
  REMARKS: varchar("REMARKS", { length: 1000 }),
  STATUS_MASTER: varchar("STATUS_MASTER", { length: 20 }),
  CREATED_BY: varchar("CREATED_BY", { length: 50 }),
  CREATED_DATE: timestamp("CREATED_DATE", { mode: "date" }),
  CREATED_IP_ADDRESS: varchar("CREATED_IP_ADDRESS", { length: 50 }),
  MODIFIED_BY: varchar("MODIFIED_BY", { length: 50 }),
  MODIFIED_DATE: timestamp("MODIFIED_DATE", { mode: "date" }),
  MODIFIED_IP_ADDRESS: varchar("MODIFIED_IP_ADDRESS", { length: 50 }),
});

export const TBL_TAX_INVOICE_FILES_UPLOAD = StoEntriesSchema.table("TBL_TAX_INVOICE_FILES_UPLOAD", {
  SNO: integer("SNO").primaryKey().generatedAlwaysAsIdentity(),
  TAX_INVOICE_REF_NO: varchar("TAX_INVOICE_REF_NO", { length: 50 }).references(() => TBL_TAX_INVOICE_HDR.TAX_INVOICE_REF_NO),
  DOCUMENT_TYPE: varchar("DOCUMENT_TYPE", { length: 50 }),
  DESCRIPTION_DETAILS: varchar("DESCRIPTION_DETAILS", { length: 100 }),
  FILE_NAME: varchar("FILE_NAME", { length: 150 }),
  CONTENT_TYPE: varchar("CONTENT_TYPE", { length: 50 }),
  CONTENT_DATA: bytea("CONTENT_DATA"),
  REMARKS: varchar("REMARKS", { length: 1000 }),
  STATUS_MASTER: varchar("STATUS_MASTER", { length: 20 }),
  CREATED_BY: varchar("CREATED_BY", { length: 50 }),
  CREATED_DATE: timestamp("CREATED_DATE", { mode: "date" }),
  CREATED_IP_ADDRESS: varchar("CREATED_IP_ADDRESS", { length: 50 }),
  MODIFIED_BY: varchar("MODIFIED_BY", { length: 50 }),
  MODIFIED_DATE: timestamp("MODIFIED_DATE", { mode: "date" }),
  MODIFIED_IP_ADDRESS: varchar("MODIFIED_IP_ADDRESS", { length: 50 }),
});

export const TBL_CUSTOMER_RECEIPT_FILES_UPLOAD = StoEntriesSchema.table("TBL_CUSTOMER_RECEIPT_FILES_UPLOAD", {
  SNO: integer("SNO").primaryKey().generatedAlwaysAsIdentity(),
  RECEIPT_REF_NO: varchar("RECEIPT_REF_NO", { length: 50 }).references(() => TBL_CUSTOMER_RECEIPT_HDR.RECEIPT_REF_NO),
  DOCUMENT_TYPE: varchar("DOCUMENT_TYPE", { length: 50 }),
  DESCRIPTION_DETAILS: varchar("DESCRIPTION_DETAILS", { length: 100 }),
  FILE_NAME: varchar("FILE_NAME", { length: 150 }),
  CONTENT_TYPE: varchar("CONTENT_TYPE", { length: 50 }),
  CONTENT_DATA: bytea("CONTENT_DATA"),
  REMARKS: varchar("REMARKS", { length: 1000 }),
  STATUS_MASTER: varchar("STATUS_MASTER", { length: 20 }),
  CREATED_BY: varchar("CREATED_BY", { length: 50 }),
  CREATED_DATE: timestamp("CREATED_DATE", { mode: "date" }),
  CREATED_IP_ADDRESS: varchar("CREATED_IP_ADDRESS", { length: 50 }),
  MODIFIED_BY: varchar("MODIFIED_BY", { length: 50 }),
  MODIFIED_DATE: timestamp("MODIFIED_DATE", { mode: "date" }),
  MODIFIED_IP_ADDRESS: varchar("MODIFIED_IP_ADDRESS", { length: 50 }),
});

export const TBL_SALES_PROFORMA_HDR = StoEntriesSchema.table("TBL_SALES_PROFORMA_HDR", {
  SNO: serial("SNO"),
  SALES_PROFORMA_REF_NO: varchar("SALES_PROFORMA_REF_NO", { length: 50 }).primaryKey(),
  SALES_PROFORMA_DATE: timestamp("SALES_PROFORMA_DATE", { mode: "date" }),
  COMPANY_ID: integer("COMPANY_ID").references(() => StoMasterSchema.TBL_COMPANY_MASTER.Company_Id),
  STORE_ID: integer("STORE_ID").references(() => StoMasterSchema.TBL_STORE_MASTER.Store_Id),
  CUSTOMER_ID: integer("CUSTOMER_ID").references(() => StoMasterSchema.TBL_CUSTOMER_MASTER.Customer_Id),
  BILLING_LOCATION_ID: integer("BILLING_LOCATION_ID").references(() => StoMasterSchema.TBL_BILLING_LOCATION_MASTER.Billing_Location_Id),
  SALES_PERSON_EMP_ID: integer("SALES_PERSON_EMP_ID").references(() => StoMasterSchema.TBL_SALES_PERSON_MASTER.Sales_Person_ID),
  CURRENCY_ID: integer("CURRENCY_ID").references(() => StoMasterSchema.TBL_CURRENCY_MASTER.CURRENCY_ID),
  EXCHANGE_RATE: numeric("EXCHANGE_RATE", { precision: 15, scale: 2 }),
  TOTAL_PRODUCT_AMOUNT: numeric("TOTAL_PRODUCT_AMOUNT", { precision: 15, scale: 4 }),
  VAT_AMOUNT: numeric("VAT_AMOUNT", { precision: 15, scale: 4 }),
  FINAL_SALES_AMOUNT: numeric("FINAL_SALES_AMOUNT", { precision: 15, scale: 4 }),
  TOTAL_PRODUCT_AMOUNT_LC: numeric("TOTAL_PRODUCT_AMOUNT_LC", { precision: 15, scale: 4 }),
  FINAL_SALES_AMOUNT_LC: numeric("FINAL_SALES_AMOUNT_LC", { precision: 15, scale: 4 }),
  REMARKS: varchar("REMARKS", { length: 2000 }),
  TEST_DESC: varchar("TEST_DESC", { length: 50 }),
  STATUS_ENTRY: varchar("STATUS_ENTRY", { length: 20 }),
  CREATED_BY: varchar("CREATED_BY", { length: 50 }),
  CREATED_DATE: timestamp("CREATED_DATE", { mode: "date" }),
  CREATED_MAC_ADDRESS: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
  MODIFIED_BY: varchar("MODIFIED_BY", { length: 50 }),
  MODIFIED_DATE: timestamp("MODIFIED_DATE", { mode: "date" }),
  MODIFIED_MAC_ADDRESS: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
  SUBMITTED_BY: varchar("SUBMITTED_BY", { length: 50 }),
  SUBMITTED_DATE: timestamp("SUBMITTED_DATE", { mode: "date" }),
});

export const TBL_SALES_PROFORMA_DTL = StoEntriesSchema.table("TBL_SALES_PROFORMA_DTL", {
  SNO: serial("SNO").primaryKey(),
  SALES_PROFORMA_REF_NO: varchar("SALES_PROFORMA_REF_NO", { length: 50 }).references(() => TBL_SALES_PROFORMA_HDR.SALES_PROFORMA_REF_NO),
  MAIN_CATEGORY_ID: integer("MAIN_CATEGORY_ID").references(() => StoMasterSchema.TBL_PRODUCT_MAIN_CATEGORY_MASTER.MAIN_CATEGORY_ID),
  SUB_CATEGORY_ID: integer("SUB_CATEGORY_ID").references(() => StoMasterSchema.TBL_PRODUCT_SUB_CATEGORY_MASTER.SUB_CATEGORY_ID),
  PRODUCT_ID: integer("PRODUCT_ID").references(() => StoMasterSchema.TBL_PRODUCT_MASTER.PRODUCT_ID),
  STORE_STOCK_PCS: numeric("STORE_STOCK_PCS", { precision: 15, scale: 4 }),
  PO_REF_NO: varchar("PO_REF_NO", { length: 50 }).references(() => TBL_PURCHASE_ORDER_HDR.PO_REF_NO),
  PO_DTL_SNO: integer("PO_DTL_SNO").references(() => TBL_PURCHASE_ORDER_DTL.SNO),
  PO_DTL_STOCK_QTY: numeric("PO_DTL_STOCK_QTY", { precision: 15, scale: 4 }),
  PURCHASE_RATE_PER_QTY: numeric("PURCHASE_RATE_PER_QTY", { precision: 15, scale: 6 }),
  PO_EXPENSE_AMOUNT: numeric("PO_EXPENSE_AMOUNT", { precision: 15, scale: 4 }),
  SALES_RATE_PER_QTY: numeric("SALES_RATE_PER_QTY", { precision: 15, scale: 6 }),
  QTY_PER_PACKING: numeric("QTY_PER_PACKING", { precision: 15, scale: 2 }),
  TOTAL_QTY: numeric("TOTAL_QTY", { precision: 15, scale: 4 }),
  UOM: varchar("UOM", { length: 50 }),
  TOTAL_PACKING: numeric("TOTAL_PACKING", { precision: 15, scale: 4 }),
  ALTERNATE_UOM: varchar("ALTERNATE_UOM", { length: 500 }),
  TOTAL_PRODUCT_AMOUNT: numeric("TOTAL_PRODUCT_AMOUNT", { precision: 15, scale: 4 }),
  VAT_PERCENTAGE: numeric("VAT_PERCENTAGE", { precision: 15, scale: 2 }),
  VAT_AMOUNT: numeric("VAT_AMOUNT", { precision: 15, scale: 4 }),
  FINAL_SALES_AMOUNT: numeric("FINAL_SALES_AMOUNT", { precision: 15, scale: 4 }),
  TOTAL_PRODUCT_AMOUNT_LC: numeric("TOTAL_PRODUCT_AMOUNT_LC", { precision: 15, scale: 4 }),
  FINAL_SALES_AMOUNT_LC: numeric("FINAL_SALES_AMOUNT_LC", { precision: 15, scale: 4 }),
  REMARKS: varchar("REMARKS", { length: 2000 }),
  STATUS_ENTRY: varchar("STATUS_ENTRY", { length: 20 }),
  CREATED_BY: varchar("CREATED_BY", { length: 50 }),
  CREATED_DATE: timestamp("CREATED_DATE", { mode: "date" }),
  CREATED_MAC_ADDRESS: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
  MODIFIED_BY: varchar("MODIFIED_BY", { length: 50 }),
  MODIFIED_DATE: timestamp("MODIFIED_DATE", { mode: "date" }),
  MODIFIED_MAC_ADDRESS: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
});

export const TBL_SALES_PROFORMA_FILES_UPLOAD = StoEntriesSchema.table("TBL_SALES_PROFORMA_FILES_UPLOAD", {
  SNO: integer("SNO").primaryKey().generatedAlwaysAsIdentity(),
  SALES_PROFORMA_REF_NO: varchar("SALES_PROFORMA_REF_NO", { length: 50 }).references(() => TBL_SALES_PROFORMA_HDR.SALES_PROFORMA_REF_NO),
  DOCUMENT_TYPE: varchar("DOCUMENT_TYPE", { length: 50 }),
  DESCRIPTION_DETAILS: varchar("DESCRIPTION_DETAILS", { length: 100 }),
  FILE_NAME: varchar("FILE_NAME", { length: 150 }),
  CONTENT_TYPE: varchar("CONTENT_TYPE", { length: 50 }),
  CONTENT_DATA: bytea("CONTENT_DATA"),
  REMARKS: varchar("REMARKS", { length: 1000 }),
  STATUS_MASTER: varchar("STATUS_MASTER", { length: 20 }),
  CREATED_BY: varchar("CREATED_BY", { length: 50 }),
  CREATED_DATE: timestamp("CREATED_DATE", { mode: "date" }),
  CREATED_IP_ADDRESS: varchar("CREATED_IP_ADDRESS", { length: 50 }),
  MODIFIED_BY: varchar("MODIFIED_BY", { length: 50 }),
  MODIFIED_DATE: timestamp("MODIFIED_DATE", { mode: "date" }),
  MODIFIED_IP_ADDRESS: varchar("MODIFIED_IP_ADDRESS", { length: 50 }),
});

export const TBL_GOODS_FILES_UPLOADRelations = relations(TBL_GOODS_FILES_UPLOAD, ({ one }) => ({
  goods_inward_grn_hdr: one(TBL_GOODS_INWARD_GRN_HDR, { fields: [TBL_GOODS_FILES_UPLOAD.GRN_REF_NO], references: [TBL_GOODS_INWARD_GRN_HDR.GRN_REF_NO] }),
}));

export const TBL_EXPENSE_FILES_UPLOADRelations = relations(TBL_EXPENSE_FILES_UPLOAD, ({ one }) => ({
  expense_hdr: one(TBL_EXPENSE_HDR, { fields: [TBL_EXPENSE_FILES_UPLOAD.EXPENSE_REF_NO], references: [TBL_EXPENSE_HDR.EXPENSE_REF_NO] }),
}));

export const TBL_SALES_ORDER_FILES_UPLOADRelations = relations(TBL_SALES_ORDER_FILES_UPLOAD, ({ one }) => ({
  sales_order_hdr: one(TBL_SALES_ORDER_HDR, { fields: [TBL_SALES_ORDER_FILES_UPLOAD.SALES_ORDER_REF_NO], references: [TBL_SALES_ORDER_HDR.SALES_ORDER_REF_NO] }),
}));

export const TBL_DELIVERY_FILES_UPLOADRelations = relations(TBL_DELIVERY_FILES_UPLOAD, ({ one }) => ({
  delivery_note_hdr: one(TBL_DELIVERY_NOTE_HDR, { fields: [TBL_DELIVERY_FILES_UPLOAD.DELIVERY_NOTE_REF_NO], references: [TBL_DELIVERY_NOTE_HDR.DELIVERY_NOTE_REF_NO] }),
}));

export const TBL_TAX_INVOICE_FILES_UPLOADRelations = relations(TBL_TAX_INVOICE_FILES_UPLOAD, ({ one }) => ({
  tax_invoice_hdr: one(TBL_TAX_INVOICE_HDR, { fields: [TBL_TAX_INVOICE_FILES_UPLOAD.TAX_INVOICE_REF_NO], references: [TBL_TAX_INVOICE_HDR.TAX_INVOICE_REF_NO] }),
}));

export const TBL_CUSTOMER_RECEIPT_FILES_UPLOADRelations = relations(TBL_CUSTOMER_RECEIPT_FILES_UPLOAD, ({ one }) => ({
  customer_receipt_hdr: one(TBL_CUSTOMER_RECEIPT_HDR, { fields: [TBL_CUSTOMER_RECEIPT_FILES_UPLOAD.RECEIPT_REF_NO], references: [TBL_CUSTOMER_RECEIPT_HDR.RECEIPT_REF_NO] }),
}));



export const TBL_SALES_PROFORMA_HDRRelations = relations(TBL_SALES_PROFORMA_HDR, ({ one }) => ({
  company_master: one(StoMasterSchema.TBL_COMPANY_MASTER, { fields: [TBL_SALES_PROFORMA_HDR.COMPANY_ID], references: [StoMasterSchema.TBL_COMPANY_MASTER.Company_Id] }),
  store_master: one(StoMasterSchema.TBL_STORE_MASTER, { fields: [TBL_SALES_PROFORMA_HDR.STORE_ID], references: [StoMasterSchema.TBL_STORE_MASTER.Store_Id] }),
  customer_master: one(StoMasterSchema.TBL_CUSTOMER_MASTER, { fields: [TBL_SALES_PROFORMA_HDR.CUSTOMER_ID], references: [StoMasterSchema.TBL_CUSTOMER_MASTER.Customer_Id] }),
  billing_location_master: one(StoMasterSchema.TBL_BILLING_LOCATION_MASTER, { fields: [TBL_SALES_PROFORMA_HDR.BILLING_LOCATION_ID], references: [StoMasterSchema.TBL_BILLING_LOCATION_MASTER.Billing_Location_Id] }),
  sales_person_master: one(StoMasterSchema.TBL_SALES_PERSON_MASTER, { fields: [TBL_SALES_PROFORMA_HDR.SALES_PERSON_EMP_ID], references: [StoMasterSchema.TBL_SALES_PERSON_MASTER.Sales_Person_ID] }),
  currency_master: one(StoMasterSchema.TBL_CURRENCY_MASTER, { fields: [TBL_SALES_PROFORMA_HDR.CURRENCY_ID], references: [StoMasterSchema.TBL_CURRENCY_MASTER.CURRENCY_ID] }),
}));

export const TBL_SALES_PROFORMA_DTLRelations = relations(TBL_SALES_PROFORMA_DTL, ({ one }) => ({
  sales_proforma_hdr: one(TBL_SALES_PROFORMA_HDR, { fields: [TBL_SALES_PROFORMA_DTL.SALES_PROFORMA_REF_NO], references: [TBL_SALES_PROFORMA_HDR.SALES_PROFORMA_REF_NO] }),
  product_main_category_master: one(StoMasterSchema.TBL_PRODUCT_MAIN_CATEGORY_MASTER, { fields: [TBL_SALES_PROFORMA_DTL.MAIN_CATEGORY_ID], references: [StoMasterSchema.TBL_PRODUCT_MAIN_CATEGORY_MASTER.MAIN_CATEGORY_ID] }),
  product_sub_category_master: one(StoMasterSchema.TBL_PRODUCT_SUB_CATEGORY_MASTER, { fields: [TBL_SALES_PROFORMA_DTL.SUB_CATEGORY_ID], references: [StoMasterSchema.TBL_PRODUCT_SUB_CATEGORY_MASTER.SUB_CATEGORY_ID] }),
  product_master: one(StoMasterSchema.TBL_PRODUCT_MASTER, { fields: [TBL_SALES_PROFORMA_DTL.PRODUCT_ID], references: [StoMasterSchema.TBL_PRODUCT_MASTER.PRODUCT_ID] }),
  purchase_order_hdr: one(TBL_PURCHASE_ORDER_HDR, { fields: [TBL_SALES_PROFORMA_DTL.PO_REF_NO], references: [TBL_PURCHASE_ORDER_HDR.PO_REF_NO] }),
  purchase_order_dtl: one(TBL_PURCHASE_ORDER_DTL, { fields: [TBL_SALES_PROFORMA_DTL.PO_DTL_SNO], references: [TBL_PURCHASE_ORDER_DTL.SNO] }),
}));

export const TBL_SALES_PROFORMA_FILES_UPLOADRelations = relations(TBL_SALES_PROFORMA_FILES_UPLOAD, ({ one }) => ({
  sales_proforma_hdr: one(TBL_SALES_PROFORMA_HDR, { fields: [TBL_SALES_PROFORMA_FILES_UPLOAD.SALES_PROFORMA_REF_NO], references: [TBL_SALES_PROFORMA_HDR.SALES_PROFORMA_REF_NO] }),
}));


