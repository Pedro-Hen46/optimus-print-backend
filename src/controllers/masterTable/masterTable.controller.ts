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
import {
  getUrlFileSigned,
  uploadSingle,
  uploadSingleInternal,
} from "../upload/s3-upload.controller";
import { FileUploadSchema } from "../../schemas/s3-upload.schama";
import { deleteUploadedFile } from "../../repositories/s3-upload.repository";

export async function create(req: Request, res: Response) {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "Nenhum arquivo enviado" });
    }

    console.log(file);

    // 1. Faz o upload do arquivo primeiro
    const validatedImage = FileUploadSchema.parse(file);

    let uploadResponse: any;

    if (validatedImage) {
      uploadResponse = await uploadSingleInternal(file);

      if (!uploadResponse || !uploadResponse.id) {
        throw new Error("Falha no upload do arquivo");
      }
    }

    // 2. Cria o MasterTable com o imageId
    const validatedData = MasterTableCreateSchema.parse({
      ...req.body,
      imageId: uploadResponse.id, // Associa o ID do arquivo enviado
    });

    const masterTable = await createMasterTable(validatedData);

    return res.status(201).json(masterTable);
  } catch (error) {
    console.error("Error creating master table:", error);
    return res.status(400).json({ error: error.message });
  }
}

export async function getAll(req: Request, res: Response) {
  try {
    const masterTables = await getAllMasterTables();

    // Adiciona URLs assinadas para cada item
    const tablesWithUrls = await Promise.all(
      masterTables.map(async (table) => {
        try {
          const imageUrl = table.imageId
            ? await getUrlFileSigned(table.imageId)
            : null;
          return {
            ...table,
            imageUrl: imageUrl || null,
          };
        } catch (error) {
          console.error(`Error generating URL for table ${table.id}:`, error);
          return {
            ...table,
            imageUrl: null,
          };
        }
      })
    );

    return res.json(tablesWithUrls);
  } catch (error) {
    console.error("Error fetching master tables:", error);
    return res.status(500).json({ error: "Falha ao buscar registros" });
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const itemTable = await getMasterTableById(id);

    if (!itemTable) {
      return res.status(404).json({ error: "Registro não encontrado" });
    }

    let imageUrl = null;
    if (itemTable.imageId) {
      try {
        imageUrl = await getUrlFileSigned(itemTable.imageId);
      } catch (error) {
        console.error(
          `Error generating URL for image ${itemTable.imageId}:`,
          error
        );
      }
    }

    return res.json({
      ...itemTable,
      imageUrl,
    });
  } catch (error) {
    console.error("Error fetching master table:", error);
    return res.status(500).json({ error: "Falha ao buscar registro" });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const file = req.file;

    // Verifica se o registro existe
    const existingItem = await getMasterTableById(id);
    if (!existingItem) {
      return res.status(404).json({ error: "Registro não encontrado" });
    }

    let imageId = existingItem.imageId;
    let uploadResponse: any;

    // Se um novo arquivo foi enviado
    if (file) {
      const validatedImage = FileUploadSchema.parse(file);
      uploadResponse = await uploadSingleInternal(file);

      if (!uploadResponse?.id) {
        throw new Error("Falha no upload do novo arquivo");
      }

      if (file) {
        const validatedImage = FileUploadSchema.parse(file);
        const uploadResponse = await uploadSingleInternal(file);

        if (!uploadResponse?.id) {
          throw new Error("Falha no upload do novo arquivo");
        }

        // Deleta a imagem antiga apenas após o novo upload ser bem-sucedido
        if (existingItem.imageId) {
          await deleteUploadedFile(existingItem.imageId);
        }

        imageId = uploadResponse.id;
      }

      // Valida e prepara os dados
      const validatedData = MasterTableCreateSchema.parse({
        ...req.body,
        imageId, // Usa o novo imageId se houve upload, ou mantém o existente
      });

      // Atualiza o registro
      const updatedItem = await updateMasterTable(id, validatedData);

      return res.json(updatedItem);
    }
  } catch (error) {
    console.error("Error updating master table:", error);
    return res.status(400).json({
      error: error.message || "Falha ao atualizar registro",
    });
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
