import 'dotenv/config'
import express from 'express'
import morgan from 'morgan'
import { sequelizeLoader } from './src/loaders/sequelize.js'

import { Router } from './src/controllers/signup.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/', Router)
app.use(morgan('dev'))

await sequelizeLoader()

app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).send({ message: '서버 오류' })
})

app.listen(process.env.SECRET_PORT, () => {
    console.log('서버 실행 완료')
})
