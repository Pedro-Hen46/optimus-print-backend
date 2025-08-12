import { prisma } from "../lib/prisma";
import {
  StockPrinterCreateInput,
  StockPrinterUpdateInput,
} from "../schemas/stock-printer.schema";

export async function createStockPrinter(input: StockPrinterCreateInput) {
  return prisma.stockPrinters.create({
    data: input,
    include: { model: true },
  });
}

export async function getStockPrinter(id: string) {
  return prisma.stockPrinters.findUnique({
    where: { id },
    include: { model: true },
  });
}

export async function getStockPrinterBySerial(serialNumber: string) {
  return prisma.stockPrinters.findUnique({
    where: { serialNumber },
    include: { model: true },
  });
}

export async function getAllStockPrinters() {
  return prisma.stockPrinters.findMany({
    include: { model: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateStockPrinter(
  id: string,
  input: StockPrinterUpdateInput
) {
  return prisma.stockPrinters.update({
    where: { id },
    data: input,
    include: { model: true },
  });
}

export async function deleteStockPrinter(id: string) {
  return prisma.stockPrinters.delete({
    where: { id },
  });
}

export async function incrementCounters(id: string, pb: number, color: number) {
  return prisma.stockPrinters.update({
    where: { id },
    data: {
      counterPb: { increment: pb },
      counterColor: { increment: color },
    },
  });
}
