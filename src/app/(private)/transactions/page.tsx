"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import type { Transaction } from "@/generated/prisma";
import {
  useDeleteTransaction,
  useGetTransactions,
} from "@/hooks/useTransactions";
import { CreateTransactionForm } from "@/components/transactions/create-transaction-form";

export default function TransactionsPage() {
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  const { data: transactions, isLoading } = useGetTransactions();
  const { mutate: deleteMutate, isPending: isDeletePending } =
    useDeleteTransaction();

  return (
    <div className="container mx-auto p-4 md:p-8 relative min-h-screen">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold"> Suas Transações</h1>
      </header>

      {isLoading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {transactions?.map((transaction) => (
            <div>{transaction.description}</div>
          ))}
        </div>
      )}
      <div className="fixed bottom-18 right-5 z-50">
        <CreateTransactionForm />
      </div>
      {/* <UpdateCategoryDialog
        category={editingCategory}
        onClose={() => setEditingCategory(null)}
      /> */}
    </div>
  );
}
