import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";

const categoryUpdateSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório.").optional(),
  type: z.enum(["INCOME", "EXPENSE"]).optional(),
  icon: z.string().optional(),
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
    const categoryId = params.id;

    await prisma.category.deleteMany({
      where: {
        id: categoryId,
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
    const categoryId = params.id;

    const existingCategory = await prisma.category.findFirst({
      where: { id: categoryId, userId },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Categoria não encontrada." },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validatedData = categoryUpdateSchema.parse(body);

    const updatedCategory = await prisma.category.update({
      where: {
        id: categoryId,
      },
      data: validatedData,
    });

    return NextResponse.json(updatedCategory, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao atualizar a categoria." },
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
    const category = await prisma.category.findFirst({
      where: {
        id: params.id,
        userId,
      },
      include: { transactions: true },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Categoria não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao localizar a categoria." },
      { status: 500 }
    );
  }
}
