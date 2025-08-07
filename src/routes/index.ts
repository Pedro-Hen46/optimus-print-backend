import { Router } from "express";
import { healthCheck } from "../controllers/health/health.controller";

const router = Router();

router.get("/", healthCheck);

export { router };
