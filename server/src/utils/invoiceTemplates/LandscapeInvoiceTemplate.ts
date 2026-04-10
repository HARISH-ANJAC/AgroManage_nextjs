
/**
 * Landscape Invoice Template
 * Generates an HTML invoice string in landscape orientation with dynamic values.
 */

export interface LandscapeProductItem {
  description: string;
  refNo: string;
  quantity: number;
  uom: string;
  unitPrice: number;
  discountPercent: number;
  imageUrl?: string;
}

export interface LandscapeInvoiceParams {
  // Company/Header Details
  email?: string;
  vatRegNo?: string;
  taxNo?: string;
  referenceNo: string;

  // Invoice Items
  items: LandscapeProductItem[];

  // Global Totals
  extraDiscountPercent?: number; // Global discount after per-item discount
  vatPercent?: number; // e.g., 18

  // Issuance Details
  issuedByName: string;
  receivedByName?: string;

  // Customization
  termsAndConditions?: string[];
  bankDetails?: {
    name: string;
    accounts: { label: string; details: string; swift?: string }[];
    lipa?: string;
  };
}

/**
 * Format number with commas and fixed decimals
 */
const formatNumber = (num: number, decimals: number = 2): string => {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

/**
 * Generate the complete landscape invoice HTML
 */
export const LandscapeInvoice = (params: LandscapeInvoiceParams): string => {
  const email = params.email || 'accounts@azpfl.com, nelson@atoz.co.tz, shahil@atoz.co.tz';
  const vatRegNo = params.vatRegNo || '11005966H';
  const taxNo = params.taxNo || '100168065';
  const vatPercent = params.vatPercent ?? 18;
  const extraDiscountPercent = params.extraDiscountPercent ?? 0;
  const termsAndConditions = params.termsAndConditions || [
    'All goods are subject to our standard conditions of sale',
    'Prices are valid for 7 days',
    'Subject to availability of stock at the time of order',
    '*Highlighted items are "Special Net" products',
  ];

  const bankName = params.bankDetails?.name || 'Gupta Auto Spares & Hardware Limited';
  const bankAccounts = params.bankDetails?.accounts || [
    { label: 'CRDB TZS A/c No', details: '0150269464200, Arusha', swift: 'CORUTZTZ' },
    { label: 'DTB TZS A/c No', details: '0000407471, Arusha', swift: 'DTKETZTZ' },
  ];
  const lipa = params.bankDetails?.lipa || 'Gupta Auto Spares & Hardware Limited, Short Code: 7051601';

  let subtotalAmount = 0;

  // Generate table rows
  const itemRows = params.items
    .map((item, index) => {
      const netUnitPrice = item.unitPrice * (1 - item.discountPercent / 100);
      const amount = netUnitPrice * item.quantity;
      subtotalAmount += amount;

      return `
                <tr style="height: 100px;">
                    <td class="text-center">${index + 1}</td>
                    <td class="relative">
                        <div class="flex items-center justify-between">
                            <span class="max-w-[70%]">
                                ${item.description}
                            </span>
                            ${
                              item.imageUrl
                                ? `
                            <div class="w-16 h-16 bg-gray-50 flex items-center justify-center border border-gray-200 rounded">
                                <img src="${item.imageUrl}" class="w-full h-full object-contain" />
                            </div>`
                                : `
                            <div class="w-16 h-16 bg-gray-100 flex items-center justify-center border border-gray-300 rounded">
                                <svg viewBox="0 0 24 24" class="w-10 h-10 text-gray-400" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-12c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" />
                                </svg>
                            </div>`
                            }
                        </div>
                    </td>
                    <td class="text-center text-xs">${item.refNo}</td>
                    <td class="text-center font-bold">${formatNumber(item.quantity)}</td>
                    <td class="text-center">${item.uom}</td>
                    <td class="text-right">${formatNumber(item.unitPrice)}</td>
                    <td class="text-center">${formatNumber(item.discountPercent, 0)}%</td>
                    <td class="text-right">${formatNumber(netUnitPrice)}</td>
                    <td class="text-right font-bold">${formatNumber(amount)}</td>
                </tr>`;
    })
    .join('');

  const discountValue = subtotalAmount * (extraDiscountPercent / 100);
  const amountAfterDiscount = subtotalAmount - discountValue;
  const vatValue = amountAfterDiscount * (vatPercent / 100);
  const grandTotal = amountAfterDiscount + vatValue;

  return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Proforma Invoice - ${params.referenceNo}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @page {
            size: A4 landscape;
            margin: 10mm;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f3f4f6;
            padding: 20px;
        }

        .invoice-container {
            background-color: white;
            width: 1100px;
            margin: 0 auto;
            padding: 20px;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
            border: 1px solid #e5e7eb;
        }

        table {
            border-collapse: collapse;
            width: 100%;
        }

        th {
            background-color: #7a97c2;
            color: white;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.75rem;
            padding: 8px;
            border: 1px solid #4a5568;
        }

        td {
            border: 1px solid #4a5568;
            padding: 8px;
            font-size: 0.85rem;
            vertical-align: middle;
        }

        .bg-custom-blue {
            background-color: #7a97c2;
        }

        .text-red-strong {
            color: #e53e3e;
        }

        @media print {
            body {
                background: none;
                padding: 0;
            }

            .invoice-container {
                box-shadow: none;
                border: none;
                width: 100%;
            }

            .no-print {
                display: none;
            }
        }
    </style>
</head>

<body>


    <div class="invoice-container">
        <!-- Header Info -->
        <div class="flex justify-between items-start mb-4 text-xs font-semibold">
            <div>
                <p>Email: ${email}</p>
                <p>VAT Reg No.: ${vatRegNo} | Tax No.: ${taxNo}</p>
            </div>
            <div class="text-right">
                <p>Reference No. : ${params.referenceNo}</p>
            </div>
        </div>

        <!-- Main Items Table -->
        <table>
            <thead>
                <tr>
                    <th style="width: 5%;">Sr. No</th>
                    <th style="width: 35%;">Description</th>
                    <th style="width: 10%;">REF#</th>
                    <th style="width: 7%;">Qty.</th>
                    <th style="width: 7%;">UoM</th>
                    <th style="width: 10%;">Unit Price</th>
                    <th style="width: 7%;">DISC (%)</th>
                    <th style="width: 10%;">Net Unit Price</th>
                    <th style="width: 11%;">AMOUNT</th>
                </tr>
            </thead>
            <tbody>
                ${itemRows}
            </tbody>
        </table>

        <!-- Terms and Totals Section -->
        <div class="flex border-x border-b border-[#4a5568]">
            <!-- Left: Terms & Conditions -->
            <div class="w-3/5 p-3 border-r border-[#4a5568]">
                <h3 class="font-bold text-sm underline mb-2">Terms & Conditions:</h3>
                <ol class="text-xs space-y-1">
                    ${termsAndConditions.map((term, i) => `<li>${i + 1}. ${term}</li>`).join('')}
                </ol>
            </div>

            <!-- Right: Calculation Summary -->
            <div class="w-2/5">
                <div class="flex border-b border-[#4a5568]">
                    <div class="w-1/2 p-2 font-bold bg-gray-50 text-right pr-4">Sub Total</div>
                    <div class="w-1/2 p-2 text-right pr-4 font-bold">${formatNumber(subtotalAmount)}</div>
                </div>
                ${
                  extraDiscountPercent > 0
                    ? `
                <div class="flex border-b border-[#4a5568]">
                    <div class="w-1/2 p-2 font-bold bg-gray-50 text-right pr-4">Ex.Discount</div>
                    <div class="w-1/2 p-2 text-right pr-4 font-bold">${formatNumber(extraDiscountPercent)} % / ${formatNumber(discountValue)}</div>
                </div>`
                    : ''
                }
                <div class="flex border-b border-[#4a5568]">
                    <div class="w-1/2 p-2 font-bold bg-gray-50 text-right pr-4">VAT @ ${formatNumber(vatPercent)}%</div>
                    <div class="w-1/2 p-2 text-right pr-4 font-bold">${formatNumber(vatValue)}</div>
                </div>
                <div class="flex bg-gray-100">
                    <div class="w-1/2 p-2 font-bold text-right pr-4 text-sm uppercase">Total</div>
                    <div class="w-1/2 p-2 text-right pr-4 font-extrabold text-sm border-l border-[#4a5568]">${formatNumber(grandTotal)}</div>
                </div>
            </div>
        </div>

        <!-- Issuance & Signature -->
        <div class="grid grid-cols-2">
            <div
                class="border-l border-b border-r border-[#4a5568] bg-custom-blue p-2 text-xs font-bold text-white flex items-center h-12">
                Proforma Issued By Name : ${params.issuedByName}
            </div>
            <div class="border-b border-r border-[#4a5568] bg-custom-blue p-2 text-xs font-bold text-white h-12">
                Signature :
            </div>
            <div
                class="border-l border-b border-r border-[#4a5568] bg-[#9ab5db] p-2 text-xs font-bold h-12 flex items-center">
                Received By Name : ${params.receivedByName || ''}
            </div>
            <div class="border-b border-r border-[#4a5568] bg-[#9ab5db] p-2 text-xs font-bold h-12">
                Signature :
            </div>
        </div>

        <!-- Payment Options Footer -->
        <div class="mt-4 border border-[#4a5568] p-3 rounded-sm">
            <h3 class="font-bold text-xs underline mb-1">Payment Options</h3>
            <p class="text-xs font-bold mb-1">Bank Transfer: Name: ${bankName}</p>
            <p class="text-[10px] leading-tight">
                ${bankAccounts
                  .map(
                    (acc) =>
                      `${acc.label}: ${acc.details}${acc.swift ? `, SWIFT: ${acc.swift}` : ''}`
                  )
                  .join(' | ')}
            </p>
            ${
              lipa
                ? `<p class="text-[10px] font-bold mt-1">LIPA: ${lipa}</p>`
                : ''
            }
        </div>
    </div>

</body>

</html>`;
};
