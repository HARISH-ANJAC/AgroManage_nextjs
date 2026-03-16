import { SalesOrderHeader, SalesOrderDetail } from '../../types/sales.types';

// SO Format: SO/{ProductPrefix}/{MM}/{NNN}
export const mockSalesOrders: SalesOrderHeader[] = [
  {
    sno: '1',
    salesOrderRefNo: 'SO/WM/01/015',
    salesOrderDate: '2024-01-20T11:00:00Z',
    companyId: 'COMP001',
    customerName: 'Milling Corporation Ltd',
    finalSalesAmount: 52000.00,
    statusEntry: 'Confirmed',
    createdBy: 'sales.juma',
    createdDate: '2024-01-20T11:00:00Z'
  } as any,
  {
    sno: '2',
    salesOrderRefNo: 'SO/WM/02/001',
    salesOrderDate: '2024-02-10T11:00:00Z',
    companyId: 'COMP001',
    customerName: 'Milling Corporation Ltd',
    finalSalesAmount: 44250.00,
    statusEntry: 'Confirmed',
    createdBy: 'sales.juma',
    createdDate: '2024-02-10T11:00:00Z'
  },
  {
    sno: '3',
    salesOrderRefNo: 'SO/YM/03/022',
    salesOrderDate: '2024-03-15T09:00:00Z',
    companyId: 'COMP001',
    customerName: 'Arusha Millers',
    finalSalesAmount: 78000.00,
    statusEntry: 'Confirmed',
    createdBy: 'sales.anna',
    createdDate: '2024-03-15T09:00:00Z'
  } as any,
  {
    sno: '4',
    salesOrderRefNo: 'SO/RI/04/008',
    salesOrderDate: '2024-04-18T14:00:00Z',
    companyId: 'COMP001',
    customerName: 'Coastal Traders',
    finalSalesAmount: 62000.00,
    statusEntry: 'Confirmed',
    createdBy: 'sales.anna',
    createdDate: '2024-04-18T14:00:00Z'
  } as any,
  {
    sno: '5',
    salesOrderRefNo: 'SO/WM/05/031',
    salesOrderDate: '2024-05-22T10:00:00Z',
    companyId: 'COMP001',
    customerName: 'Milling Corporation Ltd',
    finalSalesAmount: 85000.00,
    statusEntry: 'Confirmed',
    createdBy: 'sales.juma',
    createdDate: '2024-05-22T10:00:00Z'
  } as any,
  {
    sno: '6',
    salesOrderRefNo: 'SO/YM/06/012',
    salesOrderDate: '2024-06-10T11:00:00Z',
    companyId: 'COMP001',
    customerName: 'Arusha Millers',
    finalSalesAmount: 95000.00,
    statusEntry: 'Confirmed',
    createdBy: 'sales.anna',
    createdDate: '2024-06-10T11:00:00Z'
  } as any
];

export const mockSalesOrderDetails: SalesOrderDetail[] = [
  // For SO/WM/02/001
  {
    sno: '1',
    salesOrderRefNo: 'SO/WM/02/001',
    mainCategoryId: 'MC001',
    subCategoryId: 'SC001',
    productId: 'PRD001',
    productName: 'White Maize - Grade A',
    storeStockPcs: 50000,
    poRefNo: 'PO/MA/02/001',
    poDtlSno: '1',
    poDtlStockQty: 29850,
    purchaseRatePerQty: 1.50,
    poExpenseAmount: 0.12, // Allocated expense per kg
    salesRatePerQty: 1.85,
    qtyPerPacking: 50,
    totalQty: 20000,
    uom: 'KG',
    totalPacking: 400,
    totalProductAmount: 37000.00,
    vatPercentage: 18,
    vatAmount: 6660.00,
    finalSalesAmount: 43660.00,
    totalProductAmountLc: 92500000.00,
    finalSalesAmountLc: 109150000.00,
    remarks: 'For flour production',
    statusEntry: 'Active',
    createdBy: 'sales.juma',
    createdDate: '2024-02-10T11:00:00Z'
  },
  // For SO/YM/02/002
  {
    sno: '2',
    salesOrderRefNo: 'SO/YM/02/002',
    mainCategoryId: 'MC001',
    subCategoryId: 'SC001',
    productId: 'PRD002',
    productName: 'Yellow Maize - Standard',
    storeStockPcs: 35000,
    poRefNo: 'PO/MA/01/015', // Previous PO
    salesRatePerQty: 1.40,
    qtyPerPacking: 50,
    totalQty: 20000,
    uom: 'KG',
    totalPacking: 400,
    totalProductAmount: 28000.00,
    vatPercentage: 18,
    vatAmount: 5040.00,
    finalSalesAmount: 33040.00,
    totalProductAmountLc: 70000000.00,
    finalSalesAmountLc: 82600000.00,
    remarks: 'Animal feed production',
    statusEntry: 'Active',
    createdBy: 'sales.anna',
    createdDate: '2024-02-12T09:00:00Z'
  }
];
