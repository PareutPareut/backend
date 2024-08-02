import { Request, Response, Router } from "express";
import { validate } from "../middleware/validate.js";
import { param, body } from "express-validator";
import { EventDto, EventTimeDto, EventIdDto } from "../interfaces/event.dto.js";
import { ensureError } from "../error/ensureError.js";
import { EventService } from "../services/event.js";
export const eventRouter = Router();

// 이벤트 생성
eventRouter.post(
  "/",
  validate([
    body("eventName").notEmpty().withMessage("eventName을 제공해야 합니다."),
    body("dataList").notEmpty().isArray().withMessage("dataList 제공해야 합니다."),
  ]),
  async (req: Request, res: Response) => {
    try {
      const eventDto: EventDto = {
        eventName: req.body.eventName,
        dataList: req.body.dataList,
      };
      const result = await EventService.newEvent(eventDto);

      return result.result
        ? res.status(200).json({
            message: result.message,
            eventId: result.eventId,
            eventName: result.eventName,
          })
        : res.status(500).json({
            message: result.message,
          });
    } catch (err) {
      const error = ensureError(err);
      console.log(error.message);
      return res.status(500).send({ result: false, message: error.message });
    }
  }
);

// 로그인 된 사용자의 가능한 시간 저장
eventRouter.post(
  "/:eventId",
  validate([
    param("eventId").notEmpty().withMessage("eventId를 제공해야 합니다."),
    body("timeList").notEmpty().isArray().withMessage("timeList를 제공해야 합니다."),
    body("loginName").notEmpty().withMessage("loginName를 제공해야 합니다.(로그인이 필요합니다)"),
  ]),
  async (req: Request, res: Response) => {
    try {
      const eventTimeDto: EventTimeDto = {
        user: req.body.loginName, // 세션에서 현재 로그인된 사용자 정보 가져오기
        eventId: req.params.eventId.split(":")[1],
        timeList: req.body.timeList, // ['date, 'time']
      };

      const result = await EventService.addEventTime(eventTimeDto);

      return result.result
        ? res.status(200).json({
            message: result.message,
          })
        : res.status(500).json({
            message: result.message,
          });
    } catch (err) {
      const error = ensureError(err);
      console.log(error.message);
      return res.status(500).send({ result: false, message: error.message });
    }
  }
);

// 전체 저장된 시간 정보 조회
eventRouter.get("/:eventId", async (req: Request, res: Response) => {
  try {
    const eventIdDto: EventIdDto = {
      eventId: req.params.eventId.split(":")[1],
    };
    const result = await EventService.getEvent(eventIdDto);

    return result.result
      ? res.status(200).json({
          loginName: req.session.user?.userName,
          dateList: result.dateList,
          userList: result?.userList,
          message: "이벤트의 저장된 시간 정보 조회 성공",
        })
      : res.status(500).json({
          message: result.message,
        });
  } catch (err) {
    const error = ensureError(err);
    console.log(error.message);
    return res.status(500).send({ result: false, message: error.message });
  }
});
