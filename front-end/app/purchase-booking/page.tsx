"use client";

import MasterCrudPage from "@/components/MasterCrudPage";

export default function PurchaseBookingPage() {
  return <MasterCrudPage
    domain="purchase-booking" title="Purchase Invoices" description="Manage your purchase invoices" idPrefix="PBI" fields={[
    { key: "purchaseInvoiceRefNo", label: "Purchase Invoice Ref No", type: "text", required: true },
    { key: "company", label: "Company", type: "text" },
    { key: "invoiceNo", label: "Supplier Invoice No", type: "text", required: true },
    { key: "invoiceDate", label: "Invoice Date", type: "date", required: true },
    { key: "poRefNo", label: "PO Reference No", type: "text", required: true },
    { key: "purchaseType", label: "Purchase Type", type: "select", options: ["Local Purchase", "Import"] },
    { key: "supplier", label: "Supplier", type: "text" },
    { key: "store", label: "Store", type: "text" },
    { key: "paymentTerm", label: "Payment Term", type: "text" },
    { key: "modeOfPayment", label: "Mode of Payment", type: "text" },
    { key: "currency", label: "Currency", type: "select", options: ["TZS", "USD", "EUR"] },
    { key: "priceTerms", label: "Price Terms", type: "text" },
    { key: "productAmount", label: "Product Amount", type: "number" },
    { key: "totalAdditionalCost", label: "Total Additional Cost", type: "number" },
    { key: "totalVat", label: "Total VAT Amount", type: "number" },
    { key: "finalAmount", label: "Final Invoice Amount", type: "number" },
    { key: "exchangeRate", label: "Exchange Rate", type: "number" },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "status", label: "Status", type: "select", required: true, options: ["Draft", "Submitted", "Approved", "Rejected"] },
  ]} initialData={[
    { id: "PBI001", purchaseInvoiceRefNo: "PI/03/001", company: "AgroTanzania Ltd", invoiceNo: "INV-2024-001", invoiceDate: "2024-02-15", poRefNo: "PO/MA/02/001", purchaseType: "Local Purchase", supplier: "Kilimo Bora Suppliers", store: "Dar es Salaam Main Warehouse", paymentTerm: "Net 30 Days", modeOfPayment: "Bank Transfer", currency: "USD", priceTerms: "FOB", productAmount: 50000, totalAdditionalCost: 2500, totalVat: 4730, finalAmount: 57230, exchangeRate: 2650, remarks: "", status: "Approved" },
  ]} columns={[
    { key: "purchaseInvoiceRefNo", label: "Ref No" }, { key: "invoiceNo", label: "Invoice" }, { key: "poRefNo", label: "PO Ref" }, { key: "supplier", label: "Supplier" }, { key: "finalAmount", label: "Amount" }, { key: "status", label: "Status" },
  ]} />;
}

