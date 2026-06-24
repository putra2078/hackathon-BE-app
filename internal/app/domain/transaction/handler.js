/**
 * Transaction Handler
 * Layer ini bertanggung jawab untuk menangani request HTTP dan mengirim response
 */

const transactionService = require("./service");
const { CreateTransactionRequest, UpdateTransactionRequest } = require("./dto");

const getAll = async (req, res) => {
  try {
    const transactions = await transactionService.getAllTransactions();
    return res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await transactionService.getTransactionById(id);
    return res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const create = async (req, res) => {
  try {
    const transactionData = CreateTransactionRequest(req.body);
    const newTransaction = await transactionService.createTransaction(transactionData);
    return res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      data: newTransaction,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const transactionData = UpdateTransactionRequest(req.body);
    const updatedTransaction = await transactionService.updateTransaction(id, transactionData);
    return res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
      data: updatedTransaction,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await transactionService.deleteTransaction(id);
    return res.status(200).json({
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
