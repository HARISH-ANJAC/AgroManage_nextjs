"use client";

import { DeliveryNote, DeliveryNoteDetail } from '../../types/sales.types';

// DN Format: DN/{MM}/{NNN}
export const mockDeliveryNotes: DeliveryNote[] = [
  {
    sno: '1',
    deliveryNoteRefNo: 'DN/02/001',
    deliveryDate: '2024-02-15T08:00:00Z',
    companyId: 'COMP001',
    fromStoreId: 'STR001',
    deliverySourceType: 'Sales Order',
    deliverySourceRefNo: 'SO/02/001',
    customerId: 'CUST001',
    customerName: 'Milling Corporation Ltd',
    truckNo: 'TZ 1234 X',
    trailerNo: 'TR 567 Y',
    driverName: 'Juma Mwinyi',
    driverContactNumber: '+255 712 345 678',
    sealNo: 'SEAL-12345',
    
    currencyId: 'CUR001',
    exchangeRate: 2500,
    
    totalProductAmount: 37000.00,
    vatAmount: 6660.00,
    finalSalesAmount: 43660.00,
    
    totalProductAmountLc: 92500000.00,
    finalSalesAmountLc: 109150000.00,
    
    remarks: 'Deliver to industrial area warehouse',
    statusEntry: 'Dispatched',
    createdBy: 'warehouse.dar',
    createdDate: '2024-02-15T08:00:00Z',
    submittedBy: 'warehouse.dar',
    submittedDate: '2024-02-15T08:30:00Z'
  }
];

export const mockDeliveryNoteDetails: DeliveryNoteDetail[] = [
  {
    sno: '1',
    deliveryNoteRefNo: 'DN/02/001',
    salesOrderDtlSno: '1',
    poDtlSno: '1',
    poRefNo: 'PO/MA/02/001',
    mainCategoryId: 'MC001',
    subCategoryId: 'SC001',
    productId: 'PRD001',
    productName: 'White Maize - Grade A',
    salesRatePerQty: 1.85,
    qtyPerPacking: 50,
    requestQty: 20000,
    deliveryQty: 19500, // Short delivery of 500kg
    uom: 'KG',
    totalPacking: 390,
    totalProductAmount: 36075.00,
    vatPercentage: 18,
    vatAmount: 6493.50,
    finalSalesAmount: 42568.50,
    totalProductAmountLc: 90187500.00,
    finalSalesAmountLc: 106421250.00,
    storeStockPcs: 50000,
    remarks: 'Partial delivery, balance to follow next week',
    statusEntry: 'Active',
    createdBy: 'warehouse.dar',
    createdDate: '2024-02-15T08:00:00Z'
  }
];
