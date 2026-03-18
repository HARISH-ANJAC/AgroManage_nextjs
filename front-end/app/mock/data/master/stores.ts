"use client";

import { Store } from '../../types/master.types';

export const mockStores: Store[] = [
  {
    storeId: 'STR001',
    storeName: 'Dar es Salaam Main Warehouse',
    storeShortCode: 'DAR',
    storeShortName: 'Dar Main',
    locationId: 'LOC001',
    locationName: 'Dar es Salaam Industrial Area',
    managerName: 'John Mwakyembe',
    emailAddress: 'warehouse.dar@agrotz.com',
    ccEmailAddress: 'operations@agrotz.com',
    remarks: 'Main storage facility for Dar es Salaam region',
    statusMaster: 'Active',
    createdAt: '2023-01-01T00:00:00Z',
    modifiedAt: '2024-01-01T00:00:00Z'
  },
  {
    storeId: 'STR002',
    storeName: 'Arusha Regional Warehouse',
    storeShortCode: 'ARK',
    storeShortName: 'Arusha',
    locationId: 'LOC002',
    locationName: 'Arusha Industrial Area',
    managerName: 'Samuel Laizer',
    emailAddress: 'warehouse.arusha@agrotz.com',
    remarks: 'Serving northern regions',
    statusMaster: 'Active',
    createdAt: '2023-02-01T00:00:00Z',
    modifiedAt: '2024-02-01T00:00:00Z'
  },
  {
    storeId: 'STR003',
    storeName: 'Mbeya Collection Center',
    storeShortCode: 'MBY',
    storeShortName: 'Mbeya',
    locationId: 'LOC003',
    locationName: 'Mbeya Industrial Area',
    managerName: 'Paul Mwanjisi',
    emailAddress: 'warehouse.mbeya@agrotz.com',
    remarks: 'Collection center for southern highlands',
    statusMaster: 'Active',
    createdAt: '2023-03-01T00:00:00Z',
    modifiedAt: '2024-03-01T00:00:00Z'
  }
];
