/**
 * Product Repository
 * Layer ini bertanggung jawab untuk interaksi langsung dengan database (Prisma)
 */

const prisma = require("../../../pkg/prisma");

const findAll = async () => {
  // Flow: Mengambil semua data product dari database, diurutkan berdasarkan waktu pembuatan terbaru
  return await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

const findById = async (id) => {
  // Flow: Mencari satu data product berdasarkan ID yang unik
  return await prisma.product.findUnique({
    where: { id },
  });
};

const create = async (data) => {
  // Flow: Menyimpan data product baru ke dalam database
  return await prisma.product.create({
    data,
  });
};

const update = async (id, data) => {
  // Flow: Mengupdate data product yang sudah ada berdasarkan ID
  return await prisma.product.update({
    where: { id },
    data,
  });
};

const updateStock = async (tx, id, stockIncrement) => {
  // Flow: Mengupdate stok product menggunakan transaction context
  return await tx.product.update({
    where: { id },
    data: {
      stock: {
        increment: stockIncrement,
      },
    },
  });
};

const createStockIncrement = async (tx, productId, userId, quantity) => {
  return await tx.stockIncrement.create({
    data: {
      productId,
      userId,
      quantity,
    },
  });
};

const remove = async (id) => {
  // Flow: Menghapus data product dari database berdasarkan ID
  return await prisma.product.delete({
    where: { id },
  });
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  updateStock,
  createStockIncrement,
  remove,
};
