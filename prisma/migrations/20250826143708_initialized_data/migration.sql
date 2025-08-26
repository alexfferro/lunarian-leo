-- CreateEnum
CREATE TYPE "public"."TransactionType" AS ENUM ('INCOME', 'EXPENSE');

-- CreateTable
CREATE TABLE "public"."Transaction" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type" "public"."TransactionType" NOT NULL,
    "userId" TEXT NOT NULL,
    "categoryId" TEXT,
    "creditCardId" TEXT,
    "installmentPurchaseId" TEXT,
    "installmentNumber" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."InstallmentPurchase" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "numberOfInstallments" INTEGER NOT NULL,
    "purchaseDate" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "creditCardId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "InstallmentPurchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CreditCard" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "limit" DECIMAL(10,2) NOT NULL,
    "closingDay" INTEGER NOT NULL,
    "dueDate" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "CreditCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "type" "public"."TransactionType" NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_userId_name_type_key" ON "public"."Category"("userId", "name", "type");

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_creditCardId_fkey" FOREIGN KEY ("creditCardId") REFERENCES "public"."CreditCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_installmentPurchaseId_fkey" FOREIGN KEY ("installmentPurchaseId") REFERENCES "public"."InstallmentPurchase"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InstallmentPurchase" ADD CONSTRAINT "InstallmentPurchase_creditCardId_fkey" FOREIGN KEY ("creditCardId") REFERENCES "public"."CreditCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InstallmentPurchase" ADD CONSTRAINT "InstallmentPurchase_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
