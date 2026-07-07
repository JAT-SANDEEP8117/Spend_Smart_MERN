// src/pages/AIInsights.jsx
import { useContext, useState, useEffect, useRef } from "react";
import { TransactionContext } from "../context/TransactionContext";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-toastify";
import {
  FaRobot,
  FaLightbulb,
  FaChartLine,
  FaArrowUp,
  FaBrain,
  FaExclamationTriangle,
  FaSyncAlt,
  FaPlusCircle,
  FaCheckCircle,
  FaWallet,
  FaArrowDown,
  FaPiggyBank,
  FaHandHoldingUsd,
} from "react-icons/fa";
import calculateTotals from "../utils/calculateTotals";

const AIInsights = () => {
  const { transactions } = useContext(TransactionContext);
  const navigate = useNavigate();

  // `insightsData` holds the currently displayed AI result (loaded from DB or just generated)
  const [insightsData, setInsightsData] = useState(null);
  // `generatedAt` shows when the displayed insights were last generated
  const [generatedAt, setGeneratedAt] = useState(null);

  // UI states
  const [loadingSaved, setLoadingSaved] = useState(true);   // fetching saved on mount
  const [generating, setGenerating] = useState(false);       // Groq call in progress
  const [error, setError] = useState(null);                  // non-destructive error
  const [errorType, setErrorType] = useState(null);

  // Request lock — prevents duplicate concurrent POST requests
  const isGeneratingRef = useRef(false);

  // Local calculations (supplementary display values)
  const { totalIncome, totalExpense, balance } = calculateTotals(transactions);
  const localAvgExpense =
    transactions.filter((t) => t.type === "expense").length > 0
      ? totalExpense / transactions.filter((t) => t.type === "expense").length
      : 0;

  // ─── On mount: load saved insights only — NO Groq call ────────────────────
  useEffect(() => {
    let cancelled = false;

    const loadSaved = async () => {
      try {
        const response = await api.get("/ai/insights");
        if (cancelled) return;

        if (response.data.success && response.data.hasData) {
          setInsightsData(response.data.data);
          setGeneratedAt(response.data.generatedAt);
        }
        // hasData === false → first-time user; show empty state
      } catch (err) {
        // Non-critical: if load fails, just show first-time empty state
        if (!cancelled) {
          console.error("Failed to load saved AI Insights:", err.message);
        }
      } finally {
        if (!cancelled) setLoadingSaved(false);
      }
    };

    loadSaved();
    return () => { cancelled = true; };
  }, []); // runs once on mount only

  // ─── Generate new insights via Groq ───────────────────────────────────────
  const generateInsights = async () => {
    // Request lock: prevent duplicate concurrent requests
    if (isGeneratingRef.current || generating) return;
    isGeneratingRef.current = true;

    setGenerating(true);
    setError(null);
    setErrorType(null);
    // Do NOT clear insightsData — preserve previous while new request is in flight

    try {
      const response = await api.post("/ai/insights");
      const result = response.data;

      if (result.success) {
        if (result.empty) {
          // Edge case: transactions were deleted between load and generate
          toast.info("No transactions found. Add transactions to generate insights.");
        } else {
          setInsightsData(result.data);
          setGeneratedAt(result.generatedAt);
          toast.success("AI Insights refreshed successfully!");
        }
      } else {
        const errType = result.errorType;
        setErrorType(errType);
        setError(result.message || "Failed to generate AI insights.");
        if (errType === "MISSING_API_KEY") {
          toast.warning("AI API Key is missing on the server.");
        } else {
          toast.error("Failed to generate AI insights.");
        }
      }
    } catch (err) {
      const serverMsg = err.response?.data?.message;
      const errType = err.response?.data?.errorType;

      setErrorType(errType);
      setError(serverMsg || "An error occurred while communicating with the AI service.");

      if (errType === "MISSING_API_KEY") {
        toast.warning("AI API Key is missing on the server.");
      } else {
        toast.error("Failed to generate AI insights.");
      }
      // Previous insightsData is preserved — not cleared on failure
    } finally {
      setGenerating(false);
      isGeneratingRef.current = false;
    }
  };

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const getStatusColor = (status) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("good"))
      return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800";
    if (s.includes("moderate"))
      return "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800";
    return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800";
  };

  const getInsightTypeStyles = (type) => {
    const t = type?.toLowerCase() || "";
    if (t === "positive") {
      return {
        bg: "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/30",
        iconColor: "text-green-600 dark:text-green-400",
        icon: FaCheckCircle,
      };
    } else if (t === "warning") {
      return {
        bg: "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/30",
        iconColor: "text-red-600 dark:text-red-400",
        icon: FaExclamationTriangle,
      };
    }
    return {
      bg: "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      icon: FaLightbulb,
    };
  };

  const formattedDate = generatedAt
    ? new Date(generatedAt).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null;

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="text-gray-900 dark:text-white animate-fadeIn min-h-[80vh] pb-12">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-purple-500 to-blue-600 rounded-full mb-4 shadow-lg animate-float">
          <FaBrain className="text-white text-4xl" />
        </div>
        <h1 className="text-4xl font-bold mb-3 bg-linear-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
          AI Financial Insights
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
          Personalized, smart budgeting analysis generated using your real transactions.
        </p>
      </div>

      {/* Loading saved insights on mount */}
      {loadingSaved && (
        <div className="flex flex-col items-center justify-center min-h-[40vh] py-12">
          <div className="relative flex items-center justify-center mb-4">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            <FaRobot className="absolute text-purple-600 text-2xl animate-pulse" />
          </div>
          <p className="text-lg font-medium text-gray-600 dark:text-gray-300 animate-pulse">
            Loading your saved insights...
          </p>
        </div>
      )}

      {/* Generating new insights */}
      {!loadingSaved && generating && (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="relative flex items-center justify-center mb-4">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            <FaRobot className="absolute text-purple-600 text-2xl animate-pulse" />
          </div>
          <p className="text-lg font-medium text-gray-600 dark:text-gray-300 animate-pulse">
            Analyzing your spending trends and calculating indicators...
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Consulting Spend Smart AI engine
          </p>
        </div>
      )}

      {/* ── FIRST-TIME EMPTY STATE (no saved data, not loading) ─────────────── */}
      {!loadingSaved && !generating && !insightsData && transactions.length === 0 && (
        <div className="max-w-xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl text-center border border-gray-200 dark:border-gray-700 animate-scaleIn">
          <FaWallet className="text-6xl text-purple-500/80 mx-auto mb-4 animate-bounce-slow" />
          <h2 className="text-2xl font-bold mb-3">No Transactions Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We need at least one transaction to perform a personalized financial health
            analysis. Add your income and expenses to unlock AI insights.
          </p>
          <button
            onClick={() => navigate("/transactions")}
            className="inline-flex items-center gap-2 bg-linear-to-r from-purple-600 to-blue-600 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <FaPlusCircle />
            <span>Add Transaction</span>
          </button>
        </div>
      )}

      {/* ── FIRST-TIME: has transactions but no insights yet ─────────────────── */}
      {!loadingSaved && !generating && !insightsData && transactions.length > 0 && (
        <div className="max-w-xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl text-center border border-gray-200 dark:border-gray-700 animate-scaleIn">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-purple-100 to-blue-100 dark:from-purple-900/40 dark:to-blue-900/40 rounded-full mb-5">
            <FaBrain className="text-purple-600 dark:text-purple-400 text-4xl" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Get Your AI Financial Review</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Click the button below to have Spend Smart AI analyze your transactions and
            generate personalized financial insights, health scores, and recommendations.
          </p>

          {/* Non-destructive error (if previous attempt failed) */}
          {error && (
            <div className="mb-5 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400 text-left">
              <div className="flex items-center gap-2 font-semibold mb-1">
                <FaExclamationTriangle />
                <span>
                  {errorType === "MISSING_API_KEY"
                    ? "AI Integration Key Required"
                    : "Generation Failed"}
                </span>
              </div>
              <p>
                {errorType === "MISSING_API_KEY"
                  ? "Please configure GROQ_API_KEY in server/.env and restart the server."
                  : error}
              </p>
            </div>
          )}

          <button
            id="get-ai-insights-btn"
            onClick={generateInsights}
            disabled={generating}
            className="inline-flex items-center gap-2 bg-linear-to-r from-purple-600 to-blue-600 text-white font-semibold px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
          >
            <FaBrain />
            <span>Get AI Insights</span>
          </button>
        </div>
      )}

      {/* ── NON-DESTRUCTIVE ERROR when previous insights exist ────────────────── */}
      {!loadingSaved && !generating && insightsData && error && (
        <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <div className="flex items-center gap-3">
            <FaExclamationTriangle className="text-red-500 dark:text-red-400 shrink-0" />
            <div>
              <p className="font-semibold text-red-700 dark:text-red-300 text-sm">
                {errorType === "MISSING_API_KEY"
                  ? "AI Integration Key Required"
                  : "Failed to Refresh AI Insights"}
              </p>
              <p className="text-red-600 dark:text-red-400 text-sm mt-0.5">
                {errorType === "MISSING_API_KEY"
                  ? "Configure GROQ_API_KEY in server/.env and restart the server."
                  : error}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 pl-7">
            Your previous insights are still displayed below.
          </p>
        </div>
      )}

      {/* ── MAIN INSIGHTS CONTENT ─────────────────────────────────────────────── */}
      {!loadingSaved && insightsData && (
        <div className="max-w-6xl mx-auto px-4 space-y-8 animate-fadeIn">
          {/* Action bar */}
          <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
            {formattedDate && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Last generated: {formattedDate}
              </p>
            )}
            <button
              id="refresh-ai-insights-btn"
              onClick={generateInsights}
              disabled={generating}
              className="ml-auto inline-flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all transform active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              <FaSyncAlt className={generating ? "animate-spin" : ""} />
              <span>Refresh AI Insights</span>
            </button>
          </div>

          {/* Top Score and Summary Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Financial Health Score Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-between text-center min-h-[300px]">
              <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300">
                Financial Health
              </h2>

              <div className="relative my-4 flex items-center justify-center">
                <div className="w-36 h-36 rounded-full flex flex-col items-center justify-center border-8 border-gray-100 dark:border-gray-900 bg-gray-50 dark:bg-gray-850 shadow-inner relative">
                  <div
                    className={`absolute inset-0 rounded-full opacity-10 blur-md ${
                      insightsData.financialHealth.score >= 80
                        ? "bg-green-500"
                        : insightsData.financialHealth.score >= 50
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  ></div>
                  <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-br from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
                    {insightsData.financialHealth.score}
                  </span>
                  <span className="text-xs uppercase text-gray-500 tracking-widest mt-1">
                    Health Score
                  </span>
                </div>
              </div>

              <div className="w-full">
                <span
                  className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold border ${getStatusColor(
                    insightsData.financialHealth.status
                  )}`}
                >
                  {insightsData.financialHealth.status}
                </span>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 px-2 line-clamp-2">
                  {insightsData.financialHealth.explanation}
                </p>
              </div>
            </div>

            {/* AI Summary Card */}
            <div className="lg:col-span-2 bg-linear-to-br from-purple-600 to-blue-600 dark:from-purple-900/60 dark:to-blue-900/60 rounded-2xl shadow-xl p-8 text-white flex flex-col justify-between border border-purple-500/20">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/20 rounded-xl">
                    <FaRobot className="text-2xl text-white" />
                  </div>
                  <h2 className="text-2xl font-bold">Personalized Summary</h2>
                </div>
                <p className="text-lg leading-relaxed text-purple-50 dark:text-purple-100 pt-2 font-medium">
                  &ldquo;{insightsData.summary}&rdquo;
                </p>
              </div>

              {/* Local reference statistics banner */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/20 mt-6 text-center">
                <div>
                  <p className="text-xs text-purple-200">Income</p>
                  <p className="text-xl font-bold">₹{totalIncome.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-purple-200">Expenses</p>
                  <p className="text-xl font-bold text-red-100">
                    ₹{totalExpense.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-purple-200">Balance</p>
                  <p
                    className={`text-xl font-bold ${
                      balance >= 0 ? "text-green-200" : "text-red-300"
                    }`}
                  >
                    ₹{balance.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg border border-gray-200 dark:border-gray-700 flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                <FaPiggyBank className="text-2xl" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">
                  Savings Rate
                </p>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                  {insightsData.savingsAnalysis.savingsRate}%
                </h3>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg border border-gray-200 dark:border-gray-700 flex items-center gap-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
                <FaArrowDown className="text-2xl" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">
                  Avg. Expense
                </p>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                  ₹{Math.round(localAvgExpense).toLocaleString()}
                </h3>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg border border-gray-200 dark:border-gray-700 flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
                <FaArrowUp className="text-2xl" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">
                  Savings Amount
                </p>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                  ₹{balance.toLocaleString()}
                </h3>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg border border-gray-200 dark:border-gray-700 flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                <FaChartLine className="text-2xl" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">
                  Top Spent Cat.
                </p>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1 capitalize truncate max-w-[150px]">
                  {insightsData.spendingAnalysis.highestCategory || "None"}
                </h3>
              </div>
            </div>
          </div>

          {/* Deep Analytics & Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Spending Analysis */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                    <FaHandHoldingUsd className="text-xl" />
                  </div>
                  <h3 className="text-xl font-bold">Spending Analysis</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-semibold text-gray-450 dark:text-gray-400 uppercase tracking-wider block">
                      Highest Category
                    </span>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400 capitalize mt-0.5">
                      {insightsData.spendingAnalysis.highestCategory ||
                        "No expense category logged"}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-450 dark:text-gray-400 uppercase tracking-wider block">
                      Observation
                    </span>
                    <p className="text-gray-650 dark:text-gray-300 text-sm leading-relaxed mt-1">
                      {insightsData.spendingAnalysis.observation}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Savings Analysis */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl">
                    <FaPiggyBank className="text-xl" />
                  </div>
                  <h3 className="text-xl font-bold">Savings Analysis</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-semibold text-gray-450 dark:text-gray-400 uppercase tracking-wider block">
                      Savings Rate (AI Evaluated)
                    </span>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400 mt-0.5">
                      {insightsData.savingsAnalysis.savingsRate}%
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-450 dark:text-gray-400 uppercase tracking-wider block">
                      Observation
                    </span>
                    <p className="text-gray-650 dark:text-gray-300 text-sm leading-relaxed mt-1">
                      {insightsData.savingsAnalysis.observation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Insights & Alerts */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <FaLightbulb className="text-purple-600 dark:text-purple-400" />
              <span>Key Spending Insights</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insightsData.insights.map((insight, idx) => {
                const styles = getInsightTypeStyles(insight.type);
                const Icon = styles.icon;

                return (
                  <div
                    key={idx}
                    className={`p-5 rounded-xl border ${styles.bg} flex items-start gap-4 transition-all hover:scale-[1.01]`}
                  >
                    <div
                      className={`p-2.5 bg-white dark:bg-gray-800 rounded-lg shadow-sm ${styles.iconColor}`}
                    >
                      <Icon className="text-xl" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-gray-800 dark:text-white capitalize">
                        {insight.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {insight.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actionable Recommendations */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <FaRobot className="text-blue-600 dark:text-blue-400" />
              <span>Smart AI Recommendations</span>
            </h3>

            <div className="space-y-4">
              {insightsData.recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900/40 border border-transparent hover:border-gray-200 dark:hover:border-gray-850 transition-all"
                >
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-850 dark:text-gray-100">
                      {rec.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                      {rec.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="text-center text-xs text-gray-500 dark:text-gray-500 pt-6">
            <p>
              Spend Smart AI provides automated general financial analysis and suggestions.
              This analysis is not certified financial, investment, tax, or legal advice.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsights;
