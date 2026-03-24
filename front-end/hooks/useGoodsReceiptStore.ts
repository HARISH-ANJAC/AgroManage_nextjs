"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Global State for Goods Receipts (GRN) with LocalStorage Persistence
 * This allows managing GRNs without a backend while maintaining data across page refreshes.
 */

const STORAGE_KEY = "agromanage_goods_receipts";

// Simple event emitter to sync state across different instances of the hook
const listeners = new Set<Function>();
const notify = () => listeners.forEach(l => l());

const getStoredGRNs = (): any[] => {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to load GRNs from storage", e);
    return [];
  }
};

const saveGRNs = (grns: any[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(grns));
  notify();
};

export function useGoodsReceiptStore() {
  const [grns, setGrns] = useState<any[]>(getStoredGRNs());

  useEffect(() => {
    const handleChange = () => setGrns(getStoredGRNs());
    listeners.add(handleChange);
    return () => {
      listeners.delete(handleChange);
    };
  }, []);

  const addGRN = useCallback((grn: any) => {
    const current = getStoredGRNs();
    const newGRN = { 
      ...grn, 
      id: grn.id || `GRN-${Date.now()}`,
      createdAt: new Date().toISOString() 
    };
    saveGRNs([newGRN, ...current]);
    return newGRN;
  }, []);

  const updateGRN = useCallback((id: string, updatedData: any) => {
    const current = getStoredGRNs();
    const updated = current.map(g => (g.id === id || g.grnRefNo === id) ? { ...g, ...updatedData } : g);
    saveGRNs(updated);
  }, []);

  const deleteGRN = useCallback((id: string) => {
    const current = getStoredGRNs();
    const filtered = current.filter(g => g.id !== id && g.grnRefNo !== id);
    saveGRNs(filtered);
  }, []);

  const getGRNById = useCallback((id: string) => {
    return getStoredGRNs().find(g => g.id === id || g.grnRefNo === id);
  }, []);

  return {
    grns,
    addGRN,
    updateGRN,
    deleteGRN,
    getGRNById,
    isLoading: false // Local state is instantaneous
  };
}
