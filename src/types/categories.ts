import { TransactionType } from "@/generated/prisma";
import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "O nome é obrigatório."),
  type: z.enum(TransactionType),
  icon: z.string().nullable(),
});

export const categoryFormSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string().min(1, "O nome é obrigatório."),
  type: z.enum(TransactionType),
  icon: z.string().nullable(),
});

export const categoryUpdateSchema = categorySchema.partial();

export type Category = z.infer<typeof categorySchema>;
export type CategoryUpdate = z.infer<typeof categoryUpdateSchema>;

export type CategoryData = {
  id: string;
  name: string;
  type: "INCOME" | "EXPENSE";
  icon?: string | null;
};
