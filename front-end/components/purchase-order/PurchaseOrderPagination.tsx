'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PurchaseOrderPaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
}

export function PurchaseOrderPagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange
}: PurchaseOrderPaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalItems === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mt-6">
      <div className="flex items-center gap-4">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Show</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-black text-slate-700 focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer"
        >
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
        </select>
        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest hidden xs:inline">
          Showing {startItem}-{endItem} of {totalItems}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 border border-slate-100 rounded-xl text-slate-400 hover:text-primary hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all active:scale-90"
        >
          <ChevronLeft size={18} />
        </button>
        
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`size-8 rounded-xl text-xs font-black transition-all active:scale-90 ${
                currentPage === page
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'text-slate-400 hover:text-primary hover:bg-slate-50 border border-transparent'
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 border border-slate-100 rounded-xl text-slate-400 hover:text-primary hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all active:scale-90"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
