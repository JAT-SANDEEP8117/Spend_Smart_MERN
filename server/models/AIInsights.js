const mongoose = require("mongoose");

// Stores the latest successfully generated AI Insights per user.
// One document per user — upserted on each successful generation.
const aiInsightsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one record per user
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const AIInsights = mongoose.model("AIInsights", aiInsightsSchema);
module.exports = AIInsights;
