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
  reg = (name: string, password: string, email: string) => {
    try {
      const token = generateAccessToken(name);

      user.createUser(name, password, email);

      return {
        token: token,
      };
    } catch (e) {
      console.error("Произошла ошибка при регистрации пользователя!", e);

      return {
        status: false,
        message: "Произошла ошибка при регистрации пользователя!",
      };
    }
  };

  /* login = async (name: string, password: string) => {
    try {

    } catch (e) {
      console.error("Произошла ошибка при авторизации пользователя!", e);

      return {
        status: false,
        message: "Произошла ошибка при авторизации пользователя!",
      };
    }
  }; */
}
