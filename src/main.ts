import "dotenv/config";
import express from "express";
import session from "express-session";
import morgan from "morgan";
import cors from "cors";
import { sequelizeLoader } from "./loaders/sequelize.js";

import { signUpRouter } from "./controllers/signup.js";
import { eventRouter } from "./controllers/event.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 세션 미들웨어 설정
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(cors());

app.use("/login", signUpRouter);
app.use("/event", eventRouter);

app.use(morgan("dev"));

await sequelizeLoader();

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ message: "서버 오류" });
});

app.listen(process.env.SECRET_PORT, () => {
  console.log("서버 실행 완료");
});
