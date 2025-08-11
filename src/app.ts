import express from "express";
import dotenv from "dotenv";

// Rotas do sistema
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import customerRoutes from "./routes/customer.routes";
import contactRoutes from "./routes/contact.routes";
import addressRoutes from "./routes/address.routes";
import masterTableRoutes from "./routes/masterTable.routes";
import uploadRoutes from "./routes/s3-upload.route";
import { ensureAuthenticated } from "./middlewares/auth.middleware";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);

// Aplica o middleware para todas as rotas abaixo
app.use(ensureAuthenticated);

app.use("/user", userRoutes);
app.use("/customer", customerRoutes);
app.use("/contact", contactRoutes);
app.use("/address", addressRoutes);
app.use("/master-table", masterTableRoutes);
app.use("/upload", uploadRoutes);

export { app };
