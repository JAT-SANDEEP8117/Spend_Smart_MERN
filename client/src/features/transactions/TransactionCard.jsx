// src/features/transactions/TransactionCard.jsx

import { FaTrash, FaEdit } from "react-icons/fa";

const TransactionCard = ({ transaction, onDelete, onEdit }) => {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between sm:items-center gap-3 hover:shadow-lg transition-shadow">
      {/* Left Side */}
      <div className="flex-1">
        <div className="font-semibold text-gray-900 dark:text-white capitalize text-lg mb-1">
          {transaction.category}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {transaction.date}
        </div>
        {transaction.description && (
          <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {transaction.description}
          </div>
        )}
      </div>

      {/* Right Side */}
      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-100 dark:border-gray-700">
        <span
          className={`text-lg font-bold ${
            transaction.type === "income"
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {transaction.type === "income" ? "+ ₹" : "- ₹"}
          {transaction.amount.toLocaleString()}
        </span>

        <button
          onClick={() => onEdit(transaction)}
          className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all transform hover:scale-110 active:scale-95"
          aria-label="Edit transaction"
        >
          <FaEdit />
        </button>

        <button
          onClick={() => onDelete(transaction.id)}
          className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-all transform hover:scale-110 active:scale-95"
          aria-label="Delete transaction"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default TransactionCard;
