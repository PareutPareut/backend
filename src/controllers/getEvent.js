import express from 'express'
import { param } from 'express-validator'
import { wrapper } from '../utils/wrapper.js'
import db from '../models/index.js'

export const Router = express.Router()

Router.get(
    '/event/:eventId',
    [param('eventId').notEmpty().withMessage('eventId를 제공해야 합니다.')],
    wrapper(async (req, res) => {
        try {
            const eventId = req.params.eventId

            // 사용자별, 날짜별로 그룹화된 타임 리스트 가져오기
            const userTimeList = await db.EventTime.findAll({
                where: { eventId: eventId },
                attributes: ['userId', 'date', 'time'],
                include: [{ model: db.User, attributes: ['userName'] }],
                order: [['date', 'ASC']],
            })

            // 결과를 요청에 맞게 가공
            const userList = []

            userTimeList.forEach(record => {
                const { userId, date, time, User } = record
                const { userName } = User

                // 사용자가 이미 리스트에 존재하는지 확인
                let userObj = userList.find(user => user.userName === userName)

                // 존재하지 않으면 새로운 사용자 객체 생성
                if (!userObj) {
                    userObj = {
                        userName: userName,
                        timeList: [],
                    }
                    userList.push(userObj)
                }

                // 해당 사용자의 날짜와 타임 정보 추가
                userObj.timeList.push({ date: date, time: time })
            })

            // 결과 전송
            const dateList = [
                ...new Set(userTimeList.map(record => record.date)),
            ]
            return res.status(200).json({
                userName: req.session.user.userName, // 현재 로그인된 사용자의 정보
                dateList: dateList,
                userList: userList,
            })
        } catch (err) {
            throw err
        }
    })
)
