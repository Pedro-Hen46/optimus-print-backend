import { Router } from "express";

import {
  create,
  getAll,
  getById,
  update,
  remove,
} from "../controllers/addresses/addresses.controller";

import {
  ensureAuthenticated,
  ensureRole,
} from "../middlewares/auth.middleware";

const router = Router();

router.post(
  "/",
  ensureAuthenticated,
  ensureRole("ADMINISTRADOR", "FINANCEIRO", "ATENDIMENTO"),
  create
);

router.get("/", getAll);

router.get("/:id", getById);

router.put(
  "/:id",
  ensureAuthenticated,
  ensureRole("ADMINISTRADOR", "FINANCEIRO", "ATENDIMENTO"),
  update
);

router.delete(
  "/:id",
  ensureAuthenticated,
  ensureRole("ADMINISTRADOR", "FINANCEIRO"),
  remove
);

export default router;
