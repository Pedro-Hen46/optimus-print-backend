import { Router } from "express";

import multer from "multer";

import {
  create,
  getAll,
  getById,
  update,
  remove,
  getByType,
} from "../controllers/masterTable/masterTable.controller";

// Configuração do Multer para lidar com uploads de arquivos
const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

router.post("/", upload.single("file"), create);
router.get("/", getAll);
router.get("/:id", getById);
router.put("/:id", update);
router.delete("/:id", remove);
router.get("/type/:type", getByType);

export default router;
