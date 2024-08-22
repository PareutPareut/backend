import { Request, Response, Router } from "express";
import { validate } from "../middleware/validate.js";
import { param, body } from "express-validator";
import { UserDto } from "../interfaces/user.dto.js";
import { ensureError } from "../error/ensureError.js";
import { SignUpService } from "../services/signup.js";

export const signUpRouter = Router();

signUpRouter.post(
  "/:eventId",
  validate([
    param("eventId").notEmpty().withMessage("eventId 제공해야 합니다."),
    body("userName").notEmpty().withMessage("userName을 제공해야 합니다."),
    body("password").notEmpty().withMessage("password를 제공해야 합니다."),
  ]),
  async (req: Request, res: Response) => {
    try {
      const userDto: UserDto = {
        eventId: Number(req.params.eventId.split(":")[1]),
        userName: req.body.userName,
        password: req.body.password,
      };
      const result = await SignUpService.signup(userDto);

      if (result.result === true) {
        // 세션에 사용자 정보 저장
        req.session.user = {
          id: result.sessionData?.id,
          userName: result.sessionData?.userName,
        };
        // 성공 응답 반환
        return res.status(200).send({
          result: result.result,
          message: result.message,
          // isNewUser : result.isNewUser
        });
      }
      return res.status(500).send({
        result: result.result,
        message: result.message,
        // isNewUser : result.isNewUser
      });
    } catch (err) {
      const error = ensureError(err);
      console.log(error.message);
      return res.status(500).send({ result: false, message: error.message });
    }
  }
);
