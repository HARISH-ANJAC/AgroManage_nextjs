"use client";

import MasterCrudPage from "@/components/MasterCrudPage";

export default function SalesInvoicesPage() {
  return <MasterCrudPage
    domain="sales-invoices" title="Sales Invoices (Tax Invoice)" description="Manage your sales invoices" idPrefix="INV" fields={[
    { key: "taxInvoiceRefNo", label: "Tax Invoice Ref No", type: "text", required: true },
    { key: "invoiceDate", label: "Invoice Date", type: "date", required: true },
    { key: "company", label: "Company", type: "text" },
    { key: "fromStore", label: "From Store", type: "text" },
    { key: "invoiceType", label: "Invoice Type", type: "select", options: ["Tax Invoice", "Proforma"] },
    { key: "deliveryNoteRefNo", label: "Delivery Note Ref", type: "text" },
    { key: "customer", label: "Customer", type: "text", required: true },
    { key: "currency", label: "Currency", type: "select", options: ["TZS", "USD", "EUR"] },
    { key: "exchangeRate", label: "Exchange Rate", type: "number" },
    { key: "totalProductAmount", label: "Total Product Amount", type: "number" },
    { key: "vatAmount", label: "VAT Amount", type: "number" },
    { key: "finalSalesAmount", label: "Final Sales Amount", type: "number" },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "status", label: "Status", type: "select", required: true, options: ["Draft", "Sent", "Paid", "Overdue", "Cancelled"] },
  ]} initialData={[
    { id: "INV001", taxInvoiceRefNo: "SI/03/001", invoiceDate: "2024-03-16", company: "AgroTanzania Ltd", fromStore: "Dar es Salaam Main Warehouse", invoiceType: "Tax Invoice", deliveryNoteRefNo: "DN/03/001", customer: "Metro Foods Inc", currency: "TZS", exchangeRate: 1, totalProductAmount: 7900000, vatAmount: 1422000, finalSalesAmount: 9322000, remarks: "", status: "Paid" },
  ]} columns={[
    { key: "taxInvoiceRefNo", label: "Invoice" }, { key: "invoiceDate", label: "Date" }, { key: "customer", label: "Customer" }, { key: "finalSalesAmount", label: "Amount" }, { key: "invoiceType", label: "Type" }, { key: "status", label: "Status" },
  ]} />;
}

