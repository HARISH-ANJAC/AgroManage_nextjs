import express from "express";
import authRoute from "./authRoute.js";
import { authenticate } from "../Middleware/authMiddleware.js";


import categoryRoute from "./categoryRoute.js";
import subcategoryRoute from "./subcategoryRoute.js";
import productRoute from "./productRoute.js";
import uomRoute from "./uomRoute.js";
import bankRoute from "./bankRoute.js";
import currencyRoute from "./currencyRoute.js";
import vatRoute from "./vatRoute.js";
import paymentTermRoute from "./paymentTermRoute.js";
import countryRoute from "./countryRoute.js";
import roleRoute from "./roleRoute.js";
import companyRoute from "./companyRoute.js";
import storeRoute from "./storeRoute.js";
import financialYearRoute from "./financialYearRoute.js";
import locationRoute from "./locationRoute.js";
import { regionRoute } from "./regionRoute.js";
import { districtRoute } from "./districtRoute.js";
import { billingLocationRoute } from "./billingLocationRoute.js";
import { exchangeRateRoute } from "./exchangeRateRoute.js";
import { paymentModeRoute } from "./paymentModeRoute.js";
import { customerPaymentModeRoute } from "./customerPaymentModeRoute.js";
import { additionalCostTypeRoute } from "./additionalCostTypeRoute.js";
import { ledgerGroupRoute } from "./ledgerGroupRoute.js";
import { accountHeadRoute } from "./accountHeadRoute.js";
import { ledgerMasterRoute } from "./ledgerMasterRoute.js";
import { salesPersonRoute } from "./salesPersonRoute.js";
import { supplierRoute } from "./supplierRoute.js";
import { customerRoute } from "./customerRoute.js";
import { userRoute } from "./userRoute.js";
import { companyBankAccountRoute } from "./companyBankAccountRoute.js";
import { userStoreMappingRoute } from "./userStoreMappingRoute.js";
import { productCompanyCategoryMappingRoute } from "./productCompanyCategoryMappingRoute.js";
import { productOpeningStockRoute } from "./productOpeningStockRoute.js";
import { storeProductMinimumStockRoute } from "./storeProductMinimumStockRoute.js";

import { grnRoute } from "./grnRoute.js";
import { supplierInvoiceRoute } from "./supplierInvoiceRoute.js";
import { salesOrderRoute } from "./salesOrderRoute.js";
import { expenseRoute } from "./expenseRoute.js";
import { customerReceiptRoute } from "./customerReceiptRoute.js";
import { deliveryNoteRoute } from "./deliveryNoteRoute.js";
import { taxInvoiceRoute } from "./taxInvoiceRoute.js";

const Router = express.Router();


Router.use("/auth", authRoute);

// Apply authentication middleware to all subsequent routes
Router.use(authenticate);

// Restrict deletions only to Admin
Router.use((req, res, next) => {
    if ((req.method === 'DELETE' || (req.method === 'POST' && req.path.includes('/bulk-delete'))) && req.user?.role !== 'Admin') {
        return res.status(403).json({ msg: `Access denied. ${req.user?.role} cannot perform deletions.` });
    }
    next();
});

Router.use("/categories", categoryRoute);
Router.use("/subcategories", subcategoryRoute);
Router.use("/products", productRoute);
Router.use("/uom", uomRoute);
Router.use("/banks", bankRoute);
Router.use("/currencies", currencyRoute);
Router.use("/vat", vatRoute);
Router.use("/payment-terms", paymentTermRoute);
Router.use("/countries", countryRoute);
Router.use("/roles", roleRoute);
Router.use("/companies", companyRoute);
Router.use("/stores", storeRoute);
Router.use("/financial-years", financialYearRoute);
Router.use("/locations", locationRoute);
Router.use("/regions", regionRoute);
Router.use("/districts", districtRoute);
Router.use("/billing-locations", billingLocationRoute);
Router.use("/exchange-rate", exchangeRateRoute);
Router.use("/payment-modes", paymentModeRoute);
Router.use("/customer-payment-modes", customerPaymentModeRoute);
Router.use("/additional-cost-types", additionalCostTypeRoute);
Router.use("/ledger-groups", ledgerGroupRoute);
Router.use("/account-heads", accountHeadRoute);
Router.use("/ledger-master", ledgerMasterRoute);
Router.use("/sales-persons", salesPersonRoute);
Router.use("/suppliers", supplierRoute);
Router.use("/customers", customerRoute);
Router.use("/users", userRoute);
Router.use("/company-bank-accounts", companyBankAccountRoute);
Router.use("/user-store-mappings", userStoreMappingRoute);
Router.use("/product-company-category-mappings", productCompanyCategoryMappingRoute);
Router.use("/product-opening-stocks", productOpeningStockRoute);
Router.use("/store-product-min-stocks", storeProductMinimumStockRoute);
// Router.use("/purchase-orders", purchaseOrderRoute);
Router.use("/goods-receipts", grnRoute);
Router.use("/supplier-invoices", supplierInvoiceRoute);
Router.use("/sales-orders", salesOrderRoute);
Router.use("/expenses", expenseRoute);
Router.use("/customer-receipts", customerReceiptRoute);
Router.use("/delivery-notes", deliveryNoteRoute);
Router.use("/tax-invoices", taxInvoiceRoute);

export default Router;