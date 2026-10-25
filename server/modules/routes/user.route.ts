import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { check } from "express-validator";
import { userRepo } from "../../database/database";
import { Request, Response } from "express";

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
          throw new Error("Такая почта уже используется!");
        }

        return true;
      }),
    ],
    async (req: Request, res: Response) => {
      const result = await userController.createUser(req);

      if (!result.status) {
        return res.status(404).json({
          message: result.message,
          validation: result.validationsErrors
            ? result.validationsErrors
            : false,
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
      check("whatPatch")
    ],
    async (req: Request, res: Response) => {
      const result = await userController.patchUser(req);

      if (!result.status) {
        return res.status(404).json({
          message: result.message,
          validation: result.validationsErrors
            ? result.validationsErrors
            : false,
        });
      }

      res.json({
        message: result.message,
      });
    },
  );
