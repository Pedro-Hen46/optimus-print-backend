import { Router } from "express";
import {
  login,
  register,
  requestPasswordReset,
  resetPassword,
} from "../controllers/auth/auth.controller";
import {
  ensureAuthenticated,
  ensureRole,
} from "../middlewares/auth.middleware";

const router = Router();

//Logar na plataforma
router.post("/login", login);

//Recuperar senha
router.post("/recovery", requestPasswordReset);
//Enviar nova senha depois de recuperar um token
router.post("/recovery/new-password", resetPassword);

//Registrar
router.post(
  "/register",
  ensureAuthenticated,
  ensureRole("ADMINISTRADOR"),
  register
);

export default router;
