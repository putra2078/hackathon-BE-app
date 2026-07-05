const CreateCategoryRequest = (data) => {
  if (!data.name) throw { statusCode: 400, message: "Category name is required" };
  return {
    name: data.name,
    description: data.description || null,
  };
};

const UpdateCategoryRequest = (data) => {
  return {
    name: data.name,
    description: data.description,
  };
};

module.exports = {
  CreateCategoryRequest,
  UpdateCategoryRequest,
};
