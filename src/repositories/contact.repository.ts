import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

export async function createContact(data: Prisma.ContactsCreateInput) {
  return prisma.contacts.create({ data });
}

export async function getAllContacts() {
  return prisma.contacts.findMany({ include: { cliente: true } });
}

export async function getContactById(id: string) {
  return prisma.contacts.findUnique({
    where: { id },
    include: { cliente: true },
  });
}

export async function updateContact(
  id: string,
  data: Prisma.ContactsUpdateInput
) {
  return prisma.contacts.update({
    where: { id },
    data,
  });
}

export async function deleteContact(id: string) {
  return prisma.contacts.delete({
    where: { id },
  });
}
