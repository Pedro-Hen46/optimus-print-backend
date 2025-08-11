import { Request, Response } from "express";

import bcrypt from "bcryptjs";

import {
  deleteUserById,
  getAllUsers,
  getUserById,
} from "../../repositories/user.repository";

import { updateUserSchema } from "../../schemas/user.schema";

export async function updateUser(req: Request, res: Response) {
  try {
    // 1. Validação dos dados de entrada
    const parsed = updateUserSchema.parse(req.body);
    const userId = req.params.id; // ID do usuário a ser atualizado
    const currentUser = req.user; // Usuário logado (do middleware ensureAuthenticated)

    // 2. Verifica se o usuário existe
    const userExists = await getUserById(userId);
    if (!userExists) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // 3. Permissões:
    // - Admin pode editar qualquer usuário
    // - Usuário comum só pode editar a si mesmo
    const isAdmin = currentUser.role === "admin";
    const isSelfUpdate = currentUser.id === userId;

    if (!isAdmin && !isSelfUpdate) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    // 4. Bloqueia usuário comum de alterar 'role'
    if (parsed.role && !isAdmin) {
      return res
        .status(403)
        .json({ error: "Apenas administradores podem alterar roles" });
    }

    // 5. Atualiza a senha (se fornecida)
    let updateData = { ...parsed };
    if (parsed.password) {
      updateData.password = await bcrypt.hash(parsed.password, 10);
    }

    // 6. Executa a atualização no banco de dados
    const updatedUser = await updateUserById(userId, updateData);

    // 7. Retorna resposta (sem a senha)
    const { password: _, ...userWithoutPassword } = updatedUser;
    return res.status(200).json(userWithoutPassword);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors });
    }
    return res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const userId = req.params.id;
    const currentUser = req.user;

    // 1. Verifica se o usuário existe
    const userExists = await getUserById(userId);

    if (!userExists) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // 2. Permissões:
    // - Admin pode deletar qualquer usuário
    // - Usuário comum NÃO pode se autodeletar
    const isAdmin = currentUser.role === "ADMINISTRADOR";
    const isSelfDelete = currentUser.id === userId;

    if (!isAdmin) {
      return res
        .status(403)
        .json({ error: "Apenas administradores podem deletar usuários" });
    }

    // 3. Executa a exclusão no banco de dados
    await deleteUserById(userId);

    // 4. Resposta de sucesso
    return res.status(200).json({ message: "Usuário deletado com sucesso" });
  } catch (err) {
    return res.status(500).json({ error: "Erro ao deletar usuário" });
  }
}

export async function getUsers(req: Request, res: Response) {
  try {
    const users = await getAllUsers();

    if (users) {
      return res.status(200).json(users);
    }
  } catch (err) {
    return res.status(500).json({ error: "Erro ao buscar usuários" });
  }
}
