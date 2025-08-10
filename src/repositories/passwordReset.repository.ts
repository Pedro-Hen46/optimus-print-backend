import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { addMinutes } from "date-fns";

export async function createPasswordResetToken(
  data: Omit<
    Prisma.PasswordResetTokenCreateInput,
    "user" | "expiresAt" | "used"
  > & {
    userId: string;
  }
) {
  const expiresAt = addMinutes(new Date(), 5);

  return prisma.passwordResetToken.create({
    data: {
      user: { connect: { id: data.userId } },
      token: data.token,
      expiresAt,
      used: false,
    },
  });
}

export async function findValidPasswordResetToken(
  userId: string,
  token: string
) {
  return prisma.passwordResetToken.findFirst({
    where: {
      userId,
      token,
      expiresAt: { gt: new Date() }, // Só retorna se não tiver expirado
      used: false, // Verifica se já foi usado
    },
    include: { user: true }, // Inclui dados do usuário se necessário
  });
}

export async function updateUserPassword(userId: string, newPassword: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { password: newPassword },
  });
}

export async function invalidateResetToken(token: string) {
  return prisma.passwordResetToken.update({
    where: { token },
    data: { used: true }, // Marca o token como utilizado
  });
}

export async function deleteExpiredPasswordResetTokens() {
  return prisma.passwordResetToken.deleteMany({
    where: {
      expiresAt: { lt: new Date() }, // Deleta tokens já expirados
    },
  });
}

export async function findTokensByUserId(userId: string) {
  return prisma.passwordResetToken.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}
