import { prisma } from "../lib/prisma";
import { Prisma } from "@prisma/client";

export async function createCustomer(data: Prisma.CustomersCreateInput) {
  return prisma.customers.create({ data });
}

export async function getAllCustomers() {
  return prisma.customers.findMany({
    include: {
      contatos: true,
      enderecos: true,
    },
  });
}

export async function getCustomerById(id: string) {
  return prisma.customers.findUnique({
    where: { id },
    include: {
      contatos: true,
      enderecos: true,
    },
  });
}

export async function updateCustomer(
  id: string,
  data: Prisma.CustomersUpdateInput
) {
  return prisma.customers.update({
    where: { id },
    data,
  });
}

export async function deleteCustomer(id: string) {
  return prisma.customers.delete({
    where: { id },
  });
}
