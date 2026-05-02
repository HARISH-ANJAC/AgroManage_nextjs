import { relations } from "drizzle-orm/relations";
import { tblCompanyMasterInStomaster, tblAccountsLedgerMasterInStomaster, tblCustomerCreditLimitDetailsInStomaster, customerCreditLimitFileUploadInStomaster, tblCompanyBankAccountMasterInStomaster, tblBankMasterInStomaster, tblCurrencyMasterInStomaster, tblBillingLocationMasterInStomaster, tblCustomerMasterInStomaster, tblDistrictMasterInStomaster, tblCountryMasterInStomaster, tblRegionMasterInStomaster, tblCustomerCompanyWiseBillingLocationMappingInStomaster, tblCustomerPaymentModeMasterInStomaster, tblExchangeRateMasterInStomaster, tblFieldHdrInStomaster, tblFieldDtlInStomaster, tblCustomerMasterFilesUploadInStomaster, tblCustomerProductVatPercentageSettingsInStomaster, tblProductMainCategoryMasterInStomaster, tblProductSubCategoryMasterInStomaster, tblProductMasterInStomaster, tblCustomerWiseProductPriceSettingsInStomaster, tblProductOpeningStockInStomaster, tblStoreMasterInStomaster, tblProductCompanyMainCategoryMappingInStomaster, tblStoreProductMinimumStockInStomaster, tblSupplierMasterInStomaster, tblUserInfoHdrInStomaster, tblUserToStoreMappingInStomaster, tblRoleMasterInStomaster, tblLocationMasterInStomaster, tblVatPercentageSettingInStomaster, tblCustomerReceiptHdrInStoentries, tblCustomerReceiptInvoiceDtlInStoentries, tblTaxInvoiceHdrInStoentries, tblDeliveryNoteHdrInStoentries, tblDeliveryNoteDtlInStoentries, tblAccountsHeadMasterInStomaster, tblExpenseHdrInStoentries, tblExpenseDtlInStoentries, tblExpenseFilesUploadInStoentries, tblDeliveryFilesUploadInStoentries, tblPurchaseInvoiceHdrInStoentries, tblPaymentTermMasterInStomaster, tblGoodsInwardGrnHdrInStoentries, tblGoodsInwardGrnDtlInStoentries, tblPurchaseInvoiceDtlInStoentries, tblPurchaseInvoiceFilesUploadInStoentries, tblPurchaseInvoiceAdditionalCostDetailsInStoentries, tblAdditionalCostTypeMasterInStomaster, tblPurchaseOrderHdrInStoentries, tblSalesProformaHdrInStoentries, tblSalesOrderHdrInStoentries, tblSalesPersonMasterInStomaster, tblSalesOrderFilesUploadInStoentries, tblSalesProformaDtlInStoentries, tblSalesProformaFilesUploadInStoentries, tblPurchaseOrderDtlInStoentries, tblTaxInvoiceDtlInStoentries, tblChangePasswordLogInStomaster, tblCustomerAddressDetailsInStomaster, tblCustomerReceiptFilesUploadInStoentries, tblGoodsFilesUploadInStoentries, tblSalesOrderDtlInStoentries, tblTaxInvoiceFilesUploadInStoentries, tblDepartmentMasterInStomaster, tblEmployeeMasterInStomaster, tblJournalHdrInStoentries, tblJournalDtlInStoentries, tblTrialBalanceHdrInStoentries, tblTrialBalanceDtlInStoentries, tblExchangeRateUsageLogInStomaster, tblMultiCurrencyTransactionsInStomaster, tblCompanyBaseCurrencyInStomaster, tblRealizedGainLossInStomaster, tblUnrealizedGainLossInStomaster, tblPurchaseOrderAdditionalCostDetailsInStoentries } from "./schema";

export const tblAccountsLedgerMasterInStomasterRelations = relations(tblAccountsLedgerMasterInStomaster, ({one, many}) => ({
	tblCompanyMasterInStomaster: one(tblCompanyMasterInStomaster, {
		fields: [tblAccountsLedgerMasterInStomaster.companyId],
		references: [tblCompanyMasterInStomaster.companyId]
	}),
	tblJournalDtlInStoentries: many(tblJournalDtlInStoentries),
	tblTrialBalanceDtlInStoentries: many(tblTrialBalanceDtlInStoentries),
}));

export const tblCompanyMasterInStomasterRelations = relations(tblCompanyMasterInStomaster, ({one, many}) => ({
	tblAccountsLedgerMasterInStomasters: many(tblAccountsLedgerMasterInStomaster),
	tblCompanyBankAccountMasterInStomasters: many(tblCompanyBankAccountMasterInStomaster),
	tblCurrencyMasterInStomaster: one(tblCurrencyMasterInStomaster, {
		fields: [tblCompanyMasterInStomaster.currencyId],
		references: [tblCurrencyMasterInStomaster.currencyId]
	}),
	tblCustomerCompanyWiseBillingLocationMappingInStomasters: many(tblCustomerCompanyWiseBillingLocationMappingInStomaster),
	tblCustomerCreditLimitDetailsInStomasters: many(tblCustomerCreditLimitDetailsInStomaster),
	tblExchangeRateMasterInStomasters: many(tblExchangeRateMasterInStomaster),
	tblCustomerProductVatPercentageSettingsInStomasters: many(tblCustomerProductVatPercentageSettingsInStomaster),
	tblCustomerWiseProductPriceSettingsInStomasters: many(tblCustomerWiseProductPriceSettingsInStomaster),
	tblProductOpeningStockInStomasters: many(tblProductOpeningStockInStomaster),
	tblProductCompanyMainCategoryMappingInStomasters: many(tblProductCompanyMainCategoryMappingInStomaster),
	tblStoreProductMinimumStockInStomasters: many(tblStoreProductMinimumStockInStomaster),
	tblUserToStoreMappingInStomasters: many(tblUserToStoreMappingInStomaster),
	tblVatPercentageSettingInStomasters: many(tblVatPercentageSettingInStomaster),
	tblDeliveryNoteHdrInStoentries: many(tblDeliveryNoteHdrInStoentries),
	tblExpenseHdrInStoentries: many(tblExpenseHdrInStoentries),
	tblCustomerReceiptHdrInStoentries: many(tblCustomerReceiptHdrInStoentries),
	tblPurchaseInvoiceHdrInStoentries: many(tblPurchaseInvoiceHdrInStoentries),
	tblGoodsInwardGrnHdrInStoentries: many(tblGoodsInwardGrnHdrInStoentries),
	tblPurchaseOrderHdrInStoentries: many(tblPurchaseOrderHdrInStoentries),
	tblSalesOrderHdrInStoentries: many(tblSalesOrderHdrInStoentries),
	tblTaxInvoiceHdrInStoentries: many(tblTaxInvoiceHdrInStoentries),
	tblSalesProformaHdrInStoentries: many(tblSalesProformaHdrInStoentries),
	tblJournalHdrInStoentries: many(tblJournalHdrInStoentries),
	tblTrialBalanceHdrInStoentries: many(tblTrialBalanceHdrInStoentries),
	tblExchangeRateUsageLogInStomasters: many(tblExchangeRateUsageLogInStomaster),
	tblCompanyBaseCurrencyInStomasters: many(tblCompanyBaseCurrencyInStomaster),
	tblMultiCurrencyTransactionsInStomasters: many(tblMultiCurrencyTransactionsInStomaster),
	tblRealizedGainLossInStomasters: many(tblRealizedGainLossInStomaster),
	tblUnrealizedGainLossInStomasters: many(tblUnrealizedGainLossInStomaster),
}));

export const customerCreditLimitFileUploadInStomasterRelations = relations(customerCreditLimitFileUploadInStomaster, ({one}) => ({
	tblCustomerCreditLimitDetailsInStomaster: one(tblCustomerCreditLimitDetailsInStomaster, {
		fields: [customerCreditLimitFileUploadInStomaster.creditLimitId],
		references: [tblCustomerCreditLimitDetailsInStomaster.sno]
	}),
}));

export const tblCustomerCreditLimitDetailsInStomasterRelations = relations(tblCustomerCreditLimitDetailsInStomaster, ({one, many}) => ({
	customerCreditLimitFileUploadInStomasters: many(customerCreditLimitFileUploadInStomaster),
	tblCompanyMasterInStomaster: one(tblCompanyMasterInStomaster, {
		fields: [tblCustomerCreditLimitDetailsInStomaster.companyId],
		references: [tblCompanyMasterInStomaster.companyId]
	}),
	tblCustomerMasterInStomaster: one(tblCustomerMasterInStomaster, {
		fields: [tblCustomerCreditLimitDetailsInStomaster.customerId],
		references: [tblCustomerMasterInStomaster.customerId]
	}),
	tblCurrencyMasterInStomaster: one(tblCurrencyMasterInStomaster, {
		fields: [tblCustomerCreditLimitDetailsInStomaster.currencyId],
		references: [tblCurrencyMasterInStomaster.currencyId]
	}),
	tblCustomerPaymentModeMasterInStomaster_requestedPaymentModeId: one(tblCustomerPaymentModeMasterInStomaster, {
		fields: [tblCustomerCreditLimitDetailsInStomaster.requestedPaymentModeId],
		references: [tblCustomerPaymentModeMasterInStomaster.paymentModeId],
		relationName: "tblCustomerCreditLimitDetailsInStomaster_requestedPaymentModeId_tblCustomerPaymentModeMasterInStomaster_paymentModeId"
	}),
	tblCustomerPaymentModeMasterInStomaster_approvedPaymentModeId: one(tblCustomerPaymentModeMasterInStomaster, {
		fields: [tblCustomerCreditLimitDetailsInStomaster.approvedPaymentModeId],
		references: [tblCustomerPaymentModeMasterInStomaster.paymentModeId],
		relationName: "tblCustomerCreditLimitDetailsInStomaster_approvedPaymentModeId_tblCustomerPaymentModeMasterInStomaster_paymentModeId"
	}),
}));

export const tblCompanyBankAccountMasterInStomasterRelations = relations(tblCompanyBankAccountMasterInStomaster, ({one, many}) => ({
	tblCompanyMasterInStomaster: one(tblCompanyMasterInStomaster, {
		fields: [tblCompanyBankAccountMasterInStomaster.companyId],
		references: [tblCompanyMasterInStomaster.companyId]
	}),
	tblBankMasterInStomaster: one(tblBankMasterInStomaster, {
		fields: [tblCompanyBankAccountMasterInStomaster.bankId],
		references: [tblBankMasterInStomaster.bankId]
	}),
	tblCurrencyMasterInStomaster: one(tblCurrencyMasterInStomaster, {
		fields: [tblCompanyBankAccountMasterInStomaster.currencyId],
		references: [tblCurrencyMasterInStomaster.currencyId]
	}),
	tblCustomerReceiptHdrInStoentries: many(tblCustomerReceiptHdrInStoentries),
}));

export const tblBankMasterInStomasterRelations = relations(tblBankMasterInStomaster, ({many}) => ({
	tblCompanyBankAccountMasterInStomasters: many(tblCompanyBankAccountMasterInStomaster),
	tblCustomerReceiptHdrInStoentries_crBankCashId: many(tblCustomerReceiptHdrInStoentries, {
		relationName: "tblCustomerReceiptHdrInStoentries_crBankCashId_tblBankMasterInStomaster_bankId"
	}),
	tblCustomerReceiptHdrInStoentries_drBankCashId: many(tblCustomerReceiptHdrInStoentries, {
		relationName: "tblCustomerReceiptHdrInStoentries_drBankCashId_tblBankMasterInStomaster_bankId"
	}),
}));

export const tblCurrencyMasterInStomasterRelations = relations(tblCurrencyMasterInStomaster, ({many}) => ({
	tblCompanyBankAccountMasterInStomasters: many(tblCompanyBankAccountMasterInStomaster),
	tblCompanyMasterInStomasters: many(tblCompanyMasterInStomaster),
	tblCustomerMasterInStomasters: many(tblCustomerMasterInStomaster),
	tblCustomerCreditLimitDetailsInStomasters: many(tblCustomerCreditLimitDetailsInStomaster),
	tblExchangeRateMasterInStomasters: many(tblExchangeRateMasterInStomaster),
	tblCustomerWiseProductPriceSettingsInStomasters: many(tblCustomerWiseProductPriceSettingsInStomaster),
	tblDeliveryNoteHdrInStoentries: many(tblDeliveryNoteHdrInStoentries),
	tblExpenseHdrInStoentries: many(tblExpenseHdrInStoentries),
	tblCustomerReceiptHdrInStoentries: many(tblCustomerReceiptHdrInStoentries),
	tblPurchaseInvoiceHdrInStoentries: many(tblPurchaseInvoiceHdrInStoentries),
	tblPurchaseOrderHdrInStoentries: many(tblPurchaseOrderHdrInStoentries),
	tblSalesOrderHdrInStoentries: many(tblSalesOrderHdrInStoentries),
	tblTaxInvoiceHdrInStoentries: many(tblTaxInvoiceHdrInStoentries),
	tblSalesProformaHdrInStoentries: many(tblSalesProformaHdrInStoentries),
	tblCompanyBaseCurrencyInStomasters: many(tblCompanyBaseCurrencyInStomaster),
	tblMultiCurrencyTransactionsInStomasters_transactionCurrencyId: many(tblMultiCurrencyTransactionsInStomaster, {
		relationName: "tblMultiCurrencyTransactionsInStomaster_transactionCurrencyId_tblCurrencyMasterInStomaster_currencyId"
	}),
	tblMultiCurrencyTransactionsInStomasters_baseCurrencyId: many(tblMultiCurrencyTransactionsInStomaster, {
		relationName: "tblMultiCurrencyTransactionsInStomaster_baseCurrencyId_tblCurrencyMasterInStomaster_currencyId"
	}),
}));

export const tblCustomerMasterInStomasterRelations = relations(tblCustomerMasterInStomaster, ({one, many}) => ({
	tblBillingLocationMasterInStomaster: one(tblBillingLocationMasterInStomaster, {
		fields: [tblCustomerMasterInStomaster.billingLocationId],
		references: [tblBillingLocationMasterInStomaster.billingLocationId]
	}),
	tblDistrictMasterInStomaster: one(tblDistrictMasterInStomaster, {
		fields: [tblCustomerMasterInStomaster.districtId],
		references: [tblDistrictMasterInStomaster.districtId]
	}),
	tblCurrencyMasterInStomaster: one(tblCurrencyMasterInStomaster, {
		fields: [tblCustomerMasterInStomaster.currencyId],
		references: [tblCurrencyMasterInStomaster.currencyId]
	}),
	tblCountryMasterInStomaster: one(tblCountryMasterInStomaster, {
		fields: [tblCustomerMasterInStomaster.countryId],
		references: [tblCountryMasterInStomaster.countryId]
	}),
	tblRegionMasterInStomaster: one(tblRegionMasterInStomaster, {
		fields: [tblCustomerMasterInStomaster.regionId],
		references: [tblRegionMasterInStomaster.regionId]
	}),
	tblCustomerCompanyWiseBillingLocationMappingInStomasters: many(tblCustomerCompanyWiseBillingLocationMappingInStomaster),
	tblCustomerCreditLimitDetailsInStomasters: many(tblCustomerCreditLimitDetailsInStomaster),
	tblCustomerMasterFilesUploadInStomasters: many(tblCustomerMasterFilesUploadInStomaster),
	tblCustomerProductVatPercentageSettingsInStomasters: many(tblCustomerProductVatPercentageSettingsInStomaster),
	tblCustomerWiseProductPriceSettingsInStomasters: many(tblCustomerWiseProductPriceSettingsInStomaster),
	tblDeliveryNoteHdrInStoentries: many(tblDeliveryNoteHdrInStoentries),
	tblCustomerReceiptHdrInStoentries: many(tblCustomerReceiptHdrInStoentries),
	tblSalesOrderHdrInStoentries: many(tblSalesOrderHdrInStoentries),
	tblCustomerAddressDetailsInStomasters: many(tblCustomerAddressDetailsInStomaster),
	tblTaxInvoiceHdrInStoentries: many(tblTaxInvoiceHdrInStoentries),
	tblSalesProformaHdrInStoentries: many(tblSalesProformaHdrInStoentries),
}));

export const tblBillingLocationMasterInStomasterRelations = relations(tblBillingLocationMasterInStomaster, ({many}) => ({
	tblCustomerMasterInStomasters: many(tblCustomerMasterInStomaster),
	tblCustomerCompanyWiseBillingLocationMappingInStomasters: many(tblCustomerCompanyWiseBillingLocationMappingInStomaster),
	tblSalesOrderHdrInStoentries: many(tblSalesOrderHdrInStoentries),
	tblSalesProformaHdrInStoentries: many(tblSalesProformaHdrInStoentries),
}));

export const tblDistrictMasterInStomasterRelations = relations(tblDistrictMasterInStomaster, ({one, many}) => ({
	tblCustomerMasterInStomasters: many(tblCustomerMasterInStomaster),
	tblCountryMasterInStomaster: one(tblCountryMasterInStomaster, {
		fields: [tblDistrictMasterInStomaster.countryId],
		references: [tblCountryMasterInStomaster.countryId]
	}),
	tblRegionMasterInStomaster: one(tblRegionMasterInStomaster, {
		fields: [tblDistrictMasterInStomaster.regionId],
		references: [tblRegionMasterInStomaster.regionId]
	}),
}));

export const tblCountryMasterInStomasterRelations = relations(tblCountryMasterInStomaster, ({many}) => ({
	tblCustomerMasterInStomasters: many(tblCustomerMasterInStomaster),
	tblDistrictMasterInStomasters: many(tblDistrictMasterInStomaster),
	tblSupplierMasterInStomasters: many(tblSupplierMasterInStomaster),
	tblRegionMasterInStomasters: many(tblRegionMasterInStomaster),
}));

export const tblRegionMasterInStomasterRelations = relations(tblRegionMasterInStomaster, ({one, many}) => ({
	tblCustomerMasterInStomasters: many(tblCustomerMasterInStomaster),
	tblDistrictMasterInStomasters: many(tblDistrictMasterInStomaster),
	tblCountryMasterInStomaster: one(tblCountryMasterInStomaster, {
		fields: [tblRegionMasterInStomaster.countryId],
		references: [tblCountryMasterInStomaster.countryId]
	}),
}));

export const tblCustomerCompanyWiseBillingLocationMappingInStomasterRelations = relations(tblCustomerCompanyWiseBillingLocationMappingInStomaster, ({one}) => ({
	tblCustomerMasterInStomaster: one(tblCustomerMasterInStomaster, {
		fields: [tblCustomerCompanyWiseBillingLocationMappingInStomaster.customerId],
		references: [tblCustomerMasterInStomaster.customerId]
	}),
	tblCompanyMasterInStomaster: one(tblCompanyMasterInStomaster, {
		fields: [tblCustomerCompanyWiseBillingLocationMappingInStomaster.companyId],
		references: [tblCompanyMasterInStomaster.companyId]
	}),
	tblBillingLocationMasterInStomaster: one(tblBillingLocationMasterInStomaster, {
		fields: [tblCustomerCompanyWiseBillingLocationMappingInStomaster.billingLocationId],
		references: [tblBillingLocationMasterInStomaster.billingLocationId]
	}),
}));

export const tblCustomerPaymentModeMasterInStomasterRelations = relations(tblCustomerPaymentModeMasterInStomaster, ({many}) => ({
	tblCustomerCreditLimitDetailsInStomasters_requestedPaymentModeId: many(tblCustomerCreditLimitDetailsInStomaster, {
		relationName: "tblCustomerCreditLimitDetailsInStomaster_requestedPaymentModeId_tblCustomerPaymentModeMasterInStomaster_paymentModeId"
	}),
	tblCustomerCreditLimitDetailsInStomasters_approvedPaymentModeId: many(tblCustomerCreditLimitDetailsInStomaster, {
		relationName: "tblCustomerCreditLimitDetailsInStomaster_approvedPaymentModeId_tblCustomerPaymentModeMasterInStomaster_paymentModeId"
	}),
	tblCustomerReceiptHdrInStoentries: many(tblCustomerReceiptHdrInStoentries),
}));

export const tblExchangeRateMasterInStomasterRelations = relations(tblExchangeRateMasterInStomaster, ({one, many}) => ({
	tblCompanyMasterInStomaster: one(tblCompanyMasterInStomaster, {
		fields: [tblExchangeRateMasterInStomaster.companyId],
		references: [tblCompanyMasterInStomaster.companyId]
	}),
	tblCurrencyMasterInStomaster: one(tblCurrencyMasterInStomaster, {
		fields: [tblExchangeRateMasterInStomaster.currencyId],
		references: [tblCurrencyMasterInStomaster.currencyId]
	}),
	tblExchangeRateUsageLogInStomasters: many(tblExchangeRateUsageLogInStomaster),
}));

export const tblFieldDtlInStomasterRelations = relations(tblFieldDtlInStomaster, ({one}) => ({
	tblFieldHdrInStomaster: one(tblFieldHdrInStomaster, {
		fields: [tblFieldDtlInStomaster.fieldIdFldDtl],
		references: [tblFieldHdrInStomaster.fieldIdFldHdr]
	}),
}));

export const tblFieldHdrInStomasterRelations = relations(tblFieldHdrInStomaster, ({many}) => ({
	tblFieldDtlInStomasters: many(tblFieldDtlInStomaster),
}));

export const tblCustomerMasterFilesUploadInStomasterRelations = relations(tblCustomerMasterFilesUploadInStomaster, ({one}) => ({
	tblCustomerMasterInStomaster: one(tblCustomerMasterInStomaster, {
		fields: [tblCustomerMasterFilesUploadInStomaster.customerId],
		references: [tblCustomerMasterInStomaster.customerId]
	}),
}));

export const tblCustomerProductVatPercentageSettingsInStomasterRelations = relations(tblCustomerProductVatPercentageSettingsInStomaster, ({one}) => ({
	tblCompanyMasterInStomaster: one(tblCompanyMasterInStomaster, {
		fields: [tblCustomerProductVatPercentageSettingsInStomaster.companyId],
		references: [tblCompanyMasterInStomaster.companyId]
	}),
	tblCustomerMasterInStomaster: one(tblCustomerMasterInStomaster, {
		fields: [tblCustomerProductVatPercentageSettingsInStomaster.customerId],
		references: [tblCustomerMasterInStomaster.customerId]
	}),
	tblProductMainCategoryMasterInStomaster: one(tblProductMainCategoryMasterInStomaster, {
		fields: [tblCustomerProductVatPercentageSettingsInStomaster.mainCategoryId],
		references: [tblProductMainCategoryMasterInStomaster.mainCategoryId]
	}),
	tblProductSubCategoryMasterInStomaster: one(tblProductSubCategoryMasterInStomaster, {
		fields: [tblCustomerProductVatPercentageSettingsInStomaster.subCategoryId],
		references: [tblProductSubCategoryMasterInStomaster.subCategoryId]
	}),
	tblProductMasterInStomaster: one(tblProductMasterInStomaster, {
		fields: [tblCustomerProductVatPercentageSettingsInStomaster.productId],
		references: [tblProductMasterInStomaster.productId]
	}),
}));

export const tblProductMainCategoryMasterInStomasterRelations = relations(tblProductMainCategoryMasterInStomaster, ({many}) => ({
	tblCustomerProductVatPercentageSettingsInStomasters: many(tblCustomerProductVatPercentageSettingsInStomaster),
	tblCustomerWiseProductPriceSettingsInStomasters: many(tblCustomerWiseProductPriceSettingsInStomaster),
	tblProductOpeningStockInStomasters: many(tblProductOpeningStockInStomaster),
	tblProductSubCategoryMasterInStomasters: many(tblProductSubCategoryMasterInStomaster),
	tblProductCompanyMainCategoryMappingInStomasters: many(tblProductCompanyMainCategoryMappingInStomaster),
	tblProductMasterInStomasters: many(tblProductMasterInStomaster),
	tblStoreProductMinimumStockInStomasters: many(tblStoreProductMinimumStockInStomaster),
	tblDeliveryNoteDtlInStoentries: many(tblDeliveryNoteDtlInStoentries),
	tblGoodsInwardGrnDtlInStoentries: many(tblGoodsInwardGrnDtlInStoentries),
	tblPurchaseInvoiceDtlInStoentries: many(tblPurchaseInvoiceDtlInStoentries),
	tblSalesProformaDtlInStoentries: many(tblSalesProformaDtlInStoentries),
	tblPurchaseOrderDtlInStoentries: many(tblPurchaseOrderDtlInStoentries),
	tblTaxInvoiceDtlInStoentries: many(tblTaxInvoiceDtlInStoentries),
	tblSalesOrderDtlInStoentries: many(tblSalesOrderDtlInStoentries),
}));

export const tblProductSubCategoryMasterInStomasterRelations = relations(tblProductSubCategoryMasterInStomaster, ({one, many}) => ({
	tblCustomerProductVatPercentageSettingsInStomasters: many(tblCustomerProductVatPercentageSettingsInStomaster),
	tblCustomerWiseProductPriceSettingsInStomasters: many(tblCustomerWiseProductPriceSettingsInStomaster),
	tblProductOpeningStockInStomasters: many(tblProductOpeningStockInStomaster),
	tblProductMainCategoryMasterInStomaster: one(tblProductMainCategoryMasterInStomaster, {
		fields: [tblProductSubCategoryMasterInStomaster.mainCategoryId],
		references: [tblProductMainCategoryMasterInStomaster.mainCategoryId]
	}),
	tblProductMasterInStomasters: many(tblProductMasterInStomaster),
	tblStoreProductMinimumStockInStomasters: many(tblStoreProductMinimumStockInStomaster),
	tblDeliveryNoteDtlInStoentries: many(tblDeliveryNoteDtlInStoentries),
	tblGoodsInwardGrnDtlInStoentries: many(tblGoodsInwardGrnDtlInStoentries),
	tblPurchaseInvoiceDtlInStoentries: many(tblPurchaseInvoiceDtlInStoentries),
	tblSalesProformaDtlInStoentries: many(tblSalesProformaDtlInStoentries),
	tblPurchaseOrderDtlInStoentries: many(tblPurchaseOrderDtlInStoentries),
	tblTaxInvoiceDtlInStoentries: many(tblTaxInvoiceDtlInStoentries),
	tblSalesOrderDtlInStoentries: many(tblSalesOrderDtlInStoentries),
}));

export const tblProductMasterInStomasterRelations = relations(tblProductMasterInStomaster, ({one, many}) => ({
	tblCustomerProductVatPercentageSettingsInStomasters: many(tblCustomerProductVatPercentageSettingsInStomaster),
	tblCustomerWiseProductPriceSettingsInStomasters: many(tblCustomerWiseProductPriceSettingsInStomaster),
	tblProductOpeningStockInStomasters: many(tblProductOpeningStockInStomaster),
	tblProductMainCategoryMasterInStomaster: one(tblProductMainCategoryMasterInStomaster, {
		fields: [tblProductMasterInStomaster.mainCategoryId],
		references: [tblProductMainCategoryMasterInStomaster.mainCategoryId]
	}),
	tblProductSubCategoryMasterInStomaster: one(tblProductSubCategoryMasterInStomaster, {
		fields: [tblProductMasterInStomaster.subCategoryId],
		references: [tblProductSubCategoryMasterInStomaster.subCategoryId]
	}),
	tblStoreProductMinimumStockInStomasters: many(tblStoreProductMinimumStockInStomaster),
	tblDeliveryNoteDtlInStoentries: many(tblDeliveryNoteDtlInStoentries),
	tblExpenseDtlInStoentries: many(tblExpenseDtlInStoentries),
	tblGoodsInwardGrnDtlInStoentries: many(tblGoodsInwardGrnDtlInStoentries),
	tblPurchaseInvoiceDtlInStoentries: many(tblPurchaseInvoiceDtlInStoentries),
	tblSalesProformaDtlInStoentries: many(tblSalesProformaDtlInStoentries),
	tblPurchaseOrderDtlInStoentries: many(tblPurchaseOrderDtlInStoentries),
	tblTaxInvoiceDtlInStoentries: many(tblTaxInvoiceDtlInStoentries),
	tblSalesOrderDtlInStoentries: many(tblSalesOrderDtlInStoentries),
}));

export const tblCustomerWiseProductPriceSettingsInStomasterRelations = relations(tblCustomerWiseProductPriceSettingsInStomaster, ({one}) => ({
	tblCompanyMasterInStomaster: one(tblCompanyMasterInStomaster, {
		fields: [tblCustomerWiseProductPriceSettingsInStomaster.companyId],
		references: [tblCompanyMasterInStomaster.companyId]
	}),
	tblCustomerMasterInStomaster: one(tblCustomerMasterInStomaster, {
		fields: [tblCustomerWiseProductPriceSettingsInStomaster.customerId],
		references: [tblCustomerMasterInStomaster.customerId]
	}),
	tblProductMainCategoryMasterInStomaster: one(tblProductMainCategoryMasterInStomaster, {
		fields: [tblCustomerWiseProductPriceSettingsInStomaster.mainCategoryId],
		references: [tblProductMainCategoryMasterInStomaster.mainCategoryId]
	}),
	tblProductSubCategoryMasterInStomaster: one(tblProductSubCategoryMasterInStomaster, {
		fields: [tblCustomerWiseProductPriceSettingsInStomaster.subCategoryId],
		references: [tblProductSubCategoryMasterInStomaster.subCategoryId]
	}),
	tblProductMasterInStomaster: one(tblProductMasterInStomaster, {
		fields: [tblCustomerWiseProductPriceSettingsInStomaster.productId],
		references: [tblProductMasterInStomaster.productId]
	}),
	tblCurrencyMasterInStomaster: one(tblCurrencyMasterInStomaster, {
		fields: [tblCustomerWiseProductPriceSettingsInStomaster.currencyId],
		references: [tblCurrencyMasterInStomaster.currencyId]
	}),
}));

export const tblProductOpeningStockInStomasterRelations = relations(tblProductOpeningStockInStomaster, ({one}) => ({
	tblCompanyMasterInStomaster: one(tblCompanyMasterInStomaster, {
		fields: [tblProductOpeningStockInStomaster.companyId],
		references: [tblCompanyMasterInStomaster.companyId]
	}),
	tblProductMainCategoryMasterInStomaster: one(tblProductMainCategoryMasterInStomaster, {
		fields: [tblProductOpeningStockInStomaster.mainCategoryId],
		references: [tblProductMainCategoryMasterInStomaster.mainCategoryId]
	}),
	tblProductSubCategoryMasterInStomaster: one(tblProductSubCategoryMasterInStomaster, {
		fields: [tblProductOpeningStockInStomaster.subCategoryId],
		references: [tblProductSubCategoryMasterInStomaster.subCategoryId]
	}),
	tblProductMasterInStomaster: one(tblProductMasterInStomaster, {
		fields: [tblProductOpeningStockInStomaster.productId],
		references: [tblProductMasterInStomaster.productId]
	}),
	tblStoreMasterInStomaster: one(tblStoreMasterInStomaster, {
		fields: [tblProductOpeningStockInStomaster.storeId],
		references: [tblStoreMasterInStomaster.storeId]
	}),
}));

export const tblStoreMasterInStomasterRelations = relations(tblStoreMasterInStomaster, ({one, many}) => ({
	tblProductOpeningStockInStomasters: many(tblProductOpeningStockInStomaster),
	tblStoreProductMinimumStockInStomasters: many(tblStoreProductMinimumStockInStomaster),
	tblUserToStoreMappingInStomasters: many(tblUserToStoreMappingInStomaster),
	tblLocationMasterInStomaster: one(tblLocationMasterInStomaster, {
		fields: [tblStoreMasterInStomaster.locationId],
		references: [tblLocationMasterInStomaster.locationId]
	}),
	tblDeliveryNoteHdrInStoentries_fromStoreId: many(tblDeliveryNoteHdrInStoentries, {
		relationName: "tblDeliveryNoteHdrInStoentries_fromStoreId_tblStoreMasterInStomaster_storeId"
	}),
	tblDeliveryNoteHdrInStoentries_toStoreId: many(tblDeliveryNoteHdrInStoentries, {
		relationName: "tblDeliveryNoteHdrInStoentries_toStoreId_tblStoreMasterInStomaster_storeId"
	}),
	tblPurchaseInvoiceHdrInStoentries: many(tblPurchaseInvoiceHdrInStoentries),
	tblGoodsInwardGrnHdrInStoentries_sourceStoreId: many(tblGoodsInwardGrnHdrInStoentries, {
		relationName: "tblGoodsInwardGrnHdrInStoentries_sourceStoreId_tblStoreMasterInStomaster_storeId"
	}),
	tblGoodsInwardGrnHdrInStoentries_grnStoreId: many(tblGoodsInwardGrnHdrInStoentries, {
		relationName: "tblGoodsInwardGrnHdrInStoentries_grnStoreId_tblStoreMasterInStomaster_storeId"
	}),
	tblPurchaseOrderHdrInStoentries: many(tblPurchaseOrderHdrInStoentries),
	tblSalesOrderHdrInStoentries: many(tblSalesOrderHdrInStoentries),
	tblPurchaseOrderDtlInStoentries: many(tblPurchaseOrderDtlInStoentries),
	tblTaxInvoiceHdrInStoentries: many(tblTaxInvoiceHdrInStoentries),
	tblSalesProformaHdrInStoentries: many(tblSalesProformaHdrInStoentries),
}));

export const tblProductCompanyMainCategoryMappingInStomasterRelations = relations(tblProductCompanyMainCategoryMappingInStomaster, ({one}) => ({
	tblCompanyMasterInStomaster: one(tblCompanyMasterInStomaster, {
		fields: [tblProductCompanyMainCategoryMappingInStomaster.companyId],
		references: [tblCompanyMasterInStomaster.companyId]
	}),
	tblProductMainCategoryMasterInStomaster: one(tblProductMainCategoryMasterInStomaster, {
		fields: [tblProductCompanyMainCategoryMappingInStomaster.mainCategoryId],
		references: [tblProductMainCategoryMasterInStomaster.mainCategoryId]
	}),
}));

export const tblStoreProductMinimumStockInStomasterRelations = relations(tblStoreProductMinimumStockInStomaster, ({one}) => ({
	tblCompanyMasterInStomaster: one(tblCompanyMasterInStomaster, {
		fields: [tblStoreProductMinimumStockInStomaster.companyId],
		references: [tblCompanyMasterInStomaster.companyId]
	}),
	tblStoreMasterInStomaster: one(tblStoreMasterInStomaster, {
		fields: [tblStoreProductMinimumStockInStomaster.storeId],
		references: [tblStoreMasterInStomaster.storeId]
	}),
	tblProductMainCategoryMasterInStomaster: one(tblProductMainCategoryMasterInStomaster, {
		fields: [tblStoreProductMinimumStockInStomaster.mainCategoryId],
		references: [tblProductMainCategoryMasterInStomaster.mainCategoryId]
	}),
	tblProductSubCategoryMasterInStomaster: one(tblProductSubCategoryMasterInStomaster, {
		fields: [tblStoreProductMinimumStockInStomaster.subCategoryId],
		references: [tblProductSubCategoryMasterInStomaster.subCategoryId]
	}),
	tblProductMasterInStomaster: one(tblProductMasterInStomaster, {
		fields: [tblStoreProductMinimumStockInStomaster.productId],
		references: [tblProductMasterInStomaster.productId]
	}),
}));

export const tblSupplierMasterInStomasterRelations = relations(tblSupplierMasterInStomaster, ({one, many}) => ({
	tblCountryMasterInStomaster: one(tblCountryMasterInStomaster, {
		fields: [tblSupplierMasterInStomaster.countryId],
		references: [tblCountryMasterInStomaster.countryId]
	}),
	tblExpenseHdrInStoentries: many(tblExpenseHdrInStoentries),
	tblPurchaseInvoiceHdrInStoentries: many(tblPurchaseInvoiceHdrInStoentries),
	tblGoodsInwardGrnHdrInStoentries: many(tblGoodsInwardGrnHdrInStoentries),
	tblPurchaseOrderHdrInStoentries: many(tblPurchaseOrderHdrInStoentries),
}));

export const tblUserToStoreMappingInStomasterRelations = relations(tblUserToStoreMappingInStomaster, ({one}) => ({
	tblUserInfoHdrInStomaster: one(tblUserInfoHdrInStomaster, {
		fields: [tblUserToStoreMappingInStomaster.userIdUserToRole],
		references: [tblUserInfoHdrInStomaster.loginIdUserHdr]
	}),
	tblCompanyMasterInStomaster: one(tblCompanyMasterInStomaster, {
		fields: [tblUserToStoreMappingInStomaster.companyId],
		references: [tblCompanyMasterInStomaster.companyId]
	}),
	tblStoreMasterInStomaster: one(tblStoreMasterInStomaster, {
		fields: [tblUserToStoreMappingInStomaster.storeIdUserToRole],
		references: [tblStoreMasterInStomaster.storeId]
	}),
	tblRoleMasterInStomaster: one(tblRoleMasterInStomaster, {
		fields: [tblUserToStoreMappingInStomaster.roleIdUserToRole],
		references: [tblRoleMasterInStomaster.roleId]
	}),
}));

export const tblUserInfoHdrInStomasterRelations = relations(tblUserInfoHdrInStomaster, ({many}) => ({
	tblUserToStoreMappingInStomasters: many(tblUserToStoreMappingInStomaster),
	tblChangePasswordLogInStomasters: many(tblChangePasswordLogInStomaster),
}));

export const tblRoleMasterInStomasterRelations = relations(tblRoleMasterInStomaster, ({many}) => ({
	tblUserToStoreMappingInStomasters: many(tblUserToStoreMappingInStomaster),
}));

export const tblLocationMasterInStomasterRelations = relations(tblLocationMasterInStomaster, ({many}) => ({
	tblStoreMasterInStomasters: many(tblStoreMasterInStomaster),
}));

export const tblVatPercentageSettingInStomasterRelations = relations(tblVatPercentageSettingInStomaster, ({one}) => ({
	tblCompanyMasterInStomaster: one(tblCompanyMasterInStomaster, {
		fields: [tblVatPercentageSettingInStomaster.companyId],
		references: [tblCompanyMasterInStomaster.companyId]
	}),
}));

export const tblCustomerReceiptInvoiceDtlInStoentriesRelations = relations(tblCustomerReceiptInvoiceDtlInStoentries, ({one}) => ({
	tblCustomerReceiptHdrInStoentry: one(tblCustomerReceiptHdrInStoentries, {
		fields: [tblCustomerReceiptInvoiceDtlInStoentries.receiptRefNo],
		references: [tblCustomerReceiptHdrInStoentries.receiptRefNo]
	}),
	tblTaxInvoiceHdrInStoentry: one(tblTaxInvoiceHdrInStoentries, {
		fields: [tblCustomerReceiptInvoiceDtlInStoentries.taxInvoiceRefNo],
		references: [tblTaxInvoiceHdrInStoentries.taxInvoiceRefNo]
	}),
}));

export const tblCustomerReceiptHdrInStoentriesRelations = relations(tblCustomerReceiptHdrInStoentries, ({one, many}) => ({
	tblCustomerReceiptInvoiceDtlInStoentries: many(tblCustomerReceiptInvoiceDtlInStoentries),
	tblCompanyMasterInStomaster: one(tblCompanyMasterInStomaster, {
		fields: [tblCustomerReceiptHdrInStoentries.companyId],
		references: [tblCompanyMasterInStomaster.companyId]
	}),
	tblCustomerMasterInStomaster: one(tblCustomerMasterInStomaster, {
		fields: [tblCustomerReceiptHdrInStoentries.customerId],
		references: [tblCustomerMasterInStomaster.customerId]
	}),
	tblCustomerPaymentModeMasterInStomaster: one(tblCustomerPaymentModeMasterInStomaster, {
		fields: [tblCustomerReceiptHdrInStoentries.paymentModeId],
		references: [tblCustomerPaymentModeMasterInStomaster.paymentModeId]
	}),
	tblBankMasterInStomaster_crBankCashId: one(tblBankMasterInStomaster, {
		fields: [tblCustomerReceiptHdrInStoentries.crBankCashId],
		references: [tblBankMasterInStomaster.bankId],
		relationName: "tblCustomerReceiptHdrInStoentries_crBankCashId_tblBankMasterInStomaster_bankId"
	}),
	tblCompanyBankAccountMasterInStomaster: one(tblCompanyBankAccountMasterInStomaster, {
		fields: [tblCustomerReceiptHdrInStoentries.crAccountId],
		references: [tblCompanyBankAccountMasterInStomaster.accountId]
	}),
	tblBankMasterInStomaster_drBankCashId: one(tblBankMasterInStomaster, {
		fields: [tblCustomerReceiptHdrInStoentries.drBankCashId],
		references: [tblBankMasterInStomaster.bankId],
		relationName: "tblCustomerReceiptHdrInStoentries_drBankCashId_tblBankMasterInStomaster_bankId"
	}),
	tblCurrencyMasterInStomaster: one(tblCurrencyMasterInStomaster, {
		fields: [tblCustomerReceiptHdrInStoentries.currencyId],
		references: [tblCurrencyMasterInStomaster.currencyId]
	}),
	tblCustomerReceiptFilesUploadInStoentries: many(tblCustomerReceiptFilesUploadInStoentries),
}));

export const tblTaxInvoiceHdrInStoentriesRelations = relations(tblTaxInvoiceHdrInStoentries, ({one, many}) => ({
	tblCustomerReceiptInvoiceDtlInStoentries: many(tblCustomerReceiptInvoiceDtlInStoentries),
	tblTaxInvoiceDtlInStoentries: many(tblTaxInvoiceDtlInStoentries),
	tblDeliveryNoteHdrInStoentry: one(tblDeliveryNoteHdrInStoentries, {
		fields: [tblTaxInvoiceHdrInStoentries.deliveryNoteRefNo],
		references: [tblDeliveryNoteHdrInStoentries.deliveryNoteRefNo]
	}),
	tblCustomerMasterInStomaster: one(tblCustomerMasterInStomaster, {
		fields: [tblTaxInvoiceHdrInStoentries.customerId],
		references: [tblCustomerMasterInStomaster.customerId]
	}),
	tblCurrencyMasterInStomaster: one(tblCurrencyMasterInStomaster, {
		fields: [tblTaxInvoiceHdrInStoentries.currencyId],
		references: [tblCurrencyMasterInStomaster.currencyId]
	}),
	tblCompanyMasterInStomaster: one(tblCompanyMasterInStomaster, {
		fields: [tblTaxInvoiceHdrInStoentries.companyId],
		references: [tblCompanyMasterInStomaster.companyId]
	}),
	tblStoreMasterInStomaster: one(tblStoreMasterInStomaster, {
		fields: [tblTaxInvoiceHdrInStoentries.fromStoreId],
		references: [tblStoreMasterInStomaster.storeId]
	}),
	tblTaxInvoiceFilesUploadInStoentries: many(tblTaxInvoiceFilesUploadInStoentries),
}));

export const tblDeliveryNoteHdrInStoentriesRelations = relations(tblDeliveryNoteHdrInStoentries, ({one, many}) => ({
	tblCompanyMasterInStomaster: one(tblCompanyMasterInStomaster, {
		fields: [tblDeliveryNoteHdrInStoentries.companyId],
		references: [tblCompanyMasterInStomaster.companyId]
	}),
	tblStoreMasterInStomaster_fromStoreId: one(tblStoreMasterInStomaster, {
		fields: [tblDeliveryNoteHdrInStoentries.fromStoreId],
		references: [tblStoreMasterInStomaster.storeId],
		relationName: "tblDeliveryNoteHdrInStoentries_fromStoreId_tblStoreMasterInStomaster_storeId"
	}),
	tblCustomerMasterInStomaster: one(tblCustomerMasterInStomaster, {
		fields: [tblDeliveryNoteHdrInStoentries.customerId],
		references: [tblCustomerMasterInStomaster.customerId]
	}),
	tblCurrencyMasterInStomaster: one(tblCurrencyMasterInStomaster, {
		fields: [tblDeliveryNoteHdrInStoentries.currencyId],
		references: [tblCurrencyMasterInStomaster.currencyId]
	}),
	tblStoreMasterInStomaster_toStoreId: one(tblStoreMasterInStomaster, {
		fields: [tblDeliveryNoteHdrInStoentries.toStoreId],
		references: [tblStoreMasterInStomaster.storeId],
		relationName: "tblDeliveryNoteHdrInStoentries_toStoreId_tblStoreMasterInStomaster_storeId"
	}),
	tblDeliveryNoteDtlInStoentries: many(tblDeliveryNoteDtlInStoentries),
	tblDeliveryFilesUploadInStoentries: many(tblDeliveryFilesUploadInStoentries),
	tblTaxInvoiceHdrInStoentries: many(tblTaxInvoiceHdrInStoentries),
}));

export const tblDeliveryNoteDtlInStoentriesRelations = relations(tblDeliveryNoteDtlInStoentries, ({one}) => ({
	tblDeliveryNoteHdrInStoentry: one(tblDeliveryNoteHdrInStoentries, {
		fields: [tblDeliveryNoteDtlInStoentries.deliveryNoteRefNo],
		references: [tblDeliveryNoteHdrInStoentries.deliveryNoteRefNo]
	}),
	tblProductMainCategoryMasterInStomaster: one(tblProductMainCategoryMasterInStomaster, {
		fields: [tblDeliveryNoteDtlInStoentries.mainCategoryId],
		references: [tblProductMainCategoryMasterInStomaster.mainCategoryId]
	}),
	tblProductSubCategoryMasterInStomaster: one(tblProductSubCategoryMasterInStomaster, {
		fields: [tblDeliveryNoteDtlInStoentries.subCategoryId],
		references: [tblProductSubCategoryMasterInStomaster.subCategoryId]
	}),
	tblProductMasterInStomaster: one(tblProductMasterInStomaster, {
		fields: [tblDeliveryNoteDtlInStoentries.productId],
		references: [tblProductMasterInStomaster.productId]
	}),
}));

export const tblExpenseHdrInStoentriesRelations = relations(tblExpenseHdrInStoentries, ({one, many}) => ({
	tblAccountsHeadMasterInStomaster: one(tblAccountsHeadMasterInStomaster, {
		fields: [tblExpenseHdrInStoentries.accountHeadId],
		references: [tblAccountsHeadMasterInStomaster.accountHeadId]
	}),
	tblSupplierMasterInStomaster: one(tblSupplierMasterInStomaster, {
		fields: [tblExpenseHdrInStoentries.expenseSupplierId],
		references: [tblSupplierMasterInStomaster.supplierId]
	}),
	tblCompanyMasterInStomaster: one(tblCompanyMasterInStomaster, {
		fields: [tblExpenseHdrInStoentries.companyId],
		references: [tblCompanyMasterInStomaster.companyId]
	}),
	tblCurrencyMasterInStomaster: one(tblCurrencyMasterInStomaster, {
		fields: [tblExpenseHdrInStoentries.currencyId],
		references: [tblCurrencyMasterInStomaster.currencyId]
	}),
	tblExpenseDtlInStoentries: many(tblExpenseDtlInStoentries),
	tblExpenseFilesUploadInStoentries: many(tblExpenseFilesUploadInStoentries),
}));

export const tblAccountsHeadMasterInStomasterRelations = relations(tblAccountsHeadMasterInStomaster, ({many}) => ({
	tblExpenseHdrInStoentries: many(tblExpenseHdrInStoentries),
}));

export const tblExpenseDtlInStoentriesRelations = relations(tblExpenseDtlInStoentries, ({one}) => ({
	tblExpenseHdrInStoentry: one(tblExpenseHdrInStoentries, {
		fields: [tblExpenseDtlInStoentries.expenseRefNo],
		references: [tblExpenseHdrInStoentries.expenseRefNo]
	}),
	tblProductMasterInStomaster: one(tblProductMasterInStomaster, {
		fields: [tblExpenseDtlInStoentries.productId],
		references: [tblProductMasterInStomaster.productId]
	}),
}));

export const tblExpenseFilesUploadInStoentriesRelations = relations(tblExpenseFilesUploadInStoentries, ({one}) => ({
	tblExpenseHdrInStoentry: one(tblExpenseHdrInStoentries, {
		fields: [tblExpenseFilesUploadInStoentries.expenseRefNo],
		references: [tblExpenseHdrInStoentries.expenseRefNo]
	}),
}));

export const tblDeliveryFilesUploadInStoentriesRelations = relations(tblDeliveryFilesUploadInStoentries, ({one}) => ({
	tblDeliveryNoteHdrInStoentry: one(tblDeliveryNoteHdrInStoentries, {
		fields: [tblDeliveryFilesUploadInStoentries.deliveryNoteRefNo],
		references: [tblDeliveryNoteHdrInStoentries.deliveryNoteRefNo]
	}),
}));

export const tblPurchaseInvoiceHdrInStoentriesRelations = relations(tblPurchaseInvoiceHdrInStoentries, ({one, many}) => ({
	tblCompanyMasterInStomaster: one(tblCompanyMasterInStomaster, {
		fields: [tblPurchaseInvoiceHdrInStoentries.companyId],
		references: [tblCompanyMasterInStomaster.companyId]
	}),
	tblSupplierMasterInStomaster: one(tblSupplierMasterInStomaster, {
		fields: [tblPurchaseInvoiceHdrInStoentries.supplierId],
		references: [tblSupplierMasterInStomaster.supplierId]
	}),
	tblPaymentTermMasterInStomaster: one(tblPaymentTermMasterInStomaster, {
		fields: [tblPurchaseInvoiceHdrInStoentries.paymentTermId],
		references: [tblPaymentTermMasterInStomaster.paymentTermId]
	}),
	tblCurrencyMasterInStomaster: one(tblCurrencyMasterInStomaster, {
		fields: [tblPurchaseInvoiceHdrInStoentries.currencyId],
		references: [tblCurrencyMasterInStomaster.currencyId]
	}),
	tblStoreMasterInStomaster: one(tblStoreMasterInStomaster, {
		fields: [tblPurchaseInvoiceHdrInStoentries.storeId],
		references: [tblStoreMasterInStomaster.storeId]
	}),
	tblPurchaseInvoiceDtlInStoentries: many(tblPurchaseInvoiceDtlInStoentries),
	tblPurchaseInvoiceFilesUploadInStoentries: many(tblPurchaseInvoiceFilesUploadInStoentries),
	tblPurchaseInvoiceAdditionalCostDetailsInStoentries: many(tblPurchaseInvoiceAdditionalCostDetailsInStoentries),
}));

export const tblPaymentTermMasterInStomasterRelations = relations(tblPaymentTermMasterInStomaster, ({many}) => ({
	tblPurchaseInvoiceHdrInStoentries: many(tblPurchaseInvoiceHdrInStoentries),
	tblPurchaseOrderHdrInStoentries: many(tblPurchaseOrderHdrInStoentries),
}));

export const tblGoodsInwardGrnDtlInStoentriesRelations = relations(tblGoodsInwardGrnDtlInStoentries, ({one}) => ({
	tblGoodsInwardGrnHdrInStoentry: one(tblGoodsInwardGrnHdrInStoentries, {
		fields: [tblGoodsInwardGrnDtlInStoentries.grnRefNo],
		references: [tblGoodsInwardGrnHdrInStoentries.grnRefNo]
	}),
	tblProductMainCategoryMasterInStomaster: one(tblProductMainCategoryMasterInStomaster, {
		fields: [tblGoodsInwardGrnDtlInStoentries.mainCategoryId],
		references: [tblProductMainCategoryMasterInStomaster.mainCategoryId]
	}),
	tblProductSubCategoryMasterInStomaster: one(tblProductSubCategoryMasterInStomaster, {
		fields: [tblGoodsInwardGrnDtlInStoentries.subCategoryId],
		references: [tblProductSubCategoryMasterInStomaster.subCategoryId]
	}),
	tblProductMasterInStomaster: one(tblProductMasterInStomaster, {
		fields: [tblGoodsInwardGrnDtlInStoentries.productId],
		references: [tblProductMasterInStomaster.productId]
	}),
}));

export const tblGoodsInwardGrnHdrInStoentriesRelations = relations(tblGoodsInwardGrnHdrInStoentries, ({one, many}) => ({
	tblGoodsInwardGrnDtlInStoentries: many(tblGoodsInwardGrnDtlInStoentries),
	tblPurchaseInvoiceDtlInStoentries: many(tblPurchaseInvoiceDtlInStoentries),
	tblCompanyMasterInStomaster: one(tblCompanyMasterInStomaster, {
		fields: [tblGoodsInwardGrnHdrInStoentries.companyId],
		references: [tblCompanyMasterInStomaster.companyId]
	}),
	tblStoreMasterInStomaster_sourceStoreId: one(tblStoreMasterInStomaster, {
		fields: [tblGoodsInwardGrnHdrInStoentries.sourceStoreId],
		references: [tblStoreMasterInStomaster.storeId],
		relationName: "tblGoodsInwardGrnHdrInStoentries_sourceStoreId_tblStoreMasterInStomaster_storeId"
	}),
	tblStoreMasterInStomaster_grnStoreId: one(tblStoreMasterInStomaster, {
		fields: [tblGoodsInwardGrnHdrInStoentries.grnStoreId],
		references: [tblStoreMasterInStomaster.storeId],
		relationName: "tblGoodsInwardGrnHdrInStoentries_grnStoreId_tblStoreMasterInStomaster_storeId"
	}),
	tblSupplierMasterInStomaster: one(tblSupplierMasterInStomaster, {
		fields: [tblGoodsInwardGrnHdrInStoentries.supplierId],
		references: [tblSupplierMasterInStomaster.supplierId]
	}),
	tblGoodsFilesUploadInStoentries: many(tblGoodsFilesUploadInStoentries),
}));

export const tblPurchaseInvoiceDtlInStoentriesRelations = relations(tblPurchaseInvoiceDtlInStoentries, ({one}) => ({
	tblPurchaseInvoiceHdrInStoentry: one(tblPurchaseInvoiceHdrInStoentries, {
		fields: [tblPurchaseInvoiceDtlInStoentries.purchaseInvoiceRefNo],
		references: [tblPurchaseInvoiceHdrInStoentries.purchaseInvoiceRefNo]
	}),
	tblGoodsInwardGrnHdrInStoentry: one(tblGoodsInwardGrnHdrInStoentries, {
		fields: [tblPurchaseInvoiceDtlInStoentries.grnRefNo],
		references: [tblGoodsInwardGrnHdrInStoentries.grnRefNo]
	}),
	tblProductMainCategoryMasterInStomaster: one(tblProductMainCategoryMasterInStomaster, {
		fields: [tblPurchaseInvoiceDtlInStoentries.mainCategoryId],
		references: [tblProductMainCategoryMasterInStomaster.mainCategoryId]
	}),
	tblProductSubCategoryMasterInStomaster: one(tblProductSubCategoryMasterInStomaster, {
		fields: [tblPurchaseInvoiceDtlInStoentries.subCategoryId],
		references: [tblProductSubCategoryMasterInStomaster.subCategoryId]
	}),
	tblProductMasterInStomaster: one(tblProductMasterInStomaster, {
		fields: [tblPurchaseInvoiceDtlInStoentries.productId],
		references: [tblProductMasterInStomaster.productId]
	}),
}));

export const tblPurchaseInvoiceFilesUploadInStoentriesRelations = relations(tblPurchaseInvoiceFilesUploadInStoentries, ({one}) => ({
	tblPurchaseInvoiceHdrInStoentry: one(tblPurchaseInvoiceHdrInStoentries, {
		fields: [tblPurchaseInvoiceFilesUploadInStoentries.purchaseInvoiceRefNo],
		references: [tblPurchaseInvoiceHdrInStoentries.purchaseInvoiceRefNo]
	}),
}));

export const tblPurchaseInvoiceAdditionalCostDetailsInStoentriesRelations = relations(tblPurchaseInvoiceAdditionalCostDetailsInStoentries, ({one}) => ({
	tblPurchaseInvoiceHdrInStoentry: one(tblPurchaseInvoiceHdrInStoentries, {
		fields: [tblPurchaseInvoiceAdditionalCostDetailsInStoentries.purchaseInvoiceNo],
		references: [tblPurchaseInvoiceHdrInStoentries.purchaseInvoiceRefNo]
	}),
	tblAdditionalCostTypeMasterInStomaster: one(tblAdditionalCostTypeMasterInStomaster, {
		fields: [tblPurchaseInvoiceAdditionalCostDetailsInStoentries.additionalCostTypeId],
		references: [tblAdditionalCostTypeMasterInStomaster.additionalCostTypeId]
	}),
}));

export const tblAdditionalCostTypeMasterInStomasterRelations = relations(tblAdditionalCostTypeMasterInStomaster, ({many}) => ({
	tblPurchaseInvoiceAdditionalCostDetailsInStoentries: many(tblPurchaseInvoiceAdditionalCostDetailsInStoentries),
	tblPurchaseOrderAdditionalCostDetailsInStoentries: many(tblPurchaseOrderAdditionalCostDetailsInStoentries),
}));

export const tblPurchaseOrderHdrInStoentriesRelations = relations(tblPurchaseOrderHdrInStoentries, ({one}) => ({
	tblCompanyMasterInStomaster: one(tblCompanyMasterInStomaster, {
		fields: [tblPurchaseOrderHdrInStoentries.companyId],
		references: [tblCompanyMasterInStomaster.companyId]
	}),
	tblSupplierMasterInStomaster: one(tblSupplierMasterInStomaster, {
		fields: [tblPurchaseOrderHdrInStoentries.supplierId],
		references: [tblSupplierMasterInStomaster.supplierId]
	}),
	tblPaymentTermMasterInStomaster: one(tblPaymentTermMasterInStomaster, {
		fields: [tblPurchaseOrderHdrInStoentries.paymentTermId],
		references: [tblPaymentTermMasterInStomaster.paymentTermId]
	}),
	tblCurrencyMasterInStomaster: one(tblCurrencyMasterInStomaster, {
		fields: [tblPurchaseOrderHdrInStoentries.currencyId],
		references: [tblCurrencyMasterInStomaster.currencyId]
	}),
	tblStoreMasterInStomaster: one(tblStoreMasterInStomaster, {
		fields: [tblPurchaseOrderHdrInStoentries.poStoreId],
		references: [tblStoreMasterInStomaster.storeId]
	}),
}));

export const tblSalesOrderHdrInStoentriesRelations = relations(tblSalesOrderHdrInStoentries, ({one, many}) => ({
	tblSalesProformaHdrInStoentry: one(tblSalesProformaHdrInStoentries, {
		fields: [tblSalesOrderHdrInStoentries.salesProformaRefNo],
		references: [tblSalesProformaHdrInStoentries.salesProformaRefNo]
	}),
	tblCustomerMasterInStomaster: one(tblCustomerMasterInStomaster, {
		fields: [tblSalesOrderHdrInStoentries.customerId],
		references: [tblCustomerMasterInStomaster.customerId]
	}),
	tblBillingLocationMasterInStomaster: one(tblBillingLocationMasterInStomaster, {
		fields: [tblSalesOrderHdrInStoentries.billingLocationId],
		references: [tblBillingLocationMasterInStomaster.billingLocationId]
	}),
	tblSalesPersonMasterInStomaster: one(tblSalesPersonMasterInStomaster, {
		fields: [tblSalesOrderHdrInStoentries.salesPersonEmpId],
		references: [tblSalesPersonMasterInStomaster.salesPersonId]
	}),
	tblCurrencyMasterInStomaster: one(tblCurrencyMasterInStomaster, {
		fields: [tblSalesOrderHdrInStoentries.currencyId],
		references: [tblCurrencyMasterInStomaster.currencyId]
	}),
	tblCompanyMasterInStomaster: one(tblCompanyMasterInStomaster, {
		fields: [tblSalesOrderHdrInStoentries.companyId],
		references: [tblCompanyMasterInStomaster.companyId]
	}),
	tblStoreMasterInStomaster: one(tblStoreMasterInStomaster, {
		fields: [tblSalesOrderHdrInStoentries.storeId],
		references: [tblStoreMasterInStomaster.storeId]
	}),
	tblSalesOrderFilesUploadInStoentries: many(tblSalesOrderFilesUploadInStoentries),
	tblSalesOrderDtlInStoentries: many(tblSalesOrderDtlInStoentries),
}));

export const tblSalesProformaHdrInStoentriesRelations = relations(tblSalesProformaHdrInStoentries, ({one, many}) => ({
	tblSalesOrderHdrInStoentries: many(tblSalesOrderHdrInStoentries),
	tblSalesProformaDtlInStoentries: many(tblSalesProformaDtlInStoentries),
	tblSalesProformaFilesUploadInStoentries: many(tblSalesProformaFilesUploadInStoentries),
	tblCompanyMasterInStomaster: one(tblCompanyMasterInStomaster, {
		fields: [tblSalesProformaHdrInStoentries.companyId],
		references: [tblCompanyMasterInStomaster.companyId]
	}),
	tblCustomerMasterInStomaster: one(tblCustomerMasterInStomaster, {
		fields: [tblSalesProformaHdrInStoentries.customerId],
		references: [tblCustomerMasterInStomaster.customerId]
	}),
	tblBillingLocationMasterInStomaster: one(tblBillingLocationMasterInStomaster, {
		fields: [tblSalesProformaHdrInStoentries.billingLocationId],
		references: [tblBillingLocationMasterInStomaster.billingLocationId]
	}),
	tblSalesPersonMasterInStomaster: one(tblSalesPersonMasterInStomaster, {
		fields: [tblSalesProformaHdrInStoentries.salesPersonEmpId],
		references: [tblSalesPersonMasterInStomaster.salesPersonId]
	}),
	tblCurrencyMasterInStomaster: one(tblCurrencyMasterInStomaster, {
		fields: [tblSalesProformaHdrInStoentries.currencyId],
		references: [tblCurrencyMasterInStomaster.currencyId]
	}),
	tblStoreMasterInStomaster: one(tblStoreMasterInStomaster, {
		fields: [tblSalesProformaHdrInStoentries.storeId],
		references: [tblStoreMasterInStomaster.storeId]
	}),
}));

export const tblSalesPersonMasterInStomasterRelations = relations(tblSalesPersonMasterInStomaster, ({many}) => ({
	tblSalesOrderHdrInStoentries: many(tblSalesOrderHdrInStoentries),
	tblSalesProformaHdrInStoentries: many(tblSalesProformaHdrInStoentries),
}));

export const tblSalesOrderFilesUploadInStoentriesRelations = relations(tblSalesOrderFilesUploadInStoentries, ({one}) => ({
	tblSalesOrderHdrInStoentry: one(tblSalesOrderHdrInStoentries, {
		fields: [tblSalesOrderFilesUploadInStoentries.salesOrderRefNo],
		references: [tblSalesOrderHdrInStoentries.salesOrderRefNo]
	}),
}));

export const tblSalesProformaDtlInStoentriesRelations = relations(tblSalesProformaDtlInStoentries, ({one}) => ({
	tblSalesProformaHdrInStoentry: one(tblSalesProformaHdrInStoentries, {
		fields: [tblSalesProformaDtlInStoentries.salesProformaRefNo],
		references: [tblSalesProformaHdrInStoentries.salesProformaRefNo]
	}),
	tblProductMainCategoryMasterInStomaster: one(tblProductMainCategoryMasterInStomaster, {
		fields: [tblSalesProformaDtlInStoentries.mainCategoryId],
		references: [tblProductMainCategoryMasterInStomaster.mainCategoryId]
	}),
	tblProductSubCategoryMasterInStomaster: one(tblProductSubCategoryMasterInStomaster, {
		fields: [tblSalesProformaDtlInStoentries.subCategoryId],
		references: [tblProductSubCategoryMasterInStomaster.subCategoryId]
	}),
	tblProductMasterInStomaster: one(tblProductMasterInStomaster, {
		fields: [tblSalesProformaDtlInStoentries.productId],
		references: [tblProductMasterInStomaster.productId]
	}),
}));

export const tblSalesProformaFilesUploadInStoentriesRelations = relations(tblSalesProformaFilesUploadInStoentries, ({one}) => ({
	tblSalesProformaHdrInStoentry: one(tblSalesProformaHdrInStoentries, {
		fields: [tblSalesProformaFilesUploadInStoentries.salesProformaRefNo],
		references: [tblSalesProformaHdrInStoentries.salesProformaRefNo]
	}),
}));

export const tblPurchaseOrderDtlInStoentriesRelations = relations(tblPurchaseOrderDtlInStoentries, ({one}) => ({
	tblStoreMasterInStomaster: one(tblStoreMasterInStomaster, {
		fields: [tblPurchaseOrderDtlInStoentries.requestStoreId],
		references: [tblStoreMasterInStomaster.storeId]
	}),
	tblProductMainCategoryMasterInStomaster: one(tblProductMainCategoryMasterInStomaster, {
		fields: [tblPurchaseOrderDtlInStoentries.mainCategoryId],
		references: [tblProductMainCategoryMasterInStomaster.mainCategoryId]
	}),
	tblProductSubCategoryMasterInStomaster: one(tblProductSubCategoryMasterInStomaster, {
		fields: [tblPurchaseOrderDtlInStoentries.subCategoryId],
		references: [tblProductSubCategoryMasterInStomaster.subCategoryId]
	}),
	tblProductMasterInStomaster: one(tblProductMasterInStomaster, {
		fields: [tblPurchaseOrderDtlInStoentries.productId],
		references: [tblProductMasterInStomaster.productId]
	}),
}));

export const tblTaxInvoiceDtlInStoentriesRelations = relations(tblTaxInvoiceDtlInStoentries, ({one}) => ({
	tblTaxInvoiceHdrInStoentry: one(tblTaxInvoiceHdrInStoentries, {
		fields: [tblTaxInvoiceDtlInStoentries.taxInvoiceRefNo],
		references: [tblTaxInvoiceHdrInStoentries.taxInvoiceRefNo]
	}),
	tblProductMainCategoryMasterInStomaster: one(tblProductMainCategoryMasterInStomaster, {
		fields: [tblTaxInvoiceDtlInStoentries.mainCategoryId],
		references: [tblProductMainCategoryMasterInStomaster.mainCategoryId]
	}),
	tblProductSubCategoryMasterInStomaster: one(tblProductSubCategoryMasterInStomaster, {
		fields: [tblTaxInvoiceDtlInStoentries.subCategoryId],
		references: [tblProductSubCategoryMasterInStomaster.subCategoryId]
	}),
	tblProductMasterInStomaster: one(tblProductMasterInStomaster, {
		fields: [tblTaxInvoiceDtlInStoentries.productId],
		references: [tblProductMasterInStomaster.productId]
	}),
}));

export const tblChangePasswordLogInStomasterRelations = relations(tblChangePasswordLogInStomaster, ({one}) => ({
	tblUserInfoHdrInStomaster: one(tblUserInfoHdrInStomaster, {
		fields: [tblChangePasswordLogInStomaster.loginId],
		references: [tblUserInfoHdrInStomaster.loginIdUserHdr]
	}),
}));

export const tblCustomerAddressDetailsInStomasterRelations = relations(tblCustomerAddressDetailsInStomaster, ({one}) => ({
	tblCustomerMasterInStomaster: one(tblCustomerMasterInStomaster, {
		fields: [tblCustomerAddressDetailsInStomaster.customerId],
		references: [tblCustomerMasterInStomaster.customerId]
	}),
}));

export const tblCustomerReceiptFilesUploadInStoentriesRelations = relations(tblCustomerReceiptFilesUploadInStoentries, ({one}) => ({
	tblCustomerReceiptHdrInStoentry: one(tblCustomerReceiptHdrInStoentries, {
		fields: [tblCustomerReceiptFilesUploadInStoentries.receiptRefNo],
		references: [tblCustomerReceiptHdrInStoentries.receiptRefNo]
	}),
}));

export const tblGoodsFilesUploadInStoentriesRelations = relations(tblGoodsFilesUploadInStoentries, ({one}) => ({
	tblGoodsInwardGrnHdrInStoentry: one(tblGoodsInwardGrnHdrInStoentries, {
		fields: [tblGoodsFilesUploadInStoentries.grnRefNo],
		references: [tblGoodsInwardGrnHdrInStoentries.grnRefNo]
	}),
}));

export const tblSalesOrderDtlInStoentriesRelations = relations(tblSalesOrderDtlInStoentries, ({one}) => ({
	tblSalesOrderHdrInStoentry: one(tblSalesOrderHdrInStoentries, {
		fields: [tblSalesOrderDtlInStoentries.salesOrderRefNo],
		references: [tblSalesOrderHdrInStoentries.salesOrderRefNo]
	}),
	tblProductMainCategoryMasterInStomaster: one(tblProductMainCategoryMasterInStomaster, {
		fields: [tblSalesOrderDtlInStoentries.mainCategoryId],
		references: [tblProductMainCategoryMasterInStomaster.mainCategoryId]
	}),
	tblProductSubCategoryMasterInStomaster: one(tblProductSubCategoryMasterInStomaster, {
		fields: [tblSalesOrderDtlInStoentries.subCategoryId],
		references: [tblProductSubCategoryMasterInStomaster.subCategoryId]
	}),
	tblProductMasterInStomaster: one(tblProductMasterInStomaster, {
		fields: [tblSalesOrderDtlInStoentries.productId],
		references: [tblProductMasterInStomaster.productId]
	}),
}));

export const tblTaxInvoiceFilesUploadInStoentriesRelations = relations(tblTaxInvoiceFilesUploadInStoentries, ({one}) => ({
	tblTaxInvoiceHdrInStoentry: one(tblTaxInvoiceHdrInStoentries, {
		fields: [tblTaxInvoiceFilesUploadInStoentries.taxInvoiceRefNo],
		references: [tblTaxInvoiceHdrInStoentries.taxInvoiceRefNo]
	}),
}));

export const tblEmployeeMasterInStomasterRelations = relations(tblEmployeeMasterInStomaster, ({one}) => ({
	tblDepartmentMasterInStomaster: one(tblDepartmentMasterInStomaster, {
		fields: [tblEmployeeMasterInStomaster.department],
		references: [tblDepartmentMasterInStomaster.departmentId]
	}),
}));

export const tblDepartmentMasterInStomasterRelations = relations(tblDepartmentMasterInStomaster, ({many}) => ({
	tblEmployeeMasterInStomasters: many(tblEmployeeMasterInStomaster),
}));

export const tblJournalHdrInStoentriesRelations = relations(tblJournalHdrInStoentries, ({one, many}) => ({
	tblCompanyMasterInStomaster: one(tblCompanyMasterInStomaster, {
		fields: [tblJournalHdrInStoentries.companyId],
		references: [tblCompanyMasterInStomaster.companyId]
	}),
	tblJournalDtlInStoentries: many(tblJournalDtlInStoentries),
}));

export const tblJournalDtlInStoentriesRelations = relations(tblJournalDtlInStoentries, ({one}) => ({
	tblJournalHdrInStoentry: one(tblJournalHdrInStoentries, {
		fields: [tblJournalDtlInStoentries.journalRefNo],
		references: [tblJournalHdrInStoentries.journalRefNo]
	}),
	tblAccountsLedgerMasterInStomaster: one(tblAccountsLedgerMasterInStomaster, {
		fields: [tblJournalDtlInStoentries.ledgerId],
		references: [tblAccountsLedgerMasterInStomaster.ledgerId]
	}),
}));

export const tblTrialBalanceHdrInStoentriesRelations = relations(tblTrialBalanceHdrInStoentries, ({one, many}) => ({
	tblCompanyMasterInStomaster: one(tblCompanyMasterInStomaster, {
		fields: [tblTrialBalanceHdrInStoentries.companyId],
		references: [tblCompanyMasterInStomaster.companyId]
	}),
	tblTrialBalanceDtlInStoentries: many(tblTrialBalanceDtlInStoentries),
}));

export const tblTrialBalanceDtlInStoentriesRelations = relations(tblTrialBalanceDtlInStoentries, ({one}) => ({
	tblTrialBalanceHdrInStoentry: one(tblTrialBalanceHdrInStoentries, {
		fields: [tblTrialBalanceDtlInStoentries.tbRefNo],
		references: [tblTrialBalanceHdrInStoentries.tbRefNo]
	}),
	tblAccountsLedgerMasterInStomaster: one(tblAccountsLedgerMasterInStomaster, {
		fields: [tblTrialBalanceDtlInStoentries.ledgerId],
		references: [tblAccountsLedgerMasterInStomaster.ledgerId]
	}),
}));

export const tblExchangeRateUsageLogInStomasterRelations = relations(tblExchangeRateUsageLogInStomaster, ({one}) => ({
	tblCompanyMasterInStomaster: one(tblCompanyMasterInStomaster, {
		fields: [tblExchangeRateUsageLogInStomaster.companyId],
		references: [tblCompanyMasterInStomaster.companyId]
	}),
	tblExchangeRateMasterInStomaster: one(tblExchangeRateMasterInStomaster, {
		fields: [tblExchangeRateUsageLogInStomaster.exchangeRateSno],
		references: [tblExchangeRateMasterInStomaster.sno]
	}),
	tblMultiCurrencyTransactionsInStomaster: one(tblMultiCurrencyTransactionsInStomaster, {
		fields: [tblExchangeRateUsageLogInStomaster.transactionId],
		references: [tblMultiCurrencyTransactionsInStomaster.transactionId]
	}),
}));

export const tblMultiCurrencyTransactionsInStomasterRelations = relations(tblMultiCurrencyTransactionsInStomaster, ({one, many}) => ({
	tblExchangeRateUsageLogInStomasters: many(tblExchangeRateUsageLogInStomaster),
	tblCompanyMasterInStomaster: one(tblCompanyMasterInStomaster, {
		fields: [tblMultiCurrencyTransactionsInStomaster.companyId],
		references: [tblCompanyMasterInStomaster.companyId]
	}),
	tblCurrencyMasterInStomaster_transactionCurrencyId: one(tblCurrencyMasterInStomaster, {
		fields: [tblMultiCurrencyTransactionsInStomaster.transactionCurrencyId],
		references: [tblCurrencyMasterInStomaster.currencyId],
		relationName: "tblMultiCurrencyTransactionsInStomaster_transactionCurrencyId_tblCurrencyMasterInStomaster_currencyId"
	}),
	tblCurrencyMasterInStomaster_baseCurrencyId: one(tblCurrencyMasterInStomaster, {
		fields: [tblMultiCurrencyTransactionsInStomaster.baseCurrencyId],
		references: [tblCurrencyMasterInStomaster.currencyId],
		relationName: "tblMultiCurrencyTransactionsInStomaster_baseCurrencyId_tblCurrencyMasterInStomaster_currencyId"
	}),
	tblRealizedGainLossInStomasters: many(tblRealizedGainLossInStomaster),
	tblUnrealizedGainLossInStomasters: many(tblUnrealizedGainLossInStomaster),
}));

export const tblCompanyBaseCurrencyInStomasterRelations = relations(tblCompanyBaseCurrencyInStomaster, ({one}) => ({
	tblCompanyMasterInStomaster: one(tblCompanyMasterInStomaster, {
		fields: [tblCompanyBaseCurrencyInStomaster.companyId],
		references: [tblCompanyMasterInStomaster.companyId]
	}),
	tblCurrencyMasterInStomaster: one(tblCurrencyMasterInStomaster, {
		fields: [tblCompanyBaseCurrencyInStomaster.baseCurrencyId],
		references: [tblCurrencyMasterInStomaster.currencyId]
	}),
}));

export const tblRealizedGainLossInStomasterRelations = relations(tblRealizedGainLossInStomaster, ({one}) => ({
	tblCompanyMasterInStomaster: one(tblCompanyMasterInStomaster, {
		fields: [tblRealizedGainLossInStomaster.companyId],
		references: [tblCompanyMasterInStomaster.companyId]
	}),
	tblMultiCurrencyTransactionsInStomaster: one(tblMultiCurrencyTransactionsInStomaster, {
		fields: [tblRealizedGainLossInStomaster.transactionId],
		references: [tblMultiCurrencyTransactionsInStomaster.transactionId]
	}),
}));

export const tblUnrealizedGainLossInStomasterRelations = relations(tblUnrealizedGainLossInStomaster, ({one}) => ({
	tblCompanyMasterInStomaster: one(tblCompanyMasterInStomaster, {
		fields: [tblUnrealizedGainLossInStomaster.companyId],
		references: [tblCompanyMasterInStomaster.companyId]
	}),
	tblMultiCurrencyTransactionsInStomaster: one(tblMultiCurrencyTransactionsInStomaster, {
		fields: [tblUnrealizedGainLossInStomaster.transactionId],
		references: [tblMultiCurrencyTransactionsInStomaster.transactionId]
	}),
}));

export const tblPurchaseOrderAdditionalCostDetailsInStoentriesRelations = relations(tblPurchaseOrderAdditionalCostDetailsInStoentries, ({one}) => ({
	tblAdditionalCostTypeMasterInStomaster: one(tblAdditionalCostTypeMasterInStomaster, {
		fields: [tblPurchaseOrderAdditionalCostDetailsInStoentries.additionalCostTypeId],
		references: [tblAdditionalCostTypeMasterInStomaster.additionalCostTypeId]
	}),
}));