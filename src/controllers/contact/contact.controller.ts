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

    // 3. Cria o contato e conecta ao cliente
    const contact = await createContact({
      nome: data.nome,
      email: data.email,
      telefone: data.telefone,
      cliente: {
        connect: { id: data.clienteId },
      },
    });

    return res.status(201).json(contact);
  } catch (error) {
    return res.status(400).json({
      error: "Failed to create contact",
      details: error instanceof Error ? error.message : error,
    });
  }
}

export async function getAll(req: Request, res: Response) {
  try {
    const contacts = await getAllContacts();
    return res.json(contacts);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch contacts" });
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const contact = await getContactById(id);
    if (!contact) return res.status(404).json({ error: "Contact not found" });
    return res.json(contact);
  } catch (error) {
    return res.status(500).json({ error: "Error retrieving contact" });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const data = req.body;
    const updated = await updateContact(id, data);
    return res.json(updated);
  } catch (error) {
    return res.status(400).json({ error: "Failed to update contact" });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await deleteContact(id);
    return res.json(deleted);
  } catch (error) {
    return res.status(400).json({ error: "Failed to delete contact" });
  }
}
