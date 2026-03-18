"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * A generic hook to manage master data with TanStack Query and localStorage for persistence.
 * @param domain Unique key for the master (e.g., 'companies', 'stores', 'products')
 * @param initialData Initial data to seed if localStorage is empty
 * @param idPrefix Prefix for generating new IDs (e.g., 'CMP', 'STR', 'PRD')
 */
export function useMasterData(domain: string, initialData: any[] = [], idPrefix: string = "ID") {
  const queryClient = useQueryClient();
  const storageKey = `agro_master_${domain}`;

  // Fetch implementation (currently uses localStorage)
  const fetchData = async () => {
    // Simulating an API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse storage", e);
      }
    }
    // Seed initial data if not in storage
    localStorage.setItem(storageKey, JSON.stringify(initialData));
    return initialData;
  };

  const { data = [], isLoading, error } = useQuery({
    queryKey: [domain],
    queryFn: fetchData,
  });

  const saveToStorage = (newData: any[]) => {
    localStorage.setItem(storageKey, JSON.stringify(newData));
  };

  // Add Mutation
  const addMutation = useMutation({
    mutationFn: async (newItem: any) => {
      const current = await fetchData();
      const newId = `${idPrefix}${String(current.length + 1).padStart(3, "0")}`;
      const updated = [...current, { id: newId, ...newItem }];
      saveToStorage(updated);
      return updated;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData([domain], updated);
    },
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: async (updatedItem: any) => {
      const current = await fetchData();
      const updated = current.map((item: any) => 
        item.id === updatedItem.id ? { ...item, ...updatedItem } : item
      );
      saveToStorage(updated);
      return updated;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData([domain], updated);
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const current = await fetchData();
      const updated = current.filter((item: any) => item.id !== id);
      saveToStorage(updated);
      return updated;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData([domain], updated);
    },
  });

  // Bulk Delete Mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const current = await fetchData();
      const updated = current.filter((item: any) => !ids.includes(item.id));
      saveToStorage(updated);
      return updated;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData([domain], updated);
    },
  });

  return {
    data,
    isLoading,
    error,
    add: addMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    remove: deleteMutation.mutateAsync,
    bulkRemove: bulkDeleteMutation.mutateAsync,
  };
}
