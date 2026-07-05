/**
 * Message Repository
 * Layer ini bertanggung jawab untuk interaksi langsung dengan database (Prisma)
 */

const prisma = require("../../../pkg/prisma");

/**
 * Menyimpan message baru
 * @param {{ conversationId: string, role: string, content: string, token: number }} data
 * @returns {Promise<object>}
 */
const save = async (data) => {
  return await prisma.message.create({
    data,
  });
};

/**
 * Mencari messages berdasarkan conversationId dengan pagination opsional
 * @param {string} conversationId
 * @param {{ take?: number, skip?: number, orderBy?: object }} options
 * @returns {Promise<object[]>}
 */
const findByConversation = async (conversationId, options = {}) => {
  const { take = 50, skip, orderBy = { createdAt: "asc" } } = options;

  return await prisma.message.findMany({
    where: { conversationId },
    take,
    skip,
    orderBy,
  });
};

/**
 * Mencari N message terakhir untuk sebuah conversation, diurutkan berdasarkan createdAt asc
 * @param {string} conversationId
 * @param {number} limit
 * @returns {Promise<object[]>}
 */
const findRecent = async (conversationId, limit = 20) => {
  return await prisma.message.findMany({
    where: { conversationId },
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
  }).then((messages) => messages.reverse());
};

/**
 * Mencari message berdasarkan ID
 * @param {string} id
 * @returns {Promise<object|null>}
 */
const findById = async (id) => {
  return await prisma.message.findUnique({
    where: { id },
  });
};

/**
 * Menghapus message berdasarkan ID
 * @param {string} id
 * @returns {Promise<object>}
 */
const remove = async (id) => {
  return await prisma.message.delete({
    where: { id },
  });
};

/**
 * Memperbarui konten message
 * @param {string} id
 * @param {object} data
 * @returns {Promise<object>}
 */
const update = async (id, data) => {
  return await prisma.message.update({
    where: { id },
    data,
  });
};

/**
 * Menghitung jumlah messages dalam sebuah conversation
 * @param {string} conversationId
 * @returns {Promise<number>}
 */
const count = async (conversationId) => {
  return await prisma.message.count({
    where: { conversationId },
  });
};

module.exports = {
  save,
  findByConversation,
  findRecent,
  findById,
  remove,
  update,
  count,
};
