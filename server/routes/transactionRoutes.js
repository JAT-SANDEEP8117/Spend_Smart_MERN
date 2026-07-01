const express = require("express");
const router = express.Router();
const {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  resetTransactions,
} = require("../controllers/transactionController");
const { protect } = require("../middleware/authMiddleware");

// All transaction routes are protected by JWT auth
router.use(protect);

router
  .route("/")
  .get(getTransactions)
  .post(addTransaction)
  .delete(resetTransactions);

router
  .route("/:id")
  .put(updateTransaction)
  .delete(deleteTransaction);

module.exports = router;
