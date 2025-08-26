import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";

const cardUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  limit: z.number().positive().optional(),
  closingDay: z.number().int().min(1).max(31).optional(),
  dueDate: z.number().int().min(1).max(31).optional(),
  color: z.string().optional(),
});

// =================================================================
// FUNÇÃO DELETE: Para apagar uma categoria
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
    const cardId = params.id;

    await prisma.creditCard.deleteMany({
      where: {
        id: cardId,
        userId,
      },
    });

    return NextResponse.json(
      { message: "Categoria deletada com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao deletar a categoria." },
      { status: 500 }
    );
  }
}

// =================================================================
// FUNÇÃO PUT: Para atualizar uma categoria
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
    const cardId = params.id;

    const existingCreditCard = await prisma.creditCard.findFirst({
      where: { id: cardId, userId },
    });

    if (!existingCreditCard) {
      return NextResponse.json(
        { error: "Cartão não encontrado." },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validatedData = cardUpdateSchema.parse(body);

    const updatedCard = await prisma.creditCard.update({
      where: {
        id: cardId,
      },
      data: validatedData,
    });

    return NextResponse.json(updatedCard, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao atualizar o cartão." },
      { status: 500 }
    );
  }
}

// =================================================================
// FUNÇÃO GET: Para buscar uma única categoria (útil para o formulário de edição)
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
    const card = await prisma.creditCard.findFirst({
      where: {
        id: params.id,
        userId,
      },
      include: { transactions: true },
    });

    if (!card) {
      return NextResponse.json(
        { error: "Cartão não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(card, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao localizar o cartão." },
      { status: 500 }
    );
  }
}
