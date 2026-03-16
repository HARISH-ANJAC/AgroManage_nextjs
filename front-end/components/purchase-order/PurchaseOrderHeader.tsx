'use client';

import React from 'react';
import { Plus } from 'lucide-react';

interface PurchaseOrderHeaderProps {
  onAddClick?: () => void;
}

export function PurchaseOrderHeader({ onAddClick }: PurchaseOrderHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight">Purchase Orders</h1>
        <p className="text-sm text-slate-500 font-medium">Manage and track your procurement orders</p>
      </div>
      <button
        onClick={onAddClick}
        className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-95 text-sm"
      >
        <Plus size={18} strokeWidth={2.5} />
        <span>Create Purchase Order</span>
      </button>
    </div>
  );
}
