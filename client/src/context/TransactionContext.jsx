// src/context/TransactionContext.jsx

import { createContext, useEffect, useState } from "react";
import api from "../utils/api";
import { toast } from "react-toastify";

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);

  // Get user from localStorage
  const getUser = () => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  };

  // SORT: Latest FIRST (by date, then by id)
  const sortByLatest = (data) => {
    return [...data].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      const dateDiff = dateB - dateA;
      if (dateDiff !== 0) return dateDiff;

      // fallback when same date → compare IDs (handle both string and numeric)
      const idA = typeof a.id === 'string' ? a.id : String(a.id);
      const idB = typeof b.id === 'string' ? b.id : String(b.id);
      return idB.localeCompare(idA);
    });
  };

  // Fetch user-specific transactions from MERN server
  const fetchTransactions = async () => {
    const user = getUser();
    if (!user) {
      setTransactions([]);
      return;
    }

    try {
      // Fetch user's transactions (backend automatically filters by token)
      const res = await api.get("/transactions");
      setTransactions(sortByLatest(res.data || []));
    } catch (err) {
      console.error("Error fetching transactions:", err);
      toast.error("Failed to load transactions.");
    }
  };

  useEffect(() => {
    fetchTransactions();
    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = () => {
      fetchTransactions();
    };
    window.addEventListener("storage", handleStorageChange);
    // Listen for custom event when user changes in same tab
    const handleUserChange = () => {
      fetchTransactions();
    };
    window.addEventListener("userChanged", handleUserChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userChanged", handleUserChange);
    };
  }, []);

  // ADD Transaction
  const addTransaction = async (tx) => {
    const user = getUser();
    if (!user) {
      toast.error("Please login to add transactions.");
      return;
    }

    try {
      const res = await api.post("/transactions", tx);

      setTransactions((prev) => sortByLatest([...prev, res.data]));
      toast.success("Transaction added!");
    } catch (err) {
      console.error("Error adding transaction:", err);
      toast.error("Failed to add transaction.");
    }
  };

  // DELETE Transaction
  const deleteTransaction = async (id) => {
    const user = getUser();
    if (!user) {
      toast.error("Please login to delete transactions.");
      return;
    }

    try {
      await api.delete(`/transactions/${id}`);

      setTransactions((prev) =>
        sortByLatest(prev.filter((t) => t.id !== id))
      );
      toast.info("Transaction deleted!");
    } catch (err) {
      console.error("Error deleting transaction:", err);
      toast.error("Failed to delete transaction.");
    }
  };

  // UPDATE Transaction
  const updateTransaction = async (updatedTx) => {
    const user = getUser();
    if (!user) {
      toast.error("Please login to update transactions.");
      return;
    }

    try {
      const res = await api.put(`/transactions/${updatedTx.id}`, updatedTx);

      setTransactions((prev) =>
        sortByLatest(prev.map((t) => (t.id === updatedTx.id ? res.data : t)))
      );

      toast.success("Transaction updated!");
    } catch (err) {
      console.error("Error updating transaction:", err);
      toast.error("Failed to update transaction.");
    }
  };

  // RESET All Transactions
  const resetAllTransactions = async () => {
    const user = getUser();
    if (!user) {
      toast.error("Please login to reset transactions.");
      return;
    }

    try {
      // Direct bulk deletion request
      await api.delete("/transactions");
      
      setTransactions([]);
      toast.success("All transactions have been reset!");
    } catch (err) {
      console.error("Error resetting transactions:", err);
      toast.error("Failed to reset transactions.");
    }
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        deleteTransaction,
        updateTransaction,
        resetAllTransactions,
        fetchTransactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
