"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Global State for Sales Orders with LocalStorage Persistence
 */

const STORAGE_KEY = "agromanage_sales_orders";

const listeners = new Set<Function>();
const notify = () => listeners.forEach(l => l());

const getStoredOrders = (): any[] => {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to load Sales Orders from storage", e);
    return [];
  }
};

const saveOrders = (orders: any[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  notify();
};

export function useSalesOrderStore() {
  const [orders, setOrders] = useState<any[]>(getStoredOrders());

  useEffect(() => {
    const handleChange = () => setOrders(getStoredOrders());
    listeners.add(handleChange);
    return () => {
      listeners.delete(handleChange);
    };
  }, []);

  const addOrder = useCallback((order: any) => {
    const current = getStoredOrders();
    const newOrder = { 
      ...order, 
      id: order.id || `SO-${Date.now()}`,
      createdAt: new Date().toISOString() 
    };
    saveOrders([newOrder, ...current]);
    return newOrder;
  }, []);

  const updateOrder = useCallback((id: string, updatedData: any) => {
    const current = getStoredOrders();
    const updated = current.map(o => (o.id === id || (o.header?.soRefNo || o.soRefNo) === id) ? { ...o, ...updatedData } : o);
    saveOrders(updated);
  }, []);

  const deleteOrder = useCallback((id: string) => {
    const current = getStoredOrders();
    const filtered = current.filter(o => o.id !== id && (o.header?.soRefNo || o.soRefNo) !== id);
    saveOrders(filtered);
  }, []);

  const getOrderById = useCallback((id: string) => {
    return getStoredOrders().find(o => o.id === id || (o.header?.soRefNo || o.soRefNo) === id);
  }, []);

  return {
    orders,
    addOrder,
    updateOrder,
    deleteOrder,
    getOrderById,
    isLoading: false
  };
}
