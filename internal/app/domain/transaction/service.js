/**
 * Transaction Service
 */

const transactionRepository = require("./repository");
const productRepository = require("../product/repository");
const { TransactionResponse } = require("./dto");

const getAllTransactions = async () => {
  const transactions = await transactionRepository.findAll();
  return transactions.map((transaction) => TransactionResponse(transaction));
};

const getTransactionById = async (id) => {
  const transaction = await transactionRepository.findById(id);
  if (!transaction) {
    const error = new Error("Transaction not found");
    error.statusCode = 404;
    throw error;
  }
  return TransactionResponse(transaction);
};

const createTransaction = async (transactionData) => {
  const { detail, ...headerData } = transactionData;
  const { products: requestProducts, ...detailFields } = detail;

  const boughtProducts = [];

  // Process each product: Fetch current info, check stock, and prepare snapshot
  for (const item of requestProducts) {
    const product = await productRepository.findById(item.productId);
    if (!product) {
      const error = new Error(`Product with ID ${item.productId} not found`);
      error.statusCode = 404;
      throw error;
    }

    if (product.stock < item.quantity) {
      const error = new Error(
        `Insufficient stock for product: ${product.name}`,
      );
      error.statusCode = 400;
      throw error;
    }

    // Prepare historical snapshot for this transaction
    boughtProducts.push({
      productId: product.id,
      name: product.name,
      code: product.code,
      buyPrice: product.buyPrice,
      sellPrice: product.sellPrice,
      quantity: item.quantity,
      subtotal: product.sellPrice * item.quantity,
    });

    // Update product stock in database
    await productRepository.update(product.id, {
      stock: product.stock - item.quantity,
    });
  }

  const newTransaction = await transactionRepository.create(
    headerData,
    detailFields,
    boughtProducts,
  );
  return TransactionResponse(newTransaction);
};

const updateTransaction = async (id, transactionData) => {
  await getTransactionById(id);
  const updatedTransaction = await transactionRepository.update(
    id,
    transactionData,
  );
  return TransactionResponse(updatedTransaction);
};

const deleteTransaction = async (id) => {
  await getTransactionById(id);
  return await transactionRepository.remove(id);
};

module.exports = {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
