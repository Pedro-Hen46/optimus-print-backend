import { prisma } from "../lib/prisma";

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({ where: { email } });
};


export function createUserByAdmin(data: {
  email: string;
  name: string;
  password: string;
  role: 'user' | 'admin';
}) {
  return prisma.user.create({ data });
}


