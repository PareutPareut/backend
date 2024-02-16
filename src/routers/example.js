import express from 'express'
import { db } from '/home/by1094/pareut/src/models/index.js'
import { wrapper } from '../utils/wrapper.js'
import { body } from 'express-validator'
import { validate } from '../utils/validate.js'

export const Router = express.Router()

Router.post(
    '/',
    validate([body('name').isEmpty(), body('password').isEmpty()]),
    wrapper(async (req, res) => {
        try {
            const name = req.body.name
            const password = req.body.password
            await db.User.create({ name: name, password: password })
            return res.status(200).send({ massgae: '데이터 생성 완료' })
        } catch (err) {
            throw err
        }
    })
)
