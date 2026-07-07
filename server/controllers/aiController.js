const Transaction = require("../models/Transaction");
const AIInsights = require("../models/AIInsights");
const Groq = require("groq-sdk");

// In-flight guard: prevents concurrent duplicate Groq requests per user.
// Key: userId string → true while a request is in progress.
const inFlightRequests = new Map();

// @desc    Get the user's latest saved AI Insights (NO Groq call)
// @route   GET /api/ai/insights
// @access  Private
const getSavedInsights = async (req, res) => {
  try {
    const saved = await AIInsights.findOne({ userId: req.user._id });

    if (!saved) {
      return res.json({
        success: true,
        hasData: false,
        message: "No AI Insights generated yet.",
      });
    }

    return res.json({
      success: true,
      hasData: true,
      data: saved.data,
      generatedAt: saved.generatedAt,
    });
  } catch (error) {
    console.error("getSavedInsights error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while retrieving saved AI Insights.",
    });
  }
};

// @desc    Generate new AI Insights via Groq and save result per user
// @route   POST /api/ai/insights
// @access  Private
const generateInsights = async (req, res) => {
  const userId = req.user._id.toString();

  // Duplicate request guard
  if (inFlightRequests.get(userId)) {
    return res.status(429).json({
      success: false,
      message: "A generation request is already in progress. Please wait.",
    });
  }

  try {
    inFlightRequests.set(userId, true);

    // 1. Check for Groq API Key
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(400).json({
        success: false,
        errorType: "MISSING_API_KEY",
        message: "Groq API Key is missing. Please add GROQ_API_KEY to your server's .env file.",
      });
    }

    // 2. Fetch user transactions
    const transactions = await Transaction.find({ userId: req.user._id });

    if (!transactions || transactions.length === 0) {
      return res.json({
        success: true,
        empty: true,
        message: "No transaction history found. Add income or expense transactions to unlock AI insights.",
      });
    }

    // 3. Calculate financial statistics locally (no raw data sent to Groq)
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

    const expenses = transactions.filter((t) => t.type === "expense");

    const avgTransactionAmount =
      transactions.length > 0
        ? transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length
        : 0;

    const avgExpense = expenses.length > 0 ? totalExpense / expenses.length : 0;

    // Largest expense
    let largestExpense = null;
    if (expenses.length > 0) {
      largestExpense = expenses.reduce(
        (max, t) => (t.amount > max.amount ? t : max),
        expenses[0]
      );
    }

    // Category-wise spending
    const categoryTotals = {};
    expenses.forEach((t) => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

    let highestCategory = "";
    let highestCategoryAmount = 0;
    Object.entries(categoryTotals).forEach(([cat, val]) => {
      if (val > highestCategoryAmount) {
        highestCategoryAmount = val;
        highestCategory = cat;
      }
    });

    // Category-wise income
    const categoryIncomeTotals = {};
    transactions
      .filter((t) => t.type === "income")
      .forEach((t) => {
        categoryIncomeTotals[t.category] = (categoryIncomeTotals[t.category] || 0) + t.amount;
      });

    // Monthly trends (group by YYYY-MM)
    const monthlyTrends = {};
    transactions.forEach((t) => {
      if (t.date) {
        const month = t.date.substring(0, 7);
        if (!monthlyTrends[month]) {
          monthlyTrends[month] = { income: 0, expense: 0 };
        }
        if (t.type === "income") {
          monthlyTrends[month].income += t.amount;
        } else {
          monthlyTrends[month].expense += t.amount;
        }
      }
    });

    const financialProfile = {
      totalIncome,
      totalExpense,
      balance,
      savingsRate: Number(savingsRate.toFixed(1)),
      avgTransactionAmount: Number(avgTransactionAmount.toFixed(1)),
      avgExpense: Number(avgExpense.toFixed(1)),
      largestExpense: largestExpense
        ? {
            amount: largestExpense.amount,
            category: largestExpense.category,
            description: largestExpense.description,
            date: largestExpense.date,
          }
        : null,
      highestCategory,
      highestCategoryAmount,
      categoryWiseSpending: categoryTotals,
      categoryWiseIncome: categoryIncomeTotals,
      monthlyTrends,
    };

    // 4. Initialize Groq client
    const groq = new Groq({ apiKey });

    // 5. Invoke Groq completion with JSON mode
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert personal finance AI advisor.
Analyze the user's aggregated financial data.
Provide a personalized, structured financial analysis.
Guidelines:
- If the savings rate is positive and high, praise them.
- If the savings rate is low or negative, provide critical warning insights.
- Point out specific patterns like their highest spending category and monthly trends.
- Offer exactly 2 to 3 actionable, smart budget recommendations.
- Keep observations concise, engaging, and practical.
- Do not provide formal investment advice (stocks, crypto, etc.) or tax/legal advice. Use a friendly yet professional tone.

You MUST respond with a single valid JSON object containing exactly the following schema structure:
{
  "summary": "Short overall financial summary",
  "financialHealth": {
    "status": "Good | Moderate | Needs Attention",
    "score": 75,
    "explanation": "Short explanation"
  },
  "insights": [
    {
      "title": "Insight title",
      "description": "Personalized explanation",
      "type": "positive | warning | neutral"
    }
  ],
  "recommendations": [
    {
      "title": "Recommendation title",
      "description": "Practical recommendation"
    }
  ],
  "spendingAnalysis": {
    "highestCategory": "Category",
    "observation": "Short observation"
  },
  "savingsAnalysis": {
    "savingsRate": 20,
    "observation": "Short observation"
  }
}
Do not wrap your output in markdown code blocks like \`\`\`json. Return only raw parseable JSON.`,
        },
        {
          role: "user",
          content: `Here is my financial profile:\n${JSON.stringify(financialProfile, null, 2)}`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    const responseText = chatCompletion.choices[0].message.content;
    let parsed;
    try {
      parsed = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse Groq response as JSON:", parseError.message);
      return res.status(500).json({
        success: false,
        message: "Failed to parse insights generated by AI.",
      });
    }

    // 6. Safely validate properties to protect the client UI
    const validated = {
      summary: parsed.summary || "No summary available at this time.",
      financialHealth: {
        status: parsed.financialHealth?.status || "Moderate",
        score:
          typeof parsed.financialHealth?.score === "number"
            ? parsed.financialHealth.score
            : 50,
        explanation:
          parsed.financialHealth?.explanation || "Financial health assessment complete.",
      },
      insights: Array.isArray(parsed.insights)
        ? parsed.insights.map((item) => ({
            title: item.title || "Insight",
            description: item.description || "",
            type: ["positive", "warning", "neutral"].includes(item.type?.toLowerCase())
              ? item.type.toLowerCase()
              : "neutral",
          }))
        : [],
      recommendations: Array.isArray(parsed.recommendations)
        ? parsed.recommendations.map((item) => ({
            title: item.title || "Budget Suggestion",
            description: item.description || "",
          }))
        : [],
      spendingAnalysis: {
        highestCategory:
          parsed.spendingAnalysis?.highestCategory || highestCategory || "None",
        observation:
          parsed.spendingAnalysis?.observation || "Category analysis complete.",
      },
      savingsAnalysis: {
        savingsRate:
          typeof parsed.savingsAnalysis?.savingsRate === "number"
            ? parsed.savingsAnalysis.savingsRate
            : typeof parsed.savingsAnalysis?.savingsRate === "string"
            ? parseFloat(parsed.savingsAnalysis.savingsRate) || 0
            : Number(savingsRate.toFixed(1)),
        observation:
          parsed.savingsAnalysis?.observation || "Savings analysis complete.",
      },
    };

    // 7. Persist the successful result — upsert one document per user
    await AIInsights.findOneAndUpdate(
      { userId: req.user._id },
      { data: validated, generatedAt: new Date() },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      data: validated,
      generatedAt: new Date(),
    });
  } catch (error) {
    console.error("generateInsights error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while generating AI insights.",
    });
  } finally {
    // Always release the in-flight lock
    inFlightRequests.delete(userId);
  }
};

module.exports = {
  getSavedInsights,
  generateInsights,
};
