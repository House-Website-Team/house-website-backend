import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

import { userRepo } from "../../database/database";
import { Users } from "../../database/entitites/user.entity";

const generateAccessToken = (name: string) => {
  const payload = {
    name,
  };

  return jwt.sign(payload, String(process.env.SECRET_TOKEN), {
    expiresIn: "6h",
  });
};

export class UserController {
  getUserParam = async (req: Request, res: Response) => {
    try {
      const userInfo = await userRepo.findBy({ id: Number(req.params.id) });

      if (userInfo.length == 0) {
        return res
          .status(404)
          .json({ responce: "Такой пользователь не найден!" });
      }

      res.json(userInfo);
    } catch (e) {
      console.error(
        "Произошла ошибка при получении конкретного пользователя",
        e,
      );
    }
  };

  getUserQuery = async (req: Request, res: Response) => {
    try {
      const userInfo = await userRepo.findBy({ id: Number(req.query.id) });

      if (userInfo.length == 0) {
        return res
          .status(404)
          .json({ responce: "Такой пользователь не найден!" });
      }

      res.json(userInfo);
    } catch (e) {
      console.error(
        "Произошла ошибка при получении конкретного пользователя",
        e,
      );
    }
  };

  getUsers = async (req: Request, res: Response) => {
    try {
      res.json({
        response: await userRepo.find(),
      });
    } catch (e) {
      console.error("Произошла ошибка при получении всех пользователей", e);
    }
  };

  createUser = async (req: Request, res: Response) => {
    try {
      const validationsErrors = validationResult(req);
      const { name, password, email } = req.body;
      const hashPassword = await bcrypt.hash(
        password,
        Number(process.env.PASSWORD_SALT),
      );
      const user = new Users();
      const token = generateAccessToken(name);

      if (!validationsErrors.isEmpty()) {
        return res.status(404).json({
          responce: "Произошла ошибка при проверке валидации!",
          validationsErrors,
        });
      }

      user.name = name;
      user.password = String(hashPassword);
      user.email = email;

      await userRepo.save(user);

      res.json({
        responce: "Пользователь успешно добавлен!",
        token: token,
      });
    } catch (e) {
      console.error("Произошла ошибка создания пользователя!", e);
    }
  };

  deleteUserParams = async (req: Request, res: Response) => {
    try {
      const userId = Number(req.params.id);
      const userInfo = await userRepo.findBy({ id: userId });

      if (userInfo.length == 0) {
        return res
          .status(404)
          .json({ responce: "Такой пользователь не найден!" });
      }

      await userRepo.delete({ id: userId });

      res.json({ response: "Пользователь успешно удален!" });
    } catch (e) {
      console.error("Произошла ошибка при удалении пользователя!", e);
    }
  };

  deleteUserQuery = async (req: Request, res: Response) => {
    try {
      const userId = Number(req.query.id);
      const userInfo = await userRepo.findBy({ id: userId });

      if (userInfo.length == 0) {
        return res
          .status(404)
          .json({ responce: "Такой пользователь не найден!" });
      }

      await userRepo.delete({ id: userId });

      res.json({ response: "Пользователь успешно удален!" });
    } catch (e) {
      console.error("Произошла ошибка при удалении пользователя!", e);
    }
  };

  patchUser = async (req: Request, res: Response) => {
    try {
      const validationsErrors = validationResult(req);
      const { userId, whatPatch, value } = req.body;
      const userInfo = await userRepo.findBy({ id: userId });
      const hashPassword: string = await bcrypt.hash(
        value,
        Number(process.env.PASSWORD_SALT),
      );

      if (!validationsErrors.isEmpty()) {
        return res.status(404).json({
          responce: "Произошла ошибка при проверке валидации!",
          validationsErrors,
        });
      }

      if (userInfo.length == 0) {
        return res
          .status(404)
          .json({ responce: "Такой пользователь не найден!" });
      }

      await userRepo.update(
        { id: userId },
        { [whatPatch]: whatPatch == "password" ? hashPassword : value },
      );

      res.json({
        responce: `Поле ${whatPatch} в id ${userId} успешно измененно!`,
      });
    } catch (e) {
      console.error(
        "Произошла ошибка при изменении параметра пользователя!",
        e,
      );
    }
  };
}
