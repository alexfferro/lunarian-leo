import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { endOfMonth, startOfMonth } from "date-fns";
import { useUser } from "@clerk/nextjs";

export async function GET() {
  const { user } = useUser();

  if (!user) {
    return NextResponse.json(
      { error: "Usuário não autenticado." },
      { status: 401 }
    );
  }

  try {
    const today = new Date();
    const startDate = startOfMonth(today);
    const endDate = endOfMonth(today);

    const totals = await prisma.transaction.groupBy({
      by: ["type"],
      where: {
        userId: user.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
        type: {
          in: ["INCOME", "EXPENSE"],
        },
      },
      _sum: {
        amount: true,
      },
    });

    const totalIncome =
      totals.find((t) => t.type === "INCOME")?._sum.amount ?? 0;
    const totalExpenses =
      totals.find((t) => t.type === "EXPENSE")?._sum.amount ?? 0;
    const balance = Number(totalIncome) - Number(totalExpenses);

    const expensesByCategory = await prisma.transaction.groupBy({
      by: ["categoryId"],
      where: {
        userId: user.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
        type: "EXPENSE",
        categoryId: {
          not: null,
        },
      },
      _sum: {
        amount: true,
      },
    });

    const categoryIds = expensesByCategory.map((item) => item.categoryId!);
    const categories = await prisma.category.findMany({
      where: {
        id: {
          in: categoryIds,
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    const categoryMap = new Map(categories.map((cat) => [cat.id, cat.name]));

    const chartData = expensesByCategory.map((item) => ({
      category: categoryMap.get(item.categoryId!) ?? "Outros",
      total: Number(item._sum.amount),
    }));

    return NextResponse.json({
      totalIncome: Number(totalIncome),
      totalExpenses: Number(totalExpenses),
      balance,
      chartData,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao buscar o resumo financeiro." },
      { status: 500 }
    );
  }
}
