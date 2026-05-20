"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/purchase-payments`;

export function usePurchasePaymentStore() {
  const queryClient = useQueryClient();

  const getAuthToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  };

  // Fetch all payments
  const { data: payments = [], isLoading, refetch: refetchPayments } = useQuery({
    queryKey: ["purchase-payments"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}`, {
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });
      if (!response.ok) throw new Error("Failed to fetch Purchase Payments");
      return response.json();
    }
  });

  // Fetch single payment
  const getPaymentById = useCallback(async (id: string) => {
    if (!id) return null;
    const encodedId = encodeURIComponent(id);
    const response = await fetch(`${API_URL}/${encodedId}`, {
      headers: { 'Authorization': `Bearer ${getAuthToken()}` }
    });
    if (!response.ok) return null;
    return response.json();
  }, []);

  // Add payment
  const addMutation = useMutation({
    mutationFn: async (payload: any) => {
      const response = await fetch(`${API_URL}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("Failed to create Purchase Payment");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-payments"] });
    }
  });

  // Update payment
  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      const encodedId = encodeURIComponent(id);
      const response = await fetch(`${API_URL}/${encodedId}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update Purchase Payment");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-payments"] });
    }
  });

  // Delete payment
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const encodedId = encodeURIComponent(id);
      const response = await fetch(`${API_URL}/${encodedId}`, {
        method: "DELETE",
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });
      if (!response.ok) throw new Error("Failed to delete Purchase Payment");
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-payments"] });
    }
  });

  // Helper to fetch unpaid invoices for a supplier
  const getUnpaidInvoicesBySupplierId = useCallback(async (supplierId: number) => {
    if (!supplierId) return [];
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/purchase-invoices`, {
            headers: { 'Authorization': `Bearer ${getAuthToken()}` }
        });
        if (!response.ok) return [];
        const data = await response.json();
        // Filter by supplier and status (e.g. Closed means submitted)
        return data.filter((inv: any) => Number(inv.supplierId) === supplierId);
    } catch (e) {
        return [];
    }
  }, []);

  return {
    payments,
    isLoading,
    refetchPayments,
    addPayment: addMutation.mutateAsync,
    updatePayment: updateMutation.mutateAsync,
    deletePayment: deleteMutation.mutateAsync,
    getPaymentById,
    getUnpaidInvoicesBySupplierId
  };
}
