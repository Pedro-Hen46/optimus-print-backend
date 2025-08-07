import express from "express";
import dotenv from "dotenv";
import { router } from "./routes";

// Rotas do sistema
import authRoutes from './routes/auth.routes';

dotenv.config();

const app = express();

app.use(express.json());
app.use(router);

app.use('/auth', authRoutes); 



export { app };

