import type { Transaction } from "@/generated/prisma";

type TransactionData = {
  id: string;
  userId: string;
  description: string;
  amount: number;
  date: string;
  type: string;
  categoryId: string;
  creditCardId?: string;
  installmentPurchaseId?: number;
  installmentNumbers?: number;
};

export const getTransactions = async (): Promise<Transaction[]> => {
  const response = await fetch("/api/transactions");
  if (!response.ok) throw new Error("Falha ao buscar transações");
  return response.json();
};

export const createTransaction = async (
  data: Partial<TransactionData>
): Promise<Transaction> => {
  const response = await fetch("/api/transactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Falha ao criar transação");
  return response.json();
};

export const updateTransaction = async ({
  id,
  ...data
}: Partial<TransactionData> & { id: string }): Promise<Transaction> => {
  const response = await fetch(`/api/transactions/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Falha ao atualizar transação");
  return response.json();
};

export const deleteTransaction = async (id: string) => {
  const response = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Falha ao deletar transação");
  return response.json();
};
