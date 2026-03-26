"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function useGoodsReceiptStore() {
  const queryClient = useQueryClient();

  const getAuthToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  };

  const { data: grns = [], isLoading, refetch: refetchGrns } = useQuery({
    queryKey: ["goods-receipts"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/goods-receipts`, {
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });
      if (!response.ok) throw new Error("Failed to fetch GRNs");
      return response.json();
    }
  });

  const getGRNById = useCallback(async (id: string) => {
    // Double encoding for slash safety
    const encodedId = encodeURIComponent(encodeURIComponent(id));
    const response = await fetch(`${API_URL}/goods-receipts/${encodedId}`, {
      headers: { 'Authorization': `Bearer ${getAuthToken()}` }
    });
    if (!response.ok) return null;
    return response.json();
  }, []);

  const addMutation = useMutation({
    mutationFn: async (payload: any) => {
      const response = await fetch(`${API_URL}/goods-receipts`, {
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
      queryClient.invalidateQueries({ queryKey: ["goods-receipts"] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string, payload: any }) => {
      const encodedId = encodeURIComponent(encodeURIComponent(id));
      const response = await fetch(`${API_URL}/goods-receipts/${encodedId}`, {
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
      queryClient.invalidateQueries({ queryKey: ["goods-receipts"] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const encodedId = encodeURIComponent(encodeURIComponent(id));
      const response = await fetch(`${API_URL}/goods-receipts/${encodedId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${getAuthToken()}` }
      });
      if (!response.ok) throw new Error(await response.text());
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goods-receipts"] });
    }
  });

  return {
    grns,
    isLoading,
    refetchGrns,
    addGRN: addMutation.mutateAsync,
    updateGRN: (id: string, payload: any) => updateMutation.mutateAsync({ id, payload }),
    deleteGRN: deleteMutation.mutateAsync,
    getGRNById
  };
}
