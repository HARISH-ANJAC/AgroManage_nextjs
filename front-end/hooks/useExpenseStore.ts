import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function useExpenseStore() {
  const queryClient = useQueryClient();

  const getAuthToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  };

  // Fetch all expenses
  const { data: expenses = [], isLoading, refetch: refetchExpenses } = useQuery({
    queryKey: ["expenses"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/expenses`, {
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });
      if (!response.ok) throw new Error("Failed to fetch expenses");
      return response.json();
    }
  });

  // Fetch single expense
  const getExpenseById = useCallback(async (id: string) => {
    if (!id) return null;
    const encodedId = encodeURIComponent(id);
    const response = await fetch(`${API_URL}/expenses/${encodedId}`, {
      headers: { 'Authorization': `Bearer ${getAuthToken()}` }
    });
    if (!response.ok) return null;
    return response.json();
  }, []);

  // Add expense
  const addMutation = useMutation({
    mutationFn: async (payload: any) => {
      const response = await fetch(`${API_URL}/expenses`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.msg || "Failed to create expense");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    }
  });

  // Update expense
  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string, payload: any }) => {
       const encodedId = encodeURIComponent(id);
       const response = await fetch(`${API_URL}/expenses/${encodedId}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.msg || "Failed to update expense");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    }
  });

  // Delete expense
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const encodedId = encodeURIComponent(id);
      const response = await fetch(`${API_URL}/expenses/${encodedId}`, {
        method: "DELETE",
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });
      if (!response.ok) throw new Error("Failed to delete expense");
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    }
  });

  return {
    expenses,
    isLoading,
    refetchExpenses,
    getExpenseById,
    addExpense: addMutation.mutateAsync,
    updateExpense: (id: string, payload: any) => updateMutation.mutateAsync({ id, payload }),
    deleteExpense: deleteMutation.mutateAsync
  };
}
