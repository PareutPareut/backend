import express from 'express'
import { body, validationResult, param } from 'express-validator'
import { wrapper } from '../utils/wrapper.js' // 실제 사용하는 래퍼 모듈 import
import db from '../models/index.js'

export const Router = express.Router()

Router.post(
    '/event',
    validate([
        body('eventName')
            .notEmpty()
            .withMessage('eventName을 제공해야 합니다.'),
    ]),
    wrapper(async (req, res) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        try {
            const eventName = req.body.eventName

            // 데이터베이스에 이벤트 생성
            await db.User.create({ eventName: eventName })
            return res.status(200).send({
                message: '이벤트 생성 성공. EventId: ' + eventId,
            })
        } catch (err) {
            throw err
        }
    })
)
