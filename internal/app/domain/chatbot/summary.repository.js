/**
 * Summary Repository
 * Layer ini bertanggung jawab untuk interaksi langsung dengan database (Prisma)
 */

const prisma = require("../../../pkg/prisma");

/**
 * Membuat summary baru
 * @param {{ conversationId: string, summary: string, lastMessageId: string }} data
 * @returns {Promise<object>}
 */
const create = async (data) => {
  return await prisma.summary.create({
    data,
  });
};

/**
 * Mencari summary terbaru untuk sebuah conversation
 * @param {string} conversationId
 * @returns {Promise<object|null>}
 */
const findByConversation = async (conversationId) => {
  return await prisma.summary.findFirst({
    where: { conversationId },
    orderBy: {
      createdAt: "desc",
    },
  });
};

/**
 * Memperbarui konten summary
 * @param {string} id
 * @param {object} data
 * @returns {Promise<object>}
 */
const update = async (id, data) => {
  return await prisma.summary.update({
    where: { id },
    data,
  });
};

module.exports = {
  create,
  findByConversation,
  update,
};
