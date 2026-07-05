const prisma = require("../../../pkg/prisma");

const getTransactionsByDateRange = async (startDate, endDate) => {
  return await prisma.transaction.findMany({
    where: {
      createdAt: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    },
    include: {
      detailTransactions: {
        include: {
          boughtProducts: true,
        },
      },
    },
  });
};

const getExpensesByDateRange = async (startDate, endDate) => {
  return await prisma.expense.findMany({
    where: {
      createdAt: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    },
  });
};

module.exports = {
  getTransactionsByDateRange,
  getExpensesByDateRange,
};
