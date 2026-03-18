"use client";

import { TaxInvoice } from '../../types/sales.types';

// INV Format: INV/{MM}/{NNN}
export const mockTaxInvoices: TaxInvoice[] = [
  {
    sno: '1',
    taxInvoiceRefNo: 'INV/02/001',
    invoiceDate: '2024-02-16T10:00:00Z',
    companyId: 'COMP001',
    fromStoreId: 'STR001',
    invoiceType: 'Tax',
    deliveryNoteRefNo: 'DN/02/001',
    customerId: 'CUST001',
    customerName: 'Milling Corporation Ltd',
    
    currencyId: 'CUR001',
    exchangeRate: 2500,
    
    totalProductAmount: 36075.00,
    vatAmount: 6493.50,
    finalSalesAmount: 42568.50,
    
    totalProductAmountLc: 90187500.00,
    finalSalesAmountLc: 106421250.00,
    
    paidAmount: 0,
    outstandingAmount: 42568.50,
    
    remarks: 'Invoice for partial delivery',
    statusEntry: 'Issued',
    createdBy: 'accounts.finance',
    createdDate: '2024-02-16T10:00:00Z',
    submittedBy: 'accounts.finance',
    submittedDate: '2024-02-16T10:30:00Z'
  }
];
