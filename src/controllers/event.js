import express from 'express'
import { wrapper } from '../utils/wrapper.js'
import { db } from '../models/index.js'
import { validate } from '../utils/validate.js'
import { body } from 'express-validator'

export const eventRouter = express.Router()

// 이벤트 생성
eventRouter.post(
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

            console.log(createdEvent.eventId)

            const sortedDates = dataList
                .map(dateString => ({
                    original: dateString,
                    date: new Date(dateString),
                }))
                .sort((a, b) => a.date - b.date)
                .map(item => item.original)

            await Promise.all(
                sortedDates.map(async date => {
                    await db.eventDate.create({
                        eventId: createdEvent.eventId,
                        date: date,
                    })
                })
            )

            // console.log(sortedDates) 정렬된 객체 반환

            if (createdEvent instanceof db.event) {
                return res.status(200).send({
                    message: '이벤트 생성 성공.',
                    eventId: createdEvent.eventId,
                    eventName: eventName,
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

// 로그인 된 사용자의 가능한 시간 저장
eventRouter.post(
    '/:eventId',
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

// 전체 저장된 시간 정보 조회
eventRouter.get(
    '/:eventId',
    wrapper(async (req, res) => {
        try {
            console.log('here')
            const eventId = req.params.eventId
            console.log(eventId, 'eventId')

            // eventDate 테이블에서 날짜 정보 가져오기
            const eventDateList = await db.eventDate.findAll({
                where: { eventId: eventId },
                attributes: ['date'],
                order: [['date', 'ASC']],
            })

            // userTime 테이블에서 사용자별, 날짜별로 그룹화하여 가져오기
            const userTimeList = await db.userTime.findAll({
                where: { eventId: eventId }, //여기서 date를 해야하나?
                attributes: ['userId', 'date', 'time'],
                order: [['date', 'ASC']],
            })

            const userIds = userTimeList.map(user => user.userId)
            //const userIds = userTimeList.map(userId => ({ userId : userId }))

            console.log(123)
            // 중복된 값을 제외한 모든 userName 가져오기 (뭘로? userId를 통해)
            const userIdName = await db.user.findAll({
                where: { userId: userIds },
                attributes: ['userId', 'userName'],
                group: ['userName'],
            })

            let userList = []

            userTimeList.forEach(record => {
                const { userId, date, time } = record

                const userName = userId => {
                    // userIdName에 [{'userId','userName'}...
                    const user = userIdName.find(user => user.userId === userId)
                    return user ? user?.userName : null
                }

                // 사용자가 이미 리스트에 존재하는지 확인
                const userObj = userList.find(
                    user => user?.userName === userName
                )

                // 존재하지 않으면 새로운 사용자 객체 생성
                if (!userObj) {
                    userList.push({
                        userName: userName,
                        timeList: [],
                    })
                }

                // 해당 사용자의 날짜와 타임 정보 추가
                userList
                    .find(user => user?.userName === userName)
                    .timeList.push({ date: date, time: time })
            })

            // 결과 전송
            const dateList = [
                ...new Set(userTimeList.map(record => record.date)),
            ]
            // 사용자 선택 '날짜 및 시간' 배열을 원하는 형식으로 변환
            const formattedUserList = userList.map(user => ({
                userName: user?.userName,
                timeList: user.timeList.map(timeRecord => ({
                    date: timeRecord.date,
                    time: timeRecord.time,
                })),
            }))

            return res.status(200).json({
                LoginName: req.session.user?.userName,
                dateList: eventDateList,
                userList: formattedUserList,
            })
        } catch (err) {
            throw err
        }
    })
)
