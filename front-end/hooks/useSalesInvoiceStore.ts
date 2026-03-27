"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/sales-invoices`;
export function useSalesInvoiceStore() {
  const queryClient = useQueryClient();

  const getAuthToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  };

  // Fetch all sales invoices
  const { data: invoices = [], isLoading, refetch: refetchInvoices } = useQuery({
    queryKey: ["sales-invoices"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}`, {
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });
      if (!response.ok) throw new Error("Failed to fetch Sales Invoices");
      return response.json();
    }
  });

  // Fetch single sales invoice
  const getInvoiceById = useCallback(async (id: string) => {
    if (!id) return null;
    const encodedId = encodeURIComponent(id);
    const response = await fetch(`${API_URL}/${encodedId}`, {
      headers: { 'Authorization': `Bearer ${getAuthToken()}` }
    });
    if (!response.ok) return null;
    return response.json();
  }, []);

  // Add sales invoice
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
      if (!response.ok) throw new Error("Failed to create Sales Invoice");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales-invoices"] });
    }
  });

  // Update sales invoice
  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string, payload: any }) => {
       const encodedId = encodeURIComponent(id);
       const response = await fetch(`${API_URL}/${encodedId}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("Failed to update Sales Invoice");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales-invoices"] });
    }
  });

  // Delete sales invoice
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const encodedId = encodeURIComponent(id);
      const response = await fetch(`${API_URL}/${encodedId}`, {
        method: "DELETE",
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });
      if (!response.ok) throw new Error("Failed to delete Sales Invoice");
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales-invoices"] });
    }
  });

  return {
    invoices,
    isLoading,
    refetchInvoices,
    addInvoice: addMutation.mutateAsync,
    updateInvoice: (id: string, payload: any) => updateMutation.mutateAsync({ id, payload }),
    deleteInvoice: deleteMutation.mutateAsync,
    getInvoiceById
  };
}
