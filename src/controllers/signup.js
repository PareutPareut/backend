import express from 'express';
import { wrapper } from '../utils/wrapper.js';
import { db } from '../models/index.js';
import { validate } from '../utils/validate.js';
import { body } from 'express-validator';

export const Router = express.Router();

Router.post(
    '/login/:eventId',
    validate([
        body('userName').notEmpty().withMessage('userName을 제공해야 합니다.'),
        body('password').notEmpty().withMessage('password를 제공해야 합니다.'),
    ]),
    wrapper(async (req, res) => {
        try {
            const eventId = req.params.eventId.split(':')[1];
            const userName = req.body.userName;
            const password = req.body.password;

            console.log(eventId);

            // 데이터베이스에서 사용자가 이미 존재하는지 확인
            const existingUser = await db.user.findOne({
                where: {
                    userName: userName,
                    eventId: eventId,
                },
            });

            console.log(existingUser);

            if (existingUser) {
                // 사용자가 존재하면 비밀번호 일치 여부 확인
                if (existingUser.password === password) {
                    return res.status(200).send({
                        message: '사용자 로그인 성공. Username: ' + userName,
                    });
                } else {
                    return res.status(401).send({
                        message:
                            userName +
                            ' 사용자의 비밀번호가 올바르지 않습니다.',
                    });
                }
            } else {
                // 사용자가 존재하지 않으면 새로운 사용자 생성
                await db.user.create({
                    userName: userName,
                    password: password,
                    eventId: eventId,
                });
                return res.status(200).send({
                    message: '사용자 가입 성공. Username: ' + userName,
                });
            }
        } catch (err) {
            throw err;
        }
    })
);
