"use client";

// Master Data Types
export interface Company {
  companyId: string;
  companyName: string;
  companyFullName: string;
  tinNumber: string;
  address: string;
  contactPerson: string;
  contactNumber: string;
  email: string;
  currency: number;
  timeZone: string;
  noOfUser: number;
  website: string;
  invoiceHeader: string;
  invoiceFooter: string;
  rounding: number;
  digitForRounding: number;
  standardVatPercentage: number;
  vatSettingsByProducts: number;
  financeStartMonth: string;
  financeEndMonth: string;
  yearCode: string;
  shortCode: string;
  statusMaster: 'Active' | 'Inactive';
  createdAt: string;
  modifiedAt: string;
}

export interface ProductMainCategory {
  mainCategoryId: string;
  mainCategoryName: string;
  remarks: string;
  statusMaster: 'Active' | 'Inactive';
  pflCostCenterId?: number;
  createdAt: string;
  modifiedAt: string;
}

export interface ProductSubCategory {
  subCategoryId: string;
  subCategoryName: string;
  mainCategoryId: string;
  mainCategoryName?: string;
  remarks: string;
  statusMaster: 'Active' | 'Inactive';
  createdAt: string;
  modifiedAt: string;
}

export interface Product {
  productId: string;
  productName: string;
  mainCategoryId: string;
  mainCategoryName?: string;
  subCategoryId: string;
  subCategoryName?: string;
  uom: string;
  qtyPerPacking: number;
  alternateUom: string;
  remarks: string;
  statusMaster: 'Active' | 'Inactive';
  createdAt: string;
  modifiedAt: string;
}

export interface Supplier {
  supplierId: string;
  supplierName: string;
  tinNumber: string;
  vatNumber: string;
  contactPerson: string;
  contactNumber: string;
  location: string;
  billingLocationId?: string;
  billingLocationName?: string;
  remarks: string;
  statusMaster: 'Active' | 'Inactive';
  createdAt: string;
  modifiedAt: string;
}

export interface Customer {
  customerId: string;
  customerName: string;
  customerCode: string;
  tinNumber: string;
  vatNumber: string;
  contactPerson: string;
  contactNumber: string;
  phoneNumber2?: string;
  emailAddress: string;
  location: string;
  address: string;
  countryId: string;
  regionId?: string;
  districtId?: string;
  natureOfBusiness: string;
  tier: 'Platinum' | 'Gold' | 'Silver' | 'Bronze';
  creditAllowed: 'Yes' | 'No';
  billingLocationId?: string;
  currencyId: string;
  lat?: number;
  lng?: number;
  statusMaster: 'Active' | 'Inactive';
  createdAt: string;
  modifiedAt: string;
}

export interface Store {
  storeId: string;
  storeName: string;
  storeShortCode: string;
  storeShortName: string;
  locationId: string;
  locationName?: string;
  managerName: string;
  emailAddress: string;
  ccEmailAddress?: string;
  bccEmailAddress?: string;
  remarks: string;
  statusMaster: 'Active' | 'Inactive';
  createdAt: string;
  modifiedAt: string;
}

export interface User {
  loginId: string;
  loginName: string;
  newCardNo?: number;
  roleUserHdr: string;
  mobileNoUserHdr: string;
  mailIdUserHdr: string;
  stockShowStatus: string;
  outsideAccessYN: 'Yes' | 'No';
  statusUserHdr: 'Active' | 'Inactive';
  remarks: string;
  createdAt: string;
  modifiedAt: string;
}

export interface ExpenseCategory {
  expensesId: string;
  typesOfExpense: string;
  expensesAmountPerDay: number;
  validFrom: string;
  validTo: string;
  statusMaster: 'Active' | 'Inactive';
  createdAt: string;
  modifiedAt: string;
}
