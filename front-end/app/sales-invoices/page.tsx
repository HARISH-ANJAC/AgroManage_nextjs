"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useSalesInvoiceStore } from "@/hooks/useSalesInvoiceStore";
import { useDeliveryNoteStore } from "@/hooks/useDeliveryNoteStore";
import { useCompanies, useStores, useCustomers } from "@/hooks/useStoreData";

export default function SalesInvoicesPage() {
  const { invoices, addInvoice, updateInvoice, deleteInvoice } = useSalesInvoiceStore();
  const { notes: deliveryNotes } = useDeliveryNoteStore();
  const { data: companies } = useCompanies();
  const { data: stores } = useStores();
  const { data: customers } = useCustomers();

  return <MasterCrudPage
    domain="sales-invoices" 
    title="Sales Invoices (Tax Invoice)" 
    description="Manage your sales invoices" 
    idPrefix="INV" 
    customStoreOverrides={{
      data: invoices,
      add: addInvoice,
      update: (item: any) => updateInvoice(item.id, item),
      remove: deleteInvoice
    }}
    fields={[
      { key: "taxInvoiceRefNo", label: "Tax Invoice Ref No", type: "text", required: true },
      { key: "invoiceDate", label: "Invoice Date", type: "date", required: true },
      { 
        key: "company", 
        label: "Company", 
        type: "select", 
        options: companies.map((c: any) => ({ label: c.companyName, value: c.companyName })) 
      },
      { 
        key: "fromStore", 
        label: "From Store", 
        type: "select", 
        options: stores.map((s: any) => ({ label: s.storeName, value: s.storeName }))
      },
      { key: "invoiceType", label: "Invoice Type", type: "select", options: ["Tax Invoice", "Proforma"] },
      { 
        key: "deliveryNoteRefNo", 
        label: "Delivery Note Ref", 
        type: "select", 
        options: deliveryNotes.map((dn: any) => ({ 
          label: dn.header?.deliveryNoteRefNo || dn.deliveryNoteRefNo || dn.id, 
          value: dn.header?.deliveryNoteRefNo || dn.deliveryNoteRefNo || dn.id 
        })) 
      },
      { 
        key: "customer", 
        label: "Customer", 
        type: "select", 
        options: customers.map((c: any) => ({ label: c.customerName, value: c.customerName }))
      },
      { key: "currency", label: "Currency", type: "select", options: ["TZS", "USD", "EUR"] },
      { key: "exchangeRate", label: "Exchange Rate", type: "number" },
      { key: "totalProductAmount", label: "Total Product Amount", type: "number" },
      { key: "vatAmount", label: "VAT Amount", type: "number" },
      { key: "finalSalesAmount", label: "Final Sales Amount", type: "number" },
      { key: "remarks", label: "Remarks", type: "textarea" },
      { key: "status", label: "Status", type: "select", required: true, options: ["Draft", "Sent", "Paid", "Overdue", "Cancelled"] },
    ]} 
    initialData={[]} 
    columns={[
      { key: "header.invoiceRefNo", label: "Invoice Ref" }, 
      { key: "header.invoiceDate", label: "Date" }, 
      { key: "header.dnRefNo", label: "DN Ref" }, 
      { key: "header.customer", label: "Customer" }, 
      { key: "header.totalAmount", label: "Amount" }, 
      { key: "header.totalVat", label: "VAT" }, 
      { key: "header.grandTotal", label: "Total" }, 
      { key: "header.status", label: "Status" },
    ]} 
    customAddUrl="/sales-invoices/create"
    customEditUrl={(id) => `/sales-invoices/create?id=${id}`}
  />;
}
