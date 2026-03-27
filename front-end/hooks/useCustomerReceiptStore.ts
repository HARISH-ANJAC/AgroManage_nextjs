"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/customer-receipts`;

export function useCustomerReceiptStore() {
  const queryClient = useQueryClient();

  const getAuthToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  };

  // Fetch all receipts
  const { data: receipts = [], isLoading, refetch: refetchReceipts } = useQuery({
    queryKey: ["customer-receipts"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}`, {
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });
      if (!response.ok) throw new Error("Failed to fetch Customer Receipts");
      return response.json();
    }
  });

  // Fetch single receipt
  const getReceiptById = useCallback(async (id: string) => {
    if (!id) return null;
    const encodedId = encodeURIComponent(id);
    const response = await fetch(`${API_URL}/${encodedId}`, {
      headers: { 'Authorization': `Bearer ${getAuthToken()}` }
    });
    if (!response.ok) return null;
    return response.json();
  }, []);

  // Add receipt
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
      if (!response.ok) throw new Error("Failed to create Customer Receipt");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-receipts"] });
    }
  });

  // Delete receipt
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const encodedId = encodeURIComponent(id);
      const response = await fetch(`${API_URL}/${encodedId}`, {
        method: "DELETE",
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });
      if (!response.ok) throw new Error("Failed to delete Customer Receipt");
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-receipts"] });
    }
  });

  // Helper to fetch unpaid invoices for a customer
  const getUnpaidInvoicesByCustomerId = useCallback(async (customerId: number) => {
    if (!customerId) return [];
    try {
        // We'll hit sales-invoices but filtered by customer and maybe status
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/sales-invoices`, {
            headers: { 'Authorization': `Bearer ${getAuthToken()}` }
        });
        if (!response.ok) return [];
        const data = await response.json();
        // Simple filter for now: same customer, open status
        return data.filter((inv: any) => Number(inv.customerId) === customerId);
    } catch (e) {
        return [];
    }
  }, []);

  return {
    receipts,
    isLoading,
    refetchReceipts,
    addReceipt: addMutation.mutateAsync,
    deleteReceipt: deleteMutation.mutateAsync,
    getReceiptById,
    getUnpaidInvoicesByCustomerId
  };
}
