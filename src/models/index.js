import { config } from '../config/config.js'
import { Sequelize, DataTypes, Model } from 'sequelize'

import { user } from '../models/user.js'
import { userTime } from './userTime.js'
import { event } from './event.js'
import { eventDate } from './eventDate.js'

const db = {} // 실제 데이터베이스가 이 db 객체와 연결됨

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config.options
)

db.sequelize = sequelize

db.user = user(Model, sequelize, DataTypes)
db.userTime = userTime(Model, sequelize, DataTypes)

db.event = event(Model, sequelize, DataTypes)
db.eventDate = eventDate(Model, sequelize, DataTypes)

//여기서 연관관계 설정

export { db }
