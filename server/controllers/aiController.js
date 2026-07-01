// TODO: Integrate AI model (RAG pipeline, embeddings, vector database, retrieval, and generation)
// This file serves as a placeholder structure for future AI integration.

const Transaction = require("../models/Transaction");

// @desc    Get AI-driven savings insights and recommendations
// @route   POST /api/ai/insights
// @access  Private
const getAIInsights = async (req, res) => {
  try {
    // 1. Fetch user transactions to serve as context for the AI model
    const transactions = await Transaction.find({ userId: req.user._id });

    if (!transactions || transactions.length === 0) {
      return res.json({
        insights: [
          "No transaction history found yet. Add some income or expense transactions to unlock personalized AI savings insights!",
        ],
        success: true,
        todo: "This is a mock placeholder response. Once the AI model is ready, integrate it here.",
      });
    }

    // TODO: Implement the RAG pipeline and Retrieval & Generation logic:
    //
    // STEP 1: Generate embeddings for transactions or personal finance knowledge documents.
    //         (e.g., using OpenAI Embeddings, HuggingFace, Google Gemini API, etc.)
    //
    // STEP 2: Index and query a vector database (e.g., Pinecone, ChromaDB, MongoDB Atlas Vector Search)
    //         to retrieve relevant financial saving guides or historical spending context.
    //
    // STEP 3: Combine retrieved context with the user's transaction data (amount, type, category)
    //         into a prompt template.
    //
    // STEP 4: Call an LLM (e.g., GPT-4, Gemini Flash, Claude) to generate personalized financial tips.
    //
    // For now, we will return some simple rules-based insights as a placeholder.

    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

    const insights = [];

    if (savingsRate < 10) {
      insights.push(
        "ALERT: Your savings rate is currently below 10%. Consider reviewing high expense categories to free up cash flow."
      );
    } else if (savingsRate > 25) {
      insights.push(
        "EXCELLENT: Your savings rate is above 25%! You might want to allocate some funds to investments to grow your wealth."
      );
    } else {
      insights.push(
        "GOOD WORK: You have a healthy savings rate. Let's aim to optimize your category budgets next month."
      );
    }

    // Identify top category
    const categoryTotals = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      });

    let topCategory = "";
    let maxExpense = 0;
    Object.entries(categoryTotals).forEach(([cat, val]) => {
      if (val > maxExpense) {
        maxExpense = val;
        topCategory = cat;
      }
    });

    if (topCategory) {
      insights.push(
        `TIP: Your highest spending category is "${topCategory}" (₹${maxExpense.toLocaleString()}). Try setting a target limit for it next week.`
      );
    }

    res.json({
      insights,
      isPlaceholder: true,
      message: "AI insights model logic will be integrated here.",
    });
  } catch (error) {
    console.error("AI Insights Error:", error.message);
    res.status(500).json({ message: "Server error while generating AI insights" });
  }
};

module.exports = {
  getAIInsights,
};
