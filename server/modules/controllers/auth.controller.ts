import { Request, Response } from "express";
import { UserController } from "./user.controller";

const user = new UserController();

export class AuthController {
  reg = (req: Request, res: Response) => {
    user.createUser(req, res);
  };
}
