import { Supplier } from '../../types/master.types';

export const mockSuppliers: Supplier[] = [
  {
    supplierId: 'SUP001',
    supplierName: 'Kilimo Bora Suppliers',
    tinNumber: 'TIN123456',
    vatNumber: 'VAT789012',
    contactPerson: 'James Mwangi',
    contactNumber: '+255 712 345 001',
    location: 'Morogoro',
    billingLocationId: 'BL001',
    billingLocationName: 'Morogoro Main Warehouse',
    remarks: 'Premium grain supplier',
    statusMaster: 'Active',
    createdAt: '2023-01-10T00:00:00Z',
    modifiedAt: '2024-01-10T00:00:00Z'
  },
  {
    supplierId: 'SUP002',
    supplierName: 'Tanzania Farmers Cooperative',
    tinNumber: 'TIN789012',
    vatNumber: 'VAT345678',
    contactPerson: 'Grace Temu',
    contactNumber: '+255 755 234 567',
    location: 'Iringa',
    billingLocationId: 'BL002',
    billingLocationName: 'Iringa Collection Center',
    remarks: 'Large farmers cooperative',
    statusMaster: 'Active',
    createdAt: '2023-02-15T00:00:00Z',
    modifiedAt: '2024-02-15T00:00:00Z'
  },
  {
    supplierId: 'SUP003',
    supplierName: 'Agro-Inputs Ltd',
    tinNumber: 'TIN345678',
    vatNumber: 'VAT901234',
    contactPerson: 'David Kimambo',
    contactNumber: '+255 762 876 543',
    location: 'Dar es Salaam',
    billingLocationId: 'BL003',
    billingLocationName: 'Dar es Salaam Port Warehouse',
    remarks: 'Fertilizer and chemical supplier',
    statusMaster: 'Active',
    createdAt: '2023-03-20T00:00:00Z',
    modifiedAt: '2024-03-20T00:00:00Z'
  }
];
