import { UserDto } from "../interfaces/user.dto";
import { db } from "../models/index";
import { ensureError } from "../error/ensureError";

// 데이터베이스에서 사용자가 이미 존재하는지 확인
export class SignUpService {
  static async signup(userDto: UserDto) {
    try {
      const user = await db.user.findOrCreate({
        // 사용자가 존재하지 않으면 새로운 사용자 생성
        where: {
          userName: userDto.userName,
          eventId: userDto.eventId,
          password: userDto.password,
        },
      });
      const userInfo = user[0].dataValues;

      return user
        ? {
            result: true,
            sessionData: {
              id: userInfo.userId,
              userName: userInfo.userName,
            },
            message: "유저 로그인 성공", //isNewRecord ? "새로운 유저 로그인 성공" : "기존 유저 로그인 성공",
            //isNewUser : isNewRecord
          }
        : {
            result: false,
            sessionData: null,
            message: "사용자 로그인 실패", //isNewRecord ? "사용자 생성 실패" : "올바르지 않은 비밀번호",
            // isNewUser : isNewRecord
          };
    } catch (err) {
      const error = ensureError(err);
      console.log(error.message);
      return {
        result: false,
        sessionData: null,
        message: error.message,
      };
    }
  }
}
