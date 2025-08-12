import { Request, Response } from "express";
import {
  createStockPrinter,
  deleteStockPrinter,
  getAllStockPrinters,
  getStockPrinter,
  getStockPrinterBySerial,
  updateStockPrinter,
} from "../../repositories/stock_printer.repository";

import {
  StockPrinterCreateSchema,
  StockPrinterUpdateSchema,
} from "../../schemas/stock-printer.schema";

export async function create(req: Request, res: Response) {
  try {
    if (req.body.serialNumber) {
      req.body.serialNumber = req.body.serialNumber.toUpperCase();
    }

    const validatedData = StockPrinterCreateSchema.parse(req.body);

    // Verifica se o serial number já existe
    const existing = await getStockPrinterBySerial(validatedData.serialNumber);
    if (existing) {
      return res.status(400).json({ error: "Número de série já cadastrado" });
    }

    const printer = await createStockPrinter(validatedData);
    return res.status(201).json(printer);
  } catch (error) {
    console.error("Error creating stock printer:", error);
    return res
      .status(400)
      .json({ error: error.message || "Falha ao criar impressora" });
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const printer: any = await getStockPrinter(id);

    if (!printer) {
      return res.status(404).json({ error: "Impressora não encontrada" });
    }

    return res.json(printer);
  } catch (error) {
    console.error("Error fetching stock printer:", error);
    return res.status(500).json({ error: "Falha ao buscar impressora" });
  }
}

export async function getAll(req: Request, res: Response) {
  try {
    const printers = await getAllStockPrinters();
    return res.json(printers);
  } catch (error) {
    console.error("Error fetching stock printers:", error);
    return res.status(500).json({ error: "Falha ao buscar impressoras" });
  }
}

export async function update(req: Request, res: Response) {
  try {
    if (req.body.serialNumber) {
      req.body.serialNumber = req.body.serialNumber.toUpperCase();
    }

    const { id } = req.params;
    const validatedData = StockPrinterUpdateSchema.parse(req.body);

    // Verifica se a impressora existe
    const existing = await getStockPrinter(id);
    if (!existing) {
      return res.status(404).json({ error: "Impressora não encontrada" });
    }

    // Se estiver alterando o serial, verifica se já existe
    if (
      validatedData.serialNumber &&
      validatedData.serialNumber !== existing.serialNumber
    ) {
      const serialExists = await getStockPrinterBySerial(
        validatedData.serialNumber
      );
      if (serialExists) {
        return res
          .status(400)
          .json({ error: "Número de série já está em uso" });
      }
    }

    const updatedPrinter = await updateStockPrinter(id, validatedData);
    return res.json(updatedPrinter);
  } catch (error) {
    console.error("Error updating stock printer:", error);
    return res
      .status(400)
      .json({ error: error.message || "Falha ao atualizar impressora" });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const printer = await getStockPrinter(id);
    if (!printer) {
      return res.status(404).json({ error: "Impressora não encontrada" });
    }

    await deleteStockPrinter(id);
    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting stock printer:", error);
    return res.status(500).json({ error: "Falha ao remover impressora" });
  }
}

export async function getBySerial(req: Request, res: Response) {
  try {
    const { serialNumber } = req.params;
    const printer = await getStockPrinterBySerial(serialNumber);

    if (!printer) {
      return res.status(404).json({ error: "Impressora não encontrada" });
    }

    return res.json(printer);
  } catch (error) {
    console.error("Error fetching printer by serial:", error);
    return res.status(500).json({ error: "Falha ao buscar impressora" });
  }
}
