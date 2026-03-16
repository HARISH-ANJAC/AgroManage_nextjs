import { Customer, Product, Store } from './master.types';

export interface SalesOrderHeader {
  sno: string;
  salesOrderRefNo: string; // Format: SO/{MM}/{NNN}
  salesOrderDate: string;
  companyId: string;
  storeId: string;
  customerId: string;
  customerName?: string;
  billingLocationId: string;
  salesPersonEmpId?: string;
  
  // Credit information
  creditLimitAmount: number;
  creditLimitDays: number;
  outstandingAmount: number;
  creditCheckPassed: boolean;
  
  currencyId: string;
  exchangeRate: number;
  
  totalProductAmount: number;
  vatAmount: number;
  finalSalesAmount: number;
  
  totalProductAmountLc: number;
  finalSalesAmountLc: number;
  
  remarks: string;
  statusEntry: 'Draft' | 'Confirmed' | 'Processing' | 'Delivered' | 'Invoiced' | 'Cancelled';
  createdBy: string;
  createdDate: string;
  submittedBy?: string;
  submittedDate?: string;
}

export interface SalesOrderDetail {
  sno: string;
  salesOrderRefNo: string;
  mainCategoryId: string;
  subCategoryId: string;
  productId: string;
  productName?: string;
  storeStockPcs: number;
  poRefNo?: string;
  poDtlSno?: string;
  poDtlStockQty?: number;
  purchaseRatePerQty?: number;
  poExpenseAmount?: number;
  salesRatePerQty: number;
  qtyPerPacking: number;
  totalQty: number;
  uom: string;
  totalPacking: number;
  alternateUom?: string;
  totalProductAmount: number;
  vatPercentage: number;
  vatAmount: number;
  finalSalesAmount: number;
  totalProductAmountLc: number;
  finalSalesAmountLc: number;
  remarks?: string;
  statusEntry: string;
  createdBy: string;
  createdDate: string;
}

export interface DeliveryNote {
  sno: string;
  deliveryNoteRefNo: string; // Format: DN/{MM}/{NNN}
  deliveryDate: string;
  companyId: string;
  fromStoreId: string;
  deliverySourceType: 'Sales Order' | 'Transfer';
  deliverySourceRefNo: string;
  toStoreId?: string;
  customerId: string;
  customerName?: string;
  truckNo: string;
  trailerNo?: string;
  driverName: string;
  driverContactNumber: string;
  sealNo?: string;
  
  currencyId: string;
  exchangeRate: number;
  
  totalProductAmount: number;
  vatAmount: number;
  finalSalesAmount: number;
  
  totalProductAmountLc: number;
  finalSalesAmountLc: number;
  
  remarks: string;
  statusEntry: 'Draft' | 'Dispatched' | 'Delivered' | 'Cancelled';
  createdBy: string;
  createdDate: string;
  submittedBy: string;
  submittedDate: string;
}

export interface DeliveryNoteDetail {
  sno: string;
  deliveryNoteRefNo: string;
  salesOrderDtlSno: string;
  poDtlSno?: string;
  poRefNo?: string;
  mainCategoryId: string;
  subCategoryId: string;
  productId: string;
  productName?: string;
  salesRatePerQty: number;
  qtyPerPacking: number;
  requestQty: number;
  deliveryQty: number;
  uom: string;
  totalPacking: number;
  alternateUom?: string;
  totalProductAmount: number;
  vatPercentage: number;
  vatAmount: number;
  finalSalesAmount: number;
  totalProductAmountLc: number;
  finalSalesAmountLc: number;
  storeStockPcs: number;
  remarks?: string;
  statusEntry: string;
  createdBy: string;
  createdDate: string;
}

export interface TaxInvoice {
  sno: string;
  taxInvoiceRefNo: string; // Format: INV/{MM}/{NNN}
  invoiceDate: string;
  companyId: string;
  fromStoreId: string;
  invoiceType: 'Tax' | 'Retail' | 'Proforma';
  deliveryNoteRefNo: string;
  customerId: string;
  customerName?: string;
  
  currencyId: string;
  exchangeRate: number;
  
  totalProductAmount: number;
  vatAmount: number;
  finalSalesAmount: number;
  
  totalProductAmountLc: number;
  finalSalesAmountLc: number;
  
  // Payment tracking
  paidAmount: number;
  outstandingAmount: number;
  
  remarks: string;
  statusEntry: 'Draft' | 'Issued' | 'Paid' | 'Overdue' | 'Cancelled';
  createdBy: string;
  createdDate: string;
  submittedBy: string;
  submittedDate: string;
}

export interface CustomerReceipt {
  sno: string;
  receiptRefNo: string; // Format: RCPT/{MM}/{NNN}
  receiptDate: string;
  paymentType: 'Cash' | 'Bank' | 'Cheque' | 'Transfer';
  companyId: string;
  customerId: string;
  customerName?: string;
  paymentModeId: string;
  crBankCashId?: string;
  crAccountId?: string;
  drBankCashId?: string;
  transactionRefNo: string;
  transactionDate: string;
  currencyId: string;
  receiptAmount: number;
  exchangeRate: number;
  receiptAmountLc: number;
  remarks?: string;
  
  // Allocation status
  allocatedAmount: number;
  unallocatedAmount: number;
  
  statusEntry: 'Draft' | 'Confirmed' | 'Reconciled';
  createdBy: string;
  createdDate: string;
  tallySyncStatus?: 'Pending' | 'Synced' | 'Failed';
}

export interface ReceiptInvoiceAllocation {
  sno: string;
  receiptRefNo: string;
  taxInvoiceRefNo: string;
  actualInvoiceAmount: number;
  alreadyPaidAmount: number;
  outstandingInvoiceAmount: number;
  receiptInvoiceAdjustAmount: number;
  remarks?: string;
  statusEntry: string;
  createdBy: string;
  createdDate: string;
}
