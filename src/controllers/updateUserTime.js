import express from 'express'
import { body } from 'express-validator'
import { wrapper } from '../utils/wrapper.js'
import { db } from '../models/index.js'
import { validate } from '../utils/validate.js'

export const updateEventRouter = express.Router()

updateEventRouter.post(
    '/',
    validate([body('timeList').notEmpty().isArray()]),
    wrapper(async (req, res) => {
        try {
            const eventId = req.params.eventId.split(':')[1]
            const timeList = req.body.timeList // ['date, 'time']

            // 세션에서 현재 로그인된 사용자 정보 가져오기
            const user = req.session.user

            if (!user) {
                return res.status(401).json({ message: '로그인이 필요합니다.' })
            }

            // 사용자의 기존 시간 정보 삭제
            const deletedRowNum = await db.userTime.destroy({
                where: { userId: user.id },
            })

            if (deletedRowNum > 0) {
                //deletedRowNum는 삭제된 열의 개수
                await db.userTime.create({
                    eventId: eventId,
                    userId: user.id,
                    date: timeList[0],
                    time: timeList[1],
                })

                console.log('timeList[0] : ', timeList[0])
                return res.status(200).json({
                    message: '시간 정보 업데이트 및 추가 성공.',
                })
            } else {
                return res.status(500).json({ message: '삭제 실패' })
            }
        } catch (err) {
            throw err
        }
    })
)
