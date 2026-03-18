"use client";

import MasterCrudPage from "@/components/MasterCrudPage";

export default function SalesOrdersPage() {
  return <MasterCrudPage
    domain="sales-orders" 
    title="Sales Orders" 
    description="Manage your sales orders" 
    idPrefix="SO" 
    fields={[
      { key: "salesOrderRefNo", label: "Sales Order Ref No", type: "text", required: true },
      { key: "salesOrderDate", label: "Sales Order Date", type: "date", required: true },
      { key: "company", label: "Company", type: "text" },
      { key: "store", label: "Store", type: "text" },
      { key: "customer", label: "Customer", type: "text", required: true },
      { key: "billingLocation", label: "Billing Location", type: "text" },
      { key: "salesPerson", label: "Sales Person", type: "text" },
      { key: "creditLimitAmount", label: "Credit Limit Amount", type: "number" },
      { key: "creditLimitDays", label: "Credit Limit Days", type: "number" },
      { key: "outstandingAmount", label: "Outstanding Amount", type: "number" },
      { key: "currency", label: "Currency", type: "select", options: ["TZS", "USD", "EUR"] },
      { key: "exchangeRate", label: "Exchange Rate", type: "number" },
      { key: "totalProductAmount", label: "Total Product Amount", type: "number" },
      { key: "vatAmount", label: "VAT Amount", type: "number" },
      { key: "finalSalesAmount", label: "Final Sales Amount", type: "number" },
      { key: "remarks", label: "Remarks", type: "textarea" },
      { key: "status", label: "Status", type: "select", required: true, options: ["Draft", "Confirmed", "Delivered", "Invoiced", "Cancelled"] },
    ]} 
    initialData={[
      { id: "SO001", salesOrderRefNo: "SO/03/001", salesOrderDate: "2024-03-01", company: "AgroTanzania Ltd", store: "Dar es Salaam Main Warehouse", customer: "Metro Foods Inc", billingLocation: "Dar es Salaam HQ", salesPerson: "James Kileo", creditLimitAmount: 500000, creditLimitDays: 30, outstandingAmount: 0, currency: "TZS", exchangeRate: 1, totalProductAmount: 7900000, vatAmount: 1422000, finalSalesAmount: 9322000, remarks: "", status: "Delivered" },
    ]} 
    columns={[
      { key: "salesOrderRefNo", label: "SO No" }, 
      { key: "salesOrderDate", label: "Date" }, 
      { key: "customer", label: "Customer" }, 
      { key: "finalSalesAmount", label: "Amount" }, 
      { key: "salesPerson", label: "Sales Person" }, 
      { key: "status", label: "Status" },
    ]} 
    customAddUrl="/sales-orders/create"
    customEditUrl={(id) => `/sales-orders/create?id=${id}`}
  />;
}
