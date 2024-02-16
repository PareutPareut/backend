import { config } from '../config/config.js'
import { Sequelize, DataTypes, Model } from 'sequelize'
import { user } from '../models/user.js'

const db = {} // 실제 데이터베이스가 이 db 객체와 연결됨

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config.options
)

db.sequelize = sequelize // 나중에 연결 객체 재사용을 위해 넣어둠, db객체에 sequelize라는 프로퍼티 추가

db.User = user(Model, sequelize, DataTypes)

/*
여기서 연관관계 설정
 */

export { db } // export 하기
