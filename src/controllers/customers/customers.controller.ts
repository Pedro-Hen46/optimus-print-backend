import { Request, Response } from "express";
import {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "../../repositories/customer.repository";

export async function create(req: Request, res: Response) {
  try {
    const data = req.body;

    // 💡 Regra de negócio: pelo menos 1 endereço obrigatório
    const hasValidAddress =
      data?.enderecos?.create &&
      Array.isArray(data.enderecos.create) &&
      data.enderecos.create.length > 0;

    if (!hasValidAddress) {
      return res.status(400).json({
        error: "At least one address is required to create a customer.",
      });
    }

    const customer = await createCustomer(data);
    return res.status(201).json(customer);
  } catch (error) {
    return res.status(400).json({
      error: "Failed to create customer",
      details: error instanceof Error ? error.message : error,
    });
  }
}

export async function getAll(req: Request, res: Response) {
  try {
    const customers = await getAllCustomers();
    return res.json(customers);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to fetch customers", details: error });
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const customer = await getCustomerById(id);

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    return res.json(customer);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error retrieving customer", details: error });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const data = req.body;
    const updated = await updateCustomer(id, data);
    return res.json(updated);
  } catch (error) {
    return res
      .status(400)
      .json({ error: "Failed to update customer", details: error });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await deleteCustomer(id);
    return res.json(deleted);
  } catch (error) {
    return res
      .status(400)
      .json({ error: "Failed to delete customer", details: error });
  }
}
