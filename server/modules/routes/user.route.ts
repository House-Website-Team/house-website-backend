import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { check } from "express-validator";
import { userRepo } from "../../database/database";
import { Request, Response } from "express";
import { validationResult } from "express-validator";

const router = Router();
const userController = new UserController();

export const userRouter = router
  .get("/user/:id", async (req: Request, res: Response) => {
    const result = await userController.getUserParam(Number(req.params.id));

    if (!result.status) {
      return res.json({
        message: result.message,
      });
    }

    return res.json({
      user: {
        name: result.user?.name,
        email: result.user?.email,
      },
    });
  })

  .get("/user", async (req: Request, res: Response) => {
    const result = await userController.getUserParam(Number(req.query.id));

    if (!result.status) {
      return res.json({
        message: result.message,
      });
    }

    return res.json({
      user: {
        name: result.user?.name,
        email: result.user?.email,
      },
    });
  })

  .get("/users", async (req: Request, res: Response) => {
    const result = await userController.getUsers();

    if (!result.status) {
      return res.status(404).json({
        message: result.message,
      });
    }

    res.json({
      users: result.users,
    });
  })

  .post(
    "/user",
    [
      check("name", "Имя пользователя не может быть пустым!").notEmpty(),
      check("password", "Пароль не может быть пустым!").notEmpty(),
      check("password", "Пароль не может быть короче 4 символов!").isLength({
        min: 4,
      }),
      check("email", "Почта не может быть пуста!").notEmpty(),
      check("email", "Такая почта уже используется!").custom(async (email) => {
        if (await userRepo.existsBy({ email: email })) {
          throw new Error("EmailNotExists");
        }

        return true;
      }),
    ],
    async (req: Request, res: Response) => {
      const { name, password, email } = req.body;
      const validationsErrors = await validationResult(req);

      if (!validationsErrors.isEmpty()) {
        return res.status(404).json({
          message: "Произошла ошибка при проверке валидации!",
          validation: validationsErrors ? validationsErrors : false,
        });
      }

      const result = await userController.createUser(name, password, email);

      if (!result.status) {
        return res.status(404).json({
          message: result.message,
          validation: validationsErrors ? validationsErrors : false,
        });
      }

      res.json({
        message: result.message,
      });
    },
  )

  .delete("/user/:id", async (req: Request, res: Response) => {
    const result = await userController.deleteUserParams(Number(req.params.id));

    if (!result.status) {
      return res.status(404).json({
        message: result.message,
      });
    }

    return res.json({
      message: result.message,
    });
  })

  .delete("/user", async (req: Request, res: Response) => {
    const result = await userController.deleteUserQuery(Number(req.query.id));

    if (!result.status) {
      return res.status(404).json({
        message: result.message,
      });
    }

    return res.json({
      message: result.message,
    });
  })

  .patch(
    "/user",
    [
      check("userId", "Айди не может быть пустым!").notEmpty(),
      check(
        "whatPatch",
        "Поле с тем, что изменить не может быть пустым!",
      ).notEmpty(),
      check(
        "value",
        "Поле с значением изменения не может быть пустым!",
      ).notEmpty(),
    ],
    async (req: Request, res: Response) => {
      const { userId, whatPatch, value } = req.body;
      const validationsErrors = validationResult(req);

      if (!validationsErrors.isEmpty()) {
        return res.status(400).json({
          status: false,
          message: "Произошла ошибка при проверке валидации!",
          validationsErrors,
        });
      }

      const result = await userController.patchUser(userId, whatPatch, value);

      if (!result.status) {
        return res.status(404).json({
          message: result.message,
          validation: validationsErrors
            ? validationsErrors
            : false,
        });
      }

      console.log(validationsErrors);

      res.json({
        message: result.message,
      });
    },
  );
