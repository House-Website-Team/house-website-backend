import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { Request, Response } from "express";

const router = Router();
const authController = new AuthController();

export const authRouter = router.post("/reg", (req: Request, res: Response) => {
  const result = authController.reg(req, res);

  res.json(result);
});
