import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const installmentUpdateSchema = z.object({
  description: z.string().min(1).optional(),
  totalAmount: z.number().positive().optional(),
  numberOfInstallments: z.number().int().min(2).optional(),
  purchaseDate: z.string().optional(),
  creditCardId: z.string().optional(),
  categoryId: z.string().optional(),
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
    const purchaseId = params.id;

    const result = await prisma.$transaction(async (tx) => {
      const purchase = await tx.installmentPurchase.findFirst({
        where: { id: purchaseId, userId },
        include: { transactions: { orderBy: { date: "asc" } } },
      });

      if (!purchase) {
        throw new Error("Compra parcelada não encontrada.");
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (
        purchase.transactions.length > 0 &&
        new Date(purchase.transactions[0].date) < today
      ) {
        throw new Error(
          "Não é possível deletar uma compra com parcelas que já passaram."
        );
      }
      await tx.transaction.deleteMany({
        where: { installmentPurchaseId: purchaseId },
      });

      await tx.installmentPurchase.delete({
        where: { id: purchaseId },
      });
    });

    return NextResponse.json(
      { message: "Compra parcelada deletada com sucesso." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
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
    const purchaseId = params.id;
    const body = await installmentUpdateSchema.parseAsync(await request.json());

    const result = await prisma.$transaction(async (tx) => {
      const updatedPurchase = await tx.installmentPurchase.update({
        where: { id: purchaseId, userId },
        data: {
          description: body.description,
          categoryId: body.categoryId,
        },
      });

      if (body.description) {
        const transactions = await tx.transaction.findMany({
          where: { installmentPurchaseId: purchaseId },
        });

        for (const txToUpdate of transactions) {
          await tx.transaction.update({
            where: { id: txToUpdate.id },
            data: {
              description: `${body.description} (${txToUpdate.installmentNumber}/${transactions.length})`,
            },
          });
        }
      }

      if (body.categoryId) {
        await tx.transaction.updateMany({
          where: { installmentPurchaseId: purchaseId },
          data: { categoryId: body.categoryId },
        });
      }

      return updatedPurchase;
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao atualizar a compra parcelada." },
      { status: 500 }
    );
  }
}
