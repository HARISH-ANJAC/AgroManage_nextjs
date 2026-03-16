import { Product, Supplier, Store } from './master.types';

// PO Number Format: PO/{ProductCode}/{Month}/{RunningNumber}
// Example: PO/MA/02/001

export interface PurchaseOrderHeader {
  sno: string;
  poRefNo: string; // Format: PO/{ProductCode}/{MM}/{NNN}
  poDate: string;
  purchaseType: 'Local' | 'Import';
  companyId: string;
  supplierId: string;
  supplierName?: string;
  poStoreId: string;
  storeName?: string;
  paymentTermId: string;
  modeOfPayment: string;
  currencyId: string;
  exchangeRate: number;
  suplierProformaNumber?: string;
  shipmentMode?: string;
  priceTerms?: string;
  estimatedShipmentDate?: string;
  shipmentRemarks?: string;
  
  // Amounts in foreign currency
  productHdrAmount: number;
  totalAdditionalCostAmount: number;
  totalProductHdrAmount: number;
  totalVatHdrAmount: number;
  finalPurchaseHdrAmount: number;
  
  // Amounts in local currency
  productHdrAmountLc: number;
  totalAdditionalCostAmountLc: number;
  totalProductHdrAmountLc: number;
  totalVatHdrAmountLc: number;
  finalPurchaseHdrAmountLc: number;
  
  // Approval workflow
  submittedBy?: string;
  submittedDate?: string;
  submittedIpAddress?: string;
  
  purchaseHeadResponsePerson?: string;
  purchaseHeadResponseDate?: string;
  purchaseHeadResponseStatus?: 'Pending' | 'Approved' | 'Rejected' | 'Returned';
  purchaseHeadResponseRemarks?: string;
  
  response1Person?: string;
  response1Date?: string;
  response1Status?: 'Pending' | 'Approved' | 'Rejected' | 'Returned';
  response1Remarks?: string;
  
  response2Person?: string;
  response2Date?: string;
  response2Status?: 'Pending' | 'Approved' | 'Rejected' | 'Returned';
  response2Remarks?: string;
  
  finalResponsePerson?: string;
  finalResponseDate?: string;
  finalResponseStatus?: 'Pending' | 'Approved' | 'Rejected' | 'Returned';
  finalResponseRemarks?: string;
  
  remarks: string;
  statusEntry: 'Draft' | 'Submitted' | 'In-Approval' | 'Approved' | 'Rejected' | 'Completed';
  createdBy: string;
  createdDate: string;
  modifiedBy?: string;
  modifiedDate?: string;
}

export interface PurchaseOrderDetail {
  sno: string;
  poRefNo: string;
  requestStoreId: string;
  mainCategoryId: string;
  mainCategoryName?: string;
  subCategoryId: string;
  subCategoryName?: string;
  productId: string;
  productName?: string;
  qtyPerPacking: number;
  totalQty: number;
  uom: string;
  totalPacking: number;
  alternateUom?: string;
  ratePerQty: number;
  productAmount: number;
  discountPercentage: number;
  discountAmount: number;
  totalProductAmount: number;
  vatPercentage: number;
  vatAmount: number;
  finalProductAmount: number;
  totalProductAmountLc: number;
  finalProductAmountLc: number;
  remarks?: string;
  statusEntry: string;
  createdBy: string;
  createdDate: string;
}

export interface PurchaseOrderAdditionalCost {
  sno: string;
  poRefNo: string;
  additionalCostTypeId: string;
  additionalCostTypeName?: string;
  additionalCostAmount: number;
  remarks?: string;
  statusMaster: string;
  createdBy: string;
  createdDate: string;
}

export interface GoodsReceiptNote {
  sno: string;
  grnRefNo: string; // Format: GRN/{MM}/{NNN}
  grnDate: string;
  companyId: string;
  sourceStoreId: string;
  grnStoreId: string;
  grnSource: 'Purchase Order' | 'Transfer' | 'Return';
  deliveryNoteRefNo?: string;
  supplierId: string;
  supplierName?: string;
  poRefNo: string;
  purchaseInvoiceRefNo?: string;
  supplierInvoiceNumber?: string;
  containerNo?: string;
  driverName?: string;
  driverContactNumber?: string;
  vehicleNo?: string;
  sealNo?: string;
  remarks?: string;
  statusEntry: 'Draft' | 'Confirmed' | 'Cancelled';
  createdBy: string;
  createdDate: string;
  modifiedBy?: string;
  modifiedDate?: string;
}

export interface GoodsReceiptDetail {
  sno: string;
  grnRefNo: string;
  poDtlSno: string;
  mainCategoryId: string;
  subCategoryId: string;
  productId: string;
  productName?: string;
  qtyPerPacking: number;
  orderedQty: number;
  receivedQty: number;
  uom: string;
  totalPacking: number;
  alternateUom?: string;
  condition?: 'Good' | 'Damaged' | 'Partial';
  remarks?: string;
  statusEntry: string;
  createdBy: string;
  createdDate: string;
}

export interface PurchaseInvoice {
  sno: string;
  purchaseInvoiceRefNo: string; // Format: PINV/{MM}/{NNN}
  invoiceNo: string; // Supplier invoice number
  invoiceDate: string;
  companyId: string;
  poRefNo: string;
  purchaseType: string;
  supplierId: string;
  supplierName?: string;
  storeId: string;
  paymentTermId: string;
  modeOfPayment: string;
  currencyId: string;
  exchangeRate: number;
  priceTerms?: string;
  
  productHdrAmount: number;
  totalAdditionalCostAmount: number;
  totalProductHdrAmount: number;
  totalVatHdrAmount: number;
  finalInvoiceHdrAmount: number;
  
  // Local currency
  productHdrAmountLc: number;
  totalAdditionalCostAmountLc: number;
  totalProductHdrAmountLc: number;
  totalVatHdrAmountLc: number;
  finalPurchaseInvoiceAmountLc: number;
  
  // Three-way matching status
  matchingStatus: 'Pending' | 'Matched' | 'Mismatch';
  poQuantity: number;
  grnQuantity: number;
  invoiceQuantity: number;
  
  submittedBy: string;
  submittedDate: string;
  statusEntry: 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
  createdBy: string;
  createdDate: string;
}
