import express from 'express'
import { body, validationResult, param } from 'express-validator'
import { wrapper } from '../utils/wrapper.js' // 실제 사용하는 래퍼 모듈 import
import db from '../models/index.js'

export const Router = express.Router()

<<<<<<< HEAD
Router.post(
    '/event/:eventId',
    [
        param('eventId').notEmpty().withMessage('eventId를 제공해야 합니다.'),
        body('timeList')
            .isArray({ min: 1 })
            .withMessage('timeList는 최소한 하나의 항목을 가져야 합니다.'),
    ],
=======
eventCreateRouter.post(
    '/',
    validate([
        body('eventName')
            .notEmpty()
            .withMessage('eventName을 제공해야 합니다.'),
        body('dataList').notEmpty().isArray(),
    ]),
>>>>>>> 98e04809fd2278eb69122d23f3c65b53d8bc30c9
    wrapper(async (req, res) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        try {
<<<<<<< HEAD
            const eventId = req.params.eventId
            const timeList = req.body.timeList
=======
            const eventName = req.body.eventName
            const dataList = req.body.dataList
>>>>>>> 98e04809fd2278eb69122d23f3c65b53d8bc30c9

            // 세션에서 현재 로그인된 사용자 정보 가져오기
            const user = req.session.user

<<<<<<< HEAD
            if (!user) {
                return res.status(401).json({ message: '로그인이 필요합니다.' })
            }

            // 사용자의 기존 시간 정보 삭제
            await db.EventTime.destroy({ where: { userId: user.id } })

            // 새로운 시간 정보 추가
            for (const { date, time } of timeList) {
                await db.EventTime.create({
                    eventId: eventId,
                    userId: user.id,
                    date: date,
                    time: time,
=======
            if (createdEvent instanceof db.event) {
                const list = []
                for (const date of dataList) {
                    list.push(date)
                }

                await Promise.all(
                    list.map(async date => {
                        await db.eventDate.create({
                            eventId: createdEvent.eventId,
                            date: date,
                        })
                    })
                )

                return res.status(200).send({
                    message: '이벤트 생성 성공.',
                    eventId: createdEvent.eventId,
                })
            } else if (createdEvent === null) {
                return res.status(404).send({
                    message: '이벤트 생성 실패',
                })
            } else {
                return res.status(500).send({
                    message: '서버 오류',
>>>>>>> 98e04809fd2278eb69122d23f3c65b53d8bc30c9
                })
            }

            return res.status(200).json({
                message: '시간 정보 업데이트 및 추가 성공.',
            })
        } catch (err) {
            throw err
        }
    })
)
