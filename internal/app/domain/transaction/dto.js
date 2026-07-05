/**
 * Transaction DTOs (Data Transfer Objects)
 */

const CreateTransactionRequest = (data) => ({
  userId: data.userId,
  companyId: data.companyId || null,
  customerName: data.customerName || null,
  totalPrice: parseFloat(data.totalPrice),
  status: data.status || "PENDING",
  detail: {
    totalCapital: parseFloat(data.detail.totalCapital),
    totalProfit: parseFloat(data.detail.totalProfit),
    discount: parseFloat(data.detail.discount || 0),
    paymentAmount: parseFloat(data.detail.paymentAmount),
    changeAmount: parseFloat(data.detail.changeAmount),
    paymentMethod: data.detail.paymentMethod,
    products: data.detail.products.map((p) => ({
      productId: p.productId,
      quantity: parseInt(p.quantity),
      // Prices will be fetched from Product table in service/repository to ensure integrity
    })),
  },
});

const UpdateTransactionRequest = (data) => ({
  userId: data.userId,
  companyId: data.companyId,
  customerName: data.customerName,
  totalPrice: data.totalPrice ? parseFloat(data.totalPrice) : undefined,
  status: data.status,
});

const TransactionResponse = (transaction) => ({
  id: transaction.id,
  userId: transaction.userId,
  companyId: transaction.companyId,
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
        totalCapital: detail.totalCapital,
        totalProfit: detail.totalProfit,
        discount: detail.discount,
        paymentAmount: detail.paymentAmount,
        changeAmount: detail.changeAmount,
        paymentMethod: detail.paymentMethod,
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
