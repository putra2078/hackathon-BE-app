/**
 * Conversation Repository
 * Layer ini bertanggung jawab untuk interaksi langsung dengan database (Prisma)
 */

const prisma = require("../../../pkg/prisma");

/**
 * Membuat conversation baru
 * @param {{ userId: string, title: string }} data
 * @returns {Promise<object>}
 */
const create = async (data) => {
  return await prisma.conversation.create({
    data,
  });
};

/**
 * Mencari conversation berdasarkan ID, termasuk relasi user
 * @param {string} id
 * @returns {Promise<object|null>}
 */
const findById = async (id) => {
  return await prisma.conversation.findUnique({
    where: { id },
    include: { user: true },
  });
};

/**
 * Mencari semua conversation berdasarkan userId, diurutkan berdasarkan updatedAt desc
 * @param {string} userId
 * @returns {Promise<object[]>}
 */
const findAllByUser = async (userId) => {
  return await prisma.conversation.findMany({
    where: { userId },
    orderBy: {
      updatedAt: "desc",
    },
  });
};

/**
 * Memperbarui conversation (title, lastMessage)
 * @param {string} id
 * @param {object} data
 * @returns {Promise<object>}
 */
const update = async (id, data) => {
  return await prisma.conversation.update({
    where: { id },
    data,
  });
};

/**
 * Menghapus conversation berdasarkan ID
 * @param {string} id
 * @returns {Promise<object>}
 */
const remove = async (id) => {
  return await prisma.conversation.delete({
    where: { id },
  });
};

module.exports = {
  create,
  findById,
  findAllByUser,
  update,
  remove,
};
