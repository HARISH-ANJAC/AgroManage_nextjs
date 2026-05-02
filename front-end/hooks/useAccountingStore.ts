"use client";

import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface CashBookEntry {
  journalRefNo: string;
  date: string;
  narration: string;
  moduleName: string;
  moduleRefNo: string;
  ledgerId: number;
  ledgerName: string;
  debit: string | number;
  credit: string | number;
  remarks: string;
}

export interface CashFlowData {
  operating: {
    netProfit: number;
    adjustments: { label: string; amount: number }[];
    workingCapital: { label: string; amount: number }[];
  };
  investing: { label: string; amount: number }[];
  financing: { label: string; amount: number }[];
}

export function useAccountingStore(companyId?: number, startDate?: string, endDate?: string) {
  const getAuthToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  };

  const handleAuthError = (status: number) => {
    if (status === 401 || status === 403) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
  };

  const { data: cashBook = null, isLoading: isLoadingCashBook, refetch: refetchCashBook } = useQuery({
    queryKey: ["cash-book", companyId, startDate, endDate],
    queryFn: async () => {
      if (!companyId) return null;
      const params = new URLSearchParams();
      params.set("companyId", String(companyId));
      if (startDate) params.set("startDate", startDate);
      if (endDate) params.set("endDate", endDate);

      const response = await fetch(`${API_URL}/accounting/cash-book?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });

      if (response.status === 401 || response.status === 403) {
        handleAuthError(response.status);
        throw new Error('Unauthorized');
      }

      if (!response.ok) throw new Error("Failed to fetch cash book");
      return response.json();
    },
    enabled: !!companyId
  });

  const { data: cashFlow = null, isLoading: isLoadingCashFlow, refetch: refetchCashFlow } = useQuery({
    queryKey: ["cash-flow", companyId, startDate, endDate],
    queryFn: async () => {
      if (!companyId) return null;
      const params = new URLSearchParams();
      params.set("companyId", String(companyId));
      if (startDate) params.set("startDate", startDate);
      if (endDate) params.set("endDate", endDate);

      const response = await fetch(`${API_URL}/accounting/cash-flow?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });

      if (response.status === 401 || response.status === 403) {
        handleAuthError(response.status);
        throw new Error('Unauthorized');
      }

      if (!response.ok) throw new Error("Failed to fetch cash flow");
      return response.json();
    },
    enabled: !!companyId
  });

  return {
    cashBook,
    cashFlow,
    isLoading: isLoadingCashBook || isLoadingCashFlow,
    refetchCashBook,
    refetchCashFlow
  };
}
