"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Global State for Customer Receipts with LocalStorage Persistence
 */

const STORAGE_KEY = "agromanage_customer_receipts";

const listeners = new Set<Function>();
const notify = () => listeners.forEach(l => l());

const getStoredReceipts = (): any[] => {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to load Customer Receipts from storage", e);
    return [];
  }
};

const saveReceipts = (receipts: any[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(receipts));
  notify();
};

export function useCustomerReceiptStore() {
  const [receipts, setReceipts] = useState<any[]>(getStoredReceipts());

  useEffect(() => {
    const handleChange = () => setReceipts(getStoredReceipts());
    listeners.add(handleChange);
    return () => {
      listeners.delete(handleChange);
    };
  }, []);

  const addReceipt = useCallback((receipt: any) => {
    const current = getStoredReceipts();
    const newReceipt = { 
      ...receipt, 
      id: receipt.id || `CR-${Date.now()}`,
      createdAt: new Date().toISOString() 
    };
    saveReceipts([newReceipt, ...current]);
    return newReceipt;
  }, []);

  const updateReceipt = useCallback((id: string, updatedData: any) => {
    const current = getStoredReceipts();
    const updated = current.map(r => (r.id === id || r.receiptNo === id) ? { ...r, ...updatedData } : r);
    saveReceipts(updated);
  }, []);

  const deleteReceipt = useCallback((id: string) => {
    const current = getStoredReceipts();
    const filtered = current.filter(r => r.id !== id && r.receiptNo !== id);
    saveReceipts(filtered);
  }, []);

  const getReceiptById = useCallback((id: string) => {
    return getStoredReceipts().find(r => r.id === id || r.receiptNo === id);
  }, []);

  return {
    receipts,
    addReceipt,
    updateReceipt,
    deleteReceipt,
    getReceiptById,
    isLoading: false
  };
}
