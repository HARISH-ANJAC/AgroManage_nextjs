import express from "express";
import authRoute from "./authRoute.js";
import { authenticate } from "../Middleware/authMiddleware.js";

import roleRoute from "./roleRoute.js";
import { userRoute } from "./userRoute.js";
import { purchaseOrderRoute } from "./purchaseOrderRoute.js";
import { masterRoute } from "./masterRoute.js";

// Import new routes
import { goodsReceiptRoute } from "./goodsReceiptRoute.js";
import { purchaseInvoiceRoute } from "./purchaseInvoiceRoute.js";
import { salesOrderRoute } from "./salesOrderRoute.js";
import { deliveryNoteRoute } from "./deliveryNoteRoute.js";
import { taxInvoiceRoute } from "./taxInvoiceRoute.js";
import { customerReceiptRoute } from "./customerReceiptRoute.js";
import { expenseRoute } from "./expenseRoute.js";
import { purchaseApprovalRoute } from "./purchaseApprovalRoute.js";

const Router = express.Router();

Router.use("/auth", authRoute);

// Apply authentication middleware to all subsequent routes
Router.use(authenticate);

// Restrict deletions only to Admin
Router.use((req, res, next) => {
    const isDelete = req.method === 'DELETE' || (req.method === 'POST' && req.path.includes('/bulk-delete'));
    if (isDelete && !['Admin', 'Super Admin'].includes(req.user?.role || "")) {
        return res.status(403).json({ msg: `Access denied. ${req.user?.role} cannot perform deletions.` });
    }
    next();
});

Router.use("/roles", roleRoute);
Router.use("/users", userRoute);

// Use defined flow routes
Router.use("/purchase-orders", purchaseOrderRoute);
Router.use("/purchase-approvals", purchaseApprovalRoute);
Router.use("/goods-receipts", goodsReceiptRoute);
Router.use("/purchase-invoices", purchaseInvoiceRoute);

Router.use("/sales-orders", salesOrderRoute);
Router.use("/delivery-notes", deliveryNoteRoute);
Router.use("/sales-invoices", taxInvoiceRoute);
Router.use("/customer-receipts", customerReceiptRoute);

Router.use("/expenses", expenseRoute);

// Master routes are top-level because domain names are unique (companies, stores, etc.)
Router.use("/", masterRoute);

export default Router;