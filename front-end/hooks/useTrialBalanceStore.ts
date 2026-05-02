import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export function useTrialBalanceStore(companyId?: number) {
  const queryClient = useQueryClient();

  const getAuthToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  };

  const authHeader = () => ({ Authorization: `Bearer ${getAuthToken()}` });

  // Fetch live trial balance
  const getLiveTrialBalance = useCallback(async (companyIdParam?: number) => {
    let url = `${API_URL}/accounting/trial-balance`;
    if (companyIdParam) url += `?companyId=${companyIdParam}`;
    
    const res = await fetch(url, { headers: authHeader() });
    if (!res.ok) throw new Error("Failed to fetch live trial balance");
    return res.json();
  }, []);

  // Fetch all saved trial balances (history)
  const queryStr = companyId ? `?companyId=${companyId}` : "";

  const { data: savedTrialBalances = [], isLoading, refetch } = useQuery({
    queryKey: ["savedTrialBalances", companyId],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/accounting/trial-balance/saved${queryStr}`, {
        headers: authHeader(),
      });
      if (!res.ok) throw new Error("Failed to fetch saved trial balances");
      return res.json();
    },
  });

  // Fetch single saved trial balance with details
  const getSavedTrialBalanceById = useCallback(async (tbRefNo: string) => {
    if (!tbRefNo) return null;
    const res = await fetch(
      `${API_URL}/accounting/trial-balance/saved/detail?id=${encodeURIComponent(tbRefNo)}`,
      { headers: authHeader() }
    );
    if (!res.ok) return null;
    return res.json();
  }, []);

  // Save a new trial balance snapshot
  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch(`${API_URL}/accounting/trial-balance/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save trial balance");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedTrialBalances"] });
    },
  });

  // Delete a saved trial balance
  const deleteMutation = useMutation({
    mutationFn: async (tbRefNo: string) => {
      const res = await fetch(
        `${API_URL}/accounting/trial-balance/saved?id=${encodeURIComponent(tbRefNo)}`,
        { method: "DELETE", headers: authHeader() }
      );
      if (!res.ok) throw new Error("Failed to delete trial balance snapshot");
      return tbRefNo;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedTrialBalances"] });
    },
  });

  return {
    savedTrialBalances,
    isLoading,
    refetch,
    getLiveTrialBalance,
    getSavedTrialBalanceById,
    saveTrialBalance: saveMutation.mutateAsync,
    deleteSavedTrialBalance: deleteMutation.mutateAsync,
  };
}
