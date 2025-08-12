import { Router } from "express";
import {
  create,
  getAll,
  getById,
  getBySerial,
  update,
  remove,
} from "../controllers/stock-printer/stock-printer.controller";

const router = Router();

router.post("/", create);
router.get("/", getAll);
router.get("/:id", getById);
router.get("/serial/:serialNumber", getBySerial);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;
