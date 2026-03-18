"use client";

import { GoodsReceiptNote, GoodsReceiptDetail } from '../../types/purchase.types';

// GRN Format: GRN/{MM}/{NNN}
export const mockGRNs: GoodsReceiptNote[] = [
  {
    sno: '1',
    grnRefNo: 'GRN/02/001',
    grnDate: '2024-02-12T14:30:00Z',
    companyId: 'COMP001',
    sourceStoreId: 'STR001',
    grnStoreId: 'STR001',
    grnSource: 'Purchase Order',
    supplierId: 'SUP001',
    supplierName: 'Kilimo Bora Suppliers',
    poRefNo: 'PO/MA/02/001',
    supplierInvoiceNumber: 'INV/2024/123',
    containerNo: 'CONT-5678',
    driverName: 'Ali Hassan',
    driverContactNumber: '+255 712 345 678',
    vehicleNo: 'T567 ABC',
    sealNo: 'SEAL-9012',
    remarks: 'All goods received in good condition',
    statusEntry: 'Confirmed',
    createdBy: 'warehouse.dar',
    createdDate: '2024-02-12T14:30:00Z'
  }
];

export const mockGRNDetails: GoodsReceiptDetail[] = [
  {
    sno: '1',
    grnRefNo: 'GRN/02/001',
    poDtlSno: '1',
    mainCategoryId: 'MC001',
    subCategoryId: 'SC001',
    productId: 'PRD001',
    productName: 'White Maize - Grade A',
    qtyPerPacking: 50,
    orderedQty: 30000,
    receivedQty: 29850, // Shortage of 150kg
    uom: 'KG',
    totalPacking: 597,
    condition: 'Good',
    remarks: '150kg shortage due to spillage',
    statusEntry: 'Confirmed',
    createdBy: 'warehouse.dar',
    createdDate: '2024-02-12T14:30:00Z'
  }
];
