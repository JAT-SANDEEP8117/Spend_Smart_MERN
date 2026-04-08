// src/components/ResetButton.jsx
import { useState, useContext } from "react";
import { TransactionContext } from "../context/TransactionContext";
import { FaTrash, FaExclamationTriangle } from "react-icons/fa";
import { toast } from "react-toastify";

const ResetButton = () => {
  const { transactions, resetAllTransactions } = useContext(TransactionContext);
  const [showWarning, setShowWarning] = useState(false);

  const handleReset = () => {
    if (transactions.length === 0) {
      toast.info("No transactions to reset!");
      return;
    }
    setShowWarning(true);
  };

  const confirmReset = () => {
    resetAllTransactions();
    setShowWarning(false);
  };

  const cancelReset = () => {
    setShowWarning(false);
  };

  if (showWarning) {
    return (
      <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50" onClick={cancelReset}>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-[420px] max-w-[90vw] border border-gray-200 dark:border-gray-700" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <FaExclamationTriangle className="text-red-600 dark:text-red-400 text-xl" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Warning!</h2>
          </div>
          
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Are you sure you want to delete <strong>ALL {transactions.length} transactions</strong>? 
            This action cannot be undone!
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={cancelReset}
              className="px-5 py-2.5 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={confirmReset}
              className="px-5 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-medium"
            >
              Yes, Delete All
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleReset}
      className="px-5 py-2.5 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-all transform hover:scale-105 active:scale-95 font-medium flex items-center gap-2"
    >
      <FaTrash />
      Reset All
    </button>
  );
};

export default ResetButton;







