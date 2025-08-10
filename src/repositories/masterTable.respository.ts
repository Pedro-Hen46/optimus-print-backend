import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

export async function createMasterTable(data: Prisma.MasterTableCreateInput) {
  return prisma.masterTable.create({ data });
}

export async function getAllMasterTables() {
  return prisma.masterTable.findMany();
}

export async function getMasterTableById(id: string) {
  return prisma.masterTable.findUnique({ where: { id } });
}

export async function updateMasterTable(
  id: string,
  data: Prisma.MasterTableUpdateInput
) {
  return prisma.masterTable.update({
    where: { id },
    data,
  });
}

export async function deleteMasterTable(id: string) {
  return prisma.masterTable.delete({ where: { id } });
}

// Busca por tipo (exemplo de método adicional)
export async function getMasterTablesByType(type: string) {
  return prisma.masterTable.findMany({ where: { type } });
}
