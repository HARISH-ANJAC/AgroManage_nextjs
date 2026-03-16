// Utility functions for formatting mock data

/**
 * Format PO Number: PO/{ProductCode}/{Month}/{RunningNumber}
 * Product Codes: MA=Maize, WH=Wheat, RI=Rice, BE=Beans, FE=Fertilizer
 */
export const generatePONumber = (
  productCode: string, 
  month: string, 
  runningNumber: number
): string => {
  const paddedNumber = runningNumber.toString().padStart(3, '0');
  return `PO/${productCode}/${month}/${paddedNumber}`;
};

/**
 * Format GRN Number: GRN/{MM}/{NNN}
 */
export const generateGRNNumber = (month: string, runningNumber: number): string => {
  const paddedNumber = runningNumber.toString().padStart(3, '0');
  return `GRN/${month}/${paddedNumber}`;
};

/**
 * Format Sales Order Number: SO/{MM}/{NNN}
 */
export const generateSONumber = (month: string, runningNumber: number): string => {
  const paddedNumber = runningNumber.toString().padStart(3, '0');
  return `SO/${month}/${paddedNumber}`;
};

/**
 * Format Invoice Number: INV/{MM}/{NNN}
 */
export const generateInvoiceNumber = (month: string, runningNumber: number): string => {
  const paddedNumber = runningNumber.toString().padStart(3, '0');
  return `INV/${month}/${paddedNumber}`;
};

/**
 * Format Receipt Number: RCPT/{MM}/{NNN}
 */
export const generateReceiptNumber = (month: string, runningNumber: number): string => {
  const paddedNumber = runningNumber.toString().padStart(3, '0');
  return `RCPT/${month}/${paddedNumber}`;
};

/**
 * Get product code from product name/category
 */
export const getProductCode = (productName: string, categoryName: string): string => {
  const codeMap: Record<string, string> = {
    'Maize': 'MA',
    'Wheat': 'WH',
    'Rice': 'RI',
    'Beans': 'BE',
    'Fertilizer': 'FE',
    'NPK': 'FE'
  };
  
  // Try to match by category first
  if (categoryName && codeMap[categoryName]) {
    return codeMap[categoryName];
  }
  
  // Then try product name keywords
  for (const [key, value] of Object.entries(codeMap)) {
    if (productName.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }
  
  return 'XX'; // Default unknown code
};

/**
 * Format currency
 */
export const formatCurrency = (
  amount: number, 
  currency: string = 'USD', 
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Format date for display
 */
export const formatDate = (
  dateString: string, 
  format: 'short' | 'long' | 'iso' = 'short'
): string => {
  const date = new Date(dateString);
  
  switch (format) {
    case 'short':
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    case 'long':
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    case 'iso':
      return date.toISOString().split('T')[0];
    default:
      return date.toLocaleDateString();
  }
};

/**
 * Calculate three-way matching status
 */
export const calculateMatchingStatus = (
  poQty: number,
  grnQty: number,
  invoiceQty: number
): 'Pending' | 'Matched' | 'Mismatch' => {
  if (!poQty || !grnQty || !invoiceQty) return 'Pending';
  return (poQty === grnQty && grnQty === invoiceQty) ? 'Matched' : 'Mismatch';
};

/**
 * Calculate stock status based on quantity and reorder level
 */
export const calculateStockStatus = (
  availableQty: number,
  reorderLevel: number
): 'In Stock' | 'Low Stock' | 'Out of Stock' => {
  if (availableQty <= 0) return 'Out of Stock';
  if (availableQty <= reorderLevel) return 'Low Stock';
  return 'In Stock';
};
