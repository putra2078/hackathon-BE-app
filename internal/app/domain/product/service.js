/**
 * Product Service
 * Layer ini berisi business logic dan orkestrasi antar repository atau domain lain
 */

const productRepository = require("./repository");
const prisma = require("../../../pkg/prisma");
const { ProductResponse, StockResponse } = require("./dto");
const { generateProductCode } = require("../../../pkg/code_utils");

const getAllProducts = async () => {
  // Logic Flow:
  // 1. Ambil semua data dari repository
  // 2. Transformasi data ke bentuk Response DTO
  const products = await productRepository.findAll();
  return products.map((product) => ProductResponse(product));
};

const getAllProductStock = async () => {
  const products = await productRepository.findAll();
  return products.map((product) => StockResponse(product));
};

const getProductById = async (id) => {
  // Logic Flow:
  // 1. Cari product berdasarkan ID
  // 2. Jika tidak ditemukan, lempar error
  // 3. Jika ditemukan, transformasi ke Response DTO
  const product = await productRepository.findById(id);
  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }
  return ProductResponse(product);
};

const createProduct = async (productData) => {
  // Logic Flow:
  // 1. Generate unique product code
  // 2. Simpan product baru via repository
  // 3. Kembalikan data yang sudah ditransformasi
  const code = generateProductCode();
  const dataToSave = { ...productData, code };
  const newProduct = await productRepository.create(dataToSave);
  return ProductResponse(newProduct);
};

const updateProduct = async (id, productData) => {
  // Logic Flow:
  // 1. Cek apakah product ada
  // 2. Jika ada, lakukan update
  // 3. Kembalikan data terupdate
  await getProductById(id); // Memastikan product ada
  const updatedProduct = await productRepository.update(id, productData);
  return ProductResponse(updatedProduct);
};

const bulkUpdateStock = async (stockUpdates, userId) => {
  return await prisma.$transaction(async (tx) => {
    const results = [];
    for (const update of stockUpdates) {
      // Validate product existence first
      const product = await tx.product.findUnique({ where: { id: update.id } });
      if (!product) {
        const error = new Error(`Product with ID ${update.id} not found`);
        error.statusCode = 404;
        throw error; // This triggers rollback
      }
      const updatedProduct = await productRepository.updateStock(tx, update.id, update.stock);
      await productRepository.createStockIncrement(tx, update.id, userId, update.stock);
      results.push(ProductResponse(updatedProduct));
    }
    return results;
  });
};

const deleteProduct = async (id) => {
  // Logic Flow:
  // 1. Cek apakah product ada
  // 2. Jika ada, lakukan penghapusan
  await getProductById(id);
  return await productRepository.remove(id);
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProductStock,
  bulkUpdateStock,
};
