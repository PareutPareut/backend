import { UserDto } from "../interfaces/user.dto";
import { db } from "../models/index.js";
import { ensureError } from "../error/ensureError";

// 데이터베이스에서 사용자가 이미 존재하는지 확인
export class SignUpService {
  static async signup(userDto: UserDto) {
    try {
      const existingUser = await db.user.findOne({
        where: {
          userName: userDto.userName,
          eventId: userDto.eventId,
        },
      });

      console.log(existingUser);

      if (!existingUser) {
        // 사용자가 존재하지 않으면 새로운 사용자 생성
        const createdUser = await db.user.create({
          userName: userDto.userName,
          password: userDto.password,
          eventId: userDto.eventId,
        });

        return createdUser
          ? {
              result: true,
              sessionData: {
                id: createdUser.userId,
                userName: createdUser.userName,
              },
              message: "로그인 성공",
            }
          : {
              result: false,
              sessionData: null,
              message: "사용자 생성 실패",
            };
      }

      // 사용자가 존재하면 비밀번호 일치 여부 확인
      return existingUser.password === userDto.password
        ? {
            result: true,
            sessionData: {
              id: existingUser.userId,
              userName: existingUser.userName,
            },
            message: "로그인 성공",
          }
        : {
            result: false,
            sessionData: null,
            message: "사용자의 비밀번호가 올바르지 않습니다.",
          };
    } catch (err) {
      const error = ensureError(err);
      console.log(error.message);
      return { result: false, message: error.message };
    }
  }
}
