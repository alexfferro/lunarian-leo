import { TransactionType } from "@/generated/prisma";
import z from "zod";

export const transactionSchema = z.object({
  description: z.string().min(1, "A descrição é obrigatória."),
  amount: z.number().positive("O valor deve ser positivo."),
  type: z.enum(TransactionType),
  date: z.string(),
  categoryId: z.string().optional(),
  creditCardId: z.string().optional(),
});

export const transactionUpdateSchema = z.object({
  id: z.string(),
  userId: z.string(),
  description: z.string().min(1).optional(),
  amount: z.number().positive().optional(),
  type: z.enum(TransactionType).optional(),
  date: z.string().optional(),
  categoryId: z.string().optional(),
  creditCardId: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().optional()
  ),
});

export type TransactionData = z.infer<typeof transactionSchema>;
export type TransactionUpdateData = z.infer<typeof transactionUpdateSchema>;
