import express from "express";
import dotenv from "dotenv";

// Rotas do sistema
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/user", userRoutes);

export { app };
