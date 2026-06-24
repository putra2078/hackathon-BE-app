/**
 * Transaction Repository
 */

const prisma = require("../../../pkg/prisma");

const findAll = async () => {
  return await prisma.transaction.findMany({
    include: {
      user: true,
      detailTransactions: {
        include: {
          boughtProducts: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const findById = async (id) => {
  return await prisma.transaction.findUnique({
    where: { id },
    include: {
      user: true,
      detailTransactions: {
        include: {
          boughtProducts: true,
        },
      },
    },
  });
};

const create = async (transactionData, detailData, boughtProducts) => {
  return await prisma.transaction.create({
    data: {
      ...transactionData,
      detailTransactions: {
        create: {
          ...detailData,
          boughtProducts: {
            create: boughtProducts,
          },
        },
      },
    },
    include: {
      user: true,
      detailTransactions: {
        include: {
          boughtProducts: true,
        },
      },
    },
  });
};

const update = async (id, data) => {
  return await prisma.transaction.update({
    where: { id },
    data,
    include: {
      user: true,
      detailTransactions: {
        include: {
          boughtProducts: true,
        },
      },
    },
  });
};

const remove = async (id) => {
  // Use a transaction to ensure all related data is deleted
  return await prisma.$transaction(async (tx) => {
    const details = await tx.detailTransaction.findMany({
      where: { transactionId: id },
    });

    for (const detail of details) {
      await tx.boughtProductDetail.deleteMany({
        where: { detailTransactionId: detail.id },
      });
    }

    await tx.detailTransaction.deleteMany({
      where: { transactionId: id },
    });

    return await tx.transaction.delete({
      where: { id },
    });
  });
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};
