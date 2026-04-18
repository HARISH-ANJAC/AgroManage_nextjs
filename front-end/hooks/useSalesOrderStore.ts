"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function useSalesOrderStore() {
  const queryClient = useQueryClient();

  const getAuthToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  };

  // Fetch all orders
  const { data: orders = [], isLoading, refetch: refetchOrders } = useQuery({
    queryKey: ["sales-orders"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/sales-orders`, {
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });
      if (!response.ok) throw new Error("Failed to fetch Sales Orders");
      return response.json();
    }
  });

  // Fetch single order
  const getOrderById = useCallback(async (id: string) => {
    const encodedId = encodeURIComponent(encodeURIComponent(id));
    const response = await fetch(`${API_URL}/sales-orders/${encodedId}`, {
      headers: { 'Authorization': `Bearer ${getAuthToken()}` }
    });
    if (!response.ok) return null;
    return response.json();
  }, []);

  // Add order
  const addMutation = useMutation({
    mutationFn: async (payload: any) => {
      const response = await fetch(`${API_URL}/sales-orders`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("Failed to create Sales Order");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales-orders"] });
    }
  });

  // Update order
  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string, payload: any }) => {
       const encodedId = encodeURIComponent(encodeURIComponent(id));
       const response = await fetch(`${API_URL}/sales-orders/${encodedId}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("Failed to update Sales Order");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales-orders"] });
    }
  });

  // Delete/Archive
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const encodedId = encodeURIComponent(encodeURIComponent(id));
      const response = await fetch(`${API_URL}/sales-orders/${encodedId}`, {
        method: "DELETE",
        headers: { 
          'Authorization': `Bearer ${getAuthToken()}` 
        }
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.msg || "Failed to delete Sales Order");
      }
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales-orders"] });
    }
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const response = await fetch(`${API_URL}/sales-orders/bulk-delete`, {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}` 
        },
        body: JSON.stringify({ ids })
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.msg || "Failed to delete Sales Orders");
      }
      return ids;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales-orders"] });
    }
  });

  return {
    orders,
    isLoading,
    refetchOrders,
    addOrder: addMutation.mutateAsync,
    updateOrder: (id: string, payload: any) => updateMutation.mutateAsync({ id, payload }),
    deleteOrder: deleteMutation.mutateAsync,
    bulkDelete: bulkDeleteMutation.mutateAsync,
    getOrderById
  };
}
