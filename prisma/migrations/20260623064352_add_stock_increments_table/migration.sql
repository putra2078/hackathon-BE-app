-- CreateTable
CREATE TABLE "stock_increments" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stock_increments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "stock_increments" ADD CONSTRAINT "stock_increments_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
