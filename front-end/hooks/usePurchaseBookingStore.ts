"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Global State for Purchase Bookings (Invoices) with LocalStorage Persistence
 */

const STORAGE_KEY = "agromanage_purchase_bookings";

const listeners = new Set<Function>();
const notify = () => listeners.forEach(l => l());

const getStoredBookings = (): any[] => {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to load Purchase Bookings from storage", e);
    return [];
  }
};

const saveBookings = (bookings: any[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  notify();
};

export function usePurchaseBookingStore() {
  const [bookings, setBookings] = useState<any[]>(getStoredBookings());

  useEffect(() => {
    const handleChange = () => setBookings(getStoredBookings());
    listeners.add(handleChange);
    return () => {
      listeners.delete(handleChange);
    };
  }, []);

  const addBooking = useCallback((booking: any) => {
    const current = getStoredBookings();
    const newBooking = { 
      ...booking, 
      id: booking.id || `PB-${Date.now()}`,
      createdAt: new Date().toISOString() 
    };
    saveBookings([newBooking, ...current]);
    return newBooking;
  }, []);

  const updateBooking = useCallback((id: string, updatedData: any) => {
    const current = getStoredBookings();
    const updated = current.map(b => (b.id === id || b.invoiceNo === id) ? { ...b, ...updatedData } : b);
    saveBookings(updated);
  }, []);

  const deleteBooking = useCallback((id: string) => {
    const current = getStoredBookings();
    const filtered = current.filter(b => b.id !== id && b.invoiceNo !== id);
    saveBookings(filtered);
  }, []);

  const getBookingById = useCallback((id: string) => {
    return getStoredBookings().find(b => b.id === id || b.invoiceNo === id);
  }, []);

  return {
    bookings,
    addBooking,
    updateBooking,
    deleteBooking,
    getBookingById,
    isLoading: false
  };
}
