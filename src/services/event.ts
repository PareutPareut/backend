import { EventDto, EventTimeDto, EventIdDto } from "../interfaces/event.dto";
import { ensureError } from "../error/ensureError";
import { db } from "../models/index";
import { UserTime, SortedUserTime, GetEventResponse } from "../interfaces/eventService.dto";
import { UserTimes } from "../models/userTimes";

export class EventService {
  static async newEvent(eventDto: EventDto) {
    try {
      const createdEvent = await db.event.create({ eventName: eventDto.eventName });

      if (!createdEvent || !(createdEvent instanceof db.event)) {
        return {
          result: false,
          message: "이벤트 생성 실패",
        };
      }

      const datesList = eventDto.dataList;

      const createdEventDates = await Promise.all(
        datesList.map(async date => {
          return await db.eventDate.create({
            eventId: createdEvent.eventId as number,
            date: date,
          });
        })
      );

      if (createdEventDates.length > 0 && createdEventDates[0] instanceof db.eventDate) {
        return {
          result: true,
          message: "이벤트 및 이벤트 날짜 생성 성공.",
          eventId: createdEvent.eventId,
          eventName: eventDto.eventName,
        };
      } else {
        return {
          result: false,
          message: "이벤트 날짜 생성 오류",
        };
      }
    } catch (err) {
      const error = ensureError(err);
      console.log(error.message);
      return { result: false, message: error.message };
    }
  }

  static async addUserEventTime(eventTimeDto: EventTimeDto) {
    try {
      const existingUser = await db.user.findOne({
        where: { userName: eventTimeDto.loginName },
      });

      if (existingUser) {
        // 특정 이벤트에 대한 사용자의 기존 시간 정보 일괄 삭제
        await db.userTime.destroy({
          where: { eventId: Number(eventTimeDto.eventId), userName: eventTimeDto.loginName },
        });
      }

      // 삽입할 새로운 시간 정보 배열 생성
      const timeEntriesToInsert = [];

      for (const timeEntry of eventTimeDto.timeList) {
        for (const time of timeEntry.time) {
          timeEntriesToInsert.push({
            eventId: Number(eventTimeDto.eventId),
            userName: eventTimeDto.loginName,
            date: timeEntry.date,
            time: time,
          });
        }
      }

      const results = await db.userTime.bulkCreate(timeEntriesToInsert);

      if (!results.length) {
        return {
          result: false,
          message: "시간 정보 업데이트 및 추가 에러",
        };
      }

      return {
        result: true,
        message: "시간 정보 업데이트 및 추가 성공",
      };
    } catch (err) {
      const error = ensureError(err);
      console.log(error.message);
      return { result: false, message: error.message };
    }
  }

  static async getEvent(eventIdDto: EventIdDto): Promise<GetEventResponse> {
    try {
      const userTimes = await db.userTime.findAll({
        where: { eventId: eventIdDto.eventId },
        order: [
          ["userName", "ASC"],
          ["date", "ASC"],
          ["time", "ASC"],
        ],
      });

      if (!userTimes || userTimes.length === 0 || !(userTimes[0].dataValues instanceof UserTimes)) {
        return {
          result: false,
          message: "이벤트의 저장된 시간 정보가 존재하지 않음",
        };
      }

      const convertedUserTimes: UserTime[] = userTimes.map(userTime => ({
        ...userTime,
        time: Number(userTime.time),
        date: new Date(userTime.date),
      }));

      // 사용자 이름별로 시간을 정렬한 리스트로 변환
      const sortedList: SortedUserTime[] = this._sortUsersTime(convertedUserTimes);

      // 중복을 방지하기 위해 Set 사용하여 유일한 날짜를 추출
      const uniqueDates = new Set<Date>();
      sortedList.forEach(user => {
        user.timeList.forEach(entry => {
          uniqueDates.add(entry.date);
        });
      });

      const uniqueDatesList = Array.from(uniqueDates).sort();

      const userNames = sortedList.map(user => user.userName);

      return {
        result: true,
        resultList: sortedList, // 사용자 이름별로 묶인 데이터
        dateList: uniqueDatesList, // 날짜 리스트
        userList: userNames, // 사용자 이름 리스트
        message: "이벤트의 저장된 시간 정보 조회 성공",
      };
    } catch (err) {
      const error = ensureError(err);
      console.log(error.message);
      return { result: false, message: error.message };
    }
  }

  // 사용자 이름별로 시간을 정렬한 리스트로 변환하는 함수
  private static _sortUsersTime(userTimesArray: Array<UserTime>): SortedUserTime[] {
    const usersTimeList: SortedUserTime[] = [];

    userTimesArray.forEach(userTime => {
      const { userName, date, time } = userTime;

      let user = usersTimeList.find(u => u.userName === userName);
      if (!user) {
        // 기존 유저가 없다면 새로운 유저 추가
        user = { userName, timeList: [] };
        usersTimeList.push(user);
      }

      let dateEntry = user.timeList.find(d => d.date === date);
      if (!dateEntry) {
        // 해당 유저의 timeList에서 같은 날짜가 없으면 새로 추가
        dateEntry = { date, time: [] };
        user.timeList.push(dateEntry);
      }

      if (!dateEntry.time.includes(time)) {
        dateEntry.time.push(time);
      }
    });

    usersTimeList.forEach(user => {
      user.timeList.forEach(dateEntry => {
        dateEntry.time.sort((a, b) => a - b); // 시간을 오름차순으로 정렬
      });
    });

    return usersTimeList;
  }
}
