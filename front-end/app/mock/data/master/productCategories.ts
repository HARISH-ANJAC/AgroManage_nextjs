import { ProductMainCategory, ProductSubCategory } from '../../types/master.types';

export const mockMainCategories: ProductMainCategory[] = [
  {
    mainCategoryId: 'MC001',
    mainCategoryName: 'Grains',
    remarks: 'All grain products including maize, wheat, rice',
    statusMaster: 'Active',
    pflCostCenterId: 101,
    createdAt: '2023-01-01T00:00:00Z',
    modifiedAt: '2024-01-01T00:00:00Z'
  },
  {
    mainCategoryId: 'MC002',
    mainCategoryName: 'Pulses',
    remarks: 'Beans, lentils, chickpeas',
    statusMaster: 'Active',
    pflCostCenterId: 102,
    createdAt: '2023-01-01T00:00:00Z',
    modifiedAt: '2024-01-01T00:00:00Z'
  },
  {
    mainCategoryId: 'MC003',
    mainCategoryName: 'Fertilizers',
    remarks: 'Agricultural inputs and chemicals',
    statusMaster: 'Active',
    pflCostCenterId: 103,
    createdAt: '2023-01-01T00:00:00Z',
    modifiedAt: '2024-01-01T00:00:00Z'
  }
];

export const mockSubCategories: ProductSubCategory[] = [
  {
    subCategoryId: 'SC001',
    subCategoryName: 'Maize',
    mainCategoryId: 'MC001',
    mainCategoryName: 'Grains',
    remarks: 'Yellow and white maize',
    statusMaster: 'Active',
    createdAt: '2023-01-01T00:00:00Z',
    modifiedAt: '2024-01-01T00:00:00Z'
  },
  {
    subCategoryId: 'SC002',
    subCategoryName: 'Wheat',
    mainCategoryId: 'MC001',
    mainCategoryName: 'Grains',
    remarks: 'Bread wheat, durum wheat',
    statusMaster: 'Active',
    createdAt: '2023-01-01T00:00:00Z',
    modifiedAt: '2024-01-01T00:00:00Z'
  },
  {
    subCategoryId: 'SC003',
    subCategoryName: 'Rice',
    mainCategoryId: 'MC001',
    mainCategoryName: 'Grains',
    remarks: 'Paddy, milled rice',
    statusMaster: 'Active',
    createdAt: '2023-01-01T00:00:00Z',
    modifiedAt: '2024-01-01T00:00:00Z'
  },
  {
    subCategoryId: 'SC004',
    subCategoryName: 'Beans',
    mainCategoryId: 'MC002',
    mainCategoryName: 'Pulses',
    remarks: 'Various bean varieties',
    statusMaster: 'Active',
    createdAt: '2023-01-01T00:00:00Z',
    modifiedAt: '2024-01-01T00:00:00Z'
  },
  {
    subCategoryId: 'SC005',
    subCategoryName: 'NPK Fertilizer',
    mainCategoryId: 'MC003',
    mainCategoryName: 'Fertilizers',
    remarks: 'Compound fertilizers',
    statusMaster: 'Active',
    createdAt: '2023-01-01T00:00:00Z',
    modifiedAt: '2024-01-01T00:00:00Z'
  }
];
