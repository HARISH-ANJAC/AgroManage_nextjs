"use client";

import { PurchaseInvoice } from '../../types/purchase.types';

// PINV Format: PINV/{MM}/{NNN}
export const mockPurchaseInvoices: PurchaseInvoice[] = [
  {
    sno: '1',
    purchaseInvoiceRefNo: 'PINV/02/001',
    invoiceNo: 'SUP-INV-2024-001',
    invoiceDate: '2024-02-13T00:00:00Z',
    companyId: 'COMP001',
    poRefNo: 'PO/MA/02/001',
    purchaseType: 'Local',
    supplierId: 'SUP001',
    supplierName: 'Kilimo Bora Suppliers',
    storeId: 'STR001',
    paymentTermId: 'PT001',
    modeOfPayment: 'Bank Transfer',
    currencyId: 'CUR001',
    exchangeRate: 2500,
    priceTerms: 'FOB',
    
    productHdrAmount: 45000.00,
    totalAdditionalCostAmount: 3500.00,
    totalProductHdrAmount: 48500.00,
    totalVatHdrAmount: 8730.00,
    finalInvoiceHdrAmount: 57230.00,
    
    productHdrAmountLc: 112500000.00,
    totalAdditionalCostAmountLc: 8750000.00,
    totalProductHdrAmountLc: 121250000.00,
    totalVatHdrAmountLc: 21825000.00,
    finalPurchaseInvoiceAmountLc: 143075000.00,
    
    // Three-way matching data
    matchingStatus: 'Mismatch',
    poQuantity: 30000,
    grnQuantity: 29850,
    invoiceQuantity: 30000, // Supplier invoiced for full quantity despite shortage
    
    submittedBy: 'john.purchase',
    submittedDate: '2024-02-13T09:00:00Z',
    statusEntry: 'Submitted',
    createdBy: 'john.purchase',
    createdDate: '2024-02-13T09:00:00Z'
  }
];
