'use client';

import React, { useState, useMemo } from 'react';
import { mockPurchaseOrders, PurchaseOrderHeader } from '@/app/mock';
import { PurchaseOrderHeader as PageHeader } from '@/components/purchase-order/PurchaseOrderHeader';
import { PurchaseOrderFilters } from '@/components/purchase-order/PurchaseOrderFilters';
import { PurchaseOrderTable } from '@/components/purchase-order/PurchaseOrderTable';
import { PurchaseOrderPagination } from '@/components/purchase-order/PurchaseOrderPagination';

import { useRouter } from 'next/navigation';

export default function PurchaseOrdersPage() {
  const router = useRouter();

  // Auth check
  React.useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
      router.replace('/login');
    }
  }, [router]);

  // State for filtering, sorting and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [supplierFilter, setSupplierFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState<{ key: keyof PurchaseOrderHeader; direction: 'asc' | 'desc' } | null>({
    key: 'poDate',
    direction: 'desc'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Extract unique suppliers for filter
  const suppliers = useMemo(() => {
    return Array.from(new Set(mockPurchaseOrders.map(po => po.supplierName || ''))).filter(Boolean).sort();
  }, []);

  // Filter and Sort logic
  const filteredAndSortedOrders = useMemo(() => {
    let result = [...mockPurchaseOrders];

    // Search
    if (searchQuery) {
      result = result.filter(po => 
        po.poRefNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        po.supplierName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status Filter
    if (statusFilter !== 'All') {
      // Map simplified statuses if needed, but here we use actual statusEntry
      result = result.filter(po => po.statusEntry === statusFilter);
    }

    // Supplier Filter
    if (supplierFilter !== 'All') {
      result = result.filter(po => po.supplierName === supplierFilter);
    }

    // Sorting
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === undefined || bValue === undefined) return 0;

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [searchQuery, statusFilter, supplierFilter, sortConfig]);

  // Pagination logic
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedOrders.slice(start, start + itemsPerPage);
  }, [filteredAndSortedOrders, currentPage, itemsPerPage]);

  const handleSort = (key: keyof PurchaseOrderHeader) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <main className="flex-1 flex flex-col min-w-0 bg-[#fafafa]">
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header Section */}
        <PageHeader onAddClick={() => console.log('Add PO clicked')} />

        {/* Filters Section */}
        <PurchaseOrderFilters
          searchQuery={searchQuery}
          setSearchQuery={(q) => { setSearchQuery(q); setCurrentPage(1); }}
          statusFilter={statusFilter}
          setStatusFilter={(s) => { setStatusFilter(s); setCurrentPage(1); }}
          supplierFilter={supplierFilter}
          setSupplierFilter={(sup) => { setSupplierFilter(sup); setCurrentPage(1); }}
          suppliers={suppliers}
        />

        {/* Table Section */}
        <PurchaseOrderTable
          orders={paginatedOrders}
          sortConfig={sortConfig}
          onSort={handleSort}
        />

        {/* Pagination Section */}
        <PurchaseOrderPagination
          currentPage={currentPage}
          totalItems={filteredAndSortedOrders.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }}
        />
      </div>
    </main>
  );
}
