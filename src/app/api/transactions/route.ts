import { Prisma } from "@/generated/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { useUser } from "@clerk/nextjs";

const transactionSchema = z.object({
  description: z.string().min(1, "A descrição é obrigatória."),
  amount: z.number().positive("O valor deve ser positivo."),
  type: z.enum(["INCOME", "EXPENSE"]),
  date: z.string(),
  categoryId: z.string().cuid("ID da categoria inválido.").optional(),
  creditCardId: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().optional()
  ),
});

export async function POST(request: Request) {
  const { user } = useUser();

  if (!user) {
    return NextResponse.json(
      { error: "Usuário não autenticado." },
      { status: 401 }
    );
  }
  try {
    const body = await transactionSchema.parseAsync(await request.json());

    const newTransaction = await prisma.transaction.create({
      data: {
        ...body,
        amount: new Prisma.Decimal(body.amount),
        date: new Date(body.date),
        userId: user.id,
      },
    });

    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Erro ao criar a transação." },
      { status: 500 }
    );
  }
}

export async function GET() {
  const { user } = useUser();

  if (!user) {
    return NextResponse.json(
      { error: "Usuário não autenticado." },
      { status: 401 }
    );
  }
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        date: "desc",
      },
      include: {
        creditCard: true,
        category: true,
      },
    });
    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao listar as transações." },
      { status: 500 }
    );
  }
}
