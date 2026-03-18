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

const INITIAL_PURCHASE_ORDERS = [
  { id: "PO001", poRefNo: "PO/MA/02/001", poDate: "2024-02-01", supplier: "Kilimo Bora Suppliers", store: "Dar es Salaam Main Warehouse", finalAmount: 50000, status: "Submitted" },
];

export function usePurchaseOrders() {
  // Overriding some logic for transactions if needed, for now use standard
  return useMasterData("purchase_orders", INITIAL_PURCHASE_ORDERS, "PO");
}

const INITIAL_SALES_ORDERS = [
  { id: "SO001", salesOrderRefNo: "SO/03/001", salesOrderDate: "2024-03-01", customer: "Metro Foods Inc", store: "Dar es Salaam Main Warehouse", finalSalesAmount: 9322000, status: "Delivered" },
];

export function useSalesOrders() {
  return useMasterData("sales_orders", INITIAL_SALES_ORDERS, "SO");
}

const INITIAL_EXPENSES = [
  { id: "EXP001", expenseRefNo: "EXP/03/001", expenseDate: "2024-02-12", poRefNo: "PO/MA/02/001", accountHead: "Transportation", totalExpenseAmount: 2500, status: "Approved" },
];

export function useExpenses() {
  return useMasterData("expenses", INITIAL_EXPENSES, "EXP");
}
