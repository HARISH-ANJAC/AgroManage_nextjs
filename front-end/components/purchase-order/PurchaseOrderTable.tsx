'use client';

import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { PurchaseOrderHeader } from '@/app/mock';
import { PurchaseOrderRow } from './PurchaseOrderRow';

interface PurchaseOrderTableProps {
  orders: PurchaseOrderHeader[];
  sortConfig: { key: keyof PurchaseOrderHeader; direction: 'asc' | 'desc' } | null;
  onSort: (key: keyof PurchaseOrderHeader) => void;
}

export function PurchaseOrderTable({ orders, sortConfig, onSort }: PurchaseOrderTableProps) {
  const getSortIcon = (key: keyof PurchaseOrderHeader) => {
    if (sortConfig?.key !== key) return <div className="w-3 h-3" />;
    return sortConfig.direction === 'asc' ? <ChevronUp size={14} className="text-primary" /> : <ChevronDown size={14} className="text-primary" />;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Actions
              </th>
              <th 
                className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] cursor-pointer hover:text-slate-600 transition-colors"
                onClick={() => onSort('poRefNo')}
              >
                <div className="flex items-center gap-1">
                  PO Number {getSortIcon('poRefNo')}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] cursor-pointer hover:text-slate-600 transition-colors"
                onClick={() => onSort('supplierName')}
              >
                <div className="flex items-center gap-1">
                  Supplier {getSortIcon('supplierName')}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] cursor-pointer hover:text-slate-600 transition-colors"
                onClick={() => onSort('poDate')}
              >
                <div className="flex items-center gap-1">
                  Order Date {getSortIcon('poDate')}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] cursor-pointer hover:text-slate-600 transition-colors"
                onClick={() => onSort('finalPurchaseHdrAmount')}
              >
                <div className="flex items-center gap-1">
                  Total Amount {getSortIcon('finalPurchaseHdrAmount')}
                </div>
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {orders.length > 0 ? (
              orders.map((order) => (
                <PurchaseOrderRow key={order.poRefNo} order={order} />
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-slate-400 font-bold">No purchase orders found</p>
                    <p className="text-xs text-slate-300">Try adjusting your filters or search query</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
