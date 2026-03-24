"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Global State for Expenses with LocalStorage Persistence
 */

const STORAGE_KEY = "agromanage_expenses";

const listeners = new Set<Function>();
const notify = () => listeners.forEach(l => l());

const getStoredExpenses = (): any[] => {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to load expenses from storage", e);
    return [];
  }
};

const saveExpenses = (expenses: any[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  notify();
};

export function useExpenseStore() {
  const [expenses, setExpenses] = useState<any[]>(getStoredExpenses());

  useEffect(() => {
    const handleChange = () => setExpenses(getStoredExpenses());
    listeners.add(handleChange);
    return () => {
      listeners.delete(handleChange);
    };
  }, []);

  const addExpense = useCallback((expense: any) => {
    const current = getStoredExpenses();
    const newExpense = { 
      ...expense, 
      id: expense.id || `EXP-${Date.now()}`,
      createdAt: new Date().toISOString() 
    };
    saveExpenses([newExpense, ...current]);
    return newExpense;
  }, []);

  const updateExpense = useCallback((id: string, updatedData: any) => {
    const current = getStoredExpenses();
    const updated = current.map(e => (e.id === id || e.header?.expenseRefNo === id) ? { ...e, ...updatedData } : e);
    saveExpenses(updated);
  }, []);

  const deleteExpense = useCallback((id: string) => {
    const current = getStoredExpenses();
    const filtered = current.filter(e => e.id !== id && e.header?.expenseRefNo !== id);
    saveExpenses(filtered);
  }, []);

  return {
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    isLoading: false
  };
}
