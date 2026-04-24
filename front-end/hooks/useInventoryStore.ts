import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export function useInventoryStore() {
  const getAuthToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  };

  const authHeader = () => ({ Authorization: `Bearer ${getAuthToken()}` });

  // Fetch stock ledger report
  const getStockLedger = useCallback(async (storeId: number, productId?: number) => {
    if (!storeId) return [];
    
    let url = `${API_URL}/inventory/stock-ledger?storeId=${storeId}`;
    if (productId) url += `&productId=${productId}`;

    const res = await fetch(url, { headers: authHeader() });
    if (!res.ok) return [];
    return res.json();
  }, []);

  return {
    getStockLedger,
  };
}
