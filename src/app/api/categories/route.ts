import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { useUser } from "@clerk/nextjs";

const categorySchema = z.object({
  name: z.string().min(1, "O nome é obrigatório."),
  type: z.enum(["INCOME", "EXPENSE"]),
  icon: z.string().optional(),
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
    const body = await categorySchema.parseAsync(await request.json());

    const newCategory = await prisma.category.create({
      data: {
        name: body.name,
        type: body.type,
        icon: body.icon,
        userId: user.id,
      },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Erro ao criar a categoria." },
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
    const categories = await prisma.category.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        name: "asc",
      },
    });
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao listar as categorias." },
      { status: 500 }
    );
  }
}
