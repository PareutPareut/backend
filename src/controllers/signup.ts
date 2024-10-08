import { Request, Response, Router } from "express";
import { validate } from "../middleware/validate";
import { param, body } from "express-validator";
import { UserDto } from "../interfaces/user.dto";
import { ensureError } from "../error/ensureError";
import { SignUpService } from "../services/signup";
import { isSignUpResponse } from "../typeGaurd/isSignupResponse";

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

      if (isSignUpResponse(result) && result.sessionData !== null) {
        // 세션에 사용자 정보 저장
        req.session.user = result.sessionData;

        return res.status(200).send({
          result: result.result,
          message: result.message,
          // isNewUser : result.isNewUser
        });
      }
      return res.status(500).send(result);
    } catch (err) {
      const error = ensureError(err);
      console.log(error.message);
      return res.status(500).send({ result: false, message: error.message });
    }
  }
);
