"use client";

import { useMasterData } from "./useMasterData";

const INITIAL_PRODUCTS = [
  { id: "PRD001", productName: "White Maize – Grade A", commonName: "Mahindi Meupe", mainCategory: "Grains", subCategory: "Maize", uom: "Bag", status: "Active" },
  { id: "PRD002", productName: "Pishori Rice – Grade 1", commonName: "Mchele wa Pishori", mainCategory: "Grains", subCategory: "Rice", uom: "Bag", status: "Active" },
];

export function useProducts() {
  return useMasterData("products", INITIAL_PRODUCTS, "PRD");
}

const INITIAL_SUPPLIERS = [
  { id: "SPL001", supplierName: "Kilimo Bora Suppliers", contactPerson: "John Doe", phone: "+255 712 345678", email: "info@kilimobora.co.tz", status: "Active" },
  { id: "SPL002", supplierName: "Tanzania Agro Trading", contactPerson: "Jane Smith", phone: "+255 754 876543", email: "trading@tanzaniagro.tz", status: "Active" },
];

export function useSuppliers() {
  return useMasterData("suppliers", INITIAL_SUPPLIERS, "SPL");
}

// Transactional Entities - Connect to hyphenated API routes
export function usePurchaseOrders() {
  return useMasterData("purchase-orders", [], "PO");
}

export function useSalesOrders() {
  return useMasterData("sales-orders", [], "SO");
}

export function useExpenses() {
  return useMasterData("expenses", [], "EXP");
}

export function useGoodsReceipts() {
  return useMasterData("goods-receipts", [], "GRN");
}

export function useSupplierInvoices() {
  return useMasterData("supplier-invoices", [], "INV");
}

export function useCustomerReceipts() {
  return useMasterData("customer-receipts", [], "RCP");
}

export function useDeliveryNotes() {
  return useMasterData("delivery-notes", [], "DN");
}

export function useTaxInvoices() {
  return useMasterData("tax-invoices", [], "TI");
}

export function useCompanies() {
  return useMasterData("companies", [
    { id: "CMP-001", COMPANY_NAME: "AgroManage Tanzania Ltd", status: "Active" }
  ], "CMP");
}

export function useCustomers() {
  return useMasterData("customers", [
    { id: "CST-001", CUSTOMER_NAME: "Metro Foods Inc", status: "Active" },
    { id: "CST-002", CUSTOMER_NAME: "Global Grain Ltd", status: "Active" }
  ], "CST");
}

export function useStores() {
  return useMasterData("stores", [
    { id: "STR-001", STORE_NAME: "Main Warehouse", status: "Active" },
    { id: "STR-002", STORE_NAME: "Zanzibar Hub", status: "Active" }
  ], "STR");
}

export function useSalesPersons() {
  return useMasterData("sales-persons", [
    { id: "SP-001", salesPersonName: "James Kileo" },
    { id: "SP-002", salesPersonName: "Hassan Juma" }
  ], "SP");
}

export function useCurrencies() {
  return useMasterData("currencies", [
    { id: "CUR-001", CURRENCY_NAME: "TZS" },
    { id: "CUR-002", CURRENCY_NAME: "USD" }
  ], "CUR");
}

export function usePaymentTerms() {
  return useMasterData("payment-terms", [
    { id: "PT-001", paymentTermName: "Net 30" },
    { id: "PT-002", paymentTermName: "CIA" }
  ], "PT");
}

export function useUoms() {
  return useMasterData("uoms", [
    { id: "UOM-001", UNIT_NAME: "Bag" },
    { id: "UOM-002", UNIT_NAME: "KG" },
    { id: "UOM-003", UNIT_NAME: "MT" },
    { id: "UOM-004", UNIT_NAME: "Litre" },
    { id: "UOM-005", UNIT_NAME: "Carton" },
    { id: "UOM-006", UNIT_NAME: "Pack" }
  ], "UOM");
}

