/**
 * Attachment Repository
 * Layer ini bertanggung jawab untuk interaksi langsung dengan database (Prisma)
 */

const prisma = require("../../../pkg/prisma");

/**
 * Membuat attachment baru
 * @param {{ messageId: string, filename: string, mimeType: string, url: string }} data
 * @returns {Promise<object>}
 */
const create = async (data) => {
  return await prisma.attachment.create({
    data,
  });
};

/**
 * Mencari attachment berdasarkan ID
 * @param {string} id
 * @returns {Promise<object|null>}
 */
const findById = async (id) => {
  return await prisma.attachment.findUnique({
    where: { id },
  });
};

/**
 * Mencari semua attachments untuk sebuah message
 * @param {string} messageId
 * @returns {Promise<object[]>}
 */
const findByMessage = async (messageId) => {
  return await prisma.attachment.findMany({
    where: { messageId },
  });
};

/**
 * Menghapus attachment berdasarkan ID
 * @param {string} id
 * @returns {Promise<object>}
 */
const remove = async (id) => {
  return await prisma.attachment.delete({
    where: { id },
  });
};

module.exports = {
  create,
  findById,
  findByMessage,
  remove,
};
