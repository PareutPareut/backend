import express from 'express'
import { body, validationResult } from 'express-validator'
import { wrapper } from '../utils/wrapper.js'
import db from 'your-db-module'

export const Router = express.Router()

Router.post(
    '/login/:eventId',
    validate([body('userName').isEmpty(), body('password').isEmpty()]),
    wrapper(async (req, res) => {
        try {
            const userName = req.body.userName
            const password = req.body.password

            // 데이터베이스에서 사용자가 이미 존재하는지 확인
            const existingUser = await db.User.findOne({ name: userName })

            if (existingUser) {
                // 사용자가 존재하면 비밀번호 일치 여부 확인
                if (existingUser.password === password) {
                    return res.status(200).send({
                        message: '사용자 로그인 성공. 환영합니다, ' + userName,
                    })
                } else {
                    return res.status(401).send({
                        message:
                            userName +
                            ' 사용자의 비밀번호가 올바르지 않습니다.',
                    })
                }
            } else {
                // 사용자가 존재하지 않으면 새로운 사용자 생성
                await db.User.create({ name: userName, password: password })
                return res.status(200).send({
                    message: '사용자 가입 성공. 환영합니다, ' + userName,
                })
            }
        } catch (err) {
            throw err
        }
    })
)
