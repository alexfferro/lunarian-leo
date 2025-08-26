import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";

const transactionUpdateSchema = z.object({
  description: z.string().min(1).optional(),
  amount: z.number().positive().optional(),
  type: z.enum(["INCOME", "EXPENSE"]).optional(),
  date: z.string().optional(),
  categoryId: z.string().optional(),
  creditCardId: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().optional()
  ),
});

// =================================================================
// FUNÇÃO DELETE: Para apagar uma transação
// =================================================================
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Usuário não autenticado." },
      { status: 401 }
    );
  }
  try {
    const transactionId = params.id;

    await prisma.transaction.deleteMany({
      where: {
        id: transactionId,
        userId,
      },
    });

    return NextResponse.json(
      { message: "Transação deletada com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao deletar a transação." },
      { status: 500 }
    );
  }
}

// =================================================================
// FUNÇÃO PUT: Para atualizar uma transação
// =================================================================
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Usuário não autenticado." },
      { status: 401 }
    );
  }

  try {
    const transactionId = params.id;

    const existingTransaction = await prisma.transaction.findFirst({
      where: { id: transactionId, userId },
    });

    if (!existingTransaction) {
      return NextResponse.json(
        { error: "Transação não encontrada." },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validatedData = transactionUpdateSchema.parse(body);

    const updatedTransaction = await prisma.transaction.update({
      where: {
        id: transactionId,
      },
      data: validatedData,
    });

    return NextResponse.json(updatedTransaction, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao atualizar a transação." },
      { status: 500 }
    );
  }
}

// =================================================================
// FUNÇÃO GET: Para buscar uma única transação (útil para o formulário de edição)
// =================================================================
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Usuário não autenticado." },
      { status: 401 }
    );
  }

  try {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: params.id,
        userId,
      },
      include: { category: true, creditCard: true },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transação não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(transaction);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao buscar a transação." },
      { status: 500 }
    );
  }
}
