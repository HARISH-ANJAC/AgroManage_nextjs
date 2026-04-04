// 
/**
 * Premium Invoice Template
 * Generates an HTML invoice string with dynamic values.
 * Logo is expected to be at /src/assets/logo.png (or the provided path)
 */

export interface ProductItem {
  productName: string;
  quantity: number;
  uom: string; // Unit of Measure, e.g., "KG"
  rate: number; // per unit rate in TZS
  vatPercent: number; // e.g., 18
}

export interface PremiumInvoiceParams {
  // Company/Logo details
  logoPath?: string;
  companyName?: string;

  // Customer details
  customerName: string;
  customerAddress: string;

  // Invoice details
  date: string; // e.g., "24/03/2024"
  invoiceNo: string;

  // Product details (multiple items)
  items: ProductItem[];

  // Optional: Additional notes
  notes?: string;

  // Footer
  footerNote?: string;
}

/**
 * Format number with commas as thousands separators
 */
const formatNumber = (num: number): string => {
  return num.toLocaleString('en-US');
};

/**
 * Calculate VAT amount
 */
const calculateVat = (subtotal: number, vatPercent: number): number => {
  return (subtotal * vatPercent) / 100;
};

/**
 * Generate the complete premium invoice HTML
 */
export const PremiumInvoice = (params: PremiumInvoiceParams): string => {
  // Calculate aggregate values across all items
  let grandSubtotal = 0;
  let grandVatTotal = 0;

  // Generate table rows and calculate totals
  const itemRows = params.items.map((item, index) => {
    const subtotal = item.quantity * item.rate;
    const vatAmount = calculateVat(subtotal, item.vatPercent);
    const itemTotal = subtotal + vatAmount;

    grandSubtotal += subtotal;
    grandVatTotal += vatAmount;

    return `
          <tr>
            <td>${index + 1}</td>
            <td class="text-1">${item.productName}</td>
            <td class="text-center">${formatNumber(item.quantity)}</td>
            <td class="text-center">${item.uom}</td>
            <td class="text-center">${formatNumber(item.rate)} TZS</td>
            <td class="text-center">TZS ${formatNumber(subtotal)}</td>
            <td class="text-center">${item.vatPercent}%</td>
            <td class="text-end">TZS ${formatNumber(vatAmount)}</td>
          </tr>`;
  }).join('');

  const grandTotal = grandSubtotal + grandVatTotal;

  // Format currency values for summary
  const formattedGrandSubtotal = `TZS ${formatNumber(grandSubtotal)}`;
  const formattedGrandVatAmount = `TZS ${formatNumber(grandVatTotal)}`;
  const formattedGrandTotal = `TZS ${formatNumber(grandTotal)}`;

  // Logo handling: use provided path or fallback to server asset path
  const logoPath = params.logoPath || '/src/assets/logo.png';
  const companyName = params.companyName || 'PRIME HARVEST';

  // Default notes if not provided
  const notes = params.notes || 'Thank you for your business. Please contact us for any queries.';
  const footerNote = params.footerNote || `Generated on: ${params.date}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Invoice - ${params.invoiceNo}</title>
<meta name="author" content="Agro Business" />

<!-- Web Fonts -->
<link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Poppins:100,200,300,400,500,600,700,800,900' type='text/css' />

<!-- Stylesheet -->
<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css"/>
<style>
/* CSS Variables */
:root { --bs-themecolor: #0071cc; }

/* Base Styles */
body { 
    font-family: 'Poppins', sans-serif; 
    color: #333; 
    background-color: #e7e9ed; 
    margin: 0; 
    padding: 0;
}

/* A4 Container Setup */
.invoice-container { 
    background: #fff; 
    width: 210mm;
    min-height: 297mm;
    margin: 20px auto; 
    padding: 20mm;
    border-radius: 5px; 
    box-shadow: 0 0 15px rgba(0,0,0,0.1); 
    box-sizing: border-box;
}

/* Table Styles */
.table thead th { 
    border-bottom: 2px solid #dee2e6; 
    background-color: #f8f9fa !important; 
    -webkit-print-color-adjust: exact;
}
.text-1 { font-size: 14px; }
.text-end { text-align: right !important; }
.summary-table { width: 330px; margin-left: auto; }
.mb-4 { margin-bottom: 1.5rem !important; }

/* Print Specific Settings */
@media print {
    body { 
        background: none; 
        margin: 0; 
    }
    .invoice-container { 
        margin: 0; 
        box-shadow: none; 
        width: 100%;
        height: auto;
    }
    footer { 
        position: fixed; 
        bottom: 20mm; 
        left: 0; 
        right: 0; 
    }
    .no-print { display: none; }
    .bg-light { background-color: #f8f9fa !important; -webkit-print-color-adjust: exact; }
}
</style>
</head>
<body>
<!-- Container -->
<div class="container-fluid invoice-container">
  <!-- Header -->
  <header>
    <div class="row align-items-center gy-3">
      <div class="col-sm-7 text-start">
        <img id="logo" src="${logoPath}" title="${companyName}" alt="${companyName}" style="max-width: 100px;" onerror="this.style.display='none'; document.getElementById('logo-text').style.display='block';" />
        <h2 id="logo-text" style="display:none; color:var(--bs-themecolor);">${companyName}</h2>
      </div>
      <div class="col-sm-5 text-end">
        <h4 class="text-7 mb-0">INVOICE</h4>
      </div>
    </div>
    <hr>
  </header>
  
  <!-- Main Content -->
  <main>
    <!-- Top Details -->
    <div class="row mb-4">
      <div class="col-6"> 
        <strong>Invoiced To:</strong>
        <address class="text-1">
          ${params.customerName}<br />
          ${params.customerAddress}
        </address>
      </div>
      <div class="col-6 text-end"> 
        <div class="text-1">
            <strong>Date:</strong> ${params.date}<br>
            <strong>Invoice No:</strong> ${params.invoiceNo}
        </div>
      </div>
    </div>

    <!-- Main Product Table -->
    <div class="table-responsive">
      <table class="table table-bordered">
        <thead>
          <tr class="bg-light">
            <th>#</th>
            <th>Product</th>
            <th class="text-center">Qty</th>
            <th class="text-center">UOM</th>
            <th class="text-center">Rate</th>
            <th class="text-center">Amount</th>
            <th class="text-center">VAT%</th>
            <th class="text-end">VAT Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
        </tbody>
      </table>
    </div>

    <!-- Summary Table -->
    <div class="row mt-3">
        <div class="col-7"></div>
        <div class="col-5">
            <table class="table table-sm table-bordered summary-table">
                <tr>
                  <td class="text-end"><strong>Subtotal:</strong></td>
                  <td class="text-end">${formattedGrandSubtotal}</td>
                </tr>
                <tr>
                  <td class="text-end"><strong>VAT Total:</strong></td>
                  <td class="text-end">${formattedGrandVatAmount}</td>
                </tr>
                <tr class="bg-light">
                  <td class="text-end"><strong>Grand Total:</strong></td>
                  <td class="text-end"><strong>${formattedGrandTotal}</strong></td>
                </tr>
              </table>
        </div>
    </div>
  </main>
  
  <!-- Footer -->
  <footer class="text-center mt-5">
    <hr>
    <p class="text-1 mb-1">${footerNote}</p>
    <p class="text-1"><strong>NOTE:</strong> ${notes}</p>
  </footer>
</div>
</body>
</html>`;
};

/**
 * Example usage:
 * 
 * const invoiceHtml = PremiumInvoice({
 *   customerName: "Smith Rhodes",
 *   customerAddress: "15 Main Court, High Street\\nNew York, NY 10001",
 *   date: "24/03/2024",
 *   invoiceNo: "12345",
 *   items: [
 *     { productName: "Maize Grade A", quantity: 100, uom: "KG", rate: 500, vatPercent: 18 },
 *     { productName: "Wheat Flour", quantity: 50, uom: "KG", rate: 1200, vatPercent: 18 }
 *   ],
 *   logoPath: "/src/assets/logo.png",
 *   companyName: "PRIME HARVEST",
 *   notes: "Thank you for your business. Please contact us for any queries.",
 * });
 */