"use client";

import MasterCrudPage from "@/components/MasterCrudPage";

export default function CustomerReceiptsPage() {
  return <MasterCrudPage
    domain="customer-receipts" title="Customer Receipts" description="Manage your customer receipts" idPrefix="CR" fields={[
    { key: "receiptRefNo", label: "Receipt Ref No", type: "text", required: true },
    { key: "receiptDate", label: "Receipt Date", type: "date", required: true },
    { key: "paymentType", label: "Payment Type", type: "select", options: ["Full Payment", "Partial Payment", "Advance"] },
    { key: "company", label: "Company", type: "text" },
    { key: "customer", label: "Customer", type: "text", required: true },
    { key: "paymentMode", label: "Payment Mode", type: "select", options: ["Bank Transfer", "Cheque", "Cash", "Mobile Money"] },
    { key: "crBankCash", label: "CR Bank/Cash", type: "text" },
    { key: "crAccount", label: "CR Account", type: "text" },
    { key: "drBankCash", label: "DR Bank/Cash", type: "text" },
    { key: "transactionRefNo", label: "Transaction Ref No", type: "text" },
    { key: "transactionDate", label: "Transaction Date", type: "date" },
    { key: "currency", label: "Currency", type: "select", options: ["TZS", "USD", "EUR"] },
    { key: "receiptAmount", label: "Receipt Amount", type: "number", required: true },
    { key: "exchangeRate", label: "Exchange Rate", type: "number" },
    { key: "receiptAmountLC", label: "Amount (Local Currency)", type: "number" },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "status", label: "Status", type: "select", required: true, options: ["Draft", "Submitted", "Approved", "Rejected"] },
  ]} initialData={[
    { id: "CR001", receiptRefNo: "CR/03/001", receiptDate: "2024-03-20", paymentType: "Full Payment", company: "AgroTanzania Ltd", customer: "Metro Foods Inc", paymentMode: "Bank Transfer", crBankCash: "CRDB Bank", crAccount: "0150-123456789", drBankCash: "", transactionRefNo: "TXN-2024-001", transactionDate: "2024-03-20", currency: "TZS", receiptAmount: 9322000, exchangeRate: 1, receiptAmountLC: 9322000, remarks: "", status: "Approved" },
  ]} columns={[
    { key: "receiptRefNo", label: "Receipt No" }, { key: "receiptDate", label: "Date" }, { key: "customer", label: "Customer" }, { key: "receiptAmount", label: "Amount" }, { key: "paymentMode", label: "Mode" }, { key: "status", label: "Status" },
  ]} />;
}

