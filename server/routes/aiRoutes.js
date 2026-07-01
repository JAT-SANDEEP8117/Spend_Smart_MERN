const express = require("express");
const router = express.Router();
const { getAIInsights } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

// Route is protected by JWT authentication
router.post("/insights", protect, getAIInsights);

module.exports = router;
