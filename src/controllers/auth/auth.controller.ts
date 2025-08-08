import { Request, Response } from "express";

import bcrypt from "bcryptjs";
import { generateToken } from "../../utils/jwt";
import { loginSchema, registerSchema } from "../../schemas/auth.schema";
import {
  createUserByAdmin,
  findUserByEmail,
} from "../../repositories/user.repository";

export const login = async (req: Request, res: Response) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ error: result.error.issues });
  }

  const { email, password } = result.data;

  console.log(await bcrypt.hash(password, 10));
  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = generateToken({ sub: user.id, role: user.role });

  return res.json({ token });
};

export async function register(req: Request, res: Response) {
  try {
    const parsed = registerSchema.parse(req.body);

    const hashedPassword = await bcrypt.hash(parsed.password, 10);

    const user = await createUserByAdmin({
      email: parsed.email,
      name: parsed.name,
      password: hashedPassword,
      role: parsed.role,
    });

    return res
      .status(201)
      .json({ message: "Usuário criado com sucesso", user });
  } catch (err: any) {
    return res.status(400).json({ error: err?.message || "Erro ao registrar" });
  }
}
