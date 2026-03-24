'use client';

import MasterCrudPage from "@/components/MasterCrudPage";
import { 
  useCompanies, 
  useStores, 
  useSuppliers 
} from "@/hooks/useStoreData";
import { useSupplierInvoiceStore } from "@/hooks/useSupplierInvoiceStore";
import { usePurchaseOrderStore } from "@/hooks/usePurchaseOrderStore";
import { useGoodsReceiptStore } from "@/hooks/useGoodsReceiptStore";

export default function SupplierInvoicesPage() {
  const { invoices, addInvoice, updateInvoice, deleteInvoice } = useSupplierInvoiceStore();
  const { orders: pos } = usePurchaseOrderStore();
  const { grns } = useGoodsReceiptStore();
  const { data: companies } = useCompanies();
  const { data: stores } = useStores();
  const { data: suppliers } = useSuppliers();

  return <MasterCrudPage
    domain="supplier-invoices" 
    title="Supplier Invoices" 
    description="Process supplier invoices with three-way matching validation (SOP Step 3)" 
    idPrefix="INV" 
    customStoreOverrides={{
      data: invoices,
      add: addInvoice,
      update: (item: any) => updateInvoice(item.id, item),
      remove: deleteInvoice
    }}
    fields={[
      { key: "invoiceRefNo", label: "internal Ref No", type: "text", required: true },
      { key: "invoiceNo", label: "Supplier Invoice No *", type: "text", required: true },
      { key: "invoiceDate", label: "Invoice Date *", type: "date", required: true },
      { 
        key: "companyId", 
        label: "Company", 
        type: "select", 
        options: companies.map((c: any) => ({ label: c.companyName, value: c.id })) 
      },
      { 
        key: "storeId", 
        label: "Store", 
        type: "select", 
        options: stores.map((s: any) => ({ label: s.storeName, value: s.id }))
      },
      { 
        key: "supplierId", 
        label: "Supplier", 
        type: "select", 
        options: suppliers.map((s: any) => ({ label: s.supplierName, value: s.id }))
      },
      { 
        key: "poRefNo", 
        label: "PO Reference (3-Way Matching)", 
        type: "select", 
        options: pos.map((p: any) => ({ 
          label: p.header?.poRefNo || p.poRefNo || p.id, 
          value: p.header?.poRefNo || p.poRefNo || p.id 
        })) 
      },
      { 
        key: "grnRefNo", 
        label: "GRN Reference (3-Way Matching)", 
        type: "select", 
        options: grns.map((g: any) => ({ 
          label: g.header?.grnRefNo || g.grnRefNo || g.id, 
          value: g.header?.grnRefNo || g.grnRefNo || g.id 
        })) 
      },
      { key: "purchaseType", label: "Purchase Type", type: "select", options: ["Local", "Import"] },
      { key: "finalAmount", label: "Final Amount", type: "number", required: true },
      { key: "remarks", label: "Remarks", type: "textarea" },
      { key: "status", label: "Status", type: "select", options: ["Confirmed", "Pending", "Cancelled"] },
    ]} 
    initialData={[]}
    columns={[
      { key: "invoiceNo", label: "Invoice No" }, 
      { key: "invoiceDate", label: "Date" }, 
      { key: "poRefNo", label: "PO Ref" }, 
      { key: "finalAmount", label: "Amount" }, 
      { key: "status", label: "Status" },
    ]} 
  />;
}
