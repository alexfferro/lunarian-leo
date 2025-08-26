import type { CreditCard } from "@/generated/prisma";

type CreditCardData = {
  id: string;
  name: string;
  color: string;
  limit: number;
  closingDay: number;
  dueDate: number;
  userId: string;
};

export const getCreditCards = async (): Promise<CreditCard[]> => {
  const response = await fetch("/api/cards");
  if (!response.ok) throw new Error("Falha ao buscar cartões de crédito");
  return response.json();
};

export const createCreditCard = async (
  data: Partial<CreditCardData>
): Promise<CreditCard> => {
  const response = await fetch("/api/cards", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Falha ao criar cartões de crédito");
  return response.json();
};

export const updateCreditCard = async ({
  id,
  ...data
}: Partial<CreditCardData> & { id: string }): Promise<CreditCard> => {
  const response = await fetch(`/api/cards/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Falha ao atualizar cartão de crédito");
  return response.json();
};

export const deleteCreditCard = async (id: string) => {
  const response = await fetch(`/api/cards/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Falha ao deletar cartão de crédito");
  return response.json();
};
