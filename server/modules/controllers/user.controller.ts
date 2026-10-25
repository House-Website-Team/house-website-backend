import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";

import { userRepo } from "../../database/database";
import { Users } from "../../database/entitites/user.entity";

export class UserController {
  getUserParam = async (userId: number) => {
    try {
      const users = await userRepo.findBy({ id: userId });

      if (users.length == 0) {
        return {
          status: false,
          message: "Такой пользователь не найден!",
        };
      }

      const userInfo = users[0];

      return {
        status: true,
        user: userInfo,
      };
    } catch (e) {
      console.error(
        "Произошла ошибка при получении конкретного пользователя",
        e,
      );

      return {
        status: false,
        message: "Произошла ошибка при получении конкретного пользователя",
      };
    }
  };

  getUserQuery = async (userId: number) => {
    try {
      const users = await userRepo.findBy({ id: userId });

      if (users.length == 0) {
        return {
          status: false,
          message: "Такой пользователь не найден!",
        };
      }

      const userInfo = users[0];

      return {
        status: true,
        user: userInfo,
      };
    } catch (e) {
      console.error(
        "Произошла ошибка при получении конкретного пользователя",
        e,
      );

      return {
        status: false,
        message: "Произошла ошибка при получении конкретного пользователя",
      };
    }
  };

  getUsers = async () => {
    try {
      const usersInfo = await userRepo.find({
        select: { name: true, email: true },
      });

      if (usersInfo.length == 0) {
        return {
          status: false,
          message: "Пользователей в базе данных не найдено!",
        };
      }

      return {
        status: true,
        users: usersInfo,
      };
    } catch (e) {
      console.error("Произошла ошибка при получении всех пользователей", e);

      return {
        status: false,
        message: "Произошла ошибка при получении всех пользователей",
      };
    }
  };

  createUser = async (req: Request) => {
    try {
      const validationsErrors = validationResult(req);
      const { name, password, email } = req.body;
      const hashPassword = await bcrypt.hash(
        password,
        Number(process.env.PASSWORD_SALT),
      );
      const user = new Users();

      if (!validationsErrors.isEmpty()) {
        return {
          status: false,
          message: "Произошла ошибка при проверке валидации!",
          validationsErrors,
        };
      }

      user.name = name;
      user.password = String(hashPassword);
      user.email = email;

      await userRepo.save(user);

      return {
        status: true,
        message: "Пользователь успешно добавлен!",
      };
    } catch (e) {
      console.error("Произошла ошибка создания пользователя!", e);

      return {
        status: false,
        message: "Произошла ошибка при получении всех пользователей",
      };
    }
  };

  deleteUserParams = async (userId: number) => {
    try {
      const userInfo = await userRepo.findBy({ id: userId });

      if (userInfo.length == 0) {
        return {
          status: false,
          message: "Такой пользователь не найден!",
        };
      }

      await userRepo.delete({ id: userId });

      return {
        status: true,
        message: "Пользователь успешно удален!",
      };
    } catch (e) {
      console.error("Произошла ошибка при удалении пользователя!", e);

      return {
        status: false,
        message: "Произошла ошибка при удалении пользователя!",
      };
    }
  };

  deleteUserQuery = async (userId: number) => {
    try {
      const userInfo = await userRepo.findBy({ id: userId });

      if (userInfo.length == 0) {
        return {
          status: false,
          message: "Такой пользователь не найден!",
        };
      }

      await userRepo.delete({ id: userId });

      return {
        status: true,
        message: "Пользователь успешно удален!",
      };
    } catch (e) {
      console.error("Произошла ошибка при удалении пользователя!", e);

      return {
        status: false,
        message: "Произошла ошибка при удалении пользователя!",
      };
    }
  };

  patchUser = async (req: Request) => {
    try {
      const validationsErrors = validationResult(req);
      const { userId, whatPatch, value } = req.body;
      const userInfo = await userRepo.findBy({ id: userId });
      const hashPassword: string = await bcrypt.hash(
        value,
        Number(process.env.PASSWORD_SALT),
      );

      if (!validationsErrors.isEmpty()) {
        return {
          status: false,
          message: "Произошла ошибка при проверке валидации!",
          validationsErrors,
        };
      }

      if (userInfo.length == 0) {
        return {
          status: false,
          message: "Такой пользователь не найден!",
        };
      }

      await userRepo.update(
        { id: userId },
        { [whatPatch]: whatPatch == "password" ? hashPassword : value },
      );

      return {
        status: true,
        message: `Поле ${whatPatch} в id ${userId} успешно измененно!`,
      };
    } catch (e) {
      console.error(
        "Произошла ошибка при изменении параметра пользователя!",
        e,
      );

      return {
        status: false,
        message: "Произошла ошибка при изменении параметра пользователя!",
      };
    }
  };
}
