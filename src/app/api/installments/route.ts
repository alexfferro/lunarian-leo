import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { addMonths } from "date-fns";
import { useUser } from "@clerk/nextjs";
import { Prisma } from "@/generated/prisma";

const installmentSchema = z.object({
  description: z.string().min(1, "A descrição é obrigatória."),
  totalAmount: z.number().positive("O valor total deve ser positivo."),
  numberOfInstallments: z.number().int().min(2, "O mínimo são 2 parcelas."),
  purchaseDate: z.string(),
  creditCardId: z.string(),
  categoryId: z.string(),
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
    const body = await installmentSchema.parseAsync(await request.json());
    const {
      description,
      totalAmount,
      numberOfInstallments,
      purchaseDate,
      creditCardId,
      categoryId,
    } = body;

    const installmentAmount = totalAmount / numberOfInstallments;
    const initialDate = new Date(purchaseDate);

    const result = await prisma.$transaction(async (tx) => {
      const purchase = await tx.installmentPurchase.create({
        data: {
          description,
          totalAmount: new Prisma.Decimal(totalAmount),
          numberOfInstallments,
          purchaseDate: initialDate,
          userId: user.id,
          creditCardId: creditCardId,
          categoryId: categoryId,
        },
      });

      const transactionPromises = [];
      for (let i = 1; i <= numberOfInstallments; i++) {
        const transactionDate = addMonths(initialDate, i - 1);

        const promise = tx.transaction.create({
          data: {
            description: `${description} (${i}/${numberOfInstallments})`,
            amount: new Prisma.Decimal(installmentAmount),
            date: transactionDate,
            type: "EXPENSE",
            userId: user.id,
            categoryId: categoryId,
            creditCardId: creditCardId,
            installmentPurchaseId: purchase.id,
            installmentNumber: i,
          },
        });
        transactionPromises.push(promise);
      }

      await Promise.all(transactionPromises);
      return purchase;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Erro ao criar a compra parcelada." },
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
    const installments = await prisma.installmentPurchase.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        purchaseDate: "desc",
      },
      include: {
        creditCard: true,
        category: true,
      },
    });
    return NextResponse.json(installments, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao listar as parcelas." },
      { status: 500 }
    );
  }
}
