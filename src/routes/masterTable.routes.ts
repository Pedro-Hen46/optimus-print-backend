import { Router } from "express";
import {
  create,
  getAll,
  getById,
  update,
  remove,
  getByType,
} from "../controllers/masterTable/masterTable.controller";

const router = Router();

router.post("/", create);
router.get("/", getAll);
router.get("/:id", getById);
router.put("/:id", update);
router.delete("/:id", remove);
router.get("/type/:type", getByType);

export default router;
