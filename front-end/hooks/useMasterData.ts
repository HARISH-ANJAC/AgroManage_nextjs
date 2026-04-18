"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

/**
 * A generic hook to manage master data with TanStack Query and localStorage for persistence.
 * @param domain Unique key for the master (e.g., 'companies', 'stores', 'products')
 * @param initialData Initial data to seed if localStorage is empty
 * @param idPrefix Prefix for generating new IDs (e.g., 'CMP', 'STR', 'PRD')
 */
const EMPTY_ARRAY: any[] = [];

export function useMasterData(domain: string, initialData: any[] = [], idPrefix: string = "ID") {
  const queryClient = useQueryClient();
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

  // Audit helpers
  const getAuditData = () => {
    if (typeof window === 'undefined') return { macAddress: 'SERVER', user: 'System' };
    
    let mac = localStorage.getItem('client_mac_id');
    if (!mac) {
      mac = 'WEB-' + Math.random().toString(36).substring(2, 15).toUpperCase();
      localStorage.setItem('client_mac_id', mac);
    }
    
    const userJson = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');
    let user = 'Admin';
    let role = 'Admin';
    try {
      if (userJson) {
        const u = JSON.parse(userJson);
        user = u.LOGIN_NAME || u.username || 'Admin';
        role = u.role || 'Admin';
      }
    } catch (e) {}
    
    return { macAddress: mac, user, token, role };
  };

  const handleAuthError = (status: number) => {
    if (status === 401 || status === 403) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  };

  // Helper to find and map ID and keys to camelCase
  const toCamel = (s: string) => s.toLowerCase().replace(/_([a-z])/g, (m, c) => c.toUpperCase());

  const mapItem = (item: any, index: number) => {
    const normalized: any = {};
    const keys = Object.keys(item);
    
    // Find the ID column (Case Insensitive)
    const idKey = keys.find(k => k.toUpperCase() === 'ID' || k.toLowerCase() === 'id') || 
                  keys.find(k => k.toUpperCase() === 'SNO') || 
                  keys.find(k => k.toUpperCase().endsWith('_REF_NO')) ||
                  keys.find(k => k.toUpperCase().endsWith('_ID')) || 
                  keys[0]; 
    
    keys.forEach(key => {
      // If the key is already camelCase (contains uppercase but no underscore), leave it.
      // Otherwise, if it has underscores or is all caps, convert it.
      if (key.includes('_') || key === key.toUpperCase()) {
        normalized[toCamel(key)] = item[key];
      } else {
        normalized[key] = item[key];
      }
    });
    
    return { ...normalized, id: item[idKey] ?? `temp-id-${index}` };
  };

  // Fetch implementation from real API
  const fetchData = async () => {
    try {
      const { token } = getAuditData();
      const response = await fetch(`${BASE_URL}/${domain}`, {
          headers: { 
              'Authorization': `Bearer ${token}`
          }
      });

      if (response.status === 401 || response.status === 403) {
          handleAuthError(response.status);
          throw new Error('Unauthorized');
      }

      if (!response.ok) throw new Error(`Failed to fetch ${domain}`);
      const rawData = await response.json();
      const mapped = Array.isArray(rawData) ? rawData.map((item, idx) => mapItem(item, idx)) : [];
      
      // Fallback to initialData if API returns empty
      return mapped.length > 0 ? mapped : initialData.map((item, idx) => mapItem(item, idx));
    } catch (err) {
      console.warn(`Falling back to initial data for ${domain}`);
      return initialData.map((item, idx) => mapItem(item, idx));
    }
  };

  const { data = EMPTY_ARRAY, isLoading, error } = useQuery({
    queryKey: [domain],
    queryFn: fetchData,
    initialData: initialData.map((item, idx) => mapItem(item, idx))
  });

  // Add Mutation
  const addMutation = useMutation({
    mutationFn: async (newItem: any) => {
      const { token, ...audit } = getAuditData();
      const response = await fetch(`${BASE_URL}/${domain}`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...newItem, audit })
      });
      if (!response.ok) {
        handleAuthError(response.status);
        let errMsg = 'Failed to create';
        try {
          const errBody = await response.json();
          errMsg = errBody?.msg || errBody?.message || errMsg;
        } catch {}
        throw new Error(errMsg);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [domain] });
    },
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: async (updatedItem: any) => {
      const { id, ...body } = updatedItem;
      const { token, ...audit } = getAuditData();
      const response = await fetch(`${BASE_URL}/${domain}/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...body, audit })
      });
      if (!response.ok) {
        handleAuthError(response.status);
        let errMsg = 'Failed to update';
        try {
          const errBody = await response.json();
          errMsg = errBody?.msg || errBody?.message || errMsg;
        } catch {}
        throw new Error(errMsg);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [domain] });
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { token } = getAuditData();
      const response = await fetch(`${BASE_URL}/${domain}/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { 
            'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        handleAuthError(response.status);
        throw new Error('Failed to delete');
      }
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [domain] });
    },
  });

  // Bulk Delete Mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const { token } = getAuditData();
      const response = await fetch(`${BASE_URL}/${domain}/bulk-delete`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ids })
      });
      if (!response.ok) {
        handleAuthError(response.status);
        throw new Error('Failed to bulk delete');
      }
      return ids;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [domain] });
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
