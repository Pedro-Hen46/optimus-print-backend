import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Carrega variáveis de ambiente
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15m";

if (!JWT_SECRET) {
  throw new Error("❌ JWT_SECRET não definido");
}

export const generateToken = (
  payload: object,
  expiresIn: string = JWT_EXPIRES_IN
) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn,
    algorithm: "HS256",
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET, {
    algorithms: ["HS256"],
  });
};
