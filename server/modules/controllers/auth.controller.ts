import { Request, Response } from "express";
import { UserController } from "./user.controller";
import jwt from "jsonwebtoken";

const user = new UserController();

const generateAccessToken = (name: string) => {
  const payload = {
    name,
  };

  return jwt.sign(payload, String(process.env.SECRET_TOKEN), {
    expiresIn: "6h",
  });
};

export class AuthController {
  reg = (req: Request, res: Response) => {
    const token = generateAccessToken(req.body.name);

    user.createUser(req, res);
  };
}
