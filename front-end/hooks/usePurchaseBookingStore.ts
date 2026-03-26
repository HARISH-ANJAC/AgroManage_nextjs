"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function usePurchaseBookingStore() {
  const queryClient = useQueryClient();

  const getAuthToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  };

  const { data: bookings = [], isLoading, refetch: refetchBookings } = useQuery({
    queryKey: ["purchase-invoices"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/purchase-invoices`, {
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });
      if (!response.ok) throw new Error("Failed to fetch Purchase Invoices");
      return response.json();
    }
  });

  const getBookingById = useCallback(async (id: string) => {
    const response = await fetch(`${API_URL}/purchase-invoices?id=${encodeURIComponent(id)}`, {
      headers: { 'Authorization': `Bearer ${getAuthToken()}` }
    });
    if (!response.ok) return null;
    return response.json();
  }, []);

  const addMutation = useMutation({
    mutationFn: async (payload: any) => {
      const response = await fetch(`${API_URL}/purchase-invoices`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(await response.text());
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-invoices"] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string, payload: any }) => {
      const response = await fetch(`${API_URL}/purchase-invoices?id=${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(await response.text());
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-invoices"] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${API_URL}/purchase-invoices?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });
      if (!response.ok) throw new Error(await response.text());
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-invoices"] });
    }
  });

  const deleteBooking = async (id: string) => deleteMutation.mutateAsync(id);



  const uploadFile = async (id: string, fileData: any) => {
    const response = await fetch(`${API_URL}/purchase-invoices/upload?id=${encodeURIComponent(id)}`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(fileData)
    });
    if (!response.ok) throw new Error("Upload failed");
    return response.json();
  };

  const getFiles = async (id: string) => {
    const response = await fetch(`${API_URL}/purchase-invoices/files?id=${encodeURIComponent(id)}`, {
      headers: { 'Authorization': `Bearer ${getAuthToken()}` }
    });
    if (!response.ok) return [];
    return response.json();
  };

  return {
    bookings,
    isLoading,
    refetchBookings,
    addBooking: addMutation.mutateAsync,
    updateBooking: (id: string, payload: any) => updateMutation.mutateAsync({ id, payload }),
    deleteBooking,
    getBookingById,
    uploadFile,
    getFiles
  };
}
