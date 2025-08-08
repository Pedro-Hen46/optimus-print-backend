import { Request, Response } from "express";
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from "../../repositories/contact.repository";

import { prisma } from "../../lib/prisma";

export async function create(req: Request, res: Response) {
  try {
    const data = req.body;

    // 1. Valida se o clienteId foi enviado
    if (!data.clienteId) {
      return res.status(400).json({ error: "clienteId is required" });
    }

    // 2. Verifica se o cliente existe
    const customerExists = await prisma.customers.findUnique({
      where: { id: data.clienteId },
    });

    if (!customerExists) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // 3. Se isMain for true, desativa outros isMain do mesmo cliente
    if (data.isMain) {
      await prisma.addresses.updateMany({
        where: {
          clienteId: data.clienteId,
          isMain: true,
        },
        data: {
          isMain: false,
        },
      });
    }

    // 4. Cria o endereço
    const address = await prisma.addresses.create({
      data: {
        rua: data.rua,
        numero: data.numero,
        complemento: data.complemento,
        cidade: data.cidade,
        estado: data.estado,
        cep: data.cep,
        isMain: data.isMain || false, // default false se não enviado
        clienteId: data.clienteId,
      },
    });

    return res.status(201).json(address);
  } catch (error) {
    return res.status(400).json({
      error: "Failed to create address",
      details: error instanceof Error ? error.message : error,
    });
  }
}

export async function getAll(req: Request, res: Response) {
  try {
    const addresses = await prisma.addresses.findMany({
      include: {
        cliente: true, // Inclui os dados do cliente relacionado
      },
    });
    return res.json(addresses);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch addresses",
      details: error instanceof Error ? error.message : error,
    });
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const address = await prisma.addresses.findUnique({
      where: { id },
      include: {
        cliente: true, // Inclui os dados do cliente relacionado
      },
    });

    if (!address) return res.status(404).json({ error: "Address not found" });
    return res.json(address);
  } catch (error) {
    return res.status(500).json({
      error: "Error retrieving address",
      details: error instanceof Error ? error.message : error,
    });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const data = req.body;

    // Se estiver atualizando para isMain=true, primeiro desativa outros isMain do mesmo cliente
    if (data.isMain) {
      const currentAddress = await prisma.addresses.findUnique({
        where: { id },
      });
      if (currentAddress) {
        await prisma.addresses.updateMany({
          where: {
            clienteId: currentAddress.clienteId,
            isMain: true,
            id: { not: id }, // Exclui o endereço atual da atualização
          },
          data: {
            isMain: false,
          },
        });
      }
    }

    const updated = await prisma.addresses.update({
      where: { id },
      data,
    });

    return res.json(updated);
  } catch (error) {
    return res.status(400).json({
      error: "Failed to update address",
      details: error instanceof Error ? error.message : error,
    });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Verifica se o endereço existe antes de deletar
    const address = await prisma.addresses.findUnique({ where: { id } });
    if (!address) return res.status(404).json({ error: "Address not found" });

    const deleted = await prisma.addresses.delete({ where: { id } });

    return res.json(deleted);
  } catch (error) {
    return res.status(400).json({
      error: "Failed to delete address",
      details: error instanceof Error ? error.message : error,
    });
  }
}
