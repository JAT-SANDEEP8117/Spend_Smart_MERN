// src/pages/Transactions.jsx
import { useContext, useState, useMemo } from "react";
import { TransactionContext } from "../context/TransactionContext";

import AddTransaction from "../features/transactions/AddTransaction";
import EditTransaction from "../features/transactions/EditTransaction";
import TransactionList from "../features/transactions/TransactionList";
import TypeFilter from "../features/transactions/filters/TypeFilter";
import SortFilter from "../features/transactions/filters/SortFilter";
import ResetButton from "../components/ResetButton";

const Transactions = () => {
  const { transactions, deleteTransaction, updateTransaction } = useContext(TransactionContext);

  const [editOpen, setEditOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  // Filter and sort transactions
  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter((t) => t.type === filterType);
    }

    // Sort transactions
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "latest":
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          if (dateB - dateA !== 0) return dateB - dateA;
          const idA = typeof a.id === 'string' ? a.id : String(a.id);
          const idB = typeof b.id === 'string' ? b.id : String(b.id);
          return idB.localeCompare(idA);
        
        case "oldest":
          const dateA2 = new Date(a.date);
          const dateB2 = new Date(b.date);
          if (dateA2 - dateB2 !== 0) return dateA2 - dateB2;
          const idA2 = typeof a.id === 'string' ? a.id : String(a.id);
          const idB2 = typeof b.id === 'string' ? b.id : String(b.id);
          return idA2.localeCompare(idB2);
        
        case "amount-high":
          return b.amount - a.amount;
        
        case "amount-low":
          return a.amount - b.amount;
        
        case "category":
          return a.category.localeCompare(b.category);
        
        default:
          return 0;
      }
    });

    return filtered;
  }, [transactions, filterType, sortBy]);

  const handleEdit = (transaction) => {
    setSelectedTransaction(transaction);
    setEditOpen(true);
  };

  const handleUpdate = (updated) => {
    updateTransaction(updated);
    setEditOpen(false);
  };

  return (
    <div className="text-gray-900 dark:text-white animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <div className="flex items-center gap-3">
          <ResetButton />
          <AddTransaction />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filter by Type
            </label>
            <TypeFilter filterType={filterType} setFilterType={setFilterType} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sort By
            </label>
            <SortFilter sortBy={sortBy} setSortBy={setSortBy} />
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 text-center md:text-right">
            Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredAndSortedTransactions.length}</span> transaction{filteredAndSortedTransactions.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      <TransactionList
        transactions={filteredAndSortedTransactions}
        onDelete={deleteTransaction}
        onEdit={handleEdit}
      />

      {/* Edit Modal */}
      <EditTransaction
        open={editOpen}
        setOpen={setEditOpen}
        transaction={selectedTransaction}
        saveEdit={handleUpdate}
      />
    </div>
  );
};

export default Transactions;
