"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function usePurchaseOrderStore() {
  const queryClient = useQueryClient();

  const getAuthToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  };

  // Fetch all orders
  const { data: orders = [], isLoading, refetch: refetchOrders } = useQuery({
    queryKey: ["purchase-orders"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/purchase-orders`, {
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });
      if (!response.ok) throw new Error("Failed to fetch POs");
      return response.json();
    }
  });

  // Fetch single order
  const getOrderById = useCallback(async (id: string) => {
    // Double encoding to safely pass slashes through certain router configurations
    const encodedId = encodeURIComponent(encodeURIComponent(id));
    const response = await fetch(`${API_URL}/purchase-orders/${encodedId}`, {
      headers: { 'Authorization': `Bearer ${getAuthToken()}` }
    });
    if (!response.ok) return null;
    return response.json();
  }, []);

  // Add order
  const addMutation = useMutation({
    mutationFn: async (payload: any) => {
      const response = await fetch(`${API_URL}/purchase-orders`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("Failed to create PO");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
    }
  });

  // Update order (placeholder for now as controller doesn't have a direct PUT yet, but we can reuse create or add update)
  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string, payload: any }) => {
       const encodedId = encodeURIComponent(encodeURIComponent(id));
       const response = await fetch(`${API_URL}/purchase-orders/${encodedId}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("Failed to update PO");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
    }
  });

  // Approve
  const approveMutation = useMutation({
    mutationFn: async ({ id, level, status, remarks, user }: any) => {
      const response = await fetch(`${API_URL}/purchase-orders/approve/${encodeURIComponent(id)}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({ level, status, remarks, user })
      });
      if (!response.ok) throw new Error("Approval failed");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
    }
  });

  // Archive (Delete)
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${API_URL}/purchase-orders/archive/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });
      if (!response.ok) throw new Error("Failed to archive PO");
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
    }
  });

  return {
    orders,
    isLoading,
    refetchOrders,
    addOrder: addMutation.mutateAsync,
    updateOrder: (id: string, payload: any) => updateMutation.mutateAsync({ id, payload }),
    approveOrder: approveMutation.mutateAsync,
    deleteOrder: deleteMutation.mutateAsync,
    getOrderById
  };
}
