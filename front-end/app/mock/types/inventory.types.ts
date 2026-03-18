"use client";

export interface InventoryItem {
  productId: string;
  productName: string;
  mainCategoryId: string;
  mainCategoryName: string;
  subCategoryId: string;
  subCategoryName: string;
  storeId: string;
  storeName: string;
  quantityAvailable: number;
  quantityReserved: number;
  quantityOnOrder: number;
  reorderLevel: number;
  reorderQuantity: number;
  lastUpdated: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Overstock';
}

export interface StockMovement {
  movementId: string;
  productId: string;
  productName: string;
  storeId: string;
  storeName: string;
  movementType: 'GRN' | 'Delivery' | 'Adjustment' | 'Transfer' | 'Return';
  referenceNo: string;
  quantity: number;
  beforeQuantity: number;
  afterQuantity: number;
  movementDate: string;
  createdBy: string;
  remarks?: string;
}

export interface MinimumStockLevel {
  sno: string;
  storeId: string;
  storeName: string;
  mainCategoryId: string;
  subCategoryId: string;
  productId: string;
  productName: string;
  minimumStockPcs: number;
  purchaseAlertQty: number;
  effectiveFrom: string;
  effectiveTo?: string;
  remarks?: string;
  statusMaster: 'Active' | 'Inactive';
  createdBy: string;
  createdDate: string;
}

export interface OpeningStock {
  sno: string;
  openingStockDate: string;
  companyId: string;
  storeId: string;
  mainCategoryId: string;
  subCategoryId: string;
  productId: string;
  productName: string;
  totalQty: number;
  remarks?: string;
  statusMaster: 'Draft' | 'Confirmed';
  createdBy: string;
  createdDate: string;
}
