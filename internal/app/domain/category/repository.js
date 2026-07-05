/**
 * Category Repository
 * Layer ini bertanggung jawab untuk interaksi langsung dengan database (Prisma)
 */

const prisma = require("../../../pkg/prisma");

const findAll = async () => {
  return await prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

const findById = async (id) => {
  return await prisma.category.findUnique({
    where: { id },
  });
};

const create = async (data) => {
  return await prisma.category.create({
    data,
  });
};

const update = async (id, data) => {
  return await prisma.category.update({
    where: { id },
    data,
  });
};

const remove = async (id) => {
  return await prisma.category.delete({
    where: { id },
  });
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};
