// -- Imports
import express from "express";
import "dotenv/config";
import { database } from "./server/database/database";

// -- Imports Routes
import { userRouter } from "./server/modules/routes/user.route";
import { authRouter } from "./server/modules/routes/auth.route";

const app = express();
const port = process.env.PORT || 5000;

// -- Database init
try {
  database.initialize();
  console.log("База данных успешно инициализирована!");
} catch {
  console.error("База данных не инициализирована!");
}

// -- Use
app.use(express.json());
app.use(userRouter);
app.use(authRouter);

app.listen(port);
