import { Request, Response } from "express";

import bcrypt from "bcryptjs";
import { generateToken } from "../../utils/jwt";
import {
  loginSchema,
  registerSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
} from "../../schemas/auth.schema";
import {
  createUserByAdmin,
  findUserByEmail,
} from "../../repositories/user.repository";

import crypto from "crypto";
import { addMinutes } from "date-fns";
import axios from "axios";
import {
  createPasswordResetToken,
  findValidPasswordResetToken,
  invalidateResetToken,
  updateUserPassword,
} from "../../repositories/passwordReset.repository";

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

// Processo de recuperação de senha
export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    // 1. Validar email
    const parsed = requestPasswordResetSchema.parse(req.body);
    const { email } = parsed;

    // 2. Verificar se usuário existe (sem revelar informação)
    const user = await findUserByEmail(email);
    if (!user) {
      // Mesmo retorno para email existente ou não (segurança)
      return res.status(200).json({
        message:
          "Se este email estiver cadastrado, você receberá um link de recuperação",
      });
    }

    // 3. Gerar token único
    const resetToken = crypto.randomBytes(32).toString("hex");

    // 4. Criar registro no banco (expira em 10 minutos)
    await createPasswordResetToken({
      userId: user.id,
      token: resetToken,
    });

    // 5. Preparar mensagem WhatsApp
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&userId=${user.id}`;

    const message =
      `Olá ${user.name}, você solicitou a recuperação de senha do sistema.\n\n` +
      `Por favor, clique no link abaixo para redefinir sua senha:\n${resetLink}\n\n` +
      `⚠️ Atenção: Este link expirará em em breve, *seja rápido*!`;

    // 6. Enviar para o webhook do n8n (WhatsApp)
    await axios.post(
      // process.env.N8N_WEBHOOK_URL ||
      //   "https://n8n.novaservices.com.br/webhook/fusion",
      "https://n8n.novaservices.com.br/webhook-test/fusion",

      {
        data: {
          number: user.telefone.replace(/\D/g, ""), // Remove não-dígitos
          message: message,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    return res.status(200).json({
      message: "Mensagem com link de recuperação enviada para seu WhatsApp",
    });
  } catch (error) {
    console.error("Password reset request error:", error);
    return res
      .status(500)
      .json({
        error:
          "Erro ao processar solicitação, possivel problema com o sistema de automação",
      });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    // 1. Validar dados de entrada
    const parsed = resetPasswordSchema.parse(req.body);
    const { token, userId, newPassword } = parsed;

    // 2. Verificar token válido
    const resetRecord = await findValidPasswordResetToken(userId, token);
    if (!resetRecord) {
      return res.status(400).json({
        error: "Link inválido ou expirado. Solicite um novo link.",
      });
    }

    // 3. Atualizar senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updateUserPassword(userId, hashedPassword);

    // 4. Invalidar token
    await invalidateResetToken(token);

    return res.status(200).json({
      message: "Senha redefinida com sucesso",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    return res.status(500).json({
      error: "Erro ao redefinir senha",
    });
  }
};
