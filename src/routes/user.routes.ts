import { Router } from "express";
import {
  ensureAuthenticated,
  ensureRole,
} from "../middlewares/auth.middleware";
import { deleteUser, getUsers } from "../controllers/user/user.controller";

const router = Router();

router.delete(
  "/:id",
  ensureAuthenticated,
  ensureRole("ADMINISTRADOR"),
  deleteUser
);

router.get("/", ensureAuthenticated, ensureRole("ADMINISTRADOR"), getUsers);

export default router;
