'use client';

import React from 'react';
import { Search, Filter, Calendar, ChevronDown } from 'lucide-react';

interface PurchaseOrderFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  supplierFilter: string;
  setSupplierFilter: (supplier: string) => void;
  suppliers: string[];
}

export function PurchaseOrderFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  supplierFilter,
  setSupplierFilter,
  suppliers
}: PurchaseOrderFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="md:col-span-1 relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search PO number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Supplier Filter */}
        <div className="relative group">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4 group-focus-within:text-primary transition-colors" />
          <select
            value={supplierFilter}
            onChange={(e) => setSupplierFilter(e.target.value)}
            className="w-full pl-10 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all appearance-none cursor-pointer"
          >
            <option value="All">All Suppliers</option>
            {suppliers.map((supplier) => (
              <option key={supplier} value={supplier}>{supplier}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 size-4 pointer-events-none" />
        </div>

        {/* Status Filter */}
        <div className="relative group">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4 group-focus-within:text-primary transition-colors" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all appearance-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Submitted">Pending</option>
            <option value="In-Approval">In-Approval</option>
            <option value="Approved">Approved</option>
            <option value="Completed">Delivered</option>
            <option value="Rejected">Rejected</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 size-4 pointer-events-none" />
        </div>

        {/* Date Range Placeholder */}
        <div className="relative group">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Date Range"
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all placeholder:text-slate-400"
            disabled
          />
        </div>
      </div>
    </div>
  );
}
