"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function useDeliveryNoteStore() {
  const queryClient = useQueryClient();

  const getAuthToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  };

  // Fetch all delivery notes
  const { data: notes = [], isLoading, refetch: refetchNotes } = useQuery({
    queryKey: ["delivery-notes"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/delivery-notes`, {
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });
      if (!response.ok) throw new Error("Failed to fetch Delivery Notes");
      return response.json();
    }
  });

  // Fetch single delivery note
  const getNoteById = useCallback(async (id: string) => {
    if (!id) return null;
    const encodedId = encodeURIComponent(id);
    const response = await fetch(`${API_URL}/delivery-notes/${encodedId}`, {
      headers: { 'Authorization': `Bearer ${getAuthToken()}` }
    });
    if (!response.ok) return null;
    return response.json();
  }, []);

  // Add delivery note
  const addMutation = useMutation({
    mutationFn: async (payload: any) => {
      const response = await fetch(`${API_URL}/delivery-notes`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("Failed to create Delivery Note");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery-notes"] });
    }
  });

  // Update delivery note
  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string, payload: any }) => {
       const encodedId = encodeURIComponent(id);
       const response = await fetch(`${API_URL}/delivery-notes/${encodedId}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("Failed to update Delivery Note");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery-notes"] });
    }
  });

  // Delete delivery note
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const encodedId = encodeURIComponent(id);
      const response = await fetch(`${API_URL}/delivery-notes/${encodedId}`, {
        method: "DELETE",
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });
      if (!response.ok) throw new Error("Failed to delete Delivery Note");
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery-notes"] });
    }
  });

  return {
    notes,
    isLoading,
    refetchNotes,
    addNote: addMutation.mutateAsync,
    updateNote: (id: string, payload: any) => updateMutation.mutateAsync({ id, payload }),
    deleteNote: deleteMutation.mutateAsync,
    getNoteById
  };
}
