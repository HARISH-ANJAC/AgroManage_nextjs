export interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  uom?: string;
  vatPercent?: number;  // new fields to match the updated table
  vatAmount?: number;
}

export interface InvoiceData {
  invoiceNo: string;
  date: string;
  dueDate?: string;
  companyName: string;
  companyAddress: string;
  companyContact?: string;
  companyLogoUrl?: string;
  clientName: string;
  clientAddress: string;
  clientContact?: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate?: number;
  taxAmount?: number;
  discount?: number;
  total: number;
  currency: string;
  notes?: string;
  terms?: string;
}

export const generatePremiumInvoiceHTML = (data: InvoiceData): string => {
  const {
    invoiceNo,
    date,
    dueDate,
    companyName,
    companyLogoUrl,
    clientName,
    clientAddress,
    clientContact,
    items,
    subtotal,
    taxAmount,
    discount,
    total,
    currency,
    notes,
    terms,
  } = data;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Invoice - ${invoiceNo}</title>

<!-- Web Fonts -->
<link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Poppins:100,200,300,400,500,600,700,800,900' type='text/css'>

<!-- Stylesheet -->
<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css"/>
<style>
/* CSS Variables */
:root { --bs-themecolor: #10B981; }

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
.summary-table { width: 300px; margin-left: auto; }
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
    /* Ensure background colors print */
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
		  ${companyLogoUrl 
            ? `<img id="logo" src="${companyLogoUrl}" title="${companyName}" alt="${companyName}" style="max-width: 150px;" onerror="this.style.display='none'; document.getElementById('logo-text').style.display='block';" />
               <h2 id="logo-text" style="display:none; color:var(--bs-themecolor); font-weight:800; margin:0;">${companyName}</h2>` 
            : `<h2 id="logo-text" style="color:var(--bs-themecolor); font-weight:800; margin:0; text-transform:uppercase;">${companyName}</h2>`}
		</div>
		<div class="col-sm-5 text-end">
		  <h4 class="mb-0" style="font-weight:700; font-size: 24px;">INVOICE</h4>
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
        <address class="text-1 mt-1">
          <strong>${clientName}</strong><br />
          ${clientAddress ? clientAddress.replace(/\n/g, '<br />') : ''}<br />
          ${clientContact ? clientContact : ''}
        </address>
      </div>
      <div class="col-6 text-end"> 
        <div class="text-1 mt-1">
            <strong>Date:</strong> ${new Date(date).toLocaleDateString()}<br>
            <strong>Invoice No:</strong> ${invoiceNo}
            ${dueDate ? `<br><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}` : ''}
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
          ${items.map((item, index) => `
		  <tr>
			<td>${index + 1}</td>
			<td class="text-1">${item.description}</td>
			<td class="text-center">${item.quantity}</td>
			<td class="text-center">${item.uom || '-'}</td>
			<td class="text-center">${formatCurrency(item.rate)}</td>
			<td class="text-center">${formatCurrency(item.amount)}</td>
			<td class="text-center">${item.vatPercent || 0}%</td>
			<td class="text-end">${formatCurrency(item.vatAmount || 0)}</td>
		  </tr>
          `).join('')}
		</tbody>
	  </table>
	</div>

    <!-- Summary (Small Table) -->
	<div class="row mt-3">
        <div class="col-7">
            <div class="text-1 text-muted" style="font-size: 13px;">
                ${notes ? `<strong>Notes:</strong><br/>${notes.replace(/\n/g, '<br/>')}<br/><br/>` : ''}
                ${terms ? `<strong>Terms & Conditions:</strong><br/>${terms.replace(/\n/g, '<br/>')}` : ''}
            </div>
        </div>
		<div class="col-5">
			<table class="table table-sm table-bordered summary-table">
				<tr>
				  <td class="text-end text-1"><strong>Subtotal:</strong></td>
				  <td class="text-end text-1">${formatCurrency(subtotal)}</td>
				</tr>
                ${discount ? `
				<tr>
				  <td class="text-end text-1 text-danger"><strong>Discount:</strong></td>
				  <td class="text-end text-1 text-danger">-${formatCurrency(discount)}</td>
				</tr>
                ` : ''}
                ${taxAmount ? `
				<tr>
				  <td class="text-end text-1"><strong>VAT:</strong></td>
				  <td class="text-end text-1">${formatCurrency(taxAmount)}</td>
				</tr>
                ` : ''}
				<tr class="bg-light">
				  <td class="text-end"><strong>Total:</strong></td>
				  <td class="text-end" style="color:#0F172A; font-size: 16px;"><strong>${formatCurrency(total)}</strong></td>
				</tr>
			</table>
		</div>
	</div>
  </main>
  
  <!-- Footer -->
  <footer class="text-center mt-5">
	<hr>
	<p class="text-1 mb-1">Generated on: ${new Date().toLocaleString()}</p>
	<p class="text-1"><strong>NOTE:</strong> Thank you for your business. Please contact us for any queries.</p>
  </footer>
</div>
</body>
</html>`;
};
