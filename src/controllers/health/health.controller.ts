import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";


export async function healthCheck(req: Request, res: Response) {
  const userCount = await prisma.user.count();
  return res.json({ status: "ok", users: userCount });
}