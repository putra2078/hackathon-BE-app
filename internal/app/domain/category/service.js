/**
 * Category Service
 * Layer ini berisi business logic
 */

const categoryRepository = require("./repository");

const getAllCategories = async () => {
  return await categoryRepository.findAll();
};

const getCategoryById = async (id) => {
  const category = await categoryRepository.findById(id);
  if (!category) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }
  return category;
};

const createCategory = async (categoryData) => {
  return await categoryRepository.create(categoryData);
};

const updateCategory = async (id, categoryData) => {
  await getCategoryById(id);
  return await categoryRepository.update(id, categoryData);
};

const deleteCategory = async (id) => {
  await getCategoryById(id);
  return await categoryRepository.remove(id);
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
