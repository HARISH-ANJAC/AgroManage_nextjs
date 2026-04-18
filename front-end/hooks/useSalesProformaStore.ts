"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function useSalesProformaStore() {
  const queryClient = useQueryClient();

  const getAuthToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  };

  // Fetch all proformas
  const { data: proformas = [], isLoading, refetch: refetchProformas } = useQuery({
    queryKey: ["sales-proformas"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/sales-proformas`, {
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });
      if (!response.ok) throw new Error("Failed to fetch Sales Proformas");
      return response.json();
    }
  });

  // Fetch single proforma
  const getProformaById = useCallback(async (id: string) => {
    const encodedId = encodeURIComponent(encodeURIComponent(id));
    const response = await fetch(`${API_URL}/sales-proformas/${encodedId}`, {
      headers: { 'Authorization': `Bearer ${getAuthToken()}` }
    });
    if (!response.ok) return null;
    return response.json();
  }, []);

  // Add proforma
  const addMutation = useMutation({
    mutationFn: async (payload: any) => {
      const response = await fetch(`${API_URL}/sales-proformas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("Failed to create Sales Proforma");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales-proformas"] });
    }
  });

  // Update proforma
  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string, payload: any }) => {
      const encodedId = encodeURIComponent(encodeURIComponent(id));
      const response = await fetch(`${API_URL}/sales-proformas/${encodedId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("Failed to update Sales Proforma");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales-proformas"] });
    }
  });

  // Delete Proforma
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const encodedId = encodeURIComponent(encodeURIComponent(id));
      const response = await fetch(`${API_URL}/sales-proformas/${encodedId}`, {
        method: "DELETE",
        headers: { 
          'Authorization': `Bearer ${getAuthToken()}` 
        }
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.msg || "Failed to delete Sales Proforma");
      }
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales-proformas"] });
    }
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const response = await fetch(`${API_URL}/sales-proformas/bulk-delete`, {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}` 
        },
        body: JSON.stringify({ ids })
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.msg || "Failed to delete Sales Proformas");
      }
      return ids;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales-proformas"] });
    }
  });

  return {
    proformas,
    isLoading,
    refetchProformas,
    addProforma: addMutation.mutateAsync,
    updateProforma: (id: string, payload: any) => updateMutation.mutateAsync({ id, payload }),
    deleteProforma: deleteMutation.mutateAsync,
    bulkDelete: bulkDeleteMutation.mutateAsync,
    getProformaById,
  };
}
