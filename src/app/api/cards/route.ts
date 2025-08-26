import { Prisma } from "@/generated/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { useUser } from "@clerk/nextjs";

const cardSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório."),
  limit: z.number().positive("O limite deve ser positivo."),
  closingDay: z.number().int().min(1).max(31),
  dueDate: z.number().int().min(1).max(31),
  color: z.string(),
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
    const body = await cardSchema.parseAsync(await request.json());

    const newCard = await prisma.creditCard.create({
      data: {
        ...body,
        limit: new Prisma.Decimal(body.limit),
        userId: user.id,
      },
    });

    return NextResponse.json(newCard, { status: 201 });
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Erro ao criar o cartão." },
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
    const cards = await prisma.creditCard.findMany({
      where: {
        userId: user.id,
      },
    });
    return NextResponse.json(cards, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao buscar os cartões." },
      { status: 500 }
    );
  }
}
