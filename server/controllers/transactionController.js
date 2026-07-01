const Transaction = require("../models/Transaction");

// @desc    Get all transactions for the logged-in user
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id });
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error.message);
    res.status(500).json({ message: "Server error while fetching transactions" });
  }
};

// @desc    Add a new transaction
// @route   POST /api/transactions
// @access  Private
const addTransaction = async (req, res) => {
  const { type, amount, category, date, description } = req.body;

  if (!type || !amount || !category || !date) {
    return res.status(400).json({ message: "Please provide all required fields" });
  }

  try {
    const transaction = await Transaction.create({
      userId: req.user._id,
      type,
      amount: Number(amount),
      category,
      date,
      description: description || "",
    });

    res.status(201).json(transaction.toJSON());
  } catch (error) {
    console.error("Error adding transaction:", error.message);
    res.status(400).json({ message: "Invalid transaction data" });
  }
};

// @desc    Update an existing transaction
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = async (req, res) => {
  const { type, amount, category, date, description } = req.body;

  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Ensure transaction belongs to the logged-in user
    if (transaction.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "User not authorized to update this transaction" });
    }

    // Update fields
    transaction.type = type || transaction.type;
    transaction.amount = amount !== undefined ? Number(amount) : transaction.amount;
    transaction.category = category || transaction.category;
    transaction.date = date || transaction.date;
    transaction.description = description !== undefined ? description : transaction.description;

    const updatedTransaction = await transaction.save();
    res.json(updatedTransaction.toJSON());
  } catch (error) {
    console.error("Error updating transaction:", error.message);
    res.status(500).json({ message: "Server error while updating transaction" });
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Ensure transaction belongs to the logged-in user
    if (transaction.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "User not authorized to delete this transaction" });
    }

    await transaction.deleteOne();
    res.json({ message: "Transaction removed successfully" });
  } catch (error) {
    console.error("Error deleting transaction:", error.message);
    res.status(500).json({ message: "Server error while deleting transaction" });
  }
};

// @desc    Reset all transactions for the logged-in user
// @route   DELETE /api/transactions
// @access  Private
const resetTransactions = async (req, res) => {
  try {
    await Transaction.deleteMany({ userId: req.user._id });
    res.json({ message: "All transactions removed successfully" });
  } catch (error) {
    console.error("Error resetting transactions:", error.message);
    res.status(500).json({ message: "Server error while resetting transactions" });
  }
};

module.exports = {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  resetTransactions,
};
