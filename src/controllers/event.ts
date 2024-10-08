import { Request, Response, Router } from "express";
import { validate } from "../middleware/validate";
import { param, body } from "express-validator";
import { EventDto, EventTimeDto, EventIdDto } from "../interfaces/event.dto";
import { ensureError } from "../error/ensureError";
import { EventService } from "../services/event";
import { ApiResponse } from "../interfaces/apiResponse";
import { EventListsResponse, NewEventResponse } from "../interfaces/eventResponse";
import { isNewEventResponse } from "../typeGaurd/isNewEventResponse";
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
      const result: ApiResponse | NewEventResponse = await EventService.newEvent(eventDto);

      return isNewEventResponse(result)
        ? res.status(200).json(result)
        : res.status(500).json(result);
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
      if (!req.session.user?.userName) {
        return res.status(500).send({ result: false, message: "세션의 사용자 정보 확인 불가능" });
      }
      const eventTimeDto: EventTimeDto = {
        loginName: req.session.user?.userName, // 세션에서 현재 로그인된 사용자 정보 가져오기
        eventId: req.params.eventId.split(":")[1],
        timeList: req.body.timeList,
      };

      const result: ApiResponse = await EventService.addUserEventTime(eventTimeDto);

      return result.result ? res.status(200).send(result) : res.status(500).send(result);
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
    const result: ApiResponse | EventListsResponse = await EventService.getEvent(eventIdDto);

    return isNewEventResponse(result) ? res.status(200).json(result) : res.status(500).json(result);
  } catch (err) {
    const error = ensureError(err);
    console.log(error.message);
    return res.status(500).send({ result: false, message: error.message });
  }
});
