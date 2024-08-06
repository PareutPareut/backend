import { EventDto, EventTimeDto, EventIdDto } from "../interfaces/event.dto.js";
import { db } from "../models/index.js";
import { ensureError } from "../error/ensureError.js";

// 데이터베이스에서 사용자가 이미 존재하는지 확인
export class EventService {
  static async newEvent(eventDto: EventDto) {
    try {
      const createdEvent = await db.event.create({ eventName: eventDto.eventName });

      console.log(createdEvent.eventId);

      const sortedDates = dataList
        .map(dateString => ({
          original: dateString,
          date: new Date(dateString),
        }))
        .sort((a, b) => a.date - b.date)
        .map(item => item.original);

      await Promise.all(
        sortedDates.map(async date => {
          await db.eventDate.create({
            eventId: createdEvent.eventId,
            date: date,
          });
        })
      );

      // console.log(sortedDates) 정렬된 객체 반환

      if (createdEvent instanceof db.event) {
        return {
          result: true,
          message: "이벤트 생성 성공.",
          eventId: createdEvent.eventId,
          eventName: eventDto.eventName,
        };
      } else if (createdEvent === null) {
        return {
          result: false,
          message: "이벤트 생성 실패",
        };
      } else {
        return {
          result: false,
          message: "서버 오류",
        };
      }
    } catch (err) {
      const error = ensureError(err);
      console.log(error.message);
      return { result: false, message: error.message };
    }
  }

  static async addEventTime(eventTimeDto: EventTimeDto) {
    try {
      const createdUser = await db.user.findOne({
        where: { userName: eventTimeDto.user },
      });

      console.log(createdUser);
      // if (createdUser) {
      // // 사용자의 기존 시간 정보 삭제
      //     await db.userTime.destroy({
      //         where: { userId: createdUser.id },
      //     })
      // }

      const result = await db.userTime.create({
        eventId: eventTimeDto.eventId,
        userId: createdUser.userId,
        date: eventTimeDto.timeList[0],
        time: eventTimeDto.timeList[1],
      });

      if (result) {
        return {
          result: true,
          message: "시간 정보 업데이트 및 추가 성공.",
        };
      } else {
        return {
          result: false,
          message: "시간 정보 업데이트 및 추가 에러.",
        };
      }
    } catch (err) {
      const error = ensureError(err);
      console.log(error.message);
      return { result: false, message: error.message };
    }
  }

  static async getEvent(eventIdDto: EventIdDto) {
    try {
      // eventDate 테이블에서 날짜 정보 가져오기
      const eventDateList = await db.eventDate.findAll({
        where: { eventId: eventIdDto.eventId },
        attributes: ["date"],
        order: [["date", "ASC"]],
      });

      // userTime 테이블에서 사용자별, 날짜별로 그룹화하여 가져오기
      const userTimeList = await db.userTime.findAll({
        where: { eventId: eventIdDto.eventId },
        attributes: ["userId", "date", "time"],
        order: [["date", "ASC"]],
      });

      const userIds = userTimeList.map(user => user.userId);

      // userId를 통해 중복된 값을 제외한 모든 userName 가져오기
      const userIdName = await db.user.findAll({
        where: { userId: userIds },
        attributes: ["userId", "userName"],
        group: ["userName"],
      });

      const userList: Array<any> = [];

      userTimeList.forEach(record => {
        const { userId, date, time } = record;

        const userName = userId => {
          // userIdName에 [{'userId','userName'}...
          const user = userIdName.find(user => user.userId === userId);
          return user ? user?.userName : null;
        };

        // 사용자가 이미 리스트에 존재하는지 확인
        const userObj = userList.find(user => user?.userName === userName);

        // 존재하지 않으면 새로운 사용자 객체 생성
        if (!userObj) {
          userList.push({
            userName: userName,
            timeList: [],
          });
        }

        // 해당 사용자의 날짜와 타임 정보 추가
        userList
          .find(user => user?.userName === userName)
          .timeList.push({ date: date, time: time });
      });

      // 결과 전송
      const dateList = [...new Set(eventDateList.map(record => record.date))].map(date => date);

      console.log(dateList);
      // 사용자 선택 '날짜 및 시간' 배열을 원하는 형식으로 변환
      const formattedUserList = userList.map(user => ({
        loginName: user?.userName,
        timeList: user.timeList.map(timeRecord => ({
          date: timeRecord.date,
          time: timeRecord.time,
        })),
      }));

      return {
        result: true,
        //loginName: req.session.user?.userName,
        dateList: dateList,
        userList: formattedUserList,
        message: "이벤트의 저장된 시간 정보 조회 성공",
      };
    } catch (err) {
      const error = ensureError(err);
      console.log(error.message);
      return { result: false, message: error.message };
    }
  }
}