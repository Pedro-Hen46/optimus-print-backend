import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

export async function createAddress(data: Prisma.AddressesCreateInput) {
  return prisma.addresses.create({ data });
}

export async function getAllAddresses() {
  return prisma.addresses.findMany({ include: { cliente: true } });
}

export async function getAddressById(id: string) {
  return prisma.addresses.findUnique({
    where: { id },
    include: { cliente: true },
  });
}

export async function updateAddress(
  id: string,
  data: Prisma.AddressesUpdateInput
) {
  return prisma.addresses.update({
    where: { id },
    data,
  });
}

export async function deleteAddress(id: string) {
  return prisma.addresses.delete({
    where: { id },
  });
}
