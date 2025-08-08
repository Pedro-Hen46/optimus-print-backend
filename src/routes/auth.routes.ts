import { Router } from "express";
import {
  login,
  register,
  requestPasswordReset,
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

//Registrar
router.post(
  "/register",
  ensureAuthenticated,
  ensureRole("ADMINISTRADOR"),
  register
);

export default router;
