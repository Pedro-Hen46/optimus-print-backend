import { Request, Response } from "express";
import {
  MasterTableCreateSchema,
  MasterTableUpdateSchema,
} from "../../schemas/masterTable.schema";
import {
  createMasterTable,
  deleteMasterTable,
  getAllMasterTables,
  getMasterTableById,
  getMasterTablesByType,
  updateMasterTable,
} from "../../repositories/masterTable.respository";

export async function create(req: Request, res: Response) {
  try {
    const validatedData = MasterTableCreateSchema.parse(req.body);
    const masterTable = await createMasterTable(validatedData);
    return res.status(201).json(masterTable);
  } catch (error) {
    console.error("Error creating master table:", error);
    return res.status(400).json({ error: "Falha ao criar registro" });
  }
}

export async function getAll(req: Request, res: Response) {
  try {
    const masterTables = await getAllMasterTables();
    return res.json(masterTables);
  } catch (error) {
    console.error("Error fetching master tables:", error);
    return res.status(500).json({ error: "Falha ao buscar registros" });
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const masterTable = await getMasterTableById(id);

    if (!masterTable) {
      return res.status(404).json({ error: "Registro não encontrado" });
    }

    return res.json(masterTable);
  } catch (error) {
    console.error("Error fetching master table:", error);
    return res.status(500).json({ error: "Falha ao buscar registro" });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = MasterTableUpdateSchema.parse(req.body);
    const updated = await updateMasterTable(id, validatedData);
    return res.json(updated);
  } catch (error) {
    console.error("Error updating master table:", error);
    return res.status(400).json({ error: "Falha ao atualizar registro" });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await deleteMasterTable(id);
    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting master table:", error);
    return res.status(500).json({ error: "Falha ao deletar registro" });
  }
}

// Exemplo de método adicional
export async function getByType(req: Request, res: Response) {
  try {
    const { type } = req.params;
    const masterTables = await getMasterTablesByType(type);
    return res.json(masterTables);
  } catch (error) {
    console.error("Error fetching by type:", error);
    return res.status(500).json({ error: "Falha ao buscar por tipo" });
  }
}
