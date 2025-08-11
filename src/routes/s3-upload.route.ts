import { Router } from "express";
import multer from "multer";
import {
  getSignedUrl,
  uploadMultiple,
  uploadSingle,
} from "../controllers/upload/s3-upload.controller";

// Configuração do Multer para lidar com uploads de arquivos
const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

// Rota para upload de uma única imagem
router.post("/single", upload.single("file"), uploadSingle);

// Rota para upload de múltiplas imagens
router.post("/multiple", upload.array("files", 10), uploadMultiple); // Limite de 10 arquivos

// Rota para obter URL pré-assinada
router.get("/signed-url/:fileId", getSignedUrl);

export default router;
