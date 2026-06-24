/**
 * Transaction DTOs (Data Transfer Objects)
 */

const CreateTransactionRequest = (data) => ({
  userId: data.userId,
  customerName: data.customerName || null,
  totalPrice: parseFloat(data.totalPrice),
  status: data.status || "PENDING",
  detail: {
    totalModal: parseFloat(data.detail.totalModal),
    totalProfit: parseFloat(data.detail.totalProfit),
    diskon: parseFloat(data.detail.diskon || 0),
    nominalPembayaran: parseFloat(data.detail.nominalPembayaran),
    kembalian: parseFloat(data.detail.kembalian),
    metodeBayar: data.detail.metodeBayar,
    products: data.detail.products.map((p) => ({
      productId: p.productId,
      quantity: parseInt(p.quantity),
      // Prices will be fetched from Product table in service/repository to ensure integrity
    })),
  },
});

const UpdateTransactionRequest = (data) => ({
  userId: data.userId,
  customerName: data.customerName,
  totalPrice: data.totalPrice ? parseFloat(data.totalPrice) : undefined,
  status: data.status,
});

const TransactionResponse = (transaction) => ({
  id: transaction.id,
  userId: transaction.userId,
  customerName: transaction.customerName,
  totalPrice: transaction.totalPrice,
  status: transaction.status,
  createdAt: transaction.createdAt,
  updatedAt: transaction.updatedAt,
  user: transaction.user
    ? {
        id: transaction.user.id,
        name: transaction.user.name,
        email: transaction.user.email,
      }
    : undefined,
  details: transaction.detailTransactions
    ? transaction.detailTransactions.map((detail) => ({
        id: detail.id,
        totalModal: detail.totalModal,
        totalProfit: detail.totalProfit,
        diskon: detail.diskon,
        nominalPembayaran: detail.nominalPembayaran,
        kembalian: detail.kembalian,
        metodeBayar: detail.metodeBayar,
        boughtProducts: detail.boughtProducts
          ? detail.boughtProducts.map((bp) => ({
              id: bp.id,
              productId: bp.productId,
              code: bp.code,
              name: bp.name,
              buyPrice: bp.buyPrice,
              sellPrice: bp.sellPrice,
              quantity: bp.quantity,
              subtotal: bp.subtotal,
            }))
          : [],
      }))
    : [],
});

module.exports = {
  CreateTransactionRequest,
  UpdateTransactionRequest,
  TransactionResponse,
};
