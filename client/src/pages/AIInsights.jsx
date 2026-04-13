// src/pages/AIInsights.jsx
import { useContext } from "react";
import { TransactionContext } from "../context/TransactionContext";
import { FaRobot, FaLightbulb, FaChartLine, FaArrowUp, FaBrain } from "react-icons/fa";
import calculateTotals from "../utils/calculateTotals";

const AIInsights = () => {
  const { transactions } = useContext(TransactionContext);
  const { totalIncome, totalExpense, balance } = calculateTotals(transactions);

  // Calculate insights
  const avgExpense = transactions.filter(t => t.type === "expense").length > 0
    ? totalExpense / transactions.filter(t => t.type === "expense").length
    : 0;
  
  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0;

  const insights = [
    {
      icon: FaArrowUp,
      title: "Savings Rate",
      value: `${savingsRate}%`,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      description: savingsRate > 20 ? "Excellent!You're saving well." : savingsRate > 10 ? "Good savings rate!" : "Consider increasing savings."
    },
    {
      icon: FaChartLine,
      title: "Average Expense",
      value: `₹${avgExpense.toLocaleString()}`,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      description: "Per transaction average"
    },
    {
      icon: FaLightbulb,
      title: "Smart Tip",
      value: balance > 0 ? "Positive" : "Review",
      color: balance > 0 ? "text-green-600 dark:text-green-400" : "text-orange-600 dark:text-orange-400",
      bgColor: balance > 0 ? "bg-green-100 dark:bg-green-900/30" : "bg-orange-100 dark:bg-orange-900/30",
      description: balance > 0 ? "You're managing finances well!" : "Consider reviewing your expenses."
    }
  ];

  return (
    <div className="text-gray-900 dark:text-white animate-fadeIn min-h-[80vh]">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-purple-500 to-blue-600 rounded-full mb-4 animate-float">
          <FaBrain className="text-white text-4xl" />
        </div>
        <h1 className="text-4xl font-bold mb-3 bg-linear-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
          AI Insights
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Get intelligent insights about your spending patterns and financial health
        </p>
      </div>

      {/* Coming Soon Banner */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-linear-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-lg animate-pulse-slow">
          <div className="flex items-center gap-4">
            <FaRobot className="text-4xl" />
            <div>
              <h2 className="text-2xl font-bold mb-2">Advanced AI Features Coming Soon!</h2>
              <p className="text-blue-100">
                We're working on personalized spending insights, smart suggestions, and AI-powered financial predictions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <div
              key={index}
              className={`${insight.bgColor} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-slideIn`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 ${insight.bgColor} rounded-lg`}>
                  <Icon className={`text-2xl ${insight.color}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300">{insight.title}</h3>
                </div>
              </div>
              <p className={`text-3xl font-bold ${insight.color} mb-2`}>{insight.value}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{insight.description}</p>
            </div>
          );
        })}
      </div>

      {/* Financial Summary */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-4">Quick Financial Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Income</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                ₹{totalIncome.toLocaleString()}
              </p>
            </div>
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Expense</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                ₹{totalExpense.toLocaleString()}
              </p>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Balance</p>
              <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                ₹{balance.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
