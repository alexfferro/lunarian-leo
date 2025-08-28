import type { Category } from "@/generated/prisma";

export const getCategories = async (): Promise<Category[]> => {
  const response = await fetch("/api/categories");
  if (!response.ok) throw new Error("Falha ao buscar categorias");
  return response.json();
};

export const createCategory = async (
  data: Partial<Category>
): Promise<Category> => {
  const response = await fetch("/api/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Falha ao criar categoria");
  return response.json();
};

export const updateCategory = async ({
  id,
  ...data
}: Partial<Category> & { id: string }): Promise<Category> => {
  const response = await fetch(`/api/categories/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Falha ao atualizar categoria");
  return response.json();
};

export const deleteCategory = async (id: string) => {
  const response = await fetch(`/api/categories/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Falha ao deletar categoria");
  return response.json();
};
