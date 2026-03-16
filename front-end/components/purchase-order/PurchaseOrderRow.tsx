'use client';

import React from 'react';
import { Eye, Edit2, MoreVertical } from 'lucide-react';
import { PurchaseOrderHeader, formatCurrency, formatDate } from '@/app/mock';

interface PurchaseOrderRowProps {
  order: PurchaseOrderHeader;
}

export function PurchaseOrderRow({ order }: PurchaseOrderRowProps) {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Submitted':
      case 'In-Approval':
        return 'bg-amber-50 text-amber-600 border-amber-100'; // Pending
      case 'Approved':
        return 'bg-blue-50 text-blue-600 border-blue-100'; // Approved
      case 'Completed':
        return 'bg-green-50 text-green-600 border-green-100'; // Delivered
      case 'Rejected':
        return 'bg-rose-50 text-rose-600 border-rose-100';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const statusLabel = 
    order.statusEntry === 'Submitted' || order.statusEntry === 'In-Approval' ? 'Pending' :
    order.statusEntry === 'Completed' ? 'Delivered' : order.statusEntry;

  return (
    <tr className="group hover:bg-slate-50/80 transition-all duration-300">
      <td className="px-6 py-4">
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-primary transition-all shadow-sm border border-transparent hover:border-slate-100" title="View Order">
            <Eye size={16} />
          </button>
          <button className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-secondary transition-all shadow-sm border border-transparent hover:border-slate-100" title="Edit Order">
            <Edit2 size={16} />
          </button>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="text-sm font-black text-slate-800 tracking-tight">{order.poRefNo}</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase">{order.purchaseType}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-slate-700 truncate max-w-[200px]">{order.supplierName}</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{order.storeName || 'Main Store'}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm text-slate-500 font-semibold">{formatDate(order.poDate)}</span>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm font-black text-slate-900">{formatCurrency(order.finalPurchaseHdrAmount)}</span>
      </td>
      <td className="px-6 py-4">
        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(order.statusEntry)}`}>
          {statusLabel}
        </span>
      </td>
    </tr>
  );
}
