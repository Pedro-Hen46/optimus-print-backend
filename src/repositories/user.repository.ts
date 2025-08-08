import { prisma } from "../lib/prisma";

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({ where: { email } });
};

export function createUserByAdmin(data: {
  email: string;
  name: string;
  password: string;
  role: "user" | "admin";
}) {
  return prisma.user.create({ data });
}

export function getUserById(userId: string) {
  return prisma.user.findFirst({ where: { id: userId } });
}

export async function updateUserById(
  id: string,
  data: { name?: string; email?: string; password?: string; role?: string }
) {
  return prisma.user.update({
    where: { id },
    data: {
      ...data,
      ...(data.password && { password: data.password }),
    },
  });
}

export async function deleteUserById(id: string) {
  return prisma.user.delete({ where: { id } });
}

export async function getAllUsers() {
  return prisma.user.findMany();
}
