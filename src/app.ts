import express from "express";
import dotenv from "dotenv";

// Rotas do sistema
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import customerRoutes from "./routes/customer.routes";
import contactRoutes from "./routes/contact.routes";
import addressRoutes from "./routes/address.routes";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/customer", customerRoutes);
app.use("/contact", contactRoutes);
app.use("/address", addressRoutes);

export { app };
