import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export function useJournalStore(companyId?: number, module?: string) {
  const queryClient = useQueryClient();

  const getAuthToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  };

  const authHeader = () => ({ Authorization: `Bearer ${getAuthToken()}` });

  // Fetch all journal entries (with optional company & module filters)
  const params = new URLSearchParams();
  if (companyId) params.set("companyId", String(companyId));
  if (module) params.set("module", module);
  const queryStr = params.toString() ? `?${params.toString()}` : "";

  const { data: journals = [], isLoading, refetch } = useQuery({
    queryKey: ["journals", companyId, module],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/accounting/journals${queryStr}`, {
        headers: authHeader(),
      });
      if (!res.ok) throw new Error("Failed to fetch journals");
      return res.json();
    },
  });

  // Fetch single journal with details
  const getJournalById = useCallback(async (refNo: string) => {
    if (!refNo) return null;
    const res = await fetch(
      `${API_URL}/accounting/journals/detail?id=${encodeURIComponent(refNo)}`,
      { headers: authHeader() }
    );
    if (!res.ok) return null;
    return res.json();
  }, []);

  // Delete a journal entry
  const deleteMutation = useMutation({
    mutationFn: async (refNo: string) => {
      const res = await fetch(
        `${API_URL}/accounting/journals?id=${encodeURIComponent(refNo)}`,
        { method: "DELETE", headers: authHeader() }
      );
      if (!res.ok) throw new Error("Failed to delete journal entry");
      return refNo;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journals"] });
    },
  });

  // Fetch ledger transaction history
  const getLedgerReport = useCallback(async (ledgerId?: number, groupId?: number) => {
    if (!ledgerId && !groupId) return [];
    let url = `${API_URL}/accounting/ledger-report?`;
    if (ledgerId) url += `ledgerId=${ledgerId}`;
    else if (groupId) url += `groupId=${groupId}`;

    const res = await fetch(url, { headers: authHeader() });
    if (!res.ok) return [];
    return res.json();
  }, []);

  return {
    journals,
    isLoading,
    refetch,
    getJournalById,
    getLedgerReport,
    deleteJournal: deleteMutation.mutateAsync,
  };
}
