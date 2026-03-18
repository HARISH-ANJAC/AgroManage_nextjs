"use client";

import MasterCrudPage from "@/components/MasterCrudPage";

export default function ExpensesPage() {
  return <MasterCrudPage
    domain="expenses" title="Expenses" description="Manage your expenses" idPrefix="EXP" fields={[
    { key: "expenseRefNo", label: "Expense Ref No", type: "text", required: true },
    { key: "expenseDate", label: "Expense Date", type: "date", required: true },
    { key: "company", label: "Company", type: "text" },
    { key: "expenseAgainst", label: "Expense Against", type: "select", options: ["Purchase Order", "Sales Order", "General"] },
    { key: "poRefNo", label: "PO Reference", type: "text", required: true },
    { key: "accountHead", label: "Account Head", type: "select", required: true, options: ["Transportation", "Loading/Offloading", "Accommodation", "Travel Expenses", "Fines & Penalties", "Miscellaneous"] },
    { key: "expenseSupplier", label: "Expense Supplier/Provider", type: "text" },
    { key: "expenseType", label: "Expense Type", type: "text" },
    { key: "traEfdReceiptNo", label: "TRA EFD Receipt No", type: "text", required: true },
    { key: "currency", label: "Currency", type: "select", options: ["TZS", "USD", "EUR"] },
    { key: "exchangeRate", label: "Exchange Rate", type: "number" },
    { key: "totalExpenseAmount", label: "Total Expense Amount", type: "number", required: true },
    { key: "totalExpenseAmountLC", label: "Total Amount (Local Currency)", type: "number" },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "status", label: "Status", type: "select", required: true, options: ["Pending", "Approved", "Rejected"] },
  ]} initialData={[
    { id: "EXP001", expenseRefNo: "EXP/03/001", expenseDate: "2024-02-12", company: "AgroTanzania Ltd", expenseAgainst: "Purchase Order", poRefNo: "PO/MA/02/001", accountHead: "Transportation", expenseSupplier: "Speedy Logistics", expenseType: "Transport", traEfdReceiptNo: "EFD-001234", currency: "USD", exchangeRate: 2650, totalExpenseAmount: 2500, totalExpenseAmountLC: 6625000, remarks: "", status: "Approved" },
    { id: "EXP002", expenseRefNo: "EXP/03/002", expenseDate: "2024-02-12", company: "AgroTanzania Ltd", expenseAgainst: "Purchase Order", poRefNo: "PO/MA/02/001", accountHead: "Loading/Offloading", expenseSupplier: "Local Labour Co", expenseType: "Loading", traEfdReceiptNo: "EFD-001235", currency: "USD", exchangeRate: 2650, totalExpenseAmount: 500, totalExpenseAmountLC: 1325000, remarks: "", status: "Approved" },
  ]} columns={[
    { key: "expenseRefNo", label: "Ref No" }, { key: "accountHead", label: "Account" }, { key: "poRefNo", label: "PO Ref" }, { key: "totalExpenseAmount", label: "Amount" }, { key: "traEfdReceiptNo", label: "EFD Receipt" }, { key: "status", label: "Status" },
  ]} />;
}

