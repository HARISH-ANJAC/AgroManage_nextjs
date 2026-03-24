"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Global State for Delivery Notes with LocalStorage Persistence
 */

const STORAGE_KEY = "agromanage_delivery_notes";

const listeners = new Set<Function>();
const notify = () => listeners.forEach(l => l());

const getStoredNotes = (): any[] => {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to load Delivery Notes from storage", e);
    return [];
  }
};

const saveNotes = (notes: any[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  notify();
};

export function useDeliveryNoteStore() {
  const [notes, setNotes] = useState<any[]>(getStoredNotes());

  useEffect(() => {
    const handleChange = () => setNotes(getStoredNotes());
    listeners.add(handleChange);
    return () => {
      listeners.delete(handleChange);
    };
  }, []);

  const addNote = useCallback((note: any) => {
    const current = getStoredNotes();
    const newNote = { 
      ...note, 
      id: note.id || `DN-${Date.now()}`,
      createdAt: new Date().toISOString() 
    };
    saveNotes([newNote, ...current]);
    return newNote;
  }, []);

  const updateNote = useCallback((id: string, updatedData: any) => {
    const current = getStoredNotes();
    const updated = current.map(n => (n.id === id || n.deliveryNoteRefNo === id) ? { ...n, ...updatedData } : n);
    saveNotes(updated);
  }, []);

  const deleteNote = useCallback((id: string) => {
    const current = getStoredNotes();
    const filtered = current.filter(n => n.id !== id && n.deliveryNoteRefNo !== id);
    saveNotes(filtered);
  }, []);

  const getNoteById = useCallback((id: string) => {
    return getStoredNotes().find(n => n.id === id || n.deliveryNoteRefNo === id);
  }, []);

  return {
    notes,
    addNote,
    updateNote,
    deleteNote,
    getNoteById,
    isLoading: false
  };
}
