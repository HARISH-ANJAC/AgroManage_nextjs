"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { usePurchaseBookingStore } from "@/hooks/usePurchaseBookingStore";

export default function PurchaseBookingPage() {
  const { bookings, addBooking, updateBooking, deleteBooking } = usePurchaseBookingStore();

  return <MasterCrudPage
    domain="purchase-booking" 
    title="Purchase Invoices" 
    description="3-Way Matching: PO → GRN → Invoice. Blocked if mismatch." 
    idPrefix="PBI" 
    customAddUrl="/purchase-booking/create"
    customEditUrl={(id) => `/purchase-booking/create?id=${id}`}
    customStoreOverrides={{
      data: bookings.map((b: any) => {
        const currency = b.header?.currency || b.currency || "TZS";
        return {
          ...b,
          formattedAmount: `${currency} ${(b.header?.productAmount || b.productAmount || 0).toLocaleString()}`,
          formattedVat: `${currency} ${(b.header?.totalVatAmount || b.totalVat || 0).toLocaleString()}`,
          formattedTotal: `${currency} ${(b.header?.finalAmount || b.finalAmount || 0).toLocaleString()}`,
        };
      }),
      add: addBooking,
      update: (item: any) => updateBooking(item.id, item),
      remove: deleteBooking
    }}
    fields={[
      { key: "purchaseInvoiceRefNo", label: "PI Ref", type: "text", required: true },
      { key: "invoiceNo", label: "Supplier Invoice No", type: "text", required: true },
      { key: "invoiceDate", label: "Invoice Date", type: "date", required: true },
      { key: "poRefNo", label: "PO Reference", type: "text", required: true },
      { key: "grnRefNo", label: "GRN Reference", type: "text", required: true },
      { key: "supplier", label: "Supplier", type: "text" },
      { key: "status", label: "Status", type: "select", required: true, options: ["Pending", "Approved"] },
    ]}
    initialData={[]}
    columns={[
      { key: "purchaseInvoiceRefNo", label: "PI Ref" },
      { key: "invoiceNo", label: "Invoice No" },
      { key: "invoiceDate", label: "Date" },
      { key: "poRefNo", label: "PO Ref" },
      { key: "grnRefNo", label: "GRN Ref" },
      { key: "supplier", label: "Supplier" },
      { key: "formattedAmount", label: "Amount" },
      { key: "formattedVat", label: "VAT" },
      { key: "formattedTotal", label: "Total" },
      { key: "status", label: "Status" },
    ]} 
  />;
}
