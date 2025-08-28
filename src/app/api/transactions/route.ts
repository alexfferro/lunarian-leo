import { Prisma } from "@/generated/prisma";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { transactionSchema } from "@/types/transactions";

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
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
        userId,
      },
    });

    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error) {
    console.error(error);
    if (error) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Erro ao criar a transação." },
      { status: 500 }
    );
  }
}

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Usuário não autenticado." },
      { status: 401 }
    );
  }

  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
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
