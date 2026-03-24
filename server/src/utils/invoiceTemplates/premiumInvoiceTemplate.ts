export interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  uom?: string;
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
    companyAddress,
    companyContact,
    companyLogoUrl,
    clientName,
    clientAddress,
    clientContact,
    items,
    subtotal,
    taxRate,
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

  const primaryColor = '#1A2E28'; // Deep AgroBusiness Green
  const accentColor = '#059669';  // Emerald Green
  const lightBg = '#F8FAFC';      // Slate 50
  const borderColor = '#E2E8F0';  // Slate 200
  const textColor = '#0F172A';    // Slate 900
  const mutedColor = '#64748B';   // Slate 500

  // HTML structure with inline CSS to ensure perfect rendering across standard PDF generators
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice ${invoiceNo}</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
      <style>
          @media print {
            @page {
                size: A4;
                margin: 0;
            }
            body { margin: 0; padding: 0; }
          }
          * { box-sizing: border-box; }
          body {
              font-family: 'Inter', sans-serif;
              color: ${textColor};
              background-color: #FFFFFF;
              margin: 0;
              padding: 0;
              line-height: 1.5;
              -webkit-font-smoothing: antialiased;
          }
          .invoice-box {
              max-width: 800px;
              margin: auto;
              padding: 50px;
              background-color: #FFFFFF;
              font-size: 14px;
          }
          .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              border-bottom: 2px solid ${primaryColor};
              padding-bottom: 30px;
              margin-bottom: 40px;
          }
          .header-left {
              max-width: 50%;
          }
          .header-right {
              text-align: right;
              max-width: 50%;
          }
          .logo {
              max-width: 180px;
              object-fit: contain;
              margin-bottom: 15px;
          }
          .company-name {
              font-size: 24px;
              font-weight: 800;
              color: ${primaryColor};
              margin: 0 0 5px 0;
              letter-spacing: -0.5px;
          }
          .company-details {
              color: ${mutedColor};
              font-size: 13px;
              line-height: 1.6;
          }
          .invoice-title {
              font-size: 38px;
              font-weight: 800;
              color: ${primaryColor};
              margin: 0 0 10px 0;
              text-transform: uppercase;
              letter-spacing: 2px;
          }
          .invoice-meta {
              display: flex;
              flex-direction: column;
              gap: 5px;
              font-size: 13px;
          }
          .meta-row {
              display: flex;
              justify-content: flex-end;
              gap: 15px;
          }
          .meta-label {
              color: ${mutedColor};
              font-weight: 500;
          }
          .meta-value {
              font-weight: 700;
              min-width: 100px;
          }
          .bill-to-section {
              display: flex;
              justify-content: space-between;
              background-color: ${lightBg};
              padding: 30px;
              border-radius: 12px;
              margin-bottom: 40px;
          }
          .bill-to h3, .ship-to h3 {
              margin: 0 0 10px 0;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: ${accentColor};
              font-weight: 700;
          }
          .client-name {
              font-size: 18px;
              font-weight: 700;
              margin: 0 0 5px 0;
          }
          .client-details {
              color: ${mutedColor};
              line-height: 1.6;
              white-space: pre-wrap;
          }
          table {
              width: 100%;
              border-collapse: separate;
              border-spacing: 0;
              margin-bottom: 40px;
          }
          th, td {
              padding: 15px;
              text-align: left;
          }
          th {
              background-color: ${primaryColor};
              color: #FFFFFF;
              font-weight: 600;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
          }
          th:first-child { border-top-left-radius: 8px; border-bottom-left-radius: 8px; }
          th:last-child { border-top-right-radius: 8px; border-bottom-right-radius: 8px; text-align: right;}
          
          tr.item-row td {
              border-bottom: 1px solid ${borderColor};
              color: ${textColor};
          }
          tr.item-row:last-child td {
              border-bottom: none;
          }
          .item-desc { font-weight: 600; }
          .item-rate, .item-qty { color: ${mutedColor}; }
          .text-right { text-align: right; }
          .text-center { text-align: center; }
          
          .summary-section {
              display: flex;
              justify-content: space-between;
              margin-bottom: 50px;
          }
          .notes {
              width: 50%;
              padding-right: 30px;
          }
          .notes h4 {
              margin: 0 0 8px 0;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: ${mutedColor};
          }
          .notes p {
              font-size: 13px;
              color: ${mutedColor};
              line-height: 1.6;
          }
          .totals {
              width: 40%;
              background-color: ${lightBg};
              padding: 25px;
              border-radius: 12px;
          }
          .total-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 12px;
              font-size: 14px;
              color: ${mutedColor};
          }
          .total-row.grand-total {
              margin-top: 15px;
              padding-top: 15px;
              border-top: 2px dashed ${borderColor};
              font-size: 20px;
              font-weight: 800;
              color: ${primaryColor};
              margin-bottom: 0;
          }
          .footer {
              text-align: center;
              border-top: 1px solid ${borderColor};
              padding-top: 30px;
              color: ${mutedColor};
              font-size: 12px;
          }
          .footer p { margin: 5px 0; }
          
          .accent-bar {
              height: 8px;
              width: 100%;
              background: linear-gradient(90deg, ${primaryColor} 0%, ${accentColor} 100%);
              position: absolute;
              top: 0;
              left: 0;
          }
      </style>
  </head>
  <body>
      <div class="accent-bar"></div>
      <div class="invoice-box">
          
          <div class="header">
              <div class="header-left">
                  ${companyLogoUrl ? `<img src="${companyLogoUrl}" class="logo" alt="Company Logo"/>` : ''}
                  <h1 class="company-name">${companyName || 'AgroBusiness Enterprise'}</h1>
                  <div class="company-details">
                      ${companyAddress ? companyAddress.replace(/\\n/g, '<br/>') : ''}<br/>
                      ${companyContact ? companyContact : ''}
                  </div>
              </div>
              
              <div class="header-right">
                  <h2 class="invoice-title">INVOICE</h2>
                  <div class="invoice-meta">
                      <div class="meta-row">
                          <span class="meta-label">Invoice #</span>
                          <span class="meta-value">${invoiceNo}</span>
                      </div>
                      <div class="meta-row">
                          <span class="meta-label">Date</span>
                          <span class="meta-value">${new Date(date).toLocaleDateString()}</span>
                      </div>
                      ${dueDate ? `
                      <div class="meta-row">
                          <span class="meta-label">Due Date</span>
                          <span class="meta-value">${new Date(dueDate).toLocaleDateString()}</span>
                      </div>
                      ` : ''}
                  </div>
              </div>
          </div>

          <div class="bill-to-section">
              <div class="bill-to">
                  <h3>Bill To</h3>
                  <div class="client-name">${clientName}</div>
                  <div class="client-details">
                      ${clientAddress ? clientAddress.replace(/\\n/g, '<br/>') : ''}<br/>
                      ${clientContact ? clientContact : ''}
                  </div>
              </div>
          </div>

          <table>
              <thead>
                  <tr>
                      <th>Description</th>
                      <th class="text-center">Quantity</th>
                      <th class="text-right">Rate</th>
                      <th class="text-right">Amount</th>
                  </tr>
              </thead>
              <tbody>
                  ${items.map(item => `
                  <tr class="item-row">
                      <td class="item-desc">${item.description}</td>
                      <td class="text-center item-qty">${item.quantity} ${item.uom || ''}</td>
                      <td class="text-right item-rate">${formatCurrency(item.rate)}</td>
                      <td class="text-right item-desc">${formatCurrency(item.amount)}</td>
                  </tr>
                  `).join('')}
              </tbody>
          </table>

          <div class="summary-section">
              <div class="notes">
                  ${notes ? `
                  <h4>Notes</h4>
                  <p>${notes.replace(/\\n/g, '<br/>')}</p>
                  ` : ''}
                  ${terms ? `
                  <h4 style="margin-top: 20px;">Terms & Conditions</h4>
                  <p>${terms.replace(/\\n/g, '<br/>')}</p>
                  ` : ''}
              </div>
              
              <div class="totals">
                  <div class="total-row">
                      <span>Subtotal</span>
                      <span>${formatCurrency(subtotal)}</span>
                  </div>
                  ${discount ? `
                  <div class="total-row">
                      <span>Discount</span>
                      <span style="color: #ef4444;">-${formatCurrency(discount)}</span>
                  </div>
                  ` : ''}
                  ${taxAmount ? `
                  <div class="total-row">
                      <span>Tax ${taxRate ? `(${taxRate}%)` : ''}</span>
                      <span>${formatCurrency(taxAmount)}</span>
                  </div>
                  ` : ''}
                  <div class="total-row grand-total">
                      <span>Total</span>
                      <span>${formatCurrency(total)}</span>
                  </div>
              </div>
          </div>

          <div class="footer">
              <p>Thank you for your business!</p>
              <p style="color:#94A3B8; font-size:10px;">Generated securely by AgroManage Enterprise ERP</p>
          </div>
      </div>
  </body>
  </html>
  `;
};
