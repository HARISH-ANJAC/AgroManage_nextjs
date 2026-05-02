import { pgTable, pgSchema, foreignKey, integer, varchar, timestamp, unique, numeric, bigint, text, date, boolean, customType } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

const bytea = customType<{ data: Buffer }>({ dataType() { return 'bytea'; } });

export const stomaster = pgSchema("stomaster");
export const stoentries = pgSchema("stoentries");

export const customerCreditLimitFileUploadSnoSeqInStomaster = stomaster.sequence("CUSTOMER_CREDIT_LIMIT_FILE_UPLOAD_SNO_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblCustomerMasterFilesUploadSnoSeqInStomaster = stomaster.sequence("TBL_CUSTOMER_MASTER_FILES_UPLOAD_SNO_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblCustomerReceiptFilesUploadSnoSeqInStoentries = stoentries.sequence("TBL_CUSTOMER_RECEIPT_FILES_UPLOAD_SNO_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblDeliveryFilesUploadSnoSeqInStoentries = stoentries.sequence("TBL_DELIVERY_FILES_UPLOAD_SNO_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblExpenseFilesUploadSnoSeqInStoentries = stoentries.sequence("TBL_EXPENSE_FILES_UPLOAD_SNO_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblGoodsFilesUploadSnoSeqInStoentries = stoentries.sequence("TBL_GOODS_FILES_UPLOAD_SNO_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblSalesOrderFilesUploadSnoSeqInStoentries = stoentries.sequence("TBL_SALES_ORDER_FILES_UPLOAD_SNO_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblSalesProformaFilesUploadSnoSeqInStoentries = stoentries.sequence("TBL_SALES_PROFORMA_FILES_UPLOAD_SNO_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblTaxInvoiceFilesUploadSnoSeqInStoentries = stoentries.sequence("TBL_TAX_INVOICE_FILES_UPLOAD_SNO_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblAccountsLedgerMasterLedgerIdSeqInStomaster = stomaster.sequence("TBL_ACCOUNTS_LEDGER_MASTER_LEDGER_ID_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblAccountsLedgerGroupMasterLedgerGroupIdSeqInStomaster = stomaster.sequence("TBL_ACCOUNTS_LEDGER_GROUP_MASTER_LEDGER_GROUP_ID_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblBankMasterBankIdSeqInStomaster = stomaster.sequence("TBL_BANK_MASTER_BANK_ID_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblBillingLocationMasterBillingLocationIdSeqInStomaster = stomaster.sequence("tbl_Billing_Location_Master_Billing_Location_Id_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblAccountsHeadMasterAccountHeadIdSeqInStomaster = stomaster.sequence("TBL_ACCOUNTS_HEAD_MASTER_ACCOUNT_HEAD_ID_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblAdditionalCostTypeMasterAdditionalCostTypeIdSeqInStomaster = stomaster.sequence("TBL_ADDITIONAL_COST_TYPE_MASTER_ADDITIONAL_COST_TYPE_ID_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblCompanyBankAccountMasterAccountIdSeqInStomaster = stomaster.sequence("tbl_Company_Bank_Account_Master_Account_Id_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblCompanyMasterCompanyIdSeqInStomaster = stomaster.sequence("tbl_Company_Master_Company_Id_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblCountryMasterCountryIdSeqInStomaster = stomaster.sequence("tbl_country_master_Country_Id_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblCustomerMasterCustomerIdSeqInStomaster = stomaster.sequence("tbl_Customer_Master_Customer_Id_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblCustomerCompanyWiseBillingLocationMappingSnoSeqInStomaster = stomaster.sequence("TBL_CUSTOMER_COMPANY_WISE_BILLING_LOCATION_MAPPING_SNO_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblCurrencyMasterCurrencyIdSeqInStomaster = stomaster.sequence("TBL_CURRENCY_MASTER_CURRENCY_ID_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblDepartmentMasterDepartmentIdSeqInStomaster = stomaster.sequence("tbl_Department_Master_Department_Id_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblCustomerCreditLimitDetailsSnoSeqInStomaster = stomaster.sequence("tbl_Customer_Credit_Limit_Details_Sno_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblDistrictMasterDistrictIdSeqInStomaster = stomaster.sequence("tbl_District_Master_District_id_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblExchangeRateMasterSnoSeqInStomaster = stomaster.sequence("TBL_EXCHANGE_RATE_MASTER_SNO_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblCustomerPaymentModeMasterPaymentModeIdSeqInStomaster = stomaster.sequence("TBL_CUSTOMER_PAYMENT_MODE_MASTER_PAYMENT_MODE_ID_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblCustomerProductVatPercentageSettingsSnoSeqInStomaster = stomaster.sequence("TBL_CUSTOMER_PRODUCT_VAT_PERCENTAGE_SETTINGS_SNO_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblCustomerWiseProductPriceSettingsSnoSeqInStomaster = stomaster.sequence("tbl_Customer_Wise_Product_Price_Settings_Sno_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblPaymentModeMasterPaymentModeIdSeqInStomaster = stomaster.sequence("TBL_PAYMENT_MODE_MASTER_PAYMENT_MODE_ID_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblLocationMasterLocationIdSeqInStomaster = stomaster.sequence("tbl_Location_Master_Location_Id_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblProductOpeningStockSnoSeqInStomaster = stomaster.sequence("TBL_PRODUCT_OPENING_STOCK_SNO_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblProductSubCategoryMasterSubCategoryIdSeqInStomaster = stomaster.sequence("TBL_PRODUCT_SUB_CATEGORY_MASTER_SUB_CATEGORY_ID_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblProductCompanyMainCategoryMappingSnoSeqInStomaster = stomaster.sequence("tbl_Product_Company_Main_Category_Mapping_Sno_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblRoleMasterRoleIdSeqInStomaster = stomaster.sequence("TBL_ROLE_MASTER_ROLE_ID_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblProductMasterProductIdSeqInStomaster = stomaster.sequence("TBL_PRODUCT_MASTER_PRODUCT_ID_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblPaymentTermMasterPaymentTermIdSeqInStomaster = stomaster.sequence("TBL_PAYMENT_TERM_MASTER_PAYMENT_TERM_ID_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblProductMainCategoryMasterMainCategoryIdSeqInStomaster = stomaster.sequence("TBL_PRODUCT_MAIN_CATEGORY_MASTER_MAIN_CATEGORY_ID_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblSchedulerSettingsSnoSeqInStomaster = stomaster.sequence("TBL_SCHEDULER_SETTINGS_SNO_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblStoreProductMinimumStockSnoSeqInStomaster = stomaster.sequence("tbl_Store_Product_Minimum_Stock_Sno_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblSupplierMasterSupplierIdSeqInStomaster = stomaster.sequence("tbl_Supplier_Master_Supplier_Id_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblUserToStoreMappingUserToLocationIdUserToRoleSeqInStomaster = stomaster.sequence("TBL_USER_TO_STORE_MAPPING_USER_TO_LOCATION_ID_USER_TO_ROLE_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblStoreMasterStoreIdSeqInStomaster = stomaster.sequence("tbl_Store_Master_Store_Id_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblSalesPersonMasterSalesPersonIdSeqInStomaster = stomaster.sequence("TBL_SALES_PERSON_MASTER_Sales_Person_ID_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblUserInfoHdrLoginIdUserHdrSeqInStomaster = stomaster.sequence("TBL_USER_INFO_HDR_LOGIN_ID_USER_HDR_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblVatPercentageSettingSnoSeqInStomaster = stomaster.sequence("TBL_VAT_PERCENTAGE_SETTING_SNO_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblCustomerReceiptInvoiceDtlSnoSeqInStoentries = stoentries.sequence("TBL_CUSTOMER_RECEIPT_INVOICE_DTL_SNO_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })
export const tblDeliveryNoteHdrSnoSeqInStoentries = stoentries.sequence("TBL_DELIVERY_NOTE_HDR_SNO_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblDeliveryNoteDtlSnoSeqInStoentries = stoentries.sequence("TBL_DELIVERY_NOTE_DTL_SNO_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblExpenseHdrSnoSeqInStoentries = stoentries.sequence("TBL_EXPENSE_HDR_SNO_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblExpenseDtlSnoSeqInStoentries = stoentries.sequence("TBL_EXPENSE_DTL_SNO_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblCustomerReceiptHdrSnoSeqInStoentries = stoentries.sequence("TBL_CUSTOMER_RECEIPT_HDR_SNO_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })
export const tblPurchaseInvoiceHdrSnoSeqInStoentries = stoentries.sequence("TBL_PURCHASE_INVOICE_HDR_SNO_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblGoodsInwardGrnDtlSnoSeqInStoentries = stoentries.sequence("TBL_GOODS_INWARD_GRN_DTL_SNO_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblPurchaseInvoiceDtlSnoSeqInStoentries = stoentries.sequence("TBL_PURCHASE_INVOICE_DTL_SNO_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblPurchaseInvoiceFilesUploadSnoSeqInStoentries = stoentries.sequence("TBL_PURCHASE_INVOICE_FILES_UPLOAD_SNO_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblPurchaseInvoiceAdditionalCostDetailsSnoSeqInStoentries = stoentries.sequence("TBL_PURCHASE_INVOICE_ADDITIONAL_COST_DETAILS_SNO_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblPurchaseOrderConversationDtlSnoSeqInStoentries = stoentries.sequence("TBL_PURCHASE_ORDER_CONVERSATION_DTL_SNO_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblGoodsInwardGrnHdrSnoSeqInStoentries = stoentries.sequence("TBL_GOODS_INWARD_GRN_HDR_SNO_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblPurchaseOrderHdrSnoSeqInStoentries = stoentries.sequence("TBL_PURCHASE_ORDER_HDR_SNO_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblSalesOrderHdrSnoSeqInStoentries = stoentries.sequence("TBL_SALES_ORDER_HDR_SNO_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblPurchaseOrderFilesUploadSnoSeqInStoentries = stoentries.sequence("TBL_PURCHASE_ORDER_FILES_UPLOAD_SNO_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblSalesProformaDtlSnoSeqInStoentries = stoentries.sequence("TBL_SALES_PROFORMA_DTL_SNO_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblPurchaseOrderDtlSnoSeqInStoentries = stoentries.sequence("TBL_PURCHASE_ORDER_DTL_SNO_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblTaxInvoiceDtlSnoSeqInStoentries = stoentries.sequence("TBL_TAX_INVOICE_DTL_SNO_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblChangePasswordLogSnoSeqInStomaster = stomaster.sequence("tbl_Change_Password_Log_Sno_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblCustomerAddressDetailsSnoSeqInStomaster = stomaster.sequence("tbl_Customer_Address_Details_Sno_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblRegionMasterRegionIdSeqInStomaster = stomaster.sequence("TBL_REGION_MASTER_REGION_ID_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblTaxInvoiceHdrSnoSeqInStoentries = stoentries.sequence("TBL_TAX_INVOICE_HDR_SNO_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblSalesOrderDtlSnoSeqInStoentries = stoentries.sequence("TBL_SALES_ORDER_DTL_SNO_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblSalesProformaHdrSnoSeqInStoentries = stoentries.sequence("TBL_SALES_PROFORMA_HDR_SNO_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblTaxMasterTaxIdSeqInStomaster = stomaster.sequence("tbl_Tax_Master_Tax_Id_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblEmployeeMasterEmployeeIdSeqInStomaster = stomaster.sequence("tbl_Employee_Master_Employee_Id_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblJournalHdrSnoSeqInStoentries = stoentries.sequence("TBL_JOURNAL_HDR_SNO_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblJournalDtlSnoSeqInStoentries = stoentries.sequence("TBL_JOURNAL_DTL_SNO_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblTrialBalanceHdrSnoSeqInStoentries = stoentries.sequence("TBL_TRIAL_BALANCE_HDR_SNO_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblTrialBalanceDtlSnoSeqInStoentries = stoentries.sequence("TBL_TRIAL_BALANCE_DTL_SNO_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblExchangeRateUsageLogLogIdSeqInStomaster = stomaster.sequence("TBL_EXCHANGE_RATE_USAGE_LOG_LOG_ID_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblCompanyBaseCurrencyIdSeqInStomaster = stomaster.sequence("TBL_COMPANY_BASE_CURRENCY_ID_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblMultiCurrencyTransactionsTransactionIdSeqInStomaster = stomaster.sequence("TBL_MULTI_CURRENCY_TRANSACTIONS_TRANSACTION_ID_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblRealizedGainLossGlIdSeqInStomaster = stomaster.sequence("TBL_REALIZED_GAIN_LOSS_GL_ID_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblUnrealizedGainLossGlIdSeqInStomaster = stomaster.sequence("TBL_UNREALIZED_GAIN_LOSS_GL_ID_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const tblPurchaseOrderAdditionalCostDetailsSnoSeqInStoentries = stoentries.sequence("TBL_PURCHASE_ORDER_ADDITIONAL_COST_DETAILS_SNO_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })

export const tblAccountsLedgerMasterInStomaster = stomaster.table("TBL_ACCOUNTS_LEDGER_MASTER", {
	ledgerId: integer("LEDGER_ID").primaryKey().generatedAlwaysAsIdentity({ name: "stomaster.TBL_ACCOUNTS_LEDGER_MASTER_LEDGER_ID_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	companyId: integer("Company_id"),
	ledgerType: varchar("LEDGER_TYPE", { length: 50 }),
	ledgerGroupId: integer("LEDGER_GROUP_ID"),
	ledgerName: varchar("LEDGER_NAME", { length: 100 }),
	ledgerDesc: varchar("LEDGER_DESC", { length: 100 }),
	remarks: varchar("REMARKS", { length: 100 }),
	statusMaster: varchar("STATUS_MASTER", { length: 20 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
	createdMacAddress: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
	modifiedMacAddress: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.companyId],
		foreignColumns: [tblCompanyMasterInStomaster.companyId],
		name: "TBL_ACCOUNTS_LEDGER_MASTER_Company_id_tbl_Company_Master_Compan"
	}),
]);

export const tblAccountsLedgerGroupMasterInStomaster = stomaster.table("TBL_ACCOUNTS_LEDGER_GROUP_MASTER", {
	ledgerGroupId: integer("LEDGER_GROUP_ID").primaryKey().generatedAlwaysAsIdentity({ name: "stomaster.TBL_ACCOUNTS_LEDGER_GROUP_MASTER_LEDGER_GROUP_ID_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	ledgerGroupName: varchar("LEDGER_GROUP_NAME", { length: 50 }),
	remarks: varchar("REMARKS", { length: 1000 }),
	statusEntry: varchar("STATUS_ENTRY", { length: 50 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
	createdMacAddress: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
	modifiedMacAddress: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
}, (table) => [
	unique("TBL_ACCOUNTS_LEDGER_GROUP_MASTER_LEDGER_GROUP_NAME_unique").on(table.ledgerGroupName),
]);

export const tblBankMasterInStomaster = stomaster.table("TBL_BANK_MASTER", {
	bankId: integer("BANK_ID").primaryKey().generatedAlwaysAsIdentity({ name: "stomaster.TBL_BANK_MASTER_BANK_ID_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	bankName: varchar("BANK_NAME", { length: 50 }),
	address: varchar("ADDRESS", { length: 50 }),
	remarks: varchar("REMARKS", { length: 1000 }),
	statusMaster: varchar("STATUS_MASTER", { length: 20 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
	createdMacAddress: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
	modifiedMacAddress: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
}, (table) => [
	unique("TBL_BANK_MASTER_BANK_NAME_unique").on(table.bankName),
]);

export const tblBillingLocationMasterInStomaster = stomaster.table("tbl_Billing_Location_Master", {
	billingLocationId: integer("Billing_Location_Id").primaryKey().generatedAlwaysAsIdentity({ name: "stomaster.tbl_Billing_Location_Master_Billing_Location_Id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	billingLocationName: varchar("Billing_Location_Name", { length: 100 }),
	billingLocationDescription: varchar("Billing_Location_Description", { length: 100 }),
	remarks: varchar("Remarks", { length: 2000 }),
	statusMaster: varchar("Status_Master", { length: 20 }),
	createdBy: varchar("Created_By", { length: 50 }),
	createdDate: timestamp("Created_Date", { mode: 'string' }),
	createdMacAddress: varchar("Created_Mac_Address", { length: 50 }),
	modifiedBy: varchar("Modified_By", { length: 50 }),
	modifiedDate: timestamp("Modified_Date", { mode: 'string' }),
	modifiedMacAddress: varchar("Modified_Mac_Address", { length: 50 }),
}, (table) => [
	unique("tbl_Billing_Location_Master_Billing_Location_Name_unique").on(table.billingLocationName),
]);

export const tblAccountsHeadMasterInStomaster = stomaster.table("TBL_ACCOUNTS_HEAD_MASTER", {
	accountHeadId: integer("ACCOUNT_HEAD_ID").primaryKey().generatedAlwaysAsIdentity({ name: "stomaster.TBL_ACCOUNTS_HEAD_MASTER_ACCOUNT_HEAD_ID_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	accountHeadName: varchar("ACCOUNT_HEAD_NAME", { length: 50 }),
	remarks: varchar("REMARKS", { length: 1000 }),
	statusEntry: varchar("STATUS_ENTRY", { length: 50 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
	createdMacAddress: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
	modifiedMacAddress: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
}, (table) => [
	unique("TBL_ACCOUNTS_HEAD_MASTER_ACCOUNT_HEAD_NAME_unique").on(table.accountHeadName),
]);

export const customerCreditLimitFileUploadInStomaster = stomaster.table("CUSTOMER_CREDIT_LIMIT_FILE_UPLOAD", {
	sno: integer("SNO").primaryKey().generatedAlwaysAsIdentity({ name: "stomaster.CUSTOMER_CREDIT_LIMIT_FILE_UPLOAD_SNO_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	creditLimitId: integer("CREDIT_LIMIT_ID"),
	descriptionDetails: varchar("DESCRIPTION_DETAILS", { length: 100 }),
	fileName: varchar("FILE_NAME", { length: 150 }),
	contentType: varchar("CONTENT_TYPE", { length: 50 }),
	// TODO: failed to parse database type 'bytea'
	contentData: bytea("CONTENT_DATA"),
	statusMaster: varchar("STATUS_MASTER", { length: 20 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
	createdMacAddress: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
	modifiedMacAddress: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
	documentType: varchar("DOCUMENT_TYPE", { length: 60 }),
}, (table) => [
	foreignKey({
		columns: [table.creditLimitId],
		foreignColumns: [tblCustomerCreditLimitDetailsInStomaster.sno],
		name: "CUSTOMER_CREDIT_LIMIT_FILE_UPLOAD_CREDIT_LIMIT_ID_tbl_Customer_"
	}),
]);

export const tblAdditionalCostTypeMasterInStomaster = stomaster.table("TBL_ADDITIONAL_COST_TYPE_MASTER", {
	additionalCostTypeId: integer("ADDITIONAL_COST_TYPE_ID").primaryKey().generatedAlwaysAsIdentity({ name: "stomaster.TBL_ADDITIONAL_COST_TYPE_MASTER_ADDITIONAL_COST_TYPE_ID_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	additionalCostTypeName: varchar("ADDITIONAL_COST_TYPE_NAME", { length: 50 }),
	remarks: varchar("REMARKS", { length: 1000 }),
	statusEntry: varchar("STATUS_ENTRY", { length: 50 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
	createdMacAddress: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
	modifiedMacAddress: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
}, (table) => [
	unique("TBL_ADDITIONAL_COST_TYPE_MASTER_ADDITIONAL_COST_TYPE_NAME_uniqu").on(table.additionalCostTypeName),
]);

export const tblCompanyBankAccountMasterInStomaster = stomaster.table("tbl_Company_Bank_Account_Master", {
	accountId: integer("Account_Id").primaryKey().generatedAlwaysAsIdentity({ name: "stomaster.tbl_Company_Bank_Account_Master_Account_Id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	companyId: integer("Company_id"),
	bankId: integer("Bank_Id"),
	accountName: varchar("Account_Name", { length: 100 }),
	accountNumber: varchar("Account_Number", { length: 100 }),
	swiftCode: varchar("Swift_Code", { length: 50 }),
	branchAddress: varchar("Branch_Address", { length: 200 }),
	bankBranchName: varchar("Bank_Branch_Name", { length: 50 }),
	currencyId: integer("Currency_Id"),
	remarks: varchar("Remarks", { length: 2000 }),
	statusMaster: varchar("Status_Master", { length: 20 }),
	createdBy: varchar("Created_By", { length: 50 }),
	createdDate: timestamp("Created_Date", { mode: 'string' }),
	createdMacAddress: varchar("Created_Mac_Address", { length: 50 }),
	modifiedBy: varchar("Modified_By", { length: 50 }),
	modifiedDate: timestamp("Modified_Date", { mode: 'string' }),
	modifiedMacAddress: varchar("Modified_Mac_Address", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.companyId],
		foreignColumns: [tblCompanyMasterInStomaster.companyId],
		name: "tbl_Company_Bank_Account_Master_Company_id_tbl_Company_Master_C"
	}),
	foreignKey({
		columns: [table.bankId],
		foreignColumns: [tblBankMasterInStomaster.bankId],
		name: "tbl_Company_Bank_Account_Master_Bank_Id_TBL_BANK_MASTER_BANK_ID"
	}),
	foreignKey({
		columns: [table.currencyId],
		foreignColumns: [tblCurrencyMasterInStomaster.currencyId],
		name: "tbl_Company_Bank_Account_Master_Currency_Id_TBL_CURRENCY_MASTER"
	}),
	unique("tbl_Company_Bank_Account_Master_Account_Name_unique").on(table.accountName),
	unique("tbl_Company_Bank_Account_Master_Account_Number_unique").on(table.accountNumber),
]);

export const tblCompanyMasterInStomaster = stomaster.table("tbl_Company_Master", {
	companyId: integer("Company_Id").primaryKey().generatedAlwaysAsIdentity({ name: "stomaster.tbl_Company_Master_Company_Id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	companyName: varchar("Company_Name", { length: 100 }),
	tinNumber: varchar("TIN_Number", { length: 50 }),
	address: varchar("Address", { length: 2000 }),
	contactPerson: varchar("Contact_Person", { length: 50 }),
	contactNumber: varchar("Contact_Number", { length: 50 }),
	email: varchar("Email", { length: 50 }),
	shortCode: varchar("Short_Code", { length: 4 }),
	financeStartMonth: varchar("Finance_Start_Month", { length: 50 }),
	financeEndMonth: varchar("Finance_End_Month", { length: 50 }),
	yearCode: varchar("Year_Code", { length: 50 }),
	companyFullName: varchar("Company_Full_Name", { length: 150 }),
	currencyId: integer("Currency_ID"),
	timeZone: varchar("TimeZone", { length: 50 }),
	noOfUser: integer("No_Of_User"),
	webSite: varchar("WebSite", { length: 50 }),
	// TODO: failed to parse database type 'bytea'
	compBigLogo: bytea("Comp_Big_Logo"),
	// TODO: failed to parse database type 'bytea'
	compSmallLogo: bytea("Comp_Small_Logo"),
	// TODO: failed to parse database type 'bytea'
	compLetterHead: bytea("Comp_Letter_Head"),
	// TODO: failed to parse database type 'bytea'
	compStampLogo: bytea("Comp_Stamp_LOGO"),
	remarks: varchar("Remarks", { length: 2000 }),
	statusMaster: varchar("Status_Master", { length: 20 }),
	createdBy: varchar("Created_By", { length: 50 }),
	createdDate: timestamp("Created_Date", { mode: 'string' }),
	createdMacAddress: varchar("Created_Mac_Address", { length: 50 }),
	modifiedBy: varchar("Modified_By", { length: 50 }),
	modifiedDate: timestamp("Modified_Date", { mode: 'string' }),
	modifiedMacAddress: varchar("Modified_Mac_Address", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.currencyId],
		foreignColumns: [tblCurrencyMasterInStomaster.currencyId],
		name: "tbl_Company_Master_Currency_ID_TBL_CURRENCY_MASTER_CURRENCY_ID_"
	}),
	unique("tbl_Company_Master_Company_Name_unique").on(table.companyName),
	unique("tbl_Company_Master_TIN_Number_unique").on(table.tinNumber),
]);

export const tblCountryMasterInStomaster = stomaster.table("tbl_country_master", {
	countryId: integer("Country_Id").primaryKey().generatedAlwaysAsIdentity({ name: "stomaster.tbl_country_master_Country_Id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	countryName: varchar("Country_Name", { length: 100 }),
	nicename: varchar({ length: 80 }),
	iso3: varchar({ length: 50 }),
	numcode: integer(),
	phonecode: integer(),
	batchNo: varchar("Batch_No", { length: 50 }),
	remarks: varchar("Remarks", { length: 1000 }),
	statusMaster: varchar("Status_Master", { length: 50 }),
	createdUser: varchar("Created_User", { length: 50 }),
	createdDate: timestamp("Created_Date", { mode: 'string' }),
	createdMacAddress: varchar("Created_Mac_Address", { length: 50 }),
	modifiedUser: varchar("Modified_User", { length: 50 }),
	modifiedDate: timestamp("Modified_Date", { mode: 'string' }),
	modifiedMacAddress: varchar("Modified_Mac_Address", { length: 50 }),
}, (table) => [
	unique("tbl_country_master_Country_Name_unique").on(table.countryName),
]);

export const tblCustomerMasterInStomaster = stomaster.table("tbl_Customer_Master", {
	customerId: integer("Customer_Id").primaryKey().generatedAlwaysAsIdentity({ name: "stomaster.tbl_Customer_Master_Customer_Id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	customerName: varchar("Customer_Name", { length: 250 }),
	tinNumber: varchar("TIN_Number", { length: 100 }),
	vatNumber: varchar("VAT_Number", { length: 50 }),
	contactPerson: varchar("Contact_Person", { length: 50 }),
	contactNumber: varchar("Contact_Number", { length: 50 }),
	location: varchar("Location", { length: 100 }),
	natureOfBusiness: varchar("Nature_Of_Business", { length: 50 }),
	billingLocationId: integer("Billing_Location_Id"),
	countryId: integer("Country_Id"),
	regionId: integer("Region_Id"),
	districtId: integer("District_Id"),
	currencyId: integer("currency_id"),
	creditAllowed: varchar("CREDIT_ALLOWED", { length: 50 }),
	address: varchar("Address", { length: 1500 }),
	emailAddress: varchar("Email_Address", { length: 100 }),
	phoneNumber2: varchar("PHONE_NUMBER_2", { length: 50 }),
	lat: numeric("LAT", { precision: 30, scale: 9 }),
	lng: numeric("LNG", { precision: 30, scale: 9 }),
	tier: varchar("TIER", { length: 50 }),
	companyHeadContactPerson: varchar("Company_Head_Contact_Person", { length: 250 }),
	companyHeadPhoneNo: varchar("Company_Head_Phone_No", { length: 250 }),
	companyHeadEmail: varchar("Company_Head_Email", { length: 250 }),
	accountsContactPerson: varchar("Accounts_Contact_Person", { length: 250 }),
	accountsPhoneNo: varchar("Accounts_Phone_No", { length: 250 }),
	accountsEmail: varchar("Accounts_Email", { length: 250 }),
	remarks: varchar("Remarks", { length: 2000 }),
	statusMaster: varchar("Status_Master", { length: 20 }),
	createdBy: varchar("Created_By", { length: 50 }),
	createdDate: timestamp("Created_Date", { mode: 'string' }),
	createdMacAddress: varchar("Created_Mac_Address", { length: 50 }),
	modifiedBy: varchar("Modified_By", { length: 50 }),
	modifiedDate: timestamp("Modified_Date", { mode: 'string' }),
	modifiedMacAddress: varchar("Modified_Mac_Address", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.billingLocationId],
		foreignColumns: [tblBillingLocationMasterInStomaster.billingLocationId],
		name: "tbl_Customer_Master_Billing_Location_Id_tbl_Billing_Location_Ma"
	}),
	foreignKey({
		columns: [table.districtId],
		foreignColumns: [tblDistrictMasterInStomaster.districtId],
		name: "tbl_Customer_Master_District_Id_tbl_District_Master_District_id"
	}),
	foreignKey({
		columns: [table.currencyId],
		foreignColumns: [tblCurrencyMasterInStomaster.currencyId],
		name: "tbl_Customer_Master_currency_id_TBL_CURRENCY_MASTER_CURRENCY_ID"
	}),
	foreignKey({
		columns: [table.countryId],
		foreignColumns: [tblCountryMasterInStomaster.countryId],
		name: "tbl_Customer_Master_Country_Id_tbl_country_master_Country_Id_fk"
	}),
	foreignKey({
		columns: [table.regionId],
		foreignColumns: [tblRegionMasterInStomaster.regionId],
		name: "tbl_Customer_Master_Region_Id_TBL_REGION_MASTER_REGION_ID_fk"
	}),
	unique("tbl_Customer_Master_Customer_Name_unique").on(table.customerName),
]);

export const tblCustomerCompanyWiseBillingLocationMappingInStomaster = stomaster.table("TBL_CUSTOMER_COMPANY_WISE_BILLING_LOCATION_MAPPING", {
	sno: integer("SNO").primaryKey().generatedAlwaysAsIdentity({ name: "stomaster.TBL_CUSTOMER_COMPANY_WISE_BILLING_LOCATION_MAPPING_SNO_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	customerId: integer("Customer_Id"),
	companyId: integer("Company_id"),
	billingLocationId: integer("Billing_Location_Id"),
	effectiveFrom: timestamp("EFFECTIVE_FROM", { mode: 'string' }),
	effectiveTo: timestamp("EFFECTIVE_TO", { mode: 'string' }),
	remarks: varchar("REMARKS", { length: 500 }),
	statusMaster: varchar("STATUS_MASTER", { length: 50 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
	createdMacAddress: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
	modifiedMacAddress: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.customerId],
		foreignColumns: [tblCustomerMasterInStomaster.customerId],
		name: "TBL_CUSTOMER_COMPANY_WISE_BILLING_LOCATION_MAPPING_Customer_Id_"
	}),
	foreignKey({
		columns: [table.companyId],
		foreignColumns: [tblCompanyMasterInStomaster.companyId],
		name: "TBL_CUSTOMER_COMPANY_WISE_BILLING_LOCATION_MAPPING_Company_id_t"
	}),
	foreignKey({
		columns: [table.billingLocationId],
		foreignColumns: [tblBillingLocationMasterInStomaster.billingLocationId],
		name: "TBL_CUSTOMER_COMPANY_WISE_BILLING_LOCATION_MAPPING_Billing_Loca"
	}),
]);

export const tblCurrencyMasterInStomaster = stomaster.table("TBL_CURRENCY_MASTER", {
	currencyId: integer("CURRENCY_ID").primaryKey().generatedAlwaysAsIdentity({ name: "stomaster.TBL_CURRENCY_MASTER_CURRENCY_ID_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	currencyName: varchar("CURRENCY_NAME", { length: 50 }),
	address: varchar("ADDRESS", { length: 50 }),
	exchangeRate: numeric("Exchange_Rate", { precision: 30, scale: 5 }),
	remarks: varchar("REMARKS", { length: 1000 }),
	statusMaster: varchar("STATUS_MASTER", { length: 20 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
	createdMacAddress: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
	modifiedMacAddress: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
}, (table) => [
	unique("TBL_CURRENCY_MASTER_CURRENCY_NAME_unique").on(table.currencyName),
]);

export const tblDepartmentMasterInStomaster = stomaster.table("tbl_Department_Master", {
	departmentId: integer("Department_Id").primaryKey().generatedAlwaysAsIdentity({ name: "stomaster.tbl_Department_Master_Department_Id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	departmentName: varchar("Department_Name", { length: 100 }),
	departmentDescription: varchar("Department_Description", { length: 200 }),
	remarks: varchar("Remarks", { length: 1000 }),
	statusMaster: varchar("Status_Master", { length: 20 }),
	createdBy: varchar("Created_By", { length: 50 }),
	createdDate: timestamp("Created_Date", { mode: 'string' }),
	createdMacAddress: varchar("Created_Mac_Address", { length: 50 }),
	modifiedBy: varchar("Modified_By", { length: 50 }),
	modifiedDate: timestamp("Modified_Date", { mode: 'string' }),
	modifiedMacAddress: varchar("Modified_Mac_Address", { length: 50 }),
}, (table) => [
	unique("tbl_Department_Master_Department_Name_unique").on(table.departmentName),
]);

export const tblCustomerCreditLimitDetailsInStomaster = stomaster.table("tbl_Customer_Credit_Limit_Details", {
	sno: integer("Sno").primaryKey().generatedAlwaysAsIdentity({ name: "stomaster.tbl_Customer_Credit_Limit_Details_Sno_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	companyId: integer("Company_id"),
	customerId: integer("Customer_Id"),
	currencyId: integer("Currency_id"),
	validType: varchar("Valid_Type", { length: 50 }),
	requestedCreditLimitDays: integer("Requested_Credit_Limit_Days"),
	requestedCreditLimitAmount: numeric("Requested_Credit_Limit_Amount", { precision: 30, scale: 2 }),
	requestedPaymentModeId: integer("Requested_Payment_Mode_Id"),
	requestedBy: varchar("Requested_By", { length: 50 }),
	requestedDate: timestamp("Requested_Date", { mode: 'string' }),
	totalOutstandingAmount: numeric("Total_Outstanding_Amount", { precision: 30, scale: 2 }),
	overDueOutstandingAmount: numeric("Over_Due_Outstanding_Amount", { precision: 30, scale: 2 }),
	approvedCreditLimitDays: integer("Approved_Credit_Limit_Days"),
	approvedCreditLimitAmount: numeric("Approved_Credit_Limit_Amount", { precision: 30, scale: 2 }),
	approvedPaymentModeId: integer("Approved_PAYMENT_MODE_ID"),
	effectiveFrom: timestamp("Effective_From", { mode: 'string' }),
	effectiveTo: timestamp("Effective_To", { mode: 'string' }),
	financeHead1ResponseBy: varchar("Finance_Head_1_Response_By", { length: 50 }),
	financeHead1ResponseDate: timestamp("Finance_Head_1_Response_Date", { mode: 'string' }),
	financeHead1ResponseStatus: varchar("Finance_Head_1_Response_Status", { length: 50 }),
	financeHead1ResponseIpAddress: varchar("Finance_Head_1_Response_IP_Address", { length: 50 }),
	financeHead1ResponseRemarks: varchar("Finance_Head_1_Response_Remarks", { length: 500 }),
	respondBy: varchar("Respond_by", { length: 50 }),
	respondStatus: varchar("Respond_Status", { length: 50 }),
	respondDate: timestamp("Respond_Date", { mode: 'string' }),
	respondMacAddress: varchar("Respond_Mac_address", { length: 50 }),
	responseRemarks: varchar("Response_Remarks", { length: 1000 }),
	remarks: varchar("Remarks", { length: 2000 }),
	statusMaster: varchar("Status_Master", { length: 20 }),
	createdBy: varchar("Created_By", { length: 50 }),
	createdDate: timestamp("Created_Date", { mode: 'string' }),
	createdMacAddress: varchar("Created_Mac_Address", { length: 50 }),
	modifiedBy: varchar("Modified_By", { length: 50 }),
	modifiedDate: timestamp("Modified_Date", { mode: 'string' }),
	modifiedMacAddress: varchar("Modified_Mac_Address", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.companyId],
		foreignColumns: [tblCompanyMasterInStomaster.companyId],
		name: "tbl_Customer_Credit_Limit_Details_Company_id_tbl_Company_Master"
	}),
	foreignKey({
		columns: [table.customerId],
		foreignColumns: [tblCustomerMasterInStomaster.customerId],
		name: "tbl_Customer_Credit_Limit_Details_Customer_Id_tbl_Customer_Mast"
	}),
	foreignKey({
		columns: [table.currencyId],
		foreignColumns: [tblCurrencyMasterInStomaster.currencyId],
		name: "tbl_Customer_Credit_Limit_Details_Currency_id_TBL_CURRENCY_MAST"
	}),
	foreignKey({
		columns: [table.requestedPaymentModeId],
		foreignColumns: [tblCustomerPaymentModeMasterInStomaster.paymentModeId],
		name: "tbl_Customer_Credit_Limit_Details_Requested_Payment_Mode_Id_TBL"
	}),
	foreignKey({
		columns: [table.approvedPaymentModeId],
		foreignColumns: [tblCustomerPaymentModeMasterInStomaster.paymentModeId],
		name: "tbl_Customer_Credit_Limit_Details_Approved_PAYMENT_MODE_ID_TBL_"
	}),
]);

export const tblDistrictMasterInStomaster = stomaster.table("tbl_District_Master", {
	districtId: integer("District_id").primaryKey().generatedAlwaysAsIdentity({ name: "stomaster.tbl_District_Master_District_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	countryId: integer("Country_Id"),
	regionId: integer("Region_Id"),
	districtName: varchar("District_Name", { length: 50 }),
	totalPopulation: numeric("Total_Population", { precision: 30, scale: 2 }),
	zoneName: varchar("Zone_Name", { length: 50 }),
	distanceFromArusha: numeric("Distance_From_Arusha", { precision: 30, scale: 2 }),
	statusMaster: varchar("Status_Master", { length: 20 }),
	createdBy: varchar("Created_By", { length: 50 }),
	createdDate: timestamp("Created_Date", { mode: 'string' }),
	createdMacAddress: varchar("Created_Mac_Address", { length: 50 }),
	modifiedBy: varchar("Modified_By", { length: 50 }),
	modifiedDate: timestamp("Modified_Date", { mode: 'string' }),
	modifiedMacAddress: varchar("Modified_Mac_Address", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.countryId],
		foreignColumns: [tblCountryMasterInStomaster.countryId],
		name: "tbl_District_Master_Country_Id_tbl_country_master_Country_Id_fk"
	}),
	foreignKey({
		columns: [table.regionId],
		foreignColumns: [tblRegionMasterInStomaster.regionId],
		name: "tbl_District_Master_Region_Id_TBL_REGION_MASTER_REGION_ID_fk"
	}),
]);

export const tblExchangeRateMasterInStomaster = stomaster.table("TBL_EXCHANGE_RATE_MASTER", {
	sno: integer("SNO").primaryKey().generatedAlwaysAsIdentity({ name: "stomaster.TBL_EXCHANGE_RATE_MASTER_SNO_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	companyId: integer("Company_ID"),
	currencyId: integer("CURRENCY_ID"),
	exchangeRate: numeric("Exchange_Rate", { precision: 30, scale: 5 }),
	remarks: varchar("REMARKS", { length: 1000 }),
	statusMaster: varchar("STATUS_MASTER", { length: 20 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
	createdMacAddress: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
	modifiedMacAddress: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.companyId],
		foreignColumns: [tblCompanyMasterInStomaster.companyId],
		name: "TBL_EXCHANGE_RATE_MASTER_Company_ID_tbl_Company_Master_Company_"
	}),
	foreignKey({
		columns: [table.currencyId],
		foreignColumns: [tblCurrencyMasterInStomaster.currencyId],
		name: "TBL_EXCHANGE_RATE_MASTER_CURRENCY_ID_TBL_CURRENCY_MASTER_CURREN"
	}),
]);

export const tblFieldDtlInStomaster = stomaster.table("tbl_field_dtl", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	activityIdFldDtl: bigint("activity_id_fld_dtl", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity({ name: "stomaster.tbl_field_dtl_activity_id_fld_dtl_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	fieldIdFldDtl: bigint("field_id_fld_dtl", { mode: "number" }),
	activityNameFldDtl: text("activity_name_fld_dtl"),
	activityDescFldDtl: text("activity_desc_fld_dtl"),
	statusFldDtl: varchar("status_fld_dtl", { length: 10 }),
	remarksFldDtl: varchar("remarks_fld_dtl", { length: 1000 }),
	createdUserFldDtl: varchar("created_user_fld_dtl", { length: 50 }),
	createdDateFldDtl: timestamp("created_date_fld_dtl", { mode: 'string' }),
	createdMacAddrFldDtl: varchar("created_mac_addr_fld_dtl", { length: 50 }),
	modifiedUserFldDtl: varchar("modified_user_fld_dtl", { length: 50 }),
	modifiedDateFldDtl: timestamp("modified_date_fld_dtl", { mode: 'string' }),
	modifiedMacAddrFldDtl: varchar("modified_mac_addr_fld_dtl", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.fieldIdFldDtl],
		foreignColumns: [tblFieldHdrInStomaster.fieldIdFldHdr],
		name: "tbl_field_dtl_field_id_fld_dtl_tbl_field_hdr_field_id_fld_hdr_f"
	}),
]);

export const tblCustomerPaymentModeMasterInStomaster = stomaster.table("TBL_CUSTOMER_PAYMENT_MODE_MASTER", {
	paymentModeId: integer("PAYMENT_MODE_ID").primaryKey().generatedAlwaysAsIdentity({ name: "stomaster.TBL_CUSTOMER_PAYMENT_MODE_MASTER_PAYMENT_MODE_ID_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	paymentModeName: varchar("PAYMENT_MODE_NAME", { length: 50 }),
	shortCode: varchar("SHORT_CODE", { length: 20 }),
	remarks: varchar("REMARKS", { length: 1000 }),
	statusMaster: varchar("STATUS_MASTER", { length: 20 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
	createdMacAddress: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
	modifiedMacAddress: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
});

export const tblCustomerMasterFilesUploadInStomaster = stomaster.table("TBL_CUSTOMER_MASTER_FILES_UPLOAD", {
	sno: integer("SNO").primaryKey().generatedAlwaysAsIdentity({ name: "stomaster.TBL_CUSTOMER_MASTER_FILES_UPLOAD_SNO_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	customerId: integer("Customer_Id"),
	documentType: varchar("DOCUMENT_TYPE", { length: 50 }),
	descriptions: varchar("DESCRIPTIONS", { length: 100 }),
	fileName: varchar("FILE_NAME", { length: 150 }),
	contentType: varchar("CONTENT_TYPE", { length: 50 }),
	// TODO: failed to parse database type 'bytea'
	contentData: bytea("CONTENT_DATA"),
	statusMaster: varchar("STATUS_MASTER", { length: 20 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
	createdMacAddress: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
	modifiedMacAddress: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.customerId],
		foreignColumns: [tblCustomerMasterInStomaster.customerId],
		name: "TBL_CUSTOMER_MASTER_FILES_UPLOAD_Customer_Id_tbl_Customer_Maste"
	}),
]);

export const tblCustomerProductVatPercentageSettingsInStomaster = stomaster.table("TBL_CUSTOMER_PRODUCT_VAT_PERCENTAGE_SETTINGS", {
	sno: integer("SNO").primaryKey().generatedAlwaysAsIdentity({ name: "stomaster.TBL_CUSTOMER_PRODUCT_VAT_PERCENTAGE_SETTINGS_SNO_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	companyId: integer("Company_id"),
	customerId: integer("Customer_Id"),
	mainCategoryId: integer("Main_Category_Id"),
	subCategoryId: integer("Sub_Category_Id"),
	productId: integer("Product_Id"),
	vatPercentage: numeric("VAT_PERCENTAGE", { precision: 30, scale: 2 }),
	effectiveFrom: timestamp("EFFECTIVE_FROM", { mode: 'string' }),
	effectiveTo: timestamp("EFFECTIVE_TO", { mode: 'string' }),
	requestStatus: varchar("REQUEST_STATUS", { length: 50 }),
	remarks: varchar("REMARKS", { length: 100 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
	createdMacAddress: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
	modifiedMacAddress: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.companyId],
		foreignColumns: [tblCompanyMasterInStomaster.companyId],
		name: "TBL_CUSTOMER_PRODUCT_VAT_PERCENTAGE_SETTINGS_Company_id_tbl_Com"
	}),
	foreignKey({
		columns: [table.customerId],
		foreignColumns: [tblCustomerMasterInStomaster.customerId],
		name: "TBL_CUSTOMER_PRODUCT_VAT_PERCENTAGE_SETTINGS_Customer_Id_tbl_Cu"
	}),
	foreignKey({
		columns: [table.mainCategoryId],
		foreignColumns: [tblProductMainCategoryMasterInStomaster.mainCategoryId],
		name: "TBL_CUSTOMER_PRODUCT_VAT_PERCENTAGE_SETTINGS_Main_Category_Id_T"
	}),
	foreignKey({
		columns: [table.subCategoryId],
		foreignColumns: [tblProductSubCategoryMasterInStomaster.subCategoryId],
		name: "TBL_CUSTOMER_PRODUCT_VAT_PERCENTAGE_SETTINGS_Sub_Category_Id_TB"
	}),
	foreignKey({
		columns: [table.productId],
		foreignColumns: [tblProductMasterInStomaster.productId],
		name: "TBL_CUSTOMER_PRODUCT_VAT_PERCENTAGE_SETTINGS_Product_Id_TBL_PRO"
	}),
]);

export const tblCustomerWiseProductPriceSettingsInStomaster = stomaster.table("tbl_Customer_Wise_Product_Price_Settings", {
	sno: integer("Sno").primaryKey().generatedAlwaysAsIdentity({ name: "stomaster.tbl_Customer_Wise_Product_Price_Settings_Sno_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	companyId: integer("Company_id"),
	customerId: integer("Customer_Id"),
	mainCategoryId: integer("Main_Category_Id"),
	subCategoryId: integer("Sub_Category_Id"),
	productId: integer("Product_Id"),
	unitPrice: numeric("UNIT_PRICE", { precision: 30, scale: 2 }),
	vatPercentage: numeric("VAT_Percentage", { precision: 30, scale: 2 }),
	validType: varchar("Valid_Type", { length: 50 }),
	currencyId: integer("currency_id"),
	effectiveFrom: timestamp("Effective_From", { mode: 'string' }),
	effectiveTo: timestamp("Effective_To", { mode: 'string' }),
	requestedBy: varchar("Requested_By", { length: 50 }),
	requestedDate: timestamp("Requested_Date", { mode: 'string' }),
	requestedProductAmount: numeric("Requested_Product_Amount", { precision: 30, scale: 4 }),
	approvedProductAmount: numeric("Approved_Product_Amount", { precision: 30, scale: 4 }),
	respondBy: varchar("Respond_By", { length: 50 }),
	responseStatus: varchar("Response_Status", { length: 50 }),
	respondDate: timestamp("REspond_Date", { mode: 'string' }),
	respondMacAddress: varchar("Respond_Mac_Address", { length: 50 }),
	responseRemarks: varchar("Response_Remarks", { length: 1000 }),
	accountsResponsePerson: varchar("Accounts_Response_Person", { length: 50 }),
	accountsResponseDate: timestamp("Accounts_Response_Date", { mode: 'string' }),
	accountsResponseStatus: varchar("Accounts_Response_Status", { length: 50 }),
	accountsResponseRemarks: varchar("Accounts_Response_Remarks", { length: 500 }),
	remarks: varchar("Remarks", { length: 2000 }),
	statusMaster: varchar("Status_Master", { length: 20 }),
	createdBy: varchar("Created_By", { length: 50 }),
	createdDate: timestamp("Created_Date", { mode: 'string' }),
	createdMacAddress: varchar("Created_Mac_Address", { length: 50 }),
	modifiedBy: varchar("Modified_By", { length: 50 }),
	modifiedDate: timestamp("Modified_Date", { mode: 'string' }),
	modifiedMacAddress: varchar("Modified_Mac_Address", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.companyId],
		foreignColumns: [tblCompanyMasterInStomaster.companyId],
		name: "tbl_Customer_Wise_Product_Price_Settings_Company_id_tbl_Company"
	}),
	foreignKey({
		columns: [table.customerId],
		foreignColumns: [tblCustomerMasterInStomaster.customerId],
		name: "tbl_Customer_Wise_Product_Price_Settings_Customer_Id_tbl_Custom"
	}),
	foreignKey({
		columns: [table.mainCategoryId],
		foreignColumns: [tblProductMainCategoryMasterInStomaster.mainCategoryId],
		name: "tbl_Customer_Wise_Product_Price_Settings_Main_Category_Id_TBL_P"
	}),
	foreignKey({
		columns: [table.subCategoryId],
		foreignColumns: [tblProductSubCategoryMasterInStomaster.subCategoryId],
		name: "tbl_Customer_Wise_Product_Price_Settings_Sub_Category_Id_TBL_PR"
	}),
	foreignKey({
		columns: [table.productId],
		foreignColumns: [tblProductMasterInStomaster.productId],
		name: "tbl_Customer_Wise_Product_Price_Settings_Product_Id_TBL_PRODUCT"
	}),
	foreignKey({
		columns: [table.currencyId],
		foreignColumns: [tblCurrencyMasterInStomaster.currencyId],
		name: "tbl_Customer_Wise_Product_Price_Settings_currency_id_TBL_CURREN"
	}),
]);

export const tblPaymentModeMasterInStomaster = stomaster.table("TBL_PAYMENT_MODE_MASTER", {
	paymentModeId: integer("PAYMENT_MODE_ID").primaryKey().generatedAlwaysAsIdentity({ name: "stomaster.TBL_PAYMENT_MODE_MASTER_PAYMENT_MODE_ID_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	paymentModeName: varchar("PAYMENT_MODE_NAME", { length: 50 }),
	paymentModePercentage: numeric("PAYMENT_MODE_PERCENTAGE", { precision: 30, scale: 2 }),
	remarks: varchar("REMARKS", { length: 1000 }),
	statusEntry: varchar("STATUS_ENTRY", { length: 50 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
	createdMacAddress: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
	modifiedMacAddress: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
}, (table) => [
	unique("TBL_PAYMENT_MODE_MASTER_PAYMENT_MODE_NAME_unique").on(table.paymentModeName),
]);

export const tblLocationMasterInStomaster = stomaster.table("tbl_Location_Master", {
	locationId: integer("Location_Id").primaryKey().generatedAlwaysAsIdentity({ name: "stomaster.tbl_Location_Master_Location_Id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	locationName: varchar("Location_Name", { length: 100 }),
	locationDescription: varchar("Location_Description", { length: 100 }),
	remarks: varchar("Remarks", { length: 2000 }),
	statusMaster: varchar("Status_Master", { length: 20 }),
	createdBy: varchar("Created_By", { length: 50 }),
	createdDate: timestamp("Created_Date", { mode: 'string' }),
	createdMacAddress: varchar("Created_Mac_Address", { length: 50 }),
	modifiedBy: varchar("Modified_By", { length: 50 }),
	modifiedDate: timestamp("Modified_Date", { mode: 'string' }),
	modifiedMacAddress: varchar("Modified_Mac_Address", { length: 50 }),
}, (table) => [
	unique("tbl_Location_Master_Location_Name_unique").on(table.locationName),
]);

export const tblProductOpeningStockInStomaster = stomaster.table("TBL_PRODUCT_OPENING_STOCK", {
	sno: integer("SNO").primaryKey().generatedAlwaysAsIdentity({ name: "stomaster.TBL_PRODUCT_OPENING_STOCK_SNO_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	openingStockDate: timestamp("OPENING_STOCK_DATE", { mode: 'string' }),
	companyId: integer("COMPANY_ID"),
	storeId: integer("STORE_ID"),
	mainCategoryId: integer("MAIN_CATEGORY_ID"),
	subCategoryId: integer("SUB_CATEGORY_ID"),
	productId: integer("PRODUCT_ID"),
	totalQty: numeric("TOTAL_QTY", { precision: 30, scale: 2 }),
	remarks: varchar("REMARKS", { length: 2000 }),
	statusMaster: varchar("STATUS_MASTER", { length: 20 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
	createdMacAddress: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
	modifiedMacAddress: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.companyId],
		foreignColumns: [tblCompanyMasterInStomaster.companyId],
		name: "TBL_PRODUCT_OPENING_STOCK_COMPANY_ID_tbl_Company_Master_Company"
	}),
	foreignKey({
		columns: [table.mainCategoryId],
		foreignColumns: [tblProductMainCategoryMasterInStomaster.mainCategoryId],
		name: "TBL_PRODUCT_OPENING_STOCK_MAIN_CATEGORY_ID_TBL_PRODUCT_MAIN_CAT"
	}),
	foreignKey({
		columns: [table.subCategoryId],
		foreignColumns: [tblProductSubCategoryMasterInStomaster.subCategoryId],
		name: "TBL_PRODUCT_OPENING_STOCK_SUB_CATEGORY_ID_TBL_PRODUCT_SUB_CATEG"
	}),
	foreignKey({
		columns: [table.productId],
		foreignColumns: [tblProductMasterInStomaster.productId],
		name: "TBL_PRODUCT_OPENING_STOCK_PRODUCT_ID_TBL_PRODUCT_MASTER_PRODUCT"
	}),
	foreignKey({
		columns: [table.storeId],
		foreignColumns: [tblStoreMasterInStomaster.storeId],
		name: "TBL_PRODUCT_OPENING_STOCK_STORE_ID_tbl_Store_Master_Store_Id_fk"
	}),
]);

export const tblProductSubCategoryMasterInStomaster = stomaster.table("TBL_PRODUCT_SUB_CATEGORY_MASTER", {
	subCategoryId: integer("SUB_CATEGORY_ID").primaryKey().generatedAlwaysAsIdentity({ name: "stomaster.TBL_PRODUCT_SUB_CATEGORY_MASTER_SUB_CATEGORY_ID_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	subCategoryName: varchar("SUB_CATEGORY_NAME", { length: 50 }),
	mainCategoryId: integer("MAIN_CATEGORY_ID"),
	remarks: varchar("REMARKS", { length: 2000 }),
	statusMaster: varchar("STATUS_MASTER", { length: 20 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
	createdMacAddress: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
	modifiedMacAddress: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.mainCategoryId],
		foreignColumns: [tblProductMainCategoryMasterInStomaster.mainCategoryId],
		name: "TBL_PRODUCT_SUB_CATEGORY_MASTER_MAIN_CATEGORY_ID_TBL_PRODUCT_MA"
	}),
	unique("TBL_PRODUCT_SUB_CATEGORY_MASTER_SUB_CATEGORY_NAME_unique").on(table.subCategoryName),
]);

export const tblProductCompanyMainCategoryMappingInStomaster = stomaster.table("tbl_Product_Company_Main_Category_Mapping", {
	sno: integer("Sno").primaryKey().generatedAlwaysAsIdentity({ name: "stomaster.tbl_Product_Company_Main_Category_Mapping_Sno_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	companyId: integer("Company_Id"),
	mainCategoryId: integer("Main_Category_Id"),
	remarks: varchar("Remarks", { length: 2000 }),
	statusMaster: varchar("Status_Master", { length: 20 }),
	createdBy: varchar("Created_By", { length: 50 }),
	createdDate: timestamp("Created_Date", { mode: 'string' }),
	createdMacAddress: varchar("Created_Mac_Address", { length: 50 }),
	modifiedBy: varchar("Modified_By", { length: 50 }),
	modifiedDate: timestamp("Modified_Date", { mode: 'string' }),
	modifiedMacAddress: varchar("Modified_Mac_Address", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.companyId],
		foreignColumns: [tblCompanyMasterInStomaster.companyId],
		name: "tbl_Product_Company_Main_Category_Mapping_Company_Id_tbl_Compan"
	}),
	foreignKey({
		columns: [table.mainCategoryId],
		foreignColumns: [tblProductMainCategoryMasterInStomaster.mainCategoryId],
		name: "tbl_Product_Company_Main_Category_Mapping_Main_Category_Id_TBL_"
	}),
]);

export const tblRoleMasterInStomaster = stomaster.table("TBL_ROLE_MASTER", {
	roleId: integer("ROLE_ID").primaryKey().generatedAlwaysAsIdentity({ name: "stomaster.TBL_ROLE_MASTER_ROLE_ID_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	roleName: varchar("ROLE_NAME", { length: 50 }),
	roleDescription: varchar("ROLE_DESCRIPTION", { length: 50 }),
	remarks: varchar("REMARKS", { length: 1000 }),
	statusMaster: varchar("STATUS_MASTER", { length: 20 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
	createdMacAddress: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
	modifiedMacAddress: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
}, (table) => [
	unique("TBL_ROLE_MASTER_ROLE_NAME_unique").on(table.roleName),
]);

export const tblProductMasterInStomaster = stomaster.table("TBL_PRODUCT_MASTER", {
	productId: integer("PRODUCT_ID").primaryKey().generatedAlwaysAsIdentity({ name: "stomaster.TBL_PRODUCT_MASTER_PRODUCT_ID_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	productName: varchar("PRODUCT_NAME", { length: 150 }),
	mainCategoryId: integer("MAIN_CATEGORY_ID"),
	subCategoryId: integer("SUB_CATEGORY_ID"),
	uom: varchar("UOM", { length: 50 }),
	qtyPerPacking: numeric("QTY_PER_PACKING", { precision: 30, scale: 2 }),
	alternateUom: varchar("ALTERNATE_UOM", { length: 50 }),
	fileName: varchar("FILE_NAME", { length: 150 }),
	contentType: varchar("CONTENT_TYPE", { length: 50 }),
	// TODO: failed to parse database type 'bytea'
	contentData: bytea("CONTENT_DATA"),
	remarks: varchar("REMARKS", { length: 2000 }),
	statusMaster: varchar("STATUS_MASTER", { length: 20 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
	createdMacAddress: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
	modifiedMacAddress: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.mainCategoryId],
		foreignColumns: [tblProductMainCategoryMasterInStomaster.mainCategoryId],
		name: "TBL_PRODUCT_MASTER_MAIN_CATEGORY_ID_TBL_PRODUCT_MAIN_CATEGORY_M"
	}),
	foreignKey({
		columns: [table.subCategoryId],
		foreignColumns: [tblProductSubCategoryMasterInStomaster.subCategoryId],
		name: "TBL_PRODUCT_MASTER_SUB_CATEGORY_ID_TBL_PRODUCT_SUB_CATEGORY_MAS"
	}),
	unique("TBL_PRODUCT_MASTER_PRODUCT_NAME_unique").on(table.productName),
]);

export const tblPaymentTermMasterInStomaster = stomaster.table("TBL_PAYMENT_TERM_MASTER", {
	paymentTermId: integer("PAYMENT_TERM_ID").primaryKey().generatedAlwaysAsIdentity({ name: "stomaster.TBL_PAYMENT_TERM_MASTER_PAYMENT_TERM_ID_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	paymentTermName: varchar("PAYMENT_TERM_NAME", { length: 50 }),
	remarks: varchar("REMARKS", { length: 1000 }),
	statusEntry: varchar("STATUS_ENTRY", { length: 50 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
	createdMacAddress: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
	modifiedMacAddress: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
}, (table) => [
	unique("TBL_PAYMENT_TERM_MASTER_PAYMENT_TERM_NAME_unique").on(table.paymentTermName),
]);

export const tblProductMainCategoryMasterInStomaster = stomaster.table("TBL_PRODUCT_MAIN_CATEGORY_MASTER", {
	mainCategoryId: integer("MAIN_CATEGORY_ID").primaryKey().generatedAlwaysAsIdentity({ name: "stomaster.TBL_PRODUCT_MAIN_CATEGORY_MASTER_MAIN_CATEGORY_ID_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	mainCategoryName: varchar("MAIN_CATEGORY_NAME", { length: 100 }),
	remarks: varchar("REMARKS", { length: 2000 }),
	statusMaster: varchar("STATUS_MASTER", { length: 20 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
	createdMacAddress: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
	modifiedMacAddress: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
}, (table) => [
	unique("TBL_PRODUCT_MAIN_CATEGORY_MASTER_MAIN_CATEGORY_NAME_unique").on(table.mainCategoryName),
]);

export const tblSchedulerSettingsInStomaster = stomaster.table("TBL_SCHEDULER_SETTINGS", {
	sno: integer("SNO").primaryKey().generatedAlwaysAsIdentity({ name: "stomaster.TBL_SCHEDULER_SETTINGS_SNO_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	jobName: varchar("JOB_NAME", { length: 100 }),
	cronExpression: varchar("CRON_EXPRESSION", { length: 50 }),
	isEnabled: varchar("IS_ENABLED", { length: 20 }).default('True'),
	lastRun: timestamp("LAST_RUN", { mode: 'string' }),
	remarks: varchar("REMARKS", { length: 1000 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
}, (table) => [
	unique("TBL_SCHEDULER_SETTINGS_JOB_NAME_unique").on(table.jobName),
]);

export const tblStoreProductMinimumStockInStomaster = stomaster.table("tbl_Store_Product_Minimum_Stock", {
	sno: integer("Sno").primaryKey().generatedAlwaysAsIdentity({ name: "stomaster.tbl_Store_Product_Minimum_Stock_Sno_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	companyId: integer("Company_id"),
	storeId: integer("Store_Id"),
	mainCategoryId: integer("Main_Category_Id"),
	subCategoryId: integer("Sub_Category_Id"),
	productId: integer("Product_Id"),
	minimumStockPcs: integer("Minimum_Stock_Pcs"),
	purchaseAlertQty: numeric("Purchase_Alert_Qty", { precision: 30, scale: 2 }),
	requestedBy: varchar("Requested_By", { length: 50 }),
	effectiveFrom: timestamp("Effective_From", { mode: 'string' }),
	effectiveTo: timestamp("Effective_To", { mode: 'string' }),
	remarks: varchar("Remarks", { length: 2000 }),
	statusMaster: varchar("Status_Master", { length: 20 }),
	createdBy: varchar("Created_By", { length: 50 }),
	createdDate: timestamp("Created_Date", { mode: 'string' }),
	createdMacAddress: varchar("Created_Mac_Address", { length: 50 }),
	modifiedBy: varchar("Modified_By", { length: 50 }),
	modifiedDate: timestamp("Modified_Date", { mode: 'string' }),
	modifiedMacAddress: varchar("Modified_Mac_Address", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.companyId],
		foreignColumns: [tblCompanyMasterInStomaster.companyId],
		name: "tbl_Store_Product_Minimum_Stock_Company_id_tbl_Company_Master_C"
	}),
	foreignKey({
		columns: [table.storeId],
		foreignColumns: [tblStoreMasterInStomaster.storeId],
		name: "tbl_Store_Product_Minimum_Stock_Store_Id_tbl_Store_Master_Store"
	}),
	foreignKey({
		columns: [table.mainCategoryId],
		foreignColumns: [tblProductMainCategoryMasterInStomaster.mainCategoryId],
		name: "tbl_Store_Product_Minimum_Stock_Main_Category_Id_TBL_PRODUCT_MA"
	}),
	foreignKey({
		columns: [table.subCategoryId],
		foreignColumns: [tblProductSubCategoryMasterInStomaster.subCategoryId],
		name: "tbl_Store_Product_Minimum_Stock_Sub_Category_Id_TBL_PRODUCT_SUB"
	}),
	foreignKey({
		columns: [table.productId],
		foreignColumns: [tblProductMasterInStomaster.productId],
		name: "tbl_Store_Product_Minimum_Stock_Product_Id_TBL_PRODUCT_MASTER_P"
	}),
]);

export const tblSupplierMasterInStomaster = stomaster.table("tbl_Supplier_Master", {
	supplierId: integer("Supplier_Id").primaryKey().generatedAlwaysAsIdentity({ name: "stomaster.tbl_Supplier_Master_Supplier_Id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	supplierType: varchar("Supplier_Type", { length: 50 }),
	supplierName: varchar("Supplier_Name", { length: 250 }),
	tinNumber: varchar("TIN_Number", { length: 100 }),
	vatRegisterNo: varchar("Vat_Register_No", { length: 50 }),
	shNickName: varchar("SH_Nick_Name", { length: 50 }),
	shipmentMode: varchar("Shipment_Mode", { length: 100 }),
	countryId: integer("Country_Id"),
	regionId: integer("Region_Id"),
	districtId: integer("District_Id"),
	address: varchar("Address", { length: 2500 }),
	contactPerson: varchar("Contact_Person", { length: 50 }),
	phoneNumber: varchar("Phone_number", { length: 50 }),
	mailId: varchar("Mail_Id", { length: 50 }),
	fax: varchar("Fax", { length: 50 }),
	vatPercentage: numeric("vat_Percentage", { precision: 30, scale: 2 }),
	withholdingVatPercentage: numeric("Withholding_vat_percentage", { precision: 30, scale: 2 }),
	remarks: varchar("Remarks", { length: 150 }),
	statusMaster: varchar("Status_Master", { length: 20 }),
	createdUser: varchar("Created_User", { length: 50 }),
	createdDate: timestamp("Created_Date", { mode: 'string' }),
	createdMacAddress: varchar("Created_Mac_Address", { length: 50 }),
	modifiedUser: varchar("Modified_User", { length: 50 }),
	modifiedDate: timestamp("Modified_Date", { mode: 'string' }),
	modifiedMacAddress: varchar("Modified_Mac_Address", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.countryId],
		foreignColumns: [tblCountryMasterInStomaster.countryId],
		name: "tbl_Supplier_Master_Country_Id_tbl_country_master_Country_Id_fk"
	}),
	unique("tbl_Supplier_Master_Supplier_Name_unique").on(table.supplierName),
]);

export const tblUserToStoreMappingInStomaster = stomaster.table("TBL_USER_TO_STORE_MAPPING", {
	userToLocationIdUserToRole: integer("USER_TO_LOCATION_ID_USER_TO_ROLE").primaryKey().generatedAlwaysAsIdentity({ name: "stomaster.TBL_USER_TO_STORE_MAPPING_USER_TO_LOCATION_ID_USER_TO_ROLE_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	userIdUserToRole: integer("USER_ID_USER_TO_ROLE"),
	companyId: integer("COMPANY_ID"),
	storeIdUserToRole: integer("STORE_ID_USER_TO_ROLE"),
	roleIdUserToRole: integer("ROLE_ID_USER_TO_ROLE"),
	statusUserToRole: varchar("STATUS_USER_TO_ROLE", { length: 20 }),
	createdUserUserToRole: varchar("CREATED_USER_USER_TO_ROLE", { length: 50 }),
	createdDateUserToRole: timestamp("CREATED_DATE_USER_TO_ROLE", { mode: 'string' }),
	createdMacAddrUserToRole: varchar("CREATED_MAC_ADDR_USER_TO_ROLE", { length: 50 }),
	modifiedUserUserToRole: varchar("MODIFIED_USER_USER_TO_ROLE", { length: 50 }),
	modifiedDateUserToRole: timestamp("MODIFIED_DATE_USER_TO_ROLE", { mode: 'string' }),
	modifiedMacAddrUserToRole: varchar("MODIFIED_MAC_ADDR_USER_TO_ROLE", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.userIdUserToRole],
		foreignColumns: [tblUserInfoHdrInStomaster.loginIdUserHdr],
		name: "TBL_USER_TO_STORE_MAPPING_USER_ID_USER_TO_ROLE_TBL_USER_INFO_HD"
	}),
	foreignKey({
		columns: [table.companyId],
		foreignColumns: [tblCompanyMasterInStomaster.companyId],
		name: "TBL_USER_TO_STORE_MAPPING_COMPANY_ID_tbl_Company_Master_Company"
	}),
	foreignKey({
		columns: [table.storeIdUserToRole],
		foreignColumns: [tblStoreMasterInStomaster.storeId],
		name: "TBL_USER_TO_STORE_MAPPING_STORE_ID_USER_TO_ROLE_tbl_Store_Maste"
	}),
	foreignKey({
		columns: [table.roleIdUserToRole],
		foreignColumns: [tblRoleMasterInStomaster.roleId],
		name: "TBL_USER_TO_STORE_MAPPING_ROLE_ID_USER_TO_ROLE_TBL_ROLE_MASTER_"
	}),
]);

export const tblStoreMasterInStomaster = stomaster.table("tbl_Store_Master", {
	storeId: integer("Store_Id").primaryKey().generatedAlwaysAsIdentity({ name: "stomaster.tbl_Store_Master_Store_Id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	storeName: varchar("Store_Name", { length: 100 }),
	locationId: integer("Location_Id"),
	managerName: varchar("Manager_Name", { length: 50 }),
	storeShortCode: varchar("Store_Short_Code", { length: 5 }),
	storeShortName: varchar("Store_Short_Name", { length: 100 }),
	emailAddress: varchar("Email_Address", { length: 1000 }),
	ccEmailAddress: text("CC_Email_Address"),
	bccEmailAddress: varchar("BCC_Email_Address", { length: 50 }),
	responseDirectorsName: varchar("Response_Directors_Name", { length: 1000 }),
	remarks: varchar("Remarks", { length: 2000 }),
	statusMaster: varchar("Status_Master", { length: 20 }),
	createdBy: varchar("Created_By", { length: 50 }),
	createdDate: timestamp("Created_Date", { mode: 'string' }),
	createdMacAddress: varchar("Created_Mac_Address", { length: 50 }),
	modifiedBy: varchar("Modified_By", { length: 50 }),
	modifiedDate: timestamp("Modified_Date", { mode: 'string' }),
	modifiedMacAddress: varchar("Modified_Mac_Address", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.locationId],
		foreignColumns: [tblLocationMasterInStomaster.locationId],
		name: "tbl_Store_Master_Location_Id_tbl_Location_Master_Location_Id_fk"
	}),
	unique("tbl_Store_Master_Store_Name_unique").on(table.storeName),
]);

export const tblSalesPersonMasterInStomaster = stomaster.table("TBL_SALES_PERSON_MASTER", {
	salesPersonId: integer("Sales_Person_ID").primaryKey().generatedAlwaysAsIdentity({ name: "stomaster.TBL_SALES_PERSON_MASTER_Sales_Person_ID_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	empId: integer("Emp_Id"),
	personName: varchar("PERSON_NAME", { length: 50 }),
	designationName: varchar("Designation_Name", { length: 50 }),
	salesContactPersonPhone: varchar("Sales_Contact_Person_Phone", { length: 60 }),
	salesPersonEmailAddres: varchar("Sales_Person_Email_Addres", { length: 60 }),
	reportingManagerCardNo: integer("Reporting_Manager_Card_No"),
	reportingManagerName: varchar("Reporting_Manager_Name", { length: 100 }),
	reportingManagerEmailAddress: varchar("Reporting_Manager_Email_Address", { length: 100 }),
	salesPersonDesignation: varchar("Sales_Person_Designation", { length: 100 }),
	remarks: varchar("REMARKS", { length: 50 }),
	statusMaster: varchar("STATUS_MASTER", { length: 50 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
	createdMacAddress: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
	modifiedMacAddress: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
});

export const tblUserInfoHdrInStomaster = stomaster.table("TBL_USER_INFO_HDR", {
	loginIdUserHdr: integer("LOGIN_ID_USER_HDR").primaryKey().generatedAlwaysAsIdentity({ name: "stomaster.TBL_USER_INFO_HDR_LOGIN_ID_USER_HDR_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	newCardNoUserHdr: integer("NEW_CARD_NO_USER_HDR"),
	loginName: varchar("LOGIN_NAME", { length: 50 }),
	passwordUserHdr: varchar("PASSWORD_USER_HDR", { length: 100 }),
	roleUserHdr: varchar("ROLE_USER_HDR", { length: 100 }),
	mobileNoUserHdr: varchar("MOBILE_NO_USER_HDR", { length: 30 }),
	mailIdUserHdr: varchar("MAIL_ID_USER_HDR", { length: 150 }),
	stockShowStatus: varchar("STOCK_SHOW_STATUS", { length: 10 }),
	outsideAccessYN: varchar("OUTSIDE_ACCESS_Y_N", { length: 20 }),
	statusUserHdr: varchar("STATUS_USER_HDR", { length: 20 }),
	remarksUserHdr: varchar("REMARKS_USER_HDR", { length: 1000 }),
	createdUserUserHdr: varchar("CREATED_USER_USER_HDR", { length: 50 }),
	createdDateUserHdr: timestamp("CREATED_DATE_USER_HDR", { mode: 'string' }),
	createdMacAddrUserHdr: varchar("CREATED_MAC_ADDR_USER_HDR", { length: 50 }),
	modifiedUserUserHdr: varchar("MODIFIED_USER_USER_HDR", { length: 50 }),
	modifiedDateUserHdr: timestamp("MODIFIED_DATE_USER_HDR", { mode: 'string' }),
	modifiedMacAddrUserHdr: varchar("MODIFIED_MAC_ADDR_USER_HDR", { length: 50 }),
}, (table) => [
	unique("TBL_USER_INFO_HDR_LOGIN_NAME_unique").on(table.loginName),
]);

export const tblVatPercentageSettingInStomaster = stomaster.table("TBL_VAT_PERCENTAGE_SETTING", {
	sno: integer("SNO").primaryKey().generatedAlwaysAsIdentity({ name: "stomaster.TBL_VAT_PERCENTAGE_SETTING_SNO_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	companyId: integer("COMPANY_ID"),
	vatPercentage: numeric("VAT_PERCENTAGE", { precision: 30, scale: 2 }),
	effectiveFrom: timestamp("EFFECTIVE_FROM", { mode: 'string' }),
	effectiveTo: timestamp("EFFECTIVE_TO", { mode: 'string' }),
	remarks: varchar("REMARKS", { length: 2000 }),
	statusMaster: varchar("STATUS_MASTER", { length: 20 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
	createdMacAddress: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
	modifiedMacAddress: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.companyId],
		foreignColumns: [tblCompanyMasterInStomaster.companyId],
		name: "TBL_VAT_PERCENTAGE_SETTING_COMPANY_ID_tbl_Company_Master_Compan"
	}),
]);

export const tblCustomerReceiptInvoiceDtlInStoentries = stoentries.table("TBL_CUSTOMER_RECEIPT_INVOICE_DTL", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	sno: bigint("SNO", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity({ name: "stoentries.TBL_CUSTOMER_RECEIPT_INVOICE_DTL_SNO_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807 }),
	receiptRefNo: varchar("RECEIPT_REF_NO", { length: 50 }),
	taxInvoiceRefNo: varchar("TAX_INVOICE_REF_NO", { length: 50 }),
	actualInvoiceAmount: numeric("ACTUAL_INVOICE_AMOUNT", { precision: 30, scale: 2 }),
	alreadyPaidAmount: numeric("ALREADY_PAID_AMOUNT", { precision: 30, scale: 2 }),
	outstandingInvoiceAmount: numeric("OUTSTANDING_INVOICE_AMOUNT", { precision: 30, scale: 2 }),
	receiptInvoiceAdjustAmount: numeric("RECEIPT_INVOICE_ADJUST_AMOUNT", { precision: 30, scale: 2 }),
	remarks: varchar("REMARKS", { length: 1000 }),
	statusEntry: varchar("STATUS_ENTRY", { length: 20 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
	createdMacAddress: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
	modifiedMacAddress: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.receiptRefNo],
		foreignColumns: [tblCustomerReceiptHdrInStoentries.receiptRefNo],
		name: "TBL_CUSTOMER_RECEIPT_INVOICE_DTL_RECEIPT_REF_NO_TBL_CUSTOMER_RE"
	}),
	foreignKey({
		columns: [table.taxInvoiceRefNo],
		foreignColumns: [tblTaxInvoiceHdrInStoentries.taxInvoiceRefNo],
		name: "TBL_CUSTOMER_RECEIPT_INVOICE_DTL_TAX_INVOICE_REF_NO_TBL_TAX_INV"
	}),
]);

export const tblDeliveryNoteHdrInStoentries = stoentries.table("TBL_DELIVERY_NOTE_HDR", {
	sno: integer("SNO").generatedAlwaysAsIdentity({ name: "stoentries.TBL_DELIVERY_NOTE_HDR_SNO_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	deliveryNoteRefNo: varchar("DELIVERY_NOTE_REF_NO", { length: 50 }).primaryKey().notNull(),
	deliveryDate: timestamp("DELIVERY_DATE", { mode: 'string' }),
	companyId: integer("COMPANY_ID"),
	fromStoreId: integer("FROM_STORE_ID"),
	deliverySourceType: varchar("DELIVERY_SOURCE_TYPE", { length: 50 }),
	deliverySourceRefNo: varchar("DELIVERY_SOURCE_REF_NO", { length: 50 }),
	toStoreId: integer("TO_STORE_ID"),
	customerId: integer("CUSTOMER_ID"),
	truckNo: varchar("TRUCK_NO", { length: 50 }),
	trailerNo: varchar("TRAILER_NO", { length: 50 }),
	driverName: varchar("DRIVER_NAME", { length: 50 }),
	driverContactNumber: varchar("DRIVER_CONTACT_NUMBER", { length: 50 }),
	sealNo: varchar("SEAL_NO", { length: 50 }),
	currencyId: integer("CURRENCY_ID"),
	exchangeRate: numeric("EXCHANGE_RATE", { precision: 30, scale: 2 }),
	totalProductAmount: numeric("TOTAL_PRODUCT_AMOUNT", { precision: 30, scale: 4 }),
	vatAmount: numeric("VAT_AMOUNT", { precision: 30, scale: 4 }),
	finalSalesAmount: numeric("FINAL_SALES_AMOUNT", { precision: 30, scale: 4 }),
	totalProductAmountLc: numeric("TOTAL_PRODUCT_AMOUNT_LC", { precision: 30, scale: 4 }),
	finalSalesAmountLc: numeric("FINAL_SALES_AMOUNT_LC", { precision: 30, scale: 4 }),
	testDesc: varchar("TEST_DESC", { length: 50 }),
	remarks: varchar("REMARKS", { length: 2000 }),
	statusEntry: varchar("STATUS_ENTRY", { length: 20 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
	createdMacAddress: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
	modifiedMacAddress: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
	submittedBy: varchar("SUBMITTED_BY", { length: 50 }),
	submittedDate: timestamp("SUBMITTED_DATE", { mode: 'string' }),
	submittedMacAddress: varchar("SUBMITTED_MAC_ADDRESS", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.companyId],
		foreignColumns: [tblCompanyMasterInStomaster.companyId],
		name: "TBL_DELIVERY_NOTE_HDR_COMPANY_ID_tbl_Company_Master_Company_Id_"
	}),
	foreignKey({
		columns: [table.fromStoreId],
		foreignColumns: [tblStoreMasterInStomaster.storeId],
		name: "TBL_DELIVERY_NOTE_HDR_FROM_STORE_ID_tbl_Store_Master_Store_Id_f"
	}),
	foreignKey({
		columns: [table.customerId],
		foreignColumns: [tblCustomerMasterInStomaster.customerId],
		name: "TBL_DELIVERY_NOTE_HDR_CUSTOMER_ID_tbl_Customer_Master_Customer_"
	}),
	foreignKey({
		columns: [table.currencyId],
		foreignColumns: [tblCurrencyMasterInStomaster.currencyId],
		name: "TBL_DELIVERY_NOTE_HDR_CURRENCY_ID_TBL_CURRENCY_MASTER_CURRENCY_"
	}),
	foreignKey({
		columns: [table.toStoreId],
		foreignColumns: [tblStoreMasterInStomaster.storeId],
		name: "TBL_DELIVERY_NOTE_HDR_TO_STORE_ID_tbl_Store_Master_Store_Id_fk"
	}),
]);

export const tblDeliveryNoteDtlInStoentries = stoentries.table("TBL_DELIVERY_NOTE_DTL", {
	sno: integer("SNO").primaryKey().generatedAlwaysAsIdentity({ name: "stoentries.TBL_DELIVERY_NOTE_DTL_SNO_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	deliveryNoteRefNo: varchar("DELIVERY_NOTE_REF_NO", { length: 50 }),
	salesOrderDtlSno: integer("SALES_ORDER_DTL_SNO"),
	poDtlSno: integer("PO_DTL_SNO"),
	poRefNo: varchar("PO_REF_NO", { length: 50 }),
	mainCategoryId: integer("MAIN_CATEGORY_ID"),
	subCategoryId: integer("SUB_CATEGORY_ID"),
	productId: integer("PRODUCT_ID"),
	salesRatePerQty: numeric("SALES_RATE_PER_QTY", { precision: 30, scale: 6 }),
	qtyPerPacking: numeric("QTY_PER_PACKING", { precision: 30, scale: 2 }),
	requestQty: numeric("REQUEST_QTY", { precision: 30, scale: 4 }),
	deliveryQty: numeric("DELIVERY_QTY", { precision: 30, scale: 4 }),
	uom: varchar("UOM", { length: 50 }),
	totalPacking: numeric("TOTAL_PACKING", { precision: 30, scale: 4 }),
	alternateUom: varchar("ALTERNATE_UOM", { length: 500 }),
	totalProductAmount: numeric("TOTAL_PRODUCT_AMOUNT", { precision: 30, scale: 4 }),
	vatPercentage: numeric("VAT_PERCENTAGE", { precision: 30, scale: 2 }),
	vatAmount: numeric("VAT_AMOUNT", { precision: 30, scale: 4 }),
	finalSalesAmount: numeric("FINAL_SALES_AMOUNT", { precision: 30, scale: 4 }),
	totalProductAmountLc: numeric("TOTAL_PRODUCT_AMOUNT_LC", { precision: 30, scale: 4 }),
	finalSalesAmountLc: numeric("FINAL_SALES_AMOUNT_LC", { precision: 30, scale: 4 }),
	storeStockPcs: numeric("STORE_STOCK_PCS", { precision: 30, scale: 2 }),
	remarks: varchar("REMARKS", { length: 2000 }),
	statusEntry: varchar("STATUS_ENTRY", { length: 20 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
	createdMacAddress: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
	modifiedMacAddress: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.deliveryNoteRefNo],
		foreignColumns: [tblDeliveryNoteHdrInStoentries.deliveryNoteRefNo],
		name: "TBL_DELIVERY_NOTE_DTL_DELIVERY_NOTE_REF_NO_TBL_DELIVERY_NOTE_HD"
	}),
	foreignKey({
		columns: [table.mainCategoryId],
		foreignColumns: [tblProductMainCategoryMasterInStomaster.mainCategoryId],
		name: "TBL_DELIVERY_NOTE_DTL_MAIN_CATEGORY_ID_TBL_PRODUCT_MAIN_CATEGOR"
	}),
	foreignKey({
		columns: [table.subCategoryId],
		foreignColumns: [tblProductSubCategoryMasterInStomaster.subCategoryId],
		name: "TBL_DELIVERY_NOTE_DTL_SUB_CATEGORY_ID_TBL_PRODUCT_SUB_CATEGORY_"
	}),
	foreignKey({
		columns: [table.productId],
		foreignColumns: [tblProductMasterInStomaster.productId],
		name: "TBL_DELIVERY_NOTE_DTL_PRODUCT_ID_TBL_PRODUCT_MASTER_PRODUCT_ID_"
	}),
]);

export const tblExpenseHdrInStoentries = stoentries.table("TBL_EXPENSE_HDR", {
	sno: integer("SNO").generatedAlwaysAsIdentity({ name: "stoentries.TBL_EXPENSE_HDR_SNO_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	expenseRefNo: varchar("EXPENSE_REF_NO", { length: 50 }).primaryKey().notNull(),
	expenseDate: timestamp("EXPENSE_DATE", { mode: 'string' }),
	companyId: integer("COMPANY_ID"),
	expenseAgainst: varchar("EXPENSE_AGAINST", { length: 50 }),
	poRefNo: varchar("PO_REF_NO", { length: 50 }),
	accountHeadId: integer("ACCOUNT_HEAD_ID"),
	expenseSupplierId: integer("EXPENSE_SUPPLIER_ID"),
	expenseType: varchar("EXPENSE_TYPE", { length: 100 }),
	traEfdReceiptNo: varchar("TRA_EFD_RECEIPT_NO", { length: 100 }),
	currencyId: integer("CURRENCY_ID"),
	exchangeRate: numeric("EXCHANGE_RATE", { precision: 30, scale: 2 }),
	totalExpenseAmount: numeric("TOTAL_EXPENSE_AMOUNT", { precision: 30, scale: 2 }),
	totalExpenseAmountLc: numeric("TOTAL_EXPENSE_AMOUNT_LC", { precision: 30, scale: 2 }),
	remarks: varchar("REMARKS", { length: 2000 }),
	statusEntry: varchar("STATUS_ENTRY", { length: 20 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
	createdIpAddress: varchar("CREATED_IP_ADDRESS", { length: 50 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
	modifiedIpAddress: varchar("MODIFIED_IP_ADDRESS", { length: 50 }),
	submittedBy: varchar("SUBMITTED_BY", { length: 50 }),
	submittedDate: timestamp("SUBMITTED_DATE", { mode: 'string' }),
	submittedIpAddress: varchar("SUBMITTED_IP_ADDRESS", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.accountHeadId],
		foreignColumns: [tblAccountsHeadMasterInStomaster.accountHeadId],
		name: "TBL_EXPENSE_HDR_ACCOUNT_HEAD_ID_TBL_ACCOUNTS_HEAD_MASTER_ACCOUN"
	}),
	foreignKey({
		columns: [table.expenseSupplierId],
		foreignColumns: [tblSupplierMasterInStomaster.supplierId],
		name: "TBL_EXPENSE_HDR_EXPENSE_SUPPLIER_ID_tbl_Supplier_Master_Supplie"
	}),
	foreignKey({
		columns: [table.companyId],
		foreignColumns: [tblCompanyMasterInStomaster.companyId],
		name: "TBL_EXPENSE_HDR_COMPANY_ID_tbl_Company_Master_Company_Id_fk"
	}),
	foreignKey({
		columns: [table.currencyId],
		foreignColumns: [tblCurrencyMasterInStomaster.currencyId],
		name: "TBL_EXPENSE_HDR_CURRENCY_ID_TBL_CURRENCY_MASTER_CURRENCY_ID_fk"
	}),
]);

export const tblExpenseDtlInStoentries = stoentries.table("TBL_EXPENSE_DTL", {
	sno: integer("SNO").primaryKey().generatedAlwaysAsIdentity({ name: "stoentries.TBL_EXPENSE_DTL_SNO_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	expenseRefNo: varchar("EXPENSE_REF_NO", { length: 50 }),
	poRefNo: varchar("PO_REF_NO", { length: 50 }),
	poDtlSno: integer("PO_DTL_SNO"),
	productId: integer("PRODUCT_ID"),
	expenseAmount: numeric("EXPENSE_AMOUNT", { precision: 30, scale: 2 }),
	expenseAmountLc: numeric("EXPENSE_AMOUNT_LC", { precision: 30, scale: 2 }),
	remarks: varchar("REMARKS", { length: 2000 }),
	statusEntry: varchar("STATUS_ENTRY", { length: 20 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
	createdIpAddress: varchar("CREATED_IP_ADDRESS", { length: 50 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
	modifiedIpAddress: varchar("MODIFIED_IP_ADDRESS", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.expenseRefNo],
		foreignColumns: [tblExpenseHdrInStoentries.expenseRefNo],
		name: "TBL_EXPENSE_DTL_EXPENSE_REF_NO_TBL_EXPENSE_HDR_EXPENSE_REF_NO_f"
	}),
	foreignKey({
		columns: [table.productId],
		foreignColumns: [tblProductMasterInStomaster.productId],
		name: "TBL_EXPENSE_DTL_PRODUCT_ID_TBL_PRODUCT_MASTER_PRODUCT_ID_fk"
	}),
]);

export const tblExpenseFilesUploadInStoentries = stoentries.table("TBL_EXPENSE_FILES_UPLOAD", {
	sno: integer("SNO").primaryKey().generatedAlwaysAsIdentity({ name: "stoentries.TBL_EXPENSE_FILES_UPLOAD_SNO_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	expenseRefNo: varchar("EXPENSE_REF_NO", { length: 50 }),
	documentType: varchar("DOCUMENT_TYPE", { length: 50 }),
	descriptionDetails: varchar("DESCRIPTION_DETAILS", { length: 100 }),
	fileName: varchar("FILE_NAME", { length: 150 }),
	contentType: varchar("CONTENT_TYPE", { length: 50 }),
	// TODO: failed to parse database type 'bytea'
	contentData: bytea("CONTENT_DATA"),
	remarks: varchar("REMARKS", { length: 1000 }),
	statusMaster: varchar("STATUS_MASTER", { length: 20 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
	createdIpAddress: varchar("CREATED_IP_ADDRESS", { length: 50 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
	modifiedIpAddress: varchar("MODIFIED_IP_ADDRESS", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.expenseRefNo],
		foreignColumns: [tblExpenseHdrInStoentries.expenseRefNo],
		name: "TBL_EXPENSE_FILES_UPLOAD_EXPENSE_REF_NO_TBL_EXPENSE_HDR_EXPENSE"
	}),
]);

export const tblCustomerReceiptHdrInStoentries = stoentries.table("TBL_CUSTOMER_RECEIPT_HDR", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	sno: bigint("SNO", { mode: "number" }).generatedAlwaysAsIdentity({ name: "stoentries.TBL_CUSTOMER_RECEIPT_HDR_SNO_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807 }),
	receiptRefNo: varchar("RECEIPT_REF_NO", { length: 50 }).primaryKey().notNull(),
	receiptDate: timestamp("RECEIPT_DATE", { mode: 'string' }),
	paymentType: varchar("PAYMENT_TYPE", { length: 50 }),
	companyId: integer("COMPANY_ID"),
	customerId: integer("CUSTOMER_ID"),
	paymentModeId: integer("PAYMENT_MODE_ID"),
	crBankCashId: integer("CR_BANK_CASH_ID"),
	crAccountId: integer("CR_ACCOUNT_ID"),
	drBankCashId: integer("DR_BANK_CASH_ID"),
	transactionRefNo: varchar("TRANSACTION_REF_NO", { length: 100 }),
	transactionDate: timestamp("TRANSACTION_DATE", { mode: 'string' }),
	currencyId: integer("CURRENCY_ID"),
	receiptAmount: numeric("RECEIPT_AMOUNT", { precision: 30, scale: 2 }),
	exchangeRate: numeric("EXCHANGE_RATE", { precision: 30, scale: 2 }),
	receiptAmountLc: numeric("RECEIPT_AMOUNT_LC", { precision: 30, scale: 2 }),
	remarks: varchar("REMARKS", { length: 1000 }),
	statusEntry: varchar("STATUS_ENTRY", { length: 20 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
	createdMacAddress: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
	modifiedMacAddress: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
	submittedBy: varchar("Submitted_By", { length: 50 }),
	submittedDate: timestamp("Submitted_Date", { mode: 'string' }),
	submittedIpAddress: varchar("Submitted_IP_Address", { length: 50 }),
	tallyRefNo: varchar("Tally_Ref_No", { length: 50 }),
	tallySyncStatus: varchar("Tally_Sync_Status", { length: 20 }),
	tallySyncDate: timestamp("Tally_Sync_Date", { mode: 'string' }),
	tallySyncPersonName: varchar("Tally_Sync_Person_Name", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.companyId],
		foreignColumns: [tblCompanyMasterInStomaster.companyId],
		name: "TBL_CUSTOMER_RECEIPT_HDR_COMPANY_ID_tbl_Company_Master_Company_"
	}),
	foreignKey({
		columns: [table.customerId],
		foreignColumns: [tblCustomerMasterInStomaster.customerId],
		name: "TBL_CUSTOMER_RECEIPT_HDR_CUSTOMER_ID_tbl_Customer_Master_Custom"
	}),
	foreignKey({
		columns: [table.paymentModeId],
		foreignColumns: [tblCustomerPaymentModeMasterInStomaster.paymentModeId],
		name: "TBL_CUSTOMER_RECEIPT_HDR_PAYMENT_MODE_ID_TBL_CUSTOMER_PAYMENT_M"
	}),
	foreignKey({
		columns: [table.crBankCashId],
		foreignColumns: [tblBankMasterInStomaster.bankId],
		name: "TBL_CUSTOMER_RECEIPT_HDR_CR_BANK_CASH_ID_TBL_BANK_MASTER_BANK_I"
	}),
	foreignKey({
		columns: [table.crAccountId],
		foreignColumns: [tblCompanyBankAccountMasterInStomaster.accountId],
		name: "TBL_CUSTOMER_RECEIPT_HDR_CR_ACCOUNT_ID_tbl_Company_Bank_Account"
	}),
	foreignKey({
		columns: [table.drBankCashId],
		foreignColumns: [tblBankMasterInStomaster.bankId],
		name: "TBL_CUSTOMER_RECEIPT_HDR_DR_BANK_CASH_ID_TBL_BANK_MASTER_BANK_I"
	}),
	foreignKey({
		columns: [table.currencyId],
		foreignColumns: [tblCurrencyMasterInStomaster.currencyId],
		name: "TBL_CUSTOMER_RECEIPT_HDR_CURRENCY_ID_TBL_CURRENCY_MASTER_CURREN"
	}),
]);

export const tblDeliveryFilesUploadInStoentries = stoentries.table("TBL_DELIVERY_FILES_UPLOAD", {
	sno: integer("SNO").primaryKey().generatedAlwaysAsIdentity({ name: "stoentries.TBL_DELIVERY_FILES_UPLOAD_SNO_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	deliveryNoteRefNo: varchar("DELIVERY_NOTE_REF_NO", { length: 50 }),
	documentType: varchar("DOCUMENT_TYPE", { length: 50 }),
	descriptionDetails: varchar("DESCRIPTION_DETAILS", { length: 100 }),
	fileName: varchar("FILE_NAME", { length: 150 }),
	contentType: varchar("CONTENT_TYPE", { length: 50 }),
	// TODO: failed to parse database type 'bytea'
	contentData: bytea("CONTENT_DATA"),
	remarks: varchar("REMARKS", { length: 1000 }),
	statusMaster: varchar("STATUS_MASTER", { length: 20 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
	createdIpAddress: varchar("CREATED_IP_ADDRESS", { length: 50 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
	modifiedIpAddress: varchar("MODIFIED_IP_ADDRESS", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.deliveryNoteRefNo],
		foreignColumns: [tblDeliveryNoteHdrInStoentries.deliveryNoteRefNo],
		name: "TBL_DELIVERY_FILES_UPLOAD_DELIVERY_NOTE_REF_NO_TBL_DELIVERY_NOT"
	}),
]);

export const tblPurchaseInvoiceHdrInStoentries = stoentries.table("TBL_PURCHASE_INVOICE_HDR", {
	sno: integer("SNO").generatedAlwaysAsIdentity({ name: "stoentries.TBL_PURCHASE_INVOICE_HDR_SNO_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	purchaseInvoiceRefNo: varchar("PURCHASE_INVOICE_REF_NO", { length: 50 }).primaryKey().notNull(),
	companyId: integer("COMPANY_ID"),
	invoiceNo: varchar("INVOICE_NO", { length: 100 }),
	invoiceDate: timestamp("INVOICE_DATE", { mode: 'string' }),
	poRefNo: varchar("PO_REF_NO", { length: 50 }),
	purchaseType: varchar("PURCHASE_TYPE", { length: 20 }),
	supplierId: integer("SUPPLIER_ID"),
	storeId: integer("STORE_ID"),
	paymentTermId: integer("PAYMENT_TERM_ID"),
	modeOfPayment: varchar("MODE_OF_PAYMENT", { length: 25 }),
	currencyId: integer("CURRENCY_ID"),
	priceTerms: varchar("PRICE_TERMS", { length: 150 }),
	productHdrAmount: numeric("PRODUCT_HDR_AMOUNT", { precision: 30, scale: 4 }),
	totalAdditionalCostAmount: numeric("TOTAL_ADDITIONAL_COST_AMOUNT", { precision: 30, scale: 4 }),
	totalProductHdrAmount: numeric("TOTAL_PRODUCT_HDR_AMOUNT", { precision: 30, scale: 4 }),
	totalVatHdrAmount: numeric("TOTAL_VAT_HDR_AMOUNT", { precision: 30, scale: 2 }),
	finalInvoiceHdrAmount: numeric("FINAL_INVOICE_HDR_AMOUNT", { precision: 30, scale: 2 }),
	exchangeRate: numeric("EXCHANGE_RATE", { precision: 30, scale: 2 }),
	productHdrAmountLc: numeric("PRODUCT_HDR_AMOUNT_LC", { precision: 30, scale: 4 }),
	totalAdditionalCostAmountLc: numeric("TOTAL_ADDITIONAL_COST_AMOUNT_LC", { precision: 30, scale: 4 }),
	totalProductHdrAmountLc: numeric("TOTAL_PRODUCT_HDR_AMOUNT_LC", { precision: 30, scale: 4 }),
	totalVatHdrAmountLc: numeric("TOTAL_VAT_HDR_AMOUNT_LC", { precision: 30, scale: 2 }),
	finalPurchaseInvoiceAmountLc: numeric("FINAL_PURCHASE_INVOICE_AMOUNT_LC", { precision: 30, scale: 2 }),
	submittedBy: varchar("SUBMITTED_BY", { length: 50 }),
	submittedDate: timestamp("SUBMITTED_DATE", { mode: 'string' }),
	submittedIpAddress: varchar("SUBMITTED_IP_ADDRESS", { length: 50 }),
	response1Person: varchar("RESPONSE_1_PERSON", { length: 50 }),
	response1Date: timestamp("RESPONSE_1_DATE", { mode: 'string' }),
	response1Status: varchar("RESPONSE_1_STATUS", { length: 50 }),
	response1Remarks: varchar("RESPONSE_1_REMARKS", { length: 5000 }),
	response1IpAddress: varchar("RESPONSE_1_IP_ADDRESS", { length: 50 }),
	response2Person: varchar("RESPONSE_2_PERSON", { length: 50 }),
	response2Date: timestamp("RESPONSE_2_DATE", { mode: 'string' }),
	response2Status: varchar("RESPONSE_2_STATUS", { length: 50 }),
	response2Remarks: varchar("RESPONSE_2_REMARKS", { length: 5000 }),
	response2IpAddress: varchar("RESPONSE_2_IP_ADDRESS", { length: 50 }),
	finalResponsePerson: varchar("FINAL_RESPONSE_PERSON", { length: 50 }),
	finalResponseDate: timestamp("FINAL_RESPONSE_DATE", { mode: 'string' }),
	finalResponseStatus: varchar("FINAL_RESPONSE_STATUS", { length: 50 }),
	finalResponseRemarks: varchar("FINAL_RESPONSE_REMARKS", { length: 5000 }),
	remarks: varchar("REMARKS", { length: 2000 }),
	statusEntry: varchar("STATUS_ENTRY", { length: 20 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
	createdIpAddress: varchar("CREATED_IP_ADDRESS", { length: 50 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
	modifiedIpAddress: varchar("MODIFIED_IP_ADDRESS", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.companyId],
		foreignColumns: [tblCompanyMasterInStomaster.companyId],
		name: "TBL_PURCHASE_INVOICE_HDR_COMPANY_ID_tbl_Company_Master_Company_"
	}),
	foreignKey({
		columns: [table.supplierId],
		foreignColumns: [tblSupplierMasterInStomaster.supplierId],
		name: "TBL_PURCHASE_INVOICE_HDR_SUPPLIER_ID_tbl_Supplier_Master_Suppli"
	}),
	foreignKey({
		columns: [table.paymentTermId],
		foreignColumns: [tblPaymentTermMasterInStomaster.paymentTermId],
		name: "TBL_PURCHASE_INVOICE_HDR_PAYMENT_TERM_ID_TBL_PAYMENT_TERM_MASTE"
	}),
	foreignKey({
		columns: [table.currencyId],
		foreignColumns: [tblCurrencyMasterInStomaster.currencyId],
		name: "TBL_PURCHASE_INVOICE_HDR_CURRENCY_ID_TBL_CURRENCY_MASTER_CURREN"
	}),
	foreignKey({
		columns: [table.storeId],
		foreignColumns: [tblStoreMasterInStomaster.storeId],
		name: "TBL_PURCHASE_INVOICE_HDR_STORE_ID_tbl_Store_Master_Store_Id_fk"
	}),
]);

export const tblGoodsInwardGrnDtlInStoentries = stoentries.table("TBL_GOODS_INWARD_GRN_DTL", {
	sno: integer("SNO").primaryKey().generatedAlwaysAsIdentity({ name: "stoentries.TBL_GOODS_INWARD_GRN_DTL_SNO_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	grnRefNo: varchar("GRN_REF_NO", { length: 50 }),
	poDtlSno: integer("PO_DTL_SNO"),
	mainCategoryId: integer("MAIN_CATEGORY_ID"),
	subCategoryId: integer("SUB_CATEGORY_ID"),
	productId: integer("PRODUCT_ID"),
	qtyPerPacking: numeric("QTY_PER_PACKING", { precision: 30, scale: 2 }),
	totalQty: numeric("TOTAL_QTY", { precision: 30, scale: 4 }),
	uom: varchar("UOM", { length: 50 }),
	totalPacking: numeric("TOTAL_PACKING", { precision: 30, scale: 4 }),
	alternateUom: varchar("ALTERNATE_UOM", { length: 500 }),
	remarks: varchar("REMARKS", { length: 2000 }),
	statusEntry: varchar("STATUS_ENTRY", { length: 20 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
	createdIpAddress: varchar("CREATED_IP_ADDRESS", { length: 50 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
	modifiedIpAddress: varchar("MODIFIED_IP_ADDRESS", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.grnRefNo],
		foreignColumns: [tblGoodsInwardGrnHdrInStoentries.grnRefNo],
		name: "TBL_GOODS_INWARD_GRN_DTL_GRN_REF_NO_TBL_GOODS_INWARD_GRN_HDR_GR"
	}),
	foreignKey({
		columns: [table.mainCategoryId],
		foreignColumns: [tblProductMainCategoryMasterInStomaster.mainCategoryId],
		name: "TBL_GOODS_INWARD_GRN_DTL_MAIN_CATEGORY_ID_TBL_PRODUCT_MAIN_CATE"
	}),
	foreignKey({
		columns: [table.subCategoryId],
		foreignColumns: [tblProductSubCategoryMasterInStomaster.subCategoryId],
		name: "TBL_GOODS_INWARD_GRN_DTL_SUB_CATEGORY_ID_TBL_PRODUCT_SUB_CATEGO"
	}),
	foreignKey({
		columns: [table.productId],
		foreignColumns: [tblProductMasterInStomaster.productId],
		name: "TBL_GOODS_INWARD_GRN_DTL_PRODUCT_ID_TBL_PRODUCT_MASTER_PRODUCT_"
	}),
]);

export const tblPurchaseInvoiceDtlInStoentries = stoentries.table("TBL_PURCHASE_INVOICE_DTL", {
	sno: integer("SNO").primaryKey().generatedAlwaysAsIdentity({ name: "stoentries.TBL_PURCHASE_INVOICE_DTL_SNO_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	purchaseInvoiceRefNo: varchar("PURCHASE_INVOICE_REF_NO", { length: 50 }),
	grnRefNo: varchar("GRN_REF_NO", { length: 50 }),
	mainCategoryId: integer("MAIN_CATEGORY_ID"),
	subCategoryId: integer("SUB_CATEGORY_ID"),
	productId: integer("PRODUCT_ID"),
	qtyPerPacking: numeric("QTY_PER_PACKING", { precision: 30, scale: 2 }),
	totalQty: numeric("TOTAL_QTY", { precision: 30, scale: 4 }),
	uom: varchar("UOM", { length: 50 }),
	totalPacking: numeric("TOTAL_PACKING", { precision: 30, scale: 4 }),
	alternateUom: varchar("ALTERNATE_UOM", { length: 500 }),
	ratePerQty: numeric("RATE_PER_QTY", { precision: 30, scale: 6 }),
	productAmount: numeric("PRODUCT_AMOUNT", { precision: 30, scale: 4 }),
	discountPercentage: numeric("DISCOUNT_PERCENTAGE", { precision: 30, scale: 2 }),
	discountAmount: numeric("DISCOUNT_AMOUNT", { precision: 30, scale: 4 }),
	totalProductAmount: numeric("TOTAL_PRODUCT_AMOUNT", { precision: 30, scale: 4 }),
	vatPercentage: numeric("VAT_PERCENTAGE", { precision: 30, scale: 2 }),
	vatAmount: numeric("VAT_AMOUNT", { precision: 30, scale: 4 }),
	finalProductAmount: numeric("FINAL_PRODUCT_AMOUNT", { precision: 30, scale: 4 }),
	totalProductAmountLc: numeric("TOTAL_PRODUCT_AMOUNT_LC", { precision: 30, scale: 4 }),
	finalProductAmountLc: numeric("FINAL_PRODUCT_AMOUNT_LC", { precision: 30, scale: 4 }),
	remarks: varchar("REMARKS", { length: 2000 }),
	statusEntry: varchar("STATUS_ENTRY", { length: 20 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
	createdIpAddress: varchar("CREATED_IP_ADDRESS", { length: 50 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
	modifiedIpAddress: varchar("MODIFIED_IP_ADDRESS", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.purchaseInvoiceRefNo],
		foreignColumns: [tblPurchaseInvoiceHdrInStoentries.purchaseInvoiceRefNo],
		name: "TBL_PURCHASE_INVOICE_DTL_PURCHASE_INVOICE_REF_NO_TBL_PURCHASE_I"
	}),
	foreignKey({
		columns: [table.grnRefNo],
		foreignColumns: [tblGoodsInwardGrnHdrInStoentries.grnRefNo],
		name: "TBL_PURCHASE_INVOICE_DTL_GRN_REF_NO_TBL_GOODS_INWARD_GRN_HDR_GR"
	}),
	foreignKey({
		columns: [table.mainCategoryId],
		foreignColumns: [tblProductMainCategoryMasterInStomaster.mainCategoryId],
		name: "TBL_PURCHASE_INVOICE_DTL_MAIN_CATEGORY_ID_TBL_PRODUCT_MAIN_CATE"
	}),
	foreignKey({
		columns: [table.subCategoryId],
		foreignColumns: [tblProductSubCategoryMasterInStomaster.subCategoryId],
		name: "TBL_PURCHASE_INVOICE_DTL_SUB_CATEGORY_ID_TBL_PRODUCT_SUB_CATEGO"
	}),
	foreignKey({
		columns: [table.productId],
		foreignColumns: [tblProductMasterInStomaster.productId],
		name: "TBL_PURCHASE_INVOICE_DTL_PRODUCT_ID_TBL_PRODUCT_MASTER_PRODUCT_"
	}),
]);

export const tblPurchaseInvoiceFilesUploadInStoentries = stoentries.table("TBL_PURCHASE_INVOICE_FILES_UPLOAD", {
	sno: integer("SNO").primaryKey().generatedAlwaysAsIdentity({ name: "stoentries.TBL_PURCHASE_INVOICE_FILES_UPLOAD_SNO_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	purchaseInvoiceRefNo: varchar("PURCHASE_INVOICE_REF_NO", { length: 50 }),
	documentType: varchar("DOCUMENT_TYPE", { length: 50 }),
	descriptionDetails: varchar("DESCRIPTION_DETAILS", { length: 100 }),
	fileName: varchar("FILE_NAME", { length: 150 }),
	contentType: varchar("CONTENT_TYPE", { length: 50 }),
	// TODO: failed to parse database type 'bytea'
	contentData: bytea("CONTENT_DATA"),
	remarks: varchar("REMARKS", { length: 1000 }),
	statusMaster: varchar("STATUS_MASTER", { length: 20 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
	createdIpAddress: varchar("CREATED_IP_ADDRESS", { length: 50 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
	modifiedIpAddress: varchar("MODIFIED_IP_ADDRESS", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.purchaseInvoiceRefNo],
		foreignColumns: [tblPurchaseInvoiceHdrInStoentries.purchaseInvoiceRefNo],
		name: "TBL_PURCHASE_INVOICE_FILES_UPLOAD_PURCHASE_INVOICE_REF_NO_TBL_P"
	}),
]);

export const tblPurchaseInvoiceAdditionalCostDetailsInStoentries = stoentries.table("TBL_PURCHASE_INVOICE_ADDITIONAL_COST_DETAILS", {
	sno: integer("SNO").primaryKey().generatedAlwaysAsIdentity({ name: "stoentries.TBL_PURCHASE_INVOICE_ADDITIONAL_COST_DETAILS_SNO_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	purchaseInvoiceNo: varchar("PURCHASE_INVOICE_NO", { length: 50 }),
	additionalCostTypeId: integer("ADDITIONAL_COST_TYPE_ID"),
	additionalCostAmount: numeric("ADDITIONAL_COST_AMOUNT", { precision: 30, scale: 4 }),
	remarks: varchar("REMARKS", { length: 1000 }),
	statusMaster: varchar("STATUS_MASTER", { length: 50 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
	createdIpAddress: varchar("CREATED_IP_ADDRESS", { length: 50 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
	modifiedIpAddress: varchar("MODIFIED_IP_ADDRESS", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.purchaseInvoiceNo],
		foreignColumns: [tblPurchaseInvoiceHdrInStoentries.purchaseInvoiceRefNo],
		name: "TBL_PURCHASE_INVOICE_ADDITIONAL_COST_DETAILS_PURCHASE_INVOICE_N"
	}),
	foreignKey({
		columns: [table.additionalCostTypeId],
		foreignColumns: [tblAdditionalCostTypeMasterInStomaster.additionalCostTypeId],
		name: "TBL_PURCHASE_INVOICE_ADDITIONAL_COST_DETAILS_ADDITIONAL_COST_TY"
	}),
]);

export const tblPurchaseOrderConversationDtlInStoentries = stoentries.table("TBL_PURCHASE_ORDER_CONVERSATION_DTL", {
	sno: integer("SNO").primaryKey().generatedAlwaysAsIdentity({ name: "stoentries.TBL_PURCHASE_ORDER_CONVERSATION_DTL_SNO_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	poRefNo: varchar("PO_REF_NO", { length: 50 }),
	respondPerson: varchar("RESPOND_PERSON", { length: 50 }),
	discussionDetails: text("DISCUSSION_DETAILS"),
	responseStatus: varchar("RESPONSE_STATUS", { length: 50 }),
	statusEntry: varchar("STATUS_ENTRY", { length: 50 }),
	remarks: varchar("REMARKS", { length: 50 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
	createdIpAddress: varchar("CREATED_IP_ADDRESS", { length: 50 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
	modifiedIpAddress: varchar("MODIFIED_IP_ADDRESS", { length: 50 }),
});

export const tblGoodsInwardGrnHdrInStoentries = stoentries.table("TBL_GOODS_INWARD_GRN_HDR", {
	sno: integer("SNO").generatedAlwaysAsIdentity({ name: "stoentries.TBL_GOODS_INWARD_GRN_HDR_SNO_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	grnRefNo: varchar("GRN_REF_NO", { length: 50 }).primaryKey().notNull(),
	grnDate: timestamp("GRN_DATE", { mode: 'string' }),
	companyId: integer("COMPANY_ID"),
	sourceStoreId: integer("SOURCE_STORE_ID"),
	grnStoreId: integer("GRN_STORE_ID"),
	grnSource: varchar("GRN_SOURCE", { length: 50 }),
	deliveryNoteRefNo: varchar("DELIVERY_NOTE_REF_NO", { length: 50 }),
	supplierId: integer("SUPPLIER_ID"),
	poRefNo: varchar("PO_REF_NO", { length: 50 }),
	purchaseInvoiceRefNo: varchar("PURCHASE_INVOICE_REF_NO", { length: 50 }),
	supplierInvoiceNumber: varchar("SUPPLIER_INVOICE_NUMBER", { length: 100 }),
	containerNo: varchar("CONTAINER_NO", { length: 20 }),
	driverName: varchar("DRIVER_NAME", { length: 50 }),
	driverContactNumber: varchar("DRIVER_CONTACT_NUMBER", { length: 50 }),
	vehicleNo: varchar("VEHICLE_NO", { length: 50 }),
	sealNo: varchar("SEAL_NO", { length: 50 }),
	remarks: varchar("REMARKS", { length: 2000 }),
	statusEntry: varchar("STATUS_ENTRY", { length: 20 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
	createdIpAddress: varchar("CREATED_IP_ADDRESS", { length: 50 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
	modifiedIpAddress: varchar("MODIFIED_IP_ADDRESS", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.companyId],
		foreignColumns: [tblCompanyMasterInStomaster.companyId],
		name: "TBL_GOODS_INWARD_GRN_HDR_COMPANY_ID_tbl_Company_Master_Company_"
	}),
	foreignKey({
		columns: [table.sourceStoreId],
		foreignColumns: [tblStoreMasterInStomaster.storeId],
		name: "TBL_GOODS_INWARD_GRN_HDR_SOURCE_STORE_ID_tbl_Store_Master_Store"
	}),
	foreignKey({
		columns: [table.grnStoreId],
		foreignColumns: [tblStoreMasterInStomaster.storeId],
		name: "TBL_GOODS_INWARD_GRN_HDR_GRN_STORE_ID_tbl_Store_Master_Store_Id"
	}),
	foreignKey({
		columns: [table.supplierId],
		foreignColumns: [tblSupplierMasterInStomaster.supplierId],
		name: "TBL_GOODS_INWARD_GRN_HDR_SUPPLIER_ID_tbl_Supplier_Master_Suppli"
	}),
]);

export const tblPurchaseOrderHdrInStoentries = stoentries.table("TBL_PURCHASE_ORDER_HDR", {
	sno: integer("SNO").generatedAlwaysAsIdentity({ name: "stoentries.TBL_PURCHASE_ORDER_HDR_SNO_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	poRefNo: varchar("PO_REF_NO", { length: 50 }).primaryKey().notNull(),
	poDate: timestamp("PO_DATE", { mode: 'string' }),
	purchaseType: varchar("PURCHASE_TYPE", { length: 20 }),
	companyId: integer("COMPANY_ID"),
	supplierId: integer("SUPPLIER_ID"),
	poStoreId: integer("PO_STORE_ID"),
	paymentTermId: integer("PAYMENT_TERM_ID"),
	modeOfPayment: varchar("MODE_OF_PAYMENT", { length: 25 }),
	currencyId: integer("CURRENCY_ID"),
	supplierProformaNumber: varchar("SUPPLIER_PROFORMA_NUMBER", { length: 100 }),
	shipmentMode: varchar("SHIPMENT_MODE", { length: 100 }),
	priceTerms: varchar("PRICE_TERMS", { length: 150 }),
	estimatedShipmentDate: timestamp("ESTIMATED_SHIPMENT_DATE", { mode: 'string' }),
	shipmentRemarks: varchar("SHIPMENT_REMARKS", { length: 2500 }),
	productHdrAmount: numeric("PRODUCT_HDR_AMOUNT", { precision: 30, scale: 4 }),
	totalAdditionalCostAmount: numeric("TOTAL_ADDITIONAL_COST_AMOUNT", { precision: 30, scale: 4 }),
	totalProductHdrAmount: numeric("TOTAL_PRODUCT_HDR_AMOUNT", { precision: 30, scale: 4 }),
	totalVatHdrAmount: numeric("TOTAL_VAT_HDR_AMOUNT", { precision: 30, scale: 2 }),
	finalPurchaseHdrAmount: numeric("FINAL_PURCHASE_HDR_AMOUNT", { precision: 30, scale: 2 }),
	exchangeRate: numeric("EXCHANGE_RATE", { precision: 30, scale: 2 }),
	productHdrAmountLc: numeric("PRODUCT_HDR_AMOUNT_LC", { precision: 30, scale: 4 }),
	totalAdditionalCostAmountLc: numeric("TOTAL_ADDITIONAL_COST_AMOUNT_LC", { precision: 30, scale: 4 }),
	totalProductHdrAmountLc: numeric("TOTAL_PRODUCT_HDR_AMOUNT_LC", { precision: 30, scale: 4 }),
	totalVatHdrAmountLc: numeric("TOTAL_VAT_HDR_AMOUNT_LC", { precision: 30, scale: 2 }),
	finalPurchaseHdrAmountLc: numeric("FINAL_PURCHASE_HDR_AMOUNT_LC", { precision: 30, scale: 2 }),
	submittedBy: varchar("SUBMITTED_BY", { length: 50 }),
	submittedDate: timestamp("SUBMITTED_DATE", { mode: 'string' }),
	submittedIpAddress: varchar("SUBMITTED_IP_ADDRESS", { length: 50 }),
	purchaseHeadResponsePerson: varchar("PURCHASE_HEAD_RESPONSE_PERSON", { length: 50 }),
	purchaseHeadResponseDate: timestamp("PURCHASE_HEAD_RESPONSE_DATE", { mode: 'string' }),
	purchaseHeadResponseStatus: varchar("PURCHASE_HEAD_RESPONSE_STATUS", { length: 50 }),
	purchaseHeadResponseRemarks: varchar("PURCHASE_HEAD_RESPONSE_REMARKS", { length: 500 }),
	purchaseHeadResponseIpAddress: varchar("PURCHASE_HEAD_RESPONSE_IP_ADDRESS", { length: 50 }),
	response1Person: varchar("RESPONSE_1_PERSON", { length: 50 }),
	response1Date: timestamp("RESPONSE_1_DATE", { mode: 'string' }),
	response1Status: varchar("RESPONSE_1_STATUS", { length: 50 }),
	response1Remarks: varchar("RESPONSE_1_REMARKS", { length: 5000 }),
	response1IpAddress: varchar("RESPONSE_1_IP_ADDRESS", { length: 50 }),
	response2Person: varchar("RESPONSE_2_PERSON", { length: 50 }),
	response2Date: timestamp("RESPONSE_2_DATE", { mode: 'string' }),
	response2Status: varchar("RESPONSE_2_STATUS", { length: 50 }),
	response2Remarks: varchar("RESPONSE_2_REMARKS", { length: 5000 }),
	response2IpAddress: varchar("RESPONSE_2_IP_ADDRESS", { length: 50 }),
	finalResponsePerson: varchar("FINAL_RESPONSE_PERSON", { length: 50 }),
	finalResponseDate: timestamp("FINAL_RESPONSE_DATE", { mode: 'string' }),
	finalResponseStatus: varchar("FINAL_RESPONSE_STATUS", { length: 50 }),
	finalResponseRemarks: varchar("FINAL_RESPONSE_REMARKS", { length: 5000 }),
	podDeliveryPerson: varchar("POD_DELIVERY_PERSON", { length: 150 }),
	podDeliveryDate: timestamp("POD_DELIVERY_DATE", { mode: 'string' }),
	podRemarks: varchar("POD_REMARKS", { length: 2000 }),
	remarks: varchar("REMARKS", { length: 2000 }),
	statusEntry: varchar("STATUS_ENTRY", { length: 20 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
	createdIpAddress: varchar("CREATED_IP_ADDRESS", { length: 50 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
	modifiedIpAddress: varchar("MODIFIED_IP_ADDRESS", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.companyId],
		foreignColumns: [tblCompanyMasterInStomaster.companyId],
		name: "TBL_PURCHASE_ORDER_HDR_COMPANY_ID_tbl_Company_Master_Company_Id"
	}),
	foreignKey({
		columns: [table.supplierId],
		foreignColumns: [tblSupplierMasterInStomaster.supplierId],
		name: "TBL_PURCHASE_ORDER_HDR_SUPPLIER_ID_tbl_Supplier_Master_Supplier"
	}),
	foreignKey({
		columns: [table.paymentTermId],
		foreignColumns: [tblPaymentTermMasterInStomaster.paymentTermId],
		name: "TBL_PURCHASE_ORDER_HDR_PAYMENT_TERM_ID_TBL_PAYMENT_TERM_MASTER_"
	}),
	foreignKey({
		columns: [table.currencyId],
		foreignColumns: [tblCurrencyMasterInStomaster.currencyId],
		name: "TBL_PURCHASE_ORDER_HDR_CURRENCY_ID_TBL_CURRENCY_MASTER_CURRENCY"
	}),
	foreignKey({
		columns: [table.poStoreId],
		foreignColumns: [tblStoreMasterInStomaster.storeId],
		name: "TBL_PURCHASE_ORDER_HDR_PO_STORE_ID_tbl_Store_Master_Store_Id_fk"
	}),
]);

export const tblSalesOrderHdrInStoentries = stoentries.table("TBL_SALES_ORDER_HDR", {
	sno: integer("SNO").generatedAlwaysAsIdentity({ name: "stoentries.TBL_SALES_ORDER_HDR_SNO_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	salesOrderRefNo: varchar("SALES_ORDER_REF_NO", { length: 50 }).primaryKey().notNull(),
	salesOrderDate: timestamp("SALES_ORDER_DATE", { mode: 'string' }).notNull(),
	salesProformaRefNo: varchar("SALES_PROFORMA_REF_NO", { length: 50 }).notNull(),
	companyId: integer("COMPANY_ID"),
	storeId: integer("STORE_ID"),
	customerId: integer("CUSTOMER_ID"),
	billingLocationId: integer("BILLING_LOCATION_ID"),
	salesPersonEmpId: integer("SALES_PERSON_EMP_ID"),
	creditLimitAmount: numeric("CREDIT_LIMIT_AMOUNT", { precision: 30, scale: 2 }),
	creditLimitDays: numeric("CREDIT_LIMIT_DAYS", { precision: 30, scale: 2 }),
	outstandingAmount: numeric("OUTSTANDING_AMOUNT", { precision: 30, scale: 2 }),
	currencyId: integer("CURRENCY_ID"),
	exchangeRate: numeric("EXCHANGE_RATE", { precision: 30, scale: 2 }),
	totalProductAmount: numeric("TOTAL_PRODUCT_AMOUNT", { precision: 30, scale: 4 }),
	vatAmount: numeric("VAT_AMOUNT", { precision: 30, scale: 4 }),
	finalSalesAmount: numeric("FINAL_SALES_AMOUNT", { precision: 30, scale: 4 }),
	totalProductAmountLc: numeric("TOTAL_PRODUCT_AMOUNT_LC", { precision: 30, scale: 4 }),
	finalSalesAmountLc: numeric("FINAL_SALES_AMOUNT_LC", { precision: 30, scale: 4 }),
	remarks: varchar("REMARKS", { length: 2000 }),
	testDesc: varchar("TEST_DESC", { length: 50 }),
	statusEntry: varchar("STATUS_ENTRY", { length: 20 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
	createdMacAddress: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
	modifiedMacAddress: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
	submittedBy: varchar("SUBMITTED_BY", { length: 50 }),
	submittedDate: timestamp("SUBMITTED_DATE", { mode: 'string' }),
}, (table) => [
	foreignKey({
		columns: [table.salesProformaRefNo],
		foreignColumns: [tblSalesProformaHdrInStoentries.salesProformaRefNo],
		name: "TBL_SALES_ORDER_HDR_SALES_PROFORMA_REF_NO_TBL_SALES_PROFORMA_HD"
	}),
	foreignKey({
		columns: [table.customerId],
		foreignColumns: [tblCustomerMasterInStomaster.customerId],
		name: "TBL_SALES_ORDER_HDR_CUSTOMER_ID_tbl_Customer_Master_Customer_Id"
	}),
	foreignKey({
		columns: [table.billingLocationId],
		foreignColumns: [tblBillingLocationMasterInStomaster.billingLocationId],
		name: "TBL_SALES_ORDER_HDR_BILLING_LOCATION_ID_tbl_Billing_Location_Ma"
	}),
	foreignKey({
		columns: [table.salesPersonEmpId],
		foreignColumns: [tblSalesPersonMasterInStomaster.salesPersonId],
		name: "TBL_SALES_ORDER_HDR_SALES_PERSON_EMP_ID_TBL_SALES_PERSON_MASTER"
	}),
	foreignKey({
		columns: [table.currencyId],
		foreignColumns: [tblCurrencyMasterInStomaster.currencyId],
		name: "TBL_SALES_ORDER_HDR_CURRENCY_ID_TBL_CURRENCY_MASTER_CURRENCY_ID"
	}),
	foreignKey({
		columns: [table.companyId],
		foreignColumns: [tblCompanyMasterInStomaster.companyId],
		name: "TBL_SALES_ORDER_HDR_COMPANY_ID_tbl_Company_Master_Company_Id_fk"
	}),
	foreignKey({
		columns: [table.storeId],
		foreignColumns: [tblStoreMasterInStomaster.storeId],
		name: "TBL_SALES_ORDER_HDR_STORE_ID_tbl_Store_Master_Store_Id_fk"
	}),
]);

export const tblPurchaseOrderFilesUploadInStoentries = stoentries.table("TBL_PURCHASE_ORDER_FILES_UPLOAD", {
	sno: integer("SNO").primaryKey().generatedAlwaysAsIdentity({ name: "stoentries.TBL_PURCHASE_ORDER_FILES_UPLOAD_SNO_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	poRefNo: varchar("PO_REF_NO", { length: 50 }),
	documentType: varchar("DOCUMENT_TYPE", { length: 50 }),
	descriptionDetails: varchar("DESCRIPTION_DETAILS", { length: 100 }),
	fileName: varchar("FILE_NAME", { length: 150 }),
	contentType: varchar("CONTENT_TYPE", { length: 50 }),
	// TODO: failed to parse database type 'bytea'
	contentData: bytea("CONTENT_DATA"),
	remarks: varchar("REMARKS", { length: 1000 }),
	statusMaster: varchar("STATUS_MASTER", { length: 20 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
	createdIpAddress: varchar("CREATED_IP_ADDRESS", { length: 50 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
	modifiedIpAddress: varchar("MODIFIED_IP_ADDRESS", { length: 50 }),
});

export const tblSalesOrderFilesUploadInStoentries = stoentries.table("TBL_SALES_ORDER_FILES_UPLOAD", {
	sno: integer("SNO").primaryKey().generatedAlwaysAsIdentity({ name: "stoentries.TBL_SALES_ORDER_FILES_UPLOAD_SNO_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	salesOrderRefNo: varchar("SALES_ORDER_REF_NO", { length: 50 }),
	documentType: varchar("DOCUMENT_TYPE", { length: 50 }),
	descriptionDetails: varchar("DESCRIPTION_DETAILS", { length: 100 }),
	fileName: varchar("FILE_NAME", { length: 150 }),
	contentType: varchar("CONTENT_TYPE", { length: 50 }),
	// TODO: failed to parse database type 'bytea'
	contentData: bytea("CONTENT_DATA"),
	remarks: varchar("REMARKS", { length: 1000 }),
	statusMaster: varchar("STATUS_MASTER", { length: 20 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
	createdIpAddress: varchar("CREATED_IP_ADDRESS", { length: 50 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
	modifiedIpAddress: varchar("MODIFIED_IP_ADDRESS", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.salesOrderRefNo],
		foreignColumns: [tblSalesOrderHdrInStoentries.salesOrderRefNo],
		name: "TBL_SALES_ORDER_FILES_UPLOAD_SALES_ORDER_REF_NO_TBL_SALES_ORDER"
	}),
]);

export const tblSalesProformaDtlInStoentries = stoentries.table("TBL_SALES_PROFORMA_DTL", {
	sno: integer("SNO").primaryKey().generatedAlwaysAsIdentity({ name: "stoentries.TBL_SALES_PROFORMA_DTL_SNO_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	salesProformaRefNo: varchar("SALES_PROFORMA_REF_NO", { length: 50 }),
	mainCategoryId: integer("MAIN_CATEGORY_ID"),
	subCategoryId: integer("SUB_CATEGORY_ID"),
	productId: integer("PRODUCT_ID"),
	storeStockPcs: numeric("STORE_STOCK_PCS", { precision: 30, scale: 4 }),
	poRefNo: varchar("PO_REF_NO", { length: 50 }),
	poDtlSno: integer("PO_DTL_SNO"),
	poDtlStockQty: numeric("PO_DTL_STOCK_QTY", { precision: 30, scale: 4 }),
	purchaseRatePerQty: numeric("PURCHASE_RATE_PER_QTY", { precision: 30, scale: 6 }),
	poExpenseAmount: numeric("PO_EXPENSE_AMOUNT", { precision: 30, scale: 4 }),
	salesRatePerQty: numeric("SALES_RATE_PER_QTY", { precision: 30, scale: 6 }),
	qtyPerPacking: numeric("QTY_PER_PACKING", { precision: 30, scale: 2 }),
	totalQty: numeric("TOTAL_QTY", { precision: 30, scale: 4 }),
	uom: varchar("UOM", { length: 50 }),
	totalPacking: numeric("TOTAL_PACKING", { precision: 30, scale: 4 }),
	alternateUom: varchar("ALTERNATE_UOM", { length: 500 }),
	totalProductAmount: numeric("TOTAL_PRODUCT_AMOUNT", { precision: 30, scale: 4 }),
	vatPercentage: numeric("VAT_PERCENTAGE", { precision: 30, scale: 2 }),
	vatAmount: numeric("VAT_AMOUNT", { precision: 30, scale: 4 }),
	finalSalesAmount: numeric("FINAL_SALES_AMOUNT", { precision: 30, scale: 4 }),
	totalProductAmountLc: numeric("TOTAL_PRODUCT_AMOUNT_LC", { precision: 30, scale: 4 }),
	finalSalesAmountLc: numeric("FINAL_SALES_AMOUNT_LC", { precision: 30, scale: 4 }),
	remarks: varchar("REMARKS", { length: 2000 }),
	statusEntry: varchar("STATUS_ENTRY", { length: 20 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
	createdMacAddress: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
	modifiedMacAddress: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.salesProformaRefNo],
		foreignColumns: [tblSalesProformaHdrInStoentries.salesProformaRefNo],
		name: "TBL_SALES_PROFORMA_DTL_SALES_PROFORMA_REF_NO_TBL_SALES_PROFORMA"
	}),
	foreignKey({
		columns: [table.mainCategoryId],
		foreignColumns: [tblProductMainCategoryMasterInStomaster.mainCategoryId],
		name: "TBL_SALES_PROFORMA_DTL_MAIN_CATEGORY_ID_TBL_PRODUCT_MAIN_CATEGO"
	}),
	foreignKey({
		columns: [table.subCategoryId],
		foreignColumns: [tblProductSubCategoryMasterInStomaster.subCategoryId],
		name: "TBL_SALES_PROFORMA_DTL_SUB_CATEGORY_ID_TBL_PRODUCT_SUB_CATEGORY"
	}),
	foreignKey({
		columns: [table.productId],
		foreignColumns: [tblProductMasterInStomaster.productId],
		name: "TBL_SALES_PROFORMA_DTL_PRODUCT_ID_TBL_PRODUCT_MASTER_PRODUCT_ID"
	}),
]);

export const tblSalesProformaFilesUploadInStoentries = stoentries.table("TBL_SALES_PROFORMA_FILES_UPLOAD", {
	sno: integer("SNO").primaryKey().generatedAlwaysAsIdentity({ name: "stoentries.TBL_SALES_PROFORMA_FILES_UPLOAD_SNO_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	salesProformaRefNo: varchar("SALES_PROFORMA_REF_NO", { length: 50 }),
	documentType: varchar("DOCUMENT_TYPE", { length: 50 }),
	descriptionDetails: varchar("DESCRIPTION_DETAILS", { length: 100 }),
	fileName: varchar("FILE_NAME", { length: 150 }),
	contentType: varchar("CONTENT_TYPE", { length: 50 }),
	// TODO: failed to parse database type 'bytea'
	contentData: bytea("CONTENT_DATA"),
	remarks: varchar("REMARKS", { length: 1000 }),
	statusMaster: varchar("STATUS_MASTER", { length: 20 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
	createdIpAddress: varchar("CREATED_IP_ADDRESS", { length: 50 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
	modifiedIpAddress: varchar("MODIFIED_IP_ADDRESS", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.salesProformaRefNo],
		foreignColumns: [tblSalesProformaHdrInStoentries.salesProformaRefNo],
		name: "TBL_SALES_PROFORMA_FILES_UPLOAD_SALES_PROFORMA_REF_NO_TBL_SALES"
	}),
]);

export const tblPurchaseOrderDtlInStoentries = stoentries.table("TBL_PURCHASE_ORDER_DTL", {
	sno: integer("SNO").primaryKey().generatedAlwaysAsIdentity({ name: "stoentries.TBL_PURCHASE_ORDER_DTL_SNO_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	poRefNo: varchar("PO_REF_NO", { length: 50 }),
	requestStoreId: integer("REQUEST_STORE_ID"),
	mainCategoryId: integer("MAIN_CATEGORY_ID"),
	subCategoryId: integer("SUB_CATEGORY_ID"),
	productId: integer("PRODUCT_ID"),
	qtyPerPacking: numeric("QTY_PER_PACKING", { precision: 30, scale: 2 }),
	totalQty: numeric("TOTAL_QTY", { precision: 30, scale: 4 }),
	uom: varchar("UOM", { length: 50 }),
	totalPacking: numeric("TOTAL_PACKING", { precision: 30, scale: 4 }),
	alternateUom: varchar("ALTERNATE_UOM", { length: 500 }),
	ratePerQty: numeric("RATE_PER_QTY", { precision: 30, scale: 6 }),
	productAmount: numeric("PRODUCT_AMOUNT", { precision: 30, scale: 4 }),
	discountPercentage: numeric("DISCOUNT_PERCENTAGE", { precision: 30, scale: 2 }),
	discountAmount: numeric("DISCOUNT_AMOUNT", { precision: 30, scale: 4 }),
	totalProductAmount: numeric("TOTAL_PRODUCT_AMOUNT", { precision: 30, scale: 4 }),
	vatPercentage: numeric("VAT_PERCENTAGE", { precision: 30, scale: 2 }),
	vatAmount: numeric("VAT_AMOUNT", { precision: 30, scale: 4 }),
	finalProductAmount: numeric("FINAL_PRODUCT_AMOUNT", { precision: 30, scale: 4 }),
	totalProductAmountLc: numeric("TOTAL_PRODUCT_AMOUNT_LC", { precision: 30, scale: 4 }),
	finalProductAmountLc: numeric("FINAL_PRODUCT_AMOUNT_LC", { precision: 30, scale: 4 }),
	remarks: varchar("REMARKS", { length: 2000 }),
	statusEntry: varchar("STATUS_ENTRY", { length: 20 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
	createdIpAddress: varchar("CREATED_IP_ADDRESS", { length: 50 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
	modifiedIpAddress: varchar("MODIFIED_IP_ADDRESS", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.requestStoreId],
		foreignColumns: [tblStoreMasterInStomaster.storeId],
		name: "TBL_PURCHASE_ORDER_DTL_REQUEST_STORE_ID_tbl_Store_Master_Store_"
	}),
	foreignKey({
		columns: [table.mainCategoryId],
		foreignColumns: [tblProductMainCategoryMasterInStomaster.mainCategoryId],
		name: "TBL_PURCHASE_ORDER_DTL_MAIN_CATEGORY_ID_TBL_PRODUCT_MAIN_CATEGO"
	}),
	foreignKey({
		columns: [table.subCategoryId],
		foreignColumns: [tblProductSubCategoryMasterInStomaster.subCategoryId],
		name: "TBL_PURCHASE_ORDER_DTL_SUB_CATEGORY_ID_TBL_PRODUCT_SUB_CATEGORY"
	}),
	foreignKey({
		columns: [table.productId],
		foreignColumns: [tblProductMasterInStomaster.productId],
		name: "TBL_PURCHASE_ORDER_DTL_PRODUCT_ID_TBL_PRODUCT_MASTER_PRODUCT_ID"
	}),
]);

export const tblTaxInvoiceDtlInStoentries = stoentries.table("TBL_TAX_INVOICE_DTL", {
	sno: integer("SNO").primaryKey().generatedAlwaysAsIdentity({ name: "stoentries.TBL_TAX_INVOICE_DTL_SNO_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	taxInvoiceRefNo: varchar("TAX_INVOICE_REF_NO", { length: 50 }),
	deliveryNoteDtlSno: integer("DELIVERY_NOTE_DTL_SNO"),
	poDtlSno: integer("PO_DTL_SNO"),
	poRefNo: varchar("PO_REF_NO", { length: 50 }),
	mainCategoryId: integer("MAIN_CATEGORY_ID"),
	subCategoryId: integer("SUB_CATEGORY_ID"),
	productId: integer("PRODUCT_ID"),
	salesRatePerQty: numeric("SALES_RATE_PER_QTY", { precision: 30, scale: 6 }),
	qtyPerPacking: numeric("QTY_PER_PACKING", { precision: 30, scale: 2 }),
	deliveryQty: numeric("DELIVERY_QTY", { precision: 30, scale: 4 }),
	invoiceQty: numeric("INVOICE_QTY", { precision: 30, scale: 4 }),
	uom: varchar("UOM", { length: 50 }),
	totalPacking: numeric("TOTAL_PACKING", { precision: 30, scale: 4 }),
	alternateUom: varchar("ALTERNATE_UOM", { length: 500 }),
	totalProductAmount: numeric("TOTAL_PRODUCT_AMOUNT", { precision: 30, scale: 4 }),
	vatPercentage: numeric("VAT_PERCENTAGE", { precision: 30, scale: 2 }),
	vatAmount: numeric("VAT_AMOUNT", { precision: 30, scale: 4 }),
	finalSalesAmount: numeric("FINAL_SALES_AMOUNT", { precision: 30, scale: 4 }),
	totalProductAmountLc: numeric("TOTAL_PRODUCT_AMOUNT_LC", { precision: 30, scale: 4 }),
	finalSalesAmountLc: numeric("FINAL_SALES_AMOUNT_LC", { precision: 30, scale: 4 }),
	remarks: varchar("REMARKS", { length: 2000 }),
	statusEntry: varchar("STATUS_ENTRY", { length: 20 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
	createdMacAddress: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
	modifiedMacAddress: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.taxInvoiceRefNo],
		foreignColumns: [tblTaxInvoiceHdrInStoentries.taxInvoiceRefNo],
		name: "TBL_TAX_INVOICE_DTL_TAX_INVOICE_REF_NO_TBL_TAX_INVOICE_HDR_TAX_"
	}),
	foreignKey({
		columns: [table.mainCategoryId],
		foreignColumns: [tblProductMainCategoryMasterInStomaster.mainCategoryId],
		name: "TBL_TAX_INVOICE_DTL_MAIN_CATEGORY_ID_TBL_PRODUCT_MAIN_CATEGORY_"
	}),
	foreignKey({
		columns: [table.subCategoryId],
		foreignColumns: [tblProductSubCategoryMasterInStomaster.subCategoryId],
		name: "TBL_TAX_INVOICE_DTL_SUB_CATEGORY_ID_TBL_PRODUCT_SUB_CATEGORY_MA"
	}),
	foreignKey({
		columns: [table.productId],
		foreignColumns: [tblProductMasterInStomaster.productId],
		name: "TBL_TAX_INVOICE_DTL_PRODUCT_ID_TBL_PRODUCT_MASTER_PRODUCT_ID_fk"
	}),
]);

export const tblChangePasswordLogInStomaster = stomaster.table("tbl_Change_Password_Log", {
	sno: integer("Sno").primaryKey().generatedAlwaysAsIdentity({ name: "stomaster.tbl_Change_Password_Log_Sno_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	loginId: integer("login_id"),
	userName: varchar("User_Name", { length: 50 }),
	oldPassword: varchar("Old_Password", { length: 50 }),
	newPassword: varchar("New_Password", { length: 50 }),
	reason: varchar("Reason", { length: 1000 }),
	statusEntry: varchar("status_entry", { length: 50 }),
	createdBy: varchar("Created_by", { length: 50 }),
	createdDate: timestamp("Created_Date", { mode: 'string' }),
	createdMacAddress: varchar("Created_Mac_Address", { length: 50 }),
	modifiedBy: varchar("Modified_by", { length: 50 }),
	modifiedDate: timestamp("Modified_Date", { mode: 'string' }),
	modifiedMacAddress: varchar("Modified_Mac_Address", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.loginId],
		foreignColumns: [tblUserInfoHdrInStomaster.loginIdUserHdr],
		name: "tbl_Change_Password_Log_login_id_TBL_USER_INFO_HDR_LOGIN_ID_USE"
	}),
]);

export const tblCustomerAddressDetailsInStomaster = stomaster.table("tbl_Customer_Address_Details", {
	sno: integer("Sno").primaryKey().generatedAlwaysAsIdentity({ name: "stomaster.tbl_Customer_Address_Details_Sno_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	customerId: integer("Customer_Id"),
	addressType: varchar("ADDRESS_TYPE", { length: 50 }),
	address: varchar("Address", { length: 5000 }),
	locationArea: varchar("LOCATION_AREA", { length: 200 }),
	remarks: varchar("Remarks", { length: 2000 }),
	statusMaster: varchar("Status_Master", { length: 20 }),
	createdBy: varchar("Created_By", { length: 50 }),
	createdDate: timestamp("Created_Date", { mode: 'string' }),
	createdMacAddress: varchar("Created_Mac_Address", { length: 50 }),
	modifiedBy: varchar("Modified_By", { length: 50 }),
	modifiedDate: timestamp("Modified_Date", { mode: 'string' }),
	modifiedMacAddress: varchar("Modified_Mac_Address", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.customerId],
		foreignColumns: [tblCustomerMasterInStomaster.customerId],
		name: "tbl_Customer_Address_Details_Customer_Id_tbl_Customer_Master_Cu"
	}),
]);

export const tblRegionMasterInStomaster = stomaster.table("TBL_REGION_MASTER", {
	regionId: integer("REGION_ID").primaryKey().generatedAlwaysAsIdentity({ name: "stomaster.TBL_REGION_MASTER_REGION_ID_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	regionName: varchar("REGION_NAME", { length: 50 }),
	countryId: integer("COUNTRY_ID"),
	capital: varchar("CAPITAL", { length: 50 }),
	noOfDistricts: integer("NO_OF_DISTRICTS"),
	totalPopulation: numeric("TOTAL_POPULATION", { precision: 30, scale: 2 }),
	zoneName: varchar("ZONE_NAME", { length: 50 }),
	distanceFromArusha: numeric("DISTANCE_FROM_ARUSHA", { precision: 30, scale: 2 }),
	statusMaster: varchar("STATUS_MASTER", { length: 20 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
	createdMacAddress: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
	modifiedMacAddress: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.countryId],
		foreignColumns: [tblCountryMasterInStomaster.countryId],
		name: "TBL_REGION_MASTER_COUNTRY_ID_tbl_country_master_Country_Id_fk"
	}),
	unique("TBL_REGION_MASTER_REGION_NAME_unique").on(table.regionName),
]);

export const tblFieldHdrInStomaster = stomaster.table("tbl_field_hdr", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	fieldIdFldHdr: bigint("field_id_fld_hdr", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity({ name: "stomaster.tbl_field_hdr_field_id_fld_hdr_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	projectNameFldHdr: varchar("project_name_fld_hdr", { length: 50 }),
	fieldCategoryFldHdr: varchar("field_category_fld_hdr", { length: 50 }),
	fieldDescFldHdr: varchar("field_desc_fld_hdr", { length: 150 }),
	statusFldHdr: varchar("status_fld_hdr", { length: 20 }),
	remarksFldHdr: varchar("remarks_fld_hdr", { length: 1000 }),
	createdUserFldHdr: varchar("created_user_fld_hdr", { length: 50 }),
	createdDateFldHdr: timestamp("created_date_fld_hdr", { mode: 'string' }),
	createdMacAddrFldHdr: varchar("created_mac_addr_fld_hdr", { length: 50 }),
	modifiedUserFldHdr: varchar("modified_user_fld_hdr", { length: 50 }),
	modifiedDateFldHdr: timestamp("modified_date_fld_hdr", { mode: 'string' }),
	modifiedMacAddrFldHdr: varchar("modified_mac_addr_fld_hdr", { length: 50 }),
}, (table) => [
	unique("tbl_field_hdr_field_category_fld_hdr_unique").on(table.fieldCategoryFldHdr),
]);

export const tblCustomerReceiptFilesUploadInStoentries = stoentries.table("TBL_CUSTOMER_RECEIPT_FILES_UPLOAD", {
	sno: integer("SNO").primaryKey().generatedAlwaysAsIdentity({ name: "stoentries.TBL_CUSTOMER_RECEIPT_FILES_UPLOAD_SNO_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	receiptRefNo: varchar("RECEIPT_REF_NO", { length: 50 }),
	documentType: varchar("DOCUMENT_TYPE", { length: 50 }),
	descriptionDetails: varchar("DESCRIPTION_DETAILS", { length: 100 }),
	fileName: varchar("FILE_NAME", { length: 150 }),
	contentType: varchar("CONTENT_TYPE", { length: 50 }),
	// TODO: failed to parse database type 'bytea'
	contentData: bytea("CONTENT_DATA"),
	remarks: varchar("REMARKS", { length: 1000 }),
	statusMaster: varchar("STATUS_MASTER", { length: 20 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
	createdIpAddress: varchar("CREATED_IP_ADDRESS", { length: 50 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
	modifiedIpAddress: varchar("MODIFIED_IP_ADDRESS", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.receiptRefNo],
		foreignColumns: [tblCustomerReceiptHdrInStoentries.receiptRefNo],
		name: "TBL_CUSTOMER_RECEIPT_FILES_UPLOAD_RECEIPT_REF_NO_TBL_CUSTOMER_R"
	}),
]);

export const tblTaxInvoiceHdrInStoentries = stoentries.table("TBL_TAX_INVOICE_HDR", {
	sno: integer("SNO").generatedAlwaysAsIdentity({ name: "stoentries.TBL_TAX_INVOICE_HDR_SNO_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	taxInvoiceRefNo: varchar("TAX_INVOICE_REF_NO", { length: 50 }).primaryKey().notNull(),
	invoiceDate: timestamp("INVOICE_DATE", { mode: 'string' }),
	companyId: integer("COMPANY_ID"),
	fromStoreId: integer("FROM_STORE_ID"),
	invoiceType: varchar("INVOICE_TYPE", { length: 50 }),
	deliveryNoteRefNo: varchar("DELIVERY_NOTE_REF_NO", { length: 50 }),
	customerId: integer("CUSTOMER_ID"),
	currencyId: integer("CURRENCY_ID"),
	exchangeRate: numeric("EXCHANGE_RATE", { precision: 30, scale: 2 }),
	totalProductAmount: numeric("TOTAL_PRODUCT_AMOUNT", { precision: 30, scale: 4 }),
	vatAmount: numeric("VAT_AMOUNT", { precision: 30, scale: 4 }),
	finalSalesAmount: numeric("FINAL_SALES_AMOUNT", { precision: 30, scale: 4 }),
	totalProductAmountLc: numeric("TOTAL_PRODUCT_AMOUNT_LC", { precision: 30, scale: 4 }),
	finalSalesAmountLc: numeric("FINAL_SALES_AMOUNT_LC", { precision: 30, scale: 4 }),
	testDesc: varchar("TEST_DESC", { length: 50 }),
	remarks: varchar("REMARKS", { length: 2000 }),
	statusEntry: varchar("STATUS_ENTRY", { length: 20 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
	createdMacAddress: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
	modifiedMacAddress: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
	submittedBy: varchar("SUBMITTED_BY", { length: 50 }),
	submittedDate: timestamp("SUBMITTED_DATE", { mode: 'string' }),
	submittedMacAddress: varchar("SUBMITTED_MAC_ADDRESS", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.deliveryNoteRefNo],
		foreignColumns: [tblDeliveryNoteHdrInStoentries.deliveryNoteRefNo],
		name: "TBL_TAX_INVOICE_HDR_DELIVERY_NOTE_REF_NO_TBL_DELIVERY_NOTE_HDR_"
	}),
	foreignKey({
		columns: [table.customerId],
		foreignColumns: [tblCustomerMasterInStomaster.customerId],
		name: "TBL_TAX_INVOICE_HDR_CUSTOMER_ID_tbl_Customer_Master_Customer_Id"
	}),
	foreignKey({
		columns: [table.currencyId],
		foreignColumns: [tblCurrencyMasterInStomaster.currencyId],
		name: "TBL_TAX_INVOICE_HDR_CURRENCY_ID_TBL_CURRENCY_MASTER_CURRENCY_ID"
	}),
	foreignKey({
		columns: [table.companyId],
		foreignColumns: [tblCompanyMasterInStomaster.companyId],
		name: "TBL_TAX_INVOICE_HDR_COMPANY_ID_tbl_Company_Master_Company_Id_fk"
	}),
	foreignKey({
		columns: [table.fromStoreId],
		foreignColumns: [tblStoreMasterInStomaster.storeId],
		name: "TBL_TAX_INVOICE_HDR_FROM_STORE_ID_tbl_Store_Master_Store_Id_fk"
	}),
]);

export const tblGoodsFilesUploadInStoentries = stoentries.table("TBL_GOODS_FILES_UPLOAD", {
	sno: integer("SNO").primaryKey().generatedAlwaysAsIdentity({ name: "stoentries.TBL_GOODS_FILES_UPLOAD_SNO_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	grnRefNo: varchar("GRN_REF_NO", { length: 50 }),
	documentType: varchar("DOCUMENT_TYPE", { length: 50 }),
	descriptionDetails: varchar("DESCRIPTION_DETAILS", { length: 100 }),
	fileName: varchar("FILE_NAME", { length: 150 }),
	contentType: varchar("CONTENT_TYPE", { length: 50 }),
	// TODO: failed to parse database type 'bytea'
	contentData: bytea("CONTENT_DATA"),
	remarks: varchar("REMARKS", { length: 1000 }),
	statusMaster: varchar("STATUS_MASTER", { length: 20 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
	createdIpAddress: varchar("CREATED_IP_ADDRESS", { length: 50 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
	modifiedIpAddress: varchar("MODIFIED_IP_ADDRESS", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.grnRefNo],
		foreignColumns: [tblGoodsInwardGrnHdrInStoentries.grnRefNo],
		name: "TBL_GOODS_FILES_UPLOAD_GRN_REF_NO_TBL_GOODS_INWARD_GRN_HDR_GRN_"
	}),
]);

export const tblSalesOrderDtlInStoentries = stoentries.table("TBL_SALES_ORDER_DTL", {
	sno: integer("SNO").primaryKey().generatedAlwaysAsIdentity({ name: "stoentries.TBL_SALES_ORDER_DTL_SNO_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	salesOrderRefNo: varchar("SALES_ORDER_REF_NO", { length: 50 }),
	mainCategoryId: integer("MAIN_CATEGORY_ID"),
	subCategoryId: integer("SUB_CATEGORY_ID"),
	productId: integer("PRODUCT_ID"),
	storeStockPcs: numeric("STORE_STOCK_PCS", { precision: 30, scale: 4 }),
	poRefNo: varchar("PO_REF_NO", { length: 50 }),
	poDtlSno: integer("PO_DTL_SNO"),
	poDtlStockQty: numeric("PO_DTL_STOCK_QTY", { precision: 30, scale: 4 }),
	purchaseRatePerQty: numeric("PURCHASE_RATE_PER_QTY", { precision: 30, scale: 6 }),
	poExpenseAmount: numeric("PO_EXPENSE_AMOUNT", { precision: 30, scale: 4 }),
	salesRatePerQty: numeric("SALES_RATE_PER_QTY", { precision: 30, scale: 6 }),
	qtyPerPacking: numeric("QTY_PER_PACKING", { precision: 30, scale: 2 }),
	totalQty: numeric("TOTAL_QTY", { precision: 30, scale: 4 }),
	uom: varchar("UOM", { length: 50 }),
	totalPacking: numeric("TOTAL_PACKING", { precision: 30, scale: 4 }),
	alternateUom: varchar("ALTERNATE_UOM", { length: 500 }),
	totalProductAmount: numeric("TOTAL_PRODUCT_AMOUNT", { precision: 30, scale: 4 }),
	vatPercentage: numeric("VAT_PERCENTAGE", { precision: 30, scale: 2 }),
	vatAmount: numeric("VAT_AMOUNT", { precision: 30, scale: 4 }),
	finalSalesAmount: numeric("FINAL_SALES_AMOUNT", { precision: 30, scale: 4 }),
	totalProductAmountLc: numeric("TOTAL_PRODUCT_AMOUNT_LC", { precision: 30, scale: 4 }),
	finalSalesAmountLc: numeric("FINAL_SALES_AMOUNT_LC", { precision: 30, scale: 4 }),
	remarks: varchar("REMARKS", { length: 2000 }),
	statusEntry: varchar("STATUS_ENTRY", { length: 20 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
	createdMacAddress: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
	modifiedMacAddress: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.salesOrderRefNo],
		foreignColumns: [tblSalesOrderHdrInStoentries.salesOrderRefNo],
		name: "TBL_SALES_ORDER_DTL_SALES_ORDER_REF_NO_TBL_SALES_ORDER_HDR_SALE"
	}),
	foreignKey({
		columns: [table.mainCategoryId],
		foreignColumns: [tblProductMainCategoryMasterInStomaster.mainCategoryId],
		name: "TBL_SALES_ORDER_DTL_MAIN_CATEGORY_ID_TBL_PRODUCT_MAIN_CATEGORY_"
	}),
	foreignKey({
		columns: [table.subCategoryId],
		foreignColumns: [tblProductSubCategoryMasterInStomaster.subCategoryId],
		name: "TBL_SALES_ORDER_DTL_SUB_CATEGORY_ID_TBL_PRODUCT_SUB_CATEGORY_MA"
	}),
	foreignKey({
		columns: [table.productId],
		foreignColumns: [tblProductMasterInStomaster.productId],
		name: "TBL_SALES_ORDER_DTL_PRODUCT_ID_TBL_PRODUCT_MASTER_PRODUCT_ID_fk"
	}),
]);

export const tblSalesProformaHdrInStoentries = stoentries.table("TBL_SALES_PROFORMA_HDR", {
	sno: integer("SNO").generatedAlwaysAsIdentity({ name: "stoentries.TBL_SALES_PROFORMA_HDR_SNO_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	salesProformaRefNo: varchar("SALES_PROFORMA_REF_NO", { length: 50 }).primaryKey().notNull(),
	salesProformaDate: timestamp("SALES_PROFORMA_DATE", { mode: 'string' }),
	companyId: integer("COMPANY_ID"),
	storeId: integer("STORE_ID"),
	customerId: integer("CUSTOMER_ID"),
	billingLocationId: integer("BILLING_LOCATION_ID"),
	salesPersonEmpId: integer("SALES_PERSON_EMP_ID"),
	currencyId: integer("CURRENCY_ID"),
	exchangeRate: numeric("EXCHANGE_RATE", { precision: 30, scale: 2 }),
	totalProductAmount: numeric("TOTAL_PRODUCT_AMOUNT", { precision: 30, scale: 4 }),
	vatAmount: numeric("VAT_AMOUNT", { precision: 30, scale: 4 }),
	finalSalesAmount: numeric("FINAL_SALES_AMOUNT", { precision: 30, scale: 4 }),
	totalProductAmountLc: numeric("TOTAL_PRODUCT_AMOUNT_LC", { precision: 30, scale: 4 }),
	finalSalesAmountLc: numeric("FINAL_SALES_AMOUNT_LC", { precision: 30, scale: 4 }),
	remarks: varchar("REMARKS", { length: 2000 }),
	testDesc: varchar("TEST_DESC", { length: 50 }),
	statusEntry: varchar("STATUS_ENTRY", { length: 20 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
	createdMacAddress: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
	modifiedMacAddress: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
	submittedBy: varchar("SUBMITTED_BY", { length: 50 }),
	submittedDate: timestamp("SUBMITTED_DATE", { mode: 'string' }),
}, (table) => [
	foreignKey({
		columns: [table.companyId],
		foreignColumns: [tblCompanyMasterInStomaster.companyId],
		name: "TBL_SALES_PROFORMA_HDR_COMPANY_ID_tbl_Company_Master_Company_Id"
	}),
	foreignKey({
		columns: [table.customerId],
		foreignColumns: [tblCustomerMasterInStomaster.customerId],
		name: "TBL_SALES_PROFORMA_HDR_CUSTOMER_ID_tbl_Customer_Master_Customer"
	}),
	foreignKey({
		columns: [table.billingLocationId],
		foreignColumns: [tblBillingLocationMasterInStomaster.billingLocationId],
		name: "TBL_SALES_PROFORMA_HDR_BILLING_LOCATION_ID_tbl_Billing_Location"
	}),
	foreignKey({
		columns: [table.salesPersonEmpId],
		foreignColumns: [tblSalesPersonMasterInStomaster.salesPersonId],
		name: "TBL_SALES_PROFORMA_HDR_SALES_PERSON_EMP_ID_TBL_SALES_PERSON_MAS"
	}),
	foreignKey({
		columns: [table.currencyId],
		foreignColumns: [tblCurrencyMasterInStomaster.currencyId],
		name: "TBL_SALES_PROFORMA_HDR_CURRENCY_ID_TBL_CURRENCY_MASTER_CURRENCY"
	}),
	foreignKey({
		columns: [table.storeId],
		foreignColumns: [tblStoreMasterInStomaster.storeId],
		name: "TBL_SALES_PROFORMA_HDR_STORE_ID_tbl_Store_Master_Store_Id_fk"
	}),
]);

export const tblTaxInvoiceFilesUploadInStoentries = stoentries.table("TBL_TAX_INVOICE_FILES_UPLOAD", {
	sno: integer("SNO").primaryKey().generatedAlwaysAsIdentity({ name: "stoentries.TBL_TAX_INVOICE_FILES_UPLOAD_SNO_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	taxInvoiceRefNo: varchar("TAX_INVOICE_REF_NO", { length: 50 }),
	documentType: varchar("DOCUMENT_TYPE", { length: 50 }),
	descriptionDetails: varchar("DESCRIPTION_DETAILS", { length: 100 }),
	fileName: varchar("FILE_NAME", { length: 150 }),
	contentType: varchar("CONTENT_TYPE", { length: 50 }),
	// TODO: failed to parse database type 'bytea'
	contentData: bytea("CONTENT_DATA"),
	remarks: varchar("REMARKS", { length: 1000 }),
	statusMaster: varchar("STATUS_MASTER", { length: 20 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
	createdIpAddress: varchar("CREATED_IP_ADDRESS", { length: 50 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
	modifiedIpAddress: varchar("MODIFIED_IP_ADDRESS", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.taxInvoiceRefNo],
		foreignColumns: [tblTaxInvoiceHdrInStoentries.taxInvoiceRefNo],
		name: "TBL_TAX_INVOICE_FILES_UPLOAD_TAX_INVOICE_REF_NO_TBL_TAX_INVOICE"
	}),
]);

export const tblTaxMasterInStomaster = stomaster.table("tbl_Tax_Master", {
	taxId: integer("Tax_Id").primaryKey().generatedAlwaysAsIdentity({ name: "stomaster.tbl_Tax_Master_Tax_Id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	name: varchar("Name", { length: 100 }).notNull(),
	rate: numeric("Rate", { precision: 5, scale: 2 }).notNull(),
	description: varchar("Description", { length: 255 }),
	statusMaster: varchar("Status_Master", { length: 20 }).default('Active'),
	createdBy: varchar("Created_By", { length: 50 }),
	createdDate: timestamp("Created_Date", { mode: 'string' }).defaultNow(),
	createdMacAddress: varchar("Created_Mac_Address", { length: 50 }),
	modifiedBy: varchar("Modified_By", { length: 50 }),
	modifiedDate: timestamp("Modified_Date", { mode: 'string' }),
	modifiedMacAddress: varchar("Modified_Mac_Address", { length: 50 }),
});

export const tblEmployeeMasterInStomaster = stomaster.table("tbl_Employee_Master", {
	employeeId: integer("Employee_Id").primaryKey().generatedAlwaysAsIdentity({ name: "stomaster.tbl_Employee_Master_Employee_Id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	cardId: varchar("Card_Id", { length: 50 }),
	name: varchar("Name", { length: 150 }).notNull(),
	role: varchar("Role", { length: 100 }),
	department: integer("Department"),
	phone: varchar("Phone", { length: 50 }),
	email: varchar("Email", { length: 150 }),
	remarks: varchar("Remarks", { length: 1000 }),
	statusMaster: varchar("Status_Master", { length: 20 }).default('Active'),
	createdBy: varchar("Created_By", { length: 50 }),
	createdDate: timestamp("Created_Date", { mode: 'string' }),
	createdMacAddress: varchar("Created_Mac_Address", { length: 50 }),
	modifiedBy: varchar("Modified_By", { length: 50 }),
	modifiedDate: timestamp("Modified_Date", { mode: 'string' }),
	modifiedMacAddress: varchar("Modified_Mac_Address", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.department],
		foreignColumns: [tblDepartmentMasterInStomaster.departmentId],
		name: "tbl_Employee_Master_Department_tbl_Department_Master_Department"
	}),
]);

export const tblJournalHdrInStoentries = stoentries.table("TBL_JOURNAL_HDR", {
	sno: integer("SNO").generatedAlwaysAsIdentity({ name: "stoentries.TBL_JOURNAL_HDR_SNO_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	journalRefNo: varchar("JOURNAL_REF_NO", { length: 50 }).primaryKey().notNull(),
	journalDate: timestamp("JOURNAL_DATE", { mode: 'string' }).notNull(),
	companyId: integer("COMPANY_ID"),
	moduleName: varchar("MODULE_NAME", { length: 50 }),
	moduleRefNo: varchar("MODULE_REF_NO", { length: 50 }),
	narration: text("NARRATION"),
	statusEntry: varchar("STATUS_ENTRY", { length: 20 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }).defaultNow(),
	createdIpAddress: varchar("CREATED_IP_ADDRESS", { length: 50 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
	modifiedIpAddress: varchar("MODIFIED_IP_ADDRESS", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.companyId],
		foreignColumns: [tblCompanyMasterInStomaster.companyId],
		name: "TBL_JOURNAL_HDR_COMPANY_ID_tbl_Company_Master_Company_Id_fk"
	}),
]);

export const tblJournalDtlInStoentries = stoentries.table("TBL_JOURNAL_DTL", {
	sno: integer("SNO").primaryKey().generatedAlwaysAsIdentity({ name: "stoentries.TBL_JOURNAL_DTL_SNO_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	journalRefNo: varchar("JOURNAL_REF_NO", { length: 50 }),
	ledgerId: integer("LEDGER_ID"),
	debit: numeric("DEBIT", { precision: 30, scale: 2 }).default('0'),
	credit: numeric("CREDIT", { precision: 30, scale: 2 }).default('0'),
	remarks: varchar("REMARKS", { length: 255 }),
}, (table) => [
	foreignKey({
		columns: [table.journalRefNo],
		foreignColumns: [tblJournalHdrInStoentries.journalRefNo],
		name: "TBL_JOURNAL_DTL_JOURNAL_REF_NO_TBL_JOURNAL_HDR_JOURNAL_REF_NO_f"
	}),
	foreignKey({
		columns: [table.ledgerId],
		foreignColumns: [tblAccountsLedgerMasterInStomaster.ledgerId],
		name: "TBL_JOURNAL_DTL_LEDGER_ID_TBL_ACCOUNTS_LEDGER_MASTER_LEDGER_ID_"
	}),
]);

export const tblTrialBalanceHdrInStoentries = stoentries.table("TBL_TRIAL_BALANCE_HDR", {
	sno: integer("SNO").generatedAlwaysAsIdentity({ name: "stoentries.TBL_TRIAL_BALANCE_HDR_SNO_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	tbRefNo: varchar("TB_REF_NO", { length: 50 }).primaryKey().notNull(),
	asOfDate: timestamp("AS_OF_DATE", { mode: 'string' }).notNull(),
	companyId: integer("COMPANY_ID"),
	financialYear: varchar("FINANCIAL_YEAR", { length: 50 }),
	totalDebit: numeric("TOTAL_DEBIT", { precision: 30, scale: 2 }).default('0'),
	totalCredit: numeric("TOTAL_CREDIT", { precision: 30, scale: 2 }).default('0'),
	statusEntry: varchar("STATUS_ENTRY", { length: 20 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }).defaultNow(),
	createdIpAddress: varchar("CREATED_IP_ADDRESS", { length: 50 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
	modifiedIpAddress: varchar("MODIFIED_IP_ADDRESS", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.companyId],
		foreignColumns: [tblCompanyMasterInStomaster.companyId],
		name: "TBL_TRIAL_BALANCE_HDR_COMPANY_ID_tbl_Company_Master_Company_Id_"
	}),
]);

export const tblTrialBalanceDtlInStoentries = stoentries.table("TBL_TRIAL_BALANCE_DTL", {
	sno: integer("SNO").primaryKey().generatedAlwaysAsIdentity({ name: "stoentries.TBL_TRIAL_BALANCE_DTL_SNO_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	tbRefNo: varchar("TB_REF_NO", { length: 50 }),
	ledgerId: integer("LEDGER_ID"),
	openingDebit: numeric("OPENING_DEBIT", { precision: 30, scale: 2 }).default('0'),
	openingCredit: numeric("OPENING_CREDIT", { precision: 30, scale: 2 }).default('0'),
	periodDebit: numeric("PERIOD_DEBIT", { precision: 30, scale: 2 }).default('0'),
	periodCredit: numeric("PERIOD_CREDIT", { precision: 30, scale: 2 }).default('0'),
	closingDebit: numeric("CLOSING_DEBIT", { precision: 30, scale: 2 }).default('0'),
	closingCredit: numeric("CLOSING_CREDIT", { precision: 30, scale: 2 }).default('0'),
	remarks: varchar("REMARKS", { length: 255 }),
}, (table) => [
	foreignKey({
		columns: [table.tbRefNo],
		foreignColumns: [tblTrialBalanceHdrInStoentries.tbRefNo],
		name: "TBL_TRIAL_BALANCE_DTL_TB_REF_NO_TBL_TRIAL_BALANCE_HDR_TB_REF_NO"
	}),
	foreignKey({
		columns: [table.ledgerId],
		foreignColumns: [tblAccountsLedgerMasterInStomaster.ledgerId],
		name: "TBL_TRIAL_BALANCE_DTL_LEDGER_ID_TBL_ACCOUNTS_LEDGER_MASTER_LEDG"
	}),
]);

export const tblExchangeRateUsageLogInStomaster = stomaster.table("TBL_EXCHANGE_RATE_USAGE_LOG", {
	logId: integer("LOG_ID").primaryKey().generatedAlwaysAsIdentity({ name: "stomaster.TBL_EXCHANGE_RATE_USAGE_LOG_LOG_ID_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	companyId: integer("Company_ID"),
	exchangeRateSno: integer("EXCHANGE_RATE_SNO"),
	transactionId: integer("TRANSACTION_ID"),
	rateValueAtUsage: numeric("RATE_VALUE_AT_USAGE", { precision: 30, scale: 8 }),
	appliedDate: date("APPLIED_DATE"),
	usageType: varchar("USAGE_TYPE", { length: 30 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
}, (table) => [
	foreignKey({
		columns: [table.companyId],
		foreignColumns: [tblCompanyMasterInStomaster.companyId],
		name: "TBL_EXCHANGE_RATE_USAGE_LOG_Company_ID_tbl_Company_Master_Compa"
	}),
	foreignKey({
		columns: [table.exchangeRateSno],
		foreignColumns: [tblExchangeRateMasterInStomaster.sno],
		name: "TBL_EXCHANGE_RATE_USAGE_LOG_EXCHANGE_RATE_SNO_TBL_EXCHANGE_RATE"
	}),
	foreignKey({
		columns: [table.transactionId],
		foreignColumns: [tblMultiCurrencyTransactionsInStomaster.transactionId],
		name: "TBL_EXCHANGE_RATE_USAGE_LOG_TRANSACTION_ID_TBL_MULTI_CURRENCY_T"
	}),
]);

export const tblCompanyBaseCurrencyInStomaster = stomaster.table("TBL_COMPANY_BASE_CURRENCY", {
	id: integer("ID").primaryKey().generatedAlwaysAsIdentity({ name: "stomaster.TBL_COMPANY_BASE_CURRENCY_ID_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	companyId: integer("Company_ID"),
	baseCurrencyId: integer("BASE_CURRENCY_ID"),
	unrealizedGainAccountCode: varchar("UNREALIZED_GAIN_ACCOUNT_CODE", { length: 50 }),
	unrealizedLossAccountCode: varchar("UNREALIZED_LOSS_ACCOUNT_CODE", { length: 50 }),
	realizedGainAccountCode: varchar("REALIZED_GAIN_ACCOUNT_CODE", { length: 50 }),
	realizedLossAccountCode: varchar("REALIZED_LOSS_ACCOUNT_CODE", { length: 50 }),
	autoRevaluationFrequency: varchar("AUTO_REVALUATION_FREQUENCY", { length: 20 }).default('MONTHLY'),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
}, (table) => [
	foreignKey({
		columns: [table.companyId],
		foreignColumns: [tblCompanyMasterInStomaster.companyId],
		name: "TBL_COMPANY_BASE_CURRENCY_Company_ID_tbl_Company_Master_Company"
	}),
	foreignKey({
		columns: [table.baseCurrencyId],
		foreignColumns: [tblCurrencyMasterInStomaster.currencyId],
		name: "TBL_COMPANY_BASE_CURRENCY_BASE_CURRENCY_ID_TBL_CURRENCY_MASTER_"
	}),
	unique("TBL_COMPANY_BASE_CURRENCY_Company_ID_unique").on(table.companyId),
]);

export const tblMultiCurrencyTransactionsInStomaster = stomaster.table("TBL_MULTI_CURRENCY_TRANSACTIONS", {
	transactionId: integer("TRANSACTION_ID").primaryKey().generatedAlwaysAsIdentity({ name: "stomaster.TBL_MULTI_CURRENCY_TRANSACTIONS_TRANSACTION_ID_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	companyId: integer("Company_ID"),
	documentType: varchar("DOCUMENT_TYPE", { length: 30 }),
	documentNumber: varchar("DOCUMENT_NUMBER", { length: 50 }),
	documentDate: date("DOCUMENT_DATE"),
	transactionCurrencyId: integer("TRANSACTION_CURRENCY_ID"),
	transactionAmount: numeric("TRANSACTION_AMOUNT", { precision: 30, scale: 5 }),
	baseCurrencyId: integer("BASE_CURRENCY_ID"),
	baseAmount: numeric("BASE_AMOUNT", { precision: 30, scale: 5 }),
	exchangeRateUsed: numeric("EXCHANGE_RATE_USED", { precision: 30, scale: 8 }),
	exchangeRateSno: integer("EXCHANGE_RATE_SNO"),
	originalBaseAmount: numeric("ORIGINAL_BASE_AMOUNT", { precision: 30, scale: 5 }),
	settledAmount: numeric("SETTLED_AMOUNT", { precision: 30, scale: 5 }).default('0'),
	status: varchar("STATUS", { length: 20 }).default('PENDING'),
	remarks: varchar("REMARKS", { length: 500 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
	createdMacAddress: varchar("CREATED_MAC_ADDRESS", { length: 50 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
	modifiedMacAddress: varchar("MODIFIED_MAC_ADDRESS", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.companyId],
		foreignColumns: [tblCompanyMasterInStomaster.companyId],
		name: "TBL_MULTI_CURRENCY_TRANSACTIONS_Company_ID_tbl_Company_Master_C"
	}),
	foreignKey({
		columns: [table.transactionCurrencyId],
		foreignColumns: [tblCurrencyMasterInStomaster.currencyId],
		name: "TBL_MULTI_CURRENCY_TRANSACTIONS_TRANSACTION_CURRENCY_ID_TBL_CUR"
	}),
	foreignKey({
		columns: [table.baseCurrencyId],
		foreignColumns: [tblCurrencyMasterInStomaster.currencyId],
		name: "TBL_MULTI_CURRENCY_TRANSACTIONS_BASE_CURRENCY_ID_TBL_CURRENCY_M"
	}),
]);

export const tblRealizedGainLossInStomaster = stomaster.table("TBL_REALIZED_GAIN_LOSS", {
	glId: integer("GL_ID").primaryKey().generatedAlwaysAsIdentity({ name: "stomaster.TBL_REALIZED_GAIN_LOSS_GL_ID_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	companyId: integer("Company_ID"),
	transactionId: integer("TRANSACTION_ID"),
	settlementDate: date("SETTLEMENT_DATE"),
	settlementAmount: numeric("SETTLEMENT_AMOUNT", { precision: 30, scale: 5 }),
	settlementRate: numeric("SETTLEMENT_RATE", { precision: 30, scale: 8 }),
	settlementBaseAmount: numeric("SETTLEMENT_BASE_AMOUNT", { precision: 30, scale: 5 }),
	originalBaseAmount: numeric("ORIGINAL_BASE_AMOUNT", { precision: 30, scale: 5 }),
	realizedGainLoss: numeric("REALIZED_GAIN_LOSS", { precision: 30, scale: 5 }),
	glType: varchar("GL_TYPE", { length: 10 }),
	journalVoucherNo: varchar("JOURNAL_VOUCHER_NO", { length: 50 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
}, (table) => [
	foreignKey({
		columns: [table.companyId],
		foreignColumns: [tblCompanyMasterInStomaster.companyId],
		name: "TBL_REALIZED_GAIN_LOSS_Company_ID_tbl_Company_Master_Company_Id"
	}),
	foreignKey({
		columns: [table.transactionId],
		foreignColumns: [tblMultiCurrencyTransactionsInStomaster.transactionId],
		name: "TBL_REALIZED_GAIN_LOSS_TRANSACTION_ID_TBL_MULTI_CURRENCY_TRANSA"
	}),
]);

export const tblUnrealizedGainLossInStomaster = stomaster.table("TBL_UNREALIZED_GAIN_LOSS", {
	glId: integer("GL_ID").primaryKey().generatedAlwaysAsIdentity({ name: "stomaster.TBL_UNREALIZED_GAIN_LOSS_GL_ID_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	companyId: integer("Company_ID"),
	transactionId: integer("TRANSACTION_ID"),
	accountType: varchar("ACCOUNT_TYPE", { length: 30 }),
	revaluationDate: date("REVALUATION_DATE"),
	oldBaseAmount: numeric("OLD_BASE_AMOUNT", { precision: 30, scale: 5 }),
	newBaseAmount: numeric("NEW_BASE_AMOUNT", { precision: 30, scale: 5 }),
	unrealizedGainLoss: numeric("UNREALIZED_GAIN_LOSS", { precision: 30, scale: 5 }),
	glType: varchar("GL_TYPE", { length: 10 }),
	journalVoucherNo: varchar("JOURNAL_VOUCHER_NO", { length: 50 }),
	reversalJournalVoucherNo: varchar("REVERSAL_JOURNAL_VOUCHER_NO", { length: 50 }),
	isReversed: boolean("IS_REVERSED").default(false),
	status: varchar("STATUS", { length: 20 }).default('ACTIVE'),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
}, (table) => [
	foreignKey({
		columns: [table.companyId],
		foreignColumns: [tblCompanyMasterInStomaster.companyId],
		name: "TBL_UNREALIZED_GAIN_LOSS_Company_ID_tbl_Company_Master_Company_"
	}),
	foreignKey({
		columns: [table.transactionId],
		foreignColumns: [tblMultiCurrencyTransactionsInStomaster.transactionId],
		name: "TBL_UNREALIZED_GAIN_LOSS_TRANSACTION_ID_TBL_MULTI_CURRENCY_TRAN"
	}),
]);

export const tblPurchaseOrderAdditionalCostDetailsInStoentries = stoentries.table("TBL_PURCHASE_ORDER_ADDITIONAL_COST_DETAILS", {
	sno: integer("SNO").primaryKey().generatedAlwaysAsIdentity({ name: "stoentries.TBL_PURCHASE_ORDER_ADDITIONAL_COST_DETAILS_SNO_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	poRefNo: varchar("PO_REF_NO", { length: 50 }),
	additionalCostTypeId: integer("ADDITIONAL_COST_TYPE_ID"),
	additionalCostAmount: numeric("ADDITIONAL_COST_AMOUNT", { precision: 30, scale: 4 }),
	remarks: varchar("REMARKS", { length: 1000 }),
	statusMaster: varchar("STATUS_MASTER", { length: 50 }),
	createdBy: varchar("CREATED_BY", { length: 50 }),
	createdDate: timestamp("CREATED_DATE", { mode: 'string' }),
	createdIpAddress: varchar("CREATED_IP_ADDRESS", { length: 50 }),
	modifiedBy: varchar("MODIFIED_BY", { length: 50 }),
	modifiedDate: timestamp("MODIFIED_DATE", { mode: 'string' }),
	modifiedIpAddress: varchar("MODIFIED_IP_ADDRESS", { length: 50 }),
}, (table) => [
	foreignKey({
		columns: [table.additionalCostTypeId],
		foreignColumns: [tblAdditionalCostTypeMasterInStomaster.additionalCostTypeId],
		name: "TBL_PURCHASE_ORDER_ADDITIONAL_COST_DETAILS_ADDITIONAL_COST_TYPE"
	}),
]);
