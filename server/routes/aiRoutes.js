const express = require("express");
const router = express.Router();
const { getSavedInsights, generateInsights } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

// GET  /api/ai/insights — retrieve saved insights (no Groq call)
router.get("/insights", protect, getSavedInsights);

// POST /api/ai/insights — generate new insights via Groq and persist
router.post("/insights", protect, generateInsights);

module.exports = router;
