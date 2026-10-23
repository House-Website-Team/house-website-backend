import { Router } from "express";
import { check } from "express-validator";
import { AuthController } from "../controllers/auth.controller";

const router = Router();
const authController = new AuthController();

export const authRouter = router.post("/reg", authController.reg);
