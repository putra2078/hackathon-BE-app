/**
 * Product Handler
 * Layer ini bertanggung jawab untuk menangani request HTTP dan mengirim response
 */

const productService = require("./service");
const { CreateProductRequest, UpdateProductRequest, StockUpdateRequest } = require("./dto");

const getAll = async (req, res) => {
  try {
    // Logic Flow: Memanggil service untuk mendapatkan semua product
    const products = await productService.getAllProducts();
    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const getStock = async (req, res) => {
  try {
    const stockData = await productService.getAllProductStock();
    return res.status(200).json({
      success: true,
      data: stockData,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const patchStock = async (req, res) => {
  try {
    const stockUpdates = StockUpdateRequest(req.body);
    const userId = req.user.id; // Assuming user ID is in token payload
    const updatedProducts = await productService.bulkUpdateStock(stockUpdates, userId);
    return res.status(200).json({
      success: true,
      message: "Stock updated successfully",
      data: updatedProducts,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const getById = async (req, res) => {
  try {
    // Logic Flow: Mengambil ID dari params dan memanggil service
    const { id } = req.params;
    const product = await productService.getProductById(id);
    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const create = async (req, res) => {
  try {
    // Logic Flow: Validasi/Transformasi request body menggunakan DTO, lalu panggil service
    const productData = CreateProductRequest(req.body);
    const newProduct = await productService.createProduct(productData);
    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const update = async (req, res) => {
  try {
    // Logic Flow: Mengambil ID dari params dan body, lalu panggil service update
    const { id } = req.params;
    const productData = UpdateProductRequest(req.body);
    const updatedProduct = await productService.updateProduct(id, productData);
    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const remove = async (req, res) => {
  try {
    // Logic Flow: Menghapus data berdasarkan ID yang dikirim
    const { id } = req.params;
    await productService.deleteProduct(id);
    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAll,
  getStock,
  patchStock,
  getById,
  create,
  update,
  remove,
};
