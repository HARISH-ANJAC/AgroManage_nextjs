"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useCustomerReceiptStore } from "@/hooks/useCustomerReceiptStore";
import { useCompanies, useCustomers } from "@/hooks/useStoreData";

export default function CustomerReceiptsPage() {
  const { receipts, addReceipt, updateReceipt, deleteReceipt } = useCustomerReceiptStore();
  const { data: companies = [] } = useCompanies();
  const { data: customers = [] } = useCustomers();

  return <MasterCrudPage
    domain="customer-receipts" 
    title="Customer Receipts" 
    description="Manage your customer receipts" 
    idPrefix="CR" 
    customStoreOverrides={{
      data: receipts,
      add: addReceipt,
      update: (item: any) => updateReceipt(item.id, item),
      remove: deleteReceipt
    }}
    fields={[
      { key: "header.receiptRefNo", label: "Receipt Ref No", type: "text", required: true },
      { key: "header.receiptDate", label: "Receipt Date", type: "date", required: true },
      { key: "header.paymentType", label: "Payment Type", type: "select", options: ["Full Payment", "Partial Payment", "Advance"] },
      { 
        key: "header.company", 
        label: "Company", 
        type: "select", 
        options: companies.map((c: any) => ({ label: c.companyName, value: c.companyName })) 
      },
      { 
        key: "header.customer", 
        label: "Customer", 
        type: "select", 
        options: customers.map((c: any) => ({ label: c.customerName, value: c.customerName }))
      },
      { key: "header.paymentMode", label: "Payment Mode", type: "select", options: ["Bank Transfer", "Cheque", "Cash", "Mobile Money"] },
      { key: "header.crBankCash", label: "CR Bank/Cash", type: "text" },
      { key: "header.crAccount", label: "CR Account", type: "text" },
      { key: "header.drBankCash", label: "DR Bank/Cash", type: "text" },
      { key: "header.transactionRefNo", label: "Transaction Ref No", type: "text" },
      { key: "header.transactionDate", label: "Transaction Date", type: "date" },
      { key: "header.currency", label: "Currency", type: "select", options: ["TZS", "USD", "EUR"] },
      { key: "header.receiptAmount", label: "Receipt Amount", type: "number", required: true },
      { key: "header.status", label: "Status", type: "select", required: true, options: ["Draft", "Submitted", "Approved", "Rejected"] },
    ]} 
    initialData={[]} 
    columns={[
      { key: "header.receiptRefNo", label: "Receipt Ref" }, 
      { key: "header.receiptDate", label: "Date" }, 
      { key: "header.customer", label: "Customer" }, 
      { key: "header.paymentMode", label: "Payment Mode" }, 
      { key: "header.crBankCash", label: "Bank" }, 
      { key: "header.transactionRefNo", label: "Txn Ref" },
      { key: "header.receiptAmount", label: "Amount" }, 
      { key: "header.status", label: "Status" },
    ]} 
    customAddUrl="/customer-receipts/create"
    customEditUrl={(id) => `/customer-receipts/create?id=${id}`}
  />;
}
