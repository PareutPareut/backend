import 'dotenv/config'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors';
import { sequelizeLoader } from './src/loaders/sequelize.js'

import { signUpRouter } from './src/controllers/signup.js'
import { eventCreateRouter } from './src/controllers/createEvent.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(cors());

app.use('/login', signUpRouter)
app.use('/event', eventCreateRouter)

app.use(morgan('dev'))

await sequelizeLoader()

app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).send({ message: '서버 오류' })
})

app.listen(process.env.SECRET_PORT, () => {
    console.log('서버 실행 완료')
})
