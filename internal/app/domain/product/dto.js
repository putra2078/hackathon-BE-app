/**
 * Product DTOs (Data Transfer Objects)
 */

const CreateProductRequest = (data) => ({
  code: data.code,
  name: data.name,
  description: data.description || null,
  image: data.image || null,
  categoryId: data.categoryId,
  buyPrice: parseFloat(data.buyPrice),
  sellPrice: parseFloat(data.sellPrice),
  stock: parseInt(data.stock),
});

const UpdateProductRequest = (data) => ({
  code: data.code,
  name: data.name,
  description: data.description,
  image: data.image,
  categoryId: data.categoryId,
  buyPrice: data.buyPrice ? parseFloat(data.buyPrice) : undefined,
  sellPrice: data.sellPrice ? parseFloat(data.sellPrice) : undefined,
  stock: data.stock ? parseInt(data.stock) : undefined,
});

const ProductResponse = (product) => ({
  id: product.id,
  code: product.code,
  name: product.name,
  description: product.description,
  image: product.image,
  categoryId: product.categoryId,
  category: product.category,
  buyPrice: product.buyPrice,
  sellPrice: product.sellPrice,
  stock: product.stock,
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
});

const StockUpdateRequest = (data) => {
  if (!Array.isArray(data)) {
    throw new Error("Invalid request format: expected an array of products");
  }
  return data.map((item) => ({
    id: item.id,
    stock: parseInt(item.stock),
  }));
};

const StockResponse = (product) => ({
  name: product.name,
  buyPrice: product.buyPrice,
  stock: product.stock,
  category: product.category,
});

module.exports = {
  CreateProductRequest,
  UpdateProductRequest,
  ProductResponse,
  StockUpdateRequest,
  StockResponse,
};
