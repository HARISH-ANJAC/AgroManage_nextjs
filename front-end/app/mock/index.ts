// Export all types
export * from './types/master.types';
export * from './types/purchase.types';
export * from './types/sales.types';
export * from './types/inventory.types';

// Import all data for combined export
import { mockCompanies } from './data/master/companies';
import { mockMainCategories, mockSubCategories } from './data/master/productCategories';
import { mockProducts } from './data/master/products';
import { mockSuppliers } from './data/master/suppliers';
import { mockCustomers } from './data/master/customers';
import { mockStores } from './data/master/stores';
import { mockPurchaseOrders, mockPurchaseOrderDetails, mockPurchaseOrderCosts } from './data/purchase/purchaseOrders';
import { mockGRNs, mockGRNDetails } from './data/purchase/goodsReceipts';
import { mockPurchaseInvoices } from './data/purchase/purchaseInvoices';
import { mockSalesOrders, mockSalesOrderDetails } from './data/sales/salesOrders';
import { mockDeliveryNotes, mockDeliveryNoteDetails } from './data/sales/deliveryNotes';
import { mockTaxInvoices } from './data/sales/taxInvoices';

// Export individual mock data
export * from './data/master/companies';
export * from './data/master/productCategories';
export * from './data/master/products';
export * from './data/master/suppliers';
export * from './data/master/customers';
export * from './data/master/stores';
export * from './data/purchase/purchaseOrders';
export * from './data/purchase/goodsReceipts';
export * from './data/purchase/purchaseInvoices';
export * from './data/sales/salesOrders';
export * from './data/sales/deliveryNotes';
export * from './data/sales/taxInvoices';

// Export utilities
export * from './utils/formatters';

// Combined export for easy access
export const mockData = {
  companies: mockCompanies,
  mainCategories: mockMainCategories,
  subCategories: mockSubCategories,
  products: mockProducts,
  suppliers: mockSuppliers,
  customers: mockCustomers,
  stores: mockStores,
  purchaseOrders: mockPurchaseOrders,
  purchaseOrderDetails: mockPurchaseOrderDetails,
  purchaseOrderCosts: mockPurchaseOrderCosts,
  grns: mockGRNs,
  grnDetails: mockGRNDetails,
  purchaseInvoices: mockPurchaseInvoices,
  salesOrders: mockSalesOrders,
  salesOrderDetails: mockSalesOrderDetails,
  deliveryNotes: mockDeliveryNotes,
  deliveryNoteDetails: mockDeliveryNoteDetails,
  taxInvoices: mockTaxInvoices
};
