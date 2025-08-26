import { PrismaClient } from "@/generated/prisma";

// Declara uma variável global para armazenar a instância do Prisma
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Cria a instância do Prisma Client, reutilizando a instância global se ela existir
// em ambiente de desenvolvimento. Em produção, sempre cria uma nova.
const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query"], // Opcional: para ver as queries SQL no console durante o desenvolvimento
  });

// Em ambiente de desenvolvimento, armazena a instância no objeto global.
// Isso evita que o hot-reloading crie múltiplas instâncias.
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;
