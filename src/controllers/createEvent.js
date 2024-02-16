import express from 'express'
import { wrapper } from '../utils/wrapper.js'
import { db } from '../models/index.js'
import { validate } from '../utils/validate.js'
import { body } from 'express-validator'

export const eventCreateRouter = express.Router()

eventCreateRouter.post(
    '/',
    validate([
        body('eventName')
            .notEmpty()
            .withMessage('eventName을 제공해야 합니다.'),
        body('dataList').notEmpty().isArray(),
    ]),
    wrapper(async (req, res) => {
        try {
            const eventName = req.body.eventName
            const dataList = req.body.dataList

            const createdEvent = await db.event.create({ eventName: eventName })

            const sortedDates = dataList.map(dateString => new Date(dateString)).sort((a, b) => b - a);

            // 정렬된 Date 객체를 다시 문자열로 변환하여 list에 넣음
            const list = sortedDates.map(date => date.toISOString().split('T')[0]);

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

                console.log(list)

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
                })
            }
        } catch (err) {
            throw err
        }
    })
)