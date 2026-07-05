const repository = require("./repository");

const getSalesReport = async (startDate, endDate) => {
  const transactions = await repository.getTransactionsByDateRange(startDate, endDate);
  return transactions;
};

const getAnalytics = async (startDate, endDate) => {
  const transactions = await repository.getTransactionsByDateRange(startDate, endDate);
  
  const productSales = {};

  transactions.forEach(transaction => {
    transaction.detailTransactions.forEach(detail => {
      detail.boughtProducts.forEach(product => {
        if (!productSales[product.productId]) {
          productSales[product.productId] = {
            name: product.name,
            code: product.code,
            quantity: 0
          };
        }
        productSales[product.productId].quantity += product.quantity;
      });
    });
  });

  const sortedProducts = Object.values(productSales).sort((a, b) => b.quantity - a.quantity);

  return {
    topProducts: sortedProducts.slice(0, 5),
    leastProducts: sortedProducts.slice(-5).reverse()
  };
};

const getExpensesReport = async (startDate, endDate) => {
  return await repository.getExpensesByDateRange(startDate, endDate);
};

const getProfitReport = async (startDate, endDate) => {
  const transactions = await repository.getTransactionsByDateRange(startDate, endDate);
  const expenses = await repository.getExpensesByDateRange(startDate, endDate);

  let totalRevenue = 0;
  let totalCapital = 0;

  transactions.forEach(transaction => {
    transaction.detailTransactions.forEach(detail => {
      totalRevenue += detail.paymentAmount;
      totalCapital += detail.totalCapital;
    });
  });

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const profit = totalRevenue - totalCapital - totalExpenses;

  return {
    totalRevenue,
    totalCapital,
    totalExpenses,
    profit
  };
};

module.exports = {
  getSalesReport,
  getAnalytics,
  getExpensesReport,
  getProfitReport
};
